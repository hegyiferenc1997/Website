---
title: Microcontrollers and Interfacing
summary: Microcontroller structure, peripherals (GPIO, timer, PWM, ADC, serial ports, watchdog), handling register bits with masks, well-known families, level shifting between 3.3 V and 5 V.
minutes: 35
---

## What you will learn

- the difference between a **microprocessor** and a **microcontroller**,
- the typical **peripherals** of a microcontroller,
- how to set individual **register bits** with masks (OR, AND, XOR),
- the well-known **microcontroller families**,
- how to **interface** circuits with different supply voltages.

## Microprocessor and microcontroller

- A **microprocessor** (MPU) contains only the CPU; memory and peripherals are on separate chips (e.g. a PC processor). High performance, complex system.
- A **microcontroller** (MCU) contains on one chip **the CPU, program (Flash) and data memory (SRAM), often EEPROM, and the peripherals**. Small, cheap, low power – a whole controller in one package. The brain of **embedded systems** (washing machine, car, smartwatch, IoT devices).

## Typical peripherals

| peripheral           | task                                                                           |
| -------------------- | ------------------------------------------------------------------------------ |
| **GPIO** (general-purpose I/O) | per-pin direction (in/out), internal **pull-up** resistor, open drain |
| **timer/counter**    | time measurement, periodic interrupts, counting external pulses (the counters of topic 5) |
| **PWM**              | pulse-width modulation: LED brightness, motor speed, “analog” output           |
| **ADC**              | analog-to-digital converter (topic 8): measuring sensor voltages               |
| **UART, SPI, I²C, CAN, USB** | serial communication (topic 10)                                        |
| **watchdog** timer   | if the program “hangs” and does not reset it in time, it **restarts** the system |
| **interrupt controller** | prioritised handling of peripheral events                                  |
| **sleep modes**      | µA consumption in battery devices, wake-up by interrupt                        |

**PWM:** the output is high for a fraction D of each period. The average voltage is **U<sub>avg</sub> = D · U<sub>supply</sub>** – e.g. 5 V and 25 % duty cycle → **1.25 V**. An RC filter turns it into a true analog signal (topic 8).

## Handling register bits

