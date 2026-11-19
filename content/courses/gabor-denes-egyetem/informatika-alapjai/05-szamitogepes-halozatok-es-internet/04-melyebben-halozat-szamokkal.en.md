---
title: Deeper – The Network in Numbers
summary: Computing an IP address and subnet mask with a program, how many devices fit in a network, how long a download takes (bandwidth and latency), taking a URL apart, and what status codes reveal in a server log – with small programs and an interactive chart.
minutes: 45
---

## What you will learn in this lesson

- how to read the network and the number of hosts from an IP address and **mask**,
- why a download depends not just on **bandwidth** but on **latency** too,
- how the browser takes a **URL** apart,
- how to analyse a server **log** by status codes.

## 1. IP address and subnet

In the basic lesson we saw that an IPv4 address is 4 bytes, e.g. `192.168.1.37`. But how does a computer know whether another address is **in the same local network** (so it can reach it directly), or must be sent via the router? The **subnet mask** helps, in short form the `/24` notation: the first 24 bits identify the network, the remaining 8 bits the host.

```python run
# IP address and subnet with the built-in ipaddress module
import ipaddress

host = ipaddress.ip_interface("192.168.1.37/24")
net = host.network
print("network:         ", net)
print("mask:            ", net.netmask)
print("usable addresses:", net.num_addresses - 2)        # without network and broadcast address
print("first and last:  ", list(net.hosts())[0], "–", list(net.hosts())[-1])

for other in ["192.168.1.200", "192.168.2.5", "8.8.8.8"]:
    local = ipaddress.ip_address(other) in net
    print(f"{other:<14} {'local network, directly' if local else 'other network → via the router'}")

# the address in binary: the first 24 bits are the network
print(".".join(format(int(b), "08b") for b in "192.168.1.37".split(".")))
```

A `/24` network fits 254 devices (of 256 addresses, all 0s is the network and all 1s the broadcast address). If you need fewer, the mask can be longer: `/26` → 62 hosts, `/30` → 2 hosts (for linking two routers). When planning a dorm floor or an office, this has to be worked out in advance.

```python run
# How many hosts fit with different masks?
for prefix in [16, 20, 24, 26, 28, 30]:
    print(f"/{prefix}: {2 ** (32 - prefix) - 2:>6} usable addresses")
```

## 2. How long does a download take?

The provider advertises "100 Mbit/s". Does downloading a 50 MB file then take $50 \cdot 8 / 100 = 4$ seconds? For a big file, roughly yes. But a **web page** consists of many small files, and every request needs a round trip (**latency**, RTT) – then latency dominates:

$$\text{time} \approx \text{number of requests} \cdot \text{RTT} + \frac{\text{size}}{\text{bandwidth}}$$

```plot
title: Load time (s) of a 2 MB page made of 40 files as a function of bandwidth (Mbit/s)
x: 1, 200
y: 0, 10
param: r = 50, 5, 300, 5
f: 40*r/1000 + 2*8/x # 40 requests · RTT + size / bandwidth (RTT = r ms)
```

With the slider you set the RTT (5 ms: a good wired connection; 50 ms: average mobile; 300 ms: satellite internet). Notice: above about 50 Mbit/s a faster subscription **barely** helps, but reducing latency helps a lot. That's why developers bundle files, use a **CDN** (content comes from a server close to the user), and why it matters that a page loads with few requests.

```python run
# One big file vs. many small files: when does bandwidth matter, when latency?
def time_s(size_mb, requests, mbit, rtt_ms):
    return requests * rtt_ms / 1000 + size_mb * 8 / mbit

for name, size, req in [("film (1 file, 2000 MB)", 2000, 1), ("web page (40 files, 2 MB)", 2, 40)]:
    for mbit in [50, 500]:
        print(f"{name:<26} {mbit:>3} Mbit/s, 50 ms: {time_s(size, req, mbit, 50):7.2f} s")
```

For the film, ten times the bandwidth is ten times faster; for the web page it changes almost nothing. (In reality the browser also loads in parallel, which helps, but the principle is the same.)

## 3. The parts of a URL

Before the browser fetches anything, it takes the URL apart: the **protocol** says how, the **host name** (domain) from whom – DNS translates it to an IP address –, the **port** from which service, and the **path** and **parameters** what:

