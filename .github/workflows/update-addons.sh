#!/usr/bin/env bash
#
# Resolve and write chart + image pins for one addon at one
# addon-version. Called by .github/workflows/update-addons.yaml.
#
# Required env:
#   ADDON           - addon name (today: dex). Drives variant lookup.
#   ADDON_VERSION   - the addon's release tag (e.g. v2.45.1).
#   IMAGE_REGISTRY  - ghcr.io/controlplaneio-fluxcd
#   CHART_REGISTRY  - ghcr.io/controlplaneio-fluxcd/charts
#
# Writes:
#   addons/<addon>/charts/<addon>.yaml             (latest chart from mirror)
#   addons/<addon>/images/<addon-version>/enterprise-<variant>.yaml

set -eoux pipefail

ADDON="${ADDON}"
ADDON_VERSION="${ADDON_VERSION}"
IMAGE_REGISTRY="${IMAGE_REGISTRY}"
CHART_REGISTRY="${CHART_REGISTRY}"

# Per-addon variant. Today only dex (distroless-fips); future addons
# extend this case statement.
case "$ADDON" in
  dex)
    IMAGE_VARIANT=distroless-fips
    ;;
  *)
    echo "unknown addon: $ADDON" >&2
    exit 1
    ;;
esac

ROOT_DIR="$(git rev-parse --show-toplevel)"
CHART_DIR="${ROOT_DIR}/addons/${ADDON}/charts"
IMAGES_DIR="${ROOT_DIR}/addons/${ADDON}/images/${ADDON_VERSION}"
mkdir -p "$CHART_DIR" "$IMAGES_DIR"

# ---- chart pin -------------------------------------------------------------
# Pick the highest semver tag in the mirror as "latest", then resolve
# its digest. Helm OCI charts are stored as plain OCI artifacts, so
# crane reads them.
CHART_REPO="${CHART_REGISTRY}/${ADDON}"
CHART_VERSION="$(crane ls "$CHART_REPO" | grep -E '^[0-9]+\.[0-9]+\.[0-9]+$' | sort -V | tail -1)"
CHART_DIGEST="$(crane digest "${CHART_REPO}:${CHART_VERSION}")"

cat >"${CHART_DIR}/${ADDON}.yaml" <<EOF
chart:
  name: ${CHART_REPO}
  version: ${CHART_VERSION}
  digest: ${CHART_DIGEST}
EOF

# ---- image pin -------------------------------------------------------------
IMAGE_REPO="${IMAGE_REGISTRY}/${IMAGE_VARIANT}/${ADDON}"
IMAGE_DIGEST="$(crane digest "${IMAGE_REPO}:${ADDON_VERSION}")"

cat >"${IMAGES_DIR}/enterprise-${IMAGE_VARIANT}.yaml" <<EOF
images:
  - name: ${IMAGE_REPO}
    newTag: ${ADDON_VERSION}
    digest: ${IMAGE_DIGEST}
EOF
