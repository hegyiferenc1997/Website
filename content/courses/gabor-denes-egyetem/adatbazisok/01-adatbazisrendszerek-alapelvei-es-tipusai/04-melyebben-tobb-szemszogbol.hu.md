---
title: Mélyebben – egy adatbázis több szemszögből
summary: Ugyanaz az adatbázis a hallgató, az ügyintéző, a fejlesztő és az adatbázis-adminisztrátor szemével; táblázatkezelő kontra DBMS egy valódi forgatókönyvön; az adatfüggetlenség és az adatszótár élőben, SQL-lel kipróbálva.
minutes: 30
---

## Amit ebben a leckében megtanulsz

- hogyan **lát mást és mást** ugyanabból az adatbázisból a hallgató, az ügyintéző, a fejlesztő és a DBA,
- miért **nem elég egy Excel-tábla**, ha sokan, egyszerre, sok adattal dolgoznak – egy konkrét forgatókönyvön végigkövetve,
- hogyan működik az **adatfüggetlenség** a gyakorlatban (kipróbálod!),
- hogyan **írja le önmagát** az adatbázis (adatszótár, `information_schema`),
- melyek a leggyakoribb **tévhitek** az adatbázisokról.

Ez a lecke az előző három lecke fogalmait (adat, DBMS, háromszintű architektúra, típusok) fűzi össze, és ad hozzájuk kézzelfogható példákat. Nem kell hozzá még SQL-tudás: minden futtatható példa mellé odaírjuk, mit csinál.

## Ugyanaz az adat – négy ember, négy nézőpont

Gondolj egy egyetemi tanulmányi rendszerre (mint a Neptun). Egyetlen adatbázis van mögötte, mégis mindenki mást lát és mást akar tőle:

| Ki?                            | Mit lát?                                       | Mit csinál vele?                                | Mi fontos neki?                       |
| ------------------------------ | ---------------------------------------------- | ----------------------------------------------- | ------------------------------------- |
| **Hallgató**                   | a saját tárgyait, jegyeit, órarendjét          | tárgyat vesz fel, vizsgára jelentkezik          | gyors legyen, és ne vesszen el semmi  |
| **Tanulmányi ügyintéző**       | egy szak összes hallgatóját, a jegyeket        | jegyet javít, kimutatást készít                 | pontos, ellentmondásmentes adatok     |
| **Fejlesztő**                  | a táblákat, oszlopokat, kapcsolatokat          | lekérdezéseket és programokat ír                | érthető szerkezet, stabil felület     |
| **Adatbázis-adminisztrátor**   | a lemezeket, mentéseket, jogosultságokat       | ment, hangol, jogot oszt, frissít               | biztonság, rendelkezésre állás, sebesség |

Ez pontosan a **háromszintű architektúra** a gyakorlatban:

- a hallgató és az ügyintéző a **külső szinten** van – mindketten egy-egy _nézetet_ látnak;
- a fejlesztő a **fogalmi szinten** gondolkodik – táblákban és kapcsolatokban;
- a DBA a **belső szinttel** is foglalkozik – fájlokkal, lemezekkel, indexekkel.

**Analógia – a színház:** a néző a színpadot látja (külső szint), a rendező a forgatókönyvet és a jeleneteket (fogalmi szint), a díszletmunkás a csigákat, kötélzetet és a raktárat (belső szint). Ha a díszletmunkás új csigát szerel fel, a néző ebből semmit sem vesz észre – csak azt, hogy gördülékenyebb az előadás. Ez az **adatfüggetlenség**.

## Forgatókönyv: miért nem elég egy táblázat?

Egy hallgatói önkormányzat eddig egy közös táblázatfájlban tartotta nyilván a rendezvényekre jelentkezőket. Nézzük, mi történik, amikor nő a forgalom!

1. **Egyszerre ketten szerkesztik.** Anna és Béla is megnyitja a fájlt, mindketten beírnak egy-egy új jelentkezőt az 51. sorba, majd mentenek. A később mentő felülírja a másikat: **elveszett egy jelentkezés**. A DBMS ezt **konkurenciakezeléssel** (zárolás, tranzakciók) oldja meg: mindkét beszúrás megmarad.
2. **Ugyanaz a hallgató háromszor.** Egyszer „Kiss Anna”, egyszer „Kiss  Anna” (két szóközzel), egyszer „kiss anna”. A táblázat nem tiltja; a DBMS-ben **egyedi kulccsal** (pl. Neptun-kód) ez megakadályozható.
3. **Hibás adat.** Valaki a létszám oszlopba azt írja: „sok”. A táblázat elfogadja; a DBMS **típusellenőrzéssel** (`INT`) visszautasítja.
4. **Ki mit láthat?** A táblázatot vagy látja valaki, vagy nem. A DBMS-ben megadható, hogy a szervező lássa az e-mail-címeket, a többiek csak a neveket (**jogosultságok, nézetek**).
5. **Leállt a gép mentés közben.** A félig mentett fájl akár olvashatatlan is lehet. A DBMS a **naplóból** helyreállítja az utolsó ép állapotot (erről a 9. témakörben lesz szó).
6. **Egymillió sor.** A táblázatkezelő belassul vagy el sem indul; a DBMS **indexekkel** ezredmásodpercek alatt megtalál egy sort.

