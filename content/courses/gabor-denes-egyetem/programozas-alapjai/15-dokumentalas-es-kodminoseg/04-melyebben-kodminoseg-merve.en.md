---
title: Deeper – Measuring Code Quality
summary: Runnable documentation with doctest, computing cyclomatic complexity with a small analyser of our own, transforming a long function step by step (refactoring), and a mini linter that looks for missing docstrings and bad names – with runnable programs and a programming exercise.
minutes: 50
---

## What you will learn in this lesson

- how documentation can be a **test** at the same time (doctest),
- how a function's complexity can be **measured** (cyclomatic complexity),
- how to transform a hard-to-read function **step by step**, without changing how it works,
- how **linters** work – on a mini version of our own.

## 1. Runnable documentation: doctest

In the basic lesson we saw that a good docstring shows an example too. Python's `doctest` module **runs** these examples and compares the result with what's written – so the documentation can't go "out of date" without anyone noticing:

```python run
# Doctest: the examples in the docstring are tests at the same time
import doctest

def gross(net, vat=27):
    """Computes the gross price rounded to whole forints.

    >>> gross(1000)
    1270
    >>> gross(1000, vat=5)
    1050
    >>> gross(0)
    0
    """
    return round(net * (1 + vat / 100))

doctest.run_docstring_examples(gross, {"gross": gross}, verbose=True)
```

All three examples passed. If someone later rewrites the function (e.g. it rounds down), doctest immediately signals that the documentation is no longer true. For more complicated cases a proper unit test is the way, but for simple "this is how to use it" examples doctest is perfect.

## 2. How complicated is a function? Cyclomatic complexity

**Cyclomatic complexity** counts how many independent paths lead through a function: 1 + the number of branches and loops (`if`, `elif`, `for`, `while`, `and`, `or`, `except` …). The bigger it is, the more tests are needed, and the harder it is to understand. We can compute it with the `ast` module too:

```python run
# Computing cyclomatic complexity with the ast module
import ast

def complexity(source):
    tree = ast.parse(source)
    decisions = (ast.If, ast.For, ast.While, ast.ExceptHandler, ast.IfExp, ast.comprehension)
    count = 1
    for node in ast.walk(tree):
        if isinstance(node, decisions):
            count += 1
        elif isinstance(node, ast.BoolOp):                 # every extra and/or is a new path
            count += len(node.values) - 1
    return count

complicated = '''
def shipping(amount, country, member, express):
    if country == "HU":
        if amount > 15000 and not express:
            return 0
        elif express:
            return 2990
        else:
            return 1490
    elif country in ("AT", "SK") or member:
        return 3990 if not express else 6990
    else:
        for _ in range(1):
            return 7990
'''

simple = '''
FEES = {"HU": 1490, "AT": 3990, "SK": 3990}

def shipping(amount, country):
    if country == "HU" and amount > 15000:
        return 0
    return FEES.get(country, 7990)
'''

print("complicated version:", complexity(complicated))
print("simple version:     ", complexity(simple))
```

As a rule of thumb a function between 1 and 10 is manageable, above 10 it's worth splitting. The second version not only has fewer paths, but the fees are in a **table** (a dictionary): adding a new country is one line, not another `elif`. Tools like radon or ruff do this measurement automatically across the whole project.

## 3. Refactoring step by step

**Refactoring** is improving the code's internal structure without changing how it works. The safe method: first we capture the current behaviour in a test, then improve in small steps, and rerun the test after every step:

