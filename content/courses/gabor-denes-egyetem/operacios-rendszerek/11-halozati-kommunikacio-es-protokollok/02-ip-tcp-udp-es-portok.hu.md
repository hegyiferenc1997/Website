---
title: IP-címek, TCP, UDP és portok
summary: IPv4 és IPv6, magáncímek és alhálózati maszk, a TCP és az UDP különbsége, a portok, a DNS és a DHCP – parancsokkal együtt.
minutes: 30
---

## Amit ebben a leckében megtanulsz

- hogyan épül fel egy **IPv4** és **IPv6** cím, mi a **magáncím** és az **alhálózati maszk**,
- miben különbözik a **TCP** és az **UDP**, és mire valók a **portok**,
- mit csinál a **DNS** és a **DHCP**, és melyik paranccsal nézed meg mindezt.

## IP-címek

- **IPv4**: 32 bites cím, négy 0–255 közötti számmal: `192.168.1.25`. Összesen 2³² ≈ 4,3 milliárd cím – ez **elfogyott**.
- **IPv6**: 128 bites cím, hexadecimálisan: `2001:db8::1` (a `::` nullák sorozatát rövidíti). Gyakorlatilag kifogyhatatlan.

### Magáncímek és NAT

Ezek a tartományok **nem** jutnak ki az internetre, otthoni és céges hálózatokban szabadon használhatók:

- `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`.

Az otthoni router **NAT**-tal (címfordítással) egyetlen nyilvános címen engedi ki az összes gépet. Ugyanezt csinálja a VirtualBox **NAT** módja: a vendég a `10.0.2.15` magáncímet kapja.

A `127.0.0.1` (IPv6-ban `::1`) a **visszacsatolási** cím (_localhost_): mindig a saját gépet jelenti.

### Alhálózati maszk

A `192.168.1.25/24` jelölésben a **/24** azt mondja, hogy az első 24 bit a **hálózat**, a maradék 8 bit a **gép** azonosítója (maszk: `255.255.255.0`). A gépeknek kiosztható címek száma: 2⁸ − 2 = **254** (a csupa 0 a hálózat címe, a csupa 1 a szórási cím).

| Előtag | Maszk             | Gépbitek | Kiosztható címek |
| ------ | ----------------- | -------- | ---------------- |
| /24    | 255.255.255.0     | 8        | 254              |
| /25    | 255.255.255.128   | 7        | 126              |
| /26    | 255.255.255.192   | 6        | 62               |
| /16    | 255.255.0.0       | 16       | 65 534           |

## TCP és UDP

| Szempont          | **TCP**                                              | **UDP**                                  |
| ----------------- | ---------------------------------------------------- | ---------------------------------------- |
| kapcsolat         | **kapcsolatorientált** (háromutas kézfogás: SYN, SYN-ACK, ACK) | **kapcsolat nélküli**        |
| megbízhatóság     | elveszett csomagot újraküld, sorrendet tart         | nincs garancia                           |
| sebesség, rezsi   | lassabb, nagyobb fejléc                              | gyors, kis fejléc                        |
| tipikus használat | web (HTTP/1–2), e-mail, SSH, fájlátvitel             | DNS, videóhívás, online játék, élő közvetítés |

Videóhívásnál jobb egy pillanatra elveszíteni egy képkockát, mint megvárni az újraküldését – ezért UDP.

## Portok

Egy gépen sok program kommunikál egyszerre. A **port** (16 bites szám, **0–65535**) mondja meg, melyik programnak szól a csomag. Egy kapcsolatot öt adat azonosít: protokoll, forrás IP, forrás port, cél IP, cél port.

| Port  | Protokoll | Szolgáltatás              |
| ----- | --------- | ------------------------- |
| 22    | TCP       | **SSH** (távoli parancssor) |
| 53    | UDP/TCP   | **DNS**                   |
| 80    | TCP       | **HTTP**                  |
| 443   | TCP (UDP: HTTP/3) | **HTTPS**         |
| 3389  | TCP       | Windows Távoli asztal     |

Az 1024 alatti („jól ismert”) portokon Linuxon csak a **root** indíthat szervert.

## DNS és DHCP

- **DNS** (_Domain Name System_): nevet fordít IP-címre (`gde.hu` → `…`). Olyan, mint a telefonkönyv.
- **DHCP**: a gép csatlakozáskor **automatikusan** kap IP-címet, maszkot, alapértelmezett átjárót (routert) és DNS-szervert.

## Parancsok

```bash
ip addr                      # a gép IP-címei (Ubuntu VM-ben: 10.0.2.15/24)
ip route                     # alapértelmezett átjáró (default via 10.0.2.2)
ping -c 4 8.8.8.8            # elérhető-e egy gép (ICMP)
resolvectl query ubuntu.com  # DNS-feloldás
ss -tuln                     # mely portokon figyel szerver a gépen
```

```powershell
ipconfig /all                # IP-cím, DNS, DHCP Windowson
Test-NetConnection ubuntu.com -Port 443
Resolve-DnsName ubuntu.com
```

## Összefoglalás

- IPv4: 32 bit, elfogyott; IPv6: 128 bit. Magáncímek: 10/8, 172.16/12, 192.168/16; localhost: 127.0.0.1.
- /24 → 8 gépbit → 254 kiosztható cím.
- TCP: kapcsolatorientált, megbízható; UDP: kapcsolat nélküli, gyors.
- Port: 0–65535, a programot azonosítja (22 SSH, 53 DNS, 80 HTTP, 443 HTTPS); DNS: név → cím; DHCP: automatikus beállítás.

## A lecke feladata

```quiz required
? Hány bites egy IPv4-cím?
= 32
! IPv6: 128 bit.

? Hány kiosztható gépcím van egy /26-os alhálózatban?
= 62
! 32 − 26 = 6 gépbit → 2⁶ − 2 = 62.

? Melyik protokollt használja tipikusan a DNS-lekérdezés és a videóhívás?
- TCP
+ UDP
- ICMP
- ARP
! Gyors, kapcsolat nélküli, kis rezsi.

? Melyik porton fut alapból a HTTPS?
= 443
! A HTTP a 80-ason.

? Melyik szolgáltatás ad a gépnek automatikusan IP-címet csatlakozáskor?
+ DHCP
- DNS
- SSH
- NAT
! Dynamic Host Configuration Protocol.
```
