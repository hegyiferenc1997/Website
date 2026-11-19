---
title: Mélyebben – tervezzünk tárolót számokkal
summary: Egy adatbázis-szerver tárolójának méretezése lépésről lépésre – adatnövekedés előrejelzése, RAID-szint választása kapacitás, írási büntetés és újraépítési idő alapján, IOPS-számítás, mentési ablak és megőrzési tárhely (nagyapa–apa–fiú séma), valamint az RPO/RTO célokhoz illő megoldás – SQL-es kalkulátorokkal.
minutes: 40
---

## Amit ebben a leckében megtanulsz

- hogyan **becsüld meg**, mekkora tárhely kell 3 év múlva,
- hogyan válassz **RAID-szintet** nemcsak kapacitás, hanem **írási teljesítmény** és **újraépítési kockázat** alapján,
- mi az **írási büntetés** (write penalty), és hogyan számolj vele IOPS-t,
- mennyi idő egy **mentés** és egy **visszaállítás**, és mennyi hely kell a mentéseknek,
- hogyan rendelj **megoldást** az RPO és RTO célokhoz.

Az alábbi számítások egyszerűsítettek, de pontosan így gondolkodik egy rendszermérnök, amikor ajánlatot kér egy szerverre.

## A feladat

Egy egyetemi tanulmányi rendszer adatbázisa ma **800 GB**, évente **35%**-kal nő. Csúcsidőben (tárgyfelvételkor) másodpercenként **3000 olvasás** és **1000 írás** érkezik a lemezekre. Az egyetem azt kéri: legfeljebb **15 perc** adat veszhet el (RPO), és egy hiba után legfeljebb **1 óra** alatt álljon helyre a rendszer (RTO).

## 1. lépés – kapacitás 3 évre előre

A növekedés **kamatos kamatként** működik: minden évben az előző év méretének 35%-ával nő.

méret(n év múlva) = 800 GB · 1,35ⁿ

```sql run
-- Növekedési előrejelzés évente
SELECT ev, ROUND(800 * POWER(1.35, ev)) AS meret_gb
FROM generate_series(0, 5) AS ev;
```

3 év múlva kb. **1968 GB**. Ehhez jön:

- **indexek és napló** (WAL): az adatméret kb. 30–50%-a → számoljunk +40%-kal;
- **szabad hely**: a lemezt sosem töltjük 70–80% fölé (a teljesítmény romlik, a karbantartás helyet igényel).

Szükséges hasznos kapacitás ≈ 1968 · 1,4 / 0,75 ≈ **3700 GB**, kerekítve **4 TB**.

## 2. lépés – IOPS és az írási büntetés

Egy **IOPS** egy másodpercenkénti írási vagy olvasási művelet. A RAID-szintek az **írásokat megsokszorozzák**, mert a redundanciát is frissíteni kell:

| RAID   | Egy logikai írásból hány fizikai lesz? | Miért?                                       |
| ------ | -------------------------------------- | -------------------------------------------- |
| RAID 0 | 1                                      | nincs redundancia                            |
| RAID 1 / 10 | 2                                 | mindkét tükörre írni kell                    |
| RAID 5 | 4                                      | régi adat + régi paritás olvasása, új adat + új paritás írása |
| RAID 6 | 6                                      | ugyanez két paritással                       |

A lemezekre jutó fizikai terhelés: **olvasás + írás · büntetés**.

```sql run
-- Fizikai IOPS a csúcsterhelésre (3000 olvasás + 1000 írás / s)
SELECT raid, buntetes, 3000 + 1000 * buntetes AS fizikai_iops
FROM (VALUES ('RAID 10', 2), ('RAID 5', 4), ('RAID 6', 6)) AS t(raid, buntetes);
```

Ugyanaz a terhelés RAID 10-en 5000, RAID 6-on **9000** fizikai IOPS-t jelent! Ha egy lemez kb. 200 IOPS-t bír (HDD) vagy 50 000-et (SSD):

- HDD-vel RAID 10-hez 5000 / 200 = **25 lemez** kellene – ez sok;
- SSD-vel akár 2–4 lemez is bőven elég a sebességhez – itt már a **kapacitás** dönt.

