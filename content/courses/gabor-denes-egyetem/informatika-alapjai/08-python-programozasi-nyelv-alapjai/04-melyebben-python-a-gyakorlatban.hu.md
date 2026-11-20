---
title: Mélyebben – Python a gyakorlatban
summary: Szótárak és szógyakoriság, szövegfeldolgozás string-metódusokkal, biztonságos bemenetkezelés try–excepttel, listaértelmezés és egy kis jegyelemző program – többféle megoldással, a hibakeresés lépéseivel és programozós kötelező feladattal.
minutes: 50
---

## Amit ebben a leckében megtanulsz

- mire való a **szótár** (`dict`), és hogyan számolj vele gyakoriságot,
- hogyan dolgozz fel **szöveget** a beépített metódusokkal,
- hogyan kezeld **biztonságosan** a felhasználó hibás bemenetét,
- hogyan írd meg ugyanazt rövidebben **listaértelmezéssel**, és hogyan keress hibát.

## 1. Szótár: kulcs → érték

A lista sorszám szerint tárol (`lista[0]`), a **szótár** kulcs szerint: `jegyek["Anna"]`. Ez akkor hasznos, ha nevekhez, kódokhoz, szavakhoz rendelünk értékeket. A leggyakoribb feladat: **megszámolni**, miből mennyi van.

```python run
# Szótár: szógyakoriság kétféleképpen
szoveg = "a python egy nyelv a python könnyű és a python népszerű"

# 1) kézzel: ha még nincs a kulcs, 0-ról indulunk
gyakorisag = {}
for szo in szoveg.split():
    gyakorisag[szo] = gyakorisag.get(szo, 0) + 1
print(gyakorisag)

# 2) a beépített Counter ugyanezt csinálja, és rendezni is tud
from collections import Counter
print(Counter(szoveg.split()).most_common(3))

# szótár bejárása: kulcs és érték együtt
arak = {"kávé": 450, "tea": 380, "kakaó": 520}
for ital, ar in arak.items():
    print(f"{ital}: {ar} Ft")
print("van-e tea?", "tea" in arak)
```

A `get(kulcs, alapérték)` nem dob hibát, ha a kulcs hiányzik – a `szotar[kulcs]` viszont `KeyError`-t dob. A szótárban való keresés (`in`) **gyors**, akármekkora is a szótár (hasítótábla, lásd a 2. témakört).

## 2. Szövegfeldolgozás

A felhasználók adatai ritkán „tiszták”: felesleges szóköz, vegyes kis- és nagybetű, eltérő elválasztók. A string-metódusokkal ezeket rendbe tehetjük:

```python run
# Szöveg tisztítása és feldolgozása string-metódusokkal
nyers = "   Kiss ANNA ;  kiss.anna@pelda.hu ;  Mérnökinformatikus  "
reszek = [r.strip() for r in nyers.split(";")]       # darabolás + szóközök levágása
nev, email, szak = reszek
print(nev.title())                                   # Kiss Anna
print(email.lower(), "– érvényesnek tűnik" if "@" in email and "." in email.split("@")[-1] else "– hibás")
print(szak.upper(), len(szak), "karakter")
print(szak.startswith("Mérnök"), szak.replace("informatikus", "-informatikus"))

# f-string formázás: igazítás és tizedesjegyek
for termek, ar in [("pendrive", 3490), ("egér", 5990.5)]:
    print(f"{termek:<10}|{ar:>10.2f} Ft")
```

## 3. Hibás bemenet kezelése: try–except

Ha a programod a felhasználótól kér számot, és ő azt írja be, hogy „öt”, az `int("öt")` hibát dob, és a program leáll. A `try–except` blokkal ezt elkapjuk, és udvariasan újra kérdezünk. A böngészős futtató nem tud interaktívan kérdezni, ezért itt egy listából „olvassuk” a bemeneteket:

```python run
# Biztonságos számbekérés: a hibás bemenetet elkapjuk és újrakérdezünk
bemenetek = iter(["öt", "", "-3", "4"])            # mintha a felhasználó ezeket gépelné be

def kerj_jegyet():
    while True:
        szoveg = next(bemenetek)
        try:
            jegy = int(szoveg)
        except ValueError:
            print(f"  '{szoveg}' nem egész szám, próbáld újra")
            continue
        if 1 <= jegy <= 5:
            return jegy
        print(f"  {jegy} nem 1 és 5 közötti, próbáld újra")

print("a beolvasott jegy:", kerj_jegyet())
```

Két **nézőpont**: a felhasználónak a barátságos újrakérdezés fontos; a **biztonságnak** az, hogy a program soha ne bízzon a bemenetben – minden adatot ellenőrizni kell (típus, tartomány), mielőtt felhasználjuk. Ez a szabály egy webes űrlapnál vagy egy API-nál ugyanúgy érvényes.

