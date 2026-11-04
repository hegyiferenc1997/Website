---
title: Fordító és értelmező
summary: Fordítás, értelmezés, köztes kód és virtuális gép; szintaktikai, futásidejű és logikai hibák.
minutes: 14
---

## Amit ebben a leckében megtanulsz

- hogyan lesz a forráskódból futó program: **fordító** és **értelmező**,
- mi a **köztes kód** és a **virtuális gép** (Java, C#),
- milyen **hibafajták** vannak.

## Forráskód

A programozó által írt szöveg a **forráskód** (pl. `program.py`, `main.c`). Ezt valamilyen módon gépi kóddá kell alakítani.

## Fordító (compiler)

A **fordító** a teljes forráskódot **előre** lefordítja egy önállóan futtatható gépi kódú programmá (Windowson `.exe`).

- **Előny**: gyors futás, a felhasználónak nem kell a fordító.
- **Hátrány**: minden módosítás után újra kell fordítani; a lefordított program csak egy platformon fut.
- Példák: **C**, **C++**, **Rust**, **Go**.

## Értelmező (interpreter)

Az **értelmező** a forráskódot **futás közben**, utasításról utasításra olvassa és hajtja végre.

- **Előny**: azonnal kipróbálható, bármely gépen fut, ahol van értelmező.
- **Hátrány**: általában lassabb; a hibák egy része csak futás közben derül ki.
- Példák: **Python**, **JavaScript**, **PHP**, **Ruby**.

## Köztes megoldás: bájtkód és virtuális gép

A **Java** és a **C#** a forráskódot egy **köztes kódra** (bájtkódra) fordítja, amelyet egy **virtuális gép** (JVM, illetve .NET CLR) futtat, és futás közben (**JIT**, just-in-time) gépi kódra fordít. Így a program hordozható („write once, run anywhere”), mégis gyors. (A Python is bájtkódra fordít belül, `.pyc` fájlokba.)

```text
 C:      forrás ──fordító──► gépi kód ──► CPU
 Python: forrás ──értelmező (bájtkód + futtatás)──► CPU
 Java:   forrás ──javac──► bájtkód ──JVM (JIT)──► CPU
```

## Hibafajták

| Hiba             | Mikor derül ki?          | Példa                                       |
| ---------------- | ------------------------ | ------------------------------------------- |
| **szintaktikai** | fordításkor / indításkor | hiányzó zárójel: `print("szia"`             |
| **futásidejű**   | futás közben             | nullával osztás, nem létező fájl megnyitása |
| **logikai**      | csak a rossz eredményből | `átlag = összeg / 2` a darabszám helyett    |

A logikai hiba a legalattomosabb: a program fut, csak rosszat számol. Ez ellen **teszteléssel** védekezünk.

```python run
# Futásidejű hiba elkapása
try:
    print(10 / 0)
except ZeroDivisionError:
    print("Nullával nem lehet osztani!")
```

## Összefoglalás

- Fordító: előre, egyben fordít → gyors, platformfüggő program (C, Rust).
- Értelmező: futás közben hajt végre → rugalmas, lassabb (Python, JS).
- Java/C#: bájtkód + virtuális gép (JIT). Hibák: szintaktikai, futásidejű, logikai.

## A lecke feladata

```quiz required
? Melyik nyelvet szokás **fordítóval** önálló gépi kódú programmá alakítani?
+ C
- Python
- JavaScript
- PHP
! A C, a C++, a Rust és a Go fordított nyelvek.

? Hogy hívják a Java köztes kódját futtató virtuális gépet (rövidítéssel)?
= JVM
! Java Virtual Machine.

? Milyen hiba az, ha a program lefut, de rossz eredményt ad?
- szintaktikai
- futásidejű
+ logikai
! A logikai hibát a tesztelés fogja meg.

? Milyen hibát okoz a `print("szia"` sor (hiányzik a zárójel)?
+ szintaktikai
- futásidejű
- logikai
! A program el sem indul.
```
