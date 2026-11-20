---
title: Gyakorlás – függvények
summary: Ellenőrző kérdések és feladatok függvények írására, paraméterekre, hatókörre és egyszerű rekurzióra.
minutes: 55
kind: practice
---

## Ellenőrző kérdések

**1. Mi a különbség a függvény és az eljárás között? Mit ad vissza Pythonban egy „eljárás”?**

<details>
<summary>Válasz</summary>

A függvény értéket számol ki és visszaadja, az eljárás csak végrehajt valamit. Pythonban a `return` nélküli függvény `None`-t ad vissza.

</details>

**2. Mi a formális és az aktuális paraméter?**

<details>
<summary>Válasz</summary>

A formális paraméter a definícióban szereplő név (`def f(x)` → `x`), az aktuális paraméter (argumentum) a hívásnál átadott érték (`f(5)` → `5`).

</details>

**3. Mit ír ki?**

```python
x = 5
def f():
    x = 10
    return x
print(f(), x)
```

<details>
<summary>Válasz</summary>

`10 5` – a függvényben lévő `x` lokális, a globális `x` nem változik.

</details>

**4. Milyen két része van minden rekurzív függvénynek?**

<details>
<summary>Válasz</summary>

Alapeset (ahol megáll) és rekurzív eset (ahol kisebb részfeladatra hívja önmagát).

</details>

## Feladatok

### 1. feladat: Hőmérséklet-átváltás

Írj két függvényt: `c_to_f(c)` Celsiusból Fahrenheitbe (`F = C · 9/5 + 32`), és `f_to_c(f)` visszafelé. Az eredményt egy tizedesre kerekítsd!

```python starter
def c_to_f(c):
    pass

def f_to_c(f):
    pass
```

<details>
<summary>Megoldás</summary>

```python solution
def c_to_f(c):
    return round(c * 9 / 5 + 32, 1)

def f_to_c(f):
    return round((f - 32) * 5 / 9, 1)
```

</details>

```python test
assert c_to_f(100) == 212.0
assert c_to_f(-40) == -40.0
assert f_to_c(98.6) == 37.0
print("Minden ellenőrzés sikeres!")
```

### 2. feladat: Minimum és maximum egyszerre

Írj `min_max(szamok)` függvényt, amely **egy bejárással** (beépített `min`/`max` nélkül) visszaadja a legkisebb és a legnagyobb elemet egy tuple-ben.

```python starter
def min_max(szamok):
    pass
```

<details>
<summary>Megoldás</summary>

```python solution
def min_max(szamok):
    legkisebb = legnagyobb = szamok[0]
    for x in szamok[1:]:
        if x < legkisebb:
            legkisebb = x
        elif x > legnagyobb:
            legnagyobb = x
    return legkisebb, legnagyobb
```

</details>

```python test
assert min_max([3, -2, 8, 0]) == (-2, 8)
assert min_max([7]) == (7, 7)
print("Minden ellenőrzés sikeres!")
```

### 3. feladat: Jelszóerősség

Írj `jelszo_eros(jelszo, min_hossz=8)` függvényt, amely `True`-t ad, ha a jelszó legalább `min_hossz` hosszú, és van benne kisbetű, nagybetű és számjegy is.

```python starter
def jelszo_eros(jelszo, min_hossz=8):
    pass
```

<details>
<summary>Megoldás</summary>

```python solution
def jelszo_eros(jelszo, min_hossz=8):
    van_kis = any(c.islower() for c in jelszo)
    van_nagy = any(c.isupper() for c in jelszo)
    van_szam = any(c.isdigit() for c in jelszo)
    return len(jelszo) >= min_hossz and van_kis and van_nagy and van_szam
```

</details>

```python test
assert jelszo_eros("Titok2026") is True
assert jelszo_eros("titok2026") is False
assert jelszo_eros("Ab1", min_hossz=3) is True
assert jelszo_eros("Rovid1") is False
print("Minden ellenőrzés sikeres!")
```

### 4. feladat: Rekurzív hatványozás

