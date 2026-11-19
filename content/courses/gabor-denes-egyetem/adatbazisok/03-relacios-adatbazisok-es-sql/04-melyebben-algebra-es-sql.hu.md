---
title: Mélyebben – relációs algebra és SQL kéz a kézben
summary: Algebrai kifejezések lefordítása SQL-re és vissza, kifejezésfák, halmaz és multihalmaz (UNION kontra UNION ALL), INTERSECT és EXCEPT, a relációs osztás („aki mindet felvette”) három módon, valamint az egyenértékű átírások, amelyekkel az optimalizáló gyorsít.
minutes: 35
---

## Amit ebben a leckében megtanulsz

- hogyan **fordíts le** egy relációs algebrai kifejezést SQL-re – és egy SQL lekérdezést algebrára,
- mi a **kifejezésfa**, és miért így „gondolkodik” a DBMS,
- mi a különbség a **halmaz** és a **multihalmaz** között (`UNION` kontra `UNION ALL`),
- hogyan használd az `INTERSECT` és `EXCEPT` műveletet,
- hogyan oldd meg a híres **„aki mindet”** típusú kérdéseket (relációs osztás),
- miért adhat **két különböző kifejezés ugyanolyan eredményt** – és ezt hogyan használja ki az optimalizáló.

## Miért érdemes algebrában is gondolkodni?

Az SQL azt mondja meg, **mit** kérsz; a relációs algebra azt, hogy ezt **milyen lépésekből** lehet előállítani. Amikor a DBMS megkap egy SQL lekérdezést, először lefordítja egy algebrai **kifejezésfára**, aztán ezt a fát alakítja át gyorsabbra. Ha te is látod a fát, sokkal könnyebben írsz bonyolult lekérdezést, és jobban érted, miért lassú valami.

**Analógia – recept és főzés:** az SQL a vendég rendelése („kérek egy rántott sajtot rizzsel”), az algebra a konyhai munkafolyamat („vágd → panírozd → süsd; közben főzd a rizst → tálald együtt”). Ugyanazt a rendelést többféle munkafolyamattal is elő lehet állítani; a jó szakács (az optimalizáló) a leggyorsabbat választja.

## A mintaadatbázis

<details>
<summary>A mintaadatbázis létrehozása (SQL)</summary>

<!-- sql-setup: egyetem -->

</details>

## Fordítás lépésről lépésre

**Kérdés:** _Kik (név) vették fel az Adatbázisok (ADB) tárgyat, és 4-es vagy jobb jegyet kaptak?_

### Algebrában, belülről kifelé

1. Szűrjük a jelentkezéseket: σ<sub>kod='ADB' ∧ jegy≥4</sub>(jelentkezesek)
2. Kapcsoljuk a hallgatókhoz: hallgatok ⋈ (1. eredmény)
3. Vetítsük a névre: π<sub>nev</sub>(2. eredmény)

Egyben: **π<sub>nev</sub>(hallgatok ⋈ σ<sub>kod='ADB' ∧ jegy≥4</sub>(jelentkezesek))**

### Kifejezésfaként

```text
            π nev
              │
              ⋈  (neptun = neptun)
            ┌─┴──────────────┐
        hallgatok      σ kod='ADB' ∧ jegy≥4
                              │
                        jelentkezesek
```

A fát **alulról felfelé** olvasd: a levelek a táblák, minden csomópont egy művelet, a gyökérnél van a végeredmény.

### SQL-ben

```sql run
SELECT h.nev                                   -- π nev
FROM hallgatok h
JOIN jelentkezesek j ON j.neptun = h.neptun    -- ⋈
WHERE j.kod = 'ADB' AND j.jegy >= 4;           -- σ
```

| Algebra            | SQL                                     |
| ------------------ | --------------------------------------- |
| σ (szelekció)      | `WHERE`                                 |
| π (projekció)      | a `SELECT` utáni oszloplista            |
| ⋈ (összekapcsolás) | `JOIN … ON …`                           |
| × (szorzat)        | `CROSS JOIN` (vagy vessző a `FROM`-ban) |
| ρ (átnevezés)      | `AS`                                    |
| ∪, ∩, −            | `UNION`, `INTERSECT`, `EXCEPT`          |

## Halmaz vagy multihalmaz?

