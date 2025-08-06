---
description: Flux Operator overview and features
---

# Flux Operator Introduction

The [Flux Operator](https://github.com/controlplaneio-fluxcd/flux-operator)
is a Kubernetes CRD controller that manages the lifecycle of CNCF Flux and the ControlPlane enterprise distribution.
The operator extends Flux with self-service capabilities, deployment windows and preview environments
for GitHub, GitLab and Azure DevOps pull requests testing.

!!! tip "Flux MCP Server"

    The Flux Operator project includes an experimental Model Context Protocol Server for AI-assisted GitOps.
    Check the [Flux MCP Server](../mcp/index.md) documentation for more details.

## Features

<div class="grid cards" markdown>

-   :octicons-gear-24:{ .lg .middle } __Lifecycle Management__

    ---
    The operator automates the installation, configuration and upgrade of the Flux controllers through a declarative API. 
    It manages the update of Flux CRDs and prevents disruption during the upgrade process.

-   :octicons-checklist-24:{ .lg .middle } __Advanced Configuration__

    ---
    The operator allows the configuration of Flux multi-tenancy lockdown, sharding, vertical scaling, persistent storage,
    and the syncing of the cluster state from Git repositories, OCI artifacts and S3-compatible storage.

-   :octicons-pulse-24:{ .lg .middle } __Deep Insights__

    ---
    The operator provides deep insights into the delivery pipelines managed by Flux, including detailed reports
    about the Flux controllers readiness status, reconcilers statistics, and cluster state sync.

-   :octicons-shield-check-24:{ .lg .middle } __Enterprise Automation__

    ---
    The operator streamlines the deployment of the ControlPlane Enterprise Distribution for Flux CD,
    and automates the patching of hotfixes and CVEs affecting the Flux controllers container images.

</div>

## License

The Flux Operator is an open-source project licensed under the
[AGPL-3.0 license](https://github.com/controlplaneio-fluxcd/flux-operator/blob/main/LICENSE).

The project is developed by CNCF Flux core maintainers part of the [ControlPlane](https://control-plane.io) team.
