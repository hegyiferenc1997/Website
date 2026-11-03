---
title: Szálak
summary: Mi a szál, mit osztanak meg a szálak egy folyamaton belül, felhasználói és kernelszintű szálak, szálmodellek.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- mi a **szál** (_thread_), és miben különbözik a folyamattól,
- mit **osztanak meg** a szálak, és mi **saját** mindegyiknek,
- mi a **felhasználói** és a **kernelszintű** szál, és milyen **szálmodellek** vannak.

## Miért kellenek szálak?

Egy böngészőnek egyszerre kell oldalt letöltenie, képet kirajzolnia és a kattintásokra reagálnia. Ha mindez egyetlen végrehajtási sorban menne, egy lassú letöltés alatt „lefagyna” az ablak. A megoldás: egy folyamaton belül **több szál**, amelyek **párhuzamosan** (vagy felváltva) futnak.

A **szál** a végrehajtás legkisebb egysége, amelyet az OS ütemezni tud. Egy folyamatnak legalább egy szála van (a fő szál).

## Mit osztanak meg a szálak?

| Közös (a folyamaté)                     | Saját (szálanként)             |
| --------------------------------------- | ------------------------------ |
| kód (text)                              | programszámláló (PC)           |
| globális adatok, kupac                  | regiszterek                    |
| megnyitott fájlok, hálózati kapcsolatok | **verem** (stack)              |
| címtér, jogosultságok                   | állapot (fut, kész, várakozik) |

Előnyök a külön folyamatokkal szemben:

- **gyorsabb létrehozás és váltás** – nem kell új címteret felépíteni,
- **egyszerű adatmegosztás** – mindegyik ugyanazt a memóriát látja,
- **többmagos kihasználás** – a szálak külön magokon futhatnak.

Hátrány: mivel a memória közös, ha két szál egyszerre ír ugyanoda, **versenyhelyzet** alakulhat ki – erről a következő témakörben lesz szó. És ha egy szál összeomlik (pl. érvénytelen memóriacím), **az egész folyamat** leáll.

## Felhasználói és kernelszintű szálak

- **Felhasználói szintű szálak**: egy könyvtár kezeli őket a folyamaton belül, a kernel **nem tud róluk** (csak egy folyamatot lát). Váltásuk nagyon gyors, de ha egy szál blokkoló rendszerhívást végez, **az összes** megáll, és nem tudnak több magon futni.
- **Kernelszintű szálak**: a kernel ismeri és ütemezi mindegyiket. Egy szál blokkolása nem állítja meg a többit, és több magot is kihasználnak. Linuxon és Windowson a programok szálai kernelszálak.

## Szálmodellek

| Modell                  | Leírás                                      | Példa                               |
| ----------------------- | ------------------------------------------- | ----------------------------------- |
| **sok-az-egyhez** (N:1) | sok felhasználói szál egyetlen kernelszálon | régi „green thread” könyvtárak      |
| **egy-az-egyhez** (1:1) | minden felhasználói szálhoz egy kernelszál  | Linux (pthreads), Windows           |
| **sok-a-sokhoz** (N:M)  | sok felhasználói szál kevesebb kernelszálon | Go gorutinok, Java virtuális szálak |

## Szálak a gyakorlatban

```c
// Két szál ugyanazt a függvényt futtatja (POSIX szálak).
#include <pthread.h>
#include <stdio.h>

void *dolgozik(void *arg) {
    printf("Szál %ld dolgozik\n", (long)arg);
    return NULL;
}

int main(void) {
    pthread_t t1, t2;
    pthread_create(&t1, NULL, dolgozik, (void *)1);
    pthread_create(&t2, NULL, dolgozik, (void *)2);
    pthread_join(t1, NULL);   // megvárjuk mindkettőt
    pthread_join(t2, NULL);
    return 0;
}
```

Fordítás az Ubuntu VM-ben: `gcc szalak.c -o szalak -pthread && ./szalak`. A két sor sorrendje futásonként változhat – az ütemező dönti el.

Egy folyamat szálait így nézheted meg:

```bash
ps -eLf | head      # minden szál külön sorban (LWP = szálazonosító)
top -H              # szálanként mutatja a CPU-használatot
```

## Összefoglalás

- A szál a végrehajtás legkisebb ütemezhető egysége; egy folyamatban több is lehet.
- A szálak megosztják a kódot, a kupacot, a fájlokat; saját a PC, a regiszterek és a verem.
- A kernelszálak több magon futhatnak, és egymástól függetlenül blokkolódhatnak.
- Modellek: N:1, 1:1 (Linux, Windows), N:M (Go, Java virtuális szálak).

## A lecke feladata

```quiz required
? Melyik saját minden szálnak (nem közös a folyamat többi szálával)?
- a kupac (heap)
- a megnyitott fájlok
+ a verem (stack)
- a programkód
! A verem, a regiszterek és a programszámláló szálanként külön van.

? Mi történik a többi szállal, ha egy felhasználói szintű (N:1) szál blokkoló rendszerhívást végez?
+ Mind megállnak, mert a kernel csak egy végrehajtási egységet lát.
- Semmi, tovább futnak.
- Átkerülnek egy másik folyamatba.
- A kernel új szálat indít helyettük.
! Ezért használnak a mai rendszerek kernelszálakat (1:1).

? Melyik szálmodellt használja a Linux pthreads könyvtára? (pl. 1:1)
= 1:1
! Egy felhasználói szál = egy kernelszál.

? Melyik C függvény hoz létre új POSIX szálat?
= pthread_create
! A pthread_join várja meg a befejeződését.
```
