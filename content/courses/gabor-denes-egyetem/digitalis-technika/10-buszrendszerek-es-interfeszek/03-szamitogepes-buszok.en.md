---
title: Computer Buses – PCIe, DDR, SATA
summary: The internal connections of a PC, from parallel PCI to serial PCI Express (lanes, coding), the DDR memory bus and its bandwidth, SATA and NVMe, practical bandwidth calculations.
minutes: 30
---

## What you will learn

- how the units of a modern computer are connected,
- why serial **PCI Express** replaced parallel **PCI**,
- what a **lane** and **8b/10b**, **128b/130b** coding mean,
- how the **DDR** memory bus works and how to compute its bandwidth,
- what **SATA** and **NVMe** are.

## Internal structure of a PC

In today's processors the **memory controller** and the **PCIe controller** are on the chip. The **memory** (DDR modules) and the fastest **PCIe** devices (graphics card, NVMe SSD) connect directly to the processor; the slower peripherals (USB, SATA, network, audio) reach it through a **chipset**, which in turn connects to the CPU with a PCIe-like link.

## PCI → PCI Express

The old **PCI** bus was **parallel**, **shared** (all cards shared the same 32-bit bus) and ran at 33 MHz: 32 bits × 33 MHz ≈ **133 MB/s** in total.

**PCI Express** (PCIe), by contrast:

- is a **serial**, **point-to-point** link – every device has its own lines, no sharing;
- one **lane** is two **differential** pairs: one transmit and one receive direction (full duplex);
- several lanes can be combined: **×1, ×4, ×8, ×16** (graphics cards are ×16);
- the clock is embedded in the data stream, so **coding** is needed to guarantee enough transitions:
  - PCIe 1.0–2.0: **8b/10b** – 8 data bits carried on 10 bits → 80 % efficiency;
  - from PCIe 3.0: **128b/130b** → ≈ 98.5 % efficiency.

| version  | rate per lane (GT/s) | coding    | payload on ×1 | on ×16      |
| -------- | -------------------- | --------- | ------------- | ----------- |
| PCIe 1.0 | 2.5                  | 8b/10b    | 250 MB/s      | 4 GB/s      |
| PCIe 2.0 | 5                    | 8b/10b    | 500 MB/s      | 8 GB/s      |
| PCIe 3.0 | 8                    | 128b/130b | ≈ 985 MB/s    | ≈ 15.8 GB/s |
| PCIe 4.0 | 16                   | 128b/130b | ≈ 1.97 GB/s   | ≈ 31.5 GB/s |
| PCIe 5.0 | 32                   | 128b/130b | ≈ 3.94 GB/s   | ≈ 63 GB/s   |

(per direction; GT/s = gigatransfers per second, the bits on the line including coding)

**Example:** PCIe 1.0, one lane: 2.5 GT/s × 8/10 = **2 Gbit/s** = 250 MB/s.

## The DDR memory bus

Between memory and processor there is a **parallel**, **64-bit** data bus (per module, per channel) – with short, carefully length-matched traces, because the lowest latency matters here.

**DDR** (double data rate): data is transferred on **both the rising and the falling edge** of the clock, so there are **two transfers** per clock. The module name gives the **transfer rate** (MT/s – megatransfers per second):

- **DDR4-3200:** 1600 MHz clock, 3200 MT/s.
- Bandwidth = 3200 MT/s × 8 bytes (64 bits) = **25,600 MB/s** (that is why the module is called PC4-25600).
- In **dual-channel** mode two modules work in parallel → twice the bandwidth.

| generation | typical rate (MT/s) | supply voltage |
| ---------- | ------------------- | -------------- |
| DDR3       | 800–2133            | 1.5 V          |
| DDR4       | 1600–3200           | 1.2 V          |
| DDR5       | 4800–8400           | 1.1 V          |

## Storage: SATA and NVMe

- **SATA** (serial ATA): a serial, differential link for hard disks and SSDs; SATA III is 6 Gbit/s with 8b/10b coding → about **600 MB/s** of payload.
- **NVMe**: the SSD connects directly on **PCIe** lanes (typically ×4), with a protocol optimised for flash memory – several GB/s, very low latency (M.2 connector).

## Other external links

- **USB** (previous lesson): 480 Mbit/s (USB 2.0) = **60 MB/s** theoretical maximum, about 35–40 MB/s in practice.
- **Ethernet:** 1 Gbit/s, 10 Gbit/s … (differential pairs or optical fibre).
- **HDMI, DisplayPort:** high-speed serial video (also differential lanes).

The trend is the same everywhere: **serial, differential, point-to-point, with several lanes** – the parallel bus has survived only towards memory.

```python run
# Bandwidth calculations: PCIe, DDR, SATA, USB
def pcie(gt_s, efficiency, lanes=1):
    return gt_s * efficiency * lanes / 8        # GB/s per direction

print(f"PCIe 1.0 ×1:  {pcie(2.5, 8 / 10):.3f} GB/s")
print(f"PCIe 3.0 ×16: {pcie(8, 128 / 130, 16):.1f} GB/s")

mt_s = 3200                                     # DDR4-3200
print("DDR4-3200, 64 bit:", mt_s * 8, "MB/s")
print("SATA III:", 6000 * 8 / 10 / 8, "MB/s")
print("USB 2.0:", 480 / 8, "MB/s")
```

## Summary

- PCI: parallel, shared bus (133 MB/s); PCIe: serial, point-to-point, built from lanes (×1…×16), 8b/10b → 128b/130b coding.
- DDR: 64-bit parallel bus, two transfers per clock; bandwidth = MT/s × 8 bytes.
- SATA: serial, 6 Gbit/s (≈ 600 MB/s); NVMe: SSD directly on PCIe.
- Fast links are serial, differential and point-to-point.

## Lesson exercise

```quiz required
? What is the theoretical bandwidth of a DDR4-3200 module (64-bit data bus) in MB/s?
= 25600
= 25 600
! 3200 MT/s × 8 bytes.

? A PCIe 1.0 lane runs at 2.5 GT/s with 8b/10b coding. What is the payload data rate in Gbit/s?
= 2
! 2.5 · 8 / 10.

? What does DDR (double data rate) mean?
- It uses two memory modules.
+ It transfers data on both the rising and the falling edge of the clock.
- It works with twice the supply voltage.
- It reads the same data twice for safety.

? How many MB/s is the 480 Mbit/s rate of USB 2.0 (theoretical maximum)?
= 60

? How does PCI Express fundamentally differ from the old PCI bus?
- PCIe is parallel, PCI is serial.
+ PCIe is a serial, point-to-point link with lanes; PCI was a shared parallel bus.
- PCIe can only be used for graphics cards.
- There is no difference, only the connector differs.

? What is NVMe?
- A memory module standard.
+ A protocol with which an SSD connects directly on PCIe lanes.
- An older version of SATA.
- A type of USB connector.
```
