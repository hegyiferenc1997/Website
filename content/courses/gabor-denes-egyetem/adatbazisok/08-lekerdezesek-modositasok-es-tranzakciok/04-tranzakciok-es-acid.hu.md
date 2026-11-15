---
title: Tranzakciók és az ACID elvek
summary: Mi a tranzakció, a BEGIN, COMMIT, ROLLBACK és SAVEPOINT, az ACID tulajdonságok, az egyidejűség problémái (piszkos olvasás, nem ismételhető olvasás, fantom, elveszett frissítés), az elkülönítési szintek, a zárolás és a holtpont.
minutes: 30
---

## Amit ebben a leckében megtanulsz

- mi a **tranzakció**, és miért nélkülözhetetlen,
- hogyan használod a `BEGIN`, `COMMIT`, `ROLLBACK` és `SAVEPOINT` utasítást,
- mit jelent az **ACID**,
- milyen gondok lépnek fel, ha **sokan egyszerre** dolgoznak, és mit tesz ellenük a DBMS.

## A banki átutalás problémája

Anna 5000 Ft-ot utal Bélának. Ez **két** lépés:

1. Anna egyenlegéből levonunk 5000-et.
2. Béla egyenlegéhez hozzáadunk 5000-et.

Mi történik, ha az 1. lépés után elmegy az áram? Anna pénze eltűnt, Béla nem kapta meg. A két lépésnek **együtt** kell megtörténnie, vagy **egyáltalán nem**. Erre való a **tranzakció**: utasítások csoportja, amelyet a DBMS **egyetlen, oszthatatlan egységként** kezel.

## Kipróbálható bankszámlák

```sql setup
CREATE TABLE szamlak (
  szamla_id INT PRIMARY KEY,
  tulajdonos VARCHAR(40) NOT NULL,
  egyenleg   NUMERIC(12, 2) NOT NULL CHECK (egyenleg >= 0)
);
INSERT INTO szamlak VALUES (1, 'Anna', 50000), (2, 'Béla', 20000), (3, 'Cili', 10000);
```

## BEGIN, COMMIT, ROLLBACK

```sql run
BEGIN;
UPDATE szamlak SET egyenleg = egyenleg - 5000 WHERE szamla_id = 1;
UPDATE szamlak SET egyenleg = egyenleg + 5000 WHERE szamla_id = 2;
COMMIT;
SELECT * FROM szamlak ORDER BY szamla_id;
```

- `BEGIN` – elindítja a tranzakciót.
- `COMMIT` – **véglegesíti**: innentől a változás tartós, és a többi felhasználó is látja.
- `ROLLBACK` – **visszavonja** a tranzakció összes változását, mintha meg sem történtek volna.

```sql run
BEGIN;
UPDATE szamlak SET egyenleg = 0 WHERE szamla_id = 3;   -- hoppá, rossz utasítás!
SELECT * FROM szamlak WHERE szamla_id = 3;             -- a tranzakción belül már 0
ROLLBACK;
SELECT * FROM szamlak WHERE szamla_id = 3;             -- visszaállt 10000-re
```

Ha egy utasítás **hibát** ad a tranzakcióban (pl. a `CHECK (egyenleg >= 0)` miatt), a PostgreSQL az egész tranzakciót „elrontottnak” jelöli, és csak `ROLLBACK`-et fogad el. Így nem fordulhat elő, hogy a levonás megtörténik, a jóváírás nem.

### SAVEPOINT – részleges visszavonás

Hosszabb tranzakcióban **mentési pontot** tehetsz le, és csak addig vonhatsz vissza:

```sql run
BEGIN;
UPDATE szamlak SET egyenleg = egyenleg - 1000 WHERE szamla_id = 1;
SAVEPOINT elso_lepes;
UPDATE szamlak SET egyenleg = egyenleg + 1000 WHERE szamla_id = 3;   -- mégis rossz számla!
ROLLBACK TO SAVEPOINT elso_lepes;                                   -- csak ezt vonjuk vissza
UPDATE szamlak SET egyenleg = egyenleg + 1000 WHERE szamla_id = 2;   -- a jó számla
COMMIT;
SELECT * FROM szamlak ORDER BY szamla_id;
```

## Az ACID tulajdonságok

| Betű  | Tulajdonság                       | Jelentés                                                                 |
| ----- | --------------------------------- | ------------------------------------------------------------------------ |
| **A** | _Atomicity_ – atomicitás          | minden vagy semmi: a tranzakció vagy teljesen lefut, vagy semmi nem marad belőle |
| **C** | _Consistency_ – konzisztencia     | a tranzakció egy érvényes állapotból érvényes állapotba visz (minden megszorítás teljesül) |
| **I** | _Isolation_ – elkülönítés         | az egyszerre futó tranzakciók nem zavarják egymást, mintha egymás után futnának |
| **D** | _Durability_ – tartósság          | a véglegesített (COMMIT) változás áramszünet után is megmarad (a napló miatt, 9. témakör) |

