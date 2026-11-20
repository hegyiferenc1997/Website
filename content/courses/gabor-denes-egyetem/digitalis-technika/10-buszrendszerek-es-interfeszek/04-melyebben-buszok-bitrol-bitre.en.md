---
title: Deeper – Buses Bit by Bit
summary: Building and decoding a UART frame with a parity check, the cost of framing (useful data rate), I²C arbitration simulated on the open-drain line, and the bandwidth of PCI Express by generation, including the efficiency of its encoding.
minutes: 40
---

## What you will learn in this lesson

- to **build and decode** a UART frame bit by bit, and see how parity catches a single-bit error,
- to **calculate** the useful data rate after framing,
- to **simulate** how two I²C masters transmitting at once decide who may continue – without collision or data loss,
- to **calculate** PCI Express bandwidth by generation, and understand the role of 8b/10b and 128b/130b encoding.

## 1. A UART frame bit by bit

When idle, a UART holds the line at 1. Transferring a byte: a **START bit (0)**, 8 data bits **starting with the least significant** (LSB first), optionally a **parity bit**, and finally a **STOP bit (1)**. The receiver knows from the falling edge of the START bit when the frame begins, and from there it samples **in the middle of each bit time** according to the agreed baud rate.

```python run
# A UART frame bit by bit: START (0), 8 data bits starting with the LSB, even parity, STOP (1)
def uart_frame(byte, parity=True):
    data = [(byte >> i) & 1 for i in range(8)]       # the LSB goes out first!
    frame = [0] + data
    if parity:
        frame.append(sum(data) % 2)                  # even parity: the number of 1s must be even
    return frame + [1]

def uart_receive(frame, parity=True):
    assert frame[0] == 0 and frame[-1] == 1, "framing error"
    data = frame[1:9]
    if parity and sum(data) % 2 != frame[9]:
        return None                                  # parity error
    return sum(b << i for i, b in enumerate(data))

for ch in "Hi":
    f = uart_frame(ord(ch))
    print(f"{ch!r} = 0x{ord(ch):02X} = {ord(ch):08b} → on the wire: {''.join(map(str, f))}"
          f" → decoded: {chr(uart_receive(f))!r}")

bad = uart_frame(ord("H"))
bad[3] ^= 1                                          # one data bit flips on the wire
print("one bit flipped → receiver:", uart_receive(bad), "(parity error, the byte is dropped)")

for name, bits_per_byte in [("8N1", 10), ("8E1", 11)]:
    print(f"{name}: {bits_per_byte} bits/byte → at 115,200 baud {115200 // bits_per_byte} bytes/s, "
          f"efficiency {8 / bits_per_byte:.0%}")
```

Three things are worth noticing:

- "H" (0x48 = 01001000) goes out on the wire in **reversed bit order**: 0 (start), 00010010 (starting with the LSB), 0 (parity), 1 (stop). Anyone looking at a UART signal with a logic analyser has to do this reversal in their head (or let the protocol decoder do it).
- **Parity** notices a flipped data bit, and the receiver drops the byte. It wouldn't notice two flipped bits, though (topic 2!).
- Framing has a cost: with 8N1 (8 data bits, no parity, 1 stop) **10 bits** carry 8 useful bits, so the efficiency is **80%**. At 115,200 baud that's 11,520 bytes/s – not 14,400!

## 2. I²C arbitration: who may speak?

An I²C bus can have several masters, and they may start transmitting **at the same time**. The solution is brilliantly simple, and it relies on the **open-drain** output: anyone can pull the line to 0, and only the pull-up resistor holds it at 1. So the line is the **AND** of the participants' bits (_wired AND_). Every master **reads back** the line while transmitting: if it sent a 1 but sees a 0, it knows someone else is transmitting too – and quietly backs off.

```python run
# I²C arbitration: two masters start transmitting at once on the open-drain (wired-AND) SDA line
def arbitration(addr1, addr2):
    for i in reversed(range(7)):                     # 7-bit address, MSB first
        b1, b2 = (addr1 >> i) & 1, (addr2 >> i) & 1
        line = b1 & b2                               # if anyone pulls it to 0, the line is 0
        print(f"  bit {i}: A sends {b1}, B sends {b2} → SDA = {line}")
        if b1 != line:
            return "B won (A sent 1 but read back 0, so it backs off)"
        if b2 != line:
            return "A won (B sent 1 but read back 0, so it backs off)"
    return "same address – both continue"

A, B = 0x48, 0x4C                                    # e.g. the addresses of a thermometer and another sensor
print(f"A's address {A:07b}, B's address {B:07b}")
print(arbitration(A, B))
```

