---
title: Gyakorlás – hálózatok és internet
summary: Ellenőrző kérdések és összefoglaló feladatlap a hálózatokról, az IP-címről, a DNS-ről és a webről.
minutes: 20
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
