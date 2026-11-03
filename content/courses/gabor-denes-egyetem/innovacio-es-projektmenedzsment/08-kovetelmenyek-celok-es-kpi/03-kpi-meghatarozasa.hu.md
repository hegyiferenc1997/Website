---
title: Eredménymutatók (KPI) meghatározása
summary: Mi a KPI, mi a különbség a vezető és a követő mutató között, hogyan készíts KPI-kártyát, és milyen KPI-k mérik egy informatikai projekt és a termék sikerét?
minutes: 20
---

## Amit ebben a leckében megtanulsz

- mi a **KPI**, és miben különbözik egy egyszerű mérőszámtól,
- mi a **vezető** és a **követő** mutató,
- hogyan írj le egy KPI-t **KPI-kártyán**,
- milyen KPI-k jellemzők az informatikai projektekben.

## Mi a KPI?

A **KPI** (_Key Performance Indicator_, kulcsteljesítmény-mutató) olyan **mérőszám**, amely egy **fontos cél** elérésének mértékét mutatja. Nem minden mérőszám KPI: a KPI-ból **kevés** van, és mindegyik közvetlenül egy célhoz kapcsolódik (a SMART cél „M” betűje gyakran egy KPI).

> Jó KPI: **egyértelmű képlet**, **célérték**, **gyakoriság**, **felelős**, **adatforrás**. Ha ezek közül bármelyik hiányzik, a mutatót nem lehet megbízhatóan követni.

## Vezető és követő mutatók

| Típus                  | Mit mutat?                          | Példa                                    |
| ---------------------- | ----------------------------------- | ---------------------------------------- |
| **követő** (_lagging_) | a **már elért** eredményt, utólag   | a kiadás utáni első hónap hibáinak száma |
| **vezető** (_leading_) | előre jelzi a **várható** eredményt | a kód tesztlefedettsége a kiadás előtt   |

A követő mutatót könnyű mérni, de már nem lehet befolyásolni; a vezető mutatóval időben **be lehet avatkozni**. Érdemes mindkettőt használni.

## KPI-kártya

| Mező           | Példa                                                            |
| -------------- | ---------------------------------------------------------------- |
| **név**        | határidőre teljesített feladatok aránya                          |
| **cél**        | az ütemterv betartása                                            |
| **képlet**     | határidőre kész feladatok száma / összes esedékes feladat · 100% |
| **célérték**   | ≥ 90%                                                            |
| **gyakoriság** | hetente                                                          |
| **felelős**    | projektmenedzser                                                 |
| **adatforrás** | a projektmenedzsment-szoftver (pl. Jira) jelentése               |

## Tipikus KPI-k informatikai projektekben

**A projekt sikerének mutatói** (a projektmenedzsment teljesítménye):

- ütemterv-teljesítési index (**SPI**) és költségteljesítési index (**CPI**) – a 9. témakörben számoljuk,
- határidőre teljesített mérföldkövek aránya,
- a költségvetéstől való eltérés (%),
- jóváhagyott változáskérések száma,
- csapatelégedettség, fluktuáció.

**A termék sikerének mutatói** (a projekt eredményének hatása):

- aktív felhasználók száma (napi / havi: **DAU / MAU**),
- konverziós arány, lemorzsolódás (_churn_),
- ügyfélelégedettség (pl. **NPS** – _Net Promoter Score_),
- rendelkezésre állás (pl. 99,9%), átlagos válaszidő,
- kiadás után talált hibák száma.

> **NPS** = a **támogatók** (9–10 pont) aránya − a **kritikusok** (0–6 pont) aránya, egy „Mennyire ajánlanád másoknak 0–10-ig?” kérdés alapján. Ha 50% támogató és 20% kritikus, az NPS = **+30**.

## A KPI-k csapdái

- **Túl sok KPI** – senki sem figyeli őket. 3–7 legyen projektenként.
- **Goodhart törvénye**: „Ha egy mérőszám céllá válik, megszűnik jó mérőszámnak lenni.” Pl. ha a lezárt hibajegyek száma a KPI, a csapat apró jegyekre bontja a hibákat.
- **Hiúsági mutatók** (_vanity metrics_): jól néznek ki, de nem mutatják a valódi sikert (pl. letöltések száma aktív használat helyett).

## Összefoglalás

- A KPI egy fontos célhoz kötött, egyértelműen definiált mérőszám.
- Követő mutató: utólagos eredmény; vezető mutató: előrejelzés, lehet beavatkozni.
- KPI-kártya: név, cél, képlet, célérték, gyakoriság, felelős, adatforrás.
- Projektsiker (SPI, CPI, határidők) és terméksiker (DAU/MAU, NPS, rendelkezésre állás) mutatói.
- Csapdák: túl sok KPI, Goodhart törvénye, hiúsági mutatók.

## A lecke feladata

```quiz required
? Melyik **vezető** (leading) mutató?
- a kiadás utáni első hónap hibáinak száma
+ a kód tesztlefedettsége a kiadás előtt
- az elmúlt év árbevétele
- a projekt tényleges befejezési dátuma
! Előre jelzi a várható minőséget, még lehet beavatkozni.

? 40 esedékes feladatból 34 készült el határidőre. Hány százalék a határidőre teljesítés aránya?
= 85
= 85%
! 34 / 40 · 100.

? Egy felmérésben 60% támogató (9–10), 25% semleges (7–8) és 15% kritikus (0–6). Mennyi az NPS?
= 45
= +45
! 60 − 15.

? Mit mond ki **Goodhart törvénye**?
+ ha egy mérőszám céllá válik, megszűnik jó mérőszámnak lenni
- minden KPI-t naponta kell mérni
- a KPI-k száma legalább 20 legyen
- a vezető mutató mindig pontosabb
! Az emberek a mutatót optimalizálják, nem a valódi célt.

? Melyik **nem** kötelező eleme egy jó KPI-kártyának?
- képlet
- célérték
- felelős
+ a KPI kitalálójának születési dátuma
! Név, cél, képlet, célérték, gyakoriság, felelős, adatforrás.
```
