# Flux configuration

The Flux Operator comes with a Kubernetes CRD called [FluxInstance](fluxinstance.md).
A single custom resource of this kind can exist in a Kubernetes cluster with the name
**flux** that must be created in the same namespace where the operator is deployed.

The `FluxInstance` resource is used to install and configure the automated update
of the Flux distribution.

## Default configuration

Example of a minimal `FluxInstance` resource:

```yaml
apiVersion: fluxcd.controlplane.io/v1
kind: FluxInstance
metadata:
  name: flux
  namespace: flux-system
spec:
  distribution:
    version: "2.3.x"
    registry: "ghcr.io/fluxcd"
  cluster:
    type: kubernetes
```

!!! tip "Enterprise Distribution"

    To install the enterprise distribution of Flux, point the operator to the ControlPlane registry:
    
    ```yaml
    apiVersion: fluxcd.controlplane.io/v1
    kind: FluxInstance
    metadata:
      name: flux
      namespace: flux-system
    spec:
      distribution:
        version: "2.3.x"
        registry: "ghcr.io/controlplaneio-fluxcd/distroless"
        imagePullSecret: "flux-enterprise-auth"
    ```

    The operator will check for updates in the ControlPlane
    [distribution repository](https://github.com/controlplaneio-fluxcd/distribution).
    If a new patch version is available, the operator will update the Flux components by pinning the
    container images to the latest digest published in the ControlPlane registry.

Save the above manifest to a file and apply it with `kubectl`:

```shell
kubectl apply -f flux-instance.yaml
```

The operator will reconcile the `FluxInstance` resource and install
the latest upstream Flux version in the `2.3` range with the specified components.
Every hour, the operator will check for Flux patch releases and apply them if available.

To verify the installation status:

```shell
kubectl -n flux-system get fluxinstance flux
```

To uninstall the Flux instance:

```shell
kubectl -n flux-system delete fluxinstance flux
```

## Custom configuration

The Flux distribution can be customized by specifying the components to install,
the cluster type, multitenancy, network policy, storage class and size, and kustomize patches.

For example, to install the latest Flux version with the multi-tenancy lockdown enabled
and persistent storage for the source-controller:

```yaml
apiVersion: fluxcd.controlplane.io/v1
kind: FluxInstance
metadata:
  name: flux
  namespace: flux-system
  annotations:
    fluxcd.controlplane.io/reconcileEvery: "1h"
    fluxcd.controlplane.io/reconcileTimeout: "5m"
spec:
  distribution:
    version: "2.x"
    registry: "ghcr.io/fluxcd"
  components:
    - source-controller
    - kustomize-controller
    - helm-controller
    - notification-controller
    - image-reflector-controller
    - image-automation-controller
  cluster:
    type: kubernetes
    multitenant: true
    networkPolicy: true
    domain: "cluster.local"
  storage:
    class: "standard"
    size: "10Gi"
  kustomize:
    patches:
      - target:
          kind: Deployment
          name: "(kustomize-controller|helm-controller)"
        patch: |
          - op: add
            path: /spec/template/spec/containers/0/args/-
            value: --concurrent=10
          - op: add
            path: /spec/template/spec/containers/0/args/-
            value: --requeue-dependency=5s
```

To find out more about the available configuration options, refer to the
[FluxInstance API reference](fluxinstance.md).
```
