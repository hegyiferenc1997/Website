---
title: Practice – Type Systems
summary: Review questions on type systems, and exercises with type hints.
minutes: 15
kind: practice
---

## Review questions

**1. What is the difference between static and dynamic typing?**

<details>
<summary>Answer</summary>

With static typing the types of variables are known and checked at compile time; with dynamic typing the type belongs to the value and is checked at run time.

</details>

**2. What does `"5" + 3` give in JavaScript, and what happens in Python? What does this show?**

<details>
<summary>Answer</summary>

`"53"` in JavaScript, `TypeError` in Python. This is the difference between strong (Python) and weak (JavaScript) typing.

</details>

**3. Place these in the table: Java, Python, JavaScript, C.**

<details>
<summary>Answer</summary>

Java: static + strong; Python: dynamic + strong; JavaScript: dynamic + weak; C: static + (relatively) weak.

</details>

**4. Does Python check type hints at run time?**

<details>
<summary>Answer</summary>

No. Hints are used by external tools (mypy, Pylance) for checking without running.

</details>

## Exercises

### Exercise 1: Type hints

Add type hints to the function: it receives a list of integers and returns the list of even elements.

```python starter
def evens(numbers):
    return [x for x in numbers if x % 2 == 0]
```

<details>
<summary>Solution</summary>

```python solution
def evens(numbers: list[int]) -> list[int]:
    return [x for x in numbers if x % 2 == 0]
```

</details>

```python test
assert evens([1, 2, 3, 4]) == [2, 4]
assert evens.__annotations__ == {"numbers": list[int], "return": list[int]}
print("All checks passed!")
```

### Exercise 2: Your own type check

Since Python doesn't check hints, write a function `safe_sum(a, b)` that raises `TypeError` if either parameter is not an `int` or `float`, and otherwise returns their sum! (`isinstance`, `raise TypeError("...")`)

```python starter
def safe_sum(a, b):
    pass
```

<details>
<summary>Solution</summary>

```python solution
def safe_sum(a, b):
    for x in (a, b):
        if not isinstance(x, (int, float)):
            raise TypeError(f"A number is required, not {type(x).__name__}")
    return a + b
```

</details>

```python test
assert safe_sum(2, 3.5) == 5.5
try:
    safe_sum("2", 3)
    assert False, "It should have raised TypeError"
except TypeError:
    pass
print("All checks passed!")
```

### Exercise 3: What will the type be?

Without running it, think through what type `x` has after each line, then check by running the code!

```python run
x = 10
print(type(x).__name__)
x = x / 2
print(type(x).__name__)
x = str(x) + "!"
print(type(x).__name__)
x = len(x) > 3
print(type(x).__name__)
```

<details>
<summary>Answer</summary>

`int`, `float` (division always gives a float), `str`, `bool`.

</details>
