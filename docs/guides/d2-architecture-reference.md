---
title: Flux D2 Architectural Reference
description: FluxCD GitLess GitOps Design 2 Reference Architecture Guide
hide:
  - toc
---

# Flux D2 Architectural Reference

We present the Design 2 Reference Architecture Guide,
which builds on the [D1 architecture](d1-architecture-reference.md) with
some notable enhancements and new features.

In this iteration of our reference architecture, we introduce the concept of **Gitless GitOps**:
the desired state of the system is driven by OCI Artifacts stored in container
registries that are built from manifests tracked in Git repositories during the
Continuous Integration process. Continuous synchronization of desired and actual
system state is achieved through automated workflows and Flux reconciliation
mechanisms.

### Repositories

- [d2-fleet](https://github.com/controlplaneio-fluxcd/d2-fleet) - Defines the desired state of the Kubernetes clusters and tenants in the fleet.
- [d2-infra](https://github.com/controlplaneio-fluxcd/d2-infra) - Defines the desired state of the cluster add-ons and the monitoring stack.
- [d2-apps](https://github.com/controlplaneio-fluxcd/d2-apps) - Defines the desired state of the applications deployed across environments.

[:octicons-download-24: Download the guide](https://raw.githubusercontent.com/controlplaneio-fluxcd/distribution/main/guides/ControlPlane_Flux_D2_Reference_Architecture_Guide.pdf){ .md-button .md-button--primary }
