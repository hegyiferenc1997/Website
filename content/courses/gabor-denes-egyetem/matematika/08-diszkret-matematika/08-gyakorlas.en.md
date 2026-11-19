---
title: Practice – Discrete Mathematics
summary: Review questions and a summary worksheet on logic, combinatorics, number theory and graphs.
minutes: 60
kind: practice
---

## Review questions

<details>
<summary>1. Why is an implication true when its premise is false?</summary>

An implication is a promise: "if $P$, then $Q$". It is broken only if $P$ holds but $Q$ does not. If $P$ does not hold, the promise has not been broken, so the implication is true. Formally: $P \rightarrow Q \equiv \neg P \lor Q$, which is true for false $P$.

</details>

<details>
<summary>2. How do you know whether you need a variation or a combination?</summary>

Ask: if two selections differ only in order, are they two different cases? If yes (podium, password, ordering), it is a variation; if not (team, lottery, cards in hand), it is a combination. Then: can an element repeat?

</details>

<details>
<summary>3. Why is the Euclidean algorithm fast?</summary>

Because in two steps the larger number drops to at most half (if $b \leq a/2$, then $a \bmod b < b \leq a/2$; if $b > a/2$, then $a \bmod b = a - b < a/2$). So the number of steps is proportional to the number of digits, which is fast even for the hundreds-of-digits numbers used in RSA.

</details>

<details>
<summary>4. Why does every tree on $n$ vertices have $n - 1$ edges?</summary>

By induction: a tree with $1$ vertex has $0$ edges. A tree with at least $2$ vertices always has a **leaf** (a vertex of degree one: the endpoint of a longest path). Removing it together with its edge leaves a tree on $n - 1$ vertices, which by the induction hypothesis has $n - 2$ edges, so the original has $n - 1$.

</details>

## Summary worksheet

```quiz required
? Fill in the truth table: $Y = \neg(P \land Q)$ (NAND) and $Z = \neg P \lor \neg Q$.
table: P, Q -> Y = (P·Q)'; Z = P' + Q'
! The two columns are identical: this is De Morgan's law.

? What is the negation of "There is a student who attended every class."?
- There is a student who attended no class.
+ Every student missed at least one class.
- Every student missed every class.
- No student attended any class.
! $\neg\exists h\,\forall o\, P(h, o) \equiv \forall h\,\exists o\,\neg P(h, o)$.

? By induction: $1 + 2 + 4 + \dots + 2^{n} = \;?$ Enter it as a function of $n$!
fn: n -> 2^(n + 1) - 1
domain: 0, 10

? In how many ways can we draw $4$ cards from a $32$-card deck (order does not matter)?
= 35960

? In how many ways can we choose $2$ boys and $2$ girls from $5$ boys and $4$ girls?
= 60

? What is the coefficient of $x^4$ in the expansion of $(3x + 2)^{10}$? (Enter only the final result.)
= 1088640
! $\binom{10}{4} \cdot 3^4 \cdot 2^6$

? What is $2^{50} \bmod 7$?
= 4
! $2^3 = 8 \equiv 1 \pmod 7$, and $50 = 3 \cdot 16 + 2$.

? In a graph on $10$ vertices every vertex has degree $3$. How many edges does it have?
= 15

? Which graph has a closed Euler trail (Euler circuit)?
- the complete graph $K_4$
+ the complete graph $K_5$
- a path on $5$ vertices ($P_5$)
- any tree
! In $K_n$ every degree is $n - 1$; for $n = 5$ this is even.
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Binomial coefficient.** Write the function `binom(n, k)` without `math.comb` and factorials! Hint: $\binom{n}{k} = \frac{n}{1} \cdot \frac{n - 1}{2} \cdot \ldots \cdot \frac{n - k + 1}{k}$, and if you always multiply first and then divide with integer division, everything stays an integer.

```python starter
def binom(n, k):
    return n * k
```

<details>
<summary>Solution</summary>

So in the 5-of-90 lottery the chance of hitting all five is $\frac{1}{43\,949\,268}$.

```python solution
def binom(n, k):
    if k < 0 or k > n:
        return 0
    k = min(k, n - k)                     # symmetry: fewer steps
    result = 1
    for i in range(1, k + 1):
        result = result * (n - k + i) // i   # always divisible, stays an integer
    return result
```

</details>

```python test
assert binom(5, 2) == 10
assert binom(10, 0) == 1
assert binom(90, 5) == 43949268          # Hungarian 5-of-90 lottery
assert binom(52, 5) == 2598960           # poker hands
assert binom(3, 5) == 0
print("All checks passed!")
```

**2.** **Euclidean algorithm.** Write the function `gcd(a, b)` without `math.gcd`, using the Euclidean algorithm: $\gcd(a, b) = \gcd(b, a \bmod b)$, and $\gcd(a, 0) = a$!

```python starter
def gcd(a, b):
    return min(a, b)
```

<details>
<summary>Solution</summary>

```python solution
def gcd(a, b):
    while b != 0:
        a, b = b, a % b                   # continue with the remainder
    return a
```

</details>

```python test
assert gcd(48, 18) == 6
assert gcd(17, 5) == 1
assert gcd(1071, 462) == 21
assert gcd(12, 0) == 12
print("All checks passed!")
```

**3.** **Is there an Euler path?** A connected graph has a walk that goes along every edge exactly once if the number of odd-degree vertices is $0$ or $2$. Write the function `euler_path(edges)`, which decides this (`True`/`False`) from the list of edges (e.g. `[("A", "B"), ...]`)! You may assume the graph is connected.

```python starter
def euler_path(edges):
    return True
```

<details>
<summary>Solution</summary>

The last test is the graph of the bridges of Königsberg: all four vertices have odd degree, which is why Euler proved there is no such walk.

```python solution
def euler_path(edges):
    degree = {}
    for u, v in edges:                    # every edge increases the degree of two vertices
        degree[u] = degree.get(u, 0) + 1
        degree[v] = degree.get(v, 0) + 1
    odd = sum(1 for d in degree.values() if d % 2 == 1)
    return odd in (0, 2)
```

</details>

```python test
assert euler_path([("A", "B"), ("B", "C"), ("C", "A")]) is True                       # triangle
assert euler_path([("A", "B"), ("B", "C"), ("C", "D")]) is True                       # path
assert euler_path([("A", "B"), ("A", "C"), ("A", "D")]) is False                      # star: 4 odd
assert euler_path([("A", "B"), ("A", "B"), ("A", "C"), ("A", "C"), ("A", "D"), ("B", "D"), ("C", "D")]) is False  # Königsberg
print("All checks passed!")
```

### Quick check questions

```quiz
? In how many ways can 5 people be lined up?
= 120
! $5! = 120$.

? How many 3-person committees can be chosen from 8 people?
= 56
! $\binom{8}{3} = 56$.

? What is $7^{100} \bmod 6$?
= 1
! $7 \equiv 1 \pmod 6$, so $7^{100} \equiv 1$.

? The sum of the vertex degrees in a graph is 24. How many edges does it have?
= 12
! Handshake lemma: the sum of the degrees is twice the number of edges.

? Which formula is a tautology?
- $A \to \lnot A$
+ $A \lor \lnot A$
- $A \land \lnot A$
- $A \to B$
! The law of the excluded middle: a statement is either true or false.
```
