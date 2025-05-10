# Flux MCP Server Configuration

This document provides instructions for configuring the Flux Model Context Protocol (MCP) Server
to work with AI assistants.

## Configuration Options

The `flux-operator-mcp serve` command accepts the following flags:

| Flag             | Description                           | Default |
|------------------|---------------------------------------|---------|
| `--transport`    | The transport protocol (stdio or sse) | stdio   |
| `--port`         | The port to listen on (for sse)       | 8080    |
| `--read-only`    | Run in read-only mode                 | false   |
| `--mask-secrets` | Mask secret values                    | true    |
| `--kube-as`      | Kubernetes account to impersonate     | none    |

## Transport Modes

### Standard Input/Output (stdio)

The MCP Server uses standard input/output (stdio) by default, which is compatible with most AI assistants.

To start the server in this mode, use the following configuration:

```json
{
  "flux-operator-mcp":{
    "command":"/path/to/flux-operator-mcp",
    "args":["serve"],
    "env":{
      "KUBECONFIG":"/path/to/.kube/config"
    }
  }
}
```

### Server-Sent Events (SSE)

Web-based transport that allows the server to push updates to the client.

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

## Security Options

### Read-only Mode

In production environments, you can run the server in read-only mode to prevent any modifications to your clusters:

```json
{
  "flux-operator-mcp":{
    "command":"/path/to/flux-operator-mcp",
    "args":[
      "serve",
      "--read-only"
    ],
    "env":{
      "KUBECONFIG":"/path/to/.kube/config"
    }
  }
}
```

!!! warning "Warning"

    In read-only mode, the MCP [tools](tools.md) that modify the cluster state
    (reconcile, suspend, resume, apply, delete) are disabled.

### Secret Masking

By default, the server masks sensitive values in Kubernetes Secrets. You can disable this if needed:

```json
{
  "flux-operator-mcp":{
    "command":"/path/to/flux-operator-mcp",
    "args":[
      "serve",
      "--mask-secrets=false"
    ],
    "env":{
      "KUBECONFIG":"/path/to/.kube/config"
    }
  }
}
```

!!! warning "Warning"

    Disabling secret masking will expose sensitive information to the AI assistant and potentially
    to its training data. Only disable this in controlled environments when using self-hosted models.

### Service Account Impersonation

For tighter security control, you can configure the server to impersonate a specific service account:

```json
{
  "flux-operator-mcp":{
    "command":"/path/to/flux-operator-mcp",
    "args":[
      "serve",
      "--kube-as=system:serviceaccount:my-namespace:my-service-account"
    ],
    "env":{
      "KUBECONFIG":"/path/to/.kube/config"
    }
  }
}
```

This limits the server's permissions to those granted to the specified service account.
Note that your user set in the kubeconfig must have permission to impersonate service accounts.
