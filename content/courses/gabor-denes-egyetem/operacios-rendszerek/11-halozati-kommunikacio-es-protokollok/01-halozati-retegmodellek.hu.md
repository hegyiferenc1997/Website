---
title: Hálózati rétegmodellek
summary: Az OSI hétrétegű és a TCP/IP négyrétegű modell, a beágyazás, és hogy melyik réteg hol fut a gépeden.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- miért **rétegekre** bontjuk a hálózati kommunikációt,
- mi az **OSI** és a **TCP/IP** modell, és mit csinál az egyes rétegek,
- mi a **beágyazás** (_encapsulation_), és melyik réteg fut a **kernelben**.

## Miért rétegek?

Egy weboldal letöltésekor rengeteg kérdést kell megoldani: milyen jelet küldjünk a kábelen, hogyan találjuk meg a célgépet a világ másik végén, hogyan pótoljuk az elveszett csomagokat, mit jelent a kérés. Ha mindezt egyetlen programba írnánk, kezelhetetlen lenne. A **rétegek** mindegyike egy feladatot old meg, és csak a szomszédos rétegekkel beszél – így pl. a böngészőnek nem kell tudnia, hogy Wi-Fin vagy kábelen jön a csomag.

## Az OSI és a TCP/IP modell

| #   | OSI réteg           | TCP/IP réteg        | Feladata                                       | Példa                     |
| --- | ------------------- | ------------------- | ---------------------------------------------- | ------------------------- |
| 7   | alkalmazási         | **alkalmazási**     | a program „nyelve”                             | HTTP, DNS, SSH, SMTP      |
| 6   | megjelenítési       | ↑                   | kódolás, titkosítás, tömörítés                 | TLS, UTF-8                |
| 5   | viszony             | ↑                   | kapcsolatok, munkamenetek                      | (gyakran az alkalmazásban)|
| 4   | **szállítási**      | **szállítási**      | végponttól végpontig, portok, megbízhatóság    | **TCP**, **UDP**          |
| 3   | **hálózati**        | **internet**        | címzés és útvonalválasztás hálózatok között    | **IP** (IPv4, IPv6), ICMP |
| 2   | adatkapcsolati      | **hálózati hozzáférés** | keretek a helyi hálózaton, MAC-címek       | Ethernet, Wi-Fi           |
| 1   | fizikai             | ↓                   | bitek jelként (feszültség, fény, rádió)        | kábel, rádióhullám        |

Az **OSI** (7 réteg) elméleti referenciamodell; az internet a gyakorlatias **TCP/IP** (4 réteg) modellt követi.

## Beágyazás

Küldéskor minden réteg **saját fejlécet** tesz az adat elé, és továbbadja az alatta lévőnek; fogadáskor fordítva, minden réteg leveszi a sajátját.

```text
alkalmazás:   [ HTTP-kérés: GET /index.html ]
szállítási:   [ TCP-fejléc | HTTP-kérés ]                         ← szegmens
internet:     [ IP-fejléc | TCP-fejléc | HTTP-kérés ]             ← csomag
hozzáférés:   [ Eth-fejléc | IP | TCP | HTTP | Eth-ellenőrző ]    ← keret
fizikai:      0110100101…                                         ← bitek
```

A TCP-fejlécben vannak a **portok**, az IP-fejlécben az **IP-címek**, az Ethernet-fejlécben a **MAC-címek**.

## Melyik réteg hol fut?

| Réteg                      | Hol fut?                                                |
| -------------------------- | ------------------------------------------------------- |
| alkalmazási                | **felhasználói módban**, a programban (böngésző, ssh)  |
| szállítási + internet (TCP/IP) | a **kernelben** – ez a hálózati verem (_network stack_) |
| hálózati hozzáférés        | a kártya **illesztőprogramja** (kernel) és a hálózati kártya hardvere |
| fizikai                    | hardver                                                  |

A program és a kernel hálózati verme között a **socket** a határ – erről a harmadik leckében lesz szó.

## Összefoglalás

- A rétegek mindegyike egy feladatot old meg, és csak a szomszédaival beszél.
- OSI: 7 réteg (elméleti); TCP/IP: 4 réteg (alkalmazási, szállítási, internet, hálózati hozzáférés).
- Beágyazás: minden réteg saját fejlécet tesz az adatra; szegmens → csomag → keret.
- A TCP/IP verem a kernelben fut, az alkalmazási protokollok a programokban.

## A lecke feladata

```quiz required
? Hány rétegű az OSI referenciamodell?
= 7
= hét
! A TCP/IP modell 4 rétegű.

? Melyik rétegben működik az IP protokoll a TCP/IP modellben?
- alkalmazási
- szállítási
+ internet (hálózati)
- hálózati hozzáférés
! Címzés és útvonalválasztás hálózatok között.

? Melyik rétegbe tartozik a TCP és az UDP?
+ szállítási
- internet
- alkalmazási
- fizikai
! Végponttól végpontig, portokkal.

? Hogy hívják azt, amikor minden réteg saját fejlécet tesz az adat elé?
= beágyazás
= enkapszuláció
= encapsulation
! Fogadáskor fordítva: kibontás.

? Hol fut a TCP/IP hálózati verem egy mai operációs rendszerben?
- a böngészőben
+ a kernelben
- a BIOS-ban
- a routerben
! A program a socketen keresztül éri el.
```
