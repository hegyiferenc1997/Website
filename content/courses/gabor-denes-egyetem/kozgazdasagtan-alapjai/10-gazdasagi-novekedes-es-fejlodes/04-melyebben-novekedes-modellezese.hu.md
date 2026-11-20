---
title: Mélyebben – a növekedés modellezése
summary: A Solow-modell szimulációja (miért áll meg a tőkefelhalmozásból származó növekedés), a felzárkózás ideje különböző növekedési különbségek mellett, a 70-es szabály ellenőrzése, és az egyenlőtlenség mérése Lorenz-görbével és Gini-együtthatóval csúszkás ábrán.
minutes: 40
---

## Amit ebben a leckében megtanulsz

- miért nem lehet **csak beruházással** tartósan növekedni (Solow-modell),
- mennyi idő alatt zárkózhat fel egy ország, és miért számít minden **tized százalék**,
- hogyan számolj **Gini-együtthatót** jövedelmi adatokból.

## 1. A Solow-modell szimulációval

Egy gazdaságban az egy főre jutó kibocsátás a tőkétől függ, csökkenő hozadékkal: $y = k^{0{,}3}$. Minden évben a kibocsátás $s$ részét beruházzák, a tőke $\delta = 5\%$-a pedig elkopik:

```python run
# Solow-modell: tőke/fő (k) változása: k' = s·k^0,3 − δ·k (megtakarítás − amortizáció)
def szimulacio(s, delta=0.05, k=1.0, evek=200):
    utak = {}
    for ev in range(evek + 1):
        if ev in (0, 10, 25, 50, 100, 200):
            utak[ev] = (k, k ** 0.3)              # (tőke/fő, kibocsátás/fő)
        k = k + s * k ** 0.3 - delta * k          # új beruházás mínusz kopás
    return utak

for s in [0.20, 0.30]:
    print(f"megtakarítási ráta {s:.0%}: (állandósult állapot: k* = {(s / 0.05) ** (1 / 0.7):.1f})")
    for ev, (k, y) in szimulacio(s).items():
        print(f"   {ev:>3}. év: tőke/fő {k:6.2f}, kibocsátás/fő {y:5.2f}")
```

A tőke és a kibocsátás eleinte gyorsan nő, aztán egyre lassabban, végül megáll egy **állandósult állapotban**, ahol a beruházás éppen pótolja a kopást ($s \cdot k^{0{,}3} = \delta k$). Magasabb megtakarítási ráta (30%) **magasabb szintet** ad, de ott is megáll a növekedés.

A Solow-modell nagy tanulsága: a tartós, egy főre jutó növekedés forrása **nem a tőkefelhalmozás**, hanem a **technológiai fejlődés** (teljes tényezőtermelékenység), amely az egész termelési függvényt feljebb tolja. Ebből jön a **felzárkózás** gondolata is: a kevés tőkével rendelkező országokban (az út elején) a tőke hozama nagy, ezért gyorsabban nőhetnek – ha az intézmények és a humántőke ezt lehetővé teszik.

## 2. Felzárkózás és a 70-es szabály

Egy ország az EU egy főre jutó átlagának 78%-án áll (vásárlóerőn). Mennyi idő alatt éri utol?

```python run
# Felzárkózás: ha egy ország az EU-átlag 78%-án áll (egy főre, vásárlóerőn), mikor éri utol?
import math

kiindulo = 0.78
for sajat, eu in [(3.5, 1.5), (2.5, 1.5), (2.0, 1.5)]:
    evek = math.log(1 / kiindulo) / math.log((1 + sajat / 100) / (1 + eu / 100))
    print(f"saját növekedés {sajat}%, EU {eu}% → felzárkózás kb. {evek:.0f} év alatt")

# 70-es szabály: duplázódási idő ≈ 70 / növekedési ráta
for g in [1, 2, 3.5, 7]:
    print(f"{g}% növekedés: a GDP duplázódik kb. {70 / g:.0f} év alatt (pontosan {math.log(2) / math.log(1 + g / 100):.1f})")
```

2 százalékpontos növekedési előny mellett kb. 13 év, 1 százalékpontnál 25 év, fél százalékpontnál már fél évszázad! A kis különbségek a kamatos növekedés miatt hosszú távon óriásira nőnek. A 70-es szabály ($\frac{70}{g}$) kis növekedési ütemekre nagyon pontos; 7%-nál (amilyen Kína volt évtizedekig) a GDP egy évtized alatt duplázódik.

