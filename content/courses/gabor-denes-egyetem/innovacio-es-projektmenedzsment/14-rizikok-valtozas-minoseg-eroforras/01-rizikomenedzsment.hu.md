---
title: Rizikómenedzsment a projektben
summary: A rizikómenedzsment folyamata, kockázatazonosítási technikák, a kockázatnyilvántartás, minőségi és mennyiségi elemzés (döntési fa, EMV), válaszok veszélyekre és lehetőségekre, maradék és másodlagos kockázat.
minutes: 30
---

## Amit ebben a leckében megtanulsz

- milyen lépésekből áll a projekt **rizikómenedzsment-folyamata**,
- hogyan **azonosítsd** és **rögzítsd** a kockázatokat,
- hogyan döntsd el **döntési fával**, melyik változat a jobb,
- milyen válaszok vannak a **lehetőségekre** (pozitív kockázatokra).

> Az alapokat (valószínűség–hatás mátrix, EMV, négy válasz a veszélyekre) a 4. témakörben már láttuk; most a projektmenedzsment teljes folyamatát nézzük.

## A rizikómenedzsment folyamata

```text
 1. tervezés → 2. azonosítás → 3. minőségi elemzés → 4. mennyiségi elemzés
   → 5. válaszok tervezése → 6. válaszok végrehajtása → 7. nyomon követés
                 ▲                                                  │
                 └──────────────── folyamatosan ismétlődik ─────────┘
```

1. **Tervezés** – hogyan kezeljük a kockázatokat (skálák, szerepek, gyakoriság).
2. **Azonosítás** – milyen kockázatok vannak?
3. **Minőségi elemzés** – valószínűség és hatás becslése, rangsorolás (P · I mátrix).
4. **Mennyiségi elemzés** – számszerű hatás (EMV, döntési fa, szimuláció) a legfontosabbakra.
5. **Válaszok tervezése** – stratégia és felelős minden fontos kockázatra.
6. **Végrehajtás** – a válaszok megvalósítása.
7. **Nyomon követés** – új kockázatok, változó valószínűségek, a válaszok hatása.

## Kockázatazonosítási technikák

- **ötletroham** és **szakértői interjú**,
- **ellenőrzőlista** korábbi projektek alapján,
- **Delphi-módszer** – névtelen szakértői körök,
- **SWOT** (a gyengeségek és veszélyek gyakran kockázatok),
- **feltételezés-elemzés** – mi van, ha egy feltételezés hamisnak bizonyul? (7. témakör),
- **kockázati lebontási struktúra** (RBS): kategóriák szerinti rendszerezés (műszaki, külső, szervezeti, projektmenedzsment).

A kockázatot érdemes **ok – kockázat – hatás** formában megfogalmazni:

> _Mivel_ a csapat még nem dolgozott Kubernetesszel (ok), _előfordulhat, hogy_ a telepítés beállítása elhúzódik (kockázat), _ami_ 2 hét csúszást okozna az átadásban (hatás).

## A kockázatnyilvántartás

| Mező                      | Példa                                               |
| ------------------------- | --------------------------------------------------- |
| azonosító, leírás         | R-07: a Kubernetes-telepítés elhúzódik              |
| kategória                 | műszaki                                             |
| valószínűség (1–5)        | 3                                                   |
| hatás (1–5)               | 4                                                   |
| pontszám (P · I)          | 12                                                  |
| **kockázatgazda**         | Kiss Péter, DevOps-mérnök                           |
| **kiváltó jel** (trigger) | a tesztkörnyezet 1 hét után sem fut                 |
| válaszstratégia           | csökkentés: 2 napos képzés, külső szakértő bevonása |
| állapot                   | nyitott                                             |

- **Kockázatgazda** (_risk owner_): egy ember, aki figyeli és kezeli a kockázatot.
- **Kiváltó jel** (_trigger_): figyelmeztető jel, hogy a kockázat hamarosan bekövetkezik.
- **Maradék kockázat** (_residual risk_): ami a válasz után is megmarad.
- **Másodlagos kockázat** (_secondary risk_): amit maga a válasz okoz (pl. a külső szakértő késve érkezik).

