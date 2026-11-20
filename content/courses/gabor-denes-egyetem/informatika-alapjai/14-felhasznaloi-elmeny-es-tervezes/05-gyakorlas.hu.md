---
title: Gyakorlás – felhasználói élmény és tervezés
summary: Ellenőrző kérdések, egy mini tervezési feladat és összefoglaló feladatlap az UX-ről, az akadálymentességről és a tervezési folyamatról.
minutes: 47
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Egy webshopban a „Kosárba” gomb szürke, kicsi, és a „Kívánságlista” gomb mellett van, ami ugyanakkora és élénk narancssárga. Mi a gond?</summary>

Rossz a vizuális hierarchia: a fő műveletnek (Kosárba) kellene a legfeltűnőbbnek lennie. A mellékes művelet (Kívánságlista) legyen halványabb.

</details>

<details>
<summary>2. Hogyan teszed billentyűzettel is használhatóvá egy saját „gomb”-ot, amely valójában egy `<div>`?</summary>

A legjobb, ha valódi `<button>` elemet használsz: az alapból fókuszálható, Enterrel és szóközzel is működik, és a képernyőolvasó gombként olvassa fel.

</details>

<details>
<summary>3. Miért nem elég, ha a fejlesztőcsapat saját maga teszteli a felület használhatóságát?</summary>

Mert ők már ismerik a rendszert és a szakszavakat; nem látják, mi zavaros egy új felhasználónak. Valódi célfelhasználók kellenek.

</details>

**Mini tervezési feladat:** rajzolj papíron drótvázat egy egyetemi „Mai óráim” mobilképernyőről! Legyen rajta egy egyértelmű fő információ (a következő óra), egy lista a napi órákról, és egy gomb a heti nézethez. Utána kérj meg egy évfolyamtársat, hogy „hangosan gondolkodva” keresse meg rajta a csütörtöki laborod termét.

## Összefoglaló feladatlap

```quiz required
? Melyik a UX és nem a UI része?
- a betűtípus
- az ikonok stílusa
+ hogy a felhasználó elsőre megtalálja-e a fizetés gombot
- a háttérszín
! A UX a teljes élmény.

? Mit jelent a WCAG POUR elveiben az O (angolul Operable)?
+ kezelhető – például billentyűzettel is
- optimalizált
- online
- opcionális
! Perceivable, Operable, Understandable, Robust.

? Hogy hívják a kitalált, de kutatáson alapuló tipikus felhasználót a tervezésben?
= persona
! Pl. „Kata, 19 éves elsőéves”.

? Melyik tesztben látja élesben a felhasználók egyik fele az egyik, másik fele a másik változatot?
- használhatósági teszt
+ A/B teszt
- egységteszt
- stresszteszt
! Utána mérik, melyik vezet jobb eredményhez.

? Melyik Nielsen-heurisztikát sérti egy dátumválasztó, amely enged február 30-at választani?
- súgó és dokumentáció
+ hibamegelőzés
- rugalmasság
- esztétikus, minimalista
! A jó felület meg sem engedi a hibát.

? Melyik népszerű, böngészőben futó eszközzel készítenek drótvázat és prototípust?
= Figma
! Közös szerkesztéssel, a tervezőcsapatok kedvence.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Hexából RGB.** Írd meg a `hex_rgb(szin)` függvényt, amely egy `"#rrggbb"` alakú színkódból `(r, g, b)` hármast ad (0–255 közötti egészekkel)! A kis- és nagybetűs alakot is fogadja el.

```python starter
def hex_rgb(szin):
    return (0, 0, 0)
```

<details>
<summary>Megoldás</summary>

```python solution
def hex_rgb(szin):
    return tuple(int(szin[i:i + 2], 16) for i in (1, 3, 5))   # két hexa jegy = egy színcsatorna
```

</details>

```python test
assert hex_rgb("#000000") == (0, 0, 0)
assert hex_rgb("#FFFFFF") == (255, 255, 255)
assert hex_rgb("#0b5394") == (11, 83, 148)
print("Minden ellenőrzés sikeres!")
```

**2.** **Melyik gomb gyorsabb?** Írd meg a `fitts_ido(tavolsag, szelesseg)` függvényt, amely Fitts törvénye szerint ($T = 100 + 150 \cdot \log_2(D/W + 1)$ ms) visszaadja az elérési időt egészre kerekítve!

```python starter
def fitts_ido(tavolsag, szelesseg):
    return 100 + 150 * tavolsag / szelesseg
```

<details>
<summary>Megoldás</summary>

```python solution
from math import log2

def fitts_ido(tavolsag, szelesseg):
    return round(100 + 150 * log2(tavolsag / szelesseg + 1))   # logaritmikus nehézségi index
```

</details>

```python test
assert fitts_ido(300, 100) == 400
assert fitts_ido(700, 100) == 550
assert fitts_ido(100, 100) == 250
print("Minden ellenőrzés sikeres!")
```

**3.** **SUS-pontszám.** Írd meg a `sus(valaszok)` függvényt, amely 10 darab 1–5 közötti válaszból kiszámolja a SUS-pontszámot! Páratlan (1., 3., …) kérdés: válasz − 1; páros kérdés: 5 − válasz; az összeg szorozva 2,5-del. Hibás hosszú lista esetén dobjon `ValueError`-t!

```python starter
def sus(valaszok):
    return sum(valaszok) * 2.5
```

<details>
<summary>Megoldás</summary>

```python solution
def sus(valaszok):
    if len(valaszok) != 10:
        raise ValueError("pontosan 10 válasz kell")
    pont = sum((v - 1) if i % 2 == 0 else (5 - v) for i, v in enumerate(valaszok))   # i=0 az 1. kérdés
    return pont * 2.5
```

</details>

```python test
assert sus([5, 1] * 5) == 100
assert sus([1, 5] * 5) == 0
assert sus([3] * 10) == 50
try:
    sus([3] * 9)
    assert False, "ValueError kellett volna"
except ValueError:
    pass
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Legalább mekkora kontrasztarány kell a WCAG AA szint szerint nagy méretű szövegnél? (a „:1” nélkül)
= 3
! Normál szövegnél 4,5:1, nagynál 3:1.

? Hick törvénye szerint mitől függ logaritmikusan a döntési idő?
- a gombok méretétől
+ a választási lehetőségek számától
- a képernyő felbontásától
- a felhasználó életkorától
! Ezért érdemes a ritka lehetőségeket egy „Továbbiak” menübe tenni.

? Ha egy tesztelő a problémák 31%-át találja meg, kb. hány százalékot talál meg három tesztelő együtt? (egészre)
= 67
! $1 - 0{,}69^3 \approx 0{,}671$.

? Egy felület SUS-pontszáma 55. Mit jelent ez?
- kiváló használhatóság
+ átlag alatti használhatóság (az átlag 68 körül van)
- a felhasználók 55%-a elégedett
- 55 hibát találtak
! A SUS 0–100-as skála, nem százalék.
```
