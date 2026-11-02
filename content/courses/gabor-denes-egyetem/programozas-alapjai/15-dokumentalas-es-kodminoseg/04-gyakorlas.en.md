---
title: Practice – Documentation and Code Quality
summary: Review questions, writing docstrings and refactoring low-quality code.
minutes: 25
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
