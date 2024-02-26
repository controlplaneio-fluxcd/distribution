# [RFC] Flux Operator

**Status:** provisional

**Creation date:** 2024-02-25

**Last update:** 2024-02-26

## Summary

The Flux Operator is a Kubernetes CRD controller that manages the lifecycle of the enterprise distribution.

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
- Facilitate a clean uninstallation and reinstall process without affecting the Flux-managed workloads.

### Non-Goals

- Automatically push the Flux configuration to a Git repository.
  The operator makes no assumptions about the desired state storage, it can be Git, OCI artifacts, S3, GCS, etc.
  When using an infrastructure provisioning tool, the Flux configuration values would be stored in the state files.
- Provide a web UI for the configuration of the enterprise distribution.
  The Flux Operator is designed to be used with infrastructure as code tools and UI tools that handle Helm releases.

## Proposal

The Flux Operator will come with a Kubernetes CRD called `FluxInstance`. A single custom resource of this kind
can exist in a Kubernetes cluster and must be created in the same namespace where the operator is deployed.

Spec example:

```yaml
apiVersion: fluxcd.controlplane.io/v1alpha1
kind: FluxInstance
metadata:
  name: flux
  namespace: flux-system
  annotations:
    # Continuously check for updates
    fluxcd.controlplane.io/reconcile: "Enabled"
    fluxcd.controlplane.io/reconcileEvery: "10m"
spec:
  # Enterprise distribution settings
  distribution:
    # Hotfixes and CVE patches auto-updates
    version: "2.2.x"
    # Container registry hosting the FIPS-compliant images
    registry: ghcr.io/controlplaneio-fluxcd/distroless
    # Pull secret for the enterprise container images
    pullSecret: enterprise-flux-auth
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
apiVersion: fluxcd.controlplane.io/v1alpha1
kind: FluxInstance
metadata:
  name: flux
  namespace: flux-system
status:
  conditions:
  - lastTransitionTime: "2024-02-25T16:11:42Z"
    message: "Applied version 2.2.3 revision e197eca"
    observedGeneration: 2
    reason: ReconciliationSucceeded
    status: "True"
    type: Ready
  - lastTransitionTime: "2024-02-25T16:11:42Z"
    message: "Upgrade to latest version 2.3.0 blocked by semver range 2.2.x"
    observedGeneration: 2
    reason: NewVersionAvailable
    status: "False"
    type: UpToDate
  observedGeneration: 2
  latestVersion: "2.3.0"
  lastAppliedVersion: "2.2.3"
  lastAppliedImages:
    - name: "ghcr.io/controlplaneio-fluxcd/distroless/source-controller:v1.2.4"
      digest: "sha256:5d18da29824d840d7341191b16a6430140f47cb75bfc0cbdb5be2b96552cec84"
    - name: "ghcr.io/controlplaneio-fluxcd/distroless/kustomize-controller:v1.2.2"
      digest: "sha256:05fe5ef1f059c35698caf11e4e9de465a40ad4384ef00c5c810203f2a4167512"
    - name: "ghcr.io/controlplaneio-fluxcd/distroless/helm-controller:v0.37.4"
      digest: "sha256:41edc971254af789db9d7b8f39843fb228023c49f98429114de98431b1efe550"
    - name: "ghcr.io/controlplaneio-fluxcd/distroless/notification-controller:v1.2.4"
      digest: "sha256:327b5cfa11e0daa596fe5b156acadccb1278a9b1ece4534a89b70fc6400f2a61"
```
