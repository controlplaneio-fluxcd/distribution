# Flux Push GitHub Action

This GitHub Action can be used to push OCI artifacts for usage with Flux.

## Usage

Example workflow for pushing the production artifacts:

```yaml
name: Push Production Artifacts

on:
  push:
    branches: [production]

jobs:
  push:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write # for pushing
      id-token: write # for signing
    steps:
    - uses: actions/checkout@v4
    - uses: controlplaneio-fluxcd/distribution/actions/setup@main
    - uses: sigstore/cosign-installer@v3
    - uses: docker/login-action@v3
      with:
        registry: ghcr.io
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}
    - uses: controlplaneio-fluxcd/distribution/actions/push@main
      id: push
      with:
        repository: ghcr.io/${{ github.repository }}
        path: clusters
        diff-tag: production
        tags: |
          prod-eu
          prod-us
        ignore-paths: |
          staging
        annotations: |
          app=my-app
          cluster=production
          env=production
    - if: steps.push.outputs.pushed == 'true'
      run: cosign sign --yes $DIGEST_URL
      env:
        DIGEST_URL: ${{ steps.push.outputs.digest-url }}
```

In the example above, the ignored paths are relative to the `path` parameter,
so the `clusters/staging` directory will be ignored.

Because the optional `diff-tag` parameter was specified, the action will
only push the artifact if the content has changed since the last push to
the `production` tag. The push will be to this tag.

## Action Inputs

| Name           | Description                                                                                                                 | Default                |
|----------------|-----------------------------------------------------------------------------------------------------------------------------|------------------------|
| `repository`   | The OCI repository to push to without the `oci://` prefix and without a tag or a digest                                     | (Required)             |
| `path`         | The path to the local directory containing the manifests to push                                                            | `.`                    |
| `diff-tag`     | A tag to diff against and push to. If specified, a new artifact is only pushed if the diff is not empty                     | (Optional)             |
| `tags`         | A new-line-separated list of tags for tagging the pushed artifact. If `diff-tag` is not specified, we push to the first tag | The `flux` CLI default |
| `ignore-paths` | A new-line-separated list of paths relatative to `path` to ignore                                                           | The `flux` CLI default |
| `annotations`  | A new-line-separated list of key-value pairs in the format `key=value` to add as annotations to the OCI artifact            | (Optional)             |

## Action Outputs

| Name         | Description                                                                                                                       |
|--------------|-----------------------------------------------------------------------------------------------------------------------------------|
| `pushed`     | A boolean indicating whether or not an artifact was pushed e.g. `true` or `false`                                                 |
| `digest`     | The artifact digest in the format `<alg>:<digest>` e.g. `sha256:a327880e53f5efe87dcc18fdc88e8d37ed9c3c40ca4b3b50bf850c46d9db4b56` |
| `digest-url` | The digest URL for signing e.g. `ghcr.io/owner/repo@sha256:a327880e53f5efe87dcc18fdc88e8d37ed9c3c40ca4b3b50bf850c46d9db4b56`      |

The digest outputs are only present when `pushed` is `true`.