Peripherals are controlled by bits of **registers** (e.g. the direction of a port's 8 pins is one 8-bit register). A bit must be modified so that the others **do not change** – that is what bitwise operations and **masks** are for:

| operation         | expression                  | example (n = 3)                       |
| ----------------- | --------------------------- | ------------------------------------- |
| **set** a bit (1) | `reg = reg OR (1 << n)`     | 0000 0001 OR 0000 1000 = **0000 1001** |
| **clear** a bit (0) | `reg = reg AND NOT (1 << n)` | 1011 1111 AND 1111 0111 = **1011 0111** |
| **toggle** a bit  | `reg = reg XOR (1 << n)`    | 0000 1001 XOR 0000 1000 = 0000 0001   |
| **test** a bit    | `(reg AND (1 << n)) ≠ 0`    | “is it on?”                           |

These rest on the identities of topic 3: X + 1 = 1, X · 0 = 0, X ⊕ 1 = X̅, and next to 0 / 1 the other bits stay unchanged.

## Well-known families

| family                     | feature                                                                |
| -------------------------- | ---------------------------------------------------------------------- |
| **AVR** (ATmega328P – Arduino Uno) | 8-bit RISC, Harvard; 16 MHz, 32 KB Flash, 2 KB SRAM, 1 KB EEPROM |
| **PIC** (Microchip)        | 8–32-bit, widespread in industrial applications                        |
| **ARM Cortex-M** (e.g. STM32) | 32-bit, wide range from M0 to M7, industrial and automotive         |
| **ESP32** (Espressif)      | 32-bit, dual-core, **Wi-Fi and Bluetooth** built in – IoT              |
| **RP2040** (Raspberry Pi Pico) | dual-core Cortex-M0+, programmable I/O (PIO)                       |

## Level shifting

A signal is interpreted correctly only if the driver's **output** levels are within the receiver's **input** limits (topic 1):

- **V<sub>OH</sub> ≥ V<sub>IH</sub>** and **V<sub>OL</sub> ≤ V<sub>IL</sub>**

Typical values:

| family                | V<sub>IH</sub> (min) | V<sub>IL</sub> (max) | V<sub>OH</sub> (min) | V<sub>OL</sub> (max) |
| --------------------- | -------------------- | -------------------- | -------------------- | -------------------- |
| TTL (5 V)             | 2.0 V                | 0.8 V                | 2.4 V                | 0.4 V                |
| CMOS (5 V)            | 3.5 V (0.7 · V<sub>CC</sub>) | 1.5 V        | ≈ 4.9 V              | ≈ 0.1 V              |
| LVCMOS (3.3 V)        | 2.0 V                | 0.8 V                | ≈ 2.4–3.3 V          | 0.4 V                |

Consequences:

- **3.3 V → 5 V CMOS input:** 3.3 V is **less** than the 3.5 V V<sub>IH</sub> – not reliable! Solution: a **level shifter** (e.g. **TXS0108E** bidirectional, **74LVC245** unidirectional), an HCT IC with TTL-level inputs, or a transistor stage.
- **5 V → 3.3 V input:** the excess voltage can **damage** the input (unless it is “5 V tolerant”). Solution: a resistor divider or a level-shifter IC.
- **Open-collector / open-drain output** with a pull-up resistor: the pull-up can go to the **receiver's** supply – this is how the I²C bus can work across supply voltages.
- **Totem-pole** (push-pull) output: actively pulls both up and down, fast, but two such outputs must not be connected together.

```python run
# Setting, clearing and toggling register bits with masks
def show(name, value):
    print(f"{name:12} {value:08b}")

reg = 0b00000001
show("start", reg)
reg |= 1 << 3                 # set bit 3
show("bit 3 = 1", reg)
reg &= ~(1 << 0) & 0xFF       # clear bit 0
show("bit 0 = 0", reg)
reg ^= 1 << 7                 # toggle bit 7
show("bit 7 XOR", reg)
print("is bit 3 on?", bool(reg & (1 << 3)))
```

## Summary

- MCU = CPU + Flash + SRAM (+ EEPROM) + peripherals on one chip; embedded systems.
- Peripherals: GPIO, timer, PWM (U<sub>avg</sub> = D · U<sub>supply</sub>), ADC, serial ports, watchdog.
- Bit handling: set with OR, clear with AND NOT, toggle with XOR.
- Interfacing: V<sub>OH</sub> ≥ V<sub>IH</sub>, V<sub>OL</sub> ≤ V<sub>IL</sub>; a level shifter between 3.3 V and 5 V.

## Lesson exercise

```quiz required
? What distinguishes a microcontroller from a microprocessor?
- A microcontroller has no ALU.
+ A microcontroller contains the CPU, the memories and the peripherals on one chip.
- A microcontroller processes only analog signals.
- A microprocessor is always slower.

? A register holds 00000001. What will it hold if bit 3 is set with an OR operation? (on 8 bits)
= 00001001

? A register holds 10110111. What will it hold if bit 0 is cleared (AND 11111110)? (on 8 bits)
= 10110110

? What is the watchdog timer for?
- Measuring the exact time.
+ If the program hangs and does not reset it in time, it restarts the system.
- Generating the PWM signal.
- Increasing the clock frequency.

? A 5 V PWM output has a duty cycle of 25 %. What is the average voltage in volts?
= 1.25
= 1,25
! U_avg = D · U_supply.

? What is the V_IH threshold of a 5 V CMOS input (0.7 · V_CC), in volts?
= 3.5
= 3,5
! That is why a 3.3 V output is not reliably enough.

? The output of a 3.3 V microcontroller must be connected to the input of a 5 V CMOS IC. What is the correct solution?
- Connect them directly, 3.3 V is enough.
+ Use a level shifter (e.g. TXS0108E) or an IC with TTL-level (HCT) inputs.
- Put a series resistor between them, which raises the voltage.
- Invert the polarity of the signal.
```
