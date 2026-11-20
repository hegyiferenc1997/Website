---
title: Practice – Recursion and Iteration
summary: Review questions and exercises on recursive and iterative solutions.
minutes: 55
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

## Summary exercise: Permutations recursively

The summary exercise of the topic. Write a **recursive** `permutations(text)` function that returns all the different orders (permutations) of the letters of a text **in an alphabetical list**, without repetition. Don't use the `itertools` module!

Idea: take each letter to the front once, and prepend it to the permutations of the remaining letters, computed recursively. The base case is the empty (or one-letter) text. If the text has a repeated letter (e.g. `"aab"`), filter out the duplicates (with a set).

For example `permutations("abc")` → `["abc", "acb", "bac", "bca", "cab", "cba"]`.

```python starter required
def permutations(text):
    if len(text) <= 1:
        return [text]
    result = set()
    for i, letter in enumerate(text):
        rest = text[:i] + text[i + 1:]
        # prepend the letter to the permutations of rest
    return sorted(result)


print(permutations("abc"))
```

<details>
<summary>Solution</summary>

```python solution
def permutations(text):
    if len(text) <= 1:
        return [text]
    result = set()
    for i, letter in enumerate(text):
        rest = text[:i] + text[i + 1:]
        for ending in permutations(rest):
            result.add(letter + ending)
    return sorted(result)


print(permutations("abc"))
```

</details>

```python test
assert permutations("abc") == ["abc", "acb", "bac", "bca", "cab", "cba"], "The permutations of \"abc\" are not right."
assert permutations("aab") == ["aab", "aba", "baa"], "With a repeated letter the duplicates must be filtered out."
assert permutations("") == [""], "The only permutation of the empty text is the empty text."
assert len(permutations("abcde")) == 120, "5 different letters have 5! = 120 permutations."
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Programming exercises

**1.** **Fast exponentiation.** Write the recursive `power(a, n)` function (non-negative integer `n`) that computes without the `**` operator, using the "halving" idea: for even `n`, $a^n = (a^{n/2})^2$; for odd `n`, $a^n = a \cdot a^{n-1}$. This way even the 1000th power needs only about 15 calls!

```python starter
def power(a, n):
    return a * n
```

<details>
<summary>Solution</summary>

```python solution
def power(a, n):
    if n == 0:
        return 1                            # base case
    if n % 2 == 0:
        half = power(a, n // 2)             # compute once, use twice
        return half * half
    return a * power(a, n - 1)
```

</details>

```python test
assert power(2, 10) == 1024
assert power(3, 0) == 1
assert power(5, 3) == 125
assert power(2, 1000) == 2 ** 1000
print("All checks passed!")
```

**2.** **Nested sum.** Write the `nested_sum(data)` function, which adds up all the numbers of a list nested to any depth! For example `[1, [2, [3, 4]], 5]` → `15`.

```python starter
def nested_sum(data):
    return sum(x for x in data if isinstance(x, int))
```

<details>
<summary>Solution</summary>

```python solution
def nested_sum(data):
    total = 0
    for item in data:
        if isinstance(item, list):
            total += nested_sum(item)       # the sublist is the same task, just smaller
        else:
            total += item
    return total
```

</details>

```python test
assert nested_sum([1, [2, [3, 4]], 5]) == 15
assert nested_sum([]) == 0
assert nested_sum([[[[]]]]) == 0
assert nested_sum([[1.5], [[2.5]]]) == 4.0
print("All checks passed!")
```

**3.** **All binary numbers.** Write the recursive `binary_strings(n)` function, which returns all strings of length `n` made of 0s and 1s in increasing order! For `n = 0` the result should be `[""]`.

```python starter
def binary_strings(n):
    return ["0" * n]
```

<details>
<summary>Solution</summary>

```python solution
def binary_strings(n):
    if n == 0:
        return [""]                         # a single empty string
    shorter = binary_strings(n - 1)
    return ["0" + s for s in shorter] + ["1" + s for s in shorter]
```

</details>

```python test
assert binary_strings(0) == [""]
assert binary_strings(2) == ["00", "01", "10", "11"]
assert len(binary_strings(5)) == 32
assert binary_strings(3)[5] == "101"
print("All checks passed!")
```

### Quick check questions

```quiz
? What happens if a recursive function lacks a base case?
- the function returns 0
+ the calls never stop and a `RecursionError` occurs
- Python stops it automatically after the first call
- nothing special
! By default Python stops the program at a call depth of about 1000.

? How many times in total is the function `fact(n) = n * fact(n - 1)`, `fact(0) = 1` called when computing `fact(4)`?
= 5
! fact(4), fact(3), fact(2), fact(1), fact(0).

? What is the 6th Fibonacci number if F(1) = F(2) = 1?
= 8
! 1, 1, 2, 3, 5, 8.

? Why is the naive recursive Fibonacci slow for large n?
- because Python doesn't support recursion
+ because it computes the same partial values again and again
- because it uses too little memory
- because the numbers are too big
! It can be made fast with memoization (e.g. `functools.lru_cache`).
```
