---
title: Practice – Bus Systems and Interfaces
summary: Review questions and a summary worksheet: bus basics, bandwidth, the UART frame and parity, SPI, I²C, CAN, PCIe, DDR, differential signalling.
minutes: 35
kind: practice
---

## Review questions

<details>
<summary>1. What is the difference between a three-state and an open-drain output?</summary>

A three-state output actively drives both 0 and 1, but an enable signal can switch it to a high-impedance (Z) state; only one device may drive the bus at a time. An open-drain output can only pull down, the high level comes from the shared pull-up resistor; so several devices can “talk” at once without a short circuit (wired-AND).

</details>

<details>
<summary>2. Why does the UART have no clock wire, and how can the receiver still sample?</summary>

Because both sides work at a pre-agreed speed (baud). The receiver synchronises on the falling edge of the start bit, then samples in the middle of each bit time. For this the two clocks must agree within a few %; after the stop bit, the next start bit resynchronises.

</details>

<details>
<summary>3. When would you choose SPI and when I²C?</summary>

SPI when high speed is needed with one or two devices (SD card, display, Flash): fast and full duplex, but every slave needs its own CS̅ wire. I²C when many slower devices (sensors, EEPROM, clock) must be handled with few pins: two wires, addressing, ACK, but only a few hundred kHz.

</details>

<details>
<summary>4. Why does PCIe need coding (8b/10b, 128b/130b)?</summary>

Because there is no separate clock wire: the receiver recovers the clock from the transitions in the data stream. The coding guarantees frequent enough transitions and a balanced ratio of 0s and 1s. The price is efficiency: 80 % with 8b/10b, about 98.5 % with 128b/130b.

</details>

<details>
<summary>5. Why has the memory bus stayed parallel while almost everything else became serial?</summary>

Because for memory the lowest latency matters most, and the modules are very close to the processor. With short, length-matched traces the 64-bit parallel bus is manageable, and DDR, with two transfers per clock, gives high bandwidth without serialisation.

</details>

## Summary worksheet

```quiz required
? What is the theoretical bandwidth of a 64-bit, 200 MHz bus in MB/s (one transfer per clock)?
= 1600
! 64 bits = 8 bytes, 8 · 200.

? How many bits is a UART frame with 8 data bits, even parity and 1 stop bit (8E1)?
= 11
! start + 8 data + parity + stop.

? Even parity is used. What is the parity bit for the data byte 1011 0010?
= 0
! There are four 1s, already even.

? A display needs a 20 MHz full-duplex data link within a board. Which interface is the most suitable?
- I²C
+ SPI
- CAN
- RS-232

? A PCIe 2.0 lane runs at 5 GT/s with 8b/10b coding. What is the payload data rate in MB/s in one direction?
= 500
! 5 · 8/10 = 4 Gbit/s, divided by 8.

? What is the theoretical bandwidth of a DDR4-2400 module (64 bits) in MB/s?
= 19200
= 19 200

? In a car many control units communicate in a noisy environment, over several metres. Which bus is appropriate?
- SPI
- I²C
+ CAN
- parallel bus

? What characterises differential signalling?
- It carries the signal on a single wire relative to ground.
+ The signal is carried by the voltage difference of two wires, so common noise cancels.
- It uses twice the voltage of TTL.
- It works only over optical fibre.
```
