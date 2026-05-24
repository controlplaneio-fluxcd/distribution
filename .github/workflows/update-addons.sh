#!/usr/bin/env bash
#
# Resolve and write chart + image pins for one addon at one
# addon-version. Called by .github/workflows/update-addons.yaml.
#
# Required env:
#   ADDON           - addon name (today: dex). Drives variant + upstream lookup.
#   IMAGE_REGISTRY  - ghcr.io/controlplaneio-fluxcd
#   CHART_REGISTRY  - ghcr.io/controlplaneio-fluxcd/charts
#   GITHUB_TOKEN    - for `gh release view` on the upstream addon repo
# Optional env (auto-discovered when empty):
#   ADDON_VERSION   - the addon's release tag (e.g. v2.45.1).
#                     Empty = latest release of the upstream addon repo.
#   CHART_VERSION   - the helm chart version (e.g. 0.24.0).
#                     Empty = latest tag pulled by `helm pull`.
#
# Writes:
#   addons/<addon>/charts/<chart-version>/enterprise.yaml
#   addons/<addon>/images/<addon-version>/enterprise-<variant>.yaml

set -eoux pipefail

ADDON="${ADDON}"
IMAGE_REGISTRY="${IMAGE_REGISTRY}"
CHART_REGISTRY="${CHART_REGISTRY}"

# Per-addon variant + upstream repo. Future addons extend these case statements.
case "$ADDON" in
  dex)
    IMAGE_VARIANT=distroless-fips
    UPSTREAM_REPO=dexidp/dex
    ;;
  *)
    echo "unknown addon: $ADDON" >&2
    exit 1
    ;;
esac

CHART_REPO="${CHART_REGISTRY}/${ADDON}"
IMAGE_REPO="${IMAGE_REGISTRY}/${IMAGE_VARIANT}/${ADDON}"

# Default ADDON_VERSION to the latest upstream release tag (same pattern as
# the flux update-images workflow uses `gh release view`).
if [ -z "${ADDON_VERSION:-}" ]; then
  ADDON_VERSION="$(gh release view --repo "$UPSTREAM_REPO" --json tagName -q .tagName)"
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

# ---- image pin -------------------------------------------------------------
# Same approach as the flux update-images workflow.
IMAGE_DIGEST="$(docker buildx imagetools inspect "${IMAGE_REPO}:${ADDON_VERSION}" --format '{{json .}}' | jq -r .manifest.digest)"

cat >"${IMAGES_DIR}/enterprise-${IMAGE_VARIANT}.yaml" <<EOF
images:
  - name: ${IMAGE_REPO}
    newTag: ${ADDON_VERSION}
    digest: ${IMAGE_DIGEST}
EOF

# Re-export resolved versions for the calling workflow.
if [ -n "${GITHUB_OUTPUT:-}" ]; then
  {
    echo "addon_version=${ADDON_VERSION}"
    echo "chart_version=${CHART_VERSION}"
  } >> "$GITHUB_OUTPUT"
fi
