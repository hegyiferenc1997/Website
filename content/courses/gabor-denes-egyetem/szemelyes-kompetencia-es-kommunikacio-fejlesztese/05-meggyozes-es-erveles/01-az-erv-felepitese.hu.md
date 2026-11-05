---
title: Az érv felépítése
summary: Állítás, bizonyíték és indoklás; a Toulmin-modell hat eleme; deduktív és induktív érvelés egy technológiai döntés példáján.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- miből áll egy **érv**,
- a **Toulmin-modell** elemeit,
- a **deduktív** és az **induktív** érvelés különbségét.

## Mi az érv?

Az **érv** egy állítás, amelyet **bizonyítékokkal** és **indoklással** támasztunk alá. Az érvelés célja, hogy a másik fél **ésszerű okok** alapján fogadja el az álláspontunkat – nem azért, mert hangosabbak vagy idősebbek vagyunk.

A legegyszerűbb forma:

```text
Állítás:    Érdemes áttérnünk TypeScriptre.
Bizonyíték: Az elmúlt negyedévben a hibáink 30%-a típushibából eredt.
Indoklás:   A statikus típusellenőrzés ezeket már fordításkor kiszűri.
```

## A Toulmin-modell

Stephen Toulmin brit filozófus hat elemre bontotta a hétköznapi érveket:

| Elem                             | Kérdés                                  | Példa                                                          |
| -------------------------------- | --------------------------------------- | -------------------------------------------------------------- |
| **állítás** (claim)              | Mit állítasz?                           | Térjünk át TypeScriptre.                                       |
| **adat / bizonyíték** (data)     | Mire alapozod?                          | A hibák 30%-a típushiba volt.                                  |
| **indoklás** (warrant)           | Miért következik az adatból az állítás? | A típusellenőrzés ezeket fordításkor kiszűri.                  |
| **alátámasztás** (backing)       | Miért fogadjuk el az indoklást?         | Több nagy projekt esettanulmánya kevesebb éles hibát mutatott. |
| **minősítő** (qualifier)         | Mennyire biztos?                        | „valószínűleg”, „a legtöbb esetben”                            |
| **cáfolat / kivétel** (rebuttal) | Mikor nem igaz?                         | Kivéve, ha a projekt két hónapon belül lezárul.                |

> A **minősítő** és a **kivétel** kimondása nem gyengíti, hanem **erősíti** az érvet: azt mutatja, hogy átgondoltad, és nem túlozol.

## Deduktív és induktív érvelés

### Deduktív (általánosból az egyedire)

Ha a premisszák igazak, a következtetés **biztosan** igaz.

```text
Minden HTTPS-kapcsolat titkosított.
Ez az oldal HTTPS-t használ.
→ Ez az oldal kapcsolata titkosított.
```

### Induktív (egyedi esetekből az általánosra)

A következtetés csak **valószínű**, egy új eset megdöntheti.

```text
Az elmúlt 50 kiadás után a teszt mindig elkapta a hibát.
→ A tesztjeink valószínűleg jók.
```

Az induktív érvelés a tudomány és a mérnöki munka alapja (mérések, tapasztalatok), de vigyázni kell: **kevés esetből** ne általánosíts.

## Jó érv a gyakorlatban

- **Konkrét** adat a homályos benyomás helyett („30%” vs. „sok”).
- **Releváns** bizonyíték: tényleg az állítást támasztja alá?
- **Ellenérvek** előzetes kezelése: „Tudom, hogy a betanulás időbe telik, ezért…”
- A közönség **értékeihez** kötve (a menedzsmentnek a költség és a kockázat, a fejlesztőknek a minőség és a kényelem a fontos).

## Összefoglalás

- Az érv: állítás + bizonyíték + indoklás.
- Toulmin: állítás, adat, indoklás, alátámasztás, minősítő, kivétel.
- Deduktív: biztos következtetés igaz premisszákból; induktív: valószínű általánosítás.
- A minősítő és a kivétel kimondása erősíti a hitelességet.

## A lecke feladata

```quiz required
? Melyik elem felel a Toulmin-modellben arra, hogy **miért következik** az adatból az állítás?
- állítás
- minősítő
+ indoklás (warrant)
- kivétel
! Az indoklás köti össze az adatot és az állítást.

? „Valószínűleg”, „a legtöbb esetben” – melyik Toulmin-elem ez?
- adat
+ minősítő
- alátámasztás
- állítás
! Megmutatja, mennyire biztos az állítás.

? „Az eddigi 20 felhasználói interjúban mindenki panaszkodott a regisztrációra, tehát valószínűleg a többség nehéznek tartja.” Milyen érvelés ez?
- deduktív
+ induktív
- körkörös
- érzelmi
! Egyedi esetekből általánosít, a következtetés csak valószínű.

? Miért érdemes kimondani az érv **kivételeit**?
- mert így hosszabb lesz az előadás
+ mert azt mutatja, hogy átgondoltad, és nem túlzol – ez növeli a hitelességet
- mert így senki nem kérdez
- mert kötelező
! Az önkritikus érv erősebb.
```
