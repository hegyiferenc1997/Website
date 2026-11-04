---
title: Tervezési elvek és akadálymentesség
summary: Nielsen tíz heurisztikája röviden, vizuális hierarchia, kontraszt és szín, következetesség, a WCAG alapjai.
minutes: 18
---

## Amit ebben a leckében megtanulsz

- a jó felület legfontosabb **elveit** (Nielsen-heurisztikák),
- a **vizuális hierarchiát**, a **kontrasztot** és a **következetességet**,
- mi az **akadálymentesség**, és mit kér a **WCAG**.

## Nielsen tíz heurisztikája (röviden)

1. **A rendszer állapota látható** – töltésjelző, „Mentve” felirat.
2. **Egyezés a valós világgal** – a felhasználó szavai, nem a programozóé („Kosár”, nem „Rendelési entitás”).
3. **Irányítás és szabadság** – legyen „Vissza” és „Visszavonás”.
4. **Következetesség és szabványok** – ugyanaz mindenhol ugyanúgy néz ki és működik.
5. **Hibamegelőzés** – pl. a dátumválasztó nem enged február 30-at.
6. **Felismerés felidézés helyett** – mutasd a lehetőségeket, ne kelljen fejben tartani.
7. **Rugalmasság** – gyorsbillentyűk a haladóknak.
8. **Esztétikus, minimalista** – csak ami kell; minden extra elem elvonja a figyelmet.
9. **Segíts felismerni és javítani a hibát** – érthető hibaüzenet, megoldással.
10. **Súgó és dokumentáció** – kereshető, rövid, a feladathoz kötött.

## Vizuális hierarchia

A szem a **nagy**, **kontrasztos**, **kiemelt** elemeket látja először. Egy oldalon legyen **egy fő művelet** (pl. „Regisztráció”), és ez legyen a legfeltűnőbb gomb; a mellékes műveletek halványabbak. A tartalmat **közelség** szerint csoportosítsd: ami összetartozik, legyen közel egymáshoz; és hagyj elég **térközt** (white space).

## Szín és kontraszt

- A szöveg és a háttér között legyen elég **kontraszt**: a WCAG szerint normál szövegnél legalább **4,5 : 1**, nagy szövegnél 3 : 1.
- **Ne csak a szín** hordozzon információt: a hibás mezőt piros keret **és** szöveges üzenet jelezze (a férfiak kb. 8%-a valamilyen színtévesztő).
- Kevés, következetes szín: egy fő (márka)szín, egy kiemelő szín, semleges szürkék, és külön szín a sikerre és a hibára.

## Akadálymentesség

Az **akadálymentesség** (accessibility, a11y) azt jelenti, hogy a terméket **mindenki** használhatja: látássérültek (képernyőolvasóval), mozgássérültek (csak billentyűzettel), hallássérültek (feliratokkal), idősek, és bárki rossz körülmények közt (napfényben, egy kézzel). Az EU-ban az **akadálymentességi irányelv** alapján 2025 júniusától sok digitális szolgáltatásnak (pl. webshopok, banki alkalmazások) kötelezően akadálymentesnek kell lennie.

A **WCAG** (Web Content Accessibility Guidelines) négy elve – **POUR**:

| Elv            | Példa                                                         |
| -------------- | ------------------------------------------------------------- |
| **észlelhető** | a képeknek van szöveges leírása (`alt`), a videóknak felirata |
| **kezelhető**  | minden elérhető billentyűzettel is, látszik a fókusz          |
| **érthető**    | világos nyelv, kiszámítható működés, segítő hibaüzenetek      |
| **robusztus**  | szabványos HTML, hogy a képernyőolvasók is értelmezzék        |

```html
<!-- Rossz: a képernyőolvasó csak annyit mond: „kép” -->
<img src="grafikon.png" />
<!-- Jó: leírja, mit mutat a kép -->
<img src="grafikon.png" alt="A látogatók száma januártól júniusig a duplájára nőtt" />
<!-- Jó: valódi gomb, címkével; billentyűzettel is működik -->
<button type="submit">Regisztráció</button>
```

## Összefoglalás

- Nielsen-heurisztikák: látható állapot, valós világ nyelve, visszavonás, következetesség, hibamegelőzés…
- Vizuális hierarchia: egy fő művelet, csoportosítás, térköz; kontraszt legalább 4,5 : 1; ne csak a szín jelezzen.
- Akadálymentesség: WCAG POUR elvek – észlelhető, kezelhető, érthető, robusztus.

## A lecke feladata

```quiz required
? Melyik Nielsen-heurisztika példája a töltésjelző sáv?
+ a rendszer állapota látható
- esztétikus, minimalista
- súgó és dokumentáció
- rugalmasság
! A felhasználó látja, hogy történik valami.

? Legalább mekkora kontrasztarányt kér a WCAG normál méretű szövegnél? (Írd így: 4.5)
= 4.5
= 4,5
= 4.5:1
! 4,5 : 1.

? Miért hiba, ha egy űrlap csak piros színnel jelzi a hibás mezőt?
- Mert a piros csúnya.
+ Mert a színtévesztők nem látják a különbséget – szöveges üzenet is kell.
- Mert a piros lassítja az oldalt.
- Nem hiba.
! Ne csak a szín hordozzon információt.

? Melyik HTML-attribútum adja meg egy kép szöveges leírását a képernyőolvasóknak?
= alt
! <img alt="…">
```
