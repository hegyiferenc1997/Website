---
title: Deeper – State Machines in Practice
summary: A vending machine as a Moore machine, run from a table; state minimisation by program (partition refinement) and unreachable states; comparing binary, Gray and one-hot encoding by flip-flop count and bit changes; debouncing a push button with a state machine.
minutes: 40
---

## What you will learn in this lesson

- to write an everyday machine (a vending machine) as a **state machine** and run it from a table,
- how a program **minimises** states by refining groups step by step, and what an **unreachable** state is,
- to compare binary, Gray and one-hot state encoding **in numbers**,
- how a small state machine filters out the **bouncing** of a push button.

## 1. A vending machine as a Moore machine

A drink costs 150 Ft, and the machine accepts 50 and 100 Ft coins. The **state** is the amount inserted so far, and the **output** (drink, change) depends only on the state – so this is a **Moore machine**. The whole behaviour is a single table:

```python run
# A vending machine as a Moore machine: a 150 Ft drink, 50 and 100 Ft coins
# State = amount inserted so far; the output depends only on the state (Moore).
TRANSITION = {                   # (state, coin) → next state
    (0, 50): 50,     (0, 100): 100,
    (50, 50): 100,   (50, 100): 150,
    (100, 50): 150,  (100, 100): 200,
    (150, 50): 50,   (150, 100): 100,       # after dispensing, a new coin starts a new purchase
    (200, 50): 50,   (200, 100): 100,
}
OUTPUT = {0: "-", 50: "-", 100: "-", 150: "DRINK", 200: "DRINK + 50 Ft change"}

def run(coins):
    state = 0
    for coin in coins:
        state = TRANSITION[(state, coin)]
        print(f"  insert {coin:>3} Ft → state {state:>3}: {OUTPUT[state]}")

print("Customer 1: 50 + 50 + 50"); run([50, 50, 50])
print("Customer 2: 100 + 100");    run([100, 100])
```

Notice the design steps, which are the same for every state machine:

1. **States**: what has to be "remembered"? Here, the amount so far: 0, 50, 100, 150, 200 → 5 states.
2. **Transitions**: for every state and every input we must say where it goes – the table must be **complete**, otherwise the machine can "get stuck".
3. **Outputs**: in a Moore machine, one output per state.

In hardware the same table is a state register (3 flip-flops for 5 states) and a combinational network; in software (on a microcontroller) it's written exactly like this, with a dictionary or a `switch` statement. **The state machine is the language of design, not just of hardware.**

## 2. State minimisation by program

Two states are **equivalent** if they give the same output and go to equivalent states for every input. The machine decides this **step by step**:

1. first it groups the states by **output** only,
2. then it splits those that go to a **different group** for some input,
3. it repeats this until the groups stop being refined.

```python run
# State minimisation by partition refinement: same output + moving to the same group = equivalent
# A Moore machine: state → (output, {input: next state})
machine = {
    "A": (0, {0: "B", 1: "C"}),
    "B": (0, {0: "D", 1: "E"}),
    "C": (0, {0: "D", 1: "E"}),     # B and C behave the same...
    "D": (1, {0: "A", 1: "A"}),
    "E": (1, {0: "A", 1: "A"}),     # ...and so do D and E
    "F": (0, {0: "D", 1: "A"}),
}

def minimise(machine):
    # step 0: grouping by output only
    group = {s: machine[s][0] for s in machine}
    while True:
        # the state's "signature": its own group + the groups of its next states
        signature = {s: (group[s],) + tuple(group[machine[s][1][b]] for b in (0, 1)) for s in machine}
        number = {sig: i for i, sig in enumerate(sorted(set(signature.values())))}
        new = {s: number[signature[s]] for s in machine}
        if len(set(new.values())) == len(set(group.values())):
            return new                               # no further refinement: done
        group = new

result = minimise(machine)
classes = {}
for s, c in sorted(result.items()):
    classes.setdefault(c, []).append(s)
print("equivalent groups:", ["".join(v) for v in classes.values()])
print(f"{len(classes)} of the {len(machine)} states remain")
```

B and C behave the same (both output 0, go to D on 0 and to E on 1), and so do D and E – so of 6 states **4** remain. That can mean one flip-flop fewer (6 states need 3 flip-flops, but 2 are enough for 4)!

There's one more trap: state **F** **can't be reached** from the start state A (look: nothing goes to F). Such an **unreachable** state can simply be deleted – so in the end **3** states remain. Both mistakes (equivalent and unreachable states) are common in graphs written from a text description, so one step of the design is always "cleaning up" the graph.

