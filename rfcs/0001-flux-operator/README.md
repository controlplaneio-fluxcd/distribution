# [RFC-0001] Flux Operator

**Status:** implementable

**Creation date:** 2024-02-25

**Last update:** 2024-05-30

## Summary

The Flux Operator is a Kubernetes CRD controller that manages the lifecycle of Flux CD
and the ControlPlane enterprise distribution.

## Motivation

The Flux Operator is designed to simplify the installation of the enterprise distribution on Kubernetes clusters,
and to provide a declarative API for the configuration and automated upgrade of the Flux controllers.

The main goal is to provide an alternative to the Flux CLI and Flux TF provider bootstrap process, which
requires Git push access to the main branch for storing manifests with thousands lines of YAML
in a Git repository for each cluster in the fleet.

The Flux Operator will be distributed with a simple YAML manifest, Timoni module and a Helm chart
that can be easily deployed with Terraform, OpenTofu, Pulumi, and other infrastructure provisioning tool.
The Flux Operator deployment will require no configuration, its sole purpose is to
contain all the complexity of the Flux components and their various configuration options.

### Goals

- Provide a declarative API for the installation and upgrade of the enterprise distribution.
- Automate patching for hotfixes and CVEs affecting the Flux controllers container images.
- Provide first-class support for OpenShift, Azure, AWS, GCP and other marketplaces.
- Simplify the configuration of multi-tenancy lockdown on shared Kubernetes clusters.
- Provide a security-first approach to the Flux deployment and FIPS compliance.
- Incorporate best practices for running Flux at scale with persistent storage, sharding and horizontal scaling.
- Manage the update of Flux custom resources and prevent disruption during the upgrade process.
- Facilitate a clean uninstall and reinstall process without affecting the Flux-managed workloads.

### Non-Goals

- Automatically push the Flux configuration to a Git repository.
  The operator makes no assumptions about the desired state storage, it can be Git, OCI artifacts, S3, GCS, etc.
  When using an infrastructure provisioning tool, the Flux configuration values would be stored in the state files.
- Provide a web UI for the configuration of the enterprise distribution.
  The Flux Operator is designed to be used with infrastructure as code tools and UI tools that handle Helm releases.

## Proposal

The Flux Operator comes with a Kubernetes CRD called `FluxInstance`.
A single custom resource of this kind can exist in a Kubernetes cluster with the name
`flux` that must be created in the same namespace where the operator is deployed.

Spec example:

```yaml
apiVersion: fluxcd.controlplane.io/v1
kind: FluxInstance
metadata:
  name: flux
  namespace: flux-system
  annotations:
    # Continuously check for updates
    fluxcd.controlplane.io/reconcile: "Enabled"
    fluxcd.controlplane.io/reconcileTimeout: "5m"
    fluxcd.controlplane.io/reconcileEvery: "1h"
spec:
  # Enterprise distribution settings
  distribution:
    # Hotfixes and CVE patches auto-updates
    version: "2.3.x"
    # Container registry hosting the FIPS-compliant images
    registry: ghcr.io/controlplaneio-fluxcd/distroless
    # Pull secret for the enterprise container images
    imagePullSecret: enterprise-flux-auth
  # Flux CRD controllers to deploy on this cluster
  components:
    - source-controller
    - kustomize-controller
    - helm-controller
    - notification-controller
    - image-reflector-controller
    - image-automation-controller
  # Kubernetes cluster specification
  cluster:
    # Enable specific config for aks, eks, gke and openshift
    type: kubernetes
    # Enable Flux multi-tenancy lockdown
    multitenant: true
    # Cluster internal domain name
    domain: cluster.local
    # Restrict network access to the Flux namespace
    networkPolicy: true
  # Configure Flux sharding and horizontal scaling
  shards:
    - shard1
    - shard2
  # Persistent storage for Flux internal artifacts
  storage:
    class: standard
    size: 10Gi
  # Kustomize patches for Flux controllers
  kustomize:
    patches:
      - target:
          kind: Deployment
          labelSelector: "app.kubernetes.io/component in (kustomize-controller, helm-controller)"
        patch: |
          - op: add
            path: /spec/template/spec/containers/0/args/-
            value: --concurrent=10
          - op: add
            path: /spec/template/spec/containers/0/args/-
            value: --requeue-dependency=10s
```

