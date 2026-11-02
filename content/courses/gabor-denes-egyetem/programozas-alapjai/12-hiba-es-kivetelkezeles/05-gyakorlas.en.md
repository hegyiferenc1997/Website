---
title: Practice – Exception Handling
summary: Review questions and exercises on handling, raising and defining exceptions.
minutes: 30
kind: practice
---

## Review questions

**1. Which error type: a) missing colon, b) `int("x")`, c) a wrong average due to a bad formula?**

<details>
<summary>Answer</summary>

a) syntax error, b) runtime error (`ValueError` exception), c) logic error.

</details>

**2. What is the output?**

```python
try:
    print("A")
    x = 1 / 0
    print("B")
except ZeroDivisionError:
    print("C")
else:
    print("D")
finally:
    print("E")
```

<details>
<summary>Answer</summary>

`A`, `C`, `E`. `B` is skipped because an exception happened before it; `else` would only run without an exception; `finally` always runs.

</details>

**3. Why is a bare `except:` bad?**

<details>
<summary>Answer</summary>

It catches every exception, including programming errors (e.g. a `NameError` from a typo) and Ctrl+C, so it hides the real bugs.

</details>

**4. What is the difference between EAFP and LBYL?**

<details>
<summary>Answer</summary>

LBYL: check first, then act. EAFP: try it and handle the exception if it fails. EAFP is more idiomatic in Python.

</details>

**5. When should you not use `assert`?**

<details>
<summary>Answer</summary>

For validating user input, because with `python -O` assert lines are skipped. Use `if` + `raise` for that.

</details>

## Exercises

### Exercise 1: Safe division

Write a function `safe_divide(a, b)` that returns `a / b`, and `None` on division by zero! Solve it with exception handling.

```python starter
def safe_divide(a, b):
    pass
```

<details>
<summary>Solution</summary>

```python solution
def safe_divide(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        return None
```

</details>

```python test
assert safe_divide(10, 4) == 2.5
assert safe_divide(1, 0) is None
print("All checks passed!")
```

### Exercise 2: Filtering numbers

Write a function `numbers(texts)` that returns (as integers) only those strings from the list that can be converted to integers! Skip the rest.

```python starter
def numbers(texts):
    pass
```

<details>
<summary>Solution</summary>

```python solution
def numbers(texts):
    result = []
    for s in texts:
        try:
            result.append(int(s))
        except ValueError:
            pass   # not a number – deliberately skipped
    return result
```

</details>

```python test
assert numbers(["3", "x", "-7", "4.5", " 12 "]) == [3, -7, 12]
assert numbers([]) == []
print("All checks passed!")
```

### Exercise 3: Validating age

Write a function `set_age(age)` that raises `TypeError` if the age isn't an `int`, `ValueError` if it's below 0 or above 150, and otherwise returns the age.

```python starter
def set_age(age):
    pass
```

<details>
<summary>Solution</summary>

```python solution
def set_age(age):
    if not isinstance(age, int):
        raise TypeError("Age must be an integer.")
    if age < 0 or age > 150:
        raise ValueError("Age must be between 0 and 150.")
    return age
```

</details>

```python test
assert set_age(20) == 20
for bad, exc in [("20", TypeError), (-1, ValueError), (151, ValueError)]:
    try:
        set_age(bad)
        assert False, f"{exc.__name__} expected"
    except exc:
        pass
print("All checks passed!")
```

### Exercise 4: Custom exception

Create an `EmptyCartError` exception class (a subclass of `Exception`) and a function `total(cart)` returning the sum of the cart (a list of prices), raising `EmptyCartError` for an empty cart!

```python starter
class EmptyCartError(Exception):
    pass

def total(cart):
    pass
```

<details>
<summary>Solution</summary>

```python solution
class EmptyCartError(Exception):
    pass

def total(cart):
    if not cart:
        raise EmptyCartError("The cart is empty.")
    return sum(cart)
```

</details>

```python test
assert total([100, 250]) == 350
try:
    total([])
    assert False, "EmptyCartError expected"
except EmptyCartError:
    pass
assert issubclass(EmptyCartError, Exception)
print("All checks passed!")
```

### Exercise 5: Reading settings with a default

Write a function `setting(settings, key, default)` that returns the value for the key **as an integer**. If the key is missing **or** the value can't be converted to an integer, return `default`. Use the EAFP style!

```python starter
def setting(settings, key, default):
    pass
```

<details>
<summary>Solution</summary>

```python solution
def setting(settings, key, default):
    try:
        return int(settings[key])
    except (KeyError, ValueError):
        return default
```

</details>

```python test
s = {"port": "8080", "timeout": "lots"}
assert setting(s, "port", 80) == 8080
assert setting(s, "timeout", 30) == 30
assert setting(s, "retry", 3) == 3
print("All checks passed!")
```
