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
