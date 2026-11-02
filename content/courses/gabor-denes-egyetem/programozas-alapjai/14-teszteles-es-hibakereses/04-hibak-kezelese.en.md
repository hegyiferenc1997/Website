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

| Source                       | Example                                   |
| ---------------------------- | ----------------------------------------- |
| misunderstood requirement    | "the average" – arithmetic or weighted?   |
| logic error                  | `<` instead of `<=`                       |
| unhandled boundary case      | empty list, 0, a very large number        |
| wrong assumption about input | the user types text instead of a number   |
| environment difference       | another OS, encoding, time zone           |
| side effect of a change      | a fix breaks another feature (regression) |

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

## Lesson exercise: Fix the reported bug

A bug report has arrived in the team's issue tracker:

> **Title:** `format_duration()` returns wrong text for whole hours and 0 minutes
>
> **Steps:** `format_duration(60)`, `format_duration(0)`, `format_duration(-5)`
>
> **Expected:** `"1 h"`, `"0 min"`, and `ValueError` for a negative value
>
> **Actual:** `"1 h 0 min"`, `""` (empty text), `"55 min"`
>
> **Severity:** medium – strange labels appear in the user interface

Fix the function so that it gives the expected behaviour described in the report, and the other cases (e.g. `format_duration(125)` → `"2 h 5 min"`, `format_duration(59)` → `"59 min"`) don't break.

```python starter required
def format_duration(minutes):
    hours = minutes // 60
    rest = minutes % 60
    if hours > 0:
        return f"{hours} h {rest} min"
    return f"{rest} min" if rest else ""


for m in [125, 60, 0, 59]:
    print(m, "→", repr(format_duration(m)))
```

<details>
<summary>Solution</summary>

```python solution
def format_duration(minutes):
    if minutes < 0:
        raise ValueError("A duration cannot be negative.")
    hours, rest = divmod(minutes, 60)
    parts = []
    if hours > 0:
        parts.append(f"{hours} h")
    if rest > 0 or hours == 0:
        parts.append(f"{rest} min")
    return " ".join(parts)


for m in [125, 60, 0, 59]:
    print(m, "→", repr(format_duration(m)))
```

</details>

```python test
assert format_duration(60) == "1 h", "60 minutes → \"1 h\" (point 1 of the bug report)"
assert format_duration(0) == "0 min", "0 minutes → \"0 min\" (point 2 of the bug report)"
try:
    format_duration(-5)
    assert False, "A negative value must raise ValueError (point 3 of the bug report)."
except ValueError:
    pass
assert format_duration(125) == "2 h 5 min", "125 minutes → \"2 h 5 min\" – this must not break!"
assert format_duration(59) == "59 min", "59 minutes → \"59 min\""
assert format_duration(180) == "3 h", "180 minutes → \"3 h\""
```