## 3. Az egyenlőtlenség mérése

A **Lorenz-görbe** azt mutatja, hogy a népesség legszegényebb $x$ része a jövedelmek hányad részét kapja. Tökéletes egyenlőségnél ez az átló; minél jobban „belóg” a görbe, annál egyenlőtlenebb az elosztás. A **Gini-együttható** az átló és a görbe közötti terület kétszerese (0 = teljes egyenlőség, 1 = egyetlen ember kap mindent):

```python run
# Lorenz-görbe és Gini-együttható jövedelmi ötödökből (a teljes jövedelem hány %-át kapja)
orszagok = {
    "egyenlőbb ország":  [9, 14, 18, 23, 36],
    "átlagos ország":    [7, 12, 17, 23, 41],
    "egyenlőtlen ország": [3, 7, 12, 20, 58],
}
for nev, otodok in orszagok.items():
    kumulalt, terulet = 0.0, 0.0
    for resz in otodok:
        uj = kumulalt + resz / 100
        terulet += (kumulalt + uj) / 2 * 0.2        # a Lorenz-görbe alatti terület trapézokkal
        kumulalt = uj
    gini = 1 - 2 * terulet                           # Gini = (egyenlőségi vonal alatti − Lorenz alatti) / 0,5
    print(f"{nev:<19}: felső ötöd / alsó ötöd = {otodok[4] / otodok[0]:4.1f}×, Gini ≈ {gini:.2f}")
```

Az európai országok Gini-együtthatója jellemzően 0,25–0,35, az Egyesült Államoké 0,4 körüli, néhány latin-amerikai és afrikai országé 0,5–0,6. (Ötödökből számolva kissé alábecsüljük a valódi értéket, mert az ötödökön belüli különbségeket nem látjuk.)

```plot
title: Lorenz-görbe – húzd a csúszkát az egyenlőtlenség növeléséhez
x: 0, 1
y: 0, 1
param: p = 2, 1, 6, 0.1
f: x^p # Lorenz-görbe
dash: x # teljes egyenlőség
value: Gini = (p - 1)/(p + 1)
```

**Több szemlélet:** a közgazdászok vitatják, mennyi egyenlőtlenség „jó”. Bizonyos mértékű különbség ösztönöz (érdemes tanulni, vállalkozni), a túl nagy viszont rontja a társadalmi mobilitást, a bizalmat, és politikai feszültséget okoz. A fejlődés ezért nem csak a GDP növekedését jelenti, hanem azt is, hogyan oszlik el.

## Összefoglalás

- Solow-modell: a tőkefelhalmozás csökkenő hozadéka miatt a növekedés megáll; tartós növekedést a technológiai fejlődés ad.
- Felzárkózási idő: $\frac{\ln(1 / \text{arány})}{\ln\left(\frac{1 + g_{\text{saját}}}{1 + g_{\text{EU}}}\right)}$; a kis különbségek számítanak.
- 70-es szabály: duplázódási idő ≈ $70 / g$.
- Gini: 0 és 1 közötti mutató, a Lorenz-görbe és az átló közötti terület kétszerese.

## A lecke feladata

```quiz required
? A 70-es szabály szerint évi 2%-os növekedés mellett kb. hány év alatt duplázódik a GDP?
= 35
! $70 / 2 = 35$.

? Mit jósol a Solow-modell a megtakarítási ráta tartós növelésére?
- tartósan magasabb növekedési ütemet
+ magasabb állandósult kibocsátási szintet, de hosszú távon nem gyorsabb növekedést
- alacsonyabb kibocsátást
- semmilyen hatást
! A csökkenő hozadék miatt az új szinten megáll a növekedés.

? Mennyi a Gini-együttható, ha mindenki pontosan ugyanannyi jövedelmet kap?
= 0
! A Lorenz-görbe egybeesik az átlóval.

? Egy országban a legfelső ötöd a jövedelmek 40%-át, a legalsó ötöd 8%-át kapja. Hányszorosa a felső ötöd jövedelme az alsóénak?
= 5
! $40 / 8 = 5$.

? Solow-modellben $y = k^{0{,}5}$, $s = 0{,}2$, $\delta = 0{,}05$. Mennyi az állandósult tőke/fő? ($k^* = (s / \delta)^{1/(1 - 0{,}5)}$)
= 16
! $(0{,}2 / 0{,}05)^2 = 4^2 = 16$.
```
