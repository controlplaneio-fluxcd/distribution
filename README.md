# Enterprise Distribution for Flux CD

[![release](https://img.shields.io/github/release/controlplaneio-fluxcd/distribution/all.svg)](https://github.com/controlplaneio-fluxcd/distribution/releases)
[![e2e-fips](https://github.com/controlplaneio-fluxcd/distribution/actions/workflows/e2e-fips.yaml/badge.svg)](https://github.com/controlplaneio-fluxcd/distribution/actions/workflows/e2e-fips.yaml)
[![Vulnerability scan](https://github.com/controlplaneio-fluxcd/distribution/actions/workflows/scan-distroless.yaml/badge.svg)](https://github.com/controlplaneio-fluxcd/distribution/actions/workflows/scan-distroless.yaml)
[![License scan](https://github.com/controlplaneio-fluxcd/distribution/actions/workflows/scan-license.yaml/badge.svg)](https://github.com/controlplaneio-fluxcd/distribution/actions/workflows/scan-license.yaml)
[![SLSA 3](https://slsa.dev/images/gh-badge-level3.svg)](#supply-chain-security)

[ControlPlane Enterprise for Flux CD](https://fluxcd.control-plane.io)
is a comprehensive solution for organizations seeking
to leverage the power of GitOps in their Kubernetes environments.

Built on top of the [CNCF-graduated](https://www.cncf.io/projects/flux/) Flux project,
the ControlPlane distribution provides a secure, scalable, and enterprise-ready platform
for managing the delivery of application and infrastructure workloads on
multi-tenant Kubernetes clusters.

The ControlPlane distribution is offered on a
[yearly subscription basis](https://fluxcd.control-plane.io/pricing/) and includes
enterprise-grade support services for running Flux in production.

> [!TIP]
> [Connect with us](https://control-plane.io/contact/?inquiry=fluxcd) to explore how the enterprise
> distribution aligns with your unique requirements. Together, we'll develop and review a plan
> tailored to your challenges, goals, and budget.

## Documentation

ControlPlane offers a seamless transition from CNCF Flux to the enterprise distribution
with no impact to Flux availability. The hardened container images provided by ControlPlane
are fully compatible with the upstream Flux installation and bootstrap procedure.

For more information, see the following documentation:

- [Enterprise Distribution Overview](https://fluxcd.control-plane.io/distribution/)
- [Installation and Upgrades](https://fluxcd.control-plane.io/distribution/install/)
- [FIPS compliance](https://fluxcd.control-plane.io/distribution/#distribution-channels)
- [Supply Chain Security](https://fluxcd.control-plane.io/distribution/security/)
- [Multi-cluster Architecture](https://fluxcd.control-plane.io/guides/flux-architecture/)

To streamline the adoption of the enterprise distribution, the ControlPlane team created the
**Flux Operator** project which provides first-class support for running Flux in production
on Red Hat OpenShift, Amazon EKS, Azure AKS and Google GKE.

The operator manages the lifecycle of the Flux controllers and automates the upgrade process,
including the patching of hotfixes and CVEs affecting Flux functionality.
For more information, see the [Flux Operator documentation](https://fluxcd.control-plane.io/operator/).
