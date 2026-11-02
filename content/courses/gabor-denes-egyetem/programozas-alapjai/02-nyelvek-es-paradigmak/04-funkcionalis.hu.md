---
title: Funkcionális programozás
summary: Tiszta függvények, megváltoztathatatlan adatok, magasabb rendű függvények, lambda, map és filter.
minutes: 15
---

## Amit ebben a leckében megtanulsz

- mi a **tiszta függvény**, és miért jó,
- mit jelent, hogy a függvény **„első osztályú állampolgár”**,
- hogyan használod a `lambda`, `map`, `filter`, `sorted` eszközöket.

## Alapgondolat

A **funkcionális programozásban** a program függvények egymásba ágyazásából áll. A fő elvek:

- **Tiszta függvények:** ugyanarra a bemenetre mindig ugyanazt adják, és nincs mellékhatásuk.
- **Megváltoztathatatlan (immutable) adatok:** meglévő adat módosítása helyett újat hozunk létre.
- **A függvény is érték:** átadható paraméterként, visszaadható, változóban tárolható.

## Tiszta és nem tiszta függvény

```python run
# Tiszta függvény: csak a paramétereitől függ, semmit nem módosít.
def negyzet(x):
    return x * x

# Nem tiszta: egy külső változót módosít (mellékhatás).
szamlalo = 0
def novel():
    global szamlalo
    szamlalo += 1
    return szamlalo

print(negyzet(4), negyzet(4))   # mindig 16 16
print(novel(), novel())         # 1 2 – ugyanaz a hívás, más eredmény
```

A tiszta függvény könnyen tesztelhető és biztonságosan újrahasznosítható.

## A függvény mint érték

```python run
def duplaz(x):
    return 2 * x

def alkalmaz(fuggveny, ertek):
    # Magasabb rendű függvény: függvényt kap paraméterként.
    return fuggveny(ertek)

print(alkalmaz(duplaz, 21))   # 42
```

## Lambda – névtelen függvény

Rövid, egysoros függvényekhez a `lambda` kulcsszót használjuk:

```python run
duplaz = lambda x: 2 * x
print(duplaz(5))   # 10
```

## map, filter, sorted

```python run
szamok = [1, 2, 3, 4, 5, 6]

# map: minden elemre alkalmaz egy függvényt.
negyzetek = list(map(lambda x: x * x, szamok))
print(negyzetek)            # [1, 4, 9, 16, 25, 36]

# filter: csak a feltételnek megfelelő elemeket tartja meg.
parosak = list(filter(lambda x: x % 2 == 0, szamok))
print(parosak)              # [2, 4, 6]

# sorted key paraméterrel: a rendezés szempontja egy függvény.
nevek = ["Zoltán", "Éva", "Bence"]
print(sorted(nevek, key=len))   # hossz szerint: ['Éva', 'Bence', 'Zoltán']
```

> Pythonban a `map` és `filter` helyett gyakran olvashatóbb a **listaértelmezés**: `[x * x for x in szamok]` vagy `[x for x in szamok if x % 2 == 0]`.

## Funkcionális elemek más nyelvekben

A tisztán funkcionális nyelvek (Haskell, Elm) mellett ma szinte minden nyelv átvett funkcionális elemeket: Java Stream API és lambdák, C# LINQ, JavaScript `map`/`filter`/`reduce`.

## Összefoglalás

- A funkcionális stílus **tiszta függvényekre** és **megváltoztathatatlan adatokra** épít.
- A függvény érték: átadható, visszaadható (**magasabb rendű függvények**).
- Python eszközök: `lambda`, `map`, `filter`, `sorted(key=…)`, listaértelmezés.

## A lecke feladata: Tiszta függvény map-pel, filterrel, sorted-del

Írj **tiszta** `feldolgoz(szamok)` függvényt, amely:

1. kiszűri a pozitív számokat (`filter`),
2. mindegyiket négyzetre emeli (`map`),
3. csökkenő sorrendbe rendezi (`sorted`),

és az eredményt új listában adja vissza. Használj `lambda` függvényeket! A bemeneti lista nem változhat meg, és ugyanarra a bemenetre mindig ugyanazt kell adnia.

```python starter required
def feldolgoz(szamok):
    # pozitivak = filter(lambda x: ..., szamok)
    # negyzetek = map(lambda x: ..., pozitivak)
    # return sorted(..., reverse=True)
    pass


print(feldolgoz([3, -1, 2, 0, -5, 4]))   # [16, 9, 4]
```

<details>
<summary>Megoldás</summary>

```python solution
def feldolgoz(szamok):
    pozitivak = filter(lambda x: x > 0, szamok)
    negyzetek = map(lambda x: x * x, pozitivak)
    return sorted(negyzetek, reverse=True)


print(feldolgoz([3, -1, 2, 0, -5, 4]))   # [16, 9, 4]
```

</details>

```python test
adat = [3, -1, 2, 0, -5, 4]
assert feldolgoz(adat) == [16, 9, 4], "feldolgoz([3, -1, 2, 0, -5, 4]) → [16, 9, 4]"
assert feldolgoz(adat) == [16, 9, 4], "Másodszorra is ugyanazt kell adnia (tiszta függvény)."
assert adat == [3, -1, 2, 0, -5, 4], "A bemeneti lista nem változhat meg."
assert feldolgoz([]) == [], "Üres listára üres lista."
assert isinstance(feldolgoz([1]), list), "Listát adj vissza (a sorted() listát ad)."
```
