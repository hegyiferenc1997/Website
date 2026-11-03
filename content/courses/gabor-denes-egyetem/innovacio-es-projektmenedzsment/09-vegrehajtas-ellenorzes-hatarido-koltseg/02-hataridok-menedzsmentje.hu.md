---
title: A határidők menedzsmentje
summary: PERT hárompontos becslés és szórás, időpuffer, a csúszások tipikus okai (Parkinson törvénye, diákszindróma), ütemterv-tömörítés crashinggel és fast-trackinggel.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- hogyan becsülj **hárompontos (PERT)** módszerrel,
- miért csúsznak a projektek, és mi az **időpuffer**,
- hogyan **rövidíts** egy ütemtervet (crashing, fast-tracking).

## PERT hárompontos becslés

Egy tevékenység időtartama bizonytalan. A **PERT** (_Program Evaluation and Review Technique_, USA haditengerészet, 1958) három becslést kér:

- **O** – optimista (minden jól megy),
- **M** – legvalószínűbb,
- **P** – pesszimista (sok minden rosszul megy).

> **várható időtartam: tₑ = (O + 4M + P) / 6**
>
> **szórás: σ = (P − O) / 6**

Példa: O = 4 nap, M = 6 nap, P = 14 nap → tₑ = (4 + 24 + 14) / 6 = 42 / 6 = **7 nap**; σ = (14 − 4) / 6 ≈ **1,67 nap**.

A várható érték **nagyobb** a legvalószínűbbnél, mert a pesszimista irányba általában több minden romolhat el, mint amennyi az optimista irányba javulhat.

A kritikus út tevékenységeinek várható időit **összeadjuk**, a szórásaikból pedig a **varianciák** (σ²) összegének gyökével kapjuk az egész projekt szórását. Kb. **68%** eséllyel a várható érték ± 1σ, kb. **95%** eséllyel ± 2σ tartományban fejeződik be a projekt.

## Miért csúsznak a projektek?

- **optimista becslés** – a tervező a „minden jól megy” változatot adja meg,
- **Parkinson törvénye** – „a munka kitölti a rendelkezésre álló időt”,
- **diákszindróma** – a munka az utolsó pillanatban kezdődik el,
- **függőségek** – egy késő beszállító az egész láncot megállítja,
- **terjedelem-kúszás** (_scope creep_) – apránként, jóváhagyás nélkül bővülő feladatok,
- **multitasking** – egy ember egyszerre túl sok feladaton dolgozik.

### Időpuffer

A **puffer** tudatos tartalékidő az ütemtervben. A **kritikus lánc** módszer (Eliyahu Goldratt, 1997) a tevékenységek egyenkénti „biztonsági ráhagyását” elveszi, és egy közös **projektpufferbe** gyűjti a projekt végén – így a tartalék nem „olvad el” Parkinson törvénye miatt.

## Ütemterv-tömörítés

Ha a projekt késik, vagy korábbi határidő kell, két fő technika van – mindkettő **csak a kritikus úton** lévő tevékenységeknél hatásos:

| Technika                            | Mit csinál?                                                    | Ára                              |
| ----------------------------------- | -------------------------------------------------------------- | -------------------------------- |
| **crashing** (erőforrás-ráfordítás) | több erőforrás (ember, túlóra, gép) a tevékenységre            | **több költség**                 |
| **fast-tracking** (átfedés)         | egymás után következő tevékenységeket **párhuzamosan** végzünk | **nagyobb kockázat**, átdolgozás |

### Crashing: melyik tevékenységet rövidítsük?

A **napi rövidítési költség**:

> **(rövidített költség − normál költség) / (normál idő − rövidített idő)**

Példa: egy tevékenység normálisan 10 nap és 100 ezer Ft, rövidítve 6 nap és 180 ezer Ft → (180 − 100) / (10 − 6) = **20 ezer Ft/nap**.

Mindig a **kritikus úton** lévő, **legkisebb napi rövidítési költségű** tevékenységet rövidítjük először. Vigyázat: rövidítés után **más út is kritikussá válhat**.

> **Brooks törvénye** (szoftverprojektekre): „Egy késésben lévő szoftverprojekthez embereket adni csak tovább késlelteti.” Az új embereket be kell tanítani, és nő a kommunikációs teher – a crashing szoftvernél korlátozottan működik.

## Összefoglalás

- PERT: tₑ = (O + 4M + P) / 6, σ = (P − O) / 6.
- Csúszás okai: optimista becslés, Parkinson, diákszindróma, függőségek, terjedelem-kúszás.
- Puffer: tudatos tartalék; kritikus lánc: közös projektpuffer.
- Tömörítés: crashing (több pénz), fast-tracking (több kockázat) – csak a kritikus úton.
- Napi rövidítési költség = Δköltség / Δidő; Brooks törvénye.

## A lecke feladata

```quiz required
? PERT: O = 2, M = 5, P = 14 nap. Mennyi a várható időtartam (nap)?
= 6
= 6 nap
! (2 + 4·5 + 14) / 6 = 36 / 6.

? Ugyanennél a tevékenységnél mennyi a szórás (nap)?
= 2
= 2 nap
! (14 − 2) / 6.

? Normál: 8 nap, 200 ezer Ft. Rövidítve: 5 nap, 290 ezer Ft. Hány ezer Ft a napi rövidítési költség?
= 30
= 30 ezer
! (290 − 200) / (8 − 5).

? A tesztelést a fejlesztéssel **párhuzamosan** kezdjük, hogy hamarabb végezzünk. Melyik technika ez?
- crashing
+ fast-tracking
- puffer
- alapterv
! Átfedés: gyorsabb, de nagyobb a kockázat.

? Miért **nem** segít egy nem kritikus tevékenység rövidítése a projekt befejezésén?
+ mert a projekt hosszát a kritikus út határozza meg, a nem kritikus tevékenységnek már van tartaléka
- mert a nem kritikus tevékenységek ingyenesek
- mert azokat nem lehet rövidíteni
- mert a Gantt-diagram nem engedi
! Csak a kritikus út rövidítése rövidíti a projektet.

? Mit mond ki **Parkinson törvénye**?
- a projektek fele mindig sikertelen
+ a munka kitölti a rendelkezésre álló időt
- a késő projekthez embert adni késlelteti
- a hibák 80%-a a kód 20%-ában van
! Ezért „olvad el” a tevékenységekhez adott tartalék.
```
