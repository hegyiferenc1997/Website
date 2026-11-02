---
title: Egységtesztelés és tesztelési keretrendszerek
summary: A unittest és a pytest keretrendszer, tesztosztályok, assert metódusok, kivételek tesztelése, paraméterezett tesztek.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- mire valók a **tesztelési keretrendszerek**,
- hogyan írsz tesztet a beépített **unittest** modullal,
- hogyan írsz tesztet a népszerű **pytest** eszközzel,
- mi a **kódlefedettség**, és milyen keretrendszerek vannak más nyelvekben.

## Miért kell keretrendszer?

Az `assert` sorok az első hibánál megállnak, és nem adnak összesítést. Egy **tesztelési keretrendszer**:

- megkeresi és lefuttatja az **összes** tesztet,
- egy elbukó teszt után is folytatja a többit,
- pontos jelentést ad (mi volt az elvárt és a kapott érték),
- támogatja az előkészítést (setup) és a takarítást (teardown),
- automatizálható (pl. minden feltöltéskor lefut – **CI**, folyamatos integráció).

## unittest – a beépített keretrendszer

A tesztek egy `unittest.TestCase` leszármazott osztály `test_` kezdetű metódusai.

```python run
import sys
import unittest


def atlag(szamok):
    if not szamok:
        raise ValueError("Üres listának nincs átlaga.")
    return sum(szamok) / len(szamok)


class AtlagTeszt(unittest.TestCase):
    def test_egesz_szamok(self):
        self.assertEqual(atlag([2, 4, 6]), 4)

    def test_egy_elem(self):
        self.assertEqual(atlag([5]), 5)

    def test_valos_eredmeny(self):
        self.assertAlmostEqual(atlag([1, 2]), 1.5)

    def test_ures_lista_hibat_dob(self):
        with self.assertRaises(ValueError):
            atlag([])


# Fájlban általában csak: unittest.main()
# Itt kézzel futtatjuk, hogy a kimenet a képernyőn jelenjen meg.
csomag = unittest.defaultTestLoader.loadTestsFromTestCase(AtlagTeszt)
unittest.TextTestRunner(stream=sys.stdout, verbosity=2).run(csomag)
```

A leggyakoribb ellenőrző metódusok:

| Metódus                           | Ellenőrzés                        |
| --------------------------------- | --------------------------------- |
| `assertEqual(a, b)`               | `a == b`                          |
| `assertNotEqual(a, b)`            | `a != b`                          |
| `assertTrue(x)`, `assertFalse(x)` | igaz / hamis                      |
| `assertIsNone(x)`                 | `x is None`                       |
| `assertIn(a, b)`                  | `a in b`                          |
| `assertAlmostEqual(a, b)`         | valós számok közelítő egyenlősége |
| `assertRaises(Kivetel)`           | a blokk kivételt dob              |

Az előkészítő kód a `setUp` metódusba kerül, ami **minden** teszt előtt lefut:

```python run
import sys
import unittest


class KosarTeszt(unittest.TestCase):
    def setUp(self):
        self.kosar = ["tej", "kenyér"]     # minden teszt friss kosarat kap

    def test_hozzaadas(self):
        self.kosar.append("vaj")
        self.assertEqual(len(self.kosar), 3)

    def test_kezdeti_meret(self):
        self.assertEqual(len(self.kosar), 2)   # az előző teszt nem hat rá


eredmeny = unittest.TextTestRunner(stream=sys.stdout).run(
    unittest.defaultTestLoader.loadTestsFromTestCase(KosarTeszt)
)
print("Sikeres:", eredmeny.wasSuccessful())
```

## pytest – egyszerűbb és népszerűbb

A **pytest** külső csomag (`pip install pytest`), de a Python-világban ez a legelterjedtebb. A tesztek egyszerű függvények, és a sima `assert` utasítást használják.

```python
# test_atlag.py
import pytest
from atlag import atlag

def test_egesz_szamok():
    assert atlag([2, 4, 6]) == 4

def test_ures_lista_hibat_dob():
    with pytest.raises(ValueError):
        atlag([])

@pytest.mark.parametrize("bemenet, elvart", [
    ([1], 1),
    ([1, 2], 1.5),
    ([10, 20, 30], 20),
])
def test_tobb_eset(bemenet, elvart):
    assert atlag(bemenet) == elvart
```

Futtatás a terminálban (a pytest megkeresi a `test_*.py` fájlokat):

```bash
pytest
pytest -v              # részletes kimenet
pytest -k "ures"       # csak a nevükben „ures”-t tartalmazó tesztek
```

```text
test_atlag.py::test_egesz_szamok PASSED
test_atlag.py::test_ures_lista_hibat_dob PASSED
test_atlag.py::test_tobb_eset[bemenet0-1] PASSED
...
======================== 5 passed in 0.02s ========================
```

## Doctest – teszt a dokumentációban

A `doctest` modul a docstringben lévő példákat futtatja le, és összeveti az eredménnyel:

