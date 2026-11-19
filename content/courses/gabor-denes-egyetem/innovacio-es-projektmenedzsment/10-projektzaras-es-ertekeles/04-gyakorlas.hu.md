---
title: Gyakorlás – lezárás és értékelés
summary: Ellenőrző kérdések és összefoglaló feladatlap a tizedik témakörhöz.
minutes: 45
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Miért nem elég, ha a csapat „kész”-nek nyilvánítja a rendszert?</summary>

Mert a projektet a megrendelő elfogadása zárja le. Az elfogadási teszt és az aláírt átadás-átvételi jegyzőkönyv nélkül vita lehet abból, mi készült el, és ki felel a későbbi hibákért.

</details>

<details>
<summary>2. Mit tennél, ha az elfogadási teszten 2 kritikus és 15 apró hiba jön elő?</summary>

A kritikus hibákat az átadás előtt javítani kell, majd újratesztelni. Az apró hibákat a megrendelővel egyeztetve hibalistára (punch list) lehet tenni határidővel, és az átadás ezekkel együtt is megtörténhet, ha a megrendelő elfogadja.

</details>

<details>
<summary>3. Miért érdemes a tanulságokat nem csak a projekt végén gyűjteni?</summary>

Mert a végére sok mindent elfelejtünk, és a tanulságokat már a projekt közben is hasznosíthatnánk. A rendszeres retrospektívekkel a projekt maga is javul.

</details>

<details>
<summary>4. Mi a különbség a zárójelentés és az implementáció utáni felülvizsgálat (PIR) között?</summary>

A zárójelentés a lezáráskor készül, és főleg a projektmenedzsment-sikert értékeli (ütem, költség, terjedelem). A PIR hónapokkal később készül, és azt vizsgálja, hogy az eredmény valóban hozza-e az üzleti hasznokat.

</details>

## Összefoglaló feladatlap

```quiz required
? Melyik a lezárási lépések helyes sorrendje?
+ elfogadási teszt → átadás-átvétel → átadás az üzemeltetésnek → adminisztratív zárás
- adminisztratív zárás → elfogadási teszt → átadás-átvétel → üzemeltetés
- átadás az üzemeltetésnek → elfogadási teszt → adminisztratív zárás → átadás-átvétel
- nyitó megbeszélés → elfogadási teszt → átadás-átvétel → üzemeltetés
! Előbb az elfogadás, utána az átadás, végül a papírmunka.

? Egy projekt végén BAC = 60 millió Ft, a tényleges költség AC = 50 millió Ft, és a teljes munka elkészült. Mennyi a végső CPI?
= 1,2
= 1.2
! A munka 100%-a kész → EV = BAC = 60; CPI = 60 / 50.

? A tervezett befejezés 20 hét volt, a tényleges 25 hét. Hány százalékos volt a késés?
= 25
= 25%
! (25 − 20) / 20 · 100.

? Melyik ok **nem** indokolja egy projekt idő előtti lezárását?
- megszűnt az üzleti eset
- a technológia nem működik
- reménytelen költségtúllépés
+ már sok pénzt költöttünk rá, ezért be kell fejezni
! Az elsüllyedt költség nem érv.

? A 4L retrospektív melyik „L” betűje kérdezi, mi hiányzott?
- Liked
- Learned
+ Lacked
- Longed for
! Lacked = hiányzott.

? Az üzleti eset 3 év alatt összesen 30 millió Ft hasznot ígért; az első évben 8 millió Ft valósult meg. Ha az ütem marad, hány millió Ft lesz a 3 év alatt?
= 24
= 24 millió
! 3 · 8.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Go vagy no-go?** Írd meg a `dontes(sikeres, sikertelen, nem_futott, kritikus, sulyos, min_arany=0.95, max_sulyos=3)` függvényt! `"GO"`-t ad, ha a sikerességi arány (a le nem futott teszt nem számít sikeresnek) legalább `min_arany`, nincs nyitott kritikus hiba, és a súlyos hibák száma legfeljebb `max_sulyos`; különben `"NO-GO"`-t.

```python starter
def dontes(sikeres, sikertelen, nem_futott, kritikus, sulyos, min_arany=0.95, max_sulyos=3):
    arany = sikeres / (sikeres + sikertelen)
    return "GO" if arany >= min_arany else "NO-GO"
