---
title: Gyakorlás – kivételkezelés
summary: Ellenőrző kérdések és feladatok kivételek kezelésére, dobására és saját kivételekre.
minutes: 55
kind: practice
---

## Ellenőrző kérdések

**1. Milyen hibatípus: a) hiányzó kettőspont, b) `int("x")`, c) rossz képlet miatt hibás átlag?**

<details>
<summary>Válasz</summary>

a) szintaktikai hiba, b) futási hiba (`ValueError` kivétel), c) logikai hiba.

</details>

**2. Mi a kimenet?**

```python
try:
    print("A")
    x = 1 / 0
    print("B")
except ZeroDivisionError:
    print("C")
else:
    print("D")
finally:
    print("E")
```

<details>
<summary>Válasz</summary>

`A`, `C`, `E`. A `B` kimarad, mert előtte kivétel történt; az `else` csak kivétel nélkül futna; a `finally` mindig lefut.

</details>

**3. Miért rossz a csupasz `except:`?**

<details>
<summary>Válasz</summary>

Minden kivételt elkap, a programozási hibákat (pl. elgépelés miatti `NameError`) és a Ctrl+C-t is, így elrejti a valódi hibákat.

</details>

**4. Mi a különbség az EAFP és az LBYL között?**

<details>
<summary>Válasz</summary>

LBYL: előbb ellenőrzünk, aztán cselekszünk. EAFP: megpróbáljuk, és a kivételt kezeljük, ha nem sikerült. Pythonban az EAFP a megszokottabb.

</details>

**5. Mikor ne használj `assert`-et?**

<details>
<summary>Válasz</summary>

Felhasználói bemenet ellenőrzésére, mert `python -O` futtatásnál az `assert` sorok kimaradnak. Erre `if` + `raise` való.

</details>

## Feladatok

### 1. feladat: Biztonságos osztás

Írj `biztonsagos_osztas(a, b)` függvényt, amely visszaadja `a / b` értékét, nullával osztásnál pedig `None`-t! Kivételkezeléssel oldd meg.

```python starter
def biztonsagos_osztas(a, b):
    pass
```

<details>
<summary>Megoldás</summary>

```python solution
def biztonsagos_osztas(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        return None
```

</details>

```python test
assert biztonsagos_osztas(10, 4) == 2.5
assert biztonsagos_osztas(1, 0) is None
print("Minden ellenőrzés sikeres!")
```

### 2. feladat: Számok kiszűrése

Írj `szamok(szovegek)` függvényt, amely a szövegek listájából csak azokat adja vissza (egészként), amelyek egész számmá alakíthatók! A többit hagyja ki.

```python starter
def szamok(szovegek):
    pass
```

<details>
<summary>Megoldás</summary>

```python solution
def szamok(szovegek):
    eredmeny = []
    for s in szovegek:
        try:
            eredmeny.append(int(s))
        except ValueError:
            pass   # nem szám – szándékosan kihagyjuk
    return eredmeny
```

</details>

```python test
assert szamok(["3", "x", "-7", "4.5", " 12 "]) == [3, -7, 12]
assert szamok([]) == []
print("Minden ellenőrzés sikeres!")
```

### 3. feladat: Életkor ellenőrzése

Írj `eletkor_beallit(kor)` függvényt, amely `TypeError`-t dob, ha a kor nem `int`, `ValueError`-t, ha 0-nál kisebb vagy 150-nél nagyobb, különben visszaadja a kort.

```python starter
def eletkor_beallit(kor):
    pass
```

<details>
<summary>Megoldás</summary>

```python solution
def eletkor_beallit(kor):
    if not isinstance(kor, int):
        raise TypeError("Az életkornak egész számnak kell lennie.")
    if kor < 0 or kor > 150:
        raise ValueError("Az életkor 0 és 150 között lehet.")
    return kor
```

</details>

```python test
assert eletkor_beallit(20) == 20
for rossz, kivetel in [("20", TypeError), (-1, ValueError), (151, ValueError)]:
    try:
        eletkor_beallit(rossz)
        assert False, f"{kivetel.__name__} kellett volna"
    except kivetel:
        pass
print("Minden ellenőrzés sikeres!")
```

### 4. feladat: Saját kivétel

Készíts `UresKosarHiba` kivételosztályt (az `Exception` leszármazottja), és egy `vegosszeg(kosar)` függvényt, amely a kosár (ár lista) összegét adja, üres kosárnál pedig `UresKosarHiba`-t dob!

```python starter
class UresKosarHiba(Exception):
    pass

def vegosszeg(kosar):
    pass
```

<details>
<summary>Megoldás</summary>

