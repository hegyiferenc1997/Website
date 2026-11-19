---
title: Gyakorlás – technológiai trendek
summary: Ellenőrző kérdések és összefoglaló feladatlap a második témakörhöz.
minutes: 45
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Mi a különbség egy technológiai trend és egy divat között?</summary>

A trend tartós (több éves) és széles körű, mérhető beruházások és piaci növekedés állnak mögötte. A divat rövid életű, és nem alakítja át az iparágakat.

</details>

<details>
<summary>2. Egy startup a saját szerverei helyett virtuális gépeket bérel az AWS-től. Milyen felhőmodell ez, és mi az előnye?</summary>

IaaS. Nem kell előre nagy összeget hardverre költeni, a kapacitás igény szerint növelhető vagy csökkenthető, és csak a használatért fizet.

</details>

<details>
<summary>3. Egy technológia a hype-ciklus mélypontján van. Mit javasolnál egy cégnek?</summary>

Ne írja le végleg: figyelje, mely alkalmazások bizonyítanak, és kis, kontrollált pilot projektekkel készüljön fel a megvilágosodás lejtőjére, amikor a technológia beérik.

</details>

<details>
<summary>4. Miért nehéz átjutni a „szakadékon”?</summary>

Mert a korai többség pragmatikus: kész, megbízható, referenciákkal igazolt megoldást akar, a korai alkalmazók lelkesedése nem elég meggyőző számukra.

</details>

<details>
<summary>5. Egy kutatócsoport laborban igazolta, hogy az új algoritmusuk működik. Körülbelül melyik TRL-szinten vannak?</summary>

TRL 3–4: a koncepció kísérleti igazolása, illetve laboratóriumi validálás. Valós környezetbeli bemutatás (TRL 5–6) még hátravan.

</details>

## Összefoglaló feladatlap

```quiz required
? Egy cég a CRM-rendszerét böngészőből, havidíjért használja, telepítés nélkül. Melyik modell?
- IaaS
- PaaS
+ SaaS
! Kész alkalmazás szolgáltatásként.

? Melyik trendhez tartozik az RPA?
- kvantum-számítástechnika
+ automatizálás (szoftverrobotok ismétlődő irodai feladatokra)
- kiterjesztett valóság
- blokklánc
! Robotic Process Automation.

? A hype-ciklus melyik szakasza **követi közvetlenül** a kiábrándulás mélypontját?
- a felfokozott várakozások csúcsa
+ a megvilágosodás lejtője
- a termelékenység fennsíkja
- technológiai kiváltó ok
! Csúcs → mélypont → lejtő → fennsík.

? Egy 2026-os chipen 20 milliárd tranzisztor van. Kétévenkénti duplázódással hány milliárd lenne 2032-ben?
= 160
= 160 milliárd
! 6 év = 3 duplázás: 20 · 2³.

? Rogers szerint hány százalék a korai és a késői többség **együtt**?
= 68
= 68%
! 34% + 34%.

? Melyik Rogers-tényező jelenti, hogy egy újdonságot **könnyű kipróbálni** vásárlás előtt?
- kompatibilitás
- megfigyelhetőség
+ kipróbálhatóság
- relatív előny
! Pl. ingyenes próbaidőszak egy szoftvernél.

? Egy rendszer prototípusát már valós működési környezetben mutatták be, de a kész rendszer minősítése még nincs meg. Melyik TRL ez?
= 7
= TRL 7
! TRL 7 = rendszerprototípus működési környezetben; a TRL 8 a minősített kész rendszer.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Moore törvénye.** Írd meg a `moore(ev, alap_ev=1971, alap_db=2300, duplazas=2)` függvényt, amely megadja a várható tranzisztorszámot (egészre kerekítve), ha a szám `duplazas` évente megduplázódik!

```python starter
def moore(ev, alap_ev=1971, alap_db=2300, duplazas=2):
    return round(alap_db * 2 * (ev - alap_ev) / duplazas)
