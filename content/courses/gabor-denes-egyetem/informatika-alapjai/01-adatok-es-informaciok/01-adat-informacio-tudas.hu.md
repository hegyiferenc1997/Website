---
title: Adat, információ, tudás
summary: Mi a különbség az adat és az információ között, és mit jelent az informatika szó?
minutes: 12
---

## Amit ebben a leckében megtanulsz

- mi az **adat**, az **információ** és a **tudás**, és hogyan épülnek egymásra,
- mit jelent az **informatika** szó,
- mi a **bit**, és miért kettes számrendszerben „gondolkodik” a gép.

## Adat, információ, tudás

Az **adat** önmagában értelmezés nélküli jel vagy tény: `23`, `"Budapest"`, `2026-11-04`. Ha egy adatot **összefüggésbe helyezünk**, és jelentést kap, **információ** lesz belőle: „Budapesten ma 23 °C van.” Ha az információkból általános szabályt vonunk le, és döntéshez használjuk, az már **tudás**: „Ha 20 °C fölött van, nem kell kabát.”

```text
   bölcsesség   ← mit érdemes tenni hosszú távon?
      ▲
    tudás       ← szabályok, tapasztalat („ha…, akkor…”)
      ▲
  információ    ← értelmezett adat („ma 23 °C van”)
      ▲
     adat       ← nyers jel („23”)
```

Ezt a lépcsőt **DIKW-piramisnak** (Data–Information–Knowledge–Wisdom) hívják. A cégek ugyanezt csinálják: a nyers adatokból (eladások táblázata) jelentés (havi forgalom), abból döntés (melyik terméket gyártsuk többet) lesz.

## Mit jelent az informatika?

Az **informatika** az információ **gyűjtésével, tárolásával, feldolgozásával és továbbításával** foglalkozik, főleg számítógéppel. A négy alapművelet minden rendszerben megjelenik:

| Művelet     | Példa                                 |
| ----------- | ------------------------------------- |
| gyűjtés     | egy szenzor méri a hőmérsékletet      |
| tárolás     | az adat egy adatbázisba kerül         |
| feldolgozás | egy program kiszámolja a napi átlagot |
| továbbítás  | az eredmény a telefonodra érkezik     |

## A bit

A számítógép **kétállapotú** jelekkel dolgozik: van feszültség vagy nincs, mágnesezett vagy nem. Ezt a két állapotot `0`-val és `1`-gyel jelöljük. Egy ilyen kétállapotú egység a **bit** (binary digit), az információ legkisebb egysége.

`n` bittel `2ⁿ` különböző állapotot lehet leírni: 1 bittel 2-t, 2 bittel 4-et, 8 bittel 256-ot. Ezért kell például 8 bit egy olyan színcsatornához, amely 256 fényerősséget tud.

## Összefoglalás

- Adat = nyers jel; információ = értelmezett adat; tudás = általánosított, döntéshez használt információ.
- Az informatika az információ gyűjtése, tárolása, feldolgozása és továbbítása.
- A bit két állapotú egység; `n` bittel `2ⁿ` állapot írható le.

## A lecke feladata

```quiz required
? Melyik az **információ** a felsoroltak közül?
- 37,2
- „Kovács Anna”
+ Kovács Anna testhőmérséklete 37,2 °C.
- 2026
! Az információ összefüggésbe helyezett, jelentéssel bíró adat.

? Hogy hívják az információ legkisebb egységét, amely két állapotot vehet fel?
= bit
! binary digit = bináris számjegy.

? Hány különböző állapotot lehet leírni 5 bittel?
= 32
! 2⁵ = 32.

? Melyik NEM tartozik az informatika négy alapművelete közé?
- tárolás
- feldolgozás
+ forrasztás
- továbbítás
! A négy alapművelet: gyűjtés, tárolás, feldolgozás, továbbítás.
```