```python solution
class UresKosarHiba(Exception):
    pass

def vegosszeg(kosar):
    if not kosar:
        raise UresKosarHiba("A kosár üres.")
    return sum(kosar)
```

</details>

```python test
assert vegosszeg([100, 250]) == 350
try:
    vegosszeg([])
    assert False, "UresKosarHiba kellett volna"
except UresKosarHiba:
    pass
assert issubclass(UresKosarHiba, Exception)
print("Minden ellenőrzés sikeres!")
```

### 5. feladat: Szótárolvasás alapértékkel

Írj `beallitas(beallitasok, kulcs, alap)` függvényt, amely visszaadja a kulcshoz tartozó értéket **egész számként**. Ha a kulcs hiányzik **vagy** az érték nem alakítható egésszé, adja vissza az `alap` értéket. EAFP stílusban oldd meg!

```python starter
def beallitas(beallitasok, kulcs, alap):
    pass
```

<details>
<summary>Megoldás</summary>

```python solution
def beallitas(beallitasok, kulcs, alap):
    try:
        return int(beallitasok[kulcs])
    except (KeyError, ValueError):
        return alap
```

</details>

```python test
b = {"port": "8080", "timeout": "sok"}
assert beallitas(b, "port", 80) == 8080
assert beallitas(b, "timeout", 30) == 30
assert beallitas(b, "retry", 3) == 3
print("Minden ellenőrzés sikeres!")
```

## Összefoglaló feladat: Pontszámlista feldolgozása hibakezeléssel

A témakör összefoglaló feladata: saját kivétel, `raise`, `try – except – else`, és a hibák összegyűjtése a program leállítása helyett.

Egy fájlból beolvasott sorok listája adott, mindegyik `"név;pont"` alakú. Írj `feldolgoz(sorok)` függvényt, amely egy `(eredmenyek, hibak)` párt ad vissza:

- `eredmenyek`: szótár név → pont (egész szám), a helyes sorokból;
- `hibak`: a hibás sorokról szóló üzenetek listája, pl. `"3. sor: hibás pontszám"` (a sorszám 1-től számít).

Hibás egy sor, ha nem pontosan egy `;` van benne (`"hibás formátum"`), ha a név üres (`"hiányzó név"`), ha a pont nem egész szám (`"hibás pontszám"`), vagy ha a pont nincs 0 és 100 között (`"tartományon kívül"`). Az üres sorokat egyszerűen hagyd ki.

Írj egy `sor_ertelmez(sor)` segédfüggvényt, amely hibánál egy saját `SorHiba` kivételt dob a megfelelő üzenettel – a fő függvény ezt kapja el.

```python starter required
class SorHiba(Exception):
    pass


def sor_ertelmez(sor):
    # visszaad: (nev, pont), vagy raise SorHiba("...")
    pass


def feldolgoz(sorok):
    eredmenyek, hibak = {}, []
    for szam, sor in enumerate(sorok, start=1):
        pass
    return eredmenyek, hibak


print(feldolgoz(["Anna;87", "Béla;sok", "", ";50", "Csilla;101"]))
```

<details>
<summary>Megoldás</summary>

```python solution
class SorHiba(Exception):
    pass


def sor_ertelmez(sor):
    reszek = sor.split(";")
    if len(reszek) != 2:
        raise SorHiba("hibás formátum")
    nev, pont_szoveg = reszek[0].strip(), reszek[1].strip()
    if not nev:
        raise SorHiba("hiányzó név")
    try:
        pont = int(pont_szoveg)
    except ValueError:
        raise SorHiba("hibás pontszám") from None
    if not 0 <= pont <= 100:
        raise SorHiba("tartományon kívül")
    return nev, pont


def feldolgoz(sorok):
    eredmenyek, hibak = {}, []
    for szam, sor in enumerate(sorok, start=1):
        if not sor.strip():
            continue
        try:
            nev, pont = sor_ertelmez(sor)
        except SorHiba as hiba:
            hibak.append(f"{szam}. sor: {hiba}")
        else:
            eredmenyek[nev] = pont
    return eredmenyek, hibak


print(feldolgoz(["Anna;87", "Béla;sok", "", ";50", "Csilla;101"]))
```

</details>

