# Flux MCP Server Installation

This guide walks you through installing, configuring, and using the Flux MCP Server with various AI assistants.

## Prerequisites

Before installing the Flux MCP Server, ensure you have:

- A Kubernetes cluster with Flux Operator installed
- A valid kubeconfig file to access the clusters
- Appropriate permissions to view Flux resources

## Installation Options

### Download Pre-built Binaries

The Flux MCP Server is available as a binary executable for Linux, macOS, and Windows.
The `flux-operator-mcp` AMD64 and ARM64 binaries can be downloaded from
GitHub [releases page](https://github.com/controlplaneio-fluxcd/flux-operator/releases).

After downloading the `flux-operator-mcp` archive for your platform and architecture,
unpack it and place the binary in a directory included in your system's `PATH`.

### Build from Source

If you prefer to build from source, clone the repository and build the binary using `make` (requires Go 1.24+):

```shell
git clone https://github.com/controlplaneio-fluxcd/flux-operator.git
cd flux-operator
make mcp-build
```

The `flux-operator-mcp` binary will be available in the `bin` directory relative to the repository root.

## Configuration with AI Assistants

The Flux MCP Server is compatible with AI assistants that support the Model Context Protocol (MCP)
either using standard input/output (stdio) or server-sent events (SSE).

### Claude, Cursor, and Windsurf

Add the following configuration to your AI assistant's settings to enable the Flux MCP Server:

```json
{
 "mcpServers": {
   "flux-operator-mcp": {
     "command": "/path/to/flux-operator-mcp",
     "args": ["serve"],
     "env": {
       "KUBECONFIG": "/path/to/.kube/config"
     }
   }
 }
}
```

Replace `/path/to/flux-operator-mcp` with the actual path to the binary
and `/path/to/.kube/config` with the path to your kubeconfig file.

To determine the correct paths for the binary and kubeconfig, you can use the following commands:

```shell
which flux-operator-mcp
echo $HOME/.kube/config
```

### VS Code Copilot Chat

Add the following configuration to your VS Code settings:

```json
{
 "mcp": {
   "servers": {
     "flux-operator-mcp": {
       "command": "/path/to/flux-operator-mcp",
       "args": ["serve"],
       "env": {
         "KUBECONFIG": "/path/to/.kube/config"
       }
     }
   }
 },
 "chat.mcp.enabled": true
}
```

Replace `/path/to/flux-operator-mcp` with the actual path to the binary
and `/path/to/.kube/config` with the path to your kubeconfig file.

When using GitHub Copilot Chat, enable Agent mode to access the Flux MCP tools.

## Server Configuration Options

The `flux-operator-mcp serve` command accepts the following flags:

| Flag             | Description                           | Default |
|------------------|---------------------------------------|---------|
| `--transport`    | The transport protocol (stdio or sse) | stdio   |
| `--port`         | The port to listen on (for sse)       | 8080    |
| `--read-only`    | Run in read-only mode                 | false   |
| `--mask-secrets` | Mask secret values                    | true    |
| `--kube-as`      | Kubernetes account to impersonate     | none    |

### Transport Modes

The MCP Server supports two transport modes:

- **Standard Input/Output (stdio)** - Default mode compatible with most AI assistants. The server reads from standard input and writes to standard output.
- **Server-Sent Events (SSE)** - Web-based transport that allows the server to push updates to the client.

To use Server-Sent Events (SSE), start the server with:

```shell
export KUBECONFIG=$HOME/.kube/config
flux-operator-mcp serve --transport sse --port 8080
```

To connect to the server from VS Code, use the following configuration:

```json
{
 "mcp": {
   "servers": {
     "flux-operator-mcp": {
       "type": "sse",
       "url": "http://localhost:8080/sse"
     }
   }
 }
}
```

### Security Options

#### Read-only Mode

For security-sensitive environments, you can run the server in read-only mode to prevent any modifications to your cluster:

```shell
flux-operator-mcp serve --read-only
```

In read-only mode, [tools](tools.md) that modify the cluster state (reconcile, suspend, resume, delete) will be disabled.

#### Secret Masking

By default, the server masks sensitive values in Kubernetes Secrets. You can disable this if needed:

```shell
flux-operator-mcp serve --mask-secrets=false
```

**Warning:** Disabling secret masking will expose sensitive information to the AI assistant and potentially
to its training data. Only disable this in secure, controlled environments when using self-hosted models.

#### Service Account Impersonation

For tighter security control, you can configure the server to impersonate a specific service account:

```shell
flux-operator-mcp serve --kube-as=system:serviceaccount:flux-system:flux-operator
```

This limits the server's permissions to those granted to the specified service account.
Note that your user set in the kubeconfig must have permission to impersonate service accounts.

## Testing Your Installation

After configuring the MCP Server with your AI assistant, you can test the installation with the following prompts:

- "Which cluster contexts are available in my kubeconfig?"
- "What version of Flux is running in my current cluster?"

If the AI assistant successfully interacts with your cluster and provides relevant information,
your installation is working correctly.

### Troubleshooting

- **Server not found**
    - Verify the path to the binary is correct
    - Ensure the binary has execute permissions
- **AI assistant can't find the tools**
    - Restart the AI assistant application
    - Verify the MCP configuration is correct
    - For VS Code, ensure Agent mode is enabled
- **Kubeconfig not found**
    - Check the path to your kubeconfig
    - Verify the kubeconfig is valid with `kubectl get crds`
- **Permission issues**
    - Ensure your kubeconfig has sufficient permissions 
    - Verify the permissions with `kubectl get fluxinstance -A`

## Upgrading

To upgrade the Flux MCP Server to a newer version:

1. Download the latest binary from the GitHub Releases page
2. Replace your existing binary with the new one
3. Restart any AI assistant applications that use the server

## Uninstallation

To uninstall the Flux MCP Server:

1. Remove the binary from your system
2. Remove the MCP configuration from your AI assistant's settings
