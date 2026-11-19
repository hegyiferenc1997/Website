---
title: Gyakorlás – kutatásmódszertan
summary: Ellenőrző kérdések és összefoglaló feladatlap a kutatási folyamatról, az adatgyűjtésről és -elemzésről, valamint a forrásokról és a hivatkozásról; egy mini kutatás megtervezése.
minutes: 55
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Tervezz egy mini kutatást: mennyit alszanak az elsőéves mérnökinformatikus hallgatók vizsgaidőszakban?</summary>

Kutatási kérdés: „Hány órát alszanak átlagosan éjszakánként az elsőéves mérnökinformatikus hallgatók a vizsgaidőszakban a szorgalmi időszakhoz képest?” Módszer: kvantitatív kérdőív (két kérdés: alvásidő szorgalmi és vizsgaidőszakban), lehetőleg véletlen mintán az évfolyamból; névtelen kitöltés (társas kívánatosság csökkentése). Elemzés: átlag, medián, szórás a két időszakra. Korlátok: önbevallás, kényelmi minta esetén torzítás.

</details>

<details>
<summary>2. Írd át semlegesre: „Ugye ön is úgy gondolja, hogy az új felület sokkal jobb?”</summary>

„Hogyan értékeli az új felületet a régihez képest?” – vagy Likert-skálával: „Az új felület könnyebben használható, mint a régi. (1 – egyáltalán nem értek egyet … 5 – teljesen egyetértek)”.

</details>

<details>
<summary>3. Miért jobb a medián, mint az átlag a fizetések jellemzésére?</summary>

Mert a fizetések eloszlása általában ferde: néhány nagyon magas érték felhúzza az átlagot, így az nem a tipikus fizetést mutatja. A medián a középső érték, ezért kevésbé érzékeny a kiugró értékekre.

</details>

<details>
<summary>4. Egy MI-chatbot három cikket ajánl a szakdolgozatodhoz, szerzővel és évszámmal. Mit teszel?</summary>

Mindhármat megkeresem egy megbízható adatbázisban (Google Scholar, IEEE Xplore, egyetemi könyvtár). Ha nem létezik, nem használom. Ha létezik, elolvasom az eredetit, és abból hivatkozom, nem a chatbot összefoglalójából.

</details>

## Összefoglaló feladatlap

> Egy fejlesztőcsapat azt vizsgálja, hogy egy új, rövidebb bejelentkezési folyamat csökkenti-e a bejelentkezéshez szükséges időt. 10 tesztfelhasználó bejelentkezési ideje (másodperc): 8, 9, 10, 10, 11, 12, 12, 12, 14, 42.

```quiz required
? Mi ebben a vizsgálatban a **függő változó**?
- a bejelentkezési folyamat változata
+ a bejelentkezéshez szükséges idő
- a tesztfelhasználók neve
- a fejlesztőcsapat létszáma
! Amit mérnek.

? Mennyi az idők **átlaga** másodpercben?
= 14
! 140 / 10 = 14.

? Mennyi az idők **mediánja** másodpercben?
= 11,5
= 11.5
! A két középső érték (11 és 12) átlaga.

? Miért tér el ennyire az átlag és a medián?
- számolási hiba miatt
+ a 42 másodperces kiugró érték felhúzza az átlagot
- mert kevés a felhasználó
- mert a medián mindig kisebb
! A medián kevésbé érzékeny a kiugró értékekre.

? A csapat a tesztfelhasználókat a saját kollégái közül választotta. Melyik a fő kockázat?
+ mintavételi torzítás: a kollégák jobban ismerik a rendszert, mint a valódi felhasználók
- túlélési torzítás
- plágium
- túl nagy minta
! Kényelmi minta, nem reprezentatív.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Hibahatár.** Írd meg a `hibahatar(p, n)` függvényt, amely egy arány 95%-os hibahatárát adja: $1{,}96 \cdot \sqrt{p(1-p)/n}$ (3 tizedesre)!

```python starter
def hibahatar(p, n):
    return round(1.96 * p * (1 - p) / n, 3)
