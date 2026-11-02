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

## A lecke feladata: Írj egy veremgépes interpretert

A bájtkódot egy virtuális gép **értelmezi** utasításról utasításra. Írj egy pici veremgépet: a `futtat(program)` függvény utasítások listáját kapja, és a verem tetején lévő értéket adja vissza a végén.

| Utasítás | Jelentés                                               |
| -------- | ------------------------------------------------------ |
| `PUSH n` | az `n` egész számot a verem tetejére teszi             |
| `ADD`    | leveszi a felső két értéket, az összegüket visszateszi |
| `SUB`    | leveszi `b`-t, majd `a`-t, és `a - b`-t teszi vissza   |
| `MUL`    | leveszi a felső két értéket, a szorzatukat visszateszi |

Ismeretlen utasításnál dobj `ValueError` kivételt. Például `["PUSH 2", "PUSH 3", "ADD", "PUSH 4", "MUL"]` eredménye 20.

```python starter required
def futtat(program):
    verem = []
    for utasitas in program:
        reszek = utasitas.split()     # pl. ["PUSH", "2"]
        muvelet = reszek[0]
        # PUSH: verem.append(int(reszek[1]))
        # ADD / SUB / MUL: b = verem.pop(), a = verem.pop(), majd az eredmény vissza a verembe
        # egyébként: ValueError
    return verem[-1]


print(futtat(["PUSH 2", "PUSH 3", "ADD", "PUSH 4", "MUL"]))   # 20
```

<details>
<summary>Megoldás</summary>

```python solution
def futtat(program):
    verem = []
    for utasitas in program:
        reszek = utasitas.split()
        muvelet = reszek[0]
        if muvelet == "PUSH":
            verem.append(int(reszek[1]))
        elif muvelet in ("ADD", "SUB", "MUL"):
            b = verem.pop()
            a = verem.pop()
            if muvelet == "ADD":
                verem.append(a + b)
            elif muvelet == "SUB":
                verem.append(a - b)
            else:
                verem.append(a * b)
        else:
            raise ValueError(f"Ismeretlen utasítás: {utasitas}")
    return verem[-1]


print(futtat(["PUSH 2", "PUSH 3", "ADD", "PUSH 4", "MUL"]))   # 20
```

</details>

```python test
assert futtat(["PUSH 2", "PUSH 3", "ADD", "PUSH 4", "MUL"]) == 20, "(2 + 3) * 4 = 20"
assert futtat(["PUSH 10", "PUSH 4", "SUB"]) == 6, "10 - 4 = 6 (a sorrend számít!)"
assert futtat(["PUSH 7"]) == 7, "Egyetlen PUSH után a szám van a verem tetején."
assert futtat(["PUSH 1", "PUSH 2", "PUSH 3", "MUL", "ADD"]) == 7, "1 + 2 * 3 = 7"
try:
    futtat(["PUSH 1", "JUMP"])
    assert False, "Ismeretlen utasításnál ValueError kell."
except ValueError:
    pass
```
