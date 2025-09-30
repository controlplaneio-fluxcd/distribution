---
title: Deploy Flux from AWS Marketplace
description: FluxCD Enterprise installation guide from AWS Marketplace
---

# Deploy Flux from AWS Marketplace

AWS users can deploy the ControlPlane Enterprise Distribution of Flux CD
on Amazon EKS from the [AWS Marketplace](https://aws.amazon.com/marketplace/pp/prodview-ndm54wno7tayg). 

[![ControlPlane AWS](../images/AWSMP_NewLogo_RGB_BLK.svg#only-light){ width="400" }](https://aws.amazon.com/marketplace/pp/prodview-ndm54wno7tayg)
[![ControlPlane AWS](../images/AWSMP_NewLogo_RGB_WHT.svg#only-dark){ width="400" }](https://aws.amazon.com/marketplace/pp/prodview-ndm54wno7tayg)

## Prerequisites

After subscribing to the [ControlPlane product](https://aws.amazon.com/marketplace/pp/prodview-ndm54wno7tayg),
deploy the Flux Operator on your EKS cluster using the Helm chart provided in the AWS Marketplace.

### IAM Permissions

First you need to grant the `flux-operator` service account from the `flux-system` namespace the
necessary permissions to access the AWS Marketplace metering API. You can use the AWS managed
policy `arn:aws:iam::aws:policy/AWSMarketplaceMeteringRegisterUsage` for this purpose.

Example using `eksctl` with [IAM Roles for Service Accounts](https://eksctl.io/usage/iamserviceaccounts/):

```shell
eksctl create iamserviceaccount --cluster=<clusterName> \
  --name=flux-operator \
  --namespace=flux-system \
  --attach-policy-arn=arn:aws:iam::aws:policy/AWSMarketplaceMeteringRegisterUsage \
  --approve
```

### Helm Chart Installation

Deploy the `flux-operator` Helm chart on your EKS cluster in the `flux-system` namespace using
the following values:

```yaml
helm upgrade -i flux-operator oci://ghcr.io/controlplaneio-fluxcd/charts/flux-operator \
  --namespace flux-system \
  --set serviceAccount.create=false \
  --set image.repository=709825985650.dkr.ecr.us-east-1.amazonaws.com/controlplane/fluxcd/flux-operator \
  --set marketplace.type=aws
```

### Entitlements Verification

To verify that the AWS Marketplace entitlements are valid,
check the report generated in the `flux-system` namespace:

```console
$ kubectl -n flux-system get fluxreport/flux -o wide
NAME   ENTITLEMENT                  AGE   READY   STATUS
flux   Issued by controlplane-aws   1m    True    Reporting finished in 34ms
```

## Flux Installation Options

<div class="grid cards" markdown>

- :octicons-command-palette-24: __[Flux Bootstrap](#flux-bootstrap)__
- :octicons-gear-24: __[Flux Operator](#flux-operator)__

</div>

### Flux Bootstrap

Customers can bootstrap Flux with the enterprise distribution using the Flux CLI or the Flux Terraform provider.
To access the ControlPlane images from the AWS Marketplace[^1], use the following registry URL:

```shell
709825985650.dkr.ecr.us-east-1.amazonaws.com/controlplane/fluxcd
```

Example of Flux CLI bootstrap with the FIPS-compliant images hosted on AWS ECR:

```bash
flux bootstrap github \
  --owner=customer-org \
  --repository=customer-repo \
  --branch=main \
  --path=clusters/production \
  --registry=709825985650.dkr.ecr.us-east-1.amazonaws.com/controlplane/fluxcd
```

Example of Flux Terraform Provider bootstrap:

```hcl
resource "flux_bootstrap_git" "this" {
  embedded_manifests   = true
  path                 = "clusters/my-cluster"
  registry             = "709825985650.dkr.ecr.us-east-1.amazonaws.com/controlplane/fluxcd"
}
```

Running the bootstrap command for a cluster with an existing Flux installation will trigger
an in-place upgrade of the Flux controllers to the ControlPlane distribution.

### Flux Operator

To deploy the enterprise distribution with Flux Operator from the AWS Marketplace,
create a `FluxInstance` resource named `flux` in the `flux-system` namespace
with the following configuration:

```yaml
apiVersion: fluxcd.controlplane.io/v1
kind: FluxInstance
metadata:
  name: flux
  namespace: flux-system
spec:
  distribution:
    version: "2.7.x"
    registry: "709825985650.dkr.ecr.us-east-1.amazonaws.com/controlplane/fluxcd"
  cluster:
    type: aws
    multitenant: false
    networkPolicy: true
    domain: "cluster.local"
```

Apply the manifest with `kubectl`:

```shell
kubectl apply -f flux-instance.yaml
```

On EKS clusters with access to GitHub Container Registry, the operator can check for updates
and automatically update the Flux controllers to the latest patch version without having to 
upgrade the Flux Operator Helm chart from the AWS Marketplace.

To enable the automatic upgrade feature, configure the Flux instance as follows:

```yaml
apiVersion: fluxcd.controlplane.io/v1
kind: FluxInstance
metadata:
  name: flux
  namespace: flux-system
  annotations:
    fluxcd.controlplane.io/reconcileEvery: "1h"
    fluxcd.controlplane.io/reconcileTimeout: "5m"
spec:
  distribution:
    version: "2.4.x"
    registry: "709825985650.dkr.ecr.us-east-1.amazonaws.com/controlplane/fluxcd"
    artifact: "oci://ghcr.io/controlplaneio-fluxcd/flux-operator-manifests"
  cluster:
    type: aws
    multitenant: false
    networkPolicy: true
    domain: "cluster.local"
```

For more information, see the Flux Operator [documentation](../operator/index.md).

[^1]: AWS Marketplace and the AWS Marketplace logo are trademarks of Amazon.com, Inc. or its affiliates.