| Szempont               | Táblázatkezelő            | DBMS                                   |
| ---------------------- | ------------------------- | -------------------------------------- |
| Egyidejű szerkesztés   | korlátozott, ütközések    | tranzakciók, zárolás                   |
| Adattípusok kikényszerítése | nincs vagy gyenge    | szigorú (`INT`, `DATE`, `CHECK`)       |
| Ismétlődés tiltása     | kézzel                    | elsődleges és egyedi kulcs             |
| Jogosultság            | fájlszintű                | tábla-, oszlop-, sor-szintű            |
| Hibatűrés              | utolsó mentés             | napló, helyreállítás, replikáció       |
| Méret                  | néhány százezer sor       | milliárdnyi sor                        |

Ez **nem** azt jelenti, hogy a táblázatkezelő rossz! Egy gyors számításra, egyszemélyes listára tökéletes. A kérdés mindig az, hogy **hányan, mennyi adattal, mennyire kritikusan** dolgoznak vele.

## Az adatbázis élőben

Most egy igazi PostgreSQL-t indítasz a böngésződben. A mintaadatbázisban hallgatók, tárgyak és jelentkezések vannak.

<details>
<summary>A mintaadatbázis létrehozása (SQL)</summary>

<!-- sql-setup: egyetem -->

</details>

Minden futtatás egy friss másolaton indul – nyugodtan kísérletezz.

### 1. A külső szint: egy nézet a portásnak

A portásnak csak a hallgató neve és Neptun-kódja kell, a születési dátum és a város nem tartozik rá. Erre való a **nézet** (`VIEW`): egy elmentett lekérdezés, amely úgy viselkedik, mint egy tábla.

```sql run
-- Nézet: a portás csak ezt a két oszlopot látja
CREATE VIEW portas_nezet AS
SELECT neptun, nev FROM hallgatok;

SELECT * FROM portas_nezet;
```

### 2. Logikai adatfüggetlenség: bővül a tábla, a nézet ugyanaz marad

Tegyük fel, hogy a fejlesztők új oszlopot adnak a `hallgatok` táblához (e-mail-cím). A portás nézetének ettől **semmit sem kell tudnia** – ugyanúgy működik:

```sql run
CREATE VIEW portas_nezet AS
SELECT neptun, nev FROM hallgatok;

-- A fogalmi séma megváltozik: új oszlop
ALTER TABLE hallgatok ADD COLUMN email VARCHAR(80);

-- A külső szint (a nézet) változatlanul működik
SELECT * FROM portas_nezet;
```

Egy fájlalapú programnál (ahol a program „tudja”, hogy a név a 7. bájttól a 66.-ig tart) egy új mező beszúrása minden programot elrontana. Itt nem.

### 3. Fizikai adatfüggetlenség: index, és a lekérdezés ugyanaz

Egy index létrehozása a **belső szintet** változtatja meg. A lekérdezés szövege és eredménye pontosan ugyanaz marad, legfeljebb gyorsabb lesz:

```sql run
-- Belső szint: új index a városra
CREATE INDEX idx_hallgatok_varos ON hallgatok (varos);

-- A lekérdezés változatlan
SELECT nev FROM hallgatok WHERE varos = 'Budapest';
```

### 4. Az adatszótár: az adatbázis leírja önmagát

A DBMS nemcsak az adatokat tárolja, hanem az **adatokról szóló adatokat** (metaadat) is: milyen táblák, oszlopok, típusok vannak. Ezt is SQL-lel kérdezheted le, az `information_schema` nevű „katalógusból”:

```sql run
-- Milyen oszlopai vannak a hallgatok táblának, és milyen típusúak?
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'hallgatok'
ORDER BY ordinal_position;
```

Figyeld meg: az `is_nullable` oszlop megmutatja, hol kötelező kitölteni a mezőt (`NO`) – ezeket a szabályokat a DBMS minden beszúrásnál ellenőrzi.

