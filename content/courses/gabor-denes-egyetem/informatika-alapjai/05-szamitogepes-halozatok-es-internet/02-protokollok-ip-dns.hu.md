---
title: Rétegek, IP-cím, DNS, port
summary: Az OSI és a TCP/IP modell, az IPv4 és IPv6 cím, a DHCP, a DNS és a portok.
minutes: 18
---

## Amit ebben a leckében megtanulsz

- mi a **protokoll**, és miért rétegekben gondolkodunk (**OSI**, **TCP/IP**),
- mi az **IP-cím** (IPv4, IPv6), a **privát cím** és a **DHCP**,
- mire való a **DNS** és a **port**, és mi a különbség a **TCP** és az **UDP** között.

## Protokoll és rétegek

A **protokoll** a kommunikáció szabályrendszere: milyen formában, milyen sorrendben küldjük az adatot. A hálózati feladatokat **rétegekre** bontjuk; minden réteg csak az alatta lévőt használja.

| OSI-réteg         | TCP/IP-réteg        | Feladata                  | Példa           |
| ----------------- | ------------------- | ------------------------- | --------------- |
| 7. alkalmazási    | alkalmazási         | a program „nyelve”        | HTTP, DNS, SMTP |
| 6. megjelenítési  | ↑                   | kódolás, titkosítás       | TLS             |
| 5. viszony        | ↑                   | kapcsolat kezelése        |                 |
| 4. szállítási     | szállítási          | végpontok közti átvitel   | TCP, UDP        |
| 3. hálózati       | internet            | útvonalválasztás          | IP              |
| 2. adatkapcsolati | hálózati hozzáférés | szomszédok közti keret    | Ethernet, Wi-Fi |
| 1. fizikai        | ↑                   | bitek a kábelen/levegőben | kábel, rádió    |

## IP-cím

Minden eszköznek a hálózaton **IP-címe** van, ez alapján találják meg a csomagok.

- **IPv4**: 32 bit, négy 0–255 közötti szám: `192.168.1.10`. Kb. 4,3 milliárd (2³²) cím – ez kevés.
- **IPv6**: 128 bit, hexadecimálisan: `2001:db8::1`. Gyakorlatilag kifogyhatatlan.

A **privát** címtartományok (`192.168.x.x`, `10.x.x.x`, `172.16–31.x.x`) csak a helyi hálózaton belül érvényesek; a router **NAT**-tal (címfordítással) egy közös nyilvános címen engedi ki őket az internetre.

A címet általában nem kézzel adjuk meg: a **DHCP**-szerver (otthon a router) automatikusan kioszt egy szabad címet, a **maszkot**, az **alapértelmezett átjárót** (a router címét) és a DNS-szervert.

## DNS

Az emberek neveket jegyeznek meg (`gde.hu`), a gépek IP-címeket. A **DNS** (Domain Name System) a „telefonkönyv”: a domainnevet IP-címre fordítja.

```powershell
nslookup gde.hu        # milyen IP-cím tartozik a névhez?
ipconfig /all          # a gép IP-címe, átjárója, DNS-szervere (Windows)
ping 8.8.8.8           # elérhető-e egy cím, mennyi a késleltetés?
```

## Port, TCP és UDP

Egy gépen sok program kommunikál egyszerre. A **port** (0–65535) azonosítja, melyik programnak szól a csomag. Nevezetes portok: **80** (HTTP), **443** (HTTPS), **22** (SSH), **53** (DNS), **25** (SMTP).

- **TCP**: megbízható, sorrendhelyes átvitel nyugtázással (web, e-mail, fájlátvitel),
- **UDP**: gyors, nyugtázás nélküli (videóhívás, online játék, DNS-lekérdezés) – egy elveszett csomag nem baj, a késés igen.

## Összefoglalás

- Protokoll = kommunikációs szabály; rétegek: OSI (7) és TCP/IP (4).
- IPv4: 32 bit, IPv6: 128 bit; privát cím + NAT; a DHCP automatikusan ad címet.
- DNS: név → IP-cím; port: melyik program; TCP megbízható, UDP gyors.

## A lecke feladata

```quiz required
? Hány bites egy IPv4-cím?
= 32
! Négy 8 bites szám (0–255).

? Melyik szolgáltatás fordítja a `gde.hu` nevet IP-címre?
- DHCP
+ DNS
- NAT
- TCP
! Domain Name System.

? Melyik porton fut alapértelmezetten a HTTPS?
= 443
! A HTTP a 80-as porton fut.

? Melyik cím **privát** IPv4-cím?
- 8.8.8.8
+ 192.168.0.15
- 151.101.1.69
- 1.1.1.1
! A 192.168.x.x tartomány privát.

? Melyik szállítási protokollt használja inkább egy videóhívás, ahol a késés rosszabb, mint egy elveszett csomag?
- TCP
+ UDP
- HTTP
- DNS
! Az UDP nem vár nyugtázásra.
```
