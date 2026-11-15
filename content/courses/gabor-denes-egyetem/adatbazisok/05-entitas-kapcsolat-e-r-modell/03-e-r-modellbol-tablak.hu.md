---
title: Az E-R modellből táblák
summary: Az átalakítás szabályai lépésről lépésre – egyedhalmaz, összetett, többértékű és származtatott tulajdonság, 1:1, 1:N és N:M kapcsolat, gyenge egyed és rekurzív kapcsolat –, kipróbálható SQL példákkal.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- hogyan lesz egy E-R diagramból **relációs séma** (táblák),
- melyik kapcsolattípusnál **hová kerül az idegen kulcs**,
- mikor kell **új tábla**.

## Az átalakítás szabályai

Az E-R diagram táblákká alakítása szinte **gépies** – ezért is szeretik. Hét szabály elég hozzá:

**1. Egyedhalmaz → tábla.** A tulajdonságokból oszlopok, a kulcsból elsődleges kulcs lesz.

**2. Összetett tulajdonság → a részei külön oszlopok.** `lakcím` helyett `irsz`, `varos`, `utca`.

**3. Származtatott tulajdonság → általában nem tároljuk.** Az életkort lekérdezéskor számoljuk ki a születési dátumból.

**4. Többértékű tulajdonság → külön tábla.** A tábla neve pl. `hallgato_telefonok(neptun, telefonszam)`, kulcsa a kettő együtt.

**5. 1 : N kapcsolat → idegen kulcs a „sok” oldalon.** Minden oktató sorába bekerül a `tanszek_id`. (Fordítva nem menne: a tanszék sorába nem írhatnánk be sok oktatót egy cellába.)

**6. N : M kapcsolat → új kapcsolótábla.** A két egyed kulcsa idegen kulcsként kerül bele, a kettő együtt az elsődleges kulcs, és ide kerülnek a kapcsolat tulajdonságai (pl. `jegy`). Pontosan így készült a mintaadatbázis `jelentkezesek` táblája.

**7. 1 : 1 kapcsolat → idegen kulcs bármelyik oldalon, `UNIQUE`-kal.** Célszerűen annál az egyednél, amelyik **kötelezően** részt vesz (így nem lesz sok NULL). Ha mindkét oldal kötelező, a két tábla akár össze is vonható.

Kiegészítések:

- **Gyenge egyed** → tábla, amelynek kulcsa a tulajdonos kulcsa + a részleges kulcs: `termek(epulet_id, teremszam, ferohely)`.
- **Rekurzív 1 : N kapcsolat** → idegen kulcs a **saját** táblára: `dolgozok(id, nev, fonok_id REFERENCES dolgozok(id))`.

## Egy teljes példa

E-R leírás: _Egy tanszéken sok oktató dolgozik (1:N, kötelező). Az oktatók tárgyakat tanítanak; egy tárgyat több oktató is taníthat, egy oktató több tárgyat (N:M), és tároljuk, hogy melyik félévben. Egy oktatónak több e-mail címe is lehet (többértékű)._

```text
 tanszekek(tanszek_id PK, nev)
 oktatok(oktato_id PK, nev, tanszek_id FK → tanszekek)            ← 5. szabály
 oktato_emailek(oktato_id FK → oktatok, email, PK(oktato_id, email)) ← 4. szabály
 targyak(kod PK, nev, kredit)
 tanit(oktato_id FK → oktatok, kod FK → targyak, felev,             ← 6. szabály
       PK(oktato_id, kod, felev))
```

```sql run
CREATE TABLE tanszekek (tanszek_id INT PRIMARY KEY, nev VARCHAR(60) NOT NULL);
CREATE TABLE oktatok (
  oktato_id  INT PRIMARY KEY,
  nev        VARCHAR(60) NOT NULL,
  tanszek_id INT NOT NULL REFERENCES tanszekek (tanszek_id)
);
CREATE TABLE oktato_emailek (
  oktato_id INT REFERENCES oktatok (oktato_id),
  email     VARCHAR(120),
  PRIMARY KEY (oktato_id, email)
);
CREATE TABLE targyak (kod VARCHAR(6) PRIMARY KEY, nev VARCHAR(60) NOT NULL, kredit INT NOT NULL);
CREATE TABLE tanit (
  oktato_id INT REFERENCES oktatok (oktato_id),
  kod       VARCHAR(6) REFERENCES targyak (kod),
  felev     VARCHAR(9),
  PRIMARY KEY (oktato_id, kod, felev)
);

INSERT INTO tanszekek VALUES (1, 'Informatika');
INSERT INTO oktatok VALUES (10, 'Dr. Példa Péter', 1);
INSERT INTO oktato_emailek VALUES (10, 'pelda@egyetem.hu'), (10, 'peter.pelda@gmail.com');
INSERT INTO targyak VALUES ('ADB', 'Adatbázisok', 5);
INSERT INTO tanit VALUES (10, 'ADB', '2026/27/1');

SELECT o.nev, e.email FROM oktatok o JOIN oktato_emailek e ON e.oktato_id = o.oktato_id;
```

## Gyakori hibák

- **Lista egy cellában** (`'pelda@egyetem.hu, peter@gmail.com'`): így nem lehet rá keresni, és nem lehet egyedi. Többértékű tulajdonság → külön tábla.
- **Idegen kulcs a rossz oldalon** egy 1 : N kapcsolatnál.
- **N : M kapcsolat kapcsolótábla nélkül** – nincs hova írni, ki melyik tárgyat vette fel.
- **Származtatott adat tárolása** (életkor, rendelés végösszege) frissítés nélkül – előbb-utóbb ellentmondásba kerül a forrásadattal.

## Összefoglalás

- Egyedhalmaz → tábla; összetett → részoszlopok; többértékű → külön tábla; származtatott → nem tároljuk.
- 1 : N → FK a „sok” oldalon; N : M → kapcsolótábla; 1 : 1 → FK `UNIQUE`-kal (a kötelező oldalon).
- Gyenge egyed → összetett kulcs a tulajdonos kulcsával; rekurzív → FK a saját táblára.

## A lecke feladata

```quiz required
? Egy 1 : N kapcsolatnál (egy ügyfél – sok rendelés) melyik táblába kerül az idegen kulcs?
- az ügyfelek táblájába
+ a rendelések táblájába
- egy új kapcsolótáblába
- mindkettőbe
! A „sok” oldalra: minden rendelés tudja, kié.

? Mi lesz egy N : M kapcsolatból?
- egy idegen kulcs az egyik táblában
+ egy új kapcsolótábla a két kulccsal
- egy többértékű tulajdonság
- semmi, nem kell tárolni
! Pl. jelentkezesek(neptun, kod, jegy).

? Egy E-R diagramon 4 egyedhalmaz, 2 db 1 : N és 1 db N : M kapcsolat van (többértékű tulajdonság nincs). Hány tábla lesz?
= 5
! 4 egyedhalmaz + 1 kapcsolótábla; az 1 : N kapcsolatok csak idegen kulcsot adnak.

? Hogyan tárolod egy hallgató **több** telefonszámát?
- egy szöveges cellában vesszővel elválasztva
- telefon1, telefon2, telefon3 oszlopokban
+ külön táblában (neptun, telefonszam)
- sehogy
! Többértékű tulajdonság → külön tábla.

? Egy dolgozónak egy főnöke van, aki maga is dolgozó. Melyik táblára hivatkozik a `fonok_id` idegen kulcs?
= dolgozok
= dolgozó
= dolgozok tábla
= saját
! Rekurzív kapcsolat: a tábla önmagára hivatkozik.
```
