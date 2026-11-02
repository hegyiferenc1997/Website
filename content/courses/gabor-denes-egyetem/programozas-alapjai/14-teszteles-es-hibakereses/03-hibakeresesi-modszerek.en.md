---
title: Debugging Methods and Tools
summary: Systematic step-by-step debugging: reproducing, printing, logging, a debugger with breakpoints, rubber duck debugging.
minutes: 18
---

## What you will learn

- the steps of **systematic debugging**,
- **print** debugging and **logging**,
- how to use a **debugger** (breakpoints, stepping, watching variables),
- other proven methods: **rubber duck**, **bisection**.

## The steps of debugging

**Debugging** is finding and fixing the cause of a bug. Don't guess – proceed systematically:

1. **Reproduce** the bug: with what input, after which steps does it appear? If you can't repeat it, you can't verify the fix either.
2. **Read** the error message (bottom-up): type, file, line.
3. **Narrow down** the location: in which function, on which line does the data go wrong?
4. **Form a hypothesis** ("I think the index is off by one") and **test it**.
5. **Fix** the bug – its cause, not just the symptom.
6. **Write a test** for it so it never comes back.

## 1. Print debugging

The simplest tool: print intermediate values. The f-string `=` notation prints the expression and its value.

```python run
def above_average(numbers):
    avg = sum(numbers) / len(numbers)
    print(f"DEBUG {avg=}")                   # intermediate value
    result = [x for x in numbers if x > avg]
    print(f"DEBUG {result=}")
    return result

above_average([3, 8, 5, 10])
```

> **Delete** debugging `print` lines after the fix! For messages that stay, use logging.

## 2. Logging

The `logging` module works with levels (`DEBUG`, `INFO`, `WARNING`, `ERROR`, `CRITICAL`), so detailed messages can be switched on and off with one setting, and written to a file.

```python run
import logging
import sys

logging.basicConfig(stream=sys.stdout, level=logging.DEBUG,
                    format="%(levelname)-7s %(funcName)s: %(message)s")

def divide(a, b):
    logging.debug("divide called: a=%s, b=%s", a, b)
    if b == 0:
        logging.error("Attempted division by zero!")
        return None
    return a / b

divide(10, 2)
divide(1, 0)
```

## 3. The debugger

A **debugger** lets you **pause** the program on a given line and go step by step while watching the values of variables.

Key concepts:

| Concept                  | Meaning                                                   |
| ------------------------ | --------------------------------------------------------- |
| **breakpoint**           | the program stops at this line                            |
| **Step Over** (F10)      | executes the current line without entering function calls |
| **Step Into** (F11)      | enters the called function                                |
| **Step Out** (Shift+F11) | finishes the current function and returns to the caller   |
| **Continue** (F5)        | runs until the next breakpoint                            |
| **Watch / Variables**    | the current values of variables                           |
| **Call Stack**           | which function called which                               |

**In VS Code:**

1. Click to the left of a line number – a red dot appears (breakpoint).
2. Press **F5** and choose _Python Debugger_.
3. The program stops at the breakpoint; on the left you see the variables, at the top the stepping buttons.

You can also pause **from code** with the built-in `breakpoint()` call – this starts Python's command-line debugger (`pdb`):

```python
def amount_due(price, quantity, discount):
    total = price * quantity
    breakpoint()           # stops here: p total (print), n (next line), c (continue), q (quit)
    return total * (1 - discount)
```

## 4. Rubber duck debugging

Explain the code **line by line** to someone – even a rubber duck on your desk. While saying out loud what a line _should_ do, you often realise it does something else. Surprisingly effective!

## 5. Bisection

If you don't know where the data goes wrong, **halve** the code: print the value in the middle. If it's still correct there, the bug is in the second half; if it's already wrong, in the first. In a few steps you find the faulty line. The same works in version control: `git bisect` finds which change introduced the bug.

## Common bugs worth checking first

| Symptom                      | Common cause                                 |
| ---------------------------- | -------------------------------------------- |
| one element too many/few     | `range(n)` vs. `range(n + 1)`, `<` vs. `<=`  |
| the function returns `None`  | a missing `return`                           |
| the list changes "by itself" | two names refer to the same list (`b = a`)   |
| the condition is never true  | comparing text with a number (`"5" == 5`)    |
| infinite loop                | the loop variable doesn't change             |
| `UnboundLocalError`          | assigning to a global name inside a function |

## Summary

- Debugging: **reproduce → error message → narrow down → hypothesis → fix → test**.
- Tools: `print(f"{x=}")`, `logging`, the **debugger** (breakpoints, Step Over/Into/Out, variables), `breakpoint()`.
- Methods: rubber duck, bisection (`git bisect`).

## Lesson exercise: Find the bugs in the median

The `median(numbers)` function should return the median of the numbers (the middle element of the sorted sequence; for an even count the average of the two middle ones) – but it has **three bugs**. Use the methods of the lesson: run it with different inputs, print intermediate values (`print`), and think it through step by step!

Things worth trying: an unsorted list, an even-length list, and look at the original list after the call too.

The fixed function must raise `ValueError` for an empty list.

```python starter required
def median(numbers):
    numbers.sort()
    n = len(numbers)
    middle = n // 2
    if n % 2 == 1:
        return numbers[middle]
    return (numbers[middle] + numbers[middle + 1]) / 2


data = [7, 1, 5, 3]
print(median(data), data)   # should be 4.0 [7, 1, 5, 3]
```

<details>
<summary>Solution</summary>

```python solution
def median(numbers):
    if not numbers:
        raise ValueError("An empty list has no median.")
    ordered = sorted(numbers)     # the original list must not change
    n = len(ordered)
    middle = n // 2
    if n % 2 == 1:
        return ordered[middle]
    return (ordered[middle - 1] + ordered[middle]) / 2


data = [7, 1, 5, 3]
print(median(data), data)   # 4.0 [7, 1, 5, 3]
```

</details>

```python test
data = [7, 1, 5, 3]
assert median(data) == 4.0, "The median of [7, 1, 5, 3] is (3 + 5) / 2 = 4.0 – which two elements are in the middle?"
assert data == [7, 1, 5, 3], "The function must not reorder the original list (sorted instead of sort)."
assert median([3, 9, 1]) == 3, "The median of [3, 9, 1] is 3."
assert median([10, 20]) == 15, "The median of [10, 20] is 15."
assert median([4]) == 4, "The median of a one-element list is the element itself."
try:
    median([])
    assert False, "An empty list must raise ValueError (not IndexError)."
except ValueError:
    pass
```
