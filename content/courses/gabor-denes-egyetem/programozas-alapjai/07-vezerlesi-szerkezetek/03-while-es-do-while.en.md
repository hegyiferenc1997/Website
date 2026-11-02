---
title: Loops – while and do-while
summary: Pre-test and post-test loops, infinite loops, and how to write do-while in Python.
minutes: 15
---

## What you will learn

- what a **loop** is for and what its parts are,
- how the **pre-test** `while` loop works,
- what a **post-test** (do-while) loop is and how to write one in Python,
- how to avoid an **infinite loop**.

## Parts of a loop

A **loop** executes statements repeatedly. Every loop has:

- a **loop condition** – the loop runs while it is true,
- a **loop body** – the repeated statements,
- and something in the body **must change**, otherwise the condition never becomes false.

## Pre-test loop: while

It checks the condition **before every iteration**. If it is false at the start, the body runs **zero times**.

```python run
counter = 1
while counter <= 5:         # loop condition
    print(counter)          # loop body
    counter += 1            # the variable that eventually makes the condition false
print("Done")
```

In pseudocode:

```text
While condition
    statements
End while
```

`while` is a good choice when we **don't know in advance** how many repetitions are needed:

```python run
# How many years until money doubles at 7% annual interest?
amount = 100_000
target = 200_000
years = 0
while amount < target:
    amount *= 1.07
    years += 1
print("After", years, "years:", round(amount))
```

## Infinite loop

If the condition never becomes false, the loop is **infinite**. The program "hangs" (in a terminal stop it with **Ctrl + C**).

```python
i = 0
while i < 10:
    print(i)
    # forgot: i += 1  → infinite loop!
```

An intentional infinite loop is written as `while True:` and left with `break` (see the lesson on control statements).

## Post-test loop: do-while

A **post-test** loop checks the condition at the **end** of an iteration, so the body is guaranteed to run **at least once**. In C, Java and C# this is `do-while`:

```java
// Java
int number;
do {
    number = read();
} while (number < 1 || number > 10);   // keeps asking until the number is valid
```

Python has no `do-while`, but the same can be written with `while True` + `break`:

```python run
# Ask for a number until it's between 1 and 10 – we always ask at least once.
while True:
    number = int(input("Enter a number between 1 and 10: "))
    if 1 <= number <= 10:
        break
    print("Not valid, try again!")
print("Thanks:", number)
```

## Comparison

|                   | Pre-test (while)              | Post-test (do-while)                      |
| ----------------- | ----------------------------- | ----------------------------------------- |
| condition checked | at the start of an iteration  | at the end of an iteration                |
| minimum runs      | 0                             | 1                                         |
| typical use       | unknown number of repetitions | input validation, menus                   |
| in Python         | `while condition:`            | `while True:` … `if not condition: break` |

## Summary

- A loop has a condition and a body; something must change in the body.
- `while` is **pre-test**: it may run zero times.
- **do-while** is post-test and runs at least once; in Python use `while True` + `break`.
