---
title: A fájlrendszerek felépítése
summary: Blokkok, folytonos, láncolt és indexelt foglalás, a FAT, az inode és az NTFS, a naplózás és a mai fájlrendszerek összevetése.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- hogyan tárolja a fájlrendszer a fájlokat **blokkokban**,
- mi a **folytonos**, a **láncolt** (FAT) és az **indexelt** (inode) foglalás,
- mi a **naplózás** (_journaling_), és miben különbözik a FAT32, az exFAT, az NTFS, az ext4 és az APFS.

## Blokkok

A lemezt a fájlrendszer egyforma méretű **blokkokra** (Windowson: _fürt_, _cluster_) osztja, tipikusan **4 KB**-osakra. Egy fájl mindig **egész számú** blokkot foglal: egy 10 KB-os fájl 3 blokkot (12 KB) – a maradék 2 KB belső töredezettség.

A fájlrendszernek nyilván kell tartania:

- melyik blokk **szabad** (bittérkép vagy szabadlista),
- melyik fájl **melyik blokkokban** van,
- a fájlok **metaadatait** és a **könyvtárakat**.

## Foglalási módszerek

| Módszer        | Hogyan?                                                    | Előny                     | Hátrány                         |
| -------------- | ---------------------------------------------------------- | ------------------------- | ------------------------------- |
| **folytonos**  | a fájl egymás utáni blokkokban van (kezdet + hossz)        | gyors olvasás             | külső töredezettség, nehéz bővíteni |
| **láncolt**    | minden blokk megmondja, melyik a következő                 | nincs külső töredezettség | lassú a véletlen elérés         |
| **indexelt**   | egy **indexblokk** sorolja fel a fájl összes blokkját      | gyors véletlen elérés     | az index helyet foglal          |

A CD/DVD-k (ISO 9660) folytonos foglalást használnak – ott a fájlok nem változnak.

### FAT – a láncolt foglalás táblában

A **FAT** (_File Allocation Table_) a láncot egy külön **táblában** tárolja: a tábla _i_-edik eleme megmondja, melyik blokk jön a fájlban az _i_-edik után.

```text
könyvtárbejegyzés: "kep.jpg" → első blokk: 4

FAT:   index:  2    3    4    5    6    7
       érték:  0    0    7    0    0   EOF
→ a kep.jpg blokkjai: 4 → 7 → vége
```

Egyszerű, ezért minden eszköz érti (pendrive, fényképezőgép, autórádió).

### Inode – az indexelt foglalás UNIX-on

Linuxon (ext4) minden fájlhoz tartozik egy **inode**: egy kis rekord a fájl metaadataival (méret, tulajdonos, jogok, időbélyegek) és a **blokkjaira mutató** hivatkozásokkal. Érdekesség: a fájl **neve nincs az inode-ban** – a név a könyvtárban van, ezért lehet egy fájlnak több neve (kemény link).

A klasszikus inode-ban 12 **közvetlen** mutató van; 4 KB-os blokkokkal ez 12 · 4 = **48 KB**-ig elég. A nagyobb fájlokhoz **közvetett** mutatók kellenek (egy blokk, amely további mutatókat tartalmaz). Az ext4 ehelyett **extenteket** használ: „a 1000. blokktól 500 blokk” – ez nagy fájloknál sokkal tömörebb.

```bash
ls -i                    # a fájlok inode-száma
df -i /                  # hány inode van és mennyi szabad
```

### NTFS

A Windows fájlrendszere, az **NTFS**, minden fájl adatait a **Master File Table** (MFT) egy rekordjában tárolja; a kis fájlok tartalma akár magában az MFT-rekordban is elfér. Tud jogosultságokat (ACL), titkosítást, tömörítést és naplózást.

## Naplózás (journaling)

Mi történik, ha egy fájl írása közben elmegy az áram? A fájlrendszer **inkonzisztens** lehet (pl. a blokk már foglalt, de egyik fájlhoz sem tartozik). A **naplózó** fájlrendszer a változtatást előbb egy **naplóba** írja, és csak utána hajtja végre. Összeomlás után a naplóból gyorsan helyreállítható a rendszer, nem kell az egész lemezt átvizsgálni.

## Mai fájlrendszerek

| Fájlrendszer | Hol?                         | Max. fájlméret  | Naplózás | Megjegyzés                         |
| ------------ | ---------------------------- | --------------- | -------- | ---------------------------------- |
| **FAT32**    | régi pendrive-ok, UEFI-partíció | **4 GB**     | nincs    | mindenhol olvasható                |
| **exFAT**    | pendrive, SD-kártya          | gyakorlatilag korlátlan | nincs | FAT32 utódja nagy fájlokhoz   |
| **NTFS**     | Windows                      | 16 TB+          | van      | ACL, titkosítás, tömörítés         |
| **ext4**     | Linux (Ubuntu alapértelmezés)| 16 TB           | van      | extentek, megbízható               |
| **Btrfs**, **ZFS** | Linux szerverek       | óriási          | másolás íráskor (CoW) | pillanatképek, ellenőrzőösszegek |
| **APFS**     | macOS, iOS                   | óriási          | CoW      | pillanatképek, titkosítás          |

## Összefoglalás

- A fájlrendszer blokkokban tárol; egy fájl egész számú blokkot foglal.
- Folytonos (gyors, de töredezik), láncolt (FAT), indexelt (inode, MFT) foglalás.
- Az inode a metaadatokat és a blokkmutatókat tárolja, a nevet nem.
- A naplózás összeomlás után gyors helyreállítást ad; FAT32: 4 GB-os fájlméret-korlát.

## A lecke feladata

```quiz required
? Hány 4 KB-os blokkot foglal egy 10 KB-os fájl?
= 3
! 10 / 4 = 2,5 → felfelé kerekítve 3.

? Melyik foglalási módszert használja a FAT fájlrendszer?
- folytonos
+ láncolt (táblában tárolt lánccal)
- indexelt
- véletlenszerű
! A tábla minden eleme a következő blokk számát tárolja.

? Mi NINCS benne egy Linux inode-ban?
- a fájl mérete
- a tulajdonos
+ a fájl neve
- a blokkokra mutató hivatkozások
! A nevet a könyvtár tárolja.

? Hány GB a legnagyobb fájl, amit FAT32-re írhatsz (kb.)?
= 4
! Ezért nem fér rá a Windows ISO-ban lévő nagy install.wim fájl sem.

? 12 közvetlen mutató és 4 KB-os blokkok mellett hány KB-ig elég a közvetlen mutatók köre?
= 48
! 12 · 4 KB = 48 KB.
```
