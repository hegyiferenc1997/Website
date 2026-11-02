---
title: Testing Basics
summary: Why we test, levels of testing, designing test cases: normal, boundary and invalid cases.
minutes: 15
---

## What you will learn

- why **testing** is essential,
- what **levels** it has (unit, integration, system, acceptance),
- how to design **test cases**: normal, **boundary** and invalid cases,
- how to write a simple test with `assert`.

## Why test?

> "Testing shows the presence, not the absence of bugs." – Edsger W. Dijkstra

The goal of **testing** is that **we** find the bugs, not the user. A good test suite:

- gives **confidence**: we know the code does what it should,
- is a **safety net** for changes: if we break something, a test reports it immediately (**regression test**),
- is **documentation**: tests show how a function is meant to be used.

The later a bug is found, the more expensive it is to fix: a few minutes during development, days and serious damage in production.

## Levels of testing

| Level | What it tests | Example |
| --- | --- | --- |
| **unit test** | one function or class in isolation | `average([4, 5]) == 4.5` |
| **integration test** | several units working together | the function reads correctly from the database |
| **system test** | the whole application | you can complete sign-up on the website |
| **acceptance test** | does it meet the client's needs | the user approves the feature |

In this topic we mainly deal with **unit tests**: programmers write them, they are fast, and we run them often.

## Black box and white box

- **Black-box** testing: we only look at the specification (what it should do), not the code.
- **White-box** testing: knowing the code, we design tests so that every branch and loop runs (**code coverage**).

## Designing test cases

A test case is **input + expected output**. Think in three groups:

1. **Normal cases** – typical, "everyday" inputs.
2. **Boundary cases** – the edges of ranges: empty list, one element, 0, negative numbers, exactly the threshold.
3. **Invalid cases** – invalid input: does it raise the right exception?

Example: `grade(score)` on the course's scale (50 → 2, 63 → 3, 76 → 4, 89 → 5).

| Group | Input | Expected |
| --- | --- | --- |
| normal | 70 | 3 |
| boundary | 49, 50 | 1, 2 |
| boundary | 88, 89 | 4, 5 |
| boundary | 0, 100 | 1, 5 |
| invalid | −1, 101 | `ValueError` |

> **Most bugs are at the boundaries** ("off-by-one": `>` or `>=`?). Always test both sides of a boundary!

## Simple tests with assert

```python run
def grade(score):
    if not 0 <= score <= 100:
        raise ValueError("The score must be between 0 and 100.")
    if score >= 89:
        return 5
    if score >= 76:
        return 4
    if score >= 63:
        return 3
    if score >= 50:
        return 2
    return 1


# Normal and boundary cases
assert grade(70) == 3
assert grade(49) == 1 and grade(50) == 2
assert grade(88) == 4 and grade(89) == 5
assert grade(0) == 1 and grade(100) == 5

# Invalid case: we expect an exception
try:
    grade(101)
    assert False, "It should have raised ValueError"
except ValueError:
    pass

print("All tests passed!")
```

If an `assert` is false, an `AssertionError` occurs – the test **fails**, and we see on which line.

## Test-driven development (TDD)

In **TDD** (*Test-Driven Development*) we write the test first and the code after:

1. 🔴 **Red:** write a test that fails (because there's no code yet).
2. 🟢 **Green:** write the simplest code that makes the test pass.
3. 🔵 **Refactor:** clean up the code – the tests guarantee you don't break anything.

The practice exercises on this site are built the same way: the "check" block is the test, your job is the code.

## Summary

- Testing finds bugs, gives confidence and is a safety net for changes.
- Levels: **unit → integration → system → acceptance**.
- Test case = input + expected output; always think of **normal, boundary and invalid** cases.
- TDD: red → green → refactor.
