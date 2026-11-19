---
title: Mélyebben – normalizálás a gyakorlatban
summary: Kulcskeresés az attribútumhalmaz lezártjával, a normálforma eldöntése ellenőrzőlistával, a 3NF és a BCNF különbsége egy klasszikus példán, a veszteségmentes és a veszteséges felbontás (élőben, SQL-lel kipróbálva), valamint a tudatos denormalizálás előnyei és kockázatai.
minutes: 40
---

## Amit ebben a leckében megtanulsz

- hogyan találd meg egy tábla **kulcsait** a funkcionális függőségekből (lezárt-algoritmus),
- hogyan döntsd el egy tábláról **lépésről lépésre**, hogy melyik normálformában van,
- miben különbözik a **3NF** és a **BCNF**, és mikor számít ez,
- mi a **veszteségmentes** felbontás – és mi történik, ha rosszul bontasz (kipróbálod!),
- mikor és miért **denormalizálunk** szándékosan.

## Emlékeztető egy mondatban

A **funkcionális függőség** (FF) X → Y azt jelenti: ha két sorban X értéke azonos, akkor Y értéke is azonos. (Ha tudom a Neptun-kódot, tudom a nevet: `neptun → nev`.) A normalizálás lényege: **minden tény egyetlen helyen** legyen tárolva.

## 1. Kulcskeresés: az attribútumhalmaz lezártja

Egy X attribútumhalmaz **lezártja** (jele: X⁺) azoknak az attribútumoknak a halmaza, amelyek X-ből a függőségek alapján „kikövetkeztethetők”. Ha X⁺ a tábla **összes** oszlopát tartalmazza, akkor X **szuperkulcs**; ha ráadásul egyetlen eleme sem hagyható el, akkor **kulcs**.

**Analógia – dominóeffektus:** X-et feldöntöd, és nézed, mi dől még el. Ha minden dominó eldől, X kulcs.

### Az algoritmus

1. Kezdetben X⁺ = X.
2. Nézd végig a függőségeket: ha egy A → B függőség **bal oldala** teljesen benne van X⁺-ban, add hozzá a **jobb oldalát** X⁺-hoz.
3. Ismételd, amíg már semmi újat nem tudsz hozzáadni.

### Kidolgozott példa

Egy vizsgajelentkezési tábla: `R(neptun, nev, kod, targynev, kredit, datum, terem)`, a függőségek:

- `neptun → nev`
- `kod → targynev, kredit`
- `kod, datum → terem` (egy tárgy adott napi vizsgája egy teremben van)

Mi a kulcs? Próbáljuk ki a `{neptun, kod, datum}` halmazt:

| Lépés | Felhasznált FF          | X⁺                                                    |
| ----- | ----------------------- | ----------------------------------------------------- |
| 0.    | –                       | neptun, kod, datum                                    |
| 1.    | neptun → nev            | neptun, kod, datum, **nev**                           |
| 2.    | kod → targynev, kredit  | …, **targynev, kredit**                               |
| 3.    | kod, datum → terem      | …, **terem** → minden oszlop megvan ✔                 |

Tehát `{neptun, kod, datum}` szuperkulcs. Elhagyható-e valamelyik eleme?

- `{kod, datum}⁺` = kod, datum, targynev, kredit, terem – **nincs** benne a neptun, nev → nem szuperkulcs.
- `{neptun, datum}⁺` = neptun, datum, nev – messze nem.
- `{neptun, kod}⁺` = neptun, kod, nev, targynev, kredit – hiányzik a datum, terem.

Egyik sem elég, tehát `{neptun, kod, datum}` a **kulcs**.

**Gyors tipp:** az az oszlop, amely **egyetlen függőség jobb oldalán sem** szerepel (itt: neptun, kod, datum), biztosan benne van minden kulcsban – onnan érdemes kezdeni.

## 2. Melyik normálformában van? – ellenőrzőlista

Haladj sorban; ahol „nem” a válasz, ott megállsz.

1. **1NF:** minden mező **atomi** (nincs lista, nincs ismétlődő oszlopcsoport), és van kulcs?
2. **2NF:** van olyan nem-kulcs oszlop, amely a kulcsnak **csak egy részétől** függ? (Csak összetett kulcsnál fordulhat elő!) Ha nincs → 2NF.
3. **3NF:** van olyan nem-kulcs oszlop, amely **egy másik nem-kulcs oszloptól** függ (tranzitív függés)? Ha nincs → 3NF.
4. **BCNF:** minden nem triviális X → Y függőség bal oldala (X) **szuperkulcs**? Ha igen → BCNF.

Alkalmazzuk a fenti vizsgatáblára:

- 1NF: ✔ (atomi mezők, van kulcs).
- 2NF: ✘ – a `nev` csak a `neptun`-tól függ, a `targynev, kredit` csak a `kod`-tól: ezek a kulcs **részei**. **Részleges függés.**

