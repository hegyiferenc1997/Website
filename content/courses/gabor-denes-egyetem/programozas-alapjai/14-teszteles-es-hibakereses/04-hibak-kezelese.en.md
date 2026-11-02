---
title: How Bugs Arise and Are Handled
summary: How bugs get into programs, how they are reported and tracked, and how they can be prevented.
minutes: 12
---

## What you will learn

- where **software bugs** come from,
- what an **issue** is and the **life cycle** of bugs,
- how to write a good **bug report**,
- which methods **prevent** bugs.

## Error, defect, failure

The literature (e.g. the ISTQB testing standard) distinguishes:

- **error (mistake)** – a human mistake: a misunderstood requirement, a typo,
- **defect (bug)** – the trace of the mistake in the code,
- **failure** – when the faulty code runs and the program misbehaves.

A defect can lurk in code for years if that line never runs (e.g. only on a leap day).

## Where do bugs come from?

| Source | Example |
| --- | --- |
| misunderstood requirement | "the average" – arithmetic or weighted? |
| logic error | `<` instead of `<=` |
| unhandled boundary case | empty list, 0, a very large number |
| wrong assumption about input | the user types text instead of a number |
| environment difference | another OS, encoding, time zone |
| side effect of a change | a fix breaks another feature (regression) |

> A famous example: the **Ariane 5** rocket exploded on its first flight in 1996 because a 64-bit float was converted to a 16-bit integer, which overflowed. The code came from the earlier, slower Ariane 4, where this value never got that large.

## The life cycle of a bug

Teams track bugs in an **issue tracker** (GitHub Issues, Jira):

```text
New → Assigned → In progress → Fixed → Verified → Closed
                                  ↓
                          Reopened (if it's not fixed after all)
```

Every issue has a **severity** (how bad it is) and a **priority** (how urgent the fix is).

## A good bug report

From a bug report the developer must be able to reproduce the bug. It contains:

1. **A short, precise title:** "Average calculation crashes with an empty grade list" (not: "Doesn't work").
2. **Steps to reproduce:** 1., 2., 3.
3. **Expected behaviour:** what should have happened.
4. **Actual behaviour:** what happened – with the full error message.
5. **Environment:** operating system, Python version, browser.

## How do we prevent bugs?

- **Tests** – for every new feature and every fixed bug (regression test).
- **Code review** – another person looks over the change.
- **Static analysis** – tools that find bugs without running the code: `ruff`, `pylint`, `mypy`.
- **Defensive programming** – validating input, handling boundary cases, clear error messages.
- **Continuous integration (CI)** – tests run automatically on every change.
- **Small steps** – small, well-tested changes, frequent commits to version control (git).

```python run
# Defensive programming: the function validates its input and reports clearly.
def credit_average(grades, credits):
    if len(grades) != len(credits):
        raise ValueError("The number of grades and credits differs.")
    if not grades:
        raise ValueError("There are no grades.")
    if any(not 1 <= g <= 5 for g in grades):
        raise ValueError("Grades must be between 1 and 5.")
    return sum(g * c for g, c in zip(grades, credits)) / sum(credits)

print(round(credit_average([5, 4, 3], [8, 5, 3]), 2))
```

## Summary

- Error → defect in the code → failure at run time.
- Bugs are tracked in an issue tracker; a good report is reproducible.
- Prevention: tests, code review, static analysis, defensive programming, CI.
