---
title: Hazárdok – statikus, dinamikus és funkcionális
summary: Miért jelenik meg tüske (glitch) a kombinációs hálózat kimenetén, hogyan ismered fel a Karnaugh-táblán, és hogyan szünteted meg redundáns taggal.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- mi a **hazárd** és a **tüske** (glitch),
- a **statikus 1-es**, **statikus 0-s**, **dinamikus** és **funkcionális** hazárd különbségét,
- hogyan veszed észre a statikus hazárdot a **Karnaugh-táblán**,
- hogyan szünteted meg **redundáns (konszenzus) taggal**,
- miért kevésbé veszélyes a hazárd **szinkron** rendszerben.

## Mi a hazárd?

A **hazárd** nemkívánatos, rövid ideig tartó átmenet a kimeneten. Oka, hogy a valóságos kapuknak **késleltetésük** van, és a bemenettől a kimenetig vezető **különböző utak késleltetése eltér**. A rövid, magától megszűnő hibát **tüskének** (glitch) nevezzük.

Az ideális logikai modell (igazságtábla, Boole-algebra) **nem ismeri az időt** – ezért a hazárd az egyszerűsített képletből nem látszik, csak a megvalósításból.

## A klasszikus példa

Vegyük az **F = A·B + A̅·C** függvényt. Ha **B = 1 és C = 1**, akkor F = A + A̅ = **1**, függetlenül A értékétől.

Tegyük fel, hogy B = C = 1, és **A 1-ről 0-ra vált**:

- az egyik ág (A·B) **azonnal** kikapcsol,
- a másik ág (A̅·C) csak az **inverter késleltetése után** kapcsol be.

Rövid ideig **mindkét ÉS-kapu kimenete 0**, így a VAGY-kapu kimenete is 0-ra esik – noha 1-nek kellene maradnia. Ez a **statikus 1-es hazárd**. A tüske hossza nagyjából az eltérő ág többletkésleltetése (itt az inverteré).

```text
A      ‾‾‾‾‾‾‾‾|_______________
A̅      ________|‾‾‾ (késve) ‾‾‾  ← az inverter késleltetése miatt
A·B    ‾‾‾‾‾‾‾‾|_______________
A̅·C    ___________|‾‾‾‾‾‾‾‾‾‾‾‾
F      ‾‾‾‾‾‾‾‾|__|‾‾‾‾‾‾‾‾‾‾‾‾  ← tüske
```

## A hazárdok fajtái

| fajta         | elvárt viselkedés           | ami történik             |
| ------------- | --------------------------- | ------------------------ |
| statikus 1-es | marad 1                     | 1 → 0 → 1                |
| statikus 0-s  | marad 0                     | 0 → 1 → 0                |
| dinamikus     | egyszer vált (0 → 1)        | 0 → 1 → 0 → 1            |
| funkcionális  | egyszerre több bemenet vált | a köztes állapot látszik |

- A **statikus 1-es** hazárd tipikusan **SOP** (ÉS–VAGY), a **statikus 0-s** **POS** (VAGY–ÉS) megvalósításban jelenik meg.
- A **dinamikus** hazárd többszintű hálózatban jön elő, ahol egy jel három vagy több úton, eltérő késéssel ér a kimenetre.
- A **funkcionális** hazárd oka, hogy **két bemenet nem pontosan egyszerre** vált (pl. 01 → 10 közben rövid ideig 00 vagy 11 látszik). Ez a függvény tulajdonsága, redundáns taggal **nem** szüntethető meg.

## Felismerés a Karnaugh-táblán

Statikus 1-es hazárd ott lehet, ahol **két szomszédos 1-es cellát különböző csoport fed le, és nincs olyan csoport, amely mindkettőt lefedné**. Az átmenet ugyanis ezen a „határon” át történik.

Az F = AB + A̅C táblája (sor: A, oszlop: BC):

