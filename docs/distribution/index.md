# Flux Distribution Introduction

The [ControlPlane](https://control-plane.io) distribution for [Flux CD](https://fluxcd.io)
comes with enterprise-hardened Flux controllers including:

- Hardened container images in-sync with upstream Flux releases.
- Continuous scanning and CVE patching for Flux container base images.
- SLAs for remediation of critical vulnerabilities affecting Flux functionality.
- SBOMs and VEX documents for Flux container images, dependencies and build environments.
- FIPS-compliant Flux builds based on FIPS 140-2 validated BoringSSL.
- Extended compatibility of Flux controllers for the latest six minor releases of Kubernetes.
- Assured compatibility with OpenShift and Kubernetes LTS versions provided by cloud vendors.

The ControlPlane distribution is offered on a
[yearly subscription basis](../pricing/index.md) and includes
enterprise-grade support services for running Flux in production.

## Distribution Channels

We offer two distribution channels for the Flux controllers:

- [FIPS-compliant](#fips-compliant) images
- [Mainline](#mainline) images

The ControlPlane container images are continuously scanned for vulnerabilities and patched accordingly.
The images are built for `linux/amd64` and `linux/arm64` architectures.

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
