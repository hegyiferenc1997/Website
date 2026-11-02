---
title: Why Documenting Code Matters
summary: For whom and why we write documentation, its levels, and what it should contain.
minutes: 10
---

## What you will learn

- why documentation is **essential**,
- what **kinds** there are (in-code, API, user, developer),
- what makes **good documentation**.

## Why document?

> "Code is read much more often than it is written." – Guido van Rossum, creator of Python

A program isn't only "read" by the computer. It's read by:

- your **teammate** who keeps working on it,
- your **future self** – in six months your own code will look foreign,
- the **user** who wants to use it,
- the **instructor or grader** marking your project.

The goal of documentation is to make code **understandable, usable and maintainable**. A poorly documented program can become worthless even if it works, because nobody dares to change it.

> In this course's project assignment the **completeness and professional wording of the documentation** is a separate grading criterion – take it seriously!

## Levels of documentation

| Kind                  | For whom                             | Where                                      | Example                            |
| --------------------- | ------------------------------------ | ------------------------------------------ | ---------------------------------- |
| **in-code**           | the developer reading the code       | comments, descriptive names                | `# Gross price including VAT`      |
| **API documentation** | whoever uses the function / module   | docstrings, type hints                     | `"""Return the average…"""`        |
| **developer**         | whoever develops the project further | README, architecture notes, `CONTRIBUTING` | installation, structure, decisions |
| **user**              | the program's user                   | manual, help, FAQ                          | "How do I sign up?"                |

## What to document

- **What** the module / function does (the goal, not the implementation steps).
- **Parameters and return value**: type, meaning, allowed range.
- **Exceptions**: when and which error it raises.
- **Why** it was built this way – the reason for non-obvious decisions.
- **How to use it**: a short example.
- **Installation and running**: dependencies, commands (README).

## What not to document

- What is **obvious** from the code: `i += 1  # increments i` – that's just noise.
- Outdated information: **wrong** documentation is worse than none. When you change the code, update the comment too!

## The best documentation: readable code

Many comments become unnecessary when the code **explains itself**: descriptive names, short functions, clear structure.

```python run
# Hard to understand, would need a comment:
def f(l):
    return sum(x for x in l if x >= 50) / len([x for x in l if x >= 50])

# Explains itself:
PASS_MARK = 50

def average_of_passing_scores(scores):
    passing = [s for s in scores if s >= PASS_MARK]
    return sum(passing) / len(passing)

print(f([40, 60, 80]), average_of_passing_scores([40, 60, 80]))
```

## Summary

- Code is read far more often than written – documentation is the basis of maintainability.
- Levels: in-code, API (docstrings), developer (README), user.
- Document the _why_, not the obvious; keep it up to date.
- The best starting point is self-explanatory code with descriptive names.

## Lesson exercise: A docstring with runnable examples

The `circle_area(r)` function already works, but nothing tells you how to use it. Write a **docstring** for it that:

- describes in one sentence what the function does,
- contains at least **two doctest examples** (lines starting with `>>>` followed by the expected result), for example `round(circle_area(1), 2)` → `3.14`.

In addition, the function should raise a `ValueError` for a negative radius.

The checker also runs the examples in your docstring with the `doctest` module – all of them must produce the right result.

```python starter required
import math


def circle_area(r):
    return math.pi * r ** 2


print(circle_area(2))
```

<details>
<summary>Solution</summary>

```python solution
import math


def circle_area(r):
    """Return the area of a circle with radius r.

    >>> round(circle_area(1), 2)
    3.14
    >>> circle_area(0)
    0.0
    """
    if r < 0:
        raise ValueError("The radius cannot be negative.")
    return math.pi * r ** 2


print(circle_area(2))
```

</details>

```python test
import doctest, math
doc = circle_area.__doc__ or ""
assert doc.strip(), "The function has no docstring."
assert doc.count(">>>") >= 2, "The docstring needs at least two doctest examples starting with >>>."
tests = doctest.DocTestFinder().find(circle_area, "circle_area", module=False, globs={"circle_area": circle_area, "math": math})
runner = doctest.DocTestRunner(verbose=False)
for t in tests:
    runner.run(t, out=lambda s: None)
result = runner.summarize(verbose=False)
assert result.attempted >= 2, "I could not find at least two doctest examples."
assert result.failed == 0, "One of the doctest examples does not produce the documented result."
assert abs(circle_area(3) - 28.274333882308138) < 1e-9, "The area calculation is broken."
try:
    circle_area(-1)
    assert False, "A negative radius should raise ValueError."
except ValueError:
    pass
```
