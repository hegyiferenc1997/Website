---
title: Practice – Logic Gates and Boolean Algebra
summary: Review questions and a summary worksheet: truth tables, De Morgan, algebraic simplification, universal gates, logic families.
minutes: 60
kind: practice
---

## Review questions

<details>
<summary>1. Why are there exactly 16 logic functions of two variables?</summary>

Because each of the 4 input combinations can be mapped to 0 or 1, so there are 2<sup>4</sup> = 16 different output columns.

</details>

<details>
<summary>2. When is the implication A → B false, and what is its expression?</summary>

Only when A = 1 and B = 0. Its expression: A̅ + B.

</details>

<details>
<summary>3. What is the difference between the dual and the complement of an expression?</summary>

In the dual we swap the · and + signs and the constants 0, 1, without touching the variables. In the complement (De Morgan) every variable is negated as well. E.g. the dual of A + B is A·B, its complement is A̅·B̅.

</details>

<details>
<summary>4. Why is the term BC redundant in AB + A̅C + BC?</summary>

Because if B = C = 1, then the term AB (for A = 1) or A̅C (for A = 0) is already 1, so BC never changes the output (consensus).

</details>

<details>
<summary>5. How does an AND–OR circuit become a NAND–NAND circuit?</summary>

Replace every gate with a NAND, the wiring stays the same (double negation + De Morgan). A variable going directly to the OR gate must be connected inverted.

</details>

<details>
<summary>6. Why must two totem-pole outputs never be connected?</summary>

Because if one drives 1 and the other 0, a short forms through the two output transistors between supply and ground, which can destroy the ICs.

</details>

## Summary worksheet

```quiz required
? Fill in: Y = (A ⊕ B)·C and Z = A·B + C
table: A, B, C -> Y = (A⊕B)·C; Z = A·B + C
! For each row compute A ⊕ B and A·B first.

? Simplify: F = A'·B'·C' + A'·B·C' + A·B'·C' + A·B·C'
expr: A, B, C -> C'
limit: 1
same: A'·B'·C' + A'·B·C' + A·B'·C' + A·B·C'
! Factor out C̅.

? Simplify: F = A'·B + A·B' + A·B
expr: A, B -> A + B
limit: 2
same: A'·B + A·B' + A·B
! You may use the A·B term twice.

? Simplify: F = A·B + B·C + B'·C
expr: A, B, C -> A·B + C
limit: 3
same: A·B + B·C + B'·C
! B·C + B̅·C = C.

? Simplify: F = X·Y'·Z + X·Y·Z' + X·Y·Z + X'·Y·Z
expr: X, Y, Z -> X·Y + X·Z + Y·Z
limit: 6
same: X·Y'·Z + X·Y·Z' + X·Y·Z + X'·Y·Z
! You can merge the XYZ term with each of its three neighbours.

? Transform so that negation is only on variables: ((A + B)'·C)'
expr: A, B, C -> A + B + C'
same: ((A + B)'·C)'
! Break the line twice.

? How many two-input NOR gates are needed to build a NAND gate?
= 4
! AND = 3 NORs, then one more NOR inverter.

? Which logic family uses almost no power at rest?
- TTL
+ CMOS
- both use the same
! Of the complementary transistor pair, one is always off at rest.

? Which form of A ⊙ B (XNOR) is correct?
- A·B' + A'·B
+ A·B + A'·B'
- (A + B)·(A' + B')
- A' + B
! XNOR is 1 when the two inputs are equal.
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Truth table by program.** Write the `truth_table(f, n)` function, which returns the list of outputs of an n-variable logic function (a Python function with 0/1 inputs) from row 00…0 to row 11…1!

```python starter
def truth_table(f, n):
    return []
```

<details>
<summary>Solution</summary>

```python solution
from itertools import product

def truth_table(f, n):
    # product gives the inputs exactly in truth table order
    return [f(*row) for row in product([0, 1], repeat=n)]
```

</details>

```python test
assert truth_table(lambda a, b: a & b, 2) == [0, 0, 0, 1]
assert truth_table(lambda a, b: 1 - (a & b), 2) == [1, 1, 1, 0]
assert truth_table(lambda a, b, c: a ^ b ^ c, 3) == [0, 1, 1, 0, 1, 0, 0, 1]
print("All checks passed!")
```

**2.** **Minterms.** Write the `minterms(f, n)` function, which returns the numbers (from 0) of the rows where the function's value is 1! (This is the function's Σm form.)

```python starter
def minterms(f, n):
    return []
```

<details>
<summary>Solution</summary>

```python solution
from itertools import product

def minterms(f, n):
    return [i for i, row in enumerate(product([0, 1], repeat=n)) if f(*row)]
```

</details>

```python test
assert minterms(lambda a, b: a | b, 2) == [1, 2, 3]
assert minterms(lambda a, b, c: (a & b) | c, 3) == [1, 3, 5, 6, 7]
assert minterms(lambda a, b: 0, 2) == []
print("All checks passed!")
```

**3.** **Checking De Morgan.** Write the `equivalent(f, g, n)` function, which returns true if the two n-variable functions give the same output for every input!

```python starter
def equivalent(f, g, n):
    return True
```

<details>
<summary>Solution</summary>

The last line is the most common mistake: the negation of AND isn't the AND of the negations, but the OR of the negations.

```python solution
from itertools import product

def equivalent(f, g, n):
    return all(f(*row) == g(*row) for row in product([0, 1], repeat=n))
```

</details>

```python test
NOT = lambda x: 1 - x
assert equivalent(lambda a, b: NOT(a & b), lambda a, b: NOT(a) | NOT(b), 2)      # De Morgan
assert equivalent(lambda a, b: a | (a & b), lambda a, b: a, 2)                  # absorption
assert not equivalent(lambda a, b: NOT(a & b), lambda a, b: NOT(a) & NOT(b), 2) # a common mistake!
print("All checks passed!")
```

### Quick check questions

```quiz
? What is A + A̅·B equal to?
- A
+ A + B
- A̅ + B
- B
! Distributive law: A + A̅B = (A + A̅)(A + B) = A + B.

? How many different two-variable logic functions exist?
= 16
! The outputs of the 4 rows can be chosen in 2^4 = 16 ways.

? How many CMOS transistors make up a two-input NAND gate?
= 4
! 2 parallel p-channel and 2 series n-channel transistors.

? What is the dual of the OR gate?
+ the AND gate
- the NOR gate
- the XOR gate
! Duality swaps the + and · operations, and the constants 0 and 1.

? A 74HC00 NAND gate has a delay of 8 ns. What is the worst-case delay of an XOR built from 4 NANDs (ns)?
= 24
! The longest path goes through 3 gate levels.
```
