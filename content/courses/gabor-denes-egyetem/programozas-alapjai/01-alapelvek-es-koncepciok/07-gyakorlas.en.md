---
title: Practice – Principles
summary: Review questions and first exercises on this topic.
minutes: 20
kind: practice
---

## Review questions

Try to answer on your own first, and only then open the answer.

**1. What is the difference between an algorithm and a program?**

<details>
<summary>Answer</summary>

An algorithm is a precise description of the steps of a solution, independent of any language. A program implements it in a specific programming language that the computer can execute.

</details>

**2. List at least four properties of a good algorithm.**

<details>
<summary>Answer</summary>

Unambiguous, finite, deterministic, general, and it has input and output.

</details>

**3. What are the three control structures every algorithm can be built from?**

<details>
<summary>Answer</summary>

Sequence, selection (branching) and iteration (loop).

</details>

**4. Which shape marks a decision in a flowchart?**

<details>
<summary>Answer</summary>

The diamond, with a "yes" and a "no" branch leaving it.

</details>

**5. Which data structure would you choose to quickly decide whether a username is already taken?**

<details>
<summary>Answer</summary>

A set (or a dictionary): in these the "is it in there?" question is answered in about one step on average, while a list would have to be scanned element by element.

</details>

## Exercises

### Exercise 1: Business card

Write a program that prints your name, your programme and your semester on three separate lines.

```python starter
# Write the prints here!
```

<details>
<summary>Solution</summary>

```python solution
print("Anna Kiss")
print("Computer Engineering BSc")
print("Semester 1")
```

</details>

### Exercise 2: Rectangle

The sides of a rectangle are `a = 6` and `b = 4`. Compute and print its perimeter and area! Store the results in the variables `perimeter` and `area`.

```python starter
a = 6
b = 4
perimeter = 0   # fix this!
area = 0        # fix this!
print("Perimeter:", perimeter)
print("Area:", area)
```

<details>
<summary>Solution</summary>

```python solution
a = 6
b = 4
perimeter = 2 * (a + b)
area = a * b
print("Perimeter:", perimeter)
print("Area:", area)
```

</details>

```python test
assert perimeter == 20, "The perimeter is 2 * (a + b)"
assert area == 24, "The area is a * b"
print("All checks passed!")
```

### Exercise 3: From pseudocode to Python

Translate the following pseudocode into Python! Store the result in the variable `larger`.

```text
x := 15
y := 9
If x > y then larger := x else larger := y
Print: larger
```

```python starter
x = 15
y = 9
# Write the if statement here!
```

<details>
<summary>Solution</summary>

```python solution
x = 15
y = 9
if x > y:
    larger = x
else:
    larger = y
print(larger)
```

</details>

```python test
assert larger == 15
print("All checks passed!")
```

### Exercise 4: Design (on paper)

Break the following task into steps and write it in pseudocode: _"A shop gives a 10% discount on purchases over 10,000. Compute the amount to pay."_

<details>
<summary>A possible solution</summary>

```text
Read: amount
If amount > 10000 then
    to_pay := amount * 0.9
else
    to_pay := amount
End if
Print: to_pay
```

</details>

## Summary exercise: Measurement statistics

This is the summary exercise of the topic – it uses everything so far: designing an algorithm, a loop, a branch and a function.

Write a `statistics(measurements)` function that returns a three-element list from a list of numbers: `[smallest, largest, average]`. **Round the average to two decimals** (`round(x, 2)`). **Don't** use the built-in `min()`, `max()` and `sum()` – compute all three in a single loop! For an empty list the result should be `None`.

```python starter required
def statistics(measurements):
    # 1. Empty list? → None
    # 2. Initial values from the first element
    # 3. A single loop: update smallest, largest, total
    # 4. Return: [smallest, largest, average rounded to two decimals]
    pass


print(statistics([12, 7, 21, 3]))   # [3, 21, 10.75]
```

<details>
<summary>Solution</summary>

```python solution
def statistics(measurements):
    if len(measurements) == 0:
        return None
    smallest = measurements[0]
    largest = measurements[0]
    total = 0
    for x in measurements:
        if x < smallest:
            smallest = x
        if x > largest:
            largest = x
        total += x
    return [smallest, largest, round(total / len(measurements), 2)]


print(statistics([12, 7, 21, 3]))   # [3, 21, 10.75]
```

</details>

```python test
assert statistics([12, 7, 21, 3]) == [3, 21, 10.75], "statistics([12, 7, 21, 3]) → [3, 21, 10.75]"
assert statistics([5]) == [5, 5, 5.0], "With a single measurement all three values are the same."
assert statistics([-1.5, 2, 0]) == [-1.5, 2, 0.17], "It must work with negative and fractional numbers (average: 0.17)."
assert statistics([]) is None, "For an empty list the result is None."
```
