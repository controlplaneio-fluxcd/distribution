# Flux Operator Introduction

The Flux Operator is a Kubernetes CRD controller that manages
the lifecycle of the ControlPlane enterprise distribution for Flux CD.

## Features

- Provide a declarative API for the installation and upgrade of the Flux distribution.
- Automate patching for hotfixes and CVEs affecting the Flux controllers container images.
- Provide first-class support for OpenShift, Azure, AWS, GCP and other marketplaces.
- Simplify the configuration of multi-tenancy lockdown on shared Kubernetes clusters.
- Provide a security-first approach to the Flux deployment and FIPS compliance.
- Incorporate best practices for running Flux at scale with persistent storage, sharding and horizontal scaling.
- Manage the update of Flux custom resources and prevent disruption during the upgrade process.
- Facilitate a clean uninstall and reinstall process without affecting the Flux-managed workloads.

## License

The Flux Operator is an open-source project licensed under the
[AGPL-3.0 license](https://github.com/controlplaneio-fluxcd/flux-operator/blob/main/LICENSE).

The project is developed by CNCF Flux core maintainers part of the [ControlPlane](https://control-plane.io) team.