```sql run
-- Milyen táblák vannak az adatbázisban?
SELECT table_name, table_type
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

### 5. A DBMS őrzi a szabályokat

Próbálj meg egy hibás adatot beszúrni! A jegy csak 1 és 5 között lehet (ezt egy `CHECK` szabály írja elő):

```sql run
-- Ez sikerül: érvényes jegy
INSERT INTO jelentkezesek VALUES ('EFG567', 'PROG', 4);
SELECT * FROM jelentkezesek WHERE neptun = 'EFG567';
```

Most kattints a **Szerkesztés** gombra, írd át a 4-es jegyet 7-esre, és futtasd újra: a DBMS hibaüzenettel visszautasítja. Egy táblázatkezelő ezt szó nélkül elfogadná.

## Gyakori tévhitek

<details>
<summary>„Az adatbázis egy program, amit telepítek.”</summary>

Pontatlan. Az **adatbázis** maga az adatgyűjtemény; a **DBMS** a program, amely kezeli (PostgreSQL, MySQL, Oracle…). Egy DBMS sok adatbázist kezelhet, és egy adatbázis (elvben) átköltöztethető egy másik DBMS alá.

</details>

<details>
<summary>„Az SQL egy adatbázis.”</summary>

Nem: az SQL egy **nyelv**, amellyel a relációs adatbázisokkal „beszélgetünk”. A „MySQL” vagy „PostgreSQL” nevében azért van benne, mert ezt a nyelvet értik.

</details>

<details>
<summary>„A NoSQL jobb, mert modernebb.”</summary>

Nem jobb vagy rosszabb, hanem **más feladatra** való. A relációs adatbázis a szigorú szerkezetű, összefüggő adatokban és a tranzakciókban erős; a NoSQL a rugalmas szerkezetben, a vízszintes skálázásban. Sok rendszer mindkettőt használja (11. témakör).

</details>

<details>
<summary>„Ha van mentésem, nem kell napló.”</summary>

A mentés egy **időpillanat**; a napló a két mentés közötti **összes változás**. Egy éjjeli mentés mellett napló nélkül egy délutáni hiba után a teljes napi munka elveszne.

</details>

## Esettanulmány: tárgyfelvételi roham

Hétfő reggel 8:00-kor megnyílik a tárgyfelvétel, és 10 000 hallgató egyszerre kattint. Mit kell ilyenkor a DBMS-nek megoldania?

- **Konkurencia:** ha egy kurzuson 1 hely maradt, és ketten egyszerre kattintanak, csak az egyikük kaphatja meg. A tranzakciókezelő ezt garantálja (8. témakör: ACID).
- **Teljesítmény:** a „van-e még hely?” lekérdezésnek indexek nélkül minden alkalommal végig kellene olvasnia az összes jelentkezést.
- **Hibatűrés:** ha 8:03-kor leáll egy szerver, a már rögzített jelentkezések nem veszhetnek el (napló, replikáció).
- **Jogosultság:** a hallgató csak a saját jelentkezéseit módosíthatja.

Minden, amit ebben a tárgyban tanulsz, valahol ebben a nyolc percben segít.

## Összefoglalás

- Ugyanazt az adatbázist mindenki más **nézetből** látja – ez a háromszintű architektúra a gyakorlatban.
- A DBMS a táblázatkezelőhöz képest **konkurenciát, típusellenőrzést, kulcsokat, jogosultságot, helyreállítást és skálázást** ad.
- **Logikai adatfüggetlenség:** a séma bővülése nem rontja el a nézeteket. **Fizikai adatfüggetlenség:** egy index nem változtat a lekérdezésen.
- Az **adatszótár** (`information_schema`) metaadatokat tárol, és SQL-lel lekérdezhető.

## A lecke feladata

A tanulmányi osztály kér egy **nézetet** `ugyintezo_nezet` néven, amely minden hallgatóról megmutatja a **Neptun-kódját, nevét és szakját** (ebben a sorrendben), de a várost és a születési dátumot nem. Hozd létre a nézetet! (Az ellenőrzés a nézetből kérdez le, Neptun-kód szerint rendezve.)

Tipp: nézd meg a fenti portás-nézet példát, és bővítsd egy oszloppal.

```sql starter required
-- Hozd létre az ugyintezo_nezet nézetet!
CREATE VIEW ugyintezo_nezet AS
SELECT ...
```

<details>
<summary>Megoldás</summary>

```sql solution
CREATE VIEW ugyintezo_nezet AS
SELECT neptun, nev, szak FROM hallgatok;
```

</details>

```sql test
SELECT * FROM ugyintezo_nezet ORDER BY neptun;
```
