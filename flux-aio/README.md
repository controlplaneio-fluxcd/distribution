# Enterprise Distribution for Flux AIO

Flux All-In-One is a lightweight Flux CD distribution made with [Timoni](https://timoni.sh)
for running the GitOps Toolkit controllers as a single deployable unit.

This distribution is optimized for running Flux on:

- Edge clusters with limited CPU and memory resources
- Bare clusters without a CNI plugin installed
- Clusters where plain HTTP communication is not allowed between pods
- Serverless clusters for cost optimisation (EKS Fargate, GKE Autopilot)

## Installation

To deploy the enterprise version of Flux AIO, run the following commands:

```shell
gh repo clone controlplaneio-fluxcd/distribution
cd distribution/flux-aio/bundles

TOKEN=<SUBSCRIPTION TOKEN> timoni bundle apply -f flux-aio.cue --runtime-from-env
```

The above command will install the enterprise version of Flux AIO in
the `flux-system` namespace and configure the Flux controllers to use the
FIPS-compliant container images.

## Documentation

To find out more about Flux AIO, see the following documentation:

- [Flux AIO specifications](https://timoni.sh/flux-aio/#specifications)
- [Flux installation](https://timoni.sh/flux-aio/#flux-installation)
- [Flux Git sync configuration](https://timoni.sh/flux-aio/#flux-git-sync-configuration)
- [Flux multi-tenancy configuration](https://timoni.sh/flux-aio/#flux-multi-tenancy-configuration)