**Tanulság:** írásigényes adatbázishoz a RAID 5/6 írási büntetése komoly hátrány. Ezért szokás adatbázisokhoz **RAID 10**-et ajánlani.

## 3. lépés – az újraépítés kockázata

Ha egy lemez meghibásodik, a RAID **újraépíti** a tartalmát egy új lemezre a többi lemez adataiból. Ez idő alatt:

- a rendszer **lassabb** (a lemezek az újraépítéssel is dolgoznak),
- RAID 5-nél **nincs tartalék**: ha ilyenkor egy második lemez is hibázik (vagy olvasási hiba lép fel), **minden adat elvész**.

**Számpélda:** egy 16 TB-os HDD-t 150 MB/s-mal újraírni: 16 000 000 MB / 150 MB/s ≈ 107 000 s ≈ **30 óra** – terhelés mellett akár több nap. Ennyi ideig védtelen egy RAID 5 tömb. Ezért nagy lemezeknél RAID 5 helyett **RAID 6** vagy **RAID 10** a javasolt. Az SSD-k gyorsabban épülnek újra, de ott is számít.

### Összevetés a mi esetünkre (4 TB hasznos, 1,92 TB-os SSD-kkel)

```sql run
-- Hány 1,92 TB-os SSD kell 4 TB hasznos helyhez, szintenként?
SELECT raid,
       lemez AS lemezek_szama,
       ROUND(hasznos_keplet, 2) AS hasznos_tb,
       hibatures AS tuleli_lemezhibat
FROM (VALUES
  ('RAID 10', 6, 6 / 2.0 * 1.92, '1 (páronként 1)'),
  ('RAID 5',  4, (4 - 1) * 1.92, '1'),
  ('RAID 6',  5, (5 - 2) * 1.92, '2')
) AS t(raid, lemez, hasznos_keplet, hibatures);
```

A RAID 10 két lemezzel több, de a legjobb írási teljesítményt és a leggyorsabb újraépítést adja – egy írásintenzív tanulmányi rendszernél ez a jó választás.

## 4. lépés – mentés: ablak, tárhely, visszaállítás

### Mentési ablak

A mentés ideje = adatmennyiség / átviteli sebesség. 2 TB adat 400 MB/s-mal:

2 000 000 MB / 400 MB/s = 5000 s ≈ **1 óra 23 perc**.

Ha a mentésnek éjjel 2 és 4 között kell lefutnia (mentési ablak), ez belefér. 5 TB-nál már nem – ekkor jön a **növekményes** mentés (csak a változások), vagy a futó adatbázisról készülő **folyamatos** mentés (alapmentés + WAL-archiválás).

### Megőrzés: a nagyapa–apa–fiú (GFS) séma

Egy jól bevált megőrzési rend:

- **fiú:** napi növekményes mentés, 7 napig megőrizve;
- **apa:** heti teljes mentés, 4 hétig;
- **nagyapa:** havi teljes mentés, 12 hónapig.

```sql run
-- Mennyi hely kell a mentéseknek? (teljes mentés 2 TB, egy napi növekmény 2% = 0,04 TB)
SELECT 'napi növekmény (7 db)' AS tipus, 7 * 0.04 AS tb
UNION ALL SELECT 'heti teljes (4 db)', 4 * 2.0
UNION ALL SELECT 'havi teljes (12 db)', 12 * 2.0
UNION ALL SELECT 'ÖSSZESEN', 7 * 0.04 + 4 * 2.0 + 12 * 2.0;
```

Kb. **32 TB** mentési tárhely kell 2 TB adathoz! (Tömörítéssel és deduplikációval ennek töredéke is elég lehet – de a nagyságrend tanulságos.) És a 3-2-1 szabály szerint ennek egy példánya **másik telephelyen** is legyen.

### Visszaállítás: a gyakran elfelejtett fele

A visszaállítás jellemzően **lassabb**, mint a mentés: a fájlokat vissza kell másolni, az indexeket újra kell építeni, a naplót le kell játszani. Ha a 2 TB visszamásolása 1,5 óra, az RTO = 1 óra **nem teljesül** pusztán mentésből!

