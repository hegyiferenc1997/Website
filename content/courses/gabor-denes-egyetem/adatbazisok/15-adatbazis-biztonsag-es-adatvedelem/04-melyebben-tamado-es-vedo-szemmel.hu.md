---
title: Mélyebben – támadó és védő szemmel
summary: Egy kitalált adatszivárgás anatómiája lépésről lépésre és a többrétegű védelem; fenyegetésmodellezés STRIDE-dal; a befecskendezés kevésbé ismert formái (másodrendű, oszlopnév és rendezés, LIKE-helyettesítők) és védekezés format('%I')-vel és fehérlistával; adattakarékosság, megőrzési idő és k-anonimitás SQL-lel, valamint adatmaszkolás nézettel.
minutes: 45
---

## Amit ebben a leckében megtanulsz

- hogyan épül fel lépésről lépésre egy **valósághű adatszivárgás**, és melyik védelmi réteg hol állíthatta volna meg,
- hogyan **gondold végig módszeresen** a fenyegetéseket (STRIDE),
- a befecskendezés **kevésbé ismert** formáit, amelyek ellen a paraméterezés önmagában nem elég,
- hogyan valósítsd meg az **adattakarékosságot** és a **megőrzési időt** SQL-lel,
- mi a **k-anonimitás**, és hogyan ellenőrizd egy kimutatáson,
- hogyan **maszkolj** adatot nézettel.

## 1. Egy incidens anatómiája

Az alábbi történet kitalált, de minden lépése valódi incidensekben is előfordult. Egy kis webáruház:

1. **Belépési pont.** A termékkeresőben a fejlesztő szövegösszefűzéssel rakta össze a lekérdezést. A támadó a keresőmezőbe `' UNION SELECT email, jelszo_hash FROM felhasznalok --` szöveget ír, és a találati listában megjelennek az e-mail-címek és a jelszó-hash-ek.
2. **Túl sok jog.** Az alkalmazás a `postgres` szuperfelhasználóval csatlakozott, így a támadó az összes táblát olvashatja, sőt saját fiókot is létrehoz magának.
3. **Gyenge jelszótárolás.** A jelszavak só nélküli, gyors hash-sel voltak tárolva. A gyakori jelszavakat előre kiszámolt táblázatból percek alatt visszafejti.
4. **Felesleges adatok.** Az áruház 8 évre visszamenőleg minden vásárló teljes címét, telefonszámát és születési dátumát tárolta – noha a számlázáshoz ennek töredéke kellett volna.
5. **Senki sem vette észre.** Nem volt naplózás és riasztás a szokatlan lekérdezésekre; a szivárgás hónapokkal később, egy fórumon felbukkanó adatbázis-dumpból derült ki.

### Hol lehetett volna megállítani?

| Lépés | Védelmi réteg                                   | Témakör |
| ----- | ----------------------------------------------- | ------- |
| 1.    | paraméterezett lekérdezések, bemenet-ellenőrzés | 15/1    |
| 2.    | legkisebb jogosultság, külön alkalmazásfiók     | 10      |
| 3.    | lassú, sózott jelszó-hash (bcrypt, Argon2)      | 15/2    |
| 4.    | adattakarékosság, megőrzési idő, álnevesítés    | 15/3, ez a lecke |
| 5.    | naplózás, riasztás, rendszeres felülvizsgálat   | 10/4    |

Ez a **mélységi védelem** (defense in depth) elve: nem egyetlen tökéletes falra bízzuk magunkat, hanem **több, egymástól független** rétegre. Ha az egyik átszakad, a következő még megállíthatja – vagy legalább csökkenti a kárt.

**Analógia:** egy vár nemcsak falból áll, hanem vizesárokból, felvonóhídból, őrökből, belső várból és kincstárból. Aki átjut a falon, még nincs a kincsnél.

## 2. Fenyegetésmodellezés STRIDE-dal

A STRIDE egy ellenőrzőlista: hat támadástípus, amelyeket egy rendszer minden részénél végiggondolunk.

| Betű | Fenyegetés                         | Példa az adatbázisnál                               | Védekezés                                  |
| ---- | ---------------------------------- | --------------------------------------------------- | ------------------------------------------ |
| S    | **S**poofing – megszemélyesítés    | ellopott jelszóval belépés                          | erős hitelesítés, kétlépcsős azonosítás    |
| T    | **T**ampering – adatmódosítás      | a jegyek utólagos átírása                           | jogosultságok, napló, ellenőrzőösszeg      |
| R    | **R**epudiation – letagadás        | „nem én töröltem”                                   | személyes fiókok, módosíthatatlan napló    |
| I    | **I**nformation disclosure – kiszivárgás | befecskendezés, titkosítatlan mentés          | paraméterezés, titkosítás, maszkolás       |
| D    | **D**enial of service – szolgáltatásmegtagadás | lassú lekérdezések tömegével túlterhelés | időkorlát, sebességkorlát, indexek       |
| E    | **E**levation of privilege – jogosultság-emelés | a SECURITY DEFINER függvény eltérítése | `search_path` rögzítése, szűk jogok      |

