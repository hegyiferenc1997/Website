---
title: Mélyebben – üzleti modellek számokkal
summary: Egy előfizetéses üzleti modell egységgazdaságtana (LTV, CAC, megtérülés), a freemium modell kritikus konverziós aránya, és a hosszú farok matematikája a Zipf-eloszlással – kis programokkal és interaktív ábrával.
minutes: 40
---

## Amit ebben a leckében megtanulsz

- hogyan ellenőrizd számokkal, hogy egy **előfizetéses** üzleti modell életképes-e (LTV, CAC),
- mekkora **konverziós arány** kell ahhoz, hogy egy freemium modell nyereséges legyen,
- miért lehet a **hosszú farok** együtt nagyobb, mint a slágerek.

## 1. Egységgazdaságtan: LTV és CAC

Az üzleti modell vászon „bevételi források” és „költségszerkezet” blokkjait egyetlen ügyfél szintjén is érdemes kiszámolni:

- **ARPU**: egy ügyfél átlagos havi bevétele,
- **lemorzsolódás** (_churn_): az ügyfelek hány százaléka mondja le havonta az előfizetést – átlagosan $1 / \text{churn}$ hónapig marad egy ügyfél,
- **LTV** (_lifetime value_, élettartam-érték): $\text{LTV} = \frac{\text{ARPU} \cdot \text{árrés}}{\text{churn}}$,
- **CAC** (_customer acquisition cost_): egy új ügyfél megszerzésének költsége (reklám, értékesítés).

Hüvelykujjszabály: egészséges modellnél **LTV / CAC ≥ 3**, és a CAC 12 hónapon belül megtérül.

```python run
# Egységgazdaságtan: élettartam-érték (LTV) és ügyfélszerzési költség (CAC) egy előfizetéses appnál
arpu, arres, cac = 2000, 0.8, 9000          # Ft/hó, árrés (a bevétel hány %-a marad), Ft/ügyfél

for churn in [0.02, 0.05, 0.10, 0.20]:
    elettartam = 1 / churn                   # átlagosan ennyi hónapig marad egy ügyfél
    ltv = arpu * arres / churn
    megterules = cac / (arpu * arres)        # hány hónap alatt hozza vissza a megszerzési költséget
    jel = "egészséges" if ltv / cac >= 3 else "gyenge" if ltv > cac else "veszteséges"
    print(f"churn {churn:4.0%}: élettartam {elettartam:5.1f} hó, LTV {ltv:>7.0f} Ft, "
          f"LTV/CAC {ltv / cac:4.1f} → {jel}, megtérülés {megterules:.1f} hó")
```

Ugyanaz a termék, ugyanaz az ár – mégis a lemorzsolódáson múlik minden: havi 2%-nál bőven nyereséges, 20%-nál viszont minden új ügyfél **veszteséget** termel: a megszerzési költség 5,6 hónap alatt térülne meg, de az ügyfél átlagosan már 5 hónap után távozik. Ezért figyelik az előfizetéses cégek a churnt legalább annyira, mint az új ügyfelek számát.

```plot
title: Élettartam-érték a havi lemorzsolódás függvényében (árrés 80%)
x: 0.01, 0.2
y: 0, 80000
param: a = 2000, 500, 5000, 100
f: a*0.8/x # LTV
dash: 27000 # 3 · CAC
```

Az ábrán az LTV görbe a **3 · CAC** vonal fölött jelzi az egészséges modellt. Emeld az ARPU-t ($a$ csúszka), és nézd meg, mekkora churnt bír még el a modell!

## 2. Freemium: mekkora konverzió kell?

A **freemium** modellben az alapszolgáltatás ingyenes, a felhasználók egy kis része fizet a prémium funkciókért. A kérdés: mekkora **konverziós arány** fedezi az ingyenes felhasználók kiszolgálásának költségét?

```python run
# Freemium: hány százalék fizető felhasználó kell ahhoz, hogy a modell ne legyen veszteséges?
felhasznalok = 200_000
koltseg_per_fo = 60          # Ft/hó: szerver, támogatás – minden felhasználóra (ingyenesre is)
premium_ar = 1500            # Ft/hó a fizetőknek
fix_koltseg = 3_000_000      # Ft/hó: fejlesztőcsapat, iroda

def havi_eredmeny(konverzio):
    bevetel = felhasznalok * konverzio * premium_ar
    return bevetel - felhasznalok * koltseg_per_fo - fix_koltseg

for k in [0.02, 0.04, 0.06, 0.08]:
    print(f"konverzió {k:.0%}: havi eredmény {havi_eredmeny(k):>12,.0f} Ft".replace(",", " "))

kritikus = (felhasznalok * koltseg_per_fo + fix_koltseg) / (felhasznalok * premium_ar)
print(f"\nkritikus konverziós arány: {kritikus:.1%}")
```

