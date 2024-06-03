# Flux Operator Installation

The Flux Operator can be installed using the
[Helm chart](https://github.com/controlplaneio-fluxcd/charts/tree/main/charts/flux-operator)
available in the ControlPlane registry:

```shell
helm install flux-operator oci://ghcr.io/controlplaneio-fluxcd/charts/flux-operator \
  --namespace flux-system \
  --create-namespace
```

Or by using the Kubernetes manifests published on the releases page:

```shell
kubectl apply -f https://github.com/controlplaneio-fluxcd/flux-operator/releases/latest/download/install.yaml
```

## Usage

The Flux Operator comes with a Kubernetes CRD called `FluxInstance`. A single custom resource of this kind
can exist in a Kubernetes cluster with the name `flux` that must be created in the same
namespace where the operator is deployed.

### Upstream Distribution

To install the upstream distribution of Flux, create the following `FluxInstance` resource:

```yaml
apiVersion: fluxcd.controlplane.io/v1
kind: FluxInstance
metadata:
  name: flux
  namespace: flux-system
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
    networkPolicy: true
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

The operator will reconcile the `FluxInstance` resource and install
the latest Flux stable version with the specified components.

### Enterprise Distribution

To install the FIPS-compliant distribution of Flux, create the following `FluxInstance` resource:

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
    registry: "ghcr.io/controlplaneio-fluxcd/distroless"
    imagePullSecret: "flux-enterprise-auth"
  components:
    - source-controller
    - kustomize-controller
    - helm-controller
    - notification-controller
  cluster:
    type: openshift
    multitenant: true
    networkPolicy: true
    domain: "cluster.local"
  storage:
    class: "standard"
    size: "10Gi"
```

Every hour, the operator will check for updates in the ControlPlane
[distribution repository](https://github.com/controlplaneio-fluxcd/distribution).
If a new patch version is available, the operator will update the Flux components by pinning the
container images to the latest digest published in the ControlPlane registry.

Note that the `flux-enterprise-auth` Kubernetes secret must be created in the `flux-system` namespace
and should contain the credentials to pull the enterprise images:

```shell
kubectl create secret docker-registry flux-enterprise-auth \
  --namespace flux-system \
  --docker-server=ghcr.io \
  --docker-username=flux \
  --docker-password=$ENTERPRISE_TOKEN
```

### Migration of a bootstrap cluster

To migrate a cluster that was bootstrapped, after the flux-operator is installed
and the `FluxInstance` resource is created, the following steps are required:

1. Checkout the branch of the Flux repository that was used to bootstrap the cluster.
2. Replace the contents of the `flux-system/gok-components.yaml` with the `FluxInstance` YAML manifest.
3. Remove all controllers patches from the `flux-system/kustomization.yaml`.
4. Commit and push the changes to the Flux repository.
