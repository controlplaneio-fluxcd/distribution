# Flux Operator Installation

The Flux Operator is designed to run in a Kubernetes cluster on Linux nodes (AMD64 or ARM64)
and is compatible with all major Kubernetes distributions. The operator is written in Go and
statically compiled as a single binary with no external dependencies.

## Install methods

The Flux Operator can be installed with Helm, Terraform, Operator Lifecycle Manager, or kubectl.
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

### Terraform

Installing the Flux Operator with Terraform is possible using the
[Helm provider](https://registry.terraform.io/providers/hashicorp/helm/latest/docs):

```hcl
resource "helm_release" "flux_operator" {
  name       = "flux-operator"
  namespace  = "flux-system"
  repository = "oci://ghcr.io/controlplaneio-fluxcd/charts"
  chart      = "flux-operator"
  create_namespace = true
}
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

## Uninstall

Before uninstalling the Flux Operator, make sure to delete the `FluxInstance` resources with:

```shell
kubectl -n flux-system delete fluxinstances --all
```

The operator will uninstall Flux from the cluster without affecting the Flux-managed workloads.

Verify that the Flux controllers have been removed:

```shell
kubectl -n flux-system get deployments
```

Uninstall the Flux Operator with your preferred method, e.g. Helm:

```shell
helm -n flux-system uninstall flux-operator
```
