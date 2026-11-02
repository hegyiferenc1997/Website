---
title: Practice – Recursion and Iteration
summary: Review questions and exercises on recursive and iterative solutions.
minutes: 30
kind: practice
---

## Review questions

**1. What does a stack frame contain?**

<details>
<summary>Answer</summary>

The call's parameters, local variables and the return address.

</details>

**2. Why is the naive recursive Fibonacci slow, and how can it be sped up?**

<details>
<summary>Answer</summary>

It recomputes the same partial results many times, so the number of calls grows exponentially. It can be sped up with memoisation (`@functools.cache` or your own dictionary) or an iterative solution.

</details>

**3. How many moves are needed for the Towers of Hanoi with 5 discs?**

<details>
<summary>Answer</summary>

2⁵ − 1 = 31 moves.

</details>

**4. What does binary search require, and how many steps does it take?**

<details>
<summary>Answer</summary>

The list must be sorted. It takes O(log n) steps, e.g. about 20 for 1,000,000 elements.

</details>

**5. When should you prefer iteration over recursion in Python?**

<details>
<summary>Answer</summary>

For linear tasks (going through a list, counting, summing), for very deep recursion (over 1000 levels), and when the recursion would recompute the same subtasks.

</details>

## Exercises

### Exercise 1: Sum of digits recursively

Write a recursive function `digit_sum(n)` for non-negative integers!

```python starter
def digit_sum(n):
    pass
```

<details>
<summary>Solution</summary>

```python solution
def digit_sum(n):
    if n < 10:
        return n
    return n % 10 + digit_sum(n // 10)
```

</details>

```python test
assert digit_sum(2026) == 10
assert digit_sum(0) == 0
assert digit_sum(99999) == 45
print("All checks passed!")
```

### Exercise 2: Greatest common divisor

Euclid's algorithm: `gcd(a, b) = a` if `b == 0`, otherwise `gcd(b, a % b)`. Write it both **recursively** (`gcd_r`) and **iteratively** (`gcd_i`)!

```python starter
def gcd_r(a, b):
    pass

def gcd_i(a, b):
    pass
```

<details>
<summary>Solution</summary>

```python solution
def gcd_r(a, b):
    if b == 0:
        return a
    return gcd_r(b, a % b)

def gcd_i(a, b):
    while b != 0:
        a, b = b, a % b
    return a
```

</details>

```python test
for a, b, v in [(48, 18, 6), (17, 5, 1), (100, 75, 25), (7, 0, 7)]:
    assert gcd_r(a, b) == v and gcd_i(a, b) == v
print("All checks passed!")
```

### Exercise 3: Fibonacci with memoisation

Write a function `fib(n)` that is **recursive** but, thanks to memoisation, runs instantly even for `n = 80`!

```python starter
def fib(n):
    pass
```

<details>
<summary>Solution</summary>

```python solution
from functools import cache

@cache
def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)
```

</details>

```python test
assert [fib(i) for i in range(8)] == [0, 1, 1, 2, 3, 5, 8, 13]
assert fib(80) == 23416728348467685
print("All checks passed!")
```

### Exercise 4: Subsets

Write a recursive function `subsets(items)` returning all subsets of the list (as a list of lists)! Hint: the first element is either in a subset or it isn't.

```python starter
def subsets(items):
    pass
```

<details>
<summary>Solution</summary>

```python solution
def subsets(items):
    if not items:
        return [[]]
    first, rest = items[0], items[1:]
    without = subsets(rest)
    with_first = [[first] + s for s in without]
    return without + with_first
```

</details>

```python test
result = subsets([1, 2, 3])
assert len(result) == 8
assert sorted(sorted(s) for s in result) == [[], [1], [1, 2], [1, 2, 3], [1, 3], [2], [2, 3], [3]]
assert subsets([]) == [[]]
print("All checks passed!")
```

### Exercise 5: Measuring depth

Write a recursive function `depth(data)` giving the maximum depth of a nested list! A non-list value has depth 0, an empty list has depth 1.

```python starter
def depth(data):
    pass
```

<details>
<summary>Solution</summary>

```python solution
def depth(data):
    if not isinstance(data, list):
        return 0
    return 1 + max((depth(x) for x in data), default=0)
```

</details>

```python test
assert depth(5) == 0
assert depth([]) == 1
assert depth([1, 2]) == 1
assert depth([1, [2, [3]], [4]]) == 3
print("All checks passed!")
```
