---
title: Kockázatkezelési technikák az innovációban
summary: Az innováció kockázattípusai, a valószínűség–hatás mátrix, a várható érték, a négy válaszstratégia, a portfólió-szemlélet és a „gyors kudarc” elve.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- milyen **kockázatai** vannak egy innovációs projektnek,
- hogyan rangsorold a kockázatokat a **valószínűség–hatás mátrixszal**,
- milyen **válaszstratégiák** közül választhatsz,
- miért segít a **portfólió** és a **gyors kudarc** szemlélet.

## Kockázat és bizonytalanság

**Kockázat**: egy bizonytalan esemény, amely ha bekövetkezik, hatással van a célokra. Az innováció természeténél fogva kockázatos – ha biztosan sikerülne, valaki már megcsinálta volna. A cél nem a kockázat **megszüntetése**, hanem **tudatos kezelése**.

## Az innováció kockázattípusai

| Típus                   | Kérdés                              | Példa                                       |
| ----------------------- | ----------------------------------- | ------------------------------------------- |
| **műszaki**             | Működni fog a technológia?          | az MI-modell pontossága nem éri el a 95%-ot |
| **piaci**               | Kell ez a vevőknek? Megveszik?      | a felhasználók nem hajlandók fizetni        |
| **pénzügyi**            | Elég lesz a pénz? Megtérül?         | a fejlesztés kétszer annyiba kerül          |
| **szervezeti**          | Megvan a tudás, az elkötelezettség? | a kulcsfejlesztő kilép                      |
| **jogi / szabályozási** | Szabad ezt csinálni?                | GDPR, szabadalmi bitorlás                   |

## Valószínűség–hatás mátrix

Minden kockázathoz becslünk egy **valószínűséget** (P) és egy **hatást** (I, _impact_), pl. 1–5 skálán. Szorzatuk a **kockázati pontszám**:

> **kockázati pontszám = P · I**

```text
 hatás ▲
   5   │  5  10  15  20  25
   4   │  4   8  12  16  20
   3   │  3   6   9  12  15
   2   │  2   4   6   8  10
   1   │  1   2   3   4   5
       └──────────────────────▶ valószínűség
          1   2   3   4   5
```

Jellemzően: **1–4 alacsony** (zöld), **5–12 közepes** (sárga), **15–25 magas** (piros). Először a piros mezőben lévőkkel foglalkozunk.

Pénzben is kifejezhető a **várható érték** (EMV, _Expected Monetary Value_): **EMV = valószínűség · pénzbeli hatás**. Ha 20% eséllyel 5 millió Ft kár ér, az EMV = 0,2 · 5 = **1 millió Ft** – ennyi tartalékot érdemes képezni rá.

## Válaszstratégiák (fenyegetésekre)

| Stratégia      | Mit csinálunk?                                           | Példa                                              |
| -------------- | -------------------------------------------------------- | -------------------------------------------------- |
| **elkerülés**  | megváltoztatjuk a tervet, hogy a kockázat ne álljon fenn | bevált technológiát választunk a kísérleti helyett |
| **áthárítás**  | a hatást másra hárítjuk                                  | biztosítás, fix áras alvállalkozói szerződés       |
| **csökkentés** | a valószínűséget vagy a hatást csökkentjük               | prototípus, korai tesztelés, tudásmegosztás        |
| **elfogadás**  | tudatosan vállaljuk (esetleg tartalékkal)                | kis kockázat, nem éri meg védekezni                |

A projektek rizikómenedzsmentjével a 14. témakörben részletesen foglalkozunk.

## Portfólió-szemlélet

Egyetlen radikális projekt nagyon kockázatos, de egy **projektportfólió** szétteríti a kockázatot. Gyakori arány (Nagji és Tuff, 2012): erőforrások kb. **70%-a alapvető** (inkrementális), **20%-a szomszédos** (új piacra vagy termékre), **10%-a átalakító** (radikális) innovációra.

## Gyors kudarc és reálopciók

- **Gyors kudarc** (_fail fast_): olcsó kísérletekkel minél előbb kiderítjük, ha egy ötlet nem működik – így kevés pénz vész el, és sokat tanulunk (Lean Startup, 3. témakör).
- **Reálopció**: a beruházást **lépcsőzetesen** végezzük; minden lépcső megadja a jogot (de nem a kötelességet) a következőre. A Stage-Gate kapui ilyen opciók.

## Összefoglalás

- Kockázattípusok: műszaki, piaci, pénzügyi, szervezeti, jogi.
- Kockázati pontszám = valószínűség · hatás; EMV = valószínűség · pénzbeli hatás.
- Válaszok fenyegetésekre: elkerülés, áthárítás, csökkentés, elfogadás.
- Portfólió (pl. 70/20/10) és gyors kudarc csökkenti az innováció összkockázatát.

## A lecke feladata

```quiz required
? Egy kockázat valószínűsége 4, hatása 3 (1–5 skálán). Mennyi a kockázati pontszáma?
= 12
! P · I = 4 · 3.

? Egy kockázat 25% eséllyel 8 millió Ft kárt okoz. Hány millió Ft a várható értéke (EMV)?
= 2
= 2 millió
! 0,25 · 8.

? A csapat biztosítást köt egy lehetséges adatvesztésre. Melyik válaszstratégia?
- elkerülés
+ áthárítás
- csökkentés
- elfogadás
! A pénzügyi hatást a biztosító viseli.

? A csapat korai prototípussal teszteli a kockázatos technológiát. Melyik válaszstratégia?
- elkerülés
- áthárítás
+ csökkentés
- elfogadás
! A prototípus csökkenti a kudarc valószínűségét és hatását.

? „A felhasználók nem lesznek hajlandók fizetni.” Milyen típusú kockázat ez?
- műszaki
+ piaci
- jogi
- szervezeti
! A vevők viselkedésére vonatkozik.

? A 70/20/10 portfólióarányban hány százalék jut az **átalakító** (radikális) innovációra?
= 10
= 10%
! 70% alapvető, 20% szomszédos, 10% átalakító.
```
