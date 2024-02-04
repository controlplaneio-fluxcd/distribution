#!/usr/bin/env bash

set -eoux pipefail

DISTRIBUTION="${DISTRIBUTION}"
REGISTRY="${REGISTRY}"
VARIANT="${VARIANT}"
VERSION="${VERSION}"

ROOT_DIR="$(git rev-parse --show-toplevel)"
WORK_DIR="${ROOT_DIR}/images/${VERSION}"

mkdir -p "${WORK_DIR}"

cd "${WORK_DIR}"

FLUX_IMAGES="${DISTRIBUTION}-${VARIANT}.yaml"

FLUX_REGISTRY="${REGISTRY}/${VARIANT}"
if [ "${DISTRIBUTION}" == "upstream" ]; then
  FLUX_REGISTRY="${REGISTRY}"
fi

flux install --version ${VERSION} \
--registry=${FLUX_REGISTRY} \
--components-extra=image-reflector-controller,image-automation-controller \
--export | grep 'ghcr.io/' | awk '{print $2}' > "${FLUX_IMAGES}"


sc=$(awk 'NR==1{print $1}' "${FLUX_IMAGES}")
sc_digest=$(docker buildx imagetools inspect ${sc}  --format '{{json .}}' | jq -r .manifest.digest)
kc=$(awk 'NR==2{print $1}' "${FLUX_IMAGES}")
kc_digest=$(docker buildx imagetools inspect ${kc}  --format '{{json .}}' | jq -r .manifest.digest)
hc=$(awk 'NR==3{print $1}' "${FLUX_IMAGES}")
hc_digest=$(docker buildx imagetools inspect ${hc}  --format '{{json .}}' | jq -r .manifest.digest)
nc=$(awk 'NR==4{print $1}' "${FLUX_IMAGES}")
nc_digest=$(docker buildx imagetools inspect ${nc}  --format '{{json .}}' | jq -r .manifest.digest)
irc=$(awk 'NR==5{print $1}' "${FLUX_IMAGES}")
irc_digest=$(docker buildx imagetools inspect ${irc}  --format '{{json .}}' | jq -r .manifest.digest)
iac=$(awk 'NR==6{print $1}' "${FLUX_IMAGES}")
iac_digest=$(docker buildx imagetools inspect ${iac}  --format '{{json .}}' | jq -r .manifest.digest)

cat >${FLUX_IMAGES} <<EOF
images:
  - name: ${FLUX_REGISTRY}/source-controller
    newTag: ${sc#*:}
    digest: ${sc_digest}
  - name: ${FLUX_REGISTRY}/kustomize-controller
    newTag: ${kc#*:}
    digest: ${kc_digest}
  - name: ${FLUX_REGISTRY}/helm-controller
    newTag: ${hc#*:}
    digest: ${hc_digest}
  - name: ${FLUX_REGISTRY}/notification-controller
    newTag: ${nc#*:}
    digest: ${nc_digest}
  - name: ${FLUX_REGISTRY}/image-reflector-controller
    newTag: ${irc#*:}
    digest: ${irc_digest}
  - name: ${FLUX_REGISTRY}/image-automation-controller
    newTag: ${iac#*:}
    digest: ${iac_digest}
EOF
