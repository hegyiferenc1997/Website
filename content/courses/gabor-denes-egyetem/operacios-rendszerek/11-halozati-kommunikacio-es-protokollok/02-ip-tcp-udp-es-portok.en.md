---
title: IP Addresses, TCP, UDP and Ports
summary: IPv4 and IPv6, private addresses and the subnet mask, the difference between TCP and UDP, ports, DNS and DHCP – with commands.
minutes: 30
---

## What you will learn

- how an **IPv4** and an **IPv6** address are built, what a **private address** and a **subnet mask** are,
- how **TCP** and **UDP** differ and what **ports** are for,
- what **DNS** and **DHCP** do and which command shows all this.

## IP addresses

- **IPv4**: a 32-bit address written as four numbers from 0–255: `192.168.1.25`. In total 2³² ≈ 4.3 billion addresses – they have **run out**.
- **IPv6**: a 128-bit address in hexadecimal: `2001:db8::1` (`::` abbreviates a run of zeros). Practically inexhaustible.

### Private addresses and NAT

These ranges do **not** go out to the internet; they can be used freely in home and company networks:

- `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`.

Your home router lets all machines out through a single public address using **NAT** (address translation). VirtualBox's **NAT** mode does the same: the guest gets the private address `10.0.2.15`.

`127.0.0.1` (`::1` in IPv6) is the **loopback** address (_localhost_): it always means your own machine.

### Subnet mask

In `192.168.1.25/24` the **/24** says that the first 24 bits are the **network** and the remaining 8 bits identify the **host** (mask: `255.255.255.0`). The number of assignable host addresses: 2⁸ − 2 = **254** (all zeros is the network address, all ones the broadcast address).

| Prefix | Mask            | Host bits | Assignable addresses |
| ------ | --------------- | --------- | -------------------- |
| /24    | 255.255.255.0   | 8         | 254                  |
| /25    | 255.255.255.128 | 7         | 126                  |
| /26    | 255.255.255.192 | 6         | 62                   |
| /16    | 255.255.0.0     | 16        | 65,534               |

## TCP and UDP

| Aspect          | **TCP**                                                          | **UDP**                                      |
| --------------- | ---------------------------------------------------------------- | -------------------------------------------- |
| connection      | **connection-oriented** (three-way handshake: SYN, SYN-ACK, ACK) | **connectionless**                           |
| reliability     | resends lost packets, keeps order                                | no guarantee                                 |
| speed, overhead | slower, larger header                                            | fast, small header                           |
| typical use     | web (HTTP/1–2), e-mail, SSH, file transfer                       | DNS, video calls, online games, live streams |

In a video call it is better to lose a frame for a moment than to wait for it to be resent – hence UDP.

## Ports

Many programs communicate on a machine at once. The **port** (a 16-bit number, **0–65535**) tells which program the packet is for. A connection is identified by five values: protocol, source IP, source port, destination IP, destination port.

| Port | Protocol          | Service                |
| ---- | ----------------- | ---------------------- |
| 22   | TCP               | **SSH** (remote shell) |
| 53   | UDP/TCP           | **DNS**                |
| 80   | TCP               | **HTTP**               |
| 443  | TCP (UDP: HTTP/3) | **HTTPS**              |
| 3389 | TCP               | Windows Remote Desktop |

On Linux only **root** may start a server on ports below 1024 ("well-known" ports).

## DNS and DHCP

- **DNS** (_Domain Name System_): translates names to IP addresses (`gde.hu` → `…`). Like a phone book.
- **DHCP**: when connecting, the machine **automatically** gets an IP address, mask, default gateway (router) and DNS server.

## Commands

```bash
ip addr                      # the machine's IP addresses (in the Ubuntu VM: 10.0.2.15/24)
ip route                     # default gateway (default via 10.0.2.2)
ping -c 4 8.8.8.8            # is a host reachable (ICMP)
resolvectl query ubuntu.com  # DNS resolution
ss -tuln                     # on which ports servers are listening on this machine
```

```powershell
ipconfig /all                # IP address, DNS, DHCP on Windows
Test-NetConnection ubuntu.com -Port 443
Resolve-DnsName ubuntu.com
```

## Summary

- IPv4: 32 bits, run out; IPv6: 128 bits. Private addresses: 10/8, 172.16/12, 192.168/16; localhost: 127.0.0.1.
- /24 → 8 host bits → 254 assignable addresses.
- TCP: connection-oriented, reliable; UDP: connectionless, fast.
- Port: 0–65535, identifies the program (22 SSH, 53 DNS, 80 HTTP, 443 HTTPS); DNS: name → address; DHCP: automatic configuration.

## Lesson exercise

```quiz required
? How many bits is an IPv4 address?
= 32
! IPv6: 128 bits.

? How many assignable host addresses are there in a /26 subnet?
= 62
! 32 − 26 = 6 host bits → 2⁶ − 2 = 62.

? Which protocol do DNS queries and video calls typically use?
- TCP
+ UDP
- ICMP
- ARP
! Fast, connectionless, small overhead.

? On which port does HTTPS run by default?
= 443
! HTTP runs on 80.

? Which service automatically gives the machine an IP address when it connects?
+ DHCP
- DNS
- SSH
- NAT
! Dynamic Host Configuration Protocol.
```
