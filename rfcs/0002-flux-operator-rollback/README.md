# [RFC-0002] Flux Flux Operator Rollback Automation

**Status:** provisional

**Creation date:** 2024-05-31

**Last update:** 2024-05-31

## Summary

The Flux Flux Operator is designed to automate the lifecycle of Flux CD and the ControlPlane
enterprise distribution. The Flux Operator deploys new versions of the Flux controllers
after new images are published.

We propose adding a rollback mechanism in order to revert to the previous version
in case of a failed upgrade. Additionally, we propose a test mechanism to validate
the new version of the Flux controllers before validating the upgrade. The outcome
of the test will determine if the upgrade should proceed or if a rollback should
be triggered.


## Motivation

The Flux Operator provides a declarative API for the installation and upgrade of the
enterprise distribution. And it facilitates a clean uninstall and reinstall process
without affecting the Flux-managed workloads. 

However, in the event of a failed upgrade, i.e. the new version of the Flux controllers
is not working as expected due to a bug or misconfiguration, or the workload is
not operating as expected with the new version, the Flux Operator does not provide
a rollback mechanism to revert to the previous version of the Flux controllers.

This rollback mechanism is essential to prevent downtime and ensure the stability
of the workloads managed by Flux. New Flux versions may introduce breaking changes
or bugs that can affect the workloads. Without a rollback mechanism, the administrator
of the Flux Operator would have to manually delete its custom resource and deploy
the previous version, which is time-consuming and need an human intervention.
It also suppose an early detection of the issue (which in itself is not guaranteed).

A test mechanism is also needed to automatically validate the new version of the
Flux controllers before validating the upgrade. The administrator of the Flux Operator
should be able to define a test procedure that will be executed after the new version
of the Flux controllers is deployed in a test environment, before enabling the upgrade
in the production environment.


## Goals

- Provide a rollback mechanism in the Flux Flux Operator to revert to the previous
  version of the Flux controllers in case of a failed upgrade.
- Provide a test mechanism to validate the new version of the Flux controllers
  as part of the upgrade process.


## Non-Goals


## Proposal

The Flux Flux Operator will be extended with a new field in the `FluxInstance`
custom resource called `test`. This field will contain a list of test definitions
that will be applied after the new version of the Flux controllers is deployed by
the Flux Operator.

```yaml
apiVersion: fluxcd.controlplane.io/v1
kind: FluxInstance
metadata:
  name: flux
  namespace: flux-system
  annotations:
    fluxcd.controlplane.io/reconcile: "Enabled"
    fluxcd.controlplane.io/reconcileTimeout: "5m"
    fluxcd.controlplane.io/reconcileEvery: "1h"
spec:
  test:
    enable: true
    ignoreFailures: true
    definitionsFrom:
    # List of ConfigMaps that contain the tests definitions
    # having a list permits grouping tests by version
      - name: "test-flux-components-v2.3.x"
        kind: ConfigMap
        key: test-yaml
    filters:
    # List of filters to determine which tests should be executed for the current upgrade
      - name: "test-flux-components-v2.3.x"
        exclude: false
      - name: "test-flux-components-v2.2.x"
        exclude: true
```

The `spec.test` field will contain the following subfields:
- `spec.test.enable`: a boolean that enables or disables the test mechanism.
  This field is optional and defaults to `false`. If set to `true`, the Flux Operator
  will execute the tests defined in the `spec.test.definitionsFrom` field. If after
  evaluation, the list test definitions is not empty, the Flux Operator will execute
  the tests that are not excluded by the filters. If the tests fail, the Flux Operator
  will trigger a rollback to the previous version of the Flux controllers.
- `spec.test.ignoreFailures`: a boolean that determines if the upgrade should
  proceed even if the tests fail. This field is optional and defaults to `false`.
  If set to `true`, the Flux Operator will proceed with the upgrade even if the tests fail.
- `spec.test.definitionsFrom`: a list of references to ConfigMaps that contain the
  tests definitions.
- `spec.test.filters`: a list of filters that determine which tests should be executed.
  This field is optional and defaults to an empty list.
