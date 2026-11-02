---
title: Függvények és eljárások fogalma
summary: Miért bontjuk a programot alprogramokra, mi a különbség a függvény és az eljárás között, és hogyan definiálunk függvényt Pythonban.
minutes: 15
---

## Amit ebben a leckében megtanulsz

- mi az **alprogram**, és miért hasznos,
- mi a különbség a **függvény** és az **eljárás** között,
- hogyan **definiálsz** és **hívsz meg** egy függvényt Pythonban.

## Miért kellenek alprogramok?

Az **alprogram** egy elnevezett kódrészlet, amely egy jól körülhatárolt feladatot old meg, és a program bármely pontjáról **meghívható**. Előnyei:

- **Újrafelhasználás:** egyszer írod meg, sokszor használod (DRY – _Don't Repeat Yourself_).
- **Áttekinthetőség:** a nagy feladat beszédes nevű kis részekre bomlik.
- **Tesztelhetőség:** minden rész külön kipróbálható.
- **Absztrakció:** a hívónak elég tudnia, _mit_ csinál, nem kell tudnia, _hogyan_.

## Függvény és eljárás

|                    | Függvény                                | Eljárás                                     |
| ------------------ | --------------------------------------- | ------------------------------------------- |
| mit csinál         | kiszámol egy értéket, és **visszaadja** | **végrehajt** valamit (kiír, módosít, ment) |
| visszatérési érték | van                                     | nincs                                       |
| hívás helye        | kifejezésben: `y = negyzet(3)`          | önálló utasításként: `udvozol("Anna")`      |
| példa más nyelvben | Pascal `function`, C `int f()`          | Pascal `procedure`, C `void f()`            |

Pythonban minden alprogram `def`-fel készül. Az „eljárás” egyszerűen olyan függvény, amely nem ad vissza semmit – valójában ilyenkor is visszaad egy értéket: `None`-t.

## Függvény definiálása és hívása

```python run
# Definíció: def név(paraméterek):
def negyzet(x):
    return x * x            # a return visszaadja az eredményt

# Hívás: a név után zárójelben az argumentumok.
eredmeny = negyzet(7)
print(eredmeny)             # 49
print(negyzet(3) + negyzet(4))   # 25 – kifejezésben is használható
```

## Eljárás

```python run
def udvozol(nev):
    print(f"Szia, {nev}! Jó tanulást!")

udvozol("Anna")
udvozol("Béla")

valasz = udvozol("Csilla")
print(valasz)   # None – az eljárás „értéke”
```

## Mi történik híváskor?

1. A program megjegyzi, hol tartott (**visszatérési cím**).
2. Az argumentumok értéke a paraméterekhez kötődik.
3. Lefut a függvény törzse.
4. A `return` (vagy a törzs vége) után a végrehajtás visszatér a hívás helyére, és a függvényhívás helyére a visszaadott érték kerül.

```python run
def duplaz(x):
    print("  → duplaz eleje, x =", x)
    eredmeny = 2 * x
    print("  ← duplaz vége, visszaadom:", eredmeny)
    return eredmeny

print("előtte")
y = duplaz(5) + 1
print("utána, y =", y)
```

## A return megállítja a függvényt

A `return` után a függvény **azonnal befejeződik**; az utána álló sorok nem futnak le. Egy függvényben több `return` is lehet:

```python run
def elojel(x):
    if x > 0:
        return "pozitív"
    if x < 0:
        return "negatív"
    return "nulla"

print(elojel(5), elojel(-2), elojel(0))
```

## Definiálás a használat előtt

A függvényt **előbb definiálni kell**, mint ahogy meghívjuk – különben `NameError`. Ezért a függvények általában a fájl elején, a főprogram előtt állnak.

```python run
def terulet(a, b):
    return a * b

def kerulet(a, b):
    return 2 * (a + b)

# Főprogram
print(terulet(3, 4), kerulet(3, 4))
```

## Összefoglalás

- Az alprogram elnevezett, többször hívható kódrészlet; javítja az áttekinthetőséget és az újrafelhasználást.
- A **függvény** értéket ad vissza (`return`), az **eljárás** csak végrehajt valamit (Pythonban `None`-t ad).
- A `return` azonnal befejezi a függvényt.
