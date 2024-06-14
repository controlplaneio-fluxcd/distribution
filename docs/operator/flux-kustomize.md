# Flux Instance Customization

The [FluxInstance](fluxinstance.md) allows for the customization of the
Flux controller deployments and the Flux sync custom resources using Kustomize patches.

## Kustomize patches usage

You can make changes to all controllers using a single patch
or target a specific controller:

```yaml
apiVersion: fluxcd.controlplane.io/v1
kind: FluxInstance
spec:
  kustomize:
    patches:
      # target all controller deployments
      - patch: |
          # strategic merge or JSON patch
        target:
          kind: Deployment
      # target multiple controller deployments by name
      - patch: |
          # strategic merge or JSON patch      
        target:
          kind: Deployment
          name: "(kustomize-controller|helm-controller)"
      # target a single controller service account by name
      - patch: |
          # strategic merge or JSON patch     
        target:
          kind: ServiceAccount
          name: "source-controller"
```

## Examples

The following examples demonstrate how to customize the Flux manifests.

### Increase concurrency and resources limits

```yaml
apiVersion: fluxcd.controlplane.io/v1
kind: FluxInstance
spec:
  kustomize:
    patches:
      - patch: |
          - op: add
            path: /spec/template/spec/containers/0/args/-
            value: --concurrent=10
          - op: add
            path: /spec/template/spec/containers/0/args/-
            value: --requeue-dependency=5s 
          - op: replace
            path: /spec/template/spec/containers/0/resources/limits
            value:
              cpu: 2000m
              memory: 2048Mi
        target:
          kind: Deployment
          name: "(kustomize-controller|helm-controller|source-controller)"
```

### Node affinity and tolerations

```yaml
apiVersion: fluxcd.controlplane.io/v1
kind: FluxInstance
spec:
  kustomize:
    patches:
      - patch: |
          apiVersion: apps/v1
          kind: Deployment
          metadata:
            name: all
          spec:
            template:
              metadata:
                annotations:
                  cluster-autoscaler.kubernetes.io/safe-to-evict: "true"
              spec:
                affinity:
                  nodeAffinity:
                    requiredDuringSchedulingIgnoredDuringExecution:
                      nodeSelectorTerms:
                        - matchExpressions:
                            - key: role
                              operator: In
                              values:
                                - flux
                tolerations:
                  - effect: NoSchedule
                    key: role
                    operator: Equal
                    value: flux      
        target:
          kind: Deployment
```

### HTTP/S Proxy

```yaml
apiVersion: fluxcd.controlplane.io/v1
kind: FluxInstance
spec:
  kustomize:
    patches:
      - patch: |
          apiVersion: apps/v1
          kind: Deployment
          metadata:
            name: all
          spec:
            template:
              spec:
                containers:
                  - name: manager
                    env:
                      - name: "HTTPS_PROXY"
                        value: "https://proxy.example.com"
                      - name: "NO_PROXY"
                        value: ".cluster.local.,.cluster.local,.svc"      
        target:
          kind: Deployment
```

### Cluster sync semver range

```yaml
apiVersion: fluxcd.controlplane.io/v1
kind: FluxInstance
spec:
  kustomize:
    patches:
      - patch: |
          - op: replace
            path: /spec/ref
            value:
              semver: ">=1.0.0-0"
        target:
          kind: (GitRepository|OCIRepository)
```

### Cluster sync AWS workload identity

```yaml
apiVersion: fluxcd.controlplane.io/v1
kind: FluxInstance
spec:
  kustomize:
    patches:
      - patch: |
          apiVersion: v1
          kind: ServiceAccount
          metadata:
            name: controller
          annotations:
            eks.amazonaws.com/role-arn: <ROLE ARN>
        target:
          kind: ServiceAccount
          name: "(source-controller|image-reflector-controller)"
      - patch: |
          apiVersion: source.toolkit.fluxcd.io/v1beta2
          kind: OCIRepository
          metadata:
            name: flux-system
          spec:
            provider: aws
        target:
          kind: OCIRepository
```

For more examples, refer to the [Flux bootstrap documentation](https://fluxcd.io/flux/installation/configuration/).
