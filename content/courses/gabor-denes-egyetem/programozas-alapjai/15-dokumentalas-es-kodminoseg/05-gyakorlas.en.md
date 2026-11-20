---
title: Practice – Documentation and Code Quality
summary: Review questions, writing docstrings and refactoring low-quality code.
minutes: 50
kind: practice
---

## Review questions

**1. What is the difference between a comment and a docstring?**

<details>
<summary>Answer</summary>

A comment (`#`) is for the developer reading the code and is discarded by the program. A docstring (`"""..."""`) is the first line of a function/class/module; Python stores it (`__doc__`), and `help()` and IDEs display it – it's the API documentation.

</details>

**2. What's wrong with this comment? `x = x + 1  # increase x by one`**

<details>
<summary>Answer</summary>

It just repeats what the code already says – noise. A good comment explains the why.

</details>

**3. What do DRY and KISS mean?**

<details>
<summary>Answer</summary>

DRY (Don't Repeat Yourself): don't repeat code, extract it into a function. KISS (Keep It Simple, Stupid): choose the simplest working solution.

</details>

**4. According to PEP 8, how do you name a class, a constant and a function?**

<details>
<summary>Answer</summary>

Class: `PascalCase` (`BankAccount`), constant: `UPPER_CASE` (`MAX_SCORE`), function: `snake_case` (`compute_average`).

</details>

**5. What is refactoring, and what makes it safe?**

<details>
<summary>Answer</summary>

Improving the structure of code without changing its behaviour. It's safe when there are tests confirming the behaviour didn't change.

</details>

## Exercises

### Exercise 1: Docstring

Write a **Google-style** docstring for the function (short summary, `Args`, `Returns`, `Raises`)!

```python starter
def compound_interest(principal, rate, years):
    if principal < 0 or years < 0:
        raise ValueError("Principal and years cannot be negative.")
    return round(principal * (1 + rate) ** years, 2)
```

<details>
<summary>Solution</summary>

```python solution
def compound_interest(principal, rate, years):
    """Compute the value of an investment with compound interest.

    Args:
        principal: The starting amount.
        rate: The annual interest rate as a decimal (e.g. 0.05 = 5%).
        years: The length of the investment in years.

    Returns:
        The value at the end of the term, rounded to two decimals.

    Raises:
        ValueError: If the principal or the number of years is negative.
    """
    if principal < 0 or years < 0:
        raise ValueError("Principal and years cannot be negative.")
    return round(principal * (1 + rate) ** years, 2)
```

</details>

```python test
doc = compound_interest.__doc__ or ""
assert doc.strip(), "The docstring is missing"
for keyword in ["Args:", "Returns:", "Raises:"]:
    assert keyword in doc, f"Missing: {keyword}"
assert compound_interest(100_000, 0.05, 2) == 110250.0
print("All checks passed!")
```

### Exercise 2: Refactoring – descriptive names and DRY

The code below works but is unreadable. Refactor it: create a function `rectangle_info(width, height)` returning an `(area, perimeter)` tuple!

```python starter
a = 3; b = 4
print(a*b, 2*(a+b))
c = 5; d = 2
print(c*d, 2*(c+d))
```

<details>
<summary>Solution</summary>

```python solution
def rectangle_info(width, height):
    """Return the area and perimeter of a rectangle."""
    area = width * height
    perimeter = 2 * (width + height)
    return area, perimeter

for width, height in [(3, 4), (5, 2)]:
    print(*rectangle_info(width, height))
```

</details>

```python test
assert rectangle_info(3, 4) == (12, 14)
assert rectangle_info(5, 2) == (10, 14)
print("All checks passed!")
```

### Exercise 3: Simplify (KISS)

Simplify the function into a single `return` line – the behaviour must not change!

```python starter
def is_adult(age):
    if age >= 18:
        result = True
    else:
        result = False
    if result == True:
        return True
    else:
        return False
```

<details>
<summary>Solution</summary>

```python solution
def is_adult(age):
    return age >= 18
```

</details>

```python test
assert is_adult(18) is True
assert is_adult(17) is False
assert is_adult(40) is True
print("All checks passed!")
```

### Exercise 4: Early return

Rewrite the function with early returns (guard clauses), without nested `if`s! The behaviour must not change.

```python starter
def login(username, password_ok, blocked):
    if username:
        if not blocked:
            if password_ok:
                return "Logged in"
            else:
                return "Wrong password"
        else:
            return "Account is blocked"
    else:
        return "Missing username"
```

<details>
<summary>Solution</summary>

```python solution
def login(username, password_ok, blocked):
    if not username:
        return "Missing username"
    if blocked:
        return "Account is blocked"
    if not password_ok:
        return "Wrong password"
    return "Logged in"
```

</details>

```python test
assert login("", True, False) == "Missing username"
assert login("anna", True, True) == "Account is blocked"
assert login("anna", False, False) == "Wrong password"
assert login("anna", True, False) == "Logged in"
print("All checks passed!")
```

## Summary exercise: A documented temperature class

Create a well-documented `Temperature` class that follows every rule of this topic:

- `Temperature(celsius)`: if the value is below absolute zero (`-273.15`), raise `ValueError`; store the value in the `celsius` attribute,
- `fahrenheit()`: the temperature in Fahrenheit (`C * 9 / 5 + 32`),
- `kelvin()`: the temperature in Kelvin (`C + 273.15`),
- `Temperature.from_fahrenheit(f)`: a **class method** (`@classmethod`) that creates an instance from a Fahrenheit value,
- its `repr()` looks like `Temperature(21.5)`.

Documentation: the class and **every** public method (except `__init__`) has a docstring, names follow PEP 8, and there are no "magic numbers" scattered around – put absolute zero into an `ABSOLUTE_ZERO` class-level constant.

```python starter required
class Temperature:
    def __init__(self, c):
        self.celsius = c

    def fahrenheit(self):
        return self.celsius * 9 / 5 + 32


print(Temperature(21.5).fahrenheit())
```

<details>
<summary>Solution</summary>

```python solution
class Temperature:
    """A temperature value, stored in degrees Celsius."""

    ABSOLUTE_ZERO = -273.15

    def __init__(self, celsius):
        if celsius < self.ABSOLUTE_ZERO:
            raise ValueError("Nothing can be colder than absolute zero.")
        self.celsius = celsius

    @classmethod
    def from_fahrenheit(cls, f):
        """Create a new instance from a Fahrenheit value."""
        return cls((f - 32) * 5 / 9)

    def fahrenheit(self):
        """Return the temperature in Fahrenheit."""
        return self.celsius * 9 / 5 + 32

    def kelvin(self):
        """Return the temperature in Kelvin."""
        return self.celsius - self.ABSOLUTE_ZERO

    def __repr__(self):
        return f"Temperature({self.celsius})"


t = Temperature(21.5)
print(t, t.fahrenheit(), t.kelvin())
print(Temperature.from_fahrenheit(212))
```

</details>

```python test
t = Temperature(21.5)
assert t.celsius == 21.5, "Store the value in the celsius attribute."
assert abs(t.fahrenheit() - 70.7) < 1e-9, "21.5 °C = 70.7 °F."
assert abs(Temperature(0).kelvin() - 273.15) < 1e-9, "0 °C = 273.15 K."
assert repr(t) == "Temperature(21.5)", "The repr() looks like Temperature(21.5)."
f = Temperature.from_fahrenheit(212)
assert isinstance(f, Temperature) and abs(f.celsius - 100) < 1e-9, "212 °F = 100 °C, and it must return a Temperature instance."
assert isinstance(Temperature.__dict__.get("from_fahrenheit"), classmethod), "from_fahrenheit must be a @classmethod."
assert getattr(Temperature, "ABSOLUTE_ZERO", None) == -273.15, "You need an ABSOLUTE_ZERO = -273.15 class constant."
Temperature(-273.15)
try:
    Temperature(-300)
    assert False, "Below absolute zero ValueError is required."
except ValueError:
    pass
assert (Temperature.__doc__ or "").strip(), "The class needs a docstring."
for name in ("fahrenheit", "kelvin", "from_fahrenheit"):
    assert (getattr(Temperature, name).__doc__ or "").strip(), f"The {name} method needs a docstring."
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Programming exercises

**1.** **Missing docstrings.** Write the `without_docstring(code)` function, which parses a Python source code (string) with the `ast` module and returns, in alphabetical order, the names of the functions that have no docstring! Hint: `ast.walk(ast.parse(code))`, `isinstance(node, ast.FunctionDef)`, `ast.get_docstring(node)`.

```python starter
import ast

def without_docstring(code):
    return []
```

<details>
<summary>Solution</summary>

```python solution
import ast

def without_docstring(code):
    missing = []
    for node in ast.walk(ast.parse(code)):          # every element of the syntax tree
        if isinstance(node, ast.FunctionDef) and ast.get_docstring(node) is None:
            missing.append(node.name)
    return sorted(missing)
```

</details>

```python test
code = '''
def add(a, b):
    """Sum of two numbers."""
    return a + b

def multiply(a, b):
    return a * b

def average(l):
    # this is just a comment, not a docstring
    return sum(l) / len(l)
'''
assert without_docstring(code) == ["average", "multiply"]
assert without_docstring("x = 1") == []
print("All checks passed!")
```

**2.** **A descriptive name?** Write the `is_descriptive_name(name)` function for a simple naming convention checker! It should return `True` if the name is at least 3 characters long, contains only lowercase letters, digits and underscores, and doesn't start with a digit. Exception: the loop variables `i`, `j`, `k` are also accepted.

```python starter
def is_descriptive_name(name):
    return len(name) >= 3
```

<details>
<summary>Solution</summary>

```python solution
def is_descriptive_name(name):
    if name in ("i", "j", "k"):
        return True                         # usual loop variables
    allowed = set("abcdefghijklmnopqrstuvwxyz0123456789_")
    return len(name) >= 3 and not name[0].isdigit() and set(name) <= allowed
```

</details>

```python test
assert is_descriptive_name("total")
assert is_descriptive_name("max_value2")
assert is_descriptive_name("i")
assert not is_descriptive_name("a")
assert not is_descriptive_name("Total")
assert not is_descriptive_name("2pcs")
assert not is_descriptive_name("max-value")
print("All checks passed!")
```

**3.** **Lines too long.** Write the `long_lines(code, max_length=79)` function, which returns in a list the **line numbers** (counting from 1) of the lines of the source code that are longer than `max_length` characters!

```python starter
def long_lines(code, max_length=79):
    return []
```

<details>
<summary>Solution</summary>

```python solution
def long_lines(code, max_length=79):
    return [number for number, line in enumerate(code.splitlines(), start=1)   # numbering from 1
            if len(line) > max_length]
```

</details>

```python test
code = "x = 1\n" + "y = " + "1" * 80 + "\nz = 3\n" + "w" * 79
assert long_lines(code) == [2]
assert long_lines(code, 5) == [2, 4]
assert long_lines("") == []
print("All checks passed!")
```

### Quick check questions

```quiz
? Which name follows the PEP 8 recommendation for a Python function?
- ComputeTotal
- computeTotal
+ compute_total
- COMPUTE_TOTAL
! snake_case for functions and variables, PascalCase for classes, UPPERCASE for constants.

? What is the essence of the DRY principle?
+ don't repeat yourself: each piece of knowledge should live in one place in the code
- every function should be shorter than 5 lines
- don't use comments
- every variable should be global
! Don't Repeat Yourself: duplicated code is worth extracting into a function.

? What line length does PEP 8 recommend as the default maximum?
= 79
! Many teams allow more (e.g. 88 or 100), but the original PEP 8 recommendation is 79.

? What is a docstring for?
- speeding up the code
+ describing the function's purpose and usage, which `help()` also displays
- hiding errors
- enforcing variable types
! A string written as the first statement of the function.
```
