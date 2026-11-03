---
title: Multiprogramozás és multitasking
summary: Kötegelt rendszerek, multiprogramozás, időosztás, valamint a kooperatív és a preemptív multitasking.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- hogyan jutottunk el a **kötegelt** feldolgozástól a **multiprogramozáson** át az **időosztásig**,
- mi a különbség a **párhuzamosság** és a **konkurencia** (egyidejűség) között,
- miben különbözik a **kooperatív** és a **preemptív** multitasking.

## Kötegelt feldolgozás

Az 1950–60-as években a programok (**feladatok**, _jobs_) lyukkártyán érkeztek, és **egymás után** futottak. Amíg egy feladat a szalagos egységre várt, a drága processzor **tétlenül** állt.

```text
CPU: [A számol]  ..(A szalagra vár)..  [A számol]  [B számol] ..(B nyomtat).. [B számol]
                 ↑ kihasználatlan ↑                           ↑ kihasználatlan ↑
```

## Multiprogramozás

Ötlet: tartsunk **több** feladatot a memóriában. Ha az egyik I/O-ra vár, a CPU egy **másikat** futtat.

```text
CPU: [A] [B] [A] [C] [B] [A] …   ← szinte mindig dolgozik
```

Ehhez kellett: memóriavédelem (a feladatok ne írják felül egymást), ütemezés, megszakítások. Ezzel nőtt a **CPU-kihasználtság** és az átbocsátás – de egy feladat eredményére még órákat kellett várni.

## Időosztás (time-sharing)

Az 1960-as években (CTSS, MULTICS) megjelent az **időosztás**: sok felhasználó ül egyszerre **terminálnál**, és a CPU **nagyon rövid időszeletekben**, gyorsan váltogatva szolgálja ki őket. Mindenki úgy érzi, mintha övé lenne a gép. A cél már nem csak a kihasználtság, hanem a **rövid válaszidő**.

Ma ugyanez történik a laptopodon: a böngésző, a zenelejátszó, a VS Code és a háttérszolgáltatások **időszeletekben** váltják egymást – ez a **multitasking** (többfeladatos működés).

## Párhuzamosság és konkurencia

- **Konkurencia** (egyidejűség): több feladat **halad** egy időszakban, de nem feltétlenül ugyanabban a pillanatban – egy magon felváltva futnak.
- **Párhuzamosság**: több feladat **ténylegesen ugyanabban a pillanatban** fut, külön magokon.

Egy egymagos gép tud konkurens, de nem tud valódi párhuzamos végrehajtást; egy 8 magos egyszerre legfeljebb 8 szálat futtat párhuzamosan.

## Kooperatív és preemptív multitasking

| Szempont         | Kooperatív                                   | Preemptív                                        |
| ---------------- | -------------------------------------------- | ------------------------------------------------ |
| ki vált?         | a program **önként** adja át a CPU-t         | az **OS** veszi el (időzítő megszakítás)         |
| veszély          | egy lefagyott program **az egész gépet** megállítja | egy lefagyott program csak magát fagyasztja le |
| példák           | Windows 3.1, Mac OS 9 (klasszikus)          | Windows NT-től, Linux, macOS, Android            |

A kooperatív elv ma is él **programon belül**: a JavaScript eseményhurok vagy a Python `asyncio` feladatai `await`-nél önként adják át a vezérlést.

## Összefoglalás

- Kötegelt: egymás után, a CPU sokat tétlenkedik. Multiprogramozás: I/O alatt más feladat fut.
- Időosztás: rövid időszeletek, rövid válaszidő, sok felhasználó/program egyszerre.
- Konkurencia = felváltva haladnak; párhuzamosság = valóban egyszerre, több magon.
- Kooperatív: a program adja át a CPU-t; preemptív: az OS veszi el – minden mai OS ilyen.

## A lecke feladata

```quiz required
? Mi volt a multiprogramozás fő célja?
+ hogy a CPU ne álljon tétlenül, amíg egy feladat I/O-ra vár
- hogy több felhasználó tudjon egyszerre gépelni
- hogy a programok kisebbek legyenek
- hogy ne kelljen memóriavédelem
! A CPU-kihasználtság növelése.

? Melyik fogalom jelenti, hogy több feladat ténylegesen ugyanabban a pillanatban fut, külön magokon?
- konkurencia
+ párhuzamosság
- kötegelés
- spoololás
! A konkurencia felváltva haladást is jelenthet egy magon.

? Melyik multitaskingnál fagyaszthatja le egy rosszul megírt program az egész gépet?
+ kooperatív
- preemptív
- mindkettőnél
- egyiknél sem
! Ha a program sosem adja vissza a CPU-t, senki más nem fut.

? Egy 8 magos processzoron legfeljebb hány szál futhat valóban párhuzamosan (hyperthreading nélkül)?
= 8
! Magonként egy.
```
