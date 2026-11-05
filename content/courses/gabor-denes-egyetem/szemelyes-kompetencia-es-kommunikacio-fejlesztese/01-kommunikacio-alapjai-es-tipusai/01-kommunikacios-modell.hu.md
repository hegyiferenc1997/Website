---
title: A kommunikációs modell
summary: Mi történik, amikor üzenetet küldünk? Adó, vevő, kódolás, csatorna, zaj és visszacsatolás egy fejlesztőcsapat hétköznapi példáin.
minutes: 15
---

## Amit ebben a leckében megtanulsz

- mit jelent a **kommunikáció**,
- melyek a kommunikációs folyamat **elemei**,
- mi a **zaj**, és milyen fajtái vannak,
- miért nélkülözhetetlen a **visszacsatolás**.

## Mi a kommunikáció?

A **kommunikáció** információ, gondolatok és érzések **átadása és megértése** két vagy több fél között. A hangsúly a _megértésen_ van: ha elküldtél egy e-mailt, de a címzett mást értett belőle, mint amit gondoltál, a kommunikáció nem sikerült.

> Mérnökként könnyű azt hinni, hogy elég „pontosan fogalmazni”. A gyakorlatban a projektek jelentős része nem technikai hiba, hanem félreértés miatt csúszik.

## A kommunikációs folyamat elemei

A klasszikus (Shannon–Weaver alapú) modell egy telefonvonalhoz hasonlítja a kommunikációt:

```text
  ADÓ ──kódolás──> ÜZENET ──csatorna──> dekódolás ──> VEVŐ
   ^                    ▲   ZAJ                          │
   └──────────────── visszacsatolás ─────────────────────┘
```

| Elem               | Jelentés                                       | Példa                                         |
| ------------------ | ---------------------------------------------- | --------------------------------------------- |
| **adó**            | aki az üzenetet küldi                          | a csapatvezető                                |
| **kódolás**        | a gondolat szavakká, jelekké alakítása         | megfogalmazza a feladatot                     |
| **üzenet**         | maga a tartalom                                | „Péntekig kell az új bejelentkezési oldal.”   |
| **csatorna**       | amin keresztül az üzenet halad                 | Slack, e-mail, személyes beszélgetés          |
| **dekódolás**      | a vevő értelmezi a jeleket                     | a fejlesztő megpróbálja megérteni             |
| **vevő**           | akinek az üzenet szól                          | a fejlesztő                                   |
| **zaj**            | minden, ami torzítja az üzenetet               | szakzsargon, rossz hangminőség, fáradtság     |
| **visszacsatolás** | a vevő reakciója, amiből az adó látja a hatást | „Úgy értsem, hogy a jelszó-visszaállítás is?” |

## A zaj fajtái

- **Fizikai zaj**: hangos környezet, akadozó videóhívás, rossz mikrofon.
- **Szemantikai zaj**: a szavak mást jelentenek a két félnek (pl. a „kész” a fejlesztőnek „lefordul”, a megrendelőnek „élesben megy”).
- **Pszichológiai zaj**: előítélet, stressz, fáradtság, érzelmek.
- **Fiziológiai zaj**: éhség, betegség, hallási nehézség.

> A szemantikai zaj a legalattomosabb, mert egyik fél sem veszi észre. Ezért érdemes közösen definiálni a fogalmakat (pl. a „Definition of Done” egy csapatban).

## Visszacsatolás

A **visszacsatolás** (feedback) zárja a kört: ebből derül ki, hogy a vevő azt értette-e, amit az adó szeretett volna. Visszacsatolás nélkül csak **egyirányú** információátadás történik.

Jó visszacsatolási technikák:

- **visszakérdezés**: „Jól értem, hogy…?”
- **összefoglalás** a beszélgetés végén,
- írásos **megerősítés** egy megbeszélés után (rövid e-mail a döntésekről).

## Összefoglalás

- A kommunikáció akkor sikeres, ha a vevő azt érti, amit az adó gondolt.
- Elemei: adó, kódolás, üzenet, csatorna, dekódolás, vevő, zaj, visszacsatolás.
- A zaj lehet fizikai, szemantikai, pszichológiai és fiziológiai.
- A visszacsatolás teszi a folyamatot kétirányúvá.

## A lecke feladata

```quiz required
? Mikor mondhatjuk, hogy egy kommunikáció **sikeres** volt?
- ha az adó elküldte az üzenetet
- ha az üzenet hibátlan helyesírással készült
+ ha a vevő azt értette, amit az adó gondolt
- ha a vevő azonnal válaszolt
! A kommunikáció lényege a megértés.

? A modellben mi a **csatorna**?
- az üzenet tartalma
+ az a közeg, amelyen az üzenet halad (pl. e-mail, chat, személyes beszélgetés)
- a vevő reakciója
- a gondolat szavakká alakítása
! Pl. Slack, telefon, videóhívás.

? A fejlesztőnek a „kész” azt jelenti, hogy „lefordul”, a megrendelőnek azt, hogy „élesben megy”. Milyen zajról van szó?
- fizikai
+ szemantikai
- fiziológiai
- technikai
! A szavak jelentése tér el.

? Melyik a **visszacsatolás** példája?
- a csapatvezető kiküld egy körlevelet
+ a fejlesztő visszakérdez: „Jól értem, hogy a jelszó-visszaállítás is kell?”
- a mikrofon recseg
- a csapatvezető megfogalmazza a feladatot
! A vevő reakciója, amelyből az adó látja a hatást.
```
