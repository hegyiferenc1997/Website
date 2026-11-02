---
title: Practice – Variables and Expressions
summary: Review questions and exercises with variables, constants, operators and output.
minutes: 25
kind: practice
---

## Review questions

**1. Which are valid variable names: `_score`, `2pcs`, `total_1`, `for`, `avg-value`?**

<details>
<summary>Answer</summary>

Valid: `_score`, `total_1`. Invalid: `2pcs` (starts with a digit), `for` (reserved word), `avg-value` (hyphen).

</details>

**2. What does the program print?**

```python
a = [1, 2]
b = a
b.append(3)
print(a)
```

<details>
<summary>Answer</summary>

`[1, 2, 3]` – `b = a` doesn't copy; both names refer to the same list.

</details>

**3. What is the value of `not 3 > 2 or 5 == 5 and 2 > 4`?**

<details>
<summary>Answer</summary>

`False`. Step by step: `3 > 2` → True, `not True` → False; `5 == 5 and 2 > 4` → True and False → False; finally `False or False` → False.

</details>

**4. After `x = 0`, why doesn't the expression `x != 0 and 10 / x > 1` raise an error?**

<details>
<summary>Answer</summary>

Because of short-circuit evaluation: `x != 0` is false, so the right side of `and` (the division) is never evaluated.

</details>

**5. What is the difference between a literal and a constant?**

<details>
<summary>Answer</summary>

A literal writes a value directly in code (`100`); a constant is a name bound to an unchanging value (`MAX_SCORE = 100`).

</details>

## Exercises

### Exercise 1: Swap

Swap the values of `a` and `b` in a single line!

```python starter
a = "first"
b = "second"
# Write the swap here!
print(a, b)
```

<details>
<summary>Solution</summary>

```python solution
a = "first"
b = "second"
a, b = b, a
print(a, b)
```

</details>

```python test
assert (a, b) == ("second", "first")
print("All checks passed!")
```

### Exercise 2: Leap year

Write a function `is_leap_year(year)` with **a single boolean expression**! A leap year is divisible by 4 but not by 100 – unless it is also divisible by 400.

```python starter
def is_leap_year(year):
    return False   # write the expression here!
```

<details>
<summary>Solution</summary>

```python solution
def is_leap_year(year):
    return (year % 4 == 0 and year % 100 != 0) or year % 400 == 0
```

</details>

```python test
assert is_leap_year(2024) is True
assert is_leap_year(1900) is False
assert is_leap_year(2000) is True
assert is_leap_year(2026) is False
print("All checks passed!")
```

### Exercise 3: Body mass index

Write a function `bmi(weight_kg, height_cm)` returning the body mass index **rounded to one decimal**! Formula: weight / (height in metres)². Use a constant for the centimetre–metre conversion!

```python starter
CM_PER_M = 100

def bmi(weight_kg, height_cm):
    pass
```

<details>
<summary>Solution</summary>

```python solution
CM_PER_M = 100

def bmi(weight_kg, height_cm):
    height_m = height_cm / CM_PER_M
    return round(weight_kg / height_m ** 2, 1)
```

</details>

```python test
assert bmi(70, 175) == 22.9
assert bmi(50, 160) == 19.5
print("All checks passed!")
```

### Exercise 4: Change machine

Write a function `notes(amount)` telling how many 10,000, 1,000 and 100 notes an amount consists of, plus the remainder. Return a four-element tuple: `(ten_thousands, thousands, hundreds, remainder)`. Use `//` and `%`!

```python starter
def notes(amount):
    pass
```

<details>
<summary>Solution</summary>

```python solution
def notes(amount):
    ten_thousands = amount // 10_000
    amount %= 10_000
    thousands = amount // 1_000
    amount %= 1_000
    hundreds = amount // 100
    remainder = amount % 100
    return (ten_thousands, thousands, hundreds, remainder)
```

</details>

```python test
assert notes(23_750) == (2, 3, 7, 50)
assert notes(99) == (0, 0, 0, 99)
assert notes(10_000) == (1, 0, 0, 0)
print("All checks passed!")
```

### Exercise 5: Input and formatting

Write a program that reads a product price and a quantity, then prints the total **formatted to two decimals**: `Total: 1234.50`.

```python starter
price = float(input("Price: "))
quantity = int(input("Quantity: "))
# Write the print here!
```

<details>
<summary>Solution</summary>

```python solution
price = float(input("Price: "))
quantity = int(input("Quantity: "))
print(f"Total: {price * quantity:.2f}")
```

</details>
