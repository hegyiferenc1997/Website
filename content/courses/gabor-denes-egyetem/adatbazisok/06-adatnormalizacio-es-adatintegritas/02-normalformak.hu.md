---
title: A normálformák lépésről lépésre
summary: Az 1NF, 2NF, 3NF és BCNF szabályai egy végigvitt példán (rendelések táblája), a 4NF röviden, és mikor érdemes tudatosan denormalizálni.
minutes: 28
---

## Amit ebben a leckében megtanulsz

- mit követel az **1., 2. és 3. normálforma**, és a **BCNF**,
- hogyan **bontasz szét** egy rossz táblát lépésről lépésre,
- mikor érdemes **eltérni** a normalizálástól.

## Egy jó emlékeztető

A 3NF-et sokan egy esküvel jegyzik meg: _„Minden nem kulcs attribútum a kulcstól függ, a teljes kulcstól, és semmi mástól, csak a kulcstól.”_ (Angolul: _„the key, the whole key, and nothing but the key”_.) Ebben benne van az 1NF (van kulcs), a 2NF (teljes kulcs) és a 3NF (semmi más).

## A kiinduló tábla

Egy webshop a rendeléseket így tárolja (normalizálatlanul):

| rendeles | datum      | vevo_id | vevo_nev  | vevo_varos | termekek                          |
| -------- | ---------- | ------- | --------- | ---------- | --------------------------------- |
| 1001     | 2026-11-02 | 7       | Kiss Anna | Budapest   | egér ×2 (4990), billentyűzet ×1 (12990) |
| 1002     | 2026-11-03 | 9       | Nagy Béla | Debrecen   | egér ×1 (4990)                    |
| 1003     | 2026-11-03 | 7       | Kiss Anna | Budapest   | monitor ×1 (59990)                |

## 1. normálforma (1NF): atomi értékek

**Szabály:** minden cellában **egyetlen, oszthatatlan** érték van; nincsenek ismétlődő csoportok (lista egy cellában, `termek1`, `termek2`… oszlopok), és van elsődleges kulcs.

A `termekek` oszlop listát tartalmaz – ez sérti az 1NF-et. Bontsuk szét, minden tétel külön sor legyen:

| rendeles | tetel_termek | datum      | vevo_id | vevo_nev  | vevo_varos | termek_nev   | egysegar | db |
| -------- | ------------ | ---------- | ------- | --------- | ---------- | ------------ | -------- | -- |
| 1001     | T1           | 2026-11-02 | 7       | Kiss Anna | Budapest   | egér         | 4990     | 2  |
| 1001     | T2           | 2026-11-02 | 7       | Kiss Anna | Budapest   | billentyűzet | 12990    | 1  |
| 1002     | T1           | 2026-11-03 | 9       | Nagy Béla | Debrecen   | egér         | 4990     | 1  |
| 1003     | T3           | 2026-11-03 | 7       | Kiss Anna | Budapest   | monitor      | 59990    | 1  |

Kulcs: `(rendeles, tetel_termek)`. Most már 1NF, de rengeteg az ismétlődés.

## 2. normálforma (2NF): nincs részleges függőség

**Szabály:** 1NF, és minden nem kulcs attribútum a **teljes** kulcstól függ (nem csak egy részétől). Csak összetett kulcsnál lehet megsérteni!

Részleges függőségek:

- `rendeles → datum, vevo_id, vevo_nev, vevo_varos` (csak a rendeléstől függnek),
- `tetel_termek → termek_nev, egysegar` (csak a terméktől függnek),
- `(rendeles, tetel_termek) → db` – ez az egyetlen teljes függőség.

Megoldás: amit a kulcs **egy része** határoz meg, külön táblába kerül, azzal a résszel mint kulccsal:

```text
 rendelesek(rendeles PK, datum, vevo_id, vevo_nev, vevo_varos)
 termekek(termek PK, termek_nev, egysegar)
 tetelek(rendeles FK, termek FK, db, PK(rendeles, termek))
```

## 3. normálforma (3NF): nincs tranzitív függőség

**Szabály:** 2NF, és egyetlen nem kulcs attribútum sem függ **másik nem kulcs** attribútumtól.

