---
title: Láncolt listák
summary: Csomópontok és mutatók: egyszeresen és kétszeresen láncolt lista, műveletek, és összehasonlítás a tömbbel.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- mi a **láncolt lista**, és miben különbözik a tömbtől,
- hogyan építesz láncolt listát **csomópontokból** Pythonban,
- hogyan működik a **bejárás**, a **beszúrás** és a **törlés**,
- mikor jobb a láncolt lista, és mikor a tömb.

## Mi a láncolt lista?

A **láncolt lista** elemei (**csomópontjai**) nem egymás mellett vannak a memóriában, hanem **bárhol**. Minden csomópont tárolja az adatot és egy **hivatkozást (mutatót)** a következő csomópontra. Az utolsó csomópont mutatója üres (`None`). A lista elejét a **fej** (head) jelöli.

```text
 fej
  │
  ▼
┌────┬───┐    ┌────┬───┐    ┌────┬───┐
│ 12 │ ●─┼───▶│  7 │ ●─┼───▶│ 33 │ ∅ │
└────┴───┘    └────┴───┘    └────┴───┘
 adat  következő
```

## Csomópont és lista Pythonban

```python run
class Csomopont:
    """A láncolt lista egy eleme: adat + hivatkozás a következőre."""
    def __init__(self, adat, kovetkezo=None):
        self.adat = adat
        self.kovetkezo = kovetkezo


class LancoltLista:
    def __init__(self):
        self.fej = None          # üres lista: nincs első elem

    def elejere(self, adat):
        """Beszúrás az elejére – O(1): csak a fejet kell átállítani."""
        self.fej = Csomopont(adat, self.fej)

    def vegere(self, adat):
        """Beszúrás a végére – O(n): el kell sétálni az utolsó elemig."""
        uj = Csomopont(adat)
        if self.fej is None:
            self.fej = uj
            return
        akt = self.fej
        while akt.kovetkezo is not None:
            akt = akt.kovetkezo
        akt.kovetkezo = uj

    def torol(self, adat):
        """Az első adott értékű elem törlése: az előző elemet „átkötjük”."""
        if self.fej is None:
            return False
        if self.fej.adat == adat:
            self.fej = self.fej.kovetkezo
            return True
        elozo = self.fej
        while elozo.kovetkezo is not None:
            if elozo.kovetkezo.adat == adat:
                elozo.kovetkezo = elozo.kovetkezo.kovetkezo
                return True
            elozo = elozo.kovetkezo
        return False

    def lista(self):
        """Bejárás a fejtől a végéig, az elemek Python listába gyűjtve."""
        eredmeny = []
        akt = self.fej
        while akt is not None:
            eredmeny.append(akt.adat)
            akt = akt.kovetkezo
        return eredmeny


l = LancoltLista()
l.vegere(7)
l.vegere(33)
l.elejere(12)
print(l.lista())      # [12, 7, 33]
l.torol(7)
print(l.lista())      # [12, 33]
```

## Beszúrás a közepére – rajzban

Új elem (`X`) beszúrása az `A` után: két mutatót kell átállítani, **semmit nem kell tolni**.

```text
előtte:   A ──▶ B
lépés 1:  X.kovetkezo = A.kovetkezo     (X ──▶ B)
lépés 2:  A.kovetkezo = X               (A ──▶ X ──▶ B)
```

## Kétszeresen láncolt lista

Minden csomópont a **következőre és az előzőre** is mutat. Így mindkét irányba bejárható, és egy adott csomópont törlése O(1), ha már megvan a csomópont. Cserébe több memóriát igényel.

```text
∅ ◀─┤ 12 ├─▶◀─┤ 7 ├─▶◀─┤ 33 ├─▶ ∅
```

A Python `collections.deque` (kétvégű sor) belül hasonló, blokkokból láncolt szerkezet: mindkét végén O(1) a beszúrás és a törlés.

```python run
from collections import deque
d = deque([7, 33])
d.appendleft(12)   # elejére O(1)
d.append(50)       # végére O(1)
print(d, d.popleft(), d.pop())
```

## Tömb vagy láncolt lista?

| Művelet                                 | Tömb (Python list)         | Láncolt lista                       |
| --------------------------------------- | -------------------------- | ----------------------------------- |
| i. elem elérése                         | **O(1)**                   | O(n) – végig kell lépkedni          |
| beszúrás / törlés az elején             | O(n)                       | **O(1)**                            |
| beszúrás / törlés ismert csomópont után | O(n)                       | **O(1)**                            |
| hozzáfűzés a végére                     | átlagosan O(1)             | O(n) (O(1), ha tároljuk a végét is) |
| keresés érték szerint                   | O(n)                       | O(n)                                |
| memória                                 | tömör                      | elemenként plusz mutató(k)          |
| gyorsítótár-barát                       | igen (egymás utáni cellák) | kevésbé                             |

> **A gyakorlatban** a legtöbb feladatra a dinamikus tömb (Python `list`) a jobb választás. Láncolt listát akkor érdemes használni, ha sokat szúrunk be vagy törlünk a lista elején vagy közepén, és ritkán kell index szerint elérni az elemeket. A láncolt lista ezen felül sok más adatszerkezet (verem, sor, fa, gráf) alapja.

## Összefoglalás

- A láncolt lista csomópontokból áll: **adat + mutató** a következőre (kétszeres láncolásnál az előzőre is).
- Beszúrás/törlés ismert helyen **O(1)**, viszont index szerinti elérés **O(n)**.
- Pythonban nincs beépített láncolt lista osztály; osztályokkal megírható, vagy használható a `collections.deque`.
