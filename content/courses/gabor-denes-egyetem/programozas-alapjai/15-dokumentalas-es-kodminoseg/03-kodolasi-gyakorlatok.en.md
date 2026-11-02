---
title: Coding Practices for Better Code Quality
summary: PEP 8 style, naming, clean code principles (DRY, KISS, single responsibility), refactoring, linters and formatters.
minutes: 20
---

## What you will learn

- the most important rules of the **PEP 8** style guide,
- **clean code** principles: descriptive names, short functions, **DRY**, **KISS**, single responsibility,
- what **refactoring** is and how to do it safely,
- which **tools** check code quality automatically.

## What is high-quality code?

Good code is **correct**, **readable**, **simple**, **testable** and **easy to change**. Quality isn't a matter of taste: bad code slows development and hides bugs.

## PEP 8 – Python's style guide

| Rule                                        | Example                                   |
| ------------------------------------------- | ----------------------------------------- |
| indentation: 4 spaces (not tabs)            | `····return x`                            |
| line length: at most 79–99 characters       | break long expressions inside parentheses |
| variables, functions: `snake_case`          | `student_count`, `compute_average()`      |
| classes: `PascalCase`                       | `class BankAccount:`                      |
| constants: `UPPER_CASE`                     | `MAX_SCORE = 100`                         |
| spaces around operators                     | `x = a + b`, not `x=a+b`                  |
| no spaces inside parentheses                | `f(x)`, not `f( x )`                      |
| two blank lines between functions / classes |                                           |
| imports at the top of the file, grouped     | standard → third-party → own              |
| use `is` with `None`                        | `if x is None:`                           |

## Descriptive names

```python run
# Bad names:
def calc(a, b):
    c = a * b * 0.27
    return a * b + c

# Good names – the code explains itself:
VAT_RATE = 0.27

def gross_total(unit_price, quantity):
    net = unit_price * quantity
    return net * (1 + VAT_RATE)

print(calc(1000, 3), gross_total(1000, 3))
```

- Function name: a **verb** (`compute_average`, `save_to_file`, `is_valid`).
- Variable name: a **noun** (`students`, `total`).
- Booleans: a question or statement (`has_permission`, `is_empty`).
- Avoid single-letter names – except short loop variables (`i`, `j`) and mathematical formulas (`x`, `y`).

## DRY – Don't Repeat Yourself

If the same code appears several times, it's easy to forget one copy when fixing a bug. Extract it into a function.

```python run
# Repeated code:
anna = [5, 4, 5]
bela = [3, 4, 2]
print("Anna's average:", round(sum(anna) / len(anna), 2))
print("Bela's average:", round(sum(bela) / len(bela), 2))

# DRY:
def average(grades):
    return round(sum(grades) / len(grades), 2)

for name, grades in [("Anna", anna), ("Bela", bela)]:
    print(f"{name}'s average:", average(grades))
```

## KISS – keep it simple

_Keep It Simple, Stupid_: the simplest working solution is the best. "Clever" tricks are hard to read and fix.

```python run
number = 7

# Overcomplicated:
even = True if number % 2 == 0 else False
if even == True:
    print("even")
else:
    print("odd")

# Simple:
print("even" if number % 2 == 0 else "odd")
```

