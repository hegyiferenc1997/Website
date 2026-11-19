---
title: Gyakorlás – hálózati kommunikáció
summary: Hálózati felderítés a két VM között, ellenőrző kérdések és összefoglaló feladatlap.
minutes: 30
kind: practice
---

## Labor: a két VM beszélget

1. Állítsd mindkét VM hálózatát **Belső hálózat**-ra (azonos névvel, pl. `oslabor`), vagy **Híd** módra.
2. Ubuntun: `ip addr` – jegyezd fel a címet. Windows 11-en: `ipconfig`.
3. Belső hálózaton nincs DHCP – adj kézzel címet. Ubuntun: `sudo ip addr add 192.168.50.10/24 dev enp0s3`; Windowson a **Gépház → Hálózat → Ethernet → IP-hozzárendelés → Szerkesztés → Kézi** menüben `192.168.50.20`, maszk `255.255.255.0`.
4. `ping 192.168.50.20` az Ubuntuból. (Ha nem válaszol: a Windows tűzfala alapból tiltja a pinget – engedélyezd a _Fájl- és nyomtatómegosztás (ICMPv4 visszhangkérés)_ szabályt.)
5. Indítsd el az előző lecke szerverét `0.0.0.0` címre kötve, és Windowsról csatlakozz: `Test-NetConnection 192.168.50.10 -Port 5000`.
6. A végén állítsd vissza a hálózatot **NAT**-ra.

## Ellenőrző kérdések

<details>
<summary>1. Miért kap a VirtualBox NAT módban minden vendég 10.0.2.15-ös címet, és miért nem ütköznek?</summary>

Mert minden VM saját, elszigetelt NAT-hálózatot kap a VirtualBoxtól; a 10.0.2.15 magáncím csak azon belül érvényes. Kifelé a gazdagép címével mennek ki a csomagok.

</details>

<details>
<summary>2. Miért használ a web TCP-t, a videóhívás pedig UDP-t?</summary>

A weboldalnál minden bájtnak hibátlanul és sorrendben kell megérkeznie, ezt a TCP garantálja. Videóhívásnál a késés rosszabb, mint egy elveszett képkocka, ezért az UDP gyorsasága fontosabb.

</details>

<details>
<summary>3. Mi a különbség a 127.0.0.1 és a 0.0.0.0 címre kötött szerver között?</summary>

A 127.0.0.1-re kötött szerver csak a saját gépről érhető el. A 0.0.0.0 „minden interfészt” jelent, így a hálózat többi gépéről is elérhető (ha a tűzfal engedi).

</details>

<details>
<summary>4. Miért kell szinkronizálni a közös memóriát használó folyamatokat, a csövet használókat viszont nem?</summary>

A csövön a kernel másolja az adatot, és ő gondoskodik a sorrendről és a kölcsönös kizárásról. Közös memóriánál mindkét folyamat közvetlenül ugyanazt a területet írja, ezért versenyhelyzet alakulhat ki – mutex vagy szemafor kell.

</details>

## Összefoglaló feladatlap

```quiz required
? Hány kiosztható gépcím van egy /24-es alhálózatban?
= 254
! 2⁸ − 2 = 254.

? Melyik port az SSH alapértelmezése?
= 22
! ssh felhasznalo@gep – a 22-es TCP porton.

? Melyik tartomány magáncím (nem jut ki az internetre)?
+ 192.168.0.0/16
- 8.8.8.0/24
- 1.1.1.0/24
- 151.101.0.0/16
! Magáncímek: 10/8, 172.16/12, 192.168/16.

? Melyik TCP/IP rétegben vannak a portok?
- alkalmazási
+ szállítási
- internet
- hálózati hozzáférés
! A TCP- és UDP-fejléc tartalmazza őket.

? Melyik Linux-parancs mutatja, mely portokon figyel szerver?
+ ss -tuln
- ping
- ip route
- nslookup
! t = TCP, u = UDP, l = figyelő, n = számmal.

? Mi a legnagyobb portszám?
= 65535
! 16 bites szám: 0–65535.
```
