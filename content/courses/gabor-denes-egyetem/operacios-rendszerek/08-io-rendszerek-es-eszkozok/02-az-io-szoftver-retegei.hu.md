---
title: Az I/O-szoftver rétegei
summary: Illesztőprogramok, eszközfüggetlen réteg, pufferelés, gyorsítótár, spoololás, blokkoló, nem blokkoló és aszinkron I/O.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- milyen **rétegekből** áll az OS I/O-szoftvere, és mi az **illesztőprogram** szerepe,
- mire való a **pufferelés**, a **gyorsítótár** és a **spoololás**,
- mi a különbség a **blokkoló**, a **nem blokkoló** és az **aszinkron** I/O között.

## A rétegek

```text
felhasználói program:      printf("hello"), fájl megnyitása
  ↓
felhasználói könyvtárak:   C könyvtár (libc), pufferelt stdio
  ↓
eszközfüggetlen OS-réteg:  egységes elnevezés (/dev/sda), jogosultság, puffer, gyorsítótár, hibakezelés
  ↓
illesztőprogram (driver):  az adott eszköz parancsai
  ↓
megszakításkezelő
  ↓
hardver (vezérlő, eszköz)
```

## Az illesztőprogram

Az **illesztőprogram** (_device driver_) az OS része, amely egy **konkrét eszköztípust** kezel: ismeri a vezérlő regisztereit és parancsait. Az OS felé **egységes felületet** ad (pl. „olvass egy blokkot”), így a fájlrendszernek nem kell tudnia, hogy SATA SSD-ről vagy USB-s pendrive-ról van-e szó.

- Általában a **gyártó** írja (videokártya, Wi-Fi, nyomtató).
- **Kernel módban** fut – egy hibás driver az egész rendszert összeomolhatja. A Windows „kék halál” (BSOD) összeomlásainak jó része hibás illesztőprogramtól jön.

Hol látod?

```bash
lsmod | head            # Linux: betöltött kernelmodulok (sok közülük driver)
lspci -k | head -20     # melyik PCI-eszközt melyik driver kezeli
```

Windowson: **Eszközkezelő** (Win + X → Eszközkezelő) – a sárga felkiáltójel hiányzó vagy hibás drivert jelez.

## Pufferelés, gyorsítótár, spoololás

- **Pufferelés** (_buffering_): az adatot ideiglenesen egy memóriaterületen gyűjtjük. Okai: a gyártó és a fogyasztó sebessége eltér (hálózatról letöltött videó), vagy eltérő a méret (a program bájtonként ír, a lemez blokkonként). A **kettős pufferelés** során az egyik puffert töltjük, a másikat ürítjük – így nincs megakadás.
- **Gyorsítótár** (_cache_): a gyakran olvasott lemezblokkok másolatát a RAM-ban tartjuk. Ezért gyorsabb egy program **második** indítása. Linuxon a `free -h` „buff/cache” oszlopa mutatja – ez **nem elpazarolt** memória, szükség esetén azonnal felszabadul.
- **Spoololás** (_spooling_): egy egyszerre csak egy felhasználót kiszolgáló eszköz (nyomtató) elé **sort** teszünk a lemezen. Mindenki „kinyomtathat” egyszerre, a nyomtatási sor szolgáltatás egyenként adja tovább a feladatokat.

## Blokkoló, nem blokkoló, aszinkron

| Fajta            | Mit csinál a hívás?                                             | Példa                                   |
| ---------------- | --------------------------------------------------------------- | --------------------------------------- |
| **blokkoló**     | a folyamat **vár** (várakozó állapot), amíg az I/O kész         | `input()` Pythonban, `read()`           |
| **nem blokkoló** | **azonnal visszatér** azzal, ami éppen elérhető (akár semmivel) | hálózati socket nem blokkoló módban     |
| **aszinkron**    | elindítja az I/O-t, azonnal visszatér, és **később értesít**    | `async`/`await`, io_uring, Windows IOCP |

A blokkoló a legegyszerűbb programozni; egy nagy forgalmú webszerver viszont aszinkron I/O-val szolgál ki egyetlen szálon több ezer kapcsolatot.

## Összefoglalás

- Rétegek: program → könyvtár → eszközfüggetlen réteg → illesztőprogram → megszakításkezelő → hardver.
- Az illesztőprogram egységes felületet ad az eszközhöz; kernel módban fut, hibája összeomlást okozhat.
- Puffer: sebesség- és méretkülönbség áthidalása; cache: gyakori adatok a RAM-ban; spool: sor a nyomtató előtt.
- Blokkoló: vár; nem blokkoló: azonnal visszatér; aszinkron: később értesít.

## A lecke feladata

```quiz required
? Melyik szoftverréteg ismeri egy konkrét eszköz regisztereit és parancsait?
- a felhasználói könyvtár
- az eszközfüggetlen réteg
+ az illesztőprogram (driver)
- a shell
! Az OS felé egységes felületet ad.

? Melyik technika tesz sort a lemezen egy nyomtató elé?
+ spoololás
- gyorsítótárazás
- DMA
- lapozás
! Simultaneous Peripheral Operations On-Line.

? Miért gyorsabb egy program második indítása?
- Mert a program kisebb lett.
+ Mert a fájljai a lemez-gyorsítótárban (RAM) maradtak.
- Mert a lemez felmelegedett.
- Mert az OS kikapcsolta a védelmet.
! A cache a gyakran olvasott blokkokat a memóriában tartja.

? Melyik Windows-eszközben látod a hiányzó illesztőprogramokat (sárga felkiáltójel)?
= Eszközkezelő
= Device Manager
= devmgmt.msc
! Win + X → Eszközkezelő.

? Melyik I/O-fajtánál indul el a művelet, a hívás azonnal visszatér, és a program később értesítést kap?
- blokkoló
- nem blokkoló
+ aszinkron
- lekérdezéses
! Pl. async/await, io_uring.
```
