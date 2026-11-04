---
title: A szoftverek csoportjai
summary: Rendszerszoftver, alkalmazás, segédprogram, illesztőprogram és firmware – ki mit csinál?
minutes: 14
---

## Amit ebben a leckében megtanulsz

- mi a különbség a **hardver** és a **szoftver** között,
- melyek a **rendszerszoftverek** és az **alkalmazások**,
- mi az **illesztőprogram**, a **firmware** és a **segédprogram**.

## Hardver és szoftver

A **hardver** a számítógép kézzelfogható része: processzor, memória, lemez, kijelző. A **szoftver** a programok és a hozzájuk tartozó adatok összessége, ez mondja meg a hardvernek, mit csináljon.

## A rétegek

```text
┌──────────────────────────────────────────────┐
│ alkalmazások: böngésző, Word, Spotify, játék │
├──────────────────────────────────────────────┤
│ segédprogramok: tömörítő, víruskereső, mentés│
├──────────────────────────────────────────────┤
│ operációs rendszer + illesztőprogramok       │  ← rendszerszoftver
├──────────────────────────────────────────────┤
│ firmware (UEFI, a lemez és a router vezérlője)│
├──────────────────────────────────────────────┤
│ hardver                                      │
└──────────────────────────────────────────────┘
```

**Rendszerszoftver** – a gép működtetéséhez kell, a felhasználó ritkán „használja” közvetlenül:

- **operációs rendszer** (Windows, macOS, Linux, Android, iOS),
- **illesztőprogram (driver)**: megtanítja az OS-nek, hogyan beszéljen egy adott eszközzel (videokártya, nyomtató),
- **firmware**: az eszközbe „égetett” alacsony szintű program, pl. az alaplap **UEFI**-je, amely bekapcsoláskor elindítja a gépet.

**Segédprogram (utility)** – a rendszer karbantartását segíti: tömörítő (7-Zip), víruskereső, lemezkarbantartó, mentőprogram.

**Alkalmazás** – egy felhasználói feladatot old meg:

| Kategória      | Példák                               |
| -------------- | ------------------------------------ |
| irodai         | Word, Excel, PowerPoint, LibreOffice |
| böngésző       | Chrome, Firefox, Edge, Safari        |
| kommunikáció   | Teams, Slack, Discord, e-mail kliens |
| grafika, média | GIMP, Photoshop, Figma, VLC          |
| fejlesztés     | VS Code, PyCharm, Git                |
| vállalati      | SAP (ERP), Salesforce (CRM)          |

## Asztali, webes és mobil alkalmazás

- **asztali (natív)**: telepíteni kell, közvetlenül az OS-en fut (pl. VS Code),
- **webes**: a böngészőben fut, nincs telepítés (pl. Gmail, Google Docs),
- **mobil**: alkalmazásboltból telepítjük (App Store, Google Play).

## Összefoglalás

- Hardver = a kézzelfogható rész; szoftver = programok és adatok.
- Rendszerszoftver: OS, illesztőprogramok, firmware. Segédprogram: karbantartás. Alkalmazás: felhasználói feladat.
- Egy alkalmazás lehet asztali, webes vagy mobil.

## A lecke feladata

```quiz required
? Melyik **rendszerszoftver** a felsoroltak közül?
- Excel
- Spotify
+ egy videokártya illesztőprogramja
- Figma
! Az illesztőprogram az OS része, a hardvert kezeli.

? Hogy hívják az eszközbe épített, alacsony szintű programot, amely pl. az alaplapon bekapcsoláskor elindítja a gépet?
= firmware
= UEFI
! A mai alaplapokon ez az UEFI.

? Melyik **segédprogram**?
- Word
+ 7-Zip tömörítő
- Chrome
- Discord
! A segédprogramok a rendszer karbantartását segítik.

? Melyik alkalmazás fut a böngészőben, telepítés nélkül?
- VS Code
- VLC
+ Google Docs
- 7-Zip
! Webes alkalmazás.
```
