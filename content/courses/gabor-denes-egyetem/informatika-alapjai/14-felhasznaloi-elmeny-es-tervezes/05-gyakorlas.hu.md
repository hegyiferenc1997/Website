---
title: Gyakorlás – felhasználói élmény és tervezés
summary: Ellenőrző kérdések, egy mini tervezési feladat és összefoglaló feladatlap az UX-ről, az akadálymentességről és a tervezési folyamatról.
minutes: 22
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Egy webshopban a „Kosárba” gomb szürke, kicsi, és a „Kívánságlista” gomb mellett van, ami ugyanakkora és élénk narancssárga. Mi a gond?</summary>

Rossz a vizuális hierarchia: a fő műveletnek (Kosárba) kellene a legfeltűnőbbnek lennie. A mellékes művelet (Kívánságlista) legyen halványabb.

</details>

<details>
<summary>2. Hogyan teszed billentyűzettel is használhatóvá egy saját „gomb”-ot, amely valójában egy `<div>`?</summary>

A legjobb, ha valódi `<button>` elemet használsz: az alapból fókuszálható, Enterrel és szóközzel is működik, és a képernyőolvasó gombként olvassa fel.

</details>

<details>
<summary>3. Miért nem elég, ha a fejlesztőcsapat saját maga teszteli a felület használhatóságát?</summary>

Mert ők már ismerik a rendszert és a szakszavakat; nem látják, mi zavaros egy új felhasználónak. Valódi célfelhasználók kellenek.

</details>

**Mini tervezési feladat:** rajzolj papíron drótvázat egy egyetemi „Mai óráim” mobilképernyőről! Legyen rajta egy egyértelmű fő információ (a következő óra), egy lista a napi órákról, és egy gomb a heti nézethez. Utána kérj meg egy évfolyamtársat, hogy „hangosan gondolkodva” keresse meg rajta a csütörtöki laborod termét.

## Összefoglaló feladatlap

```quiz required
? Melyik a UX és nem a UI része?
- a betűtípus
- az ikonok stílusa
+ hogy a felhasználó elsőre megtalálja-e a fizetés gombot
- a háttérszín
! A UX a teljes élmény.

? Mit jelent a WCAG POUR elveiben az O (angolul Operable)?
+ kezelhető – például billentyűzettel is
- optimalizált
- online
- opcionális
! Perceivable, Operable, Understandable, Robust.

? Hogy hívják a kitalált, de kutatáson alapuló tipikus felhasználót a tervezésben?
= persona
! Pl. „Kata, 19 éves elsőéves”.

? Melyik tesztben látja élesben a felhasználók egyik fele az egyik, másik fele a másik változatot?
- használhatósági teszt
+ A/B teszt
- egységteszt
- stresszteszt
! Utána mérik, melyik vezet jobb eredményhez.

? Melyik Nielsen-heurisztikát sérti egy dátumválasztó, amely enged február 30-at választani?
- súgó és dokumentáció
+ hibamegelőzés
- rugalmasság
- esztétikus, minimalista
! A jó felület meg sem engedi a hibát.

? Melyik népszerű, böngészőben futó eszközzel készítenek drótvázat és prototípust?
= Figma
! Közös szerkesztéssel, a tervezőcsapatok kedvence.
```
