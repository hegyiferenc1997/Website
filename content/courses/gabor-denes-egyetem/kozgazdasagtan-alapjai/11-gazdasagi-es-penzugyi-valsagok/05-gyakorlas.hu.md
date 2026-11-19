---
title: Gyakorlás – válságok és válságkezelés
summary: Ellenőrző kérdések és összefoglaló feladatlap a konjunktúraciklusról, a nagy válságok tanulságairól és a válságkezelés eszközeiről.
minutes: 55
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Miért mélyebbek általában a pénzügyi válságok, mint a „sima” recessziók?</summary>

Mert a bankrendszer sérülése megbénítja a hitelezést (a cégek nem kapnak forgóeszközhitelt, a háztartások lakáshitelt), az eszközárak zuhanása csökkenti a vagyont, és az eladósodott szereplők évekig a tartozásuk csökkentésére költenek fogyasztás és beruházás helyett.

</details>

<details>
<summary>2. Miért nem lett volna jó válasz az 1970-es évek olajválságára a nagyarányú keresletélénkítés?</summary>

Mert az kínálati sokk volt: a termelés lehetőségei romlottak (drágább energia). A keresletélénkítés a termelést tartósan nem tudta volna növelni, az inflációt viszont tovább gyorsította volna – éppen ez történt több országban, és ez vezetett a stagflációhoz.

</details>

<details>
<summary>3. Mit tanulhat a mai MI-befektetési hullám a dotcom-lufiból?</summary>

Hogy egy valóban forradalmi technológia mellett is lehetnek túlértékelt cégek: a befektetők a jövőbeli hatalmas nyereségeket előre beárazhatják, és ha ezek nem jönnek elég gyorsan, az árak zuhanhatnak. A technológia hosszú távon mégis átalakíthatja a gazdaságot – a nyertesek és a vesztesek viszont előre nehezen láthatók.

</details>

<details>
<summary>4. Miért kellett Magyarországnak 2008-ban nemzetközi hitelt felvennie, míg sok más országnak nem?</summary>

Mert egyszerre volt magas az államadósság és a költségvetési hiány, a háztartások jelentős része devizában adósodott el, és az ország erősen függött a külföldi finanszírozástól. Amikor a válságban a befektetők menekülni kezdtek, a forint gyengült, és az állam nem tudott piaci forráshoz jutni elfogadható kamaton.

</details>

## Összefoglaló feladatlap

Egy ország negyedéves reál GDP-je (index, előző negyedév = 100): I. 100,4; II. 99,7; III. 99,5; IV. 100,2.

```quiz required
? Technikai recesszióban volt-e az ország az év során?
+ igen
- nem
! A II. és a III. negyedévben egymás után csökkent a GDP.

? Hányadik negyedévben indult újra a növekedés?
= 4
= IV
! A IV. negyedév indexe 100 felett van.

? A potenciális GDP 200, a tényleges 192 (ezer milliárd Ft). Mennyi a kibocsátási rés a potenciális GDP százalékában? (Előjellel.)
= -4
= −4
! (192 − 200) / 200.

? A természetes munkanélküliségi ráta 4%. Az Okun-szabály (1 százalékpont ≈ 2% GDP-rés) szerint kb. mekkora lehet a tényleges munkanélküliségi ráta (%)?
= 6
= 6%
! 4% GDP-rés ≈ 2 százalékpont ciklikus munkanélküliség → 4 + 2.

? Melyik a legmegfelelőbb monetáris válasz egy keresleti visszaesésre, alacsony infláció mellett?
+ kamatcsökkentés
- kamatemelés
- a kötelező tartalék emelése
! Lazító monetáris politika.

? Egy bank válságba kerül; az EU-s szabályok szerint kinek kell először viselnie a veszteséget?
- az adófizetőknek
- a betéteseknek 100 000 euróig
+ a részvényeseknek és a hitelezőknek (bail-in)
! Az adófizetők pénze csak végső eszköz.

? Melyik esemény váltotta ki a nagy gazdasági világválságot?
+ az 1929. októberi New York-i tőzsdekrach
- a Lehman Brothers csődje
- az OPEC olajembargója
- a dotcom-lufi kipukkadása
! A hitelből felfújt részvénybuborék összeomlása.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Tőkeáttétel.** Egy befektető saját tőkéjének `attetel`-szeresét fekteti be (a többit hitelből). Írd meg a `tokeattetel(attetel, arvaltozas)` függvényt, amely megadja, hány %-kal változik a saját tőkéje, ha az eszköz ára `arvaltozas` %-kal mozdul! A veszteség nem lehet nagyobb 100%-nál (ennyinél elfogy a tőke). 1 tizedesre kerekíts.

```python starter
def tokeattetel(attetel, arvaltozas):
    return round(arvaltozas, 1)
```

<details>
<summary>Megoldás</summary>

20-szoros áttételnél már egy 5%-os esés is elviszi a teljes tőkét – 2008-ban sok bank ilyen áttétellel dolgozott.

```python solution
def tokeattetel(attetel, arvaltozas):
    valtozas = attetel * arvaltozas          # a hitel felnagyítja a mozgást
    return round(max(-100.0, valtozas), 1) + 0.0
