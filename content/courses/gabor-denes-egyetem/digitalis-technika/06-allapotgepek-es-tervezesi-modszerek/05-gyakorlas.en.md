---
title: Practice – State Machines
summary: Review questions and a summary worksheet: Moore and Mealy machines, state table, sequence detector, state encoding and minimisation.
minutes: 35
kind: practice
---

## Review questions

<details>
<summary>1. What does a synchronous state machine consist of, and which parts are combinational?</summary>

Next-state logic (combinational), a state register (flip-flops, sequential) and output logic (combinational). At every clock edge the state register takes the code computed by the next-state logic.

</details>

<details>
<summary>2. How can you tell from the equations whether it is a Moore or a Mealy machine?</summary>

If the output function contains only state variables (flip-flop outputs), it is a Moore machine; if an input also appears in it, it is a Mealy machine.

</details>

<details>
<summary>3. Why does the “101” Moore detector need one more state than the Mealy version?</summary>

Because the output of a Moore machine may depend only on the state, so the “found it” situation must be marked by a separate state with output 1. The Mealy machine can write it on the transition (state C + input 1), so no new state is needed.

</details>

<details>
<summary>4. What can happen if not every input has an arrow from a state in the state diagram?</summary>

The specification becomes incomplete: it is unknown what the machine should do in that case, and the implementation will behave “randomly” (whatever the simplification happens to produce). For every state the next state must be given for every input combination – even if it is staying put.

</details>

<details>
<summary>5. When is it worth choosing Gray encoding?</summary>

When the state machine typically passes through consecutive states (like a counter): then only one flip-flop changes per step, which means lower power and fewer hazards on signals decoded from the state code.

</details>

## Summary worksheet

```quiz required
? The output of a state machine is y = Q1 · x, where Q1 is a state variable and x an input. What kind of machine is it?
- Moore machine
+ Mealy machine
- combinational circuit
- asynchronous counter

? At least how many flip-flops does a 10-state machine need with binary encoding?
= 4

? The state of a machine with a single D flip-flop flips at every clock if x = 1 and stays unchanged if x = 0. Fill in the state table (DN is the next state)!
table: D, X -> DN = D ⊕ X

? The “101” Moore detector (states A, B, C, D) starts from A and receives 1, 1, 0, 1 in turn. Which state will it be in?
= D
! A → B → B → C → D.

? The “101” Mealy detector receives 1, 0, 1, 1, 0, 1 in turn. What is the output sequence? (Write it together!)
= 001001

? The “101” Moore detector is encoded as A = 00, B = 01, C = 10, D = 11 (Q1 Q0). Give the function of output y!
expr: Q1, Q0 -> Q1·Q0
! Only state D has output 1.

? What is the rule when drawing a state diagram?
- Exactly one arrow may leave each state.
+ For every state the next state must be given for every input combination.
- No arrow may lead into the initial state.
- Only Moore machines can have a state diagram.
```
