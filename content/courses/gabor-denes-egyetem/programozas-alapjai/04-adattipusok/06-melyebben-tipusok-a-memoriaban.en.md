---
title: Deeper – Types in Memory
summary: What happens when a number "overflows", why floating-point addition isn't exact and when to use Decimal or Fraction instead, how many bytes an accented text or an emoji takes, and the surprising traps of type conversion – with runnable programs and a programming exercise.
minutes: 50
---

## What you will learn in this lesson

- what **overflow** is, and why you don't meet it in Python (but you do in other languages),
- why `0.1 + 0.2` gives a "strange" result, and what to use for **money**,
- how the machine stores **text** (Unicode, UTF-8), and why the number of characters isn't always the number of bytes,
- the most common traps of **type conversion**.

## 1. Integers and overflow

In the basic lesson we saw that Python's `int` type can be arbitrarily large. In most languages (C, Java, C#), however, an integer has a **fixed size**, e.g. 32 bits, and if it exceeds the limit, it "wraps around" – that's **overflow**. Let's simulate it:

```python run
# Simulating overflow of a 32-bit signed integer
def int32(x):
    x &= 0xFFFFFFFF                         # only the lowest 32 bits remain
    return x - 2**32 if x >= 2**31 else x   # the top bit is the sign

largest = 2**31 - 1
print("the largest 32-bit integer:", largest)
print("one more in C/Java:        ", int32(largest + 1))
print("one more in Python:        ", largest + 1)
print("2 to the 100th in Python:  ", 2**100)
```

So a counter written in C or Java can suddenly turn **negative**. This isn't a theoretical danger: in 2014 a popular video's view count passed 2,147,483,647, and the counter had to be changed to 64 bits. Python handles this automatically, in exchange it computes more slowly with big numbers.

## 2. Floating-point numbers: why aren't they exact?

A `float` stores fractions in base 2, and 0.1 is an **infinite** fraction in binary (like 1/3 = 0.333… in decimal). The machine can only store an approximation, and the small errors add up:

```python run
# Floating-point inaccuracy, and two exact alternatives: Decimal and Fraction
from decimal import Decimal
from fractions import Fraction
import math

print("0.1 + 0.2       =", 0.1 + 0.2)
print("equal to 0.3?    ", 0.1 + 0.2 == 0.3)
print("with tolerance:  ", math.isclose(0.1 + 0.2, 0.3))

total = 0.0
for _ in range(10):
    total += 0.1                           # add 0.1 ten times
print("10 × 0.1 with float:  ", total)

d = Decimal("0")
for _ in range(10):
    d += Decimal("0.1")                    # base 10, exact
print("10 × 0.1 with Decimal:", d)
print("1/3 · 3 with Fraction:", Fraction(1, 3) * 3)
```

The rule: **don't compare** floating-point numbers with `==`, but with a tolerance (`math.isclose`). For **money** use `Decimal` (or store whole cents), because there even one cent of difference is a bug. For scientific computing, though, `float` is the right choice: it's fast, and a small relative error doesn't matter there.

## 3. Strings: characters and bytes

Every character has a **Unicode code point** (a number), but **bytes** go into files and onto the network. The most widespread encoding is **UTF-8**: English letters take 1 byte, accented letters 2, an emoji 4:

```python run
# Number of characters and number of bytes in UTF-8
for text in ["apple", "árvíztűrő", "🙂", "Árvíztűrő 🙂"]:
    data = text.encode("utf-8")
    print(f"{text!r:16} {len(text):>2} characters, {len(data):>2} bytes")

print("code point of 'ő':", ord("ő"), "→ back:", chr(337))
print("its UTF-8 bytes:  ", "ő".encode("utf-8"))

# read with the wrong encoding it turns into garbage
print("wrong decoding:   ", "árvíztűrő".encode("utf-8").decode("latin-1"))
```

If a database field is "at most 10 bytes", then 10 accented letters won't fit! Garbled text (e.g. `Ã¡` instead of `á`) always means someone read the text back with a different encoding than it was written with. That's why you should always specify it when opening a file: `open(..., encoding="utf-8")`.

## 4. Type conversion: the traps

Conversion (`int()`, `float()`, `str()`, `bool()`) is mostly straightforward, but there are a few surprises almost everyone runs into once:

```python run
# The surprises of type conversion
print("int('42')        =", int("42"))
print("int(3.99)        =", int(3.99), " ← truncates, doesn't round")
print("round(2.5)       =", round(2.5), " ← rounds to even (banker's rounding)")
print("round(3.5)       =", round(3.5))
print("bool('False')    =", bool("False"), " ← every non-empty string is true")
print("bool('')         =", bool(""))
print("'3' + '4'        =", "3" + "4", " ← string concatenation, not addition")
print("int('3') + int('4') =", int("3") + int("4"))
try:
    int("3.5")
except ValueError as e:
    print("int('3.5') raises an error:", e)
```

`round` rounds "to even" so that when rounding many numbers, the errors cancel out (it's used in statistics and finance too). If you need the school-style "round half up", `Decimal`'s `ROUND_HALF_UP` mode helps. The `bool("False")` trap typically appears when a setting arrives as text from a file or a form.

| Viewpoint      | What do they watch for with types?                                                 |
| -------------- | ---------------------------------------------------------------------------------- |
| **programmer** | choosing the right type: Decimal for money, float for measurements, int for counts |
| **user**       | correct totals and readable accents – garbled text destroys trust                  |
| **database**   | field sizes in bytes, encoding, precision (e.g. `NUMERIC(10, 2)`)                  |
| **security**   | overflow and bad conversion are classic attack surfaces in other languages         |

## Summary

- Fixed-size integers can overflow; Python's `int` is arbitrarily large.
- `float` is an approximation: compare with a tolerance, use Decimal or whole cents for money.
- In UTF-8 a character is 1–4 bytes; always specify the encoding for files.
- `int()` truncates, `round()` rounds to even, `bool()` is true for every non-empty string.

## Lesson exercise: a total exact to the cent

Write the `total_in_cents(prices)` function, which adds up prices of the form `"12.34"` (a list of strings) **without floating-point numbers**, and returns the total in whole cents (hundredths)! A price may be a number without a decimal point (`"5"`), and may have only one decimal digit (`"5.5"` = 550 cents). Hint: split the string at the point into two parts (`split(".")`), and pad the fractional part to two digits (`ljust(2, "0")`).

```python starter required
def total_in_cents(prices):
    total = 0
    for price in prices:
        pass  # split into whole and fractional part, and add it in cents
    return total


print(total_in_cents(["19.99", "0.01"]))
```

<details>
<summary>Solution</summary>

```python solution
def total_in_cents(prices):
    total = 0
    for price in prices:
        if "." in price:
            whole, frac = price.split(".")
        else:
            whole, frac = price, "0"
        total += int(whole) * 100 + int(frac.ljust(2, "0"))
    return total


print(total_in_cents(["19.99", "0.01"]))
```

</details>

```python test
assert total_in_cents(["19.99", "0.01"]) == 2000, "19.99 + 0.01 = 20.00 → 2000 cents"
assert total_in_cents(["5", "5.5"]) == 1050, "5 + 5.5 = 10.50 → 1050 cents"
assert total_in_cents(["0.10", "0.10", "0.10"]) == 30, "3 × 0.10 → 30 cents"
assert total_in_cents([]) == 0, "0 for an empty list"
```
