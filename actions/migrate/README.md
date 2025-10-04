# Migrate Flux Manifests GitHub Action

This GitHub Action can be used to automate the migration of Flux manifests to their latest API version.

## Usage

Example workflow for migrating all the Flux custom resources in the repository:

```yaml
name: Migrate Flux Manifests

on:
  workflow_dispatch:
  schedule:
    - cron: '00 7 * * 1-5'

jobs:
  migrate:
    runs-on: ubuntu-latest
    permissions:
      contents: write # to create branches
      pull-requests: write # to create PRs
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Flux
        id: setup
        uses: controlplaneio-fluxcd/distribution/actions/setup@main
      - name: Migrate manifests
        uses: controlplaneio-fluxcd/distribution/actions/migrate@main
      - name: Create Pull Request
        uses: peter-evans/create-pull-request@v6
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          branch: migrate-flux-manifests-${{ steps.setup.outputs.version }}
          commit-message: |
            Migrate Flux manifests to ${{ steps.setup.outputs.version }}
          title: Migrate Flux manifests to ${{ steps.setup.outputs.version }}
          body: |
            This PR migrates all the Flux custom resources to their latest API version.
```

The above workflow will migrate all Flux manifests in the repository to their latest API version
and create a Pull Request with the changes if any YAML manifest was modified.

## Action Inputs

| Name         | Description                                               | Default               |
|--------------|-----------------------------------------------------------|-----------------------|
| `path`       | Path to the directory containing the manifests to migrate | `.`                   |
| `version`    | Flux major.minor version e.g. 2.7                         | latest stable version |
| `extensions` | Comma separated list of file extensions to consider       | `.yaml,.yml`          |
