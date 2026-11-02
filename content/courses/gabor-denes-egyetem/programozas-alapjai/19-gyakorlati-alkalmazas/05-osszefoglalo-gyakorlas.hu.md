---
title: Összefoglaló gyakorlás – a félév anyaga
summary: Vegyes ellenőrző kérdések és feladatok a teljes tananyagból, zárthelyire és projektre készüléshez.
minutes: 45
kind: practice
---

Ez a gyakorlás a félév összes témakörét átfogja. Először próbáld meg **segítség nélkül** megoldani a feladatokat, és csak utána nézd meg a megoldást! Ha valami nem megy, a kérdés mellett zárójelben látod, melyik témakörben érdemes utánanézni.

## Ellenőrző kérdések

**1. Mi a különbség a fordító és az interpreter között? (3.)**

<details>
<summary>Válasz</summary>

A fordító a teljes programot előre gépi (vagy köztes) kódra alakítja, és a futtatás külön lépés. Az interpreter a programot futás közben, utasításonként értelmezi és hajtja végre. A Python bájtkódra fordít, majd azt értelmezi.

</details>

**2. Mit ír ki? `print(7 // 2, 7 % 2, 7 / 2, 2 ** 3)` (6.)**

<details>
<summary>Válasz</summary>

`3 1 3.5 8` – egészosztás, maradék, valós osztás, hatványozás.

</details>

**3. Mit jelent, hogy a Python dinamikusan, de erősen típusos? (5.)**

<details>
<summary>Válasz</summary>

Dinamikus: a változó típusa futás közben dől el, és ugyanaz a név később más típusú értékre is mutathat. Erős: nincs automatikus átalakítás nem összeillő típusok között, pl. `"5" + 2` `TypeError`-t ad.

</details>

**4. Mit ír ki, és miért? (9.)**

```python
def hozzaad(elem, lista=[]):
    lista.append(elem)
    return lista

print(hozzaad(1), hozzaad(2))
```

<details>
<summary>Válasz</summary>

`[1, 2] [1, 2]` – az alapértelmezett lista egyszer jön létre a függvény definiálásakor, és minden hívás ugyanazt a listát módosítja. Helyesen: `lista=None`, majd a függvényben `if lista is None: lista = []`.

</details>

**5. Milyen adatszerkezetet választanál: (a) egyedi látogatók nyilvántartása, (b) diák neve → jegyei, (c) visszavonás (undo) funkció? (10.)**

<details>
<summary>Válasz</summary>

(a) halmaz (`set`) – automatikusan kiszűri az ismétlődést; (b) szótár (`dict`), az érték egy lista; (c) verem (lista `append`/`pop`-pal) – mindig a legutóbbi műveletet vonjuk vissza.

</details>

**6. Mi a rekurzió két kötelező eleme, és mi történik, ha az egyik hiányzik? (11.)**

<details>
<summary>Válasz</summary>

Alapeset (ahol a rekurzió megáll) és rekurzív lépés (amely az alapeset felé közelít). Ha nincs alapeset vagy nem közelítünk felé, a hívások végtelenül egymásba ágyazódnak, és `RecursionError` keletkezik.

</details>

**7. Mire való a `finally` ág, és mi a `with` utasítás előnye fájlkezelésnél? (12–13.)**

<details>
<summary>Válasz</summary>

A `finally` mindig lefut, akár volt kivétel, akár nem – erőforrások felszabadítására való. A `with` automatikusan bezárja a fájlt a blokk végén, hiba esetén is, így nem kell kézzel `close()`-t hívni.

</details>

**8. Mi a különbség az egységteszt és az integrációs teszt között? (14.)**

<details>
<summary>Válasz</summary>

Az egységteszt egyetlen kis egységet (függvényt, osztályt) vizsgál elszigetelten. Az integrációs teszt azt ellenőrzi, hogy több egység együtt helyesen működik-e.

