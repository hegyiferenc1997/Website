---
title: Types and Devices of Networks
summary: PAN, LAN, WAN; star and other topologies; switch, router, access point; wired and wireless links.
minutes: 15
---

## What you will learn

- what a **computer network** is and how large it can be (**PAN**, **LAN**, **WAN**),
- what **topologies** exist,
- what a **switch**, a **router** and an **access point** are for.

## What is a network?

A **computer network** is a set of devices (computers, phones, printers, servers) that exchange data. Benefits: shared resources (printer, files), communication, internet access.

## By size

| Type    | Extent                | Example                                                      |
| ------- | --------------------- | ------------------------------------------------------------ |
| **PAN** | a few metres          | phone + earbuds over Bluetooth                               |
| **LAN** | a building, a flat    | home Wi-Fi, office network                                   |
| **MAN** | a city                | a city's fibre backbone                                      |
| **WAN** | countries, continents | a network linking a company's sites; the **internet** itself |

The **internet** is the network of networks: millions of LANs and WANs communicating with common protocols (TCP/IP).

## Topologies

```text
     star                  bus                  ring
     (B)              (A)─(B)─(C)─(D)        (A)───(B)
      │                                       │     │
 (A)─[S]─(C)                                 (D)───(C)
      │
     (D)
```

Today's LANs are almost all **star** topologies: every device connects to a central **switch**. If a cable breaks, only that one machine drops out.

## Devices

| Device                 | Its job                                                                                             |
| ---------------------- | --------------------------------------------------------------------------------------------------- |
| **network card (NIC)** | connects the machine; its unique hardware address is the **MAC address** (e.g. `3C:52:82:1A:2B:3C`) |
| **switch**             | inside the LAN, forwards a frame to the right port by MAC address                                   |
| **router**             | forwards **between networks** by IP address, e.g. between the home LAN and the internet             |
| **access point (AP)**  | connects wireless (Wi-Fi) devices to the network                                                    |
| **modem**              | connects to the provider's line (cable, DSL, fibre: ONT)                                            |

A home “router” usually contains all of these: router + switch + Wi-Fi AP (+ modem).

## Transmission media

- **copper cable** (UTP, RJ45 connector): cheap, 1–10 Gbit/s, at most 100 m,
- **optical fibre**: light pulses, high speed, kilometres of distance, immune to electromagnetic interference,
- **wireless**: Wi-Fi (Wi-Fi 6/6E/7), Bluetooth, mobile networks (4G, 5G).

## Summary

- By size: PAN < LAN < MAN < WAN; the internet is the network of networks.
- Today's LANs are star-shaped, with a switch in the middle.
- Switch: inside a LAN (MAC); router: between networks (IP); AP: Wi-Fi.

## Exercise

```quiz required
? What kind of network is home Wi-Fi?
- PAN
+ LAN
- MAN
- WAN
! Local Area Network: a flat, a building.

? Which device forwards **between networks** by IP address?
- switch
+ router
- access point
- network card
! The router connects the home network to the internet.

? What is the unique hardware address of a network card called?
= MAC address
= MAC
! E.g. 3C:52:82:1A:2B:3C.

? At most how many metres long can a UTP copper network cable segment be?
= 100
! Optical fibre is used for longer distances.
```