```

<details>
<summary>Megoldás</summary>

```python solution
def moore(ev, alap_ev=1971, alap_db=2300, duplazas=2):
    return round(alap_db * 2 ** ((ev - alap_ev) / duplazas))   # exponenciális növekedés
```

</details>

```python test
assert moore(1971) == 2300
assert moore(1981) == 73600
assert moore(1977, duplazas=3) == 9200
print("Minden ellenőrzés sikeres!")
```

**2.** **Bass-modell.** Írd meg a `bass(M, p, q, evek)` függvényt, amely évenként megadja az új vásárlók számát (egészre kerekítve, listában): új = $(p + q \cdot N/M)(M - N)$, ahol $N$ az eddigi vásárlók száma!

```python starter
def bass(M, p, q, evek):
    N, ujak = 0, []
    for _ in range(evek):
        uj = p * (M - N)
        N += uj
        ujak.append(round(uj))
    return ujak
```

<details>
<summary>Megoldás</summary>

A kiinduló kód kihagyja az utánzókat, pedig a valóságban ők adják a vásárlók többségét.

```python solution
def bass(M, p, q, evek):
    N, ujak = 0, []
    for _ in range(evek):
        uj = (p + q * N / M) * (M - N)     # újítók + utánzók
        N += uj
        ujak.append(round(uj))
    return ujak
```

</details>

```python test
assert bass(1000, 0.03, 0.38, 2) == [30, 40]
assert bass(1000, 0.1, 0, 3) == [100, 90, 81]
assert bass(1_000_000, 0.03, 0.38, 8)[-1] == 110481
print("Minden ellenőrzés sikeres!")
```

**3.** **S-görbe.** A teljesítmény $f(t) = \frac{H}{1 + e^{-k(t - t_0)}}$. Írd meg a `legnagyobb_javulas(H, k, t0, evek)` függvényt, amely megadja, melyik évben (1-től `evek`-ig) a legnagyobb az egyéves javulás, $f(t) - f(t - 1)$!

```python starter
def legnagyobb_javulas(H, k, t0, evek):
    return evek
```

<details>
<summary>Megoldás</summary>

A legnagyobb javulás az inflexiós pont ($t_0$) környékén van, nem a görbe végén – onnan kezdve érdemes a következő technológiát figyelni.

```python solution
import math

def legnagyobb_javulas(H, k, t0, evek):
    f = lambda t: H / (1 + math.exp(-k * (t - t0)))
    return max(range(1, evek + 1), key=lambda t: f(t) - f(t - 1))   # a legmeredekebb év
```

</details>

```python test
assert legnagyobb_javulas(100, 0.6, 10.5, 20) == 11
assert legnagyobb_javulas(100, 1, 5.5, 15) == 6
assert legnagyobb_javulas(50, 0.3, 20.5, 30) == 21
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Ha egy mennyiség 3 évente duplázódik, hányszorosára nő 12 év alatt?
= 16
! $2^{12/3} = 2^4 = 16$.

? Mit mutat a Gartner-féle hype-ciklus?
+ hogy egy új technológia körüli várakozások először túlzottan felfutnak, majd csalódás után reális szintre állnak be
- hogy a technológiák ára folyamatosan csökken
- hogy minden technológia 10 év alatt elterjed
- a tranzisztorok számának növekedését
! A csúcs után jön a „kiábrándulás völgye”, majd a „termelékenység fennsíkja”.

? A Bass-modellben $M = 500$, $N = 100$, $p = 0{,}05$, $q = 0{,}5$. Hány új vásárló jön a következő időszakban?
= 60
! $(0{,}05 + 0{,}5 \cdot 0{,}2) \cdot 400 = 0{,}15 \cdot 400 = 60$.

? Mit jelent a TRL-skála 9-es szintje?
- az alapelvek megfigyelése
- laboratóriumi prototípus
+ a technológia bizonyítottan működik valós, éles környezetben
- a technológia elavult
! A TRL 1-től (alapelvek) 9-ig (bevált éles működés) méri az érettséget.
```
