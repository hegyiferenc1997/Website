---
title: Adatvédelem és GDPR
summary: Mi számít személyes adatnak, a GDPR alapelvei (célhoz kötöttség, adattakarékosság, korlátozott tárolhatóság), az érintettek jogai (hozzáférés, helyesbítés, törlés, hordozhatóság), az adatvédelmi incidens bejelentése, valamint az álnevesítés és az anonimizálás – SQL-ben kipróbálva.
minutes: 28
---

## Amit ebben a leckében megtanulsz

- mi számít **személyes adatnak**,
- melyek a **GDPR** legfontosabb **alapelvei** és az érintettek **jogai**,
- hogyan jelenik meg mindez az **adatbázis-tervezésben**,
- mi a különbség az **álnevesítés** és az **anonimizálás** között.

> Ez a lecke az adatbázis-fejlesztő szemszögéből mutatja be az adatvédelmet, közérthetően. Konkrét jogi kérdésben mindig adatvédelmi szakember (a cégnél: adatvédelmi tisztviselő) véleményét kell kérni.

## Mi a személyes adat?

A **GDPR** (az Európai Unió általános adatvédelmi rendelete, 2018 óta alkalmazandó) szerint személyes adat **minden olyan információ, amely alapján egy élő ember közvetlenül vagy közvetve azonosítható**.

- közvetlenül: név, e-mail-cím, telefonszám, személyi igazolványszám, fénykép,
- közvetve: Neptun-kód, IP-cím, sütiazonosító, helyadat, vagy több adat együtt (pl. születési dátum + irányítószám + nem – ez a hármas sok emberre egyedi!).

Vannak **különleges** kategóriák is, amelyekre még szigorúbb szabályok vonatkoznak: egészségügyi adat, biometrikus adat, vallási vagy politikai meggyőződés, szexuális irányultság stb.

## A GDPR alapelvei – fejlesztői szemmel

| Alapelv                       | Jelentése                                                        | Mit jelent az adatbázisban?                                    |
| ----------------------------- | ---------------------------------------------------------------- | -------------------------------------------------------------- |
| **Jogszerűség, átláthatóság** | kell jogalap (pl. szerződés, hozzájárulás), és tájékoztatni kell | a hozzájárulást (mikor, mire) is tárolni kell                  |
| **Célhoz kötöttség**          | csak a megadott célra használható                                | ne használd a szállítási címet reklámra, ha arra nincs jogalap |
| **Adattakarékosság**          | csak a feltétlenül szükséges adatot gyűjtsd                      | nincs „hátha jó lesz” oszlop (pl. anyja neve egy webshopban)   |
| **Pontosság**                 | az adat legyen pontos és naprakész                               | legyen mód a javításra                                         |
| **Korlátozott tárolhatóság**  | csak addig tárold, ameddig szükséges                             | megőrzési idők, automatikus törlés vagy anonimizálás           |
| **Integritás, bizalmasság**   | megfelelő biztonság                                              | jogosultságok, titkosítás, naplózás (10., 15. témakör)         |
| **Elszámoltathatóság**        | igazolni kell tudni, hogy betartod                               | dokumentáció, napló arról, ki mit látott vagy módosított       |

A GDPR kifejezetten elvárja a **beépített és alapértelmezett adatvédelmet** (_privacy by design and by default_): már a tervezésnél kell gondolni rá, nem utólag ráragasztani.

## Az érintettek jogai

Az embereknek (az „érintetteknek”) jogaik vannak az adataikkal kapcsolatban. A rendszert úgy kell megtervezni, hogy ezeket teljesíteni lehessen:

| Jog                         | Mit kérhet az érintett?                            | Mit jelent technikailag?                                                       |
| --------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------ |
| **Hozzáférés**              | „Milyen adatot tárolnak rólam?”                    | minden táblából össze kell tudni gyűjteni egy ember adatait                    |
| **Helyesbítés**             | „Javítsák ki a címemet.”                           | módosítható adat, egy helyen (normalizálás!)                                   |
| **Törlés** („elfeledtetés”) | „Töröljék az adataimat.”                           | törlés vagy anonimizálás minden táblában – a mentésekben is számolni kell vele |
| **Adathordozhatóság**       | „Adják ki az adataimat géppel olvasható formában.” | exportálás pl. JSON vagy CSV formában                                          |
| **Tiltakozás, korlátozás**  | „Ne használják az adataimat marketingre.”          | jelzők (pl. `marketing_hozzajarulas`) és ezek betartása                        |

