---
title: Practice – Networks and the Internet
summary: Review questions and a summary worksheet on networks, IP addresses, DNS and the web.
minutes: 45
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

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Assignable addresses.** Write the `hosts(prefix)` function, which tells how many machines can be given an address in a `/prefix` network (not counting the network and broadcast addresses)! For `/31` and `/32` return 0.

```python starter
def hosts(prefix):
    return 2 ** (32 - prefix)
```

<details>
<summary>Solution</summary>

```python solution
def hosts(prefix):
    if prefix >= 31:
        return 0
    return 2 ** (32 - prefix) - 2          # all-zeros and all-ones are reserved
```

</details>

```python test
assert hosts(24) == 254
assert hosts(26) == 62
assert hosts(30) == 2
assert hosts(16) == 65534
assert hosts(32) == 0
print("All checks passed!")
```

**2.** **In the same network?** Write the `same_network(ip1, ip2, prefix)` function, which decides about two IPv4 addresses (as strings) whether their first `prefix` bits match! (Don't use the `ipaddress` module this time.)

```python starter
def same_network(ip1, ip2, prefix):
    return ip1.split(".")[0] == ip2.split(".")[0]
```

<details>
<summary>Solution</summary>

```python solution
def same_network(ip1, ip2, prefix):
    def number(ip):
        a, b, c, d = (int(x) for x in ip.split("."))
        return (a << 24) | (b << 16) | (c << 8) | d     # 32-bit integer
    mask = (0xFFFFFFFF << (32 - prefix)) & 0xFFFFFFFF
    return number(ip1) & mask == number(ip2) & mask
```

</details>

```python test
assert same_network("192.168.1.37", "192.168.1.200", 24) is True
assert same_network("192.168.1.37", "192.168.2.5", 24) is False
assert same_network("10.0.0.1", "10.0.0.130", 25) is False
assert same_network("10.0.0.1", "10.0.0.100", 25) is True
print("All checks passed!")
```

**3.** **Download time.** Write the `download(size_mb, requests, mbit, rtt_ms)` function: the time in seconds is the number of requests × RTT, plus the size (in megabytes) converted to bits divided by the bandwidth (Mbit/s), rounded to 2 decimals!

```python starter
def download(size_mb, requests, mbit, rtt_ms):
    return round(size_mb / mbit, 2)
```

<details>
<summary>Solution</summary>

```python solution
def download(size_mb, requests, mbit, rtt_ms):
    latency = requests * rtt_ms / 1000       # ms → s
    transfer = size_mb * 8 / mbit            # MB → Mbit
    return round(latency + transfer, 2)
```

</details>

```python test
assert download(100, 0, 200, 50) == 4.0
assert download(2, 40, 50, 50) == 2.32
assert download(2, 40, 500, 50) == 2.03
print("All checks passed!")
```

### Quick check questions

```quiz
? Which protocol translates a domain name into an IP address?
- DHCP
+ DNS
- HTTP
- FTP
! DNS is the "phone book".

? Which status code means the requested page was not found?
= 404
! 4xx: the client's error.

? How many bits is an IPv6 address?
= 128
! IPv4 is 32 bits.

? Why doesn't a faster subscription help much with a website made of many small files?
- because the faster subscription is fake
+ because then the requests' round trips (latency) dominate, not the bandwidth
- because the browser doesn't use it
- because the images don't download
! What does help is fewer requests and a closer server (CDN).
```
