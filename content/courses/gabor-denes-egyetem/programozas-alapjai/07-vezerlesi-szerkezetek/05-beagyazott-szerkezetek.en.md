---
title: Nested Structures and Control Statements
summary: Loops inside loops, branches inside loops, plus break, continue, pass and the loop's else clause.
minutes: 18
---

## What you will learn

- how **nested** loops and branches work,
- what `break`, `continue` and `pass` do,
- what a loop's `else` clause is for.

## A branch inside a loop

The most common combination: go through the data and decide about each item.

```python run
temperatures = [12, 25, 31, 18, 33]
for t in temperatures:
    if t > 30:
        print(t, "– heatwave")
    elif t > 20:
        print(t, "– warm")
    else:
        print(t, "– cool")
```

## A loop inside a loop

The inner loop **runs completely in every iteration** of the outer loop. If the outer runs 3 times and the inner 4 times, the inner body executes 3 · 4 = 12 times in total.

```python run
# Multiplication table from 1 to 5.
for row in range(1, 6):
    for col in range(1, 6):
        print(f"{row * col:4}", end="")
    print()   # new line after the inner loop
```

```python run
# A triangle of stars.
height = 4
for i in range(1, height + 1):
    print("*" * i)
```

## break – leaving the loop

`break` **immediately ends** the innermost loop it is in.

```python run
numbers = [4, 8, 15, 16, 23, 42]
for number in numbers:
    if number > 10:
        print("The first number greater than 10:", number)
        break
```

## continue – jump to the next iteration

`continue` **skips** the rest of the body and continues with the next iteration.

```python run
# Print only the odd numbers.
for i in range(10):
    if i % 2 == 0:
        continue
    print(i, end=" ")
print()
```

## pass – the "empty" statement

`pass` does nothing. Use it when the syntax requires a statement but there's nothing to write yet (e.g. when sketching).

```python run
for i in range(3):
    pass   # TODO: processing will go here later

def write_later():
    pass

print("The program is syntactically correct.")
```

## The loop's else clause

In Python a loop can have an `else` clause: it runs if the loop ended **without break**. Handy for searching:

```python run
def search(items, target):
    for item in items:
        if item == target:
            print("Found:", item)
            break
    else:
        print("Not in the list:", target)

search([3, 5, 7], 5)
search([3, 5, 7], 4)
```

## break in nested loops

`break` only leaves the **innermost** loop. To leave several levels, use a flag variable or a function (with `return`).

```python run
matrix = [[1, 2, 3], [4, 99, 6], [7, 8, 9]]

def find(matrix, target):
    for i, row in enumerate(matrix):
        for j, value in enumerate(row):
            if value == target:
                return (i, j)   # return leaves both loops
    return None

print(find(matrix, 99))   # (1, 1)
print(find(matrix, 5))    # None
```

## Structured programming and goto

In old languages the `goto` statement could jump anywhere in the program, producing unreadable "spaghetti code". Since **structured programming** (Dijkstra, 1968: _"Go To Statement Considered Harmful"_) we only use sequence, selection and iteration, with `break`/`continue`/`return` as controlled additions. Python has no `goto`.

## Summary

- In nested loops the inner loop runs completely in every outer iteration.
- `break` – leave the innermost loop; `continue` – jump to the next iteration; `pass` – empty statement.
- A loop's `else` runs if there was no `break`.
- Leave several levels with `return` from a function.
