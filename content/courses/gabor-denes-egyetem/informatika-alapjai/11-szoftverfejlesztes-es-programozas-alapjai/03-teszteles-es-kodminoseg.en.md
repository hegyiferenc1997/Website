---
title: Testing and Code Quality
summary: Unit, integration, system and acceptance tests, automated tests in Python, readable code, documentation, code review.
minutes: 18
---

## What you will learn

- the **levels** of testing (unit, integration, system, acceptance),
- what an **automated unit test** looks like,
- what makes code **good**: readability, naming, documentation, **code review**.

## Levels of testing

```text
            ▲  few, slow, expensive
           ╱ ╲      acceptance test (the client)
          ╱   ╲     system test (the whole system)
         ╱     ╲    integration test (modules together)
        ╱_______╲   unit test (one function, one class)
            ▼  many, fast, cheap
```

| Level           | What does it check?                                 | Who does it?             |
| --------------- | --------------------------------------------------- | ------------------------ |
| **unit test**   | one function, one class on its own                  | developer, automatically |
| **integration** | do the modules work together (e.g. code + database) | developer, tester        |
| **system test** | the whole system against the requirements           | tester                   |
| **acceptance**  | did the client get what they asked for              | client, users            |

This shape is called the **test pyramid**: many fast unit tests, fewer slow big tests.

## Automated unit tests

A unit test is a small program that calls the code with known inputs and checks the result. Think of **edge cases** too: empty list, zero, negative number, very large value.

```python run
# The function under test
def discounted_price(price, percent):
    if not 0 <= percent <= 100:
        raise ValueError("The discount must be between 0 and 100.")
    return round(price * (100 - percent) / 100)

# Unit tests with assert (in practice we run them with pytest)
assert discounted_price(1000, 20) == 800
assert discounted_price(1000, 0) == 1000      # edge case
assert discounted_price(1000, 100) == 0       # edge case
try:
    discounted_price(1000, 150)
    assert False, "It should have raised an error"
except ValueError:
    pass
print("All tests passed.")
```

With **TDD** (test-driven development) you write the test first, and only then the code that passes it.

## What makes code good?

Code is **read** far more often than it is written. Good code:

- uses **meaningful names**: `compute_average(grades)` and not `f(x)`,
- consists of **short functions**, each doing one thing,
- doesn't repeat itself (**DRY**: Don't Repeat Yourself),
- has a **consistent style** (formatters: Black/Ruff, Prettier),
- is **documented**: a short comment where the _why_ isn't obvious, a README at the top of the project, docstrings on functions.

```python run
def average(grades):
    """The average of the grades; returns 0 for an empty list (no division by zero)."""
    if not grades:
        return 0
    return sum(grades) / len(grades)

print(average([5, 4, 3]), average([]))
```

## Code review

In a code review another developer reads the change (e.g. in a GitHub pull request) before it is merged. It finds bugs, shares knowledge and keeps the code consistent. Good habit: small, single-topic changes with a short explanation.

## Summary

- Test levels: unit → integration → system → acceptance; the test pyramid.
- A unit test calls with known input and checks; think of edge cases.
- Good code: meaningful names, short functions, DRY, consistent style, documentation, code review.

## Exercise

```quiz required
? Which test level checks a single function on its own?
+ unit test
- integration test
- system test
- acceptance test
! Unit test.

? What is the value of `discounted_price(2500, 40)`?
= 1500
! 2500 · 60 / 100 = 1500.

? What does the DRY principle mean?
- Always write documentation.
+ Don't repeat yourself.
- Every function should be long.
- Don't use comments.
! Don't Repeat Yourself.

? Which method has you write the test **first** and the code afterwards?
= TDD
= test-driven development
! Test-Driven Development.
```
