---
title: Csoportos döntéshozatal és csapdái
summary: Csoportgondolkodás, társas lógás, a kommunikációs csatornák száma és Brooks törvénye, valamint jó csoportos döntési technikák: ötletroham, csendes ötletelés, Delphi-módszer, ördögügyvéd.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- a **csoportgondolkodás** jeleit,
- mi a **társas lógás**,
- hogyan nő a csapat méretével a **kommunikációs csatornák száma**,
- jó **csoportos döntési technikákat**.

## Csoportgondolkodás (groupthink)

Irving Janis pszichológus írta le: egy összetartó csoport annyira törekszik az **egyetértésre**, hogy elnyomja a kritikus gondolatokat, és rossz döntést hoz.

Jelei:

- a csoport **sérthetetlennek** hiszi magát („nálunk ilyen hiba nem fordulhat elő”),
- a kétkedőket **nyomás** éri, vagy maguktól hallgatnak el (öncenzúra),
- az **egyhangúság illúziója**: a csend beleegyezésnek számít,
- a külső véleményeket lekezelik.

Ellenszer:

- a vezető **utoljára** mondja el a véleményét,
- legyen kijelölt **ördögügyvéd**, aki szándékosan az ellenérveket keresi,
- kérjetek **külső** véleményt,
- egy döntés előtt tartsatok egy „**pre-mortem**”-et: „Képzeljük el, hogy fél év múlva a projekt megbukott. Mi okozta?”

## Társas lógás (social loafing)

A Ringelmann-hatás néven is ismert jelenség: **csoportban** az emberek gyakran **kevesebb erőfeszítést** tesznek, mint egyedül, mert az egyéni hozzájárulás kevésbé látható.

Ellenszer:

- **egyéni, látható felelősségek** (ki mit vállalt, egy közös táblán),
- kisebb csapatok,
- az egyéni hozzájárulás elismerése.

## A kommunikációs csatornák száma

Egy $n$ fős csapatban minden tag páronként kommunikálhat a többiekkel. A lehetséges kétszemélyes csatornák száma:

$$
C = \frac{n(n-1)}{2}
$$

```plot
title: Kommunikációs csatornák száma a csapatméret függvényében
x: 0, 16
y: 0, 120
param: k = 5, 2, 15, 1
f: x*(x - 1)/2 # csatornák száma
point: k, k*(k - 1)/2 # a te csapatod
value: csatornák száma k fős csapatban = k*(k - 1)/2
```

Állítsd a csúszkát: 5 főnél 10 csatorna van, 10 főnél már 45, 15 főnél 105. A csatornák száma **négyzetesen** nő.

Ebből következik **Brooks törvénye** (Fred Brooks: _The Mythical Man-Month_): „Egy késésben lévő szoftverprojekthez új embereket adni csak tovább késlelteti.” Az újakat be kell tanítani, és megnő a kommunikációs teher.

> Ezért szeretik a szoftvercégek a kis csapatokat (pl. az Amazon „két pizza” szabálya: egy csapat ne legyen nagyobb annál, amit két pizza jól tart).

## Jó csoportos döntési technikák

| Technika                             | Lényege                                                                                | Mikor jó?                           |
| ------------------------------------ | -------------------------------------------------------------------------------------- | ----------------------------------- |
| **ötletroham** (brainstorming)       | sok ötlet, kritika nélkül, utána szűrés                                                | új megoldások gyűjtése              |
| **csendes ötletelés** (brainwriting) | mindenki előbb egyedül, írásban gyűjt ötleteket, aztán közös megbeszélés               | ha vannak domináns és csendes tagok |
| **szavazás pontokkal** (dot voting)  | mindenki néhány ponttal szavaz a kedvenc ötleteire                                     | sok ötlet gyors rangsorolása        |
| **Delphi-módszer**                   | szakértők névtelenül, több körben adnak becslést, a körök között látják az összesítést | becslések, előrejelzések            |
| **planning poker**                   | a csapat egyszerre mutatja fel a feladat becsült méretét, az eltéréseket megbeszélik   | agilis feladatbecslés               |
| **ördögügyvéd**                      | egy tag szándékosan az ellenérveket keresi                                             | csoportgondolkodás ellen            |

## Összefoglalás

- Csoportgondolkodás: az egyetértés vágya elnyomja a kritikát – ellenszer: ördögügyvéd, külső vélemény, pre-mortem.
- Társas lógás: csoportban kevesebb erőfeszítés – ellenszer: látható egyéni felelősség.
- Csatornák száma: $n(n-1)/2$ – négyzetesen nő; Brooks törvénye.
- Technikák: ötletroham, csendes ötletelés, pontozásos szavazás, Delphi, planning poker.

## A lecke feladata

```quiz required
? Egy csapatmegbeszélésen senki nem mond ellent a vezető tervének, pedig többen kételkednek benne. Mi ez?
- társas lógás
+ csoportgondolkodás
- Brooks törvénye
- Delphi-módszer
! Az egyetértés vágya elnyomja a kritikát.

? Hány kétszemélyes kommunikációs csatorna van egy 8 fős csapatban?
= 28
! 8 · 7 / 2 = 28.

? Mit mond Brooks törvénye?
- minél nagyobb a csapat, annál gyorsabb a fejlesztés
+ egy késésben lévő szoftverprojekthez új embereket adni csak tovább késlelteti
- minden projekt késik
- a kis csapatok mindig lassabbak
! Betanítás + nagyobb kommunikációs teher.

? Egy csapatban két hangos tag uralja az ötletelést, a többiek hallgatnak. Melyik technika segít leginkább?
- több ötletroham ugyanígy
+ csendes ötletelés (mindenki előbb egyedül, írásban gyűjt)
- a vezető egyedül dönt
- szavazás kézfeltartással, a hangosak után
! Mindenki ötlete egyenlő eséllyel kerül elő.
```
