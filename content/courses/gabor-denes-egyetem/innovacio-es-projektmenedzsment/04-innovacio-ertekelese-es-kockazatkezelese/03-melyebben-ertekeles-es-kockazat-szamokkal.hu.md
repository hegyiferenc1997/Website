---
title: Mélyebben – értékelés és kockázat számokkal
summary: Nettó jelenérték és belső megtérülési ráta programmal (felezéses kereséssel), az NPV kamatláb-érzékenysége interaktív ábrán, Monte-Carlo-szimuláció a bizonytalan bevételekre, és miért ér pénzt a Stage-Gate folyamat „korai leállítása”.
minutes: 40
---

## Amit ebben a leckében megtanulsz

- hogyan számold ki programmal az **NPV**-t és a **belső megtérülési rátát** (IRR),
- hogyan kezeld a **bizonytalanságot** Monte-Carlo-szimulációval („mekkora eséllyel lesz veszteséges?”),
- miért **csökkenti a kockázatot** és növeli a várható értéket a szakaszos (Stage-Gate) döntéshozatal.

## 1. NPV és IRR programmal

Az előző lecke példája: 1000 egység befektetés, három évig évi 500 egység beáramlás. Az NPV a kamatláb függvénye; az **IRR** az a kamatláb, amelynél az NPV éppen 0. Ezt nem lehet egyszerű képlettel kifejezni, de a gép **felezéses kereséssel** gyorsan megtalálja:

```python run
# NPV és IRR: −1000 befektetés, majd 3 évig évi 500 beáramlás
penzaramok = [-1000, 500, 500, 500]

def npv(r):
    return sum(cf / (1 + r) ** t for t, cf in enumerate(penzaramok))   # diszkontált összeg

for r in [0.0, 0.05, 0.10, 0.20, 0.30]:
    print(f"r = {r:4.0%}: NPV = {npv(r):7.1f}")

# IRR felezéssel: 0% és 100% között az NPV előjelet vált
also, felso = 0.0, 1.0
for _ in range(50):
    kozep = (also + felso) / 2
    if npv(kozep) > 0:
        also = kozep          # még pozitív → az IRR nagyobb
    else:
        felso = kozep
print(f"\nIRR ≈ {kozep:.2%}")
```

Ha a tőke ára (az elvárt hozam) **kisebb** az IRR-nél (kb. 23,4%), a projekt megéri. Vigyázat: az NPV a kamatlábra **érzékeny** – 10%-nál 243, 20%-nál már csak 53. Hosszú megtérülésű, kockázatos innovációnál a magasabb kamatláb (kockázati felár) könnyen negatívba fordítja az NPV-t.

```plot
title: Az NPV a kamatláb függvényében (−1000, majd 3 évig évi c beáramlás)
x: 0, 0.6
y: -400, 800
param: c = 500, 300, 700, 10
f: -1000 + c/(1 + x) + c/(1 + x)^2 + c/(1 + x)^3 # NPV(r)
dash: 0 # NPV = 0
```

Ahol a görbe metszi a 0 vonalat, ott van az IRR. Csökkentsd az éves beáramlást ($c$): kb. 333 alatt (ennyi kell ahhoz, hogy a három részlet egyáltalán visszahozza az 1000-et) már 0%-os kamatlábnál is veszteséges a projekt.

## 2. Monte-Carlo: mi van, ha bizonytalanok a bevételek?

A valóságban az évi 500 csak **becslés**. Tegyük fel, hogy minden évben átlagosan 500, de 150-es szórással ingadozik. Szimuláljunk 10 000 lehetséges jövőt:

```python run
# Monte-Carlo-szimuláció: az éves beáramlás bizonytalan (átlag 500, szórás 150), r = 10%
import random

random.seed(1)                         # rögzített véletlen, hogy mindig ugyanaz jöjjön ki
r, futas = 0.10, 10_000
eredmenyek = []
for _ in range(futas):
    aramok = [random.gauss(500, 150) for _ in range(3)]          # egy lehetséges jövő
    eredmenyek.append(-1000 + sum(cf / (1 + r) ** (t + 1) for t, cf in enumerate(aramok)))

eredmenyek.sort()
atlag = sum(eredmenyek) / futas
vesztes = sum(e < 0 for e in eredmenyek) / futas
print(f"átlagos NPV: {atlag:.0f}")
print(f"veszteség valószínűsége: {vesztes:.1%}")
print(f"a legrosszabb 5% határa: {eredmenyek[futas // 20]:.0f}")
```

