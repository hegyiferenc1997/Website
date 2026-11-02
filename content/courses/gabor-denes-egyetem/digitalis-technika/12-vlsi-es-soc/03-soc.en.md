---
title: System on a Chip (SoC)
summary: The concept and parts of an SoC (processor cores, GPU, NPU, memory controller, peripherals), IP blocks, on-chip buses (AMBA AXI, AHB, APB), FPGA SoC (Zynq), power management (clock gating, DVFS), chiplets, RISC-V.
minutes: 35
---

## What you will learn

- what an **SoC** (system on a chip) is, and what units it consists of,
- what **IP blocks** are,
- how the units communicate on the chip (**AMBA**: AXI, AHB, APB),
- what an **FPGA SoC** is,
- how an SoC saves energy (**clock gating**, **DVFS**),
- what **chiplets** are, and what **RISC-V** is.

## What is an SoC?

An **SoC** integrates a complete computer system onto a single chip. A microcontroller (topic 7) is a small SoC; large SoCs are the “brains” of phones, tablets, the Raspberry Pi and many laptops. Typical parts of a modern phone SoC:

```text
┌──────────────────────────── SoC ─────────────────────────────┐
│  CPU cores        GPU            NPU (AI accelerator)  DSP   │
│  (big + little)   (graphics)     (neural networks)  (audio)  │
│        │            │                │               │       │
│  ══════╪════════════╪══ NoC / bus ═══╪═══════════════╪════   │
│        │            │                │               │       │
│  memory         cache        image and video    peripherals  │
│  controller                  processor          (USB, I²C,   │
│  (LPDDR)                     (camera, codec)     SPI, UART)  │
│  modem (4G/5G), Wi-Fi, security unit, power controller       │
└──────────────────────────────────────────────────────────────┘
```

Advantages: smaller size, lower power (the internal wires are short), cheaper mass production, faster communication between the units. Disadvantage: designing it is an enormous and expensive job (ASIC, previous lesson).

**Heterogeneous** structure: different tasks have separate units optimised for them – graphics is done by the GPU, neural networks by the NPU, audio by the DSP, far more efficiently than by a general-purpose CPU core. The CPU cores are often of two kinds as well: **big, fast** cores for heavy tasks, **small, efficient** cores for background work (ARM big.LITTLE).

## IP blocks

Nobody designs every unit from scratch. An SoC is built like Lego from finished, purchased or in-house **IP blocks** (intellectual property cores):

- **soft IP:** synthesisable HDL code (RTL) – flexible, can be compiled for any technology;
- **hard IP:** a layout already placed and routed for a specific manufacturing technology – optimal, but not modifiable (e.g. high-speed transceivers, memories).

Examples: ARM Cortex processor cores, USB and PCIe controllers, DDR controllers. FPGA tools have IP catalogues too (Vivado IP Catalog, Quartus IP).

## On-chip buses – AMBA

IP blocks need a common “language” so that they can be connected. The most widespread is ARM's **AMBA** (Advanced Microcontroller Bus Architecture) family of standards:

| bus     | feature                                                                                      | typical use                          |
| ------- | -------------------------------------------------------------------------------------------- | ------------------------------------ |
| **AXI** | high performance, separate channels for read and write, several transactions at once, bursts | CPU, memory, DMA, GPU                |
| **AHB** | simpler, high-speed, shared bus                                                              | main bus of microcontrollers         |
| **APB** | simple, slow, low power                                                                      | slow peripherals (UART, timer, GPIO) |

In large SoCs the many units no longer communicate over one bus but over a **network on chip** (NoC), with packets, like a small computer network.

## FPGA SoC

An **FPGA SoC** combines a **hard processor** and **programmable logic** on one chip. Example: the AMD/Xilinx **Zynq** – a dual-core ARM Cortex-A9 (processing system, PS) + FPGA fabric (programmable logic, PL), with **AXI** buses between them. Linux runs on the processor, while the fast, parallel tasks (image processing, motor control, signal processing) are done by your own hardware accelerator in the FPGA part. (Similar: Intel/Altera Cyclone V SoC.)

## Power management

