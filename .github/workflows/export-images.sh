#!/usr/bin/env bash

set -eoux pipefail

REGISTRY="${REGISTRY}"
VERSION="${VERSION}"

ROOT_DIR="$(git rev-parse --show-toplevel)"
WORK_DIR="${ROOT_DIR}/workspace"

mkdir -p "${WORK_DIR}"

cd "${WORK_DIR}"

FLUX_IMAGES="${VERSION}.txt"

flux install --version ${VERSION} \
--registry=${REGISTRY} \
--components-extra=image-reflector-controller,image-automation-controller \
--export | grep 'ghcr.io/' | awk '{print $2}' > "${FLUX_IMAGES}"

sc=$(awk 'NR==1{print $1}' "${FLUX_IMAGES}")
kc=$(awk 'NR==2{print $1}' "${FLUX_IMAGES}")
hc=$(awk 'NR==3{print $1}' "${FLUX_IMAGES}")
nc=$(awk 'NR==4{print $1}' "${FLUX_IMAGES}")
irc=$(awk 'NR==5{print $1}' "${FLUX_IMAGES}")
iac=$(awk 'NR==6{print $1}' "${FLUX_IMAGES}")

echo "sc=${sc}" >> $GITHUB_OUTPUT
echo "kc=${kc}" >> $GITHUB_OUTPUT
echo "hc=${hc}" >> $GITHUB_OUTPUT
echo "nc=${nc}" >> $GITHUB_OUTPUT
echo "irc=${irc}" >> $GITHUB_OUTPUT
echo "iac=${iac}" >> $GITHUB_OUTPUT
