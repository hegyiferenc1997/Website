---
title: Gyakorlás – projektmenedzsment alapjai
summary: Ellenőrző kérdések és összefoglaló feladatlap a hatodik témakörhöz.
minutes: 45
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Projekt-e a „weboldal karbantartása”? És a „weboldal áttervezése”?</summary>

A karbantartás folyamatos, ismétlődő működés, nem projekt. Az áttervezés projekt: ideiglenes, van kezdete és vége, és egyedi eredményt (az új weboldalt) hoz létre.

</details>

<details>
<summary>2. A megrendelő két héttel korábbra kéri az átadást. Milyen lehetőségei vannak a projektmenedzsernek a vasháromszög alapján?</summary>

Csökkentheti a terjedelmet (kevesebb funkció az első átadásra), növelheti a költséget (több ember, túlóra), vagy – a legrosszabb – a minőségből enged (kevesebb tesztelés). Erről a megrendelővel közösen kell dönteni.

</details>

<details>
<summary>3. Miért kell a projekt alapító okiratot jóváhagyatni?</summary>

Mert ezzel indul hivatalosan a projekt: rögzíti a célt, a fő korlátokat, és felhatalmazza a projektmenedzsert az erőforrások felhasználására. Jóváhagyás nélkül nincs egyértelmű megbízás.

</details>

<details>
<summary>4. Miért a projekt elején a legnagyobb a kockázat, és mégis miért ott a legolcsóbb változtatni?</summary>

Az elején még sok minden ismeretlen, ezért nagy a bizonytalanság. Ugyanakkor még kevés munka készült el, így egy döntés megváltoztatása csak a terveket érinti, nem kell kész munkát kidobni.

</details>

## Összefoglaló feladatlap

```quiz required
? Melyik **nem** jellemzője a projektnek?
- ideiglenes
- egyedi eredményt hoz létre
+ ugyanazt az eredményt ismétli újra és újra
- korlátozott erőforrásokkal dolgozik
! Az ismétlődés a folyamatos működés jellemzője.

? Az agilis megközelítés a vasháromszög melyik elemét hagyja **változni**?
- idő
- költség
+ terjedelem
- egyiket sem
! Az idő (sprint) és a költség (csapat) rögzített, a terjedelem rugalmas.

? Melyik folyamatcsoportban történik a tanulságok (lessons learned) összegyűjtése?
- kezdeményezés
- végrehajtás
- nyomon követés és ellenőrzés
+ lezárás
! A lezárás része az átadás, a szerződészárás és a tanulságok rögzítése.

? Melyik folyamatcsoport része a változáskérések kezelése?
- kezdeményezés
- tervezés
+ nyomon követés és ellenőrzés
- lezárás
! A változáskezelés az ellenőrzés része.

? Melyik szervezet adja ki a PMBOK útmutatót? (rövidítés)
= PMI
! Project Management Institute.

? Melyik PRINCE2-alapelv mondja ki, hogy a projektnek végig üzletileg igazoltnak kell lennie?
+ folyamatos üzleti igazolás
- termékközpontúság
- kivétel alapú vezetés
- tanulás a tapasztalatokból
! Ha az üzleti eset megszűnik, a projektet le kell állítani.

? Melyik eszközt használnád a tevékenységek **idővonalon** történő ábrázolására?
- RACI-mátrix
+ Gantt-diagram
- kockázatnyilvántartás
- üzleti modell vászon
! Sorokban a tevékenységek, vízszintesen az idő.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Kommunikációs csatornák.** Írd meg a `csatornak(n)` függvényt (egy `n` fős csapat csatornáinak száma) és az `alcsapat_csatornak(meretek)` függvényt, amely alcsapatoknál a belső csatornák és az alcsapatvezetők egymás közötti csatornáinak összegét adja!

```python starter
def csatornak(n):
    return n * (n - 1)

def alcsapat_csatornak(meretek):
    return sum(csatornak(m) for m in meretek)
```

<details>
<summary>Megoldás</summary>

```python solution
def csatornak(n):
    return n * (n - 1) // 2                # minden pár egy csatorna

