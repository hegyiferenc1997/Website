---
title: Graph Databases
summary: What a property graph is (nodes, edges, labels, properties), how to query a graph with the Cypher language, why graph traversal is faster than many JOINs, and what graph databases are used for (social networks, recommendations, fraud detection).
minutes: 22
---

## What you will learn

- what a **graph** is, and how a **graph database** stores it,
- what a query looks like in **Cypher**,
- when a graph beats relational tables,
- what it's used for in practice.

## What is a graph?

In mathematics a graph consists of **nodes** (_vertices_) and the **edges** (_relationships_) connecting them. Lots of things in real life are graphs:

- a social network: people (nodes) and acquaintances (edges),
- a map: junctions and roads,
- a curriculum: courses and prerequisites,
- a web shop: customers, products and "bought" relationships.

## The property graph model

Most graph databases (e.g. **Neo4j**, **Amazon Neptune**, **Memgraph**) use the **property graph** model:

- **nodes** have **labels** (e.g. `Student`, `Course`) and **properties** (e.g. `name: "Anna Kiss"`),
- **edges** have a **type** and a **direction** (e.g. `TOOK`), and they can have properties too (e.g. `grade: 5`).

```text
   (Student {name: "Anna Kiss"}) ──[:TOOK {grade: 5}]──► (Course {name: "Databases"})
            │                                                   ▲
            │ [:KNOWS]                                          │ [:TOOK {grade: 4}]
            ▼                                                   │
   (Student {name: "Bela Nagy"}) ───────────────────────────────┘
```

The key point: the relationship is a **first-class element**. In a relational database a relationship is described by a foreign key and a junction table, and at query time we "compute" it with a JOIN. In a graph database the edge is **actually stored**: every node "knows" which nodes it's directly connected to.

## Querying with Cypher

**Cypher** is Neo4j's query language (the standard **GQL** grew out of it). What's special about it is that you practically "draw" the pattern with brackets and arrows:

```text
// Who does Anna Kiss know?
MATCH (a:Student {name: "Anna Kiss"})-[:KNOWS]->(b:Student)
RETURN b.name;

// Friends of Anna's friends whom Anna doesn't know yet (friend suggestions)
MATCH (a:Student {name: "Anna Kiss"})-[:KNOWS]->()-[:KNOWS]->(c:Student)
WHERE NOT (a)-[:KNOWS]->(c) AND c <> a
RETURN DISTINCT c.name;

// The shortest chain of acquaintances between two people
MATCH p = shortestPath((a:Student {name: "Anna Kiss"})-[:KNOWS*]-(z:Student {name: "Emma Varga"}))
RETURN p;
```

- `( )` = node, `-[ ]->` = directed edge,
- `[:KNOWS*]` = a chain of acquaintances of any length,
- `shortestPath` = shortest path – writing this in SQL would be quite laborious!

## Why is graph traversal faster?

Suppose we're looking for "friends of friends of friends" (3 steps).

- In a **relational** database this is a triple self-join on the `friendships` table. Every JOIN is an index lookup in the **whole** table, and the intermediate results grow explosively.
- In a **graph** database the traversal **follows pointers** from node to node. The cost of one step only depends on how many neighbours the given node has – not on how big the whole database is. This is called **index-free adjacency**.

> Analogy: a relational database is like looking up each of your friends in the phone book. A graph is like everyone carrying a list of their own friends in their pocket – you just go there and ask.

But if the question is "what was last year's total revenue?", the graph has no advantage – there relational (or column) storage is better.

## What is it used for?

| Area                     | Example question                                                      |
| ------------------------ | --------------------------------------------------------------------- |
| Social network           | Who else might Anna know? Which communities have formed?              |
| Recommendation system    | People who bought this, what else did they buy?                       |
| Fraud detection          | Do several "different" customers use the same phone number and address? |
| Route planning, networks | What's the shortest path? If this router fails, what becomes unreachable? |
| Knowledge graph          | How are concepts, people and places connected to each other?          |

## Summary

- Graph = nodes + edges; property graph: labels, types and properties on both nodes and edges.
- A relationship is a stored, first-class element, not computed with a JOIN.
- Cypher: you "draw" the pattern with brackets and arrows; variable-length paths, shortest path.
- Graphs are strong at multi-step relationship searches; not at aggregate reports.

## The lesson's exercise

```quiz required
? In a graph database, what corresponds to a row of a relational junction table (e.g. "Anna took the Databases course")?
- a node
+ an edge
- a label
- an index
! The relationship itself is the edge, possibly with properties (e.g. grade).

? What does the `-[:KNOWS]->` part mean in a Cypher pattern?
- a node with the KNOWS label
+ a directed edge of type KNOWS
- a table called KNOWS
- a property
! Arrow = directed edge, with its type after the colon.

? Why is graph traversal efficient over many steps?
+ because the cost of one step only depends on the number of neighbours of the given node
- because a graph database keeps everything in memory
- because there are no properties in a graph database
- because a graph database precomputes every query
! Index-free adjacency: a node reaches its neighbours through pointers.

? Which question is a graph database least suited for?
- Who are the friends of my friends?
- What's the shortest path between two cities?
+ What was last year's total revenue per category?
- Do several accounts use the same bank card?
! This is a typical aggregate report, with no relationship traversal.

? In a social network Anna has 3 friends, and each friend has 4 more friends (all different, and none of them is Anna or Anna's friend). How many "friend of a friend" candidates are there?
= 12
! 3 × 4.
```
