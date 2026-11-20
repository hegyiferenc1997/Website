---
title: Gyakorlás – jövőbeli informatikai trendek
summary: Ellenőrző kérdések és összefoglaló feladatlap az MI-ről, az IoT-ről, az Ipar 4.0-ról, a blokkláncról és a zöld informatikáról.
minutes: 45
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Egy kolléga bemásolja egy ügyfél teljes szerződését egy ingyenes, nyilvános MI-csevegőbe, hogy foglalja össze. Mi a gond, és mi lenne a jobb megoldás?</summary>

Bizalmas adat került egy ellenőrizetlen külső szolgáltatóhoz (üzleti titok, személyes adatok, GDPR). Jobb: a cég által jóváhagyott, vállalati szerződésű MI-eszköz, amely nem tanul az adatokból, és az összefoglalót is ellenőrizni kell.

</details>

<details>
<summary>2. Miért nem érdemes blokkláncot használni egy cég belső raktárnyilvántartásához?</summary>

Mert egy szereplő (a cég) kezeli, a résztvevők megbíznak benne – egy hagyományos adatbázis gyorsabb, olcsóbb és egyszerűbb. A blokklánc ott hasznos, ahol több, egymásban nem bízó fél osztozik egy nyilvántartáson.

</details>

<details>
<summary>3. Hogyan segíthet egy gyárnak a prediktív karbantartás?</summary>

A gépek rezgés-, hő- és áramfelvételi adataiból egy modell előre jelzi a meghibásodást, így a cserét tervezett időpontban végzik, nem áll le váratlanul a gyártósor, és nem cserélnek feleslegesen ép alkatrészt.

</details>

```python run
# Egyszerű „prediktív karbantartás”: a rezgés mozgóátlaga átlépi-e a küszöböt?
rezges = [2.1, 2.0, 2.3, 2.2, 2.6, 3.1, 3.4, 3.9, 4.4]
kuszob = 3.5
for i in range(2, len(rezges)):
    atlag = sum(rezges[i - 2:i + 1]) / 3
    allapot = "RIASZTÁS – karbantartás kell" if atlag > kuszob else "rendben"
    print(f"{i}. mérés, mozgóátlag {atlag:.2f}: {allapot}")
```

## Összefoglaló feladatlap

```quiz required
? Melyik a **generatív MI** példája?
- egy szűrő, amely a spamet elkülöníti
+ egy modell, amely leírás alapján új képet készít
- egy hőmérő
- egy táblázatkezelő SUM függvénye
! A generatív modell új tartalmat hoz létre.

? Melyik könnyű üzenetküldő protokoll terjedt el az IoT-eszközöknél?
= MQTT
! Message Queuing Telemetry Transport.

? Hányadik mérésnél jelez először riasztást a fenti szimuláció?
= 8
! A 7. mérésnél a mozgóátlag (3,1 + 3,4 + 3,9) / 3 ≈ 3,47 még a küszöb alatt van, a 8.-nál (3,4 + 3,9 + 4,4) / 3 = 3,9 már fölötte.

? Mit fenyeget leginkább egy elég nagy kvantumszámítógép?
+ a mai nyilvános kulcsú titkosítást (pl. RSA)
- a Wi-Fi sebességét
- a merevlemezek kapacitását
- a monitorok felbontását
! Ezért kell kvantumbiztos titkosítás.

? Mit tesz az EU MI-rendelete a **nagy kockázatú** MI-rendszerekkel (pl. toborzás)?
- teljesen szabadon engedi őket
+ szigorú követelményeket ír elő rájuk
- csak az USA-ban engedi
- kötelezővé teszi őket
! Kockázatalapú szabályozás.

? Melyik segít a **zöld informatikában**?
+ a felesleges felhős gépek leállítása
- minden eszköz évente cseréje
- a kód lassítása
- több másolat minden adatról, mindenhol
! A ki nem használt erőforrás is fogyaszt.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Egyenes illesztése.** Írd meg az `illeszt(xek, yok)` függvényt, amely a legkisebb négyzetek módszerével visszaadja a `(tengelymetszet, meredekseg)` párt, mindkettőt két tizedesre kerekítve!

```python starter
def illeszt(xek, yok):
    return (0, 0)
