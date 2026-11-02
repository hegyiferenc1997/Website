---
title: Algorithms and Data Structures
summary: An algorithm is the steps of a solution, a data structure is how data is stored – together they make a program.
minutes: 15
---

## What you will learn

- what an **algorithm** is and what properties a good one has,
- what a **data structure** is and why the choice matters,
- what it means for an algorithm to be "fast" or "slow".

## What is an algorithm?

An **algorithm** is a precise, finite sequence of steps that solves a task. A good algorithm is:

- **unambiguous** – at every step we know exactly what to do,
- **finite** – it ends after a finite number of steps,
- **deterministic** – the same input always gives the same result,
- **general** – it works for every case of the task, not just one,
- **has input and output**.

Example: choosing the larger of two numbers.

```python run
a = 7
b = 12
# Compare the two numbers and print the larger one.
if a > b:
    print(a)
else:
    print(b)
```

## What is a data structure?

A **data structure** is a way of storing and accessing data. The same data can be stored in several ways, and the choice affects how quickly we can work with it.

| Data structure   | Analogy                             | Good for                                    |
| ---------------- | ----------------------------------- | ------------------------------------------- |
| list / array     | a row of numbered drawers           | ordered items, access by index              |
| set              | a bag where every item appears once | fast "is it in there?", removing duplicates |
| dictionary (map) | a phone book: name → number         | looking up a value by key                   |
| stack            | a pile of plates                    | the last item put in comes out first        |
| queue            | a checkout line                     | the first to arrive is served first         |

```python run
# The same kind of data in three structures.
grades = [5, 3, 4, 5]                       # list: order matters, duplicates allowed
distinct_grades = {5, 3, 4}                 # set: each item once
phone_book = {"Anna": "+36 1 234 5678"}     # dictionary: key → value

print(grades[0])               # the first grade
print(4 in distinct_grades)    # is 4 in it?
print(phone_book["Anna"])      # Anna's phone number
```

> **Niklaus Wirth**'s famous book is titled _Algorithms + Data Structures = Programs_. The two ideas are inseparable: a good data structure makes the algorithm simpler and faster.

## Efficiency: how many steps?

There can be several algorithms for the same task, and the number of steps they take matters. When searching an unsorted list, in the worst case we must look at **every element** (n steps for n elements). If the list is sorted, **binary search** halves the search range at each step, so even 1,000,000 elements need only about 20 steps.

This growth rate is described with **big O notation**:

| Notation | Name        | Example                           |
| -------- | ----------- | --------------------------------- |
| O(1)     | constant    | accessing a list element by index |
| O(log n) | logarithmic | binary search in a sorted list    |
| O(n)     | linear      | searching an unsorted list        |
| O(n²)    | quadratic   | bubble sort                       |

```python run
# Linear search: go through the elements and count the steps.
numbers = [8, 3, 9, 1, 7, 4]
target = 7
steps = 0
for number in numbers:
    steps += 1
    if number == target:
        break
print("Found it in", steps, "steps.")
```

## Summary

- An **algorithm** is an unambiguous, finite, general sequence of steps with input and output.
- A **data structure** is how data is stored (list, set, dictionary, stack, queue …).
- A good choice makes the program faster; efficiency is measured with **big O notation**.

## Lesson exercise: Linear search with a step count

Extend the linear search from the lesson: the program should find the `target` number in the list and print **in which step** it found it, exactly like this:

```text
Found it in 5 steps.
```

If the number is not in the list, print `Not in the list.` – checking after the loop whether we found it helps here.

```python starter required
numbers = [8, 3, 9, 1, 7, 4]
target = 7

steps = 0
found = False
for number in numbers:
    steps += 1
    # If number equals target: remember that you found it and leave the loop (break).

# Print the result based on the found variable!
```

<details>
<summary>Solution</summary>

```python solution
numbers = [8, 3, 9, 1, 7, 4]
target = 7

steps = 0
found = False
for number in numbers:
    steps += 1
    if number == target:
        found = True
        break

if found:
    print("Found it in", steps, "steps.")
else:
    print("Not in the list.")
```

</details>

```python test
assert output.strip() == "Found it in 5 steps.", "7 is the fifth element, so print: Found it in 5 steps."
```
