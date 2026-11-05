---
title: A kutatási folyamat
summary: Mi a tudományos kutatás, a kutatási kérdés és a hipotézis, független és függő változók, kvalitatív, kvantitatív és vegyes módszerek – egy felhasználói felület kutatásának példáján.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- a **kutatási folyamat** lépéseit,
- hogyan fogalmazz jó **kutatási kérdést** és **hipotézist**,
- mi a **független** és a **függő változó**,
- a **kvalitatív** és a **kvantitatív** módszerek különbségét.

## Miért kell ez egy mérnökinformatikusnak?

Nem csak a tudósok kutatnak. Egy fejlesztő is kutat, amikor:

- felhasználói interjúkkal feltárja, mire van szükség,
- A/B teszttel eldönti, melyik felület jobb,
- összehasonlít két adatbázist teljesítménymérésekkel,
- a szakdolgozatához irodalmat dolgoz fel.

## A kutatási folyamat lépései

```text
1. téma és probléma         →  Mi érdekel? Mi a gond?
2. szakirodalom áttekintése  →  Mit tudunk már róla?
3. kutatási kérdés, hipotézis →  Pontosan mire keresem a választ?
4. módszer megtervezése      →  Hogyan, kitől, mennyi adatot gyűjtök?
5. adatgyűjtés
6. elemzés
7. következtetés és korlátok →  Mit jelent? Mire nem érvényes?
8. közlés                    →  dolgozat, jelentés, előadás
```

## Kutatási kérdés

A jó kutatási kérdés **konkrét**, **megválaszolható** és **releváns**.

| Rossz                               | Jobb                                                                                                |
| ----------------------------------- | --------------------------------------------------------------------------------------------------- |
| „Milyen a jó felhasználói felület?” | „Csökken-e a regisztráció megszakítása, ha az űrlap 6 mező helyett 3 mezőből áll?”                  |
| „Jó-e a Python?”                    | „Hogyan alakul a futási idő két rendezési algoritmus Python-implementációjánál 10⁶ elemű listákon?” |

## Hipotézis

A **hipotézis** egy ellenőrizhető, előzetes válasz a kutatási kérdésre, amelyet az adatok **megerősíthetnek vagy cáfolhatnak**.

> „Ha a regisztrációs űrlap 3 mezőből áll, a regisztrációt elkezdők közül többen fejezik be, mint 6 mezőnél.”

Egy jó hipotézis **cáfolható** (Karl Popper): elképzelhető olyan eredmény, amely ellentmond neki. A „lehet, hogy jobb lesz, lehet, hogy nem” nem hipotézis.

## Változók

- **Független változó**: amit a kutató változtat vagy összehasonlít (az űrlapmezők száma).
- **Függő változó**: amit mér, és ami a független változótól függhet (a befejezési arány).
- **Zavaró változó**: más tényező, amely szintén hathat az eredményre (pl. napszak, eszköz, kampány). Ezeket próbáljuk **kiszűrni**, pl. véletlenszerű csoportbeosztással.

## Kvalitatív, kvantitatív, vegyes

| Kvantitatív (mennyiségi)                             | Kvalitatív (minőségi)                                 |
| ---------------------------------------------------- | ----------------------------------------------------- |
| számok, mérések, statisztika                         | szövegek, megfigyelések, értelmezés                   |
| „mennyi?”, „milyen gyakran?”, „van-e különbség?”     | „miért?”, „hogyan élik meg?”                          |
| kérdőív zárt kérdésekkel, mérés, kísérlet, A/B teszt | interjú, fókuszcsoport, megfigyelés, nyitott kérdések |
| nagy minta, általánosítható                          | kis minta, mély megértés                              |

A **vegyes módszer** a kettőt kombinálja: pl. interjúkkal feltárod a problémákat (kvalitatív), majd egy kérdőívvel megméred, mennyire gyakoriak (kvantitatív).

## Korrelációs és kísérleti kutatás

- **Korrelációs**: megfigyeled, hogy két változó együtt mozog-e (pl. a tanulással töltött idő és az eredmény). Ok-okozatot nem bizonyít (lásd 5. témakör, post hoc hiba).
- **Kísérleti**: a független változót te állítod be, a résztvevőket **véletlenszerűen** osztod csoportokba (pl. A/B teszt). Ez már ok-okozati következtetést is megenged.

## Összefoglalás

- Lépések: probléma, irodalom, kérdés és hipotézis, módszer, adatgyűjtés, elemzés, következtetés, közlés.
- Jó kutatási kérdés: konkrét, megválaszolható, releváns; a hipotézis ellenőrizhető és cáfolható.
- Független változó: amit változtatsz; függő: amit mérsz; a zavaró változókat szűrd ki.
- Kvantitatív: számok, „mennyi”; kvalitatív: szövegek, „miért”; a vegyes mindkettőt használja.

## A lecke feladata

```quiz required
? Egy A/B tesztben a gomb színét változtatod, és a kattintási arányt méred. Mi a **független változó**?
+ a gomb színe
- a kattintási arány
- a napszak
- a felhasználók életkora
! Amit a kutató változtat.

? Melyik a jó hipotézis?
- „Az új felület talán jobb lesz, talán nem.”
+ „A 3 mezős űrlapnál nagyobb arányban fejezik be a regisztrációt, mint a 6 mezősnél.”
- „A felhasználói felületek fontosak.”
- „Mindenki szereti a sötét témát.”
! Konkrét, ellenőrizhető, cáfolható.

? Azt szeretnéd megérteni, **miért** hagyják abba a felhasználók a regisztrációt. Melyik módszer illik leginkább?
- csak a befejezési arány mérése
+ kvalitatív: interjúk, megfigyelés
- egy teljesítménymérés a szerveren
- egy véletlenszám-generátor
! „Miért?” → kvalitatív.

? Mi teszi lehetővé leginkább ok-okozati következtetés levonását?
- egy korrelációs vizsgálat
+ egy kísérlet véletlenszerű csoportbeosztással
- egy interjú egyetlen felhasználóval
- egy blogbejegyzés
! A véletlen beosztás kiszűri a zavaró változókat.
```
