---
title: Practice – Network Communication
summary: Network discovery between the two VMs, review questions and a summary worksheet.
minutes: 30
kind: practice
---

## Lab: the two VMs talk

1. Set both VMs' network to **Internal Network** (with the same name, e.g. `oslab`), or to **Bridged** mode.
2. On Ubuntu: `ip addr` – note the address. On Windows 11: `ipconfig`.
3. There is no DHCP on an internal network – assign addresses by hand. On Ubuntu: `sudo ip addr add 192.168.50.10/24 dev enp0s3`; on Windows under **Settings → Network → Ethernet → IP assignment → Edit → Manual** use `192.168.50.20`, mask `255.255.255.0`.
4. `ping 192.168.50.20` from Ubuntu. (If there is no reply: the Windows firewall blocks ping by default – enable the _File and Printer Sharing (Echo Request – ICMPv4-In)_ rule.)
5. Start the previous lesson's server bound to `0.0.0.0` and connect from Windows: `Test-NetConnection 192.168.50.10 -Port 5000`.
6. At the end, set the network back to **NAT**.

## Review questions

<details>
<summary>1. Why does every guest get the address 10.0.2.15 in VirtualBox NAT mode, and why do they not conflict?</summary>

Because each VM gets its own isolated NAT network from VirtualBox; the private address 10.0.2.15 is only valid inside it. Outwards the packets leave with the host's address.

</details>

<details>
<summary>2. Why does the web use TCP and video calls UDP?</summary>

For a web page every byte must arrive correctly and in order, which TCP guarantees. In a video call delay is worse than a lost frame, so UDP's speed matters more.

</details>

<details>
<summary>3. What is the difference between a server bound to 127.0.0.1 and one bound to 0.0.0.0?</summary>

A server bound to 127.0.0.1 is reachable only from the same machine. 0.0.0.0 means "all interfaces", so it is reachable from other machines of the network too (if the firewall allows it).

</details>

<details>
<summary>4. Why must processes using shared memory be synchronised, but those using a pipe not?</summary>

With a pipe the kernel copies the data and takes care of ordering and mutual exclusion. With shared memory both processes write the same area directly, so race conditions can occur – a mutex or semaphore is needed.

</details>

## Summary worksheet

```quiz required
? How many assignable host addresses are there in a /24 subnet?
= 254
! 2⁸ − 2 = 254.

? Which port is the SSH default?
= 22
! ssh user@host – on TCP port 22.

? Which range is a private address range (does not reach the internet)?
+ 192.168.0.0/16
- 8.8.8.0/24
- 1.1.1.0/24
- 151.101.0.0/16
! Private addresses: 10/8, 172.16/12, 192.168/16.

? In which TCP/IP layer are the ports?
- application
+ transport
- internet
- network access
! The TCP and UDP headers contain them.

? Which Linux command shows on which ports servers are listening?
+ ss -tuln
- ping
- ip route
- nslookup
! t = TCP, u = UDP, l = listening, n = numeric.

? What is the largest port number?
= 65535
! A 16-bit number: 0–65535.
```
