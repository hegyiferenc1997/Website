---
title: Algoritmusok és adatstruktúrák
summary: Az algoritmus a megoldás lépései, az adatstruktúra az adatok tárolásának módja – a kettő együtt adja a programot.
minutes: 15
---

## Amit ebben a leckében megtanulsz

- mi az **algoritmus**, és milyen tulajdonságai vannak egy jónak,
- mi az **adatstruktúra** (adatszerkezet), és miért számít, melyiket választjuk,
- mit jelent, hogy egy algoritmus „gyors” vagy „lassú”.

## Mi az algoritmus?

Az **algoritmus** egy feladat megoldásának pontos, véges lépéssorozata. Egy jó algoritmus:

- **egyértelmű** – minden lépésnél pontosan tudjuk, mi a teendő,
- **véges** – véges sok lépés után véget ér,
- **determinisztikus** – ugyanarra a bemenetre mindig ugyanazt adja,
- **általános** – nem csak egy konkrét esetre, hanem a feladat összes esetére működik,
- **van bemenete és kimenete**.

Példa: két szám közül a nagyobb kiválasztása.

```python run
a = 7
b = 12
# Összehasonlítjuk a két számot, és a nagyobbat írjuk ki.
if a > b:
    print(a)
else:
    print(b)
```

## Mi az adatstruktúra?

Az **adatstruktúra** az adatok tárolásának és elérésének a módja. Ugyanazt az adatot többféleképpen is tárolhatjuk, és a választás befolyásolja, milyen gyorsan tudunk vele dolgozni.

| Adatstruktúra | Hasonlat                                   | Mire jó?                                               |
| ------------- | ------------------------------------------ | ------------------------------------------------------ |
| lista / tömb  | számozott fiókok sora                      | sorrendben tárolt elemek, index szerinti elérés        |
| halmaz        | zsák, amiben minden tárgy egyszer szerepel | „benne van-e?” gyors eldöntése, ismétlődések kiszűrése |
| szótár (map)  | telefonkönyv: név → szám                   | érték keresése kulcs alapján                           |
| verem         | tányérkupac                                | az utoljára betett elem jön ki először                 |
| sor           | sorban állás a pénztárnál                  | az elsőként érkező kerül sorra először                 |

```python run
# Ugyanaz az adat háromféle szerkezetben.
jegyek = [5, 3, 4, 5]                      # lista: sorrend számít, lehet ismétlődés
kulonbozo_jegyek = {5, 3, 4}               # halmaz: minden elem egyszer
telefonkonyv = {"Anna": "+36 1 234 5678"}  # szótár: kulcs → érték

print(jegyek[0])               # az első jegy
print(4 in kulonbozo_jegyek)   # benne van-e a 4?
print(telefonkonyv["Anna"])    # Anna telefonszáma
```

> **Niklaus Wirth** híres könyvének címe: _Algoritmusok + Adatstruktúrák = Programok_. A két fogalom elválaszthatatlan: a jó adatstruktúra egyszerűbbé és gyorsabbá teszi az algoritmust.

## Hatékonyság: mennyi lépés?

Ugyanarra a feladatra több algoritmus is létezhet, és nem mindegy, melyik mennyi lépést tesz. Ha egy rendezetlen listában keresünk egy elemet, legrosszabb esetben **minden elemet** meg kell néznünk (n elemnél n lépés). Ha a lista rendezett, a **bináris kereséssel** minden lépésben megfelezhetjük a keresési tartományt, így 1 000 000 elemnél is kb. 20 lépés elég.

Ezt a növekedési ütemet az ún. **nagy O jelöléssel** írjuk le:

| Jelölés  | Név          | Példa                                |
| -------- | ------------ | ------------------------------------ |
| O(1)     | konstans     | lista elemének elérése index alapján |
| O(log n) | logaritmikus | bináris keresés rendezett listában   |
| O(n)     | lineáris     | elem keresése rendezetlen listában   |
| O(n²)    | négyzetes    | buborékrendezés                      |

```python run
# Lineáris keresés: végigmegyünk az elemeken, és számoljuk a lépéseket.
szamok = [8, 3, 9, 1, 7, 4]
keresett = 7
lepesek = 0
for szam in szamok:
    lepesek += 1
    if szam == keresett:
        break
print("Megtaláltam", lepesek, "lépésben.")
```

## Összefoglalás

- Az **algoritmus** egyértelmű, véges, általános lépéssorozat bemenettel és kimenettel.
- Az **adatstruktúra** az adatok tárolási módja (lista, halmaz, szótár, verem, sor …).
- A jó választás gyorsabbá teszi a programot; a hatékonyságot a **nagy O jelöléssel** mérjük.

## A lecke feladata: Lineáris keresés lépésszámmal

A lecke lineáris keresését alakítsd át: a program keresse meg a `keresett` számot a listában, és írja ki, **hányadik lépésben** találta meg, pontosan ebben a formában:

```text
Megtaláltam 5 lépésben.
```

Ha a szám nincs a listában, ezt írja ki: `Nincs a listában.` – ehhez jól jön a ciklus utáni ellenőrzés, hogy megtaláltuk-e.

```python starter required
szamok = [8, 3, 9, 1, 7, 4]
keresett = 7

lepesek = 0
megtalaltam = False
for szam in szamok:
    lepesek += 1
    # Ha a szam egyenlő a keresettel: jegyezd meg, hogy megtaláltad, és lépj ki (break).

# Írd ki az eredményt a megtalaltam változó alapján!
```

<details>
<summary>Megoldás</summary>

```python solution
szamok = [8, 3, 9, 1, 7, 4]
keresett = 7

lepesek = 0
megtalaltam = False
for szam in szamok:
    lepesek += 1
    if szam == keresett:
        megtalaltam = True
        break

if megtalaltam:
    print("Megtaláltam", lepesek, "lépésben.")
else:
    print("Nincs a listában.")
```

</details>

```python test
assert kimenet.strip() == "Megtaláltam 5 lépésben.", "A 7-es az ötödik elem, ezt kell kiírni: Megtaláltam 5 lépésben."
```
