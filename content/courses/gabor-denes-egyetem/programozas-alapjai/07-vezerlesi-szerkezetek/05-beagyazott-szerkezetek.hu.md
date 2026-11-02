---
title: Beágyazott szerkezetek és vezérlő utasítások
summary: Ciklus a ciklusban, elágazás a ciklusban, valamint a break, continue, pass és a ciklus else ága.
minutes: 18
---

## Amit ebben a leckében megtanulsz

- hogyan működnek az **egymásba ágyazott** ciklusok és elágazások,
- mit csinál a `break`, a `continue` és a `pass`,
- mire jó a ciklus `else` ága.

## Elágazás a ciklusban

A leggyakoribb kombináció: végigmegyünk az adatokon, és mindegyikről döntünk.

```python run
homersekletek = [12, 25, 31, 18, 33]
for t in homersekletek:
    if t > 30:
        print(t, "– hőség")
    elif t > 20:
        print(t, "– meleg")
    else:
        print(t, "– hűvös")
```

## Ciklus a ciklusban

A belső ciklus a külső ciklus **minden egyes körében teljesen lefut**. Ha a külső 3-szor, a belső 4-szer fut, a belső mag összesen 3 · 4 = 12-szer hajtódik végre.

```python run
# Szorzótábla 1-től 5-ig.
for sor in range(1, 6):
    for oszlop in range(1, 6):
        print(f"{sor * oszlop:4}", end="")
    print()   # a belső ciklus után új sor
```

```python run
# Háromszög csillagokból.
magassag = 4
for i in range(1, magassag + 1):
    print("*" * i)
```

## break – kilépés a ciklusból

A `break` **azonnal befejezi** a legbelső ciklust, amelyben áll.

```python run
szamok = [4, 8, 15, 16, 23, 42]
for szam in szamok:
    if szam > 10:
        print("Az első 10-nél nagyobb szám:", szam)
        break
```

## continue – ugrás a következő körre

A `continue` a mag hátralévő részét **átugorja**, és a következő körrel folytatja.

```python run
# Csak a páratlan számok kiírása.
for i in range(10):
    if i % 2 == 0:
        continue
    print(i, end=" ")
print()
```

## pass – „üres” utasítás

A `pass` nem csinál semmit. Akkor használjuk, ha a szintaxis megkövetel egy utasítást, de még nincs mit írni (pl. vázlat készítésekor).

```python run
for i in range(3):
    pass   # TODO: később ide jön a feldolgozás

def majd_megirom():
    pass

print("A program szintaktikailag helyes.")
```

## A ciklus else ága

Pythonban a ciklusnak lehet `else` ága: akkor fut le, ha a ciklus **break nélkül** ért véget. Keresésnél kényelmes:

```python run
def keres(lista, keresett):
    for elem in lista:
        if elem == keresett:
            print("Megvan:", elem)
            break
    else:
        print("Nincs a listában:", keresett)

keres([3, 5, 7], 5)
keres([3, 5, 7], 4)
```

## break beágyazott ciklusban

A `break` csak a **legbelső** ciklusból lép ki. Több szintből kilépni egy jelző változóval vagy függvénnyel (és `return`-nel) lehet.

```python run
matrix = [[1, 2, 3], [4, 99, 6], [7, 8, 9]]

def hol_van(matrix, keresett):
    for i, sor in enumerate(matrix):
        for j, ertek in enumerate(sor):
            if ertek == keresett:
                return (i, j)   # a return mindkét ciklusból kilép
    return None

print(hol_van(matrix, 99))   # (1, 1)
print(hol_van(matrix, 5))    # None
```

## Strukturált programozás és a goto

Régi nyelvekben a `goto` utasítással a program bármely pontjára lehetett ugrani, ami átláthatatlan „spagettikódot” eredményezett. A **strukturált programozás** (Dijkstra, 1968: *„Go To Statement Considered Harmful”*) óta csak szekvenciát, elágazást és ciklust használunk, a `break`/`continue`/`return` pedig ezek ellenőrzött kiegészítői. Pythonban nincs `goto`.

## Összefoglalás

- Beágyazott ciklusnál a belső ciklus a külső minden körében teljesen lefut.
- `break` – kilépés a legbelső ciklusból; `continue` – a következő körre ugrás; `pass` – üres utasítás.
- A ciklus `else` ága akkor fut, ha nem volt `break`.
- Több szintből `return`-nel lépj ki egy függvényből.
