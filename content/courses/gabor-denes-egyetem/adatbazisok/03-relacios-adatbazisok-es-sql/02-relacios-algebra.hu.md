---
title: Relációs algebra
summary: A relációs algebra alapműveletei (szelekció, projekció, Descartes-szorzat, összekapcsolás, unió, különbség, metszet, átnevezés), és hogyan felelnek meg az SQL-nek – kipróbálható példákkal.
minutes: 22
---

## Amit ebben a leckében megtanulsz

- mi a **relációs algebra**, és miért érdemes ismerni,
- az alapműveleteket: **σ**, **π**, **×**, **⋈**, **∪**, **−**, **∩**, **ρ**,
- melyik művelet melyik **SQL** szerkezetnek felel meg.

## Táblákból táblák

A relációs algebra a relációs adatbázisok „matematikája”: olyan műveletek gyűjteménye, amelyek **táblákból táblát** készítenek. Mint a számoknál az összeadás és a szorzás: két számból szám lesz, itt két táblából tábla. Ezért a műveletek **egymásba ágyazhatók**.

Miért jó ismerni? Mert a DBMS is így gondolkodik: az SQL lekérdezésedet relációs algebrai kifejezéssé alakítja, átrendezi (optimalizálja), és úgy hajtja végre. Ha érted az algebrát, érteni fogod a **lekérdezéstervet** is (7. témakör).

A példák a már ismert egyetemi mintaadatbázison futnak.

<details>
<summary>A mintaadatbázis létrehozása (SQL)</summary>

<!-- sql-setup: egyetem -->

</details>

## Egytáblás műveletek

### Szelekció (kiválasztás) – σ

**Sorokat** választ ki egy feltétel alapján. Olyan, mint egy szűrő a táblázatkezelőben.

`σ felev = 3 (hallgatok)` – a 3. féléves hallgatók.

```sql run
SELECT * FROM hallgatok WHERE felev = 3;
```

### Projekció (vetítés) – π

**Oszlopokat** választ ki. Mivel a reláció halmaz, az ismétlődő sorok eltűnnek (SQL-ben ehhez `DISTINCT` kell!).

`π szak (hallgatok)` – milyen szakok vannak.

```sql run
SELECT DISTINCT szak FROM hallgatok;
```

Emlékeztető: **σ = sorok** (szelekció → **s**orok), **π = oszlopok**.

### Átnevezés – ρ

Új nevet ad a relációnak vagy egy attribútumnak: `ρ diak (hallgatok)`. SQL-ben ez az `AS`.

## Kéttáblás műveletek

### Descartes-szorzat – ×

Minden sort minden sorral párosít. 6 hallgató × 5 tárgy = 30 sor. Önmagában ritkán hasznos (a legtöbb pár értelmetlen), de az összekapcsolás alapja.

```sql run
SELECT h.nev, t.nev AS targy FROM hallgatok h CROSS JOIN targyak t;
```

### Összekapcsolás (join) – ⋈

Descartes-szorzat + szelekció: csak az **összetartozó** párok maradnak. A **természetes összekapcsolás** az azonos nevű oszlopok egyezése alapján párosít.

`hallgatok ⋈ jelentkezesek` – minden hallgató a jelentkezéseivel.

```sql run
SELECT h.nev, j.kod, j.jegy
FROM hallgatok h
JOIN jelentkezesek j ON j.neptun = h.neptun;
```

A JOIN-okkal a 8. témakör részletesen foglalkozik.

### Halmazműveletek – ∪, −, ∩

Csak **azonos szerkezetű** (ugyanannyi és ugyanolyan típusú oszlopú) táblákra:

- **Unió (∪)**: ami az egyikben **vagy** a másikban benne van – SQL: `UNION`
- **Különbség (−)**: ami az elsőben benne van, a másodikban **nincs** – SQL: `EXCEPT`
- **Metszet (∩)**: ami **mindkettőben** benne van – SQL: `INTERSECT`

Kik azok a hallgatók, akik még egy tárgyat sem vettek fel? `π neptun (hallgatok) − π neptun (jelentkezesek)`

```sql run
SELECT neptun FROM hallgatok
EXCEPT
SELECT neptun FROM jelentkezesek;
```

## Műveletek egymásba ágyazva

Kérdés: _„Melyik tárgyakból kapott valaki ötöst?”_

```text
π kod ( σ jegy = 5 ( jelentkezesek ) )
   ▲          ▲            ▲
   │          │            └── 3. ebből a táblából
   │          └── 2. csak az ötösök
   └── 1. csak a tárgykód (ismétlődés nélkül)
```

Belülről kifelé olvasd! SQL-ben:

```sql run
SELECT DISTINCT kod FROM jelentkezesek WHERE jegy = 5;
```

## Összefoglalás

| Algebra | Jelentés              | SQL                            |
| ------- | --------------------- | ------------------------------ |
| σ       | sorok szűrése         | `WHERE`                        |
| π       | oszlopok kiválasztása | `SELECT DISTINCT oszlopok`     |
| ρ       | átnevezés             | `AS`                           |
| ×       | minden pár            | `CROSS JOIN`                   |
| ⋈       | összetartozó párok    | `JOIN … ON`                    |
| ∪, −, ∩ | halmazműveletek       | `UNION`, `EXCEPT`, `INTERSECT` |

## A lecke feladata

A kérdések a fenti mintaadatbázisra vonatkoznak. Nyugodtan futtasd le a példákat, és számold meg a sorokat!

```quiz required
? Melyik művelet választ ki **sorokat** egy feltétel alapján?
+ szelekció (σ)
- projekció (π)
- unió (∪)
- Descartes-szorzat (×)
! σ = sorok, π = oszlopok.

? Hány sora van a `π szak (hallgatok)` eredményének?
= 2
! mérnökinformatikus és gazdaságinformatikus – az ismétlődés eltűnik.

? Hány sora van a `hallgatok × targyak` Descartes-szorzatnak?
= 30
! 6 · 5 = 30.

? Hány sora van a `π neptun (hallgatok) − π neptun (jelentkezesek)` eredménynek?
= 1
! Csak Varga Emma (EFG567) nem jelentkezett semmire.

? Hány sora van a `π kod (σ jegy = 5 (jelentkezesek))` eredménynek?
= 3
! ADB, PROG, DIG.

? Melyik SQL kulcsszó felel meg a különbségnek (−)?
- UNION
+ EXCEPT
- INTERSECT
- JOIN
! EXCEPT: ami az elsőben benne van, a másodikban nincs.
```
