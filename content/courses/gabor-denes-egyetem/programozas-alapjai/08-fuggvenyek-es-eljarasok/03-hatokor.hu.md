---
title: Változók hatóköre és élettartama
summary: Lokális és globális változók, a LEGB szabály, a global kulcsszó, és miért kerüljük a globális állapotot.
minutes: 12
---

## Amit ebben a leckében megtanulsz

- mi a **hatókör** (scope) és az **élettartam**,
- mi a különbség a **lokális** és a **globális** változó között,
- hogyan keresi meg a Python a neveket (**LEGB** szabály),
- miért érdemes kerülni a `global` kulcsszót.

## Lokális változó

A függvényen belül létrehozott változó **lokális**: csak a függvényen belül létezik, és a függvény befejezésekor megszűnik.

```python run
def fuggveny():
    uzenet = "belül vagyok"   # lokális változó
    print(uzenet)

fuggveny()
# print(uzenet)  → NameError: a függvényen kívül nem létezik
```

Ugyanaz a név különböző függvényekben különböző változót jelent – ezért nem zavarják egymást.

## Globális változó

A függvényeken kívül, a modul szintjén létrehozott változó **globális**: a függvények **olvashatják**.

```python run
AFA = 0.27   # globális (konstans)

def brutto(netto):
    return netto * (1 + AFA)   # olvasni lehet

print(brutto(1000))
```

## Árnyékolás

Ha a függvényben értéket adsz egy globális névvel azonos nevű változónak, az egy **új, lokális** változó lesz, ami eltakarja („árnyékolja”) a globálisat:

```python run
x = 10

def f():
    x = 99          # új lokális x, a globális nem változik
    print("belül:", x)

f()
print("kívül:", x)  # 10
```

## A global kulcsszó

Ha egy függvénynek **módosítania** kell a globális változót, a `global` kulcsszóval jelezni kell:

```python run
szamlalo = 0

def novel():
    global szamlalo
    szamlalo += 1

novel()
novel()
print(szamlalo)   # 2
```

> **Kerüld a `global`-t!** A globális változót módosító függvény nehezen tesztelhető, és bárhol a programban megváltozhat az érték. Jobb, ha a függvény paramétert kap és értéket ad vissza:

```python run
def novel(szamlalo):
    return szamlalo + 1

sz = 0
sz = novel(sz)
sz = novel(sz)
print(sz)   # 2
```

## A LEGB szabály

Amikor a Python egy nevet keres, ebben a sorrendben néz körül:

1. **L**ocal – a függvény saját változói,
2. **E**nclosing – a befoglaló (külső) függvény változói,
3. **G**lobal – a modul szintű változók,
4. **B**uilt-in – a beépített nevek (`print`, `len`, `sum` …).

```python run
x = "globális"

def kulso():
    x = "befoglaló"
    def belso():
        print(x)        # nincs lokális x → a befoglaló függvényé
    belso()

kulso()
print(len("abc"))       # a len a beépített (Built-in) névtérből jön
```

> Ne nevezz el változót beépített függvényről (`list`, `sum`, `max`, `input`)! Ha `sum = 0`-t írsz, utána a `sum()` függvény nem lesz elérhető.

## Élettartam

- A lokális változó a függvényhívás **kezdetén jön létre**, és a **végén megszűnik**. Minden hívás új változókat kap.
- A globális változó a program **teljes futása alatt** él.

## Összefoglalás

- **Lokális**: függvényen belül, csak ott látszik, a hívás végén megszűnik.
- **Globális**: modul szintű, a függvények olvashatják; módosításhoz `global` kell – de inkább kerüld.
- Névkeresés: **L → E → G → B**.
