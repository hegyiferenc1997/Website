---
title: Kamat, megtakarítás és hitel
summary: Egyszerű és kamatos kamat, a 72-es szabály, nominális és reálkamat, a pénz időértéke és a jelenérték, hitelek (THM, annuitásos törlesztőrészlet), valamint a kockázat és a hozam kapcsolata.
minutes: 30
---

## Amit ebben a leckében megtanulsz

- az **egyszerű** és a **kamatos kamat** különbségét,
- hogyan becsüld meg a duplázódási időt a **72-es szabállyal**,
- mi a **reálkamat**,
- mit jelent a **pénz időértéke** és a **jelenérték**,
- hogyan olvasd a hitelajánlatokat (**THM**, törlesztőrészlet),
- miért jár a nagyobb hozam nagyobb **kockázattal**.

## Egyszerű és kamatos kamat

- **Egyszerű kamat:** a kamat mindig csak az eredeti tőke után jár: $FV = PV \cdot (1 + r \cdot n)$.
- **Kamatos kamat:** a kamat is kamatozik: $FV = PV \cdot (1 + r)^n$.

Itt $PV$ a mai összeg (jelenérték), $FV$ a jövőbeli (jövőérték), $r$ az éves kamatláb, $n$ az évek száma.

**Példa:** 100 000 Ft 10 évre, évi 5%-on:

- egyszerű kamattal: $100\,000 \cdot 1{,}5 = 150\,000$ Ft,
- kamatos kamattal: $100\,000 \cdot 1{,}05^{10} \approx 162\,889$ Ft.

```plot
title: 100 egység kamatos (folytonos) és egyszerű (szaggatott) kamattal
x: 0, 40
y: 0, 800
param: r = 5, 1, 10, 0.5
f: 100 (1 + r/100)^x # kamatos kamat
dash: 100 (1 + r/100 x) # egyszerű kamat
value: duplázódási idő (év) = ln(2) / ln(1 + r/100)
```

Hosszú távon a különbség óriási – ezért érdemes **korán** elkezdeni a megtakarítást.

## A 72-es szabály

Gyors fejszámolás: a duplázódási idő ≈ $72 / (\text{kamatláb százalékban})$. Évi 6%-on kb. **12 év** alatt duplázódik a pénz, évi 8%-on kb. 9 év alatt. Ugyanez működik az inflációra is: 6%-os infláció mellett 12 év alatt **feleződik** a pénz vásárlóereje.

Ugyanezt kiszámolhatod Pythonnal is:

```python run
# Kamatos kamat évről évre
toke = 100_000
kamat = 0.05
for ev in range(1, 11):
    toke = toke * (1 + kamat)
    print(ev, "év:", round(toke), "Ft")
```

## Nominális és reálkamat

A **nominális kamat** a bank által ígért kamat, a **reálkamat** az inflációval csökkentett, valódi vásárlóerő-növekedés:

$$ \text{reálkamat} \approx \text{nominális kamat} - \text{infláció} $$

Ha a betéted 6%-ot fizet, az infláció 4%, a reálkamat kb. **2%**. Ha az infláció 10%, a reálkamatod **−4%**: több forintod lesz, de kevesebbet tudsz venni rajta. A 2022–2023-as magas inflációs időszakban sok betét reálkamata erősen negatív volt.

## A pénz időértéke és a jelenérték

A mai 1 forint **többet ér**, mint egy év múlva kapott 1 forint (befektethető, és az infláció is csökkenti az értékét). A jövőbeli összeg **jelenértéke**:

$$ PV = \frac{FV}{(1 + r)^n} $$

**Példa:** 2 év múlva 121 000 Ft-ot kapsz, a kamatláb 10%. Ennek jelenértéke $121\,000 / 1{,}1^2 = 100\,000$ Ft. Ezzel az eszközzel hasonlíthatók össze a különböző időpontokban esedékes pénzek – pl. egy beruházás vagy egy szoftverprojekt megtérülése (nettó jelenérték, NPV).

## Hitelek

Hitelnél **te fizetsz** kamatot. A legfontosabb mutató a **THM** (teljes hiteldíj mutató): a kamaton felül minden díjat (kezelési költség, biztosítás, folyósítási díj) is tartalmaz, egy éves százalékban. Két hitelajánlatot **mindig a THM** alapján hasonlíts össze, ne a reklámozott kamat vagy a havi részlet alapján. (Betéteknél ennek párja az **EBKM**, az egységesített betéti kamatláb mutató.)

**Annuitásos (egyenlő részletű) törlesztés:**

$$ A = PV \cdot \frac{r}{1 - (1 + r)^{-n}} $$

ahol $r$ a **havi** kamatláb, $n$ a hónapok száma. 1 000 000 Ft, havi 1%, 12 hónap → kb. **88 849 Ft** havonta; összesen kb. 1 066 000 Ft-ot fizetsz vissza.

Figyelj a **hosszú futamidőre**: kisebb a havi részlet, de sokkal több az összes kamat. A legdrágább hitelek általában a hitelkártya-tartozás, az áruhitel és a „gyorskölcsön”.

## Kockázat és hozam

- **Kockázat és hozam együtt jár:** a magasabb várható hozamért nagyobb kockázatot (ingadozást, veszteséglehetőséget) kell vállalni. Állampapír: alacsony kockázat; részvények: nagyobb hozam, nagyobb ingadozás; kriptoeszközök: nagyon nagy kockázat.
- **Diverzifikáció:** ne tegyél minden tojást egy kosárba – sok különböző eszközre szétosztva csökken a kockázat (pl. indexkövető alapok).
- Ha valaki **magas hozamot kockázat nélkül** ígér, az szinte biztosan csalás (pilótajáték).

## Összefoglalás

- Kamatos kamat: $FV = PV (1+r)^n$; hosszú távon sokkal több, mint az egyszerű kamat.
- 72-es szabály: duplázódási idő ≈ 72 / kamatláb.
- Reálkamat ≈ nominális kamat − infláció.
- Jelenérték: $PV = FV / (1+r)^n$.
- Hiteleket THM alapján hasonlíts; a nagyobb hozam nagyobb kockázattal jár.

## A lecke feladata

```quiz required
? 200 000 Ft-ot 3 évre lekötsz évi 6%-os kamatos kamatra. Mennyi lesz a végén (egész forintra kerekítve)?
= 238203
! 200 000 · 1,06³ = 238 203,2.

? A 72-es szabály szerint hány év alatt duplázódik a pénz évi 9%-os hozamnál?
= 8
! 72 / 9.

? A betéted 5%-ot fizet, az infláció 7%. Mennyi a közelítő reálkamat százalékban? (Előjellel.)
= -2
= −2
! 5 − 7.

? Melyik mutató alapján érdemes két hitelajánlatot összehasonlítani?
- a havi törlesztőrészlet
- a reklámban szereplő kamatláb
+ a THM
- a futamidő
! A THM minden díjat tartalmaz.

? Mi igaz a kockázat és a hozam kapcsolatára?
- a magasabb hozam kisebb kockázattal jár
+ a magasabb várható hozamért általában nagyobb kockázatot kell vállalni
- nincs kapcsolat
- az állampapír a legkockázatosabb
! Kockázat nélküli magas hozam nincs.
```
