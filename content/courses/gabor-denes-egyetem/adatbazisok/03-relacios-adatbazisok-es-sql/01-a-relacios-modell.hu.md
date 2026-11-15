---
title: A relációs modell
summary: Reláció, sor, attribútum, tartomány, fokszám és számosság; a kulcsok fajtái (szuperkulcs, jelöltkulcs, elsődleges, alternatív és idegen kulcs) és Codd legfontosabb szabályai.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- a relációs modell **fogalmait** és „hivatalos” nevüket,
- a **kulcsok** fajtáit, és hogyan választasz elsődleges kulcsot,
- hogyan kapcsolja össze a táblákat az **idegen kulcs**.

## Reláció = tábla (majdnem)

A relációs modellben minden adat **relációkban** van. A gyakorlatban a reláció egy **tábla**, de matematikailag egy halmaz, ezért van néhány szabálya:

```text
                 attribútumok (oszlopok) – fokszám = 4
             ┌────────┬───────────┬───────────┬───────┐
 hallgatok   │ neptun │ nev       │ szak      │ felev │  ← séma (fejléc)
             ├────────┼───────────┼───────────┼───────┤
             │ ABC123 │ Kiss Anna │ mérnökinf │   3   │  ← sor (rekord, n-es)
             │ BCD234 │ Nagy Béla │ mérnökinf │   1   │
             │ CDE345 │ Tóth Cili │ gazdinfo  │   3   │
             └────────┴───────────┴───────────┴───────┘
                     számosság = 3 (sorok száma)
```

| Hivatalos név               | Hétköznapi név | Jelentés                                                              |
| --------------------------- | -------------- | --------------------------------------------------------------------- |
| **reláció**                 | tábla          | azonos szerkezetű sorok halmaza                                       |
| **attribútum**              | oszlop, mező   | egy tulajdonság, névvel és tartománnyal                               |
| **n-es** (tuple)            | sor, rekord    | egy egyed adatai                                                      |
| **tartomány** (domain)      | típus          | az attribútum lehetséges értékei                                      |
| **fokszám** (degree)        | oszlopszám     | hány attribútuma van                                                  |
| **számosság** (cardinality) | sorszám        | hány sora van (ez folyamatosan változik)                              |
| **séma**                    | fejléc         | a reláció neve és attribútumai: `hallgatok(neptun, nev, szak, felev)` |

A reláció **szabályai**:

- minden cellában **egyetlen, oszthatatlan** érték van (nem lista!),
- nincs két **teljesen egyforma** sor,
- a sorok **sorrendje nem számít** (ha rendezett eredményt kérsz, azt külön meg kell mondani),
- az oszlopok sorrendje sem számít, mert névvel hivatkozunk rájuk.

## Kulcsok

A kulcsok a relációs modell legfontosabb eszközei: ezekkel azonosítunk és kapcsolunk össze.

- **Szuperkulcs**: olyan attribútumhalmaz, amely egyértelműen azonosít minden sort. Pl. `{neptun}`, de `{neptun, nev}` is (csak fölösleges benne a név).
- **Jelöltkulcs** (candidate key): **minimális** szuperkulcs – egyetlen attribútum sem hagyható el belőle. Egy hallgatónál jelöltkulcs lehet a `neptun` és az `adoazonosito` is.
- **Elsődleges kulcs** (primary key, PK): a jelöltkulcsok közül **kiválasztott** egy. Nem lehet NULL, nem ismétlődhet.
- **Alternatív kulcs**: a többi jelöltkulcs (ezekre `UNIQUE` megszorítást teszünk).
- **Összetett kulcs**: több attribútumból álló kulcs, pl. a `jelentkezesek` táblában `(neptun, kod)`.
- **Idegen kulcs** (foreign key, FK): egy attribútum, amely egy **másik** (vagy ugyanazon) tábla elsődleges kulcsára hivatkozik.

### Természetes vagy mesterséges kulcs?

- **Természetes kulcs**: a valóságból jön (Neptun-kód, ISBN, rendszám). Beszédes, de ha a valóság változik (új rendszám), gond van.
- **Mesterséges (helyettesítő) kulcs**: egy jelentés nélküli sorszám (`id SERIAL` vagy UUID). Sosem változik, ezért a gyakorlatban nagyon elterjedt.

## Az idegen kulcs összeköt

```text
 hallgatok                 jelentkezesek                 targyak
 ┌────────────┐           ┌──────────────┬───────────┐   ┌──────────┐
 │ neptun (PK)│◄──────────│ neptun (FK)  │ kod (FK)  │──►│ kod (PK) │
 │ nev        │           │ jegy         │           │   │ nev      │
 └────────────┘           └──────────────┴───────────┘   └──────────┘
```

A `jelentkezesek.neptun` csak olyan értéket vehet fel, amilyen Neptun-kód **létezik** a `hallgatok` táblában. Ezt hívjuk **hivatkozási integritásnak**: nem lehet „árva” jelentkezés egy nem létező hallgatóhoz.

## Codd szabályai röviden

E. F. Codd 1985-ben 12 (+1) szabályban foglalta össze, mitől igazán relációs egy rendszer. A legfontosabbak:

1. **Információs szabály**: minden adat táblák celláiban, értékként jelenik meg.
2. **Garantált elérés**: bármelyik érték elérhető a tábla neve + elsődleges kulcs + oszlopnév hármasával.
3. **NULL-ok egységes kezelése**: a hiányzó adatot a rendszer egységesen jelöli.
4. **Önleíró katalógus**: az adatbázis szerkezete is táblákban kérdezhető le (PostgreSQL-ben pl. `information_schema`).
5. **Átfogó nyelv**: egyetlen nyelv (ma: SQL) szolgál a szerkezet, az adat, a jogok és a tranzakciók kezelésére.

## Összefoglalás

- Reláció (tábla), attribútum (oszlop), n-es (sor), tartomány, fokszám (oszlopszám), számosság (sorszám).
- Szuperkulcs ⊇ jelöltkulcs (minimális) → ebből egy az elsődleges, a többi alternatív.
- Az idegen kulcs egy másik tábla elsődleges kulcsára hivatkozik (hivatkozási integritás).

## A lecke feladata

```quiz required
? Mi a **fokszáma** a `hallgatok(neptun, nev, szak, felev)` relációnak?
= 4
! Négy attribútuma van.

? Mi a hivatalos neve a tábla **sorainak számára**?
- fokszám
+ számosság
- tartomány
- séma
! A fokszám az oszlopok száma.

? A `{neptun, nev}` egyértelműen azonosítja a hallgatót, de a név elhagyható belőle. Mi ez?
+ szuperkulcs, de nem jelöltkulcs
- jelöltkulcs
- idegen kulcs
- elsődleges kulcs
! A jelöltkulcs minimális.

? A `jelentkezesek.kod` mező a `targyak.kod` elsődleges kulcsra hivatkozik. Milyen kulcs a `jelentkezesek.kod`?
= idegen kulcs
= foreign key
= FK
! Egy másik tábla elsődleges kulcsára mutat.

? Melyik állítás **igaz** a relációra?
- A sorok sorrendje meghatározott.
- Egy cellában lehet lista is.
+ Nem lehet két teljesen egyforma sora.
- Az oszlopokra sorszámmal hivatkozunk.
! A reláció halmaz: nincsenek ismétlődő elemei.
```
