---
title: Deeper – Testing Methodically
summary: How to choose test cases with equivalence classes and boundary values, unit tests with the unittest framework, property-based testing with random inputs (with a chart of how many tests a rare bug needs), and finding the broken version by bisection – with runnable programs and a programming exercise.
minutes: 55
---

## What you will learn in this lesson

- how to choose **few but good** test cases (equivalence classes, boundary values),
- how to write unit tests with the built-in **unittest** framework,
- how **random** inputs find bugs you didn't think of,
- how to find **by bisection** which change broke the program.

## 1. Which inputs should you test?

In the basic lesson we saw why testing is needed. But not every input can be tried – even for a function expecting an age there are infinitely many numbers. The solution: we split the inputs into **equivalence classes** (for which the function behaves the same way), take one representative of each, and pay special attention to the **boundaries**, because that's where bugs are most common (`<=` instead of `<`):

```python run
# Equivalence classes and boundary values on a ticket price function
def ticket_price(age):
    if age < 0:
        raise ValueError("negative age")
    if age < 6:
        return 0          # child: free
    if age < 18:
        return 500        # student
    if age < 65:
        return 1000       # adult
    return 500            # pensioner

# one representative per class + both sides of every boundary
tests = [(3, 0), (12, 500), (40, 1000), (80, 500),             # representatives
         (0, 0), (5, 0), (6, 500), (17, 500), (18, 1000),      # boundaries
         (64, 1000), (65, 500)]
failures = [(age, expected, ticket_price(age)) for age, expected in tests if ticket_price(age) != expected]
print(f"{len(tests)} test cases, {len(failures)} failures", failures)
try:
    ticket_price(-1)
except ValueError:
    print("ValueError for a negative age: ok")
```

11 test cases cover every class and every boundary – more tests would hardly help, fewer would be risky. Boundaries matter because if someone writes `age <= 18` instead of `age < 18`, only the 18-year-old tester notices; the 12- and 40-year-old ones don't.

## 2. Unit tests with the unittest framework

A framework gives a uniform format, automatic running and a clear report. In Python's built-in `unittest`, tests are the `test_`-prefixed methods of a class:

```python run
# Unit tests with unittest (we direct the output to standard output)
import sys
import unittest

class Basket:
    def __init__(self):
        self.items = {}

    def add(self, product, price, qty=1):
        if price < 0 or qty <= 0:
            raise ValueError("invalid price or quantity")
        self.items[product] = (price, self.items.get(product, (price, 0))[1] + qty)

    def total(self):
        return sum(price * qty for price, qty in self.items.values())

class BasketTest(unittest.TestCase):
    def setUp(self):                          # a fresh basket before every test
        self.b = Basket()

    def test_empty_basket(self):
        self.assertEqual(self.b.total(), 0)

    def test_adding_up(self):
        self.b.add("pen", 250, 2)
        self.b.add("notebook", 690)
        self.assertEqual(self.b.total(), 1190)

    def test_same_twice(self):
        self.b.add("pen", 250)
        self.b.add("pen", 250)
        self.assertEqual(self.b.items["pen"], (250, 2))

    def test_negative_price(self):
        with self.assertRaises(ValueError):
            self.b.add("bug", -100)

suite = unittest.TestLoader().loadTestsFromTestCase(BasketTest)
unittest.TextTestRunner(stream=sys.stdout, verbosity=2).run(suite)
```

`setUp` runs before every test, so the tests are **independent** of each other – a broken test doesn't break the next one. `assertRaises` checks that a bad input really raises an exception. In real projects many people use the more concise **pytest** (a plain `assert` is enough there), but the thinking is the same.

## 3. Random inputs: property-based testing

Hand-written test cases only find the bugs we **thought of**. Property-based testing asks differently: what must be true for **every** input? For a sort, for example: the result is sorted, and it contains the same elements. We then check this on many random inputs:

