---
title: Functions and Procedures
summary: Why we split programs into subprograms, the difference between functions and procedures, and how to define a function in Python.
minutes: 15
---

## What you will learn

- what a **subprogram** is and why it's useful,
- the difference between a **function** and a **procedure**,
- how to **define** and **call** a function in Python.

## Why subprograms?

A **subprogram** is a named piece of code solving a well-defined task that can be **called** from anywhere in the program. Its advantages:

- **Reuse:** write it once, use it many times (DRY – _Don't Repeat Yourself_).
- **Clarity:** the big task is split into small parts with descriptive names.
- **Testability:** every part can be tried separately.
- **Abstraction:** the caller only needs to know _what_ it does, not _how_.

## Function and procedure

|                    | Function                            | Procedure                                        |
| ------------------ | ----------------------------------- | ------------------------------------------------ |
| what it does       | computes a value and **returns** it | **performs** something (prints, modifies, saves) |
| return value       | yes                                 | no                                               |
| where it is called | in an expression: `y = square(3)`   | as a statement: `greet("Anna")`                  |
| in other languages | Pascal `function`, C `int f()`      | Pascal `procedure`, C `void f()`                 |

In Python every subprogram is made with `def`. A "procedure" is just a function that returns nothing – in fact it still returns a value: `None`.

## Defining and calling a function

```python run
# Definition: def name(parameters):
def square(x):
    return x * x            # return gives back the result

# Call: the name followed by the arguments in parentheses.
result = square(7)
print(result)               # 49
print(square(3) + square(4))   # 25 – usable in an expression
```

## A procedure

```python run
def greet(name):
    print(f"Hi, {name}! Happy studying!")

greet("Anna")
greet("Bela")

answer = greet("Csilla")
print(answer)   # None – the "value" of a procedure
```

## What happens during a call?

1. The program remembers where it was (**return address**).
2. The argument values are bound to the parameters.
3. The function body runs.
4. After `return` (or the end of the body) execution goes back to the call site, and the call is replaced by the returned value.

```python run
def double(x):
    print("  → start of double, x =", x)
    result = 2 * x
    print("  ← end of double, returning:", result)
    return result

print("before")
y = double(5) + 1
print("after, y =", y)
```

## return stops the function

After `return` the function **ends immediately**; lines after it don't run. A function can have several `return` statements:

```python run
def sign(x):
    if x > 0:
        return "positive"
    if x < 0:
        return "negative"
    return "zero"

print(sign(5), sign(-2), sign(0))
```

## Define before use

A function must be **defined before** it is called – otherwise `NameError`. That's why functions usually sit at the top of the file, before the main program.

```python run
def area(a, b):
    return a * b

def perimeter(a, b):
    return 2 * (a + b)

# Main program
print(area(3, 4), perimeter(3, 4))
```

## Summary

- A subprogram is a named, reusable piece of code; it improves clarity and reuse.
- A **function** returns a value (`return`), a **procedure** only performs something (in Python it returns `None`).
- `return` ends the function immediately.
