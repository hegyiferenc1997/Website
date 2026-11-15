---
title: DAS, NAS, SAN és objektumtárolás
summary: Hogyan kapcsolódik a tárhely a szerverhez: közvetlen tárolás (DAS), hálózati fájltároló (NAS), tárolóhálózat (SAN), valamint az objektumtárolás (pl. Amazon S3) és a felhős tárolási osztályok – és melyik mire való egy adatbázis környezetében.
minutes: 22
---

## Amit ebben a leckében megtanulsz

- mi a különbség a **blokk-**, a **fájl-** és az **objektumszintű** tárolás között,
- mi a **DAS**, a **NAS** és a **SAN**,
- mi az **objektumtárolás**, és mire használjuk adatbázisok mellett,
- mik a felhős **tárolási osztályok**.

## Három szint: blokk, fájl, objektum

| Szint          | Mit lát a szerver?                                  | Példa                           |
| -------------- | --------------------------------------------------- | ------------------------------- |
| **Blokk**      | egy „nyers” lemezt, számozott blokkokkal; a fájlrendszert ő maga kezeli | helyi SSD, SAN, felhős blokktároló (pl. AWS EBS) |
| **Fájl**       | egy megosztott mappát, fájlokkal és könyvtárakkal  | NAS (NFS, SMB megosztás)        |
| **Objektum**   | „vödröket” (_bucket_), bennük kulcs → objektum (fájl + metaadat), HTTP-n elérve | Amazon S3, Azure Blob, Google Cloud Storage |

Az adatbázisok **blokkszintű** tárolást szeretnek: maguk akarják eldönteni, mi hová kerül a lemezen (lapok, WAL – 9. témakör), és nagyon alacsony késleltetésre van szükségük.

## DAS – közvetlenül csatolt tárolás

A **DAS** (_Direct-Attached Storage_) a szerverbe épített vagy közvetlenül hozzá kábelezett lemez.

- **Előny**: a leggyorsabb, legkisebb késleltetés, egyszerű, olcsó.
- **Hátrány**: csak az az egy szerver éri el; ha a szerver leáll, a tárhely is elérhetetlen; nehezen bővíthető.

Egy kisebb adatbázis-szerver vagy egy fejlesztői gép tipikusan DAS-t használ (pl. beépített NVMe SSD).

## NAS – hálózati fájltároló

A **NAS** (_Network-Attached Storage_) egy hálózatra kötött tárolóeszköz, amely **fájlmegosztást** nyújt (NFS, SMB). Sok gép éri el egyszerre, mintha egy közös hálózati meghajtó lenne.

- **Előny**: egyszerű megosztás, közös fájlok, mentések tárolása.
- **Hátrány**: a fájlszintű hozzáférés és a hálózat miatt nagyobb a késleltetés – éles adatbázis adatfájljait általában **nem** tesszük NAS-ra (vagy csak nagyon gondos beállítással).

Tipikus használat: **mentések** célhelye, közös dokumentumok, médiafájlok.

## SAN – tárolóhálózat

A **SAN** (_Storage Area Network_) egy külön, nagy sebességű hálózat (Fibre Channel vagy iSCSI), amelyen a szerverek **blokkszintű** tárhelyet kapnak egy központi tárolórendszerből. A szerver számára a SAN-ból kapott terület úgy néz ki, mintha egy helyi lemez lenne.

- **Előny**: nagy teljesítmény, központilag kezelhető és bővíthető; ha egy szerver meghibásodik, a tárhelyét egy másik szerver átveheti; pillanatképek (_snapshot_) és replikáció a tárolóban.
- **Hátrány**: drága, és szakértelmet igényel.

A nagyvállalati adatbázis-szerverek klasszikusan SAN-on futnak. A felhőben a **blokktárolók** (AWS EBS, Azure Managed Disk) töltik be ugyanezt a szerepet.

```text
  DAS:   [szerver]═[lemez]                     közvetlenül

  NAS:   [szerver]─┐
         [szerver]─┼── LAN ── [NAS]            fájlok, közös hálózaton
         [szerver]─┘

  SAN:   [szerver]═╗
         [szerver]═╬══ külön tárolóhálózat ══ [tárolórendszer]   blokkok
         [szerver]═╝
```

## Objektumtárolás

