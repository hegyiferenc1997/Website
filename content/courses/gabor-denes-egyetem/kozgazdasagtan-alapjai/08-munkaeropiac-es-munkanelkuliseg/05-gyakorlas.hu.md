---
title: Gyakorlás – munkaerőpiac
summary: Ellenőrző kérdések és összefoglaló feladatlap a létszámdöntésről, a munkanélküliség fajtáiról, az Okun-törvényről és az oktatás megtérüléséről.
minutes: 55
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Miért nem lehet a munkanélküliséget tartósan nullára csökkenteni?</summary>

Mert a súrlódásos és a strukturális munkanélküliség mindig jelen van: az emberek munkahelyet váltanak, frissen lépnek be a munkaerőpiacra, a gazdaság szerkezete folyamatosan változik. Ezek együtt adják a természetes rátát.

</details>

<details>
<summary>2. Egy AI-eszköz megduplázza a programozók termelékenységét. Csökkenni fog-e szükségszerűen a programozók iránti kereslet?</summary>

Nem szükségszerűen. Magasabb termelékenységnél nő a munka határtermékének értéke (MRP), olcsóbb lesz a szoftver, így több szoftverre lehet kereslet. Az eredmény attól függ, mennyire rugalmas a szoftverek iránti kereslet, és mely feladatokat vált ki az eszköz.

</details>

<details>
<summary>3. Miért lehet a minimálbér emelése rossz hír egy pályakezdő számára, és miért lehet jó?</summary>

Rossz: ha az új minimálbér a termelékenységénél (MRP) magasabb, a cégnek nem éri meg felvenni. Jó: ha felveszik, többet keres, és ha a munkáltatónak bérmegállapító ereje van, a magasabb bér akár a foglalkoztatást is növelheti.

</details>

<details>
<summary>4. Miért alakult ki az 1970-es években stagfláció, és mit mondott ez a Phillips-görbéről?</summary>

Az olajársokkok költséginflációt okoztak, a magas inflációs várakozások pedig felfelé tolták a Phillips-görbét: magas infláció és magas munkanélküliség egyszerre. Ez megmutatta, hogy a Phillips-görbe szerinti átváltás nem stabil, a várakozásoktól függ.

</details>

## Összefoglaló feladatlap

Egy kiberbiztonsági cég egy auditot 600 000 Ft-ért ad el. A havi bér elemzőnként 1 000 000 Ft.

| Elemzők száma | 1   | 2   | 3   | 4   | 5   |
| ------------- | --- | --- | --- | --- | --- |
| Audit / hó    | 3   | 5   | 6,5 | 7,5 | 8   |

```quiz required
? Mennyi a 3. elemző határterméke (audit / hó)?
= 1,5
= 1.5
! 6,5 − 5.

? Mennyi a 3. elemző határtermékének értéke (ezer Ft)?
= 900
! 1,5 · 600.

? Hány elemzőt éri meg alkalmazni?
= 2
! A 2. MRP-je 2 · 600 = 1200 ezer ≥ 1000, a 3.-é 900 < 1000.

? A természetes ráta 4,5%, a tényleges 6%. Az Okun-szabály szerint hány százalékos a GDP-rés?
= 3
= 3%
! (6 − 4,5) · 2.

? Egy bootcamp 2 millió Ft, közben 1 millió Ft keresetről mondasz le; utána évente 1,2 millió Ft-tal többet keresel. Hány év az egyszerű megtérülési idő?
= 2,5
= 2.5
! 3 / 1,2.

? Egy síoktató nyáron munka nélkül van. Milyen munkanélküliség ez?
- strukturális
- ciklikus
+ szezonális
! Az évszakhoz kötött.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Minimálbér és munkanélküliség.** A munkaerő-kereslet $L_D = a - bw$, a kínálat $L_S = c + dw$. Írd meg a `minimalber(a, b, c, d, w_min)` függvényt, amely a `(foglalkoztatás, munkát keresők, de nem találók)` párt adja vissza! Ha a minimálbér az egyensúlyi bér alatt van, nem köt (az egyensúly érvényes). 1 tizedesre kerekíts.

```python starter
def minimalber(a, b, c, d, w_min):
    return (round(a - b * w_min, 1), round((c + d * w_min) - (a - b * w_min), 1))
```

<details>
<summary>Megoldás</summary>

A kiinduló kód a nem kötő minimálbérnél negatív munkanélküliséget adna.

```python solution
def minimalber(a, b, c, d, w_min):
    w_e = (a - c) / (b + d)                       # egyensúlyi bér
    w = max(w_min, w_e)                           # az egyensúly alatti minimálbér nem köt
    fogl = min(a - b * w, c + d * w)              # a rövidebb oldal dönt
    return (round(fogl, 1), round(c + d * w - fogl, 1))
