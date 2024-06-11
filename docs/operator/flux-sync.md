# Flux Sync Configuration

The `FluxInstance` resource can be configured to instruct the operator to generate
a Flux source (`GitRepository`, `OCIRepository` or `Bucket`) and a Flux `Kustomization`
to sync the cluster state with the source repository.

The Flux objects are created in the same namespace where the `FluxInstance` is deployed
using the namespace name as the Flux source and Kustomization name. The naming convention
matches the one used by `flux bootstrap` to ensure compatibility with upstream, and
to allow transitioning a bootstrapped cluster to a `FluxInstance` managed one.

## Sync from a Git repository

To sync the cluster state from a Git repository, add the following configuration to the `FluxInstance`:

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
  sync:
    kind: GitRepository
    url: "https://github.com/my-org/my-fleet.git"
    ref: "refs/heads/main"
    path: "clusters/my-cluster"
    pullSecret: "flux-system"
```

If the source repository is private, the Kubernetes secret must be created in the `flux-system` namespace
and should contain the credentials to clone the repository:

```shell
flux create secret git flux-system \
  --url=https://github.com/my-org/my-fleet.git \
  --username=git \
  --password=$GITHUB_TOKEN
```

## Sync from a container registry

To sync the cluster state from a container registry where the Kubernetes manifests
are pushed as OCI artifacts using `flux push artifact`:

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
  sync:
    kind: OCIRepository
    url: "oci://ghcr.io/my-org/my-fleet-manifests"
    ref: "latest"
    path: "clusters/my-cluster"
    pullSecret: "flux-system"
```

If the container registry is private, the Kubernetes secret must be created
in the same namespace where the `FluxInstance` is deployed,
and be of type `kubernetes.io/dockerconfigjson`:

```shell
flux create secret oci flux-system \
  --namespace flux-system \
  --url=ghcr.io \
  --username=flux \
  --password=$GITHUB_TOKEN
```

To find out more about the available configuration options, refer to the
[FluxInstance API reference](fluxinstance.md).