Az **objektumtárolás** (pl. **Amazon S3**) nem mappákban és blokkokban gondolkodik, hanem **objektumokban**: minden objektum egy fájl, egy egyedi **kulcs** (pl. `mentesek/2026-11-15/webshop.dump`) és **metaadatok**. HTTP-n keresztül érjük el (`PUT`, `GET`, `DELETE`).

- **Előny**: gyakorlatilag korlátlan méret, nagyon olcsó, rendkívül tartós (az S3 például 99,999999999% – „tizenegy kilences” – tartósságot ígér), bárhonnan elérhető.
- **Hátrány**: nagyobb késleltetés, egy objektumot nem lehet „belül” módosítani, csak egészében felülírni – adatbázis élő adatfájljainak nem való.

Mire jó egy adatbázis mellett?

- **mentések** és a WAL archiválása (3. lecke),
- nagy fájlok (képek, PDF-ek) tárolása – az adatbázisban csak a kulcsukat (elérési útjukat) tároljuk,
- **adattavak** (_data lake_): nyers adatok elemzésre (18. témakör).

## Felhős tárolási osztályok

A felhőszolgáltatók az objektumtárolót különböző „hőmérsékletű” osztályokban kínálják:

| Osztály           | Hozzáférés            | Ár (tárolás)     | Mire?                                  |
| ----------------- | --------------------- | ---------------- | -------------------------------------- |
| **Forró** (_hot_) | azonnali, gyakori     | legdrágább       | aktívan használt fájlok                |
| **Hűvös** (_cool_) | azonnali, ritka      | olcsóbb          | a múlt havi mentések                   |
| **Archív** (_archive_) | órák alatt visszahozható | nagyon olcsó | évekig megőrzendő, ritkán kellő adatok |

Életciklus-szabállyal (_lifecycle policy_) az objektumok automatikusan „lehűlhetnek”: pl. a mentés 30 nap után hűvös, 90 nap után archív osztályba kerül, és egy év után törlődik.

## Összefoglalás

- Blokk (adatbázisok kedvence), fájl (megosztás), objektum (olcsó, korlátlan, HTTP).
- DAS: közvetlen, gyors, de egy szerveré; NAS: hálózati fájlmegosztás; SAN: központi blokktárolás külön hálózaton.
- Objektumtárolás: mentésekhez, nagy fájlokhoz, adattavakhoz – élő adatbázisfájlokhoz nem.
- Tárolási osztályok: forró, hűvös, archív; életciklus-szabályokkal automatizálható.

## A lecke feladata

```quiz required
? Milyen szintű tárolást lát egy szerver egy SAN-ból kapott területből?
+ blokkszintűt, mintha helyi lemez lenne
- fájlszintűt, egy megosztott mappát
- objektumszintűt, HTTP-n keresztül
! A SAN blokkokat ad, a fájlrendszert a szerver kezeli.

? Melyik tárolási forma a legalkalmasabb több év mentéseinek olcsó megőrzésére?
- DAS
- SAN
+ objektumtárolás archív osztályban
- a szerver memóriája
! Nagyon olcsó, nagyon tartós; a visszahozás lassú, de ritkán kell.

? Miért nem tesszük általában egy éles adatbázis adatfájljait objektumtárolóba?
- mert az objektumtároló nem tartós
+ mert nagy a késleltetés, és egy objektumot nem lehet belül módosítani, csak egészében felülírni
- mert az objektumtároló csak képeket tárolhat
- mert az objektumtároló nem érhető el hálózaton
! Az adatbázis sok kis, véletlenszerű írást végez a lapokon.

? Melyik a NAS tipikus feladata egy adatbázis-környezetben?
- az élő adatfájlok tárolása a legkisebb késleltetéssel
+ a mentések célhelye, közös fájlok tárolása
- a WAL írása a COMMIT előtt
! Fájlszintű megosztás a hálózaton.

? Egy webshop termékképeit hová érdemes tenni, és mit tároljunk belőlük az adatbázisban?
+ objektumtárolóba; az adatbázisban csak a kulcsukat (elérési útjukat)
- az adatbázis egy BYTEA oszlopába, minden képet egészében
- a szerver memóriájába
! Az adatbázis maradjon kicsi és gyors, a nagy fájloknak az objektumtároló való.
```
