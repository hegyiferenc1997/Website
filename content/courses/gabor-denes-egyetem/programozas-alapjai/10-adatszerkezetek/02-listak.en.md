---
title: Lists in Detail
summary: List methods, slicing, sorting, list comprehensions and the list as a dynamic array.
minutes: 18
---

## What you will learn

- the most important list **methods**,
- **slicing** and **sorting**,
- **list comprehensions**,
- how a list works behind the scenes (dynamic array).

## Creating a list

```python run
empty = []
numbers = [3, 1, 4, 1, 5]
mixed = [1, "apple", 3.5, True, [1, 2]]   # in Python any element is allowed
letters = list("hello")                    # ['h', 'e', 'l', 'l', 'o']
ten = list(range(10))
print(empty, numbers, mixed, letters, ten, sep="\n")
```

## The most important methods

| Method         | What it does                                              |
| -------------- | --------------------------------------------------------- |
| `append(x)`    | appends x to the end                                      |
| `extend(list)` | appends the elements of another list                      |
| `insert(i, x)` | inserts x at position i                                   |
| `remove(x)`    | removes the first element equal to x (ValueError if none) |
| `pop(i)`       | removes and returns element i (the last by default)       |
| `index(x)`     | index of the first x                                      |
| `count(x)`     | number of occurrences of x                                |
| `sort()`       | sorts in place                                            |
| `reverse()`    | reverses in place                                         |
| `clear()`      | empties the list                                          |
| `copy()`       | shallow copy                                              |

```python run
shopping = ["milk", "bread"]
shopping.append("apples")
shopping.extend(["cheese", "butter"])
shopping.insert(1, "eggs")
print(shopping)

shopping.remove("bread")
last = shopping.pop()
print(last, shopping)
print(shopping.index("apples"), shopping.count("milk"))
```

## Slicing

Works just like with strings: `list[start:end:step]`, and returns a **new list**.

```python run
t = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
print(t[2:5])     # [2, 3, 4]
print(t[:3])      # [0, 1, 2]
print(t[-3:])     # [7, 8, 9]
print(t[::2])     # [0, 2, 4, 6, 8]
print(t[::-1])    # reversed

# Slice assignment: replacing a sublist
t[1:4] = ["a", "b"]
print(t)
```

## Sorting

```python run
numbers = [5, 2, 9, 1, 7]

ordered = sorted(numbers)           # returns a NEW list, the original stays
print(ordered, numbers)

numbers.sort()                      # sorts IN PLACE, returns None
print(numbers)

numbers.sort(reverse=True)          # descending order
print(numbers)

names = ["eva", "Bela", "anna", "Csaba"]
print(sorted(names, key=str.lower))   # ignoring case
print(sorted(names, key=len))         # by length
```

> Common mistake: `numbers = numbers.sort()` – afterwards `numbers` is `None`, because `sort()` doesn't return a list!

## List comprehensions

Building a new list from an existing collection in a single line:

```text
[expression for item in collection if condition]
```

```python run
numbers = [1, 2, 3, 4, 5, 6]

squares = [x * x for x in numbers]
evens = [x for x in numbers if x % 2 == 0]
labels = ["even" if x % 2 == 0 else "odd" for x in numbers]
print(squares, evens, labels, sep="\n")

# Creating and flattening a matrix
matrix = [[i * 3 + j for j in range(3)] for i in range(3)]
flat = [x for row in matrix for x in row]
print(matrix, flat)
```

## Useful built-in functions for lists

```python run
t = [4, 8, 15, 16, 23, 42]
print(len(t), sum(t), min(t), max(t))
print(any(x > 40 for x in t), all(x > 0 for x in t))
print(list(reversed(t)))
print(list(enumerate(t))[:2])
```

## The list behind the scenes

A Python list is a **dynamic array**: it occupies a contiguous array in memory, somewhat larger than the number of elements. When it fills up, it allocates a bigger array (about 1.5 times) and copies the elements over. That's why `append` is O(1) **on average**, but inserting at the start (`insert(0, x)`) is always O(n).

```python run
import sys
t = []
for i in range(10):
    t.append(i)
    print(len(t), sys.getsizeof(t), "bytes")   # the allocated size grows in jumps
```

## Summary

- Key methods: `append`, `extend`, `insert`, `remove`, `pop`, `index`, `count`, `sort`.
- `sorted()` returns a new list, `sort()` sorts in place and returns `None`.
- List comprehension: `[expr for x in coll if cond]`.
- A list is a dynamic array: appending is fast, inserting at the start is slow.
