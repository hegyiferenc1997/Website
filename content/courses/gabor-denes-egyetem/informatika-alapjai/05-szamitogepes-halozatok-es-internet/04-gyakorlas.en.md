---
title: Practice – Networks and the Internet
summary: Review questions and a summary worksheet on networks, IP addresses, DNS and the web.
minutes: 20
kind: practice
---

## Review questions

<details>
<summary>1. At home your laptop's IP address is 192.168.1.23, but a “what is my IP” site shows 84.2.x.x. Why?</summary>

192.168.1.23 is a private address, valid only inside the flat. The router uses NAT to send traffic to the internet on the public address it got from the provider (84.2.x.x).

</details>

<details>
<summary>2. The browser says “server IP address could not be found”. At which step did it get stuck?</summary>

At DNS resolution: it couldn't translate the domain name to an IP address (mistyped address, non-existent domain or a broken DNS server).

</details>

<details>
<summary>3. What is the difference between a switch and a router?</summary>

A switch forwards inside one network by MAC address; a router chooses a route between different networks by IP address.

</details>

<details>
<summary>4. Why is it dangerous to enter a password on an http:// page on public Wi-Fi?</summary>

Because the data travels unencrypted, so anyone on the network can read or modify it.

</details>

Try it (Windows PowerShell):

```powershell
ipconfig            # IP address, mask, default gateway
nslookup google.com # DNS resolution
tracert gde.hu      # which routers does the packet travel through?
```

## Summary worksheet

```quiz required
? How many bits is an IPv6 address?
= 128
! Four times as many bits as IPv4.

? Which service automatically assigns IP addresses to devices joining the network?
+ DHCP
- DNS
- HTTP
- SSH
! Dynamic Host Configuration Protocol.

? On which port does SSH run by default?
= 22
! Remote login to a server.

? What does HTTP status code 500 mean?
- page not found
- redirect
+ internal server error
- all fine
! 5xx: server error.

? In which OSI layer does the IP protocol work?
- physical
- data link
+ network
- application
! Layer 3 is routing.

? What topology do most of today's LANs have?
+ star
- bus
- ring
- full mesh
! Every device connects to a central switch.
```
