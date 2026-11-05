---
title: Adatgyűjtés és alapvető elemzés
summary: Kérdőív és interjú készítése, mintavétel és torzítások, a Likert-skála, valamint az átlag, a medián és a szórás – egy futtatható Python-példával.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- hogyan készíts jó **kérdőívet** és **interjút**,
- mit jelent a **mintavétel**, és milyen **torzítások** lehetnek,
- mi a **Likert-skála**,
- hogyan számolj **átlagot**, **mediánt** és **szórást**.

## Kérdőív

**Jó kérdőív:**

- **rövid** – minden kérdésnek legyen célja (5–10 perc kitöltési idő),
- **egyértelmű** kérdések, egy kérdés egy dologra vonatkozzon,
- **semleges** megfogalmazás (ne rávezető: „Ugye elégedett a gyors oldalunkkal?”),
- a válaszlehetőségek **lefedik** az összes esetet, és nem fedik át egymást,
- előbb **próbáld ki** néhány emberen (próbakérdezés).

Kerülendő a **kettős kérdés**: „Mennyire gyors és könnyen használható az alkalmazás?” – mi van, ha gyors, de nehezen használható? Bontsd két kérdésre.

## Likert-skála

A **Likert-skála** egy állítással való egyetértés mértékét méri, jellemzően 5 fokozaton:

```text
„Az alkalmazás könnyen használható.”
1 – egyáltalán nem értek egyet
2 – nem értek egyet
3 – semleges
4 – egyetértek
5 – teljesen egyetértek
```

## Interjú

- **Strukturált** (előre megírt, ugyanazok a kérdések) – könnyen összehasonlítható.
- **Félig strukturált** (kérdéssor + rugalmas rákérdezés) – a leggyakoribb.
- Nyitott kérdések, aktív hallgatás, kérdezéstechnika (lásd 3. témakör).
- Kérj **hozzájárulást** a felvételhez, és kezeld bizalmasan az adatokat (GDPR, lásd 8. témakör).

## Mintavétel és torzítások

Ritkán tudunk mindenkit megkérdezni (ez a **populáció**), ezért egy **mintát** választunk.

- **Véletlen minta**: mindenkinek egyenlő esélye van bekerülni – a legjobb az általánosításhoz.
- **Kényelmi minta**: akit könnyen elérünk (pl. a saját évfolyam) – gyors, de torzíthat.

Gyakori torzítások:

| Torzítás                              | Példa                                                                |
| ------------------------------------- | -------------------------------------------------------------------- |
| **mintavételi torzítás**              | csak a Discord-szerver aktív tagjait kérdezed – ők elkötelezettebbek |
| **önkiválasztás**                     | csak az válaszol, akinek erős véleménye van                          |
| **túlélési torzítás**                 | csak a sikeres startupokat vizsgálod, a bukottakat nem               |
| **társas kívánatosság**               | a válaszadó azt mondja, amit „illik” („naponta tanulok”)             |
| **megerősítési torzítás** (a kutatóé) | csak azt veszed észre, ami a hipotézisedet igazolja                  |

## Alapvető leíró statisztika

- **Átlag**: az értékek összege osztva a darabszámmal.
- **Medián**: a sorba rendezett értékek közül a középső (páros darabszámnál a két középső átlaga). Kevésbé érzékeny a kiugró értékekre.
- **Módusz**: a leggyakoribb érték.
- **Szórás**: mennyire szóródnak az értékek az átlag körül.

```python run
# Egy Likert-kérdés (1–5) válaszainak leíró statisztikája.
import statistics

valaszok = [4, 5, 3, 4, 2, 5, 4, 4, 3, 5]

print("Válaszok száma:", len(valaszok))
print("Átlag:", statistics.mean(valaszok))
print("Medián:", statistics.median(valaszok))
print("Módusz:", statistics.mode(valaszok))
print("Szórás (minta):", round(statistics.stdev(valaszok), 2))
```

Próbáld ki: tegyél a listába néhány 1-est, és figyeld, hogyan változik az átlag és a medián!

> Példa a kiugró értékre: négy fejlesztő havi bére 600, 650, 700, 750 ezer Ft és egy vezetőé 3 millió Ft. Az átlag 1,14 millió – senki sem keres ennyit. A medián, 700 ezer, jobban mutatja a tipikus bért.

## Összefoglalás

- Kérdőív: rövid, egyértelmű, semleges, kettős kérdés nélkül, előre kipróbálva.
- Likert-skála: egyetértés mértéke 5 fokozaton.
- Mintavétel: a véletlen minta a legjobb; figyelj a torzításokra.
- Átlag, medián, módusz, szórás – kiugró értékeknél a medián megbízhatóbb.

## A lecke feladata

```quiz required
? „Mennyire gyors és könnyen használható az alkalmazás?” Mi a gond ezzel a kérdőív-kérdéssel?
- túl rövid
+ kettős kérdés: két dolgot kérdez egyszerre
- nyitott kérdés
- túl semleges
! Bontsd két kérdésre.

? Mi a válaszok **mediánja**: 2, 3, 3, 4, 5?
= 3
! A sorba rendezett értékek közül a középső.

? Mi a válaszok **átlaga**: 2, 3, 4, 5, 6?
= 4
! (2 + 3 + 4 + 5 + 6) / 5 = 4.

? Csak a kurzusodat sikeresen elvégzőket kérdezed meg arról, mennyire volt hasznos. Melyik torzítás veszélyes itt?
- társas kívánatosság
+ túlélési torzítás
- megerősítési torzítás
- egyik sem
! A lemorzsolódók véleménye hiányzik.
```
