---
title: Listák és függvények
summary: Lista létrehozása, indexelés, bejárás, gyakori műveletek; saját függvény paraméterrel és visszatérési értékkel.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- hogyan tárolsz több értéket egy **listában**, és hogyan éred el az elemeit,
- a leggyakoribb **listaműveleteket**,
- hogyan írsz **függvényt** paraméterrel és visszatérési értékkel.

## Lista

```python run
jegyek = [5, 3, 4, 5, 2]
print(jegyek[0], jegyek[-1])   # első és utolsó elem: 5 2
print(jegyek[1:3])             # szelet: [3, 4]
print(len(jegyek))             # hossz: 5
jegyek.append(4)               # hozzáfűzés a végére
jegyek[1] = 4                  # elem módosítása
print(jegyek)
```

Az indexelés **0-tól** indul; a negatív index hátulról számol.

| Művelet                      | Jelentés                 |
| ---------------------------- | ------------------------ |
| `len(l)`                     | elemszám                 |
| `l.append(x)`                | hozzáfűzés               |
| `l.remove(x)`                | az első `x` törlése      |
| `x in l`                     | benne van-e              |
| `sum(l)`, `min(l)`, `max(l)` | összeg, minimum, maximum |
| `sorted(l)`                  | rendezett másolat        |

```python run
jegyek = [5, 3, 4, 5, 2]
for j in jegyek:
    print("*" * j)
print("átlag:", sum(jegyek) / len(jegyek))
```

## Függvény

A **függvény** egy elnevezett, újrahasználható kódrészlet. A `def` vezeti be, a `return` adja vissza az eredményt.

```python run
def negyzet(x):
    return x * x

def koszont(nev, nyelv="hu"):   # alapértelmezett paraméter
    if nyelv == "en":
        return f"Hello, {nev}!"
    return f"Szia, {nev}!"

print(negyzet(7))
print(koszont("Anna"))
print(koszont("Anna", "en"))
```

Miért jó? A kódot **egyszer** írod meg, és sokszor használod; a program **részekre** bomlik, amelyeket külön lehet tesztelni.

## Összefoglalás

- Lista: `[a, b, c]`, index 0-tól, `len`, `append`, `in`, `sum`, `sorted`.
- Függvény: `def nev(param):` … `return eredmény`.
- A `print` kiír, a `return` visszaad – nem ugyanaz!

## A lecke feladata: átlag felett

Írd meg az `atlag_felett(szamok)` függvényt, amely visszaadja azoknak az elemeknek a **listáját** (eredeti sorrendben), amelyek **nagyobbak** a lista átlagánál. Például `atlag_felett([1, 2, 3, 4, 10])` eredménye `[10]` (az átlag 4).

```python starter required
def atlag_felett(szamok):
    atlag = sum(szamok) / len(szamok)
    eredmeny = []
    # menj végig a számokon, és fűzd hozzá azokat, amelyek nagyobbak az átlagnál
    return eredmeny


print(atlag_felett([1, 2, 3, 4, 10]))
```

<details>
<summary>Megoldás</summary>

```python solution
def atlag_felett(szamok):
    atlag = sum(szamok) / len(szamok)
    eredmeny = []
    for x in szamok:
        if x > atlag:
            eredmeny.append(x)
    return eredmeny


print(atlag_felett([1, 2, 3, 4, 10]))
```

</details>

```python test
assert atlag_felett([1, 2, 3, 4, 10]) == [10], "az átlag 4, csak a 10 nagyobb"
assert atlag_felett([5, 1, 9, 3]) == [5, 9], "az átlag 4.5"
assert atlag_felett([2, 2, 2]) == [], "senki nincs az átlag felett"
```
