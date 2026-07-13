---
title: Flux D2 Architectural Reference
description: FluxCD GitLess GitOps Design 2 Reference Architecture Guide
hide:
  - toc
---

# Flux D2 Architectural Reference

This guide introduces Gitless GitOps: the desired state of the system is
driven by OCI artifacts stored in container registries, built from manifests
tracked in Git during the continuous integration process.

Production clusters pull versioned, signed artifacts without direct access
to the Git server, and the continuous synchronization of desired and actual
state is handled by automated workflows and the Flux reconciliation mechanisms.

### Repositories

- [d2-fleet](https://github.com/controlplaneio-fluxcd/d2-fleet) - The desired state of the Kubernetes clusters and tenants in the fleet.
- [d2-infra](https://github.com/controlplaneio-fluxcd/d2-infra) - The desired state of the cluster add-ons and the monitoring stack.
- [d2-apps](https://github.com/controlplaneio-fluxcd/d2-apps) - The desired state of the applications deployed across environments.

[Download the guide](https://raw.githubusercontent.com/controlplaneio-fluxcd/distribution/main/guides/ControlPlane_Flux_D2_Reference_Architecture_Guide.pdf){ .md-button .md-button--primary }
