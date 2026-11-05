---
title: Kutatásokkal igazolt tanulási módszerek
summary: Aktív felidézés, időközös ismétlés, váltogatás, kidolgozott példák, Feynman-technika és értelmező kérdezés – és a népszerű, de kevéssé hatékony módszerek, tévhitek.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- melyik tanulási módszerek **működnek** a kutatások szerint,
- melyek a népszerű, de **kevéssé hatékony** módszerek,
- mi a **tanulási stílusok** tévhite.

## Mit mondanak a kutatások?

John Dunlosky és kollégái 2013-ban több száz tanulmány alapján értékelték a gyakori tanulási technikákat. A két leghatékonyabb a **gyakorló tesztelés** és az **időközös ismétlés** volt.

## A leghatékonyabb módszerek

### Aktív felidézés (gyakorló tesztelés)

Ne csak olvasd – **kérdezd ki magad**.

- Csukd be a jegyzetet, és írd le, amire emlékszel.
- Válaszolj gyakorlókérdésekre, régi feladatsorokra.
- Használj **kártyákat** (papír vagy alkalmazás, pl. Anki): elöl a kérdés, hátul a válasz.

### Időközös ismétlés (spaced repetition)

Az ismétléseket **időben szétszórva** végezd, egyre hosszabb szünetekkel (pl. 1, 3, 7, 14, 30 nap után), ne egyszerre, a vizsga előtti éjszakán.

```python run
# Egy egyszerű ismétlési ütemterv: minden ismétlés után megduplázzuk a szünetet.
from datetime import date, timedelta

tanulas_napja = date(2026, 11, 2)
szunet = 1
nap = tanulas_napja
for ismetles in range(1, 6):
    nap = nap + timedelta(days=szunet)
    print(f"{ismetles}. ismétlés: {nap.isoformat()} (az előző után {szunet} nappal)")
    szunet *= 2
```

A kártyás alkalmazások ezt automatikusan intézik: ami jól megy, azt ritkábban, ami nehéz, azt gyakrabban kérdezik.

### Váltogatás (interleaving)

Gyakorláskor **keverd** a feladattípusokat (pl. ciklus, rekurzió, rendezés vegyesen), ne egy típusból oldj meg húszat egymás után. Nehezebbnek érződik, de így tanulod meg **felismerni**, melyik módszer kell egy új feladathoz – a vizsgán sem típusonként jönnek a feladatok.

### Kidolgozott példák

Új témánál először nézz meg egy **lépésről lépésre** kidolgozott megoldást, értsd meg minden lépését, aztán oldj meg egy hasonlót önállóan.

### Feynman-technika

Richard Feynman fizikus módszere:

1. Válassz egy fogalmat.
2. **Magyarázd el** egyszerűen, mintha egy 12 évesnek tanítanád (írásban vagy hangosan).
3. Ahol elakadsz vagy bonyolult szakszóhoz menekülsz, ott **hiányos a megértésed** – nézz utána.
4. Egyszerűsíts, használj hasonlatokat.

A programozók „**gumikacsa-módszere**” is ilyen: ha hangosan, sorról sorra elmagyarázod a kódodat egy gumikacsának, gyakran rájössz a hibára.

### Értelmező kérdezés

Tanulás közben kérdezd: **„Miért igaz ez?”**, **„Hogyan kapcsolódik ahhoz, amit már tudok?”**, **„Mi lenne, ha…?”**

## Népszerű, de kevéssé hatékony

| Módszer                                                        | Miért gyenge?                                                         |
| -------------------------------------------------------------- | --------------------------------------------------------------------- |
| **újraolvasás**                                                | az ismerősség érzése megtéveszt: „ezt tudom” – de felidézni nem tudod |
| **szövegkiemelés**                                             | passzív; sokszor szinte mindent kiemelünk                             |
| **egyszerre, egy nagy adagban tanulás** (magolás vizsga előtt) | rövid távon működhet, de gyorsan felejtünk                            |

## A tanulási stílusok tévhite

Széles körben elterjedt hiedelem, hogy mindenki vagy „vizuális”, vagy „auditív”, vagy „kinesztetikus” tanuló, és a saját stílusában kell tanulnia. A kutatások **nem igazolták**, hogy a tanulás hatékonyabb lenne, ha a módszert az állítólagos stílushoz igazítjuk.

Ami valóban segít: a **tartalomhoz** illő forma (egy algoritmust ábrával, egy kiejtést hanggal érdemes tanulni), és a **több csatorna** együttes használata (szöveg + ábra).

## Összefoglalás

- A leghatékonyabb: aktív felidézés és időközös ismétlés.
- Továbbá: váltogatás, kidolgozott példák, Feynman-technika, értelmező kérdezés.
- Gyenge: újraolvasás, szövegkiemelés, magolás egy adagban.
- A tanulási stílusokhoz igazítás tévhit; a tartalomhoz illő formát válaszd.

## A lecke feladata

```quiz required
? Dunlosky és kollégái szerint melyik a két leghatékonyabb tanulási technika?
- újraolvasás és szövegkiemelés
+ gyakorló tesztelés és időközös ismétlés
- magolás és összefoglalás
- zenehallgatás és jegyzetmásolás
! Felidézés + szétszórt ismétlés.

? Mi a **váltogatás** (interleaving) lényege?
- egy feladattípusból sokat egymás után
+ a különböző feladattípusok keverése gyakorláskor
- tanulás és szünet váltogatása
- két tantárgy egyszerre, egy órában
! Így tanulod meg felismerni, melyik módszer kell.

? Miért megtévesztő az újraolvasás?
+ mert az ismerősség érzése azt sugallja, hogy tudod, pedig felidézni nem tudod
- mert túl sok időt vesz el
- mert fárasztja a szemet
- mert nem az
! Ismerős ≠ felidézhető.

? Igazolták-e a kutatások, hogy hatékonyabb a tanulás, ha a módszert a „tanulási stílushoz” (vizuális, auditív, kinesztetikus) igazítjuk?
- igen, egyértelműen
+ nem, ez tévhit
- csak a vizuális tanulóknál
- csak gyerekeknél
! A tartalomhoz illő forma számít.
```
