---
title: Programming and Applications of Robots
summary: Microcontrollers and the structure of an Arduino program, the logic of an obstacle-avoiding robot, industrial, service and autonomous robots.
minutes: 18
---

## What you will learn

- what a **microcontroller** robot program looks like (Arduino, MicroPython),
- how the logic of an **obstacle-avoiding** robot works,
- where robots are used: **industry**, **services**, **autonomous vehicles**, **cobots**.

## Microcontrollers

A **microcontroller** is a small computer on one chip (processor, memory, inputs and outputs). **Arduino** and **ESP32** are the most popular hobby and education platforms; they are programmed in a C/C++-like language (Arduino) or with **MicroPython**. The program has two parts: a **setup** that runs once and a **loop** that repeats forever.

```cpp
// Arduino: blink the LED on pin 13
void setup() {
  pinMode(13, OUTPUT);      // pin 13 is an output
}

void loop() {               // repeats forever
  digitalWrite(13, HIGH);   // LED on
  delay(500);               // wait 0.5 s
  digitalWrite(13, LOW);    // LED off
  delay(500);
}
```

## Logic of an obstacle-avoiding robot

The principle: measure → decide → act, again and again. Here is a simple Python simulation in which the range finder's values come from a list:

```python run
# Obstacle-avoiding robot simulation: measured distances in cm
readings = [80, 60, 35, 18, 12, 40, 90]

def decide(distance):
    if distance < 15:
        return "reverse and turn"
    if distance < 30:
        return "slow down and turn"
    return "straight ahead"

for d in readings:
    print(f"{d:3d} cm → {decide(d)}")
```

On real robots **ROS 2** (Robot Operating System) is the standard software framework: it gives ready modules for handling sensors, mapping and path planning.

## Applications

| Area                            | Example                                                     |
| ------------------------------- | ----------------------------------------------------------- |
| **industrial robots**           | welding, painting, assembly in car factories                |
| **cobots** (collaborative)      | small robot arms working safely in the same space as people |
| **logistics**                   | warehouse robots that bring the shelves to the worker       |
| **service robots**              | robot vacuums, robot lawn mowers, serving robots            |
| **medical robots**              | surgical robots (e.g. da Vinci), rehabilitation             |
| **autonomous vehicles, drones** | self-driving cars, delivery drones, farming drones          |
| **humanoid robots**             | human-shaped robots for factories and homes (experimental)  |

Robots take over **monotonous, dangerous or high-precision** work. Design always puts **safety** first: emergency stop button, safety fence or (for cobots) force limiting.

## Summary

- A microcontroller program: `setup()` once, `loop()` forever.
- Obstacle avoidance: measure → decide by thresholds → move.
- Applications: industry, cobots, logistics, services, medicine, autonomous vehicles.

## Exercise

```quiz required
? Which Arduino function repeats **forever**?
- setup()
+ loop()
- main()
- start()
! setup() runs once, loop() forever.

? What does the lesson's simulated robot decide at a measured distance of 25 cm?
- straight ahead
+ slow down and turn
- reverse and turn
- stop and switch off
! 15 ≤ 25 < 30.

? What are robot arms called that work safely in a shared workspace with people?
= cobot
= cobots
= collaborative robot
! collaborative robot.

? Which is the standard open-source software framework for robots?
- Excel
+ ROS 2
- Photoshop
- winget
! Robot Operating System.
```