def alcsapat_csatornak(meretek):
    return sum(csatornak(m) for m in meretek) + csatornak(len(meretek))   # + a vezetők egymás közt
```

</details>

```python test
assert csatornak(6) == 15
assert csatornak(12) == 66
assert alcsapat_csatornak([6, 6]) == 31
assert alcsapat_csatornak([4, 4, 4]) == 21
print("Minden ellenőrzés sikeres!")
```

**2.** **Létszám és időtartam.** Írd meg az `idotartam(munka, n, veszteseg)` függvényt: `n` ember, akik közül minden további tag mindenki hatékonyságát `veszteseg` aránnyal csökkenti, hány hét alatt végez `munka` emberhétnyi feladattal (1 tizedesre)? A `legrovidebb(munka, veszteseg, max_n)` adja meg, hány fővel (1 és `max_n` között) a legrövidebb a projekt!

```python starter
def idotartam(munka, n, veszteseg):
    return round(munka / n, 1)

def legrovidebb(munka, veszteseg, max_n):
    return max_n
```

<details>
<summary>Megoldás</summary>

Egy ponton túl minden új ember többet visz el a kommunikációval, mint amennyit hozzátesz – ez Brooks törvényének lényege.

```python solution
def idotartam(munka, n, veszteseg):
    return round(munka / (n * (1 - veszteseg * (n - 1))), 1)   # hatékony kapacitás

def legrovidebb(munka, veszteseg, max_n):
    jo = [n for n in range(1, max_n + 1) if 1 - veszteseg * (n - 1) > 0]
    return min(jo, key=lambda n: munka / (n * (1 - veszteseg * (n - 1))))
```

</details>

```python test
assert idotartam(120, 10, 0.03) == 16.4
assert idotartam(60, 3, 0.05) == 22.2
assert legrovidebb(120, 0.03, 30) == 17
assert legrovidebb(120, 0.04, 30) == 13
print("Minden ellenőrzés sikeres!")
```

**3.** **Korai átvizsgálás.** Egy hiba javítása a követelményfázisban `alap` Ft, a tesztelésben 20-szor annyi. Írd meg az `osszes_koltseg(hibak, alap, kiszures, atvizsgalas)` függvényt: egy `atvizsgalas` Ft-os követelmény-átvizsgálás a hibák `kiszures` arányát már az elején kiszűri, a többit a tesztelésben javítjuk. Mennyi az összes költség (egészre kerekítve)?

```python starter
def osszes_koltseg(hibak, alap, kiszures, atvizsgalas):
    return round(atvizsgalas + hibak * alap * 20)
```

<details>
<summary>Megoldás</summary>

```python solution
def osszes_koltseg(hibak, alap, kiszures, atvizsgalas):
    korai = hibak * kiszures * alap                # olcsón, a követelményfázisban
    kesoi = hibak * (1 - kiszures) * alap * 20     # drágán, a tesztelésben
    return round(atvizsgalas + korai + kesoi)
```

</details>

```python test
assert osszes_koltseg(40, 50_000, 0.6, 600_000) == 17_800_000
assert osszes_koltseg(40, 50_000, 0, 0) == 40_000_000
assert osszes_koltseg(10, 20_000, 0.5, 100_000) == 2_200_000
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Mi a projekt háromszög három csúcsa?
+ terjedelem, idő, költség
- csapat, ügyfél, szponzor
- tervezés, végrehajtás, lezárás
- kockázat, minőség, kommunikáció
! Ha az egyik változik, legalább egy másiknak is változnia kell.

? Mi különbözteti meg a projektet a folyamatos működéstől?
- a projekt mindig drágább
+ a projekt egyedi és ideiglenes: van kezdete és vége
- a projektben nincs csapat
- a folyamatos működésnek van határideje
! A működés ismétlődő, a projekt egyszeri eredményt hoz létre.

? Hány kommunikációs csatorna van egy 8 fős csapatban?
= 28
! $\frac{8 \cdot 7}{2} = 28$.

? Melyik folyamatcsoport része a változások nyomon követése és ellenőrzése?
- kezdeményezés
- lezárás
+ nyomon követés és ellenőrzés
- tervezés
! Ez a folyamatcsoport a projekt teljes életciklusán végigfut.
```
