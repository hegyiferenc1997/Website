---
title: Deeper – Recursion Through Different Eyes
summary: Where recursion hits its limit (RecursionError), and how to turn recursion into a loop with your own stack, the "divide and conquer" principle on merge sort with comparison counting and a chart, backtracking on the eight queens puzzle, and computing the size of a folder tree.
minutes: 55
---

## What you will learn in this lesson

- where recursion's **limit** is, and how any recursion can be rewritten as a loop with **your own stack**,
- what the **"divide and conquer"** principle is, and why **merge sort** is fast,
- how **backtracking** works,
- why recursion is natural for **tree-shaped** data (folders, menus, nested lists).

## 1. The limit of recursion and your own stack

In the basic lesson we saw that every function call takes up a **stack frame** on the call stack. Python limits this (about 1000 levels by default), so that a runaway recursion doesn't eat all the memory:

```python run
# The limit of recursion, and the same task with our own stack, in a loop
import sys

def sum_rec(n):
    return 0 if n == 0 else n + sum_rec(n - 1)

print("the recursion limit:", sys.getrecursionlimit())
print("sum_rec(300) =", sum_rec(300))
try:
    sum_rec(100_000)
except RecursionError as e:
    print("sum_rec(100 000) → RecursionError:", e)

# flattening a nested list: with our own stack instead of recursion
def flatten(data):
    result, stack = [], [data]
    while stack:
        item = stack.pop()
        if isinstance(item, list):
            stack.extend(reversed(item))     # pushed in reverse so they come out in order
        else:
            result.append(item)
    return result

print(flatten([1, [2, [3, 4]], [[5]], 6]))

deep = [0]
for i in range(1, 5000):
    deep = [i, deep]                         # a list nested 5000 levels deep
print("works 5000 levels deep too:", len(flatten(deep)), "elements")
```

The lesson: recursion uses the machine's **own stack**, which is limited; if instead we manage a list as a stack ourselves, only memory limits the depth. Any recursion can be rewritten as a loop this way – the recursive version is usually **more readable**, the loop version **more robust** for very deep data.

## 2. Divide and conquer: merge sort

The "divide and conquer" principle: we **split** the task in two, solve the two halves **recursively**, then **combine** the results. In merge sort, merging the two sorted halves is a single pass:

```plot
title: Number of comparisons for sorting n elements
x: 2, 1000
y: 0, 50000
f: x*(x - 1)/2 # bubble sort (worst case): about n²/2
f: x*log2(x) # merge sort: about n·log₂ n
```

```python run
# Merge sort with comparison counting, against bubble sort
import random

def merge_sort(items, counter):
    if len(items) <= 1:
        return items                              # base case: 0 or 1 element is already sorted
    mid = len(items) // 2
    left = merge_sort(items[:mid], counter)       # divide...
    right = merge_sort(items[mid:], counter)
    result, i, j = [], 0, 0
    while i < len(left) and j < len(right):       # ...and conquer: merge
        counter[0] += 1
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    return result + left[i:] + right[j:]

def bubble_comparisons(n):
    return n * (n - 1) // 2                       # bubble sort always compares this many

random.seed(1)
for n in [10, 100, 1000, 10_000]:
    counter = [0]
    data = [random.randint(0, 10**6) for _ in range(n)]
    assert merge_sort(data, counter) == sorted(data)
    print(f"n = {n:>6}: merge {counter[0]:>8} comparisons, bubble {bubble_comparisons(n):>10}")
```

With 10,000 elements merge sort makes about 120 thousand comparisons, bubble sort nearly 50 **million**. Python's built-in `sorted` (Timsort) is built on merging too. The same principle works in binary search and many fast algorithms.

## 3. Backtracking: the eight queens puzzle

How can 8 queens be placed on a chessboard so that none attacks another? **Backtracking**: row by row, we put a queen on a safe square and move on; if a row has no safe square, we **step back** and move the previous queen elsewhere:

```python run
# The eight queens puzzle with backtracking
def queens(n):
    solutions = []
    def place(row, cols, diag1, diag2, position):
        if row == n:
            solutions.append(position)            # a queen went into every row
            return
        for c in range(n):
            if c in cols or row - c in diag1 or row + c in diag2:
                continue                          # under attack: skip this square
            place(row + 1, cols | {c}, diag1 | {row - c}, diag2 | {row + c}, position + [c])
            # when the recursion returns, the loop tries the next column: that's the backtracking
    place(0, set(), set(), set(), [])
    return solutions

for n in range(4, 9):
    print(f"{n}×{n} board: {len(queens(n))} solutions")

first = queens(8)[0]
for c in first:
    print(" ".join("♛" if i == c else "·" for i in range(8)))
```

On the 8×8 board there are 92 solutions, and the program looks at only a fraction of the 4.4 billion possible arrangements, because it **cuts off** the branches under attack immediately. Sudoku solvers, timetable generators and many puzzle solvers work the same way.

## 4. Tree-shaped data

Folders contain folders, which contain more folders – for such a **self-similar** structure recursion is the most natural tool: "a folder's size = the size of the files in it + the size of its subfolders":

```python run
# Size of a folder tree recursively: a folder is a dictionary, a file a number (size in kB)
folders = {
    "documents": {"cv.pdf": 120, "uni": {"notes.docx": 340, "sample_test.pdf": 80}},
    "pictures": {"summer": {"1.jpg": 2400, "2.jpg": 2600}, "profile.png": 300},
    "todo.txt": 2,
}

def size(item):
    if isinstance(item, dict):
        return sum(size(child) for child in item.values())     # recursive case
    return item                                                 # base case: a file

def show(name, item, indent=0):
    print("  " * indent + f"{name} ({size(item)} kB)")
    if isinstance(item, dict):
        for child_name, child in item.items():
            show(child_name, child, indent + 1)

show("/", folders)
```

The `size` function is two lines, yet it works for a folder tree of any depth. The `show` function displays the tree with indentation – this is how a file manager's tree view, a website's menu or the display of a JSON document is made.

| Viewpoint       | Recursion                                | Iteration (loop)                          |
| --------------- | ---------------------------------------- | ----------------------------------------- |
| **readability** | natural for trees and divide and conquer | simpler for linear tasks                  |
| **memory**      | every level a stack frame, limited depth | only its own variables (or its own stack) |
| **speed**       | a function call has a cost               | usually faster in Python                  |
| **debugging**   | the call stack shows where we are        | printing the loop variables is enough     |

## Summary

- Recursion depth is limited (RecursionError); with your own stack any recursion can be written as a loop.
- Divide and conquer splits, solves recursively, combines; merge sort makes about n·log₂ n comparisons.
- Backtracking cuts off hopeless branches, so it can cover a huge search space.
- For tree-shaped data (folders, menus, nested lists) recursion is the most natural tool.

## Lesson exercise: depth of a nested list

Write the `depth(data)` function, which gives the **depth** of a nested list! Anything that isn't a list (e.g. a number) has depth 0. A list's depth is 1 + the largest depth among its elements (1 for an empty list). For example `depth([1, [2, [3]]])` is 3.

```python starter required
def depth(data):
    if not isinstance(data, list):
        return 0
    return 1


print(depth([1, [2, [3]]]))
```

<details>
<summary>Solution</summary>

```python solution
def depth(data):
    if not isinstance(data, list):
        return 0
    return 1 + max((depth(item) for item in data), default=0)


print(depth([1, [2, [3]]]))
```

</details>

```python test
assert depth(5) == 0, "a number has depth 0"
assert depth([]) == 1, "an empty list has depth 1"
assert depth([1, 2, 3]) == 1, "a flat list has depth 1"
assert depth([1, [2, [3]]]) == 3, "[1, [2, [3]]] has depth 3"
assert depth([[], [[]], 7]) == 3, "[[], [[]], 7] has depth 3"
```
