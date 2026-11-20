---
title: Practice – Combinational and Sequential Logic
summary: Review questions and a summary worksheet: Karnaugh maps, hazards, adders, multiplexer, decoder, latches and flip-flops.
minutes: 65
kind: practice
---

## Review questions

<details>
<summary>1. Why do the rows and columns of a Karnaugh map follow Gray-code order?</summary>

Because then adjacent cells differ in exactly one variable, and when two adjacent 1s are merged (XY + XY̅ = X) exactly that one variable drops out. In binary order (01 → 10) two bits would change.

</details>

<details>
<summary>2. When is it worth taking a don't-care (X) cell as 1?</summary>

When it gives a larger group (a shorter term), or fewer groups are enough. If no group needs it, we treat it as 0 – covering it is not required.

</details>

<details>
<summary>3. Why can a functional hazard not be removed with a redundant term?</summary>

Because it is a property of the function, not of the implementation: two inputs do not change at exactly the same time, so for a short while an intermediate input combination is valid, to which the function itself assigns a different output. Synchronous sampling or Gray coding helps against it.

</details>

<details>
<summary>4. Why is the ripple-carry adder slow, and what does carry-lookahead do differently?</summary>

In a ripple-carry adder every stage waits for the previous carry, so the delay is proportional to the number of bits (n · t<sub>c</sub>). Carry-lookahead produces all carries in parallel with two-level logic from the signals G = AB and P = A ⊕ B.

</details>

<details>
<summary>5. How would you implement a three-variable function with a 4:1 multiplexer?</summary>

Two variables (e.g. A, B) go to the select inputs; the four data inputs receive the residual function of the third variable: 0, 1, C or C̅ (Shannon expansion).

</details>

<details>
<summary>6. What is the difference between a decoder and a demultiplexer?</summary>

As circuits they are almost the same: the decoder activates the output corresponding to the input code, the demultiplexer routes a data input to the selected output. If the data is connected to the decoder's enable input, it works as a demultiplexer.

</details>

<details>
<summary>7. What happens in a NOR-based SR latch after S = R = 1 if both inputs return to 0 simultaneously?</summary>

During S = R = 1, Q = Q̅ = 0. After the simultaneous change both gates try to go to 1 and a race develops: the faster gate wins and the final state cannot be predicted. That is why this combination is forbidden.

</details>

<details>
<summary>8. Why does the excitation table of the JK flip-flop have the most don't-care entries?</summary>

Because every transition can be reached in two ways: e.g. 0 → 1 by setting (J = 1, K = 0) or by toggling (J = 1, K = 1), so K is a don't care. That is why JK designs have many Xs in their K-maps and simpler control logic.

</details>

## Summary worksheet

```quiz required
? Simplify with a K-map: F = Σm(0, 1, 4, 5, 6, 7) (A, B, C)!
expr: A, B, C -> A + B'
limit: 2
same: A'B'C' + A'B'C + AB'C' + AB'C + ABC' + ABC
! The quad of the A = 1 row and the quad of the B = 0 columns.

? Simplify using the don't-care entry: F = Σm(1, 3, 5) + d(7) (A, B, C)!
expr: A, B, C -> C
limit: 1
dc: 7
! Taking cell 7 as 1 gives a group of four.

? Which redundant term removes the static-1 hazard in the function F = AC̅ + BC?
+ AB
- AC
- B̅C
- A̅B
! Consensus: XY + X̅Z → YZ, here with respect to variable C.

? What is 1011 + 0110 on five bits (including the carry, in binary)?
= 10001
! 11 + 6 = 17.

? A 4:1 MUX has select inputs A and B, and data inputs D0 = C̅, D1 = 0, D2 = 1, D3 = C. Write the implemented function as simply as possible!
expr: A, B, C -> B'C' + AC
limit: 4
same: A'B'C' + AB' + ABC
! F = Σm(0, 4, 5, 7).

? A T flip-flop is in state 1 and must change to 0 at the next edge. What should T be?
- 0
+ 1
- Don't care.
! A change requires toggling.

? A JK flip-flop starts with Q = 0, its inputs are J = K = 1. What will Q be after three clock edges?
= 1
! It toggles at every edge: 0 → 1 → 0 → 1.

? A flip-flop has t_cq = 1 ns, the combinational path is 6 ns and the setup time is 3 ns. What is the maximum clock frequency in MHz?
= 100
= 100MHz
! T_min = 10 ns.
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Full adder.** Write the `full_adder(a, b, c)` function, which returns the sum of two bits and the incoming carry as an `(S, K)` pair (S is the sum bit, K the outgoing carry) – using only logic operations (`&`, `|`, `^`)!

```python starter
def full_adder(a, b, c):
    return (0, 0)
