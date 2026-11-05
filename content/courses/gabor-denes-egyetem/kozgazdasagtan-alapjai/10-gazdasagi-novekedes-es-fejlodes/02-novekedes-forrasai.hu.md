---
title: A növekedés forrásai
summary: Miért gazdagabbak egyes országok? A termelési függvény, a tőkefelhalmozás és a csökkenő hozadék, a Solow-modell tanulsága, a technológia és a teljes tényezőtermelékenység, a humántőke, az innováció és az intézmények szerepe.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- mit mutat a **termelési függvény**,
- miért nem elég a **tőkefelhalmozás** a tartós növekedéshez (**csökkenő hozadék**),
- mi a **Solow-modell** fő tanulsága,
- mi a **teljes tényezőtermelékenység** (TFP), és mi növeli,
- miért döntőek az **intézmények**.

## A termelési függvény

Egy gazdaság kibocsátása ($Y$) a termelési tényezőktől és a technológiától függ:

$$ Y = A \cdot F(K, L, H, N) $$

- $K$: fizikai tőke (gépek, épületek, szerverek, infrastruktúra),
- $L$: munka (dolgozók, munkaórák),
- $H$: humántőke (tudás, képzettség – 8. témakör),
- $N$: természeti erőforrások,
- $A$: **technológia** és hatékonyság (a „recept”, amellyel a tényezőket kombináljuk).

Az életszínvonalat a **munkatermelékenység** (az egy dolgozóra vagy egy munkaórára jutó kibocsátás) határozza meg.

## Tőkefelhalmozás és csökkenő hozadék

Ha egy ország többet takarít meg és ruház be, nő a tőkeállománya, és vele a kibocsátás. De a **csökkenő hozadék** miatt minden újabb egység tőke egyre kevesebb többletet hoz.

```plot
title: Egy dolgozóra jutó kibocsátás és tőke
x: 0, 100
y: 0, 30
param: A = 2, 1, 3, 0.1
f: A sqrt(x) # kibocsátás / dolgozó
dash: 2 sqrt(x) # eredeti technológia
value: kibocsátás 100 egység tőkénél = 10A
```

- A görbe egyre **laposabb**: ugyanannyi többlettőke egyre kevesebb többletkibocsátást hoz.
- Az **A** csúszka a technológiát mutatja: jobb technológia **felfelé tolja** az egész görbét – ugyanannyi tőkéből több termelés.

## A Solow-modell tanulsága

Robert Solow (Nobel-díj, 1987) modelljének fő üzenete:

1. A tőkefelhalmozás **átmenetileg** gyorsítja a növekedést, de a csökkenő hozadék miatt a gazdaság egy **állandósult állapot** felé tart.
2. **Tartós** növekedés az egy főre jutó kibocsátásban csak a **technológiai fejlődésből** jöhet.
3. A tőkében szegény országok **gyorsabban** nőhetnek (felzárkózás – 1. lecke).

## Teljes tényezőtermelékenység (TFP)

A növekedés azon része, amelyet nem magyaráz a tőke és a munka mennyiségének növekedése, a **teljes tényezőtermelékenység** (TFP) növekedése – „ugyanabból többet”. Fejlett országokban ez a növekedés nagy része. Mi növeli?

- **Kutatás-fejlesztés (K+F)** és innováció: új termékek és eljárások. Az EU célja, hogy a K+F-ráfordítás elérje a GDP 3%-át; Magyarországon ez 1,5% körül van.
- **Technológiaátvétel**, külföldi közvetlen befektetés (FDI) – a multinacionális cégek technológiát és tudást hoznak.
- **Digitalizáció**, automatizálás, mesterséges intelligencia (12. témakör).
- **Jobb szervezés**, verseny, a hatékonyabb cégek térnyerése.

## Humántőke

Az oktatás és az egészség növeli a termelékenységet, és segíti az új technológiák **átvételét** és **létrehozását**. A legtöbb sikeres felzárkózó ország (Dél-Korea, Finnország) sokat fektetett az oktatásba.

## Intézmények

Miért nem fektet be mindenki, és miért nem vesz át mindenki technológiát? Daron Acemoglu, Simon Johnson és James Robinson (Nobel-díj, 2024) szerint a döntő tényező az **intézmények** minősége:

- **befogadó intézmények:** biztos tulajdonjogok, jogállamiság, kiszámítható szabályok, verseny, széles körű részvétel → megéri beruházni és újítani;
- **kizsákmányoló intézmények:** egy szűk elit kisajátítja a jövedelmeket, gyenge a jogbiztonság, nagy a korrupció → nincs ösztönzés a beruházásra.

Klasszikus példa: **Észak- és Dél-Korea** – ugyanaz a nép, ugyanaz a kultúra és földrajz, de az intézmények különbsége miatt óriási eltérés az életszínvonalban.

## Egyéb tényezők

- **Földrajz és természeti erőforrások:** a nyersanyag-gazdagság nem garancia – az „erőforrásátok” miatt az olajjal gazdagon ellátott országok egy része gyengén teljesít.
- **Nyitottság:** a kereskedelem (9. témakör) nagyobb piacot, versenyt és technológiát hoz.
- **Makrogazdasági stabilitás:** alacsony infláció, fenntartható államháztartás.

## Összefoglalás

- $Y = A \cdot F(K, L, H, N)$; az életszínvonalat a termelékenység határozza meg.
- A tőkefelhalmozás a csökkenő hozadék miatt csak átmenetileg gyorsít.
- Solow: tartós növekedés csak technológiai fejlődésből.
- TFP: K+F, technológiaátvétel, digitalizáció, verseny.
- Az intézmények (tulajdonjogok, jogállamiság) a legmélyebb ok.

## A lecke feladata

```quiz required
? Mit jelöl a termelési függvényben az $A$?
- a munkások számát
- a fizikai tőkét
+ a technológiát és a hatékonyságot
- a természeti erőforrásokat
! A „recept”, amellyel a tényezőket kombináljuk.

? Mi a Solow-modell egyik fő tanulsága?
- a tőkefelhalmozás korlátlanul gyorsítja a növekedést
+ az egy főre jutó kibocsátás tartós növekedése a technológiai fejlődésből jön
- a népesség növekedése a gazdagság forrása
- a pénznyomtatás növeli a termelést
! A tőke hozadéka csökkenő.

? Az ábrán az A értéke 2-ről 2,5-re nő. Mennyi lesz a kibocsátás 100 egység tőkénél?
= 25
! 2,5 · √100 = 25.

? Melyik a **befogadó** intézmények jellemzője?
- a jövedelmeket egy szűk elit sajátítja ki
+ biztos tulajdonjogok és jogállamiság
- gyenge jogbiztonság
- korlátozott verseny
! Megéri beruházni és újítani.

? Mi a teljes tényezőtermelékenység (TFP)?
+ a növekedés azon része, amit nem a tőke és a munka mennyiségének növekedése magyaráz
- a munkások száma
- a tőkeállomány értéke
- az infláció mértéke
! „Ugyanabból többet.”
```
