---
title: Gyakorlás – stratégiák és üzleti modellek
summary: Ellenőrző kérdések és összefoglaló feladatlap a harmadik témakörhöz.
minutes: 45
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Készíts rövid SWOT-ot egy induló, egyetemistáknak szóló jegyzetmegosztó alkalmazásra!</summary>

Erősség: a csapat maga is hallgató, ismeri az igényeket. Gyengeség: kevés pénz és marketingtapasztalat. Lehetőség: sok hallgató tanul online, egyetemi együttműködések. Veszély: nagy, ingyenes versenytársak; szerzői jogi kérdések a feltöltött anyagoknál.

</details>

<details>
<summary>2. Mi a különbség a defenzív és az imitatív stratégia között?</summary>

A defenzív cég gyorsan követi az úttörőt, és saját fejlesztéssel jobb változatot hoz. Az imitatív cég lemásolja a bevált megoldást, és főleg az alacsonyabb költséggel versenyez, kevés saját fejlesztéssel.

</details>

<details>
<summary>3. Miért kezdjük az üzleti modell vásznat az ügyfélszegmensekkel?</summary>

Mert minden más elem (értékajánlat, csatorna, bevétel) attól függ, kinek teremtünk értéket. Rossz ügyfélkörre a legjobb modell sem működik.

</details>

<details>
<summary>4. Egy MVP-teszt után kiderül, hogy a hallgatók nem fizetnének, de az egyetemek igen. Mit tennél?</summary>

Pivot az ügyfélszegmensben: a terméket az egyetemeknek kínálnám (pl. intézményi licenc), a hallgatóknak ingyenes marad. A tanultakat (mit használnak a hallgatók) megtartanám.

</details>

## Összefoglaló feladatlap

```quiz required
? Egy cég az egyik **erősségét** (kiváló MI-fejlesztőcsapat) használja egy **lehetőség** (új uniós MI-pályázat) kihasználására. Melyik TOWS-stratégia ez?
+ S–O
- W–O
- S–T
- W–T
! Erősség + lehetőség.

? Egy telefongyártó okosórát kezd gyártani a meglévő vevőinek. Melyik Ansoff-stratégia?
- piacpenetráció
+ termékfejlesztés
- piacfejlesztés
- diverzifikáció
! Új termék a meglévő piacon.

? Melyik üzletimodell-minta a **játékkonzol olcsón, a játékok drágán**?
- freemium
- hosszú farok
+ borotva–penge
- hirdetésalapú
! Az alapeszköz olcsó, a „fogyóeszköz” hozza a hasznot.

? Az Uber sofőröket és utasokat köt össze, és minden útból jutalékot kap. Melyik minta?
- előfizetés
+ platform (kétoldalú piac)
- borotva–penge
- nyílt forráskód + szolgáltatás
! Két felhasználói csoport közvetítése.

? Melyik Business Model Canvas elembe tartozik a „fejlesztői bérek”?
- kulcserőforrások
- bevételi források
+ költségszerkezet
- kulcstevékenységek
! Ez költség, a vászon bal alsó mezője.

? Egy 50 000 felhasználós freemium appnál a konverzió 4%. Hány fizető felhasználó van?
= 2000
= 2 000
! 50 000 · 0,04.

? Két nyitóoldal-változatot mutatunk két felhasználócsoportnak, és mérjük a regisztrációk számát. Hogy hívják ezt?
= A/B teszt
= AB teszt
= A/B
! Két változat összehasonlítása valós adatokkal.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **LTV és CAC.** Írd meg az `ltv(arpu, arres, churn)` függvényt (élettartam-érték, egészre kerekítve) és az `ltv_cac(arpu, arres, churn, cac)` függvényt (az LTV / CAC arány 1 tizedesre)!

```python starter
def ltv(arpu, arres, churn):
    return round(arpu * arres * churn)

def ltv_cac(arpu, arres, churn, cac):
    return round(ltv(arpu, arres, churn) / cac, 1)
