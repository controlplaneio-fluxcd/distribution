# Flux Distribution Introduction

The ControlPlane distribution for [Flux CD](https://fluxcd.io)
comes with enterprise-hardened Flux controllers including [support services](../pricing) for
running Flux in production.

## Highlights

<div class="grid cards" markdown>

-   :octicons-container-24:{ .lg .middle } __Hardened Images__

    ---
    The ControlPlane enterprise distribution comes with FIPS-compliant hardened containers images
    for the GitOps Toolkit controllers in-sync with the upstream CNCF Flux releases.

-   :octicons-check-circle-24:{ .lg .middle } __Extended Kubernetes Compatibility__

    ---
    The distribution is end-to-end tested with the latest six minor releases of Kubernetes,
    as well as RedHat OpenShift and Kubernetes LTS versions provided by cloud vendors
    such as AWS EKS, Azure AKS and Google GKE.

-   :octicons-shield-check-24:{ .lg .middle } __Zero CVEs__

    ---
    The ControlPlane images are continuously scanned for vulnerabilities and patched accordingly.
    We offer SLAs for remediation of critical vulnerabilities affecting Flux functionality, and we provide
    SBOMs and VEX documents for container images, dependencies and build environments.

-   :octicons-people-24:{ .lg .middle } __Maintained by Experts__

    ---
    The enterprise distribution is maintained by security experts at ControlPlane together with
    CNCF Flux core maintainers. We provide hotfixes and CVE patches for the enterprise distribution
    ahead of the upstream releases, while keeping the feature set in-sync with the Flux project.

</div>

## Distribution Channels

We offer two distribution channels for the Flux controllers:

<div class="grid cards" markdown>

- FIPS-compliant images
- Mainline images

</div>

### FIPS-compliant

The ControlPlane distribution offers hardened
[Google Distrosless](https://github.com/GoogleContainerTools/distroless)-based Flux images
to organizations that must comply with NIST FIPS-140-2 standards.

The Flux controller binaries are statically linked against the
[Google BoringSSL](https://boringssl.googlesource.com/boringssl/) libraries,
and the Go runtime restricts all TLS configuration to FIPS-approved settings
by importing the `crypto/tls/fipsonly` package.

The FIPS-compliant container images are available for
`linux/amd64` and `linux/arm64` architectures.

### Mainline

The mainline distribution channel offers
[Alpine Linux](https://www.alpinelinux.org/)-based
images fully compatible with the upstream Flux feature set.

The major difference between the Flux upstream images and the ControlPlane
mainline images is the continuous scanning and CVE patching for the
container base images, OS packages, and Go dependencies.
