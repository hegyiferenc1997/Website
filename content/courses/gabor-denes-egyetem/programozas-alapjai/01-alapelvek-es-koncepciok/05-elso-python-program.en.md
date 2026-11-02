---
title: Your First Python Program
summary: Printing, comments, the role of indentation and reading your first error messages.
minutes: 15
---

## What you will learn

- how to print text and numbers with `print()`,
- what **comments** are for,
- why **indentation** matters in Python,
- how to read your first **error message**.

## Printing

```python run
print("Hi!")                        # text in quotes
print(42)                           # a number
print("The answer:", 42)            # several values separated by commas (shown with spaces)
print("one", "two", sep=" | ")      # the separator can be set
print("no line break", end=" ")     # the line ending can be set too
print("on the same line")
```

Text (a string) must be put in quotes: `"like this"` or `'like this'`. Without quotes Python would treat it as a variable name.

## Comments

Everything after a `#` to the end of the line is a **comment**: the computer ignores it, it is for humans. Use it to explain _why_ you do something.

```python run
# This program computes the area of a circle.
radius = 3
area = 3.14159 * radius ** 2   # ** is exponentiation
print(area)
```

## Indentation

Many languages mark what belongs to a block with braces `{ }`. Python does this with **indentation** (4 spaces). Lines after a colon `:` must be indented.

```python run
temperature = 28
if temperature > 25:
    print("It's hot.")           # this line belongs to the if
    print("Drink lots of water!")  # so does this
print("This always runs.")       # this no longer belongs to the if
```

## Your first error message

Making mistakes is completely normal. Python tells you exactly where and what the problem is:

```python
print("Hi)
```

```text
  File "program.py", line 1
    print("Hi)
          ^
SyntaxError: unterminated string literal (detected at line 1)
```

How to read it:

1. **Which line?** – `line 1`
2. **Where in the line?** – the `^` points to it.
3. **What type of error?** – `SyntaxError`, a grammar mistake: the closing quote is missing.

> **Tip:** always read an error message **from the bottom up**: the last line tells you the error type, above it you see where it happened.

## How to run Python code

- **On this site:** soon you will be able to run code marked "runnable example" right in the browser.
- **On your own computer:** install Python from [python.org](https://www.python.org/downloads/), write the code in a `program.py` file, then run it: `python program.py`.
- **Interactive mode (REPL):** type `python` in a terminal and try statements line by line.

Running options are covered in more detail in the **Runtime Environments** topic.

## Summary

- `print()` prints values; text goes in quotes.
- Everything after `#` is a comment.
- In Python **indentation** marks blocks.
- Read error messages bottom-up: type, location, line.

## Lesson exercise: Fix the broken program

The program below has **three bugs** (a missing quotation mark, wrong indentation and a misspelled function name). Fix it so that it runs and prints:

```text
Circle perimeter and area
Radius: 2
Perimeter: 12.56636
Area: 12.56636
```

Tip: run it and read the error message – it tells you which line has the problem.

```python starter required
# Circle perimeter and area
radius = 2
print("Circle perimeter and area)
print("Radius:", radius)
if radius > 0:
print("Perimeter:", 2 * 3.14159 * radius)
    prnt("Area:", 3.14159 * radius ** 2)
```

<details>
<summary>Solution</summary>

```python solution
# Circle perimeter and area
radius = 2
print("Circle perimeter and area")
print("Radius:", radius)
if radius > 0:
    print("Perimeter:", 2 * 3.14159 * radius)
    print("Area:", 3.14159 * radius ** 2)
```

</details>

```python test
lines = output.splitlines()
assert lines[0] == "Circle perimeter and area", "The first line is the title."
assert lines[1] == "Radius: 2", "The second line: Radius: 2"
assert lines[2] == "Perimeter: 12.56636", "The third line: Perimeter: 12.56636"
assert lines[3] == "Area: 12.56636", "The fourth line: Area: 12.56636"
```
