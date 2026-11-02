---
title: Input and Output
summary: input() and print() in detail – reading numbers, several values on one line, formatted output.
minutes: 12
---

## What you will learn

- how to read data from the user with `input()`,
- how to turn the text you read into a number,
- how to read **several values from one line**,
- how to print nicely formatted results.

## Reading input

`input()` prints the given text (the **prompt**), waits for the user to type something and press Enter, then returns what was typed as a **string**.

```python run
name = input("What's your name? ")
print("Hi,", name)
```

## Reading numbers

Since `input()` always returns text, convert it before calculating:

```python run
a = int(input("First number: "))
b = int(input("Second number: "))
print("Sum:", a + b)

price = float(input("Price: "))
print("With VAT:", price * 1.27)
```

## Several values on one line

If the user types several numbers separated by spaces (e.g. `3 7 12`):

```python run
line = "3 7 12"           # (fixed text instead of input() so it can be tried out)
parts = line.split()      # ['3', '7', '12']
numbers = [int(p) for p in parts]
print(numbers, sum(numbers))

# Shorter, if we know exactly how many values come:
x, y = map(int, "4 9".split())
print(x * y)
```

## Printing in detail

```python run
print("a", "b", "c")                 # a b c
print("a", "b", "c", sep="")         # abc
print("a", "b", "c", sep=", ")       # a, b, c
for i in range(3):
    print(i, end=" ")                # on one line, separated by spaces
print()                              # an empty print = line break
```

## Formatted output – a table

```python run
products = [("bread", 650, 2), ("milk", 420, 3), ("apples (kg)", 599.9, 1.5)]
print(f"{'Product':<12}{'Price':>8}{'Qty':>6}{'Total':>12}")
print("-" * 38)
total = 0
for name, price, qty in products:
    line_total = price * qty
    total += line_total
    print(f"{name:<12}{price:>8.1f}{qty:>6}{line_total:>12.1f}")
print("-" * 38)
print(f"{'To pay:':<26}{total:>12.1f}")
```

The format specifier: `{value:[align][width][.precision][type]}`

| Specifier           | Meaning                                |
| ------------------- | -------------------------------------- |
| `<10`, `>10`, `^10` | left / right / centre in 10 characters |
| `.2f`               | float with 2 decimals                  |
| `05d`               | integer in 5 digits with leading zeros |
| `,`                 | thousands separator                    |
| `.1%`               | percentage with 1 decimal              |

## Summary

- `input(prompt)` returns text; use `int()` or `float()` for calculations.
- Several values from one line: `split()`, then convert (`map(int, …)`).
- `print` can be tuned with `sep` and `end`; formatting is easiest with f-strings.