Az átlagos NPV ugyanúgy kb. 243, de most már azt is látjuk, hogy **kb. minden nyolcadik** esetben (13%) veszteséges a projekt, és a legrosszabb 5% esetében több mint 100 egységet veszítünk. Ez a szám a döntéshozónak sokkal többet mond, mint egyetlen „pontbecslés”: lehet, hogy egy kisebb NPV-jű, de biztosabb projekt jobb választás.

## 3. Stage-Gate: a korai leállítás értéke

Egy innovációs projekt négy szakaszból áll; minden szakasz végén egy kapunál kiderül, folytatható-e. Hasonlítsuk össze: (a) mindent egyszerre finanszírozunk, és csak a végén derül ki, sikeres-e; (b) szakaszonként döntünk, és a kudarcot jelző kapunál **leállítunk**.

```python run
# Stage-Gate: szakaszonkénti finanszírozás vs. minden egyszerre (millió Ft)
koltsegek = [10, 40, 150, 400]         # az egyes szakaszok költsége
siker = [0.5, 0.6, 0.7, 0.9]           # mekkora eséllyel jut át a projekt az adott szakasz kapuján
ertek = 2000                           # a sikeres termék értéke

p_vegig = 1.0
for p in siker:
    p_vegig *= p                       # végső siker esélye: a valószínűségek szorzata

egyben = p_vegig * ertek - sum(koltsegek)

varhato_koltseg, eljut = 0.0, 1.0
for k, p in zip(koltsegek, siker):
    varhato_koltseg += eljut * k       # ezt a szakaszt csak akkor fizetjük, ha ide eljutottunk
    eljut *= p

szakaszos = p_vegig * ertek - varhato_koltseg
print(f"végső siker esélye: {p_vegig:.1%}")
print(f"(a) minden egyszerre:  várható érték {egyben:7.1f}")
print(f"(b) Stage-Gate:        várható költség {varhato_koltseg:.1f}, várható érték {szakaszos:7.1f}")
```

Ugyanaz a projekt, ugyanaz a siker esélye (kb. 19%) – mégis az egyben finanszírozás várható értéke **negatív**, a szakaszosé **pozitív**. A különbség oka, hogy a drága késői szakaszokat (150 és 400) csak akkor fizetjük ki, ha a korai, olcsó szakaszok már igazolták az ötletet. Ezért érdemes **olcsón és gyorsan tesztelni** (prototípus, MVP), és ezért nem kudarc, ha egy kapunál leállítunk egy projektet: a megspórolt pénz egy másik ötletbe mehet.

## Összefoglalás

- $\text{NPV}(r) = \sum_t \frac{CF_t}{(1 + r)^t}$; az IRR az a kamatláb, ahol az NPV = 0 – programmal felezéses kereséssel kereshető meg.
- A Monte-Carlo-szimuláció a bizonytalan bemenetekből a kimenet **eloszlását** adja: a veszteség valószínűségét és a „legrosszabb esetet” is.
- A Stage-Gate folyamat a drága szakaszokat csak az igazolt ötleteknél finanszírozza; ezzel csökkenti a várható költséget és növeli a várható értéket.

## A lecke feladata

```quiz required
? Egy projekt: −1000 ma, +1210 két év múlva. Mennyi az NPV 10%-os kamatláb mellett?
= 0
! $1210 / 1{,}1^2 = 1210 / 1{,}21 = 1000$, így az NPV = 0.

? Az előző projektnek mennyi az IRR-je (%)?
= 10
! Az IRR az a kamatláb, ahol az NPV = 0: éppen 10%.

? Mit ad a Monte-Carlo-szimuláció egyetlen NPV-becsléshez képest?
- pontosabb kamatlábat
+ a lehetséges kimenetek eloszlását, például a veszteség valószínűségét
- garantáltan pozitív NPV-t
- a projekt pontos költségét
! Sok véletlen „jövőt” szimulál, így látszik a kockázat is.

? Egy projekt két szakaszból áll: az első 10 egységbe kerül és 50% eséllyel sikeres; csak ekkor jön a második, 100 egységes szakasz. Mennyi a várható költség?
= 60
! $10 + 0{,}5 \cdot 100 = 60$.

? Miért nem kudarc, ha egy Stage-Gate kapunál leállítanak egy projektet?
- mert a leállított projekt pénze visszajár
+ mert így a drága késői szakaszokra nem költünk egy rossz ötletnél, és a pénz jobb ötletbe mehet
- mert a leállított projekteket később mindig folytatják
- mert a kapuknál soha nem állítanak le projektet
! A korai, olcsó leállítás a módszer lényege.
```
