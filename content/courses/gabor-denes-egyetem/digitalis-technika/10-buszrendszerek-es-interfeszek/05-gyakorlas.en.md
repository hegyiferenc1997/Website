---
title: Practice – Bus Systems and Interfaces
summary: Review questions and a summary worksheet: bus basics, bandwidth, the UART frame and parity, SPI, I²C, CAN, PCIe, DDR, differential signalling.
minutes: 60
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

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **UART frame.** Write the `uart_frame(byte, parity=None)` function, which returns a byte's UART frame as a bit list: START (0), 8 data bits **starting with the LSB**, an optional parity bit (`"even"` or `"odd"`), STOP (1)!

```python starter
def uart_frame(byte, parity=None):
    return [0] + [(byte >> i) & 1 for i in range(8)] + [1]
```

<details>
<summary>Solution</summary>

```python solution
def uart_frame(byte, parity=None):
    data = [(byte >> i) & 1 for i in range(8)]      # LSB first
    frame = [0] + data
    if parity == "even":
        frame.append(sum(data) % 2)                 # the number of 1s (with parity) is even
    elif parity == "odd":
        frame.append(1 - sum(data) % 2)
    return frame + [1]
```

</details>

```python test
assert uart_frame(0x48) == [0, 0, 0, 0, 1, 0, 0, 1, 0, 1]
assert uart_frame(0x48, "even") == [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1]
assert uart_frame(0x48, "odd") == [0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1]
assert len(uart_frame(0xFF, "even")) == 11
print("All checks passed!")
```

**2.** **Useful data rate.** Write the `useful_bytes_per_s(baud, data_bits=8, parity=False, stop_bits=1)` function, which returns how many bytes (a whole number, rounded down) can be transferred per second!

```python starter
def useful_bytes_per_s(baud, data_bits=8, parity=False, stop_bits=1):
    return baud // 8
```

<details>
<summary>Solution</summary>

```python solution
def useful_bytes_per_s(baud, data_bits=8, parity=False, stop_bits=1):
    bits_per_frame = 1 + data_bits + (1 if parity else 0) + stop_bits   # start + data + parity + stop
    return baud // bits_per_frame
```

</details>

```python test
assert useful_bytes_per_s(9600) == 960
assert useful_bytes_per_s(115200) == 11520
assert useful_bytes_per_s(115200, parity=True) == 10472
assert useful_bytes_per_s(9600, stop_bits=2) == 872
print("All checks passed!")
```

**3.** **I²C address byte.** On I²C the master first sends one byte: the 7-bit device address followed by an R/W̅ bit (1 = read, 0 = write). Write the `i2c_address_byte(addr, read)` function, which returns this byte, and raises a `ValueError` if the address doesn't fit in 7 bits!

```python starter
def i2c_address_byte(addr, read):
    return addr
```

<details>
<summary>Solution</summary>

That's why "address 0x48" and "address 0x90" are often mixed up in datasheets: one is the 7-bit address, the other the byte sent together with the R/W bit.

```python solution
def i2c_address_byte(addr, read):
    if not 0 <= addr <= 0x7F:
        raise ValueError("the address is 7 bits")
    return (addr << 1) | (1 if read else 0)    # address in the top 7 bits, R/W in the lowest
```

</details>

```python test
assert i2c_address_byte(0x48, False) == 0x90
assert i2c_address_byte(0x48, True) == 0x91
assert i2c_address_byte(0x3C, False) == 0x78  # a typical small OLED display
try:
    i2c_address_byte(0x80, False)
    assert False, "it should have raised an error"
except ValueError:
    pass
print("All checks passed!")
```

### Quick check questions

```quiz
? How many wires does the I²C bus use (apart from ground)?
= 2
! SDA (data) and SCL (clock).

? Which SPI signal selects which slave the master is talking to?
- MOSI
- SCLK
+ CS (SS)
- MISO
! Every slave has its own CS line.

? Why is signalling differential on CAN and USB?
+ because noise acting equally on both wires drops out of the difference
- because it needs fewer wires
- because then no clock is needed
! The receiver looks at the voltage difference between the two wires.

? What is the useful bandwidth of an 8 GT/s lane with 128b/130b encoding (GB/s, two decimals)?
= 0.98
= 0,98
! 8 · 128 / 130 / 8 ≈ 0.985 GB/s.

? What does full duplex transfer mean?
+ data can be sent in both directions at the same time
- data can be sent in only one direction
- data can be sent in the two directions alternately
! Sending alternately is half duplex.
```
