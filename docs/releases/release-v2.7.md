# Enterprise Distribution for Flux v2.7.x

## Supported Kubernetes Versions

| Distribution | Versions                                          |
|:-------------|:--------------------------------------------------|
| Kubernetes   | 1.29 <br>1.30 <br>1.31 <br>1.32 <br>1.33 <br>1.34 |
| OpenShift    | 4.16 <br>4.17 <br>4.18 <br>4.19                   |

## API Versions

### General Availability (GA)

| kind                                                                                               | apiVersion                          |
|:---------------------------------------------------------------------------------------------------|:------------------------------------|
| [Bucket](https://v2-7.docs.fluxcd.io/flux/components/source/buckets/)                              | `source.toolkit.fluxcd.io/v1`       |
| [GitRepository](https://v2-7.docs.fluxcd.io/flux/components/source/gitrepositories/)               | `source.toolkit.fluxcd.io/v1`       |
| [HelmChart](https://v2-7.docs.fluxcd.io/flux/components/source/helmcharts/)                        | `source.toolkit.fluxcd.io/v1`       |
| [HelmRelease](https://v2-7.docs.fluxcd.io/flux/components/helm/helmreleases/)                      | `helm.toolkit.fluxcd.io/v2`         |
| [HelmRepository](https://v2-7.docs.fluxcd.io/flux/components/source/helmrepositories/)             | `source.toolkit.fluxcd.io/v1`       |
| [ImagePolicy](https://v2-7.docs.fluxcd.io/flux/components/image/imagepolicies/)                    | `image.toolkit.fluxcd.io/v1`        |
| [ImageRepository](https://v2-7.docs.fluxcd.io/flux/components/image/imagerepositories/)            | `image.toolkit.fluxcd.io/v1`        |
| [ImageUpdateAutomation](https://v2-7.docs.fluxcd.io/flux/components/image/imageupdateautomations/) | `image.toolkit.fluxcd.io/v1`        |
| [Kustomization](https://v2-7.docs.fluxcd.io/flux/components/kustomize/kustomizations/)             | `kustomize.toolkit.fluxcd.io/v1`    |
| [OCIRepository](https://v2-7.docs.fluxcd.io/flux/components/source/ocirepositories/)               | `source.toolkit.fluxcd.io/v1`       |
| [Receiver](https://v2-7.docs.fluxcd.io/flux/components/notification/receivers/)                    | `notification.toolkit.fluxcd.io/v1` |

### Beta (Preview)

| kind                                                                                        | apiVersion                               |
|:--------------------------------------------------------------------------------------------|:-----------------------------------------|
| [Alert](https://v2-7.docs.fluxcd.io/flux/components/notification/alerts/)                   | `notification.toolkit.fluxcd.io/v1beta3` |
| [Provider](https://v2-7.docs.fluxcd.io/flux/components/notification/providers/)             | `notification.toolkit.fluxcd.io/v1beta3` |
| [ArtifactGenerator](https://v2-7.docs.fluxcd.io/flux/components/source/artifactgenerators/) | `source.extensions.fluxcd.io/v1beta1`    |

## v2.7.2

Upstream changelog: [fluxcd/flux2 v2.7.2](https://github.com/fluxcd/flux2/releases/tag/v2.7.2)

### Mainline v2.7.2

#### Flux Controllers

| Controller                                                         | Version | Architectures |
|:-------------------------------------------------------------------|---------|---------------|
| `ghcr.io/controlplaneio-fluxcd/alpine/source-controller`           | v1.7.2  | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/alpine/source-watcher`              | v2.0.2  | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/alpine/kustomize-controller`        | v1.7.1  | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/alpine/helm-controller`             | v1.4.2  | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/alpine/notification-controller`     | v1.7.3  | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/alpine/image-reflector-controller`  | v1.0.2  | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/alpine/image-automation-controller` | v1.0.2  | amd64 / arm64 |

#### Flux Manifests

| OCI Artifact                                          | Version |
|:------------------------------------------------------|---------|
| `ghcr.io/controlplaneio-fluxcd/alpine/flux-manifests` | v2.7.2  |

### FIPS-compliant v2.7.2

#### Flux Controllers

| Controller                                                             | Version | Architectures |
|:-----------------------------------------------------------------------|---------|---------------|
| `ghcr.io/controlplaneio-fluxcd/distroless/source-controller`           | v1.7.2  | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/distroless/source-watcher`              | v2.0.2  | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/distroless/kustomize-controller`        | v1.7.1  | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/distroless/helm-controller`             | v1.4.2  | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/distroless/notification-controller`     | v1.7.3  | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/distroless/image-reflector-controller`  | v1.0.2  | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/distroless/image-automation-controller` | v1.0.2  | amd64 / arm64 |

#### Flux Controllers for AWS Marketplace

| Controller                                                                                     | Version | Architectures |
|:-----------------------------------------------------------------------------------------------|---------|---------------|
| `709825985650.dkr.ecr.us-east-1.amazonaws.com/controlplane/fluxcd/source-controller`           | v1.7.2  | amd64 / arm64 |
| `709825985650.dkr.ecr.us-east-1.amazonaws.com/controlplane/fluxcd/source-watcher`              | v2.0.2  | amd64 / arm64 |
| `709825985650.dkr.ecr.us-east-1.amazonaws.com/controlplane/fluxcd/kustomize-controller`        | v1.7.1  | amd64 / arm64 |
| `709825985650.dkr.ecr.us-east-1.amazonaws.com/controlplane/fluxcd/helm-controller`             | v1.4.2  | amd64 / arm64 |
| `709825985650.dkr.ecr.us-east-1.amazonaws.com/controlplane/fluxcd/notification-controller`     | v1.7.3  | amd64 / arm64 |
| `709825985650.dkr.ecr.us-east-1.amazonaws.com/controlplane/fluxcd/image-reflector-controller`  | v1.0.2  | amd64 / arm64 |
| `709825985650.dkr.ecr.us-east-1.amazonaws.com/controlplane/fluxcd/image-automation-controller` | v1.0.2  | amd64 / arm64 |

#### Flux Manifests

| OCI Artifact                                               | Version |
|:-----------------------------------------------------------|---------|
| `ghcr.io/controlplaneio-fluxcd/distroless/flux-manifests`  | v2.7.2  |

## v2.7.1

Upstream changelog: [fluxcd/flux2 v2.7.1](https://github.com/fluxcd/flux2/releases/tag/v2.7.1)

### Mainline v2.7.1

#### Flux Controllers

| Controller                                                         | Version | Architectures |
|:-------------------------------------------------------------------|---------|---------------|
| `ghcr.io/controlplaneio-fluxcd/alpine/source-controller`           | v1.7.1  | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/alpine/source-watcher`              | v2.0.1  | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/alpine/kustomize-controller`        | v1.7.0  | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/alpine/helm-controller`             | v1.4.1  | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/alpine/notification-controller`     | v1.7.2  | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/alpine/image-reflector-controller`  | v1.0.1  | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/alpine/image-automation-controller` | v1.0.1  | amd64 / arm64 |

#### Flux Manifests

| OCI Artifact                                          | Version |
|:------------------------------------------------------|---------|
| `ghcr.io/controlplaneio-fluxcd/alpine/flux-manifests` | v2.7.1  |

### FIPS-compliant v2.7.1

#### Flux Controllers

| Controller                                                             | Version | Architectures |
|:-----------------------------------------------------------------------|---------|---------------|
| `ghcr.io/controlplaneio-fluxcd/distroless/source-controller`           | v1.7.1  | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/distroless/source-watcher`              | v2.0.1  | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/distroless/kustomize-controller`        | v1.7.0  | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/distroless/helm-controller`             | v1.4.1  | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/distroless/notification-controller`     | v1.7.2  | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/distroless/image-reflector-controller`  | v1.0.1  | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/distroless/image-automation-controller` | v1.0.1  | amd64 / arm64 |

#### Flux Controllers for AWS Marketplace

| Controller                                                                                     | Version | Architectures |
|:-----------------------------------------------------------------------------------------------|---------|---------------|
| `709825985650.dkr.ecr.us-east-1.amazonaws.com/controlplane/fluxcd/source-controller`           | v1.7.1  | amd64 / arm64 |
| `709825985650.dkr.ecr.us-east-1.amazonaws.com/controlplane/fluxcd/source-watcher`              | v2.0.1  | amd64 / arm64 |
| `709825985650.dkr.ecr.us-east-1.amazonaws.com/controlplane/fluxcd/kustomize-controller`        | v1.7.0  | amd64 / arm64 |
| `709825985650.dkr.ecr.us-east-1.amazonaws.com/controlplane/fluxcd/helm-controller`             | v1.4.1  | amd64 / arm64 |
| `709825985650.dkr.ecr.us-east-1.amazonaws.com/controlplane/fluxcd/notification-controller`     | v1.7.2  | amd64 / arm64 |
| `709825985650.dkr.ecr.us-east-1.amazonaws.com/controlplane/fluxcd/image-reflector-controller`  | v1.0.1  | amd64 / arm64 |
| `709825985650.dkr.ecr.us-east-1.amazonaws.com/controlplane/fluxcd/image-automation-controller` | v1.0.1  | amd64 / arm64 |

#### Flux Manifests

| OCI Artifact                                               | Version |
|:-----------------------------------------------------------|---------|
| `ghcr.io/controlplaneio-fluxcd/distroless/flux-manifests`  | v2.7.1  |

## v2.7.0

Upstream changelog: [fluxcd/flux2 v2.7.0](https://github.com/fluxcd/flux2/releases/tag/v2.7.0)

### Mainline v2.7.0

#### Flux Controllers

| Controller                                                         | Version | Architectures |
|:-------------------------------------------------------------------|---------|---------------|
| `ghcr.io/controlplaneio-fluxcd/alpine/source-controller`           | v1.7.0  | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/alpine/source-watcher`              | v2.0.1  | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/alpine/kustomize-controller`        | v1.7.0  | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/alpine/helm-controller`             | v1.4.0  | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/alpine/notification-controller`     | v1.7.1  | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/alpine/image-reflector-controller`  | v1.0.1  | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/alpine/image-automation-controller` | v1.0.1  | amd64 / arm64 |

#### Flux Manifests

| OCI Artifact                                          | Version |
|:------------------------------------------------------|---------|
| `ghcr.io/controlplaneio-fluxcd/alpine/flux-manifests` | v2.7.0  |

### FIPS-compliant v2.7.0

#### Flux Controllers

| Controller                                                             | Version | Architectures |
|:-----------------------------------------------------------------------|---------|---------------|
| `ghcr.io/controlplaneio-fluxcd/distroless/source-controller`           | v1.7.0  | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/distroless/source-watcher`              | v2.0.1  | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/distroless/kustomize-controller`        | v1.7.0  | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/distroless/helm-controller`             | v1.4.0  | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/distroless/notification-controller`     | v1.7.1  | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/distroless/image-reflector-controller`  | v1.0.1  | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/distroless/image-automation-controller` | v1.0.1  | amd64 / arm64 |

#### Flux Controllers for AWS Marketplace

| Controller                                                                                     | Version | Architectures |
|:-----------------------------------------------------------------------------------------------|---------|---------------|
| `709825985650.dkr.ecr.us-east-1.amazonaws.com/controlplane/fluxcd/source-controller`           | v1.7.0  | amd64 / arm64 |
| `709825985650.dkr.ecr.us-east-1.amazonaws.com/controlplane/fluxcd/source-watcher`              | v2.0.1  | amd64 / arm64 |
| `709825985650.dkr.ecr.us-east-1.amazonaws.com/controlplane/fluxcd/kustomize-controller`        | v1.7.0  | amd64 / arm64 |
| `709825985650.dkr.ecr.us-east-1.amazonaws.com/controlplane/fluxcd/helm-controller`             | v1.4.0  | amd64 / arm64 |
| `709825985650.dkr.ecr.us-east-1.amazonaws.com/controlplane/fluxcd/notification-controller`     | v1.7.1  | amd64 / arm64 |
| `709825985650.dkr.ecr.us-east-1.amazonaws.com/controlplane/fluxcd/image-reflector-controller`  | v1.0.1  | amd64 / arm64 |
| `709825985650.dkr.ecr.us-east-1.amazonaws.com/controlplane/fluxcd/image-automation-controller` | v1.0.1  | amd64 / arm64 |

#### Flux Manifests

| OCI Artifact                                               | Version |
|:-----------------------------------------------------------|---------|
| `ghcr.io/controlplaneio-fluxcd/distroless/flux-manifests`  | v2.7.0  |
