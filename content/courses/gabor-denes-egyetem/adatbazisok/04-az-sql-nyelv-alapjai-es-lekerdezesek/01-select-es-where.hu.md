---
title: SELECT és WHERE – az első lekérdezések
summary: Oszlopok kiválasztása, álnevek, sorok szűrése összehasonlítással, AND / OR / NOT, BETWEEN, IN, LIKE és IS NULL.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- hogyan kérsz le adatokat egy táblából a **SELECT** utasítással,
- hogyan szűröd a sorokat a **WHERE** feltétellel,
- a hasznos szűrőket: **BETWEEN**, **IN**, **LIKE**, **IS NULL**.

## A lekérdezés olyan, mint egy kérdés a könyvtároshoz

Képzeld el, hogy az adatbázis egy hatalmas irattár, te pedig odaszólsz a könyvtárosnak: _„Kérem a hallgatók **nevét** és **szakját**, de csak a **budapestieket**!”_ Az SQL pontosan ilyen mondatokból áll, csak angolul és szigorú szórenddel:

```sql
SELECT nev, szak          -- MIT kérek (oszlopok)
FROM hallgatok            -- HONNAN (tábla)
WHERE varos = 'Budapest'; -- MELYIK sorokat (feltétel)
```

Nem azt mondod meg, **hogyan** keresse meg az adatokat (ez a DBMS dolga), csak azt, **mit** szeretnél. Ezért hívjuk az SQL-t **deklaratív** nyelvnek.

## A mintaadatbázis

A lecke példái és a feladat egy kis egyetemi adatbázison futnak, közvetlenül a böngésződben (egy igazi PostgreSQL-en). Három tábla van benne: `hallgatok`, `targyak` és `jelentkezesek` (ki melyik tárgyat vette fel, és milyen jegyet kapott).

<details>
<summary>A mintaadatbázis létrehozása (SQL)</summary>

<!-- sql-setup: egyetem -->

</details>

Nyugodtan kísérletezz: minden futtatás egy friss másolaton indul, semmit nem tudsz elrontani.

## Oszlopok kiválasztása

```sql run
SELECT * FROM hallgatok;
```

A `*` azt jelenti: **minden oszlop**. Kipróbáláshoz kényelmes, de valódi programban inkább sorold fel, amit tényleg használsz. Az oszlopoknak **álnevet** (alias) is adhatsz az `AS` kulcsszóval, és számolhatsz is velük:

```sql run
SELECT nev AS hallgato, felev, felev * 30 AS megszerzett_kredit_kb
FROM hallgatok;
```

## Sorok szűrése: WHERE

A `WHERE` után egy **feltétel** áll; csak azok a sorok maradnak, amelyekre igaz.

| Operátor              | Jelentés             | Példa                              |
| --------------------- | -------------------- | ---------------------------------- |
| `=`, `<>` (vagy `!=`) | egyenlő, nem egyenlő | `szak = 'mérnökinformatikus'`      |
| `<`, `<=`, `>`, `>=`  | kisebb, nagyobb      | `felev >= 3`                       |
| `AND`, `OR`, `NOT`    | és, vagy, nem        | `felev = 3 AND varos = 'Budapest'` |

Figyelj: a **szöveget** egyszeres idézőjelbe tesszük (`'Budapest'`), a számot nem.

```sql run
SELECT nev, szak, felev
FROM hallgatok
WHERE szak = 'mérnökinformatikus' AND felev >= 3;
```

Ha `AND` és `OR` is van egy feltételben, az `AND` erősebb (mint a szorzás az összeadásnál). Kétség esetén tegyél **zárójelet**: `WHERE (varos = 'Budapest' OR varos = 'Szeged') AND felev = 3`.

## Kényelmes szűrők

- **BETWEEN a AND b** – a két határ között (a határokat is beleértve): `felev BETWEEN 1 AND 3`
- **IN (…)** – a felsorolt értékek valamelyike: `varos IN ('Budapest', 'Győr')`
- **LIKE** – mintaillesztés szövegre: `%` = bármennyi karakter, `_` = pontosan egy karakter. `nev LIKE 'K%'` = K-val kezdődik.
- **IS NULL / IS NOT NULL** – hiányzó érték vizsgálata.

```sql run
SELECT nev, varos FROM hallgatok WHERE varos IN ('Budapest', 'Győr');
```

```sql run
SELECT nev FROM hallgatok WHERE nev LIKE '%a%';
```

### A NULL csapdája

A `NULL` nem nulla és nem üres szöveg, hanem azt jelenti: **„nem tudjuk”**. Ezért `varos = NULL` sosem igaz (még akkor sem, ha a város hiányzik) – egy ismeretlen értékről nem mondhatjuk, hogy egyenlő valamivel. Helyette mindig `IS NULL` kell:

```sql run
SELECT nev, varos FROM hallgatok WHERE varos IS NULL;
```

Próbáld ki: írd át a fenti lekérdezést `WHERE varos = NULL`-ra (Szerkesztés gomb), és nézd meg, hogy egyetlen sort sem kapsz!

## Összefoglalás

- `SELECT oszlopok FROM tábla WHERE feltétel;` – mit, honnan, melyik sorokat.
- `AS` = álnév; a `*` minden oszlopot jelent.
- Szűrők: összehasonlítás, `AND`/`OR`/`NOT`, `BETWEEN`, `IN`, `LIKE` (`%`, `_`), `IS NULL`.
- A `NULL` „ismeretlen”: csak `IS NULL`-lal lehet rákeresni.

## A lecke feladata

Kérd le azoknak a hallgatóknak a **nevét** és **városát**, akik **mérnökinformatikusok** és az **1–3. félév** valamelyikében járnak (a sorrend most nem számít)!

```sql starter required
SELECT nev, varos
FROM hallgatok
WHERE ...;
```

<details>
<summary>Megoldás</summary>

```sql solution
SELECT nev, varos
FROM hallgatok
WHERE szak = 'mérnökinformatikus' AND felev BETWEEN 1 AND 3;
```

</details>
