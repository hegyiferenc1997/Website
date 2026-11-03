---
title: Network Layer Models
summary: The seven-layer OSI and the four-layer TCP/IP model, encapsulation, and which layer runs where on your machine.
minutes: 20
---

## What you will learn

- why network communication is split into **layers**,
- what the **OSI** and **TCP/IP** models are and what each layer does,
- what **encapsulation** is and which layer runs in the **kernel**.

## Why layers?

Downloading a web page involves many questions: what signal to send on the cable, how to find the target machine on the other side of the world, how to replace lost packets, what the request means. Writing all this into a single program would be unmanageable. Each **layer** solves one task and talks only to its neighbouring layers – so e.g. the browser does not need to know whether the packet comes over Wi-Fi or cable.

## The OSI and TCP/IP models

| #   | OSI layer           | TCP/IP layer        | Task                                           | Example                   |
| --- | ------------------- | ------------------- | ---------------------------------------------- | ------------------------- |
| 7   | application         | **application**     | the program's "language"                       | HTTP, DNS, SSH, SMTP      |
| 6   | presentation        | ↑                   | encoding, encryption, compression              | TLS, UTF-8                |
| 5   | session             | ↑                   | connections, sessions                          | (often in the application)|
| 4   | **transport**       | **transport**       | end to end, ports, reliability                 | **TCP**, **UDP**          |
| 3   | **network**         | **internet**        | addressing and routing between networks        | **IP** (IPv4, IPv6), ICMP |
| 2   | data link           | **network access**  | frames on the local network, MAC addresses     | Ethernet, Wi-Fi           |
| 1   | physical            | ↓                   | bits as signals (voltage, light, radio)        | cable, radio waves        |

**OSI** (7 layers) is a theoretical reference model; the internet follows the practical **TCP/IP** (4 layers) model.

## Encapsulation

When sending, every layer puts **its own header** in front of the data and passes it to the layer below; when receiving it is the other way round, each layer removes its own.

```text
application:  [ HTTP request: GET /index.html ]
transport:    [ TCP header | HTTP request ]                        ← segment
internet:     [ IP header | TCP header | HTTP request ]            ← packet
access:       [ Eth header | IP | TCP | HTTP | Eth checksum ]      ← frame
physical:     0110100101…                                          ← bits
```

The TCP header holds the **ports**, the IP header the **IP addresses**, the Ethernet header the **MAC addresses**.

## Which layer runs where?

| Layer                      | Where does it run?                                      |
| -------------------------- | ------------------------------------------------------- |
| application                | in **user mode**, in the program (browser, ssh)         |
| transport + internet (TCP/IP) | in the **kernel** – this is the network stack        |
| network access             | the card's **driver** (kernel) and the network card hardware |
| physical                   | hardware                                                |

The boundary between the program and the kernel's network stack is the **socket** – covered in the third lesson.

## Summary

- Each layer solves one task and talks only to its neighbours.
- OSI: 7 layers (theoretical); TCP/IP: 4 layers (application, transport, internet, network access).
- Encapsulation: every layer puts its own header on the data; segment → packet → frame.
- The TCP/IP stack runs in the kernel, application protocols in the programs.

## Lesson exercise

```quiz required
? How many layers does the OSI reference model have?
= 7
= seven
! The TCP/IP model has 4 layers.

? In which layer of the TCP/IP model does the IP protocol work?
- application
- transport
+ internet (network)
- network access
! Addressing and routing between networks.

? Which layer do TCP and UDP belong to?
+ transport
- internet
- application
- physical
! End to end, with ports.

? What is it called when every layer puts its own header in front of the data?
= encapsulation
! On receipt the reverse: decapsulation.

? Where does the TCP/IP network stack run in a modern operating system?
- in the browser
+ in the kernel
- in the BIOS
- in the router
! The program reaches it through the socket.
```