| A \ BC | 00  | 01  | 11  | 10  |
| ------ | --- | --- | --- | --- |
| 0      | 0   | 1   | 1   | 0   |
| 1      | 0   | 0   | 1   | 1   |

Az A̅C csoport (1, 3) és az AB csoport (7, 6) a **3 és 7 cellánál** ér össze (B = C = 1), de közös csoport nincs.

## Megszüntetés: redundáns (konszenzus) tag

Vegyünk fel egy **átfedő csoportot** a két csoport határán: a 3–7 cellapár → **B·C**.

**F = AB + A̅C + BC**

Logikailag ugyanaz a függvény (ez a **konszenzus-tétel**: XY + X̅Z + YZ = XY + X̅Z), de amikor B = C = 1, a BC tag végig 1-ben tartja a kimenetet, bármikor vált A. A redundáns tag tehát **szándékosan „felesleges”**.

A **statikus 0-s** hazárdot POS alakban ugyanígy, a 0-k csoportjai közé tett átfedő VAGY-taggal szüntetjük meg.

## Más védekezési módok

- **Szinkron tervezés:** a kimenetet egy órajellel vezérelt tároló **csak az órajel élén** mintavételezi, amikor a tüskék már lecsengtek. Ezért a modern (FPGA-s) tervezésben a kombinációs tüskék többnyire ártalmatlanok – amíg a jel nem óra, reset vagy aszinkron vezérlőjel!
- **Késleltetés kiegyenlítése** vagy a kimenet **szűrése** (RC-tag) – ritkán, inkább kényszermegoldás.
- Gray-kódos számlálók, hogy egyszerre csak egy bit változzon (funkcionális hazárd ellen).

## Összefoglalás

- A hazárd oka az eltérő úthosszak késleltetése; a kimeneten tüske jelenik meg.
- Statikus 1-es / 0-s, dinamikus és funkcionális hazárd.
- K-táblán: szomszédos, de külön csoportban lévő cellák → konszenzus taggal szüntethető meg.
- Szinkron rendszerben a tároló csak az órajel élén mintavételez, így a tüske többnyire nem okoz hibát.

## A lecke feladata

```quiz required
? Mit nevezünk statikus 1-es hazárdnak?
- A kimenet tartósan 1-ben ragad.
+ A kimenetnek 1-ben kellene maradnia, de rövid időre 0-ra esik.
- A kimenet 0 → 1 váltás közben többször is billeg.
- Két bemenet egyszerre változik.
! „Statikus”: a kimenet elvileg nem változik.

? Az F = AB + A̅C hálózatban melyik redundáns tag szünteti meg a statikus 1-es hazárdot?
+ BC
- AC
- A̅B
- AB̅
! A két csoport a B = C = 1 cellákon ér össze.

? Melyik tag szünteti meg a hazárdot az F = A̅B̅ + AC függvényben?
- A̅C
+ B̅C
- AB̅
- BC̅
! A konszenzus-tétel: XY + X̅Z → YZ, itt X = A.

? Az inverter késleltetése 8 ns, a többi kapué egyforma. Körülbelül hány ns hosszú a tüske a klasszikus F = AB + A̅C példában?
= 8
= 8ns
! Az A̅ ág annyival késik a másikhoz képest, amennyi az inverter késleltetése.

? Mi a dinamikus hazárd?
- A kimenet egy rövid időre az ellenkezőjére vált, majd visszaáll.
+ A kimenet egyetlen váltás helyett többször vált (pl. 0 → 1 → 0 → 1).
- Az órajel és az adat egyszerre változik.
- A hálózat oszcillál.
! Elvárt egy váltás, de több történik.

? Miért ártalmatlan többnyire a kombinációs tüske egy szinkron rendszerben?
- Mert a szinkron rendszerben nincs késleltetés.
- Mert a tárolók kiszűrik a nagyfrekvenciás zajt.
+ Mert a tárolók csak az órajel élén mintavételeznek, amikorra a jel már beállt.
- Mert ott csak NAND kapukat használunk.
```
