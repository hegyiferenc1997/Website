---
title: Declaring and Using Variables
summary: Assignment, naming rules, multiple assignment and swapping – and what happens in memory.
minutes: 15
---

## What you will learn

- what a **variable** is and how to assign it a value,
- the difference between **declaration** and **assignment** in other languages and in Python,
- the **naming rules** and conventions,
- how a variable works in memory (name → object).

## What is a variable?

A **variable** is a **name** that refers to a value. It's like a labelled box: the label is the name, the content is the value, and the content can **change** while the program runs.

```python run
score = 10          # assignment: the variable score has the value 10
print(score)
score = score + 5   # the new value is computed from the old one
print(score)        # 15
```

> Here `=` is **not equality** but **assignment**: "put the value on the right under the name on the left". `score = score + 5` would be nonsense in maths, but it is perfectly normal in a program.

## Declaration and assignment

In statically typed languages a variable must be **declared**: its name and type must be given before use.

```c
int score;       /* declaration: an int variable is created */
score = 10;      /* assignment */
int age = 20;    /* declaration with an initial value (initialisation) */
```

In Python there is no separate declaration: a variable is **created at its first assignment**. Using a variable that doesn't exist yet raises `NameError`:

```python
print(result)   # NameError: name 'result' is not defined
```

## Naming rules

**Mandatory rules** (otherwise `SyntaxError`):

- may start with a letter or `_`, not a digit,
- may contain only letters, digits and `_` (no spaces or hyphens),
- cannot be a reserved word (`if`, `for`, `class`, `True`, `None` …),
- case matters: `name` and `Name` are two different variables.

| Name                                      | Valid?                                   |
| ----------------------------------------- | ---------------------------------------- |
| `average`, `max_score`, `_internal`, `x2` | ✅                                       |
| `2x`                                      | ❌ starts with a digit                   |
| `max-score`                               | ❌ hyphen (would be read as subtraction) |
| `class`                                   | ❌ reserved word                         |

**Conventions (PEP 8 style guide):**

- variables and functions: `lower_case_with_underscores` (snake_case),
- constants: `UPPER_CASE`,
- classes: `CapitalisedWords` (PascalCase),
- **descriptive names**: `student_count` is better than `sc` or `x`.

## Multiple assignment and swapping

```python run
# Several variables on one line.
a, b, c = 1, 2, 3
print(a, b, c)

# The same value for several variables.
x = y = 0
print(x, y)

# Swapping two variables – in Python without a helper variable.
a, b = b, a
print(a, b)   # 2 1
```

In other languages swapping needs a helper variable:

```python run
a, b = 1, 2
temp = a
a = b
b = temp
print(a, b)   # 2 1
```

## Augmented assignment

```python run
counter = 0
counter += 1    # same as counter = counter + 1
counter *= 10   # counter = counter * 10
counter -= 3    # counter = counter - 3
print(counter)  # 7
```

Python has no `++` and `--` operators (C and Java do).

## What happens in memory?

In Python a variable is a **reference** to an object. The `id()` function shows the object's identity.

```python run
a = [1, 2, 3]
b = a              # b refers to the same list, NOT a copy!
b.append(4)
print(a)           # [1, 2, 3, 4] – a changed too
print(a is b)      # True – the same object

c = a.copy()       # a real copy
c.append(5)
print(a, c)
```

This behaviour is very important for **parameter passing**, which has its own topic.

## Summary

- A variable is a name referring to a value; `=` is assignment.
- Python has no separate declaration; a variable is created at its first assignment.
- Names: start with a letter, `snake_case`, descriptive.
- `b = a` doesn't copy, it just gives the same object another name.
