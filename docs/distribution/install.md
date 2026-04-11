---
title: Flux Distribution Installation
description: FluxCD Enterprise installation guide
---

# Flux Distribution Installation

ControlPlane offers a seamless transition from CNCF Flux to the enterprise distribution with no
impact to Flux availability. The hardened container images provided by ControlPlane are fully
compatible with the upstream Flux installation.

## Flux Operator

The ControlPlane distribution includes the [Flux Operator](https://fluxoperator.dev),
which provides a declarative API for the lifecycle management of the Flux controllers, including
automated CVE patching and upgrades.

The operator offers an alternative to the Flux CLI bootstrap, with the option to configure the
reconciliation of the cluster state from OCI artifacts or S3-compatible storage, besides Git repositories.
One of the key features is the ability bootstrap clusters without requiring write access to Git,
which is a common requirement for enterprise customers.

After [installing](https://fluxoperator.dev/docs/guides/install/) the Flux Operator with Helm, Terraform or OLM,
customers can create a [FluxInstance](https://fluxoperator.dev/docs/crd/fluxinstance/)
to deploy the enterprise distribution of Flux:

```yaml
apiVersion: fluxcd.controlplane.io/v1
kind: FluxInstance
metadata:
  name: flux
  namespace: flux-system
spec:
  distribution:
    version: "2.8.x"
    artifact: "oci://ghcr.io/controlplaneio-fluxcd/flux-operator-manifests"
    registry: "ghcr.io/controlplaneio-fluxcd/distroless"
    imagePullSecret: "flux-enterprise-auth"
  cluster:
    type: kubernetes
    multitenant: true
    networkPolicy: true
```

To access the ControlPlane registry, the `flux-enterprise-auth` Kubernetes secret must be
created in the `flux-system` namespace and should contain the credentials to pull the enterprise images:

```shell
echo $ENTERPRISE_TOKEN | flux-operator create secret registry flux-enterprise-auth \
  --namespace flux-system \
  --server=ghcr.io \
  --username=flux \
  --password-stdin
```

For more information on configuring the cluster sync from various sources and the reconciliation options,
see the [Flux Cluster Sync documentation](https://fluxoperator.dev/docs/instance/sync/).

### Air-Gapped Installation

On air-gapped environments, customers can mirror the ControlPlane distribution
(controller images, Flux Operator image and Helm chart) to a private registry using
the Flux Operator CLI:

```shell
echo $ENTERPRISE_TOKEN | flux-operator distro mirror registry.example.com/fluxcd \
  --version=2.8.x \
  --variant=enterprise-distroless \
  --pull-token-stdin
```

To preview which images will be mirrored without writing to the destination registry,
use the `--dry-run` flag. To verify the provenance of the mirrored images,
use the `--verify` flag to check the signatures of the source images
in the ControlPlane registry with Cosign before copying.

Once the distribution is mirrored, point the [FluxInstance](https://fluxoperator.dev/docs/crd/fluxinstance/)
to the private registry:

```yaml
apiVersion: fluxcd.controlplane.io/v1
kind: FluxInstance
metadata:
  name: flux
  namespace: flux-system
spec:
  distribution:
    version: "2.8.x"
    registry: "registry.example.com/fluxcd"
    variant: "enterprise-distroless"
  cluster:
    type: kubernetes
    multitenant: true
    networkPolicy: true
```

When running in an air-gapped environment, the `.spec.distribution.artifact` field must be
omitted and the `spec.distribution.variant` field must be set to a distribution variant
(e.g., `enterprise-distroless` or `enterprise-alpine`) to ensure the operator uses the
correct image digests from the private registry.

### Air-Gapped Automated Updates

The `flux-operator distro mirror` command should be run on a regular basis to keep the mirrored
distribution up-to-date with the latest security patches and updates from ControlPlane.

The upgrade process for air-gapped environments requires for Flux Operator to be updated first,
then the distribution minor version can be bumped in the `FluxInstance` to trigger
the update of the Flux controllers.

To automate the update of patch releases and CVE fixes, customers can leverage
the [ResourceSet](https://fluxoperator.dev/docs/crd/resourceset/) APIs.

In the Git repository synced by Flux, define a ResourceSet that points to the private registry:

```yaml
apiVersion: fluxcd.controlplane.io/v1
kind: ResourceSet
metadata:
  name: flux-operator
  namespace: flux-system
spec:
  inputs:
    - interval: "1h"
      version: "*"
      registry: "registry.example.com/fluxcd"
  resources:
   - apiVersion: source.toolkit.fluxcd.io/v1
     kind: OCIRepository
     metadata:
      name: << inputs.provider.name >>
      namespace: << inputs.provider.namespace >>
     spec:
      interval: << inputs.interval | quote >>
      url: oci://<< inputs.registry >>/charts/flux-operator
      layerSelector:
        mediaType: "application/vnd.cncf.helm.chart.content.v1.tar+gzip"
        operation: copy
      ref:
        semver: << inputs.version | quote >>
   - apiVersion: helm.toolkit.fluxcd.io/v2
     kind: HelmRelease
     metadata:
        name: << inputs.provider.name >>
        namespace: << inputs.provider.namespace >>
     spec:
      interval: 12h
      releaseName: << inputs.provider.name >>
      serviceAccountName: << inputs.provider.name >>
      upgrade:
        strategy:
          name: RetryOnFailure
      chartRef:
        kind: OCIRepository
        name: << inputs.provider.name >>
```

The above configuration will scan the private registry for new versions of the Flux Operator chart every hour,
and automatically upgrade the operator to the latest version available in the registry.
Once the operator is updated, it will reconcile the FluxInstance and update the Flux controllers to the latest
patch version of the enterprise distribution.

## Flux Bootstrap

Customers can bootstrap Flux with the enterprise distribution using the Flux CLI or the Flux Terraform provider.
To access the ControlPlane images, customers need to provide the registry address and their
credentials.

Example of Flux CLI bootstrap with the distroless images:

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

> It is recommended to migrate from Flux CLI bootstrap to the Flux Operator to take
> advantage of the enterprise distribution features, such as automated CVE patching and upgrades.
> For more information, see the [Flux Operator migration guide](https://fluxoperator.dev/docs/guides/migration/).

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

> It is recommended to migrate from Flux TF provider to the Flux Operator TF module.
> For more information, see the [Flux Operator Terraform migration guide](https://github.com/controlplaneio-fluxcd/terraform-kubernetes-flux-operator-bootstrap/blob/main/docs/migration-from-flux-provider.md).

### Automated Updates to Bootstrap Repositories

For keeping the Flux controllers images digests
and manifests up-to-date with the latest version of the Enterprise Distribution, ControlPlane
provides Kustomize images patches for the Flux manifests, which can be found in the
[distribution repository](https://github.com/controlplaneio-fluxcd/distribution/tree/main/images).

Customers using GitHub can leverage the ControlPlane GitHub Actions to automate the
update of the Flux manifests in their bootstrap repositories. For more information, see the
[Update Flux GitHub Action](https://github.com/controlplaneio-fluxcd/distribution/tree/main/actions/update/README.md) documentation.

For customers using other Git providers, ControlPlane provides support for configuring
automated updates for the Flux enterprise distribution.
