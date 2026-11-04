---
title: Tesztelés és kódminőség
summary: Egység-, integrációs, rendszer- és elfogadási teszt, automatikus tesztek Pythonban, olvasható kód, dokumentáció, kódáttekintés.
minutes: 18
---

## Amit ebben a leckében megtanulsz

- a tesztelés **szintjeit** (egység, integrációs, rendszer, elfogadási),
- hogyan néz ki egy **automatikus egységteszt**,
- mitől **jó** egy kód: olvashatóság, elnevezés, dokumentáció, **kódáttekintés**.

## A tesztelés szintjei

```text
            ▲  kevés, lassú, drága
           ╱ ╲      elfogadási teszt (a megrendelő)
          ╱   ╲     rendszerteszt (a teljes rendszer)
         ╱     ╲    integrációs teszt (modulok együtt)
        ╱_______╲   egységteszt (egy függvény, egy osztály)
            ▼  sok, gyors, olcsó
```

| Szint             | Mit vizsgál?                                     | Ki végzi?                |
| ----------------- | ------------------------------------------------ | ------------------------ |
| **egységteszt**   | egy függvény, egy osztály önmagában              | fejlesztő, automatikusan |
| **integrációs**   | együttműködnek-e a modulok (pl. kód + adatbázis) | fejlesztő, tesztelő      |
| **rendszerteszt** | a teljes rendszer a követelmények szerint        | tesztelő                 |
| **elfogadási**    | azt kapta-e a megrendelő, amit kért              | megrendelő, felhasználók |

Ezt a formát **tesztpiramisnak** hívják: sok gyors egységteszt, kevesebb lassú, nagy teszt.

## Automatikus egységteszt

Az egységteszt egy kis program, amely a kódot ismert bemenetekkel hívja, és ellenőrzi az eredményt. Gondolj a **határesetekre** is: üres lista, nulla, negatív szám, nagyon nagy érték.

```python run
# A tesztelendő függvény
def kedvezmenyes_ar(ar, szazalek):
    if not 0 <= szazalek <= 100:
        raise ValueError("A kedvezmény 0 és 100 között lehet.")
    return round(ar * (100 - szazalek) / 100)

# Egységtesztek assert-tel (a valóságban pytest-tel futtatjuk)
assert kedvezmenyes_ar(1000, 20) == 800
assert kedvezmenyes_ar(1000, 0) == 1000      # határeset
assert kedvezmenyes_ar(1000, 100) == 0       # határeset
try:
    kedvezmenyes_ar(1000, 150)
    assert False, "Hibát kellett volna dobnia"
except ValueError:
    pass
print("Minden teszt átment.")
```

A **TDD** (tesztvezérelt fejlesztés) szerint előbb a tesztet írod meg, és csak utána a kódot, amely átmegy rajta.

## Mitől jó a kód?

A kódot sokkal többször **olvassák**, mint írják. Egy jó kód:

- **beszédes neveket** használ: `atlag_szamitasa(jegyek)` és nem `f(x)`,
- **rövid függvényekből** áll, mindegyik egy dolgot csinál,
- nem ismétli önmagát (**DRY**: Don't Repeat Yourself),
- **egységes stílusú** (formázó: Black/Ruff, Prettier),
- **dokumentált**: rövid megjegyzés ott, ahol a _miért_ nem nyilvánvaló, README a projekt elején, docstring a függvényeknél.

```python run
def atlag(jegyek):
    """A jegyek átlaga; üres listára 0-t ad (nincs osztás nullával)."""
    if not jegyek:
        return 0
    return sum(jegyek) / len(jegyek)

print(atlag([5, 4, 3]), atlag([]))
```

## Kódáttekintés (code review)

A kódáttekintésnél egy másik fejlesztő elolvassa a változtatást (pl. egy GitHub pull requestben), mielőtt beolvasztják. Hibákat talál, tudást oszt meg, és egységesen tartja a kódot. Jó szokás: kis, egy témájú változtatások, rövid magyarázattal.

## Összefoglalás

- Tesztszintek: egység → integrációs → rendszer → elfogadási; tesztpiramis.
- Az egységteszt ismert bemenettel hív, és ellenőriz; gondolj a határesetekre.
- Jó kód: beszédes nevek, rövid függvények, DRY, egységes stílus, dokumentáció, kódáttekintés.

## A lecke feladata

```quiz required
? Melyik tesztszint vizsgál egyetlen függvényt önmagában?
+ egységteszt
- integrációs teszt
- rendszerteszt
- elfogadási teszt
! Unit test.

? Mennyi a `kedvezmenyes_ar(2500, 40)` értéke?
= 1500
! 2500 · 60 / 100 = 1500.

? Mit jelent a DRY elv?
- Mindig írj dokumentációt.
+ Ne ismételd önmagad.
- Minden függvény legyen hosszú.
- Ne használj megjegyzést.
! Don't Repeat Yourself.

? Melyik tesztelési módszer szerint írod **előbb** a tesztet, és csak utána a kódot?
= TDD
= tesztvezérelt fejlesztés
! Test-Driven Development.
```
