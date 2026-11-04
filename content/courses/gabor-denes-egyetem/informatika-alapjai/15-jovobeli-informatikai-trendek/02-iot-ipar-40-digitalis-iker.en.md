---
title: IoT, Edge Computing, Industry 4.0, Digital Twins
summary: The Internet of Things, from sensors to the cloud, edge computing, smart factories, predictive maintenance, digital twins, 5G.
minutes: 16
---

## What you will learn

- what the **Internet of Things** (IoT) is and how data travels from sensor to cloud,
- what **edge computing** is,
- what **Industry 4.0** and **digital twins** mean.

## The Internet of Things (IoT)

**IoT** (Internet of Things) is a network of everyday devices that measure with **sensors** and **send data** or can be **controlled** over the internet: smartwatches, thermostats, smart meters, factory machines, soil sensors in farming, shipments with trackers.

```text
 sensors ──► gateway / edge ──► cloud ──► analysis, dashboard, alerts
 (temperature,  (local pre-processing)   (storage,     (human or automatic
  vibration, GPS)                         AI model)     action)
```

Typical protocols: **MQTT** (lightweight messaging), Wi-Fi, Bluetooth Low Energy, **LoRaWAN** and NB-IoT (low power, long range), **5G**.

**Security:** IoT devices are often weak points (default passwords, never-updated firmware). Basic rule: change the default password, update, and put the devices into a separate network segment.

## Edge computing

Sending all raw data to the cloud would be slow and expensive. **Edge computing** processes data **at or near where it is produced** (on the machine, in the factory hall, on a gateway) and only sends the essentials onward. Benefits: **low latency** (a self-driving car must decide within milliseconds), less network traffic, and it keeps working if the internet drops.

## Industry 4.0

**Industry 4.0** is the fourth industrial revolution: manufacturing becomes **connected, data-driven** and partly **self-regulating**.

| Revolution | Main innovation                            |
| ---------- | ------------------------------------------ |
| 1st        | steam engine, mechanisation (18th century) |
| 2nd        | electricity, assembly line                 |
| 3rd        | computers, automation, PLCs                |
| **4th**    | **IoT, cloud, AI, cyber-physical systems** |

Examples: **predictive maintenance** (from vibration sensor data, AI predicts when a bearing will fail, so it is replaced before the line stops), automatic quality inspection with cameras, robots and cobots, real-time stock tracking.

## Digital twin

A **digital twin** is a **live, virtual copy** of a physical object (machine, factory, building, even a city), continuously updated by real sensor data. Changes can be tried on it without risk (“what if the line ran 20% faster?”), and problems can be foreseen.

## Summary

- IoT: networked devices with sensors; sensor → edge → cloud → analysis.
- Edge computing: local processing, low latency, less traffic.
- Industry 4.0: connected, data-driven manufacturing; digital twin: a live virtual copy.

## Exercise

```quiz required
? What does the abbreviation IoT stand for?
= Internet of Things
! Networked devices with sensors.

? What is the most important benefit of edge computing for a self-driving car?
- the cloud is cheaper
+ low latency: it decides locally, immediately
- the display is nicer
- no sensors are needed
! A decision may depend on milliseconds.

? Which industrial revolution are IoT, cloud and AI in manufacturing linked to (number)?
= 4
= fourth
! Industry 4.0.

? What is the virtual copy of a machine or factory, updated with real data, called?
+ digital twin
- backup
- wireframe
- virtual machine
! Digital twin.
```
