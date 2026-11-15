---
title: Mentés, replikáció és helyreállítás
summary: Teljes, növekményes és különbségi mentés, a 3-2-1 szabály, logikai és fizikai mentés (pg_dump, alapmentés + WAL), időpontra való visszaállítás, az RPO és az RTO, valamint a szinkron és aszinkron replikáció és a feladatátvétel.
minutes: 28
---

## Amit ebben a leckében megtanulsz

- milyen **mentéstípusok** vannak, és mi a **3-2-1 szabály**,
- mi a különbség a **logikai** és a **fizikai** mentés között,
- mit jelent az **RPO** és az **RTO**,
- hogyan működik a **replikáció**, és miben más, mint a mentés.

## Miért kell menteni?

Az adat sokféleképpen veszhet el: lemezhiba, egy rosszul megírt `DELETE` `WHERE` nélkül, programhiba, zsarolóvírus, tűz az adatközpontban. A RAID (1. lecke) csak a lemezhiba ellen véd. A **mentés** (_backup_) az adat egy korábbi állapotának **független** másolata, amelyből vissza lehet állni.

> Aranyszabály: **a mentés annyit ér, amennyit a visszaállítás.** Egy soha ki nem próbált mentésről csak a baj napján derül ki, hogy használhatatlan. A visszaállítást rendszeresen gyakorolni kell!

## Mentéstípusok

| Típus                           | Mit ment?                                     | Mentés      | Visszaállítás                          |
| ------------------------------- | --------------------------------------------- | ----------- | -------------------------------------- |
| **Teljes** (_full_)             | mindent                                       | lassú, nagy | egyszerű: csak ez az egy kell          |
| **Növekményes** (_incremental_) | ami a **legutóbbi bármilyen** mentés óta változott | gyors, kicsi | a teljes + **az összes** növekményes sorban |
| **Különbségi** (_differential_) | ami a **legutóbbi teljes** mentés óta változott | közepes, napról napra nő | a teljes + **a legutolsó** különbségi |

Példa: vasárnap teljes mentés, hétfőtől naponta kiegészítő mentés. Csütörtökön baj van:

```text
          V        H        K        Sze      Cs
 teljes   [████]
 növekm.           [▒]      [▒]      [▒]           → visszaállítás: V + H + K + Sze (4 mentés)
 különb.           [▒]      [▒▒]     [▒▒▒]         → visszaállítás: V + Sze (2 mentés)
```

## A 3-2-1 szabály

- **3** példány az adatból (az éles + 2 mentés),
- **2** különböző adathordozón (pl. lemez és felhős objektumtár),
- **1** példány **másik helyszínen** (offsite) – hogy egy tűz vagy árvíz ne vigye el mindet.

Ma gyakran kiegészítik: legyen egy **megváltoztathatatlan** (_immutable_) vagy offline példány is, amelyet egy zsarolóvírus sem tud titkosítani vagy törölni.

## Logikai és fizikai mentés

**Logikai mentés**: az adatbázis tartalmát SQL-utasításokként vagy egy speciális formátumban írja ki. PostgreSQL-ben a `pg_dump`:

```text
pg_dump --format=custom --file=webshop.dump webshop      (mentés)
pg_restore --dbname=webshop_uj webshop.dump              (visszaállítás)
```

- Előny: hordozható (más verzióra, más gépre is), egy-egy tábla is visszaállítható.
- Hátrány: nagy adatbázisnál lassú, és csak a mentés pillanatát rögzíti.

**Fizikai mentés**: az adatbázis **fájljait** másolja (lapok, 9. témakör). PostgreSQL-ben a `pg_basebackup` készít egy **alapmentést**, és mellé folyamatosan **archiváljuk a WAL-t** (a naplót).

## Időpontra való visszaállítás (PITR)

Az alapmentés + az archivált WAL együtt valami nagyon hasznosat ad: vissza lehet állni **bármelyik időpontra**. A visszaállítás az alapmentésből indul, és a naplót **pontosan addig** játssza le, ameddig kérjük.

```text
 vasárnap 02:00          csütörtök 14:31     14:32
 [alapmentés] ──── WAL ──── WAL ──── WAL ────┤ ⚠ valaki: DELETE FROM rendelesek;
                                             ↑
                     visszaállítás eddig: 14:31:59
```

Így egy véletlen törlés előtti pillanatra állhatunk vissza, és szinte semmi sem vész el. Ezt hívják **PITR**-nek (_Point-In-Time Recovery_).

## RPO és RTO

Két kérdés, amelyet a cég vezetésével együtt kell eldönteni:

