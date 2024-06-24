# Flux Monitoring and Reporting

## Flux Status Reporting

The Flux Operator automatically generates a report that reflects the observed state of the Flux
installation. The report provides information about the installed components and their readiness,
the Flux distribution details, reconcilers statistics, cluster sync status and more.

The report is generated as a custom resource of kind `FluxReport`, named `flux`,
located in the same namespace where the operator is running.

To view the report in YAML format run:

```shell
kubectl -n flux-system get fluxreport/flux -o yaml
```

The operator updates the report at regular intervals, by default every 10 minutes.
To manually trigger the reconciliation of the report, run:

```shell
kubectl -n flux-system annotate --overwrite fluxreport/flux \
 reconcile.fluxcd.io/requestedAt="$(date +%s)"
```

Find more information about the reporting features
in the [Flux Report API documentation](fluxreport.md).

## Flux Instance Events

The Flux Operator emits events to the Kubernetes API server to report on the status of the Flux
instance. The events are useful to monitor the Flux lifecycle and troubleshoot issues.

To list the events related to the Flux instance, run:

```shell
kubectl -n flux-system events for fluxinsance/flux
```
