---
hide:
  - toc
---

# Flux D2 Architectural Reference

We present the Design 2 Reference Architecture Guide,
which builds upon the [D1 architecture](d1-architecture-reference.md) with
some notable enhancements and new features.

In this iteration of our reference architecture, we introduce the concept of Gitless
GitOps: the desired state of the system is driven by OCI Artifacts stored in container
registries that are built from manifests tracked in git repositories during the
Continuous Integration process. Continuous synchronisation of desired and actual
system state is achieved through automated workflows and reconciliation
mechanisms.

[:octicons-download-24: Download the guide](https://raw.githubusercontent.com/controlplaneio-fluxcd/distribution/main/guides/ControlPlane_Flux_D2_Reference_Architecture_Guide.pdf){ .md-button .md-button--primary }