```

<details>
<summary>Megoldás</summary>

```python solution
def dontes(sikeres, sikertelen, nem_futott, kritikus, sulyos, min_arany=0.95, max_sulyos=3):
    arany = sikeres / (sikeres + sikertelen + nem_futott)   # a le nem futott sem sikeres
    jo = arany >= min_arany and kritikus == 0 and sulyos <= max_sulyos
    return "GO" if jo else "NO-GO"
```

</details>

```python test
assert dontes(188, 7, 5, 0, 2) == "NO-GO"
assert dontes(193, 7, 0, 0, 2) == "GO"
assert dontes(195, 5, 0, 1, 0) == "NO-GO"
assert dontes(196, 4, 0, 0, 4) == "NO-GO"
print("Minden ellenőrzés sikeres!")
```

**2.** **Hasznok utólag.** Írd meg a `megterules(beruhazas, megtakaritasok)` függvényt, amely megadja, hányadik hónapban éri el a halmozott megtakarítás a beruházást (ha soha, `None`), és a `roi(beruhazas, megtakaritasok)` függvényt (a teljes időszak ROI-ja %-ban, egészre kerekítve)!

```python starter
def megterules(beruhazas, megtakaritasok):
    return round(beruhazas / (sum(megtakaritasok) / len(megtakaritasok)))

def roi(beruhazas, megtakaritasok):
    return round(100 * sum(megtakaritasok) / beruhazas)
```

<details>
<summary>Megoldás</summary>

```python solution
def megterules(beruhazas, megtakaritasok):
    halmozott = 0
    for honap, m in enumerate(megtakaritasok, 1):
        halmozott += m
        if halmozott >= beruhazas:
            return honap                   # itt térült meg
    return None

def roi(beruhazas, megtakaritasok):
    return round(100 * (sum(megtakaritasok) - beruhazas) / beruhazas)   # nyereség / befektetés
```

</details>

```python test
assert megterules(30, [10, 10, 5, 10]) == 4
assert megterules(100, [10] * 5) is None
assert megterules(60, [0.5, 1.0, 1.5, 2.0, 2.5] + [3.0] * 31) == 23
assert roi(50, [20, 20, 20]) == 20
print("Minden ellenőrzés sikeres!")
```

**3.** **Sikerpontszám.** Írd meg a `siker_pontszam(kriteriumok)` függvényt, amely `(terv, tény, súly, kevesebb_a_jobb)` négyesek listájából kiszámolja a súlyozott sikerpontszámot %-ban (egészre kerekítve)! A teljesítés „kevesebb a jobb” esetben terv/tény, egyébként tény/terv, de legfeljebb 1,2.

```python starter
def siker_pontszam(kriteriumok):
    return round(100 * sum(s * min(1.2, teny / terv) for terv, teny, s, _ in kriteriumok))
```

<details>
<summary>Megoldás</summary>

```python solution
def siker_pontszam(kriteriumok):
    osszeg = 0
    for terv, teny, suly, kevesebb in kriteriumok:
        t = terv / teny if kevesebb else teny / terv   # az irány számít
        osszeg += suly * min(1.2, t)
    return round(100 * osszeg)
```

</details>

```python test
assert siker_pontszam([(20, 23, 0.25, True), (50, 54, 0.25, True), (40, 38, 0.30, False), (4.0, 4.3, 0.20, False)]) == 95
assert siker_pontszam([(20, 20, 1, True)]) == 100
assert siker_pontszam([(10, 20, 0.5, True), (10, 20, 0.5, False)]) == 85
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Mi a retrospektív célja?
- a bűnös megtalálása
+ közösen tanulni: mi ment jól, mi nem, és mit csinálunk legközelebb másként
- a projekt költségének kiszámolása
- a szerződés lezárása
! A retrospektív hibáztatás nélküli, jövőre néző megbeszélés.

? Mi a teendő, ha egy projektet idő előtt le kell állítani?
- egyszerűen abbahagyni a munkát
+ rendezett lezárás: az eredmények és tanulságok rögzítése, szerződések zárása, a csapat elengedése
- titokban tovább folytatni
- új projektként újraindítani
! Egy leállított projektnek is kell zárás.

? 300 elfogadási tesztből 282 sikeres. Mennyi a sikerességi arány (%)?
= 94
! $282 / 300 = 0{,}94$.

? Egy rendszer 40 millióba került, és havi 2 millió Ft-ot takarít meg. Hányadik hónapban térül meg?
= 20
! $40 / 2 = 20$.
```
