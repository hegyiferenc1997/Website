---
title: Unit Testing and Testing Frameworks
summary: The unittest and pytest frameworks, test classes, assert methods, testing exceptions, parameterised tests.
minutes: 20
---

## What you will learn

- what **testing frameworks** are for,
- how to write tests with the built-in **unittest** module,
- how to write tests with the popular **pytest** tool,
- what **code coverage** is and which frameworks other languages have.

## Why a framework?

Plain `assert` lines stop at the first failure and give no summary. A **testing framework**:

- finds and runs **all** tests,
- keeps going after a failing test,
- gives an exact report (expected versus actual value),
- supports preparation (setup) and cleanup (teardown),
- can be automated (e.g. run on every push – **CI**, continuous integration).

## unittest – the built-in framework

Tests are the `test_`-prefixed methods of a subclass of `unittest.TestCase`.

```python run
import sys
import unittest


def average(numbers):
    if not numbers:
        raise ValueError("An empty list has no average.")
    return sum(numbers) / len(numbers)


class AverageTest(unittest.TestCase):
    def test_integers(self):
        self.assertEqual(average([2, 4, 6]), 4)

    def test_single_element(self):
        self.assertEqual(average([5]), 5)

    def test_float_result(self):
        self.assertAlmostEqual(average([1, 2]), 1.5)

    def test_empty_list_raises(self):
        with self.assertRaises(ValueError):
            average([])


# In a file you'd usually just write: unittest.main()
# Here we run it manually so the output appears on screen.
suite = unittest.defaultTestLoader.loadTestsFromTestCase(AverageTest)
unittest.TextTestRunner(stream=sys.stdout, verbosity=2).run(suite)
```

The most common assertion methods:

| Method                            | Checks                         |
| --------------------------------- | ------------------------------ |
| `assertEqual(a, b)`               | `a == b`                       |
| `assertNotEqual(a, b)`            | `a != b`                       |
| `assertTrue(x)`, `assertFalse(x)` | true / false                   |
| `assertIsNone(x)`                 | `x is None`                    |
| `assertIn(a, b)`                  | `a in b`                       |
| `assertAlmostEqual(a, b)`         | approximate equality of floats |
| `assertRaises(Exception)`         | the block raises an exception  |

Preparation code goes into the `setUp` method, which runs before **every** test:

```python run
import sys
import unittest


class CartTest(unittest.TestCase):
    def setUp(self):
        self.cart = ["milk", "bread"]     # every test gets a fresh cart

    def test_add(self):
        self.cart.append("butter")
        self.assertEqual(len(self.cart), 3)

    def test_initial_size(self):
        self.assertEqual(len(self.cart), 2)   # the previous test doesn't affect it


result = unittest.TextTestRunner(stream=sys.stdout).run(
    unittest.defaultTestLoader.loadTestsFromTestCase(CartTest)
)
print("Successful:", result.wasSuccessful())
```

## pytest – simpler and more popular

**pytest** is an external package (`pip install pytest`), but it's the most widespread in the Python world. Tests are plain functions using the ordinary `assert` statement.

```python
# test_average.py
import pytest
from average import average

def test_integers():
    assert average([2, 4, 6]) == 4

def test_empty_list_raises():
    with pytest.raises(ValueError):
        average([])

@pytest.mark.parametrize("values, expected", [
    ([1], 1),
    ([1, 2], 1.5),
    ([10, 20, 30], 20),
])
def test_many_cases(values, expected):
    assert average(values) == expected
```

Running in a terminal (pytest finds the `test_*.py` files):

```bash
pytest
pytest -v              # verbose output
pytest -k "empty"      # only tests with "empty" in their names
```

```text
test_average.py::test_integers PASSED
test_average.py::test_empty_list_raises PASSED
test_average.py::test_many_cases[values0-1] PASSED
...
======================== 5 passed in 0.02s ========================
```

## Doctest – tests in the documentation

The `doctest` module runs the examples in a docstring and compares them with the results:

```python run
import doctest


def square(x):
    """Return the square of x.

    >>> square(3)
    9
    >>> square(-2)
    4
    """
    return x * x


result = doctest.testmod()
print(result)   # TestResults(failed=0, attempted=2)
```

## Code coverage

**Code coverage** measures what percentage of the code the tests execute. In Python the `coverage` or `pytest-cov` package measures it:

```bash
pytest --cov=my_module
```

Even 100% coverage doesn't mean there are no bugs – only that every line ran at least once. Uncovered parts, however, are definitely untested.

## Frameworks in other languages

| Language                | Framework            |
| ----------------------- | -------------------- |
| Java                    | JUnit                |
| C#                      | NUnit, xUnit, MSTest |
| JavaScript / TypeScript | Jest, Vitest         |
| C++                     | GoogleTest, Catch2   |
| Ruby                    | RSpec, Minitest      |

> This website works the same way: `pnpm test` runs the tests with the **Vitest** framework – including one that runs every Python example and solution in this course.

## Summary

- A framework finds, runs and summarises tests.
- **unittest:** `TestCase` class, `test_` methods, `assertEqual`, `assertRaises`, `setUp`.
- **pytest:** plain functions with ordinary `assert`, `pytest.raises`, parameterisation.
- **doctest:** examples in docstrings; **coverage:** measuring coverage.
