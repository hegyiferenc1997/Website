---
title: Típusjelölések Pythonban
summary: Type hints – hogyan írjuk ki a típusokat dinamikus nyelvben, és hogyan ellenőrizteti őket a mypy.
minutes: 15
---

## Amit ebben a leckében megtanulsz

- hogyan adsz meg **típusjelölést** (type hint) változóknak és függvényeknek,
- mi a **fokozatos típusosság** (gradual typing),
- hogyan ellenőrizheted a típusokat a **mypy** eszközzel.

## Típusjelölés szintaxisa

A Python 3.5 óta a típusokat **jelölhetjük** a kódban. Ezek a jelölések **nem kötelezők**, és a Python futáskor **nem ellenőrzi** őket – a programozónak és az eszközöknek szólnak.

```python run
eletkor: int = 20
nev: str = "Anna"
atlag: float = 4.5

def udvozles(nev: str, ismetles: int = 1) -> str:
    # A -> utáni rész a visszatérési érték típusa.
    return ("Szia, " + nev + "! ") * ismetles

print(udvozles("Béla", 2))
```

## Összetett típusok

```python run
def atlag(jegyek: list[int]) -> float:
    return sum(jegyek) / len(jegyek)

def keres(telefonkonyv: dict[str, str], nev: str) -> str | None:
    # str | None: vagy szöveg, vagy None (ha nincs ilyen név)
    return telefonkonyv.get(nev)

print(atlag([5, 4, 4]))
print(keres({"Anna": "123"}, "Béla"))
```

| Jelölés | Jelentés |
| --- | --- |
| `list[int]` | egészek listája |
| `dict[str, float]` | szótár szöveg kulcsokkal és valós értékekkel |
| `tuple[int, int]` | két egészből álló rendezett pár |
| `set[str]` | szövegek halmaza |
| `int \| None` | egész vagy None |

## A Python nem ellenőriz futáskor

```python run
def negyzet(x: int) -> int:
    return x * x

# A jelölés ellenére lefut – a Python nem ellenőrzi a típust.
print(negyzet(2.5))   # 6.25
```

## Statikus ellenőrzés: mypy

A **mypy** egy külső eszköz, amely futtatás nélkül, a jelölések alapján ellenőrzi a kódot – mintha statikusan típusos nyelvet használnál.

```bash
pip install mypy
mypy program.py
```

```text
program.py:5: error: Argument 1 to "negyzet" has incompatible type "float"; expected "int"
```

A VS Code Python bővítménye (Pylance) is használja a jelöléseket: aláhúzza a hibákat és jobb kódkiegészítést ad.

## Fokozatos típusosság

A Python **fokozatos típusosságot** követ: a kód egy részét jelölheted, a többit nem. Kis szkripteknél ritkán szükséges, nagyobb projekteknél (csapatmunka, könyvtárak) viszont sok hibát előz meg. Ugyanezt az utat járta a JavaScript is: a **TypeScript** a JavaScript statikus típusokkal kiegészített változata.

## Összefoglalás

- Típusjelölés: `valtozo: tipus`, függvénynél `def f(x: int) -> str:`.
- A jelölés nem kötelező, és a Python futáskor nem ellenőrzi.
- A **mypy** és a fejlesztőkörnyezet a jelölések alapján futtatás nélkül talál hibákat.
