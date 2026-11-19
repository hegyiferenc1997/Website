---
title: Mélyebben – fordítás belülről
summary: Belenézünk, mit csinál a Python a kódoddal futtatás előtt – szintaxisfa az ast modullal, bájtkód a dis modullal, konstans-összevonás mint optimalizáció, egy saját veremgép, és egy „csak a változottat fordítsd újra” build-szimuláció.
minutes: 50
---

## Amit ebben a leckében megtanulsz

- milyen lépéseken megy át a forráskód: **tokenek → szintaxisfa → bájtkód → futtatás**,
- hogyan nézz bele ezekbe a Python saját eszközeivel (`ast`, `dis`),
- mit csinál egy fordító, amikor **optimalizál**,
- hogyan működik egy **veremgép**, és miért gyorsít az **inkrementális build**.

## 1. A forráskódtól a szintaxisfáig

Az alapleckében láttuk, hogy a fordító és az interpreter is először **elemzi** a kódot. A Python ezt rögtön meg is mutatja: az `ast` modul a kódból **absztrakt szintaxisfát** (AST) készít, amelyben már látszik, mi mivel kapcsolódik – például hogy a zárójel miatt előbb az összeadás történik:

```python run
# A kifejezés szintaxisfája: a zárójel miatt az összeadás kerül "lejjebb", az fut előbb
import ast

fa = ast.parse("ar = netto * (1 + afa)")
print(ast.dump(fa.body[0].value, indent=2))
```

A kimenetben a gyökér a szorzás (`Mult`), a jobb oldali ága pedig az összeadás (`Add`). A fa **alulról felfelé** értékelődik ki: előbb `1 + afa`, utána a szorzás. Ha szintaktikai hiba van a kódban (pl. hiányzó zárójel), már itt elakad – ezért jelzi a Python a szintaktikai hibát **mielőtt** egyetlen sor is lefutna.

## 2. Bájtkód: amit a Python-gép valóban végrehajt

A CPython a szintaxisfából **bájtkódot** készít: egyszerű utasításokat egy virtuális gép számára. Ez fordítás – csak nem gépi kódra, hanem egy köztes nyelvre. A `dis` modul megmutatja:

```python run
# A bájtkód kiírása: a Python virtuális gépe egy veremgép
import dis

def brutto(netto, afa):
    return netto * (1 + afa)

dis.dis(brutto)
```

A pontos utasításnevek Python-verziónként kicsit eltérnek, de a minta mindig ugyanaz: **betölt** (`LOAD_…`) értékeket egy verembe, egy **művelet** (`BINARY_OP`) leveszi a verem tetején lévő két értéket, és visszateszi az eredményt. Ez a **veremgép**. A Java (JVM) és a C# (.NET) is így működik: a forrásból bájtkód lesz, amit egy virtuális gép futtat – sőt, a gyakran futó részeket a **JIT** menet közben gépi kódra is lefordítja.

## 3. Optimalizáció: amit a fordító helyetted kiszámol

A fordító nemcsak lefordít, hanem **javít** is a kódon, ahol ezt biztonságosan megteheti. A legegyszerűbb példa a **konstans-összevonás**: ha egy kifejezés csak állandókból áll, az eredményt már fordításkor kiszámolja:

```python run
# Konstans-összevonás: a 24 * 60 * 60 szorzás nem futáskor történik meg
import dis

kod = compile("masodperc_naponta = 24 * 60 * 60", "<pelda>", "exec")
konstansok = [c for c in kod.co_consts if isinstance(c, int)]
print("a lefordított kódban tárolt egész konstansok:", konstansok)
dis.dis(kod)
```

A bájtkódban már csak a kész `86400` szerepel, szorzás egyáltalán nincs. Ezért nyugodtan írhatod olvashatóan a `24 * 60 * 60` alakot – nem lesz tőle lassabb a program. A C és C++ fordítók ennél sokkal többet tudnak (felesleges kód törlése, ciklusok átrendezése, függvények „beemelése”), ezért kapcsolható ki-be az optimalizáció (`-O0`, `-O2`): hibakereséshez az optimalizálatlan kód áttekinthetőbb.

## 4. Inkrementális build: csak azt fordítsd, ami változott

Egy nagy C++ projekt teljes lefordítása akár egy óra is lehet. A build-eszközök (make, CMake, Gradle) ezért megjegyzik, melyik fájl miből készült, és csak azt fordítják újra, ami **változott** – vagy aminek valamelyik függősége változott:

