---
title: Basic Data Structures
summary: Array, list, stack, queue, tree, graph and hash table – what is each one for?
minutes: 18
---

## What you will learn

- what a **data structure** is, and why the choice matters,
- the **linear** structures: array, list, stack, queue,
- the **non-linear** ones: tree, graph, and the **hash table**.

## What is a data structure?

A **data structure** is a way of storing and accessing data. The same data can be stored in different ways, and the choice decides which operations will be fast.

## Linear structures

- **Array**: elements of the same type one after another in memory. The `i`-th element is reachable **immediately** (by index), but inserting in the middle is slow, because the rest must be shifted.
- **Linked list**: every element stores the address of the next one. Inserting is fast, but to reach the `i`-th element you must step through the list.
- **Stack**: **LIFO** – the last element put in comes out first (like a pile of plates). Operations: `push` and `pop`. The browser's “back” button and function calls work like this.
- **Queue**: **FIFO** – the first element put in comes out first (like a checkout line). A print queue works like this.

```python run
# Stack and queue in Python
stack = []
stack.append("A"); stack.append("B"); stack.append("C")
print(stack.pop())        # C – the last one comes out first

from collections import deque
queue = deque()
queue.append("A"); queue.append("B"); queue.append("C")
print(queue.popleft())    # A – the first one comes out first
```

## Non-linear structures

- **Tree**: a hierarchy with a **root**; every element has one parent (the root has none). Folder structures and company org charts are trees. In a **binary search tree** every node has smaller values on its left and larger ones on its right, so searching is fast.
- **Graph**: **vertices** and **edges** between them, with any connections. Road networks, social networks and the internet are graphs.

```text
      tree                     graph
      (8)                  Győr ─── Budapest
     /   \                   │     /    │
   (3)   (10)              Pécs ──┘   Szeged
   / \      \
 (1) (6)   (14)
```

## Hash table

A **hash table** stores key–value pairs. A **hash function** computes from the key where the value goes, so a lookup takes **one step** on average. Python's `dict` is one.

```python run
# Dictionary: key → value
phone_book = {"Anna": "+36 30 111 2222", "Béla": "+36 20 333 4444"}
print(phone_book["Anna"])
phone_book["Cili"] = "+36 70 555 6666"
print(len(phone_book))
```

## Summary

| Structure  | Strength               | Typical use             |
| ---------- | ---------------------- | ----------------------- |
| array      | fast access by index   | tables, images          |
| stack      | LIFO                   | undo, “back” button     |
| queue      | FIFO                   | print queue, scheduling |
| tree       | hierarchy, fast search | folders, database index |
| graph      | any connections        | maps, social networks   |
| hash table | lookup by key          | dictionary, cache       |

## Exercise

```quiz required
? Which data structure works on the **LIFO** principle?
+ stack
- queue
- array
- graph
! Last In, First Out: the last one put in comes out first.

? We put these into a queue in this order: 1, 2, 3. Which comes out first?
= 1
! A queue is FIFO: the first one in comes out first.

? We push these onto a stack in this order: 1, 2, 3. Which comes out first?
= 3
! A stack is LIFO.

? Which data structure fits a city's road network best?
- stack
- queue
- array
+ graph
! Intersections are the vertices, roads are the edges.
```
