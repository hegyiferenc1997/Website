---
title: Imperative and Declarative Languages
summary: "How to do it" versus "what I want" – comparing the two fundamental styles.
minutes: 12
---

## What you will learn

- what **imperative** and **declarative** programming mean,
- what **program state** and **side effects** are,
- how the two styles appear in Python and SQL.

## Imperative: how?

In **imperative** programming we tell the computer step by step what to do. We keep changing the program's **state** (the values of variables) with statements.

```python run
# Imperative: find the names of people aged 18 or over.
people = [("Anna", 21), ("Bela", 17), ("Csilla", 19)]
adults = []
for name, age in people:
    if age >= 18:
        adults.append(name)   # the state (the list) changes step by step
print(adults)
```

**Procedural** programming is an organised form of the imperative style: the code is arranged into **procedures (functions)** that can be called many times.

## Declarative: what?

In **declarative** programming we describe _what_ we want to get and leave the "how" to the language or system.

```sql
-- SQL: we don't say how to search, only what we want.
SELECT name FROM people WHERE age >= 18;
```

In Python a **list comprehension** is declarative in spirit:

```python run
people = [("Anna", 21), ("Bela", 17), ("Csilla", 19)]
# "The names where the age is at least 18."
adults = [name for name, age in people if age >= 18]
print(adults)
```

## Comparison

| Aspect           | Imperative                                | Declarative                               |
| ---------------- | ----------------------------------------- | ----------------------------------------- |
| what we describe | the steps                                 | the desired result                        |
| state            | variables are modified constantly         | preferably no mutable state               |
| examples         | C, Pascal, Python with loops              | SQL, HTML, Prolog, Python comprehensions  |
| advantage        | full control, easy to follow step by step | shorter, fewer chances for mistakes       |
| disadvantage     | longer, easier to corrupt state           | the "under the hood" workings stay hidden |

## Side effects

A **side effect** is when a statement changes something beyond the value it returns: it prints, modifies a variable, writes a file. Imperative programs are full of side effects; the declarative and functional styles try to minimise them, because side-effect-free code is easier to test and understand.

## Summary

- **Imperative:** we change the state step by step (procedural is its function-based form).
- **Declarative:** we describe the desired result (SQL, HTML, comprehensions).
- Reducing **side effects** leads to more reliable code.

## Lesson exercise: Squares of even numbers – two ways

Write the same thing in two styles! Both functions return the squares of the **even** elements of the list in a new list, in the original order.

- `imperative(numbers)`: start from an empty list and build it with a `for` loop and `append()`;
- `declarative(numbers)`: a single list comprehension (`[... for ... if ...]`).

Neither may modify the original list!

```python starter required
def imperative(numbers):
    result = []
    # loop + condition + append
    return result


def declarative(numbers):
    # return [... for ... in numbers if ...]
    pass
```

<details>
<summary>Solution</summary>

```python solution
def imperative(numbers):
    result = []
    for x in numbers:
        if x % 2 == 0:
            result.append(x * x)
    return result


def declarative(numbers):
    return [x * x for x in numbers if x % 2 == 0]
```

</details>

```python test
data = [1, 2, 3, 4, 5, 6]
assert imperative(data) == [4, 16, 36], "imperative([1, 2, 3, 4, 5, 6]) → [4, 16, 36]"
assert declarative(data) == [4, 16, 36], "declarative([1, 2, 3, 4, 5, 6]) → [4, 16, 36]"
assert data == [1, 2, 3, 4, 5, 6], "The original list must not change."
assert imperative([]) == [] and declarative([]) == [], "An empty list gives an empty list."
assert declarative([-2, 7, 0]) == [4, 0], "Negative even numbers and 0 are even too."
```