```python run
# Inkrementális build szimuláció: a tartalom hash-e alapján döntünk az újrafordításról
import hashlib

def hash_(szoveg):
    return hashlib.sha256(szoveg.encode()).hexdigest()[:8]

forrasok = {"main.c": "int main() {...}", "math.c": "int add() {...}", "io.c": "void log() {...}"}
fuggosegek = {"main.c": ["math.c", "io.c"], "math.c": [], "io.c": []}   # main.c használja a másik kettőt
utolso_build = {f: hash_(t) for f, t in forrasok.items()}               # az előző build állapota

forrasok["math.c"] = "int add() { /* gyorsabb */ }"                     # egy fájlt módosítunk

valtozott = {f for f, t in forrasok.items() if hash_(t) != utolso_build[f]}
ujra = sorted(f for f in forrasok if f in valtozott or valtozott & set(fuggosegek[f]))
print("változott:", sorted(valtozott))
print("újrafordítandó:", ujra, f"({len(ujra)} / {len(forrasok)} fájl)")
```

A `math.c` változott, ezért újra kell fordítani; a `main.c` is újrafordul, mert függ tőle; az `io.c` viszont marad. Egy több ezer fájlos projektben ez a különbség egy óra és fél perc között.

| Nézőpont        | Mit jelent neki a fordítás?                                                      |
| --------------- | -------------------------------------------------------------------------------- |
| **fejlesztő**   | gyors visszajelzés: hamar derüljön ki a hiba, és gyors legyen az újrafordítás    |
| **felhasználó** | gyors, kis méretű program; nem érdekli, hogyan készült                           |
| **üzemeltető**  | reprodukálható build: ugyanabból a forrásból mindig ugyanaz a program készüljön  |
| **biztonság**   | a lefordított programból is visszafejthető sok minden – titkot ne tegyél a kódba |

## Összefoglalás

- A forráskódból tokenek, majd szintaxisfa (AST) lesz; a szintaktikai hiba már itt kiderül.
- A CPython bájtkódra fordít, amit egy veremgép futtat; a `dis` modul ezt megmutatja.
- A fordító optimalizál, pl. a csak állandókból álló kifejezést előre kiszámolja.
- Az inkrementális build csak a változott fájlokat és a tőlük függőket fordítja újra.

## A lecke feladata: saját veremgép

A bájtkód veremgépét utánozva írd meg a `veremgep(tokenek)` függvényt, amely egy **fordított lengyel** (postfix) jelölésű kifejezést értékel ki! A tokenek listájában számok (szövegként) és a `+`, `-`, `*`, `/` jelek vannak. Számnál tedd a verembe az értékét (`float`), műveletnél vedd le a két felső elemet (előbb a jobb oldali jön le!), és tedd vissza az eredményt. A végén a verem egyetlen eleme az eredmény. Például `["3", "4", "+", "2", "*"]` jelentése `(3 + 4) * 2`, azaz `14.0`.

```python starter required
def veremgep(tokenek):
    verem = []
    for t in tokenek:
        if t in "+-*/":
            pass  # vedd le a két felső elemet, számold ki, tedd vissza
        else:
            verem.append(float(t))
    return verem[-1]


print(veremgep(["3", "4", "+", "2", "*"]))
```

<details>
<summary>Megoldás</summary>

```python solution
def veremgep(tokenek):
    verem = []
    for t in tokenek:
        if t in "+-*/":
            jobb = verem.pop()
            bal = verem.pop()
            if t == "+":
                verem.append(bal + jobb)
            elif t == "-":
                verem.append(bal - jobb)
            elif t == "*":
                verem.append(bal * jobb)
            else:
                verem.append(bal / jobb)
        else:
            verem.append(float(t))
    return verem[-1]


print(veremgep(["3", "4", "+", "2", "*"]))
```

</details>

```python test
assert veremgep(["3", "4", "+", "2", "*"]) == 14.0, "(3 + 4) * 2 = 14"
assert veremgep(["10", "4", "-"]) == 6.0, "a kivonásnál számít a sorrend: 10 - 4 = 6"
assert veremgep(["8", "2", "/", "3", "+"]) == 7.0, "8 / 2 + 3 = 7"
assert veremgep(["5"]) == 5.0, "egyetlen szám önmaga"
```
