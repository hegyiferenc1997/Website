---
title: Serial Interfaces – UART, SPI, I²C, CAN, USB
summary: The UART frame format and speed, parity, RS-232 and RS-485; the four SPI wires and modes; I²C addressing, START/STOP and ACK; the main features of CAN and USB.
minutes: 40
---

## What you will learn

- the **UART** frame, the **baud** rate and the **parity bit**,
- the wires and operation of **SPI**,
- **I²C** addressing, the START/STOP condition and the ACK bit,
- the most important features of **CAN** and **USB**,
- how to choose an interface for a task.

## UART – the asynchronous serial port

The **UART** (universal asynchronous receiver/transmitter) uses two data wires: **TX** (transmit) and **RX** (receive), cross-connected (one side's TX to the other's RX), plus a common ground. **There is no clock**: both sides work at a preset speed (**baud** – bits/s), e.g. 9600, 115,200.

**Frame (8N1 – 8 data bits, no parity, 1 stop bit):**

```text
idle    start  D0 D1 D2 D3 D4 D5 D6 D7  stop  idle
1 1 1    0     ← data bits, LSB first →   1    1 1 1
```

- When idle, the line is **1** (high).
- The falling edge of the **start bit (0)** synchronises the receiver; it then samples in the middle of each bit time.
- The data bits go **starting with the least significant bit** (LSB first).
- An optional **parity bit** (topic 2): with **even** parity it completes the data so that the number of 1s is even.
- The **stop bit (1)** restores the idle level.

With 8N1 one byte takes **10 bits** → 9600 baud = **960 bytes/s**. The transmitter's and receiver's clocks must agree within a few %.

**Voltage levels:** a microcontroller UART is at **TTL/CMOS** level (0 / 3.3 V or 5 V). **RS-232** (the old PC serial port) uses ±3…±15 V and **inverted** logic – an interface IC is needed (MAX232). **RS-485** is a differential, half-duplex, multi-device bus up to 1200 m (industrial automation, Modbus). For USB computers a USB–UART converter chip is needed (e.g. CH340, FT232).

## SPI – serial peripheral interface

**SPI** is **synchronous**, **full duplex**, with **one master – several slaves**, for short distances (within a board).

| wire           | meaning                                     |
| -------------- | ------------------------------------------- |
| **SCLK**       | clock – provided by the master              |
| **MOSI**       | master out, slave in – data to the slave    |
| **MISO**       | master in, slave out – data to the master   |
| **CS̅** (SS̅)    | chip select – active low, **one per slave** |

- At every clock one bit goes in both directions **at once**: the shift registers (topic 5) of the two devices form a ring.
- Four modes (**CPOL**, **CPHA**: the idle level of the clock and the sampling edge) – set according to the datasheet.
- **Fast** (tens of MHz), simple, but every slave needs another CS̅ wire, and there is no acknowledgement.
- Use: SD cards, displays, Flash memories, ADCs.

## I²C – the two-wire bus

**I²C** (inter-integrated circuit, “I-squared-C”) uses only **two wires**: **SDA** (data) and **SCL** (clock). Both are **open drain** with pull-up resistors (previous lesson) → many devices, even several masters, can share the bus.

