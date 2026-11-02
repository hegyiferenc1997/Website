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

| Kind | For whom | Where | Example |
| --- | --- | --- | --- |
| **in-code** | the developer reading the code | comments, descriptive names | `# Gross price including VAT` |
| **API documentation** | whoever uses the function / module | docstrings, type hints | `"""Return the average…"""` |
| **developer** | whoever develops the project further | README, architecture notes, `CONTRIBUTING` | installation, structure, decisions |
| **user** | the program's user | manual, help, FAQ | "How do I sign up?" |

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
- Document the *why*, not the obvious; keep it up to date.
- The best starting point is self-explanatory code with descriptive names.
