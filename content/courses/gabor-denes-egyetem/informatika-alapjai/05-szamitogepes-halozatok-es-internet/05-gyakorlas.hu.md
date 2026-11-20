---
title: Gyakorlás – hálózatok és internet
summary: Ellenőrző kérdések és összefoglaló feladatlap a hálózatokról, az IP-címről, a DNS-ről és a webről.
minutes: 45
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Otthon a laptopod IP-címe 192.168.1.23, de egy „mi az IP-címem” oldal 84.2.x.x-et mutat. Miért?</summary>

A 192.168.1.23 privát cím, csak a lakáson belül érvényes. A router NAT-tal a szolgáltatótól kapott nyilvános címen (84.2.x.x) engedi ki a forgalmat az internetre.

</details>

<details>
<summary>2. A böngésző azt írja: „A szerver IP-címe nem található”. Melyik lépésnél akadt el?</summary>

A DNS-feloldásnál: nem sikerült a domainnevet IP-címre fordítani (elírt cím, nem létező domain vagy nem működő DNS-szerver).

</details>

<details>
<summary>3. Mi a különbség a switch és a router között?</summary>

A switch egy hálózaton belül MAC-cím alapján továbbít; a router különböző hálózatok között IP-cím alapján választ útvonalat.

</details>

<details>
<summary>4. Miért veszélyes jelszót megadni egy http:// kezdetű oldalon nyilvános Wi-Fin?</summary>

Mert az adat titkosítás nélkül megy, így a hálózaton bárki elolvashatja vagy módosíthatja.

</details>

Próbáld ki (Windows PowerShell):

```powershell
ipconfig            # IP-cím, maszk, alapértelmezett átjáró
nslookup google.com # DNS-feloldás
tracert gde.hu      # milyen routereken át jut el a csomag?
```

## Összefoglaló feladatlap

```quiz required
? Hány bites egy IPv6-cím?
= 128
! Négyszer annyi bit, mint az IPv4.

? Melyik szolgáltatás oszt ki automatikusan IP-címet a hálózatra csatlakozó eszközöknek?
+ DHCP
- DNS
- HTTP
- SSH
! Dynamic Host Configuration Protocol.

? Melyik porton fut alapértelmezetten az SSH?
= 22
! Távoli bejelentkezés szerverre.

? Mit jelent az 500-as HTTP-állapotkód?
- az oldal nem található
- átirányítás
+ belső szerverhiba
- minden rendben
! 5xx: a szerver hibája.

? Melyik OSI-rétegben dolgozik az IP protokoll?
- fizikai
- adatkapcsolati
+ hálózati
- alkalmazási
! A 3. réteg az útvonalválasztásé.

? Milyen topológiájú a legtöbb mai LAN?
+ csillag
- busz
- gyűrű
- teljes háló
! Minden eszköz egy központi switchhez csatlakozik.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Kiosztható címek.** Írd meg a `gepek(elotag)` függvényt, amely megadja, hány gépnek osztható ki cím egy `/elotag` hálózatban (a hálózat- és a szórási címet nem számítva)! `/31` és `/32` esetén adjon 0-t.

```python starter
def gepek(elotag):
    return 2 ** (32 - elotag)
```

<details>
<summary>Megoldás</summary>

```python solution
def gepek(elotag):
    if elotag >= 31:
        return 0
    return 2 ** (32 - elotag) - 2          # a csupa 0 és a csupa 1 foglalt
```

</details>

```python test
assert gepek(24) == 254
assert gepek(26) == 62
assert gepek(30) == 2
assert gepek(16) == 65534
assert gepek(32) == 0
print("Minden ellenőrzés sikeres!")
```

**2.** **Ugyanabban a hálózatban?** Írd meg az `azonos_halo(ip1, ip2, elotag)` függvényt, amely két IPv4-címről (szövegként) eldönti, hogy az első `elotag` bitjük megegyezik-e! (Az `ipaddress` modult most ne használd.)

```python starter
def azonos_halo(ip1, ip2, elotag):
    return ip1.split(".")[0] == ip2.split(".")[0]
```

<details>
<summary>Megoldás</summary>

```python solution
def azonos_halo(ip1, ip2, elotag):
    def szam(ip):
        a, b, c, d = (int(x) for x in ip.split("."))
        return (a << 24) | (b << 16) | (c << 8) | d     # 32 bites egész
    maszk = (0xFFFFFFFF << (32 - elotag)) & 0xFFFFFFFF
    return szam(ip1) & maszk == szam(ip2) & maszk
```

</details>

```python test
assert azonos_halo("192.168.1.37", "192.168.1.200", 24) is True
assert azonos_halo("192.168.1.37", "192.168.2.5", 24) is False
assert azonos_halo("10.0.0.1", "10.0.0.130", 25) is False
assert azonos_halo("10.0.0.1", "10.0.0.100", 25) is True
print("Minden ellenőrzés sikeres!")
```

**3.** **Letöltési idő.** Írd meg a `letoltes(meret_mb, keresek, mbit, rtt_ms)` függvényt: az idő másodpercben a kérések száma × RTT, plusz a méret (megabájtban) bitre váltva osztva a sávszélességgel (Mbit/s), 2 tizedesre kerekítve!

```python starter
def letoltes(meret_mb, keresek, mbit, rtt_ms):
    return round(meret_mb / mbit, 2)
```

<details>
<summary>Megoldás</summary>

```python solution
def letoltes(meret_mb, keresek, mbit, rtt_ms):
    kesleltetes = keresek * rtt_ms / 1000      # ms → s
    atvitel = meret_mb * 8 / mbit              # MB → Mbit
    return round(kesleltetes + atvitel, 2)
```

</details>

```python test
assert letoltes(100, 0, 200, 50) == 4.0
assert letoltes(2, 40, 50, 50) == 2.32
assert letoltes(2, 40, 500, 50) == 2.03
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Melyik protokoll fordítja a domainnevet IP-címre?
- DHCP
+ DNS
- HTTP
- FTP
! A DNS a „telefonkönyv”.

? Melyik állapotkód jelenti, hogy a kért oldal nem található?
= 404
! 4xx: a kliens hibája.

? Hány bit egy IPv6-cím?
= 128
! Az IPv4 32 bites.

? Miért nem segít sokat egy gyorsabb előfizetés egy sok kis fájlból álló weboldalnál?
- mert a gyorsabb előfizetés hamis
+ mert ilyenkor a kérések oda-vissza útja (késleltetés) dominál, nem a sávszélesség
- mert a böngésző nem használja ki
- mert a képek nem töltődnek le
! Segít viszont a kevesebb kérés és a közelebbi szerver (CDN).
```
