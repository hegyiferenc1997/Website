---
title: Gyakorlás – követelmények, célok, KPI
summary: Ellenőrző kérdések és összefoglaló feladatlap a nyolcadik témakörhöz.
minutes: 45
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Írj felhasználói történetet és egy elfogadási feltételt egy menza-alkalmazás „előrendelés” funkciójához!</summary>

Mint hallgató, szeretném előre megrendelni az ebédemet, azért, hogy ne kelljen sorban állnom. Elfogadási feltétel: Adott, hogy 11:00 előtt vagyok, amikor kiválasztok egy menüt és fizetek, akkor visszaigazolást kapok egy átvételi kóddal.

</details>

<details>
<summary>2. Fogalmazd át SMART céllá: „Legyen gyorsabb az ügyfélszolgálat.”</summary>

Pl.: „2027. április 30-ig az ügyfélszolgálati jegyekre adott első válasz átlagos ideje 24 óráról 4 óra alá csökkenjen, a jelenlegi létszámmal, egy automatikus jegykiosztó rendszer bevezetésével.”

</details>

<details>
<summary>3. Miért érdemes a nem funkcionális követelményeket is számszerűen megadni?</summary>

Mert csak így tesztelhetők és fogadhatók el. A „legyen gyors” vitát szül az átadáskor, a „95%-ban 1 mp alatt válaszoljon” egyértelműen ellenőrizhető.

</details>

<details>
<summary>4. Mondj egy hiúsági mutatót egy mobilalkalmazásnál, és mivel helyettesítenéd!</summary>

A letöltések száma hiúsági mutató, mert a letöltők nagy része egyszer sem használja az appot. Helyette: havi aktív felhasználók (MAU), 30 napos megtartási arány.

</details>

## Összefoglaló feladatlap

```quiz required
? „A rendszer legyen elérhető angolul és magyarul is, és a jelszavakat titkosítva tárolja.” Melyik szabvány sorolja fel az ilyen minőségi jellemzőket?
- ISO 9001
+ ISO/IEC 25010
- PMBOK
- PRINCE2
! A szoftvertermék minőségi modellje.

? Egy MoSCoW-priorizálásnál a ráfordítás 150 nap. Az ökölszabály szerint legfeljebb hány nap jusson a „Must” követelményekre?
= 90
= 90 nap
! 150 · 0,6.

? Melyik eszköz köti össze a követelményeket a tesztesetekkel?
- Gantt-diagram
+ követelmény-nyomonkövetési mátrix
- SWOT
- Pareto-diagram
! Requirements Traceability Matrix.

? Melyik SMART-kritérium hiányzik ebből: „A tesztlefedettség érje el a 80%-ot.”?
- specifikus
- mérhető
+ időhöz kötött
- releváns
! Nincs megadva, mikorra.

? Egy KPI kezdőértéke 40, célértéke 90, mostani értéke 65. Hány százalékban teljesült?
= 50
= 50%
! (65 − 40) / (90 − 40) · 100.

? Az elégedettségi felmérésben 35% támogató, 40% semleges, 25% kritikus. Mennyi az NPS?
= 10
= +10
! 35 − 25.

? Melyik **követő** mutató?
+ a kiadás utáni ügyfélpanaszok száma
- a kódátnézések aránya a fejlesztés közben
- a sprint közbeni automatikus tesztek sikerességi aránya
- a nyitott kockázatok száma a tervezéskor
! Utólag mutatja a már elért eredményt.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **SMART cél elérhetősége.** Írd meg a `szukseges_noveles(kezdo, cel, honap)` függvényt (szükséges havi növekedés %-ban, 1 tizedesre) és az `elerheto(kezdo, cel, honap, multbeli)` függvényt, amely `True`-t ad, ha a `multbeli` %-os havi növekedéssel a cél `honap` hónap alatt elérhető!

```python starter
def szukseges_noveles(kezdo, cel, honap):
    return round(100 * (cel - kezdo) / kezdo / honap, 1)

def elerheto(kezdo, cel, honap, multbeli):
    return multbeli >= szukseges_noveles(kezdo, cel, honap)
