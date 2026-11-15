---
title: Táblák összekapcsolása (JOIN)
summary: INNER JOIN, LEFT / RIGHT / FULL OUTER JOIN, CROSS JOIN és önösszekapcsolás, táblaálnevek, több tábla összekapcsolása, valamint a COUNT(*) csapdája külső összekapcsolásnál.
minutes: 30
---

## Amit ebben a leckében megtanulsz

- hogyan kapcsolsz össze táblákat a **JOIN**-nal,
- mi a különbség a **belső** és a **külső** (LEFT, RIGHT, FULL) összekapcsolás között,
- hogyan kapcsolsz össze **három** táblát, vagy egy táblát **önmagával**.

<details>
<summary>A mintaadatbázis létrehozása (SQL)</summary>

<!-- sql-setup: egyetem -->

</details>

## Miért kell összekapcsolni?

A normalizálás miatt az adatok **szét vannak osztva**: a jelentkezésben csak a Neptun-kód és a tárgykód szerepel, a hallgató neve a `hallgatok`, a tárgy neve a `targyak` táblában van. Ha olvasható kimutatást szeretnél („Kiss Anna – Adatbázisok – 5”), újra össze kell rakni őket. Ez a **JOIN**.

## INNER JOIN – csak a párok

```sql run
SELECT h.nev, j.kod, j.jegy
FROM hallgatok h
JOIN jelentkezesek j ON j.neptun = h.neptun
ORDER BY h.nev, j.kod;
```

- A `JOIN` (teljes nevén `INNER JOIN`) után a másik tábla, az `ON` után a **párosítás feltétele** jön.
- `h` és `j` **táblaálnevek**: rövidebb, és ha két táblában azonos nevű oszlop van (`neptun`), így mondod meg, melyikre gondolsz.
- Csak azok a sorok jelennek meg, amelyeknek **van párja**. Varga Emma nem jelentkezett semmire, ezért **kimarad**.

## Három tábla

Egyszerűen fűzd tovább: minden új `JOIN` egy újabb táblát kapcsol hozzá.

```sql run
SELECT h.nev AS hallgato, t.nev AS targy, j.jegy
FROM jelentkezesek j
JOIN hallgatok h ON h.neptun = j.neptun
JOIN targyak t   ON t.kod = j.kod
ORDER BY hallgato, targy;
```

## Külső összekapcsolások – a pár nélküliek is

Mi van, ha **mindenkit** látni szeretnél, azokat is, akiknek nincs párjuk?

```text
     hallgatok          jelentkezesek
   ┌───────────┐       ┌───────────┐
   │  csak  ┌──┼───────┼──┐  csak  │
   │ hallgató│  │ közös │  │jelentkezés│
   │ (Emma) └──┼───────┼──┘        │
   └───────────┘       └───────────┘
   INNER JOIN = csak a közös rész
   LEFT JOIN  = a bal tábla minden sora + a párjaik (vagy NULL)
   RIGHT JOIN = a jobb tábla minden sora + a párjaik (vagy NULL)
   FULL JOIN  = mindkettő minden sora
```

```sql run
SELECT h.nev, j.kod, j.jegy
FROM hallgatok h
LEFT JOIN jelentkezesek j ON j.neptun = h.neptun
ORDER BY h.nev;
```

Varga Emma most megjelenik, a jelentkezés oszlopai **NULL**-ok. Ezzel a trükkel a „kinek **nincs** …” kérdésekre is válaszolhatsz:

```sql run
-- Kik nem jelentkeztek egyetlen tárgyra sem?
SELECT h.nev
FROM hallgatok h
LEFT JOIN jelentkezesek j ON j.neptun = h.neptun
WHERE j.neptun IS NULL;
```

A `RIGHT JOIN` ugyanez fordítva (a gyakorlatban ritkán kell: a táblák sorrendjét megcserélve LEFT JOIN-nal is megírható), a `FULL JOIN` pedig mindkét oldal pár nélküli sorait is megtartja.

## A COUNT(*) csapdája

Számoljuk meg, ki hány tárgyat vett fel – mindenkit, a nulla tárgyasokat is:

```sql run
SELECT h.nev, COUNT(*) AS rossz, COUNT(j.kod) AS jo
FROM hallgatok h
LEFT JOIN jelentkezesek j ON j.neptun = h.neptun
GROUP BY h.nev
ORDER BY h.nev;
```

Emmánál a `COUNT(*)` 1-et mutat, pedig nincs tárgya! A LEFT JOIN egy sort adott neki (NULL-okkal), és a `COUNT(*)` minden sort megszámol. A `COUNT(j.kod)` viszont kihagyja a NULL-t → 0. **Külső összekapcsolásnál a jobb oldali tábla egy oszlopát számold!**

## CROSS JOIN és önösszekapcsolás

- **CROSS JOIN**: minden sort minden sorral (Descartes-szorzat). Hasznos például egy „minden hallgató × minden tárgy” táblázat kitöltéséhez.
- **Önösszekapcsolás** (_self join_): egy táblát önmagával kapcsolsz össze, két különböző álnévvel. Például: kik laknak ugyanabban a városban?

```sql run
SELECT a.nev, b.nev, a.varos
FROM hallgatok a
JOIN hallgatok b ON a.varos = b.varos AND a.neptun < b.neptun;
```

Az `a.neptun < b.neptun` feltétel kizárja, hogy valaki önmagával, és hogy ugyanaz a pár kétszer (A–B és B–A) szerepeljen.

## Összefoglalás

- `JOIN … ON feltétel` – csak a párok (INNER).
- `LEFT JOIN` – a bal tábla minden sora; a pár nélküliek NULL-t kapnak. „Kinek nincs…” → `LEFT JOIN … WHERE jobb.kulcs IS NULL`.
- Külső összekapcsolásnál `COUNT(jobb_tábla.oszlop)`, ne `COUNT(*)`.
- Önösszekapcsolás: ugyanaz a tábla két álnévvel.

## A lecke feladata

Kérd le **minden** hallgató **nevét** (`nev`) és azt, hogy **hány tárgyat** vett fel (`targyak_szama`) – azokat is, akik egyet sem (nekik 0 kell)! Rendezd a tárgyak száma szerint **csökkenően**, egyenlőségnél név szerint.

```sql starter required
SELECT h.nev, COUNT(*) AS targyak_szama
FROM hallgatok h
JOIN jelentkezesek j ON j.neptun = h.neptun
GROUP BY h.nev;
```

<details>
<summary>Megoldás</summary>

```sql solution
SELECT h.nev, COUNT(j.kod) AS targyak_szama
FROM hallgatok h
LEFT JOIN jelentkezesek j ON j.neptun = h.neptun
GROUP BY h.neptun, h.nev
ORDER BY targyak_szama DESC, h.nev;
```

Azért csoportosítunk a Neptun-kódra is, mert két hallgatónak lehetne ugyanaz a neve – így sem vonódnának össze.

</details>
