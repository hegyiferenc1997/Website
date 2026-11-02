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