```python run
import doctest


def negyzet(x):
    """Visszaadja x négyzetét.

    >>> negyzet(3)
    9
    >>> negyzet(-2)
    4
    """
    return x * x


eredmeny = doctest.testmod()
print(eredmeny)   # TestResults(failed=0, attempted=2)
```

## Kódlefedettség

A **kódlefedettség** (code coverage) azt méri, hogy a tesztek a kód hány százalékát futtatják le. Pythonban a `coverage` vagy a `pytest-cov` csomag méri:

```bash
pytest --cov=sajat_modul
```

A 100% lefedettség sem jelenti azt, hogy nincs hiba – csak azt, hogy minden sor lefutott legalább egyszer. A lefedetlen részek viszont biztosan teszteletlenek.

## Keretrendszerek más nyelvekben

| Nyelv                   | Keretrendszer        |
| ----------------------- | -------------------- |
| Java                    | JUnit                |
| C#                      | NUnit, xUnit, MSTest |
| JavaScript / TypeScript | Jest, Vitest         |
| C++                     | GoogleTest, Catch2   |
| Ruby                    | RSpec, Minitest      |

> Ez a weboldal is így működik: a `pnpm test` parancs a **Vitest** keretrendszerrel futtatja a teszteket – köztük azt is, amely a tananyag összes Python példáját és megoldását lefuttatja.

## Összefoglalás

- A keretrendszer megkeresi, futtatja és összesíti a teszteket.
- **unittest:** `TestCase` osztály, `test_` metódusok, `assertEqual`, `assertRaises`, `setUp`.
- **pytest:** egyszerű függvények sima `assert`-tel, `pytest.raises`, paraméterezés.
- **doctest:** példák a docstringben; **coverage:** lefedettség mérése.

## A lecke feladata: Egységtesztek a unittest keretrendszerrel

Írj `unittest`-tesztosztályt a lecke `atlag(szamok)` függvényéhez! A `TestAtlag(unittest.TestCase)` osztályban legyen **legalább három** `test_` kezdetű metódus:

- egy egész számos eset (`assertEqual`),
- egy olyan, ahol az átlag nem egész (pl. `assertAlmostEqual`),
- egy, amely azt ellenőrzi, hogy üres listára `ValueError` jön (`with self.assertRaises(ValueError):`).

Az ellenőrzés lefuttatja a tesztosztályodat a helyes függvénnyel (minden tesztnek át kell mennie), majd hibás változatokkal – azoknál legalább egy tesztnek el kell buknia.

```python starter required
import sys
import unittest


def atlag(szamok):
    if not szamok:
        raise ValueError("Üres listának nincs átlaga.")
    return sum(szamok) / len(szamok)


class TestAtlag(unittest.TestCase):
    def test_pelda(self):
        self.assertTrue(True)   # cseréld le valódi tesztekre!


# A tesztek futtatása – az eredmény a kimenetben látszik
futtato = unittest.TextTestRunner(stream=sys.stdout, verbosity=2)
futtato.run(unittest.TestLoader().loadTestsFromTestCase(TestAtlag))
```

<details>
<summary>Megoldás</summary>

```python solution
import sys
import unittest


def atlag(szamok):
    if not szamok:
        raise ValueError("Üres listának nincs átlaga.")
    return sum(szamok) / len(szamok)


class TestAtlag(unittest.TestCase):
    def test_egesz_atlag(self):
        self.assertEqual(atlag([2, 4, 6]), 4)

    def test_tort_atlag(self):
        self.assertAlmostEqual(atlag([1, 2]), 1.5)

    def test_egy_elem(self):
        self.assertEqual(atlag([7]), 7)

    def test_ures_lista(self):
        with self.assertRaises(ValueError):
            atlag([])


# A tesztek futtatása – az eredmény a kimenetben látszik
futtato = unittest.TextTestRunner(stream=sys.stdout, verbosity=2)
futtato.run(unittest.TestLoader().loadTestsFromTestCase(TestAtlag))
```

</details>

```python test
import io, unittest

def futtat():
    csomag = unittest.TestLoader().loadTestsFromTestCase(TestAtlag)
    return unittest.TextTestRunner(stream=io.StringIO(), verbosity=0).run(csomag)

eredmeny = futtat()
assert eredmeny.testsRun >= 3, f"Legalább három test_ metódus kell (most {eredmeny.testsRun} van)."
assert eredmeny.wasSuccessful(), "A helyes függvénnyel minden tesztnek át kell mennie."

helyes = atlag
mutansok = [
    (lambda s: 0 if not s else sum(s) / len(s), "üres listára 0-t ad hiba helyett"),
    (lambda s: sum(s) // len(s), "egész osztást használ (1.5 helyett 1)"),
    (lambda s: sum(s) / (len(s) + 1), "rossz számmal oszt"),
]
for mutans, leiras in mutansok:
    atlag = mutans
    elkapta = not futtat().wasSuccessful()
    atlag = helyes
    assert elkapta, f"A tesztjeid nem vették észre ezt a hibát: {leiras}."
```