```

<details>
<summary>Megoldás</summary>

```python solution
def ltv(arpu, arres, churn):
    return round(arpu * arres / churn)     # havi fedezet × átlagos élettartam (1 / churn hónap)

def ltv_cac(arpu, arres, churn, cac):
    return round(arpu * arres / churn / cac, 1)
```

</details>

```python test
assert ltv(2000, 0.8, 0.05) == 32000
assert ltv(3000, 0.5, 0.05) == 30000
assert ltv_cac(2000, 0.8, 0.10, 9000) == 1.8
assert ltv_cac(2000, 0.8, 0.02, 9000) == 8.9
print("Minden ellenőrzés sikeres!")
```

**2.** **Freemium.** Írd meg a `kritikus_konverzio(felhasznalok, koltseg_fo, premium_ar, fix)` függvényt, amely megadja, hány százalék fizető felhasználó kell a nullszaldóhoz (1 tizedesre)! Minden felhasználó (az ingyenes is) `koltseg_fo` költséget okoz, és van `fix` havi költség is.

```python starter
def kritikus_konverzio(felhasznalok, koltseg_fo, premium_ar, fix):
    return round(100 * koltseg_fo / premium_ar, 1)
```

<details>
<summary>Megoldás</summary>

A kiinduló kód elfelejti a fix költséget – kis felhasználószámnál éppen ez dönti el, működik-e a modell.

```python solution
def kritikus_konverzio(felhasznalok, koltseg_fo, premium_ar, fix):
    koltseg = felhasznalok * koltseg_fo + fix              # teljes havi költség
    return round(100 * koltseg / (felhasznalok * premium_ar), 1)
```

</details>

```python test
assert kritikus_konverzio(200_000, 60, 1500, 3_000_000) == 5.0
assert kritikus_konverzio(100_000, 50, 1000, 0) == 5.0
assert kritikus_konverzio(50_000, 40, 2000, 1_000_000) == 3.0
print("Minden ellenőrzés sikeres!")
```

**3.** **Hosszú farok.** Zipf-eloszlásnál a $k$-adik termék eladása $\frac{1}{k}$-val arányos. Írd meg a `farok_aranya(katalogus, slager=100)` függvényt, amely megadja, az eladások hány százaléka esik a `slager` legnépszerűbb terméken kívülre (1 tizedesre)!

```python starter
def farok_aranya(katalogus, slager=100):
    return round(100 * (katalogus - slager) / katalogus, 1)
```

<details>
<summary>Megoldás</summary>

A kiinduló kód úgy számol, mintha minden termék egyformán fogyna – a valóságban a slágerek sokkal többet adnak el.

```python solution
def farok_aranya(katalogus, slager=100):
    eladasok = [1 / k for k in range(1, katalogus + 1)]
    return round(100 * sum(eladasok[slager:]) / sum(eladasok), 1)
```

</details>

```python test
assert farok_aranya(1000) == 30.7
assert farok_aranya(100_000) == 57.1
assert farok_aranya(10, 5) == 22.0
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Az üzleti modell vászon melyik blokkjába tartozik az „előfizetési díj”?
- kulcspartnerek
- értékajánlat
+ bevételi források
- kulcserőforrások
! A bevételi források azt írják le, miből és hogyan fizetnek az ügyfelek.

? Mit jelent az MVP a Lean Startup módszerben?
+ a legkisebb működő termék, amellyel a legfontosabb feltevés a lehető legolcsóbban tesztelhető
- a legértékesebb játékos
- a kész, minden funkciót tartalmazó termék
- a marketingterv
! Építs – mérj – tanulj: minél gyorsabban tanulni a valódi vevőktől.

? Havi 1000 Ft ARPU, 60% árrés, havi 3% lemorzsolódás. Mennyi az LTV (Ft)?
= 20000
= 20 000
! $1000 \cdot 0{,}6 / 0{,}03 = 20\,000$.

? Az Ansoff-mátrixban mi a diverzifikáció?
- meglévő termék meglévő piacon
- meglévő termék új piacon
- új termék meglévő piacon
+ új termék új piacon
! Ez a legkockázatosabb növekedési irány.
```
