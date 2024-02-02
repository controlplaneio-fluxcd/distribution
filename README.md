# Enterprise Distribution for Flux CD

[![release](https://img.shields.io/github/release/controlplaneio-fluxcd/distribution/all.svg)](https://github.com/controlplaneio-fluxcd/distribution/releases)
[![e2e-fips](https://github.com/controlplaneio-fluxcd/distribution/actions/workflows/e2e-fips.yaml/badge.svg)](https://github.com/controlplaneio-fluxcd/distribution/actions/workflows/e2e-fips.yaml)

The [ControlPlane](https://control-plane.io) distribution for [Flux CD](https://fluxcd.io)
comes with enterprise-hardened Flux controllers including:

- Hardened container images and SBOMs in-sync with upstream Flux releases.
- Continuous scanning and CVE patching for Flux container base images.
- SLAs for remediation of critical vulnerabilities affecting Flux functionality.
- FIPS-compliant Flux builds based on FIPS 140-2 validated BoringSSL.
- Extended compatibility of Flux controllers for the latest six minor releases of Kubernetes.
- Assured compatibility with Kubernetes LTS versions provided by cloud vendors.

## Distribution Channels

ControlPlane offers two distribution channels for the Flux controllers:

### Standard

[![Vulnerability scan](https://github.com/controlplaneio-fluxcd/distribution/actions/workflows/scan-distribution.yaml/badge.svg)](https://github.com/controlplaneio-fluxcd/distribution/actions/workflows/scan-distribution.yaml)

The standard distribution channel offers hardened Alpine Linux-based images fully
compatible with the upstream Flux feature set.

The Alpine images are continuously scanned for vulnerabilities and patched
accordingly.

### FIPS-compliant

[![Vulnerability scan](https://github.com/controlplaneio-fluxcd/distribution/actions/workflows/scan-fips.yaml/badge.svg)](https://github.com/controlplaneio-fluxcd/distribution/actions/workflows/scan-fips.yaml)

The ControlPlane distribution offers hardened
[Google Distrosless](https://github.com/GoogleContainerTools/distroless)-based Flux images
to organizations that must comply with NIST FIPS-140-2 standards.

The Flux controller binaries are statically linked against the
[Google BoringSSL](https://boringssl.googlesource.com/boringssl/) libraries,
and the Go runtime restricts all TLS configuration to FIPS-approved settings
by importing the `crypto/tls/fipsonly` package.

The FIPS-compliant distribution channel does not support the following Flux features:

- **Kustomize remote bases** due to the lack of a shell and `git` CLI in the runtime image.
- **SOPS OpenPGP decryption** due to the lack of OpenSSL libraries and `gnupg` binary in the runtime image.

The usage of Kustomize remote bases are discouraged by the Flux project due to the security implications
of fetching remote code from untrusted sources. For more information, please refer to the
[Flux FAQ](https://fluxcd.io/flux/faq/#should-i-be-using-kustomize-remote-bases) and
[Flux Security Best Practices](https://fluxcd.io/flux/security/best-practices/#kustomize-controller).

Flux SOPS integration offers various modern and secure alternatives to OpenPGP
for Kubernetes secrets management including:
[AGE encryption](https://fluxcd.io/flux/components/kustomize/kustomizations/#age-secret-entry),
[AWS KMS](https://fluxcd.io/flux/components/kustomize/kustomizations/#aws-kms-secret-entry),
[Azure Key Vault](https://fluxcd.io/flux/components/kustomize/kustomizations/#azure-key-vault-secret-entry),
[Google Cloud KMS](https://fluxcd.io/flux/components/kustomize/kustomizations/#gcp-kms-secret-entry),
[Hashicorp Vault](https://fluxcd.io/flux/components/kustomize/kustomizations/#hashicorp-vault-secret-entry).
Besides SOPS, Flux works with any 3rd-party Kubernetes secrets management
tools, for more information please refer to the
[Flux Secrets Management](https://fluxcd.io/flux/security/secrets-management/).

## Supply Chain Security

The build, release and provenance portions of the ControlPlane distribution supply chain meet
[SLSA Build Level 3](https://slsa.dev/spec/v1.0/levels).

### Software Bill of Materials

The controller images come with SBOMs for each CPU architecture,
you can extract the SPDX JSON using Docker’s inspect command:

```shell
docker buildx imagetools inspect \
    <registry>/<channel>/source-controller:v1.2.3 \
    --format "{{ json (index .SBOM \"linux/amd64\").SPDX}}"
```

### Signature Verification

The controller images are signed using Sigstore Cosign and GitHub OIDC.

To verify the authenticity of a container image, install cosign v2 and run:

```shell
cosign verify <registry>/<channel>/source-controller:v1.2.3 \
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

To extract the SLSA provenance JSON for a specific CPU architecture, you can use Docker’s inspect command:

```shell
docker buildx imagetools inspect \
  <registry>/<channel>/source-controller:v1.2.3 \
  --format "{{ json (index .Provenance \"linux/amd64\").SLSA}}"
```

The provenance of the build artifacts is generated with the official
[SLSA GitHub Generator](https://github.com/slsa-framework/slsa-github-generator)
can be verified using Sigstore Cosign:

```shell
cosign verify-attestation --type slsaprovenance \
  --certificate-identity-regexp=^https://github.com/slsa-framework/slsa-github-generator/.github/workflows/generator_container_slsa3.yml.*$ \
  --certificate-oidc-issuer=https://token.actions.githubusercontent.com \
  <registry>/<channel>/source-controller:v1.2.3
```
