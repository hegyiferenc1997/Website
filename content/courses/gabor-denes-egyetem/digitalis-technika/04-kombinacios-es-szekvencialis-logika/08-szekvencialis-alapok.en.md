---
title: Basics of Sequential Circuits
summary: State and memory, synchronous and asynchronous circuits, the clock, level and edge triggering, setup and hold time, maximum clock frequency, metastability.
minutes: 30
---

## What you will learn

- what makes a circuit **sequential** and what **state** is,
- the difference between **synchronous** and **asynchronous** circuits,
- the properties of the **clock**, the difference between **level triggering** and **edge triggering** (latch ↔ flip-flop),
- the **setup**, **hold** and **delay** times, and how to compute the **maximum clock frequency**,
- what **metastability** is and how to protect against it.

## Combinational logic with memory

The output of a **sequential** circuit depends not only on the current values of the inputs but also on **earlier inputs** – it has **memory**. This past is summarised by the **state**, which is held in **storage elements**.

```text
          ┌──────────────────┐
input  ──►│ combinational    ├─► output
      ┌──►│ circuit          ├──┐
      │   └──────────────────┘  │ next state
      │   ┌──────────────────┐  │
      └───┤ storage (state)  │◄─┘
          └──────────────────┘
```

The outputs of the storage elements are **fed back** to the combinational part. Almost every digital device – computer, memory, controller – is a mixture of combinational and sequential logic.

## Synchronous and asynchronous circuits

|                        | **asynchronous**                          | **synchronous**                         |
| ---------------------- | ----------------------------------------- | --------------------------------------- |
| when the state changes | any time an input changes                 | **only on the clock** (its active edge) |
| speed                  | limited only by gate delays – fast        | set by the clock frequency              |
| design                 | hard: **races**, hazards, unstable states | simpler, easy to automate               |
| use                    | in a few critical details                 | **almost every** digital system today   |

A **race** occurs when several state variables should change at once during a state change, but because of different delays they change in a different order – so the circuit may end up in a wrong state. In a synchronous circuit the clock period is chosen so that every signal settles before the next edge.

## The clock

The **clock** (CLK) is a periodic square wave that gives the “beat” of a synchronous circuit.

- **Period** T, **frequency** f = 1 / T (e.g. 50 MHz → T = 20 ns).
- **Duty cycle**: the fraction of the period spent high, typically 50 %.
- **Rising edge** (0 → 1) and **falling edge** (1 → 0).

## Level triggering and edge triggering

- **Latch – level-triggered:** while the enable signal (E) is at its active level, the output **follows** the input (“transparent”); when it becomes inactive, it keeps the last value.
- **Flip-flop – edge-triggered:** samples the input **only at the moment of the clock edge**; changes of the input between edges have no effect.

The literature (and everyday speech) often mixes the two words – in this course we use the distinction above.

**Notation:** CLK – clock, E (EN) – enable, **CLR** – clear (Q = 0), **PRE** – preset (Q = 1). The output is usually called **Q** – from the German word **Quelle** (source) – with the complemented output Q̅ beside it.

## Timing parameters

An edge-triggered flip-flop only works reliably if its input is **stable for some time around** the edge:

- **Setup time** (t<sub>su</sub>): the data must be stable this long **before the edge**.
- **Hold time** (t<sub>h</sub>): the data must stay stable this long **after the edge**.
- **Clock-to-Q** (t<sub>cq</sub>): the new value appears at the output this long after the edge.

### Maximum clock frequency

Between two flip-flops there is a combinational circuit (delay t<sub>logic</sub>). The clock period must be at least:

**T<sub>min</sub> = t<sub>cq</sub> + t<sub>logic</sub> + t<sub>su</sub>**, and **f<sub>max</sub> = 1 / T<sub>min</sub>**

**Example:** t<sub>cq</sub> = 2 ns, t<sub>logic</sub> = 13 ns, t<sub>su</sub> = 5 ns → T<sub>min</sub> = 20 ns → **f<sub>max</sub> = 50 MHz**.

The longest such path is the **critical path**; the **timing analysis** (static timing analysis) of FPGA tools computes exactly this.

## Metastability

If the setup or hold time is violated (e.g. an **asynchronous** external signal, a push button changes right at the clock edge), the flip-flop output is **at neither logic level** for a while – it hovers, then randomly falls to 0 or 1. This is **metastability**.

**Protection:** the asynchronous input is passed through **two flip-flops in a row** (a synchroniser chain); any metastable state of the first almost certainly dies away before the second samples it.

```python run
# Computing the maximum clock frequency
t_cq, t_logic, t_su = 2e-9, 13e-9, 5e-9       # in seconds
t_min = t_cq + t_logic + t_su
print(f"T_min = {t_min * 1e9:.0f} ns, f_max = {1 / t_min / 1e6:.0f} MHz")
```

## Summary

- Sequential circuit = combinational circuit + storage elements (state) with feedback.
- Synchronous: changes state only at the clock edge; asynchronous: any time, with the danger of races.
- Latch: level-triggered; flip-flop: edge-triggered.
- T<sub>min</sub> = t<sub>cq</sub> + t<sub>logic</sub> + t<sub>su</sub>; an asynchronous input is taken in with a two-flip-flop synchroniser.

## Lesson exercise

```quiz required
? What does the output of a sequential circuit depend on?
- Only on the current values of the inputs.
+ On the current values of the inputs and the state of the circuit (the earlier inputs).
- Only on the clock frequency.
- Only on the supply voltage.

? What is the difference between a latch and a flip-flop?
+ The latch is level-triggered, the flip-flop edge-triggered.
- The latch is edge-triggered, the flip-flop level-triggered.
- The latch is a combinational circuit, the flip-flop is not.
- There is no difference, they are the same.

? What is the period of a 50 MHz clock in nanoseconds?
= 20
= 20ns
! T = 1 / f.

? A flip-flop has t_cq = 3 ns, the combinational logic delay is 17 ns and the setup time is 5 ns. What is the maximum clock frequency in MHz?
= 40
= 40MHz
! T_min = t_cq + t_logic + t_su = 25 ns.

? What does setup time mean?
- The time it takes for the output to change after the edge.
+ The data must be stable this long before the clock edge.
- The data must stay stable this long after the edge.
- The time needed after power-on until the first clock.

? How do we protect against metastability on an asynchronous input?
- We double the clock frequency.
- We omit the clock and use a latch.
+ We pass the signal through two flip-flops in a row (a synchroniser chain).
- We invert the signal with an inverter.
```
