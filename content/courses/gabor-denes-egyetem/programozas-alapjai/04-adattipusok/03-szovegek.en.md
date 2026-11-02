---
title: Strings
summary: Indexing, slicing, string operations, useful methods and f-string formatting.
minutes: 20
---

## What you will learn

- how to access the characters of a string by **indexing** and **slicing**,
- the most common **string methods**,
- how to format text with **f-strings**,
- what it means that strings are **immutable**.

## Indexing

A string is a sequence of characters. Each character has an **index** starting from **0**. Negative indices count from the end.

```text
 P   y   t   h   o   n
 0   1   2   3   4   5
-6  -5  -4  -3  -2  -1
```

```python run
word = "Python"
print(word[0])     # P – the first character
print(word[5])     # n – the last
print(word[-1])    # n – the last, counted from the end
print(len(word))   # 6 – the length
```

## Slicing

The form `text[start:end:step]` gives a substring. The **start** is included, the **end is not**.

```python run
word = "Programming"
print(word[0:4])    # Prog
print(word[:4])     # Prog – start can be omitted
print(word[4:])     # ramming – so can the end
print(word[-3:])    # ing – the last 3 characters
print(word[::2])    # Pormig – every second one
print(word[::-1])   # gnimmargorP – reversed
```

## String operations

```python run
print("apple" + "tree")    # appletree – concatenation
print("ha" * 3)            # hahaha – repetition
print("pp" in "apple")     # True – containment
print("a" < "b")           # True – alphabetical comparison (by character code)
```

## Useful methods

| Method | What it does | Example → result |
| --- | --- | --- |
| `upper()`, `lower()` | upper / lower case | `"Apple".upper()` → `"APPLE"` |
| `strip()` | removes spaces from the ends | `"  hi  ".strip()` → `"hi"` |
| `split(sep)` | splits into a list | `"a,b,c".split(",")` → `["a", "b", "c"]` |
| `join(list)` | joins a list | `"-".join(["a", "b"])` → `"a-b"` |
| `replace(a, b)` | replaces | `"apple".replace("p", "b")` → `"abble"` |
| `find(x)` | index of first occurrence (−1 if none) | `"apple".find("l")` → `3` |
| `count(x)` | number of occurrences | `"banana".count("a")` → `3` |
| `startswith(x)`, `endswith(x)` | starts / ends with | `"img.png".endswith(".png")` → `True` |
| `isdigit()` | only digits? | `"2026".isdigit()` → `True` |

```python run
sentence = "  Python is a good first language.  "
clean = sentence.strip()
print(clean)
print(clean.split())          # split into words on whitespace
print(len(clean.split()))     # number of words: 6
print(clean.lower().count("a"))
```

## F-string formatting

An **f-string** (`f"..."`) is the most convenient way to insert values into text. Any expression can go inside the braces.

```python run
name = "Anna"
average = 4.6667
points = 87

print(f"{name}'s average: {average:.2f}")       # rounded to 2 decimals
print(f"Score: {points}/100 ({points / 100:.0%})")   # percentage
print(f"|{name:<10}|{name:>10}|{name:^10}|")   # left, right, centre in 10 characters
print(f"{1234567:,}")                          # thousands separator
print(f"{name=}")                              # for debugging: prints the name and the value
```

## Special characters

| Notation | Meaning |
| --- | --- |
| `\n` | new line |
| `\t` | tab |
| `\\` | a single `\` |
| `\"` | a quote inside the string |

```python run
print("First line\nSecond line")
print("Name:\tAnna")
print("C:\\Users\\anna")
print(r"C:\Users\anna")   # r"..." = raw string, \ is not special
```

## Strings are immutable

An existing string cannot be modified, only a new one created from it.

```python
word = "apple"
word[0] = "A"   # TypeError: 'str' object does not support item assignment
```

```python run
word = "apple"
word = "A" + word[1:]   # create a new string
print(word)             # Apple
```

## Summary

- Indexing starts at 0, negative indices count from the end; in slicing the end is excluded.
- Key methods: `strip`, `split`, `join`, `replace`, `upper`, `lower`, `find`, `count`.
- Use **f-strings** for formatting: `f"{value:.2f}"`.
- Strings are **immutable**.