```

</details>

```python test
assert minimalber(1000, 2, -500, 3, 350) == (300.0, 250.0)
assert minimalber(1000, 2, -500, 3, 280) == (400.0, 0.0)
assert minimalber(1000, 2, -500, 3, 340) == (320.0, 200.0)
print("Minden ellenőrzés sikeres!")
```

**2.** **Okun-törvény.** Írd meg az `okun(rata, termeszetes, egyutthato=2.0, potencialis=None)` függvényt, amely a kibocsátási rést adja vissza %-ban 1 tizedesre; ha a potenciális GDP is meg van adva, akkor a `(rés, elmaradt kibocsátás)` párt (az elmaradt kibocsátás nem lehet negatív, egészre kerekítve)!

```python starter
def okun(rata, termeszetes, egyutthato=2.0, potencialis=None):
    return round(rata - termeszetes, 1)
```

<details>
<summary>Megoldás</summary>

```python solution
def okun(rata, termeszetes, egyutthato=2.0, potencialis=None):
    res = round(-egyutthato * (rata - termeszetes), 1) + 0.0   # + 0.0: ne legyen "-0.0"
    if potencialis is None:
        return res
    return (res, round(max(0.0, -res) / 100 * potencialis))
```

</details>

```python test
assert okun(7, 5) == -4.0
assert okun(4, 5) == 2.0
assert okun(6.5, 4, potencialis=80_000) == (-5.0, 4000)
assert okun(4, 4, potencialis=80_000) == (0.0, 0)
print("Minden ellenőrzés sikeres!")
```

**3.** **A munkanélküliség fürdőkádja.** Írd meg a `tartos_rata(s, f)` függvényt, amely a havi állásvesztési (`s`) és álláskeresési (`f`) arányból megadja a tartós munkanélküliségi rátát %-ban, 1 tizedesre, és a `honapok_alatt(u0, s, f, honap)` függvényt, amely `honap` hónapos szimuláció után adja meg a rátát (szintén %-ban, 1 tizedesre)!

```python starter
def tartos_rata(s, f):
    return round(100 * s / f, 1)

def honapok_alatt(u0, s, f, honap):
    return round(100 * u0, 1)
```

<details>
<summary>Megoldás</summary>

```python solution
def tartos_rata(s, f):
    return round(100 * s / (s + f), 1)     # beáramlás = kiáramlás

def honapok_alatt(u0, s, f, honap):
    u = u0
    for _ in range(honap):
        u = u + s * (1 - u) - f * u        # a dolgozókból befolyik, a munkanélküliekből kifolyik
    return round(100 * u, 1)
```

</details>

```python test
assert tartos_rata(0.01, 0.10) == 9.1
assert tartos_rata(0.02, 0.18) == 10.0
assert honapok_alatt(0.10, 0.01, 0.30, 60) == 3.2
assert honapok_alatt(0.10, 0.01, 0.30, 1) == 7.9
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Melyik a strukturális munkanélküliség példája?
- valaki két állás között keres új munkát
+ az automatizálás miatt megszűnnek a bolti pénztárosi állások, és az érintettek tudása nem illik az új munkahelyekhez
- egy recesszió miatt csökken a kereslet
- egy strandi úszómester télen nem dolgozik
! A munkavállalók tudása és az állások igényei nem illeszkednek.

? Mit mutat a rövid távú Phillips-görbe?
+ az infláció és a munkanélküliség közötti átváltást
- a GDP és a kamat kapcsolatát
- a bérek és az árfolyam kapcsolatát
- a pénzmennyiség és a GDP kapcsolatát
! Rövid távon az alacsonyabb munkanélküliség magasabb inflációval jár.

? Ha egy munkavállaló határterméke havi 900 000 Ft-nyi bevétel, a bére pedig 700 000 Ft, megéri-e felvenni?
+ igen
- nem
- csak ha a bér 900 000 Ft
- nem lehet eldönteni
! A határtermék értéke nagyobb a bérnél.

? A tartós munkanélküliség 5%, a havi állásvesztési arány 1%. Mekkora a havi álláskeresési arány (%)?
= 19
! $\frac{s}{s + f} = 0{,}05 \Rightarrow f = 0{,}19$.

? Egy ország munkaerő-piacán miért lehet magasabb a bér az informatikában, mint az átlag?
- mert az informatikusok többet dolgoznak
+ mert nagy a kereslet és szűkös a kínálat (sok tanulás kell a szakmához)
- mert a minimálbér magasabb náluk
- mert nincs verseny
! A bér a kereslet és a kínálat arányát tükrözi; a humántőke-igény korlátozza a kínálatot.
```