A tipikus freemium konverzió 2–5%, ezért ez a modell csak akkor működik, ha az ingyenes felhasználó **nagyon olcsó** (szoftvernél a határköltség közel nulla), és ha sok felhasználó van. A képlet:

$$
\text{kritikus konverzió} = \frac{\text{felhasználók} \cdot \text{költség/fő} + \text{fix költség}}{\text{felhasználók} \cdot \text{prémium ár}}.
$$

## 3. A hosszú farok

A „hosszú farok” (Chris Anderson) azt mondja: online, ahol a polc végtelen, a sok **ritkán** vett termék együtt jelentős piacot ad. A termékek népszerűsége gyakran **Zipf-eloszlást** követ: a $k$-adik legnépszerűbb termék eladásai $\frac{1}{k}$-val arányosak.

```python run
# Hosszú farok: Zipf-eloszlás, a k-adik termék eladása ∝ 1/k
def farok_aranya(katalogus, slager=100):
    eladasok = [1 / k for k in range(1, katalogus + 1)]
    return sum(eladasok[slager:]) / sum(eladasok)        # a top 100-on kívüli termékek részesedése

for katalogus in [1_000, 10_000, 100_000, 1_000_000]:
    print(f"{katalogus:>9,} termék: a top 100-on kívüli rész {farok_aranya(katalogus):5.1%}".replace(",", " "))
```

Egy fizikai boltban (néhány ezer termék) a slágerek dominálnak; egy online katalógusban (milliónyi dal, könyv, app) a top 100-on **kívüli** termékek adják az eladások nagyobb részét. Ezért tudnak a streaming-szolgáltatások és az alkalmazásboltok a „rétegtermékekből” is pénzt keresni – feltéve, hogy jó a **keresés és az ajánlórendszer**, különben a vevő meg sem találja a farkat.

## Összefoglalás

- $\text{LTV} = \frac{\text{ARPU} \cdot \text{árrés}}{\text{churn}}$; egészséges modellnél LTV / CAC ≥ 3. A lemorzsolódás csökkentése gyakran többet ér, mint az ügyfélszerzés.
- A freemium modell kritikus konverziós aránya a teljes költség osztva a potenciális prémium bevétellel; csak olcsó kiszolgálásnál és nagy felhasználószámnál működik.
- Zipf-eloszlásnál nagy katalógusban a hosszú farok együtt nagyobb lehet, mint a slágerek.

## A lecke feladata

```quiz required
? Egy előfizetés havi 3000 Ft, az árrés 50%, a havi lemorzsolódás 5%. Mennyi az LTV (Ft)?
= 30000
= 30 000
! $3000 \cdot 0{,}5 / 0{,}05 = 30\,000$.

? Ha a havi lemorzsolódás 4%, átlagosan hány hónapig marad egy ügyfél?
= 25
! $1 / 0{,}04 = 25$.

? Az LTV 20 000 Ft, a CAC 10 000 Ft. Mit mondhatunk a hüvelykujjszabály szerint?
- egészséges, mert az LTV nagyobb a CAC-nál
+ gyenge: nyereséges, de az LTV / CAC = 2 nem éri el a 3-at
- veszteséges
- nem lehet megmondani
! Az egészséges modellhez LTV / CAC ≥ 3 kell.

? 100 000 felhasználó, fejenként 50 Ft/hó költség, nincs fix költség, a prémium 1000 Ft/hó. Hány százalék konverzió kell a nullszaldóhoz?
= 5
! $\frac{100\,000 \cdot 50}{100\,000 \cdot 1000} = 0{,}05 = 5\%$.

? Mi kell ahhoz, hogy egy online áruház a hosszú farokból pénzt keressen?
- minél kevesebb termék
+ nagy katalógus és jó keresés / ajánlórendszer, hogy a vevők megtalálják a ritka termékeket
- csak slágertermékek árusítása
- magasabb árak a slágereknél
! A farok csak akkor ér valamit, ha a vevő megtalálja.
```