</details>

**9. Mit javítanál ezen a kódon? `def f(l): return sum(l)/len(l)` (15.)**

<details>
<summary>Válasz</summary>

Beszédes nevek (`atlag(szamok)`), docstring, típusjelölés, és az üres lista kezelése (nullával osztás): pl. `if not szamok: return 0.0` vagy érthető `ValueError`.

</details>

**10. Miért nem Pythonban írnak egy mikrovezérlős robotot vezérlő, valós idejű programot általában, és mi lehet kivétel? (16–18.)**

<details>
<summary>Válasz</summary>

A mikrovezérlő kevés memóriájú és lassú; a C/C++ kis erőforrás-igényű, gyors és közvetlenül eléri a hardvert. Kivétel a MicroPython, amely kisebb feladatokra elég, illetve a Raspberry Pi-szerű erősebb gépeken (pl. ROS-szal) a Python is gyakori.

</details>

## Feladatok

### 1. feladat: Bináris keresés (7., 10.)

Írj `binaris_kereses(lista, keresett)` függvényt, amely egy **rendezett** listában ciklussal megkeresi az elemet, és visszaadja az indexét, vagy `-1`-et, ha nincs benne.

```python starter
def binaris_kereses(lista, keresett):
    # TODO
    pass
```

<details>
<summary>Megoldás</summary>

```python solution
def binaris_kereses(lista, keresett):
    """Rendezett listában keres; az index vagy -1. Lépésszám: O(log n)."""
    bal, jobb = 0, len(lista) - 1
    while bal <= jobb:
        kozep = (bal + jobb) // 2
        if lista[kozep] == keresett:
            return kozep
        if lista[kozep] < keresett:
            bal = kozep + 1     # a jobb felében folytatjuk
        else:
            jobb = kozep - 1    # a bal felében folytatjuk
    return -1
```

</details>

```python test
szamok = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
assert binaris_kereses(szamok, 23) == 5
assert binaris_kereses(szamok, 2) == 0
assert binaris_kereses(szamok, 91) == 9
assert binaris_kereses(szamok, 7) == -1
assert binaris_kereses([], 1) == -1
print("Minden ellenőrzés sikeres!")
```

### 2. feladat: Zárójelek ellenőrzése veremmel (10.)

Írj `zarojelek_rendben(szoveg)` függvényt, amely eldönti, hogy a `()`, `[]`, `{}` zárójelek helyesen vannak-e párosítva és egymásba ágyazva. A többi karaktert hagyd figyelmen kívül.

```python starter
def zarojelek_rendben(szoveg):
    # TODO
    pass
```

<details>
<summary>Megoldás</summary>

```python solution
PAROK = {")": "(", "]": "[", "}": "{"}

def zarojelek_rendben(szoveg):
    """Helyesen párosítottak és egymásba ágyazottak-e a zárójelek?"""
    verem = []
    for jel in szoveg:
        if jel in "([{":
            verem.append(jel)
        elif jel in PAROK:
            if not verem or verem.pop() != PAROK[jel]:
                return False
    return not verem    # a végén nem maradhat nyitott zárójel
```

</details>

```python test
assert zarojelek_rendben("(a + b) * [c - {d / e}]")
assert zarojelek_rendben("")
assert not zarojelek_rendben("(]")
assert not zarojelek_rendben("([)]")
assert not zarojelek_rendben("((")
assert not zarojelek_rendben("())")
print("Minden ellenőrzés sikeres!")
```

### 3. feladat: Számjegyösszeg rekurzívan és iteratívan (11.)

Írd meg kétféleképpen egy nemnegatív egész szám számjegyeinek összegét: `szamjegyosszeg_rek(n)` rekurzióval, `szamjegyosszeg_it(n)` ciklussal!

```python starter
def szamjegyosszeg_rek(n):
    # TODO
    pass

def szamjegyosszeg_it(n):
    # TODO
    pass
```