```

<details>
<summary>Megoldás</summary>

```python solution
def illeszt(xek, yok):
    n = len(xek)
    ax, ay = sum(xek) / n, sum(yok) / n
    m = sum((x - ax) * (y - ay) for x, y in zip(xek, yok)) / sum((x - ax) ** 2 for x in xek)
    return (round(ay - m * ax, 2), round(m, 2))   # az egyenes átmegy az átlagponton
```

</details>

```python test
assert illeszt([1, 2, 3], [2, 4, 6]) == (0.0, 2.0)
assert illeszt([0, 1, 2, 3], [1, 3, 5, 7]) == (1.0, 2.0)
assert illeszt([1, 2, 3, 4], [3, 4, 4, 5]) == (2.5, 0.6)
print("Minden ellenőrzés sikeres!")
```

**2.** **Precízió és felidézés.** Írd meg a `mutatok(valodi, josolt)` függvényt, amely két azonos hosszú, `True`/`False` értékekből álló listából `(precizio, felidezes)` párt ad, két tizedesre kerekítve! Ha nincs egyetlen pozitív jóslat (vagy valódi pozitív) sem, az adott mutató legyen 0.

```python starter
def mutatok(valodi, josolt):
    jo = sum(v == j for v, j in zip(valodi, josolt))
    return (round(jo / len(valodi), 2), round(jo / len(valodi), 2))
```

<details>
<summary>Megoldás</summary>

```python solution
def mutatok(valodi, josolt):
    tp = sum(v and j for v, j in zip(valodi, josolt))          # helyesen jelzett
    fp = sum((not v) and j for v, j in zip(valodi, josolt))    # téves riasztás
    fn = sum(v and (not j) for v, j in zip(valodi, josolt))    # kimaradt
    p = tp / (tp + fp) if tp + fp else 0
    r = tp / (tp + fn) if tp + fn else 0
    return (round(p, 2), round(r, 2))
```

</details>

```python test
v = [True, True, False, False, True, False]
j = [True, False, True, False, True, False]
assert mutatok(v, j) == (0.67, 0.67)
assert mutatok([True, False], [False, False]) == (0, 0.0)
assert mutatok([True, True, False, False], [True, True, True, True]) == (0.5, 1.0)
print("Minden ellenőrzés sikeres!")
```

**3.** **Adatközpont PUE.** Írd meg a `pue_megtakaritas(it_kw, regi_pue, uj_pue)` függvényt, amely megadja, hány MWh energiát takarít meg évente (365 nap · 24 óra), ha az adatközpont PUE-értéke `regi_pue`-ról `uj_pue`-ra javul! Egészre kerekítve add vissza.

```python starter
def pue_megtakaritas(it_kw, regi_pue, uj_pue):
    return round(it_kw * (regi_pue - uj_pue))
```

<details>
<summary>Megoldás</summary>

```python solution
def pue_megtakaritas(it_kw, regi_pue, uj_pue):
    return round(it_kw * (regi_pue - uj_pue) * 24 * 365 / 1000)   # kW · óra → MWh
```

</details>

```python test
assert pue_megtakaritas(500, 2.0, 1.5) == 2190
assert pue_megtakaritas(100, 1.2, 1.2) == 0
assert pue_megtakaritas(1000, 1.6, 1.1) == 4380
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Egy modell 10 000 tranzakcióból 9 900-ra helyesen mondja, hogy nem csalás, de a 100 csalásból egyet sem talál meg. Mennyi a pontossága százalékban?
= 99
! $9900 / 10000 = 99\%$, mégis haszontalan: a felidézése 0.

? Egy blokklánc nehézsége 3 hexadecimális nulla. Átlagosan kb. hány próbálkozás kell egy érvényes hash-hez?
= 4096
! $16^3 = 4096$.

? Milyen gyorsítást ad a Grover-algoritmus egy rendezetlen adathalmazban való keresésnél?
- exponenciálisat
+ négyzetest ($N$ helyett kb. $\sqrt{N}$ lépés)
- semmilyet
- lineárisat (fele annyi lépés)
! Ezért elég a szimmetrikus kulcsok hosszát megduplázni.

? Miért nem megbízható egy tanult modell jóslata a látott adatok tartományán kívül?
- mert a számítógép ott lassabb
+ mert a modell csak a látott mintázatokat ismeri, kívül azokat vakon folytatja (extrapolál)
- mert ott több a memóriahiba
- mert a modell ott véletlenszámot ad
! Ez a „hallucináció” egyik oka is.
```
