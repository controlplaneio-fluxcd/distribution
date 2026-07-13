---
title: Flux D1 Architectural Reference
description: FluxCD GitOps Design 1 Reference Architecture Guide
hide:
  - toc
---

# Flux D1 Architectural Reference

This guide is a set of best practices and production-ready examples for
managing complex multi-tenant, multi-cluster environments with Flux.
It shows how to orchestrate the GitOps delivery of applications and
infrastructure workloads while catering to the different teams and
stakeholders within an organisation.

The guide covers the automated update of applications to staging with
gated promotion to production through GitHub Pull Requests.

### Repositories

- [d1-fleet](https://github.com/controlplaneio-fluxcd/d1-fleet) - The desired state of the Kubernetes clusters and tenants in the fleet.
- [d1-infra](https://github.com/controlplaneio-fluxcd/d1-infra) - The desired state of the cluster add-ons and the monitoring stack.
- [d1-apps](https://github.com/controlplaneio-fluxcd/d1-apps) - The desired state of the applications deployed across environments.

[Download the guide](https://raw.githubusercontent.com/controlplaneio-fluxcd/distribution/main/guides/ControlPlane_Flux_D1_Reference_Architecture_Guide.pdf){ .md-button .md-button--primary }
