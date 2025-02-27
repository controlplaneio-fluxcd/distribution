# Setup Flux GitHub Action

This GitHub Action can be used to download the Flux CLI for Enterprise
Distribution versions inside GitHub Workflows. If not specified, the
version defaults to the latest stable Enterprise Distribution version.

## Usage

Example workflow for printing the latest Enterprise Distribution version:

```yaml
name: Check the latest verions of the Flux Enterprise Distribution

on:
  workflow_dispatch:

jobs:
  check-latest-flux-enterprise-version:
    runs-on: ubuntu-latest
    steps:
      - name: Setup Flux
        uses: controlplaneio-fluxcd/distribution/actions/setup@main
      - name: Print Flux Version
        run: flux version --client
```

## Action Inputs

| Name               | Description                                  | Default                                                                            |
|--------------------|----------------------------------------------|------------------------------------------------------------------------------------|
| `version`          | Distribution version e.g. v2.X.Y             | The latest stable release                                                          |
| `bindir`           | Alternative location for the Flux CLI binary | `$RUNNER_TOOL_CACHE`                                                               |
| `distribution-url` | Distribution images info URL                 | `https://raw.githubusercontent.com/controlplaneio-fluxcd/distribution/main/images` |

## Action Outputs

| Name      | Description                                |
|-----------|--------------------------------------------|
| `version` | The version that was effectively installed |
