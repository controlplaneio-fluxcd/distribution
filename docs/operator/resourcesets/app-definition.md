# Using ResourceSets for Application Definitions

The ResourceSet API allows bundling a set of Kubernetes resources
(Flux HelmRelease, OCIRepository, Alert, Provider, Receiver, Kubernetes Namespace, ServiceAccount, etc)
into a single deployable unit that can be templated and parameterized.

Use cases of ResourceSet include:

**Multi-instance provisioning** - Generate multiple instances of the same application
in a cluster with different configurations.

**Multi-cluster provisioning** - Generate multiple instances of the same application for
each target cluster that are deployed by Flux from a management cluster.

**Multi-tenancy provisioning** - Generate a set of resources
(Namespace, ServiceAccount, RoleBinding, Flux GitRepository, Kustomization) for each tenant
with specific roles and permissions to simplify the onboarding of new tenants
and their applications on a shared cluster.

**Dependency management** - Define dependencies between apps to ensure that the resources
are applied in the correct order. The dependencies are more flexible  than in Flux,
they can be for other ResourceSets, CRDs, or any other Kubernetes object.
When defining dependencies, these can be for checking the existence of a resource
or for waiting for a resource to be ready. To evaluate the readiness of a dependent resource,
users can specify a CEL expression that is evaluated against the resource status.

## Multi-instance example

While bundling resources is possible with Flux HelmReleases and Kustomize overlays, the ResourceSet API
can drastically reduce the amount of files and overlays needed to manage multiple instances of the same application.

With Kustomize overlays the following structure is needed to deploy an app instance
per tenant with different Helm values:

```text
apps/
└── app1
    ├── base
    │   ├── flux-helm-release.yaml
    │   ├── flux-oci-repository.yaml
    │   └── kustomization.yaml
    ├── overlays
    │   ├── tenant1
    │   │   ├── kustomization.yaml
    │   │   ├── values-patch.yaml
    │   │   └── version-patch.yaml
    │   └── tenant2
    │       ├── kustomization.yaml
    │       ├── values-patch.yaml
    │       └── version-patch.yaml
    └── bundle
        └── kustomization.yaml
```

Using a ResourceSet, the same can be achieved with a single file:

```yaml
apiVersion: fluxcd.controlplane.io/v1
kind: ResourceSet
metadata:
  name: app1
  namespace: apps
spec:
  inputs:
    - tenant: "tenant1"
      app:
       version: "6.7.x"
       replicas: 2
    - tenant: "tenant2"
      app:
       version: "6.6.x"
       replicas: 3
  resources:
    - apiVersion: source.toolkit.fluxcd.io/v1beta2
      kind: OCIRepository
      metadata:
        name: app1-<< inputs.tenant >>
        namespace: apps
      spec:
        interval: 10m
        url: oci://my.registry/org/charts/app1
        ref:
          semver: << inputs.app.version | quote >>
    - apiVersion: helm.toolkit.fluxcd.io/v2
      kind: HelmRelease
      metadata:
        name: app1-<< inputs.tenant >>
        namespace: apps
      spec:
        interval: 1h
        releaseName: app1-<< inputs.tenant >>
        chartRef:
          kind: OCIRepository
          name: app1-<< inputs.tenant >>
        values:
          replicaCount: << inputs.app.replicas | int >>
```

## Multi-cluster example

When deploying applications across multiple environments from a management cluster, the ResourceSet API
can simplify the definition of the application and its customization for each target cluster.

With Kustomize overlays the following structure is needed to deploy an app instance
per environment:

```text
apps/
└── app1
    ├── base
    │   ├── flux-kustomization.yaml
    │   ├── flux-git-repository.yaml
    │   └── kustomization.yaml
    ├── overlays
    │   ├── dev
    │   │   ├── kustomization.yaml
    │   │   ├── vars-patch.yaml
    │   │   └── kubeconfig-patch.yaml
    │   └── production
    │       ├── kustomization.yaml
    │       ├── vars-patch.yaml
    │       └── kubeconfig-patch.yaml
    └── bundle
        └── kustomization.yaml
```

Using a ResourceSet, the same can be achieved with a single file:

