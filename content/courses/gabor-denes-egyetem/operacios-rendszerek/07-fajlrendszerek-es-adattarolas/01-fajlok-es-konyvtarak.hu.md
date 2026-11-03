---
title: Fájlok és könyvtárak
summary: A fájl fogalma és attribútumai, a könyvtárfa, abszolút és relatív utak, a Linux könyvtárszerkezete és a linkek.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- mi a **fájl**, milyen **attribútumai** vannak, és mire jó a kiterjesztés,
- hogyan épül fel a **könyvtárfa**, és mi az **abszolút** és a **relatív** elérési út,
- mit találsz a Linux fő mappáiban (**FHS**), és mi a **kemény** és a **szimbolikus link**.

## A fájl

A **fájl** az OS által kezelt, **névvel ellátott** adatsorozat a háttértáron. A programozónak nem kell tudnia, melyik lemezblokkokban van – ez a fájlrendszer dolga.

Fontos **attribútumok** (metaadatok):

| Attribútum    | Példa                                    |
| ------------- | ---------------------------------------- |
| név           | `jegyzet.txt`                            |
| méret         | 2 345 bájt                               |
| típus         | szöveg, kép, futtatható                  |
| tulajdonos    | `anna`                                   |
| jogosultságok | ki olvashatja, írhatja, futtathatja      |
| időbélyegek   | létrehozás, utolsó módosítás, hozzáférés |

```bash
stat jegyzet.txt     # a fájl összes metaadata
file /bin/ls         # milyen típusú (a tartalma alapján)
```

A **kiterjesztés** (`.txt`, `.jpg`, `.exe`) Windowson fontos: ebből tudja, melyik program nyissa meg. Linuxon csak megállapodás – a futtathatóságot a **jogosultság** dönti el, nem a név.

## A könyvtárfa

A **könyvtár** (mappa) is egy különleges fájl, amely neveket és hivatkozásokat tárol. A könyvtárak **fát** alkotnak:

```text
/                      ← gyökér (root)
├── home/
│   └── anna/          ← a saját mappád (~)
│       ├── labor/
│       │   └── a.txt
│       └── jegyzet.txt
├── etc/
└── usr/
```

- **Abszolút út**: a gyökértől indul – `/home/anna/labor/a.txt` (Windowson `C:\Users\anna\labor\a.txt`).
- **Relatív út**: az aktuális mappától indul. Ha a `/home/anna` mappában vagy: `labor/a.txt`.
- Különleges nevek: `.` = ez a mappa, `..` = a szülő mappa, `~` = a saját mappád.

Linuxon **egyetlen fa** van, minden meghajtó ennek egy ágába kerül (**csatolás**). Windowson minden meghajtónak **saját betűje** és fája van (`C:`, `D:`). Az elválasztó Linuxon `/`, Windowson `\`; Linuxon a kis- és nagybetű **különbözik** (`A.txt` ≠ `a.txt`).

## A Linux könyvtárszerkezete (FHS)

| Mappa              | Mi van benne?                                           |
| ------------------ | ------------------------------------------------------- |
| `/bin`, `/usr/bin` | a felhasználói programok (`ls`, `cp`, `python3`)        |
| `/etc`             | rendszerszintű **beállítófájlok** (szöveg)              |
| `/home`            | a felhasználók saját mappái                             |
| `/root`            | a rendszergazda (root) saját mappája                    |
| `/var`             | változó adatok: **naplók** (`/var/log`), gyorsítótárak  |
| `/tmp`             | ideiglenes fájlok (újraindításkor törlődhetnek)         |
| `/dev`             | **eszközfájlok** (`/dev/sda` = az első lemez)           |
| `/proc`, `/sys`    | a kernel által menet közben generált „virtuális” fájlok |
| `/boot`            | a kernel és a rendszerbetöltő fájljai                   |

A UNIX-filozófia szerint **„minden fájl”**: a lemez, a terminál, sőt a futó folyamatok adatai is fájlként érhetők el.

## Linkek

- **Kemény link** (`ln a.txt b.txt`): ugyanannak a fájlnak egy **második neve**. Mindkét név egyenrangú; a fájl csak akkor törlődik, ha az utolsó nevét is törlöd.
- **Szimbolikus link** (`ln -s /etc/hosts hosts`): egy kis fájl, amely egy **útvonalat** tartalmaz – olyan, mint egy Windows-parancsikon. Ha az eredetit törlöd, a link „lóg”.

## Összefoglalás

- A fájl névvel ellátott adatsorozat metaadatokkal (méret, tulajdonos, jogosultság, időbélyeg).
- Abszolút út a gyökértől, relatív az aktuális mappától; `.`, `..`, `~`.
- Linuxon egy fa van (FHS: `/etc`, `/home`, `/var`, `/dev` …), Windowson meghajtóbetűk.
- Kemény link = újabb név ugyanarra a fájlra; szimbolikus link = útvonalat tartalmazó hivatkozás.

## A lecke feladata

```quiz required
? Melyik Linux mappában vannak a rendszerszintű beállítófájlok?
+ /etc
- /bin
- /tmp
- /home
! Pl. /etc/hostname, /etc/fstab.

? A `/home/anna` mappában állsz. Mi a `labor/a.txt` relatív út abszolút megfelelője?
= /home/anna/labor/a.txt
! A relatív utat az aktuális mappához fűzzük.

? Mit jelent a `..` egy elérési útban?
- az aktuális mappát
+ a szülő mappát
- a gyökeret
- a saját mappát
! cd .. = egy szinttel feljebb.

? Melyik mappában vannak Linuxon a naplófájlok?
= /var/log
! Pl. /var/log/syslog.

? Melyik linktípus „lóg”, ha az eredeti fájlt törlöd?
- kemény link
+ szimbolikus link
- mindkettő
- egyik sem
! A szimbolikus link csak egy útvonalat tárol.
```
