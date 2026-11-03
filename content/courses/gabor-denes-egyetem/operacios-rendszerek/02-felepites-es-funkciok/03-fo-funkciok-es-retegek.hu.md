---
title: Az operációs rendszer fő funkciói és rétegei
summary: Folyamat-, memória-, fájl-, I/O- és biztonságkezelés – és hogyan épül egymásra az OS.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- melyek az OS **fő funkciói** (alrendszerei), és mit csinál mindegyik,
- hogyan épül fel **rétegesen** egy operációs rendszer,
- hol találkozol ezekkel a funkciókkal a mindennapokban.

## A fő funkciók

| Alrendszer               | Feladata                                                              | Hol látod?                          |
| ------------------------ | --------------------------------------------------------------------- | ----------------------------------- |
| **folyamatkezelés**      | programok indítása, leállítása, ütemezése, kommunikációja             | Feladatkezelő, `ps`, `top`          |
| **memóriakezelés**       | memória kiosztása, visszavétele, védelme, virtuális memória           | „memóriahasználat 63%”              |
| **fájlkezelés**          | fájlok, mappák, jogosultságok, fájlrendszerek                         | Fájlkezelő, `ls`, `cd`              |
| **I/O- és eszközkezelés**| illesztőprogramok, pufferelés, nyomtatósor                            | Eszközkezelő, `lsusb`               |
| **hálózatkezelés**       | protokollok (TCP/IP), hálózati interfészek                            | Wi-Fi ikon, `ip addr`               |
| **védelem és biztonság** | felhasználók, jogosultságok, hitelesítés, naplózás                   | bejelentkezés, UAC, `sudo`          |
| **felhasználói felület** | parancssor és grafikus felület                                        | asztal, terminál                    |

A tárgy következő témakörei ezeket veszik sorra – ez a lecke a „térkép”.

## Rétegek

Egy OS-t gyakran **rétegekként** írunk le: minden réteg csak az alatta lévő szolgáltatásait használja.

```text
6. felhasználói programok
5. felhasználói felület (shell, GUI)
4. fájlrendszer
3. I/O-kezelés, pufferek
2. memóriakezelés (virtuális memória)
1. folyamatkezelés, ütemezés, megszakítások
0. hardver
```

Ez a modell (Dijkstra THE rendszeréből, 1968) jól érthetővé teszi a felépítést: a fájlrendszernek nem kell tudnia, hogyan ütemez a processzor, csak használja a memória- és I/O-réteget.

A valódi rendszerek nem ennyire szigorúan rétegzettek. A kernel felépítésének mai fő típusai (**monolitikus**, **mikrokernel**, **hibrid**) külön témakört kapnak a kernel és a felhasználói tér kapcsán.

## Szolgáltatások egy program szemszögéből

Egy egyszerű `python jegyzet.py` futtatásakor az OS:

1. **betölti** a Python-értelmezőt a memóriába (memóriakezelés),
2. létrehoz egy új **folyamatot**, és időt ad neki a processzoron (folyamatkezelés),
3. megnyitja a `jegyzet.py` **fájlt**, és ellenőrzi, van-e hozzá jogod (fájlkezelés, védelem),
4. a `print` kimenetét a **terminálba** juttatja (I/O),
5. a program végén **felszabadítja** a memóriát és bezárja a fájlokat.

## Összefoglalás

- Fő funkciók: folyamat-, memória-, fájl-, I/O-, hálózat- és biztonságkezelés, valamint a felhasználói felület.
- A réteges modellben minden réteg csak az alatta lévőre épül.
- Egy program futtatása az OS szinte minden alrendszerét igénybe veszi.

## A lecke feladata

```quiz required
? Melyik alrendszer feladata a virtuális memória kezelése?
- folyamatkezelés
+ memóriakezelés
- fájlkezelés
- hálózatkezelés
! A memóriakezelés osztja ki, védi és bővíti (virtuálisan) a memóriát.

? Melyik alrendszer dönti el, hogy melyik program kapja meg legközelebb a processzort?
+ folyamatkezelés (ütemező)
- fájlkezelés
- I/O-kezelés
- felhasználói felület
! Az ütemező (scheduler) a folyamatkezelés része.

? A réteges modellben melyik réteg van legalul (0. szint)?
= hardver
! Erre épül az ütemezés, a memóriakezelés stb.

? Ki dolgozta ki 1968-ban a réteges THE operációs rendszert?
- Linus Torvalds
- Bill Gates
+ Edsger W. Dijkstra
- Ken Thompson
! A holland Dijkstra az Eindhoveni Műszaki Egyetemen.
```