Írj `hatvany(alap, kitevo)` rekurzív függvényt (nemnegatív egész kitevőre), a `**` operátor használata nélkül!

```python starter
def hatvany(alap, kitevo):
    pass
```

<details>
<summary>Megoldás</summary>

```python solution
def hatvany(alap, kitevo):
    if kitevo == 0:
        return 1
    return alap * hatvany(alap, kitevo - 1)
```

</details>

```python test
assert hatvany(2, 10) == 1024
assert hatvany(5, 0) == 1
assert hatvany(3, 4) == 81
print("Minden ellenőrzés sikeres!")
```

### 5. feladat: Szöveg megfordítása rekurzívan

Írj `fordit(s)` rekurzív függvényt, amely megfordítja a szöveget (szeletelés `[::-1]` nélkül)! Tipp: a fordított szöveg = a maradék fordítottja + az első karakter.

```python starter
def fordit(s):
    pass
```

<details>
<summary>Megoldás</summary>

```python solution
def fordit(s):
    if len(s) <= 1:
        return s
    return fordit(s[1:]) + s[0]
```

</details>

```python test
assert fordit("Python") == "nohtyP"
assert fordit("") == ""
assert fordit("a") == "a"
print("Minden ellenőrzés sikeres!")
```

## Összefoglaló feladat: Jelszóellenőrző segédfüggvényekkel

A témakör összefoglaló feladata: bonts egy feladatot kisebb függvényekre, paraméterekkel, alapértelmezett értékkel és visszatérési értékkel.

Írj `jelszo_hibak(jelszo, min_hossz=8)` függvényt, amely egy **listát** ad vissza a jelszó hibáiról, ebben a sorrendben:

1. `"túl rövid"` – ha rövidebb, mint `min_hossz`,
2. `"nincs benne szám"`,
3. `"nincs benne nagybetű"`,
4. `"nincs benne speciális karakter"` – speciális: ami nem betű, nem szám és nem szóköz.

Ha a jelszó jó, üres listát adjon vissza. Minden szabályhoz írj külön kis segédfüggvényt (pl. `van_szam(szoveg)`), és a fő függvény ezeket hívja!

```python starter required
def van_szam(szoveg):
    pass


def van_nagybetu(szoveg):
    pass


def van_specialis(szoveg):
    pass


def jelszo_hibak(jelszo, min_hossz=8):
    hibak = []
    # a szabályok sorban
    return hibak


print(jelszo_hibak("alma"))   # mind a négy hiba
```

<details>
<summary>Megoldás</summary>

```python solution
def van_szam(szoveg):
    return any(k.isdigit() for k in szoveg)


def van_nagybetu(szoveg):
    return any(k.isupper() for k in szoveg)


def van_specialis(szoveg):
    return any(not k.isalnum() and not k.isspace() for k in szoveg)


def jelszo_hibak(jelszo, min_hossz=8):
    hibak = []
    if len(jelszo) < min_hossz:
        hibak.append("túl rövid")
    if not van_szam(jelszo):
        hibak.append("nincs benne szám")
    if not van_nagybetu(jelszo):
        hibak.append("nincs benne nagybetű")
    if not van_specialis(jelszo):
        hibak.append("nincs benne speciális karakter")
    return hibak


print(jelszo_hibak("alma"))   # mind a négy hiba
```

</details>

```python test
assert jelszo_hibak("alma") == ["túl rövid", "nincs benne szám", "nincs benne nagybetű", "nincs benne speciális karakter"], "Az \"alma\" mind a négy szabályt megszegi."
assert jelszo_hibak("Titok123!") == [], "A \"Titok123!\" jó jelszó."
assert jelszo_hibak("Titok12!", min_hossz=10) == ["túl rövid"], "10-es minimummal már túl rövid."
assert jelszo_hibak("TITOKTITOK!") == ["nincs benne szám"], "Csak a szám hiányzik."
assert jelszo_hibak("Titok 1234") == ["nincs benne speciális karakter"], "A szóköz nem számít speciális karakternek."
assert van_szam("a1") and not van_szam("ab"), "A van_szam segédfüggvény is működjön."
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Programozási feladatok

**1.** **Számláló lezárással.** Írd meg a `szamlalo_keszito(kezdo=0)` függvényt, amely egy **függvényt** ad vissza! A visszaadott függvény minden hívásakor eggyel nagyobb számot adjon (először `kezdo + 1`-et). Használj belső függvényt és `nonlocal` változót!

```python starter
def szamlalo_keszito(kezdo=0):
    def leptet():
        return kezdo + 1
    return leptet
