# Enterprise Distribution for Flux v2.2.x

- [k8s](#supported-kubernetes-versions)
- [apis](#api-versions)
  - [ga](#general-availability-ga)
  - [beta](#beta-preview)
  - [promotions](#promotions)
- [v2.2.3](#v223)
  - [mainline](#mainline-v223)
  - [FIPS-compliant](#fips-compliant-v223)
- [v2.2.2](#v222)
  - [mainline](#mainline-v222)
  - [FIPS-compliant](#fips-compliant-v222)
- [v2.2.1](#v221)
  - [mainline](#mainline-v221)
  - [FIPS-compliant](#fips-compliant-v221)
- [v2.2.0](#v220)
  - [mainline](#mainline-v220)
  - [FIPS-compliant](#fips-compliant-v220)

## Supported Kubernetes Versions

| Distribution | Versions                                          |
|:-------------|:--------------------------------------------------|
| Kubernetes   | 1.24 <br>1.25 <br>1.26 <br>1.27 <br>1.28 <br>1.29 |
| OpenShift    | 4.12 <br>4.13 <br>4.14 <br>4.15                   |

## API Versions

### General Availability (GA)

| kind                                                                                   | apiVersion                          |
|:---------------------------------------------------------------------------------------|:------------------------------------|
| [GitRepository](https://v2-2.docs.fluxcd.io/flux/components/source/gitrepositories/)   | `source.toolkit.fluxcd.io/v1`       |
| [Kustomization](https://v2-2.docs.fluxcd.io/flux/components/kustomize/kustomizations/) | `kustomize.toolkit.fluxcd.io/v1`    |
| [Receiver](https://v2-2.docs.fluxcd.io/flux/components/notification/receivers/)        | `notification.toolkit.fluxcd.io/v1` |

### Beta (Preview)

| kind                                                                                               | apiVersion                               |
|:---------------------------------------------------------------------------------------------------|:-----------------------------------------|
| [Alert](https://v2-2.docs.fluxcd.io/flux/components/notification/alerts/)                          | `notification.toolkit.fluxcd.io/v1beta3` |
| [Bucket](https://v2-2.docs.fluxcd.io/flux/components/source/buckets/)                              | `source.toolkit.fluxcd.io/v1beta2`       |
| [HelmChart](https://v2-2.docs.fluxcd.io/flux/components/source/helmcharts/)                        | `source.toolkit.fluxcd.io/v1beta2`       |
| [HelmRelease](https://v2-2.docs.fluxcd.io/flux/components/helm/helmreleases/)                      | `helm.toolkit.fluxcd.io/v2beta2`         |
| [HelmRepository](https://v2-2.docs.fluxcd.io/flux/components/source/helmrepositories/)             | `source.toolkit.fluxcd.io/v1beta2`       |
| [ImagePolicy](https://v2-2.docs.fluxcd.io/flux/components/image/imagepolicies/)                    | `image.toolkit.fluxcd.io/v1beta2`        |
| [ImageRepository](https://v2-2.docs.fluxcd.io/flux/components/image/imagerepositories/)            | `image.toolkit.fluxcd.io/v1beta2`        |
| [ImageUpdateAutomation](https://v2-2.docs.fluxcd.io/flux/components/image/imageupdateautomations/) | `image.toolkit.fluxcd.io/v1beta1`        |
| [OCIRepository](https://v2-2.docs.fluxcd.io/flux/components/source/ocirepositories/)               | `source.toolkit.fluxcd.io/v1beta2`       |
| [Provider](https://v2-2.docs.fluxcd.io/flux/components/notification/providers/)                    | `notification.toolkit.fluxcd.io/v1beta3` |

### Promotions

| Kind        | New Version | Deprecated Version | Group                            |
|:------------|:------------|:-------------------|:---------------------------------|
| Alert       | **v1beta3** | v1beta2            | `notification.toolkit.fluxcd.io` |
| Provider    | **v1beta3** | v1beta2            | `notification.toolkit.fluxcd.io` |
| HelmRelease | **v2beta2** | v2beta2            | `helm.toolkit.fluxcd.io`         |


## v2.2.3

Upstream changelog: [fluxcd/flux2 v2.2.3](https://github.com/fluxcd/flux2/releases/tag/v2.2.3)

### Mainline v2.2.3

#### Flux Controllers

| Controller                                                         | Version | Architectures |
|:-------------------------------------------------------------------|---------|---------------|
| `ghcr.io/controlplaneio-fluxcd/alpine/source-controller`           | v1.2.4  | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/alpine/kustomize-controller`        | v1.2.2  | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/alpine/helm-controller`             | v0.37.4 | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/alpine/notification-controller`     | v1.2.4  | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/alpine/image-reflector-controller`  | v0.31.2 | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/alpine/image-automation-controller` | v0.37.1 | amd64 / arm64 |

#### Flux Manifests

| OCI Artifact                                          | Version |
|:------------------------------------------------------|---------|
| `ghcr.io/controlplaneio-fluxcd/alpine/flux-manifests` | v2.2.3  |

### FIPS-compliant v2.2.3

#### Flux Controllers

| Controller                                                              | Version | Architectures |
|:------------------------------------------------------------------------|---------|---------------|
| `ghcr.io/controlplaneio-fluxcd/distroless/source-controller`            | v1.2.4  | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/distroless/kustomize-controller`         | v1.2.2  | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/distroless/helm-controller`              | v0.37.4 | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/distroless/notification-controller`      | v1.2.4  | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/distroless/image-reflector-controller`   | v0.31.2 | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/distroless/image-automation-controller`  | v0.37.1 | amd64 / arm64 |

#### Flux Manifests

| OCI Artifact                                               | Version |
|:-----------------------------------------------------------|---------|
| `ghcr.io/controlplaneio-fluxcd/distroless/flux-manifests`  | v2.2.3  |

## v2.2.2

Upstream changelog: [fluxcd/flux2 v2.2.2](https://github.com/fluxcd/flux2/releases/tag/v2.2.2)

### Mainline v2.2.2

#### Flux Controllers

| Controller                                                         | Version | Architectures |
|:-------------------------------------------------------------------|---------|---------------|
| `ghcr.io/controlplaneio-fluxcd/alpine/source-controller`           | v1.2.3  | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/alpine/kustomize-controller`        | v1.2.1  | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/alpine/helm-controller`             | v0.37.2 | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/alpine/notification-controller`     | v1.2.3  | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/alpine/image-reflector-controller`  | v0.31.1 | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/alpine/image-automation-controller` | v0.37.0 | amd64 / arm64 |

#### Flux Manifests

| OCI Artifact                                          | Version |
|:------------------------------------------------------|---------|
| `ghcr.io/controlplaneio-fluxcd/alpine/flux-manifests` | v2.2.2  |

### FIPS-compliant v2.2.2

#### Flux Controllers

| Controller                                                              | Version | Architectures |
|:------------------------------------------------------------------------|---------|---------------|
| `ghcr.io/controlplaneio-fluxcd/distroless/source-controller`            | v1.2.3  | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/distroless/kustomize-controller`         | v1.2.1  | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/distroless/helm-controller`              | v0.37.2 | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/distroless/notification-controller`      | v1.2.3  | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/distroless/image-reflector-controller`   | v0.31.1 | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/distroless/image-automation-controller`  | v0.37.0 | amd64 / arm64 |

#### Flux Manifests

| OCI Artifact                                               | Version |
|:-----------------------------------------------------------|---------|
| `ghcr.io/controlplaneio-fluxcd/distroless/flux-manifests`  | v2.2.2  |

## v2.2.1

Upstream changelog: [fluxcd/flux2 v2.2.1](https://github.com/fluxcd/flux2/releases/tag/v2.2.1)

### Mainline v2.2.1

#### Flux Controllers

| Controller                                                         | Version | Architectures |
|:-------------------------------------------------------------------|---------|---------------|
| `ghcr.io/controlplaneio-fluxcd/alpine/source-controller`           | v1.2.3  | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/alpine/kustomize-controller`        | v1.2.1  | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/alpine/helm-controller`             | v0.37.1 | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/alpine/notification-controller`     | v1.2.3  | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/alpine/image-reflector-controller`  | v0.31.1 | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/alpine/image-automation-controller` | v0.37.0 | amd64 / arm64 |

#### Flux Manifests

| OCI Artifact                                          | Version |
|:------------------------------------------------------|---------|
| `ghcr.io/controlplaneio-fluxcd/alpine/flux-manifests` | v2.2.1  |

### FIPS-compliant v2.2.1

#### Flux Controllers

| Controller                                                              | Version | Architectures |
|:------------------------------------------------------------------------|---------|---------------|
| `ghcr.io/controlplaneio-fluxcd/distroless/source-controller`            | v1.2.3  | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/distroless/kustomize-controller`         | v1.2.1  | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/distroless/helm-controller`              | v0.37.1 | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/distroless/notification-controller`      | v1.2.3  | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/distroless/image-reflector-controller`   | v0.31.1 | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/distroless/image-automation-controller`  | v0.37.0 | amd64 / arm64 |

#### Flux Manifests

| OCI Artifact                                               | Version |
|:-----------------------------------------------------------|---------|
| `ghcr.io/controlplaneio-fluxcd/distroless/flux-manifests`  | v2.2.1  |

## v2.2.0

Upstream changelog: [fluxcd/flux2 v2.2.0](https://github.com/fluxcd/flux2/releases/tag/v2.2.0)

### Mainline v2.2.0

#### Flux Controllers

| Controller                                                         | Version | Architectures |
|:-------------------------------------------------------------------|---------|---------------|
| `ghcr.io/controlplaneio-fluxcd/alpine/source-controller`           | v1.2.2  | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/alpine/kustomize-controller`        | v1.2.0  | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/alpine/helm-controller`             | v0.37.0 | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/alpine/notification-controller`     | v1.2.2  | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/alpine/image-reflector-controller`  | v0.31.1 | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/alpine/image-automation-controller` | v0.37.0 | amd64 / arm64 |

#### Flux Manifests

| OCI Artifact                                          | Version |
|:------------------------------------------------------|---------|
| `ghcr.io/controlplaneio-fluxcd/alpine/flux-manifests` | v2.2.0  |

### FIPS-compliant v2.2.0

#### Flux Controllers

| Controller                                                              | Version | Architectures |
|:------------------------------------------------------------------------|---------|---------------|
| `ghcr.io/controlplaneio-fluxcd/distroless/source-controller`            | v1.2.2  | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/distroless/kustomize-controller`         | v1.2.0  | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/distroless/helm-controller`              | v0.37.0 | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/distroless/notification-controller`      | v1.2.2  | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/distroless/image-reflector-controller`   | v0.31.1 | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/distroless/image-automation-controller`  | v0.37.0 | amd64 / arm64 |

#### Flux Manifests

| OCI Artifact                                               | Version |
|:-----------------------------------------------------------|---------|
| `ghcr.io/controlplaneio-fluxcd/distroless/flux-manifests`  | v2.2.0  |
