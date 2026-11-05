---
title: A megfelelő online csatorna kiválasztása
summary: E-mail, chat, videóhívás, hibakövető, wiki – melyik mire való? A médiagazdagság-elmélet, és egy egyszerű döntési segédlet a csatornaválasztáshoz.
minutes: 15
---

## Amit ebben a leckében megtanulsz

- a gyakori **online csatornák** erősségeit és gyengeségeit,
- a **médiagazdagság-elméletet**,
- hogyan válassz csatornát egy adott **üzenethez**.

## A gyakori csatornák

| Csatorna                                      | Erősség                                     | Gyengeség                                       |
| --------------------------------------------- | ------------------------------------------- | ----------------------------------------------- |
| **videóhívás**                                | arc, hangsúly, gyors visszacsatolás         | időpont kell, fárasztó, nincs automatikus nyoma |
| **telefon / hanghívás**                       | hangsúly, gyors                             | nincs vizuális jel, nincs nyoma                 |
| **chat** (Slack, Teams, Discord)              | gyors, kötetlen, csoportos                  | megszakít, elvész a régi üzenetek között        |
| **e-mail**                                    | hivatalos, külső partnernek is, nyoma marad | lassú, hosszú szálak                            |
| **hibakövető / ticket** (Jira, GitHub Issues) | nyomon követhető feladat, felelős, állapot  | nem beszélgetésre való                          |
| **wiki / dokumentáció**                       | tartós tudás, kereshető                     | elavulhat, ha nem frissítik                     |

## Médiagazdagság-elmélet

Richard Daft és Robert Lengel elmélete szerint a csatornák „gazdagsága” eltér: mennyi jelet (hang, arc, gesztus) visznek át, és milyen gyors a visszacsatolás.

```text
gazdag ◄──────────────────────────────────────────► szegény
személyes   videóhívás   telefon   chat   e-mail   dokumentum
```

- **Összetett, kétértelmű, érzelmes** üzenethez (konfliktus, rossz hír, bonyolult tervezési kérdés) **gazdag** csatorna kell.
- **Egyszerű, egyértelmű** üzenethez (időpont, link, rövid állapot) a **szegényebb**, gyorsabb csatorna is elég – sőt hatékonyabb.

> Tipikus hiba: egy konfliktust e-mailben vagy chatben próbálunk megoldani. Az üzenetváltás egyre élesebb lesz, pedig egy 10 perces hívás megoldotta volna.

## Döntési segédlet

```text
Érzelmes vagy vitás a téma?          → igen → személyesen / videóhívás
Kell, hogy nyoma maradjon?           → igen → e-mail, ticket, wiki
Feladat, amelynek felelőse, határideje van? → ticket
Gyors, rövid kérdés a csapatnak?     → chat (nyilvános csatorna, szál)
Tudás, amelyre később is szükség lesz? → wiki / README
```

Gyakran **kombinálni** kell: egy videóhíváson megbeszélitek a döntést, utána e-mailben vagy a wikiben rögzítitek.

## Összefoglalás

- Minden csatornának megvan a maga erőssége: videó és telefon gyors és gazdag, az írásos csatornák nyomot hagynak.
- Médiagazdagság: összetett, érzelmes üzenethez gazdag csatorna, egyszerűhöz szegényebb is elég.
- A döntést rögzítsd írásban akkor is, ha szóban született.

## A lecke feladata

```quiz required
? Egy kollégával feszült vita alakult ki a chatben. Melyik a legjobb lépés?
- még hosszabb chatüzenetet írsz
+ javasolsz egy rövid videóhívást vagy személyes beszélgetést
- e-mailt írsz, másolatban az egész csapatnak
- nem válaszolsz többet
! Érzelmes, vitás témához gazdag csatorna kell.

? A médiagazdagság-elmélet szerint melyik a **leggazdagabb** csatorna?
+ személyes beszélgetés
- e-mail
- chat
- írott dokumentum
! A legtöbb jel és a leggyorsabb visszacsatolás.

? Egy hibát kell jelezni, amelynek lesz felelőse és határideje. Hova kerüljön?
- egy privát chatüzenetbe
+ a hibakövetőbe (ticket)
- egy telefonhívásba
- egy közösségi média bejegyzésbe
! Nyomon követhető feladat, felelős, állapot.

? Egy videóhíváson döntöttetek a tárhelyről. Mit érdemes utána tenni?
- semmit, mindenki emlékszik
+ írásban rögzíteni a döntést (e-mail, wiki, jegyzet)
- új hívást szervezni ugyanerről
- a döntést titokban tartani
! Szóban született döntést is rögzíts.
```
