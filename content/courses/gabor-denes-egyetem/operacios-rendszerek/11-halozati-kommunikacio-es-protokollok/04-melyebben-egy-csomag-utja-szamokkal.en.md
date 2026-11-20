---
title: Deeper – A Packet's Journey in Numbers
summary: Subnet calculation bit by bit and with Python, how the kernel decides from the routing table where a packet goes (longest prefix), the overhead of encapsulation, an IPv4 header byte by byte and its checksum, latency and the speed-of-light limit, and the bandwidth–delay product and the TCP window.
minutes: 45
---

## What you will learn in this lesson

- to calculate a subnet's addresses **bit by bit** and with Python,
- how the kernel decides from the **routing table** where to send a packet,
- how large the **encapsulation overhead** is, and why many tiny packets are expensive,
- what an **IPv4 header** looks like byte by byte, and how the **checksum** works,
- why opening a web page takes **several round trips**, and what the **speed of light** adds,
- what the **bandwidth–delay product** is, and why a fast, distant download needs a large TCP window.

## 1. Subnet calculation bit by bit

In the base lesson you saw the `/24`, `/26` notation. Let's see what the machine actually does: it performs a bitwise **AND** between the address and the **mask** – what remains is the **network address**.

```text
address:  192.168.10.77   = 11000000.10101000.00001010.01001101
mask /26  255.255.255.192 = 11111111.11111111.11111111.11000000
AND:      192.168.10.64   = 11000000.10101000.00001010.01000000   ← network
```

In the last byte the mask's top 2 bits are 1 (128 + 64 = 192), so networks step by 64: .0, .64, .128, .192. The .77 falls into the **.64–.127** range.

```python run
# Subnet calculation with the built-in ipaddress module
import ipaddress

host = ipaddress.ip_interface("192.168.10.77/26")
net = host.network
print("network:       ", net)
print("mask:          ", net.netmask)
print("first host:    ", net[1])
print("last host:     ", net[-2])
print("broadcast:     ", net.broadcast_address)
print("assignable:    ", net.num_addresses - 2)

# The same by hand, with bit operations
addr = int(ipaddress.ip_address("192.168.10.77"))
mask = (0xFFFFFFFF << (32 - 26)) & 0xFFFFFFFF      # 26 one-bits from the left
print("network computed by hand:", ipaddress.ip_address(addr & mask))

# Splitting a /24 into four /26s
for sub in ipaddress.ip_network("192.168.10.0/24").subnets(new_prefix=26):
    print("  subnet:", sub)
```

Why does this matter to the operating system? Because this is how it decides whether the recipient is on the **same local network** (then it sends directly) or must be reached through the **gateway** (the router).

## 2. The routing table – where should the packet go?

Every machine has a **routing table**, and the kernel looks it up for every outgoing packet. Look at it in the Ubuntu VM:

```bash
ip route          # e.g.: default via 10.0.2.2 dev enp0s3
                  #       10.0.2.0/24 dev enp0s3 proto kernel scope link src 10.0.2.15
ip route get 8.8.8.8      # exactly where would a packet to 8.8.8.8 go?
```

The rule: if several entries match, the **longest prefix** wins (_longest prefix match_) – i.e. the most specific one. The `default` (0.0.0.0/0) matches every address, but is used only if nothing more specific exists.

```python run
# Longest prefix match: the kernel's routing decision, simplified
import ipaddress

table = [
    ("0.0.0.0/0",      "gateway 10.0.2.2 (internet)"),
    ("10.0.2.0/24",    "directly, enp0s3"),
    ("10.8.0.0/16",    "VPN tunnel, tun0"),
    ("10.8.5.0/24",    "office servers, via VPN"),
]

def route(dest):
    dest = ipaddress.ip_address(dest)
    matches = [(ipaddress.ip_network(p), where) for p, where in table
               if dest in ipaddress.ip_network(p)]
    net, where = max(matches, key=lambda x: x[0].prefixlen)   # the longest wins
    return f"{str(dest):<12} → {where:<30} (matching: {len(matches)}, winner: {net})"

for dest in ["10.0.2.40", "10.8.1.1", "10.8.5.20", "8.8.8.8"]:
    print(route(dest))
```

`10.8.5.20` matches three entries (/0, /16, /24) – /24 is the most specific, so it wins.

**Analogy:** the postman first checks whether the address is on their own street (local network); if not, but it's in the district, they take it to the district post office (more specific route); if they really don't know, to the central post office (default gateway).

## 3. The cost of encapsulation