A related principle is **YAGNI** (_You Aren't Gonna Need It_): don't write a feature that "might be needed some day".

## One function – one job

A function should do **one thing** and do it well. If its name would contain "and" (`read_and_compute_and_print`), split it. Short functions are easier to understand, test and reuse.

```python run
def parse(text):
    """Turn space-separated numbers into a list."""
    return [int(x) for x in text.split()]

def statistics(numbers):
    """Return the minimum, the maximum and the average."""
    return min(numbers), max(numbers), sum(numbers) / len(numbers)

def show(stats):
    smallest, largest, avg = stats
    print(f"min: {smallest}, max: {largest}, average: {avg:.2f}")

show(statistics(parse("4 8 15 16 23 42")))
```

## Early return instead of deep nesting

```python run
# Deeply nested:
def shipping_fee_bad(amount, country):
    if amount > 0:
        if country == "HU":
            if amount >= 20_000:
                return 0
            else:
                return 1_490
        else:
            return 4_990
    else:
        raise ValueError("Invalid amount")

# Flat, with early returns (guard clauses):
def shipping_fee(amount, country):
    if amount <= 0:
        raise ValueError("Invalid amount")
    if country != "HU":
        return 4_990
    if amount >= 20_000:
        return 0
    return 1_490

print(shipping_fee_bad(25_000, "HU"), shipping_fee(25_000, "HU"), shipping_fee(5_000, "AT"))
```

## Refactoring

**Refactoring** means improving the structure of code **without changing its behaviour**: renaming, extracting functions, removing duplication, reducing nesting. It can only be done safely when there are **tests** guaranteeing the behaviour didn't change.

**The "Boy Scout rule":** leave the code a little cleaner than you found it.

## Automatic tools

| Tool                     | What it does                                                                          |
| ------------------------ | ------------------------------------------------------------------------------------- |
| **Ruff**, Flake8, Pylint | _linter_: finds style issues and suspicious code (unused variables, unreachable code) |
| **Black**, Ruff format   | _formatter_: automatically brings code into a uniform format                          |
| **mypy**                 | type checking based on type hints                                                     |
| **pytest + coverage**    | tests and coverage                                                                    |

```bash
pip install ruff
ruff check .        # list of errors and style problems
ruff format .       # automatic formatting
```

In VS Code these work as extensions, flagging problems as you type.

## Summary

- Follow **PEP 8**: 4 spaces, `snake_case`, `PascalCase`, `UPPER_CASE`, spaces around operators.
- Principles: **descriptive names**, **DRY**, **KISS**, **YAGNI**, **one function – one job**, early returns.
- **Refactor** only under the protection of tests.
- Use a linter and a formatter (Ruff, Black) – let the machine do the boring work.

## Lesson exercise: Refactoring repeated code (DRY)

Someone wrote a per-category expense summary – the same loop three times, for three hard-coded categories. When a new category appears, the code ignores it.

Rewrite the `category_totals(items)` function following the **DRY** ("don't repeat yourself") principle! `items` is a list of `(category, amount)` pairs. The function returns a dictionary:

- it works for **any** category (no hard-coded category names),
- the keys come in the order of first appearance,
- the totals are rounded to 2 decimals (`round(..., 2)`),
- for an empty list the result is `{}`.

```python starter required
def category_totals(items):
    food = 0
    for category, amount in items:
        if category == "food":
            food += amount
    transport = 0
    for category, amount in items:
        if category == "transport":
            transport += amount
    fun = 0
    for category, amount in items:
        if category == "fun":
            fun += amount
    return {"food": food, "transport": transport, "fun": fun}


print(category_totals([("food", 1200), ("transport", 450), ("food", 800)]))
```

<details>
<summary>Solution</summary>

```python solution
def category_totals(items):
    # A single loop, for any categories
    totals = {}
    for category, amount in items:
        totals[category] = totals.get(category, 0) + amount
    return {k: round(v, 2) for k, v in totals.items()}


print(category_totals([("food", 1200), ("transport", 450), ("food", 800)]))
```

</details>

```python test
r = category_totals([("food", 1200), ("transport", 450), ("food", 800)])
assert r == {"food": 2000, "transport": 450}, "Only the categories that occur should be in the dictionary."
r = category_totals([("rent", 90000), ("books", 4990.5), ("rent", 5000)])
assert r == {"rent": 95000, "books": 4990.5}, "It must work for new, previously unknown categories too."
assert list(category_totals([("b", 1), ("a", 2), ("b", 3)])) == ["b", "a"], "Keys must come in the order of first appearance."
assert category_totals([("x", 0.1), ("x", 0.2)]) == {"x": 0.3}, "Round to 2 decimals."
assert category_totals([]) == {}, "An empty list gives an empty dictionary."
```