Status example:

```yaml
apiVersion: fluxcd.controlplane.io/v1
kind: FluxInstance
metadata:
  name: flux
  namespace: flux-system
  finalizers:
  - fluxcd.controlplane.io/finalizer
status:
  conditions:
  - lastTransitionTime: "2024-05-25T16:11:42Z"
    message: "Reconciliation finished in 25s"
    observedGeneration: 2
    reason: ReconciliationSucceeded
    status: "True"
    type: Ready
  - lastTransitionTime: "2024-05-25T16:11:42Z"
    message: "Upgrade to latest version v2.4.0 blocked by semver range 2.3.x"
    observedGeneration: 2
    reason: UpgradePending
    status: "False"
    type: UpToDate
  observedGeneration: 2
  lastAppliedRevision: v2.3.0@sha256:8d7eab6395c8e7c3558a2f3df2f280cb52139b4b480ac7b6f2b88b2c8056ec9f
  lastAttemptedRevision: v2.3.0@sha256:8d7eab6395c8e7c3558a2f3df2f280cb52139b4b480ac7b6f2b88b2c8056ec9f
  components:
    - digest: sha256:161da425b16b64dda4b3cec2ba0f8d7442973aba29bb446db3b340626181a0bc
      name: source-controller
      repository: ghcr.io/controlplaneio-fluxcd/distroless/source-controller
      tag: v1.3.0
    - digest: sha256:48a032574dd45c39750ba0f1488e6f1ae36756a38f40976a6b7a588d83acefc1
      name: kustomize-controller
      repository: ghcr.io/controlplaneio-fluxcd/distroless/kustomize-controller
      tag: v1.3.0
    - digest: sha256:a67a037faa850220ff94d8090253732079589ad9ff10b6ddf294f3b7cd0f3424
      name: helm-controller
      repository: ghcr.io/controlplaneio-fluxcd/distroless/helm-controller
      tag: v1.0.1
    - digest: sha256:c0fab940c7e578ea519097d36c040238b0cc039ce366fdb753947428bbf0c3d6
      name: notification-controller
      repository: ghcr.io/controlplaneio-fluxcd/distroless/notification-controller
      tag: v1.3.0
    - digest: sha256:aed795c7a8b85bca93f6d199d5a14bbefaf925ad5aa5316b32a716cfa4070d0b
      name: image-reflector-controller
      repository: ghcr.io/controlplaneio-fluxcd/distroless/image-reflector-controller
      tag: v0.32.0
    - digest: sha256:ab5097213194f3cd9f0e68d8a937d94c4fc7e821f6544453211e94815b282aa2
      name: image-automation-controller
      repository: ghcr.io/controlplaneio-fluxcd/distroless/image-automation-controller
      tag: v0.38.0
  inventory: [...]
```

Events example:

```text
  Type     Reason                   Age   From             Message
  ----     ------                   ----  ----             -------
  Normal   Progressing              59s   flux-operator    Installing revision v2.3.0@sha256:8d7eab6395c8e7c3558a2f3df2f280cb52139b4b480ac7b6f2b88b2c8056ec9f
  Normal   ReconciliationSucceeded  35s   flux-operator    Reconciliation finished in 25s
  Warning  UpgradePending           25s   flux-operator    Upgrade to latest version 2.4.0 blocked by semver range 2.3.x
```

## Implementation History

- 2024-02-30: Partially implemented [flux-operator](https://github.com/controlplaneio-fluxcd/flux-operator)
