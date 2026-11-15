---
title: Skálázás és gyorsítótárazás
summary: Mit tegyél, ha egy szerver már kevés: a kapcsolatkészlet (connection pooling), a gyorsítótárazás (cache-aside minta Redisszel, érvénytelenítés), az olvasási replikák, a függőleges és vízszintes skálázás és a sharding, valamint a megfigyelés legfontosabb mérőszámai.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- mi a **kapcsolatkészlet**, és miért nélkülözhetetlen,
- hogyan működik a **gyorsítótárazás**, és miért nehéz az **érvénytelenítés**,
- mikor segítenek az **olvasási replikák** és a **sharding**,
- milyen **mérőszámokat** érdemes figyelni.

## A sorrend: a legolcsóbbtól a legdrágábbig

Mielőtt új szervereket vennél, járd végig ezt a sort – a legtöbb gond már az első lépéseknél megoldódik:

1. **Mérés**: melyik lekérdezés viszi az időt? (pg_stat_statements, `EXPLAIN ANALYZE`)
2. **Lekérdezések és indexek** javítása (1. lecke, 7. témakör).
3. **Séma**: materializált nézet, denormalizálás, particionálás (2. lecke).
4. **Kapcsolatkészlet** és **gyorsítótár**.
5. **Erősebb gép** (függőleges skálázás).
6. **Olvasási replikák**.
7. **Sharding** (vízszintes skálázás az írásokra) – a legbonyolultabb, csak ha tényleg muszáj.

## Kapcsolatkészlet (connection pooling)

Egy adatbázis-kapcsolat felépítése drága: hitelesítés, TLS-kézfogás, és a PostgreSQL minden kapcsolathoz **külön folyamatot** indít (néhány MB memória). Ha egy webalkalmazás minden kéréshez új kapcsolatot nyit, vagy ezer példány fut egyszerre, a szerver a kapcsolatok kezelésébe fullad bele.

A **kapcsolatkészlet** (_connection pool_) néhány tucat kapcsolatot **nyitva tart**, és a kérések kölcsönkérik, majd visszaadják őket – mint egy autókölcsönző: nem gyártanak minden ügyfélnek új autót.

```text
  1000 kérés ──► [ kapcsolatkészlet: 20 nyitott kapcsolat ] ──► adatbázis
                   (PgBouncer, vagy az alkalmazás saját készlete)
```

PostgreSQL-hez a legismertebb külső eszköz a **PgBouncer**; a legtöbb programnyelv adatbázis-könyvtárában is van beépített készlet.

## Gyorsítótárazás

A leggyorsabb lekérdezés az, amelyet **nem kell lefuttatni**. Ha ugyanazt az adatot sokan, sokszor kérik (a főoldal termékei, egy népszerű cikk), az eredményt eltehetjük egy memóriabeli tárba, pl. **Redisbe** (11. témakör).

A leggyakoribb a **cache-aside** (_lazy loading_) minta:

```text
  1. Az alkalmazás megnézi a gyorsítótárban:  GET termek:42
  2a. Ha megvan (találat) → kész, az adatbázishoz sem nyúl.
  2b. Ha nincs (hiány)    → lekérdezi az adatbázisból,
                            beteszi a gyorsítótárba lejárati idővel:  SET termek:42 … EX 300
                            és visszaadja.
```

### A nehéz rész: az érvénytelenítés

> „A számítástechnikában két nehéz dolog van: a gyorsítótár érvénytelenítése és a dolgok elnevezése.” – Phil Karlton

Ha a termék ára megváltozik az adatbázisban, a gyorsítótárban még a régi ár van. Megoldások:

- **Lejárati idő** (_TTL_): az adat pl. 5 perc után magától eltűnik. Egyszerű, de legfeljebb 5 percig régi adat látszhat.
- **Érvénytelenítés íráskor**: amikor az alkalmazás módosítja a terméket, törli a gyorsítótárból is (`DEL termek:42`).
- **Mit ne tegyél gyorsítótárba?** Ami mindig pontos kell legyen: készlet a fizetés pillanatában, egyenleg, jogosultságok.

## Függőleges és vízszintes skálázás

- **Függőleges** (_scale up_): nagyobb gép – több CPU, több memória (több fér a pufferbe!), gyorsabb SSD. A legegyszerűbb, nem kell hozzá a kódot módosítani, és ma egyetlen szerver is meglepően sokat bír. De van felső határa, és egy gép kiesése a teljes rendszer kiesése.
- **Vízszintes** (_scale out_): több gép. Két fő formája az olvasási replika és a sharding.

## Olvasási replikák

A legtöbb alkalmazásban sokkal több az **olvasás**, mint az írás (egy webshopban százan nézelődnek, mire egy vásárol). Az **olvasási replikák** (13. témakör) az elsődleges szerver másolatai, amelyekről olvasni lehet:

```text
              írás ──►  [ elsődleges ] ──WAL──► [ replika 1 ]  ◄── olvasás
                                       ──WAL──► [ replika 2 ]  ◄── olvasás
```

Figyelj a **replikációs késésre**: aszinkron replikánál a frissen írt adat egy pillanatig még nem látszik a replikán. Ha a felhasználó módosítja a profilját, és rögtön újratölti az oldalt, ezt az olvasást az elsődlegesről érdemes kiszolgálni (_read-your-writes_).

## Sharding

Ha már az **írás** sem fér el egy gépen, az adatot **szét kell osztani** több önálló adatbázis között – ez a **sharding**. Például a vásárlókat azonosító szerint: az 1–1 000 000 az első szerverre, a többi a másodikra; vagy egy hash alapján.

- **Előny**: az írási kapacitás is szinte korlátlanul bővíthető.
- **Hátrány**: a több shardot érintő lekérdezések és tranzakciók bonyolultak és lassúak, az újraosztás (_resharding_) fájdalmas, és jól kell megválasztani a **shard kulcsot**, hogy egyenletes legyen az eloszlás.

Ezért a sharding az utolsó lépés. Vannak rendszerek, amelyek elrejtik a bonyolultságát (pl. a PostgreSQL-hez a Citus, vagy a CockroachDB, a Google Spanner, a Vitess a MySQL-hez).

## Mit figyelj? – a legfontosabb mérőszámok

| Mérőszám                                           | Mit árul el?                                                                |
| -------------------------------------------------- | --------------------------------------------------------------------------- |
| **Lekérdezések ideje** (átlag, 95/99. percentilis) | a felhasználók által érzett sebesség; a percentilis a „lassú szélt” mutatja |
| **Pufferben talált lapok aránya**                  | ha 99% alá esik, kevés a memória vagy rossz a lekérdezés                    |
| **Aktív kapcsolatok száma**                        | közel a korláthoz? Kell kapcsolatkészlet?                                   |
| **Zárolásra várakozás, holtpontok**                | egymást blokkoló tranzakciók (8. témakör)                                   |
| **Replikációs késés**                              | mennyire friss a replika                                                    |
| **Lemez: IOPS, késleltetés, szabad hely**          | a tároló bírja-e (13. témakör)                                              |

## Összefoglalás

- Sorrend: mérés → lekérdezés és index → séma → kapcsolatkészlet és gyorsítótár → nagyobb gép → replikák → sharding.
- Kapcsolatkészlet: kevés, újrahasznosított kapcsolat sok kérésre (PgBouncer).
- Cache-aside: előbb a gyorsítótár, hiány esetén az adatbázis; érvénytelenítés TTL-lel vagy íráskor.
- Olvasási replika: az olvasások elosztása; figyelj a replikációs késésre.
- Sharding: az írások szétosztása – nagy tudás, nagy bonyolultság.

## A lecke feladata

```quiz required
? Egy webalkalmazás minden kéréshez új adatbázis-kapcsolatot nyit, és csúcsidőben a szerver a kapcsolatok kezelésébe fullad. Mi a legkézenfekvőbb megoldás?
- sharding
+ kapcsolatkészlet (pl. PgBouncer)
- particionálás
- egy materializált nézet
! Kevés nyitva tartott kapcsolat, amelyet a kérések kölcsönkérnek.

? A cache-aside mintában mi történik, ha a kért adat nincs a gyorsítótárban?
- az alkalmazás hibát ad
+ az alkalmazás lekérdezi az adatbázisból, beteszi a gyorsítótárba, és visszaadja
- a gyorsítótár magától lekérdezi az adatbázist minden percben
- a kérést átirányítják egy replikára
! Lusta betöltés: csak akkor kerül be, ha valaki kéri.

? Egy termék árát módosították, de a vásárlók még 5 percig a régi árat látják. Mi lehet az oka?
+ a gyorsítótárban 5 perces lejárati idővel maradt a régi ár, és íráskor nem érvénytelenítették
- a B-fa index elavult
- a WAL még nem íródott ki
- a replikációs tényező túl nagy
! Érvénytelenítés íráskor, vagy rövidebb TTL.

? Egy webshopban az olvasások száma százszorosa az írásokénak, és az elsődleges szerver már nem bírja. Melyik lépés segít a legtöbbet a legkisebb bonyolultsággal?
- sharding
+ olvasási replikák
- több index minden oszlopra
- a táblák denormalizálása egyetlen táblába
! Az olvasások a replikákra terelhetők.

? A felhasználó módosítja a profilját, újratölti az oldalt, és a régi adatot látja. Az olvasások egy aszinkron replikáról jönnek. Mi a jelenség neve?
- holtpont
+ replikációs késés
- N+1 probléma
- partíciókihagyás
! A friss írás még nem ért át a replikára.
```
