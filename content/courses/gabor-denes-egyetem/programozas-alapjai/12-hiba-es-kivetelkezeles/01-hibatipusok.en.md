---
title: Error Types and Reading Error Messages
summary: Syntax, runtime and logic errors; reading a traceback and the most common Python exceptions.
minutes: 15
---

## What you will learn

- the three main error types: **syntax**, **runtime** and **logic**,
- how to read a **traceback** (error message),
- the most common built-in **exception types**.

## 1. Syntax errors

The code doesn't follow the language's grammar. Python **won't even start** the program.

```python
if score > 50
    print("passed")
# SyntaxError: expected ':'
```

Typical causes: a missing colon, parenthesis or quote, a mistyped keyword, wrong indentation (`IndentationError`).

## 2. Runtime errors (exceptions)

The code is syntactically correct, but something can't be done **while running**: division by zero, a missing file, a wrong type. Python then **raises an exception**, and if nobody handles it, the program stops.

```python
numbers = [1, 2, 3]
print(numbers[5])
# IndexError: list index out of range
```

## 3. Logic errors

The program runs without an error message but gives a **wrong result**. This is the sneakiest kind, because the computer doesn't report it – only testing reveals it.

```python run
# We want the average, but the parentheses are missing.
a, b = 4, 6
average = a + b / 2
print(average)   # 7.0 – wrong, the average is 5.0
```

## Reading a traceback

```python
def average(values):
    return sum(values) / len(values)

def report(data):
    print("Average:", average(data))

report([])
```

```text
Traceback (most recent call last):
  File "program.py", line 7, in <module>
    report([])
  File "program.py", line 5, in report
    print("Average:", average(data))
  File "program.py", line 2, in average
    return sum(values) / len(values)
           ~~~~~~~~~~~^~~~~~~~~~~~~
ZeroDivisionError: division by zero
```

Read it **from the bottom up**:

1. **Last line:** the exception type and reason – `ZeroDivisionError: division by zero`.
2. **Above it:** where it happened – line 2 of `program.py`, in the `average` function.
3. **Further up:** the call chain – `report` called `average`, the main program called `report`. This shows where the bad data (an empty list) came from.

## The most common exceptions

| Exception           | When it occurs              | Example                       |
| ------------------- | --------------------------- | ----------------------------- |
| `SyntaxError`       | grammar error               | `if x > 1` (no `:`)           |
| `IndentationError`  | wrong indentation           | an unindented block           |
| `NameError`         | unknown name                | a mistyped variable name      |
| `TypeError`         | operation on the wrong type | `"5" + 3`                     |
| `ValueError`        | right type, wrong value     | `int("abc")`                  |
| `ZeroDivisionError` | division by zero            | `10 / 0`                      |
| `IndexError`        | index out of range          | `[1, 2][5]`                   |
| `KeyError`          | missing dictionary key      | `{"a": 1}["b"]`               |
| `AttributeError`    | missing attribute/method    | `"text".push("x")`            |
| `FileNotFoundError` | missing file                | `open("missing.txt")`         |
| `RecursionError`    | too deep recursion          | recursion without a base case |

```python run
# Try it: we catch each exception and print its type.
attempts = [
    lambda: int("abc"),
    lambda: [1, 2][5],
    lambda: {"a": 1}["b"],
    lambda: "5" + 3,
    lambda: 10 / 0,
]
for attempt in attempts:
    try:
        attempt()
    except Exception as error:
        print(type(error).__name__, "→", error)
```

## The exception hierarchy

Exceptions are classes organised into an **inheritance hierarchy**. For example `ZeroDivisionError` is a subclass of `ArithmeticError`, which is a subclass of `Exception`. This matters because catching a parent exception also catches its subclasses.

```text
BaseException
 ├── KeyboardInterrupt       (Ctrl+C)
 └── Exception
      ├── ArithmeticError
      │    └── ZeroDivisionError
      ├── LookupError
      │    ├── IndexError
      │    └── KeyError
      ├── OSError
      │    └── FileNotFoundError
      ├── TypeError
      └── ValueError
```

## Summary

- **Syntax** error: won't start; **runtime** error: an exception while running; **logic** error: wrong result without a message.
- Read a traceback **bottom-up**: type → location → call chain.
- Exceptions form a class hierarchy; catching a parent also catches its subclasses.

## Lesson exercise: Three kinds of errors in one program

All three error types appear in the code below. Run it, read the traceback, and fix them one by one:

1. **syntax error** – the program doesn't even start;
2. **runtime error** (exception) – concatenating text and a number;
3. **logic error** – it runs but gives a wrong result (the average is off).

The fixed `average_text(grades)` function should return text like `"The average: 4.0"` (`"No grades"` for an empty list).

```python starter required
def average_text(grades)
    if len(grades) == 0:
        return "No grades"
    average = sum(grades) / (len(grades) - 1)
    return "The average: " + average


print(average_text([5, 4, 3]))   # The average: 4.0
```

<details>
<summary>Solution</summary>

```python solution
def average_text(grades):
    if len(grades) == 0:
        return "No grades"
    average = sum(grades) / len(grades)
    return "The average: " + str(average)


print(average_text([5, 4, 3]))   # The average: 4.0
```

</details>

```python test
assert average_text([5, 4, 3]) == "The average: 4.0", "[5, 4, 3] → \"The average: 4.0\" (logic error: what do you divide by?)"
assert average_text([5]) == "The average: 5.0", "It must work with a single grade (the buggy version divides by zero here)."
assert average_text([]) == "No grades", "An empty list gives: No grades"
```