## 4. Listaértelmezés és egy kis elemző program

A listaértelmezés (list comprehension) egy rövid írásmód arra, amikor egy listából egy másikat készítünk: `[kifejezés for elem in lista if feltétel]`. Ugyanaz a feladat két változatban:

```python run
# Ugyanaz ciklussal és listaértelmezéssel
szamok = [3, 8, 1, 6, 10, 5]

paros_negyzetek = []
for x in szamok:
    if x % 2 == 0:
        paros_negyzetek.append(x * x)
print("ciklussal:          ", paros_negyzetek)
print("listaértelmezéssel: ", [x * x for x in szamok if x % 2 == 0])
```

Most rakjuk össze, amit eddig tanultunk: egy kis program, amely egy csoport jegyeiből statisztikát készít – szótárral, függvényekkel és listaértelmezéssel:

```python run
# Kis jegyelemző: szótár + függvények + listaértelmezés
jegyek = {"Anna": [5, 4, 5], "Bence": [2, 3, 1], "Csilla": [4, 4, 3], "Dani": [1, 2, 2]}

def atlag(lista):
    return sum(lista) / len(lista) if lista else 0

atlagok = {nev: round(atlag(j), 2) for nev, j in jegyek.items()}   # szótár-értelmezés
print("átlagok:", atlagok)
print("legjobb:", max(atlagok, key=atlagok.get))
print("3,0 alatt:", sorted(nev for nev, a in atlagok.items() if a < 3))
osszes = [j for lista in jegyek.values() for j in lista]           # "kilapított" lista
print("jegyeloszlás:", {j: osszes.count(j) for j in range(1, 6)})
```

## 5. Hibakeresés lépésről lépésre

Ha a program rossz eredményt ad, ne találgass – kövesd ezeket a lépéseket:

1. **Olvasd el a hibaüzenetet alulról felfelé**: az utolsó sor mondja meg a hiba típusát (`TypeError`, `KeyError`…), fölötte a sorszám, hol történt.
2. **Szűkítsd le**: melyik a legkisebb bemenet, amelyre még hibás?
3. **Írasd ki** a köztes értékeket (`print(f"{x=}")` – a `=` a változó nevét is kiírja), vagy használd a VS Code hibakeresőjét töréspontokkal.
4. **Írj egy tesztet** (`assert`), amely a hibát mutatja, és csak utána javíts – így biztos lehetsz benne, hogy a javítás tényleg segített.

```python run
# A {x=} kiírás hibakereséshez: a változó neve és értéke együtt
lista = [4, 8, 15]
osszeg = sum(lista)
print(f"{lista=} {osszeg=} {len(lista)=}")
```

## Összefoglalás

- A szótár kulcs szerint tárol; a `get(kulcs, 0)` és a `Counter` gyakoriságszámolásra való, a keresés benne gyors.
- A `strip`, `split`, `lower`, `title`, `replace` és az f-string a szövegfeldolgozás alapeszközei.
- A felhasználói bemenetet mindig ellenőrizd; a `try–except` elkapja a hibát, és újrakérdezhetsz.
- A listaértelmezés rövidebb írásmód; hibakeresésnél olvasd el a hibaüzenetet, szűkíts, írass ki, és írj tesztet.

## A lecke feladata: betűgyakoriság

Írd meg a `betugyakorisag(szoveg)` függvényt, amely egy szótárban visszaadja, melyik **betű** hányszor fordul elő a szövegben! A kis- és nagybetű ne számítson (alakítsd kisbetűssé), és csak a betűket számold (a szóköz, írásjel, számjegy maradjon ki – ebben a `c.isalpha()` segít).

```python starter required
def betugyakorisag(szoveg):
    gyakorisag = {}
    # menj végig a szöveg karakterein (kisbetűsítve),
    # és ha a karakter betű, növeld a számlálóját
    return gyakorisag


print(betugyakorisag("Alma, alma!"))
```

<details>
<summary>Megoldás</summary>

```python solution
def betugyakorisag(szoveg):
    gyakorisag = {}
    for c in szoveg.lower():
        if c.isalpha():
            gyakorisag[c] = gyakorisag.get(c, 0) + 1
    return gyakorisag


print(betugyakorisag("Alma, alma!"))
```

</details>

```python test
assert betugyakorisag("Alma, alma!") == {"a": 4, "l": 2, "m": 2}, "a kis- és nagybetű ne számítson, az írásjel maradjon ki"
assert betugyakorisag("") == {}, "üres szövegre üres szótár"
assert betugyakorisag("Év 2026") == {"é": 1, "v": 1}, "a számjegy és a szóköz nem betű"
```
