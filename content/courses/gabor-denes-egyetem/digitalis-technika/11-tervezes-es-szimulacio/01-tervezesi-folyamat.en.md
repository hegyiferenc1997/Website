---
title: The Digital Design Process and Timing
summary: From specification to working hardware – top-down design, hierarchy, RTL; setup and hold time, the critical path, maximum clock frequency, timing slack; synchronous design rules, metastability and the synchroniser.
minutes: 40
---

## What you will learn

- what steps the design of a digital system consists of,
- what **top-down** and **hierarchical** design are,
- what **setup** and **hold time** mean,
- how to compute the **critical path** and the **maximum clock frequency**,
- the rules of **synchronous design**, and what **metastability** is.

## The design steps

The design of a digital system (whether for an FPGA or a custom chip) almost always goes through the same steps:

1. **Specification:** what must the system do? Inputs, outputs, speed, power, price, interfaces.
2. **Architecture:** what large units does it consist of (datapath, controller, memory, interfaces), and how are they connected?
3. **RTL description** (register transfer level): the units described in HDL – registers and the combinational logic between them.
4. **Functional simulation:** does it work logically? (next lesson)
5. **Synthesis:** the HDL becomes a network of gates, LUTs and flip-flops.
6. **Implementation** (place and route) and **timing analysis:** is it fast enough with the real delays?
7. **Programming / manufacturing and testing** on the real hardware (third lesson).

If an error turns up at some step, you must go back – the later it turns up, the more expensive it is. That is why it pays to simulate a lot.

## Top-down and hierarchy

In **top-down** design you break the task into smaller and smaller, manageable parts until each part is easy to implement (e.g. a counter, a multiplexer). In the **bottom-up** direction you build upwards from finished, tested basic elements. In practice the two go together.

```text
           digital clock (top)
         /         |          \
   time base     counters      display driver
   (divider)  (mod-60, mod-24)  (BCD → 7-segment, multiplexing)
```

Every box is a separate HDL module (entity / module) that you can **test separately** and **reuse** several times (e.g. the same mod-10 counter in several places).

## Timing: setup and hold

A flip-flop reliably takes its D input only if it is **stable** around the clock edge:

- **setup time (t<sub>su</sub>):** the data must be stable this long **before** the clock edge;
- **hold time (t<sub>h</sub>):** the data must remain stable this long **after** the clock edge;
- **clock-to-output delay (t<sub>cq</sub>):** this long after the edge the new value appears on the Q output.

```text
clock      ____/‾‾‾‾‾‾‾\_______
D       ==X====stable====X=====
            |<-tsu->|<-th->|
```

## Critical path and maximum clock

The path of the data between two registers: the t<sub>cq</sub> delay of the first flip-flop, then the delay of the combinational logic (t<sub>logic</sub>), finally the setup time of the second flip-flop. All of this must fit into one clock period:

**T ≥ t<sub>cq</sub> + t<sub>logic</sub> + t<sub>su</sub>**

The slowest such path is the **critical path**; it determines the **maximum clock frequency**:

**f<sub>max</sub> = 1 / (t<sub>cq</sub> + t<sub>logic,max</sub> + t<sub>su</sub>)**

**Example:** t<sub>cq</sub> = 1 ns, the slowest logic is 6 ns, t<sub>su</sub> = 1 ns → T<sub>min</sub> = 8 ns → f<sub>max</sub> = **125 MHz**.

The **timing slack** shows how much time is left: slack = T − (t<sub>cq</sub> + t<sub>logic</sub> + t<sub>su</sub>). At 100 MHz (T = 10 ns) the slack of the path above is **2 ns**. **Negative slack** = a timing violation: the circuit will not work reliably at this clock.

What can you do if it does not fit? Lower the clock; simplify the logic; or build a **pipeline**: cut the long combinational path into two shorter ones with an intermediate register (higher clock, but the result comes one clock later).

## The rules of synchronous design

Reliable designs are almost always **synchronous**:

- **one clock** (or a few, well-handled clocks) drives every flip-flop, on the same edge;
- the clock is **not gated** with logic (a clock “switched off” with an AND gate can cause hazard glitches) – an **enable** input is used instead;
- combinational logic is not fed back into itself without a register (**no combinational loop**);
- asynchronous inputs (buttons, signals from another clock) are **synchronised**.

## Metastability and the synchroniser

If a signal changes at a moment independent of our own clock (e.g. a button press, another clock domain), sooner or later it violates the setup or hold time. Then the flip-flop may enter a **metastable** state: its output is for a while neither 0 nor 1, and settles only after a random time.

The solution is the **two-flip-flop synchroniser**: the signal is passed through two flip-flops connected one after the other. The first may become metastable, but it has a whole clock period to settle before the second takes it over – so the probability of an error becomes negligible.

```text
asynchronous input ──> [FF1] ──> [FF2] ──> synchronised signal
                         ^         ^
clock ───────────────────┴─────────┘
```

Buttons must also be **debounced** (topic 5), because a button press “bounces” for several ms.

```python run
# Computing the critical path and the maximum clock frequency
t_cq, t_su = 1.0, 1.0                          # ns
paths = {"adder": 6.0, "comparator": 3.5, "multiplexer": 1.2}   # logic delays, ns

critical = max(paths, key=paths.get)
t_min = t_cq + paths[critical] + t_su
print("critical path:", critical, "- T_min =", t_min, "ns")
print("f_max =", round(1000 / t_min, 1), "MHz")

T = 10.0                                       # 100 MHz clock
for name, t in paths.items():
    print(f"{name:12} slack = {T - (t_cq + t + t_su):5.1f} ns")
```

## Summary

- Steps: specification → architecture → RTL → simulation → synthesis → implementation + timing → testing.
- Top-down decomposition, hierarchical modules that can be tested separately and reused.
- T ≥ t<sub>cq</sub> + t<sub>logic</sub> + t<sub>su</sub>; the slowest path is the critical path, f<sub>max</sub> = 1/T<sub>min</sub>; negative slack = violation.
- Synchronous design: one clock, no gated clock and no combinational loop; a two-flip-flop synchroniser for asynchronous signals.

## Lesson exercise

```quiz required
? On a path t_cq = 1 ns, the combinational logic is 6 ns, t_su = 1 ns. What is the maximum clock frequency in MHz?
= 125
! 1 / (1 + 6 + 1) ns.

? The same path runs with a 100 MHz clock (T = 10 ns). What is the timing slack in ns?
= 2

? What is the setup time?
+ The data must be stable this long before the clock edge.
- This long after the clock edge the new value appears at the output.
- The time it takes to power up the circuit.
- The period of the clock.

? What is the correct order in the design process?
- synthesis → specification → simulation → RTL
+ specification → RTL description → functional simulation → synthesis → implementation
- RTL description → implementation → synthesis → specification
- simulation → specification → implementation → RTL description

? What is the synchroniser made of two flip-flops in series for?
- It doubles the clock frequency.
+ It reduces the risk of metastability when an asynchronous signal enters the clock domain.
- It debounces the button.
- It stores two bits instead of one.

? Why must the clock not be gated with an AND gate?
- Because the AND gate is too slow.
+ Because hazard glitches can appear on a gated clock and the edge timing shifts; an enable input is needed instead.
- Because there is no AND gate in an FPGA.
- Because then the flip-flop gets no supply voltage.
```