```

<details>
<summary>Solution</summary>

```python solution
def full_adder(a, b, c):
    s = a ^ b ^ c                    # an odd number of 1s → sum bit 1
    k = (a & b) | (c & (a ^ b))      # at least two 1s → carry
    return (s, k)
```

</details>

```python test
result = [full_adder(a, b, c) for a in (0, 1) for b in (0, 1) for c in (0, 1)]
assert result == [(0, 0), (1, 0), (1, 0), (0, 1), (1, 0), (0, 1), (0, 1), (1, 1)]
print("All checks passed!")
```

**2.** **Ripple-carry adder.** Write the `ripple(a_bits, b_bits)` function, which adds two bit lists of equal length (the **least significant bit comes first**) with a chain of full adders, and returns the `(sum_bits, carry_out)` pair!

```python starter
def ripple(a_bits, b_bits):
    return ([0] * len(a_bits), 0)
```

<details>
<summary>Solution</summary>

```python solution
def ripple(a_bits, b_bits):
    c, total = 0, []
    for a, b in zip(a_bits, b_bits):        # from the LSB to the MSB, as the carry travels
        total.append(a ^ b ^ c)
        c = (a & b) | (c & (a ^ b))
    return (total, c)
```

</details>

```python test
assert ripple([1, 1, 0, 0], [1, 0, 0, 0]) == ([0, 0, 1, 0], 0)    # 3 + 1 = 4
assert ripple([1, 1, 1, 1], [1, 0, 0, 0]) == ([0, 0, 0, 0], 1)    # 15 + 1 = 16 → carry
assert ripple([0, 1, 0, 1], [1, 1, 1, 0]) == ([1, 0, 0, 0], 1)    # 10 + 7 = 17
print("All checks passed!")
```

**3.** **4:1 multiplexer.** Write the `mux4(d, s1, s0)` function, where `d` is a four-element bit list (d0…d3), and the select bits (s1 is the upper one) determine which input reaches the output! Use only logic operations, no list indexing by the select bits.

```python starter
def mux4(d, s1, s0):
    return d[0]
```

<details>
<summary>Solution</summary>

The second test is a trick: if the truth table of XOR is connected to the d inputs, the multiplexer works as an XOR gate – this is how a MUX implements any function.

```python solution
def mux4(d, s1, s0):
    n1, n0 = 1 - s1, 1 - s0
    # Y = S1'S0'·D0 + S1'S0·D1 + S1S0'·D2 + S1S0·D3
    return (n1 & n0 & d[0]) | (n1 & s0 & d[1]) | (s1 & n0 & d[2]) | (s1 & s0 & d[3])
```

</details>

```python test
d = [1, 0, 0, 1]
assert [mux4(d, s1, s0) for s1 in (0, 1) for s0 in (0, 1)] == [1, 0, 0, 1]
d = [0, 1, 1, 0]
assert [mux4(d, s1, s0) for s1 in (0, 1) for s0 in (0, 1)] == [0, 1, 1, 0]
print("All checks passed!")
```

### Quick check questions

```quiz
? How many cells does a four-variable Karnaugh map have?
= 16
! 2^4 = 16 cells, each one a minterm.

? What size groups may be marked on a Karnaugh map?
- any size
+ 1, 2, 4, 8, … cells (powers of two), in a rectangle
- only pairs
! The edges of the map wrap around, the corners are neighbours too.

? How many select inputs does an 8:1 multiplexer have?
= 3
! 2^3 = 8 data inputs.

? What is the difference between a D latch and a D flip-flop?
+ the latch is level-triggered, the flip-flop edge-triggered
- the flip-flop stores two bits
- the latch has no input
! The latch is transparent while the enable signal is active; the flip-flop samples only at the clock edge.

? How many outputs does a 3 → 8 decoder have?
= 8
! There is one output for every input combination.
```
