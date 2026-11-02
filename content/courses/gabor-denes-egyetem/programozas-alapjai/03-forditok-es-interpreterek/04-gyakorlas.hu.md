---
title: Gyakorlás – fordítók és interpreterek
summary: Ellenőrző kérdések a fordítás folyamatáról, és kísérletek a Python bájtkódjával.
minutes: 15
kind: practice
---

## Ellenőrző kérdések

**1. Sorold fel sorrendben a fordító fő lépéseit!**

<details>
<summary>Válasz</summary>

Lexikai elemzés → szintaktikai elemzés → szemantikai elemzés → (köztes kód és) optimalizálás → kódgenerálás.

</details>

**2. Mi a linker feladata? Mi a különbség a statikus és a dinamikus linkelés között?**

<details>
<summary>Válasz</summary>

A linker összefűzi a tárgykódokat és a könyvtárakat egy futtatható fájllá. Statikus linkelésnél a könyvtár kódja bekerül a futtatható fájlba, dinamikusnál külön fájlban marad (`.dll`, `.so`), és futáskor töltődik be.

</details>

**3. Fordított vagy értelmezett nyelv a Python?**

<details>
<summary>Válasz</summary>

A CPython mindkettő: a forráskódot bájtkódra fordítja, a bájtkódot pedig egy virtuális gép értelmezi. A „fordított/értelmezett” valójában a megvalósítás tulajdonsága.

</details>

**4. Mi a JIT, és miért gyorsítja a programot?**

<details>
<summary>Válasz</summary>

Just-In-Time fordítás: futás közben a gyakran futó kódrészeket gépi kódra fordítja, így azokat már nem kell újra és újra értelmezni.

</details>

**5. Mire jó egy build rendszer? Mondj kettőt!**

<details>
<summary>Válasz</summary>

Automatizálja a függőségek letöltését, a fordítást, a tesztelést és a csomagolást, és csak a megváltozott részeket fordítja újra. Példák: Make, CMake, Maven, Gradle, pip, npm.

</details>

**6. Fordítási vagy futási idejű hiba? a) hiányzó záró zárójel, b) nullával osztás, c) nem létező fájl megnyitása.**

<details>
<summary>Válasz</summary>

a) fordítási (szintaktikai), b) futási, c) futási.

</details>

## Feladatok

### 1. feladat: Tokenek számolása

A `tokenize` modul segítségével számold meg, hány nem üres token van a `kod` szövegben! Az eredményt a `darab` változóba tedd.

```python starter
import io
import tokenize

kod = "terulet = a * b + 2"
darab = 0
# Írd ide a számolást!
print(darab)
```

<details>
<summary>Megoldás</summary>

```python solution
import io
import tokenize

kod = "terulet = a * b + 2"
darab = 0
for tok in tokenize.generate_tokens(io.StringIO(kod).readline):
    if tok.string.strip():
        darab += 1
print(darab)
```

</details>

```python test
assert darab == 7, "terulet, =, a, *, b, +, 2 – ez 7 token"
print("Minden ellenőrzés sikeres!")
```

### 2. feladat: Szintaktikai hiba elkapása

A beépített `compile()` függvény lefordítja a szöveget bájtkódra, és `SyntaxError`-t dob, ha hibás. Írj `helyes_e(kod)` függvényt, amely `True`-t ad, ha a kód szintaktikailag helyes, különben `False`-t!

```python starter
def helyes_e(kod):
    pass   # használd a compile(kod, "<teszt>", "exec") hívást!
```

<details>
<summary>Megoldás</summary>

```python solution
def helyes_e(kod):
    try:
        compile(kod, "<teszt>", "exec")
        return True
    except SyntaxError:
        return False
```

</details>

```python test
assert helyes_e("print('szia')") is True
assert helyes_e("print('szia'") is False
assert helyes_e("if x > 3\n    pass") is False
assert helyes_e("x = 1 / 0") is True, "Ez futási hiba lenne, szintaktikailag helyes!"
print("Minden ellenőrzés sikeres!")
```
