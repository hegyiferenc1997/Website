---
title: Kommentek és dokumentációs szabványok
summary: Jó és rossz kommentek, docstringek a PEP 257 szerint, Google-stílus, a help() függvény, README és más nyelvek szabványai.
minutes: 18
---

## Amit ebben a leckében megtanulsz

- mi a különbség a **jó** és a **rossz** komment között,
- hogyan írsz **docstringet** a PEP 257 szabvány szerint,
- a **Google** és a **reST/Sphinx** docstring-stílust,
- mi kerül egy **README** fájlba, és hogyan dokumentálnak más nyelvek.

## Komment

A `#` utáni szöveg **komment**: a fejlesztőnek szól, a program figyelmen kívül hagyja. A jó komment a **miértet** magyarázza, nem a _mit_-et.

```python run
ar = 10_000
napok = 3

# ROSSZ – a kód már elmondja ugyanezt:
osszeg = ar * napok   # megszorozzuk az árat a napokkal

# JÓ – megmagyarázza a nem nyilvánvaló döntést:
# A szálloda a távozás napját nem számolja fel, ezért nem napok + 1.
osszeg = ar * napok
print(osszeg)
```

Jó komment:

- elmagyaráz egy nem magától értetődő **döntést** vagy **üzleti szabályt**,
- figyelmeztet egy **csapdára** („a lista itt még rendezetlen!”),
- hivatkozik egy **forrásra** (képlet, szabvány, hibajegy),
- `TODO:` jelzéssel jelöli a hátralévő munkát.

Rossz komment:

- megismétli a kódot,
- elavult (a kód már mást csinál),
- kikommentezett régi kód – azt a verziókezelő (git) úgyis megőrzi, töröld.

## Docstring

A **docstring** a modul, osztály vagy függvény első sorában álló szöveg (háromszoros idézőjelek között). A Python eltárolja, a `help()` függvény és a fejlesztőkörnyezet megjeleníti.

```python run
def brutto(netto, afa_kulcs=0.27):
    """Kiszámolja az ÁFA-val növelt (bruttó) árat."""
    return netto * (1 + afa_kulcs)

print(brutto.__doc__)
help(brutto)
```

### PEP 257 – a docstringek szabályai

- Háromszoros dupla idézőjel: `"""..."""`.
- Az **első sor** egy rövid, felszólító vagy kijelentő összefoglaló, ponttal a végén.
- Ha több sor kell: az összefoglaló után **üres sor**, utána a részletek.
- Minden nyilvános modulnak, osztálynak, függvénynek és metódusnak legyen docstringje.

### Google-stílus

A részletes docstringek egyik legelterjedtebb formája:

```python run
def kredit_atlag(jegyek, kreditek):
    """Kiszámolja a kreditekkel súlyozott tanulmányi átlagot.

    Args:
        jegyek: A tárgyak jegyei (1–5) listában.
        kreditek: A tárgyak kreditértékei, a jegyekkel azonos sorrendben.

    Returns:
        A súlyozott átlag két tizedesre kerekítve.

    Raises:
        ValueError: Ha a két lista hossza eltér, vagy üres.

    Példa:
        >>> kredit_atlag([5, 3], [4, 2])
        4.33
    """
    if len(jegyek) != len(kreditek) or not jegyek:
        raise ValueError("A jegyek és kreditek listája nem megfelelő.")
    osszeg = sum(j * k for j, k in zip(jegyek, kreditek))
    return round(osszeg / sum(kreditek), 2)

print(kredit_atlag([5, 3], [4, 2]))
```

### reST / Sphinx stílus

A **Sphinx** dokumentációgenerátor (amivel a Python saját dokumentációja is készül) ezt a formát használja:

```python
def kredit_atlag(jegyek, kreditek):
    """Kiszámolja a kreditekkel súlyozott tanulmányi átlagot.

    :param jegyek: A tárgyak jegyei (1–5).
    :param kreditek: A tárgyak kreditértékei.
    :return: A súlyozott átlag.
    :raises ValueError: Ha a listák hossza eltér.
    """
```

Az ilyen docstringekből eszközök (Sphinx, pdoc, MkDocs) **automatikusan weboldalt** generálnak.

## Modul- és osztálydocstring

```python
"""Hallgatói nyilvántartás: jegyek tárolása és átlagszámítás.

A modul a `Hallgato` osztályt és a segédfüggvényeket tartalmazza.
"""


class Hallgato:
    """Egy hallgató adatai és jegyei.

    Attributes:
        nev: A hallgató teljes neve.
        neptun: Hatjegyű Neptun-kód.
    """
```

## README

A **README.md** a projekt „névjegye”, ez az első, amit valaki lát (pl. a GitHubon). Tipikus tartalma:

```text
# Projekt neve
Egy-két mondat: mit csinál a program, kinek szól.

## Telepítés
pip install -r requirements.txt

## Használat
python main.py adatok.csv

## Felépítés
main.py      – a főprogram
adatok.py    – fájlok beolvasása
teszt_*.py   – tesztek

## Szerzők, licenc
```

## Dokumentációs szabványok más nyelvekben

| Nyelv                   | Formátum                                  | Eszköz  |
| ----------------------- | ----------------------------------------- | ------- |
| Java                    | `/** ... */` Javadoc, `@param`, `@return` | javadoc |
| C#                      | `/// <summary>` XML-kommentek             | DocFX   |
| JavaScript / TypeScript | `/** ... */` JSDoc / TSDoc                | TypeDoc |
| C / C++                 | `/** ... */`, `@brief`                    | Doxygen |

```java
/**
 * Kiszámolja két szám átlagát.
 * @param a az első szám
 * @param b a második szám
 * @return a két szám számtani közepe
 */
public static double atlag(double a, double b) { return (a + b) / 2; }
```

## Összefoglalás

- A jó komment a **miértet** magyarázza; a rossz megismétli a kódot vagy elavult.
- A **docstring** (`"""..."""`) a függvény/osztály/modul dokumentációja; a `help()` megjeleníti.
- PEP 257: rövid első sor, üres sor, részletek; Google-stílus: `Args`, `Returns`, `Raises`.
- Minden projekthez kell **README**; más nyelvekben Javadoc, XML-kommentek, JSDoc, Doxygen.
