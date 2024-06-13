# Flux Distribution Introduction

ControlPlane Enterprise for Flux CD is a comprehensive solution for organizations seeking
to leverage the power of GitOps in their Kubernetes environments.

Built on top of the [CNCF-graduated](https://www.cncf.io/projects/flux/) Flux project,
the ControlPlane distribution provides a secure, scalable, and enterprise-ready platform
for managing the delivery of application and infrastructure workloads on
multi-tenant Kubernetes clusters.

The ControlPlane distribution comes with enterprise-hardened Flux controllers including
[support services](../pricing) for running Flux in production.

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

!!! tip "Flux Operator"

    To streamline the deployment of the enterprise distribution, the ControlPlane team
    created the [Flux Operator](../operator). The operator manages the lifecycle of the
    Flux controllers and automates the upgrade process, including the patching of hotfixes
    and CVEs affecting Flux functionality.

## Distribution Channels

We offer the following distribution channels for the Flux controllers:

<div class="grid cards" markdown>

- :octicons-verified-24: __[FIPS-compliant](#fips-compliant)__
- :octicons-commit-24: __[Mainline](#mainline)__

</div>

### FIPS-compliant

The ControlPlane distribution offers hardened
[Google Distroless](https://github.com/GoogleContainerTools/distroless)-based Flux images
to organizations that must comply with NIST FIPS-140-2 standards.

The Flux controller binaries are statically linked against the
[Google BoringSSL](https://boringssl.googlesource.com/boringssl/) libraries,
and the Go runtime restricts all TLS configuration to FIPS-approved settings
by importing the `crypto/tls/fipsonly` package.

### Mainline

The mainline distribution channel offers
[Alpine Linux](https://www.alpinelinux.org/)-based
images fully compatible with the upstream Flux feature set.

The major difference between the Flux upstream images and the ControlPlane
mainline images is the continuous scanning and CVE patching for the
container base images, OS packages, and Go dependencies.