## Mennyiségi elemzés: döntési fa

A **döntési fa** változatok közötti választást segít, ha a kimenetek bizonytalanok. Minden ágra kiszámoljuk a **várható értéket**.

Példa: egy modult **saját fejlesztéssel** vagy **megvásárlással** oldunk meg (költségek millió Ft-ban).

```text
                         ┌─ 70%: nincs gond ─────────── 50
          ┌ saját fejl. ─┤
          │              └─ 30%: +20 többletköltség ─── 70
 döntés ──┤
          │              ┌─ 90%: nincs gond ─────────── 60
          └ megvásárlás ─┤
                         └─ 10%: +10 integráció ─────── 70
```

- Saját fejlesztés: 0,7 · 50 + 0,3 · 70 = 35 + 21 = **56**
- Megvásárlás: 0,9 · 60 + 0,1 · 70 = 54 + 7 = **61**

A várható költség alapján a **saját fejlesztés** a jobb (56 < 61). (A döntésnél persze más szempontokat is figyelembe veszünk, pl. a kockázattűrést.)

## Válaszok

**Veszélyekre** (negatív kockázat): **elkerülés, áthárítás, csökkentés, elfogadás** (4. témakör) + **eszkaláció** (ha a projekt jogkörén kívül esik).

**Lehetőségekre** (pozitív kockázat):

| Stratégia                 | Lényeg                                           | Példa                                              |
| ------------------------- | ------------------------------------------------ | -------------------------------------------------- |
| **kiaknázás** (_exploit_) | biztosítjuk, hogy bekövetkezzen                  | a legjobb fejlesztőt tesszük a kulcsfeladatra      |
| **megosztás** (_share_)   | partnerrel közösen használjuk ki                 | közös fejlesztés egy egyetemmel, haszonmegosztás   |
| **fokozás** (_enhance_)   | növeljük a valószínűségét vagy a hatását         | korai béta-verzió, hogy több visszajelzést kapjunk |
| **elfogadás** (_accept_)  | ha bekövetkezik, élünk vele, de nem teszünk érte | —                                                  |

## Összefoglalás

- Folyamat: tervezés → azonosítás → minőségi → mennyiségi elemzés → válaszok tervezése → végrehajtás → nyomon követés.
- Azonosítás: ötletroham, ellenőrzőlista, Delphi, SWOT, feltételezés-elemzés, RBS; „ok – kockázat – hatás”.
- Nyilvántartás: P, I, pontszám, kockázatgazda, kiváltó jel, válasz; maradék és másodlagos kockázat.
- Döntési fa: ágankénti várható érték.
- Lehetőségek: kiaknázás, megosztás, fokozás, elfogadás.

## A lecke feladata

```quiz required
? A döntési fa példájában mennyi a **saját fejlesztés** várható költsége (millió Ft)?
= 56
! 0,7 · 50 + 0,3 · 70.

? Egy változat: 80% eséllyel 40, 20% eséllyel 60 millió Ft. Mennyi a várható költség?
= 44
! 0,8 · 40 + 0,2 · 60 = 32 + 12.

? Mit nevezünk **másodlagos kockázatnak**?
+ olyan kockázatot, amelyet maga a kockázati válasz okoz
- a kevésbé fontos kockázatokat
- a már bekövetkezett kockázatot
- a második kockázatgazdát
! Pl. a bevont külső szakértő késve érkezik.

? Melyik **lehetőségre** (pozitív kockázatra) adott válasz?
- elkerülés
- áthárítás
+ kiaknázás
- csökkentés
! Exploit: biztosítjuk, hogy bekövetkezzen.

? Mi a **kiváltó jel** (trigger)?
+ figyelmeztető jel, hogy a kockázat hamarosan bekövetkezik
- a kockázat felelőse
- a kockázatnyilvántartás neve
- egy biztosítási szerződés
! Pl. „a tesztkörnyezet 1 hét után sem fut”.
```
