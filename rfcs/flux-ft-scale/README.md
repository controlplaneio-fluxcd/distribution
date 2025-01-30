# [RFC] Flux Fault Tolerance and Scalability

**Status:** provisional

**Creation date:** 2024-02-28

**Last update:** 2024-02-28

## Summary

This RFC proposes a set of changes to the Flux controllers to improve fault tolerance and scalability of the system.

## Motivation

The flux current Flux controllers are optimized to run a single instance of each controller. Concurrency is configurable in order to handle a large number of resources, caching is used to avoid unnecessaty API calls and to reduce memory usage, and the controllers are designed to be as efficient as possible. And scaling vertically is quite easy, it is a matter of increasing the resources of the machine where the controllers are running and editing the kubernetes deployment of the controllers.

However, the need for fault tolerance and horizontal scaling becomes more and more important as the number of resources managed by Flux increases. In some scenarios, we can not afford to refetch all the artifacts from the sources in the case of a controller failure, and in some other scenarios, we need to be able to scale the controllers horizontally to handle the load.

Flux controllers provide an HA mode, which functions by running multiple instances of the controllers. It can if enabled, use a leader election mechanism (through Kubernetes Leader election API) to ensure that only one instance is active at any given time. This mechanism is effective at ensuring that the system remains operational in the event of a controller failure, but it has some limitations:
1. Source-controller olds fetched artifacts in the local filesystem, which means that if the leader fails, the new leader will have to refetch all the artifacts from the sources. This can be a slow process and can lead to a significant delay in the reconciliation of the resources.
2. Scaling the controllers horizontally is not possible, as the leader election mechanism ensures that only one instance is active at any given time.

It is possible to circumvent the first limitations by using a persistent volume to store the fetched artifacts, hence all the instances of the controllers can share the same artifacts storage. Nevertheless, this means that the cluster administrator has to provide a persistent volume for the controllers.

It is possible to circumvent the horizontal scaling limitation by running multiple instances of the controllers, each with a different set of resources to manage. That is a feature provided under the name of `sharding`. However, this feature is not very user-friendly, as it requires the user to manually configure the resources to be managed by each instance of the controllers by adding a label to the resources with the key `sharding.fluxcd.io/key` and the value assigned to the instance of the controller that should manage the resource. This is not a very user-friendly feature, as it requires the user to manually configure the resources to be managed by each instance of the controllers. The assignment can moved up to the administrators of the cluster, but it is still a manual process. And some other limiting scenarios are:
- In the case where we want to rebalance the resources between the shards, we need to manually update the resources that need to be moved to the new shard.
- In the case where we reduce the number of shards, we need to manually update the resources that need to be moved to the remaining shards.

The proposed sharding mechanism is also not very flexible as it needs to have a deployment for each shard. So shards cannot share artifacts storage, and should be replicated independently. This means that if we want to enable HA, each shard should have at least two replicas, which can lead to a significant increase in the number of resources used by the controllers.

## Goals
- Improve fault tolerance by providing a mechanism to share the fetched artifacts between the instances of the controllers.
- Make the fault tolerance level configurable.
- Improve scalability by providing a mechanism to scale the controllers horizontally.
- Make the sharding mechanism more user-friendly and flexible.
- Provide a mechanism to rebalance the resources between the shards without manual intervention.
- Provide a mechanism to reduce the number of shards without the need to edit the resources that need to be moved to the remaining shards.

## Non-Goals


## Proposal

### Fault Tolerance

We propose to use a leader-less approach for replicated the artifacts storage. This concerns only souce-controller and image-repository-controller, as the other controllers are stateless. The replication level will be configurable and will be set to 1 by default. The replication level will be set using the `--replication-level` flag. The value of the flag will be the number of replicas that old a given artifact.

We propose using a gossip protocol in order to add controllers to the cluster members. Each controller has enroll to the cluster. Based on the `replication level` and the known cluster members, a controller can replicate a given artifact. This is the dynamo style replication used by Riak, Cassandra or even Cortex Metrics.

This gives us the following advantages:
- The artifacts are replicated between the instances of the controllers, which means that if a controller fails, the new controller will not have to refetch all the artifacts from the sources. The new controller will be able to fetch the artifacts from the other instances of the controllers.
- The replication level is configurable, which means that the cluster administrator can set the level of fault tolerance that is needed for the workload.
- The flexibility of the leader-less approach allows us to position the controllers in different nodes, AZs or even regions.

#### Storage

We propose using a statefulset to run the controllers. The statefulset will be used to ensure that each instance of the controllers has a unique persistent identity, hostname and its own persistent volume. The persistent volume will be used to store the fetched artifacts. 


### Scalability

We propose to use a consistent hashing mechanism to shard the resources between the instances of the controllers.
The hash ring is divided into a number of shards, where each shard is a range of keys. The number of shards is configurable and will be set using the `--shards` flag. The value of the flag will be the number of shards. The gossip protocol will be used to exchange the hash ring between the instances of the controllers. This means that an instance of a controller can be responsible for more than one shard if the number of instances of the controllers is less than the number of shards.

#### hooking this into controller-runtime mechanisms

Controller-runtime provides a leader election mechanism, which is used to ensure that only one instance of the controllers is active at any given time. In our case we disable the leader election, so we need to ensure that we avoid race conditions between the instances of the controllers. With the hash ring, every controller knows which shard it is responsible for, but in order to support rebalancing of the resources between the shards, we need to be able to get all resources in local cache. We will use a watch predicate to filter the resources to reconcile based on the shard that the controller is responsible for.

** Note ** To reduce memory we could get only partial metadata of the resources, and get the full resource only when we need to reconcile it.

#### Rebalancing


## User Stories


## Implementation


## Alternatives
