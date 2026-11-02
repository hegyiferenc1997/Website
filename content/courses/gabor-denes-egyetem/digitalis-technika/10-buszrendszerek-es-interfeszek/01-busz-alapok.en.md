---
title: Bus Basics
summary: The concept of a bus, parallel and serial transfer, synchronous and asynchronous transfer, three-state and open-drain outputs, master–slave and arbitration, handshaking, bandwidth, duplex modes, differential signalling.
minutes: 30
---

## What you will learn

- what a **bus** is and how **parallel** and **serial** transfer differ,
- **synchronous** and **asynchronous** transfer,
- how several devices can share a wire (**three-state**, **open-drain** outputs),
- what **master**, **slave**, **arbitration** and **handshaking** are,
- how to compute **bandwidth**,
- the **duplex** modes and **differential** signalling.

## What is a bus?

A **bus** is a group of wires over which **several devices** exchange data **jointly**, according to a common **set of rules** (protocol). In topic 7 we saw the processor's address, data and control buses; the same principle applies between chips, boards and computers.

## Parallel and serial transfer

- **Parallel:** every bit of a word goes **on a separate wire, at the same time** (e.g. 8 or 32 data lines). Simple and fast over short distances.
- **Serial:** the bits go **one after another, on one (or a few) wires**. Fewer wires, cheaper connectors, long distances.

At high speed the parallel bus gets into trouble: the wire delays differ slightly (**skew**), and the wires disturb each other (**crosstalk**) – that is why almost every fast link today is **serial** (PCIe, USB, SATA, Ethernet); where even more speed is needed, several independent serial “lanes” are used side by side.

## Synchronous and asynchronous transfer

- **Synchronous:** a separate **clock wire** indicates when the data is valid (SPI, I²C, parallel memory bus).
- **Asynchronous:** there is no common clock; transmitter and receiver work at a **pre-agreed speed**, and the receiver synchronises from the start of the frame (UART). High-speed serial links **embed** the clock in the data stream (clock recovery, e.g. 8b/10b coding).

## Sharing a wire

If two normal (totem-pole) outputs drive the same wire at once with opposite levels, a short circuit results. Solutions:

- **Three-state (tri-state) output:** besides 0 and 1 there is a **third, high-impedance** (Z) state, in which the output “disconnects” from the wire. An **enable** signal (OE̅) decides which device drives; the others are in Z. (The 74245 bus driver and every memory data output are like this.)
- **Open-collector / open-drain output:** the output can only **pull down** to 0, the high level is provided by a shared **pull-up resistor**. If **any** device pulls it down, the line is 0 – this is the **wired-AND**. No short circuit is possible, and anyone can signal (I²C, interrupt lines).

## Master, slave, arbitration, handshake

- The **master** (initiator) starts the transfer and provides the address; the **slave** responds.
- If there are several masters, **arbitration** decides who gets the bus (e.g. by priority, or bit by bit with I²C/CAN: whoever sends 0 “wins”).
- **Handshake:** transmitter and receiver confirm to each other with signals that the data is ready / taken (e.g. READY–ACK, or the ACK bit of I²C). This lets a slower device keep up.

## Bandwidth

The **theoretical bandwidth** (data rate) of a bus:

**bandwidth = width (bits) × transfer frequency**

Example: 32-bit bus, 100 MHz, one transfer per clock → 3.2 Gbit/s = **400 MB/s**. In reality it is less: addressing, handshaking and protocol overhead also take time.

## Duplex modes

| mode             | meaning                                          | example                   |
| ---------------- | ------------------------------------------------ | ------------------------- |
| **simplex**      | one direction only                               | radio broadcast           |
| **half duplex**  | both directions, but **alternately**             | I²C, RS-485, walkie-talkie |
| **full duplex**  | both directions **at the same time**             | UART (TX and RX), SPI, Ethernet |

## Differential signalling

The signal is carried by the **difference between two wires** (one +, the other −). External noise affects both wires equally, so it **cancels in the difference** (common-mode rejection). This allows high speed and long distance with a small voltage swing: **LVDS**, **RS-485**, **CAN**, **USB**, **PCIe**, **Ethernet** – all differential.

```python run
# Bus bandwidth and simulating an open-drain line (wired-AND)
def bandwidth(bits, f_hz, transfers_per_clock=1):
    return bits * f_hz * transfers_per_clock / 8 / 1e6     # MB/s

print("32 bit, 100 MHz:", bandwidth(32, 100e6), "MB/s")
print("64 bit, 1600 MHz, DDR:", bandwidth(64, 1600e6, 2), "MB/s")

# Open drain: the line is 1 only if nobody pulls it down
pulling = [0, 0, 1, 0]           # devices: 1 = pulls the line down
line = int(not any(pulling))
print("line level:", line)
```

## Summary

- Bus: shared wires, shared protocol; parallel (many wires) or serial (few).
- Synchronous (with a clock) or asynchronous (agreed speed) transfer.
- Sharing: three-state output (OE̅, Z) or open drain + pull-up resistor (wired-AND).
- Bandwidth = width × frequency; differential signal: noise-immune, fast, long reach.

## Lesson exercise

```quiz required
? What is the theoretical bandwidth of a 32-bit, 100 MHz bus in MB/s (one transfer per clock)?
= 400
! 32 bits × 100 MHz = 3200 Mbit/s, divided by 8.

? What is a three-state (tri-state) output for?
- Producing three different voltage levels.
+ Letting an inactive device “disconnect” from the shared bus in a high-impedance state.
- Amplifying the signal.
- Generating the bus clock.

? Four devices are connected to an open-drain line with a pull-up resistor; one of them pulls the line down, the others do not. What is the logic level of the line?
= 0
! Wired-AND: one device pulling down is enough.

? What does half-duplex transfer mean?
- Data can go in one direction only.
+ Both directions are possible, but only alternately.
- Data goes in both directions at the same time.
- Half of the data is lost.

? Why is differential signalling noise-immune?
- Because it uses a higher voltage.
+ Because external noise affects both wires equally and cancels in the difference.
- Because it uses only one wire.
- Because it is slower.

? Why have serial links replaced parallel buses at high speed?
- Because serial transfer always needs less energy.
+ Because the differing delays (skew) and crosstalk of many parallel wires limit the speed.
- Because a parallel bus cannot be addressed.
- Because a serial link needs no protocol.
```
