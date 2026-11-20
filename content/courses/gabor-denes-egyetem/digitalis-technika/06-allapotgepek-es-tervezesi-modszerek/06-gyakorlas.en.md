---
title: Practice – State Machines
summary: Review questions and a summary worksheet: Moore and Mealy machines, state table, sequence detector, state encoding and minimisation.
minutes: 60
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

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Running a state machine from a table.** Write the `run(transition, start, inputs)` function, where `transition` is a dictionary: `(state, input) → next state`. Return the list of states visited (including the start state)!

```python starter
def run(transition, start, inputs):
    return [start]
```

<details>
<summary>Solution</summary>

```python solution
def run(transition, start, inputs):
    state, path = start, [start]
    for i in inputs:
        state = transition[(state, i)]      # the table says where to go
        path.append(state)
    return path
```

</details>

```python test
# traffic light: moves on for input "t" (time is up), stays for "-"
light = {("red", "t"): "red-amber", ("red-amber", "t"): "green",
         ("green", "t"): "amber", ("amber", "t"): "red"}
for s in ["red", "red-amber", "green", "amber"]:
    light[(s, "-")] = s
assert run(light, "red", ["t", "-", "t", "t", "t"]) == \
    ["red", "red-amber", "red-amber", "green", "amber", "red"]
print("All checks passed!")
```

**2.** **Overlapping sequence detector.** Write the `count_101(bits)` function, which uses a state machine (not text search!) to count how many times the pattern "101" occurs in the bit sequence, **with overlap** (twice in "10101")!

```python starter
def count_101(bits):
    return bits.count("101")
```

<details>
<summary>Solution</summary>

Python's `count` doesn't count overlaps, so it gives 1 for "10101". At the end of the pattern the state machine jumps back not to the start but to the "1" state – that's the secret of overlap.

```python solution
def count_101(bits):
    # state = the start of the pattern found so far: "", "1", "10"
    state, n = "", 0
    for b in bits:
        if state == "":
            state = "1" if b == "1" else ""
        elif state == "1":
            state = "10" if b == "0" else "1"
        else:                                   # "10"
            if b == "1":
                n += 1
                state = "1"                     # overlap: the closing 1 starts a new pattern
            else:
                state = ""
    return n
```

</details>

```python test
assert count_101("10101") == 2
assert count_101("1101011010") == 3
assert count_101("1001") == 0
assert count_101("101101") == 2
print("All checks passed!")
```

**3.** **How many flip-flops?** Write the `ff_count(states, encoding)` function, which returns how many flip-flops a given number of states needs with `"binary"`, `"gray"` or `"onehot"` encoding!

```python starter
def ff_count(states, encoding):
    return states
```

<details>
<summary>Solution</summary>

```python solution
def ff_count(states, encoding):
    if encoding == "onehot":
        return states                          # one flip-flop per state
    n = 0
    while 2 ** n < states:                     # binary and Gray: ⌈log2 N⌉
        n += 1
    return max(n, 1)
```

</details>

```python test
assert ff_count(5, "binary") == 3
assert ff_count(5, "gray") == 3
assert ff_count(5, "onehot") == 5
assert ff_count(16, "binary") == 4
assert ff_count(17, "binary") == 5
assert ff_count(2, "binary") == 1
print("All checks passed!")
```

### Quick check questions

```quiz
? What does the output depend on in a Moore machine?
+ only the current state
- the state and the input
- only the input
! The output of a Mealy machine depends on the input too.

? Which model reacts to the input one clock earlier?
- Moore
+ Mealy
- the same
! A Mealy machine's output can change immediately with the input, a Moore machine's only after the state change.

? How many states does an overlapping "101" detector Moore machine need?
= 4
! Start, "1", "10" and "101" (the latter gives the output 1).

? What is characteristic of one-hot encoding?
+ exactly one flip-flop is always 1
- it needs the fewest flip-flops
- one bit changes between neighbouring states
! Many flip-flops, but very simple next-state logic.

? What must be done about the unused binary codes (e.g. 101, 110, 111 with 5 states)?
- nothing, they can never occur
+ make sure the machine gets from them to a valid state (self-starting)
- delete them from the flip-flops
! After interference or power-up the machine can end up in a forbidden state.
```