**Aranyszabály:** az a mentés, amelyből még **soha nem állítottál vissza próbaképpen**, csak remény, nem mentés.

## 5. lépés – RPO és RTO → megoldás

| Cél                     | Csak éjjeli mentés | Mentés + WAL-archiválás (PITR) | Szinkron replika automatikus átállással |
| ----------------------- | ------------------ | ------------------------------ | --------------------------------------- |
| RPO (max. adatvesztés)  | akár 24 óra        | néhány perc                    | ≈ 0                                     |
| RTO (helyreállási idő)  | órák               | órák (visszaállítás + lejátszás) | másodpercek–percek                    |
| Költség                 | alacsony           | közepes                        | magas (második szerver, hálózat)        |

A mi esetünk: RPO = 15 perc, RTO = 1 óra. A PITR teljesíti az RPO-t, de a visszaállítás 1,5 óra – az RTO-t nem. Megoldás: **replika** (egy második szerver, amely folyamatosan követi az elsőt) a gyors átálláshoz **és** mentés + WAL-archiválás a logikai hibák (pl. véletlen `DELETE`) ellen – mert a replika a hibás törlést is azonnal lemásolja!

**Analógia:** a replika olyan, mint egy tartalék kulcs a zsebedben (gyorsan bejutsz, ha elveszted az elsőt); a mentés olyan, mint egy fénykép a lakás berendezéséről (ha betörnek és elvisznek valamit, tudod, mi volt ott).

## Összefoglalás

- **Kapacitás:** kamatos növekedés (méret · (1 + r)ⁿ) + indexek és napló + 25–30% szabad hely.
- **IOPS:** fizikai terhelés = olvasás + írás · büntetés (RAID 10: 2, RAID 5: 4, RAID 6: 6).
- **Újraépítés:** nagy lemezeknél napokig tarthat; RAID 5 ilyenkor védtelen → RAID 6 vagy 10.
- **Mentés:** ablak = méret / sebesség; GFS megőrzés; a visszaállítást is mérni és próbálni kell.
- **RPO/RTO:** mentés → PITR → replika; a replika nem helyettesíti a mentést.

## A lecke feladata

Számolj! (A tizedes törteket ponttal vagy vesszővel is beírhatod.)

```quiz required
? Hány TB a hasznos kapacitása egy RAID 5 tömbnek, amely 4 db 4 TB-os lemezből áll?
= 12
! RAID 5: (n − 1) · C, mert egy lemeznyi hely a paritásé.

? Hány TB a hasznos kapacitása egy RAID 6 tömbnek, amely 6 db 8 TB-os lemezből áll?
= 32
! RAID 6: (n − 2) · C.

? Egy alkalmazás másodpercenként 2000 olvasást és 500 írást végez. Hány fizikai IOPS terheli a lemezeket RAID 5 esetén (írási büntetés: 4)?
= 4000
! Olvasás + írás · büntetés = 2000 + 500 · 4.

? Ugyanez a terhelés hány fizikai IOPS RAID 10 esetén (írási büntetés: 2)?
= 3000
! 2000 + 500 · 2.

? Hány másodpercig tart 2 TB (= 2 000 000 MB) adat mentése 200 MB/s sebességgel?
= 10000
= 10 000
! Idő = adatmennyiség / sebesség.

? Az egyetlen mentés minden éjjel 1:00-kor készül, napló (WAL) nincs archiválva. Másnap 17:00-kor tönkremegy a lemez. Legfeljebb hány órányi adat veszik el?
= 16
! Az utolsó mentés 1:00-kor készült; 1:00 és 17:00 között 16 óra telt el.

? Van egy szinkron replikánk. Valaki véletlenül lefuttat egy WHERE nélküli DELETE-et. Mi ment meg minket?
- a replika, mert az egy másik szerveren van
+ a mentés (és a WAL-archívum), amelyből a törlés előtti állapot visszaállítható
- a RAID 10, mert tükrözi az adatokat
! A replika és a RAID a hibás törlést is azonnal lemásolja – logikai hiba ellen csak a mentés véd.
```
