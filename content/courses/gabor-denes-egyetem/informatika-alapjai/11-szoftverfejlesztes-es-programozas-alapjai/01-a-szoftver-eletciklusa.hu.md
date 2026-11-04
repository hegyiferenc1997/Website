---
title: A szoftver életciklusa
summary: Az SDLC fázisai, a funkcionális és nem funkcionális követelmények, a fejlesztési szerepkörök.
minutes: 15
---

## Amit ebben a leckében megtanulsz

- melyek a szoftver **életciklusának** (SDLC) fázisai,
- mi a **funkcionális** és a **nem funkcionális** követelmény,
- milyen **szerepkörök** vannak egy fejlesztőcsapatban.

## Az életciklus fázisai

A **szoftverfejlesztési életciklus** (Software Development Life Cycle, SDLC) a szoftver útja az ötlettől a kivezetésig:

```text
 1. követelmények ─► 2. tervezés ─► 3. megvalósítás ─► 4. tesztelés
        ▲                                                   │
        │                                                   ▼
 6. karbantartás ◄────────────── 5. üzembe helyezés ◄───────┘
```

| Fázis               | Kérdés                           | Eredmény                                  |
| ------------------- | -------------------------------- | ----------------------------------------- |
| **követelmények**   | _mit_ kell tudnia a rendszernek? | követelménylista, felhasználói történetek |
| **tervezés**        | _hogyan_ építjük fel?            | architektúra, adatmodell, képernyőtervek  |
| **megvalósítás**    | a kód megírása                   | működő program                            |
| **tesztelés**       | jól működik-e?                   | hibalista, tesztjelentés                  |
| **üzembe helyezés** | a felhasználókhoz juttatás       | élesben futó rendszer                     |
| **karbantartás**    | hibajavítás, új igények          | új verziók                                |

A szoftver élete nagyobb részét **karbantartásban** tölti: egy sikeres rendszert évekig, évtizedekig fejlesztenek tovább.

## Követelmények

- **Funkcionális** – _mit_ csinál a rendszer: „A hallgató fel tud venni egy tárgyat.” „Az admin tud jelentést exportálni.”
- **Nem funkcionális** – _milyen minőségben_: „Az oldal 2 másodpercen belül betöltődik.” „Egyszerre 10 000 felhasználót kiszolgál.” „A jelszavakat hash-elve tárolja.” „Mobilon is használható.”

A követelményeket gyakran **felhasználói történet** (user story) formában írják:

> _Hallgatóként_ szeretném látni a heti órarendemet, _hogy_ ne kelljen fejben tartanom a termeket.

A rosszul megértett követelmény a legdrágább hiba: minél később derül ki, annál többe kerül kijavítani.

## Szerepkörök

| Szerep                          | Feladata                                            |
| ------------------------------- | --------------------------------------------------- |
| **termékgazda** / üzleti elemző | képviseli a megrendelőt, megfogalmazza az igényeket |
| **szoftvertervező** (architekt) | a rendszer felépítése, technológiák                 |
| **fejlesztő**                   | a kód megírása (frontend, backend, mobil)           |
| **tesztelő** (QA)               | hibák keresése, tesztek írása                       |
| **UX/UI tervező**               | a felhasználói élmény és a felület                  |
| **DevOps / üzemeltető**         | build, telepítés, szerverek, monitorozás            |

## Összefoglalás

- SDLC: követelmények → tervezés → megvalósítás → tesztelés → üzembe helyezés → karbantartás.
- Funkcionális = mit csinál; nem funkcionális = milyen minőségben (gyorsaság, biztonság…).
- Egy csapatban termékgazda, tervező, fejlesztő, tesztelő, UX-tervező és DevOps-mérnök dolgozik.

## A lecke feladata

```quiz required
? Melyik fázisban derül ki, hogy *mit* kell tudnia a rendszernek?
+ követelmények
- megvalósítás
- tesztelés
- karbantartás
! Ez az első fázis.

? Milyen követelmény ez: „Az oldal 2 másodpercen belül betöltődik”?
- funkcionális
+ nem funkcionális
! Minőségi követelmény (teljesítmény).

? Milyen követelmény ez: „A hallgató fel tud venni egy tárgyat”?
+ funkcionális
- nem funkcionális
! Azt írja le, mit csinál a rendszer.

? Melyik fázisban tölti a szoftver élete nagyobb részét?
- tervezés
- megvalósítás
- tesztelés
+ karbantartás
! A sikeres rendszereket évekig fejlesztik tovább.
```
