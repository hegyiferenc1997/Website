---
title: Sets
summary: An unordered collection without duplicates and with fast membership tests; union, intersection, difference.
minutes: 12
---

## What you will learn

- what a **set** is and what its properties are,
- how **set operations** work (union, intersection, difference),
- why searching a set is **fast** (hashing).

## Properties

A **set**:

- contains every element **only once**,
- is **unordered**: no index, iteration order isn't guaranteed,
- has **immutable** elements (numbers, strings, tuples – a list can't be a set element),
- answers "is it in there?" in **O(1)** time on average.

```python run
fruits = {"apple", "pear", "apple", "plum"}
print(fruits)              # the repeated "apple" appears only once
print(len(fruits))         # 3
print("pear" in fruits)    # True

empty = set()              # NOTE: {} means an empty dictionary, not a set!
empty.add(5)
empty.add(5)
print(empty)               # {5}
```

## Removing duplicates

```python run
grades = [5, 3, 4, 5, 3, 5, 2]
distinct = set(grades)
print(distinct, len(distinct))
print(sorted(distinct))    # as a sorted list
```

## Modification

```python run
s = {1, 2, 3}
s.add(4)          # add an element
s.discard(10)     # remove if present (no error if absent)
s.remove(1)       # remove (KeyError if absent)
print(s)
```

## Set operations

```python run
python = {"Anna", "Bela", "Csilla", "Dora"}
java = {"Csilla", "Dora", "Ede"}

print(python | java)    # union: those learning at least one
print(python & java)    # intersection: those learning both
print(python - java)    # difference: those learning only Python
print(python ^ java)    # symmetric difference: those learning exactly one

print({"Csilla"} <= python)   # is it a subset
```

| Operation            | Symbol   | Method                      |
| -------------------- | -------- | --------------------------- |
| union                | `a \| b` | `a.union(b)`                |
| intersection         | `a & b`  | `a.intersection(b)`         |
| difference           | `a - b`  | `a.difference(b)`           |
| symmetric difference | `a ^ b`  | `a.symmetric_difference(b)` |
| subset               | `a <= b` | `a.issubset(b)`             |

## Why is it fast? – Hashing

A set (and a dictionary) uses a **hash table**. A **hash function** turns each element into a number (hash value) that says which "bucket" of the table it goes into. Searching doesn't need to scan all elements: compute the hash and look in that one bucket.

```python run
print(hash("apple"), hash(42))     # every immutable object has a hash value
# hash([1, 2])  → TypeError: unhashable type: 'list'
```

That's why a list can't be a set element: if the list changed, its hash would change too, and the element would be in the "wrong bucket".

## frozenset

`frozenset` is the immutable version of a set – so it can even be an element of another set or a dictionary key.

```python run
f = frozenset([1, 2, 3])
print(f, {f: "works as a key too"})
```

## Summary

- A set is an unordered collection without duplicates; empty set: `set()`.
- Membership tests are **O(1)** on average thanks to the hash table.
- Operations: `|` union, `&` intersection, `-` difference, `^` symmetric difference.
- Elements must be immutable (hashable) objects.
