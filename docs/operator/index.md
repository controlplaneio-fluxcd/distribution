# Flux Operator Introduction

The [Flux Operator](https://github.com/controlplaneio-fluxcd/flux-operator)
is a Kubernetes CRD controller that manages
the lifecycle of CNCF Flux and the ControlPlane enterprise distribution.

## Features

<div class="grid cards" markdown>

-   :octicons-gear-24:{ .lg .middle } __Lifecycle Management__

    ---
    The operator automates the installation, configuration and upgrade of the Flux controllers through a declarative API. 
    It manages the update of Flux CRDs and prevents disruption during the upgrade process.

-   :octicons-checklist-24:{ .lg .middle } __Advanced Configuration__

    ---
    The operator allows the configuration of Flux multi-tenancy lockdown, vertical scaling, persistent storage,
    and the syncing of the cluster state from Git repositories, OCI artifacts and S3-compatible storage.

-   :octicons-check-circle-24:{ .lg .middle } __Kubernetes Support__

    ---
    The operator is end-to-end tested on various Kubernetes distributions and provides first-class
    support for running Flux in production on OpenShift, Amazon EKS, Azure AKS and Google GKE. 

-   :octicons-shield-check-24:{ .lg .middle } __Enterprise Automation__

    ---
    The operator streamlines the deployment of the ControlPlane Enterprise Distribution for Flux CD,
    and automates the patching of hotfixes and CVEs affecting the Flux controllers container images.

</div>

## License

The Flux Operator is an open-source project licensed under the
[AGPL-3.0 license](https://github.com/controlplaneio-fluxcd/flux-operator/blob/main/LICENSE).

The project is developed by CNCF Flux core maintainers part of the [ControlPlane](https://control-plane.io) team.
