---
title: What Is an Algorithm?
summary: Properties of an algorithm, describing it with pseudocode and flowcharts, the three control structures.
minutes: 15
---

## What you will learn

- what an **algorithm** is and what properties it has,
- how to describe it with **pseudocode** and a **flowchart**,
- what the three basic **control structures** are.

## Definition

An **algorithm** is a description of how to solve a task in a **finite number of unambiguous steps**. A recipe, furniture assembly instructions or GPS route planning are all algorithms.

A good algorithm is:

- **finite**: it ends at some point,
- **unambiguous**: every step is precisely defined,
- has **input** and **output**,
- **effective**: every step can actually be carried out,
- **general**: it works for a whole class of problems, not just one case.

## Describing with pseudocode

**Pseudocode** is a free-form description similar to a programming language. For example, finding the largest element of a list:

```text
largest(list):
    max ← first element of list
    for every element x in list:
        if x > max then max ← x
    return max
```

## Describing with a flowchart

A **flowchart** shows the same as a drawing: oval = start/stop, rectangle = operation, diamond = decision, parallelogram = input or output.

```text
   ( START )
       │
  /  list  /           ← input
       │
 [ max ← first item ]
       │
  ◇ more items? ──no──► / max / ──► ( STOP )
       │ yes
  ◇ x > max? ──no───┐
       │ yes        │
 [ max ← x ]        │
       └────────────┴──► back to “more items?”
```

## The three control structures

Every algorithm can be built from three kinds of structures (Böhm–Jacopini theorem):

| Structure     | Meaning                         | Example                            |
| ------------- | ------------------------------- | ---------------------------------- |
| **sequence**  | steps one after another         | “read, add, print”                 |
| **selection** | a step depending on a condition | “if it rains, take an umbrella”    |
| **iteration** | repeat while a condition holds  | “while there are items, check one” |

```python run
# Finding the largest element: sequence, loop and selection together
items = [7, 3, 12, 5]
largest = items[0]
for x in items:
    if x > largest:
        largest = x
print(largest)
```

## Summary

- Algorithm = a finite, unambiguous sequence of steps solving a class of problems.
- It can be described in words, pseudocode, a flowchart or program code.
- Its building blocks: sequence, selection, iteration.

## Exercise

```quiz required
? Which is NOT an expected property of an algorithm?
- finite
- unambiguous
+ as long as possible
- effective
! Length is not a requirement, finiteness is.

? Which shape marks a **decision** in a flowchart?
- oval
- rectangle
+ diamond
- parallelogram
! A yes and a no branch leave the diamond.

? Which control structure describes repetition?
= iteration
= loop
= cycle
! Sequence, selection, iteration.

? What does the lesson's `largest` algorithm return for the list `[4, 9, 2, 9, 1]`?
= 9
! 9 is the largest element.
```
