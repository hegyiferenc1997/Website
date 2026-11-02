---
title: Ciklusok – for
summary: Számlálós ciklus a range() függvénnyel, bejárás listán és szövegen, enumerate és zip.
minutes: 15
---

## Amit ebben a leckében megtanulsz

- hogyan használod a `for` ciklust **számlálós** ciklusként a `range()`-dzsel,
- hogyan **járod be** egy lista vagy szöveg elemeit,
- mire jó az `enumerate()` és a `zip()`,
- miben különbözik a Python `for`-ja a C/Java `for`-jától.

## Számlálós ciklus: range()

Ha **tudjuk előre**, hányszor kell ismételni, a `for` ciklus a legkényelmesebb.

```python run
for i in range(5):          # 0, 1, 2, 3, 4 – a 5 már nincs benne!
    print(i, end=" ")
print()

for i in range(1, 6):       # 1-től 5-ig
    print(i, end=" ")
print()

for i in range(0, 20, 5):   # lépésköz: 0, 5, 10, 15
    print(i, end=" ")
print()

for i in range(10, 0, -3):  # visszafelé: 10, 7, 4, 1
    print(i, end=" ")
print()
```

| Hívás | Értékek |
| --- | --- |
| `range(n)` | 0, 1, …, n−1 |
| `range(a, b)` | a, a+1, …, b−1 |
| `range(a, b, lepes)` | a, a+lepes, … (b-ig, b nélkül) |

## Bejáró ciklus (for-each)

A Python `for`-ja valójában **bejáró** ciklus: egy gyűjtemény elemein megy végig egyesével.

```python run
gyumolcsok = ["alma", "körte", "szilva"]
for gyumolcs in gyumolcsok:
    print(gyumolcs.upper())

for betu in "Szia":
    print(betu, end="-")
print()
```

## Index és elem együtt: enumerate()

```python run
nevek = ["Anna", "Béla", "Csilla"]
for sorszam, nev in enumerate(nevek, start=1):
    print(f"{sorszam}. {nev}")
```

## Több lista párhuzamosan: zip()

```python run
nevek = ["Anna", "Béla", "Csilla"]
pontok = [87, 64, 92]
for nev, pont in zip(nevek, pontok):
    print(f"{nev}: {pont} pont")
```

## Összegzés for ciklussal

```python run
# Az 1-től 100-ig terjedő számok összege.
osszeg = 0
for i in range(1, 101):
    osszeg += i
print(osszeg)   # 5050

# Ugyanez beépített függvénnyel:
print(sum(range(1, 101)))
```

## for más nyelvekben

C-ben, Javában a `for` három részből áll: kezdőérték, feltétel, léptetés.

```java
for (int i = 0; i < 5; i++) {
    System.out.println(i);
}
```

Ez lényegében egy tömörebben leírt `while` ciklus. A Python `for i in range(5):` sora ugyanezt csinálja. Javában és C#-ban is van bejáró ciklus: `for (String s : lista)`, illetve `foreach (var s in lista)`.

## while vagy for?

| Használj `for`-t, ha … | Használj `while`-t, ha … |
| --- | --- |
| ismert az ismétlések száma | nem tudod előre, hányszor kell |
| egy gyűjtemény elemein mész végig | egy feltétel teljesüléséig ismételsz |

> **Ne módosítsd** azt a listát, amin éppen végigmész (ne törölj belőle, ne adj hozzá) – ez kiszámíthatatlan eredményt ad. Inkább készíts új listát.

## Összefoglalás

- `for i in range(a, b, lepes)` – számlálós ciklus; a felső határ nincs benne.
- `for elem in gyujtemeny` – bejárás; `enumerate()` indexet is ad, `zip()` párosít.
- A Python `for`-ja bejáró ciklus; a C/Java `for` egy tömör `while`.