A `rendelesek` táblában: `rendeles → vevo_id → vevo_nev, vevo_varos`. A vevő neve nem a rendeléstől, hanem a vevőtől függ – ha Anna nevet változtat, minden rendelésénél át kellene írni.

Megoldás: a tranzitívan függő attribútumok saját táblába kerülnek:

```text
 vevok(vevo_id PK, vevo_nev, vevo_varos)
 rendelesek(rendeles PK, datum, vevo_id FK → vevok)
 termekek(termek PK, termek_nev, egysegar)
 tetelek(rendeles FK, termek FK, db, PK(rendeles, termek))
```

Kész: minden adat **egyszer** szerepel. Az anomáliák eltűntek: új terméket bármikor felvehetsz, a vevő címét egy helyen javítod, és egy rendelés törlése nem viszi magával a vevőt.

## BCNF (Boyce–Codd normálforma)

A 3NF egy kicsit szigorúbb változata: **minden** nem triviális függőség bal oldala szuperkulcs kell legyen. A legtöbb 3NF tábla egyben BCNF is; eltérés csak ritka esetekben van, amikor több, egymást átfedő jelöltkulcs van.

Példa: `foglalas(terem, idopont, oktato)` – egy oktató mindig ugyanabban a teremben tanít (`oktato → terem`), de az `oktato` nem kulcs. Ez 3NF lehet, de nem BCNF; a megoldás itt is a szétbontás.

## 4NF röviden

A 4NF a **többértékű függőségeket** kezeli: ha egy oktató több tárgyat tanít **és** több nyelven beszél, és ez a kettő független egymástól, ne egy táblában tárold `(oktato, targy, nyelv)` formában (minden párosítás külön sor lenne), hanem két táblában: `(oktato, targy)` és `(oktato, nyelv)`.

## Mikor ne normalizálj?

A normalizált séma a **helyes** adatokért felel, de sok összekapcsolást (JOIN) igényel a lekérdezésnél. Elemző rendszerekben (adattárház, 18. témakör) vagy nagyon gyakran olvasott adatoknál néha **tudatosan denormalizálunk** – pl. a rendelés végösszegét is eltároljuk. Ezt azonban mindig **szándékosan**, a következmények (frissítés!) ismeretében tesszük, nem véletlenül.

Ökölszabály OLTP rendszerekhez: **normalizálj 3NF-ig**, és csak mérés után denormalizálj.

## Összefoglalás

- 1NF: atomi értékek, nincs ismétlődő csoport.
- 2NF: nincs részleges függőség (a teljes kulcstól függ).
- 3NF: nincs tranzitív függőség (csak a kulcstól függ).
- BCNF: minden meghatározó szuperkulcs. 4NF: független többértékű tényeket külön.
- Denormalizálás csak tudatosan.

## A lecke feladata

```quiz required
? Egy `diakok` táblában a `telefonszamok` oszlop így néz ki: „06301234567, 06209876543”. Melyik normálformát sérti?
+ 1NF
- 2NF
- 3NF
- BCNF
! Nem atomi érték: lista egy cellában.

? Melyik normálformát **nem** sértheti meg egy olyan tábla, amelynek egyetlen oszlopból álló kulcsa van (és 1NF)?
- 1NF
+ 2NF
- 3NF
! Részleges függőség csak összetett kulcsnál lehet.

? `dolgozok(dolgozo_id PK, nev, reszleg_id, reszleg_nev)`. Melyik normálformát sérti?
- 1NF
- 2NF
+ 3NF
! reszleg_neve tranzitívan függ: dolgozo_id → reszleg_id → reszleg_nev.

? A lecke példájában hány táblát kaptunk a 3NF végére?
= 4
! vevok, rendelesek, termekek, tetelek.

? A `tetelek(rendeles, termek, db)` táblában a `db` mitől függ?
- csak a rendeléstől
- csak a terméktől
+ a teljes kulcstól (rendelés + termék)
! Ez teljes függőség, ezért maradhat ebben a táblában.

? Hogy hívjuk, amikor teljesítmény miatt szándékosan ismétlődő adatot tárolunk?
= denormalizálás
= denormalizáció
= denormalization
! Csak tudatosan, méréssel alátámasztva.
```