## 3. A befecskendezés kevésbé ismert formái

<details>
<summary>A mintaadatbázis létrehozása (SQL)</summary>

<!-- sql-setup: egyetem -->

</details>

### Oszlopnév és rendezési irány: ezeket nem lehet paraméterezni!

Egy táblázatos oldalon a felhasználó kattintással választhatja meg, melyik oszlop szerint rendezzen. A paraméterek csak **értékek** helyén állhatnak, oszlopnév vagy `ASC`/`DESC` helyén nem. Ha a program összefűzéssel rakja be az oszlopnevet, újra nyitva az ajtó.

A megoldás két lépés: **fehérlista** (csak az előre engedélyezett oszlopok), és az azonosító biztonságos **idézése** a `format('%I', …)` függvénnyel.

```sql run
-- Biztonságos dinamikus rendezés: fehérlista + format('%I') az azonosítóra
CREATE FUNCTION hallgatok_rendezve(oszlop TEXT) RETURNS SETOF hallgatok
LANGUAGE plpgsql AS $$
BEGIN
  IF oszlop NOT IN ('nev', 'felev', 'varos') THEN      -- fehérlista
    RAISE EXCEPTION 'nem engedélyezett oszlop: %', oszlop;
  END IF;
  RETURN QUERY EXECUTE format('SELECT * FROM hallgatok ORDER BY %I', oszlop);
END $$;

SELECT neptun, nev, felev FROM hallgatok_rendezve('felev');
```

Próbáld ki: a Szerkesztés gombbal hívd meg így: `hallgatok_rendezve('nev; DROP TABLE hallgatok')` – a fehérlista azonnal megállítja. A `%I` önmagában is idézőjelek közé tenné a „furcsa” nevet (`"nev; DROP TABLE hallgatok"`), így az nem futna le parancsként – de a fehérlista a hibaüzenetet is érthetőbbé teszi.

### Értékek a dinamikus SQL-ben: USING

Ha a dinamikus lekérdezésben **érték** is van, azt ne fűzd bele a szövegbe, hanem add át paraméterként a `USING` kulcsszóval (`$1`, `$2` helyére kerül):

```sql run
CREATE FUNCTION varosbol(v TEXT) RETURNS SETOF hallgatok
LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY EXECUTE 'SELECT * FROM hallgatok WHERE varos = $1' USING v;
END $$;

-- A „támadás” itt egyszerűen egy furcsa városnév, amire nincs találat
SELECT nev FROM varosbol($$Budapest' OR '1'='1$$);
```

Üres eredmény: a `' OR '1'='1` nem parancs lett, hanem a keresett városnév része.

### Másodrendű befecskendezés

A támadó a regisztrációkor felhasználónévnek ezt adja meg: `anna' --`. A regisztrációs űrlap paraméterezett, így a név **ártalmatlanul** bekerül az adatbázisba. Hetekkel később egy **másik** program (pl. egy éjszakai riport) kiolvassa a nevet, és **összefűzéssel** beépíti egy új lekérdezésbe – ekkor sül el. **Tanulság:** az adatbázisból olvasott adat sem „megbízható” – minden lekérdezés legyen paraméterezett, függetlenül attól, honnan jön az érték.

### LIKE-helyettesítők

Paraméterezett keresésnél is meglepetést okozhat, ha a felhasználó `%` vagy `_` jelet ír: `WHERE nev LIKE '%' || $1 || '%'` mellett a `%` beírása **minden** sort visszaad. Ez nem befecskendezés, de adatot szivárogtathat (pl. „keress e-mail-címre” funkció), és lassú, teljes táblaolvasást okozhat. Megoldás: a helyettesítő karakterek kiszűrése (escape), és legalább néhány karakteres keresőkifejezés megkövetelése.

## 4. Adattakarékosság és megőrzési idő SQL-lel

A legjobb védelem az az adat, **amit nem tárolunk**. A GDPR két alapelve – az adattakarékosság és a korlátozott tárolhatóság – a gyakorlatban így néz ki:

```sql run
-- Napló, amelyben minden bejelentkezés IP-címe benne van
CREATE TABLE belepesek (neptun CHAR(6), mikor DATE, ip TEXT);
INSERT INTO belepesek VALUES
  ('ABC123', '2024-01-10', '192.0.2.10'), ('ABC123', '2025-02-01', '192.0.2.11'),
  ('BCD234', '2024-06-15', '198.51.100.7'), ('BCD234', '2025-02-20', '198.51.100.8');

-- Megőrzési szabály: 1 évnél régebbi sorokból az IP-cím törlése (a statisztika megmarad)
UPDATE belepesek SET ip = NULL WHERE mikor < DATE '2025-03-01' - INTERVAL '1 year';

SELECT * FROM belepesek ORDER BY mikor;
```

