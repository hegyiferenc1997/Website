---
title: Primitive Data Types and Literals
summary: Integer, float, boolean, string and None – what they store, how we write them, how much space they take.
minutes: 15
---

## What you will learn

- what a **data type** is and why we need it,
- Python's **basic types** and how they map to primitive types in other languages,
- what a **literal** is and the forms it takes.

## What is a data type?

In memory every piece of data is a sequence of bits. The **data type** says how to interpret those bits and what operations can be performed. `"5" + "5"` gives `"55"` (string concatenation), `5 + 5` gives `10` (addition) – the type determines the meaning.

A data type defines:

- the **set of values** it can take,
- the **operations** that can be done with it,
- the **storage** (how many bytes, what encoding).

## Python's basic types

| Type       | Meaning                      | Literal examples                               |
| ---------- | ---------------------------- | ---------------------------------------------- |
| `int`      | integer                      | `42`, `-7`, `0`, `1_000_000`, `0b1010`, `0xFF` |
| `float`    | real (floating-point) number | `3.14`, `-0.5`, `2.0`, `1e6`, `2.5e-3`         |
| `bool`     | boolean                      | `True`, `False`                                |
| `str`      | text (string)                | `"apple"`, `'pear'`, `"""multi-line"""`        |
| `NoneType` | "no value"                   | `None`                                         |
| `complex`  | complex number               | `3 + 4j`                                       |

```python run
# type() tells you the type of a value.
print(type(42))        # <class 'int'>
print(type(3.14))      # <class 'float'>
print(type(True))      # <class 'bool'>
print(type("hi"))      # <class 'str'>
print(type(None))      # <class 'NoneType'>
print(type(3 + 4j))    # <class 'complex'>
```

## Literals

A **literal** writes a value directly in the source code. `42` is an integer literal, `"apple"` is a string literal.

```python run
# Integer literals in different bases – all the same number.
print(255, 0b11111111, 0o377, 0xFF)

# Underscores only help readability.
print(1_000_000)

# Scientific notation: 1.5 * 10^3 and 2 * 10^-4
print(1.5e3, 2e-4)

# String literals: single, double and triple quotes.
print('one', "two")
print("""This is a
multi-line string.""")
```

## Primitive types in other languages

In statically typed languages (C, Java, C#) primitive types have a **fixed size**:

| Java / C# type     | Size             | Range                            |
| ------------------ | ---------------- | -------------------------------- |
| `byte`             | 1 byte           | −128 … 127 (in Java)             |
| `int`              | 4 bytes          | about −2.1 billion … 2.1 billion |
| `long`             | 8 bytes          | about ±9.2 · 10¹⁸                |
| `float`            | 4 bytes          | about 7 significant digits       |
| `double`           | 8 bytes          | about 15–16 significant digits   |
| `char`             | 2 bytes          | one Unicode character            |
| `boolean` / `bool` | 1 byte (usually) | true, false                      |

If an `int` exceeds its range, **overflow** happens: 2,147,483,647 + 1 suddenly becomes negative. In Python `int` has **unlimited** size (only memory limits it), so this doesn't happen:

```python run
print(2 ** 100)   # no problem in Python
```

Python's `float` corresponds to `double` in other languages (8 bytes, IEEE 754 standard).

> In Python **every value is an object**, even numbers. Here "primitive type" refers to the simple types holding a single value (int, float, bool, str, None).

## Summary

- A data type defines the set of values, the operations and the storage.
- Python basic types: `int`, `float`, `bool`, `str`, `None`, `complex`.
- A **literal** writes a value directly in code (`42`, `3.14`, `"apple"`, `True`).
- Primitive types in C/Java/C# have fixed sizes and can overflow; Python's `int` is unlimited.