```

<details>
<summary>Megoldás</summary>

```python solution
from math import sqrt

def hibahatar(p, n):
    return round(1.96 * sqrt(p * (1 - p) / n), 3)   # 95%-os megbízhatóság
```

</details>

```python test
assert hibahatar(0.5, 100) == 0.098
assert hibahatar(0.6, 400) == 0.048
assert hibahatar(0.5, 1000) == 0.031
print("Minden ellenőrzés sikeres!")
```

**2.** **Szükséges mintaméret.** Írd meg a `szukseges_n(hiba, p=0.5)` függvényt, amely megadja, legalább hány válaszadó kell a megadott hibahatárhoz: $(1{,}96 / \text{hiba})^2 \cdot p(1-p)$, felfelé kerekítve!

```python starter
def szukseges_n(hiba, p=0.5):
    return round((1.96 / hiba) ** 2 * p * (1 - p))
```

<details>
<summary>Megoldás</summary>

```python solution
from math import ceil

def szukseges_n(hiba, p=0.5):
    return ceil((1.96 / hiba) ** 2 * p * (1 - p))   # mindig felfelé: "legalább"
```

</details>

```python test
assert szukseges_n(0.05) == 385
assert szukseges_n(0.03) == 1068
assert szukseges_n(0.1) == 97
assert szukseges_n(0.05, 0.1) == 139
print("Minden ellenőrzés sikeres!")
```

**3.** **A/B teszt z-értéke.** Írd meg a `z_proba(a_reg, a_lat, b_reg, b_lat)` függvényt, amely két arány különbségének z-értékét adja az összevont arány alapján: $z = (p_B - p_A) / \sqrt{p(1-p)(1/n_A + 1/n_B)}$ (2 tizedesre)!

```python starter
def z_proba(a_reg, a_lat, b_reg, b_lat):
    return round(b_reg / b_lat - a_reg / a_lat, 2)
```

<details>
<summary>Megoldás</summary>

```python solution
from math import sqrt

def z_proba(a_reg, a_lat, b_reg, b_lat):
    pa, pb = a_reg / a_lat, b_reg / b_lat
    p = (a_reg + b_reg) / (a_lat + b_lat)            # összevont arány a nullhipotézis alatt
    return round((pb - pa) / sqrt(p * (1 - p) * (1 / a_lat + 1 / b_lat)), 2)
```

</details>

```python test
assert z_proba(30, 400, 48, 400) == 2.15
assert z_proba(50, 500, 50, 500) == 0.0
assert z_proba(48, 400, 30, 400) == -2.15
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? A $|z| > 1{,}96$ szabály mit jelent egy A/B tesztben?
+ a különbség 5%-os küszöbön statisztikailag szignifikáns
- B legalább 1,96%-kal jobb
- a teszt 1,96 napig futott
- a minta túl kicsi
! Ez a kétoldali 5%-os küszöb határa.

? Hányszoros mintára van szükség, ha a hibahatárt harmadára akarod csökkenteni?
= 9
! A hibahatár $1/\sqrt{n}$-nel csökken: $3^2 = 9$.

? Egy Discord-szerveren 2000 válasz érkezett a kérdőívedre. Mi a legnagyobb gond?
- túl sok a válasz
+ a minta nem véletlenszerű (önkiválasztás), így a nagy szám sem teszi reprezentatívvá
- a hibahatár túl kicsi
- semmi gond nincs
! A hibahatár képlete csak véletlen mintára érvényes.

? Mi a legerősebb módszer ok-okozati kapcsolat igazolására?
- nagy mintán mért korreláció
+ véletlen besorolású kísérlet (pl. A/B teszt)
- egy szakértő véleménye
- egy blogbejegyzés
! A véletlen besorolás kiegyenlíti a rejtett változókat.
```
