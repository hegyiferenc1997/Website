---
title: Graph Basics
summary: Vertices and edges, degree and the handshake lemma, special graphs, connectivity and trees, Euler trails, the adjacency matrix and breadth-first search.
minutes: 30
---

## What you will learn

- what a **graph** is, and what **degree** means,
- the **handshake lemma**,
- special graphs, **connectivity** and **trees**,
- when a graph has an **Euler trail**,
- how a computer stores a graph and finds **shortest paths** in it.

## Basic concepts

A **graph** $G = (V, E)$ consists of a set $V$ of **vertices** (nodes) and a set $E$ of **edges**; each edge connects two vertices. A social network (people, acquaintances), a road network (junctions, roads), the internet (routers, links) and the dependencies of a program are all graphs.

- **Simple graph:** no loops and no multiple edges. **Directed graph:** edges have a direction (e.g. links between web pages).
- The **degree** of a vertex, $\deg(v)$, is the number of edges at it.

**Handshake lemma:** the sum of the degrees is twice the number of edges,

$$
\sum_{v \in V} \deg(v) = 2\lvert E \rvert,
$$

because every edge adds $1$ to the degree of two vertices. Consequence: the **number of odd-degree vertices is even**. So, for example, there is no graph with $3$ vertices that all have degree $3$.

## Special graphs

- **Complete graph** $K_n$: any two vertices are adjacent; it has $\binom{n}{2} = \frac{n(n - 1)}{2}$ edges.
- **Path** ($P_n$), **cycle** ($C_n$), **bipartite graph** (the vertices split into two classes, and edges only go between classes).
- A graph is **connected** if there is a path between any two vertices.
- **Tree:** a connected graph without cycles. A tree on $n$ vertices always has **$n - 1$** edges, the fewest that can connect $n$ vertices. (A file system's directory structure is a tree too.)

```plot
title: Number of edges: complete graph and tree on n vertices
x: 0, 16
y: 0, 120
seq: n (n - 1)/2 @ 1, 15 # complete graph Kₙ
seq: n - 1 @ 1, 15 # tree
```

The difference is huge: a complete graph on $15$ vertices has $105$ edges, a tree only $14$. This is why network design looks for a **minimum spanning tree**: the cheapest set of edges that still connects everything.

## Euler trails

An **Euler trail** passes through every edge exactly once (the Königsberg bridges problem). A connected graph has

- a **closed** Euler trail (Euler circuit) if **every** vertex has even degree,
- an **open** Euler trail if **exactly two** vertices have odd degree (the trail starts and ends at them).

That is why the "house" figure can be drawn in one stroke: it has exactly two odd-degree vertices. A **Hamiltonian path**, by contrast, visits every **vertex** once; there is no such simple condition for it, and it is a hard problem.

## Graphs in the computer

In the **adjacency matrix** $A$, $a_{ij} = 1$ if $i$ and $j$ are adjacent, and $0$ otherwise. For an undirected graph the matrix is symmetric and the number of $1$s is $2\lvert E \rvert$. For sparse graphs (few edges) an **adjacency list** saves space.

| | A | B | C | D |
| --- | --- | --- | --- | --- |
| **A** | 0 | 1 | 1 | 0 |
| **B** | 1 | 0 | 1 | 1 |
| **C** | 1 | 1 | 0 | 0 |
| **D** | 0 | 1 | 0 | 0 |

**Breadth-first search** (BFS) proceeds layer by layer from a start vertex and gives the shortest paths in an unweighted graph.

```python run
from collections import deque
# Adjacency list and breadth-first search (BFS): distances from vertex A
graph = {
    "A": ["B", "C"],
    "B": ["A", "C", "D"],
    "C": ["A", "B"],
    "D": ["B", "E"],
    "E": ["D"],
}
dist = {"A": 0}
queue = deque(["A"])
while queue:
    v = queue.popleft()
    for w in graph[v]:
        if w not in dist:
            dist[w] = dist[v] + 1
            queue.append(w)
print("distances:", dist)
print("sum of degrees:", sum(len(s) for s in graph.values()), "= 2 · number of edges")
```

## Summary

- Handshake lemma: $\sum \deg(v) = 2\lvert E \rvert$; the number of odd-degree vertices is even.
- $K_n$ has $\frac{n(n-1)}{2}$ edges, a tree on $n$ vertices has $n - 1$.
- Euler circuit: every degree even; open Euler trail: exactly two odd degrees.
- Storage: adjacency matrix or list; shortest path (unweighted): BFS.

## Lesson exercise

```quiz required
? How many edges does the complete graph $K_6$ have?
= 15

? The degrees of a graph's vertices are $3, 3, 2, 2, 2$. How many edges does it have?
= 6

? Is there a simple graph with degrees $3, 3, 3, 2$?
- yes, and it is connected
- yes, but it is not connected
+ no, because the number of odd-degree vertices is odd
- no, because no vertex can have degree $3$
! The sum of the degrees is $11$, which is odd.

? How many edges does a tree on $12$ vertices have?
= 11

? Which connected graph has an **open** Euler trail (but no closed one)?
- every vertex has even degree
+ exactly two vertices have odd degree
- exactly one vertex has odd degree
- exactly four vertices have odd degree

? An undirected simple graph has $7$ edges. How many $1$s are in its adjacency matrix?
= 14
```
