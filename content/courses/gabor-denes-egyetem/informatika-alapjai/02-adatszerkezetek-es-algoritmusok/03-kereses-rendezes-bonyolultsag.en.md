---
title: Searching, Sorting, Running Time
summary: Linear and binary search, bubble sort and built-in sorting, the basics of big-O notation.
minutes: 20
---

## What you will learn

- **linear** and **binary** search,
- a simple sort (**bubble sort**),
- how to estimate an algorithm's running time (**big-O notation**).

## Linear search

We look at the elements in order until we find the one we want. With `n` elements the worst case needs `n` comparisons. It works on unsorted lists too.

## Binary search

If the list is **sorted**, we always look at the middle element: if the target is smaller, we continue in the left half, if larger, in the right half. Every step **halves** the search range, so about 10 steps are enough for 1000 elements and about 20 for a million (because 2¹⁰ ≈ 1000, 2²⁰ ≈ 1,000,000).

```python run
# Binary search in a sorted list; we count the steps too
def binary_search(items, target):
    left, right, steps = 0, len(items) - 1, 0
    while left <= right:
        steps += 1
        mid = (left + right) // 2
        if items[mid] == target:
            return mid, steps
        if items[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1, steps

numbers = list(range(0, 2000, 2))   # 1000 even numbers
print(binary_search(numbers, 1234))
```

## Sorting: bubble sort

**Bubble sort** walks through the list again and again and swaps every **neighbouring** pair that is in the wrong order. After one pass the largest element has “bubbled” to the end.

```python run
# Bubble sort
def bubble(items):
    a = items[:]
    for end in range(len(a) - 1, 0, -1):
        for i in range(end):
            if a[i] > a[i + 1]:
                a[i], a[i + 1] = a[i + 1], a[i]
    return a

print(bubble([5, 1, 4, 2, 8]))
print(sorted([5, 1, 4, 2, 8]))   # the built-in, much faster sort
```

Bubble sort is simple but slow. In practice we use faster methods (quicksort, merge sort; Python's `sorted` uses Timsort).

## Running time: big-O notation

**Big-O notation** describes how the number of steps **grows** as the input size `n` grows. Constants are dropped; only the kind of growth matters.

| Notation   | Name        | Example                             | for n = 1000 |
| ---------- | ----------- | ----------------------------------- | ------------ |
| O(1)       | constant    | accessing an array element by index | 1            |
| O(log n)   | logarithmic | binary search                       | ≈ 10         |
| O(n)       | linear      | linear search                       | 1000         |
| O(n log n) | –           | good sorts (merge sort)             | ≈ 10,000     |
| O(n²)      | quadratic   | bubble sort                         | 1,000,000    |

## Summary

- Linear search: O(n), on any list; binary search: O(log n), on sorted lists only.
- Bubble sort is O(n²); good sorts are O(n log n).
- Big-O measures the rate of growth, not the exact time.

## Exercise

```quiz required
? What is the precondition of binary search?
- The list must be short.
+ The list must be sorted.
- The list may contain numbers only.
- The target must be in the middle of the list.
! Only in a sorted list can we decide which half to continue in.

? At most how many steps does binary search need in a sorted list of 1024 elements (counting the successful hit as a step)?
= 11
! 1024 = 2¹⁰; after 10 halvings one element remains, the 11th step checks it.

? What is the running time of bubble sort?
- O(1)
- O(log n)
- O(n)
+ O(n²)
! Two nested loops run through the list.

? What is the list `[3, 1, 2]` after the first bubble pass? (comma separated, no spaces)
= 1,2,3
! 3↔1 → [1,3,2], then 3↔2 → [1,2,3].
```
