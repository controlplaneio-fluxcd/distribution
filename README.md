# Enterprise Distribution for Flux CD

The [ControlPlane](https://control-plane.io) distribution for [Flux CD](https://fluxcd.io)
comes with enterprise-hardened container images for the
[GitOps Toolkit controllers](https://fluxcd.io/flux/components/) including:

- Hardened container images and SBOMs in-sync with upstream Flux releases.
- Continuous scanning and CVE patching for Flux container base images.
- SLAs for remediation of critical vulnerabilities affecting Flux functionality.
- FIPS-compliant Flux builds based on FIPS 140-2 validated BoringSSL.
- Extended compatibility of Flux controllers for the latest six minor releases of Kubernetes.
- Assured compatibility with Kubernetes LTS versions provided by cloud vendors such as Azure, AWS, Google and others.

## Distribution Channels

ControlPlane offers two distribution channels for the Flux controllers:

### Standard

The standard distribution channel offers hardened Alpine Linux-based images fully
compatible with the upstream Flux feature set.

The Alpine images are continuously scanned for vulnerabilities and patched
accordingly.

### FIPS-compliant

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