```python run
# Taking a URL apart
from urllib.parse import urlsplit, parse_qs

url = "https://www.example-uni.edu:8443/timetable/search?major=compeng&semester=1#monday"
r = urlsplit(url)
print("protocol: ", r.scheme)
print("host name:", r.hostname)
print("port:     ", r.port or {"http": 80, "https": 443}[r.scheme])
print("path:     ", r.path)
print("params:   ", parse_qs(r.query))
print("fragment: ", r.fragment, "(not even sent to the server)")
```

The **fragment** (the part after `#`) stays in the browser; the server never sees it. In the parameters, though, the user can send **anything** – so a well-written server must check every incoming parameter.

## 4. A server log: what do status codes reveal?

In the basic lesson you met status codes: 2xx success, 3xx redirect, 4xx client error, 5xx server error. An operator can see at a glance from the log whether something is wrong:

```python run
# Web server log analysis: status codes by class and suspicious requests
from collections import Counter

log = """10.0.0.5 GET /index.html 200
10.0.0.7 GET /timetable 200
10.0.0.5 GET /old-page 301
10.0.0.9 GET /no-such-page 404
10.0.0.66 GET /wp-admin 404
10.0.0.66 GET /.env 404
10.0.0.66 GET /admin.php 404
10.0.0.7 POST /api/booking 500
10.0.0.8 GET /timetable 200
10.0.0.5 GET /images/logo.png 304"""

lines = [l.split() for l in log.splitlines()]
classes = Counter(f"{code[0]}xx" for _, _, _, code in lines)
print("status code classes:", dict(sorted(classes.items())))
misses = Counter(ip for ip, _, _, code in lines if code == "404")
for ip, n in misses.items():
    if n >= 3:
        print(f"suspicious: {ip} tried {n} non-existent pages (e.g. /.env, /wp-admin) – probably an automated scanner")
print("server errors:", [path for _, _, path, code in lines if code.startswith("5")])
```

**Two viewpoints** can be read from the log. The **operator** looks for 5xx errors (here: the booking API broke – this must be fixed immediately). The **security** specialist looks for patterns: one IP address tries typical vulnerable paths one after another (`/.env`, `/wp-admin`) – that's an automated scanner, which the server can defend against with e.g. rate limiting.

| Viewpoint               | What do they see of the network?          | What do they watch out for?                             |
| ----------------------- | ----------------------------------------- | ------------------------------------------------------- |
| **user**                | the page is "fast" or "slow"              | bandwidth, Wi-Fi signal, mobile data                    |
| **developer**           | number and size of requests, status codes | fewer requests, compression, CDN, caching               |
| **operator**            | addresses, subnets, logs, load            | 5xx errors, capacity, address allocation                |
| **security specialist** | suspicious patterns, open ports           | scanning, denial-of-service attacks, encryption (HTTPS) |

## Summary

- The subnet mask (e.g. `/24`) tells which addresses are in the local network; with an $n$-bit host part, $2^n - 2$ addresses are usable.
- A download takes ≈ requests · RTT + size / bandwidth: for a big file bandwidth dominates, for many small files latency.
- A URL consists of protocol, host name, port, path, parameters and fragment; the server must always check the parameters.
- From a server log's status codes you can read both errors (5xx) and suspicious patterns (many 404s from one address).

## Lesson exercise

```quiz required
? How many usable addresses are there in a `/26` network?
= 62
! $2^{32-26} - 2 = 64 - 2 = 62$.

? The computer's address is `10.1.5.20/24`. Which address is in the same local network?
+ `10.1.5.200`
- `10.1.6.20`
- `10.2.5.20`
- `192.168.5.20`
! The first 24 bits (`10.1.5`) match.

? How long does downloading a 100 MB file take at 200 Mbit/s, ignoring latency (seconds)?
= 4
! $100 \cdot 8 / 200 = 4$ s.

? A page consists of 60 small files, and the RTT is 100 ms. What improves the load time most?
- a subscription twice as fast
+ fewer requests (bundling files) and a server closer to the user (CDN)
- a bigger screen
- a new browser tab
! With many small files, latency dominates.

? In the log, one IP address gets dozens of 404 responses a minute for `/.env` and `/wp-admin` requests. What is this most likely?
- a forgotten password
+ an automated vulnerability scanner
- the server overheating
- a normal user
! It can be countered e.g. with rate limiting and blocking suspicious addresses.
```