A tiszta relációs algebrában egy reláció **halmaz**: nincs benne két egyforma sor. Az SQL viszont **multihalmazokkal** (angolul _bag_) dolgozik: az ismétlődéseket **megtartja**, hacsak nem kéred kifejezetten az eltávolításukat.

```sql run
-- Projekció: melyik városokból jönnek a hallgatók? (SQL: ismétlődéssel)
SELECT varos FROM hallgatok;
```

```sql run
-- Az algebrai π valójában ez: ismétlődések nélkül
SELECT DISTINCT varos FROM hallgatok;
```

Miért nem szűri ki az SQL automatikusan? Mert az ismétlődések kiszűrése **drága** (rendezni vagy hash-elni kell), és sokszor éppen a darabszám érdekes (pl. hány jelentkezés volt).

### UNION kontra UNION ALL

- `UNION` = halmazos unió: **kiszűri** az ismétlődéseket.
- `UNION ALL` = multihalmazos unió: egyszerűen **egymás után fűzi** a két eredményt.

```sql run
-- Tárgykódok, amelyekre 3. féléves tárgyként VAGY jelentkezésként hivatkozunk
SELECT kod FROM targyak WHERE felev = 3
UNION
SELECT kod FROM jelentkezesek;
```

```sql run
-- Ugyanez UNION ALL-lal: minden előfordulás megmarad
SELECT kod FROM targyak WHERE felev = 3
UNION ALL
SELECT kod FROM jelentkezesek;
```

**Szabály:** ha tudod, hogy nem lehet ismétlődés, vagy éppen kellenek az ismétlődések, `UNION ALL` – gyorsabb. A halmazműveleteknél a két oldal **oszlopainak száma és típusa** egyezzen (az algebrában: „unió-kompatibilis” relációk).

## Metszet és különbség

```sql run
-- ∩: Azok a hallgatók, akik ADB-t ÉS PROG-ot is felvettek
SELECT neptun FROM jelentkezesek WHERE kod = 'ADB'
INTERSECT
SELECT neptun FROM jelentkezesek WHERE kod = 'PROG';
```

```sql run
-- −: Azok a hallgatók, akik semmilyen tárgyat nem vettek fel
SELECT neptun FROM hallgatok
EXCEPT
SELECT neptun FROM jelentkezesek;
```

Figyeld meg: a különbség **nem szimmetrikus**. `A − B` azokat adja, amik A-ban benne vannak, de B-ben nem; `B − A` egészen mást.

**Analógia:** két bevásárlólista. Metszet: amit mindketten felírtatok. Különbség: ami az enyémen rajta van, de a tiéden nincs.

## A relációs osztás: „aki mindet…”

A legtrükkösebb kérdések így szólnak: _„Ki vette fel az **összes** 3. féléves tárgyat?”_ Ez a relációs algebra **osztás** (÷) művelete. SQL-ben nincs rá külön kulcsszó, de háromféleképpen is megírható.

A 3. féléves tárgyak: ADB és DIG. Kiss Anna (ABC123) és Szabó Dani (DEF456) mindkettőt felvette – tehát nekik kell megjelenniük.

### 1. módszer: számolással

„Annyi 3. féléves tárgyat vett fel, ahány 3. féléves tárgy van.”

```sql run
SELECT j.neptun
FROM jelentkezesek j
JOIN targyak t ON t.kod = j.kod
WHERE t.felev = 3
GROUP BY j.neptun
HAVING COUNT(*) = (SELECT COUNT(*) FROM targyak WHERE felev = 3);
```

### 2. módszer: dupla tagadással (NOT EXISTS)

Fordítsuk meg a mondatot: „Nincs olyan 3. féléves tárgy, amelyet ne vett volna fel.”

```sql run
SELECT h.neptun, h.nev
FROM hallgatok h
WHERE NOT EXISTS (                 -- nincs olyan tárgy…
  SELECT 1 FROM targyak t
  WHERE t.felev = 3
    AND NOT EXISTS (               -- …amelyre ne jelentkezett volna
      SELECT 1 FROM jelentkezesek j
      WHERE j.neptun = h.neptun AND j.kod = t.kod));
```

Ez a matematikai logika „∀ = ¬∃¬” átírása: _minden_ tárgyat felvett ⇔ _nem létezik_ olyan tárgy, amelyet _nem_ vett fel.

### 3. módszer: különbséggel

„A 3. féléves tárgyak halmazából kivonom, amit felvett – ha üres marad, mindet felvette.”

