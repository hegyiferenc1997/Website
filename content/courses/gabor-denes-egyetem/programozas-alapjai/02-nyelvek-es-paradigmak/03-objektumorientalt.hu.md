---
title: Objektumorientált programozás
summary: Osztályok és objektumok, egységbezárás, öröklődés és polimorfizmus Python példákon.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- mi az **osztály** és az **objektum**,
- mik az OOP alappillérei: **egységbezárás, öröklődés, polimorfizmus, absztrakció**,
- hogyan írsz egyszerű osztályt Pythonban.

## Osztály és objektum

Az **objektumorientált programozásban (OOP)** az adatokat és a rajtuk dolgozó műveleteket egy egységbe, **objektumba** szervezzük.

- Az **osztály** a tervrajz (pl. „Autó”): megmondja, milyen adatai (**attribútumai**) és műveletei (**metódusai**) vannak.
- Az **objektum** (példány) egy konkrét darab a tervrajz alapján (pl. „az én piros autóm”).

```python run
class Hallgato:
    """Egy hallgató neve és jegyei."""

    def __init__(self, nev):
        # A konstruktor: az új objektum kezdeti állapotát állítja be.
        self.nev = nev
        self.jegyek = []

    def jegy_hozzaadasa(self, jegy):
        self.jegyek.append(jegy)

    def atlag(self):
        if not self.jegyek:
            return 0
        return sum(self.jegyek) / len(self.jegyek)


anna = Hallgato("Anna")       # objektum létrehozása (példányosítás)
anna.jegy_hozzaadasa(5)
anna.jegy_hozzaadasa(4)
print(anna.nev, anna.atlag())  # Anna 4.5
```

A `self` mindig az aktuális objektumra mutat: `anna.atlag()` hívásakor a `self` maga `anna`.

## Az OOP négy alappillére

### 1. Egységbezárás (encapsulation)

Az adatok és a hozzájuk tartozó műveletek együtt vannak, és a belső részleteket elrejtjük a külvilág elől. Pythonban a `_` előtag jelzi, hogy egy attribútum „belső használatú”.

```python run
class Bankszamla:
    def __init__(self):
        self._egyenleg = 0   # belső adat: kívülről ne módosítsd közvetlenül

    def befizet(self, osszeg):
        if osszeg <= 0:
            raise ValueError("Csak pozitív összeg fizethető be.")
        self._egyenleg += osszeg

    def egyenleg(self):
        return self._egyenleg


szamla = Bankszamla()
szamla.befizet(5000)
print(szamla.egyenleg())   # 5000
```

Az ellenőrzés (`osszeg <= 0`) garantálja, hogy az egyenleg soha ne kerüljön hibás állapotba.

### 2. Öröklődés (inheritance)

Egy osztály átveheti egy másik osztály tulajdonságait, és kiegészítheti őket. Az ős az **alaposztály**, az új a **leszármazott**.

### 3. Polimorfizmus (többalakúság)

Különböző osztályú objektumok ugyanarra a metódushívásra a saját módjukon reagálnak.

```python run
class Alakzat:
    def terulet(self):
        return 0


class Teglalap(Alakzat):          # Teglalap az Alakzat leszármazottja
    def __init__(self, a, b):
        self.a, self.b = a, b

    def terulet(self):            # felülírjuk az ős metódusát
        return self.a * self.b


class Kor(Alakzat):
    def __init__(self, r):
        self.r = r

    def terulet(self):
        return 3.14159 * self.r ** 2


# Polimorfizmus: ugyanaz a hívás, különböző viselkedés.
for alakzat in [Teglalap(3, 4), Kor(1)]:
    print(type(alakzat).__name__, alakzat.terulet())
```

### 4. Absztrakció

A felhasználónak csak azt kell tudnia, _mit_ csinál egy objektum (`terulet()`), nem azt, hogyan számolja ki.

## Mikor jó az OOP?

- Ha a feladat **valós dolgokat** modellez (hallgatók, termékek, robotok).
- Ha sok hasonló, de kicsit eltérő típusunk van (öröklődés, polimorfizmus).
- Nagy programoknál, ahol a kódot jól elkülönülő részekre kell bontani.

Kis szkripteknél viszont felesleges bonyolítás lehet – ilyenkor elég néhány függvény.

## Összefoglalás

- **Osztály** = tervrajz, **objektum** = példány; adat = attribútum, művelet = metódus.
- Négy pillér: **egységbezárás, öröklődés, polimorfizmus, absztrakció**.
- Pythonban `class`, `__init__` és `self` a kulcsszavak.
