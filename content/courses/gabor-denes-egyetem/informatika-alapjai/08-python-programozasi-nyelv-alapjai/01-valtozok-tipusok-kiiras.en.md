---
title: Variables, Types, Output
summary: Your first program, variables, basic types (int, float, str, bool), operators, print and input.
minutes: 18
---

## What you will learn

- how to print something (`print`) and read input (`input`),
- what a **variable** is and what the **basic types** are,
- what **operations** exist on numbers and strings.

## Why Python?

**Python** is a simple, readable, interpreted language. Today it is one of the most popular: data analysis, artificial intelligence, web development, automation. On this site you can run code **in the browser**, without installing anything. (To install it on your own machine, use [python.org](https://www.python.org/) or `winget install Python.Python.3.14`.)

## Your first program

```python run
print("Hello, world!")
print("2 + 3 =", 2 + 3)
```

## Variables and types

A **variable** is a named value. `=` is **assignment**: it evaluates the right side and binds it to the name on the left.

```python run
name = "Anna"         # str: text
age = 19              # int: whole number
average = 4.25        # float: decimal number
student = True        # bool: true/false
print(name, age, average, student)
print(type(age), type(average))
```

| Type    | Meaning        | Example             |
| ------- | -------------- | ------------------- |
| `int`   | whole number   | `42`, `-7`          |
| `float` | decimal number | `3.14`, `0.5`       |
| `str`   | text           | `"apple"`, `'Győr'` |
| `bool`  | logical value  | `True`, `False`     |

## Operations

```python run
print(7 + 2, 7 - 2, 7 * 2)   # 9 5 14
print(7 / 2)                 # 3.5  (division, always float)
print(7 // 2, 7 % 2)         # 3 1  (integer division, remainder)
print(2 ** 10)               # 1024 (power)
print("ab" + "cd", "ha" * 3) # abcd hahaha
```

## Reading input

`input()` **always returns text**; `int()` or `float()` turns it into a number.

```python run
number = int(input("Enter a number: "))
print("Twice that:", number * 2)
```

An **f-string** conveniently puts values into text:

```python run
name, age = "Béla", 20
print(f"{name} is {age}, next year {age + 1}.")
```

## Summary

- `print` outputs, `input` reads (text!), `int()`/`float()` convert to numbers.
- Basic types: `int`, `float`, `str`, `bool`.
- Operators: `+ - * /`, `//` integer division, `%` remainder, `**` power.

## Exercise: converting seconds

Write the function `convert(sec)` that turns a time in seconds into a string of the form `"M min S s"`. For example `convert(135)` returns `"2 min 15 s"`. Use the `//` and `%` operators!

```python starter required
def convert(sec):
    minutes = 0   # integer division by 60
    rest = 0      # remainder by 60
    return f"{minutes} min {rest} s"


print(convert(135))
```

<details>
<summary>Solution</summary>

```python solution
def convert(sec):
    minutes = sec // 60
    rest = sec % 60
    return f"{minutes} min {rest} s"


print(convert(135))
```

</details>

```python test
assert convert(135) == "2 min 15 s", "135 s = 2 min 15 s"
assert convert(59) == "0 min 59 s", "59 s = 0 min 59 s"
assert convert(3600) == "60 min 0 s", "3600 s = 60 min 0 s"
```
