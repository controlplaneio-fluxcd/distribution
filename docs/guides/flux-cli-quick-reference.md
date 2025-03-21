# Flux CLI Quick Reference

This guide contains a list of commonly used `flux` commands
used to monitor and troubleshoot the GitOps workflows managed by Flux.

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

## Shell Auto Completion

The Flux CLI supports shell auto-completion for Bash, Zsh and Fish and PowerShell.

When installing the Flux CLI using Homebrew, the shell auto-completion scripts are automatically enabled.

On Linux, the shell auto-completion can be enabled using the `flux completion` commands,
for example to enable Bash auto-completion run:

```shell
echo "source <(flux completion bash)" >> ~/.bash_profile
```

On Windows, the PowerShell auto-completion can be enabled by running:

```shell
cd "$env:USERPROFILE\Documents\WindowsPowerShell\Modules"
flux completion powershell >> flux-completion.ps1
```

The Flux auto-completion works the same as `kubectl`, to get suggestions for the available commands flags,
namespaces, resources, etc., press the `Tab` key. Note that the auto-completion for resource names
requires the namespace to be specified e.g. `flux -n app get helmreleases <TAB>`.

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

## Cluster state inspection

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
flux -n monitoring get helmrelease kube-prometheus-stack
```

To find all the get commands available, run:

```shell
flux get --help
```

To view a report of Flux resources grouped by kind, including their reconcile status and
the amount of cumulative storage used for each source:

```shell
flux stats -A
```

## Managed Kubernetes objects inspection

To view the Kubernetes objects managed by a Flux Kustomization:

```shell
flux tree kustomization monitoring
```

The `flux tree` command displays all the Kubernetes objects managed by recursively inspecting
the Flux resources including HelmReleases. 

To determine if a specific Kubernetes object is managed by Flux:

```shell
flux -n apps trace deployment podinfo
```

The `flux trace` command displays the Flux Kustomization or HelmRelease that manages
the specified Kubernetes object and the Flux source (GitRepository, OCIRepository or HelmChart).
