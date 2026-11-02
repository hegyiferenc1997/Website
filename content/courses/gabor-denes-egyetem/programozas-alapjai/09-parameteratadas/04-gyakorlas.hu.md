---
title: Gyakorlás – paraméterek
summary: Ellenőrző kérdések és feladatok a paraméterek fajtáiról, az átadás módjáról és a kiértékelésről.
minutes: 25
kind: practice
---

## Ellenőrző kérdések

**1. Mit ír ki?**

```python
def f(lista):
    lista.append(4)
    lista = [9]
    lista.append(5)

a = [1, 2, 3]
f(a)
print(a)
```

<details>
<summary>Válasz</summary>

`[1, 2, 3, 4]`. Az `append(4)` a közös listát módosítja; a `lista = [9]` után a lokális név már egy új listára mutat, így az `append(5)` az eredetit nem érinti.

</details>

**2. Miért nem változik meg az `x` értéke? `def f(n): n += 1` → `x = 5; f(x)`**

<details>
<summary>Válasz</summary>

Az `int` megváltoztathatatlan: az `n += 1` egy új objektumot hoz létre, és csak a lokális `n` mutat rá. Az `x` továbbra is az eredeti 5-re mutat.

</details>

**3. Mi a hiba ebben: `def naplo(uzenet, lista=[]):`?**

<details>
<summary>Válasz</summary>

Az alapértelmezett lista egyszer, a definíciókor jön létre, és minden hívás ugyanazt használja, így az üzenetek felhalmozódnak. Helyesen: `lista=None`, majd a függvényben `if lista is None: lista = []`.

</details>

**4. Milyen típusú a `*args` és a `**kwargs` a függvényen belül?**

<details>
<summary>Válasz</summary>

Az `args` egy tuple, a `kwargs` egy szótár.

</details>

**5. Mi a különbség a mohó és a lusta kiértékelés között?**

<details>
<summary>Válasz</summary>

Mohó kiértékelésnél az argumentumok a hívás előtt kiértékelődnek; lustánál csak akkor, ha az értékükre ténylegesen szükség van.

</details>

## Feladatok

### 1. feladat: Átlag tetszőleges számú értékből

Írj `atlag(*szamok)` függvényt, amely tetszőleges számú argumentum átlagát adja vissza; argumentum nélkül `None`-t.

```python starter
def atlag(*szamok):
    pass
```

<details>
<summary>Megoldás</summary>

```python solution
def atlag(*szamok):
    if not szamok:
        return None
    return sum(szamok) / len(szamok)
```

</details>

```python test
assert atlag(2, 4, 6) == 4
assert atlag(5) == 5
assert atlag() is None
print("Minden ellenőrzés sikeres!")
```

### 2. feladat: HTML címke

Írj `cimke(nev, tartalom, **attributumok)` függvényt, amely HTML címkét készít: `cimke("a", "Link", href="/x")` → `'<a href="/x">Link</a>'`. Több attribútum a megadás sorrendjében, szóközzel elválasztva kövesse egymást.

```python starter
def cimke(nev, tartalom, **attributumok):
    pass
```

<details>
<summary>Megoldás</summary>

```python solution
def cimke(nev, tartalom, **attributumok):
    attr = "".join(f' {k}="{v}"' for k, v in attributumok.items())
    return f"<{nev}{attr}>{tartalom}</{nev}>"
```

</details>

```python test
assert cimke("a", "Link", href="/x") == '<a href="/x">Link</a>'
assert cimke("p", "Szia") == "<p>Szia</p>"
assert cimke("img", "", src="k.png", alt="kép") == '<img src="k.png" alt="kép"></img>'
print("Minden ellenőrzés sikeres!")
```

### 3. feladat: Mellékhatás nélkül

Az alábbi függvény módosítja a kapott listát. Írd át úgy, hogy az eredeti lista **változatlan maradjon**, és egy új listát adjon vissza!

```python starter
def duplaz(lista):
    for i in range(len(lista)):
        lista[i] *= 2
    return lista
```

<details>
<summary>Megoldás</summary>

```python solution
def duplaz(lista):
    return [x * 2 for x in lista]
```

</details>

```python test
eredeti = [1, 2, 3]
uj = duplaz(eredeti)
assert uj == [2, 4, 6]
assert eredeti == [1, 2, 3], "Az eredeti lista nem változhat!"
print("Minden ellenőrzés sikeres!")
```

### 4. feladat: Javítsd ki a hibát

A `kosarba` függvény a második hívásnál már az előző termékeket is tartalmazza. Javítsd ki!

```python starter
def kosarba(termek, kosar=[]):
    kosar.append(termek)
    return kosar
```

<details>
<summary>Megoldás</summary>

```python solution
def kosarba(termek, kosar=None):
    if kosar is None:
        kosar = []
    kosar.append(termek)
    return kosar
```

</details>

```python test
assert kosarba("tej") == ["tej"]
assert kosarba("kenyér") == ["kenyér"]
k = ["alma"]
assert kosarba("körte", k) == ["alma", "körte"]
print("Minden ellenőrzés sikeres!")
```

### 5. feladat: Páros számok generátora

Írj `parosak(n)` generátorfüggvényt (`yield`), amely sorban előállítja a 0 és n közötti páros számokat (n-et is, ha páros).

```python starter
def parosak(n):
    pass
```

<details>
<summary>Megoldás</summary>

```python solution
def parosak(n):
    for i in range(0, n + 1, 2):
        yield i
```

</details>

```python test
assert list(parosak(7)) == [0, 2, 4, 6]
assert list(parosak(8)) == [0, 2, 4, 6, 8]
import types
assert isinstance(parosak(3), types.GeneratorType), "Generátorfüggvény kell (yield)!"
print("Minden ellenőrzés sikeres!")
```
