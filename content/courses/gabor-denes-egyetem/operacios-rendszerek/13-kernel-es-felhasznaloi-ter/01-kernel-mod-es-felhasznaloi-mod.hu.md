---
title: Kernel mód és felhasználói mód
summary: A módbit, a védelmi gyűrűk, a privilegizált utasítások, és hogyan oszlik meg a címtér a kernel és a programok között.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- mi a különbség a **kernel mód** és a **felhasználói mód** között,
- mik a **védelmi gyűrűk**, és melyek a **privilegizált utasítások**,
- hogyan oszlik meg a **címtér** a kernel és a felhasználói tér között, és mikor vált a CPU módot.

## Két mód

A processzor egy **módbittel** jelzi, milyen jogokkal fut az éppen végrehajtott kód:

| Szempont                 | **Kernel mód** (felügyelői, _supervisor_) | **Felhasználói mód** (_user mode_)       |
| ------------------------ | ----------------------------------------- | ---------------------------------------- |
| ki fut így?              | a kernel, az illesztőprogramok            | minden alkalmazás, a shell, a böngésző   |
| hardver elérése          | közvetlenül                               | **csak** rendszerhíváson át              |
| privilegizált utasítások | engedélyezettek                           | **tiltottak** (kivételt váltanak ki)     |
| memória                  | mindent elér                              | csak a saját címterét                    |
| hiba hatása              | az egész rendszer leállhat (kernel panic, BSOD) | csak a program áll le               |

**Privilegizált utasítások** például: megszakítások tiltása, az időzítő beállítása, a laptábla címének betöltése, I/O portok elérése, a gép leállítása. Ha egy felhasználói program ilyet próbál, a CPU **kivételt** vált ki, és a kernel leállítja a programot.

## Védelmi gyűrűk

Az x86 processzorok négy **gyűrűt** (_ring_) ismernek, 0-tól (legtöbb jog) 3-ig (legkevesebb):

```text
        ┌───────────────────────────┐
        │ Ring 3: alkalmazások      │
        │   ┌───────────────────┐   │
        │   │ Ring 2, 1 (ritkán) │   │
        │   │   ┌───────────┐   │   │
        │   │   │ Ring 0:   │   │   │
        │   │   │ kernel    │   │   │
        │   │   └───────────┘   │   │
        │   └───────────────────┘   │
        └───────────────────────────┘
```

A mai rendszerek gyakorlatilag csak a **0**-t (kernel) és a **3**-at (felhasználó) használják. A virtualizációhoz a processzorok egy további szintet is kaptak (gyakran „ring −1”-nek hívják) – ebben fut a hipervizor. Az ARM processzoroknál ugyanezt **kivételszinteknek** (EL0–EL3) hívják.

## Mikor vált a CPU módot?

- **felhasználó → kernel**: rendszerhíváskor (`syscall`), megszakításkor (időzítő, eszköz), kivételkor (laphiba, nullával osztás);
- **kernel → felhasználó**: a kezelés végén, egy speciális visszatérő utasítással (pl. `sysret`, `iret`).

A program **soha** nem kapcsolhat át magától kernel módba – csak az ellenőrzött belépési pontokon jöhet be.

## Kernel- és felhasználói tér a memóriában

Minden folyamat címtere két részre oszlik: az **alsó** rész a program saját területe (**felhasználói tér**), a **felső** részbe a kernel van leképezve (**kerneltér**). A kerneltér lapjai a laptáblában **„csak felügyelői”** jelölést kapnak, így felhasználói módból nem érhetők el. (A 2018-as Meltdown sebezhetőség óta a kernelek szigorúbban el is rejtik ezt a részt a felhasználói mód elől.)

Amikor ebben a tárgyban „felhasználói térről” (_user space_) beszélünk, a kernelen **kívül** futó összes szoftvert értjük alatta: a shellt, a könyvtárakat, a szolgáltatásokat, a grafikus felületet és az alkalmazásokat.

```bash
ps -eo pid,comm | grep "\[" | head    # Linuxon a [szögletes zárójeles] nevek kernelszálak
cat /proc/$$/status | grep -i ctxt   # hányszor váltott a shelled
```

## Összefoglalás

- Kernel mód: teljes hozzáférés; felhasználói mód: csak a saját memória, hardver csak rendszerhíváson át.
- Privilegizált utasítás felhasználói módban → kivétel → a kernel leállítja a programot.
- x86 gyűrűk: 0 = kernel, 3 = alkalmazás; a hipervizor egy még privilegizáltabb szinten fut.
- Módváltás: rendszerhívás, megszakítás, kivétel; a kerneltér felhasználói módból nem érhető el.

## A lecke feladata

```quiz required
? Melyik védelmi gyűrűben fut a kernel x86 processzoron?
= 0
= ring 0
! Az alkalmazások a 3-as gyűrűben futnak.

? Mi történik, ha egy felhasználói módú program privilegizált utasítást próbál végrehajtani?
- A CPU végrehajtja, de lassabban.
+ A CPU kivételt vált ki, és a kernel leállítja a programot.
- A program automatikusan kernel módba vált.
- A gép újraindul.
! Ez a hardveres védelem alapja.

? Melyik eset NEM vált ki módváltást felhasználói módból kernel módba?
- rendszerhívás
- időzítő megszakítás
- laphiba
+ egy közönséges függvényhívás a programon belül
! A saját függvények felhasználói módban futnak.

? Hányas gyűrűben futnak az alkalmazások x86-on?
= 3
! 0 = kernel, 3 = felhasználó.
```
