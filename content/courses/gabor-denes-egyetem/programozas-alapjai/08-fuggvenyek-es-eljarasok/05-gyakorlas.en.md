---
title: Practice – Functions
summary: Review questions and exercises on writing functions, parameters, scope and simple recursion.
minutes: 30
kind: practice
---

## Review questions

**1. What is the difference between a function and a procedure? What does a "procedure" return in Python?**

<details>
<summary>Answer</summary>

A function computes a value and returns it, a procedure only performs something. In Python a function without `return` returns `None`.

</details>

**2. What are formal and actual parameters?**

<details>
<summary>Answer</summary>

A formal parameter is the name in the definition (`def f(x)` → `x`), an actual parameter (argument) is the value passed in the call (`f(5)` → `5`).

</details>

**3. What does it print?**

```python
x = 5
def f():
    x = 10
    return x
print(f(), x)
```

<details>
<summary>Answer</summary>

`10 5` – the `x` inside the function is local, the global `x` doesn't change.

</details>

**4. What two parts does every recursive function have?**

<details>
<summary>Answer</summary>

A base case (where it stops) and a recursive case (where it calls itself on a smaller subtask).

</details>

## Exercises

### Exercise 1: Temperature conversion

Write two functions: `c_to_f(c)` from Celsius to Fahrenheit (`F = C · 9/5 + 32`), and `f_to_c(f)` the other way. Round the result to one decimal!

```python starter
def c_to_f(c):
    pass

def f_to_c(f):
    pass
```

<details>
<summary>Solution</summary>

```python solution
def c_to_f(c):
    return round(c * 9 / 5 + 32, 1)

def f_to_c(f):
    return round((f - 32) * 5 / 9, 1)
```

</details>

```python test
assert c_to_f(100) == 212.0
assert c_to_f(-40) == -40.0
assert f_to_c(98.6) == 37.0
print("All checks passed!")
```

### Exercise 2: Minimum and maximum at once

Write a function `min_max(numbers)` that returns the smallest and largest element in a tuple using **a single pass** (without the built-in `min`/`max`).

```python starter
def min_max(numbers):
    pass
```

<details>
<summary>Solution</summary>

```python solution
def min_max(numbers):
    smallest = largest = numbers[0]
    for x in numbers[1:]:
        if x < smallest:
            smallest = x
        elif x > largest:
            largest = x
    return smallest, largest
```

</details>

```python test
assert min_max([3, -2, 8, 0]) == (-2, 8)
assert min_max([7]) == (7, 7)
print("All checks passed!")
```

### Exercise 3: Password strength

Write a function `is_strong(password, min_length=8)` returning `True` if the password is at least `min_length` long and contains a lowercase letter, an uppercase letter and a digit.

```python starter
def is_strong(password, min_length=8):
    pass
```

<details>
<summary>Solution</summary>

```python solution
def is_strong(password, min_length=8):
    has_lower = any(c.islower() for c in password)
    has_upper = any(c.isupper() for c in password)
    has_digit = any(c.isdigit() for c in password)
    return len(password) >= min_length and has_lower and has_upper and has_digit
```

</details>

```python test
assert is_strong("Secret2026") is True
assert is_strong("secret2026") is False
assert is_strong("Ab1", min_length=3) is True
assert is_strong("Short1") is False
print("All checks passed!")
```

### Exercise 4: Recursive power

Write a recursive function `power(base, exponent)` (for non-negative integer exponents) without using the `**` operator!

```python starter
def power(base, exponent):
    pass
```

<details>
<summary>Solution</summary>

```python solution
def power(base, exponent):
    if exponent == 0:
        return 1
    return base * power(base, exponent - 1)
```

</details>

```python test
assert power(2, 10) == 1024
assert power(5, 0) == 1
assert power(3, 4) == 81
print("All checks passed!")
```

### Exercise 5: Reversing a string recursively

Write a recursive function `reverse(s)` that reverses a string (without slicing `[::-1]`)! Hint: the reversed string = the reverse of the rest + the first character.

```python starter
def reverse(s):
    pass
```

<details>
<summary>Solution</summary>

```python solution
def reverse(s):
    if len(s) <= 1:
        return s
    return reverse(s[1:]) + s[0]
```

</details>

```python test
assert reverse("Python") == "nohtyP"
assert reverse("") == ""
assert reverse("a") == "a"
print("All checks passed!")
```
