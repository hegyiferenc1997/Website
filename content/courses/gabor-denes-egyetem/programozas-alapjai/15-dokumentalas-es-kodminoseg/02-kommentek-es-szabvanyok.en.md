---
title: Comments and Documentation Standards
summary: Good and bad comments, docstrings following PEP 257, Google style, the help() function, README files and other languages' standards.
minutes: 18
---

## What you will learn

- the difference between **good** and **bad** comments,
- how to write a **docstring** following the PEP 257 standard,
- the **Google** and **reST/Sphinx** docstring styles,
- what goes into a **README** file, and how other languages document code.

## Comments

Text after `#` is a **comment**: it's for developers and ignored by the program. A good comment explains the **why**, not the _what_.

```python run
price = 10_000
nights = 3

# BAD – the code already says the same:
total = price * nights   # multiply the price by the nights

# GOOD – explains the non-obvious decision:
# The hotel doesn't charge for the day of departure, so it's not nights + 1.
total = price * nights
print(total)
```

A good comment:

- explains a non-obvious **decision** or **business rule**,
- warns about a **pitfall** ("the list is still unsorted here!"),
- references a **source** (formula, standard, issue),
- marks remaining work with `TODO:`.

A bad comment:

- repeats the code,
- is outdated (the code does something else now),
- is commented-out old code – version control (git) keeps it anyway, so delete it.

## Docstrings

A **docstring** is the text on the first line of a module, class or function (in triple quotes). Python stores it, and `help()` and IDEs display it.

```python run
def gross(net, vat_rate=0.27):
    """Return the price including VAT (gross price)."""
    return net * (1 + vat_rate)

print(gross.__doc__)
help(gross)
```

### PEP 257 – rules for docstrings

- Triple double quotes: `"""..."""`.
- The **first line** is a short imperative or declarative summary ending with a period.
- If more is needed: a **blank line** after the summary, then the details.
- Every public module, class, function and method should have a docstring.

### Google style

One of the most widespread forms of detailed docstrings:

```python run
def credit_average(grades, credits):
    """Compute the credit-weighted grade average.

    Args:
        grades: The course grades (1–5) in a list.
        credits: The courses' credit values, in the same order as the grades.

    Returns:
        The weighted average rounded to two decimals.

    Raises:
        ValueError: If the two lists differ in length or are empty.

    Example:
        >>> credit_average([5, 3], [4, 2])
        4.33
    """
    if len(grades) != len(credits) or not grades:
        raise ValueError("The grade and credit lists are invalid.")
    total = sum(g * c for g, c in zip(grades, credits))
    return round(total / sum(credits), 2)

print(credit_average([5, 3], [4, 2]))
```

### reST / Sphinx style

The **Sphinx** documentation generator (used for Python's own documentation) uses this form:

```python
def credit_average(grades, credits):
    """Compute the credit-weighted grade average.

    :param grades: The course grades (1–5).
    :param credits: The courses' credit values.
    :return: The weighted average.
    :raises ValueError: If the lists differ in length.
    """
```

Tools (Sphinx, pdoc, MkDocs) can **automatically generate a website** from such docstrings.

## Module and class docstrings

```python
"""Student records: storing grades and computing averages.

The module contains the `Student` class and helper functions.
"""


class Student:
    """A student's data and grades.

    Attributes:
        name: The student's full name.
        student_id: Six-character student ID.
    """
```

## README

**README.md** is the project's "business card", the first thing people see (e.g. on GitHub). Typical content:

```text
# Project name
One or two sentences: what the program does and who it's for.

## Installation
pip install -r requirements.txt

## Usage
python main.py data.csv

## Structure
main.py      – the main program
data.py      – reading files
test_*.py    – tests

## Authors, licence
```

## Documentation standards in other languages

| Language                | Format                                    | Tool    |
| ----------------------- | ----------------------------------------- | ------- |
| Java                    | `/** ... */` Javadoc, `@param`, `@return` | javadoc |
| C#                      | `/// <summary>` XML comments              | DocFX   |
| JavaScript / TypeScript | `/** ... */` JSDoc / TSDoc                | TypeDoc |
| C / C++                 | `/** ... */`, `@brief`                    | Doxygen |

```java
/**
 * Computes the average of two numbers.
 * @param a the first number
 * @param b the second number
 * @return the arithmetic mean of the two numbers
 */
public static double average(double a, double b) { return (a + b) / 2; }
```

## Summary

- A good comment explains the **why**; a bad one repeats the code or is outdated.
- A **docstring** (`"""..."""`) documents a function/class/module; `help()` displays it.
- PEP 257: short first line, blank line, details; Google style: `Args`, `Returns`, `Raises`.
- Every project needs a **README**; other languages use Javadoc, XML comments, JSDoc, Doxygen.

## Lesson exercise: Google-style docstring and type hints

Write the `pass_price(age, student)` function that calculates the price of a monthly travel pass:

- for a negative age it raises `ValueError`,
- under 6 and from 65 the pass is **free** (`0`),
- otherwise students (`student=True`) pay `3450`, everyone else `9500` forints.

Standard documentation is part of the task too:

- **type hints**: `age: int`, `student: bool`, return value `int`,
- a **Google-style docstring** with `Args:`, `Returns:` and `Raises:` sections, naming both parameters under `Args:`.

```python starter required
# function
def pass_price(age, student):
    # if
    if age < 6 or age >= 65:
        return 0
    if student:
        return 3450
    return 9500


print(pass_price(20, True))
```

<details>
<summary>Solution</summary>

```python solution
def pass_price(age: int, student: bool) -> int:
    """Calculate the price of a monthly travel pass in forints.

    Args:
        age: The passenger's age in years.
        student: True if the passenger has a valid student card.

    Returns:
        The price of the pass in forints (0 if it is free).

    Raises:
        ValueError: If the age is negative.
    """
    if age < 0:
        raise ValueError("The age cannot be negative.")
    # Travel is free under 6 and from 65
    if age < 6 or age >= 65:
        return 0
    return 3450 if student else 9500


print(pass_price(20, True))
```

</details>

```python test
assert pass_price(20, True) == 3450 and pass_price(20, False) == 9500, "Student: 3450, adult: 9500."
assert pass_price(5, False) == 0 and pass_price(65, False) == 0 and pass_price(80, True) == 0, "Free under 6 and from 65."
assert pass_price(6, False) == 9500 and pass_price(64, True) == 3450, "Watch the boundaries (6 and 64 years)!"
try:
    pass_price(-1, False)
    assert False, "A negative age should raise ValueError."
except ValueError:
    pass
hints = pass_price.__annotations__
assert hints.get("age") is int and hints.get("student") is bool and hints.get("return") is int, "Type hints are missing or wrong (age: int, student: bool, -> int)."
doc = pass_price.__doc__ or ""
for section in ("Args:", "Returns:", "Raises:"):
    assert section in doc, f"The docstring is missing the {section} section."
args = doc.split("Args:")[1].split("Returns:")[0]
assert "age" in args and "student" in args, "Describe both parameters (age, student) in the Args: section."
```
