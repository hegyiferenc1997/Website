---
title: A kód dokumentálásának fontossága
summary: Kinek és miért írunk dokumentációt, milyen szintjei vannak, és mi kerüljön bele.
minutes: 10
---

## Amit ebben a leckében megtanulsz

- miért **elengedhetetlen** a dokumentáció,
- milyen **fajtái** vannak (kódon belüli, API, felhasználói, fejlesztői),
- mi a **jó dokumentáció** ismérve.

## Miért dokumentálunk?

> „A kódot sokkal többször olvassák, mint írják.” – Guido van Rossum, a Python megalkotója

A programot nem csak a gép „olvassa”. Olvassa:

- a **csapattársad**, aki tovább dolgozik rajta,
- a **jövőbeli önmagad** – fél év múlva a saját kódod is idegen lesz,
- a **felhasználó**, aki használni szeretné,
- az **oktató vagy értékelő**, aki a projekt beadandót pontozza.

A dokumentáció célja, hogy a kód **megérthető, használható és karbantartható** legyen. Egy rosszul dokumentált program akkor is értéktelenné válhat, ha jól működik, mert senki nem meri módosítani.

> A tárgy projektfeladatánál a **dokumentáció teljessége és szakmai megfogalmazása** külön értékelési szempont – érdemes komolyan venni!

## A dokumentáció szintjei

| Fajta                | Kinek szól                         | Hol van                                     | Példa                          |
| -------------------- | ---------------------------------- | ------------------------------------------- | ------------------------------ |
| **kódon belüli**     | a kódot olvasó fejlesztő           | kommentek, beszédes nevek                   | `# A bruttó ár ÁFA-val együtt` |
| **API-dokumentáció** | aki használja a függvényt / modult | docstringek, típusjelölések                 | `"""Visszaadja az átlagot…"""` |
| **fejlesztői**       | aki tovább fejleszti a projektet   | README, architektúra leírás, `CONTRIBUTING` | telepítés, felépítés, döntések |
| **felhasználói**     | a program felhasználója            | kézikönyv, súgó, GYIK                       | „Hogyan regisztrálok?”         |

## Mit dokumentálj?

- **Mit csinál** a modul / függvény (a cél, nem a megvalósítás lépései).
- **Paraméterek és visszatérési érték**: típus, jelentés, megengedett tartomány.
- **Kivételek**: mikor és milyen hibát dob.
- **Miért** készült így – a nem nyilvánvaló döntések oka.
- **Hogyan kell használni**: egy rövid példa.
- **Telepítés és futtatás**: függőségek, parancsok (README).

## Mit ne dokumentálj?

- Ami a kódból **magától értetődik**: `i += 1  # növeli i-t` – ez csak zaj.
- Elavult információt: a **rossz** dokumentáció rosszabb, mint a hiányzó. Ha módosítod a kódot, frissítsd a kommentet is!

## A legjobb dokumentáció: az olvasható kód

Sok komment feleslegessé válik, ha a kód **önmagát magyarázza**: beszédes nevek, rövid függvények, egyértelmű szerkezet.

```python run
# Nehezen érthető, komment kellene hozzá:
def f(l):
    return sum(x for x in l if x >= 50) / len([x for x in l if x >= 50])

# Önmagát magyarázza:
MINIMUM_PONT = 50

def sikeres_dolgozatok_atlaga(pontszamok):
    sikeresek = [p for p in pontszamok if p >= MINIMUM_PONT]
    return sum(sikeresek) / len(sikeresek)

print(f([40, 60, 80]), sikeres_dolgozatok_atlaga([40, 60, 80]))
```

## Összefoglalás

- A kódot sokkal többször olvassák, mint írják – a dokumentáció a karbantarthatóság alapja.
- Szintek: kódon belüli, API (docstring), fejlesztői (README), felhasználói.
- A _miért_-et dokumentáld, ne a nyilvánvalót; tartsd naprakészen.
- A legjobb kiindulópont az önmagát magyarázó, beszédes nevű kód.

## A lecke feladata: Docstring futtatható példákkal

A `kor_terulet(r)` függvény már működik, de semmi nem árulja el, hogyan kell használni. Írj hozzá **docstringet**, amely:

- egy mondatban leírja, mit csinál a függvény,
- legalább **két doctest-példát** tartalmaz (`>>>` kezdetű sorok a várt eredménnyel), például `round(kor_terulet(1), 2)` → `3.14`.

Ezen felül negatív sugárnál a függvény dobjon `ValueError`-t.

Az ellenőrzés a docstringben lévő példákat is lefuttatja a `doctest` modullal – mindnek helyes eredményt kell adnia.

```python starter required
import math


def kor_terulet(r):
    return math.pi * r ** 2


print(kor_terulet(2))
```

<details>
<summary>Megoldás</summary>

```python solution
import math


def kor_terulet(r):
    """Visszaadja az r sugarú kör területét.

    >>> round(kor_terulet(1), 2)
    3.14
    >>> kor_terulet(0)
    0.0
    """
    if r < 0:
        raise ValueError("A sugár nem lehet negatív.")
    return math.pi * r ** 2


print(kor_terulet(2))
```

</details>

```python test
import doctest, math
doc = kor_terulet.__doc__ or ""
assert doc.strip(), "A függvénynek nincs docstringje."
assert doc.count(">>>") >= 2, "Legalább két >>> kezdetű doctest-példa kell a docstringbe."
tesztek = doctest.DocTestFinder().find(kor_terulet, "kor_terulet", module=False, globs={"kor_terulet": kor_terulet, "math": math})
futtato = doctest.DocTestRunner(verbose=False)
for t in tesztek:
    futtato.run(t, out=lambda s: None)
eredmeny = futtato.summarize(verbose=False)
assert eredmeny.attempted >= 2, "Nem találtam legalább két doctest-példát."
assert eredmeny.failed == 0, "Valamelyik doctest-példa nem a leírt eredményt adja."
assert abs(kor_terulet(3) - 28.274333882308138) < 1e-9, "A terület számítása elromlott."
try:
    kor_terulet(-1)
    assert False, "Negatív sugárnál ValueError kell."
except ValueError:
    pass
```
