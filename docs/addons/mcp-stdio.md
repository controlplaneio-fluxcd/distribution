---
title: Local MCP Server Addon
description: Local MCP Server for Flux Enterprise
---

# Local MCP Server

Flux enterprise comes with a hardened version of the [Flux Operator MCP Server](https://fluxoperator.dev/mcp-server/)
that can be used locally on dev laptops and workstations.
The major difference to upstream is that this version is **exclusively read-only**
and does not support any operation that would alter the Kubernetes cluster state regardless
of the permissions granted by the kubeconfig.

The hardened container images are published at:

- `ghcr.io/controlplaneio-fluxcd/flux-mcp-enterprise:<VERSION>-stdio-readonly`

> [!tip] MCP Server latest version
>
> The MCP Server container image tag and digest should be kept up to date
> with the latest release published at [controlplaneio-fluxcd/distribution/addons/mcp](https://github.com/controlplaneio-fluxcd/distribution/tree/main/addons/mcp).

The MCP Server binaries packaged in the multi-arch container images are built
for Linux amd64/arm64 and are subject to ControlPlane's SLA for CVE remediation and FIPS compliance.

The build, release, and provenance of the ControlPlane's MCP Server supply chain meet
[SLSA Build Level 3](https://slsa.dev/spec/v1.0/levels).
For more information on how to verify the provenance of ControlPlane's container images,
see the [Supply Chain Security documentation](https://github.com/controlplaneio/dex/blob/main/docs/provenance.md).

## Registry Access

To access the MCP Server artifacts from the ControlPlane registry, you can use the
Flux enterprise distribution token.

Login to the ControlPlane registry with docker:

```shell
echo $ENTERPRISE_TOKEN | docker login ghcr.io -u flux-enterprise --password-stdin
```

## Configuration

### Linux and WSL

On Linux and Windows (WSL2), you can pull the image from the ControlPlane registry with:

```shell
docker pull ghcr.io/controlplaneio-fluxcd/flux-mcp-enterprise:v0.1.0-stdio-readonly
```

Copy the `flux-operator-mcp` binary from the image to a local directory (e.g. `/usr/local/bin`):

```shell
docker create --name flux-mcp-extract ghcr.io/controlplaneio-fluxcd/flux-mcp-enterprise:v0.1.0-stdio-readonly
docker cp flux-mcp-extract:/flux-operator-mcp /usr/local/bin/flux-operator-mcp
docker rm flux-mcp-extract
```

Verify that the binary can be run on your local machine and that is accessible from the `$PATH` with:

```shell
flux-operator-mcp --help
```

Add the `flux-operator-mcp` to your AI Agent configuration (e.g. `.mcp.json`):

```json
{
  "flux-operator-mcp":{
    "command":"flux-operator-mcp",
    "args":["serve"],
    "env":{
      "KUBECONFIG":"/path/to/.kube/config"
    }
  }
}
```

Make sure to set the `KUBECONFIG` environment variable to the actual path of your kubeconfig.

### macOS

On macOS, the MCP server can be run using Docker Desktop. The kubeconfig
should be mounted into the container so the server can reach your Kubernetes clusters.

Add the MCP server to your AI Agent configuration (e.g. `.mcp.json`):

```json
{
  "flux-operator-mcp":{
    "command":"docker",
    "args":[
      "run", "--rm", "-i",
      "-v", "/path/to/.kube/config:/home/nonroot/.kube/config:ro",
      "-e", "KUBECONFIG=/home/nonroot/.kube/config",
      "ghcr.io/controlplaneio-fluxcd/flux-mcp-enterprise:v0.1.0-stdio-readonly",
      "serve"
    ]
  }
}
```

Make sure to replace `/path/to/.kube/config` with the actual path of your kubeconfig,
usually `/Users/<username>/.kube/config`.

## MCP Tools

The local MCP server comes with a set of tools that enable AI Agents to correlate events,
logs, and configuration changes to identify the source of failures in GitOps pipelines;
reducing the mean time to resolution (MTTR) during incidents with contextual analysis
and actionable remediation steps.

### Reporting Tools

- **`get_flux_instance`** - Inspect the Flux installation on a cluster, including component versions,
  health status, and overall sync statistics.
- **`get_kubernetes_resources`** - Browse Flux sources, kustomizations, Helm releases, and other
  Kubernetes resources along with their current status and recent events.
- **`get_kubernetes_logs`** - Retrieve container logs from workloads managed by Flux to help
  diagnose deployment failures and runtime errors.
- **`get_kubernetes_metrics`** - Check CPU and memory consumption of pods to spot resource pressure
  or abnormal usage patterns.
- **`get_kubernetes_api_versions`** - Discover which Kubernetes API versions are available on the
  cluster for a given resource kind.

### Multi-Cluster Tools

- **`get_kubeconfig_contexts`** - List all Kubernetes clusters available in the local kubeconfig
  so the agent can offer cluster selection.
- **`set_kubeconfig_context`** - Switch the active cluster context for the current session, enabling
  cross-cluster investigation without manual context changes.

### Documentation Tools

- **`search_flux_docs`** - Search the Flux documentation to surface relevant guides,
  API references, and troubleshooting steps. The documentation is embedded in the server binary,
  so no internet access is required.
