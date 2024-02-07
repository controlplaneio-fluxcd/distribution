# Update Flux GitHub Action

This GitHub Action can be used to automate the update of the
Enterprise Distribution for Flux CD on clusters via Pull Requests.

## Usage

Example workflow for keeping the Flux controllers images digests
and manifests up-to-date with the latest version of the Enterprise Distribution:

```yaml
name: Update Enterprise Distribution for Flux CD

on:
  workflow_dispatch:
  schedule:
    - cron: '00 7 * * 1-5'

permissions:
  contents: read

jobs:
  generate:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Update manifests
        id: update
        uses: controlplaneio-fluxcd/distribution/actions/update@main
        with:
          path: clusters/production/flux-system
          image-pull-secret: flux-enterprise-auth
          registry: ghcr.io/controlplaneio-fluxcd
          variant: distroless
      - name: Create Pull Request
        uses: peter-evans/create-pull-request@v6
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          branch: update-flux-${{ steps.update.outputs.version }}
          commit-message: |
            Update manifests and image digests for Flux ${{ steps.update.outputs.version }}
          title: Update Flux to ${{ steps.update.outputs.version }}
          body: |
            Update manifests and image digests for Flux ${{ steps.update.outputs.version }}
```

The above example will run the workflow every Monday to Friday at 7am UTC,
and will create a Pull Request for the Flux manifests under `clusters/production/flux-system`
when new versions of the Enterprise Distribution are available.

## Action Inputs

| Name                | Description                                                         | Default                                                                                                                                 |
|---------------------|---------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------|
| `path`              | Path to the flux-system dir e.g. `clusters/production/flux-system/` |                                                                                                                                         |
| `registry`          | Container Registry Address                                          | `ghcr.io/controlplaneio-fluxcd`                                                                                                         |
| `variant`           | Base image OS e.g. `alpine` or `distroless`                         | `alpine`                                                                                                                                |
| `image-pull-secret` | Name of the Kubernetes image pull secret                            | `flux-enterprise-auth`                                                                                                                  |
| `components`        | Flux components comma separated list                                | `source-controller,kustomize-controller,helm-controller,notification-controller,image-reflector-controller,image-automation-controller` |
| `bindir`            | Alternative location for the Flux CLI binary                        | `$RUNNER_TOOL_CACHE`                                                                                                                    |