```

<details>
<summary>Megoldás</summary>

A növekedés kamatos: a lineáris számolás túlbecsüli a szükséges ütemet (és alábecsüli, mire képes egy állandó ütem).

```python solution
def szukseges_noveles(kezdo, cel, honap):
    return round(100 * ((cel / kezdo) ** (1 / honap) - 1), 1)   # kamatos növekedés megfordítva

def elerheto(kezdo, cel, honap, multbeli):
    return kezdo * (1 + multbeli / 100) ** honap >= cel
```

</details>

```python test
assert szukseges_noveles(2000, 10_000, 12) == 14.4
assert szukseges_noveles(100, 400, 2) == 100.0
assert elerheto(2000, 10_000, 12, 6.8) is False
assert elerheto(1000, 1500, 12, 4) is True
print("Minden ellenőrzés sikeres!")
```

**2.** **RAG-státusz.** Írd meg a `kpi_statusz(tenyleges, cel, irany, tures=0.1)` függvényt! `irany` értéke `"fel"` (több a jobb) vagy `"le"` (kevesebb a jobb). A teljesítés 1 felett `"ZÖLD"`, `1 - tures` és 1 között `"SÁRGA"`, alatta `"PIROS"`.

```python starter
def kpi_statusz(tenyleges, cel, irany, tures=0.1):
    t = tenyleges / cel
    return "ZÖLD" if t >= 1 else "SÁRGA" if t >= 1 - tures else "PIROS"
```

<details>
<summary>Megoldás</summary>

```python solution
def kpi_statusz(tenyleges, cel, irany, tures=0.1):
    t = tenyleges / cel if irany == "fel" else cel / tenyleges   # "le" irányban fordítva osztunk
    return "ZÖLD" if t >= 1 else "SÁRGA" if t >= 1 - tures else "PIROS"
```

</details>

```python test
assert kpi_statusz(4200, 4000, "fel") == "ZÖLD"
assert kpi_statusz(1150, 1000, "le") == "PIROS"
assert kpi_statusz(1050, 1000, "le") == "SÁRGA"
assert kpi_statusz(3.7, 4.0, "fel") == "SÁRGA"
print("Minden ellenőrzés sikeres!")
```

**3.** **OKR-pontszám.** Írd meg az `okr_pont(kulcseredmenyek)` függvényt, amely `(kiinduló, elért, cél)` hármasok listájából kiszámolja az átlagos pontszámot (2 tizedesre): kulcseredményenként a megtett út aránya, 0 és 1 közé szorítva!

```python starter
def okr_pont(kulcseredmenyek):
    return round(sum(e / c for _, e, c in kulcseredmenyek) / len(kulcseredmenyek), 2)
```

<details>
<summary>Megoldás</summary>

```python solution
def okr_pont(kulcseredmenyek):
    pontok = [min(1.0, max(0.0, (e - k) / (c - k))) for k, e, c in kulcseredmenyek]
    return round(sum(pontok) / len(pontok), 2)
```

</details>

```python test
assert okr_pont([(2000, 4200, 5000), (3.9, 4.4, 4.6), (20, 31, 40)]) == 0.67
assert okr_pont([(20, 50, 60)]) == 0.75
assert okr_pont([(0, 120, 100), (0, -10, 100)]) == 0.5
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Melyik a nem funkcionális követelmény?
- a felhasználó jelszót változtathat
+ az oldal 2 másodpercen belül betöltődik
- a rendszer PDF-számlát készít
- az admin törölhet felhasználót
! A nem funkcionális követelmény azt írja le, milyen jól működjön a rendszer.

? Mit jelent a MoSCoW-ban a „W”?
- Want: szeretnénk
+ Won't (this time): most nem készül el
- Weekly: hetente
- Whole: teljes
! Ami most kimarad, az később még bekerülhet.

? Egy KPI célja 50, a tényleges érték 40, több a jobb. Hány százalék a teljesítés?
= 80
! $40 / 50 = 0{,}8$.

? Mi a különbség a vezető és a követő mutató között?
+ a vezető mutató előre jelzi az eredményt, a követő utólag méri
- a vezető mutatót a vezetők, a követőt a csapat méri
- nincs különbség
- a követő mutató mindig pénzügyi
! Pl. az aktív felhasználók száma (vezető) előre jelzi a bevételt (követő).
```
