---
title: "Redis Internals: From a Command to Memory and Disk"
description: Follow a Redis command through the event loop, data structures, expiration, eviction, persistence, and replication without reducing Redis to 'just a cache.'
image: "/images/writing/redis-internals.webp"
imageAlt: "A hand-drawn command flowing through an event-loop wheel into memory shelves, an append-only journal, a snapshot, and a replica."
imageWidth: 1600
imageHeight: 900
date: "2026-09-15"
topic: Systems
tags:
  - Redis
  - Databases
  - Backend
  - Systems
  - Performance
featured: false
draft: false
---

Redis is often summarized as an in-memory key-value store. That description is correct, but it hides the decisions that make Redis useful: a network server accepts commands, a command table selects an implementation, an in-memory keyspace points to specialized data structures, expiration and eviction reclaim keys for different reasons, and optional persistence and replication move state beyond one process.

This article follows that path from a client command to memory and disk. It focuses on the architecture that helps an application developer reason about latency, durability, and failure. It does not attempt to document every source file or promise performance numbers that depend on a particular machine and workload.

## The request path at a glance

Consider a client sending:

```text
HSET user:42 name Ada role engineer
```

At a high level, Redis must:

1. accept bytes from a client connection;
2. parse the Redis serialization protocol, RESP;
3. look up the command and validate its arguments and current server state;
4. find or create the key in the selected database;
5. update the hash's internal representation;
6. perform bookkeeping for memory, expiration, persistence, and replication;
7. encode and write the reply.

Each step has important details, but this sequence is a useful map. A command is not a direct magical lookup into RAM; it travels through a networked database server with policies and side effects.

## Connections and the event loop

Redis uses an event-driven design to manage client sockets. Instead of dedicating one command-execution thread to every connected client, the server watches many file descriptors for readiness, reads available input, and schedules work through its event loop.

This is where the common phrase “Redis is single-threaded” needs care. Command execution in a Redis shard is predominantly serialized, which gives individual commands a simple atomic execution model relative to other commands on that shard. Redis also uses background activity and can use threads for selected work, including I/O-related tasks depending on version and configuration. Persistence can involve child processes, and modules may introduce their own behavior.

The useful application-level conclusion is not “Redis has one thread.” It is this: a slow command can delay unrelated commands handled by the same server execution path. A command that scans too much data or performs expensive work is therefore a latency concern even when the machine has idle CPU cores.

## RESP: bytes before commands

