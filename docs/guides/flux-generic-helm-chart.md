---
title: Generic Helm Chart Pattern
description: FluxCD GitOps with Generic Helm Charts reference guide
---

# Standardizing App Delivery with Flux and Generic Helm Charts

In this guide we will explore how Flux can be used to standardize the lifecycle management
of applications by leveraging the Generic Helm Chart pattern.

The big promise of this pattern is that it should reduce the cognitive load on developers,
as they only need to focus on the service-specific configuration,
while the Generic Helm Chart shields them from the complexity of the Kubernetes API.

## The Generic Helm Chart Pattern

We've seen the Generic Helm Chart popularity grow among the Flux community, especially in large organizations 
as part of the platform team efforts to provide a consistent deployment experience to developers.
After gathering feedback from the community, we've implemented a couple of features in Flux to make
this pattern easier to implement at scale. Before we dive into the details, let's see why this pattern
is so popular and what are the benefits and pitfalls of using it.

A Generic Helm Chart can help ensure that all workloads are deployed in a consistent
way, with the same configuration options and best practices. A major benefit of this approach
is that it can considerably speed up the bootstrapping process for new services, as developers
can reuse the Helm chart and only focus on the app configuration. Instead of spending
time developing a new Helm chart, developers would only need to add a Flux `HelmRelease` resource
and values files to the Git repository used by Flux to deploy applications across environments.

Another benefit is that a common Helm chart can help implement security and compliance policies
across all workloads. For example, we've seen organizations implementing restricted pod & container
security context, network policies and resource limits. A Generic Helm Chart that contains common
sidecar containers, would speed up considerably the fix of security vulnerabilities across all
services depending on these sidecars.

### One Helm Chart per Service Type

One important aspect is that forcing all services to use the same Helm chart can drive
the complexity of the configuration up, to avoid this, teams should consider creating a common
Helm chart per service type. For example, one Helm chart for all web services developed with Node.js,
one for all services developed with Java, etc. Some technologies might require sidecar containers to 
function properly (e.g. NGINX with PHP-FPM), and this can be easily achieved by adding them to the
common Helm chart dedicated to the PHP services without affecting the other services. Dedicated Helm
charts can also improve the developer experience (DX), the chart values can expose technology-specific
configuration options, such as JVM settings, while also providing sensible defaults specific
to the technology stack.

Having dedicated Helm charts for each service type can improve the maintainability of the charts
and also limit the ownership to the team responsible for a particular technology stack.
We've seen organizations adopting a co-ownership model where the platform team is involved in the
maintenance of all Helm charts, while the development teams are responsible for the
service-specific configuration for the generic Helm charts used by their services.

## Developing Generic Helm Charts

When developing generic Helm charts, teams should consider having a dedicated Git repository for
each chart. Changes to the Helm chart should be made with pull requests which are reviewed
by people from the platform team and development teams.