Felbontás: `hallgatok(neptun, nev)`, `targyak(kod, targynev, kredit)`, `vizsgaalkalmak(kod, datum, terem)`, `jelentkezesek(neptun, kod, datum)`. Mindegyik kulcsa a saját függőségeinek bal oldala → mind **BCNF**.

## 3. 3NF kontra BCNF – a klasszikus példa

A legtöbb tábla, amely 3NF-ben van, BCNF-ben is. A ritka kivétel akkor fordul elő, ha **több, egymást átfedő** jelöltkulcs van. A tankönyvi példa:

`konzultacio(hallgato, targy, oktato)`, a szabályok:

- egy hallgatónak egy tárgyból **egy** oktatója van: `hallgato, targy → oktato`;
- minden oktató **egyetlen** tárgyat tanít: `oktato → targy`.

Jelöltkulcsok: `{hallgato, targy}` és `{hallgato, oktato}`. Mivel a `targy` egy kulcs része (ún. elsődleges attribútum), a 3NF megengedi az `oktato → targy` függést – a tábla **3NF**. De az `oktato` nem szuperkulcs, tehát a tábla **nem BCNF**.

Mi a baj? Ha Kovács tanár 30 hallgatót konzultál, 30 sorban szerepel, hogy Kovács az ADB-t tanítja. Ha Kovács tárgyat vált, 30 sort kell módosítani – **módosítási anomália**.

BCNF-felbontás: `oktatok(oktato, targy)` és `konzultacio(hallgato, oktato)`. Az ára: a „hallgatónak egy tárgyból egy oktatója van” szabály már **egyik táblában sem** ellenőrizhető egy egyszerű kulccsal – csak a két tábla összekapcsolása után.

**Tanulság:** a BCNF szigorúbb, de néha **elveszít egy függőséget**. Ilyenkor a gyakorlatban sokszor megállnak a 3NF-nél. A 3NF-re mindig létezik függőségmegőrző és veszteségmentes felbontás, a BCNF-re nem mindig.

## 4. Veszteségmentes és veszteséges felbontás – élőben

Egy felbontás **veszteségmentes**, ha a darabokat összekapcsolva **pontosan** az eredeti táblát kapjuk vissza – se kevesebbet, se **többet**. A szabály két darabra: a két darab **közös oszlopai** az egyik darab kulcsát alkossák.

Nézzük meg, mi történik, ha rosszul bontunk! A hallgatók táblát kettévágjuk: `(nev, varos)` és `(varos, szak)`. A közös oszlop a `varos` – de az **egyik darabban sem kulcs** (több hallgató is lakhat ugyanabban a városban).

<details>
<summary>A mintaadatbázis létrehozása (SQL)</summary>

<!-- sql-setup: egyetem -->

</details>

```sql run
-- Rossz felbontás: a közös oszlop (varos) egyik darabban sem kulcs
CREATE TABLE darab1 AS SELECT DISTINCT nev, varos FROM hallgatok WHERE varos IS NOT NULL;
CREATE TABLE darab2 AS SELECT DISTINCT varos, szak FROM hallgatok WHERE varos IS NOT NULL;

-- Visszaillesztés: hány sor lesz?
SELECT d1.nev, d1.varos, d2.szak
FROM darab1 d1 JOIN darab2 d2 ON d1.varos = d2.varos
ORDER BY d1.nev, d2.szak;
```

Az eredeti táblában 5 városos hallgató van, a visszaillesztés után viszont **7 sor** jön ki: Kiss Anna és Tóth Cili mindketten budapestiek, ezért a visszaillesztés azt „állítja”, hogy Anna gazdaságinformatikus is, Cili pedig mérnökinformatikus is. Ezek **hamis (kitalált) sorok**. A „veszteséges” szó tehát nem azt jelenti, hogy sorok tűnnek el, hanem hogy **információ** vész el: már nem tudjuk, melyik sor igaz.

Most a jó felbontás: a közös oszlop a `neptun`, ami az első darab kulcsa.

```sql run
-- Jó felbontás: a közös oszlop (neptun) az egyik darab kulcsa
CREATE TABLE szemely AS SELECT neptun, nev, varos FROM hallgatok;
CREATE TABLE tanulmany AS SELECT neptun, szak, felev FROM hallgatok;

SELECT COUNT(*) AS visszaillesztve,
       (SELECT COUNT(*) FROM hallgatok) AS eredeti
FROM szemely s JOIN tanulmany t ON s.neptun = t.neptun;
```

Pontosan annyi sor, amennyi az eredeti – a felbontás veszteségmentes.

## 5. Tudatos denormalizálás

A normalizálás a **módosításokat** teszi biztonságossá, de a lekérdezések több JOIN-t igényelnek. Néha szándékosan visszalépünk:

