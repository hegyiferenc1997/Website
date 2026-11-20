---
title: Deeper – Variables and Expressions from the Inside
summary: A variable is a name pointing to an object – what follows from this for lists and numbers, operator precedence and short-circuit evaluation, integer division with negative numbers, the compound interest expression on an interactive chart, and the formatting tricks of f-strings.
minutes: 50
---

## What you will learn in this lesson

- that in Python a variable is a **name** pointing to an **object** – and why that matters,
- how the machine evaluates a complicated expression (**precedence**, **short-circuit**),
- how integer division and the remainder behave with **negative** numbers,
- how to **format** output so that it's readable, like a table.

## 1. Name and object

In the basic lesson we imagined a variable as a "box" we put a value into. In Python the **label** analogy is more accurate: the object is somewhere in memory, and the variable is a name pointing to it. If two names point to the same **mutable** object, a change through one is visible through the other:

```python run
# A variable is a name pointing to an object
a = [1, 2, 3]
b = a                     # NOT a copy: b points to the same list
b.append(4)
print("a =", a, "| b =", b, "| the same object?", a is b)

c = a.copy()              # a real copy
c.append(5)
print("a =", a, "| c =", c, "| the same object?", a is c)

# a number is immutable: "x += 1" points the name to a NEW object
x = 10
y = x
x += 1
print("x =", x, "| y =", y)
```

A list is **mutable**, so `b.append(4)` changes the "original" list too. Numbers, strings and tuples are **immutable**: `x += 1` doesn't overwrite 10 with 11, it points the name `x` to a new object with value 11 – `y` stays 10. This difference is one of the most common beginner mistakes.

## 2. Precedence and short-circuit

The machine evaluates expressions by **precedence**: exponentiation, sign, multiplication/division, addition/subtraction, comparison, `not`, `and`, `or`. Some surprising cases:

```python run
# Operator precedence and short-circuit evaluation
print("-2 ** 2     =", -2 ** 2, " ← power first, then the sign")
print("(-2) ** 2   =", (-2) ** 2)
print("2 ** 3 ** 2 =", 2 ** 3 ** 2, " ← power binds right to left: 2 ** 9")
print("10 - 4 - 3  =", 10 - 4 - 3, " ← subtraction left to right")

x = 7
print("1 < x < 10  =", 1 < x < 10, " ← chained comparison")

# short-circuit: if the left side of "and" is false, the right side DOESN'T EVEN RUN
for divisor in [5, 0]:
    print(f"divisor = {divisor}:", divisor != 0 and 100 / divisor > 10)

def loud(value):
    print("   (evaluated:", value, ")")
    return value
print("result:", loud(True) or loud(False))
```

**Short-circuit** means: `and` stops at the first false, `or` at the first true. That's why `divisor != 0 and 100 / divisor > 10` doesn't give a division-by-zero error – with a zero divisor the right side doesn't even run. The `loud` example shows it: the right side of `or` was never evaluated. If you're unsure about the order, **add brackets** – it helps the reader too.

## 3. Integer division and remainder with negative numbers

In Python `//` (integer division) always rounds **down** (towards minus infinity), and `%` (remainder) takes the sign of the divisor. We can use this, e.g. to rotate the days of the week:

```python run
# Integer division and remainder, with negative numbers too
for a, b in [(7, 2), (-7, 2), (7, -2)]:
    print(f"{a:>3} // {b:>2} = {a // b:>3}   {a:>3} % {b:>2} = {a % b:>3}   check: {(a // b) * b + a % b}")

# application: the days of the week rotate, backwards too
days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
today = 2                                       # Wednesday
for shift in [1, 5, -3, 100]:
    print(f"today + {shift:>3} days: {days[(today + shift) % 7]}")
```

It's always true that `(a // b) * b + a % b == a`. `% 7` is handy because it gives an index between 0 and 6 even for a negative shift – C and Java, however, give a **negative** remainder in this case, so you have to watch out for it there.

## 4. An expression worth money: compound interest

Expressions matter not only in programs but in decisions too. The compound interest formula is $V = T \cdot (1 + r/100)^n$, where $T$ is the principal, $r$ the annual interest in percent, $n$ the number of years. Move the slider!

```plot
title: Value of 100,000 HUF after n years, at r% annual interest
x: 0, 30
y: 0, 600000
param: r = 5, 0, 12, 0.5
f: 100000*(1 + r/100)^x # compound interest
f: 100000*(1 + r*x/100) # simple interest (only the principal earns interest)
```

```python run
# Compound interest as a table, with f-string formatting
PRINCIPAL = 100_000             # constant: an uppercase name signals we don't change it
RATE = 5                        # % / year
print(f"{'year':>4} | {'simple':>10} | {'compound':>10}")
print("-" * 31)
for year in [0, 5, 10, 20, 30]:
    simple = PRINCIPAL * (1 + RATE * year / 100)
    compound = PRINCIPAL * (1 + RATE / 100) ** year
    print(f"{year:>4} | {simple:>10,.0f} | {compound:>10,.0f}")
```

Over 30 years the compound interest earned (about 332 thousand HUF) is more than twice the simple interest (150 thousand HUF) – the difference is **exponentiation**. In the formatting: `:>10` right-aligns in 10 characters, `,` adds thousands separators, `.0f` rounds to 0 decimals. The uppercase names `PRINCIPAL` and `RATE` signal that they're **constants** – Python doesn't forbid changing them, but by convention nobody overwrites them.

| Viewpoint      | What do they watch for with variables and expressions?                              |
| -------------- | ----------------------------------------------------------------------------------- |
| **programmer** | meaningful names, brackets in doubtful places, constants instead of "magic numbers" |
| **reader**     | understanding an expression at a glance – break up lines that are too long          |
| **user**       | well-formatted, aligned output with thousands separators                            |
| **debugger**   | a shared mutable object (aliasing) is one of the main sources of hidden bugs        |

## Summary

- A variable is a name pointing to an object; a mutable object (a list) can be reached by two names.
- Precedence decides the order of evaluation; `and`/`or` short-circuit.
- `//` rounds down, `%` takes the sign of the divisor; `% n` is great for rotating.
- The f-string format marks (`>10`, `,`, `.2f`) give tabular, readable output.

## Lesson exercise: seconds to hours:minutes:seconds

Write the `format_time(seconds)` function, which turns a non-negative integer number of seconds into a string of the form `"hh:mm:ss"`! Use integer division (`//`) and remainder (`%`), and pad every part to two digits with zeros (`f"{x:02d}"`). If the time is more than 24 hours, the hours may be greater than 23 (e.g. 90,000 seconds = `"25:00:00"`).

```python starter required
def format_time(seconds):
    hours = 0
    minutes = 0
    secs = seconds
    return f"{hours:02d}:{minutes:02d}:{secs:02d}"


print(format_time(3661))
```

<details>
<summary>Solution</summary>

```python solution
def format_time(seconds):
    hours = seconds // 3600
    minutes = seconds % 3600 // 60
    secs = seconds % 60
    return f"{hours:02d}:{minutes:02d}:{secs:02d}"


print(format_time(3661))
```

</details>

```python test
assert format_time(3661) == "01:01:01", "3661 s = 1 hour 1 minute 1 second"
assert format_time(0) == "00:00:00", "0 s"
assert format_time(86399) == "23:59:59", "one day minus 1 s"
assert format_time(90000) == "25:00:00", "more than 24 hours is allowed"
```
