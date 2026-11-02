---
title: Operators and Expressions
summary: Comparison and logical operators, short-circuit evaluation, precedence and how expressions are evaluated.
minutes: 18
---

## What you will learn

- what an **expression** is and how it is **evaluated**,
- the **comparison** and **logical** operators,
- what **short-circuit evaluation** is,
- operator **precedence**.

## Expression and statement

- An **expression** is a piece of code that **has a value**: `3 + 4`, `x * 2`, `name.upper()`, `a > b`.
- A **statement** is an **action**: `x = 5`, `if …:`, calling `print(…)`.

An expression consists of **operands** (values, variables) and **operators** (`+`, `>`, `and` …).

## Comparison operators

Their result is always a `bool` (`True` or `False`).

| Operator   | Meaning                         | Example                   |
| ---------- | ------------------------------- | ------------------------- |
| `==`       | equal                           | `5 == 5` → `True`         |
| `!=`       | not equal                       | `5 != 3` → `True`         |
| `<`, `>`   | less, greater                   | `3 < 5` → `True`          |
| `<=`, `>=` | less or equal, greater or equal | `5 >= 5` → `True`         |
| `in`       | containment                     | `"a" in "apple"` → `True` |
| `is`       | same object?                    | `x is None`               |

```python run
age = 19
print(age >= 18)            # True
print(18 <= age < 26)       # True – chainable in Python!
print("apple" == "Apple")   # False – case matters
```

> **Common mistake:** `=` is assignment, `==` is comparison. To compare with `None` use `is`: `if x is None:`.

## Logical operators

| Operator | Meaning | True if …            |
| -------- | ------- | -------------------- |
| `and`    | and     | both sides are true  |
| `or`     | or      | at least one is true |
| `not`    | not     | the operand is false |

Truth table:

| A     | B     | A and B | A or B | not A |
| ----- | ----- | ------- | ------ | ----- |
| True  | True  | True    | True   | False |
| True  | False | False   | True   | False |
| False | True  | False   | True   | True  |
| False | False | False   | False  | True  |

```python run
age = 20
has_licence = False
print(age >= 18 and has_licence)     # False – may they drive?
print(age < 14 or age > 65)          # False – discounted ticket?
print(not has_licence)               # True
```

## Short-circuit evaluation

`and` and `or` are evaluated left to right and **stop as soon as the result is decided**:

- `A and B`: if `A` is false, `B` isn't evaluated at all (the result is false anyway),
- `A or B`: if `A` is true, `B` isn't evaluated at all.

This is useful for avoiding errors:

```python run
items = []
# If the list is empty, items[0] would fail – but short-circuiting means it's never evaluated.
if len(items) > 0 and items[0] == 5:
    print("The first element is 5.")
else:
    print("The list is empty, or the first element isn't 5.")

divisor = 0
print(divisor != 0 and 10 / divisor > 1)   # False, no ZeroDivisionError
```

`or` is often used to provide a default value:

```python run
name = ""
shown = name or "Anonymous"
print(shown)   # Anonymous
```

## Precedence

From strongest to weakest (higher rows bind tighter):

| Level | Operators                                    |
| ----- | -------------------------------------------- |
| 1.    | `()` parentheses                             |
| 2.    | `**`                                         |
| 3.    | `-x` (sign)                                  |
| 4.    | `*`, `/`, `//`, `%`                          |
| 5.    | `+`, `-`                                     |
| 6.    | `<`, `<=`, `>`, `>=`, `==`, `!=`, `in`, `is` |
| 7.    | `not`                                        |
| 8.    | `and`                                        |
| 9.    | `or`                                         |

```python run
print(2 + 3 * 4 > 10 and not False)   # (2 + 12 > 10) and True → True
print(True or False and False)        # and binds tighter: True or (False and False) → True
```

> **Tip:** if you're unsure about the order, **add parentheses**. Parenthesised code is more readable too.

## Evaluation step by step

Let's follow the evaluation of `3 + 4 * 2 ** 2 - 1`:

1. `2 ** 2` → `4` (exponentiation) → `3 + 4 * 4 - 1`
2. `4 * 4` → `16` (multiplication) → `3 + 16 - 1`
3. `3 + 16` → `19` (left to right) → `19 - 1`
4. `19 - 1` → `18`

```python run
print(3 + 4 * 2 ** 2 - 1)   # 18
```

## Conditional expression

A two-way decision can also be written as an expression:

```python run
score = 64
result = "passed" if score >= 50 else "failed"
print(result)
```

## Summary

- An **expression has a value**, a statement is an action.
- Comparison: `== != < > <= >=`, chainable; use `is` for `None`.
- Logical: `and`, `or`, `not`; **short-circuit**: the right side is evaluated only if needed.
- When in doubt, **use parentheses**.