- **RPO** (_Recovery Point Objective_): **mennyi adatot** veszíthetünk legfeljebb? Időben mérjük: „legfeljebb 15 percnyi adat veszhet el”.
- **RTO** (_Recovery Time Objective_): **mennyi idő alatt** kell újra működnie a rendszernek? „Legfeljebb 1 óra leállás.”

```text
     utolsó mentés            katasztrófa                újra működik
  ────────●─────────────────────⚡─────────────────────────●──────►
          │◄──── RPO: ennyi ────►│◄─────── RTO: ennyi ─────►│
             adat veszik el          ideig áll a rendszer
```

Példa: ha csak éjjel 2-kor van mentés, és délután 6-kor ég le a szerver, **16 órányi** adat veszik el. Ha ez sok, gyakrabban kell menteni, vagy folyamatosan archiválni a WAL-t, vagy replikálni. Minél kisebb az RPO és az RTO, annál drágább a megoldás.

## Replikáció

A **replikáció** során egy vagy több **másodlagos** szerver (_replica_, _standby_) folyamatosan követi az **elsődleges** szerver (_primary_) változásait. PostgreSQL-ben az elsődleges szerver a WAL-t küldi át, a másodlagosok pedig lejátsszák (_streaming replication_).

| Fajta           | Hogyan működik?                                                       | Előny / hátrány                                    |
| --------------- | --------------------------------------------------------------------- | -------------------------------------------------- |
| **Szinkron**    | a `COMMIT` csak akkor kész, ha a másodlagos is megkapta a naplót      | nem vész el adat (RPO ≈ 0), de lassabb írás        |
| **Aszinkron**   | a `COMMIT` azonnal kész, a napló utána megy át                        | gyors, de a primary összeomlásakor az utolsó pár másodperc elveszhet |

Mire jó a replikáció?

- **Magas rendelkezésre állás** (_high availability_): ha az elsődleges kiesik, egy másodlagos **átveszi** a szerepét (_failover_) – percek vagy másodpercek alatt, kis RTO-val.
- **Olvasási terhelés elosztása**: a riportok és a keresések a másodlagos szerveren futhatnak.
- **Földrajzi elosztás**: másik adatközpontban is van egy friss példány.

> Fontos: **a replikáció sem mentés!** Egy véletlen `DROP TABLE` ezredmásodpercek alatt a replikára is átmegy. Replikáció a kiesés ellen, mentés (és PITR) az adatvesztés ellen – a kettő együtt ad igazi biztonságot.

## Összefoglalás

- Teljes, növekményes (a legutóbbi bármilyen mentés óta), különbségi (a legutóbbi teljes óta).
- 3-2-1: három példány, két adathordozó, egy másik helyszínen; plusz egy megváltoztathatatlan példány.
- Logikai (`pg_dump`) és fizikai mentés (alapmentés + WAL-archívum → PITR).
- RPO = mennyi adat veszhet el; RTO = mennyi ideig állhat a rendszer.
- Replikáció (szinkron/aszinkron) a rendelkezésre állásért; nem helyettesíti a mentést.

## A lecke feladata

```quiz required
? Vasárnap teljes mentés készül, hétfőtől szombatig naponta növekményes. Pénteken a mentés után baj történik. Hány mentésre van szükség a visszaállításhoz?
= 6
! A teljes + hétfő, kedd, szerda, csütörtök, péntek növekményes mentése: 1 + 5.

? Ugyanez a helyzet, de a napi mentések különbségiek. Hány mentés kell a visszaállításhoz?
= 2
! A teljes + a legutolsó (pénteki) különbségi.

? Egy rendszerben naponta egyszer, éjjel 2:00-kor készül mentés. Délután 18:00-kor tönkremegy a lemez. Legfeljebb hány órányi adat veszik el?
= 16
! 2:00-tól 18:00-ig.

? Mit jelent az RTO?
- mennyi adatot veszíthetünk legfeljebb
+ mennyi idő alatt kell újra működnie a rendszernek
- hány mentési példány kell
- milyen gyakran kell replikálni
! Recovery Time Objective.

? Egy kolléga véletlenül kiadja a `DROP TABLE rendelesek;` utasítást. Az aszinkron replika másodperceken belül követi. Mivel lehet a legkevesebb adatvesztéssel helyreállni?
- a replikára való átállással (failover)
+ időpontra való visszaállítással (alapmentés + WAL a törlés előtti pillanatig)
- a RAID tükörlemezével
- semmivel, az adat végleg elveszett
! A replika a törlést is lemásolta; a PITR a törlés előtti pillanatra áll vissza.
```
