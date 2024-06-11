# Flux Operator Installation

The Flux Operator is designed to run in a Kubernetes cluster on Linux nodes (AMD64 or ARM64)
and is compatible with all major Kubernetes distributions. The operator is written in Go and
statically compiled as a single binary with no external dependencies.

## Install methods

The Flux Operator can be installed with Helm, Operator Lifecycle Manager, or kubectl.
It is recommended to install the operator in a dedicated namespace, such as `flux-system`.

### Helm

The Flux Operator can be installed using the
[Helm chart](https://github.com/controlplaneio-fluxcd/charts/tree/main/charts/flux-operator)
available in the ControlPlane registry:

```shell
helm install flux-operator oci://ghcr.io/controlplaneio-fluxcd/charts/flux-operator \
  --namespace flux-system \
  --create-namespace
```

### Operator Lifecycle Manager (OLM)

The Flux Operator can be installed on OpenShift using the bundle published on OperatorHub
at [operatorhub.io/operator/flux-operator](https://operatorhub.io/operator/flux-operator).

Example subscription manifest:

```yaml
apiVersion: operators.coreos.com/v1alpha1
kind: Subscription
metadata:
  name: flux-operator
  namespace: flux-system
spec:
  channel: stable
  name: flux-operator
  source: operatorhubio-catalog
  sourceNamespace: olm
```

### Kubectl

The Flux Operator can be installed with `kubectl` by
applying the Kubernetes manifests published on the releases page:

```shell
kubectl apply -f https://github.com/controlplaneio-fluxcd/flux-operator/releases/latest/download/install.yaml
```

## Flux configuration

The Flux Operator comes with a Kubernetes CRD called [FluxInstance](fluxinstance.md).
A single custom resource of this kind can exist in a Kubernetes cluster with the name
**flux** that must be created in the same namespace where the operator is deployed.

The `FluxInstance` resource is used to install and configure the automated update
of the Flux distribution.

Example of a minimal `FluxInstance` resource:

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
    version: "2.3.x"
    registry: "ghcr.io/fluxcd"
  components:
    - source-controller
    - kustomize-controller
    - helm-controller
    - notification-controller
  cluster:
    type: kubernetes
```

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