- Each slave has a **7-bit address** (2<sup>7</sup> = 128 addresses, a few reserved); the master addresses it.
- **START condition:** SDA falls while SCL is high. **STOP:** SDA rises while SCL is high. (During data, SDA may change only while SCL is low.)
- A transfer: START → 7-bit address + **R/W̅** bit → **ACK** (the slave pulls SDA low: “I'm here”) → data bytes, each followed by an ACK → STOP.
- **Half duplex**, speed 100 kHz (standard), 400 kHz (fast), 1 MHz (fast plus).
- Use: sensors (thermometer, accelerometer), EEPROM, real-time clock, small displays.

## CAN – the automotive bus

**CAN** (controller area network) is a multi-master bus on two **differential** wires (CAN_H, CAN_L), the standard of **vehicles** and industry.

- It identifies **messages**, not devices (11- or 29-bit identifier); every node sees every message and decides whether it needs it.
- **Bitwise arbitration:** a dominant 0 overrides a recessive 1 (like the wired-AND), so in a collision the message with the **lower identifier (more important)** continues without loss.
- Strong error handling (CRC, acknowledgement, switching off a faulty node); up to 1 Mbit/s (CAN FD: more).

## USB

**USB** (universal serial bus) is the standard for computer peripherals: a **differential** data pair (D+, D−), a **host–device** structure (the host controls everything), power over the cable, **plug and play** (the device introduces itself and the host loads the driver).

| version      | speed                    |
| ------------ | ------------------------ |
| USB 1.1      | 12 Mbit/s (Full Speed)   |
| USB 2.0      | 480 Mbit/s (High Speed)  |
| USB 3.x      | 5–20 Gbit/s              |
| USB4         | 40–80 Gbit/s             |

## Which one should I choose?

| aspect               | UART          | SPI            | I²C             | CAN               |
| -------------------- | ------------- | -------------- | --------------- | ----------------- |
| wires (+ ground)     | 2 (TX, RX)    | 3 + 1 per slave | 2              | 2 (differential)  |
| clock                | none          | yes            | yes             | none (bit timing) |
| devices              | 2 (point-to-point) | 1 master, several slaves | many (addressing) | many (message ID) |
| speed                | ~ 1 Mbit/s    | tens of Mbit/s | 0.1–1 Mbit/s    | 1 Mbit/s (FD: more) |
| distance             | short (long with RS-485) | within a board | within a board | up to 1 km  |

```python run
# A UART frame (8N1, LSB first) and computing even parity
def uart_frame(byte, parity=False):
    data = [(byte >> i) & 1 for i in range(8)]          # LSB first
    frame = [0] + data                                  # start bit
    if parity:
        frame.append(sum(data) % 2)                     # even parity: the number of 1s becomes even
    return frame + [1]                                  # stop bit

f = uart_frame(0x41)                                    # 'A' = 0100 0001
print("frame of 'A' (8N1):", "".join(map(str, f)), "-", len(f), "bits")
print("9600 baud, 8N1:", 9600 // 10, "bytes/s")
print("with even parity:", "".join(map(str, uart_frame(0x41, True))))
```

## Summary

- UART: asynchronous, TX/RX, start (0) + 8 data bits LSB first + (parity) + stop (1); 8N1 = 10 bits/byte.
- SPI: synchronous, full duplex, SCLK, MOSI, MISO, CS̅ (per slave); fast, within a board.
- I²C: SDA + SCL, open drain, 7-bit address, START/STOP, ACK; many devices on two wires.
- CAN: differential, message identifiers, bitwise arbitration – vehicles; USB: host–device, differential.

## Lesson exercise

```quiz required
? How many bits does a UART frame have with the 8N1 setting (start, 8 data, stop)?
= 10

? How many bytes per second does a 9600-baud UART with 8N1 transfer?
= 960

? The UART sends the byte 0100 0001 (0x41). In what order do the 8 data bits go? (Write them together, starting with the bit sent first!)
= 10000010
! The UART starts with the least significant bit.

? Even parity is used. What is the parity bit for the data 1101101?
= 1
! There are five 1s; it must be completed to an even number.

? How many wires does SPI need for a single slave (not counting ground)?
= 4
! SCLK, MOSI, MISO, CS̅.

? How many different addresses can the 7-bit I²C address express?
= 128

? Why are pull-up resistors needed on the I²C bus lines?
- Because I²C is differential.
+ Because the connected devices' outputs are open drain and can only pull down.
- Because it makes the clock faster.
- Because the pull-up resistor sets the address.

? What happens on the CAN bus if two nodes start transmitting at the same time?
- Both messages are lost and must be restarted.
+ Thanks to bitwise arbitration, the message with the lower identifier continues without loss.
- The node with the higher voltage wins.
- The bus stops.
```