| Helyzet                                                    | Denormalizálás                                 | Kockázat és kezelése                             |
| ---------------------------------------------------------- | ---------------------------------------------- | ------------------------------------------------ |
| A termékoldalon mindig kell az értékelések száma és átlaga | `termekek.ertekelesek_szama`, `atlag` oszlop   | elavulhat → triggerrel vagy időzített frissítéssel tartjuk naprakészen |
| Riport-adatbázis (adattárház), amelyet csak olvasnak        | csillagséma, ismétlődő dimenzióadatok (18. témakör) | nincs módosítás, így nincs anomália          |
| A rendelés a vásárláskori árat és címet őrzi                | `tetelek.egysegar`, `rendelesek.szallitasi_cim` | ez valójában **nem is** redundancia, hanem történeti tény |
| Nagyon gyakori, drága JOIN                                  | materializált nézet (16. témakör)              | frissíteni kell                                  |

**Aranyszabály:** előbb **normalizálj**, és csak akkor denormalizálj, ha **mért** teljesítményproblémád van – és akkor is dokumentáld, ki és mi tartja szinkronban a másolatot.

## Gyakori hibák

- **„Minden táblának mesterséges `id` kulcsot adtam, tehát normalizált.”** Nem: a mesterséges kulcs nem szünteti meg a tranzitív függéseket (a `varos → irsz` függés `id` mellett is ott van).
- **Túlnormalizálás:** az `irsz → varos` függés miatt külön irányítószám-tábla elméletben helyes, de egy kis rendszerben fölösleges bonyolítás lehet. Mérlegelj!
- **A függőségek kitalálása az adatokból:** ha a mintában minden budapesti hallgató mérnökinformatikus, attól még **nem** igaz a `varos → szak` függés. A függőségek a **valóság szabályaiból** jönnek, nem a véletlen adatokból.

## Összefoglalás

- **Lezárt-algoritmus:** X⁺-hoz addig adod a függőségek jobb oldalát, amíg lehet; ha minden oszlop benne van, X szuperkulcs.
- **Ellenőrzőlista:** atomi? (1NF) → nincs részleges függés? (2NF) → nincs tranzitív függés? (3NF) → minden bal oldal szuperkulcs? (BCNF).
- A **BCNF** szigorúbb a 3NF-nél, de elveszíthet egy függőséget.
- **Veszteségmentes** felbontás: a közös oszlopok az egyik darab kulcsát alkotják; különben **hamis sorok** keletkeznek.
- **Denormalizálni** csak tudatosan, mért okból, szinkronizálási tervvel szabad.

## A lecke feladata

A kiinduló kód egy **normalizálatlan** rendelési táblát hoz létre (`rendelesek_lapos`), amelyben minden sorban ott a vásárló neve és városa, a termék neve és ára is. Hozd létre ebből **CREATE TABLE … AS SELECT** segítségével a `termekek_n` táblát, amelyben **minden termék pontosan egyszer** szerepel a nevével (`termek`) és az árával (`ar`)!

Az ellenőrzés a `termekek_n` tartalmát kérdezi le, név szerint rendezve.

```sql starter required
CREATE TABLE rendelesek_lapos (
  rendeles_id INT, datum DATE, vasarlo VARCHAR(40), varos VARCHAR(30),
  termek VARCHAR(40), ar NUMERIC(10, 2), db INT
);
INSERT INTO rendelesek_lapos VALUES
  (1, '2025-03-01', 'Kiss Anna',  'Budapest', 'Egér',        4990, 1),
  (1, '2025-03-01', 'Kiss Anna',  'Budapest', 'Billentyűzet', 24990, 1),
  (2, '2025-03-02', 'Nagy Béla',  'Debrecen', 'Egér',        4990, 2),
  (3, '2025-03-05', 'Kiss Anna',  'Budapest', 'Monitor',     69990, 1),
  (4, '2025-03-07', 'Tóth Cili',  'Szeged',   'Billentyűzet', 24990, 1);

-- Hozd létre a termekek_n táblát!
CREATE TABLE termekek_n AS
SELECT ...
```

<details>
<summary>Megoldás</summary>

```sql solution
CREATE TABLE rendelesek_lapos (
  rendeles_id INT, datum DATE, vasarlo VARCHAR(40), varos VARCHAR(30),
  termek VARCHAR(40), ar NUMERIC(10, 2), db INT
);
INSERT INTO rendelesek_lapos VALUES
  (1, '2025-03-01', 'Kiss Anna',  'Budapest', 'Egér',        4990, 1),
  (1, '2025-03-01', 'Kiss Anna',  'Budapest', 'Billentyűzet', 24990, 1),
  (2, '2025-03-02', 'Nagy Béla',  'Debrecen', 'Egér',        4990, 2),
  (3, '2025-03-05', 'Kiss Anna',  'Budapest', 'Monitor',     69990, 1),
  (4, '2025-03-07', 'Tóth Cili',  'Szeged',   'Billentyűzet', 24990, 1);

CREATE TABLE termekek_n AS
SELECT DISTINCT termek, ar FROM rendelesek_lapos;
```

</details>

```sql test
SELECT termek, ar FROM termekek_n ORDER BY termek;
```
