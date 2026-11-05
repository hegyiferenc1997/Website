---
title: A pénz funkciói és formái
summary: Mire jó a pénz, és mitől pénz a pénz? A pénz négy funkciója, az árupénztől a számlapénzig, a kriptoeszközök és a digitális jegybankpénz, a pénzaggregátumok és a mennyiségi egyenlet.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- a pénz **négy funkcióját**,
- a pénz **formáinak** fejlődését az árupénztől a digitális pénzig,
- hogy pénznek tekinthetők-e a **kriptoeszközök**,
- mik a **pénzaggregátumok** (M1, M2, M3),
- mit mond a **mennyiségi egyenlet**.

## Miért van pénz?

Pénz nélkül **cserekereskedelem** (barter) lenne: a programozónak, aki kenyeret akar, olyan péket kellene találnia, aki éppen egy weboldalt szeretne. Ez a „szükségletek kettős egybeesésének” problémája. A pénz ezt megoldja.

## A pénz funkciói

| Funkció                            | Jelentés                                        | Példa                              |
| ---------------------------------- | ----------------------------------------------- | ---------------------------------- |
| **csereeszköz**                    | mindenki elfogadja fizetségként                 | fizetsz a menzán                   |
| **értékmérő** (elszámolási egység) | minden ára ugyanabban az egységben fejezhető ki | a laptop 300 000 Ft, a kávé 900 Ft |
| **értékmegőrző**                   | a vásárlóerő későbbre átvihető                  | félreteszel a nyárra               |
| **halasztott fizetés eszköze**     | az adósságok pénzben rögzíthetők                | hiteltörlesztés                    |

## A pénz formái

1. **Árupénz:** önmagában is értékes áru (só, kagyló, arany, ezüst érme).
2. **Fedezett papírpénz:** aranyra váltható bankjegy (aranystandard – a 20. században megszűnt; a dollár aranyra válthatósága 1971-ben szűnt meg).
3. **Fiat pénz** (ma ez van): nincs mögötte arany, az értékét a **bizalom** és a **törvényes fizetőeszköz** státusz adja – az állam elfogadja adóként, a jegybank vigyáz az értékére.
4. **Készpénz:** bankjegy és érme (Magyarországon az MNB bocsátja ki).
5. **Számlapénz:** bankszámlán lévő betét – a pénzmennyiség **túlnyomó része** ilyen. Kártyás és azonnali fizetés (Magyarországon 2020 óta az **azonnali fizetési rendszer**, 5 mp-en belüli utalás).

### Kriptoeszközök

A bitcoin és társai decentralizált, blokklánc alapú digitális eszközök. Pénznek viszont **gyenge**: az árfolyamuk nagyon ingadozik (rossz értékmegőrző és értékmérő), kevés helyen fogadják el, és nincs mögöttük központi bank. Ezért a szakirodalom inkább **kriptoeszköznek** hívja őket. Az EU-ban 2024 óta a **MiCA** rendelet szabályozza a kriptoeszköz-szolgáltatókat.

A **stabilcoinok** egy hagyományos pénzhez (pl. dollárhoz) kötött árfolyamúak – stabilabbak, de a fedezetük minőségén múlnak.

### Digitális jegybankpénz (CBDC)

Sok jegybank vizsgálja a **digitális jegybankpénzt**: olyan, mint a készpénz, csak elektronikus, és közvetlenül a jegybank kötelezettsége. Az Európai Központi Bank a **digitális euró** előkészítésén dolgozik.

## Pénzaggregátumok

A pénzmennyiséget különböző szűkítésekkel mérik a **likviditás** (milyen gyorsan költhető el) szerint:

- **M0 (jegybankpénz):** készpénz + a bankok jegybanki számlapénze,
- **M1:** forgalomban lévő készpénz + **látra szóló betétek** (folyószámla),
- **M2:** M1 + rövid lekötésű betétek,
- **M3:** M2 + egyéb, pénzhez közeli eszközök (pl. pénzpiaci alapok egyes jegyei).

## A mennyiségi egyenlet

$$ M \cdot V = P \cdot Y $$

- $M$: pénzmennyiség, $V$: a pénz **forgási sebessége** (egy forint hányszor cserél gazdát egy év alatt),
- $P$: árszint, $Y$: reál kibocsátás (reál GDP).

Ha $V$ és $Y$ nagyjából állandó, a pénzmennyiség növekedése **árszint-emelkedéshez** vezet. Hosszú távon ez jól magyarázza a nagy inflációkat (a pengő-hiperinflációt is a pénznyomtatás okozta).

## Összefoglalás

- Funkciók: csereeszköz, értékmérő, értékmegőrző, halasztott fizetés eszköze.
- Ma fiat pénz van; a pénz nagy része számlapénz.
- A kriptoeszközök a pénz funkcióit gyengén töltik be; a CBDC jegybanki digitális pénz.
- M1 ⊂ M2 ⊂ M3, likviditás szerint.
- $MV = PY$: túl sok pénz hosszú távon inflációhoz vezet.

## A lecke feladata

```quiz required
? Melyik funkciót tölti be a pénz, amikor összehasonlítod két laptop árát forintban?
- csereeszköz
+ értékmérő
- értékmegőrző
- halasztott fizetés eszköze
! Közös mértékegység.

? Miért gyenge értékmegőrző a legtöbb kriptoeszköz?
- mert nem lehet vele fizetni
+ mert nagyon ingadozik az árfolyama
- mert az állam bocsátja ki
- mert papíralapú
! A vásárlóereje kiszámíthatatlan.

? Mi adja a mai fiat pénz értékét?
- az aranyfedezet
+ a bizalom és a törvényes fizetőeszköz státusz
- a papír anyagának értéke
- a bankok aranytartaléka
! Nincs mögötte áru.

? M = 100, V = 5, Y = 250. Mennyi az árszint (P)?
= 2
! 100 · 5 / 250.

? Melyik része az M1-nek?
+ a folyószámlán lévő pénz
- egy 1 éves lekötésű betét
- egy állampapír
- egy részvény
! Látra szóló betét – azonnal elkölthető.
```
