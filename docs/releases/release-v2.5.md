# Enterprise Distribution for Flux v2.5.x

## Supported Kubernetes Versions

| Distribution | Versions                                          |
|:-------------|:--------------------------------------------------|
| Kubernetes   | 1.27 <br>1.28 <br>1.29 <br>1.30 <br>1.31 <br>1.32 |
| OpenShift    | 4.12 <br>4.13 <br>4.14 <br>4.15 <br>4.16 <br>4.17 |

## API Versions

### General Availability (GA)

| kind                                                                                   | apiVersion                          |
|:---------------------------------------------------------------------------------------|:------------------------------------|
| [GitRepository](https://v2-5.docs.fluxcd.io/flux/components/source/gitrepositories/)   | `source.toolkit.fluxcd.io/v1`       |
| [HelmChart](https://v2-5.docs.fluxcd.io/flux/components/source/helmcharts/)            | `source.toolkit.fluxcd.io/v1`       |
| [HelmRelease](https://v2-5.docs.fluxcd.io/flux/components/helm/helmreleases/)          | `helm.toolkit.fluxcd.io/v2`         |
| [HelmRepository](https://v2-5.docs.fluxcd.io/flux/components/source/helmrepositories/) | `source.toolkit.fluxcd.io/v1`       |
| [Bucket](https://v2-5.docs.fluxcd.io/flux/components/source/buckets/)                  | `source.toolkit.fluxcd.io/v1`       |
| [Kustomization](https://v2-5.docs.fluxcd.io/flux/components/kustomize/kustomizations/) | `kustomize.toolkit.fluxcd.io/v1`    |
| [Receiver](https://v2-5.docs.fluxcd.io/flux/components/notification/receivers/)        | `notification.toolkit.fluxcd.io/v1` |

### Beta (Preview)

| kind                                                                                               | apiVersion                               |
|:---------------------------------------------------------------------------------------------------|:-----------------------------------------|
| [Alert](https://v2-5.docs.fluxcd.io/flux/components/notification/alerts/)                          | `notification.toolkit.fluxcd.io/v1beta3` |
| [ImagePolicy](https://v2-5.docs.fluxcd.io/flux/components/image/imagepolicies/)                    | `image.toolkit.fluxcd.io/v1beta2`        |
| [ImageRepository](https://v2-5.docs.fluxcd.io/flux/components/image/imagerepositories/)            | `image.toolkit.fluxcd.io/v1beta2`        |
| [ImageUpdateAutomation](https://v2-5.docs.fluxcd.io/flux/components/image/imageupdateautomations/) | `image.toolkit.fluxcd.io/v1beta2`        |
| [OCIRepository](https://v2-5.docs.fluxcd.io/flux/components/source/ocirepositories/)               | `source.toolkit.fluxcd.io/v1beta2`       |
| [Provider](https://v2-5.docs.fluxcd.io/flux/components/notification/providers/)                    | `notification.toolkit.fluxcd.io/v1beta3` |

## v2.5.0

Upstream changelog: [fluxcd/flux2 v2.5.0](https://github.com/fluxcd/flux2/releases/tag/v2.5.0)

### Mainline v2.5.0

#### Flux Controllers

| Controller                                                         | Version | Architectures |
|:-------------------------------------------------------------------|---------|---------------|
| `ghcr.io/controlplaneio-fluxcd/alpine/source-controller`           | v1.5.0  | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/alpine/kustomize-controller`        | v1.5.0  | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/alpine/helm-controller`             | v1.2.0  | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/alpine/notification-controller`     | v1.5.0  | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/alpine/image-reflector-controller`  | v0.34.0 | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/alpine/image-automation-controller` | v0.40.0 | amd64 / arm64 |

#### Flux Manifests

| OCI Artifact                                          | Version |
|:------------------------------------------------------|---------|
| `ghcr.io/controlplaneio-fluxcd/alpine/flux-manifests` | v2.5.0  |

### FIPS-compliant v2.5.0

#### Flux Controllers

| Controller                                                              | Version | Architectures |
|:------------------------------------------------------------------------|---------|---------------|
| `ghcr.io/controlplaneio-fluxcd/distroless/source-controller`            | v1.5.0  | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/distroless/kustomize-controller`         | v1.5.0  | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/distroless/helm-controller`              | v1.2.0  | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/distroless/notification-controller`      | v1.5.0  | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/distroless/image-reflector-controller`   | v0.34.0 | amd64 / arm64 |
| `ghcr.io/controlplaneio-fluxcd/distroless/image-automation-controller`  | v0.40.0 | amd64 / arm64 |

#### Flux Controllers for AWS Marketplace

| Controller                                                                                     | Version | Architectures |
|:-----------------------------------------------------------------------------------------------|---------|---------------|
| `709825985650.dkr.ecr.us-east-1.amazonaws.com/controlplane/fluxcd/source-controller`           | v1.5.0  | amd64 / arm64 |
| `709825985650.dkr.ecr.us-east-1.amazonaws.com/controlplane/fluxcd/kustomize-controller`        | v1.5.0  | amd64 / arm64 |
| `709825985650.dkr.ecr.us-east-1.amazonaws.com/controlplane/fluxcd/helm-controller`             | v1.2.0  | amd64 / arm64 |
| `709825985650.dkr.ecr.us-east-1.amazonaws.com/controlplane/fluxcd/notification-controller`     | v1.5.0  | amd64 / arm64 |
| `709825985650.dkr.ecr.us-east-1.amazonaws.com/controlplane/fluxcd/image-reflector-controller`  | v0.34.0 | amd64 / arm64 |
| `709825985650.dkr.ecr.us-east-1.amazonaws.com/controlplane/fluxcd/image-automation-controller` | v0.40.0 | amd64 / arm64 |

#### Flux Manifests

| OCI Artifact                                               | Version |
|:-----------------------------------------------------------|---------|
| `ghcr.io/controlplaneio-fluxcd/distroless/flux-manifests`  | v2.5.0  |