A phone SoC must last all day on a battery, so energy is one of the most important design aspects. Recall the dynamic power of CMOS (topic 3):

**P<sub>dyn</sub> = α · C · V<sup>2</sup> · f**

- **Clock gating:** the clock of an unused block is switched off → no switching, no dynamic power. (In topic 11 we learnt that a clock must not be gated with a simple AND gate – ASICs use a dedicated, glitch-free **integrated clock-gating cell** (ICG) for this, which the design tool inserts automatically.)
- **Power gating:** an unused block is disconnected from the supply completely → the leakage current also disappears.
- **DVFS** (dynamic voltage and frequency scaling): at low load both the frequency **and** the voltage are reduced. Since power is proportional to the **square** of the voltage, this is very effective.

**Example:** the voltage drops from 1.0 V to 0.8 V and the frequency to half → power ratio = 0.8<sup>2</sup> · 0.5 = 0.32, so the dynamic power falls to **32 %** of the original.

## Chiplets and RISC-V

- **Chiplets:** instead of one huge chip, several smaller dies (chiplets) are packaged side by side or stacked, with a high-speed interconnect. Smaller dies have a better yield (lesson 1), and the parts can even be made in different technologies (e.g. the CPU cores in the newest, the I/O in a cheaper technology). Examples: AMD Ryzen/EPYC, Apple M Ultra.
- **RISC-V:** an open, royalty-free instruction set architecture (topic 7: ISA). Anyone can design a processor for it – it is used in more and more places, from university projects to commercial SoCs, and you can try it on an FPGA too (as a soft processor).

```python run
# DVFS: dynamic power is proportional to V^2 · f
def relative_power(v_new, v_old, f_new, f_old):
    return (v_new / v_old) ** 2 * (f_new / f_old)

cases = [
    ("frequency halved only", 1.0, 1.0, 1.0, 0.5),
    ("voltage to 0.8× only", 1.0, 0.8, 1.0, 1.0),
    ("voltage 0.8×, frequency ½", 1.0, 0.8, 1.0, 0.5),
]
for name, v0, v1, f0, f1 in cases:
    print(f"{name:28} -> {relative_power(v1, v0, f1, f0) * 100:.0f} %")
```

## Summary

- SoC: a complete system on a chip – CPU (big + little cores), GPU, NPU, DSP, memory controller, peripherals, modem; heterogeneous structure.
- IP blocks: soft (RTL) and hard (finished layout); connected with AMBA buses (AXI fast, AHB medium, APB slow peripherals) or a NoC.
- FPGA SoC (Zynq): ARM processor + programmable logic with AXI.
- Energy: P = α·C·V<sup>2</sup>·f; clock gating (with an ICG cell), power gating, DVFS; chiplets, RISC-V.

## Lesson exercise

```quiz required
? With DVFS the voltage drops from 1.0 V to 0.8 V and the frequency to half. What percentage of the original dynamic power remains?
= 32
! 0.8² · 0.5.

? What is the difference between a soft and a hard IP block?
+ Soft IP is synthesisable HDL code, hard IP is a layout already finished for a specific technology.
- Soft IP is software, hard IP is hardware.
- Soft IP is free, hard IP is paid.
- There is no difference.

? Which AMBA bus would you connect an SoC's slow UART and GPIO peripherals to?
- AXI
- PCIe
+ APB
- DDR

? What is the AMD/Xilinx Zynq?
- A microcontroller containing only a processor.
+ An FPGA SoC: ARM processor cores and programmable logic on one chip, connected by AXI buses.
- A type of memory module.
- A simulator program.

? Why is the heterogeneous structure of an SoC (GPU, NPU, DSP beside the CPU) advantageous?
- Because fewer transistors are needed.
+ Because every task is done by the unit optimised for it, much faster and more efficiently than by a general-purpose CPU core.
- Because it makes the SoC reprogrammable.
- Because CPU cores cannot compute.

? Why does a chiplet structure have a better yield than a single huge chip?
- Because chiplets run at a higher clock.
+ Because a crystal defect ruins only one small die, and among small dies the proportion of good ones is higher.
- Because chiplets need no photolithography.
- Because chiplets consume no power.
```
