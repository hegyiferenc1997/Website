---
title: What Is a Robot and What Is It Made Of?
summary: The concept of a robot, the sense–think–act cycle, sensors, actuators, controller.
minutes: 15
---

## What you will learn

- what a **robot** is and how it differs from a simple machine,
- what the **sense → think → act** cycle is,
- the main parts of a robot: **sensors**, **actuators**, **controller**.

## What is a robot?

A **robot** is a programmable machine that **senses** its environment, **decides** based on the incoming data, and physically **acts** – at least partly on its own. A washing machine follows a fixed program; a robot vacuum, however, senses walls and stairs and turns accordingly.

The word comes from Karel Čapek's 1920 play _R.U.R._ (Czech _robota_ = forced labour).

## The sense–think–act cycle

```text
        ┌──────────────┐
        │ ENVIRONMENT  │◄────────────┐
        └──────┬───────┘             │
               │ measuring           │ moving
        ┌──────▼───────┐      ┌──────┴───────┐
        │   sensors    │      │  actuators   │
        └──────┬───────┘      └──────▲───────┘
               │ data                │ command
               └──────► controller ──┘
                      (program, decision)
```

The cycle runs many times per second.

## Parts of a robot

**Sensors** – the robot's “senses”:

| Sensor                              | What does it measure?           |
| ----------------------------------- | ------------------------------- |
| ultrasonic / infrared range finder  | distance to an obstacle         |
| bump sensor (micro switch)          | whether it touched something    |
| camera                              | image (recognition, tracking)   |
| LIDAR                               | 3D distance map with a laser    |
| gyroscope, accelerometer (IMU)      | rotation, acceleration, balance |
| encoder                             | how much a wheel / motor turned |
| temperature, light, pressure sensor | properties of the environment   |

**Actuators** – how the robot affects the world: **DC motor** (wheels), **servo motor** (moves to an exact angle), **stepper motor** (exact steps, 3D printers), pneumatic/hydraulic cylinder, gripper, speaker, LED.

**Controller** – the robot's “brain”: a **microcontroller** (Arduino, ESP32, Raspberry Pi Pico), a small computer (Raspberry Pi) or an industrial controller (**PLC**). The program runs on it.

**Power** – battery or mains supply; **mechanics** – frame, wheels, joints.

## Degrees of freedom

A robot arm's **degrees of freedom** (DoF) tell how many independent directions it can move in. A typical industrial robot arm has 6 degrees of freedom: so it can bring the gripper to any position at any angle.

## Summary

- Robot = a programmable machine that senses, decides and acts.
- Its parts: sensors, actuators, controller, power, mechanics.
- Degrees of freedom = the number of independent directions of motion (industrial arm: 6).

## Exercise

```quiz required
? What is the correct cycle of how a robot works?
+ sense → think → act
- act → sense → switch off
- think → store → print
- charge → wait → sense
! The cycle repeats continuously.

? Which one is an **actuator**?
- ultrasonic range finder
- camera
+ servo motor
- gyroscope
! Actuators act on the environment; sensors measure.

? Which sensor measures how much a wheel has turned?
= encoder
! The distance travelled can be computed from it.

? How many degrees of freedom does a typical industrial robot arm have?
= 6
! Three for position, three for orientation.
```
