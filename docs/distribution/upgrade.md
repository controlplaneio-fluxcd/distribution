---
title: Flux Distribution Upgrade
description: FluxCD Enterprise upgrade procedure
---

# Flux Distribution Upgrade Procedure

The Flux distribution has a release cadence of approximately one minor release every three months,
with patch releases in between. On production clusters, it is recommended to configure Flux Operator
to automatically upgrade Flux to the latest patch release in the specified minor version range.

!!! tip "Flux Operator"

    The [Flux Operator](../operator/index.md) APIs are stable and backward compatible,
    so it is safe to upgrade the operator to the latest version at any time.

## Upgrading the Flux Operator

Depending on the installation [method](../operator/install.md),
upgrading the Flux Operator should be done in an automated manner.

If you installed the operator with the Helm CLI, you can configure automated
upgrades with a Flux `HelmRelease` as follows:

```yaml
apiVersion: fluxcd.controlplane.io/v1
kind: ResourceSet
metadata:
  name: flux-operator
  namespace: flux-system
spec:
  inputs:
    - interval: "1h" # check for updates every hour
      version: "*" # upgrade to latest stable version
  resources:
   - apiVersion: source.toolkit.fluxcd.io/v1
     kind: OCIRepository
     metadata:
      name: << inputs.provider.name >>
      namespace: << inputs.provider.namespace >>
     spec:
      interval: << inputs.interval | quote >>
      url: oci://ghcr.io/controlplaneio-fluxcd/charts/flux-operator
      layerSelector:
        mediaType: "application/vnd.cncf.helm.chart.content.v1.tar+gzip"
        operation: copy
      ref:
        semver: << inputs.version | quote >>
   - apiVersion: helm.toolkit.fluxcd.io/v2
     kind: HelmRelease
     metadata:
        name: << inputs.provider.name >>
        namespace: << inputs.provider.namespace >>
     spec:
      interval: 12h
      releaseName: << inputs.provider.name >>
      serviceAccountName: << inputs.provider.name >>
      chartRef:
        kind: OCIRepository
        name: << inputs.provider.name >>
      values:
        reporting:
          interval: 30s
```

If you installed the operator with [Terraform/OpenTofu](https://github.com/controlplaneio-fluxcd/flux-operator/tree/main/config/terraform),
update the `version` argument in the `helm_release` resource and apply the changes with `terraform apply`.

If you installed the operator from [OperatorHub](https://operatorhub.io/operator/flux-operator),
you can configure automatic upgrades by setting `Approval` to `Automatic` in OpenShift.

## Upgrading the Flux Distribution

It is recommended to set the Flux distribution version in the `FluxInstance` manifest
to a specific minor version, such as `2.8.x`, to have more control over the upgrade process.

### Migrate to Flux stable APIs in Git

!!! warning "Flux beta APIs EOL"

    In Flux v2.7, the deprecated **beta1** APIs have reached their end of life and are no longer supported.

    In Flux v2.8, the deprecated **beta2** APIs have reached their end of life and are no longer supported.

Before upgrading to Flux v2.8 or later, make sure to migrate all your manifests
to the Flux v2.7 stable APIs in your Git repositories by using the `flux migrate -f` command:

```sh
git clone <your-git-repo>
cd <your-git-repo>
flux migrate -v 2.7 -f .
git commit -am "Migrate to Flux v2.7 stable APIs"
git push
```

### Update the Flux Instance

After migrating your resources in all Git repositories,
update the `FluxInstance` manifest to the desired version:

```yaml
apiVersion: fluxcd.controlplane.io/v1
kind: FluxInstance
metadata:
  name: flux
  namespace: flux-system
spec:
  distribution:
    version: "2.8.x"
```

The operator will automatically upgrade the Flux components and
migrate the Flux APIs to their latest API versions in-cluster.

### Kubernetes Version Compatibility

When planning an upgrade of the Flux distribution, make sure to check the compatibility
with your Kubernetes cluster version.

The Enterprise distribution of Flux supports the **6 most recent minor versions** of Kubernetes,
including Long-Term Support (LTS) versions offered by cloud providers,
and the 3 most recent OpenShift versions.
The list of supported Kubernetes and OpenShift versions is updated with every Flux Enterprise minor
release and can be found in the [release notes](https://github.com/controlplaneio-fluxcd/distribution/releases).

The CNCF Flux distribution supports the **3 most recent minor versions** of Kubernetes.
The list of supported versions is updated with every Flux minor release
and can be found in the [flux2 release notes](https://github.com/fluxcd/flux2/releases).
