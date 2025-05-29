# Flux MCP Server Configuration

This document covers the configuration options for the Flux Model Context Protocol (MCP) Server,
including transport modes, security settings, and how to restrict access to your clusters.

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

## Deploy on Kubernetes

To deploy the Flux MCP Server in a Kubernetes cluster, you can create a
[ResourceSet](../operator/resourcesets/app-definition.md) with the following configuration:

```yaml
apiVersion: fluxcd.controlplane.io/v1
kind: ResourceSet
metadata:
  name: flux-operator-mcp
  namespace: flux-system
spec:
  inputs:
    - version: latest
      readonly: false
      accessFrom: flux-system
  resources:
    - apiVersion: source.toolkit.fluxcd.io/v1beta2
      kind: OCIRepository
      metadata:
        name: flux-operator-manifests
        namespace: flux-system
      spec:
        interval: 120m
        url: oci://ghcr.io/controlplaneio-fluxcd/flux-operator-manifests
        ref:
          tag: << inputs.version >>
    - apiVersion: kustomize.toolkit.fluxcd.io/v1
      kind: Kustomization
      metadata:
        name: flux-operator-mcp
        namespace: flux-system
      spec:
        serviceAccountName: flux-operator
        interval: 60m
        wait: true
        timeout: 5m
        retryInterval: 5m
        prune: true
        sourceRef:
          kind: OCIRepository
          name: flux-operator-manifests
        path: ./flux-operator-mcp
        patches:
          - patch: |
              - op: add
                path: /spec/template/spec/containers/0/args/-
                value: --read-only=<< inputs.readonly >>
            target:
              kind: Deployment
    - kind: NetworkPolicy
      apiVersion: networking.k8s.io/v1
      metadata:
        name: flux-operator-mcp
        namespace: flux-system
      spec:
        policyTypes:
          - Ingress
        podSelector:
          matchLabels:
            app.kubernetes.io/name: flux-operator-mcp
        ingress:
          - from:
              - namespaceSelector:
                  matchLabels:
                    kubernetes.io/metadata.name: << inputs.accessFrom >>
            ports:
              - protocol: TCP
                port: 9090
```

This ResourceSet will create a Kubernetes Deployment for the Flux MCP Server
with cluster-admin permissions. It is recommended to set the `readonly` input to `true`
in production environments to prevent modifications to the cluster state.

The server is exposed via a Kubernetes Service named `flux-operator-mcp`
in the `flux-system` namespace, listening on port `9090`. If the MCP client
is running in-cluster, the `accessFrom` input should be set to the name of the
namespace where the MCP client is deployed.

To connect to the server, start port forwarding with:

```shell
kubectl port-forward -n flux-system svc/flux-operator-mcp 9090:9090
```

Then, in your VS Code settings, add:

```json
{
 "mcp": {
   "servers": {
     "flux-operator-mcp": {
       "type": "sse",
       "url": "http://localhost:9090/sse"
     }
   }
 }
}
```

!!! warning "Warning"

    Note that when running in-cluster, the kubeconfig context switching tools are disabled,
    so comparing deployments across clusters is not possible.
