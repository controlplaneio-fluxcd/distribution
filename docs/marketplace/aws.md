# Deploy Flux from AWS Marketplace

AWS users can deploy the ControlPlane Enterprise Distribution of Flux CD
on Amazon EKS from the [AWS Marketplace](https://aws.amazon.com/marketplace/pp/prodview-ndm54wno7tayg). 

[![ControlPlane AWS](../images/AWSMP_NewLogo_RGB_BLK.svg#only-light){ width="400" }](https://aws.amazon.com/marketplace/pp/prodview-ndm54wno7tayg)
[![ControlPlane AWS](../images/AWSMP_NewLogo_RGB_WHT.svg#only-dark){ width="400" }](https://aws.amazon.com/marketplace/pp/prodview-ndm54wno7tayg)

## Prerequisites

After subscribing to the [ControlPlane product](https://aws.amazon.com/marketplace/pp/prodview-ndm54wno7tayg)
on the AWS Marketplace[^1], chose the Helm chart option and install it on your EKS cluster
in the `flux-system` namespace using the following Helm values:

```yaml
image:
  repository: 709825985650.dkr.ecr.us-east-1.amazonaws.com/controlplane/fluxcd/flux-operator
```

## Installation options

<div class="grid cards" markdown>

- :octicons-command-palette-24: __[Flux Bootstrap](#flux-bootstrap)__
- :octicons-gear-24: __[Flux Operator](#flux-operator)__

</div>

### Flux Bootstrap

Customers can bootstrap Flux with the enterprise distribution using the Flux CLI or the Flux Terraform provider.
To access the ControlPlane images from the AWS Marketplace, use the following registry URL:

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
create a `FluxInstance` resource:

```yaml
apiVersion: fluxcd.controlplane.io/v1
kind: FluxInstance
metadata:
  name: flux
  namespace: flux-system
spec:
  distribution:
    version: "2.x"
    registry: "709825985650.dkr.ecr.us-east-1.amazonaws.com/controlplane/fluxcd"
  cluster:
    type: aws
    multitenant: false
    networkPolicy: true
```

Apply the manifest with `kubectl`:

```shell
kubectl apply -f flux-instance.yaml
```

For more information, see the Flux Operator [documentation](../operator/index.md).

[^1]: AWS Marketplace and the AWS Marketplace logo are trademarks of Amazon.com, Inc. or its affiliates.
