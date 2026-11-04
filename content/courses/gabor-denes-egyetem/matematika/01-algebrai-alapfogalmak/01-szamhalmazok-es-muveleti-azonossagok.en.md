---
title: Number Sets and the Laws of Operations
summary: Natural numbers, integers, rational and real numbers, and the laws of the basic operations.
minutes: 15
---

## What you will learn

- what the **number sets** are ($\mathbb{N}$, $\mathbb{Z}$, $\mathbb{Q}$, $\mathbb{R}$) and how they differ,
- the **laws** of the basic operations (commutativity, associativity, distributivity).

## Number sets

- **Natural numbers:** $\mathbb{N} = \{0, 1, 2, 3, \dots\}$ (by Hungarian convention $0$ is included).
- **Integers:** $\mathbb{Z} = \{\dots, -2, -1, 0, 1, 2, \dots\}$.
- **Rational numbers:** fractions, $\mathbb{Q} = \left\{ \frac{p}{q} : p, q \in \mathbb{Z},\ q \neq 0 \right\}$. Their decimal form is finite or **repeating** (e.g. $\frac{1}{3} = 0.333\ldots$).
- **Irrational numbers:** cannot be written as a ratio of two integers; their decimal form is infinite and non-repeating, e.g. $\sqrt{2}$, $\pi$, $e$.
- **Real numbers:** $\mathbb{R}$ = rational and irrational numbers together, every point of the number line.

$$
\mathbb{N} \subset \mathbb{Z} \subset \mathbb{Q} \subset \mathbb{R}
$$

Why does this matter for a computer engineer? A programming language's `int` type stores a **finite** part of the integers, and `float` only **approximates** the reals: on a computer `0.1 + 0.2` is not exactly `0.3`.

```python run
# Floating-point numbers only approximate the real numbers.
print(0.1 + 0.2)          # not exactly 0.3
print(0.1 + 0.2 == 0.3)   # False
# Fractions can be computed exactly with the fractions module (rational numbers).
from fractions import Fraction
print(Fraction(1, 10) + Fraction(2, 10))   # 3/10
```

## Laws of operations

For all real numbers $a, b, c$:

| Law                   | Addition                    | Multiplication                           |
| --------------------- | --------------------------- | ---------------------------------------- |
| commutativity         | $a + b = b + a$             | $ab = ba$                                |
| associativity         | $(a + b) + c = a + (b + c)$ | $(ab)c = a(bc)$                          |
| identity element      | $a + 0 = a$                 | $a \cdot 1 = a$                          |
| opposite / reciprocal | $a + (-a) = 0$              | $a \cdot \frac{1}{a} = 1$, if $a \neq 0$ |

The two are linked by **distributivity**: $a(b + c) = ab + ac$. Expanding brackets and factoring out are based on it.

**Order of operations:** brackets → powers → multiplication, division (left to right) → addition, subtraction (left to right). For example $2 + 3 \cdot 4^2 = 2 + 3 \cdot 16 = 50$.

## Summary

- $\mathbb{N} \subset \mathbb{Z} \subset \mathbb{Q} \subset \mathbb{R}$; irrational numbers (e.g. $\sqrt 2$, $\pi$) are not fractions.
- Basic laws: commutativity, associativity, distributivity; order: brackets, powers, multiplication/division, addition/subtraction.

## Lesson exercise

```quiz required
? Which number is **irrational**?
- $0.25$
- $\frac{22}{7}$
+ $\sqrt{3}$
- $-4$
! An irrational number cannot be written as a ratio of two integers.

? What is $2 + 3 \cdot 4^2$?
= 50
! Power first, then multiplication, then addition.

? Which identity is distributivity?
- $a + b = b + a$
+ $a(b + c) = ab + ac$
- $(ab)c = a(bc)$
- $a + 0 = a$
```
