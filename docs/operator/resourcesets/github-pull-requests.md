# Ephemeral Environments for GitHub Pull Requests

This guide demonstrates how to use the Flux Operator ResourceSet API to automate the deployment of
applications changes made in GitHub Pull Requests to ephemeral environments for testing and validation.

## Development workflow

- A developer opens a Pull Request with changes to the app code and Helm chart.
- The CI builds and pushes the app container image to GitHub Container Registry. The image is tagged with the Git commit SHA.
- Another developer reviews the changes and labels the Pull Request with the `deploy/flux-preview` label.
- Flux Operator running in the preview cluster scans the repository and finds the new PR using the label filter.
- Flux Operator installs a Helm release using the PR number and the commit SHA inputs to deploy the app and chart changes in the cluster.
- The app is accessible at a preview URL composed of the PR number and the app name.
- The developers iterate over changes, with each push to the PR branch triggering a Helm release upgrade in the cluster.
- The developers are notified of the Helm release status in the Slack channel.
- Once the PR is approved and merged, the Flux Operator uninstalls the Helm release from the cluster.

## GitOps workflow

To enable the development workflow, we'll define a series of Flux Operator custom resources in the preview cluster.
Note that the preview cluster must be provisioned with a [Flux Instance](../fluxinstance.md) and the Kubernetes
manifests part of the GitOps workflow should be stored in the Git repository used by the Flux Instance.

### Preview namespace

First we'll create a dedicated namespace called `app-preview` where all the app instances generated
from GitHub Pull Requests will be deployed. We'll also create a service account for Flux that limits
the permissions to the `app-preview` namespace.

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: app-preview
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: flux
  namespace: app-preview
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: flux
  namespace: app-preview
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: admin
subjects:
  - kind: ServiceAccount
    name: flux
    namespace: app-preview
```

### GitHub authentication

In the `app-preview` namespace, we'll create a Kubernetes Secret
containing a GitHub PAT that grants read access to the app repository and PRs.

```shell
flux -n app-preview create secret git github-auth \
  --url=https://github.com/org/app \
  --username=flux \
  --password=${GITHUB_TOKEN}
```

Alternatively, we can use a GitHub App token for authentication:

```shell
flux create secret githubapp github-auth \
  --app-id="1" \
  --app-installation-id="2" \
  --app-private-key=./private-key-file.pem
```

Note that GitHub App support was added in Flux v2.5 and Flux Operator v0.15.

### ResourceSet input provider

In the `app-preview` namespace, we'll create a [ResourceSetInputProvider](../resourcesetinputprovider.md)
that tells Flux Operator to scan the repository for PRs labeled with `deploy/flux-preview`:

```yaml
apiVersion: fluxcd.controlplane.io/v1
kind: ResourceSetInputProvider
metadata:
  name: app-pull-requests
  namespace: app-preview
  annotations:
    fluxcd.controlplane.io/reconcileEvery: "10m"
spec:
  type: GitHubPullRequest
  url: https://github.com/org/app
  secretRef:
    name: github-auth
  filter:
    labels:
      - "deploy/flux-preview"
  defaultValues:
    chart: "charts/app"
```

### GitHub Webhook

Optionally, we can create a Flux [Webhook Receiver](https://fluxcd.io/flux/components/notification/receivers/)
that GitHub will call to notify the Flux Operator when a new PR is opened or updated: 

```yaml
apiVersion: notification.toolkit.fluxcd.io/v1
kind: Receiver
metadata:
  name: github-receiver
  namespace: app-preview
spec:
  type: github
  secretRef:
    name: receiver-token
  resources:
    - apiVersion: fluxcd.controlplane.io/v1
      kind: ResourceSetInputProvider
      name: app-pull-requests
```

### ResourceSet template

Finally, to deploy the app from PRs we'll create a [ResourceSet](../resourceset.md)
that takes its inputs from the `ResourceSetInputProvider`:

```yaml
apiVersion: fluxcd.controlplane.io/v1
kind: ResourceSet
metadata:
  name: app
  namespace: app-preview
spec:
  serviceAccountName: flux
  inputsFrom:
    - apiVersion: fluxcd.controlplane.io/v1
      kind: ResourceSetInputProvider
      name: app-pull-requests
  resources:
    - apiVersion: source.toolkit.fluxcd.io/v1
      kind: GitRepository
      metadata:
        name: app-<< inputs.id >>
        namespace: app-preview
      spec:
        provider: generic # or 'github' if using GitHub App
        interval: 1h
        url: https://github.com/org/app
        ref:
          commit: << inputs.sha >>
        secretRef:
          name: github-auth
    - apiVersion: helm.toolkit.fluxcd.io/v2
      kind: HelmRelease
      metadata:
        name: app-<< inputs.id >>
        namespace: app-preview
        annotations:
          event.toolkit.fluxcd.io/preview-url: "https://app-<< inputs.id >>.example.com"
          event.toolkit.fluxcd.io/branch: << inputs.branch | quote >>
          event.toolkit.fluxcd.io/author: << inputs.author | quote >>
      spec:
        serviceAccountName: flux
        interval: 10m
        releaseName: app-<< inputs.id >>
        chart:
          spec:
            chart: << inputs.chart >>
            reconcileStrategy: Revision
            sourceRef:
              kind: GitRepository
              name: app-<< inputs.id >>
        values:
          image:
            tag: << inputs.sha >>
          ingress:
            hosts:
              - host: app-<< inputs.id >>.example.com
```

The above `ResouceSet` will generate a Flux `GitRepository` and a `HelmRelease` for each opened PR.
The PR number passed as `<< inputs.id >>` is used as the name suffix for the Flux objects,
and is also used to compose the Ingress host name where the app can be accessed.

The latest commit SHA pushed to the PR HEAD is passed as `<< inputs.sha >>`,
the SHA is used to set the app image tag in the Helm release values.

The preview URL, branch name and author are set as annotations on the HelmRelease
object to enrich the Flux [notifications](#notifications) that the dev team receives.

To verify the ResourceSet templates are valid, we can use the
[Flux Operator CLI](app-definition.md/#working-with-resourcesets) and build them locally:

```shell
flux-operator build resourceset -f app-resourceset.yaml \
  --inputs-from test-inputs.yaml
```

The `test-inputs.yaml` file should contain mock PR data e.g.:

```yaml
   - author: test
     branch: feat/test
     id: "1"
     sha: bf5d6e01cf802734853f6f3417b237e3ad0ba35d
     title: 'testing'
```

### Notifications

To receive notifications when a PR triggers a Helm release install,
upgrade and uninstall (including any deploy errors),
a Flux [Alert](https://fluxcd.io/flux/components/notification/alerts/)
can be created in the `app-preview` namespace:

```yaml
---
apiVersion: notification.toolkit.fluxcd.io/v1beta3
kind: Provider
metadata:
  name: slack-bot
  namespace: app-preview
spec:
  type: slack
  channel: general
  address: https://slack.com/api/chat.postMessage
  secretRef:
    name: slack-bot-token
---
apiVersion: notification.toolkit.fluxcd.io/v1beta3
kind: Alert
metadata:
  name: slack
  namespace: app-preview
spec:
  providerRef:
    name: slack-bot
  eventSources:
    - kind: GitRepository
      name: '*'
    - kind: HelmRelease
      name: '*'
  eventMetadata:
    cluster: "preview-cluster-1"
    region: "us-east-1"
```

## Further reading

To learn more about ResourceSets and the various configuration options, see the following docs:

- [ResourceSet API reference](../resourceset.md)
- [ResourceSetInputProvider API reference](../resourcesetinputprovider.md)
