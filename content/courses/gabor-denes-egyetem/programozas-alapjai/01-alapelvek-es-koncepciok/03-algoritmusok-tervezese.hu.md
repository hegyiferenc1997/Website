---
title: Algoritmusok leírása és tervezése
summary: Pszeudokód, folyamatábra és a feladat lebontása kisebb részekre – így tervezünk kódolás előtt.
minutes: 15
---

## Amit ebben a leckében megtanulsz

- hogyan írsz le egy algoritmust **pszeudokóddal** és **folyamatábrával**,
- mi a **lépésenkénti finomítás** (felülről lefelé tervezés),
- melyik az a **három vezérlési szerkezet**, amiből minden algoritmus felépíthető.

## A három alapszerkezet

Bármely algoritmus felépíthető három építőkockából (ez a **strukturált programozás** alaptétele):

1. **Szekvencia** – utasítások egymás után.
2. **Elágazás (szelekció)** – feltételtől függően más-más ág fut le.
3. **Ciklus (iteráció)** – utasítások ismétlése, amíg egy feltétel teljesül.

## Pszeudokód

A **pszeudokód** az algoritmus leírása emberi nyelvhez közeli, de pontos formában. Nem kell hozzá konkrét programozási nyelv, és nem kell foglalkozni a szintaxis apróságaival.

Feladat: számoljuk ki egy lista elemeinek átlagát.

```text
Algoritmus Átlag(lista):
    összeg := 0
    Ciklus minden x elemre a listában:
        összeg := összeg + x
    Ciklus vége
    Ha a lista hossza > 0 akkor
        Vissza: összeg / lista hossza
    különben
        Vissza: 0
    Elágazás vége
Algoritmus vége
```

Ugyanez Pythonban szinte szóról szóra:

```python run
def atlag(lista):
    osszeg = 0
    for x in lista:
        osszeg = osszeg + x
    if len(lista) > 0:
        return osszeg / len(lista)
    else:
        return 0

print(atlag([4, 5, 3, 4]))   # 4.0
```

## Folyamatábra

A **folyamatábra** rajzos leírás. A szabványos jelek:

| Jel | Jelentés |
| --- | --- |
| ovális | START / STOP |
| paralelogramma | bemenet vagy kimenet (beolvasás, kiírás) |
| téglalap | művelet, értékadás |
| rombusz | döntés (feltétel, igen/nem ág) |
| nyíl | a végrehajtás iránya |

Egy egyszerű folyamatábra szöveges vázlata (páros vagy páratlan szám):

```text
 (START)
    ↓
 /Olvasd be n-t/
    ↓
 <n % 2 == 0 ?> ──igen──→ /Írd ki: páros/ ──┐
    │ nem                                   │
    ↓                                       │
 /Írd ki: páratlan/                         │
    ↓  ←────────────────────────────────────┘
 (STOP)
```

## Lépésenkénti finomítás

Nagy feladatot nem lehet egyben megoldani. A **felülről lefelé (top-down) tervezésnél** először nagy lépésekre bontjuk, majd minden lépést tovább finomítunk, amíg minden rész egyszerűen megírhatóvá válik. Ez a **dekompozíció**.

Példa: „Készíts jegyátlag-számoló programot.”

1. Beolvasni a jegyeket.
2. Ellenőrizni, hogy minden jegy 1 és 5 között van.
3. Kiszámolni az átlagot.
4. Kiírni az eredményt és egy értékelést.

A 3. lépés tovább bontva: összegzés, osztás a darabszámmal, kerekítés két tizedesre. Minden kisebb lépésből később egy **függvény** lesz.

> **Tipp:** mielőtt kódolni kezdesz, írd le papírra vagy kommentként a lépéseket. Ha nem tudod szavakkal elmondani a megoldást, kódban sem fog menni.

## Absztrakció

Az **absztrakció** azt jelenti, hogy elrejtjük a részleteket, és csak a lényeggel foglalkozunk. Amikor a `print()`-et használod, nem kell tudnod, hogyan rajzolja ki a betűket a képernyő – elég tudni, *mit* csinál. A jó program is ilyen rétegekből épül fel.

## Összefoglalás

- Minden algoritmus felépíthető **szekvenciából, elágazásból és ciklusból**.
- A **pszeudokód** és a **folyamatábra** nyelvfüggetlen tervezési eszközök.
- A **lépésenkénti finomítás** (dekompozíció) és az **absztrakció** a nagy feladatok kezelésének kulcsa.
