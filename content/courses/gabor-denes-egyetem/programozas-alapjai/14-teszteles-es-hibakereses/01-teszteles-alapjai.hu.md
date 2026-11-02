---
title: A tesztelés alapjai
summary: Miért tesztelünk, a tesztelés szintjei, tesztesetek tervezése: normál, határ- és hibás esetek.
minutes: 15
---

## Amit ebben a leckében megtanulsz

- miért nélkülözhetetlen a **tesztelés**,
- milyen **szintjei** vannak (egység, integrációs, rendszer, elfogadási),
- hogyan tervezel **teszteseteket**: normál, **határ**- és hibás esetek,
- hogyan írsz egyszerű tesztet `assert`-tel.

## Miért tesztelünk?

> „A tesztelés a hibák jelenlétét mutathatja ki, de soha a hiányukat.” – Edsger W. Dijkstra

A **tesztelés** célja, hogy a hibákat **mi** találjuk meg, ne a felhasználó. Egy jó tesztkészlet:

- **bizalmat** ad: tudjuk, hogy a kód azt csinálja, amit kell,
- **védőháló** a módosításoknál: ha valamit elrontunk, a teszt azonnal jelez (**regressziós teszt**),
- **dokumentáció**: a tesztekből látszik, hogyan kell használni a függvényt.

Minél később derül ki egy hiba, annál drágább kijavítani: a fejlesztés közben pár perc, élesben akár napok és komoly károk.

## A tesztelés szintjei

| Szint | Mit tesztel | Példa |
| --- | --- | --- |
| **egységteszt** (unit) | egy függvényt, osztályt elszigetelten | `atlag([4, 5]) == 4.5` |
| **integrációs teszt** | több egység együttműködését | a függvény helyesen olvas az adatbázisból |
| **rendszerteszt** | a teljes alkalmazást | a weboldalon végig lehet menni a regisztráción |
| **elfogadási teszt** | megfelel-e a megrendelő igényeinek | a felhasználó jóváhagyja a funkciót |

Ebben a témakörben főleg **egységtesztekkel** foglalkozunk: ezeket a programozó írja, gyorsak, és sokat futtatjuk őket.

## Fekete doboz és fehér doboz

- **Fekete dobozos** tesztelés: csak a specifikációt nézzük (mit kell csinálnia), a kódot nem.
- **Fehér dobozos** tesztelés: a kód ismeretében úgy tervezünk teszteket, hogy minden ág és ciklus lefusson (**kódlefedettség**).

## Tesztesetek tervezése

Egy teszteset: **bemenet + elvárt kimenet**. Három csoportba érdemes gondolkodni:

1. **Normál esetek** – tipikus, „hétköznapi” bemenetek.
2. **Határesetek** – a tartományok szélei: üres lista, egy elem, 0, negatív szám, a ponthatár pontosan.
3. **Hibás esetek** – érvénytelen bemenet: megfelelő kivételt dob-e?

Példa: `jegy(pont)` a tárgy skálája szerint (50 → 2, 63 → 3, 76 → 4, 89 → 5).

| Csoport | Bemenet | Elvárt |
| --- | --- | --- |
| normál | 70 | 3 |
| határ | 49, 50 | 1, 2 |
| határ | 88, 89 | 4, 5 |
| határ | 0, 100 | 1, 5 |
| hibás | −1, 101 | `ValueError` |

> **A hibák nagy része a határoknál van** („off-by-one”: `>` vagy `>=`?). Mindig teszteld a határ mindkét oldalát!

## Egyszerű tesztek assert-tel

```python run
def jegy(pont):
    if not 0 <= pont <= 100:
        raise ValueError("A pontszám 0 és 100 között lehet.")
    if pont >= 89:
        return 5
    if pont >= 76:
        return 4
    if pont >= 63:
        return 3
    if pont >= 50:
        return 2
    return 1


# Normál és határesetek
assert jegy(70) == 3
assert jegy(49) == 1 and jegy(50) == 2
assert jegy(88) == 4 and jegy(89) == 5
assert jegy(0) == 1 and jegy(100) == 5

# Hibás eset: kivételt várunk
try:
    jegy(101)
    assert False, "ValueError-t kellett volna dobnia"
except ValueError:
    pass

print("Minden teszt sikeres!")
```

Ha egy `assert` hamis, `AssertionError` keletkezik – a teszt **elbukik**, és látjuk, melyik sorban.

## Tesztvezérelt fejlesztés (TDD)

A **TDD** (*Test-Driven Development*) módszernél előbb a tesztet írjuk meg, csak utána a kódot:

1. 🔴 **Piros:** írj egy tesztet, ami még elbukik (mert nincs kód).
2. 🟢 **Zöld:** írd meg a legegyszerűbb kódot, amitől a teszt átmegy.
3. 🔵 **Refaktorálás:** tedd szebbé a kódot – a tesztek garantálják, hogy közben nem rontasz el semmit.

Ennek az oldalnak a gyakorlófeladatai is így épülnek fel: az „ellenőrzés” blokk a teszt, a te dolgod a kód.

## Összefoglalás

- A tesztelés hibákat keres, bizalmat ad és védőháló a módosításoknál.
- Szintek: **egység → integrációs → rendszer → elfogadási**.
- Teszteset = bemenet + elvárt kimenet; mindig gondolj **normál, határ- és hibás** esetekre.
- TDD: piros → zöld → refaktorálás.
