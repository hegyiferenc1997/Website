---
title: Gyakorlás – dokumentálás és kódminőség
summary: Ellenőrző kérdések, docstringek írása és rossz minőségű kód refaktorálása.
minutes: 50
kind: practice
---

## Ellenőrző kérdések

**1. Mi a különbség a komment és a docstring között?**

<details>
<summary>Válasz</summary>

A komment (`#`) a kódot olvasó fejlesztőnek szól, a program eldobja. A docstring (`"""..."""`) a függvény/osztály/modul első sora, a Python eltárolja (`__doc__`), és a `help()` és a fejlesztőkörnyezet megjeleníti – ez az API-dokumentáció.

</details>

**2. Mi a gond ezzel a kommenttel? `x = x + 1  # x-et növeljük eggyel`**

<details>
<summary>Válasz</summary>

Csak megismétli, amit a kód már elmond – zaj. A jó komment a miértet magyarázza.

</details>

**3. Mit jelent a DRY és a KISS?**

<details>
<summary>Válasz</summary>

DRY (Don't Repeat Yourself): ne ismételj kódot, emeld ki függvénybe. KISS (Keep It Simple, Stupid): a legegyszerűbb működő megoldást válaszd.

</details>

**4. PEP 8 szerint hogyan nevezed el: egy osztályt, egy konstanst, egy függvényt?**

<details>
<summary>Válasz</summary>

Osztály: `PascalCase` (`BankSzamla`), konstans: `NAGY_BETU` (`MAX_PONT`), függvény: `snake_case` (`atlag_szamitas`).

</details>

**5. Mi a refaktorálás, és mi a feltétele, hogy biztonságos legyen?**

<details>
<summary>Válasz</summary>

A kód szerkezetének javítása a működés megváltoztatása nélkül. Biztonságosan akkor végezhető, ha vannak tesztek, amelyek igazolják, hogy a működés nem változott.

</details>

## Feladatok

### 1. feladat: Docstring

Írj **Google-stílusú** docstringet a függvényhez (rövid összefoglaló, `Args`, `Returns`, `Raises`)!

```python starter
def kamatos_kamat(toke, kamatlab, evek):
    if toke < 0 or evek < 0:
        raise ValueError("A tőke és az évek száma nem lehet negatív.")
    return round(toke * (1 + kamatlab) ** evek, 2)
```

<details>
<summary>Megoldás</summary>

```python solution
def kamatos_kamat(toke, kamatlab, evek):
    """Kiszámolja a tőke értékét kamatos kamattal.

    Args:
        toke: A kezdő tőke forintban.
        kamatlab: Az éves kamatláb tizedes törtként (pl. 0.05 = 5%).
        evek: A befektetés hossza években.

    Returns:
        A tőke értéke a futamidő végén, két tizedesre kerekítve.

    Raises:
        ValueError: Ha a tőke vagy az évek száma negatív.
    """
    if toke < 0 or evek < 0:
        raise ValueError("A tőke és az évek száma nem lehet negatív.")
    return round(toke * (1 + kamatlab) ** evek, 2)
```

</details>

```python test
doc = kamatos_kamat.__doc__ or ""
assert doc.strip(), "Hiányzik a docstring"
for kulcsszo in ["Args:", "Returns:", "Raises:"]:
    assert kulcsszo in doc, f"Hiányzik: {kulcsszo}"
assert kamatos_kamat(100_000, 0.05, 2) == 110250.0
print("Minden ellenőrzés sikeres!")
```

### 2. feladat: Refaktorálás – beszédes nevek és DRY

Az alábbi kód működik, de olvashatatlan. Refaktoráld: legyen egy `teglalap_adatai(szelesseg, magassag)` függvény, amely egy `(terulet, kerulet)` tuple-t ad vissza!

```python starter
a = 3; b = 4
print(a*b, 2*(a+b))
c = 5; d = 2
print(c*d, 2*(c+d))
```

<details>
<summary>Megoldás</summary>

```python solution
def teglalap_adatai(szelesseg, magassag):
    """Visszaadja a téglalap területét és kerületét."""
    terulet = szelesseg * magassag
    kerulet = 2 * (szelesseg + magassag)
    return terulet, kerulet

for szelesseg, magassag in [(3, 4), (5, 2)]:
    print(*teglalap_adatai(szelesseg, magassag))
```

</details>

```python test
assert teglalap_adatai(3, 4) == (12, 14)
assert teglalap_adatai(5, 2) == (10, 14)
print("Minden ellenőrzés sikeres!")
```

### 3. feladat: Egyszerűsítés (KISS)

Egyszerűsítsd a függvényt egyetlen `return` sorra – a működés ne változzon!

```python starter
def nagykoru_e(kor):
    if kor >= 18:
        eredmeny = True
    else:
        eredmeny = False
    if eredmeny == True:
        return True
    else:
        return False
```

<details>
<summary>Megoldás</summary>

```python solution
def nagykoru_e(kor):
    return kor >= 18
```

</details>

```python test
assert nagykoru_e(18) is True
assert nagykoru_e(17) is False
assert nagykoru_e(40) is True
print("Minden ellenőrzés sikeres!")
```

### 4. feladat: Korai visszatérés

Írd át a függvényt korai visszatérésekkel (guard clause), beágyazott `if`-ek nélkül! A működés ne változzon.

```python starter
def belepes(felhasznalo, jelszo_helyes, letiltva):
    if felhasznalo:
        if not letiltva:
            if jelszo_helyes:
                return "Sikeres belépés"
            else:
                return "Hibás jelszó"
        else:
            return "A fiók le van tiltva"
    else:
        return "Hiányzó felhasználónév"
```

<details>
<summary>Megoldás</summary>

```python solution
def belepes(felhasznalo, jelszo_helyes, letiltva):
    if not felhasznalo:
        return "Hiányzó felhasználónév"
    if letiltva:
        return "A fiók le van tiltva"
    if not jelszo_helyes:
        return "Hibás jelszó"
    return "Sikeres belépés"
```

</details>

```python test
assert belepes("", True, False) == "Hiányzó felhasználónév"
assert belepes("anna", True, True) == "A fiók le van tiltva"
assert belepes("anna", False, False) == "Hibás jelszó"
assert belepes("anna", True, False) == "Sikeres belépés"
print("Minden ellenőrzés sikeres!")
```

## Összefoglaló feladat: Dokumentált hőmérséklet-osztály

Készíts egy jól dokumentált `Homerseklet` osztályt, amely a témakör minden szabályát betartja:

- `Homerseklet(celsius)`: ha az érték kisebb, mint az abszolút nulla (`-273.15`), dobjon `ValueError`-t; az értéket a `celsius` attribútumban tárolja,
- `fahrenheit()`: a hőmérséklet Fahrenheitben (`C * 9 / 5 + 32`),
- `kelvin()`: a hőmérséklet Kelvinben (`C + 273.15`),
- `Homerseklet.fahrenheitbol(f)`: **osztálymetódus** (`@classmethod`), amely Fahrenheit-értékből hoz létre példányt,
- `repr()`-je legyen `Homerseklet(21.5)` alakú.

Dokumentáció: az osztálynak és **minden** nyilvános metódusnak (`__init__` kivételével) legyen docstringje, a nevek feleljenek meg a PEP 8-nak, és ne legyenek „mágikus számok” szétszórva – az abszolút nullát tedd egy `ABSZOLUT_NULLA` osztályszintű konstansba.

```python starter required
class Homerseklet:
    def __init__(self, c):
        self.celsius = c

    def fahrenheit(self):
        return self.celsius * 9 / 5 + 32


print(Homerseklet(21.5).fahrenheit())
```

<details>
<summary>Megoldás</summary>

```python solution
class Homerseklet:
    """Egy hőmérséklet-érték, Celsius-fokban tárolva."""

    ABSZOLUT_NULLA = -273.15

    def __init__(self, celsius):
        if celsius < self.ABSZOLUT_NULLA:
            raise ValueError("Az abszolút nullánál nem lehet hidegebb.")
        self.celsius = celsius

    @classmethod
    def fahrenheitbol(cls, f):
        """Új példányt hoz létre egy Fahrenheit-értékből."""
        return cls((f - 32) * 5 / 9)

    def fahrenheit(self):
        """Visszaadja a hőmérsékletet Fahrenheitben."""
        return self.celsius * 9 / 5 + 32

    def kelvin(self):
        """Visszaadja a hőmérsékletet Kelvinben."""
        return self.celsius - self.ABSZOLUT_NULLA

    def __repr__(self):
        return f"Homerseklet({self.celsius})"


h = Homerseklet(21.5)
print(h, h.fahrenheit(), h.kelvin())
print(Homerseklet.fahrenheitbol(212))
```

</details>

```python test
h = Homerseklet(21.5)
assert h.celsius == 21.5, "Az értéket a celsius attribútumban tárold."
assert abs(h.fahrenheit() - 70.7) < 1e-9, "21,5 °C = 70,7 °F."
assert abs(Homerseklet(0).kelvin() - 273.15) < 1e-9, "0 °C = 273,15 K."
assert repr(h) == "Homerseklet(21.5)", "A repr() alakja: Homerseklet(21.5)."
f = Homerseklet.fahrenheitbol(212)
assert isinstance(f, Homerseklet) and abs(f.celsius - 100) < 1e-9, "212 °F = 100 °C, és Homerseklet példányt kell adni."
assert isinstance(Homerseklet.__dict__.get("fahrenheitbol"), classmethod), "A fahrenheitbol legyen @classmethod."
assert getattr(Homerseklet, "ABSZOLUT_NULLA", None) == -273.15, "Kell egy ABSZOLUT_NULLA = -273.15 osztálykonstans."
Homerseklet(-273.15)
try:
    Homerseklet(-300)
    assert False, "Az abszolút nulla alatt ValueError kell."
except ValueError:
    pass
assert (Homerseklet.__doc__ or "").strip(), "Az osztálynak legyen docstringje."
for nev in ("fahrenheit", "kelvin", "fahrenheitbol"):
    assert (getattr(Homerseklet, nev).__doc__ or "").strip(), f"A(z) {nev} metódusnak legyen docstringje."
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Programozási feladatok

**1.** **Hiányzó docstringek.** Írd meg a `docstring_nelkul(kod)` függvényt, amely egy Python forráskódot (szöveget) az `ast` modullal elemez, és ábécérendben visszaadja azoknak a függvényeknek a nevét, amelyeknek nincs docstringje! Segítség: `ast.walk(ast.parse(kod))`, `isinstance(csomopont, ast.FunctionDef)`, `ast.get_docstring(csomopont)`.

```python starter
import ast

def docstring_nelkul(kod):
    return []
```

<details>
<summary>Megoldás</summary>

```python solution
import ast

def docstring_nelkul(kod):
    hianyzik = []
    for csomopont in ast.walk(ast.parse(kod)):          # a szintaxisfa összes eleme
        if isinstance(csomopont, ast.FunctionDef) and ast.get_docstring(csomopont) is None:
            hianyzik.append(csomopont.name)
    return sorted(hianyzik)
```

</details>

```python test
kod = '''
def osszead(a, b):
    """Két szám összege."""
    return a + b

def szoroz(a, b):
    return a * b

def atlag(l):
    # ez csak megjegyzés, nem docstring
    return sum(l) / len(l)
'''
assert docstring_nelkul(kod) == ["atlag", "szoroz"]
assert docstring_nelkul("x = 1") == []
print("Minden ellenőrzés sikeres!")
```

**2.** **Beszédes név?** Írd meg a `beszedes_nev_e(nev)` függvényt egy egyszerű névkonvenció-ellenőrzőhöz! Akkor adjon `True`-t, ha a név legalább 3 karakteres, csak kisbetűt, számjegyet és aláhúzást tartalmaz, és nem számjeggyel kezdődik. Kivétel: az `i`, `j`, `k` ciklusváltozók is elfogadottak.

```python starter
def beszedes_nev_e(nev):
    return len(nev) >= 3
```

<details>
<summary>Megoldás</summary>

```python solution
def beszedes_nev_e(nev):
    if nev in ("i", "j", "k"):
        return True                         # megszokott ciklusváltozók
    engedett = set("abcdefghijklmnopqrstuvwxyz0123456789_")
    return len(nev) >= 3 and not nev[0].isdigit() and set(nev) <= engedett
```

</details>

```python test
assert beszedes_nev_e("osszeg")
assert beszedes_nev_e("max_ertek2")
assert beszedes_nev_e("i")
assert not beszedes_nev_e("a")
assert not beszedes_nev_e("Osszeg")
assert not beszedes_nev_e("2db")
assert not beszedes_nev_e("max-ertek")
print("Minden ellenőrzés sikeres!")
```

**3.** **Túl hosszú sorok.** Írd meg a `sorhossz_hibak(kod, max_hossz=79)` függvényt, amely a forráskód azon sorainak **sorszámát** (1-től számozva) adja vissza listában, amelyek hosszabbak `max_hossz` karakternél!

```python starter
def sorhossz_hibak(kod, max_hossz=79):
    return []
```

<details>
<summary>Megoldás</summary>

```python solution
def sorhossz_hibak(kod, max_hossz=79):
    return [szam for szam, sor in enumerate(kod.splitlines(), start=1)   # 1-től számozunk
            if len(sor) > max_hossz]
```

</details>

```python test
kod = "x = 1\n" + "y = " + "1" * 80 + "\nz = 3\n" + "w" * 79
assert sorhossz_hibak(kod) == [2]
assert sorhossz_hibak(kod, 5) == [2, 4]
assert sorhossz_hibak("") == []
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Melyik név felel meg a PEP 8 ajánlásnak egy Python függvényre?
- OsszegSzamol
- osszegSzamol
+ osszeg_szamol
- OSSZEG_SZAMOL
! Függvényekre és változókra snake_case, osztályokra PascalCase, konstansokra NAGYBETŰ.

? Mi a DRY elv lényege?
+ ne ismételd önmagad: egy tudásdarab egy helyen legyen a kódban
- minden függvény legyen rövidebb 5 sornál
- ne használj megjegyzéseket
- minden változó legyen globális
! Don't Repeat Yourself: a duplikált kódot függvénybe érdemes kiemelni.

? Hány karakteres sorhosszt ajánl a PEP 8 alapértelmezésként legfeljebb?
= 79
! Sok csapat ennél többet enged (pl. 88 vagy 100), de a PEP 8 eredeti ajánlása 79.

? Mire való a docstring?
- a kód gyorsítására
+ a függvény céljának és használatának leírására, amit a `help()` is megjelenít
- a hibák elrejtésére
- a változók típusának kikényszerítésére
! A függvény első utasításaként írt szöveg.
```