- `spec.test.filters.exclude`: a boolean that determines if the test should be
  excluded from the execution. This can be used to skip tests that are not relevant
  for the current upgrade.

The tests definitions are YAML files that contain objects that will be deployed
by the Flux Operator in the cluster. Upon completion of the tests, the Flux Operator
will evaluate the results and determine if the upgrade should proceed or if a rollback
should be triggered. They deployed objects will be deleted after the tests are completed.

The rollback mechanism will be implemented as follows:
- The Flux Flux Operator will keep a copy of the previous version of the raw manifests
  of the Flux controllers deployed in the cluster as a kubernetes secret in the same
  namespace where the Flux Operator is deployed.
- If the tests fail, the Flux Operator will trigger a rollback by deleting the current
  version of the Flux controllers and deploying the previous version from the secret.
  Deletion is necessary as rolling back crds is not supported by kubernetes.

The `status` field of the `FluxInstance` custom resource will reflect the test results
and rollback status with the conditions `status.conditions.testSuccess` and 
`status.conditions.rollback` respectively. `status.deployedVersion` will contain the
version of the Flux controllers that are currently deployed in the cluster. This will
allow the Flux Operator to determine which version to rollback to in case of a failed upgrade.


## Implementation details

### Tracking the deployed version and raw manifests

The Flux Operator will keep a copy of the raw manifests of the Flux controllers
deployed in the cluster as a kubernetes secret in the same namespace where the Flux
Operator is deployed. The secret will be named `fluxcd.controlplane.io.<upgradeNumber>`
where `<upgradeNumber>` is a monotonically increasing number that is incremented
each time a new version of the Flux controllers is deployed.

The `status` field of the `FluxInstance` custom resource will contain the `upgradeNumber`
of the currently deployed version. The can be used to determine which version to rollback
to in case of a failed upgrade.

```yaml
status:
  upgradeNumber: 1
```

The raw manifests of the Flux controllers will be stored in the `data` field of the
kubernetes secret as base64 encoded value of the `zstd` compressed tarball.

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: fluxcd.controlplane.io.1
  namespace: flux-system
type: fluxcd.controlplane.io/raw-manifests
data:
  flux.yaml: <base64 encoded zstd compressed tarball>
```

### Helm chart changes

The Helm chart for the Flux Flux Operator will be updated to include new fields in
the `values.yaml` file. The `tests` field will be optional and will contain test
declarations. The `tests.testDefinitions` field will be used by a configmap template
to generate the ConfigMaps that contains the tests definitions. The `tests.testsConfigMaps`
field will contains external ConfigMaps references that will be used by the Flux Operator
to retrieve the tests definitions.

```yaml
tests:
  enable: false
  ignoreFailures: false
  filters:
    - name: "test-flux-components-v2.3.x"
      exclude: false
    - name: "test-flux-components-v2.2.x"
      exclude: true
  # Test definitions to be generated by the Helm chart
  # The ConfigMaps will be created in the same namespace where the Flux Flux Operator is deployed
  testDefinitions:
    - name: "test-flux-components-v2.3.x"
      yaml: |
        apiVersion: source.toolkit.fluxcd.io/v1beta2
        kind: OCIRepository
        metadata:
          name: podinfo
          namespace: default
        spec:
          interval: 10m
          layerSelector:
            mediaType: "application/vnd.cncf.helm.chart.content.v1.tar+gzip"
            operation: copy
          url: oci://ghcr.io/stefanprodan/charts/podinfo
          ref:
            semver: ">= 6.0.0"
        ---
        apiVersion: helm.toolkit.fluxcd.io/v2
        kind: HelmRelease
        metadata:
          name: test-flux-components-v2.3.x
          namespace: default
        spec:
          interval: 10m
          chartRef:
            kind: OCIRepository
            name: podinfo
            namespace: default
          values:
            replicaCount: 2
  # External ConfigMaps references
  testsConfigMaps:
    - name: "test-flux-components-v2.2.x"
      key: test-yaml
```

## Implementation History