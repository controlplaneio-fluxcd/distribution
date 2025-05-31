---
title: Supply Chain Security
description: FluxCD Enterprise supply chain security and vulnerability management
---

# Supply Chain Security

The build, release and provenance portions of the ControlPlane distribution supply chain meet
[SLSA Build Level 3](https://slsa.dev/spec/v1.0/levels).

## Software Bill of Materials

The ControlPlane images come with SBOMs in SPDX format for each CPU architecture.

Example of extracting the SBOM from the source-controller image:

```shell
docker buildx imagetools inspect \
    <registry>/source-controller:v1.3.0 \
    --format "{{ json (index .SBOM \"linux/amd64\").SPDX}}"
```

## Signature Verification

The ControlPlane images are signed using Sigstore Cosign and GitHub OIDC.

Example of verifying the signature of the source-controller image:

```shell
cosign verify <registry>/source-controller:v1.3.0 \
  --certificate-identity-regexp=^https://github\\.com/controlplaneio-fluxcd/.*$ \
  --certificate-oidc-issuer=https://token.actions.githubusercontent.com
```

## SLSA Provenance Verification

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

## Vulnerability Exploitability eXchange

The Flux controllers (source code, binaries and container images) are continuously
scanned for CVEs. Once a CVE is detected, the ControlPlane team assesses
the exploitability of the vulnerability. If the vulnerability is proven to be exploitable,
the ControlPlane team provides a patch within the agreed SLA and issues
a security bulletin to customers containing the CVE details and the container images
digests that include the fix.

There are cases where the vulnerability is not exploitable in the context of the Flux
controllers, and in such cases, the ControlPlane team issues a CVE exception in the
[OpenVEX](https://github.com/openvex/spec/blob/v0.2.0/OPENVEX-SPEC.md) format.

For each Flux minor release, the ControlPlane team maintains a VEX document with the
list of vulnerabilities that do not affect the Flux controllers. The VEX documents
are available in the enterprise distribution repository under the `vex` directory.

Example of scanning the source-controller image with [Trivy](https://github.com/aquasecurity/trivy)
using the VEX document:

```console
$ trivy image <registry>/source-controller:v1.2.2 --vex ./vex/v2.2.json --show-suppressed

Suppressed Vulnerabilities (Total: 1)

┌─────────────────┬────────────────┬──────────┬──────────────┬─────────────────────────────┬─────────┐
│     Library     │ Vulnerability  │ Severity │    Status    │          Statement          │ Source  │
├─────────────────┼────────────────┼──────────┼──────────────┼─────────────────────────────┼─────────┤
│ helm.sh/helm/v3 │ CVE-2019-25210 │ MEDIUM   │ not_affected │ vulnerable_code_not_present │ OpenVEX │
└─────────────────┴────────────────┴──────────┴──────────────┴─────────────────────────────┴─────────┘
```
