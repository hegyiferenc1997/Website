---
title: Practice – Type Systems
summary: Review questions on type systems, and exercises with type hints.
minutes: 40
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

## Summary exercise: A runtime type checker

The summary exercise of the topic. Python does **not** check type hints at runtime – now you will!

Write a `checked_call(function, *values)` function that:

1. goes through the hinted types of the parameters in order using `function.__annotations__` (skip the `"return"` key),
2. if a value is not of the hinted type (`isinstance`), raises `TypeError` with the parameter's name in the message,
3. if everything is fine, calls the function with the values and returns its result – but first checks that the return value matches the `"return"` hint (if there is one).

It is enough to handle simple types (`int`, `str`, `float`, `bool`, `list`).

```python starter required
def checked_call(function, *values):
    hints = dict(function.__annotations__)
    return_type = hints.pop("return", None)
    # zip(hints.items(), values) → (name, type), value pairs
    pass


def double(x: int) -> int:
    return 2 * x


print(checked_call(double, 21))   # 42
```

<details>
<summary>Solution</summary>

```python solution
def checked_call(function, *values):
    hints = dict(function.__annotations__)
    return_type = hints.pop("return", None)
    for (name, kind), value in zip(hints.items(), values):
        if not isinstance(value, kind):
            raise TypeError(f"Parameter {name} should be {kind.__name__}, not {type(value).__name__}.")
    result = function(*values)
    if return_type is not None and not isinstance(result, return_type):
        raise TypeError(f"The return value should be {return_type.__name__}.")
    return result


def double(x: int) -> int:
    return 2 * x


print(checked_call(double, 21))   # 42
```

</details>

```python test
def double(x: int) -> int:
    return 2 * x

def greet(name: str, times: int) -> str:
    return ("Hi " + name + "! ") * times

def broken(x: int) -> str:
    return x

assert checked_call(double, 21) == 42, "With correct types return the function's result."
assert checked_call(greet, "Anna", 2) == "Hi Anna! Hi Anna! ", "It must work with several parameters."
try:
    checked_call(greet, "Anna", "2")
    assert False, "A parameter of the wrong type must raise TypeError."
except TypeError as e:
    assert "times" in str(e), "The error message should contain the parameter's name (times)."
try:
    checked_call(broken, 5)
    assert False, "A return value of the wrong type must raise TypeError."
except TypeError:
    pass
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Programming exercises

**1.** **Type names.** Write the `type_names(items)` function, which returns the name of the type of each element of a list (e.g. `"int"`, `"str"`)! Use the expression `type(x).__name__`.

```python starter
def type_names(items):
    return ["int" for _ in items]
```

<details>
<summary>Solution</summary>

```python solution
def type_names(items):
    return [type(item).__name__ for item in items]   # the type's name as text
```

</details>

```python test
assert type_names([1, "a", 2.5, True, None]) == ["int", "str", "float", "bool", "NoneType"]
assert type_names([]) == []
assert type_names([[1], (1,), {1: 2}]) == ["list", "tuple", "dict"]
print("All checks passed!")
```

**2.** **Safe conversion.** Write the `safe_int(value, default=0)` function, which tries to convert the value to an integer (`int(value)`), and if that fails (`ValueError` or `TypeError`), returns `default`!

```python starter
def safe_int(value, default=0):
    return int(value)
```

<details>
<summary>Solution</summary>

```python solution
def safe_int(value, default=0):
    try:
        return int(value)
    except (ValueError, TypeError):         # bad text or a non-convertible type
        return default
```

</details>

```python test
assert safe_int("42") == 42
assert safe_int(" -7 ") == -7
assert safe_int("six") == 0
assert safe_int(None, -1) == -1
assert safe_int("3.5", 99) == 99
assert safe_int(3.9) == 3
print("All checks passed!")
```

**3.** **Schema check.** Write the `check_types(data, schema)` function! `schema` is a dictionary that maps field names to types (e.g. `{"name": str, "age": int}`). Return, in alphabetical order, the names of the fields that are missing from the `data` dictionary or have the wrong type! A `bool` should not count as an `int`.

```python starter
def check_types(data, schema):
    return []
```

<details>
<summary>Solution</summary>

```python solution
def check_types(data, schema):
    wrong = []
    for field, kind in schema.items():
        value = data.get(field)
        bad_bool = isinstance(value, bool) and kind is not bool   # bool is a subclass of int
        if field not in data or not isinstance(value, kind) or bad_bool:
            wrong.append(field)
    return sorted(wrong)
```

</details>

```python test
schema = {"name": str, "age": int, "active": bool}
assert check_types({"name": "Anna", "age": 20, "active": True}, schema) == []
assert check_types({"name": "Anna", "age": "20", "active": True}, schema) == ["age"]
assert check_types({"age": True, "active": 1}, schema) == ["active", "age", "name"]
print("All checks passed!")
```

### Quick check questions

```quiz
? What does `type(3 / 1).__name__` return?
- int
+ float
- str
- number
! `/` is always floating-point division, so the result is 3.0.

? What is the value of `int("101", 2)`?
= 5
! The second parameter is the base: 101 in binary is 5.

? What does `isinstance(True, int)` give?
+ True
- False
- raises an error
- None
! In Python `bool` is a subclass of `int`, so it needs separate handling if we want to tell them apart.

? What is the value of `len(str(12345))`?
= 5
! The number converted to text is 5 characters long.
```
