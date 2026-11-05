---
title: Szakmai portfólió és GitHub-profil
summary: Miért többet mond egy jó projekt egy jegyzetnél, mitől lesz jó egy portfólióprojekt, hogyan néz ki egy rendezett GitHub-profil, és hogyan mutasd be a projektjeidet.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- miért fontos a **portfólió** egy mérnökinformatikusnak,
- mitől lesz jó egy **portfólióprojekt**,
- hogyan tedd rendbe a **GitHub-profilodat**,
- hogyan **mutasd be** egy projektedet.

## Mutasd, ne mondd

Az önéletrajzban bárki leírhatja, hogy „ismerem a Pythont”. Egy **működő projekt** megmutatja, hogy tényleg tudsz vele valamit **létrehozni** – és azt is, hogyan gondolkodsz.

## Mitől jó egy portfólióprojekt?

- **Valós problémát** old meg (akár a sajátodat: órarend, kiadáskövető, edzésnapló).
- **Befejezett** és **működik** – inkább egy kész, kicsi projekt, mint öt félbehagyott.
- **Kipróbálható**: van élő demó, képernyőkép vagy rövid videó.
- **Olvasható a kód**: értelmes nevek, kommentek, következetes stílus.
- Vannak **tesztjei**, és egyszerűen **elindítható** (README!).
- Látszik rajta a **fejlődés**: értelmes commit-üzenetek, nem egyetlen „final” commit.

> Csapatban készült projektnél írd le pontosan, **mi volt a te részed**. A tisztesség a márkád része.

## A rendezett GitHub-profil

| Elem                         | Tipp                                                                                                                                 |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| **profilkép és név**         | ugyanaz, mint a LinkedInen                                                                                                           |
| **rövid bemutatkozás (bio)** | egy mondat: ki vagy, mi érdekel                                                                                                      |
| **profil-README**            | egy `felhasznalonev/felhasznalonev` nevű repó README-je megjelenik a profilodon: rövid bemutatkozás, technológiák, kiemelt projektek |
| **kitűzött repók** (pinned)  | a 4–6 legjobb projekted legyen elöl                                                                                                  |
| **minden repóban README**    | mit csinál, hogyan kell elindítani, képernyőkép                                                                                      |
| **licenc**                   | nyílt forráskódnál adj meg licencet (pl. MIT)                                                                                        |

Vigyázz:

- **Ne tölts fel titkot** (jelszó, API-kulcs, `.env` fájl) – használj `.gitignore`-t. Ha mégis felkerült, a kulcsot azonnal cseréld le, mert a Git-történetben megmarad.
- Egyetemi beadandót csak akkor tegyél nyilvánossá, ha a szabályok megengedik, és nem segít másoknak a másolásban.

## Egy jó commit-üzenet

```text
Rossz:  "javítás", "asdf", "final2"
Jó:     "Lapozás hozzáadása a termékkereső API-hoz"
        "Hibás dátumformátum javítása az exportban (#42)"
```

A commit-történet is kommunikáció: egy toborzó vagy egy csapattárs ebből látja, hogyan dolgozol.

## A projekt bemutatása

Akár interjún, akár egy README-ben mutatod be a projektedet, a **STAR**-szerkezet (lásd 4. témakör) itt is működik:

```text
Helyzet:  A kollégiumban mindenki papíron vezette a mosógép-foglalást.
Feladat:  Egyszerű online foglalórendszert akartam készíteni.
Tevékenység: Flask-backend, SQLite, egyszerű webes felület; 15 felhasználóval teszteltem.
Eredmény: 3 hónapja használja az emelet, a dupla foglalások megszűntek.
```

Készülj fel a kérdésekre: **Miért** ezt a technológiát választottad? Mi volt a **legnehezebb**? Mit csinálnál **másképp**?

## Személyes weboldal

Egy egyszerű személyes oldal (pl. GitHub Pages-en, ingyenesen) összefoghatja a projektjeidet, az önéletrajzodat és az elérhetőségeidet. Nem kötelező, de egy webfejlesztés iránt érdeklődő hallgatónak maga az oldal is portfólióelem.

## Összefoglalás

- Egy működő projekt többet mond minden állításnál.
- Jó portfólióprojekt: valós probléma, befejezett, kipróbálható, olvasható kód, README, tesztek.
- GitHub: profil-README, kitűzött repók, minden repóban README, titkok soha.
- A projektet STAR-szerkezettel mutasd be, és készülj a „miért?” kérdésekre.

## A lecke feladata

```quiz required
? Melyik a jobb portfólió?
- öt félbehagyott, README nélküli projekt
+ egy kisebb, befejezett, működő projekt jó README-vel
- egy üres GitHub-profil
- egyetlen fájl „final_vegleges2.py” néven
! Inkább kevés, de kész és bemutatható.

? Véletlenül feltöltöttél egy API-kulcsot egy nyilvános repóba. Mi a legfontosabb teendő?
- törlöd a fájlt egy új commitban, és kész
+ azonnal lecseréled (érvényteleníted) a kulcsot, mert a Git-történetben megmarad
- semmi, senki nem fogja észrevenni
- átnevezed a fájlt
! A régi commitokban a kulcs továbbra is olvasható.

? Melyik a jó commit-üzenet?
- „javítás”
- „asdf”
+ „Lapozás hozzáadása a termékkereső API-hoz”
- „final2”
! Rövid, konkrét, leírja, mit változtat.

? Mit érdemes leírni egy csapatban készült projektről a portfóliódban?
- hogy az egészet egyedül csináltad
+ pontosan, hogy mi volt a te részed
- semmit, csak a linket
- a csapattársak hibáit
! A tisztesség a márkád része.
```