Ha egy ember adatai húsz táblában, ötféle azonosítóval szétszórva vannak, ezek teljesítése rémálom. A jó adatmodell itt is sokat segít.

## Adatvédelmi incidens

Ha személyes adat illetéktelen kezekbe kerül (pl. kiszivárog egy adatbázis), az **adatvédelmi incidens**. A GDPR szerint ezt főszabályként **72 órán belül** be kell jelenteni a felügyeleti hatóságnak (Magyarországon a NAIH-nak), és ha nagy a kockázat, az érintetteket is értesíteni kell. Ezért fontos a **naplózás**: enélkül ki sem derül, mi szivárgott ki.

## Álnevesítés és anonimizálás

Az elemzésekhez (pl. „melyik szakon hányadik félévben esnek ki a legtöbben?”) gyakran nincs szükség arra, hogy **ki** az adott ember.

- **Álnevesítés** (_pszeudonimizálás_): az azonosítót egy álazonosítóra cseréljük, és a kettő közti kapcsolatot **külön, védetten** tároljuk. Ez **még személyes adat** (a kapcsolat visszaállítható), de sokkal kisebb a kockázat.
- **Anonimizálás**: az adatot úgy alakítjuk át, hogy az ember **semmilyen ésszerű módon** ne legyen azonosítható többé. A valóban anonim adatra a GDPR már nem vonatkozik – de az igazi anonimizálás nehezebb, mint gondolnád!

Gyakori technikák:

| Technika          | Példa                                                                |
| ----------------- | -------------------------------------------------------------------- |
| **Elhagyás**      | a név és a Neptun-kód kimarad                                        |
| **Általánosítás** | születési dátum helyett csak az év; pontos cím helyett csak a megye  |
| **Maszkolás**     | `kiss.anna@pelda.hu` → `k***@pelda.hu`                               |
| **Összesítés**    | egyéni sorok helyett csak csoportátlagok, kis csoportok elrejtésével |

<details>
<summary>A mintaadatbázis létrehozása (SQL)</summary>

<!-- sql-setup: egyetem -->

</details>

Maszkolás és általánosítás SQL-ben:

```sql run
SELECT LEFT(nev, 1) || '***' AS nev_maszkolva,
       szak,
       EXTRACT(YEAR FROM szuletett) AS szuletesi_ev,
       varos
FROM hallgatok
ORDER BY szak, nev;
```

Vigyázat: a kis csoportok **visszaazonosíthatók**! Ha egy szakon csak egyetlen 2004-ben született, budapesti hallgató van, akkor a „névtelen” sora is elárulja, ki ő. Ezért az összesítéseknél a túl kicsi csoportokat el szokták rejteni:

```sql run
SELECT szak, felev, COUNT(*) AS letszam
FROM hallgatok
GROUP BY szak, felev
HAVING COUNT(*) >= 2          -- az 1 fős csoportok nem jelennek meg
ORDER BY szak, felev;
```

## Összefoglalás

- Személyes adat: minden, ami alapján egy élő ember azonosítható – közvetve is.
- Alapelvek: célhoz kötöttség, adattakarékosság, pontosság, korlátozott tárolhatóság, biztonság, elszámoltathatóság; beépített adatvédelem.
- Jogok: hozzáférés, helyesbítés, törlés, hordozhatóság, tiltakozás – a jó adatmodell segít teljesíteni őket.
- Incidens: főszabályként 72 órán belül bejelentendő.
- Álnevesítés (még személyes adat) vs. anonimizálás (már nem az); vigyázz a kis csoportokra.

## A lecke feladata

Az elemzőcsapat egy `hallgatok_anonim` nevű **nézetet** kér. A kiinduló kód most minden oszlopot átad – ez sérti az **adattakarékosság** elvét. Írd át úgy, hogy a nézetben **csak** ez a három oszlop legyen, ebben a sorrendben:

1. `szak`,
2. `felev`,
3. `szuletesi_ev` – a születési dátumból **csak az év** (`EXTRACT(YEAR FROM szuletett)`).

A név, a Neptun-kód, a város és a pontos születési dátum **ne** szerepeljen benne.

```sql starter required
CREATE VIEW hallgatok_anonim AS
  SELECT * FROM hallgatok;
```

<details>
<summary>Megoldás</summary>

```sql solution
CREATE VIEW hallgatok_anonim AS
  SELECT szak,
         felev,
         EXTRACT(YEAR FROM szuletett) AS szuletesi_ev
  FROM hallgatok;
```

</details>

```sql test
SELECT * FROM hallgatok_anonim ORDER BY 1, 2, 3;
```
