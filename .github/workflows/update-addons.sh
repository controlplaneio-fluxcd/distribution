#!/usr/bin/env bash
#
# Resolve and write chart + image pins for one addon at one
# addon-version. Called by .github/workflows/update-addons.yaml.
#
# Required env:
#   ADDON           - addon name (dex, mcp). Drives the per-addon artifact table.
#   IMAGE_REGISTRY  - ghcr.io/controlplaneio-fluxcd
#   CHART_REGISTRY  - ghcr.io/controlplaneio-fluxcd/charts
# Optional env (auto-discovered when empty):
#   ADDON_VERSION   - the addon's release tag (e.g. v2.45.1 for dex).
#                     Empty = highest semver tag published on the addon's
#                     image repo in our registry (the source of truth for
#                     what we have actually shipped).
#   CHART_VERSION   - the helm chart version (e.g. 0.24.0 for dex).
#                     Empty = latest tag pulled by `helm pull`.
#
# Writes:
#   addons/<addon>/charts/<chart-version>/enterprise.yaml
#   addons/<addon>/images/<addon-version>/<image-file> (one per image flavor)

set -eoux pipefail

ADDON="${ADDON}"
IMAGE_REGISTRY="${IMAGE_REGISTRY}"
CHART_REGISTRY="${CHART_REGISTRY}"

# Per-addon artifact table. Future addons extend these case statements.
#
#   CHART_NAME         - chart repo name under CHART_REGISTRY
#   IMAGE_REPOS        - image repo paths under IMAGE_REGISTRY, one per flavor
#   IMAGE_TAG_SUFFIXES - tag suffix appended to ADDON_VERSION, one per flavor
#   IMAGE_FILES        - pin file name under images/<version>/, one per flavor
case "$ADDON" in
  dex)
    CHART_NAME=dex
    IMAGE_REPOS=( "distroless-fips/dex" )
    IMAGE_TAG_SUFFIXES=( "" )
    IMAGE_FILES=( "enterprise-distroless-fips.yaml" )
    ;;
  mcp)
    CHART_NAME=flux-mcp-enterprise
    IMAGE_REPOS=( "flux-mcp-enterprise" "flux-mcp-enterprise" )
    IMAGE_TAG_SUFFIXES=( "" "-stdio-readonly" )
    IMAGE_FILES=( "enterprise-http.yaml" "enterprise-stdio-readonly.yaml" )
    ;;
  *)
    echo "unknown addon: $ADDON" >&2
    exit 1
    ;;
esac

CHART_REPO="${CHART_REGISTRY}/${CHART_NAME}"

# Default ADDON_VERSION to the highest bare-semver tag (vX.Y.Z) published
# on the addon's primary image repo. Flavor-suffixed tags (e.g.
# v0.1.0-stdio-readonly) are excluded by the filter.
if [ -z "${ADDON_VERSION:-}" ]; then
  ADDON_VERSION="$(skopeo list-tags "docker://${IMAGE_REGISTRY}/${IMAGE_REPOS[0]}" \
    | jq -r '.Tags[]' \
    | grep -E '^v[0-9]+\.[0-9]+\.[0-9]+$' \
    | sort -V | tail -n1)"
  [ -n "$ADDON_VERSION" ] || { echo "no semver tags found for ${IMAGE_REPOS[0]}" >&2; exit 1; }
fi

ROOT_DIR="$(git rev-parse --show-toplevel)"
IMAGES_DIR="${ROOT_DIR}/addons/${ADDON}/images/${ADDON_VERSION}"

# ---- chart pin -------------------------------------------------------------
# Runs `helm pull` to extract the chart version and digest.
CHART_TMP="$(mktemp -d)"
trap 'rm -rf "$CHART_TMP"' EXIT
HELM_PULL_ARGS=( "oci://${CHART_REPO}" --destination "$CHART_TMP" )
[ -n "${CHART_VERSION:-}" ] && HELM_PULL_ARGS+=( --version "$CHART_VERSION" )
HELM_OUT="$(helm pull "${HELM_PULL_ARGS[@]}" 2>&1)"
echo "$HELM_OUT"
# "Pulled: ghcr.io/.../dex:0.24.0"  →  0.24.0
CHART_VERSION="$(echo "$HELM_OUT" | awk -F: '/^Pulled:/ {print $NF}')"
# "Digest: sha256:0b5f3..."         →  sha256:0b5f3...
CHART_DIGEST="$(echo "$HELM_OUT" | awk '/^Digest:/ {print $2}')"

CHART_DIR="${ROOT_DIR}/addons/${ADDON}/charts/${CHART_VERSION}"
mkdir -p "$CHART_DIR" "$IMAGES_DIR"

# Generate OCIRepository patch
cat >"${CHART_DIR}/enterprise.yaml" <<EOF
apiVersion: source.toolkit.fluxcd.io/v1
kind: OCIRepository
metadata:
  name: ${ADDON}
spec:
  url: oci://${CHART_REPO}
  ref:
    tag: ${CHART_VERSION}
    digest: ${CHART_DIGEST}
EOF

# ---- image pins ------------------------------------------------------------
# Same approach as the flux update-images workflow, once per image flavor.
for i in "${!IMAGE_REPOS[@]}"; do
  IMAGE_REPO="${IMAGE_REGISTRY}/${IMAGE_REPOS[$i]}"
  IMAGE_TAG="${ADDON_VERSION}${IMAGE_TAG_SUFFIXES[$i]}"
  IMAGE_DIGEST="$(docker buildx imagetools inspect "${IMAGE_REPO}:${IMAGE_TAG}" --format '{{json .}}' | jq -r .manifest.digest)"

  cat >"${IMAGES_DIR}/${IMAGE_FILES[$i]}" <<EOF
images:
  - name: ${IMAGE_REPO}
    newTag: ${IMAGE_TAG}
    digest: ${IMAGE_DIGEST}
EOF
done

# Re-export resolved versions for the calling workflow.
if [ -n "${GITHUB_OUTPUT:-}" ]; then
  {
    echo "addon_version=${ADDON_VERSION}"
    echo "chart_version=${CHART_VERSION}"
  } >> "$GITHUB_OUTPUT"
fi
