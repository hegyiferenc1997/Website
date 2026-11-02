---
title: How Robots Are Built and How They Work
summary: Sensors, actuators, the controller and the sense–think–act loop.
minutes: 14
---

## What you will learn

- what **parts** a robot consists of,
- what the **sense–think–act** loop is,
- what tools and languages are used to program robots,
- why robot programming is special (real time, noisy data, safety).

## What is a robot?

A robot is a machine that **senses** its environment, **makes decisions** based on the incoming data, and **acts** on the world through movement or otherwise. It can be an industrial robot arm, a robot vacuum, a drone, a self-driving car or an educational robot (e.g. LEGO, an Arduino-based toy car).

## The parts of a robot

| Part              | Job                                                          | Examples                                                                                                                       |
| ----------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| **Sensors**       | collect data about the environment and the robot's own state | distance sensor (ultrasonic, laser/LiDAR), camera, light and line sensor, bump sensor, accelerometer, gyroscope, wheel encoder |
| **Controller**    | the "brain": runs the program                                | microcontroller (Arduino), single-board computer (Raspberry Pi), industrial PLC                                                |
| **Actuators**     | turn decisions into physical effects                         | DC motor, servo motor, stepper motor, gripper, LED, speaker                                                                    |
| **Power supply**  | provides electricity                                         | battery, power supply unit                                                                                                     |
| **Communication** | connects to other devices                                    | Wi-Fi, Bluetooth, serial port                                                                                                  |

## The sense–think–act loop

A robot's program is an **endless loop** that repeats many times per second:

1. **Sense:** read the sensor values.
2. **Think:** the program's logic decides what to do.
3. **Act:** send commands to the motors.

```text
      ┌──────────┐     ┌──────────────┐     ┌────────────┐
 ───▶ │  SENSE   │ ──▶ │    THINK     │ ──▶ │    ACT     │ ──┐
 │    └──────────┘     └──────────────┘     └────────────┘   │
 └─────────────────────────────────────────────────────────── ┘
```

A simple simulation: the robot drives straight and stops when it gets closer than 20 cm to an obstacle. The "sensor" here is a predefined series of measurements.

```python run
# Simulated distance sensor: successive measurements in centimetres.
measurements = [120, 95, 70, 48, 31, 19, 12]

def sense(step: int) -> int:
    """Read the sensor value (from the list here)."""
    return measurements[step]

def think(distance: int) -> str:
    """Decide based on the distance."""
    return "stop" if distance < 20 else "forward"

def act(command: str) -> None:
    """Control the motors (here we just print)."""
    print(f"  motor: {command}")

for step in range(len(measurements)):
    distance = sense(step)
    print(f"step {step} – distance: {distance} cm")
    command = think(distance)
    act(command)
    if command == "stop":
        break
```

On a real robot we would write it the same way – only `sense()` would read the sensor and `act()` would drive the motor. The logic (`think()`) stays the same, so it **can be tested in simulation**.

## What makes robot programming different?

- **Real time:** decisions must be made in time – a late brake command causes a collision.
- **Noisy, inaccurate data:** sensor values fluctuate and are sometimes wrong. They must be filtered (e.g. average or median of several readings).
- **Uncertainty:** a wheel may slip, and the robot doesn't end up exactly where we want.
- **Safety:** a faulty program can cause physical damage – emergency stops, limits and cautious defaults are needed.
- **Simulation:** programs are first tried in a simulator (e.g. Gazebo, Webots, CoppeliaSim), and only then on expensive hardware.

## Tools and languages

| Tool / framework                         | Language                                                  | Notes                                                      |
| ---------------------------------------- | --------------------------------------------------------- | ---------------------------------------------------------- |
| **Arduino**                              | C/C++ (Arduino dialect)                                   | cheap microcontroller, education, hobby                    |
| **Raspberry Pi**                         | Python (among others)                                     | a full Linux computer, camera, network                     |
| **MicroPython**                          | Python                                                    | Python on microcontrollers (e.g. ESP32, Raspberry Pi Pico) |
| **ROS / ROS 2** (Robot Operating System) | C++, Python                                               | the standard robotics framework in research and industry   |
| **LEGO / educational robots**            | block-based, Python                                       | for beginners                                              |
| **industrial robots**                    | vendor-specific languages (e.g. KUKA KRL, ABB RAPID), PLC | production lines                                           |

A MicroPython program blinks an LED like this (it would run on real hardware; here it is just an illustration):

```python
from machine import Pin   # exists only on a microcontroller
import time

led = Pin(25, Pin.OUT)    # pin 25 is an output
while True:
    led.toggle()          # LED on/off
    time.sleep(0.5)       # wait half a second
```

## Summary

- Robot = **sensors + controller + actuators**.
- The core of the program is the **sense–think–act** loop.
- Keep the decision logic separate from the hardware – then it can be tested in simulation.
- In robotics, Python (Raspberry Pi, MicroPython, ROS) and C/C++ (Arduino, ROS) are the most widespread.

## Lesson exercise: Sense–think–act with a battery

Extend the lesson's simulation: the robot now has a battery too. Write a `cycle(readings, battery=100)` function that steps through the list of distance readings (cm) and returns the list of commands issued. In each step it decides **in this order**:

1. if the battery is below 15 %: `"charge"`, and the cycle ends,
2. if the distance is below 20 cm: `"stop"`, and the cycle ends,
3. if the distance is below 50 cm: `"slow"` – this uses 2 % battery,
4. otherwise: `"forward"` – this uses 5 % battery.

When the readings run out, the cycle ends by itself.

```python starter required
def cycle(readings, battery=100):
    commands = []
    for distance in readings:
        if distance < 20:
            commands.append("stop")
        else:
            commands.append("forward")
    return commands


print(cycle([120, 95, 70, 48, 31, 19, 12]))
```

<details>
<summary>Solution</summary>

```python solution
def cycle(readings, battery=100):
    commands = []
    for distance in readings:
        # Decide after sensing – the order matters!
        if battery < 15:
            commands.append("charge")
            break
        if distance < 20:
            commands.append("stop")
            break
        if distance < 50:
            commands.append("slow")
            battery -= 2
        else:
            commands.append("forward")
            battery -= 5
    return commands


print(cycle([120, 95, 70, 48, 31, 19, 12]))
```

</details>

```python test
assert cycle([120, 95, 70, 48, 31, 19, 12]) == ["forward", "forward", "forward", "slow", "slow", "stop"], "On the lesson's readings: 3× forward, 2× slow, then stop (and no command after it)."
assert cycle([100] * 10, battery=25) == ["forward", "forward", "forward", "charge"], "With 25 % battery it drops below 15 % after 3 forward steps: charge."
assert cycle([30, 30, 30], battery=16) == ["slow", "charge"], "Going slow uses 2 %; at 14 % it goes to charge."
assert cycle([10], battery=10) == ["charge"], "The battery check comes first, even before an obstacle."
assert cycle([]) == [], "No readings, no commands."
assert cycle([60, 50, 49, 20]) == ["forward", "forward", "slow", "slow"], "The boundaries: 50 is already forward, 20 is still slow."
```
