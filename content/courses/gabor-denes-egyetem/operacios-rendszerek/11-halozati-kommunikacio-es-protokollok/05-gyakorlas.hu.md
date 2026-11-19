---
title: Gyakorlás – hálózati kommunikáció
summary: Hálózati felderítés a két VM között, ellenőrző kérdések és összefoglaló feladatlap.
minutes: 55
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

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Hálózati cím kézzel.** Írd meg a `halozat(cim, elotag)` függvényt **bitműveletekkel** (az `ipaddress` modul nélkül): a pontozott IPv4-címből és az előtag hosszából add vissza a hálózat címét pontozott formában!

```python starter
def halozat(cim, elotag):
    return cim
```

<details>
<summary>Megoldás</summary>

```python solution
def halozat(cim, elotag):
    szam = 0
    for resz in cim.split("."):              # a négy bájtból egy 32 bites szám
        szam = szam * 256 + int(resz)
    maszk = (0xFFFFFFFF << (32 - elotag)) & 0xFFFFFFFF
    h = szam & maszk                         # bitenkénti ÉS
    return ".".join(str(h >> eltolas & 255) for eltolas in (24, 16, 8, 0))
```

</details>

```python test
assert halozat("192.168.10.77", 26) == "192.168.10.64"
assert halozat("192.168.1.25", 24) == "192.168.1.0"
assert halozat("10.8.5.200", 16) == "10.8.0.0"
assert halozat("172.20.3.9", 12) == "172.16.0.0"
print("Minden ellenőrzés sikeres!")
```

**2.** **Melyik előtag kell?** Írd meg a `legkisebb_halo(gepek)` függvényt: legalább hány bites előtagot (a lehető **legnagyobbat**, vagyis a legkisebb hálózatot) válasszunk, hogy `gepek` darab gép elférjen? (A hálózat és a szórási cím nem osztható ki.)

```python starter
def legkisebb_halo(gepek):
    return 24
```

<details>
<summary>Megoldás</summary>

```python solution
def legkisebb_halo(gepek):
    for elotag in range(30, 0, -1):          # a legkisebb hálózattól kezdve
        if 2 ** (32 - elotag) - 2 >= gepek:
            return elotag
```

</details>

```python test
assert legkisebb_halo(2) == 30
assert legkisebb_halo(50) == 26
assert legkisebb_halo(62) == 26
assert legkisebb_halo(63) == 25
assert legkisebb_halo(254) == 24
print("Minden ellenőrzés sikeres!")
```

**3.** **A TCP-ablak korlátja.** Írd meg a `max_mbit(ablak_kb, rtt_ms)` függvényt: legfeljebb hány Mbit/s érhető el egy adott ablakmérettel és RTT-vel (sebesség = ablak / RTT; 1 KB = 1024 bájt, 1 Mbit = 10⁶ bit; egy tizedesre)?

```python starter
def max_mbit(ablak_kb, rtt_ms):
    return ablak_kb
```

<details>
<summary>Megoldás</summary>

```python solution
def max_mbit(ablak_kb, rtt_ms):
    bit = ablak_kb * 1024 * 8
    return round(bit / (rtt_ms / 1000) / 1e6, 1)
```

</details>

```python test
assert max_mbit(64, 50) == 10.5
assert max_mbit(64, 5) == 104.9
assert max_mbit(1024, 100) == 83.9
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Melyik protokoll garantálja, hogy az adatok sorrendben és hiánytalanul megérkeznek?
+ TCP
- UDP
- IP
! Az UDP gyorsabb, de nem garantál semmit – videóhívásra, játékra jó.

? Melyik szolgáltatás alakítja a domainnevet (pl. www.example.com) IP-címmé?
+ DNS
- DHCP
- NAT
! A DHCP az IP-címet osztja ki a gépeknek.

? Melyik cím a visszacsatolási (localhost) cím IPv4-ben?
= 127.0.0.1
! IPv6-ban ::1.

? Melyik porton figyel alapértelmezetten egy HTTPS-webszerver?
= 443
! HTTP: 80, SSH: 22.

? Mit csinál a NAT az otthoni routeren?
+ a belső hálózat magáncímeit egyetlen nyilvános címre fordítja, így sok gép osztozhat egy nyilvános IP-n
- titkosítja a forgalmat
- gyorsítja a letöltést
! A VirtualBox NAT módja is ezt csinálja.
```
