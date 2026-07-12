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

TODO: list controllers with a short description

### Flux Operator

TODO: short description + link to https://fluxoperator.dev/

### Flux Web UI

TODO: short description + link to https://fluxoperator.dev/web-ui/

### Flux MCP Server

TODO: short description of the EE edition of the MCP + link to the addon doc (and mention the Dex IdP Addon)

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
