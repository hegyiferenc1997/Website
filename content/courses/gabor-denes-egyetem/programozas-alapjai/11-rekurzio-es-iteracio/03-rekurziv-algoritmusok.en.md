---
title: Classic Recursive Algorithms
summary: Divide and conquer: binary search, Towers of Hanoi, merge sort, traversing nested data.
minutes: 22
---

## What you will learn

- what the **divide and conquer** method is,
- **binary search**, recursively and iteratively,
- the **Towers of Hanoi** problem,
- **merge sort**,
- recursive traversal of nested data.

## Divide and conquer

Many efficient algorithms work like this:

1. **Divide:** split the task into smaller, similar subtasks.
2. **Conquer:** solve the subtasks recursively (the smallest ones directly).
3. **Combine:** assemble the whole solution from the partial ones.

## Binary search

We search a **sorted** list: look at the middle element; if it's smaller than the target, continue in the right half, if larger, in the left half. Every step halves the range → **O(log n)**.

```python run
def binary_recursive(items, target, low=0, high=None):
    if high is None:
        high = len(items) - 1
    if low > high:                       # base case: empty range → not found
        return -1
    mid = (low + high) // 2
    if items[mid] == target:             # base case: found it
        return mid
    if items[mid] < target:
        return binary_recursive(items, target, mid + 1, high)
    return binary_recursive(items, target, low, mid - 1)


def binary_iterative(items, target):
    low, high = 0, len(items) - 1
    while low <= high:
        mid = (low + high) // 2
        if items[mid] == target:
            return mid
        if items[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1


numbers = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
print(binary_recursive(numbers, 23), binary_iterative(numbers, 23))   # 5 5
print(binary_recursive(numbers, 7), binary_iterative(numbers, 7))     # -1 -1
```

## Towers of Hanoi

There are three rods, the first holding `n` discs of decreasing size. Move them to the third rod, moving one disc at a time and never placing a larger disc on a smaller one.

The recursive idea: to move `n` discs from A to C,

1. move `n − 1` discs from A to B (using C),
2. move the largest from A to C,
3. move the `n − 1` discs from B to C (using A).

```python run
def hanoi(n, source="A", target="C", spare="B"):
    if n == 0:
        return 0
    moves = hanoi(n - 1, source, spare, target)
    print(f"disc {n}: {source} → {target}")
    moves += 1
    moves += hanoi(n - 1, spare, target, source)
    return moves

print("Number of moves:", hanoi(3))   # 2³ − 1 = 7
```

Iteratively this would be much harder – this is where recursion is truly elegant. The number of moves is `2ⁿ − 1`, so for 64 discs it's more than 18 quintillion.

## Merge sort

1. If the list has 0 or 1 elements, it's already sorted (base case).
2. Otherwise halve it and **sort both halves recursively**.
3. **Merge** the two sorted halves: always take the smaller of the two front elements.

```python run
def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])     # the rest (one of them is already empty)
    result.extend(right[j:])
    return result


def merge_sort(items):
    if len(items) <= 1:
        return items
    mid = len(items) // 2
    return merge(merge_sort(items[:mid]), merge_sort(items[mid:]))


print(merge_sort([38, 27, 43, 3, 9, 82, 10]))
```

```text
[38 27 43 3 9 82 10]
[38 27 43]      [3 9 82 10]
[38] [27 43]    [3 9] [82 10]
     [27][43]   [3][9] [82][10]
[38] [27 43]    [3 9] [10 82]      ← merging upwards
[27 38 43]      [3 9 10 82]
[3 9 10 27 38 43 82]
```

Merge sort always takes **O(n log n)** steps – much faster than bubble sort's O(n²). Python's built-in `sorted()` (Timsort) is also partly based on merging.

## Traversing nested data

Recursion is also natural when the data itself is recursive: lists inside lists, folders inside folders.

```python run
def flatten(data):
    """Turns a list nested to any depth into a single-level list."""
    result = []
    for item in data:
        if isinstance(item, list):
            result.extend(flatten(item))   # recursion on the inner list
        else:
            result.append(item)
    return result

print(flatten([1, [2, [3, 4], 5], [[6]], 7]))
```

## Summary

- **Divide and conquer:** divide → solve recursively → combine.
- **Binary search:** O(log n) in a sorted list.
- **Towers of Hanoi:** `2ⁿ − 1` moves, a few lines recursively.
- **Merge sort:** O(n log n).
- Recursively structured data (trees, nested lists) → recursive traversal.

## Lesson exercise: Merge sort

Write **merge sort** recursively: `merge_sort(items)` returns a new ascending list – without using `sort()` or `sorted()`.

1. Base case: a list with at most one element is already sorted (return a copy of it).
2. Divide: cut the list in half in the middle.
3. Conquer: sort the two halves recursively.
4. Merge the two sorted halves (as in the list exercise of the Data Structures topic).

```python starter required
def merge(a, b):
    # merging two sorted lists
    pass


def merge_sort(items):
    pass


print(merge_sort([5, 2, 9, 1, 5, 6]))   # [1, 2, 5, 5, 6, 9]
```

<details>
<summary>Solution</summary>

```python solution
def merge(a, b):
    i = j = 0
    result = []
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            result.append(a[i])
            i += 1
        else:
            result.append(b[j])
            j += 1
    return result + a[i:] + b[j:]


def merge_sort(items):
    if len(items) <= 1:
        return list(items)
    middle = len(items) // 2
    left = merge_sort(items[:middle])
    right = merge_sort(items[middle:])
    return merge(left, right)


print(merge_sort([5, 2, 9, 1, 5, 6]))   # [1, 2, 5, 5, 6, 9]
```

</details>

```python test
import random
assert merge_sort([5, 2, 9, 1, 5, 6]) == [1, 2, 5, 5, 6, 9], "Sorting the example is not right."
assert merge_sort([]) == [], "An empty list."
assert merge_sort([3]) == [3], "A one-element list."
random.seed(1)
for _ in range(20):
    data = [random.randint(-50, 50) for _ in range(random.randint(0, 40))]
    copy = list(data)
    assert merge_sort(data) == sorted(data), f"Wrong sort: {data}"
    assert data == copy, "The original list must not change."
```
