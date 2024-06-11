# Flux Operator Introduction

The Flux Operator is a Kubernetes CRD controller that manages
the lifecycle of CNCF Flux and the ControlPlane enterprise distribution.

## Features

- Provides a declarative API for the installation, configuration and upgrade of Flux.
- Automates the patching of hotfixes and CVEs affecting the Flux controllers container images.
- Simplifies the configuration of multi-tenancy lockdown on shared Kubernetes clusters.
- Provides a security-first approach to the Flux deployment and FIPS compliance.
- Incorporates best practices for running Flux at scale with persistent storage and vertical scaling.
- Manages the update of Flux custom resources and prevents disruption during the upgrade process.
- Facilitates a clean uninstall and reinstall process without affecting the Flux-managed workloads.
- Provides first-class support for OpenShift, Azure, AWS, GCP and other marketplaces.

## License

The Flux Operator is an open-source project licensed under the
[AGPL-3.0 license](https://github.com/controlplaneio-fluxcd/flux-operator/blob/main/LICENSE).

The project is developed by CNCF Flux core maintainers part of the [ControlPlane](https://control-plane.io) team.
