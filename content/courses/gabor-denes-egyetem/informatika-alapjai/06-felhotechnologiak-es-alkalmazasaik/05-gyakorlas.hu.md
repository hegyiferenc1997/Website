---
title: Gyakorlás – felhőtechnológiák
summary: Ellenőrző kérdések és összefoglaló feladatlap a felhőről, a munkaszervezésről és a vizualizációról.
minutes: 45
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Egy startup webalkalmazást fejleszt, de nem akar szervereket üzemeltetni. Melyik modellt választaná, és miért?</summary>

PaaS-t (pl. Vercel, Heroku, Google App Engine): csak a kódot töltik fel, az operációs rendszert, a frissítéseket és a skálázást a szolgáltató intézi.

</details>

<details>
<summary>2. Négyfős csapatban írtok beadandót. Hogyan szerveznéd meg a munkát felhős eszközökkel?</summary>

Egy közös dokumentum (Google Docs vagy Word online) megjegyzésekkel és javaslat móddal; egy Kanban-tábla (Trello, Planner) a feladatokkal, felelőssel és határidővel; egy csevegőcsatorna (Teams, Discord) a gyors kérdéseknek; egy közös naptár a megbeszélésekhez.

</details>

<details>
<summary>3. Milyen diagramot választanál, ha azt akarod megmutatni, hogyan függ össze a tanulással töltött idő és a teszteredmény?</summary>

Pontdiagramot (szórásdiagramot): minden diák egy pont, az x tengelyen a tanulási idő, az y tengelyen az eredmény.

</details>

**Mini projekt:** készíts egy egyoldalas infografikát Canvában vagy egy diagramot Google Sheetsben arról, hány órát tanulsz naponta egy héten át! Adj neki egy üzenetet kimondó címet, és jelöld meg a forrást (saját mérés).

## Összefoglaló feladatlap

```quiz required
? Melyik szolgáltatási modell a Microsoft 365?
- IaaS
- PaaS
+ SaaS
! Kész szoftver előfizetéssel.

? Melyik a három legnagyobb nyilvános felhőszolgáltató egyike?
+ Microsoft Azure
- Canva
- Trello
- Discord
! AWS, Azure, Google Cloud.

? Melyik felhőtulajdonság jelenti, hogy terhelés esetén percek alatt több gépet kapsz?
= skálázhatóság
= skálázható
! Scalability.

? Melyik diagram való kategóriák (pl. öt egyetem hallgatói létszámának) összehasonlítására?
- vonaldiagram
+ oszlopdiagram
- pontdiagram
- hisztogram
! Kategóriák → oszlop vagy sáv.

? Melyik oszlopba kerül egy Kanban-táblán az a feladat, amin éppen dolgozol?
= Folyamatban
! Teendő → Folyamatban → Kész.

? Mi kell egy jó infografikára az adatok mellé?
+ a forrás megjelölése
- minél több betűtípus
- 3D-s diagramok
- legalább tíz különböző szín
! A forrás teszi ellenőrizhetővé.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Redundancia.** Írd meg a `rendelkezesre_allas(a, n)` függvényt, amely megadja, mekkora a szolgáltatás rendelkezésre állása `n` független, egyenként `a` arányban működő szerverrel, ha elég az egyik (5 tizedesre)!

```python starter
def rendelkezesre_allas(a, n):
    return round(a * n, 5)
```

<details>
<summary>Megoldás</summary>

```python solution
def rendelkezesre_allas(a, n):
    return round(1 - (1 - a) ** n, 5)       # csak akkor áll, ha mind egyszerre hibás
```

</details>

```python test
assert rendelkezesre_allas(0.9, 1) == 0.9
assert rendelkezesre_allas(0.9, 2) == 0.99
assert rendelkezesre_allas(0.99, 2) == 0.9999
assert rendelkezesre_allas(0.95, 3) == 0.99987
print("Minden ellenőrzés sikeres!")
```

**2.** **Felhő vagy saját?** Írd meg az `olcsobb(ora_dij, kihasznaltsag, sajat_havi)` függvényt, amely `"felhő"`-t ad, ha a felhő havi költsége (óradíj × 720 óra × kihasználtság) kisebb a saját szerver havi költségénél, egyébként `"saját"`-ot!

```python starter
def olcsobb(ora_dij, kihasznaltsag, sajat_havi):
    return "felhő"
```

<details>
<summary>Megoldás</summary>

```python solution
def olcsobb(ora_dij, kihasznaltsag, sajat_havi):
    felho_havi = ora_dij * 720 * kihasznaltsag     # csak a futási időt fizetjük
    return "felhő" if felho_havi < sajat_havi else "saját"
```

</details>

```python test
assert olcsobb(120, 0.25, 58000) == "felhő"
assert olcsobb(120, 1.0, 58000) == "saját"
assert olcsobb(100, 0.5, 36000) == "saját"
print("Minden ellenőrzés sikeres!")
```

**3.** **Little törvénye.** Írd meg az `atfutas(kartyak)` függvényt, amely `(kezdés napja, befejezés napja)` párok listájából kiszámolja az átlagos átfutási időt napokban (1 tizedesre)! A még be nem fejezett kártyák (befejezés: `None`) ne számítsanak.

```python starter
def atfutas(kartyak):
    return round(sum(v - k for k, v in kartyak) / len(kartyak), 1)
```

<details>
<summary>Megoldás</summary>

```python solution
def atfutas(kartyak):
    kesz = [v - k for k, v in kartyak if v is not None]   # csak a befejezettek
    return round(sum(kesz) / len(kesz), 1)
```

</details>

```python test
assert atfutas([(1, 4), (1, 9), (2, 5)]) == 4.7
assert atfutas([(1, 4), (2, None), (3, 5)]) == 2.5
assert atfutas([(0, 10)]) == 10.0
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Melyik a SaaS példája?
- egy bérelt virtuális gép, amelyre te telepítesz mindent
- egy platform, amelyre a saját kódodat töltöd fel
+ egy böngészőben használt levelezőrendszer vagy irodai csomag
- egy saját szerverterem
! Software as a Service: a kész alkalmazást használod.

? Egy csapatnál 12 kártya van folyamatban, és hetente 3 lesz kész. Hány hét az átlagos átfutás?
= 4
! $12 / 3 = 4$.

? Milyen diagram való egy egész részeinek arányaihoz (pl. kiadások megoszlása) kevés kategóriával?
- vonaldiagram
+ kördiagram (vagy halmozott oszlop)
- pontdiagram
- hisztogram
! Sok kategóriánál az oszlopdiagram olvashatóbb.

? Miért megtévesztő egy 90-ről induló tengelyű oszlopdiagram a 92 és 96 értékekkel?
+ mert a kis különbség többszörösnek látszik
- mert túl sok rajta a szín
- mert nincs jelmagyarázat
- nem megtévesztő
! Az oszlopdiagram tengelye nulláról induljon.
```