```sql run
SELECT h.neptun, h.nev
FROM hallgatok h
WHERE NOT EXISTS (
  SELECT kod FROM targyak WHERE felev = 3
  EXCEPT
  SELECT kod FROM jelentkezesek j WHERE j.neptun = h.neptun);
```

Mindhárom módszer ugyanazt adja. Melyiket válaszd? A számolás a legkönnyebben olvasható; a `NOT EXISTS` a legáltalánosabb (akkor is működik, ha a jelentkezésekben lehetne ismétlődés); az `EXCEPT` a legközelebb áll a halmazos gondolkodáshoz.

## Egyenértékű kifejezések – az optimalizáló trükkjei

Két kifejezés **egyenértékű**, ha minden adatbázison ugyanazt az eredményt adják. A DBMS ezt kihasználja: az általad írt kifejezést egy olcsóbb, de egyenértékű alakra írja át. A legfontosabb szabályok:

1. **Szelekció lefelé tolása:** σ<sub>F</sub>(R ⋈ S) = σ<sub>F</sub>(R) ⋈ S, ha F csak R oszlopaira hivatkozik. Előbb szűrünk, utána kapcsolunk – így sokkal kevesebb sort kell összepárosítani.
2. **Szelekciók összevonása:** σ<sub>F</sub>(σ<sub>G</sub>(R)) = σ<sub>F ∧ G</sub>(R).
3. **Projekció korai alkalmazása:** a fölösleges oszlopokat minél előbb eldobjuk.
4. **Az összekapcsolás felcserélhető és csoportosítható:** (R ⋈ S) ⋈ T = R ⋈ (S ⋈ T) – a sorrendet az optimalizáló választja.

**Számpélda:** a hallgatok táblában 10 000 sor van, a jelentkezesek táblában 100 000, és csak 500 ADB-jelentkezés van. Ha előbb mindent összekapcsolunk, és csak utána szűrünk, 100 000 sort párosítunk; ha előbb szűrünk, csak 500-at. **Kétszázszor kevesebb munka**, ugyanaz az eredmény.

Ezért nem kell azon izgulnod, hogy a `WHERE` feltételt „jó helyre” írd: az optimalizáló a fát átrendezi. Azt viszont neked kell eldöntened, hogy **mit** kérsz – ezt az optimalizáló nem tudja kitalálni.

## Gyakori hibák

- **Unió nem kompatibilis oszlopokkal:** `SELECT nev FROM hallgatok UNION SELECT kredit FROM targyak` – szöveg és szám nem fűzhető össze.
- **`EXCEPT` helyett `<>`:** a „nem vette fel az ADB-t” nem azonos a `WHERE kod <> 'ADB'` szűréssel (az azokat is visszaadja, akik ADB mellett mást is felvettek!).
- **Osztás `IN`-nel:** a `WHERE kod IN ('ADB', 'DIG')` azt adja, aki **legalább egyet** felvett, nem azt, aki **mindet**.

## Összefoglalás

- A DBMS az SQL-t **kifejezésfára** fordítja: σ = `WHERE`, π = `SELECT`, ⋈ = `JOIN`.
- Az SQL **multihalmazokkal** dolgozik: `DISTINCT`, illetve `UNION` (szűr) kontra `UNION ALL` (megtart).
- `INTERSECT` = metszet, `EXCEPT` = különbség (nem szimmetrikus).
- Az **„aki mindet”** kérdés a relációs osztás: számolással, dupla `NOT EXISTS`-szel vagy `EXCEPT`-tel oldható meg.
- Az optimalizáló **egyenértékű átírásokkal** (pl. a szelekció lefelé tolásával) gyorsít.

## A lecke feladata

Kérd le azoknak a hallgatóknak a **Neptun-kódját**, akik **nem** vették fel az Adatbázisok (`ADB`) tárgyat – azokat is beleértve, akik semmit sem vettek fel! Használj halmazkülönbséget (`EXCEPT`). (A sorrend nem számít.)

Vigyázz: a `WHERE kod <> 'ADB'` **nem** jó megoldás – gondold végig, miért!

```sql starter required
SELECT neptun FROM hallgatok
-- ide jön a különbség
;
```

<details>
<summary>Megoldás</summary>

```sql solution
SELECT neptun FROM hallgatok
EXCEPT
SELECT neptun FROM jelentkezesek WHERE kod = 'ADB';
```

</details>
