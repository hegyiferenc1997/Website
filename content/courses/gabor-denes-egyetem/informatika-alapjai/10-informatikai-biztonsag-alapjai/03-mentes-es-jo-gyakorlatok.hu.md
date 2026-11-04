---
title: Mentés és jó gyakorlatok
summary: A 3-2-1 mentési szabály, frissítések, tűzfal és víruskereső, nyilvános Wi-Fi, a legkisebb jogosultság elve.
minutes: 15
---

## Amit ebben a leckében megtanulsz

- hogyan ments jól: a **3-2-1 szabály**,
- melyek a **mindennapi biztonsági szokások**,
- mi a **legkisebb jogosultság** elve, és mit kell tenni egy **incidens** után.

## A 3-2-1 mentési szabály

- **3** példány az adatból (az eredeti + két mentés),
- **2** különböző tárolón (pl. a laptop SSD-je és egy külső lemez),
- **1** példány máshol, **offline** vagy a felhőben (tűz, lopás, zsarolóvírus ellen).

```text
 laptop (eredeti) ──► külső lemez (hetente, utána lecsatlakoztatva)
        └──────────► felhős mentés (folyamatos, verziókkal)
```

A zsarolóvírus a csatlakoztatott meghajtókat is titkosítja, ezért kell **lecsatlakoztatott** vagy **verziókat** őrző mentés. És: **próbáld ki a visszaállítást** – a sosem tesztelt mentés nem mentés.

| Mentéstípus     | Mit ment?                                   |
| --------------- | ------------------------------------------- |
| **teljes**      | mindent, minden alkalommal                  |
| **növekményes** | csak az előző mentés óta változott fájlokat |
| **különbözeti** | a legutóbbi teljes mentés óta változottakat |

## Mindennapi szokások

1. **Frissíts** – operációs rendszer, böngésző, alkalmazások; kapcsold be az automatikus frissítést.
2. **Tűzfal és víruskereső** – Windowson a beépített Microsoft Defender jó alap; maradjon bekapcsolva.
3. **Nyilvános Wi-Fi** – ott ne intézz banki ügyet; ha muszáj, használj mobilnetet vagy VPN-t.
4. **Képernyőzár** – a gép zárolása, ha feláll mellőle (`Win + L`).
5. **Csak megbízható forrásból** telepíts, és ne kapcsold be az Office-makrókat ismeretlen fájlban.
6. **Titkosított lemez** – BitLocker (Windows), FileVault (macOS): ha ellopják a laptopot, az adat nem olvasható.

## A legkisebb jogosultság elve

Mindenki (felhasználó, program) **csak annyi jogot** kapjon, amennyi a feladatához kell. A mindennapi munkát **ne rendszergazdai** fiókkal végezd: ha egy kártevő elindul, a te jogaiddal fut, így kevesebb kárt tud okozni.

## Ha baj van (incidens)

1. Válaszd le a gépet a hálózatról (Wi-Fi ki, kábel ki).
2. Szólj azonnal a cég vagy az egyetem informatikusainak – ne szégyelld, minél korábban, annál jobb.
3. Változtasd meg a jelszavakat (egy **másik**, tiszta gépről), és nézd át, hol volt ugyanaz a jelszó.
4. Állítsd vissza a rendszert a mentésből.

## Összefoglalás

- 3-2-1: három példány, két tároló, egy máshol/offline; teszteld a visszaállítást.
- Frissítés, tűzfal, víruskereső, képernyőzár, titkosított lemez, óvatosság nyilvános Wi-Fin.
- Legkisebb jogosultság: ne dolgozz rendszergazdaként; incidensnél: leválasztás, jelentés, jelszócsere, visszaállítás.

## A lecke feladata

```quiz required
? Hány példány kell az adatból a 3-2-1 szabály szerint?
= 3
! Az eredeti és két mentés.

? Miért kell legalább egy mentés **offline** vagy máshol?
- Mert a felhő mindig drága.
+ Mert a zsarolóvírus, a tűz vagy a lopás a helyben, csatlakoztatott példányokat is elviheti.
- Mert így gyorsabb a gép.
- Mert a törvény előírja.
! A lecsatlakoztatott példányt a kártevő nem éri el.

? Melyik mentéstípus menti csak az **előző mentés óta** változott fájlokat?
- teljes
+ növekményes
- különbözeti
! Incremental backup.

? Mi az első teendő, ha gyanús, hogy a géped megfertőződött?
+ leválasztani a hálózatról
- újraindítani a routert
- törölni a böngészési előzményeket
- várni, hátha elmúlik
! Így nem terjed tovább, és nem küld ki adatot.
```