## 3. Binary, Gray or one-hot?

On an 8-state machine that goes round in a cycle (e.g. the step sequence of a stepper motor), let's count how many flip-flops are needed and how many bits change during a full cycle – every bit change charges or discharges a capacitance, that is, it costs **power**:

```python run
# Comparing state encodings on an 8-state machine that goes round a cycle (e.g. a step sequence)
N = 8
encodings = {
    "binary":  [format(i, "03b") for i in range(N)],
    "Gray":    [format(i ^ (i >> 1), "03b") for i in range(N)],
    "one-hot": [format(1 << i, f"0{N}b") for i in range(N)],
}
for name, codes in encodings.items():
    # how many bits change in total during one cycle (proportional to dynamic power)
    changes = sum(bin(int(codes[i], 2) ^ int(codes[(i + 1) % N], 2)).count("1") for i in range(N))
    print(f"{name:<8} {len(codes[0])} flip-flops, {changes:>2} bit changes per cycle  | "
          + " ".join(codes[:4]) + " …")
```

| Encoding | Flip-flops | Bit changes / cycle | When is it good?                                                       |
| -------- | ---------- | ------------------- | ---------------------------------------------------------------------- |
| binary   | 3          | 14                  | few flip-flops needed (ASIC, small area)                               |
| Gray     | 3          | 8                   | fewest changes for a cyclic sequence, few glitches                     |
| one-hot  | 8          | 16                  | **FPGA**: plenty of flip-flops, and very simple, fast next-state logic |

Surprised that one-hot changes the most bits? Exactly **two** change at every step (one 1 → 0, one 0 → 1), but its next-state logic is little more than individual wires, so it's very **fast**. Design is a bargain here too: few flip-flops, low power or high speed.

## 4. Debouncing with a state machine

The contact of a mechanical push button **bounces** for a few milliseconds when pressed and released: it switches rapidly between 0 and 1. If a counter counted this directly, it would count several presses for one. The solution is a small state machine: it only accepts the new value if it stays the same for **3 consecutive samples**.

```python run
# Debouncing a push button with a state machine: only 3 consecutive equal samples are accepted
# A sample arrives every 1 ms; the button's contact "bounces" on both press and release.
samples = "0001011011111111110100100000000"

def debounce(samples, need=3):
    stable, candidate, n = "0", "0", 0
    output = ""
    for s in samples:
        if s == candidate:
            n += 1                                   # same as before: keep counting
        else:
            candidate, n = s, 1                      # it changed: restart the count
        if n >= need:
            stable = candidate                       # stable for long enough: accept it
        output += stable
    return output

out = debounce(samples)
print("raw button:   ", samples)
print("debounced:    ", out)
print(f"number of presses: raw {samples.count('01')}, debounced {out.count('01')}")
```

The raw signal contains **5** "presses" (0 → 1 changes), the debounced one **one** – just as the user really pressed it. The price is a small **delay** (here 2–3 ms), which is unnoticeable on a human scale. Every keyboard, mouse button and microcontroller button handler runs logic like this (in hardware or software).

## Summary

- A state machine = **states** + a **complete** transition table + **outputs**; the same model in hardware and software.
- State minimisation: grouping by output, then refining as long as needed; **unreachable** states can be deleted.
- Binary encoding: fewest flip-flops; Gray: fewest bit changes for a cyclic sequence; one-hot: most flip-flops, but the fastest logic (popular on FPGAs).
- A debouncing state machine accepts only a value that's stable over several samples.

## Lesson exercise

```quiz required
? The vending machine is in the 100 Ft state, and another 100 Ft coin is inserted. What is the next state?
= 200
! 100 + 100 = 200 Ft: a drink and 50 Ft change.

? When are two states of a Moore machine equivalent?
- if they can be reached from the same state
+ if they give the same output and go to equivalent states for every input
- if their codes differ in only one bit
- if the start state can be reached from both
! What matters is the output and the future behaviour, not the past.

? How many flip-flops does a 10-state machine need with one-hot encoding?
= 10
! One-hot: one flip-flop per state.

? How many flip-flops does the same 10-state machine need with binary encoding?
= 4
! 2^3 = 8 < 10 ≤ 16 = 2^4.

? What does the debouncer (needs 3 equal samples, initial output 0) output for this raw sample sequence: 0110111? Type the 7 output bits!
= 0000001
! The 11 run is only two samples long, so it isn't accepted; the output switches to 1 at the third sample of the final 111.
```
