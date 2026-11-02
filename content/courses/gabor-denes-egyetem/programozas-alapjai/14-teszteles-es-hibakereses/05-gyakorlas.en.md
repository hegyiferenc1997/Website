---
title: Practice – Testing and Debugging
summary: Review questions, writing tests and fixing buggy code.
minutes: 30
kind: practice
---

## Review questions

**1. List the levels of testing.**

<details>
<summary>Answer</summary>

Unit test, integration test, system test, acceptance test.

</details>

**2. What test cases would you write for a `maximum(items)` function?**

<details>
<summary>Answer</summary>

Normal: `[3, 7, 2]` → 7. Boundary: a single-element list, the maximum in the first / last position, negative numbers (`[-5, -2]` → −2), a repeated maximum. Invalid: an empty list → exception.

</details>

**3. What is the difference between Step Over and Step Into in a debugger?**

<details>
<summary>Answer</summary>

Step Over executes the current line without entering function calls; Step Into enters the called function.

</details>

**4. What is a regression test?**

<details>
<summary>Answer</summary>

A test checking that a change didn't break a previously working feature – for example a test written for every fixed bug.

</details>

**5. What are the three steps of TDD?**

<details>
<summary>Answer</summary>

Red: write a failing test. Green: the simplest code that makes it pass. Refactor: clean up the code under the protection of the tests.

</details>

## Exercises

### Exercise 1: Find the bug!

The function should return the **second largest** distinct element of a list, but it's buggy. Test it with boundary cases and fix it!

```python starter
def second_largest(items):
    ordered = sorted(items)
    return ordered[-2]
```

<details>
<summary>Hint</summary>

What happens with `[5, 5, 3]`? The second largest _distinct_ element is 3.

</details>

<details>
<summary>Solution</summary>

```python solution
def second_largest(items):
    distinct = sorted(set(items))
    if len(distinct) < 2:
        raise ValueError("At least two distinct elements are needed.")
    return distinct[-2]
```

</details>

```python test
assert second_largest([3, 9, 7]) == 7
assert second_largest([5, 5, 3]) == 3
assert second_largest([-1, -4]) == -4
try:
    second_largest([2, 2])
    assert False, "ValueError expected"
except ValueError:
    pass
print("All checks passed!")
```

### Exercise 2: Off-by-one

The function should return the sum of the numbers from 1 to n, but gives a wrong result. Fix it!

```python starter
def sum_to_n(n):
    s = 0
    for i in range(1, n):
        s += i
    return s
```

<details>
<summary>Solution</summary>

```python solution
def sum_to_n(n):
    s = 0
    for i in range(1, n + 1):   # range's upper bound is excluded!
        s += i
    return s
```

</details>

```python test
assert sum_to_n(1) == 1
assert sum_to_n(10) == 55
assert sum_to_n(0) == 0
print("All checks passed!")
```

### Exercise 3: Write tests!

Write a function `test_counter()` that checks the `vowels(word)` function below with `assert` statements: test at least one normal case, an empty string, an all-caps word and a word with no vowels!

```python starter
def vowels(word):
    return sum(1 for c in word.lower() if c in "aeiou")

def test_counter():
    pass   # write the assert lines here!

test_counter()
```

<details>
<summary>Solution</summary>

```python solution
def vowels(word):
    return sum(1 for c in word.lower() if c in "aeiou")

def test_counter():
    assert vowels("apple") == 2
    assert vowels("") == 0
    assert vowels("PYTHON") == 1
    assert vowels("rhythm") == 0
    assert vowels("education") == 5

test_counter()
```

</details>

```python test
test_counter()
print("All checks passed!")
```

### Exercise 4: unittest

Write a `unittest` test class (`PrimeTest`) for the `is_prime` function below with at least three test methods (small primes, non-primes, boundary cases: 0, 1, 2)!

```python starter
import unittest

def is_prime(n):
    if n < 2:
        return False
    return all(n % d for d in range(2, int(n ** 0.5) + 1))

class PrimeTest(unittest.TestCase):
    pass   # write test_ methods here!
```

<details>
<summary>Solution</summary>

```python solution
import unittest

def is_prime(n):
    if n < 2:
        return False
    return all(n % d for d in range(2, int(n ** 0.5) + 1))

class PrimeTest(unittest.TestCase):
    def test_small_primes(self):
        for p in [2, 3, 5, 7, 11, 13]:
            self.assertTrue(is_prime(p))

    def test_non_primes(self):
        for n in [4, 6, 9, 15, 25]:
            self.assertFalse(is_prime(n))

    def test_boundaries(self):
        self.assertFalse(is_prime(0))
        self.assertFalse(is_prime(1))
        self.assertTrue(is_prime(2))
```

</details>

```python test
import io
suite = unittest.defaultTestLoader.loadTestsFromTestCase(PrimeTest)
result = unittest.TextTestRunner(stream=io.StringIO()).run(suite)
assert result.testsRun >= 3, "At least 3 test methods are needed"
assert result.wasSuccessful()
print("All checks passed!")
```
