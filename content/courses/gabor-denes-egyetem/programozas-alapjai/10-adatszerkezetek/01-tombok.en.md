---
title: Arrays and Their Operations
summary: The array as a row of consecutive memory cells: indexing, iteration, search, insertion, deletion – and two-dimensional arrays.
minutes: 18
---

## What you will learn

- what an **array** is and how it is stored in memory,
- the basic array operations and their **cost**,
- how to use arrays in Python (`list`, `array`),
- what a **two-dimensional array** (matrix) is.

## What is an array?

An **array** is a sequence of elements of the same type stored **directly one after another** in memory. Each element is accessed by its **index** (numbered from 0).

```text
index:     0     1     2     3     4
        ┌─────┬─────┬─────┬─────┬─────┐
value:  │  12 │   7 │  33 │   5 │  21 │
        └─────┴─────┴─────┴─────┴─────┘
address: 1000  1004  1008  1012  1016    (4-byte integers)
```

Since the elements are the same size and consecutive, the address of the i-th element can be computed: `start + i · element_size`. That's why **access by index takes constant time**, O(1) – no matter which element we ask for.

In a classic (static) array the size must be given **at creation** and can't change later:

```java
int[] scores = new int[5];   // Java: an int array of 5 elements, all 0
scores[2] = 33;
```

## Arrays in Python

In Python the built-in **list** (`list`) plays the role of an array. It is actually a **dynamic array**: it grows automatically and can store elements of different types. For compact storage of numbers there is also the `array` module.

```python run
scores = [12, 7, 33, 5, 21]
print(scores[2])        # 33 – access by index, O(1)
scores[2] = 40          # modification, O(1)
print(scores, len(scores))

import array
numbers = array.array("i", [1, 2, 3])   # "i" = integers only, stored compactly
print(numbers[1])
```

## Basic operations and their cost

| Operation                      | Python                 | Cost                                 |
| ------------------------------ | ---------------------- | ------------------------------------ |
| access by index                | `t[i]`                 | O(1)                                 |
| modify by index                | `t[i] = x`             | O(1)                                 |
| append to the end              | `t.append(x)`          | O(1) on average                      |
| insert at the start / middle   | `t.insert(i, x)`       | O(n) – the other elements must shift |
| delete from the end            | `t.pop()`              | O(1)                                 |
| delete from the start / middle | `t.pop(i)`, `del t[i]` | O(n)                                 |
| search by value                | `x in t`, `t.index(x)` | O(n)                                 |

```python run
t = [10, 20, 30]
t.append(40)        # [10, 20, 30, 40]
t.insert(0, 5)      # [5, 10, 20, 30, 40] – every element shifts right by one
t.pop()             # removes 40
t.pop(0)            # removes 5 – every element shifts left by one
print(t)
print(20 in t, t.index(30))
```

## Iteration

```python run
temperatures = [12.5, 14.0, 9.8, 16.2]

# by index
for i in range(len(temperatures)):
    print(i, temperatures[i])

# element by element (more Pythonic)
for t in temperatures:
    print(t, end=" ")
print()
```

> **Index bounds:** the last valid index is `len(t) - 1`. `t[len(t)]` is already an `IndexError`. This is one of the most common bugs ("off-by-one").

## Two-dimensional array (matrix)

A table (rows and columns) can be written as a **list of lists**. Elements are accessed as `m[row][col]`.

```python run
# 3 rows, 4 columns
m = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
]
print(m[1][2])            # 7 – 2nd row, 3rd column
print(len(m), len(m[0]))  # number of rows and columns

# Row sums
for row in m:
    print(sum(row))

# Column sums
for j in range(len(m[0])):
    print(sum(m[i][j] for i in range(len(m))), end=" ")
print()
```

Be careful when creating an empty matrix:

```python run
bad = [[0] * 3] * 2             # both rows are THE SAME list!
bad[0][0] = 1
print(bad)                      # [[1, 0, 0], [1, 0, 0]]

good = [[0] * 3 for _ in range(2)]   # each row is a separate list
good[0][0] = 1
print(good)                     # [[1, 0, 0], [0, 0, 0]]
```

## Summary

- An array is a row of consecutively stored elements of the same type; access by index is **O(1)**.
- Inserting and deleting at the start/middle is **O(n)**, because elements must shift.
- In Python `list` is a dynamic array; for a matrix use a list of lists (`[[0]*m for _ in range(n)]`).
