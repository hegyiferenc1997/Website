---
title: Scaling and Caching
summary: What to do when one server isn't enough: connection pooling, caching (the cache-aside pattern with Redis, invalidation), read replicas, vertical and horizontal scaling and sharding, and the most important metrics to monitor.
minutes: 25
---

## What you will learn

- what **connection pooling** is, and why it's indispensable,
- how **caching** works, and why **invalidation** is hard,
- when **read replicas** and **sharding** help,
- which **metrics** are worth watching.

## The order: from cheapest to most expensive

Before buying new servers, go through this list – most problems are solved in the first steps:

1. **Measure**: which query takes the time? (pg_stat_statements, `EXPLAIN ANALYZE`)
2. Improve **queries and indexes** (lesson 1, topic 7).
3. **Schema**: materialised views, denormalisation, partitioning (lesson 2).
4. **Connection pooling** and **caching**.
5. **A bigger machine** (vertical scaling).
6. **Read replicas**.
7. **Sharding** (horizontal scaling for writes) – the most complicated, only if you really must.

## Connection pooling

Setting up a database connection is expensive: authentication, a TLS handshake, and PostgreSQL starts a **separate process** for every connection (a few MB of memory). If a web application opens a new connection for every request, or a thousand instances run at once, the server drowns in handling connections.

A **connection pool** keeps a few dozen connections **open**, and requests borrow and return them – like a car rental: they don't build a new car for every customer.

```text
  1000 requests ──► [ connection pool: 20 open connections ] ──► database
                      (PgBouncer, or the application's own pool)
```

For PostgreSQL the best-known external tool is **PgBouncer**; most programming languages' database libraries have a built-in pool too.

## Caching

The fastest query is the one you **don't have to run**. If the same data is requested by many people, many times (the home page's products, a popular article), we can keep the result in an in-memory store, e.g. **Redis** (topic 11).

The most common is the **cache-aside** (_lazy loading_) pattern:

```text
  1. The application looks in the cache:  GET product:42
  2a. If it's there (hit) → done, it doesn't even touch the database.
  2b. If it isn't (miss)  → queries it from the database,
                            puts it into the cache with an expiry:  SET product:42 … EX 300
                            and returns it.
```

### The hard part: invalidation

> "There are only two hard things in Computer Science: cache invalidation and naming things." – Phil Karlton

If the product's price changes in the database, the cache still holds the old price. Solutions:

- **Expiry time** (_TTL_): the data disappears by itself, e.g. after 5 minutes. Simple, but old data may show for up to 5 minutes.
- **Invalidation on write**: when the application changes the product, it also deletes it from the cache (`DEL product:42`).
- **What not to cache?** Anything that must always be exact: stock at the moment of payment, balances, privileges.

## Vertical and horizontal scaling

- **Vertical** (_scale up_): a bigger machine – more CPU, more memory (more fits into the buffer!), faster SSDs. The simplest, needs no code changes, and today a single server can take a surprising amount. But it has an upper limit, and one machine failing means the whole system failing.
- **Horizontal** (_scale out_): more machines. Its two main forms are read replicas and sharding.

## Read replicas

In most applications there are far more **reads** than writes (in a web shop a hundred people browse before one buys). **Read replicas** (topic 13) are copies of the primary server that can be read from:

```text
              write ──►  [ primary ] ──WAL──► [ replica 1 ]  ◄── read
                                     ──WAL──► [ replica 2 ]  ◄── read
```

Watch out for **replication lag**: with an asynchronous replica, freshly written data isn't visible on the replica for a moment. If a user changes their profile and reloads the page right away, it's worth serving that read from the primary (_read-your-writes_).

## Sharding

When even the **writes** don't fit on one machine, the data has to be **split** across several independent databases – this is **sharding**. For example customers by ID: 1–1,000,000 on the first server, the rest on the second; or based on a hash.

- **Pro**: write capacity can grow almost without limit too.
- **Con**: queries and transactions touching several shards are complicated and slow, redistributing (_resharding_) is painful, and the **shard key** has to be chosen well for an even distribution.

That's why sharding is the last step. Some systems hide its complexity (e.g. Citus for PostgreSQL, or CockroachDB, Google Spanner, Vitess for MySQL).

## What to watch – the most important metrics

| Metric                                         | What does it tell you?                                   |
| ---------------------------------------------- | -------------------------------------------------------- |
| **Query time** (average, 95th/99th percentile) | the speed users feel; percentiles show the "slow tail"   |
| **Buffer hit ratio**                           | if it drops below 99%, memory is short or a query is bad |
| **Number of active connections**               | close to the limit? Is a connection pool needed?         |
| **Lock waits, deadlocks**                      | transactions blocking each other (topic 8)               |
| **Replication lag**                            | how fresh the replica is                                 |
| **Disk: IOPS, latency, free space**            | whether storage can cope (topic 13)                      |

## Summary

- Order: measure → queries and indexes → schema → connection pool and cache → bigger machine → replicas → sharding.
- Connection pool: a few reused connections for many requests (PgBouncer).
- Cache-aside: the cache first, the database on a miss; invalidation with a TTL or on write.
- Read replicas: spreading reads; watch out for replication lag.
- Sharding: splitting writes – great power, great complexity.

## The lesson's exercise

```quiz required
? A web application opens a new database connection for every request, and at peak times the server drowns in handling connections. What's the most obvious solution?
- sharding
+ a connection pool (e.g. PgBouncer)
- partitioning
- a materialised view
! A few connections kept open, borrowed by the requests.

? In the cache-aside pattern, what happens if the requested data isn't in the cache?
- the application returns an error
+ the application queries it from the database, puts it into the cache, and returns it
- the cache queries the database by itself every minute
- the request is redirected to a replica
! Lazy loading: it only gets in when someone asks for it.

? A product's price was changed, but customers still see the old price for 5 minutes. What could be the cause?
+ the old price stayed in the cache with a 5-minute expiry, and it wasn't invalidated on write
- the B-tree index is outdated
- the WAL hasn't been written yet
- the replication factor is too large
! Invalidate on write, or use a shorter TTL.

? In a web shop reads outnumber writes a hundred to one, and the primary server can't cope anymore. Which step helps most with the least complexity?
- sharding
+ read replicas
- more indexes on every column
- denormalising the tables into a single table
! Reads can be steered to the replicas.

? A user changes their profile, reloads the page, and sees the old data. Reads come from an asynchronous replica. What's this phenomenon called?
- deadlock
+ replication lag
- the N+1 problem
- partition pruning
! The fresh write hasn't reached the replica yet.
```
