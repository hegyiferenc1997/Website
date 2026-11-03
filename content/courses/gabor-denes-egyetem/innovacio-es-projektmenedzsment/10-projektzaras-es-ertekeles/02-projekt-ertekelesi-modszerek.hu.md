---
title: Projekt értékelési módszerek
summary: Mikor sikeres egy projekt? A zárójelentés, a sikerkritériumok és a KPI-k kiértékelése, a tanulságok összegyűjtése és a retrospektív formái, valamint a hasznok utólagos értékelése.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- mikor mondhatjuk, hogy egy projekt **sikeres** volt,
- mit tartalmaz a **zárójelentés**,
- hogyan gyűjtsd össze a **tanulságokat** (lessons learned, retrospektív),
- mi a **hasznok utólagos értékelése**.

## Mikor sikeres egy projekt?

A siker több szinten mérhető:

| Szint                         | Kérdés                                                           | Mikor mérhető?    |
| ----------------------------- | ---------------------------------------------------------------- | ----------------- |
| **projektmenedzsment-siker**  | Időben, kereten belül, a terjedelemmel és minőséggel készült el? | a lezáráskor      |
| **termék- (eredmény-) siker** | A rendszer működik, használják, elégedettek vele?                | hónapokkal később |
| **üzleti siker**              | Megvalósultak az üzleti esetben ígért hasznok?                   | akár évek múlva   |

> Egy projekt lehet **menedzsment szempontból sikertelen, üzletileg mégis sikeres** (pl. késett és drágább lett, de hatalmas haszna lett) – és fordítva: határidőre elkészült egy rendszer, amit senki sem használ.

## A zárójelentés

A **projekt zárójelentése** (_final report_) tipikus tartalma:

1. összefoglaló: cél, eredmény, a siker röviden,
2. a **terjedelem** teljesülése (mi készült el, mi maradt ki és miért),
3. **ütem**: tervezett és tényleges befejezés, a fő eltérések okai,
4. **költség**: tervezett és tényleges költség, végső CPI,
5. **minőség**: elfogadási teszt, nyitott hibák,
6. a **KPI-k és sikerkritériumok** értékelése,
7. **kockázatok** és problémák: mi történt, hogyan kezeltük,
8. **tanulságok** és javaslatok,
9. nyitott tételek és felelőseik.

### A KPI-k értékelése

Minden sikerkritériumot a célértékhez mérünk. Példa:

| KPI                       | Cél        | Tény       | Teljesült?       |
| ------------------------- | ---------- | ---------- | ---------------- |
| határidő                  | 2027.03.31 | 2027.04.14 | ❌ (2 hét késés) |
| költség (CPI)             | ≥ 0,95     | 1,02       | ✅               |
| oldalbetöltési idő        | < 2 mp     | 1,6 mp     | ✅               |
| felhasználói elégedettség | ≥ 4,0      | 4,3        | ✅               |

## Tanulságok (lessons learned)

A **tanulságok** összegyűjtése a projekt legértékesebb, de leggyakrabban elhanyagolt lépése. Jó gyakorlat:

- **ne csak a végén** gyűjtsük – fázisonként, sprintenként is,
- **hibáztatás nélkül** (_blameless_): a folyamatot vizsgáljuk, nem embereket keresünk,
- konkrét, **cselekvésre váltható** javaslatok kellenek („a követelményeket prototípussal validáljuk”), nem általánosságok („jobban kell kommunikálni”),
- legyen egy **tudástár**, ahol a következő projekt megtalálja őket.

### Retrospektív formák

- **Start – Stop – Continue**: mit kezdjünk el, mit hagyjunk abba, mit folytassunk.
- **Mi ment jól? Mi ment rosszul? Mit változtatunk?**
- **4L**: _Liked_ (tetszett), _Learned_ (tanultam), _Lacked_ (hiányzott), _Longed for_ (vágytam rá).
- **Idővonal**: a projekt eseményeit közösen felrajzoljuk, és jelöljük a hangulatot.

## A hasznok utólagos értékelése

A **hasznok realizálása** (_benefits realisation_) azt vizsgálja, hogy a projekt eredménye – **a lezárás után** – valóban hozza-e az üzleti esetben ígért hasznokat. Ezt gyakran egy **implementáció utáni felülvizsgálat** (PIR, _Post-Implementation Review_) végzi, pl. 3–12 hónappal a bevezetés után.

Példa: az üzleti eset évi 12 millió Ft megtakarítást ígért. Egy évvel a bevezetés után a mért megtakarítás 9 millió Ft → a **hasznok 75%-a** valósult meg.

## Összefoglalás

- A siker három szintje: projektmenedzsment-, termék- és üzleti siker.
- Zárójelentés: terjedelem, ütem, költség, minőség, KPI-k, kockázatok, tanulságok.
- Tanulságok: folyamatosan, hibáztatás nélkül, cselekvésre váltható formában, tudástárban.
- Retrospektív: Start–Stop–Continue, 4L, idővonal.
- Hasznok utólagos értékelése (PIR): megvalósultak-e az ígért hasznok?

## A lecke feladata

```quiz required
? Egy rendszer határidőre és kereten belül elkészült, de senki sem használja. Milyen szinten **sikertelen** a projekt?
- projektmenedzsment-siker szintjén
+ termék- és üzleti siker szintjén
- egyik szinten sem, sikeres
- csak a költség szintjén
! Időben és kereten belül = menedzsmentsiker; a használat és a haszon hiányzik.

? Mit jelent a **hibáztatás nélküli** (blameless) tanulsággyűjtés?
+ a folyamat hibáit keressük, nem bűnbakot
- senki sem mondhat semmi negatívat
- csak a vezető beszélhet
- a hibákat nem dokumentáljuk
! Így az emberek őszintén elmondják, mi történt.

? Melyik retrospektív forma kérdezi: mit kezdjünk el, mit hagyjunk abba, mit folytassunk?
+ Start – Stop – Continue
- 4L
- SWOT
- MoSCoW
! Három egyszerű kérdés.

? Az üzleti eset évi 20 millió Ft megtakarítást ígért, a mért megtakarítás 15 millió Ft. Hány százalékban valósultak meg a hasznok?
= 75
= 75%
! 15 / 20 · 100.

? Melyik tanulság **cselekvésre váltható**?
- Jobban kell kommunikálni.
- Legyünk ügyesebbek.
+ A következő projektben a követelményeket kattintható prototípussal validáljuk a fejlesztés előtt.
- Ne legyenek problémák.
! Konkrét, végrehajtható javaslat.
```
