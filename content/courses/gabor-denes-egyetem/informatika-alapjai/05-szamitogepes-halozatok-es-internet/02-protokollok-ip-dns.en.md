---
title: Layers, IP Address, DNS, Port
summary: The OSI and TCP/IP models, IPv4 and IPv6 addresses, DHCP, DNS and ports.
minutes: 18
---

## What you will learn

- what a **protocol** is and why we think in layers (**OSI**, **TCP/IP**),
- what an **IP address** (IPv4, IPv6), a **private address** and **DHCP** are,
- what **DNS** and **ports** are for, and the difference between **TCP** and **UDP**.

## Protocols and layers

A **protocol** is the set of rules for communication: in what form and order we send data. Network tasks are split into **layers**; every layer uses only the one below it.

| OSI layer       | TCP/IP layer   | Its job                      | Example         |
| --------------- | -------------- | ---------------------------- | --------------- |
| 7. application  | application    | the program's “language”     | HTTP, DNS, SMTP |
| 6. presentation | ↑              | encoding, encryption         | TLS             |
| 5. session      | ↑              | managing the connection      |                 |
| 4. transport    | transport      | delivery between endpoints   | TCP, UDP        |
| 3. network      | internet       | routing                      | IP              |
| 2. data link    | network access | frames between neighbours    | Ethernet, Wi-Fi |
| 1. physical     | ↑              | bits on the cable/in the air | cable, radio    |

## IP address

Every device on the network has an **IP address**; packets find it by this address.

- **IPv4**: 32 bits, four numbers between 0 and 255: `192.168.1.10`. About 4.3 billion (2³²) addresses – too few.
- **IPv6**: 128 bits, in hexadecimal: `2001:db8::1`. Practically inexhaustible.

**Private** address ranges (`192.168.x.x`, `10.x.x.x`, `172.16–31.x.x`) are only valid inside the local network; the router uses **NAT** (address translation) to let them out to the internet on one shared public address.

Addresses are usually not set by hand: the **DHCP** server (the router at home) automatically assigns a free address, the **mask**, the **default gateway** (the router's address) and the DNS server.

## DNS

People remember names (`gde.hu`), machines use IP addresses. **DNS** (Domain Name System) is the “phone book”: it translates a domain name into an IP address.

```powershell
nslookup gde.hu        # which IP address belongs to the name?
ipconfig /all          # the machine's IP, gateway, DNS server (Windows)
ping 8.8.8.8           # is an address reachable, what is the latency?
```

## Port, TCP and UDP

Many programs communicate at once on one machine. The **port** (0–65535) identifies which program a packet is for. Well-known ports: **80** (HTTP), **443** (HTTPS), **22** (SSH), **53** (DNS), **25** (SMTP).

- **TCP**: reliable, in-order delivery with acknowledgements (web, e-mail, file transfer),
- **UDP**: fast, without acknowledgements (video calls, online games, DNS queries) – a lost packet is fine, delay is not.

## Summary

- Protocol = communication rules; layers: OSI (7) and TCP/IP (4).
- IPv4: 32 bits, IPv6: 128 bits; private address + NAT; DHCP assigns addresses automatically.
- DNS: name → IP address; port: which program; TCP is reliable, UDP is fast.

## Exercise

```quiz required
? How many bits is an IPv4 address?
= 32
! Four 8-bit numbers (0–255).

? Which service translates the name `gde.hu` into an IP address?
- DHCP
+ DNS
- NAT
- TCP
! Domain Name System.

? On which port does HTTPS run by default?
= 443
! HTTP runs on port 80.

? Which is a **private** IPv4 address?
- 8.8.8.8
+ 192.168.0.15
- 151.101.1.69
- 1.1.1.1
! The 192.168.x.x range is private.

? Which transport protocol does a video call prefer, where delay is worse than a lost packet?
- TCP
+ UDP
- HTTP
- DNS
! UDP doesn't wait for acknowledgements.
```
