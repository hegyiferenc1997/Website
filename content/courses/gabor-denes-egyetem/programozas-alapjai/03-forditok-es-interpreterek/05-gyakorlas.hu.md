---
title: Gyakorlás – fordítók és interpreterek
summary: Ellenőrző kérdések a fordítás folyamatáról, és kísérletek a Python bájtkódjával.
minutes: 40
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

## Összefoglaló feladat: Mini fordító: kifejezés kiértékelése

A témakör összefoglaló feladata: építs egy mini „fordítót”, amely egy kifejezést **tokenekre bont**, majd **kiértékel** – a `+`, `-` és `*` műveletekkel, a szokásos precedenciával (a szorzás előbb). Zárójel és osztás nincs, csak nemnegatív egész számok.

Írj `kiszamol(kifejezes)` függvényt! Az `eval()` használata tilos – az éppen a lényeget spórolná meg. Például `kiszamol("2 + 3*4")` → 14, `kiszamol("10 - 2*3 - 1")` → 3.

Tipp: két lépésben dolgozz. Először a tokenekből szorzatokat számolj (a `*`-gal összekötött számokat összeszorzod), és jegyezd meg előttük az előjelet; utána a szorzatokat előjelestől összeadod.

```python starter required
def tokenek(kifejezes):
    # a lecke tokenizálója (számok és műveleti jelek)
    pass


def kiszamol(kifejezes):
    # 1. tokenek
    # 2. tagok: [+szorzat, -szorzat, ...]
    # 3. a tagok összege
    pass


print(kiszamol("2 + 3*4"))        # 14
```

<details>
<summary>Megoldás</summary>

```python solution
def tokenek(kifejezes):
    eredmeny = []
    szam = ""
    for karakter in kifejezes:
        if karakter.isdigit():
            szam += karakter
            continue
        if szam:
            eredmeny.append(szam)
            szam = ""
        if karakter in "+-*":
            eredmeny.append(karakter)
        elif karakter != " ":
            raise ValueError(f"Ismeretlen karakter: {karakter!r}")
    if szam:
        eredmeny.append(szam)
    return eredmeny


def kiszamol(kifejezes):
    lista = tokenek(kifejezes)
    osszeg = 0
    elojel = 1
    szorzat = int(lista[0])
    i = 1
    while i < len(lista):
        jel, szam = lista[i], int(lista[i + 1])
        if jel == "*":
            szorzat *= szam
        else:
            osszeg += elojel * szorzat      # lezárjuk az előző tagot
            elojel = 1 if jel == "+" else -1
            szorzat = szam
        i += 2
    return osszeg + elojel * szorzat


print(kiszamol("2 + 3*4"))        # 14
```

</details>

```python test
assert kiszamol("2 + 3*4") == 14, "2 + 3*4 = 14 (a szorzás előbb!)"
assert kiszamol("10 - 2*3 - 1") == 3, "10 - 2*3 - 1 = 3"
assert kiszamol("7") == 7, "Egyetlen szám önmaga."
assert kiszamol("2*3*4 - 4*5 + 1") == 5, "2*3*4 - 4*5 + 1 = 5"
assert kiszamol("100-1-1") == 98, "A kivonás balról jobbra halad: 100-1-1 = 98"
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Programozási feladatok

**1.** **Szintaxis-ellenőrző.** Írd meg a `szintaktikailag_helyes(kod)` függvényt, amely `True`-t ad, ha a Python-kód lefordítható, és `False`-t, ha szintaktikai hibás! Használd a beépített `compile(kod, "<kod>", "exec")` függvényt, és kapd el a `SyntaxError`-t. (A kódot nem kell futtatni.)

```python starter
def szintaktikailag_helyes(kod):
    return True
```

<details>
<summary>Megoldás</summary>

```python solution
def szintaktikailag_helyes(kod):
    try:
        compile(kod, "<kod>", "exec")        # csak fordít, nem futtat
        return True
    except SyntaxError:
        return False
```

</details>

```python test
assert szintaktikailag_helyes("x = 1 + 2") is True
assert szintaktikailag_helyes("print('hiányzó zárójel'") is False
assert szintaktikailag_helyes("if True:\nprint(1)") is False
assert szintaktikailag_helyes("1 / 0") is True
print("Minden ellenőrzés sikeres!")
```

**2.** **Kulcsszavak.** Írd meg a `kulcsszavak(kod)` függvényt, amely ábécérendben, ismétlés nélkül visszaadja a kódban szereplő Python-kulcsszavakat! A szavakat a `re.findall(r"[A-Za-z_]+", kod)` adja, a kulcsszó-e kérdést a `keyword.iskeyword` dönti el.

```python starter
import re

def kulcsszavak(kod):
    return re.findall(r"[A-Za-z_]+", kod)
```

<details>
<summary>Megoldás</summary>

```python solution
import keyword
import re

def kulcsszavak(kod):
    return sorted({szo for szo in re.findall(r"[A-Za-z_]+", kod) if keyword.iskeyword(szo)})
```

</details>

```python test
assert kulcsszavak("for i in range(3):\n    if i: print(i)") == ["for", "if", "in"]
assert kulcsszavak("x = 1") == []
assert kulcsszavak("def f(): return None") == ["None", "def", "return"]
print("Minden ellenőrzés sikeres!")
```

**3.** **Valódi kódsorok.** Írd meg a `kodsorok(kod)` függvényt, amely megszámolja, hány olyan sor van a kódban, amely nem üres, és nem csak megjegyzés (a `#`-tel kezdődő sorokat – az elején lévő szóközök után – a fordító figyelmen kívül hagyja)!

```python starter
def kodsorok(kod):
    return len(kod.splitlines())
```

<details>
<summary>Megoldás</summary>

```python solution
def kodsorok(kod):
    db = 0
    for sor in kod.splitlines():
        s = sor.strip()
        if s and not s.startswith("#"):     # üres és megjegyzéssor nem számít
            db += 1
    return db
```

</details>

```python test
kod = "# összeadás\nx = 1\n\n    # belső megjegyzés\ny = x + 2  # ez kód\n"
assert kodsorok(kod) == 2
assert kodsorok("") == 0
assert kodsorok("print(1)\nprint(2)") == 2
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Melyik állítás igaz a fordítóra (compiler)?
+ a teljes forráskódot futtatás előtt gépi kódra (vagy köztes kódra) alakítja
- soronként értelmezi és rögtön végrehajtja a kódot
- csak Pythonban létezik
- a futás közbeni hibákat is mind előre kiszűri
! Az interpreter soronként (utasításonként) hajt végre.

? Mi a `24 * 60` kifejezés értéke, amelyet a Python már fordításkor kiszámol (konstans-összevonás)?
= 1440
! A bájtkódban csak a kész 1440 szerepel.

? Melyik hiba derül ki már a program indítása előtt Pythonban?
- nullával osztás
- nem létező kulcs a szótárban
+ hiányzó kettőspont az `if` után
- rossz eredményt adó képlet
! A szintaktikai hibát az elemzés találja meg.

? Mit csinál az inkrementális build?
- mindig az egész projektet újrafordítja
+ csak a megváltozott fájlokat és a tőlük függőket fordítja újra
- törli a lefordított fájlokat
- a programot interpreterrel futtatja
! Nagy projektnél órákat spórol.
```
