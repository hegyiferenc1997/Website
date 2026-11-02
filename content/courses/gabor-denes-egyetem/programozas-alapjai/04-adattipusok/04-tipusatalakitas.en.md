---
title: Type Conversions
summary: Automatic (implicit) and manual (explicit) type conversion, truthiness, and turning input text into numbers.
minutes: 15
---

## What you will learn

- what **implicit** and **explicit** type conversion are,
- how to use `int()`, `float()`, `str()` and `bool()`,
- which values count as **true** and **false**,
- how to check the type of a value.

## Implicit (automatic) conversion

In some cases Python converts the type itself, when no information is lost:

```python run
print(3 + 2.5)      # 5.5   – the int automatically becomes a float
print(True + 1)     # 2     – True counts as 1, False as 0
print(7 / 2)        # 3.5   – division gives a float
```

It does **not** convert between text and numbers on its own – on purpose, because it's unclear what you want:

```python
print("Age: " + 20)   # TypeError: can only concatenate str (not "int") to str
```

## Explicit (manual) conversion

| Function | Converts to | Examples |
| --- | --- | --- |
| `int(x)` | integer | `int("42")` → `42`, `int(3.99)` → `3` (truncates!) |
| `float(x)` | float | `float("3.5")` → `3.5`, `float(2)` → `2.0` |
| `str(x)` | string | `str(20)` → `"20"`, `str(3.5)` → `"3.5"` |
| `bool(x)` | boolean | `bool(0)` → `False`, `bool("a")` → `True` |

```python run
age = 20
print("Age: " + str(age))   # correct: converted to text
print(f"Age: {age}")        # even simpler: an f-string

print(int("42") + 8)    # 50
print(int(3.99))        # 3 – it truncates, it doesn't round!
print(round(3.99))      # 4 – if you want rounding
print(int("ff", 16))    # 255 – converting text from base 16
```

## Input is always text!

`input()` **always returns a string**, even if the user typed a number. Convert it before calculating.

```python run
text = input("Enter a number: ")   # e.g. "5"
print(type(text))                  # <class 'str'>
number = int(text)
print(number * 2)                  # 10 (not "55")
```

If the text can't be converted, a `ValueError` occurs:

```python
int("five")   # ValueError: invalid literal for int() with base 10: 'five'
int("3.5")    # ValueError – a float was typed instead of an integer
```

How to handle this is covered in the **Error and Exception Handling** topic.

## Truthiness

Every value can be converted to a boolean. These count as **false**:

- `False`, `None`,
- zero: `0`, `0.0`,
- empty collections: `""`, `[]`, `{}`, `()`, `set()`.

Everything else is **true**.

```python run
for value in [0, 1, -3, "", "0", [], [0], None]:
    print(repr(value), "→", bool(value))
```

That's why we can write:

```python run
name = ""
if not name:
    print("You didn't enter a name.")
```

## Checking the type

```python run
x = 3.5
print(type(x))                  # <class 'float'>
print(type(x) == float)         # True
print(isinstance(x, float))     # True – the recommended way
print(isinstance(x, (int, float)))   # True – any of several types
```

## Summary

- **Implicit** conversion only happens when "safe" (int → float); not between text and numbers.
- **Explicit** conversion: `int()`, `float()`, `str()`, `bool()`. `int()` truncates, it doesn't round!
- `input()` always returns text.
- False values: `False`, `None`, `0`, empty string/collection; everything else is true.
