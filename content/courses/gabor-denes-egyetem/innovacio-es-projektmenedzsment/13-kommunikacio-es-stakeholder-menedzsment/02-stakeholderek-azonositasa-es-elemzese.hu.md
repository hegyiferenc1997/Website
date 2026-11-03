---
title: Az érintettek azonosítása és elemzése
summary: Kik a projekt érintettjei (stakeholderek), hogyan gyűjtsd össze őket, mit tartalmaz az érintettnyilvántartás, és hogyan rangsorold őket a hatalom–érdek mátrixszal és a kiemelkedési modellel.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- ki számít **érintettnek** (stakeholdernek),
- hogyan **azonosítsd** az érintetteket,
- mit tartalmaz az **érintettnyilvántartás**,
- hogyan **elemezd** őket (hatalom–érdek mátrix, kiemelkedési modell).

## Ki az érintett?

**Érintett** (_stakeholder_) minden egyén, csoport vagy szervezet, amely **hatással van** a projektre, vagy amelyre a projekt **hatással van** (vagy úgy érzi, hogy hatással van). Lehetnek

- **belsők**: szponzor, vezetés, projektcsapat, más osztályok, üzemeltetés,
- **külsők**: megrendelő, felhasználók, beszállítók, hatóságok, szakszervezet, a média, a helyi közösség,
- **támogatók** és **ellenzők** is.

> Egy egyetemi tanulmányi rendszer bevezetésénél érintett pl. a rektor (szponzor), a tanulmányi osztály, az oktatók, a hallgatók, a hallgatói önkormányzat, az informatikai osztály, a szoftverszállító és az adatvédelmi tisztviselő.

## Az érintettek azonosítása

- **ötletroham** a csapattal: „kit érint a változás, és ki tud hatni rá?”,
- a projekt alapító okirat, a szerződések és a **szervezeti ábra** átnézése,
- **interjúk**: „Kivel kellene még beszélnem?” (hógolyó-módszer),
- korábbi hasonló projektek **tanulságai**.

Az azonosítás **nem egyszeri**: a projekt során új érintettek jelenhetnek meg, mások kieshetnek.

## Az érintettnyilvántartás

A **stakeholder-nyilvántartás** (_stakeholder register_) minden érintettről rögzíti:

| Mező                   | Példa                                         |
| ---------------------- | --------------------------------------------- |
| név, szervezet, szerep | dr. Kovács Anna, tanulmányi osztály vezetője  |
| elvárások, érdekek     | kevesebb adminisztráció, hibátlan adatátvétel |
| befolyás (hatalom)     | magas – jóváhagyja a folyamatokat             |
| érdeklődés             | magas                                         |
| jelenlegi hozzáállás   | semleges, kicsit aggódik                      |
| kommunikációs igény    | heti rövid egyeztetés                         |

> A nyilvántartás **érzékeny** információt tartalmazhat (pl. „ellenzi a projektet”) – kezeljük bizalmasan.

## Hatalom–érdek mátrix (Mendelow)

A legelterjedtebb elemzés két tengelyen helyezi el az érintetteket: mekkora a **hatalmuk** (befolyásuk) és mekkora az **érdeklődésük** a projekt iránt.

```text
 hatalom ▲
   nagy  │ ┌──────────────────────┬──────────────────────┐
         │ │  ELÉGEDETTEN TARTANI │  SZOROSAN KEZELNI    │
         │ │  (keep satisfied)    │  (manage closely)    │
         │ │  pl. pénzügyi igazgató│  pl. szponzor        │
         │ ├──────────────────────┼──────────────────────┤
         │ │  FIGYELNI            │  TÁJÉKOZTATNI        │
         │ │  (monitor)           │  (keep informed)     │
  kicsi  │ │  pl. távoli osztályok│  pl. felhasználók    │
         │ └──────────────────────┴──────────────────────┘
         └─────────────────────────────────────────────────▶ érdeklődés
            kicsi                                     nagy
```

- **Nagy hatalom, nagy érdeklődés** → **szorosan kezelni**: bevonni a döntésekbe, rendszeresen egyeztetni.
- **Nagy hatalom, kis érdeklődés** → **elégedetten tartani**: röviden, a lényegről tájékoztatni, nem terhelni.
- **Kis hatalom, nagy érdeklődés** → **tájékoztatni**: rendszeres hírek, visszajelzési lehetőség.
- **Kis hatalom, kis érdeklődés** → **figyelni**: minimális ráfordítás, de figyeljük, változik-e a helyzetük.

## Kiemelkedési modell (salience)

**Mitchell, Agle és Wood** (1997) modellje három jellemzőt vizsgál:

- **hatalom** – képes-e akaratát érvényesíteni,
- **legitimitás** – jogos-e az igénye,
- **sürgősség** – mennyire azonnali a figyelemigénye.

Akinél **mindhárom** megvan, az a **meghatározó** (_definitive_) érintett – a legnagyobb figyelmet kapja. Pl. egy hatóság, amely jogszabály alapján (legitim), azonnali határidővel (sürgős) leállíthatja a projektet (hatalom).

## Összefoglalás

- Érintett: bárki, aki hat a projektre, vagy akire a projekt hat; lehet belső, külső, támogató, ellenző.
- Azonosítás: ötletroham, dokumentumok, interjúk – folyamatosan.
- Érintettnyilvántartás: szerep, elvárások, befolyás, érdeklődés, hozzáállás, kommunikációs igény.
- Hatalom–érdek mátrix: szorosan kezelni, elégedetten tartani, tájékoztatni, figyelni.
- Kiemelkedési modell: hatalom, legitimitás, sürgősség; mindhárom = meghatározó érintett.

## A lecke feladata

```quiz required
? A hatalom–érdek mátrix szerint mit teszünk egy **nagy hatalmú és nagy érdeklődésű** érintettel?
+ szorosan kezeljük (bevonjuk a döntésekbe)
- csak figyeljük
- tájékoztatjuk
- elégedetten tartjuk, de nem terheljük
! Manage closely.

? A felhasználók nagyon érdeklődnek, de kevés a döntési hatalmuk. Melyik stratégia illik hozzájuk?
- szorosan kezelni
- elégedetten tartani
+ tájékoztatni
- figyelni
! Keep informed: rendszeres hírek, visszajelzési lehetőség.

? Melyik **nem** érintett egy egyetemi tanulmányi rendszer bevezetésénél?
- a hallgatók
- az oktatók
- a szoftverszállító
+ egy másik ország labdarúgó-válogatottja
! Az érintett hat a projektre, vagy a projekt hat rá.

? A kiemelkedési modellben melyik három jellemzőt vizsgáljuk?
+ hatalom, legitimitás, sürgősség
- idő, költség, terjedelem
- erősségek, gyengeségek, lehetőségek
- tervezés, végrehajtás, ellenőrzés
! Mitchell, Agle és Wood (1997).

? Miért kell az érintettek azonosítását a projekt során **folyamatosan** ismételni?
- mert a szabvány előírja, hogy naponta frissítsük
+ mert új érintettek jelenhetnek meg, és a régiek hozzáállása, befolyása változhat
- mert a nyilvántartás minden héten elvész
- nem kell ismételni, elég egyszer az elején
! A projekt környezete változik.
```
