---
title: Dex IdP Addon
description: Single Sign-On provider for Flux Enterprise
---

# Dex IdP

Flux enterprise comes with a hardened [Dex](https://dexidp.io/) distribution that can be used
to configure Single Sign-On (SSO) for the Flux Web UI and the Flux MCP Server.

The Dex Helm charts and the hardened container images are published at:

- `ghcr.io/controlplaneio-fluxcd/charts/dex`
- `ghcr.io/controlplaneio-fluxcd/distroless-fips/dex`

> [!tip] Dex latest version
>
> The Dex chart version, container image tag and digest should be kept up to date
> with the latest release published at [controlplaneio-fluxcd/distribution/addons/dex](https://github.com/controlplaneio-fluxcd/distribution/tree/main/addons/dex).

The Helm charts are built from the upstream Dex [chart repository](https://github.com/dexidp/helm-charts).

The Dex binaries packaged in the multi-arch container images are built from
the upstream Dex [source repository](https://github.com/dexidp/dex)
and are subject to ControlPlane's SLA for CVE remediation and FIPS compliance.

The build, release and provenance of the ControlPlane's Dex distribution supply chain meet
[SLSA Build Level 3](https://slsa.dev/spec/v1.0/levels).
For more information on how to verify the provenance of ControlPlane's container images,
see the [Supply Chain Security documentation](https://github.com/controlplaneio/dex/blob/main/docs/provenance.md).

## Registry Access 

To access the Dex artifacts from the ControlPlane registry, you can reuse the
Flux enterprise distribution [image pull secret](../distribution/install.md).

To create the `flux-enterprise-auth` Kubernetes secret in a different namespace e.g. `flux-addons`:

```shell
echo $ENTERPRISE_TOKEN | flux-operator create secret registry flux-enterprise-auth \
  --namespace flux-addons \
  --server=ghcr.io \
  --username=flux \
  --password-stdin
```

## Configuration Example

Pulling the Dex Helm chart from the ControlPlane registry using Flux OCIRepository:

```yaml
apiVersion: source.toolkit.fluxcd.io/v1
kind: OCIRepository
metadata:
  name: dex
  namespace: flux-addons
spec:
  interval: 24h
  url: oci://ghcr.io/controlplaneio-fluxcd/charts/dex
  ref:
    tag: 0.24.0
  secretRef:
    name: flux-enterprise-auth
```

Pulling the Dex hardened image from the ControlPlane registry using Flux HelmRelease:

```yaml
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: dex
  namespace: flux-addons
spec:
  interval: 24h
  releaseName: dex
  chartRef:
    kind: OCIRepository
    name: dex
  values:
    image:
      repository: ghcr.io/controlplaneio-fluxcd/distroless-fips/dex
      tag: v2.45.1
      digest: sha256:308a91c813f135a185f7b54654d295405109ab9e11525abc7350c8614569e519
    imagePullSecrets:
      - name: flux-enterprise-auth
```

For a complete example on how to configure Dex for Single Sign-On with Flux Operator,
please see the [Flux Web UI SSO with Dex documentation](https://fluxoperator.dev/docs/web-ui/sso-dex/).
