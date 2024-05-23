# Enterprise Distribution for Flux CD

[![release](https://img.shields.io/github/release/controlplaneio-fluxcd/distribution/all.svg)](https://github.com/controlplaneio-fluxcd/distribution/releases)
[![Vulnerability scan](https://github.com/controlplaneio-fluxcd/distribution/actions/workflows/scan-distribution.yaml/badge.svg)](https://github.com/controlplaneio-fluxcd/distribution/actions/workflows/scan-distribution.yaml)
[![e2e-fips](https://github.com/controlplaneio-fluxcd/distribution/actions/workflows/e2e-fips.yaml/badge.svg)](https://github.com/controlplaneio-fluxcd/distribution/actions/workflows/e2e-fips.yaml)
[![SLSA 3](https://slsa.dev/images/gh-badge-level3.svg)](#supply-chain-security)

The [ControlPlane](https://control-plane.io) distribution for [Flux CD](https://fluxcd.io)
comes with enterprise-hardened Flux controllers including:

- Hardened container images and SBOMs in-sync with upstream Flux releases.
- Continuous scanning and CVE patching for Flux container base images.
- SLAs for remediation of critical vulnerabilities affecting Flux functionality.
- FIPS-compliant Flux builds based on FIPS 140-2 validated BoringSSL.
- Extended compatibility of Flux controllers for the latest six minor releases of Kubernetes.
- Assured compatibility with OpenShift and Kubernetes LTS versions provided by cloud vendors.

The ControlPlane distribution is offered on a
[yearly subscription basis](https://control-plane.io/enterprise-for-flux-cd/) and includes
enterprise-grade support services for running Flux in production.

> [!TIP]
> [Connect with us](https://control-plane.io/contact/?inquiry=fluxcd) to explore how the enterprise
> distribution aligns with your unique requirements. Together, we'll develop and review a plan
> tailored to your challenges, goals, and budget.

## Distribution Channels

ControlPlane offers two distribution channels for the Flux controllers:

- [FIPS-compliant](#fips-compliant) images hosted at `ghcr.io/controlplaneio-fluxcd/distroless`.
- [Mainline](#mainline) images hosted at `ghcr.io/controlplaneio-fluxcd/alpine`.

The ControlPlane container images are continuously scanned for vulnerabilities and patched accordingly.

### FIPS-compliant

The ControlPlane distribution offers hardened
[Google Distrosless](https://github.com/GoogleContainerTools/distroless)-based Flux images
to organizations that must comply with NIST FIPS-140-2 standards.

The Flux controller binaries are statically linked against the
[Google BoringSSL](https://boringssl.googlesource.com/boringssl/) libraries,
and the Go runtime restricts all TLS configuration to FIPS-approved settings
by importing the `crypto/tls/fipsonly` package.

### Mainline

The mainline distribution channel offers
[Alpine Linux](https://www.alpinelinux.org/)-based
images fully compatible with the upstream Flux feature set.

The major difference between the Flux upstream images and mainline images is the
continuous scanning and CVE patching for the container base images, OS packages,
and Go dependencies.

## Installation and Upgrades

ControlPlane offers a seamless transition from CNCF Flux to the enterprise distribution with no
impact to Flux availability. The hardened container images provided by ControlPlane are fully
compatible with the upstream Flux installation and bootstrap procedure.

Customers can bootstrap Flux with the enterprise distribution using the Flux CLI or the Flux Terraform provider.
To access the ControlPlane registry, customers need to provide their credentials using the
`--registry-cred` flag.

Example of bootstrapping Flux with the FIPS-compliant distribution:

```bash
flux bootstrap github \
  --owner=customer-org \
  --repository=customer-repo \
  --branch=main \
  --path=./clusters/production \
  --image-pull-secret=flux-enterprise-auth \
  --registry-cred=flux:$ENTERPRISE_TOKEN \
  --registry=ghcr.io/controlplaneio-fluxcd/distroless
```

### Automated Updates

For keeping the Flux controllers images digests
and manifests up-to-date with the latest version of the Enterprise Distribution, ControlPlane
provides Kustomize images patches for the Flux manifests, which can be found in the
[distribution repository](https://github.com/controlplaneio-fluxcd/distribution/tree/main/images).

Customers using GitHub can leverage the ControlPlane GitHub Actions to automate the
update of the Flux manifests in their bootstrap repositories. For more information, see the
[Update Flux GitHub Action](actions/update/README.md) documentation.

For customers using other Git providers, ControlPlane provides support for configuring
automated updates for the Flux enterprise distribution.

## Guides and Documentation

The ControlPlane distribution comes with a set of guides and documentation to help customers
configure and operate the Flux controllers in production environments.

### Flux Architecture Overview

The [Flux CD Architecture Overview](https://control-plane.io/posts/fluxcd-architecture-overview/)
guide provides a comprehensive overview of the Flux CD architectures, including a
comparison of the deployment strategies of the Flux components when implementing GitOps
for multi-cluster continuous delivery.

### Flux d1 Reference Architecture

The aim of this guide is to provide a comprehensive description of the Flux d1 reference
architecture, offered by the d1 repositories housed within the controlplaneio-fluxcd organization.
These repositories and the [flux d1 reference architecture guide](/guides/ControlPlane_Flux_D1_Reference_Architecture_Guide.pdf) expand upon the
established Flux documentation, which includes a quickstart guide for orchestrating a single cluster.
Our focus is to showcase how Flux can address the requirements of organizations managing
multiple teams deploying applications across numerous multi-tenant Kubernetes clusters using Flux.
Through this comprehensive resource, users can gain insights into leveraging Flux
for streamlined multi-cluster management and efficient application deployment workflows.

## Supply Chain Security

The build, release and provenance portions of the ControlPlane distribution supply chain meet
[SLSA Build Level 3](https://slsa.dev/spec/v1.0/levels).

### Software Bill of Materials

The ControlPlane images come with SBOMs in SPDX format for each CPU architecture.

Example of extracting the SBOM from the source-controller image:

```shell
docker buildx imagetools inspect \
    <registry>/source-controller:v1.3.0 \
    --format "{{ json (index .SBOM \"linux/amd64\").SPDX}}"
```

### Signature Verification

The ControlPlane images are signed using Sigstore Cosign and GitHub OIDC.

Example of verifying the signature of the source-controller image:

```shell
cosign verify <registry>/source-controller:v1.3.0 \
  --certificate-identity-regexp=^https://github\\.com/controlplaneio-fluxcd/.*$ \
  --certificate-oidc-issuer=https://token.actions.githubusercontent.com
```

### SLSA Provenance verification

The provenance attestations are generated at build time with Docker Buildkit and
include facts about the build process such as:

- Build timestamps
- Build parameters and environment
- Version control metadata
- Source code details
- Materials (files, scripts) consumed during the build

Example of extracting the SLSA provenance JSON for the source-controller image:

```shell
docker buildx imagetools inspect \
  <registry>/source-controller:v1.3.0 \
  --format "{{ json (index .Provenance \"linux/amd64\").SLSA}}"
```

The provenance of the build artifacts is generated with the official
[SLSA GitHub Generator](https://github.com/slsa-framework/slsa-github-generator).

Example of verifying the provenance of the source-controller image:

```shell
cosign verify-attestation --type slsaprovenance \
  --certificate-identity-regexp=^https://github.com/slsa-framework/slsa-github-generator/.github/workflows/generator_container_slsa3.yml.*$ \
  --certificate-oidc-issuer=https://token.actions.githubusercontent.com \
  <registry>/source-controller:v1.3.0
```

