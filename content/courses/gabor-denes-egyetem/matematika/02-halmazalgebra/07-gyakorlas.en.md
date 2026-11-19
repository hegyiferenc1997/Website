---
title: Practice – Set Algebra
summary: Review questions and a summary worksheet on sets, inclusion–exclusion and the algebra of events.
minutes: 50
kind: practice
---

## Review questions

<details>
<summary>1. What is the difference between ∈ and ⊆?</summary>

$\in$ relates an element to a set ($2 \in \{1, 2\}$), $\subseteq$ relates two sets ($\{2\} \subseteq \{1, 2\}$). $2 \subseteq \{1,2\}$ is meaningless and $\{2\} \in \{1, 2\}$ is false.

</details>

<details>
<summary>2. How do we prove that two sets are equal?</summary>

By two-way inclusion ($A \subseteq B$ and $B \subseteq A$), or with a membership table: if in every possible case (the element is / is not in each set) the two sides give the same result.

</details>

<details>
<summary>3. Why do we subtract the intersection in inclusion–exclusion?</summary>

Because in $\lvert A \rvert + \lvert B \rvert$ the elements in both sets appear twice; they must be subtracted once.

</details>

<details>
<summary>4. What is the complement event and what is it good for?</summary>

$\overline{A}$ occurs when $A$ does not. Since $P(\overline{A}) = 1 - P(A)$, for "at least one" questions it is often easier to compute the complement ("none").

</details>

## Summary worksheet

```quiz required
? $U = \{1, \dots, 12\}$, $A$ = even numbers, $B$ = multiples of $3$. How many elements does $\overline{A \cup B}$ have?
= 4
! $\{1, 5, 7, 11\}$

? With the same sets, how many elements does $A \triangle B$ have?
= 6
! $\lvert A \rvert = 6$, $\lvert B \rvert = 4$, $\lvert A \cap B \rvert = 2$.

? Fill in the membership table: $Y = \overline{A} \cap (B \cup C)$.
table: A, B, C -> Y = A'·(B + C)

? How many subsets of $\{a, b, c, d\}$ contain the element $a$?
= 8
! We decide freely about the other three elements: $2^3$.

? How many numbers from 1 to 100 are divisible **neither** by $2$ nor by $5$?
= 40
! $100 - (50 + 20 - 10)$

? We toss three coins. What is the probability of at least one head? (As a fraction or decimal.)
= 7/8
! The complement: all three tails, $\frac{1}{8}$.

? Which relation is **not** transitive?
- "less than" on the reals
- "divides" on the positive integers
+ "perpendicular to" on the lines of the plane
- "subset of" on sets
! If $a \perp b$ and $b \perp c$, then $a \parallel c$.
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Symmetric difference.** Write the function `sym_diff(A, B)`, which returns the elements that are in exactly one of the two sets! Don't use the `^` operator – build it from union, intersection and difference.

```python starter
def sym_diff(A, B):
    return A | B
```

<details>
<summary>Solution</summary>

The same another way: $(A \setminus B) \cup (B \setminus A)$.

```python solution
def sym_diff(A, B):
    return (A | B) - (A & B)              # remove the common part from the union
```

</details>

```python test
assert sym_diff({1, 2, 3}, {2, 3, 4}) == {1, 4}
assert sym_diff({1, 2}, {3}) == {1, 2, 3}
assert sym_diff({5}, {5}) == set()
assert sym_diff(set(), {7}) == {7}
print("All checks passed!")
```

**2.** **Inclusion–exclusion.** Write the function `divisible_count(n, a, b)`, which tells how many numbers between 1 and `n` are divisible by `a` **or** `b` – without a loop, using the inclusion–exclusion formula! (Hint: `math.lcm`, and `n // a` is the number of multiples.)

```python starter
def divisible_count(n, a, b):
    return n // a + n // b
```

<details>
<summary>Solution</summary>

The common multiples of $4$ and $6$ are the multiples of $12$ (not of $24$!) – that's why the lcm is needed.

```python solution
import math

def divisible_count(n, a, b):
    # |A ∪ B| = |A| + |B| − |A ∩ B|; the common multiples are the multiples of the lcm
    return n // a + n // b - n // math.lcm(a, b)
```

</details>

```python test
assert divisible_count(100, 2, 3) == 67
assert divisible_count(1000, 3, 5) == 467
assert divisible_count(100, 4, 6) == 33
assert divisible_count(10, 2, 2) == 5
print("All checks passed!")
```

**3.** **Cartesian product.** Write the function `cartesian(A, B)`, which returns all `(a, b)` pairs where `a` is from `A` and `b` is from `B`, as a set!

```python starter
def cartesian(A, B):
    return set()
```

<details>
<summary>Solution</summary>

$|A \times B| = |A| \cdot |B|$ – that's why there are 20 pairs in the second test.

```python solution
def cartesian(A, B):
    return {(a, b) for a in A for b in B}  # pair every a with every b
```

</details>

```python test
assert cartesian({1, 2}, {"x", "y"}) == {(1, "x"), (1, "y"), (2, "x"), (2, "y")}
assert len(cartesian(set(range(4)), set(range(5)))) == 20
assert cartesian({1}, set()) == set()
print("All checks passed!")
```

### Quick check questions

```quiz
? $|A| = 12$, $|B| = 9$, $|A \cap B| = 4$. What is $|A \cup B|$?
= 17
! $12 + 9 - 4 = 17$.

? How many subsets does a 5-element set have?
= 32
! $2^5 = 32$.

? Which is equal to $\overline{A \cup B}$ (De Morgan)?
- $\overline{A} \cup \overline{B}$
+ $\overline{A} \cap \overline{B}$
- $A \cap B$
- $\overline{A \cap B}$
! What isn't in the union isn't in either of them.

? $A = \{1, 2, 3, 4\}$, $B = \{3, 4, 5\}$. How many elements does $A \setminus B$ have?
= 2
! $A \setminus B = \{1, 2\}$.

? In a group of 30, 18 study English, 12 study German, and 5 study both. How many study neither?
= 5
! $30 - (18 + 12 - 5) = 5$.
```