Every layer adds its own **header**. For a typical TCP segment sent over Ethernet:

| Layer    | Header   |
| -------- | -------- |
| Ethernet | 14 bytes |
| IPv4     | 20 bytes |
| TCP      | 20 bytes |
| Total    | 54 bytes |

Ethernet's **MTU** (the largest payload in a frame) is **1500 bytes**; after the IP and TCP headers **1460 bytes** remain for data. Efficiency depends on packet size:

```python run
# Share of useful data in the whole frame, for different data sizes
HEADERS = 14 + 20 + 20          # Ethernet + IPv4 + TCP (bytes)

for data in [1, 40, 200, 536, 1460]:
    frame = data + HEADERS
    print(f"{data:>5} B data → {frame:>5} B frame, efficiency {data / frame:6.1%}")
```

A full packet is **96%** efficient, but if every keystroke over SSH goes in a separate packet, **1 byte** of data comes with 54 bytes of headers (less than 2%). That's why TCP collects small writes (**Nagle's algorithm**) – which can add delay, so interactive programs sometimes turn it off (`TCP_NODELAY`). The buffering lesson of the previous topic shows up here too.

## 4. An IPv4 header byte by byte

The 20 bytes of the IP header have a strict structure; the kernel reads and writes these fields. Python's `struct` module is made exactly for this: it splits bytes into fields (`!` means network, _big-endian_ byte order).

```python run
# Parsing an IPv4 header and computing its checksum
import struct

def checksum(header):
    # sum of 16-bit words, fold back the overflow, finally negate
    s = 0
    for i in range(0, len(header), 2):
        s += (header[i] << 8) + header[i + 1]
    while s >> 16:
        s = (s & 0xFFFF) + (s >> 16)
    return ~s & 0xFFFF

# Header without a checksum (bytes 10–11 are 0 for now)
header = bytes.fromhex("4500003c1c4640004006" + "0000" + "c0a80119" + "5db8d822")
total = checksum(header)
header = header[:10] + struct.pack("!H", total) + header[12:]
print("computed checksum:", hex(total))

ver_ihl, tos, length, ident, flag_off, ttl, proto, chk, src, dst = \
    struct.unpack("!BBHHHBBH4s4s", header)
print("version:      ", ver_ihl >> 4)
print("header length:", (ver_ihl & 0x0F) * 4, "bytes")
print("total length: ", length, "bytes")
print("TTL:          ", ttl)
print("protocol:     ", proto, "(6 = TCP, 17 = UDP, 1 = ICMP)")
print("source:       ", ".".join(map(str, src)))
print("destination:  ", ".".join(map(str, dst)))

# The receiving side: the checksum of the whole header is 0 if undamaged
print("check at the receiver:", checksum(header))
damaged = bytearray(header); damaged[8] = 63   # TTL became 64 → 63, but nobody updated the sum
print("check of the damaged header:", checksum(bytes(damaged)))
```

What some fields mean:

- **TTL** (_time to live_): every router decreases it by one; if it reaches 0, it drops the packet. This way a packet going round in circles on a bad route doesn't circulate forever. `traceroute` builds on exactly this: it sends packets with TTL 1, 2, 3… and sees which router drops them.
- **protocol**: the upper layer – this is how the kernel knows whether to hand it to the TCP or the UDP code.
- **checksum**: since the TTL changes at every router, **every router recomputes it**.

## 5. Latency: why isn't a web page instant?

Opening an HTTPS page for the first time takes several **round trips** (_RTT_, _round-trip time_) before the first useful byte arrives:

1. **DNS** – resolving the name to an IP address: 1 RTT (to the DNS server),
2. **TCP handshake** (SYN, SYN-ACK, ACK): 1 RTT,
3. **TLS 1.3 handshake** (negotiating encryption): 1 RTT,
4. **HTTP request and response**: 1 RTT.

The **speed of light** sets a lower bound: in optical fibre light travels at about **200,000 km/s** (two thirds of its speed in vacuum). Budapest–New York is about 7000 km, so the theoretical minimum round trip is 2 · 7000 / 200,000 = **70 ms** – a faster connection is physically impossible.