```python run
# Refactoring: the same behaviour, a more readable structure – the test passes on both
def f(l):                                      # before: cryptic names, magic numbers, all in one
    s = 0
    for x in l:
        if x[1] >= 50:
            s += x[2] * 0.9 if x[2] > 10000 else x[2]
    return round(s)

POINT_THRESHOLD = 50                           # after: meaningful names, constants, small functions
DISCOUNT_LIMIT = 10_000
DISCOUNT = 0.9

def discounted_price(price):
    return price * DISCOUNT if price > DISCOUNT_LIMIT else price

def eligible(customer):
    _, points, _ = customer
    return points >= POINT_THRESHOLD

def eligible_total_cost(customers):
    """The discounted total cost of customers with at least POINT_THRESHOLD points."""
    return round(sum(discounted_price(c[2]) for c in customers if eligible(c)))

data = [("Anna", 72, 12000), ("Ben", 30, 8000), ("Cecily", 50, 9000), ("Dan", 91, 20000)]
print("old:", f(data), "| new:", eligible_total_cost(data))
assert f(data) == eligible_total_cost(data), "refactoring mustn't change the behaviour!"
print("behaviour unchanged ✓")
```

The new version is longer, but **every line speaks for itself**: nobody has to guess what `x[1]` or `0.9` is. If the discount changes to 15% tomorrow, a single constant has to be changed. Most code is read many more times than it's written – that's why readability is the most important quality criterion.

## 4. A mini linter

**Linters** (e.g. pylint, ruff, flake8) examine code without running it, based on the syntax tree, and flag suspicious parts or parts that deviate from the standard. A small version of our own that looks for PEP 8 naming rules and missing docstrings:

```python run
# Mini linter: looking for missing docstrings and non-snake_case function names
import ast
import re

source = '''
def ComputeMean(grades):
    return sum(grades) / len(grades)

def max_value(items):
    """The largest element of the list."""
    return max(items)

def x(a, b):
    return a * b
'''

SNAKE = re.compile(r"^[a-z_][a-z0-9_]*$")

for node in ast.walk(ast.parse(source)):
    if isinstance(node, ast.FunctionDef):
        where = f"line {node.lineno}, {node.name}()"
        if not SNAKE.match(node.name):
            print(f"{where}: the function name isn't snake_case")
        if ast.get_docstring(node) is None:
            print(f"{where}: missing docstring")
        if len(node.name) < 3:
            print(f"{where}: too short, not a meaningful name")
```

Real tools know hundreds of such rules, and flag them in the editor immediately, while typing. In teamwork CI runs them on every change too: this way a style debate is settled not between people, but in a shared settings file.

| Viewpoint      | What does code quality mean to them?                                               |
| -------------- | ---------------------------------------------------------------------------------- |
| **author**     | still understands their own code in six months                                     |
| **teammate**   | a uniform style, meaningful names, docstrings – no need to ask about everything    |
| **maintainer** | small functions, low complexity, tests: safely modifiable                          |
| **management** | poor-quality code is "technical debt": every new feature gets more expensive on it |

## Summary

- doctest runs a docstring's examples as tests, so documentation can't go stale unnoticed.
- Cyclomatic complexity measures the number of paths; above 10 it's worth splitting the function.
- Refactoring improves structure while keeping the behaviour – first a test, then small steps.
- Linters check style and suspicious parts without running the code, based on the syntax tree.

## Lesson exercise: from camelCase to snake_case

According to PEP 8, Python function names are `snake_case` (lowercase, separated by underscores). Write the `snake_case(name)` function, which converts a camelCase or PascalCase name: put an underscore before every uppercase letter (except at the start of the name), and make the whole thing lowercase! For example `"computeMean"` → `"compute_mean"`, `"BasketTotal"` → `"basket_total"`.

```python starter required
def snake_case(name):
    return name.lower()


print(snake_case("computeMean"))
```

<details>
<summary>Solution</summary>

```python solution
def snake_case(name):
    result = ""
    for i, c in enumerate(name):
        if c.isupper() and i > 0:
            result += "_"
        result += c.lower()
    return result


print(snake_case("computeMean"))
```

</details>

```python test
assert snake_case("computeMean") == "compute_mean", "computeMean → compute_mean"
assert snake_case("BasketTotal") == "basket_total", "no underscore before an uppercase letter at the start"
assert snake_case("findMaxValue") == "find_max_value", "there can be several words"
assert snake_case("x") == "x", "a one-letter name stays unchanged"
```
