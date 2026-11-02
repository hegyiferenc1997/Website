---
title: Programozási tételek
summary: Az alapalgoritmusok, amelyekből a legtöbb feladat felépül: összegzés, megszámlálás, maximumkeresés, eldöntés, kiválasztás, keresés, kiválogatás.
minutes: 25
---

## Amit ebben a leckében megtanulsz

A **programozási tételek** olyan bevált algoritmus-sablonok, amelyekkel a feladatok nagy része megoldható. Ha felismered, melyik tétel illik a feladatra, a megoldás szinte magától megíródik. Minden tételnél megadjuk a sablont és a Python beépített rövidítését is.

| Tétel              | Kérdés                             | Eredmény           |
| ------------------ | ---------------------------------- | ------------------ |
| összegzés          | mennyi az elemek összege?          | egy érték          |
| megszámlálás       | hány elem felel meg a feltételnek? | egy szám           |
| maximumkiválasztás | melyik a legnagyobb?               | elem / index       |
| eldöntés           | van-e feltételnek megfelelő elem?  | igaz / hamis       |
| kiválasztás        | hol van az (biztosan létező) elem? | index              |
| lineáris keresés   | van-e, és ha igen, hol?            | index vagy „nincs” |
| kiválogatás        | melyek felelnek meg a feltételnek? | új lista           |

## 1. Összegzés

```python run
def osszegzes(lista):
    osszeg = 0                 # kezdőérték: a művelet semleges eleme
    for x in lista:
        osszeg += x
    return osszeg

jegyek = [5, 3, 4, 5, 2]
print(osszegzes(jegyek), sum(jegyek))
```

Szorzatnál a kezdőérték 1, szövegek összefűzésénél `""`.

## 2. Megszámlálás

```python run
def megszamlalas(lista):
    db = 0
    for x in lista:
        if x >= 4:             # a feltétel
            db += 1
    return db

jegyek = [5, 3, 4, 5, 2]
print(megszamlalas(jegyek))                 # 3
print(sum(1 for x in jegyek if x >= 4))     # rövidebben
```

## 3. Maximumkiválasztás

```python run
def max_index(lista):
    # Feltételezzük, hogy a lista nem üres.
    legjobb = 0                       # az eddigi legnagyobb indexe
    for i in range(1, len(lista)):
        if lista[i] > lista[legjobb]:
            legjobb = i
    return legjobb

pontok = [64, 87, 92, 71]
i = max_index(pontok)
print(i, pontok[i])                   # 2 92
print(max(pontok), pontok.index(max(pontok)))
```

> Ha a kezdőértéket `0`-nak választanád érték szerint, negatív számoknál hibás lenne. Ezért indulunk az **első elemből**.

## 4. Eldöntés

Van-e a feltételnek megfelelő elem? Amint találunk egyet, megállhatunk.

```python run
def van_bukas(jegyek):
    i = 0
    while i < len(jegyek) and not (jegyek[i] == 1):
        i += 1
    return i < len(jegyek)

print(van_bukas([5, 3, 4]), van_bukas([5, 1, 4]))
print(any(j == 1 for j in [5, 1, 4]))   # beépítve: any(); „mindegyik”: all()
```

## 5. Kiválasztás

Tudjuk, hogy van megfelelő elem – az indexére vagyunk kíváncsiak.

```python run
def kivalasztas(lista):
    i = 0
    while not (lista[i] % 7 == 0):    # nem kell az i < len feltétel: biztosan van ilyen
        i += 1
    return i

print(kivalasztas([3, 10, 14, 21]))   # 2
```

## 6. Lineáris keresés

Az eldöntés és a kiválasztás összevonása: van-e, és ha van, hol?

```python run
def kereses(lista, keresett):
    for i, x in enumerate(lista):
        if x == keresett:
            return i
    return -1                          # megállapodás: -1 jelenti, hogy nincs

nevek = ["Anna", "Béla", "Csilla"]
print(kereses(nevek, "Béla"), kereses(nevek, "Dóra"))
```

