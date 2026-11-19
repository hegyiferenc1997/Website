---
title: Practice – Data Types
summary: Review questions and exercises with numbers, strings and type conversion.
minutes: 25
kind: practice
---

## Review questions

**1. What are the type and value of: a) `7 / 7`, b) `7 // 2`, c) `2 ** 3.0`, d) `"3" * 2`?**

<details>
<summary>Answer</summary>

a) `1.0` (float), b) `3` (int), c) `8.0` (float), d) `"33"` (str).

</details>

**2. Why is `0.1 + 0.2 == 0.3` `False`? How would you compare correctly?**

<details>
<summary>Answer</summary>

0.1 and 0.2 can only be stored approximately in binary, so their sum is 0.30000000000000004. Correctly: `math.isclose(0.1 + 0.2, 0.3)` or rounding.

</details>

**3. What are `int(7.9)` and `round(7.9)`?**

<details>
<summary>Answer</summary>

`int(7.9)` → `7` (truncates), `round(7.9)` → `8`.

</details>

**4. Which are false: `"0"`, `0`, `[]`, `" "`, `None`?**

<details>
<summary>Answer</summary>

`0`, `[]` and `None`. `"0"` and `" "` are non-empty strings, so they are true.

</details>

**5. What is `"informatics"[2:6]`?**

<details>
<summary>Answer</summary>

`"form"` – the characters at indices 2, 3, 4 and 5 (6 is excluded).

</details>

## Exercises

### Exercise 1: Sum of digits

Write a function `digit_sum(n)` returning the sum of the digits of a positive integer using `%` and `//` (without converting to text)!

```python starter
def digit_sum(n):
    total = 0
    # While n > 0: take the last digit (n % 10), add it, then cut it off (n // 10).
    return total
```

<details>
<summary>Solution</summary>

```python solution
def digit_sum(n):
    total = 0
    while n > 0:
        total += n % 10
        n //= 10
    return total
```

</details>

```python test
assert digit_sum(2026) == 10
assert digit_sum(7) == 7
assert digit_sum(99999) == 45
print("All checks passed!")
```

### Exercise 2: Initials

Write a function `initials(full_name)` that builds upper-case initials with dots from the first letters of the words: `"anna kiss"` → `"A.K."`.

```python starter
def initials(full_name):
    pass
```

<details>
<summary>Solution</summary>

```python solution
def initials(full_name):
    return "".join(word[0].upper() + "." for word in full_name.split())
```

</details>

```python test
assert initials("anna kiss") == "A.K."
assert initials("Bela Gabor Nagy") == "B.G.N."
assert initials("  eva   szabo ") == "E.S."
print("All checks passed!")
```

### Exercise 3: Palindrome

Write a function `is_palindrome(text)` deciding whether the text reads the same backwards! Case and spaces should not matter.

```python starter
def is_palindrome(text):
    pass
```

<details>
<summary>Solution</summary>

```python solution
def is_palindrome(text):
    clean = text.replace(" ", "").lower()
    return clean == clean[::-1]
```

</details>

```python test
assert is_palindrome("Never odd or even") is True
assert is_palindrome("level") is True
assert is_palindrome("Python") is False
print("All checks passed!")
```

### Exercise 4: Formatting a duration

Write a function `format_time(seconds)` that turns seconds into a `"hh:mm:ss"` string with two-digit fields: `3725` → `"01:02:05"`. Hint: `f"{x:02d}"`.

```python starter
def format_time(seconds):
    pass
```

<details>
<summary>Solution</summary>

```python solution
def format_time(seconds):
    hours = seconds // 3600
    minutes = seconds % 3600 // 60
    secs = seconds % 60
    return f"{hours:02d}:{minutes:02d}:{secs:02d}"
```

</details>

```python test
assert format_time(3725) == "01:02:05"
assert format_time(59) == "00:00:59"
assert format_time(86399) == "23:59:59"
print("All checks passed!")
```

### Exercise 5: Safe conversion

Write a function `to_number(text)` that converts the text to an integer if it consists only of digits (spaces allowed at the ends), and returns `None` otherwise. Solve it without exception handling (`strip`, `isdigit`)!

```python starter
def to_number(text):
    pass
```

<details>
<summary>Solution</summary>

```python solution
def to_number(text):
    clean = text.strip()
    if clean.isdigit():
        return int(clean)
    return None
```

</details>

```python test
assert to_number(" 42 ") == 42
assert to_number("4.2") is None
assert to_number("abc") is None
assert to_number("") is None
print("All checks passed!")
```

## Summary exercise: Temperature report

The summary exercise of the topic: string processing, type conversion, numbers and formatting together.

Write a `report(line)` function that turns a comma-separated line of temperatures (e.g. `"12.5, -3, 7, 0.5"`) into text like this:

```text
min: -3.0, max: 12.5, avg: 4.25
```

- Every value appears as a float with at least one decimal (printing a `float` does this by itself); **round the average to two decimals**.
- If the line contains no numbers at all, the result is `"no data"`.

```python starter required
def report(line):
    # 1. split, strip, skip empty ones, float()
    # 2. no data?
    # 3. min, max, average (round(..., 2)), then an f-string
    pass


print(report("12.5, -3, 7, 0.5"))
```

<details>
<summary>Solution</summary>

```python solution
def report(line):
    values = [float(p) for p in line.split(",") if p.strip()]
    if not values:
        return "no data"
    avg = round(sum(values) / len(values), 2)
    return f"min: {min(values)}, max: {max(values)}, avg: {avg}"


print(report("12.5, -3, 7, 0.5"))
```

</details>

```python test
assert report("12.5, -3, 7, 0.5") == "min: -3.0, max: 12.5, avg: 4.25", "The example result is not right."
assert report("20") == "min: 20.0, max: 20.0, avg: 20.0", "With a single value all three are the same."
assert report("1, 2, 2") == "min: 1.0, max: 2.0, avg: 1.67", "Round the average to two decimals (1.67)."
assert report("") == "no data", "An empty line gives: no data"
assert report(" , ") == "no data", "Only empty items also give: no data"
```
