---
title: FPGA Architecture and the Design Flow
summary: CLB, LUT and flip-flop, interconnect, block RAM, DSP, PLL and I/O blocks; the design steps from HDL code to bitstream; pin assignment with XDC and QSF files; FPGA compared with a microcontroller.
minutes: 30
---

## What you will learn

- the **building blocks** of an FPGA (CLB, interconnect, block RAM, DSP, PLL, I/O),
- the design steps **from HDL code to bitstream**,
- how to connect the design's signals to the FPGA's **pins** (XDC, QSF),
- how an FPGA differs from a **microcontroller**.

## Building blocks of an FPGA

1. **Configurable logic blocks (CLB):** LUTs, D flip-flops, fast carry chains (for adders) and multiplexers. They form the combinational and sequential logic: state machines, counters, arithmetic.
2. **Programmable interconnect:** the wires and switches between the cells – a large part of the chip area.
3. **Block RAM (BRAM):** built-in SRAM blocks of a few kilobits for buffers, FIFOs, tables.
4. **DSP blocks:** fast multiply–add units for signal processing (filters, FFT, AI).
5. **Clock management:** PLL/MMCM (phase-locked loop) – multiplying, dividing and phase-shifting clocks; a dedicated clock network so that the clock reaches every flip-flop simultaneously.
6. **I/O blocks (IOB):** the pin drivers, with many voltage standards (LVCMOS33, LVDS …), and high-speed serial transceivers (PCIe, Ethernet).
7. Some families also have a **built-in processor** (e.g. Xilinx Zynq: ARM cores + FPGA) – a **SoC FPGA** (topic 12).

**Vendors:** AMD (Xilinx) – Spartan, Artix, Kintex, Virtex, Zynq, tool: **Vivado**; Intel (Altera) – Cyclone, Arria, Stratix, tool: **Quartus**; Lattice (low power, also an open-source toolchain), Microchip (Microsemi).

## The design flow

1. **Specification and description in an HDL** (VHDL or Verilog) – or with schematics, IP blocks.
2. **Functional simulation** with a testbench (topic 11): does the logic work correctly?
3. **Synthesis:** the HDL description becomes a **gate-level circuit** (netlist) – LUTs, flip-flops, BRAM, DSP. The tool simplifies here (like a K-map, only automatically).
4. **Implementation:** **placement** (which cell each element goes into) and **routing** (which wires carry the signals).
5. **Timing analysis** (static timing analysis): does T ≥ t<sub>cq</sub> + t<sub>logic</sub> + t<sub>su</sub> (topic 4) hold on every path for the given clock?
6. Generating the **bitstream** – the configuration file.
7. **Configuration:** downloading the bitstream via JTAG into the FPGA (or into the configuration Flash), then **testing** on real hardware (logic analyser, built-in ILA).

## Pin assignment (pin mapping)

The HDL code only describes **logical ports** (clk, rst, led …). Which **physical pin** each goes to and at what voltage level is given by a separate **constraint file** – it follows from the board's schematic.

**Xilinx – XDC** (Tcl commands):

```tcl
# Clock on pin K17, with 3.3 V CMOS levels
set_property PACKAGE_PIN K17 [get_ports clk]
set_property IOSTANDARD LVCMOS33 [get_ports clk]
create_clock -period 8.000 -name sys_clk [get_ports clk] ;# 125 MHz

# Reset and bit 0 of a bus
set_property PACKAGE_PIN L18 [get_ports rst]
set_property IOSTANDARD LVCMOS33 [get_ports rst]
set_property PACKAGE_PIN P15 [get_ports {data_in[0]}]
set_property IOSTANDARD LVCMOS33 [get_ports {data_in[0]}]
```

- **PACKAGE_PIN**: the physical pin; **IOSTANDARD**: the voltage standard (LVCMOS33 = 3.3 V CMOS).
- **create_clock**: specifies the clock period – from this the timing analyser knows how much delay is allowed.
- Two Tcl pitfalls: an end-of-line comment needs a **`;`** before it (`;# …`), otherwise `#` is not a comment; a bus bit must be put in **braces** (`{data_in[0]}`), because square brackets mean a command in Tcl.
- Older Xilinx tools (ISE) used the **UCF** format: `NET "clk" LOC = K17 | IOSTANDARD = LVCMOS33;`

**Intel – QSF** (Quartus):

```tcl
# Pin assignment in Intel Quartus
set_location_assignment PIN_A1 -to clk
set_location_assignment PIN_B2 -to rst
set_location_assignment PIN_C3 -to data_in[0]
set_instance_assignment -name IO_STANDARD "3.3-V LVCMOS" -to clk
```

Both tools also offer a graphical pin planner and report an error if a port is not assigned to a pin.

## FPGA or microcontroller?

|                          | **FPGA**                                           | **microcontroller**                               |
| ------------------------ | -------------------------------------------------- | ------------------------------------------------- |
| operation                | **hardware parallelism** – everything runs at once | software, instruction by instruction, in sequence |
| “programming”            | describing hardware (HDL)                          | writing a program (C, Python, assembly)           |
| flexibility              | fully custom logic, custom interfaces              | fixed peripherals                                 |
| timing                   | ns-accurate, deterministic                         | µs, less predictable because of interrupts        |
| power, price, complexity | higher                                             | lower, cheaper, simpler                           |

They are often used **together**: the FPGA does the fast, parallel signal processing, the processor the control and communication.

## Summary

- FPGA = CLBs (LUT + FF) + interconnect + BRAM + DSP + PLL + I/O.
- Flow: HDL → simulation → synthesis → place and route → timing analysis → bitstream → configuration.
- Pin assignment: XDC (Xilinx, Tcl), QSF (Intel); PACKAGE_PIN, IOSTANDARD, create_clock.
- FPGA: hardware parallelism; microcontroller: software, sequential execution.

## Lesson exercise

```quiz required
? What happens during synthesis?
- The bitstream is downloaded into the FPGA.
+ The HDL description becomes a gate-level circuit (LUTs, flip-flops).
- The cells are placed and the wires are chosen.
- The finished circuit is measured with a logic analyser.

? Which is the correct order of the design steps?
- synthesis → HDL description → bitstream → place and route
+ HDL description → synthesis → place and route → bitstream
- bitstream → synthesis → HDL description → configuration
- place and route → HDL description → synthesis → bitstream

? Which property in an XDC file gives a port's physical pin?
+ PACKAGE_PIN
- IOSTANDARD
- create_clock
- LOC_VOLTAGE

? The clock in an XDC file: create_clock -period 8.000. What is the clock frequency in MHz?
= 125
! f = 1 / 8 ns.

? What are the DSP blocks of an FPGA for?
- Storing the configuration.
+ Fast multiplication and addition (filters, FFT, AI).
- Generating the clock.
- Adapting the voltage levels of the pins.

? How does an FPGA fundamentally differ from a microcontroller?
- An FPGA is programmed in C.
+ In an FPGA the described hardware works in parallel; a microcontroller executes the program instruction by instruction, in sequence.
- The microcontroller is always faster.
- An FPGA has no clock.
```
