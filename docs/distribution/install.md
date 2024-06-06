# Flux Distribution Installation

ControlPlane offers a seamless transition from CNCF Flux to the enterprise distribution with no
impact to Flux availability. The hardened container images provided by ControlPlane are fully
compatible with the upstream Flux installation and bootstrap procedure.

## Bootstrap

Customers can bootstrap Flux with the enterprise distribution using the Flux CLI or the Flux Terraform provider.
To access the ControlPlane registry, customers need to provide their credentials using the
`--registry-creds` flag.

Example of bootstrapping Flux with the FIPS-compliant distribution:

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

## Flux Operator

The ControlPlane distribution includes the [Flux Operator](https://github.com/controlplaneio-fluxcd/flux-operator),
which provides a declarative API for the installation and upgrade of the Flux controllers. The operator
automates the patching of hotfixes and CVEs affecting the Flux container images.

For more information, see the Flux Operator [documentation](../operator/introduction.md).
