---
title: Szakirodalom, forráskritika és hivatkozás
summary: Hol keress megbízható szakirodalmat, hogyan értékeld a forrásokat, hogyan hivatkozz (APA és IEEE stílus), mi a plágium, és hogyan használd tisztességesen a mesterséges intelligenciát.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- hol találsz **megbízható szakirodalmat**,
- hogyan **értékeld** egy forrás hitelességét,
- hogyan **hivatkozz** (APA, IEEE),
- mi a **plágium**, és hogyan kerüld el.

## Hol keress?

| Forrás                                                | Jellemző                                              |
| ----------------------------------------------------- | ----------------------------------------------------- |
| **Google Scholar**                                    | tudományos cikkek, idézettség, ingyenes keresés       |
| **IEEE Xplore**, **ACM Digital Library**              | a mérnöki és informatikai szakirodalom fő adatbázisai |
| **arXiv**                                             | előzetes (még nem lektorált) tanulmányok – óvatosan   |
| **egyetemi könyvtár**, adatbázis-előfizetések         | sok fizetős cikk az egyetemi hálózatról elérhető      |
| **hivatalos dokumentáció**, szabványok (pl. RFC, ISO) | technikai kérdésekben elsődleges forrás               |

Keresési tippek: angol kulcsszavak, idézőjeles kifejezés, szinonimák; egy jó, friss áttekintő cikk (_survey_, _review_) hivatkozásai továbbvezetnek.

## Forráskritika

Nem minden forrás egyformán megbízható. Kérdezd meg (a „CRAAP” teszt alapján):

- **Időszerű?** Mikor jelent meg? Informatikában egy 10 éves cikk már elavult lehet.
- **Releváns?** Tényleg a te kérdésedről szól?
- **Hiteles a szerző?** Ki írta, milyen szakértelemmel, milyen intézményből?
- **Pontos?** Van módszertana, hivatkozásai, adatai? **Lektorált** (más szakértők átnézték megjelenés előtt)?
- **Mi a célja?** Tájékoztat, vagy el akar adni valamit?

| Megbízhatóbb                             | Óvatosan kezelendő                                |
| ---------------------------------------- | ------------------------------------------------- |
| lektorált folyóiratcikk, konferenciacikk | névtelen blog, fórumbejegyzés                     |
| hivatalos dokumentáció, szabvány         | cég marketinganyaga a saját termékéről            |
| tankönyv, szakkönyv                      | közösségi média, MI-chatbot válasza forrás nélkül |

A Wikipédia jó **kiindulópont** a tájékozódáshoz és a további források megtalálásához, de tudományos munkában általában az eredeti forrásokra hivatkozz.

## Hivatkozás

Hivatkozni kell minden **átvett gondolatra, adatra, ábrára, idézetre** – akkor is, ha a saját szavaiddal fogalmaztad át.

### APA stílus (szerző–évszám)

A szövegben: „…a gyakorló tesztelés a leghatékonyabb technikák közé tartozik (Dunlosky et al., 2013).”

Az irodalomjegyzékben:

```text
Dunlosky, J., Rawson, K. A., Marsh, E. J., Nathan, M. J., & Willingham, D. T. (2013).
Improving students' learning with effective learning techniques. Psychological Science
in the Public Interest, 14(1), 4–58.
```

### IEEE stílus (számozott) – gyakori a mérnöki szakirodalomban

A szövegben: „…a gyakorló tesztelés a leghatékonyabb technikák közé tartozik [1].”

```text
[1] J. Dunlosky, K. A. Rawson, E. J. Marsh, M. J. Nathan, and D. T. Willingham,
    "Improving students' learning with effective learning techniques," Psychological
    Science in the Public Interest, vol. 14, no. 1, pp. 4–58, 2013.
```

Használj **hivatkozáskezelőt** (pl. Zotero), amely automatikusan formázza a hivatkozásokat.

## Plágium

**Plágium**: más munkájának (szöveg, gondolat, kód, ábra) saját munkaként való feltüntetése, megfelelő hivatkozás nélkül. Formái:

- szó szerinti átvétel idézőjel és hivatkozás nélkül,
- átfogalmazás hivatkozás nélkül,
- mások kódjának beadása sajátként,
- a saját korábbi munka újrafelhasználása jelzés nélkül (önplágium).

Hogyan kerüld el?

- Jegyzetelésnél **mindig írd fel a forrást**.
- Szó szerinti idézet **idézőjelben**, hivatkozással.
- Átfogalmazásnál is hivatkozz.
- Kódnál tartsd be a **licencet**, és jelöld, honnan származik egy átvett részlet.

## Mesterséges intelligencia a kutatásban

- Az MI-chatbot **nem forrás**: kitalálhat nem létező cikkeket és hivatkozásokat. Minden állítást ellenőrizz az eredeti forrásban.
- Ha MI-eszközt használtál (pl. szövegjavításra, ötletelésre), **jelezd** az adott intézmény vagy folyóirat szabályai szerint.
- Bizalmas kutatási adatot (pl. interjúk szövegét) ne tölts fel engedély nélkül nyilvános MI-szolgáltatásba.

## Összefoglalás

- Keress megbízható adatbázisokban (Google Scholar, IEEE Xplore, ACM DL, egyetemi könyvtár).
- Forráskritika: időszerű, releváns, hiteles szerző, pontos, lektorált, mi a célja.
- Hivatkozz minden átvett gondolatra – APA (szerző–év) vagy IEEE (számozott) stílusban.
- Plágium: más munkája hivatkozás nélkül – kerüld idézőjellel, hivatkozással, licenccel.
- Az MI nem forrás; ellenőrizd, és jelezd a használatát.

## A lecke feladata

```quiz required
? Melyik a legmegbízhatóbb forrás egy szakdolgozathoz?
- egy névtelen blogbejegyzés
- egy MI-chatbot válasza forrás nélkül
+ egy lektorált konferencia- vagy folyóiratcikk
- egy cég reklámanyaga a saját termékéről
! A lektorálás minőségbiztosítás.

? Mit jelent, hogy egy cikk **lektorált**?
- hogy helyesírás-ellenőrzőn futott át
+ hogy megjelenés előtt más szakértők átnézték és értékelték
- hogy ingyenesen elérhető
- hogy sokan lájkolták
! Peer review.

? Egy forrás gondolatát a saját szavaiddal fogalmazod át. Kell hivatkozni?
+ igen, az átvett gondolatra mindig hivatkozni kell
- nem, ha átfogalmaztad
- csak ha szó szerinti idézet
- csak ha angol nyelvű a forrás
! Különben plágium.

? Melyik hivatkozási stílus használ szögletes zárójeles számokat a szövegben, pl. [1]?
- APA
+ IEEE
- egyik sem
- mindkettő
! Gyakori a mérnöki szakirodalomban.
```
