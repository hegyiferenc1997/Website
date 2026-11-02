---
title: A programozási paradigmák áttekintése
summary: A paradigma a programozás „gondolkodásmódja” – rövid térkép, mielőtt a következő témakörben részletesen megnézzük.
minutes: 8
---

## Mi a paradigma?

A **programozási paradigma** egy szemléletmód: milyen fogalmakkal írjuk le a programot, és hogyan szervezzük meg a kódot. Ugyanazt a feladatot többféle paradigmában is meg lehet oldani.

| Paradigma         | Alapgondolat                                                      | Jellemző nyelvek            |
| ----------------- | ----------------------------------------------------------------- | --------------------------- |
| imperatív         | lépésenként megmondjuk, **hogyan** változzon az állapot           | C, Pascal, Python           |
| procedurális      | az imperatív kódot **eljárásokra / függvényekre** bontjuk         | C, Python                   |
| objektumorientált | az adatok és a rajtuk végzett műveletek **objektumokba** kerülnek | Java, C#, Python, Ruby      |
| funkcionális      | a program **függvények kompozíciója**, mellékhatások nélkül       | Haskell, F#, részben Python |
| deklaratív        | azt írjuk le, **mit** szeretnénk, nem azt, hogyan                 | SQL, HTML, Prolog           |

## Ugyanaz a feladat kétféleképpen

Feladat: a páros számok négyzeteinek összege 1-től 10-ig.

```python run
# Imperatív stílus: lépésenként módosítjuk az összeg változót.
osszeg = 0
for i in range(1, 11):
    if i % 2 == 0:
        osszeg += i * i
print(osszeg)   # 220

# Deklaratív / funkcionális stílus: leírjuk, MIT akarunk összegezni.
print(sum(i * i for i in range(1, 11) if i % 2 == 0))   # 220
```

> A Python **többparadigmás** nyelv: imperatívan, objektumorientáltan és funkcionális elemekkel is lehet benne programozni. Ezért is jó első nyelvnek.

A paradigmákat a **Programozási nyelvek és paradigmák** témakörben részletesen, példákkal együtt tárgyaljuk.

## Összefoglalás

- A paradigma a program felépítésének szemléletmódja.
- Fő paradigmák: imperatív (procedurális), objektumorientált, funkcionális, deklaratív.
- A Python több paradigmát is támogat.

## A lecke feladata: Ugyanaz kétféle szemlélettel

Számold ki az 1 és `n` közötti **páratlan** számok négyzetének összegét kétféleképpen:

- `imperativ(n)`: lépésenként, egy gyűjtőváltozóval és `for` ciklussal;
- `deklarativ(n)`: egyetlen kifejezéssel, a `sum()` függvénnyel (mint a lecke példájában).

Például `n = 5` esetén: 1² + 3² + 5² = 35.

```python starter required
def imperativ(n):
    osszeg = 0
    # ciklus 1-től n-ig, a páratlanok négyzetét add hozzá
    return osszeg


def deklarativ(n):
    # egyetlen sor: return sum(...)
    pass
```

<details>
<summary>Megoldás</summary>

```python solution
def imperativ(n):
    osszeg = 0
    for i in range(1, n + 1):
        if i % 2 == 1:
            osszeg += i * i
    return osszeg


def deklarativ(n):
    return sum(i * i for i in range(1, n + 1) if i % 2 == 1)
```

</details>

```python test
assert imperativ(5) == 35, "imperativ(5): 1 + 9 + 25 = 35"
assert deklarativ(5) == 35, "deklarativ(5): 1 + 9 + 25 = 35"
for n in [0, 1, 10, 99]:
    assert imperativ(n) == deklarativ(n), f"A két megoldás eredménye eltér, ha n = {n}."
assert imperativ(10) == 165, "imperativ(10) eredménye 165."
```