## Ha sokan dolgoznak egyszerre

Egy webshopban egyszerre ezrek vásárolnak. Ha a tranzakciók nem lennének elkülönítve, ilyen hibák fordulnának elő:

- **Piszkos olvasás** (_dirty read_): T2 olyan adatot olvas, amelyet T1 még nem véglegesített – és T1 később visszavonja. T2 egy soha nem létezett értékkel dolgozott.
- **Nem ismételhető olvasás**: T1 kétszer olvassa ugyanazt a sort, de közben T2 módosította és véglegesítette – a két olvasás eltér.
- **Fantom olvasás**: T1 kétszer futtatja ugyanazt a lekérdezést, de közben T2 **új sort** szúrt be, így másodszor több sor jön.
- **Elveszett frissítés** (_lost update_): T1 és T2 is beolvassa a készletet (10), mindkettő eladott egyet, és mindkettő 9-et ír vissza – pedig 8 kellene.

## Elkülönítési szintek

Minél szigorúbb a szint, annál kevesebb a hiba – de annál többet kell várni egymásra.

| Szint              | Piszkos olvasás | Nem ismételhető | Fantom    |
| ------------------ | --------------- | --------------- | --------- |
| READ UNCOMMITTED   | lehetséges*     | lehetséges      | lehetséges |
| **READ COMMITTED** (PostgreSQL alapértelmezés) | nem | lehetséges | lehetséges |
| REPEATABLE READ    | nem             | nem             | lehetséges* |
| SERIALIZABLE       | nem             | nem             | nem       |

\* A PostgreSQL ennél szigorúbb: piszkos olvasás nála sosem fordul elő, és a REPEATABLE READ a fantomokat is kizárja.

Beállítása: `BEGIN ISOLATION LEVEL SERIALIZABLE;`

## Zárolás és holtpont

Az elkülönítést a DBMS **zárakkal** és a **többverziós** technikával (MVCC – minden tranzakció a saját „pillanatképét” látja, 9. témakör) valósítja meg. Ha egy tranzakció módosít egy sort, a sort zárolja, és aki ugyanazt akarja módosítani, **vár**.

Az elveszett frissítés ellen például: `SELECT keszlet FROM termekek WHERE id = 7 FOR UPDATE;` – ez már olvasáskor zárolja a sort.

**Holtpont** (_deadlock_): T1 zárolta az A sort és a B-re vár, T2 zárolta a B-t és az A-ra vár – örökké várnának egymásra. A DBMS ezt felismeri, és az egyik tranzakciót hibával leállítja (azt újra kell próbálni). Megelőzés: a sorokat mindig **azonos sorrendben** zárold (pl. kisebb azonosítójút előbb), és tartsd a tranzakciókat **rövidre**.

## Összefoglalás

- Tranzakció = oszthatatlan egység: `BEGIN` … `COMMIT` / `ROLLBACK`; `SAVEPOINT` részleges visszavonáshoz.
- ACID: atomicitás, konzisztencia, elkülönítés, tartósság.
- Egyidejűségi hibák: piszkos, nem ismételhető, fantom olvasás, elveszett frissítés.
- Elkülönítési szintek; zárolás, `FOR UPDATE`; holtpont → azonos zárolási sorrend, rövid tranzakciók.

## A lecke feladata

A fenti bankszámlákon (Anna 50 000, Béla 20 000, Cili 10 000):

1. **Egy tranzakcióban** utalj át **5000** Ft-ot Annától (1) Bélának (2), és véglegesítsd.
2. Indíts egy **második tranzakciót**, amelyben Béla **8000** Ft-ot utalna Cilinek (3) – de Béla meggondolja magát, ezért **vond vissza** a tranzakciót.

A gép a végén lekérdezi az egyenlegeket.

```sql starter required
BEGIN;
UPDATE szamlak SET egyenleg = egyenleg - 5000 WHERE szamla_id = 1;
COMMIT;
```

<details>
<summary>Megoldás</summary>

```sql solution
BEGIN;
UPDATE szamlak SET egyenleg = egyenleg - 5000 WHERE szamla_id = 1;
UPDATE szamlak SET egyenleg = egyenleg + 5000 WHERE szamla_id = 2;
COMMIT;

BEGIN;
UPDATE szamlak SET egyenleg = egyenleg - 8000 WHERE szamla_id = 2;
UPDATE szamlak SET egyenleg = egyenleg + 8000 WHERE szamla_id = 3;
ROLLBACK;
```

</details>

```sql test
SELECT szamla_id, tulajdonos, egyenleg FROM szamlak ORDER BY szamla_id;
```
