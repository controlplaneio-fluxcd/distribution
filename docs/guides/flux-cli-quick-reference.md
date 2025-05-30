---
description: FluxCD CLI cheatsheet for monitoring and troubleshooting
---

# Flux CLI Quick Reference

This guide contains a list of commonly used `flux` commands
for monitoring and troubleshooting the GitOps workflows managed by Flux.

We assume that the [Flux Operator](../operator/index.md) was used to bootstrap the cluster
and the Flux CLI users are restricted to [read-only operations](#read-only-mode).

## Installation

The Flux CLI is available as a binary executable for Linux, macOS and Windows.
The CLI can be downloaded from the [FluxCD GitHub releases page](https://github.com/fluxcd/flux2/releases).

For macOS users, the Flux CLI can be installed using [Homebrew](https://brew.sh):

```shell
brew install fluxcd/tap/flux
```

For Windows users, the Flux CLI can be installed using [winget](https://winstall.app/apps/FluxCD.Flux):

```shell
winget install --id=FluxCD.Flux  -e
```

### Shell autocompletion

The Flux CLI supports shell completion for Bash, Zsh and Fish and PowerShell.

When installing the Flux CLI using Homebrew, the completion scripts are automatically enabled.

On Linux, auto-completion can be enabled using the `flux completion` commands,
for example to enable it for Bash run:

```shell
echo "source <(flux completion bash)" >> ~/.bash_profile
```

On Windows, the PowerShell completion can be enabled by running:

```shell
cd "$env:USERPROFILE\Documents\WindowsPowerShell\Modules"
flux completion powershell >> flux-completion.ps1
```

The Flux CLI autocompletion works the same as `kubectl`, to get suggestions for the available commands flags,
namespaces, resources, etc., press the `Tab` key. Note that autocompletion for resource names
requires the namespace to be specified first e.g. `flux -n apps get kustomization <TAB>`.

### Cluster access configuration

The Flux CLI uses the Kubernetes configuration file (`~/.kube/config`) to access the cluster.
Similar to `kubectl`, the Flux CLI can be configured to use a different
configuration file by setting the `KUBECONFIG` environment variable or by using the `--kubeconfig` flag.

When the Kubernetes configuration file contains multiple contexts, the Flux CLI will use the current one.
To pick a different context, use the `--context` flag.

One notable difference between `kubectl` and `flux` is that the
Flux CLI defaults to the `flux-system` namespace when the `--namespace` flag is not set.

## Flux distribution status

Check the status of the Flux controllers and the CRDs installed on the cluster:

```shell
flux check
```

View the version of the Flux distribution installed on the cluster:

```shell
flux version
```

Note that is recommended for the CLI **minor version** to match the
Flux distribution version installed on the cluster. If the versions do not match,
the CLI could fail to query the cluster resources.

## Cluster reconciliation status

List all the Flux resources and their status at the cluster level:

```shell
flux get all --all-namespaces
```

Note that the `--all-namespaces` flag alias is `-A`.

To list all the resources in a specific namespace, use the `--namespace` flag (alias `-n`):

```shell
flux -n apps get all
```

Note that when not specifying the namespace, the `flux-system` namespace is used.

To list all the resources of a specific kind, use the `flux get <kind>` command. For example,
to list all the Flux Kustomizations in the `flux-system` namespace:

```shell
flux get kustomizations
```

To display the status of a specific resource, use the `flux get <kind> <name>` command. For example:

```shell
flux -n monitoring get kustomization kube-prometheus-stack
```

To find all the get commands available, run:

```shell
flux get --help
```

To view a report of Flux resources grouped by kind, including their readiness status and
the amount of cumulative storage used for each source:

```shell
flux stats -A
```

## Kubernetes objects inspection

To view the Kubernetes objects managed by a Flux Kustomization:

```shell
flux tree kustomization monitoring
```

The `flux tree` command displays all the managed Kubernetes objects by recursively inspecting
the Flux resources including HelmReleases. 

To determine if a specific Kubernetes object is managed by Flux:

```shell
flux -n apps trace deployment podinfo
```

The `flux trace` command displays the Flux Kustomization or HelmRelease that manages
the specified Kubernetes object and the Flux source (GitRepository, OCIRepository or HelmChart).
This command is useful to determine the source of a specific Kubernetes object including the
Git URL, branch, commit hash or the Helm chart version.

## Troubleshooting

List all Flux resources that are failing to reconcile and display the error message:

```shell
flux get all -A --status-selector ready=false
```

List all Flux resources that are currently reconciling and have not reached a ready state:

```shell
flux get all -A --status-selector ready=unknown
```

Display the events for all failing resources in a specific namespace:

```shell
flux -n apps events --types warning
```

Watch the error logs of all Flux controllers:

```shell
flux logs -A --level error --follow
```

### Flux Kustomization debugging

List all failed Kustomizations at the cluster level:

```shell
flux get kustomizations -A --status-selector ready=false
```

Display the configuration of a Kustomization:

```shell
flux -n apps export kustomization podinfo
```

Display the events of a Kustomization to see each reconciliation step:

```shell
flux -n apps events --for Kustomization/podinfo
```

Display the events of a Kustomization source, for example the GitRepository:

```shell
flux -n apps events --for GitRepository/podinfo
```

Display the logs of kustomize-controller for a specific Kustomization:

```shell
flux -n apps logs --kind Kustomization --name podinfo
```

Display the final variables used for post-build substitutions composed of referred ConfigMaps and Secrets:

```shell
flux -n apps debug kustomization podinfo --show-vars
```

Build a Flux Kustomization locally and display the resulting Kubernetes manifests:

```shell
flux -n apps build kustomization podinfo \
--path ./path/to/local/manifests \
--kustomization-file ./path/to/local/podinfo-kustomization.yaml
```

Note the build command can be used to test changes to Flux Kustomizations locally
before pushing the changes to the Git repository.

### Flux HelmRelease debugging

List all failed HelmReleases at the cluster level:

```shell
flux get helmreleases -A --status-selector ready=false
```

Display the final values of a HelmRelease including the merged values from ConfigMaps and Secrets:

```shell
flux -n apps debug helmrelease podinfo --show-values
```

Display the configuration of a HelmRelease:

```shell
flux -n apps export helmrelease podinfo
```

Display the events of a HelmRelease to troubleshoot the reconciliation process:

```shell
flux -n apps events --for HelmRelese/podinfo
```

Display the events of a HelmRelease source, for example the OCIRepository that provides the Helm chart:

```shell
flux -n apps events --for OCIRepository/podinfo
```

Display the logs of helm-controller for a specific HelmRelease:

```shell
flux -n apps logs --kind HelmRelease --name podinfo
```

Display the logs of source-controller for a specific Helm chart source:

```shell
flux -n apps logs --kind OCIRepository --name podinfo
```

## Read-only mode

To prevent users from altering the clusters state with commands such as
`flux delete` or `flux reconciler` and only allow read operations,
the following ClusterRole can be assigned to the Flux CLI users:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: flux-cli-readonly
rules:
- apiGroups:
  - source.toolkit.fluxcd.io
  - kustomize.toolkit.fluxcd.io
  - helm.toolkit.fluxcd.io
  - notification.toolkit.fluxcd.io
  - image.toolkit.fluxcd.io
  resources:
  - '*'
  verbs:
  - get
  - list
  - watch
- apiGroups:
  - apiextensions.k8s.io
  resources:
  - customresourcedefinitions
  verbs:
  - get
  - list
  - watch
- apiGroups:
  - apps
  resources:
  - deployments
  - replicasets
  verbs:
  - get
  - list
  - watch
- apiGroups:
  - ""
  resources:
  - pods
  - pods/log
  - events
  - namespaces
  - configmaps
  verbs:
  - get
  - list
  - watch
```

The following commands can be used in read-only mode:

- `flux build`
- `flux check`
- `flux debug`
- `flux events`
- `flux export`
- `flux get`
- `flux logs`
- `flux stats`
- `flux trace`
- `flux tree`
- `flux version`

Note that the `flux build` and `flux debug` commands may require get permissions for Kubernetes Secrets,
which are not included in the ClusterRole above.
