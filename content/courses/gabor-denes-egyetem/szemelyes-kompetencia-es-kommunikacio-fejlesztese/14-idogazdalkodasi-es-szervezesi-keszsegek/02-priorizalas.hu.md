---
title: Rangsorolás
summary: Az Eisenhower-mátrix (sürgős–fontos), a Pareto-elv (80/20), az ABC-módszer, és egy kis Python-program, amely besorolja a teendőidet.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- az **Eisenhower-mátrixot**,
- a **Pareto-elvet** (80/20),
- az **ABC-módszert**,
- hogyan **mondj nemet** a nem fontos dolgokra.

## Sürgős vagy fontos?

Dwight D. Eisenhower amerikai elnöknek tulajdonítják: „Ami fontos, ritkán sürgős, és ami sürgős, ritkán fontos.”

- **Sürgős**: azonnali figyelmet követel (csörög, villog, határidő ma).
- **Fontos**: hozzájárul a hosszú távú céljaidhoz.

## Az Eisenhower-mátrix

```text
                  SÜRGŐS                     NEM SÜRGŐS
           ┌──────────────────────┬──────────────────────┐
  FONTOS   │ 1. CSINÁLD MEG MOST  │ 2. ÜTEMEZD BE        │
           │ holnapi vizsga,      │ rendszeres tanulás,  │
           │ éles hiba            │ portfólióprojekt,    │
           │                      │ sport, alvás         │
           ├──────────────────────┼──────────────────────┤
  NEM      │ 3. DELEGÁLD / RÖVIDÍTSD │ 4. HAGYD EL       │
  FONTOS   │ sok értesítés, egyes │ céltalan görgetés,   │
           │ megbeszélések        │ felesleges sorozat   │
           └──────────────────────┴──────────────────────┘
```

A **2. negyed** a legfontosabb: ha ide elég időt szánsz (rendszeres tanulás, egészség, kapcsolatok, fejlődés), kevesebb dolog csúszik át az 1. negyedbe tűzoltásnak.

## Próbáld ki: egy kis besoroló program

```python run
# Teendők besorolása az Eisenhower-mátrix negyedeibe.
teendok = [
    ("holnapi beadandó leadása", True, True),
    ("portfólióprojekt folytatása", False, True),
    ("értesítések átnézése a csoportchatben", True, False),
    ("videók nézegetése", False, False),
    ("heti edzés", False, True),
]

negyedek = {
    (True, True): "1. Csináld meg most",
    (False, True): "2. Ütemezd be",
    (True, False): "3. Delegáld / rövidítsd",
    (False, False): "4. Hagyd el",
}

for nev, surgos, fontos in teendok:
    print(f"{negyedek[(surgos, fontos)]:<25} {nev}")
```

Írd át a listát a saját heti teendőidre!

## A Pareto-elv (80/20)

Vilfredo Pareto olasz közgazdász megfigyeléséből ered: sok helyzetben az **eredmények kb. 80%-a a ráfordítások kb. 20%-ából** származik. Ez nem pontos természeti törvény, hanem gyakori minta.

- A hibák nagy része a kód kis részében van.
- A felhasználók főleg a funkciók kis részét használják.
- A vizsgaanyag néhány alapfogalma a feladatok nagy részéhez kell.

Kérdezd meg: **melyik az a 20%**, amely a legtöbb eredményt hozza?

## Az ABC-módszer

Egyszerű napi rangsorolás:

- **A** – nagyon fontos, ma meg kell csinálni (komoly következménye van, ha nem),
- **B** – fontos, de várhat,
- **C** – jó lenne, de nincs komoly következménye, ha elmarad.

Az A-feladatokat is számozd (A1, A2…), és **A1-gyel kezdj** – ne a könnyű C-kkel, csak mert jólesik kipipálni őket.

## Nemet mondani

Minden „igen” egy másik dolognak „nem”. Ha egy új kérés jön, kérdezd meg:

- Hova esik az Eisenhower-mátrixban?
- Mit hagyok el helyette?
- Ha nem fér bele, mondj **asszertív nemet** (lásd 3. témakör), vagy ajánlj más időpontot.

## Összefoglalás

- Eisenhower: 1. csináld meg, 2. ütemezd be, 3. delegáld, 4. hagyd el – a 2. negyed a legfontosabb.
- Pareto: az eredmények nagy része a ráfordítások kis részéből jön.
- ABC: A1-gyel kezdj, ne a könnyű feladatokkal.
- Minden „igen” egy „nem” valami másra.

## A lecke feladata

```quiz required
? Az Eisenhower-mátrix melyik negyedébe tartozik a rendszeres, heti tanulás egy két hónap múlva esedékes vizsgára?
- 1. sürgős és fontos
+ 2. nem sürgős, de fontos
- 3. sürgős, de nem fontos
- 4. se nem sürgős, se nem fontos
! Fontos, de még nem sürget – ütemezd be.

? Mit érdemes tenni a 4. negyed (se nem sürgős, se nem fontos) teendőivel?
- azonnal megcsinálni
- beütemezni
+ elhagyni vagy minimálisra csökkenteni
- delegálni a vezetőnek
! Pl. céltalan görgetés.

? Egy alkalmazás 50 funkciójából a felhasználói idő nagy része 10 funkcióra esik. Melyik elvet illusztrálja?
- Parkinson-törvény
+ Pareto-elv
- SMART
- Eisenhower-elv
! Kb. 80/20 arány.

? Az ABC-módszerben mivel kezdd a napot?
- a legkönnyebb C-feladattal
- a legérdekesebb B-feladattal
+ az A1-gyel, a legfontosabb feladattal
- az e-mailek átnézésével
! A legfontosabbal, nem a legkönnyebbel.
```