```python test
eredmenyek, hibak = feldolgoz(["Anna;87", "Béla;sok", "", ";50", "Csilla;101", "Dóra;60;1", " Ede ; 45 "])
assert eredmenyek == {"Anna": 87, "Ede": 45}, "A helyes sorok: Anna 87, Ede 45 (a szóközöket le kell vágni)."
assert hibak == ["2. sor: hibás pontszám", "4. sor: hiányzó név", "5. sor: tartományon kívül", "6. sor: hibás formátum"], "A hibalista nem stimmel."
assert issubclass(SorHiba, Exception), "Legyen SorHiba saját kivételosztály."
try:
    sor_ertelmez("X;abc")
    assert False, "A sor_ertelmez hibás sornál SorHiba-t dobjon."
except SorHiba as h:
    assert str(h) == "hibás pontszám", "Az üzenet: hibás pontszám"
assert feldolgoz([]) == ({}, []), "Üres listára üres eredmény."
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Programozási feladatok

**1.** **Első szám a szövegben.** Írd meg az `elso_szam(szavak)` függvényt, amely egy szöveglistában az első olyan elemet adja vissza egész számként, amely `int()`-tel átalakítható! A nem számokat `try`–`except ValueError` segítségével ugord át; ha nincs ilyen elem, `None` legyen az eredmény.

```python starter
def elso_szam(szavak):
    return int(szavak[0])
```

<details>
<summary>Megoldás</summary>

```python solution
def elso_szam(szavak):
    for szo in szavak:
        try:
            return int(szo)
        except ValueError:
            continue                        # nem szám, megyünk tovább
    return None
```

</details>

```python test
assert elso_szam(["alma", "12", "7"]) == 12
assert elso_szam(["x", "-3"]) == -3
assert elso_szam(["a", "b"]) is None
assert elso_szam([]) is None
print("Minden ellenőrzés sikeres!")
```

**2.** **Biztonságos indexelés.** Írd meg a `biztonsagos_elem(lista, index, alap=None)` függvényt, amely a lista adott indexű elemét adja vissza, `IndexError` esetén pedig az `alap` értéket! (Negatív index is lehet, ahogy a Pythonban szokás.)

```python starter
def biztonsagos_elem(lista, index, alap=None):
    return lista[index]
```

<details>
<summary>Megoldás</summary>

```python solution
def biztonsagos_elem(lista, index, alap=None):
    try:
        return lista[index]
    except IndexError:                      # túl nagy vagy túl kicsi index
        return alap
```

</details>

```python test
assert biztonsagos_elem([1, 2, 3], 1) == 2
assert biztonsagos_elem([1, 2, 3], -1) == 3
assert biztonsagos_elem([1, 2, 3], 5) is None
assert biztonsagos_elem([], 0, "üres") == "üres"
print("Minden ellenőrzés sikeres!")
```

**3.** **Osztás listán.** Írd meg az `oszt_lista(szamlalok, nevezo)` függvényt, amely minden számot eloszt a nevezővel! Ha a nevező 0, ne dobjon hibát, hanem minden helyre `None` kerüljön; ha a nevező nem szám (`TypeError`), dobj `ValueError`-t `"a nevező szám legyen"` üzenettel!

```python starter
def oszt_lista(szamlalok, nevezo):
    return [x / nevezo for x in szamlalok]
```

<details>
<summary>Megoldás</summary>

```python solution
def oszt_lista(szamlalok, nevezo):
    eredmeny = []
    for x in szamlalok:
        try:
            eredmeny.append(x / nevezo)
        except ZeroDivisionError:
            eredmeny.append(None)           # 0-val osztás: nincs értelmes eredmény
        except TypeError:
            raise ValueError("a nevező szám legyen")   # érthetőbb hibára cseréljük
    return eredmeny
```

</details>

```python test
assert oszt_lista([2, 4], 2) == [1.0, 2.0]
assert oszt_lista([1, 2], 0) == [None, None]
assert oszt_lista([], 0) == []
try:
    oszt_lista([1], "x")
    assert False, "ValueError kellett volna"
except ValueError as hiba:
    assert str(hiba) == "a nevező szám legyen"
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Melyik kivétel keletkezik az `int("abc")` hívásnál?
- TypeError
+ ValueError
- KeyError
- SyntaxError
! A típus jó (szöveg), csak az értéke nem alakítható számmá.

? Mikor fut le a `finally` ág?
- csak ha nem volt kivétel
- csak ha volt kivétel
+ mindig, kivételtől függetlenül
- soha, ha volt `return`
! Ezért ide kerül pl. a fájl lezárása vagy egyéb takarítás.

? Melyik kivétel keletkezik a `{"a": 1}["b"]` kifejezésnél?
- IndexError
+ KeyError
- ValueError
- NameError
! Szótárban nem létező kulcs → KeyError.

? Hány `except` ág lehet egy `try` blokk után?
- pontosan egy
+ akárhány
- legfeljebb kettő
- egy sem
! Több `except` ág is írható, az első illeszkedő fut le.
```