```python run
# Time until the first useful byte: round trips × RTT
LIGHT_KM_S = 200_000                # speed of light in fibre (km/s)
round_trips = {"DNS": 1, "TCP": 1, "TLS 1.3": 1, "HTTP": 1}
total = sum(round_trips.values())

for where, km in [("Budapest–Szeged", 170), ("Budapest–Frankfurt", 1000),
                  ("Budapest–New York", 7000), ("Budapest–Sydney", 16000)]:
    min_rtt = 2 * km / LIGHT_KM_S * 1000             # ms, light's path only
    real_rtt = min_rtt * 1.5 + 5                      # detours + routers (estimate)
    print(f"{where:<20} min. RTT {min_rtt:5.1f} ms, estimated RTT {real_rtt:5.1f} ms → "
          f"first byte ≈ {total * real_rtt:6.0f} ms")
```

That's why big sites use a **CDN** (content comes from a server close to the user), and why TLS 1.3 saves a whole round trip compared with the older TLS 1.2. Increasing bandwidth does **not** help here: latency and bandwidth are two different things.

**Analogy:** bandwidth is the number of motorway lanes, latency is the distance. Ten lanes or not, it still takes time to get from Szeged to Budapest.

## 6. The bandwidth–delay product and the TCP window

TCP doesn't send blindly: at most a **window** of **unacknowledged** data may be in flight. Then it has to wait for the acknowledgement – which arrives one RTT later. So the upper bound on achievable speed is:

**speed ≤ window / RTT**

To fully use the link, at least the **bandwidth–delay product** of data has to be in flight (that's how much "fits in the pipe"):

```python run
# How big a window is needed, and what do we achieve with a given window?
bandwidth = 100e6        # 100 Mbit/s
rtt = 0.050              # 50 ms

needed = bandwidth * rtt / 8
print(f"needed window: {needed / 1000:.0f} KB (bandwidth × RTT)")

for window in [64 * 1024, 256 * 1024, 1024 * 1024]:
    speed = min(window * 8 / rtt, bandwidth)
    print(f"window {window // 1024:>5} KB → at most {speed / 1e6:6.1f} Mbit/s")
```

With the classic maximum window of **64 KB** and a 50 ms RTT, your 100 Mbit/s line is useless: you can reach at most about **10.5 Mbit/s**! That's why **window scaling** was introduced, and why the Linux kernel tunes socket buffers automatically (`net.ipv4.tcp_rmem`).

```bash
sysctl net.ipv4.tcp_rmem          # min, default, max receive buffer in bytes
sysctl net.ipv4.tcp_window_scaling   # 1 = enabled
ss -ti | head -20                  # live connections: rtt, cwnd (congestion window)
```

## Summary

- Network address = address **AND** mask; from this the kernel knows whether the recipient is local or must be reached via the gateway.
- In the routing table the **longest prefix** wins; `default` is only the last resort.
- Encapsulation overhead is ~54 bytes per packet: 96% efficiency for a large packet, below 2% for a one-byte one.
- The kernel reads the IPv4 header fields (TTL, protocol, addresses); every router recomputes the **checksum** because the TTL changes.
- The first byte of an HTTPS page takes ~**4 RTT**; the speed of light sets a lower bound (Budapest–New York ≥ 70 ms).
- **speed ≤ window / RTT**; using the full link requires a window of bandwidth × RTT.

## Lesson exercise

```quiz required
? Which network does the address 192.168.10.150/26 belong to? (give the network address, e.g. 192.168.10.0)
= 192.168.10.128
! /26 networks step by 64: .0, .64, .128, .192 – 150 falls into the .128–.191 range.

? How many assignable host addresses are there in a /27 subnet?
= 30
! 32 − 27 = 5 host bits → 2⁵ − 2 = 30.

? The routing table has entries 0.0.0.0/0, 10.8.0.0/16 and 10.8.5.0/24. Which one does a packet to 10.8.5.9 follow?
- 0.0.0.0/0, because it matches everything
- 10.8.0.0/16, because it comes first
+ 10.8.5.0/24, because it is the longest matching prefix
! Longest prefix match.

? What happens to an IP packet whose TTL drops to 0 at a router?
+ the router drops it (and usually notifies the sender with an ICMP message)
- the router resets it to 64 and forwards it
- the router sends the packet to the DNS server instead of the destination
! traceroute builds on this.

? The TCP window is 64 KB and the RTT is 100 ms. At most how many KB/s can we download, however fast the line is?
= 640
= 640 KB/s
! speed ≤ window / RTT = 64 KB / 0.1 s = 640 KB/s.

? Why can't the RTT between Budapest and New York (about 7000 km) be less than 50 ms?
- because routers store the packet for at least 50 ms
+ because light travels at about 200,000 km/s in fibre, so the round trip alone takes at least 70 ms
- because the TCP handshake takes exactly 50 ms
! 2 · 7000 / 200,000 s = 0.07 s.
```
