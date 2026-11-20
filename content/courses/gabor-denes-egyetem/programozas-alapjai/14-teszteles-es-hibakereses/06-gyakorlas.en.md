---
title: Practice – Testing and Debugging
summary: Review questions, writing tests and fixing buggy code.
minutes: 55
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

## Summary exercise: Roman numerals – code and tests together

The summary exercise of the topic: write the function **and** its tests, as in test-driven development.

1. `roman(n)`: converts an integer between 1 and 3999 into a Roman numeral (e.g. 1994 → `"MCMXCIV"`). For other values `ValueError`.
2. `test_roman()`: tests `roman` with `assert`s – normal cases, the "subtractive" forms (4, 9, 40, 90, 400, 900), the boundaries (1, 3999) and invalid input (0, 4000).

The check verifies your function for all 3999 values and also runs your tests against broken versions – they must catch them.

Tip: a list of value pairs in descending order – `[(1000, "M"), (900, "CM"), (500, "D"), (400, "CD"), …]` – and a loop that always subtracts the largest value that still fits.

```python starter required
def roman(n):
    pass


def test_roman():
    pass


test_roman()
print(roman(1994))   # MCMXCIV
```

<details>
<summary>Solution</summary>

```python solution
VALUES = [(1000, "M"), (900, "CM"), (500, "D"), (400, "CD"), (100, "C"), (90, "XC"),
          (50, "L"), (40, "XL"), (10, "X"), (9, "IX"), (5, "V"), (4, "IV"), (1, "I")]


def roman(n):
    if not isinstance(n, int) or not 1 <= n <= 3999:
        raise ValueError("Only integers between 1 and 3999 can be written.")
    result = ""
    for value, symbol in VALUES:
        while n >= value:
            result += symbol
            n -= value
    return result


def test_roman():
    assert roman(1) == "I"
    assert roman(3) == "III"
    assert roman(4) == "IV"
    assert roman(9) == "IX"
    assert roman(14) == "XIV"
    assert roman(40) == "XL"
    assert roman(90) == "XC"
    assert roman(400) == "CD"
    assert roman(900) == "CM"
    assert roman(1994) == "MCMXCIV"
    assert roman(3999) == "MMMCMXCIX"
    for bad in [0, 4000, -1]:
        try:
            roman(bad)
            assert False, f"{bad}: ValueError expected"
        except ValueError:
            pass


test_roman()
print(roman(1994))   # MCMXCIV
```

</details>

```python test
def reference(n):
    values = [(1000, "M"), (900, "CM"), (500, "D"), (400, "CD"), (100, "C"), (90, "XC"),
              (50, "L"), (40, "XL"), (10, "X"), (9, "IX"), (5, "V"), (4, "IV"), (1, "I")]
    s = ""
    for v, sym in values:
        while n >= v:
            s, n = s + sym, n - v
    return s

for n in range(1, 4000):
    assert roman(n) == reference(n), f"roman({n}) should be {reference(n)}."
for bad in [0, 4000]:
    try:
        roman(bad)
        assert False, f"roman({bad}) must raise ValueError."
    except ValueError:
        pass

test_roman()
correct = roman
def m_no_subtractive(n):
    if not 1 <= n <= 3999: raise ValueError
    s = ""
    for v, sym in [(1000, "M"), (500, "D"), (100, "C"), (50, "L"), (10, "X"), (5, "V"), (1, "I")]:
        while n >= v:
            s, n = s + sym, n - v
    return s
def m_no_validation(n):
    return reference(n)
def m_wrong_900(n):
    return reference(n).replace("CM", "DCD")
for mutant, description in [(m_no_subtractive, "4 → IIII (no subtractive forms)"),
                            (m_no_validation, "no ValueError for 0 and 4000"),
                            (m_wrong_900, "900 is written wrongly")]:
    roman = mutant
    try:
        test_roman()
        caught = False
    except Exception:
        caught = True
    roman = correct
    assert caught, f"Your tests did not notice this bug: {description}."
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Programming exercises

**1.** **Temperature category with edge cases.** Write the `temperature_category(degrees)` function: below 0 `"freezing"`, from 0 to below 15 `"cold"`, from 15 to below 25 `"pleasant"`, from 25 `"warm"`! The test also checks the boundary values (0, 15, 25) — this is the essence of boundary value analysis.

```python starter
def temperature_category(degrees):
    if degrees < 0:
        return "freezing"
    if degrees <= 15:
        return "cold"
    if degrees <= 25:
        return "pleasant"
    return "warm"
```

<details>
<summary>Solution</summary>

```python solution
def temperature_category(degrees):
    if degrees < 0:
        return "freezing"
    if degrees < 15:                        # 15 is already pleasant
        return "cold"
    if degrees < 25:                        # 25 is already warm
        return "pleasant"
    return "warm"
```

</details>

```python test
assert temperature_category(-0.1) == "freezing"
assert temperature_category(0) == "cold"
assert temperature_category(14.9) == "cold"
assert temperature_category(15) == "pleasant"
assert temperature_category(25) == "warm"
print("All checks passed!")
```

**2.** **Is it sorted?** Write the `is_sorted(items)` function, which returns `True` if the list is in non-decreasing order! Think about the special cases: empty and one-element lists are sorted, and equal neighbours are allowed.

```python starter
def is_sorted(items):
    return items[0] <= items[-1]
```

<details>
<summary>Solution</summary>

```python solution
def is_sorted(items):
    for i in range(len(items) - 1):
        if items[i] > items[i + 1]:         # a single bad pair is enough
            return False
    return True
```

</details>

```python test
assert is_sorted([1, 2, 2, 5])
assert is_sorted([])
assert is_sorted([7])
assert not is_sorted([1, 3, 2, 4])
assert not is_sorted([3, 1, 2, 3])
print("All checks passed!")
```

**3.** **First bad version.** From a certain point on, all versions of a program numbered 1 to `n` are buggy. Write the `first_bad_version(n, good)` function with **binary search**, where `good(v)` tells whether version `v` is good! Return the number of the first bad version (you may assume there is one). This is the idea behind `git bisect`.

```python starter
def first_bad_version(n, good):
    return n
```

<details>
<summary>Solution</summary>

```python solution
def first_bad_version(n, good):
    low, high = 1, n
    while low < high:
        mid = (low + high) // 2
        if good(mid):
            low = mid + 1                   # the bug came in later
        else:
            high = mid                      # this one is bad, but there may be an earlier one
    return low
```

</details>

```python test
assert first_bad_version(10, lambda v: v < 7) == 7
assert first_bad_version(1, lambda v: False) == 1
assert first_bad_version(1000, lambda v: v < 2) == 2
calls = []
first_bad_version(1000000, lambda v: calls.append(v) or v < 123457)
assert first_bad_version(1000000, lambda v: v < 123457) == 123457
assert len(calls) <= 20, "binary search needed"
print("All checks passed!")
```

### Quick check questions

```quiz
? A function accepts integers between 1 and 100. Which is the best boundary value test set?
- 50
- 1, 50, 100
+ 0, 1, 100, 101
- 2, 99
! It's worth testing both sides of the boundaries: bugs typically live there.

? What does the statement `assert 1 + 1 == 3` return?
- False
- None
+ raises an `AssertionError` exception
- nothing, it only warns
! With a false condition `assert` raises an exception, which signals the failing test.

? At most how many tries does binary search need to find the first bad version among 1024 versions?
= 10
! $2^{10} = 1024$, every try halves the possibilities.

? What is the goal of regression testing?
- designing new features
+ checking that a change hasn't broken a previously working part
- measuring the program's speed
- drawing the user interface
! Re-running the tests after every change.
```
