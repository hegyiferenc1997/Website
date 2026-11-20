---
title: Mélyebben – a válságok dinamikája
summary: Hogyan keletkezik „magától” a konjunktúraciklus (Samuelson multiplikátor–akcelerátor modellje), miért teszi a tőkeáttétel törékennyé a bankokat és a befektetőket, és hogyan alakul az államadósság a kamat, a növekedés és a költségvetési egyenleg függvényében – csúszkás ábrával.
minutes: 40
---

## Amit ebben a leckében megtanulsz

- hogyan okozhat egyetlen kis lökés **hullámzást** a gazdaságban külső okok nélkül,
- miért viheti **csődbe** egy 10%-os áresés a nagy tőkeáttételű szereplőket,
- mitől **nő** vagy **csökken** egy ország adósságának GDP-arányos szintje.

## 1. A ciklus belülről: multiplikátor és akcelerátor

Paul Samuelson 1939-es modellje két egyszerű viselkedést kapcsol össze: a fogyasztás a tavalyi jövedelemtől függ (**multiplikátor**), a beruházás pedig a kereslet **növekedésétől** – ha nő a forgalom, a cégek bővítik a kapacitást, ha stagnál, nem építenek újat (**akcelerátor**). Egy kis keresleti lökés után (kétévente kiírva):

```python run
# Samuelson multiplikátor–akcelerátor modellje: hogyan keletkezik magától a konjunktúraciklus?
# Y_t = C_t + I_t + G; C_t = c·Y_(t−1); I_t = v·(C_t − C_(t−1))  (a beruházás a kereslet NÖVEKEDÉSÉRE reagál)
def szimulacio(c, v, G=100, evek=24):
    Y = [500.0, 520.0]                            # egy kis keresleti lökés után
    C_elozo = c * Y[0]
    for t in range(2, evek):
        C = c * Y[-1]
        I = v * (C - C_elozo)                     # akcelerátor: ha nő a fogyasztás, bővíteni kell a kapacitást
        Y.append(C + I + G)
        C_elozo = C
    return Y

for c, v, nev in [(0.8, 0.5, "csillapodó ciklus"), (0.8, 1.25, "állandó ciklus"), (0.8, 1.5, "egyre erősebb kilengések")]:
    Y = szimulacio(c, v)
    print(f"c = {c}, v = {v} ({nev}):")
    print("   " + " ".join(f"{y:4.0f}" for y in Y[:24:2]))
```

- Gyenge akcelerátornál ($v = 0{,}5$) a lökés lecseng, a gazdaság visszatér az egyensúlyba (500).
- Erősebbnél **szabályos hullámzás** marad – fellendülés, visszaesés, újra fellendülés – külső sokk nélkül!
- Még erősebb reakciónál a kilengések egyre nőnek: a túlzott beruházási hullámok (pl. a dotcom-láz) instabillá teszik a gazdaságot.

A tanulság: a ciklus nem feltétlenül „baleset”, hanem a szereplők **ésszerű reakcióiból** is következhet. Ezért van szükség a kilengéseket tompító intézményekre (automatikus stabilizátorok, jegybank).

## 2. Tőkeáttétel: a válságok erősítője

Egy befektető (vagy bank) kevés saját pénzt és sok hitelt használ. Mi történik, ha az eszközei 10%-ot veszítenek az értékükből?

```python run
# Tőkeáttétel: mennyi saját tőkéd marad, ha 10%-ot esik az eszközeid értéke?
eses = 0.10
for attetel in [1, 2, 5, 10, 30]:                 # eszközök / saját tőke
    eszkoz, sajat = 100.0, 100.0 / attetel       # 100 egység eszköz, ebből ennyi a saját pénz
    adossag = eszkoz - sajat
    maradek = eszkoz * (1 - eses) - adossag      # az adósság nem csökken!
    allapot = "CSŐD (elfogyott a saját tőke)" if maradek <= 0 else f"saját tőke {100 * (maradek / sajat - 1):+.0f}%"
    print(f"áttétel {attetel:>2}×: {allapot}")
```

Hitel nélkül a 10%-os esés 10%-os veszteség. 10-szeres áttételnél viszont **a teljes saját tőke elfogy**, 30-szorosnál pedig már az adósságot sem tudja visszafizetni. 2007–2008-ban egyes befektetési bankok 30–40-szeres áttétellel működtek – néhány százalékos ingatlanár-esés elég volt a bukásukhoz (Lehman Brothers). Ezért írják elő a szabályozók (Bázel III) a bankok minimális **tőkemegfelelését**: az eszközök egy részét saját tőkéből kell finanszírozni.

