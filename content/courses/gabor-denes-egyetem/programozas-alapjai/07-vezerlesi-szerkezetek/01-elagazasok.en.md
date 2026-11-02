---
title: Branching (if, elif, else)
summary: Conditional execution: one-, two- and multi-way branching, nesting and common mistakes.
minutes: 15
---

## What you will learn

- **one-way**, **two-way** and **multi-way** branching,
- how to **nest** branches,
- why the **order** of conditions matters.

## One-way branch: if

If the condition is true, the indented block runs; if false, the program skips it.

```python run
temperature = 31
if temperature > 30:
    print("Heat alert!")
print("End of weather report.")
```

## Two-way branch: if – else

```python run
number = 7
if number % 2 == 0:
    print("even")
else:
    print("odd")
```

## Multi-way branch: if – elif – else

Python checks the `elif` ("else if") branches **in order, from the top**, and **only the first true branch** runs.

```python run
score = 78

if score >= 89:
    grade = 5
elif score >= 76:
    grade = 4
elif score >= 63:
    grade = 3
elif score >= 50:
    grade = 2
else:
    grade = 1

print("Grade:", grade)   # 4
```

> **Mind the order!** If `score >= 50` came first, 78 points would also give a 2, because that would be the first true branch. The stricter condition always goes first.

These thresholds happen to be this course's grading scale (50–62 pass, 63–75 satisfactory, 76–88 good, 89–100 excellent).

## Nested branches

A branch can contain another branch:

```python run
age = 20
has_ticket = True

if age >= 18:
    if has_ticket:
        print("You may enter.")
    else:
        print("Buy a ticket first.")
else:
    print("Adults only.")
```

The same can often be simplified – deep nesting is hard to read:

```python run
age = 20
has_ticket = True

if age < 18:
    print("Adults only.")
elif not has_ticket:
    print("Buy a ticket first.")
else:
    print("You may enter.")
```

## Pseudocode

```text
If condition then
    statements1
else
    statements2
End if
```

## Common mistakes

```python
# 1. Missing colon → SyntaxError
if x > 5
    print(x)

# 2. = instead of == → SyntaxError
if x = 5:
    print(x)

# 3. Wrong indentation → IndentationError or a logic error
if x > 5:
print(x)
```

```python run
# 4. Independent ifs instead of elif: several branches can run!
score = 95
if score >= 89:
    print("excellent")
if score >= 76:          # this is true too → also printed
    print("good")
```

## Summary

- `if` – one-way, `if-else` – two-way, `if-elif-else` – multi-way branching.
- Of the `elif` branches only the **first true** one runs; put the stricter condition first.
- Simplify deep nesting with logical operators or reordering.
