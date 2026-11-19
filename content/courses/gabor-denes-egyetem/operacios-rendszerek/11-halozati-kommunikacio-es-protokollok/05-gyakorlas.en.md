---
title: Practice – Network Communication
summary: Network discovery between the two VMs, review questions and a summary worksheet.
minutes: 55
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

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Network address by hand.** Write the `network(addr, prefix)` function **with bit operations** (without the `ipaddress` module): from the dotted IPv4 address and the prefix length, return the network address in dotted form!

```python starter
def network(addr, prefix):
    return addr
```

<details>
<summary>Solution</summary>

```python solution
def network(addr, prefix):
    num = 0
    for part in addr.split("."):             # one 32-bit number from the four bytes
        num = num * 256 + int(part)
    mask = (0xFFFFFFFF << (32 - prefix)) & 0xFFFFFFFF
    n = num & mask                           # bitwise AND
    return ".".join(str(n >> shift & 255) for shift in (24, 16, 8, 0))
```

</details>

```python test
assert network("192.168.10.77", 26) == "192.168.10.64"
assert network("192.168.1.25", 24) == "192.168.1.0"
assert network("10.8.5.200", 16) == "10.8.0.0"
assert network("172.20.3.9", 12) == "172.16.0.0"
print("All checks passed!")
```

**2.** **Which prefix is needed?** Write the `smallest_net(hosts)` function: what prefix length (the **largest** possible, i.e. the smallest network) should we choose so that `hosts` machines fit? (The network and broadcast addresses can't be assigned.)

```python starter
def smallest_net(hosts):
    return 24
```

<details>
<summary>Solution</summary>

```python solution
def smallest_net(hosts):
    for prefix in range(30, 0, -1):          # starting from the smallest network
        if 2 ** (32 - prefix) - 2 >= hosts:
            return prefix
```

</details>

```python test
assert smallest_net(2) == 30
assert smallest_net(50) == 26
assert smallest_net(62) == 26
assert smallest_net(63) == 25
assert smallest_net(254) == 24
print("All checks passed!")
```

**3.** **The TCP window limit.** Write the `max_mbit(window_kb, rtt_ms)` function: at most how many Mbit/s can be achieved with a given window size and RTT (speed = window / RTT; 1 KB = 1024 bytes, 1 Mbit = 10⁶ bits; one decimal)?

```python starter
def max_mbit(window_kb, rtt_ms):
    return window_kb
```

<details>
<summary>Solution</summary>

```python solution
def max_mbit(window_kb, rtt_ms):
    bits = window_kb * 1024 * 8
    return round(bits / (rtt_ms / 1000) / 1e6, 1)
```

</details>

```python test
assert max_mbit(64, 50) == 10.5
assert max_mbit(64, 5) == 104.9
assert max_mbit(1024, 100) == 83.9
print("All checks passed!")
```

### Quick check questions

```quiz
? Which protocol guarantees that data arrives in order and complete?
+ TCP
- UDP
- IP
! UDP is faster but guarantees nothing – good for video calls and games.

? Which service turns a domain name (e.g. www.example.com) into an IP address?
+ DNS
- DHCP
- NAT
! DHCP assigns IP addresses to machines.

? Which address is the loopback (localhost) address in IPv4?
= 127.0.0.1
! In IPv6 it's ::1.

? Which port does an HTTPS web server listen on by default?
= 443
! HTTP: 80, SSH: 22.

? What does NAT do on a home router?
+ it translates the internal network's private addresses to a single public address, so many machines can share one public IP
- it encrypts the traffic
- it speeds up downloads
! VirtualBox's NAT mode does the same.
```
