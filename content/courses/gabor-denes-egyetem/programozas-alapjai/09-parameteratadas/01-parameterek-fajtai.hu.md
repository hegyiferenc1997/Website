---
title: A paraméterek fajtái
summary: Pozicionális és kulcsszavas paraméterek, alapértelmezett értékek, *args és **kwargs, csak kulcsszavas paraméterek.
minutes: 15
---

## Amit ebben a leckében megtanulsz

- a **pozicionális** és **kulcsszavas** paraméterátadást,
- a **változó számú** paramétereket (`*args`, `**kwargs`),
- a **kicsomagolást** híváskor (`*lista`, `**szotar`),
- a csak kulcsszavas és csak pozicionális paramétereket.

## Pozicionális és kulcsszavas

```python run
def bemutatkozik(nev, kor, varos):
    return f"{nev}, {kor} éves, {varos}"

print(bemutatkozik("Anna", 20, "Budapest"))                 # pozicionális: sorrend számít
print(bemutatkozik(varos="Győr", nev="Béla", kor=22))       # kulcsszavas: név szerint
print(bemutatkozik("Csilla", varos="Pécs", kor=19))         # vegyes: előbb a pozicionálisak
```

## Változó számú pozicionális paraméter: *args

A `*` előtagú paraméter **tetszőleges számú** pozicionális argumentumot gyűjt össze egy **tuple**-be.

```python run
def osszeg(*szamok):
    print("kapott tuple:", szamok)
    eredmeny = 0
    for x in szamok:
        eredmeny += x
    return eredmeny

print(osszeg())
print(osszeg(5))
print(osszeg(1, 2, 3, 4))
```

Így működik a `print()` is: bármennyi értéket kaphat.

## Változó számú kulcsszavas paraméter: **kwargs

A `**` előtagú paraméter a fölösleges kulcsszavas argumentumokat egy **szótárba** gyűjti.

```python run
def profil(nev, **adatok):
    print("Név:", nev)
    for kulcs, ertek in adatok.items():
        print(f"  {kulcs}: {ertek}")

profil("Anna", szak="mérnökinformatikus", felev=1, varos="Budapest")
```

## A sorrend szabálya

```text
def f(pozicionális, alapértelmezett=0, *args, csak_kulcsszavas, **kwargs)
```

```python run
def teljes(a, b=2, *args, c, **kwargs):
    print(a, b, args, c, kwargs)

teljes(1, c=3)
teljes(1, 5, 6, 7, c=3, d=4)
```

## Csak kulcsszavas paraméter

A `*` utáni paramétereket **csak névvel** lehet megadni. Ez akkor hasznos, ha egy argumentum jelentése név nélkül nem lenne egyértelmű:

```python run
def ment(fajlnev, *, felulir=False):
    return f"{fajlnev} mentése (felülírás: {felulir})"

print(ment("adat.txt", felulir=True))
# ment("adat.txt", True)  → TypeError: a felulir csak névvel adható meg
```

A `/` előtti paraméterek pedig **csak pozicionálisan** adhatók meg (pl. `def f(x, /)`); így működik sok beépített függvény, pl. a `len`.

## Kicsomagolás híváskor

A `*` és `**` híváskor fordítva működik: egy listát vagy szótárat **szétbont** argumentumokra.

```python run
def terfogat(a, b, c):
    return a * b * c

meretek = [2, 3, 4]
print(terfogat(*meretek))          # ugyanaz, mint terfogat(2, 3, 4)

adatok = {"a": 1, "b": 5, "c": 10}
print(terfogat(**adatok))          # terfogat(a=1, b=5, c=10)
```

## Összefoglalás

| Jelölés                    | Jelentés                                    |
| -------------------------- | ------------------------------------------- |
| `def f(a, b)`              | pozicionális (vagy kulcsszavas) paraméterek |
| `def f(a, b=0)`            | alapértelmezett érték                       |
| `def f(*args)`             | tetszőleges számú pozicionális → tuple      |
| `def f(**kwargs)`          | tetszőleges számú kulcsszavas → szótár      |
| `def f(*, x)`              | csak kulcsszavas paraméter                  |
| `def f(x, /)`              | csak pozicionális paraméter                 |
| `f(*lista)`, `f(**szotar)` | kicsomagolás híváskor                       |

## A lecke feladata: Átlag tetszőleges számú paraméterrel

Írj `atlag(*szamok, kerekites=2)` függvényt:

- tetszőleges számú pozicionális számot fogad (`*szamok`),
- az átlagukat `kerekites` tizedesjegyre kerekítve adja vissza,
- a `kerekites` **csak kulcsszavasan** adható meg (mert a `*szamok` után áll),
- ha nem kapott egyetlen számot sem, `None`-t ad vissza.

Egy listát kicsomagolva is át lehet adni: `atlag(*[1, 2, 3])`.

```python starter required
def atlag(*szamok, kerekites=2):
    # a szamok egy tuple
    pass


print(atlag(1, 2, 2))                 # 1.67
print(atlag(1, 2, 2, kerekites=0))    # 2.0
```

<details>
<summary>Megoldás</summary>

```python solution
def atlag(*szamok, kerekites=2):
    if not szamok:
        return None
    return round(sum(szamok) / len(szamok), kerekites)


print(atlag(1, 2, 2))                 # 1.67
print(atlag(1, 2, 2, kerekites=0))    # 2.0
```

</details>

```python test
assert atlag(1, 2, 2) == 1.67, "atlag(1, 2, 2) → 1.67"
assert atlag(1, 2, 2, kerekites=0) == 2.0, "kerekites=0 esetén 2.0"
assert atlag(10) == 10, "Egyetlen szám átlaga önmaga."
assert atlag() is None, "Paraméter nélkül None."
assert atlag(*[4, 5, 6]) == 5, "Kicsomagolt listával is működjön."
assert atlag(1, 2, 3, 4) == 2.5, "A kerekites ne nyeljen el pozicionális számot (1, 2, 3, 4 → 2.5)."
```
