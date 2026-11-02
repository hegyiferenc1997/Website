---
title: Application Areas of Digital Technology
summary: Where you meet what you have learnt in computing – computers and data centres, storage and error correction (ECC), networks, embedded systems and IoT, vehicles, hardware accelerators (GPU, TPU, FPGA in the cloud), artificial intelligence, cryptography and hardware security.
minutes: 35
---

## What you will learn

- where the topics of this course appear in today's **computing**,
- how an **error-correcting code** (ECC) protects memories and storage,
- why **hardware accelerators** (GPU, TPU, FPGA) are faster than the CPU for certain tasks,
- what role digital hardware plays in **artificial intelligence** and **security**.

## Inside the computer

A modern PC or server uses almost every topic at once:

- **processor** (topic 7): adders, ALU, registers, state-machine control, cache – billions of CMOS transistors (topic 12);
- **memory** (topic 5): SRAM in the cache, DRAM on the modules, with a DDR bus (topic 10);
- **buses and interfaces** (topic 10): PCIe, USB, SATA, NVMe;
- **clock and timing** (topic 11): the maximum clock depends on the critical path.

## Storage and error correction

- **SSDs** store data in **flash memory** (topic 5); their controller is an SoC of its own that handles wear levelling and error correction.
- Server memory uses **ECC**: 8 check bits accompany every 64 data bits (**SECDED** – corrects one error, detects two), an extension of the Hamming code learnt in topic 2. A single-error-correcting Hamming code needs as many (k) check bits as make **2<sup>k</sup> ≥ data bits + k + 1** true: for 64 data bits k = 7 (128 ≥ 72), plus one more parity bit to detect double errors → 8.
- **CRC** (topic 2) is in every Ethernet frame, USB packet and file compressor to **detect** errors.

## Networks and communication

Network cards, switches and routers use high-speed **serial, differential** links (topic 10), and packet processing is often done by **dedicated hardware** (ASIC or FPGA) at line rate – more than 100 million packets per second can arrive on a 100 Gbit/s port, which software could not keep up with. Mobile and Wi-Fi devices modulate and filter with **digital signal processing** (previous lesson).

## Embedded systems and IoT

**Microcontrollers** (topic 7) are everywhere: household appliances, smartwatches, sensors, industrial controllers. Their typical task: reading sensors with an **ADC** or over **I²C/SPI** (topics 8, 10), deciding (often with a **state machine**, topic 6), acting (PWM, DAC), communicating (UART, Wi-Fi, Bluetooth). For **IoT** (internet of things) devices low power is the most important: sleep modes, clock and power gating (topic 12).

## Vehicles

A modern car has 50–100 **control units** (ECUs) communicating over the **CAN** bus (topic 10): engine control, ABS, airbag, window lifter. The image processing of driver-assistance systems (camera, radar) is done by high-performance SoCs and accelerators, and the safety-critical parts are designed and tested according to strict standards.

## Hardware accelerators

The CPU is general-purpose and executes instructions in sequence. If a task consists of **many identical, independent** operations, parallel hardware is much faster:

- **GPU:** thousands of simple compute cores – graphics, scientific computing, AI training.
- **TPU, NPU:** ASICs tailored to the matrix multiplication of neural networks, with an array of multiply-accumulate (MAC) units (**systolic array**).
- **FPGA in the cloud and the data centre:** the large cloud providers offer FPGAs as rentable accelerators, and there are FPGAs in smart network cards (SmartNICs) too – networking and storage tasks are done by hardware instead of the CPU.

**Example:** in an FPGA 100 DSP blocks work in parallel at 200 MHz, each performing one MAC operation per clock → 100 · 200 · 10<sup>6</sup> = 2 · 10<sup>10</sup> MAC/s = **20 GMAC/s**.

## Artificial intelligence

The vast majority of neural-network computation is **multiplication and addition** (matrix multiplication). Accelerators therefore:

- contain a huge number of MAC units,
- work with **low bit-width** numbers (8-bit integers – INT8 – or 16-bit floating point) – an 8-bit multiplier is much smaller and more efficient than a 32-bit one,
- treat memory bandwidth as the bottleneck, so they have large on-chip memory and a fast memory interface (HBM).

## Cryptography and hardware security

- **Encryption in hardware:** processors have dedicated instructions and circuits to accelerate AES encryption; hash computation (e.g. SHA-256) is done at high speed by ASICs.
- **True random number generator** (TRNG): produces random bits for keys from a physical noise source (topic 1, previous lesson) – a software pseudo-random generator is not secure enough for this.
- **PUF** (physically unclonable function): a unique “fingerprint” in every chip resulting from manufacturing variation – an identifier that cannot be copied.
- **Hardware security:** the secret key can be extracted from the chip's power consumption or electromagnetic emission (side-channel attack), so cryptographic circuits must be protected against this too.

```python run
# How many check bits does a single-error-correcting Hamming code need? (2^k >= m + k + 1)
def hamming_check_bits(m):
    k = 0
    while 2 ** k < m + k + 1:
        k += 1
    return k

for m in (4, 8, 16, 32, 64):
    k = hamming_check_bits(m)
    print(f"{m:2} data bits -> {k} check bits (SECDED: {k + 1})")

# Accelerator performance: DSP blocks × clock
dsp, f = 100, 200e6
print("FPGA:", dsp * f / 1e9, "GMAC/s")
```

## Summary

- At every level of the computer the topics of this course are at work: CMOS, ALU, storage elements, buses, timing.
- ECC: Hamming code (2<sup>k</sup> ≥ m + k + 1), 7 + 1 check bits for 64 data bits; CRC for detecting errors.
- Networks, IoT, vehicles (CAN), accelerators (GPU, TPU, FPGA), AI (many MACs, low bit width).
- Security: hardware AES, TRNG, PUF, protection against side-channel attacks.

## Lesson exercise

```quiz required
? How many check bits does a single-error-correcting Hamming code need for 64 data bits?
= 7
! The smallest k for which 2^k ≥ 64 + k + 1.

? In an FPGA 100 DSP blocks work in parallel at 200 MHz, each performing one MAC operation per clock. What is the performance in GMAC/s?
= 20

? Why is a GPU or a TPU faster than the CPU at neural-network computation?
- Because its clock frequency is higher.
+ Because a huge number of simple compute units (MACs) work in parallel on the many identical, independent operations.
- Because it needs no memory.
- Because it computes with text instead of floating-point numbers.

? On what bus do a car's control units communicate with each other?
- SPI
- PCIe
+ CAN
- HDMI

? Why do AI accelerators often use 8-bit integer (INT8) numbers?
- Because neural networks work only with integers.
+ Because an 8-bit multiplier is much smaller and more efficient, so many more fit on the same chip, and the precision is enough for most tasks.
- Because 32-bit numbers cannot be multiplied.
- Because then no memory is needed.

? What is the source of a true random number generator (TRNG)?
- a pre-stored number sequence
+ a physical noise source
- the processor clock
- the user's password
```
