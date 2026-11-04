---
title: Conditions and Loops
summary: if–elif–else, comparison and logical operators, for and while loops, range.
minutes: 18
---

## What you will learn

- how a program decides: `if`, `elif`, `else`,
- the **comparison** and **logical** operators,
- how to repeat: `for` and `while` loops, `range`.

## Conditions

In Python **indentation** (4 spaces) marks which lines belong to a block.

```python run
temperature = 24
if temperature >= 30:
    print("heatwave")
elif temperature >= 20:
    print("pleasant")
elif temperature >= 10:
    print("cool")
else:
    print("cold")
```

| Comparison        | Meaning                |
| ----------------- | ---------------------- |
| `==` `!=`         | equal, not equal       |
| `<` `<=` `>` `>=` | less, less or equal, … |

Logical operators: `and`, `or`, `not`.

```python run
year = 2028
leap = (year % 4 == 0 and year % 100 != 0) or year % 400 == 0
print(year, "leap year" if leap else "not a leap year")
```

## for loop

`for` walks through the elements of a sequence. `range(a, b)` gives the numbers `a`, `a+1`, …, `b-1`.

```python run
for i in range(1, 6):
    print(i, i * i)

for letter in "Győr":
    print(letter)
```

## while loop

`while` repeats as long as the condition is true. Make sure it becomes false at some point, or you get an **infinite loop**!

```python run
# How many halvings until 1000 drops below 1?
x = 1000
steps = 0
while x >= 1:
    x = x / 2
    steps += 1
print(steps)
```

`break` leaves the loop immediately, `continue` jumps to the next round.

## Summary

- `if / elif / else`; indentation marks the block.
- Comparison: `== != < <= > >=`; logic: `and`, `or`, `not`.
- `for x in sequence`, `range(a, b)`; `while condition`; `break`, `continue`.

## Exercise: FizzBuzz

Write the function `fizzbuzz(n)` that returns a string: if `n` is divisible by 3 **and** 5, `"FizzBuzz"`; if only by 3, `"Fizz"`; if only by 5, `"Buzz"`; otherwise the number itself as text (`str(n)`).

```python starter required
def fizzbuzz(n):
    # Check divisibility by 15 first!
    return str(n)


for i in range(1, 16):
    print(fizzbuzz(i))
```

<details>
<summary>Solution</summary>

```python solution
def fizzbuzz(n):
    if n % 15 == 0:
        return "FizzBuzz"
    elif n % 3 == 0:
        return "Fizz"
    elif n % 5 == 0:
        return "Buzz"
    return str(n)


for i in range(1, 16):
    print(fizzbuzz(i))
```

</details>

```python test
assert fizzbuzz(3) == "Fizz", "3 → Fizz"
assert fizzbuzz(10) == "Buzz", "10 → Buzz"
assert fizzbuzz(30) == "FizzBuzz", "30 → FizzBuzz"
assert fizzbuzz(7) == "7", "7 → \"7\""
```