```yaml
apiVersion: fluxcd.controlplane.io/v1
kind: ResourceSet
metadata:
  name: app1
  namespace: apps
spec:
  inputs:
    - cluster: "dev"
      branch: "main"
      ingress: "app1.dev.example.com"
    - cluster: "production"
      branch: "prod"
      ingress: "app1.example.com"
  resources:
    - apiVersion: source.toolkit.fluxcd.io/v1
      kind: GitRepository
      metadata:
        name: app1-<< inputs.cluster >>
        namespace: apps
      spec:
        interval: 5m
        url: https://my.git/org/app1-deploy
        ref:
          branch: << inputs.branch >>
    - apiVersion: kustomize.toolkit.fluxcd.io/v1
      kind: Kustomization
      metadata:
        name: app1-<< inputs.cluster >>
        namespace: apps
      spec:
        interval: 10m
        prune: true
        path: "./deploy"
        sourceRef:
          kind: GitRepository
          name: app1-<< inputs.cluster >>
        postBuild:
          substitute:
            domain: << inputs.ingress >>
        kubeConfig:
          secretRef:
            name: << inputs.cluster >>-kubeconfig
```

## Monorepo example

When an application is composed of multiple microservices, the ResourceSet API can be used
to define the deployment of each component and the rollout order based on dependencies.

Assuming the following directory structure in a monorepo where the Kubernetes resources
are templated using Flux variables:

```text
deploy/
├── frontend
│   ├── deployment.yaml
│   ├── ingress.yaml
│   └── service.yaml
├── backend
│   ├── deployment.yaml
│   └── service.yaml
└── database
    ├── deployment.yaml
    ├── pvc.yaml
    └── service.yaml
```

Using a ResourceSet, we can generate one GitRepository that points to the monorepo,
and a set of Flux Kustomizations one for each component that depends on the previous one:

```yaml
apiVersion: fluxcd.controlplane.io/v1
kind: ResourceSet
metadata:
  name: app1
  namespace: apps
spec:
  inputs:
    - service: "frontend"
      dependsOn: "backend"
    - service: "backend"
      dependsOn: "database"
    - service: "database"
      dependsOn: ""
  resourcesTemplate: |
    ---
    apiVersion: source.toolkit.fluxcd.io/v1
    kind: GitRepository
    metadata:
      name: app1
      namespace: apps
    spec:
      interval: 5m
      url: https://my.git/org/app1-deploy
      ref:
        branch: main
    ---
    apiVersion: kustomize.toolkit.fluxcd.io/v1
    kind: Kustomization
    metadata:
      name: app1-<< inputs.service >>
      namespace: apps
    spec:
      << if inputs.dependsOn >>
      dependsOn:
        - name: app1-<< inputs.dependsOn >>
      << end >>
      path: "./deploy/<< inputs.service >>"
      interval: 30m
      retryInterval: 5m
      prune: true
      wait: true
      timeout: 5m
      sourceRef:
        kind: GitRepository
        name: app1
      postBuild:
        substituteFrom:
          - kind: ConfigMap
            name: app1-vars
```

## Working with ResourceSets

When working with ResourceSets, you can use the Flux Operator CLI for building ResourceSet
templates locally and for listing, reconciling, suspending and resuming ResourceSets in-cluster.

The Flux Operator CLI is available as a binary executable for Linux, macOS and Windows.
The AMD64 and ARM64 binaries can be downloaded from
GitHub [releases page](https://github.com/controlplaneio-fluxcd/flux-operator/releases).

The following commands are available:

```shell
# Build the given ResourceSet and print the generated objects
flux-operator build resourceset -f my-resourceset.yaml

# Build a ResourceSet by providing the inputs from a file
flux-operator build resourceset -f my-resourceset.yaml \
  --inputs-from my-resourceset-inputs.yaml

# Pipe the ResourceSet manifest to the build command
cat my-resourceset.yaml | flux-operator build rset -f -

# Build a ResourceSet and print a diff of the generated objects
flux-operator build resourceset -f my-resourceset.yaml | \
  kubectl diff --server-side --field-manager=flux-operator -f -

# List all ResourceSets in the cluster
flux-operator get rset --all-namespaces

# Reconcile a ResourceSet 
flux-operator -n apps reconcile rset podinfo

# Suspend a ResourceSet 
flux-operator -n apps suspend rset podinfo

# Resume a ResourceSet 
flux-operator -n apps resume rset podinfo
```

## Further reading

To learn more about the ResourceSet API, its templating capabilities and dependency management,
see the [ResourceSet API reference](../resourceset.md).
