---
title: Overview
description: FluxCD Enterprise documentation overview
---

# Overview

Welcome to ControlPlane Enterprise for Flux CD (CPEF).

CPEF is an enterprise-grade version of the CNCF-graduated [Flux project](https://fluxcd.io)
with LTS releases, as well as additional features designed for production environments
and regulatory compliance.

## Distribution Components

CPEF comprises open source components and proprietary software developed by [ControlPlane](https://control-plane.io).

The build, test, and release pipeline is compliant with the [SLSA](security.md) security framework.
The CPEF build system produces FIPS-compliant binaries, multi-arch container images, generates SBOMs,
applies CVE patches & hotfixes, and runs conformance tests.

### Flux Controllers

The distribution includes hardened builds of the Flux controllers that implement the
GitOps reconciliation loop:

- **source-controller**: Fetches artifacts from Git repositories, OCI registries,
  Helm repositories, and S3-compatible buckets, making them available to the other
  controllers as versioned artifacts.
- **kustomize-controller**: Builds Kustomize overlays or plain Kubernetes manifests
  and applies them to the cluster with server-side apply, drift detection and correction,
  dependency ordering, and SOPS secrets decryption.
- **helm-controller**: Performs Helm releases in a declarative way, with support for
  automated rollbacks, remediation strategies, and chart values composition.
- **notification-controller**: Dispatches events to external systems
  (Slack, Teams, Grafana, Git providers, generic webhooks) and triggers
  reconciliations from incoming webhooks.
- **image-reflector-controller**: Scans container registries and resolves the latest
  image tags based on version policies.
- **image-automation-controller**: Updates the image tags in Git repositories based on
  the policies set with image-reflector-controller.
- **source-watcher**: Composes and decomposes artifacts from multiple sources
  using the ArtifactGenerator API, enabling advanced artifact transformation workflows.

### Flux Operator

The [Flux Operator](https://fluxoperator.dev/) provides a declarative API for the
lifecycle management of the Flux controllers. It handles the installation, configuration,
sharding, and upgrade of Flux through the `FluxInstance` custom resource, reports the
observed state of the GitOps pipelines via `FluxReport`, and enables self-service
environments and application definitions through the `ResourceSet` APIs.

### Flux Web UI

The [Flux Web UI](https://fluxoperator.dev/web-ui/) is built into the Flux Operator and
offers a browser-based dashboard for monitoring the Flux resources and their managed
workloads, triggering reconciliations, and troubleshooting GitOps pipelines. It supports
single sign-on with OIDC providers, Kubernetes-native role-based access control, and
audit logging of user actions.

For Single Sign-On, the distribution provides the [Dex IdP Addon](../addons/dex.md),
a hardened [Dex](https://dexidp.io/) distribution used to configure OIDC authentication
for the Flux Web UI.

### Flux MCP Server

The distribution includes a hardened edition of the
[Flux Operator MCP Server](https://fluxoperator.dev/mcp-server/) that connects AI assistants
to Kubernetes clusters managed by Flux. Unlike the upstream version, the enterprise edition
is exclusively read-only and cannot alter the cluster state regardless of the permissions
granted by the kubeconfig. See the [Local MCP Server Addon](../addons/mcp-stdio.md)
documentation for installation and usage instructions.

## Distribution Channels

CPEF is distributed as a set of container images which are hosted on private registries
that are available to customers with a valid subscription.

### Distroless

The CPEF distribution offers hardened
[Google Distroless](https://github.com/GoogleContainerTools/distroless)
container images for the Flux controllers, Flux Operator, and the Flux MCP Server.

The distroless variant has no shell or package managers installed, reducing the attack surface
and eliminating entire classes of CVEs. Due to the absence of a shell environment and OS packages,
the following kustomize-controller features are disabled:

- **Kustomize remote bases**: requires the `git` binary for fetching remote resources which bypass source-controller;
  use [GitRepository](https://fluxoperator.dev/docs/crd/gitrepository/) or
  [OCIRepository](https://fluxoperator.dev/docs/crd/ocirepository/) sources instead.
- **Secrets decryption with GnuPG**: requires the `gpg` binary;
  use [Age encryption](https://fluxcd.io/flux/guides/mozilla-sops/#encrypting-secrets-using-age) or a
  cloud KMS provider instead.

### Distroless FIPS

The CPEF distribution offers FIPS-compliant binaries (Linux AMD64/ARM64) for the Flux controllers,
Flux Operator, and the Flux MCP Server. The binaries are shipped as a separate variant of the
distroless images.

This variant is built using the [FIPS 140-3 mode](https://go.dev/doc/security/fips140),
and the Go runtime is configured to restrict the TLS and SSH configuration to FIPS-approved settings.

### Mainline

The CPEF distribution offers hardened
[Alpine Linux](https://www.alpinelinux.org/)
images fully compatible with the upstream Flux feature set.

The major difference between the Flux upstream images and the CPEF
images is the continuous scanning and CVE patching for the
container base images, OS packages, and Go dependencies.
