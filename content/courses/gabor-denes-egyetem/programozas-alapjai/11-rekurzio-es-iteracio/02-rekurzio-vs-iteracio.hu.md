---
title: Rekurzió vagy iteráció?
summary: Ugyanaz a feladat kétféleképpen, a naiv Fibonacci csapdája, memoizáció, és szempontok a választáshoz.
minutes: 18
---

## Amit ebben a leckében megtanulsz

- hogyan írsz át rekurziót **iterációra** (ciklusra) és vissza,
- miért **lassú** a naiv rekurzív Fibonacci,
- mi a **memoizáció**,
- mikor melyiket válaszd.

## Minden rekurzió átírható iterációvá

Bármely rekurzív algoritmus megírható ciklussal (szükség esetén egy saját verem segítségével), és fordítva.

```python run
def faktorialis_rekurziv(n):
    if n == 0:
        return 1
    return n * faktorialis_rekurziv(n - 1)

def faktorialis_iterativ(n):
    eredmeny = 1
    for i in range(2, n + 1):
        eredmeny *= i
    return eredmeny

print(faktorialis_rekurziv(10), faktorialis_iterativ(10))
```

## A Fibonacci-csapda

A Fibonacci-sorozat: 0, 1, 1, 2, 3, 5, 8, 13, … – minden elem az előző kettő összege. A definíció rekurzív, és a közvetlen átírás működik is:

```python run
def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

print([fib(i) for i in range(10)])
```

De nagyon **lassú**, mert ugyanazokat az értékeket újra és újra kiszámolja:

```text
                     fib(5)
                /             \
           fib(4)              fib(3)
          /      \            /      \
      fib(3)    fib(2)    fib(2)    fib(1)
      /    \     /   \     /   \
  fib(2) fib(1) ...  ...  ...  ...
```

A hívások száma exponenciálisan nő (kb. 1,6ⁿ):

```python run
hivasok = 0

def fib_szamlal(n):
    global hivasok
    hivasok += 1
    if n < 2:
        return n
    return fib_szamlal(n - 1) + fib_szamlal(n - 2)

for n in [10, 20, 25]:
    hivasok = 0
    fib_szamlal(n)
    print(f"fib({n}): {hivasok} hívás")
```

## Megoldás 1: iteráció

```python run
def fib_iterativ(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a

print(fib_iterativ(100))   # azonnal, n lépésben
```

## Megoldás 2: memoizáció

A **memoizáció** azt jelenti, hogy a már kiszámolt eredményeket eltároljuk, és újrahasznosítjuk. Így a rekurzív kód megmarad, de minden értéket csak egyszer számolunk ki.

```python run
def fib_memo(n, tar=None):
    if tar is None:
        tar = {}
    if n < 2:
        return n
    if n not in tar:
        tar[n] = fib_memo(n - 1, tar) + fib_memo(n - 2, tar)
    return tar[n]

print(fib_memo(100))

# A Python beépített eszköze ugyanerre:
from functools import cache

@cache
def fib_cache(n):
    return n if n < 2 else fib_cache(n - 1) + fib_cache(n - 2)

print(fib_cache(100))
```

Ez a gondolat – részproblémák eredményeinek tárolása – a **dinamikus programozás** alapja.

## Mikor melyiket?

| Szempont     | Rekurzió                                                                               | Iteráció                                     |
| ------------ | -------------------------------------------------------------------------------------- | -------------------------------------------- |
| olvashatóság | természetes rekurzív szerkezetű feladatoknál (fák, oszd meg és uralkodj) nagyon tiszta | egyszerű sorozatoknál, számlálásnál tisztább |
| memória      | minden hívás veremkeretet foglal                                                       | állandó memória                              |
| sebesség     | a hívások költsége miatt általában lassabb                                             | általában gyorsabb                           |
| korlát       | rekurziós mélység (Pythonban kb. 1000)                                                 | nincs                                        |

**Ökölszabály:**

- Ha a feladat **természeténél fogva rekurzív** (fa bejárása, mappaszerkezet, oszd meg és uralkodj, Hanoi tornyai), a rekurzió egyszerűbb és kevésbé hibalehetőséges.
- Ha **lineáris** (egy lista végigjárása, számlálás, összegzés), használj **ciklust**.
- Ha a rekurzió **ugyanazokat a részfeladatokat** számolja újra, használj **memoizációt** vagy iterációt.

> Néhány nyelv (pl. Scheme, Haskell) a **farokrekurziót** (amikor a rekurzív hívás az utolsó lépés) automatikusan ciklussá alakítja, így nincs mélységi korlát. A Python ezt szándékosan **nem** teszi meg.

## Összefoglalás

- Minden rekurzió átírható ciklussá és fordítva.
- A naiv rekurzív Fibonacci exponenciális; iterációval vagy **memoizációval** (`@cache`) lineáris.
- Rekurzív szerkezetű feladathoz rekurzió, lineárishoz ciklus.

## A lecke feladata: Lépcsőmászás memoizációval

Egy `n` fokú lépcsőn egyszerre 1 vagy 2 fokot léphetsz. Hányféleképpen juthatsz fel? Írj `lepcso(n)` függvényt!

- 0 fokra 1 mód van (nem lépsz semmit), 1 fokra szintén 1.
- `n` fokra: az utolsó lépés 1 vagy 2 fok volt, tehát `lepcso(n - 1) + lepcso(n - 2)`.

A naiv rekurzió – mint a Fibonacci-csapdánál – exponenciálisan lassú. Használj **memoizációt** (szótárban tárold a már kiszámolt értékeket) vagy **iterációt**: az ellenőrzés `lepcso(300)`-at is kér!

```python starter required
def lepcso(n):
    pass


print(lepcso(4))   # 5
```

<details>
<summary>Megoldás</summary>

```python solution
emlek = {0: 1, 1: 1}


def lepcso(n):
    if n not in emlek:
        emlek[n] = lepcso(n - 1) + lepcso(n - 2)
    return emlek[n]


print(lepcso(4))   # 5
```

</details>

```python test
assert lepcso(4) == 5, "4 fokra 5 mód van: 1111, 112, 121, 211, 22."
assert lepcso(0) == 1 and lepcso(1) == 1, "0 és 1 fokra 1 mód."
assert lepcso(10) == 89, "10 fokra 89 mód."
assert lepcso(300) == 359579325206583560961765665172189099052367214309267232255589801, "lepcso(300) nem stimmel – memoizálj!"
```
