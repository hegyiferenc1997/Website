---
title: The Finite State Machine (FSM)
summary: The concept of a state machine, state diagram and state table, the three parts of a synchronous state machine (next-state logic, state register, output logic), Moore and Mealy models.
minutes: 25
---

## What you will learn

- what a **finite state machine** (FSM) is,
- how to describe it with a **state diagram** and a **state table**,
- the **three building blocks** of a synchronous state machine,
- the difference between a **Moore** and a **Mealy machine**.

## What is a state machine?

The counters of the previous topic always stepped in the same order on the clock. A **state machine** generalises this: the next state depends on the present state **and the inputs**, and the machine also produces **outputs**. Almost every controller is one: traffic light, vending machine, lift, the receiver of a serial protocol (UART), the control unit of a processor.

A finite state machine is defined by five things:

1. a finite set of **states** (S0, S1, …),
2. the set of **inputs**,
3. the set of **outputs**,
4. the **transition function**: (present state, input) → next state,
5. the **output function**,

plus the **initial state** (where it goes after reset).

## State diagram and state table

In a **state diagram** circles are states and arrows are transitions; on the arrows we write which input causes the transition.

**Example** – a three-state “stepper”: for x = 1 it moves to the next state (S0 → S1 → S2 → S0), for x = 0 it stays.

```text
       x=1          x=1
 ┌──► (S0) ───────► (S1) ───────► (S2) ──┐
 │     ↺ x=0        ↺ x=0         ↺ x=0  │
 └──────────────────── x=1 ──────────────┘
```

The same as a **state table**:

| present   | x = 0 | x = 1 |
| --------- | ----- | ----- |
| S0        | S0    | S1    |
| S1        | S1    | S2    |
| S2        | S2    | S0    |

Starting from S0 with inputs 1, 1, 0, 1, 1: S0 → S1 → S2 → S2 → S0 → **S1**.

## Structure of a synchronous state machine

```text
            ┌──────────────────┐   ┌──────────────┐   ┌──────────────┐
input  ────►│ next-state       ├──►│ state        ├─┬►│ output       ├──► output
        ┌──►│ logic            │   │ register     │ │ │ logic        │
        │   └──────────────────┘   └──────▲───────┘ │ └──────────────┘
        │                                 │ CLK     │
        └─────────────────────────────────┴─────────┘ (present state)
```

- **Next-state logic**: a combinational circuit that computes the code of the next state from the present state and the inputs.
- **State register**: flip-flops (typically D) that take the next state **at every clock edge** – the machine's memory.
- **Output logic**: a combinational circuit that produces the outputs.

k flip-flops can encode at most 2<sup>k</sup> states, so N states need **at least ⌈log₂ N⌉** flip-flops (e.g. 5 states → 3 flip-flops).

## Moore and Mealy machines

Two models are distinguished by the inputs of the output logic:

|                         | **Moore machine**                                | **Mealy machine**                                   |
| ----------------------- | ------------------------------------------------ | --------------------------------------------------- |
| the output depends on   | **only the state**                               | the state **and the inputs**                        |
| notation on the diagram | written in the state circle: S1 / 1              | written on the arrow: x = 1 / y = 1                 |
| output changes          | only at a clock edge (state change) – stable     | may change immediately with the input               |
| number of states        | usually more                                     | usually fewer                                       |
| reaction time           | reacts one clock later                           | reacts in the same cycle                            |

Both are equally capable – every Mealy machine can be converted into a Moore machine and vice versa – the choice depends on the task.

## Summary

- An FSM consists of states, inputs, outputs, a transition function and an output function.
- Description: state diagram or state table.
- Structure: next-state logic + state register + output logic; N states need ⌈log₂ N⌉ flip-flops.
- Moore: output = f(state); Mealy: output = f(state, input).

## Lesson exercise

```quiz required
? What does the output of a Moore machine depend on?
+ Only on the present state.
- Only on the inputs.
- On the state and the inputs.
- On the clock frequency.

? What does the output of a Mealy machine depend on?
- Only on the present state.
- Only on the inputs.
+ On the state and the inputs.
- Only on the initial state.

? At least how many flip-flops does a state machine with 5 states need (binary encoding)?
= 3
! 2^2 = 4 < 5 ≤ 8 = 2^3.

? The stepper machine of the lesson (x = 1: next state, x = 0: stay) starts in S1 and receives 1, 0, 1, 1 in turn. Which state will it be in? (E.g. S0)
= S1
! S1 → S2 → S2 → S0 → S1.

? Which part stores the present state of the state machine?
- the next-state logic
+ the state register (flip-flops)
- the output logic
- the clock generator
```
