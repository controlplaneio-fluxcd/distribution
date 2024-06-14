# Flux Bootstrap Migration

Assuming you have a cluster bootstrapped with the Flux CLI or the Terraform Provider,
you can migrate to an operator-managed Flux with zero downtime.

## Install the Flux Operator

Install the Flux Operator in the same namespace where Flux is deployed, for example using Helm:

```shell
helm install flux-operator oci://ghcr.io/controlplaneio-fluxcd/charts/flux-operator \
  --namespace flux-system
```

Or by using an alternative installation method described in the [installation guide](install.md).

## Create a Flux Instance

Create a `FluxInstance` resource named **flux** in the `flux-system` namespace using
the same configuration as for `flux bootstrap`. 

For example, if you have bootstrapped the cluster with the following command:

```shell
flux bootstrap github \
  --owner=my-org \
  --repository=my-fleet \
  --branch=main \
  --path=clusters/my-cluster
```

The equivalent `FluxInstance` configuration would look like this:

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
  cluster:
    type: kubernetes
    multitenant: false
    networkPolicy: true
    domain: "cluster.local"
  sync:
    kind: GitRepository
    url: "ssh://git@github.com/my-org/my-fleet.git"
    ref: "refs/heads/main"
    path: "clusters/my-cluster"
    pullSecret: "flux-system"
```

!!! note "Kustomize patches"

    Note that if you have customized the Flux manifests, you should copy the Kustomize patches
    from `flux-system/kustomization.yaml` in the `FluxInstance` under `.spec.kustomize.patches`.
    For more information, see the [instance customization guide](flux-kustomize.md).

Apply the `FluxInstance` resource to the cluster:

```shell
kubectl apply -f flux-instance.yaml
```

Once the resource is reconciled, the operator will take over the management of the Flux components,
the Flux GitRepository and Kustomization.

To verify that the migration was successful, check the status of the `FluxInstance`:

```shell
kubectl -n flux-system get fluxinstance flux
```

Running the trace command should result in a "Not managed by Flux" message:

```shell
flux trace kustomization flux-system
```

## Cleanup the repository

To finalize the migration, remove the Flux manifests from the Git repository:

1. Checkout the main branch of the Flux repository that was used to bootstrap the cluster.
2. Delete the `flux-system` directory from the repository `clusters/my-cluster` directory.
3. Optionally, place the `FluxInstance` YAML manifest in the `clusters/my-cluster` directory.
4. Commit and push the changes to the Flux repository.