```

</details>

```python test
assert tokeattetel(1, -5) == -5.0
assert tokeattetel(10, -5) == -50.0
assert tokeattetel(20, -6) == -100.0
assert tokeattetel(10, 3) == 30.0
print("Minden ellenőrzés sikeres!")
```

**2.** **Az adósságráta pályája.** Az államadósság a GDP `d0` %-a, a kamat `r` %, a nominális GDP-növekedés `g` %, az elsődleges egyenleg többlete a GDP `primer` %-a évente. Írd meg az `adossag_palya(d0, r, g, primer, ev)` függvényt, amely `ev` év után megadja az adósságrátát (%, 1 tizedesre)! Egy év: $d \leftarrow d \cdot \frac{1 + r}{1 + g} - \text{primer}$.

```python starter
def adossag_palya(d0, r, g, primer, ev):
    return round(d0 + ev * (r - g) - ev * primer, 1)
```

<details>
<summary>Megoldás</summary>

Ha a kamat kisebb a növekedésnél ($r < g$), az adósságráta magától is csökken; ha nagyobb, csak elsődleges többlettel tartható kordában.

```python solution
def adossag_palya(d0, r, g, primer, ev):
    d = d0
    for _ in range(ev):
        d = d * (1 + r / 100) / (1 + g / 100) - primer   # kamat növeli, a GDP-növekedés hígítja
    return round(d, 1)
```

</details>

```python test
assert adossag_palya(80, 3, 5, 0, 10) == 66.0
assert adossag_palya(80, 5, 3, 0, 10) == 97.0
assert adossag_palya(80, 5, 3, 1, 10) == 86.0
assert adossag_palya(60, 2, 2, 1, 5) == 55.0
print("Minden ellenőrzés sikeres!")
```

**3.** **Legnagyobb visszaesés (drawdown).** Írd meg a `legnagyobb_eses(arak)` függvényt, amely egy árfolyam-idősorból megadja a legnagyobb, egy korábbi csúcstól mért esést %-ban (1 tizedesre)! Ez a kockázatkezelés egyik legfontosabb mutatója.

```python starter
def legnagyobb_eses(arak):
    return round(100 * (max(arak) - min(arak)) / max(arak), 1)
```

<details>
<summary>Megoldás</summary>

A kiinduló kód a minimumot a maximumhoz méri akkor is, ha a minimum a csúcs ELŐTT volt – egy folyamatosan emelkedő árfolyamnál is esést mutatna.

```python solution
def legnagyobb_eses(arak):
    csucs, legrosszabb = arak[0], 0.0
    for ar in arak:
        csucs = max(csucs, ar)                           # az eddigi legmagasabb ár
        legrosszabb = max(legrosszabb, (csucs - ar) / csucs)
    return round(100 * legrosszabb, 1)
```

</details>

```python test
assert legnagyobb_eses([100, 120, 90, 130, 104, 150]) == 25.0
assert legnagyobb_eses([100, 110, 120]) == 0.0
assert legnagyobb_eses([100, 60, 80, 50, 200]) == 50.0
assert legnagyobb_eses([50, 100, 75, 100, 40]) == 60.0
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Mi a buborék?
+ amikor egy eszköz ára tartósan messze a valódi értéke (várható hozamai) fölé emelkedik, mert a vevők további drágulásra számítanak
- amikor a jegybank pénzt nyomtat
- amikor csökken a GDP két negyedévig
- amikor egy bank csődbe megy
! Az önbeteljesítő várakozás egy ideig fenntartja az árat, aztán hirtelen összeomlik.

? Miért veszélyes a bankroham egy egészséges bank számára is?
- mert a bank ellopja a pénzt
+ mert a betétek nagy részét hitelekbe fektette, így egyszerre nem tud mindenkinek fizetni
- mert a jegybank megtiltja a kifizetést
- mert a betétek elértéktelenednek
! Részleges tartalékolás: a bank likvid eszközei a betétek kis töredékét fedezik.

? Mi a recesszió szokásos (technikai) meghatározása?
+ két egymást követő negyedévben csökken a reál-GDP
- az infláció 10% fölé emelkedik
- a munkanélküliség 5% fölé emelkedik
- a tőzsde 20%-ot esik
! Ez egyszerű hüvelykujjszabály, a hivatalos megállapítás több mutatót néz.

? Egy befektető 10-szeres tőkeáttétellel vesz részvényt, amely 4%-ot esik. Hány %-ot veszít a saját tőkéjéből?
= 40
! $10 \cdot 4 = 40$.

? Mit csinál a jegybank válságban „végső hitelezőként”?
- adót emel
+ likviditást (hitelt) nyújt a fizetőképes, de átmenetileg pénzszűkében lévő bankoknak
- bezárja a bankokat
- megszünteti a betétbiztosítást
! A cél a pánik és a bankrohamok megfékezése.
```
