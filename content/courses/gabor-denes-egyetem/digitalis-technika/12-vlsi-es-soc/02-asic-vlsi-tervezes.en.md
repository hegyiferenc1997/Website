---
title: ASIC and the VLSI Design Flow
summary: Comparing ASIC, FPGA and standard ICs, non-recurring engineering cost and break-even quantity; full-custom, standard-cell and gate-array design; the VLSI design flow from synthesis to tape-out; testability: scan chain, BIST.
minutes: 40
---

## What you will learn

- what an **ASIC** is, and when it is worth it instead of an FPGA,
- how to compute the **break-even quantity**,
- what **full-custom**, **standard-cell** and **gate-array** design are,
- what steps **VLSI design** consists of, up to **tape-out**,
- how a manufactured chip is tested (**scan chain**, **BIST**).

## ASIC or FPGA?

An **ASIC** (application-specific integrated circuit) is a custom-made chip designed for a single task: e.g. the processor of a phone, the hash circuit of a mining machine, the chip of a network switch.

| aspect              | FPGA                    | ASIC                                      |
| ------------------- | ----------------------- | ----------------------------------------- |
| one-time cost (NRE) | almost zero             | very high (masks, design tools: millions) |
| unit price          | high                    | low                                       |
| speed, power        | good                    | the best (3–10× faster, uses less power)  |
| modifiable?         | reprogrammable any time | no – a bug means a re-spin                |
| time to market      | fast (days)             | slow (months–a year)                      |

**NRE** (non-recurring engineering) is the one-time development and manufacturing-preparation cost. The **break-even quantity** is the quantity at which the total costs of the two solutions are equal:

**N = NRE / (unit price<sub>FPGA</sub> − unit price<sub>ASIC</sub>)**

**Example:** the ASIC's NRE is €2,000,000, its unit price €2; the FPGA's unit price is €52. N = 2,000,000 / 50 = **40,000 units**. For fewer products the FPGA, for more the ASIC is cheaper. That is why the prototype is often made on an FPGA and mass production on an ASIC.

## Design styles

- **Full-custom:** every transistor is sized and placed by hand. The best result, but very expensive – today only for the most critical parts (memory cells, analogue blocks, high-speed transceivers).
- **Standard cell:** the manufacturer provides a pre-designed, verified **cell library** (inverter, NAND, NOR, AOI, flip-flop… in several sizes and speeds). Synthesis builds the design from these, and the cells are placed in rows of equal height. **This is the main method of today's ASICs.**
- **Gate array:** prefabricated rows of transistors are connected only by the upper metal layers – cheaper and faster than standard cells, but less efficient.

## The VLSI design flow

The first steps are the same as in FPGA design (topic 11); the difference is in the physical design:

1. **Specification, architecture.**
2. **RTL description** (VHDL, Verilog, SystemVerilog) and **verification** – simulation, formal verification. For a large chip more than half of the engineering work is verification, because fixing a bug after manufacturing is very expensive.
3. **Logic synthesis** to the standard-cell library → **gate-level netlist**.
4. **Floorplan:** the location of the large blocks, memories and the power-distribution network on the chip.
5. **Placement** in the cell rows.
6. **Clock tree synthesis** (CTS): the clock is distributed by a balanced tree of buffers so that it reaches every flip-flop at nearly the same time (small **clock skew**).
7. **Routing** on the metal layers.
8. **Static timing analysis** (STA), power and signal-integrity analysis.
9. **Physical verification:** **DRC** (design rule check – does it follow the manufacturing rules, e.g. minimum line width and spacing?) and **LVS** (layout versus schematic – does the layout really implement the schematic?).
10. **Tape-out:** sending the finished layout (GDSII/OASIS file) to the factory (foundry, e.g. TSMC, Samsung, Intel). The name comes from the old hand-over on magnetic tape.
11. **Manufacturing, testing, packaging** – the first samples arrive weeks to months later.

## Testability (DFT)

During manufacturing every chip must be checked for manufacturing defects (e.g. a stuck-at signal, topic 11) – but you cannot reach inside a chip with a billion transistors with a probe tip. So testability is built in at design time (**DFT** – design for testability):

- **Scan chain:** in test mode the flip-flops are connected into one long **shift register** (topic 5). So any state can be **shifted in**, and after one clock of normal operation the result can be **shifted out** and compared with the expected value.
- **ATPG** (automatic test pattern generation): a program generates the test vectors that detect as large a portion of the possible stuck-at faults as possible (fault coverage, e.g. 99 %).
- **BIST** (built-in self-test): the chip tests itself, e.g. memories write and read back patterns with a built-in test circuit (MBIST).
- **JTAG** (IEEE 1149.1, boundary scan): a standard four-wire test port – the same one you use to program the FPGA and read the built-in logic analyser.

```python run
# Break-even quantity: FPGA or ASIC?
nre_asic = 2_000_000          # €
price_asic, price_fpga = 2, 52      # €/unit

n = nre_asic / (price_fpga - price_asic)
print("break-even quantity:", int(n))

for units in (10_000, 40_000, 100_000):
    fpga = units * price_fpga
    asic = nre_asic + units * price_asic
    cheaper = "FPGA" if fpga < asic else ("equal" if fpga == asic else "ASIC")
    print(f"{units:>7} units: FPGA {fpga:>10,} €, ASIC {asic:>10,} € -> {cheaper}")
```

## Summary

- ASIC: high NRE, low unit price, the best performance, not modifiable; FPGA: no NRE, more expensive units, flexible.
- Break-even: N = NRE / (unit price<sub>FPGA</sub> − unit price<sub>ASIC</sub>).
- Styles: full-custom, standard cell (the main method), gate array.
- Flow: RTL + verification → synthesis → floorplan → placement → clock tree → routing → STA → DRC/LVS → tape-out → manufacturing.
- DFT: scan chain, ATPG, BIST, JTAG.

## Lesson exercise

```quiz required
? An ASIC's NRE is €2,000,000, its unit price €2; the FPGA's unit price is €52. At how many units are the total costs of the two solutions equal?
= 40000
= 40 000
! NRE / (52 − 2).

? What is the main method of ASIC design today?
- placing every transistor by hand
+ standard-cell design from a pre-designed cell library
- connecting FPGAs together
- purely analogue design

? What is tape-out?
- Packaging the chip.
+ Handing over the finished layout to the factory for manufacturing.
- Running the first simulation.
- Sorting out the faulty chips.

? What does DRC check?
+ Whether the layout follows the manufacturing rules (e.g. minimum line width and spacing).
- Whether the chip is fast enough.
- Whether the HDL code is syntactically correct.
- How much power the chip consumes.

? What is the scan chain for?
- Distributing the clock on the chip.
+ In test mode it connects the flip-flops into a shift register, so the internal state can be written and read out.
- Cooling the chip.
- Speeding up the memories.

? Why is clock tree synthesis (CTS) needed?
- To increase the clock frequency.
+ So that the clock reaches every flip-flop at nearly the same time (small clock skew).
- So that fewer metal layers are needed.
- So that the chip becomes reprogrammable.
```
