---
title: A fordítás és futtatás folyamata
summary: Forráskódtól a futó programig – lexikai, szintaktikai és szemantikai elemzés, kódgenerálás, linkelés.
minutes: 15
---

## Amit ebben a leckében megtanulsz

- milyen lépéseken megy át a forráskód, mire a processzor végre tudja hajtani,
- mit csinál a **fordító (compiler)**, a **linker** és a **betöltő (loader)**,
- mi a **fordítási idejű** és a **futási idejű** hiba.

## A nagy kép

A processzor csak gépi kódot ért, mi viszont magas szintű nyelven írunk. A kettő között egy **fordítóprogram** teremt kapcsolatot.

```text
forráskód (.c)  →  [fordító]  →  tárgykód (.o)  →  [linker]  →  futtatható fájl (.exe)  →  [betöltő]  →  futás
```

## A fordító belső lépései

1. **Lexikai elemzés (tokenizálás):** a szöveget „szavakra” (tokenekre) bontja: kulcsszavak, nevek, számok, operátorok. A `x = 3 + y` sorból ez lesz: `NÉV(x)`, `=`, `SZÁM(3)`, `+`, `NÉV(y)`.
2. **Szintaktikai elemzés (parsing):** ellenőrzi a nyelvtant, és a tokenekből **szintaxisfát** (AST) épít. Itt derülnek ki a szintaktikai hibák (hiányzó zárójel, kettőspont).
3. **Szemantikai elemzés:** értelmezi a jelentést – létezik-e a használt változó, összeillenek-e a típusok.
4. **Köztes kód és optimalizálás:** a fát egyszerűbb, gépfüggetlen formára alakítja és gyorsítja.
5. **Kódgenerálás:** elkészül a gépi kód (vagy bájtkód).

A Python is megmutatja a saját tokenjeit és szintaxisfáját:

```python run
import ast
import io
import tokenize

kod = "x = 3 + y"

# 1. lépés: tokenek
for tok in tokenize.generate_tokens(io.StringIO(kod).readline):
    if tok.string.strip():
        print(tokenize.tok_name[tok.type], repr(tok.string))

# 2. lépés: szintaxisfa (AST)
print(ast.dump(ast.parse(kod).body[0]))
```

## Linkelés és betöltés

- A **linker (szerkesztő)** összefűzi a programod tárgykódját a felhasznált **könyvtárakkal** (pl. a `printf` kódjával), és létrehozza a futtatható fájlt.
  - **Statikus linkelés:** a könyvtár kódja bekerül a futtatható fájlba.
  - **Dinamikus linkelés:** a könyvtár külön fájlban van (`.dll`, `.so`), és futáskor töltődik be.
- A **betöltő (loader)** az operációs rendszer része: a programot a memóriába tölti és elindítja.

## Fordítási és futási idő

| | Fordítási idő (compile time) | Futási idő (run time) |
| --- | --- | --- |
| mikor? | a program elindítása előtt | a program futása közben |
| tipikus hiba | szintaktikai hiba, típushiba (statikus nyelvekben) | nullával osztás, nem létező fájl, rossz index |
| példa | hiányzó pontosvessző C-ben | `ZeroDivisionError` Pythonban |

```python
# Ez futási idejű hiba: szintaktikailag helyes, csak futáskor derül ki a gond.
oszto = 0
print(10 / oszto)   # ZeroDivisionError
```

## Összefoglalás

- A fordító lépései: **lexikai → szintaktikai → szemantikai elemzés → optimalizálás → kódgenerálás**.
- A **linker** összefűzi a részeket és a könyvtárakat, a **betöltő** elindítja a programot.
- Különböztesd meg a **fordítási** és a **futási idejű** hibákat.
