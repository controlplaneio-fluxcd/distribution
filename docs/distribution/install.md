---
title: Flux Distribution Installation
description: FluxCD Enterprise installation and upgrade guide
---

# Flux Distribution Installation

ControlPlane offers a seamless transition from CNCF Flux to the enterprise distribution with no
impact to Flux availability. The hardened container images provided by ControlPlane are fully
compatible with the upstream Flux installation and bootstrap procedure.

## Flux Bootstrap

Customers can bootstrap Flux with the enterprise distribution using the Flux CLI or the Flux Terraform provider.
To access the ControlPlane images, customers need to provide the registry address and their
credentials.

Example of Flux CLI bootstrap with the FIPS-compliant images:

```bash
flux bootstrap github \
  --owner=customer-org \
  --repository=customer-repo \
  --branch=main \
  --path=clusters/production \
  --image-pull-secret=flux-enterprise-auth \
  --registry-creds=flux:$ENTERPRISE_TOKEN \
  --registry=ghcr.io/controlplaneio-fluxcd/distroless
```

Example of Flux Terraform Provider bootstrap with the mainline images:

```hcl
resource "flux_bootstrap_git" "this" {
  embedded_manifests   = true
  path                 = "clusters/my-cluster"
  image_pull_secret    = "flux-enterprise-auth"
  registry_credentials = "flux:${var.enterprise_token}"
  registry             = "ghcr.io/controlplaneio-fluxcd/alpine"
}
```

Running the bootstrap command for a cluster with an existing Flux installation will trigger
an in-place upgrade of the Flux controllers to the ControlPlane distribution.

## Automated Updates to Bootstrap Repositories

For keeping the Flux controllers images digests
and manifests up-to-date with the latest version of the Enterprise Distribution, ControlPlane
provides Kustomize images patches for the Flux manifests, which can be found in the
[distribution repository](https://github.com/controlplaneio-fluxcd/distribution/tree/main/images).

Customers using GitHub can leverage the ControlPlane GitHub Actions to automate the
update of the Flux manifests in their bootstrap repositories. For more information, see the
[Update Flux GitHub Action](https://github.com/controlplaneio-fluxcd/distribution/tree/main/actions/update/README.md) documentation.

For customers using other Git providers, ControlPlane provides support for configuring
automated updates for the Flux enterprise distribution.

## Migration to ControlPlane Distribution

Migration to the ControlPlane distribution is straightforward and requires minimal changes to the
existing tooling used for deploying the Flux controllers. Having access to the ControlPlane
registry, you can start using the enterprise distribution by changing the container image references
from `ghcr.io/fluxcd/<controller-name>` to `<control-plane-registry>/<controller-name>`.

On air-gapped environments, customers can copy the ControlPlane container images and the
OCI artifacts (SBOMs and signatures) to their private registry using
the [crane](https://github.com/google/go-containerregistry/blob/main/cmd/crane/README.md) CLI.

Example script for copying the ControlPlane FIPS-compliant images to a private registry:

```bash
FLUX_CONTROLLERS=(
"source-controller"
"kustomize-controller"
"helm-controller"
"notification-controller"
"image-reflector-controller"
"image-automation-controller"
)

crane auth login ghcr.io -u flux -p $ENTERPRISE_TOKEN

for controller in "${FLUX_CONTROLLERS[@]}"; do
 crane copy --all-tags ghcr.io/controlplaneio-fluxcd/distroless/$controller  <your-registry>/$controller
done
```

## Flux Operator

The ControlPlane distribution includes the [Flux Operator](../operator/index.md),
which provides a declarative API for the lifecycle management of the Flux controllers, including
automated CVE patching and upgrades.

The operator offers an alternative to bootstrap, with the option to configure the
reconciliation of the cluster state from OCI artifacts or S3-compatible storage, besides Git repositories.

To deploy the enterprise distribution of Flux, point the operator to the ControlPlane registry:

```yaml
apiVersion: fluxcd.controlplane.io/v1
kind: FluxInstance
metadata:
  name: flux
  namespace: flux-system
spec:
  distribution:
    version: "2.7.x"
    registry: "ghcr.io/controlplaneio-fluxcd/distroless"
    imagePullSecret: "flux-enterprise-auth"
  cluster:
    type: kubernetes
    domain: "cluster.local"
    multitenant: true
    networkPolicy: true
```

To access the ControlPlane registry, the `flux-enterprise-auth` Kubernetes secret must be
created in the `flux-system` namespace and should contain the credentials to pull the enterprise images:

```shell
kubectl create secret docker-registry flux-enterprise-auth \
  --namespace flux-system \
  --docker-server=ghcr.io \
  --docker-username=flux \
  --docker-password=$ENTERPRISE_TOKEN
```

For more information, see the Flux Operator [documentation](../operator/index.md).
