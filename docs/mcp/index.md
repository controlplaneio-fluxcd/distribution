# Flux MCP Server Introduction

The Flux Model Context Protocol (MCP) Server connects AI assistants like Claude, Cursor,
GitHub Copilot, and others directly to your Kubernetes clusters running [Flux Operator](../operator/index.md),
enabling seamless interaction through natural language. It serves as a bridge between AI tools
and your GitOps pipelines, allowing you to analyze the cluster state, troubleshoot deployment issues,
and perform operations using conversational prompts.

!!! warning "Experimental Feature"

    Please note that the Flux MCP Server is an experimental feature provided as-is without
    warranty or support guarantees. Enterprise customers should use this feature at their own discretion.

## Features

<div class="grid cards" markdown>

-   :octicons-checklist-24:{ .lg .middle } __Cluster State Analysis__

    ---
    Quickly understand your Flux installation status, resource configurations, and deployment histories across environments.

-   :octicons-workflow-24:{ .lg .middle } __Cross-Cluster Comparisons__

    ---
    Compare Flux configurations for applications and infrastructure between development, staging, and production.

-   :octicons-discussion-closed-24:{ .lg .middle } __Enhanced On-Call Experience__

    ---
    Reduce mean time to resolution (MTTR) during incidents with contextual analysis and actionable remediation steps.

-   :octicons-goal-24:{ .lg .middle } __Root Cause Analysis__

    ---
    Automatically correlate events, logs, and configuration changes to identify the source of failures in a GitOps pipeline.

-   :octicons-sync-24:{ .lg .middle } __GitOps Automation__

    ---
    Trigger reconciliations, suspend/resume Flux resources, and manage your delivery pipelines with simple requests.

-   :octicons-pulse-24:{ .lg .middle } __Visual GitOps Pipelines__

    ---
    Generate diagrams that map out Flux dependencies, resource relationships, and delivery workflows across clusters.

</div>

## How It Works

The Flux MCP Server integrates with AI assistants through the Model Context Protocol,
providing them with purpose-built [tools](tools.md) to interact with your clusters.
When you ask a question or make a request, the AI uses these tools to gather information,
analyze configurations, and perform operations based on your instructions.

![Flux MCP Server Architecture](../images/flux-mcp-diagram-wht.svg)

The AI assistants leveraging the Flux MCP Server can trace issues from high-level GitOps resources
like ResourceSets, HelmReleases, and Kustomizations all the way down to individual pod logs.
This comprehensive visibility means you can quickly identify where problems originate in your
delivery pipeline – whether in Helm chart values, Kubernetes manifests,
Flux configurations, or application runtime issues.

!!! tip "AI Instructions"

    For the best experience, we recommend configuring your AI assistants with
    [custom instructions](prompt-engineering.md#ai-instructions) that guide them on how to
    interact with Kubernetes and the Flux MCP Server.

## Security Considerations

The Flux MCP Server is designed with security in mind:

- Operates with your existing kubeconfig permissions
- Supports service account impersonation for limited access
- Masks sensitive information in Kubernetes Secret values
- Provides a Kubernetes read-only mode for observation without affecting the cluster state
- Access to the local file system is read-only and restricted to the kubeconfig file

For a detailed overview of configuring the Flux MCP Server, including security settings,
see the [Configuration Guide](config.md).

## License

The MCP Server is open-source and part of the [Flux Operator](https://github.com/controlplaneio-fluxcd/flux-operator)
project licensed under the [AGPL-3.0 license](https://github.com/controlplaneio-fluxcd/flux-operator/blob/main/LICENSE).