<details>
<summary>Megoldás</summary>

```python solution
def szamjegyosszeg_rek(n):
    """Rekurzív változat: utolsó számjegy + a többi számjegy összege."""
    if n < 10:          # alapeset: egyjegyű szám
        return n
    return n % 10 + szamjegyosszeg_rek(n // 10)

def szamjegyosszeg_it(n):
    """Iteratív változat: amíg van számjegy, levágjuk és hozzáadjuk."""
    osszeg = 0
    while n > 0:
        osszeg += n % 10
        n //= 10
    return osszeg
```

</details>

```python test
for n, vart in [(0, 0), (7, 7), (123, 6), (9999, 36), (1001, 2)]:
    assert szamjegyosszeg_rek(n) == vart, n
    assert szamjegyosszeg_it(n) == vart, n
print("Minden ellenőrzés sikeres!")
```

### 4. feladat: Csoportosítás szótárba (8., 10.)

Írj `csoportosit(hallgatok)` függvényt, amely `(név, szak)` párok listájából szótárt készít: kulcs a szak, érték a szak hallgatóinak **ábécérendbe rendezett** listája.

```python starter
def csoportosit(hallgatok):
    # TODO
    pass
```

<details>
<summary>Megoldás</summary>

```python solution
def csoportosit(hallgatok):
    """(név, szak) párok → {szak: rendezett névlista}."""
    csoportok = {}
    for nev, szak in hallgatok:
        csoportok.setdefault(szak, []).append(nev)
    return {szak: sorted(nevek) for szak, nevek in csoportok.items()}
```

</details>

```python test
adatok = [("Bence", "mérnökinfo"), ("Anna", "gazdinfo"), ("Ádám", "mérnökinfo"), ("Csilla", "mérnökinfo")]
eredmeny = csoportosit(adatok)
# A sorted() karakterkód szerint rendez, ezért az "Ádám" a végére kerül.
assert eredmeny == {"mérnökinfo": ["Bence", "Csilla", "Ádám"], "gazdinfo": ["Anna"]}
assert csoportosit([]) == {}
print("Minden ellenőrzés sikeres!")
```

> Megjegyzés: a `sorted()` alapból a karakterkódok szerint rendez, ezért az „Á” a „Z” után kerül. Magyar ábécérendhez a `locale` modul vagy saját rendezési kulcs kell.

### 5. feladat: Biztonságos adatfeldolgozás (12., 13.)

Írj `osszesit(sorok)` függvényt, amely `"név;pontszám"` formátumú szövegsorok listáját dolgozza fel, és egy `(összeg, hibás_sorok_száma)` párt ad vissza. Hibás a sor, ha nem pontosan két részből áll, vagy a pontszám nem egész szám. Az üres sorokat hagyd ki (nem számítanak hibásnak).

```python starter
def osszesit(sorok):
    # TODO
    pass
```

<details>
<summary>Megoldás</summary>

```python solution
def osszesit(sorok):
    """"név;pont" sorok → (pontok összege, hibás sorok száma)."""
    osszeg, hibas = 0, 0
    for sor in sorok:
        if not sor.strip():
            continue
        try:
            nev, pont = sor.split(";")      # ValueError, ha nem 2 rész
            osszeg += int(pont)             # ValueError, ha nem szám
        except ValueError:
            hibas += 1
    return osszeg, hibas
```

</details>

```python test
assert osszesit(["Anna;10", "Bence;7", "", "Csilla;abc", "rossz sor", "Dani;3;x", "Eszter; 5"]) == (22, 3)
assert osszesit([]) == (0, 0)
print("Minden ellenőrzés sikeres!")
```

## Hogyan tovább?

Ha minden feladat ment: gratulálunk, a félév anyagát elsajátítottad! Gyakorolj tovább a mini projektek bővítési ötleteivel, és a csoportos projektben alkalmazd a tanultakat.