```

<details>
<summary>Megoldás</summary>

```python solution
def szamlalo_keszito(kezdo=0):
    ertek = kezdo
    def leptet():
        nonlocal ertek                      # a külső függvény változóját módosítjuk
        ertek += 1
        return ertek
    return leptet
```

</details>

```python test
sz = szamlalo_keszito()
assert sz() == 1 and sz() == 2 and sz() == 3
masik = szamlalo_keszito(10)
assert masik() == 11
assert sz() == 4
print("Minden ellenőrzés sikeres!")
```

**2.** **Függvény alkalmazása mindenre.** Írd meg az `alkalmaz_mindre(fuggveny, lista)` függvényt, amely egy új listát ad vissza, benne a `fuggveny` eredményével minden elemre (a beépített `map` használata nélkül)!

```python starter
def alkalmaz_mindre(fuggveny, lista):
    return lista
```

<details>
<summary>Megoldás</summary>

```python solution
def alkalmaz_mindre(fuggveny, lista):
    return [fuggveny(elem) for elem in lista]   # a függvény is csak egy érték
```

</details>

```python test
assert alkalmaz_mindre(abs, [-1, 2, -3]) == [1, 2, 3]
assert alkalmaz_mindre(lambda x: x * x, [1, 2, 3]) == [1, 4, 9]
assert alkalmaz_mindre(str.upper, ["a", "b"]) == ["A", "B"]
assert alkalmaz_mindre(len, []) == []
print("Minden ellenőrzés sikeres!")
```

**3.** **Legkisebb kulcs szerint.** Írd meg a `legkisebb_szerint(lista, kulcs)` függvényt, amely azt az elemet adja vissza, amelyre a `kulcs(elem)` értéke a legkisebb (egyenlőségnél az elsőt), a `min()` használata nélkül! Üres listára `None`-t adjon.

```python starter
def legkisebb_szerint(lista, kulcs):
    return lista[0] if lista else None
```

<details>
<summary>Megoldás</summary>

```python solution
def legkisebb_szerint(lista, kulcs):
    if not lista:
        return None
    legjobb = lista[0]
    for elem in lista[1:]:
        if kulcs(elem) < kulcs(legjobb):    # a kulcsfüggvény dönt
            legjobb = elem
    return legjobb
```

</details>

```python test
assert legkisebb_szerint(["alma", "fa", "körte"], len) == "fa"
assert legkisebb_szerint([3, -1, 2], abs) == -1
assert legkisebb_szerint([("Anna", 30), ("Béla", 25)], lambda p: p[1]) == ("Béla", 25)
assert legkisebb_szerint(["ab", "cd"], len) == "ab"
assert legkisebb_szerint([], len) is None
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Mit ad vissza egy olyan függvény, amelyben nincs `return`?
- 0
- üres szöveget
+ None
- hibát dob
! A `return` nélküli függvény automatikusan `None`-nal tér vissza.

? Mennyi `(lambda a, b=2: a * b)(5)` értéke?
= 10
! `b` alapértéke 2, így 5 · 2 = 10.

? Mire való a `nonlocal` kulcsszó?
- globális változó létrehozására
+ a befoglaló függvény változójának módosítására egy belső függvényből
- egy változó törlésére
- a függvény exportálására
! Nélküle az `ertek += 1` új helyi változót próbálna létrehozni.

? Mennyi `sorted(["ccc", "a", "bb"], key=len)[-1]` értéke?
- a
- bb
+ ccc
- hibát dob
! Hossz szerint rendezve az utolsó a leghosszabb.
```