Ráadásul a veszteség **önerősítő**: a bajba jutott szereplőknek el kell adniuk az eszközeiket, ez tovább nyomja az árakat, ami újabb szereplőket hoz bajba (**tűzeladás-spirál**).

## 3. Az államadósság dinamikája

Az adósság GDP-arányos szintjét három dolog alakítja: a **kamat** növeli, a **gazdasági növekedés** „hígítja” (a nevező nő), az **elsődleges egyenleg** (a kamatkiadások nélküli költségvetési egyenleg) pedig csökkenti vagy növeli:

```python run
# Az államadósság dinamikája: d' = d·(1 + r)/(1 + g) − elsődleges egyenleg (a GDP %-ában)
def palya(d, r, g, elsodleges, evek=20):
    for _ in range(evek):
        d = d * (1 + r) / (1 + g) - elsodleges    # kamat növeli, növekedés "hígítja", többlet csökkenti
    return d

d0 = 75.0                                         # induló adósság: a GDP 75%-a
esetek = [("kamat < növekedés, nulla egyenleg", 0.03, 0.05, 0),
          ("kamat > növekedés, nulla egyenleg", 0.06, 0.03, 0),
          ("kamat > növekedés, 2% elsődleges többlet", 0.06, 0.03, 2),
          ("kamat > növekedés, 2% elsődleges hiány", 0.06, 0.03, -2)]
for nev, r, g, e in esetek:
    print(f"{nev:<42}: 20 év múlva {palya(d0, r, g, e):5.1f}%")
```

Ha a kamat **alacsonyabb** a növekedésnél, az adósságráta kiegyensúlyozott költségvetés mellett is magától csökken (2010-es évek). Ha **magasabb**, az adósság hógolyóként gördül: tartós **elsődleges többlet** kell csak ahhoz, hogy szinten maradjon. Ez történt Görögországgal 2010 körül: magas kamatok, zsugorodó gazdaság és hiány együtt – az adósságráta elszabadult.

```plot
title: Az adósságráta (%) alakulása nulla elsődleges egyenleg mellett (3% növekedés)
x: 0, 30
y: 0, 200
param: r = 6, 0, 10, 0.5
f: 75*((1 + r/100)/1.03)^x # adósság/GDP
dash: 60 # maastrichti határ
```

A csúszkán a kamatot állítsd: 3%-nál az adósságráta vízszintes, alatta csökken, fölötte exponenciálisan nő.

## Összefoglalás

- Multiplikátor + akcelerátor: a beruházás a kereslet változására reagál, ezért kis lökésből is hullámzás lehet.
- Tőkeáttétel: $L$-szeres áttételnél az eszközérték $\frac{1}{L}$ részének elvesztése a teljes saját tőkét elviszi.
- Adósságdinamika: $d' = d \cdot \frac{1 + r}{1 + g} - \text{elsődleges egyenleg}$; ha $r > g$, többlet kell a stabilizáláshoz.

## A lecke feladata

```quiz required
? Egy bank 20-szoros tőkeáttétellel működik. Hány százalékkal csökken a saját tőkéje, ha az eszközei 5%-ot veszítenek az értékükből?
= 100
! 100 eszköz, 5 saját tőke, 95 adósság; az esés után $95 - 95 = 0$ marad.

? Az adósságráta 60%, a kamat egyenlő a növekedéssel, az elsődleges többlet a GDP 2%-a. Mennyi lesz az adósságráta egy év múlva (%)?
= 58
! $60 \cdot 1 - 2 = 58$.

? Miért okozhat a Samuelson-modellben egy kis lökés hullámzást?
- mert az állam véletlenszerűen költ
+ mert a beruházás a kereslet változására reagál, ami felerősíti és megfordítja a mozgást
- mert a fogyasztás független a jövedelemtől
- mert a pénzmennyiség ingadozik
! Az akcelerátor a növekedés lassulására is beruházás-visszaeséssel reagál.

? Milyen feltétel mellett csökken magától az adósságráta kiegyensúlyozott elsődleges egyenleg esetén?
+ ha a kamat alacsonyabb, mint a gazdasági növekedés
- ha a kamat magasabb, mint a gazdasági növekedés
- ha az infláció nulla
- soha
! $\frac{1 + r}{1 + g} < 1$, ha $r < g$.

? A multiplikátor–akcelerátor modellben $G = 100$ és $c = 0{,}8$. Mennyi az egyensúlyi kibocsátás? ($Y^* = \frac{G}{1 - c}$)
= 500
! $\frac{100}{0{,}2} = 500$.
```