Clients normally speak the [Redis serialization protocol](https://redis.io/docs/latest/develop/reference/protocol-spec/). RESP is binary-safe and represents arrays, bulk strings, integers, errors, maps, and other values. A client library turns a high-level call into protocol bytes and parses the reply back into its language's types.

Conceptually, the earlier `HSET` request resembles an array of bulk strings:

```text
*6
$4
HSET
$7
user:42
$4
name
$3
Ada
$4
role
$8
engineer
```

The line endings required by RESP are omitted from this display for readability. Production code should use a maintained client rather than assembling protocol frames manually.

Parsing establishes command boundaries and preserves arbitrary byte values. It does not decide what `HSET` means. Redis next resolves the command, checks arity and permissions, applies server-state restrictions, and enters the implementation associated with that command.

## The keyspace and Redis objects

A logical Redis database maintains a keyspace mapping keys to values. The value is not merely an untyped byte buffer. Redis exposes native data types—strings, hashes, lists, sets, sorted sets, streams, and others—with commands defined around their behavior.

Internally, the server can choose an encoding suited to a value's current contents. A small aggregate may use a compact representation. As it grows or changes, Redis can convert it to another representation that favors efficient operations at the cost of more memory.

That distinction explains two useful inspection commands:

```text
TYPE user:42
OBJECT ENCODING user:42
```

`TYPE` reports the public data type. `OBJECT ENCODING` reports the current internal encoding. The exact encoding is an implementation detail and can change across Redis versions or after a value crosses configured thresholds. Application correctness must depend on the public command contract, not on an encoding name.

Redis documents these compact representations in its [memory optimization guide](https://redis.io/docs/latest/operate/oss_and_stack/management/optimization/memory-optimization/). They are a CPU-and-memory tradeoff: a compact form can save substantial overhead for small values, while another form may be better once operations or sizes change.

## Memory use is more than payload size

An application's logical data is only part of Redis's process memory. Memory can also include:

- key and object metadata;
- allocator bookkeeping and fragmentation;
- client input and output buffers;
- replication buffers;
- persistence buffers;
- loaded scripts, modules, and internal data structures;
- copy-on-write pages while a child process persists data.

Inspect one key with:

```text
MEMORY USAGE user:42
```

Inspect server-level memory with:

```text
INFO memory
```

These commands answer different questions. `MEMORY USAGE` estimates bytes associated with a key and its value. `INFO memory` exposes process- and allocator-level measurements. Used memory and resident set size can diverge because an allocator does not always return freed pages to the operating system immediately, and fragmentation changes over time.

Do not extrapolate a full capacity plan from one tiny key. Measure representative key lengths, value sizes, encodings, client buffers, persistence behavior, replication, and peak workload on the intended Redis version.

## Expiration is not eviction

Redis can associate a time to live with a key:

```text
SET session:abc payload EX 300
TTL session:abc
```

When the time has passed, the key is logically expired. Redis can discover expired keys when they are accessed and can also sample and remove expired keys proactively. This combination avoids the cost of maintaining a timer callback for every key while still reclaiming keys that are never read again.

Eviction solves a different problem. When `maxmemory` is configured and memory reaches the limit, an eviction policy determines whether Redis should remove eligible keys or reject writes that require more memory. Policies differ in which keys they consider and how they approximate recency, frequency, or time to live.

An expired session disappeared because its lifetime ended. An evicted session disappeared because the instance needed space under its configured policy. Conflating the two makes cache misses and data-loss expectations difficult to reason about.

Review the current [key eviction documentation](https://redis.io/docs/latest/develop/reference/eviction/) before choosing a policy. If the data must not be evicted, isolate it from disposable cache data or configure and operate the instance accordingly.

## Persistence option one: RDB snapshots

RDB persistence produces a point-in-time representation of the dataset. In the normal background-save path, Redis forks and the child writes a temporary snapshot before it replaces the older file. The parent continues serving clients.

Forking does not immediately copy the entire dataset. The operating system initially lets parent and child share memory pages. When the parent changes a shared page, copy-on-write creates a private copy. This is why persistence overhead depends not only on dataset size but also on the rate and locality of writes while the snapshot is running.

RDB files are compact and useful for backups and restarts, but a periodic snapshot can lose writes that happened after the most recent completed snapshot. The acceptable snapshot interval is therefore a durability decision, not merely a performance setting.

## Persistence option two: AOF

The append-only file records dataset-changing operations so they can be replayed to rebuild state. The `appendfsync` policy controls how Redis requests synchronization with durable storage. A stricter policy can reduce the window of data loss but increases storage work and may affect latency.

Modern Redis uses a multipart AOF design: a base file represents a compact starting state, incremental files contain later changes, and a manifest tracks the active pieces. Rewriting prevents the history from growing forever by producing a new compact base while writes continue.

AOF is not an external transaction log that automatically makes every failure harmless. Durability still depends on configuration, filesystem and storage behavior, operating-system guarantees, and operational discipline. Read the [Redis persistence documentation](https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/) for the current tradeoffs and backup recommendations.

## Combining RDB and AOF

Redis can use neither format, one format, or both. A disposable cache may accept no persistence. A workload that needs recovery may select RDB, AOF, or both according to its recovery-time and recovery-point requirements.

When both are enabled, Redis uses the AOF during restart because it is expected to represent the more complete dataset. That does not remove the need to test restoration. Backups should be copied safely, retained outside the instance's failure domain, and exercised through an actual recovery procedure.

Durability also does not equal availability. A perfectly persisted file on an unavailable machine does not keep the service online.

## Replication is a second movement of state

A replica maintains a copy of a primary's dataset. The primary sends a stream of changes, and the replica applies them. If a replica cannot continue from the available replication backlog, it may need a full resynchronization.

Replication is asynchronous by default. A successful write response from the primary does not prove that every replica has durably stored that write. Commands such as `WAIT` can strengthen an acknowledgement condition for some workflows, but they do not turn Redis replication into a general-purpose consensus transaction or eliminate every data-loss scenario during failover.

Replication can support read scaling and failover designs, but stale reads, lag, promotion, client routing, and split-brain risk belong in the system model. Redis Sentinel and Redis Cluster address different topology and availability needs; neither substitutes for backups.

## Cluster changes where keys live

Redis Cluster partitions the keyspace into hash slots distributed across primary nodes. A client can be redirected when it sends a command to a node that does not own the relevant slot. Multi-key operations work only when their keys satisfy the cluster's co-location rules, commonly by using hash tags when related keys must share a slot.

Clustering therefore affects data modeling. A design that relies on arbitrary multi-key transactions on one standalone instance may not translate directly to a partitioned deployment. Plan key names, hot-key behavior, failure handling, and client support before treating cluster mode as a transparent capacity switch.

## A small inspection session

The following sequence is safe to run against a disposable local instance. Do not use broad inspection commands casually on a production server.

```text
HSET user:42 name Ada role engineer
TYPE user:42
OBJECT ENCODING user:42
MEMORY USAGE user:42
EXPIRE user:42 300
TTL user:42
INFO memory
SLOWLOG LEN
```

Expect the public type to be `hash` and the TTL to be near 300 seconds immediately after assignment. Do not hard-code the encoding, byte count, complete `INFO` response, or slow-log length into a test: those depend on Redis version, configuration, allocator, platform, and instance history.

`SLOWLOG` records command execution time after input is read and before the reply is written; it is not an end-to-end network latency measurement. Use it to find expensive command execution, then correlate with client latency, server metrics, operating-system behavior, persistence activity, and traffic.

## Operational questions the internals help answer

### Why did latency spike during persistence?

Investigate fork time, storage latency, write rate, copy-on-write memory, and host pressure. “Redis is in memory” does not mean persistence is free.

### Why is resident memory still high after deleting keys?

The allocator may retain pages, and fragmentation can keep the process's resident set above Redis's logical used-memory measurement. Inspect the relevant `INFO memory` fields before assuming a leak.

### Why did one expensive command affect other clients?

Commands are predominantly executed serially within a shard. Large scans, huge values, scripts, module commands, or unexpectedly expensive operations can occupy the command path. Prefer incremental `SCAN`-family operations over blocking full-keyspace enumeration, and measure representative data.

### Why did a write disappear after failover?

Asynchronous replication permits a window in which an acknowledged primary write has not reached the promoted replica. Persistence, replication acknowledgement, failover policy, and application-level idempotency address different parts of the problem.

### Why did a key vanish before its TTL?

Check `maxmemory` and the eviction policy. The key may have been evicted under memory pressure rather than expired.

## Read source with a version in mind

Redis's official site includes an [internals section](https://redis.io/docs/latest/operate/oss_and_stack/reference/internals/) containing early design documents. They are valuable historical explanations, but Redis explicitly warns that they may not reflect the latest implementation.

For current implementation questions, select a Redis release, read that release's documentation, and inspect the matching source tree. Connect a claim to a command, configuration option, metric, or source path that actually exists in that version. Avoid repeating an old internal detail as if it were a permanent architectural contract.

## The practical model

Redis is fast because it combines in-memory data with a deliberately constrained execution model and specialized structures. Those same choices expose boundaries: memory is finite, long commands affect neighbors, persistence consumes real resources, asynchronous replicas can lag, and clustering changes which operations can be local.

Understanding the request path turns those boundaries into design inputs. Choose the public data type for the operations you need, inspect real memory rather than counting payload bytes, separate expiration from eviction, select persistence according to a stated loss window, and treat replication and backups as different tools. That is a stronger foundation than calling Redis “just a cache” or assuming that memory makes failure disappear.