## 7. Kiválogatás

A feltételnek megfelelő elemeket egy új listába gyűjtjük.

```python run
def kivalogatas(lista):
    eredmeny = []
    for x in lista:
        if x % 2 == 0:
            eredmeny.append(x)
    return eredmeny

szamok = [3, 8, 11, 14, 20]
print(kivalogatas(szamok))
print([x for x in szamok if x % 2 == 0])   # listaértelmezéssel
```

## Tételek kombinálása

Valódi feladatoknál a tételeket kombináljuk. Például: _„Mennyi a 4-es vagy jobb jegyek átlaga?”_ = kiválogatás + összegzés + megszámlálás.

```python run
jegyek = [5, 3, 4, 5, 2, 4]
jo_jegyek = [j for j in jegyek if j >= 4]          # kiválogatás
if jo_jegyek:                                       # eldöntés: van-e egyáltalán
    print(sum(jo_jegyek) / len(jo_jegyek))          # összegzés / megszámlálás
```

## Összefoglalás

- A programozási tételek kész sablonok: **összegzés, megszámlálás, maximumkiválasztás, eldöntés, kiválasztás, keresés, kiválogatás**.
- Pythonban sokuknak van beépített megfelelője: `sum`, `max`, `any`, `all`, `index`, listaértelmezés – de a vizsgán és más nyelvekben a sablont kell tudni.
- A feladatot próbáld meg tételekre bontani.

## A lecke feladata: Időjárás-elemzés a programozási tételekkel

Egy hónap napi középhőmérsékletei adottak egy listában. Írj `elemzes(homersekletek)` függvényt, amely egy ötelemű tuple-t ad vissza – mindegyik egy-egy programozási tétel:

1. **összegzés**: az átlaghőmérséklet egy tizedesre kerekítve,
2. **maximumkiválasztás**: a legmelegebb nap **sorszáma** (1-től számolva; egyenlőségnél az első),
3. **eldöntés**: volt-e fagyos nap (0 °C alatti) – `True`/`False`,
4. **megszámlálás**: hány nyári nap volt (legalább 25 °C),
5. **keresés**: az első fagyos nap sorszáma (1-től), vagy `None`, ha nem volt.

A tételeket ciklusokkal írd meg (a `max()` és `sum()` most nem ér!). A lista nem üres.

```python starter required
def elemzes(homersekletek):
    # 1. összegzés  2. maximumkiválasztás  3. eldöntés  4. megszámlálás  5. keresés
    pass


print(elemzes([3, -2, 7, 26, 25, -1]))   # (9.7, 4, True, 2, 2)
```

<details>
<summary>Megoldás</summary>

```python solution
def elemzes(homersekletek):
    osszeg = 0
    max_index = 0
    nyari = 0
    elso_fagy = None
    for i, t in enumerate(homersekletek):
        osszeg += t
        if t > homersekletek[max_index]:
            max_index = i
        if t >= 25:
            nyari += 1
        if t < 0 and elso_fagy is None:
            elso_fagy = i + 1
    atlag = round(osszeg / len(homersekletek), 1)
    volt_fagy = elso_fagy is not None
    return (atlag, max_index + 1, volt_fagy, nyari, elso_fagy)


print(elemzes([3, -2, 7, 26, 25, -1]))   # (9.7, 4, True, 2, 2)
```

</details>

```python test
assert elemzes([3, -2, 7, 26, 25, -1]) == (9.7, 4, True, 2, 2), "A példa eredménye nem stimmel."
assert elemzes([10, 12, 12]) == (11.3, 2, False, 0, None), "Egyenlő maximumnál az első számít; fagy nélkül None."
assert elemzes([-5]) == (-5.0, 1, True, 0, 1), "Egyetlen fagyos nap."
```
