---
description: Flux Operator ResourceSets overview and features
---

# ResourceSets Introduction

The Flux Operator ResourceSet API offers a high-level abstraction for defining
and managing Flux resources and related Kubernetes objects as a single unit.
The ResourceSet API is designed to reduce the complexity of GitOps workflows
and to enable self-service for developers and platform teams.

## Features

### Application definitions

The CNCF Flux project does not impose a specific application definition format or structure,
instead it provides a set of APIs that can be used as building blocks to define and manage the
continuous delivery of applications in a GitOps manner.

The Flux Operator with the ResourceSet API enables platform teams to define their own application standard
as a group of Flux and Kubernetes resources that can be templated, parameterized and deployed as a
single unit across environments.

To get started with ResourceSets see the [Using ResourceSets for Application Definitions](./app-definition.md) guide.

### Self-service environments

A main goal of the Flux Operator is to enable self-service environments. In order to achieve this,
the ResourceSet controller integrates with services such as GitHub and GitLab to automate
the lifecycle of applications based on external events and state changes.

One such use-case is deploying app code and/or config changes made in a GitHub Pull Request
or GitLab Merge Request to an ephemeral environment for testing and validation.
The Flux Operator has the ability to create, update and delete application instances on-demand
based on the ResourceSet definitions and Pull/Merge Requests state.

To get started with self-service environments see the following guides:

- [Ephemeral Environments for GitHub Pull Requests](./github-pull-requests.md)
- [Ephemeral Environments for GitLab Merge Requests](./gitlab-merge-requests.md)

Another use-case is to automate the provisioning of new environments for feature branches,
and for long-lived branches to deploy to dedicated namespaces and/or clusters, effectively
enabling Namespace-as-a-Service to developers securely in a GitOps manner.
