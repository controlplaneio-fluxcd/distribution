---
title: Flux Multitenant Policies
description: FluxCD validating admission policies for multi-tenant clusters
---

# Flux Multitenant Policies

In this guide we will cover how to use the Kubernetes built-in validating admission engine
to enforce policies on multi-tenant clusters managed by Flux.

## Kubernetes Validating Admission Policy

Starting from Kubernetes 1.30, the Kubernetes API server comes with a built-in validating
admission controller that allows defining custom policies using the
[Common Expression Language](https://kubernetes.io/docs/reference/using-api/cel/) (CEL).

In a GitOps setup, the Kubernetes `ValidatingAdmissionPolicy` and `ValidatingAdmissionPolicyBinding`
resources are defined by cluster admins in the fleet repository. Using Flux `dependsOn` feature,
the cluster admins can ensure that the policies are applied before any other resources are reconciled,
thus enforcing the policies on all tenant's namespaces and workloads.

## Restricting Access to Flux Sources

One common policy is to restrict the access to external Flux sources such as Git repositories,
OCI registries and Helm repositories which are controlled by tenants.

### Define the Allow List

Assuming that cluster admins want to restrict the access to a specific GitHub organization,
first, they need to define `ConfigMap` in the `flux-system` namespace
with the list of allowed Flux sources:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: allowlist
  namespace: flux-system
  labels:
    fluxcd.controlplane.io/role: "policy"
data:
  sources: >-
    oci://ghcr.io/controlplaneio-fluxcd/charts/
    https://github.com/controlplaneio-fluxcd/
    ssh://git@github.com/controlplaneio-fluxcd/
```

The `sources` list contains the allowed URL prefixes separated by a new line for
tenant-owned Flux sources e.g. `GitRepository`, `OCIRepository` and `HelmRepository`.

### Define the Admission Policy

Next, the cluster admins need to define a `ValidatingAdmissionPolicy` resource that
verifies the source URL against the allow list:

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicy
metadata:
  name: "source.policy.fluxcd.controlplane.io"
  annotations:
    policy.fluxcd.controlplane.io/role: |
      Restrict Flux access to Git repositories, OCI registries and Helm repositories,
      based on an allowlist defined in a ConfigMap stored in the flux-system namespace.
spec:
  failurePolicy: Fail
  matchConstraints:
    resourceRules:
      - apiGroups: [ "source.toolkit.fluxcd.io" ]
        apiVersions: [ "*" ]
        operations: [ "CREATE", "UPDATE" ]
        resources: [ "gitrepositories", "ocirepositories", "helmrepositories" ]
  matchConditions:
    - name: "exclude-source-controller-finalizer"
      expression: >
        request.userInfo.username != "system:serviceaccount:flux-system:source-controller"
  paramKind:
    apiVersion: v1
    kind: ConfigMap
  variables:
    - name: url
      expression: object.spec.url
    - name: sources
      expression: params.data.sources.split(' ')
  validations:
    - expression: >
        variables.sources.exists_one(prefix, variables.url.startsWith(prefix))
      messageExpression: >
        "Source " + variables.url + " is not allowed, must be one of " + variables.sources.join(", ")
      reason: Invalid
```

### Define the Admission Policy Binding

Finally, the cluster admins need to define a `ValidatingAdmissionPolicyBinding` resource
that binds the policy to all tenant namespaces and references the `ConfigMap` with the allow list:

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicyBinding
metadata:
  name: tenant-sources
spec:
  policyName: "source.policy.fluxcd.controlplane.io"
  validationActions: [ "Deny" ]
  paramRef:
    name: allowlist
    namespace: flux-system
    parameterNotFoundAction: "Deny"
  matchResources:
    namespaceSelector:
      matchExpressions:
        - key: kubernetes.io/metadata.name
          operator: NotIn
          values:
            - flux-system
            - kube-system
```

With the above policy in place, any tenant trying to create or update a Flux source that is not
listed in the allow list will receive a validation error and the operation will be denied.

### Applying the Policies

The cluster admins can apply the policies using a dedicated Flux `Kustomization` that gets reconciled
before the tenant's resources.

Repository structure:

```text
├── clusters
│   └── production
│       ├── policies-sync.yaml
│       └── tenants-sync.yaml
├── policies
│   ├── allowlist.yaml
│   └── policies.yaml
└── tenants
    ├── team1
    └── team2
```

The `policies-sync.yaml` manifest configures Flux to reconcile the policies resources first:

```yaml
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: policies
  namespace: flux-system
spec:
  path: "./policies"
  prune: true
  wait: true
```

The `tenants-sync.yaml` manifest configures Flux to reconcile the tenants resources after the policies:

```yaml
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: tenants
  namespace: flux-system
spec:
  dependsOn:
    - name: policies
  path: "./tenants"
  prune: true
```

### Testing the Policy

If a tenant adds an `HelmRepository` manifest to their repository that tries to
pull Helm charts from a registry that is not in the allow list, for example:

```yaml
apiVersion: source.toolkit.fluxcd.io/v1
kind: HelmRepository
metadata:
  name: podinfo
  namespace: apps
spec:
  type: oci
  url: oci://ghcr.io/stefanprodan/charts/
```

The admission controller will deny the creation of the `HelmRepository` and the tenant will receive
an alert from Flux about the policy violation:

```
The helmrepository "podinfo" is invalid:
ValidatingAdmissionPolicy 'source.policy.fluxcd.controlplane.io' with binding 'tenant-sources' denied request:
Source oci://ghcr.io/stefanprodan/charts/ is not allowed, must be one of oci://ghcr.io/controlplaneio-fluxcd/charts/, https://github.com/controlplaneio-fluxcd/, ssh://git@github.com/controlplaneio-fluxcd/
```

## Restricting Access to Container Registries

Another common policy is to restrict the access to container registries for workloads running in tenant namespaces.

Assuming that cluster admins want to restrict the access to specific container registries,
they can add the allowed registry prefixes to the `ConfigMap` in the `flux-system` namespace:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: allowlist
  namespace: flux-system
  labels:
    fluxcd.controlplane.io/role: "policy"
data:
  registries: >-
    ghcr.io/controlplaneio-fluxcd/
    709825985650.dkr.ecr.us-east-1.amazonaws.com/controlplane/
  sources: >-
    omitted for brevity
```

Next, the cluster admins need to define a `ValidatingAdmissionPolicy` resource that
verifies the containers image URL against the allow list:

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicy
metadata:
  name: "registry.policy.fluxcd.controlplane.io"
spec:
  failurePolicy: Fail
  matchConstraints:
    resourceRules:
      - apiGroups: [ "apps" ]
        apiVersions: [ "v1" ]
        operations: [ "CREATE", "UPDATE" ]
        resources: [ "deployments", "statefulsets", "daemonsets" ]
  paramKind:
    apiVersion: v1
    kind: ConfigMap
  variables:
    - name: registries
      expression: params.data.registries.split(' ')
  validations:
    - expression: >
        object.spec.template.spec.containers.all(
          container,
          variables.registries.exists(
              prefix, container.image.startsWith(prefix)
          )
        )
      messageExpression: >
        "Container image is not allowed, must be one of " + variables.registries.join(", ")
      reason: Invalid
    - expression: >
        !has(object.spec.template.spec.initContainers) ||
        object.spec.template.spec.initContainers.all(
          container,
          variables.registries.exists(
              prefix, container.image.startsWith(prefix)
          )
        )
      messageExpression: >
        "Init container image is not allowed, must be one of " + variables.registries.join(", ")
      reason: Invalid
```

Finally, the cluster admins need to define a `ValidatingAdmissionPolicyBinding` resource
that binds the policy to all tenant namespaces and references the `ConfigMap` with the allow list:

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicyBinding
metadata:
  name: tenant-registries
spec:
  policyName: "registry.policy.fluxcd.controlplane.io"
  validationActions: [ "Deny" ]
  paramRef:
    name: allowlist
    namespace: flux-system
    parameterNotFoundAction: "Deny"
  matchResources:
    namespaceSelector:
      matchExpressions:
        - key: kubernetes.io/metadata.name
          operator: NotIn
          values:
            - flux-system
            - kube-system
```

With the above policy in place, any tenant trying to create or update a workload that uses a container image
from a registry that is not listed in the allow list will receive a validation error and the operation will be denied.

```text
The deployments "test-deployment" is invalid:
ValidatingAdmissionPolicy 'registry.policy.fluxcd.controlplane.io' with binding 'tenant-registries' denied request:
Init container image is not allowed, must be one of ghcr.io/controlplaneio-fluxcd/, 709825985650.dkr.ecr.us-east-1.amazonaws.com/controlplane/
```

## Conclusions

In this guide we've shown how to use the Kubernetes native validating admission policies
to enforce policies on multi-tenant clusters managed by Flux. Extending the examples above,
cluster admins can define policies to enforce best practices, security and compliance requirements
across all tenant namespaces and workloads.

The new Kubernetes validating admission policies offer an alternative to admission webhooks such as
[OPA Gatekeeper](https://open-policy-agent.github.io/gatekeeper/website/) or [Kyverno](https://kyverno.io/).
Admission webhooks are single points of failure and can introduce latency in the API server response time,
blocking or slowing down the reconciliation of the cluster state performed by Flux.
Using the built-in policy engine, eliminates the maintenance overhead of running and managing
custom admission webhooks and makes policy enforcement more reliable and efficient.