To ensure the changes are working as expected, teams should consider running unit tests
and end-to-end tests as part of the CI/CD pipeline before merging PRs.
Some popular tools are [helm-unittest](https://github.com/helm-unittest/helm-unittest) and
[chart-testing](https://github.com/helm/chart-testing), the latter being developed and maintained
by the Helm community.

When developing the Helm chart, teams should take in to consideration the following aspects:

- Changes to the Helm chart should be backward compatible, especially when the chart is used by multiple
  services. When structural changes are required to the values file, teams should consider deprecating
  the old values and providing a migration path for the services using the Helm chart. Both old and new
  values should be supported for a certain period of time to allow services to migrate to the new values.
- One pitfall of Helm charts in general is that the configuration options can grow to a point where
  you end up with the whole Kubernetes API mingled in the values file. To avoid this, teams should consider
  using the Flux `HelmRelease` [post rendering feature](https://fluxcd.io/flux/components/helm/helmreleases/#post-renderers)
  to address configuration edge cases instead of adding more configuration options to the Helm chart values.
- A Helm release is a namespace-scoped resource, thus the chart should not contain cluster-scoped resources,
  especially Kubernetes `Namespace` resources. The namespace should be created by the Flux `Kustomization` that
  reconciles the `HelmRelease` resources.
- In general, applications are not consumers of the Kubernetes API, thus the Helm chart should not grant any
  permissions to the application pods. A good practice is to include a dedicated `ServiceAccount` in the Helm chart
  and no `RoleBinding`, and especially no `ClusterRoleBinding`. The dedicated `ServiceAccount` can be useful if the
  application needs to access cloud provider APIs, by leveraging the Kubernetes Workload Identity feature.
- An important aspect is that the Helm chart versioning is completely decoupled from the
  application versioning. This means that the Helm `appVersion` metadata field can no longer be used
  to track the application version. Teams should consider using the application container image
  tag for the `app.kubernetes.io/version` label or have a dedicated field in the Helm chart values
  to track the application version. When implementing observability, teams should consider surfacing
  both the chart version and the application version for each Helm release.

## Pushing Helm Charts to OCI Registry

The release process for the Helm chart should be fully automated based on the Git repository tags in
semver format. When publishing pre-release versions of the Helm chart, teams should consider using the
`X.Y.Z-rc.N` format to indicate that the version is not stable. Note that for Flux to correctly
determine the latest release candidate version, you need to use a dot separator between the `rc`
and the revision number, e.g. `1.0.0-rc.1` and `1.0.0-rc.2`.

The release pipeline involves pushing the Helm chart to a container registry that is 
accessible by the Kubernetes clusters. The registry must support the OCI Artifacts specification
to be able to store Helm charts. Nowadays, most container registries hosted by Cloud
provides support OCI Artifacts, also DockerHub, GitHub, GitLab.
For on-prem, you can choose between: Harbor, Zot, Artifactory, Quay and the Docker distribution.

A typical Helm chart release process involves the following steps:

```shell
# Package the Helm chart
helm package src/my-jmv-chart --version ${GIT_TAG}

# Login to the container registry
helm registry login my-registry.io

# Push the Helm chart to the container registry
helm push my-jvm-chart-${GIT_TAG}.tgz oci://my-registry.io/charts

# Sign the Helm chart
cosign sign my-registry.io/charts/my-jmv-chart:${GIT_TAG}
```

Note that signing the Helm chart is optional, but it's a good practice to ensure the integrity
and provenance of the OCI artifact. Flux supports verifying the Helm chart signature during
the reconciliation process using Sigstore cosign or Notary notation.

## Pulling Helm Charts from OCI Registry with Flux

Starting with Flux v2.3, you can use the `OCIRepository` resource to pull Helm charts from
OCI registries inside the Kubernetes cluster. The `OCIRepository` resource can be referenced
by `HelmRelease` resources to deploy applications.

What's important to note is that the an `OCIRepository` can be reused across multiple `HelmRelease`
resources, which is useful when deploying multiple microservices using the generic Helm chart.

Here is an example of an `OCIRepository` resource that pulls a Helm chart from an OCI registry:

```yaml
apiVersion: source.toolkit.fluxcd.io/v1
kind: OCIRepository
metadata:
  name: my-jvm-chart
  namespace: my-java-apps
spec:
  interval: 10m
  url: oci://my-registry.io/charts/my-jvm-chart
  layerSelector:
    mediaType: "application/vnd.cncf.helm.chart.content.v1.tar+gzip"
    operation: copy
  ref:
    semver: "1.x"
```

With `.spec.ref.semver` we can specify a semver range to match the Helm chart version. This
is useful when we want to automatically pull to the latest version of the Helm chart.
The `.spec.interval` field instructs the controller to check for new chart versions
at a regular interval. When a new version is found, the Flux source-controller
will pull the latest OCI artifact from the registry, which will automatically trigger
Flux helm-controller to perform an upgrade of all the Helm releases referencing the shared `OCIRepository`.

Examples of semver range:

- `*` - matches the latest stable version (pre-releases are excluded)
- `1.0.x` - matches the latest stable patch version of the 1.0.x series
- `1.x` - matches the latest stable minor version of the 1.x series
- `>= 1.0.1 < 1.1.0` - matches the latest stable version greater or equal to 1.0.1 and less than 1.1.0
- `>= 1.0.0-rc.0` - matches the latest version including pre-releases greater or equal to 1.0.0-rc.0
- `1.2.3` - matches the exact version 1.2.3

### Testing pre-release versions

When testing pre-release versions (`X.Y.Z-rc.N`) of the generic Helm chart on staging clusters,
the `.spec.ref.semver` field can be set to a range that matches the pre-release and 
the `.spec.ref.semverFilter` field can be used to filter out the stable versions.

Example of pulling the latest pre-release while filtering out versions that don't contain `-rc`:

```yaml
kind: OCIRepository
spec:
  ref:
    semver: ">= 0.0.0-0"
    semverFilter: ".*-rc.*"
```

### Authenticating to the OCI Registry

Flux supports the following authentication methods for OCI registries:

- Basic authentication with username and password or PAT (e.g. DockerHub, GitHub, Harbour)
- OIDC-based authentication using Kubernetes Workload Identity (e.g. ACR, GAR, ECR)

When using static credentials, a Kubernetes Secret of type `kubernetes.io/dockerconfigjson` must
be created in the same namespace as the `OCIRepository` containing the credentials.

Example of generating a Secret containing GHCR credentials:

```shell
flux create secret oci ghcr-auth \
  --namespace=my-java-apps \
  --url=ghcr.io \
  --username=flux \
  --password=${GITHUB_PAT}
```

The image pull secret can be referenced in the `OCIRepository` spec as follows:

```yaml
kind: OCIRepository
spec:
  provider: generic
  secretRef:
    name: ghcr-auth
```

When running Flux on AKS, EKS, or GKE, you can use the OIDC-based authentication method
by setting the `.spec.provider` field to `azure`, `aws` or `gcp`. For more details on how to
configure Kubernetes Workload Identity, refer to the
[OCIRepository provider documentation](https://fluxcd.io/flux/components/source/ocirepositories/#provider).

### Verifying the Helm Chart Signature

When using signed OCI Artifacts, Flux can verify the signature of the Helm chart
using the following methods:

- Sigstore cosign with static key pair or OIDC-based signing
- Notary notation with static key pair

Example of enabling signature verification for a Helm chart signed with cosign keyless and GitHub OIDC:

```yaml
kind: OCIRepository
spec:
  verify:
    provider: cosign
    matchOIDCIdentity:
      - issuer: "^https://token.actions.githubusercontent.com$"
        subject: "^https://github.com/my-org/my-jvm-chart.*$"
```

For or more details on how to configure signature verification, refer to the
[OCIRepository verification documentation](https://fluxcd.io/flux/components/source/ocirepositories/#verification).

## Deploying Apps from a Generic Helm Chart with Flux

Once the `OCIRepository` is in place, we can reference it in the `HelmRelease` resources
to deploy applications using the common Helm chart.

Here is an example of multiple `HelmRelease` resources that reference the same `OCIRepository`:

```yaml
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: my-java-app1
  namespace: my-java-apps
spec:
  interval: 1h
  releaseName: my-java-app1
  chartRef:
    kind: OCIRepository
    name: my-jvm-chart
  values:
    image:
      repository: my-registry.io/my-java-app1
      tag: 1.0.0
---
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: my-java-app2
  namespace: my-java-apps
spec:
  interval: 1h
  releaseName: my-java-app2
  chartRef:
    kind: OCIRepository
    name: my-jvm-chart
  values:
    image:
      repository: my-registry.io/my-java-app2
      tag: 2.0.0
```

It is recommended to reuse the `OCIRepository` across multiple `HelmRelease` resources
in the same namespace. While Flux allows chart references to other namespaces, it's a good practice
to enabled Flux [multi-tenancy lockdown](https://fluxcd.io/flux/installation/configuration/multitenancy/)
which disables cross-namespace access to sources.

### Passing env-specific values to Helm Releases

Besides setting the image repository and tag values, application-specific values are usually
needed to configure the application on a per-environment basis. To change the values of the
a `HelmRelease` resource based on the target environment (e.g. dev, staging, production),
teams should consider using Kustomize overlays together with Kustomize configmaps and secrets generators.

It is recommended to split the environment-specific values into separate YAML files if sensitive data is involved.
The non-sensitive data can be stored in a plain text `values.yaml` file and passed to the `HelmRelease` as
Kubernetes ConfigMaps generated with Kustomize `configMapGenerator`.
Values like database passwords, API keys, etc. should be stored encrypted in Git using the Flux SOPS integration,
and passed to the `HelmRelease` resources as Kubernetes Secrets generated with Kustomize `secretGenerator`.

Example of a directory structure for managing environment-specific values:

```shell
my-java-apps/
├── base
│   ├── namespace.yaml
│   ├── oci-repository.yaml
│   ├── app1-release.yaml
│   ├── app2-release.yaml
│   └── kustomization.yaml
├── production
│   ├── app1
│   │   ├── values.yaml
│   │   └── values-secrets.yaml
│   ├── app2
│   │   ├── values.yaml
│   │   └── values-secrets.yaml
│   ├── kustomization.yaml
│   └── kustomizeconfig.yaml
└── staging
```

In the `base` directory, the Flux resources are stored, such as the `OCIRepository`
and `HelmRelease` YAML manifests. Passing values from ConfigMaps and Secrets to the
`HelmRelease` resources can be done using the `.spec.valuesFrom` field,
for example:

```yaml
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: my-java-app1
spec:
  valuesFrom:
    - kind: ConfigMap
      name: app1-values
    - kind: Secret
      name: app1-values-secrets
```

In the overlay directories, the environment-specific values are stored. The `kustomization.yaml` file
in the overlay directory should reference the base directory and should generate the ConfigMaps and Secrets
from the values files, for example:

```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: my-java-apps
resources:
  - ../base
configMapGenerator:
  - name: app1-values
    files:
      - values.yaml=app1/values.yaml
secretGenerator:
  - name: app1-values-secrets
    files:
      - values.yaml=app1/values-secrets.yaml
configurations:
  - kustomizeconfig.yaml
```

The `kustomizeconfig.yaml` tells Kustomize how to patch the `HelmRelease` resources with the generated ConfigMaps
and Secrets by appending a unique hash to their names. This ensures that every time a values file changes, the
`HelmRelease` resource is also updated, triggering a new app deployment.

The `kustomizeconfig.yaml` file should look like this:

```yaml
nameReference:
  - kind: ConfigMap
    version: v1
    fieldSpecs:
      - path: spec/valuesFrom/name
        kind: HelmRelease
  - kind: Secret
    version: v1
    fieldSpecs:
      - path: spec/valuesFrom/name
        kind: HelmRelease
```

To deploy the apps on the production cluster, the platform team would
add a Flux Kustomization at `clusters/production/my-java-apps.yaml` with the following content:

```yaml
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: my-java-apps
  namespace: flux-system
spec:
  interval: 10m
  timeout: 5m
  prune: true
  sourceRef:
    kind: GitRepository
    name: flux-system
  path: my-java-apps/production
  targetNamespace: my-java-apps
```

If the `values-secrets.yaml` files are encrypted with SOPS, the platform team should
ensure that SOPS decryption is enabled in the Flux Kustomization. For more details on how to
configure decryption, refer to the
[Flux Kustomization decryption documentation](https://fluxcd.io/flux/components/kustomize/kustomizations/#decryption).

### Passing runtime values to Helm Releases

In some cases, teams might need to pass values known only at runtime to the `HelmRelease` resources.
For example, an application might need to connect to a hosted service in the same region as the cluster.

Assuming that the account ID and region are stored in a Kubernetes ConfigMap created by an IaC
tool like Terraform when provisioning the cluster, for example:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: cluster-info
  namespace: flux-system
data:
  account_id: "123456789012"
  cluster_region: "us-west-2"
```

The account ID and region values can be passed to the `HelmRelease` resources using
the Flux [variable substitution](https://fluxcd.io/flux/components/kustomize/kustomizations/#post-build-variable-substitution)
feature.

In the `HelmRelease` manifests, the account ID and region values can be referenced using the
`${account_id}` and `${cluster_region}` variables, for example:

```yaml
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: my-java-app1
spec:
  values:
    database: "mydb.${account_id}.${cluster_region}.rds.amazonaws.com"
```

The platform team must ensure that the Flux Kustomization that deploys the `HelmRelease` resources
has the `cluster-info` ConfigMap configured as a source of variables, for example:

```yaml
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: my-java-apps
  namespace: flux-system
spec:
  postBuild:
    substituteFrom:
      - kind: ConfigMap
        name: cluster-info
```

### Deploying Helm chart pre-releases on staging

To limit the blast radius of changes to the generic Helm chart, teams should consider deploying
pre-release versions on staging clusters before promoting them to production.

In the staging overlay directory, the `kustomization.yaml` file should contain a patch that
overrides the `.spec.ref` field of the `OCIRepository` to match only pre-release versions:

```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: my-java-apps
resources:
  - ../base
patches:
  - patch: | 
      - op: replace
        path: /spec/ref
        value:
          semver: ">= 0.0.0-0"
          semverFilter: ".*-rc.*"
    target:
      kind: OCIRepository
```

## Automating App Image Updates

One of the downsides of using a common Helm chart is that the application version is no longer
specified in the Helm chart. When a new version of the application is released, to upgrade
the Helm release, an update to the image tag in the `HelmRelease` values is required.

To automate the application upgrades, teams should consider using the Flux Image Automation
feature to automatically update the image tag in the `HelmRelease` YAML manifest stored in the Git repository.

For Flux to update the application image tag, the `HelmRelease` manifests must be annotated with
an image policy marker, for example:

```yaml
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: my-java-app1
spec:
  values:
    image:
      repository: my-registry.io/my-java-app1
      tag: 1.0.0 # {"$imagepolicy": "my-apps-automation:my-java-app1:tag"}
```

When a new image tag is pushed to the container registry, Flux will automatically update the image tag
by committing the change to the Git repository, which will trigger a new deployment of the application
since the desired state has changed.

For each application, an `ImageRepository` and `ImagePolicy` resources should be created to track the image tags.
These resources can be created in a dedicated namespace used for image automation. In that namespace, besides the
`ImageRepository` and `ImagePolicy` of each app, a single `ImageUpdateAutomation` and `GitRepository` resource
should be created for Flux to commit the image tag updates to Git. Note that the token or SSH key used to access
the Git repository should have write access.

Note that the Flux Image Automation controllers don't need to be installed on production clusters. These
controllers and the `ImageRepository`, `ImagePolicy`, `ImageUpdateAutomation` and `GitRepository`
custom resources can be deployed on a management cluster used for automation purposes. One misconception
is that the Flux Image Automation needs to run on the same cluster as the applications, but this is not the case.
The role of these controllers is to scan the container registry for new image tags and update the Git repository,
which can be done from a separate cluster regardless of where the applications are running.

For more details on how to automate image updates to Git, refer to the
[Flux Image Automation documentation](https://fluxcd.io/flux/guides/image-update/).

## Conclusions

In this guide, we've seen how the Generic Helm Chart pattern can be used in a GitOps workflow
leveraging Flux's Helm and OCI Artifacts features. While this pattern can help standardize
the continuous delivery process across multiple teams within large organizations, it's important
to consider the complexity it introduces especially around ownership, versioning and the challenges
of maintaining backward compatibility across multiple services.

Adopting the Generic Helm Chart pattern can be beneficial for organizations that have a large number
of microservices with similar deployment requirements. Applying this pattern to small organization 
with a few services might introduce unnecessary complexity. In this case, teams should consider
using dedicated Helm charts for each service and only share common configuration using Helm libraries.
Having the Helm chart in the same repository as the application code, having a single version for both the
chart and the application, and a unified release process, makes the continuous delivery process more
straightforward and easier to manage.