Egy valódi rendszerben ezt egy **időzített feladat** futtatja naponta. A szabály dokumentálva van („az IP-címet 1 évig őrizzük biztonsági célból”), és bárki ellenőrizheti.

## 5. k-anonimitás: elég-e kivenni a nevet?

Egy kimutatásból kivettük a neveket – névtelen-e már? Nem feltétlenül! Ha egy sorban „Szeged, 2004-ben született, gazdaságinformatikus” áll, és ilyen hallgató csak egy van, akkor ő **azonosítható**. A **k-anonimitás** azt jelenti: minden sor legalább **k** emberre illik a „félig azonosító” adatok (pl. város, születési év, szak) alapján.

```sql run
-- Hány hallgató osztozik ugyanazon a (város, szak, születési év) kombináción?
SELECT varos, szak, EXTRACT(YEAR FROM szuletett) AS ev, COUNT(*) AS hany_ember
FROM hallgatok
GROUP BY varos, szak, ev
ORDER BY hany_ember, varos;
```

Mindegyik csoportban 1 ember van: k = 1, vagyis **mindenki azonosítható**! Megoldás az **általánosítás**: kevésbé pontos adatot közlünk.

```sql run
-- Általánosítva: város helyett "Budapest / vidék", születési év helyett évtized
SELECT CASE WHEN varos = 'Budapest' THEN 'Budapest' ELSE 'vidék / ismeretlen' END AS hely,
       (EXTRACT(YEAR FROM szuletett)::INT / 10) * 10 AS evtized,
       COUNT(*) AS hany_ember
FROM hallgatok
GROUP BY hely, evtized
ORDER BY hely, evtized;
```

Most már egyes csoportokban több ember is van. Valódi adatoknál (több ezer sor) a cél pl. k ≥ 5: amelyik csoport ennél kisebb, azt tovább általánosítjuk vagy kihagyjuk a kimutatásból.

## 6. Maszkolás nézettel

Az ügyfélszolgálatnak látnia kell, hogy **melyik** e-mail-címről van szó, de a teljes címet nem. A **maszkolt nézet** a valódi adatot csak részben mutatja meg – a lecke feladatában ilyet készítesz.

## Összefoglalás

- **Mélységi védelem:** több független réteg (paraméterezés, jogosultság, hash, adattakarékosság, naplózás).
- **STRIDE:** megszemélyesítés, módosítás, letagadás, kiszivárgás, szolgáltatásmegtagadás, jogosultság-emelés.
- Oszlopnevet és rendezési irányt nem lehet paraméterezni: **fehérlista** + `format('%I')`; értékekre `EXECUTE … USING`.
- A **másodrendű** befecskendezés miatt az adatbázisból olvasott adat sem megbízható.
- **Adattakarékosság** és **megőrzési idő**: amit nem tárolsz, az nem szivároghat ki.
- **k-anonimitás:** a név kivétele nem elég; általánosítással érjük el, hogy minden sor legalább k emberre illjen.

## A lecke feladata

A kiinduló kód létrehozza a `felhasznalok` táblát. Készíts egy `ugyfelszolgalat_nezet` nevű **nézetet**, amely minden felhasználóról a nevét (`nev`) és a **maszkolt** e-mail-címét (`email`) mutatja: az e-mail **első karaktere**, utána **három csillag** (`***`), majd a cím a **`@` jeltől** a végéig. Például `anna.kiss@pelda.hu` → `a***@pelda.hu`.

Tipp: `LEFT(szöveg, 1)`, `POSITION('@' IN szöveg)` és `SUBSTRING(szöveg FROM kezdőpozíció)`, összefűzés `||`-sel.

```sql starter required
CREATE TABLE felhasznalok (id INT PRIMARY KEY, nev VARCHAR(60), email VARCHAR(80));
INSERT INTO felhasznalok VALUES
  (1, 'Kiss Anna',  'anna.kiss@pelda.hu'),
  (2, 'Nagy Béla',  'bela@egyetem.hu'),
  (3, 'Tóth Cili',  'cili.toth@posta.hu');

CREATE VIEW ugyfelszolgalat_nezet AS
SELECT nev, email
FROM felhasznalok;
```

<details>
<summary>Megoldás</summary>

```sql solution
CREATE TABLE felhasznalok (id INT PRIMARY KEY, nev VARCHAR(60), email VARCHAR(80));
INSERT INTO felhasznalok VALUES
  (1, 'Kiss Anna',  'anna.kiss@pelda.hu'),
  (2, 'Nagy Béla',  'bela@egyetem.hu'),
  (3, 'Tóth Cili',  'cili.toth@posta.hu');

CREATE VIEW ugyfelszolgalat_nezet AS
SELECT nev,
       LEFT(email, 1) || '***' || SUBSTRING(email FROM POSITION('@' IN email)) AS email
FROM felhasznalok;
```

</details>

```sql test
SELECT nev, email FROM ugyfelszolgalat_nezet ORDER BY nev;
```