The two addresses agree in the first 4 bits; there both masters see what they sent. At bit 2, A sends 0 and B sends 1 – the line becomes 0, B notices the difference and backs off. **The winner's message doesn't lose a single bit**: there was no collision, one party just went quiet. Consequence: the device with the **lower address** (sending a 0 earlier) wins – which also works as a priority.

The same principle works on the **CAN bus** in cars: there a lower message identifier means higher priority, so a message from the braking system always beats, say, one from the window motor.

## 3. PCI Express bandwidth by generation

PCIe is a serial, point-to-point link with **lanes**: x1, x4, x16. A lane's speed is given in GT/s (billion transfers per second) – but not every transferred bit is useful! The receiver has to recover the clock from the signal, which needs enough signal transitions, so the data is **encoded**:

- **8b/10b** (PCIe 1.0 and 2.0): carries 8 useful bits on 10 bits – a 20% loss,
- **128b/130b** (from PCIe 3.0): 128 bits on 130 bits – only about a 1.5% loss.

```python run
# PCI Express bandwidth by generation: transfer rate, encoding, lanes
generations = [
    # name, GT/s (billion bits per second per lane), useful bits / transferred bits
    ("PCIe 1.0", 2.5, 8 / 10),
    ("PCIe 2.0", 5.0, 8 / 10),
    ("PCIe 3.0", 8.0, 128 / 130),
    ("PCIe 4.0", 16.0, 128 / 130),
    ("PCIe 5.0", 32.0, 128 / 130),
]
print(f"{'':<9} {'encoding':>8} | {'x1':>6} | {'x4':>6} | {'x16':>6}   (GB/s, per direction)")
for name, gts, eff in generations:
    lane = gts * eff / 8                             # GB/s on one lane: bits → bytes
    print(f"{name:<9} {eff:>8.1%} | {lane:>6.2f} | {4 * lane:>6.2f} | {16 * lane:>6.2f}")
```

Notice: the transfer rate of PCIe 3.0 (8 GT/s) is **not twice** that of 2.0 (5 GT/s), yet the useful bandwidth almost exactly doubled – thanks to the more efficient encoding. That's why the unit matters: **GT/s** is the number of transferred bits, **GB/s** the useful data.

A practical example: the theoretical maximum of a PCIe 4.0 x4 NVMe SSD is about **7.9 GB/s** – the measured ~7 GB/s in reality is close to it. If you put the same SSD into a PCIe 3.0 motherboard, it manages at most about 3.9 GB/s – the bus becomes the bottleneck, not the drive.

## Summary

- UART: START (0) + 8 data bits starting with the LSB + (parity) + STOP (1); the receiver samples in the middle of the bit time. The efficiency of 8N1 is 80%.
- I²C arbitration: open drain → wired AND; whoever sends 1 but reads back 0 backs off. The winner's data stays intact, the lower address wins. CAN works the same way.
- Serial buses need encoding for clock recovery: 8b/10b (80%), 128b/130b (~98.5%). GT/s ≠ GB/s.

## Lesson exercise

```quiz required
? What is the useful data rate in bytes/s on a 9600 baud UART set to 8N1?
= 960
! 10 bits per byte (start + 8 data + stop): 9600 / 10 = 960.

? In what order do the data bits of a UART frame go out?
- starting with the most significant bit (MSB)
+ starting with the least significant bit (LSB)
- first the even, then the odd bits
- in any order, the parity indicates it
! LSB first – that's why the bit order on the wire is reversed.

? Two I²C masters transmit at once. One of them sends a 1 but reads back a 0 from the line. What does it do?
- keeps transmitting, because its address is more important
+ backs off, and the other master continues undisturbed
- both stop and start again later
- signals the error with a STOP condition
! Wired AND: the 0 is "stronger", and the winner's data stays intact.

? What percentage is the efficiency of 8b/10b encoding?
= 80
! 8 useful bits / 10 transferred bits.

? Roughly how many GB/s is the useful bandwidth of a PCIe 3.0 x4 link per direction (one decimal)?
= 3.9
= 3,9
! 8 GT/s · 128/130 / 8 ≈ 0.985 GB/s per lane, four times that ≈ 3.9 GB/s.
```
