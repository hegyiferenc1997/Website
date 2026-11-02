---
title: Paraméterek és visszatérési értékek
summary: Formális és aktuális paraméter, alapértelmezett érték, kulcsszavas argumentum, több érték visszaadása.
minutes: 15
---

## Amit ebben a leckében megtanulsz

- mi a **formális** és az **aktuális** paraméter (argumentum),
- hogyan adsz meg **alapértelmezett** értéket,
- hogyan hívsz függvényt **kulcsszavas** argumentumokkal,
- hogyan adsz vissza **több értéket**.

## Formális és aktuális paraméter

```python run
def teglalap_terulet(a, b):    # a és b: formális paraméterek (a definícióban)
    return a * b

print(teglalap_terulet(3, 5))  # 3 és 5: aktuális paraméterek, azaz argumentumok (a hívásban)
```

- A **formális paraméter** egy név a függvény definíciójában.
- Az **aktuális paraméter (argumentum)** a hívásnál átadott érték.
- Híváskor az argumentumok **sorrendben** kötődnek a paraméterekhez.

Ha nem megfelelő számú argumentumot adsz át, `TypeError` keletkezik:

```python
teglalap_terulet(3)   # TypeError: missing 1 required positional argument: 'b'
```

## Alapértelmezett érték

```python run
def udvozles(nev, koszones="Szia"):
    return f"{koszones}, {nev}!"

print(udvozles("Anna"))                  # Szia, Anna!
print(udvozles("Béla", "Jó reggelt"))    # Jó reggelt, Béla!
```

Az alapértelmezett értékű paraméterek a lista **végén** állnak.

## Kulcsszavas argumentum

Híváskor megadhatod a paraméter nevét is – így a sorrend nem számít, és a hívás olvashatóbb:

```python run
def jelentkezes(nev, targy, felev=1):
    return f"{nev} – {targy} ({felev}. félév)"

print(jelentkezes("Anna", "Programozási alapok"))
print(jelentkezes(targy="Matematika", nev="Béla", felev=2))
print(jelentkezes("Csilla", "Fizika", felev=3))
```

## Visszatérési érték

A `return` bármilyen típusú értéket visszaadhat: számot, szöveget, listát, szótárat, akár másik függvényt is.

```python run
def statisztika(szamok):
    return {"min": min(szamok), "max": max(szamok), "átlag": sum(szamok) / len(szamok)}

print(statisztika([4, 8, 15, 16, 23, 42]))
```

## Több érték visszaadása

Pythonban vesszővel elválasztva több értéket is visszaadhatsz – valójában egy **tuple** jön vissza, amit szét is bonthatunk:

```python run
def osztas(a, b):
    return a // b, a % b      # hányados és maradék

h, m = osztas(17, 5)
print("hányados:", h, "maradék:", m)

# A beépített divmod ugyanezt tudja:
print(divmod(17, 5))
```

## Bemenet ellenőrzése

A jó függvény ellenőrzi a paramétereit, és egyértelműen jelzi a hibát:

```python run
def atlag(szamok):
    if len(szamok) == 0:
        raise ValueError("Üres listának nincs átlaga.")
    return sum(szamok) / len(szamok)

print(atlag([2, 4, 6]))
```

## Mi legyen paraméter?

- Amitől a függvény eredménye **függ**, azt add át paraméterként – ne olvass globális változót.
- Az eredményt **add vissza** (`return`), ne írd ki a függvényen belül, ha másutt számolni akarsz vele.

```python run
# Rossz: kiírja, de az eredménnyel nem lehet tovább számolni.
def rossz_osszeg(a, b):
    print(a + b)

# Jó: visszaadja, a hívó dönti el, mit kezd vele.
def jo_osszeg(a, b):
    return a + b

print(jo_osszeg(2, 3) * 10)   # 50
```

A paraméterek fajtáiról (`*args`, `**kwargs`) és arról, hogyan kerül az érték a függvénybe, a **Paraméterkiértékelés és paraméterátadás** témakörben lesz szó.

## Összefoglalás

- Formális paraméter: név a definícióban; aktuális paraméter (argumentum): érték a hívásban.
- Alapértelmezett érték: `def f(x, y=0)`; kulcsszavas hívás: `f(y=1, x=2)`.
- Több érték visszaadása: `return a, b` (tuple).
- A függvény adja vissza az eredményt, ne írja ki.