```python run
# Property-based testing with random inputs: uncovering a hidden bug
import random
from collections import Counter

def sort_buggy(items):
    return sorted(set(items))          # BUG: the set removes duplicates

def properties_hold(sorter, items):
    result = sorter(items)
    is_sorted = all(a <= b for a, b in zip(result, result[1:]))
    same_items = Counter(result) == Counter(items)
    return is_sorted and same_items

print("hand-written tests:", properties_hold(sort_buggy, [3, 1, 2]), properties_hold(sort_buggy, [5, 4]))

random.seed(7)
for attempt in range(1, 1001):
    items = [random.randint(0, 20) for _ in range(random.randint(0, 6))]
    if not properties_hold(sort_buggy, items):
        print(f"random test {attempt} found a bug: {items} → {sort_buggy(items)}")
        break
```

The two hand-written tests passed (because they had no duplicate elements), and random testing found the bug within a few attempts. How many random tests are needed? If a bug appears for a fraction $p$ of the inputs, after $k$ tests we find it with probability $1 - (1 - p)^k$:

```plot
title: Chance (%) that k random tests find the bug
x: 0, 300
y: 0, 100
param: p = 0.01, 0.001, 0.1, 0.001
f: 100*(1 - (1 - p)^x) # the bug appears for a fraction p of the inputs
dash: 95
```

For a bug with 1% frequency, about 300 tests are needed for 95% certainty – nobody would write that by hand, a machine does it in a moment. In Python the established tool for this is the **hypothesis** library, which even simplifies the failing input to the smallest possible one.

## 4. Which change broke it? Bisection

"It still worked last week." If 100 changes (commits) have happened since, you don't need to look through all 100: with **bisection** (as in binary search) you find the first bad one in about 7 steps. The `git bisect` command does exactly this:

```python run
# Finding the change that introduced the bug by bisection (like git bisect)
from math import ceil, log2

versions = 100
first_bad = 63                               # we don't know this – this is what we're looking for

def tests_pass(version):
    return version < first_bad               # in reality: we run the tests on this version

good, bad, steps = 0, versions - 1, 0        # we know: version 0 is still good, the latest is bad
while bad - good > 1:
    mid = (good + bad) // 2
    steps += 1
    if tests_pass(mid):
        good = mid
    else:
        bad = mid
    print(f"step {steps}: version {mid} is {'good' if tests_pass(mid) else 'BAD'}")
print(f"the first bad version: {bad} (in {steps} steps; at most {ceil(log2(versions))} would have been needed)")
```

Bisection needs an **automatic test** that decides whether a version is good – another argument for first capturing a bug in a test, and only then fixing it.

| Viewpoint      | What does testing mean to them?                                            |
| -------------- | -------------------------------------------------------------------------- |
| **developer**  | can boldly rewrite code: if something breaks, the tests say so immediately |
| **tester**     | methodical case selection: classes, boundaries, bad inputs, random inputs  |
| **user**       | fewer bugs in production – the developer finds the bug, not them           |
| **management** | testing costs money, but a bug found in production costs many times more   |

## Summary

- One representative per equivalence class and both sides of every boundary: few but effective test cases.
- In unittest tests are `test_` methods; `setUp` makes them independent, `assertRaises` checks exceptions.
- Property-based testing checks general rules on random inputs; a rare bug needs many tests.
- The change that introduced a bug can be found by bisection in about log₂ n steps.

## Lesson exercise: ticket price with boundaries

Write the `ticket_price(age)` function, which gives the prices of the lesson's first example: 0 under 6, 500 for ages 6–17, 1000 for ages 18–64, 500 from 65! For a negative age raise a `ValueError`. The starter code contains **boundary bugs** – the tests look for exactly these.

```python starter required
def ticket_price(age):
    if age <= 6:
        return 0
    if age <= 18:
        return 500
    if age <= 65:
        return 1000
    return 500


print(ticket_price(18))
```

<details>
<summary>Solution</summary>

```python solution
def ticket_price(age):
    if age < 0:
        raise ValueError("negative age")
    if age < 6:
        return 0
    if age < 18:
        return 500
    if age < 65:
        return 1000
    return 500


print(ticket_price(18))
```

</details>

```python test
for age, expected in [(0, 0), (5, 0), (6, 500), (17, 500), (18, 1000), (64, 1000), (65, 500), (90, 500)]:
    assert ticket_price(age) == expected, f"the ticket is {expected} at age {age}"
try:
    ticket_price(-1)
    assert False, "a negative age needs a ValueError"
except ValueError:
    pass
```
