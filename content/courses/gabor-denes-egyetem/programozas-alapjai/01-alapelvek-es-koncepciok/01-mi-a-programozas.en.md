---
title: What Programming Is and Why It Matters
summary: What it means to program, what it is good for, and what happens inside the computer when a program runs.
minutes: 12
---

## What you will learn

- what a **program** and **programming** are,
- why every step must be described precisely to a computer,
- where you meet programs in everyday life and in engineering.

## What is a program?

A computer is not "smart" on its own: it can only execute very simple instructions (add numbers, compare, move data in memory), but it does so billions of times per second. A **program** is a precise sequence of instructions telling the computer how to solve a task step by step.

**Programming** is the process in which we:

1. understand a problem,
2. work out the steps of the solution (the **algorithm**),
3. write the steps in a **programming language** (the **source code**),
4. try it, test it and fix it.

> **Important:** most of programming is thinking and planning, not typing. A good programmer understands the task first and only then starts coding.

## An everyday example

Imagine explaining to a robot how to make tea. "Make tea" means nothing to it. You have to break it down:

1. Fill the kettle with water.
2. Switch the kettle on.
3. Wait until the water boils.
4. Put a tea bag into the mug.
5. Pour the hot water into the mug.
6. Wait 3 minutes, then remove the tea bag.

This is almost a program: precise steps that can be followed in order. A computer needs everything described in this much detail.

## Your first Python lines

```python run
# print() writes whatever it gets in the parentheses to the screen.
print("Hello, world!")
print("2 + 3 =", 2 + 3)
```

The computer executes the lines **from top to bottom, one after the other**. This is **sequence**, the most basic building block of programs.

## Why programming matters

- **Automation:** repetitive work is done faster and without mistakes (e.g. issuing 10,000 invoices).
- **Precise calculations:** engineering simulations, statistics, banking systems.
- **Control:** cars, aircraft, medical devices and robots.
- **Communication and entertainment:** websites, mobile apps, games.
- **As a computer engineer**, programming is your basic language: every later subject (databases, networks, embedded systems) builds on it.

## The usual parts of a program

| Part       | Meaning                   | Example                                  |
| ---------- | ------------------------- | ---------------------------------------- |
| Input      | data the program receives | the user types a number                  |
| Processing | calculations, decisions   | addition, comparison                     |
| Output     | the result                | printing to the screen, saving to a file |

```python run
# Input → processing → output in a small example.
price = 1200        # input: price of a product
quantity = 3        # input: how many we buy
total = price * quantity   # processing
print("Total:", total)     # output
```

## Summary

- A **program** is a precise sequence of instructions; **programming** spans from understanding the problem to testing.
- The computer only knows simple steps, so everything must be spelled out in detail.
- Most programs follow the pattern **input → processing → output**.

## Lesson exercise: Your first program

Write a program that prints **two lines**, exactly like this:

```text
Hello, world!
I am learning to program.
```

Write the code, press **Run** to see the output, then press **Check** to let the computer verify it. When everything is right, the lesson is marked as done (you can also toggle it by hand at the bottom of the lesson).

```python starter required
# Write the two print() lines here!
```

<details>
<summary>Solution</summary>

```python solution
print("Hello, world!")
print("I am learning to program.")
```

</details>

```python test
lines = output.splitlines()
assert len(lines) == 2, "You need to print exactly two lines."
assert lines[0] == "Hello, world!", "The first line is not right (mind the comma and the exclamation mark)."
assert lines[1] == "I am learning to program.", "The second line is not right (don't forget the full stop)."
```
