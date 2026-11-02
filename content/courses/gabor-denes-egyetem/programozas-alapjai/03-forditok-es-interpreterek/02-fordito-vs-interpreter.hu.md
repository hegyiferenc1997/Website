---
title: Fordítók és interpreterek különbségei
summary: Fordított, értelmezett és bájtkódos nyelvek, JIT – és hogyan fut valójában egy Python program.
minutes: 15
---

## Amit ebben a leckében megtanulsz

- miben különbözik a **fordító** és az **interpreter (értelmező)**,
- mi a **bájtkód** és a **virtuális gép**,
- mi a **JIT** fordítás,
- hogyan fut a Python kód (CPython).

## Fordító (compiler)

A fordító a **teljes** forráskódot előre lefordítja gépi kódra. Az eredmény egy önálló futtatható fájl.

- ✅ gyors futás, a hibák egy része már fordításkor kiderül
- ✅ a futtatáshoz nem kell a fordító
- ❌ minden platformra (Windows, Linux, ARM) külön kell fordítani
- ❌ minden módosítás után újra kell fordítani

Példák: C, C++, Rust, Go.

## Interpreter (értelmező)

Az interpreter a forráskódot **futás közben**, utasításról utasításra értelmezi és hajtja végre.

- ✅ azonnal futtatható, gyors kipróbálás (interaktív mód)
- ✅ hordozható: ahol van értelmező, ott fut
- ❌ lassabb futás
- ❌ egyes hibák csak akkor derülnek ki, amikor az adott sorra kerül a vezérlés

Példák: a klasszikus BASIC, shell szkriptek, JavaScript (eredetileg).

## A gyakorlat: bájtkód és virtuális gép

A legtöbb modern nyelv a kettő keverékét használja: a forráskódot egy köztes, gépfüggetlen **bájtkódra** fordítja, amit egy **virtuális gép (VM)** futtat.

| Nyelv  | Bájtkód  | Virtuális gép              |
| ------ | -------- | -------------------------- |
| Java   | `.class` | JVM (Java Virtual Machine) |
| C#     | CIL      | .NET CLR                   |
| Python | `.pyc`   | CPython virtuális gép      |

## JIT – futás közbeni fordítás

A **JIT (Just-In-Time)** fordító futás közben figyeli, mely kódrészek futnak gyakran, és azokat gépi kódra fordítja. Így az értelmezett nyelv sebessége megközelítheti a fordítottét. JIT-et használ a JVM, a .NET, a böngészők JavaScript-motorjai és a PyPy (gyors Python-megvalósítás).

## Hogyan fut a Python?

A szokásos Python (CPython) először **bájtkódra fordít**, majd azt értelmezi. A bájtkódot meg is nézheted a `dis` modullal:

```python run
import dis

def osszead(a, b):
    return a + b

# A függvény bájtkódja: ezeket az utasításokat hajtja végre a Python virtuális gép.
dis.dis(osszead)
```

Az importált modulok bájtkódja a `__pycache__` mappába kerül (`.pyc` fájlok), így a következő indítás gyorsabb.

> **Fontos:** a „fordított” vagy „értelmezett” nem a nyelv, hanem a **megvalósítás** tulajdonsága. Pythonhoz is van JIT-es (PyPy), C-hez is van értelmező.

## Összefoglalás

| Szempont          | Fordító                     | Interpreter             |
| ----------------- | --------------------------- | ----------------------- |
| mikor fordít      | előre, egyben               | futás közben, soronként |
| futási sebesség   | gyors                       | lassabb                 |
| hibák felfedezése | sok már fordításkor         | futáskor                |
| hordozhatóság     | platformonként újrafordítás | ahol van értelmező      |

A Python bájtkódra fordít, és azt egy virtuális gép futtatja.
