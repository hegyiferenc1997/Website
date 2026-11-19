---
title: Mélyebben – kereskedelem és árfolyam számokkal
summary: A komparatív előny kiszámolva (hogyan lesz a specializációval mindkét termékből több), egy vám nyertesei és vesztesei forintra pontosan csúszkás ábrával, az árfolyam hatása egy laptop árára és egy exportőr bevételére, keresztárfolyam, és a vásárlóerő-paritás egy hamburgeren.
minutes: 40
---

## Amit ebben a leckében megtanulsz

- hogyan lesz a kereskedelemmel **mindkét termékből több**, ugyanannyi munkával,
- kik nyernek és kik veszítenek egy **vámon**, és miért marad a végén veszteség,
- hogyan számolj **árfolyammal** és **keresztárfolyammal**,
- mit jelent, hogy egy valuta **alulértékelt**, és miért nagyobb a PPP-alapú GDP.

## 1. Komparatív előny számokban

Két ország, Alfa és Béta, chipet és szoftvert gyárt; mindkettőnek 1200 munkaórája van. Alfa **mindkettőben** hatékonyabb (abszolút előny):

```python run
# Komparatív előny: munkaórák egy egységhez; mindkét országnak 1200 munkaórája van
ora = {"Alfa": {"chip": 4, "szoftver": 2}, "Béta": {"chip": 12, "szoftver": 4}}
OSSZ = 1200

for orszag, o in ora.items():
    print(f"{orszag}: 1 chip alternatív költsége = {o['chip'] / o['szoftver']:.1f} szoftver")

# Autarkia: mindkét ország a munkaidő felét-felét fordítja a két termékre
chip_a = sum(OSSZ / 2 / o["chip"] for o in ora.values())
szoft_a = sum(OSSZ / 2 / o["szoftver"] for o in ora.values())
print(f"\nautarkia: {chip_a:.0f} chip + {szoft_a:.0f} szoftver")

# Specializáció: Alfa (chipben relatíve jobb) főleg chipet, Béta csak szoftvert gyárt
alfa_chip_ora = 840                                        # Alfa óráinak 70%-a chip
chip_s = alfa_chip_ora / ora["Alfa"]["chip"]
szoft_s = (OSSZ - alfa_chip_ora) / ora["Alfa"]["szoftver"] + OSSZ / ora["Béta"]["szoftver"]
print(f"specializáció: {chip_s:.0f} chip + {szoft_s:.0f} szoftver → mindkettőből több!")
```

Alfának egy chip 2, Bétának 3 szoftverbe kerül – tehát Alfának a chipben, Bétának a szoftverben van **komparatív előnye**. Ha Béta csak szoftvert gyárt, Alfa pedig főleg chipet, ugyanannyi munkával **mindkét termékből több** készül, mint ha mindketten mindent maguk gyártanának. A többletet kereskedelemmel osztják el: a csere aránya 2 és 3 szoftver/chip között lesz, így mindkét ország jól jár.

## 2. Egy vám nyertesei és vesztesei

Egy kis ország a világpiaci áron (60) annyit importálhat, amennyit akar. Most 20-as vámot vet ki:

```python run
# Egy vám hatása egy kis országban: hazai kereslet Q = 200 − P, kínálat Q = P − 20, világpiaci ár 60
def piac(p):
    return 200 - p, p - 20                         # (kereslet, hazai termelés)

for vam in [0, 20]:
    p = 60 + vam                                   # a vámmal a belföldi ár megemelkedik
    d, s = piac(p)
    print(f"vám {vam:>2}: ár {p}, kereslet {d}, hazai termelés {s}, import {d - s}")

d0, s0 = piac(60)
d1, s1 = piac(80)
fogy = (d0 + d1) / 2 * 20                          # fogyasztói többlet csökkenése (trapéz)
term = (s0 + s1) / 2 * 20                          # termelői többlet növekedése
bevetel = 20 * (d1 - s1)                           # vámbevétel
print(f"\nfogyasztók vesztesége {fogy:.0f} | termelők nyeresége {term:.0f} | vámbevétel {bevetel:.0f}")
print(f"holtteher-veszteség (nettó) = {fogy - term - bevetel:.0f}")
```

- A **fogyasztók** veszítenek a legtöbbet (2600): drágábban, kevesebbet vásárolnak.
- A hazai **termelők** nyernek (1000): magasabb áron többet adnak el – ők lobbiznak a vámért.
- Az **állam** vámbevételhez jut (1200).
- A különbség, **400**, senkihez nem kerül: ez a holtteher-veszteség (drágább hazai termelés és elmaradt vásárlások).

```plot
title: Vám egy kis országban (ár és mennyiség)
x: 0, 200
y: 0, 150
param: t = 20, 0, 50, 5
f: 200 - x # hazai kereslet
f: x + 20 # hazai kínálat
dash: 60 # világpiaci ár
dash: 60 + t # ár vámmal
point: 140 - t, 60 + t # kereslet vámmal
point: 40 + t, 60 + t # hazai termelés vámmal
```

A két pont közötti távolság az import: a vám növelésével zsugorodik, és 50-es vámnál (110-es árnál, ahol a hazai kereslet és kínálat egyenlő) nullára csökken – ekkora vám már **tiltó** vám. Ezért szól a közgazdászok többsége a vámok ellen: a nyereség koncentrált (néhány termelő), a veszteség szétterül (minden vásárló), de összességében nagyobb.

## 3. Árfolyam a gyakorlatban

```python run
# Árfolyam a gyakorlatban: egy 1000 eurós laptop és egy szoftverexportőr 50 000 eurós bevétele
for eur_huf in [385, 400, 415]:
    laptop = 1000 * eur_huf
    export = 50_000 * eur_huf
    print(f"1 € = {eur_huf} Ft: a laptop {laptop:,} Ft, az exportbevétel {export:,} Ft")

# Keresztárfolyam: ha 1 € = 400 Ft és 1 € = 1,10 $, akkor 1 $ = ? Ft
eur_huf, eur_usd = 400, 1.10
print(f"\nkeresztárfolyam: 1 $ = {eur_huf / eur_usd:.1f} Ft")
```

Ha a forint 385-ről 415 Ft/€-ra **gyengül**, a laptop 30 ezer forinttal drágul – de egy szoftvercég, amely euróban számláz, 1,5 millió forinttal többet kap ugyanazért a munkáért. A gyenge forint tehát az **exportőröknek** és a turizmusnak kedvez, az importáló fogyasztóknak és a devizahiteleseknek árt. A **keresztárfolyam** két árfolyamból számolható: ha 1 € = 400 Ft és 1 € = 1,10 USD, akkor 1 USD = 400 / 1,10 ≈ 364 Ft.

## 4. Vásárlóerő-paritás egy hamburgerrel

Ha ugyanaz a termék itthon 1890 Ft, az euróövezetben 5,60 €, akkor milyen árfolyamon lenne egyforma az ára?

```python run
# Vásárlóerő-paritás egy hamburgerrel: mennyibe kerül ugyanaz a termék két helyen?
ar_huf, ar_eur, piaci_arfolyam = 1890, 5.60, 400     # hamburger ára itthon (Ft), az euróövezetben (€); 1 € = 400 Ft
ppp = ar_huf / ar_eur                                 # ezen az árfolyamon lenne egyforma az ár
print(f"PPP szerinti árfolyam: 1 € = {ppp:.0f} Ft, piaci: {piaci_arfolyam} Ft")
print(f"a forint a hamburger-mérce szerint {100 * (1 - ppp / piaci_arfolyam):.0f}%-kal alulértékelt")

# Ezért nagyobb a PPP-alapú egy főre jutó GDP az árfolyamon számoltnál
gdp_fo_eur = 22_000                                   # piaci árfolyamon, €
print(f"egy főre jutó GDP árfolyamon {gdp_fo_eur:,} €, vásárlóerőn ≈ {gdp_fo_eur * piaci_arfolyam / ppp:,.0f} €")
```

A „hamburger-paritás” szerint 1 € ≈ 338 Ft lenne, a piaci árfolyam viszont 400 – a forint így ezen a mércén **alulértékelt**, azaz a forintos fizetés itthon többet ér, mint amennyit az árfolyam mutat. Ez jellemző a kevésbé fejlett országokra: a helyi szolgáltatások (munkaerő, bérleti díj) olcsóbbak. Ezért számolnak a nemzetközi összehasonlításokban **vásárlóerő-paritáson (PPP)**: az egy főre jutó GDP így magasabb, mint piaci árfolyamon. (A The Economist évente közli a „Big Mac-indexet” – félig tréfás, de tanulságos mutató.)

## Összefoglalás

- Komparatív előny: a kisebb alternatív költség dönt; specializációval és cserével mindkét fél többet fogyaszthat.
- Vám: a fogyasztók veszítenek, a termelők és az állam nyernek, a nettó eredmény holtteher-veszteség.
- Gyenge hazai valuta: jó az exportnak, rossz az importnak; keresztárfolyam = két árfolyam hányadosa.
- PPP-árfolyam: amelyen ugyanaz a kosár mindenhol ugyanannyiba kerül; a fejletlenebb országok valutája jellemzően alulértékelt.

## A lecke feladata

```quiz required
? Egy országban egy autó előállítása 10, egy számítógépé 5 munkaóra. Hány számítógép egy autó alternatív költsége?
= 2
! $10 / 5 = 2$.

? Hazai kereslet $Q = 150 - P$, kínálat $Q = P - 30$, világpiaci ár 50, vám 10. Mennyi az import?
= 60
! $P = 60$: kereslet $90$, hazai termelés $30$, import $60$.

? 1 € = 400 Ft. Hány forint egy 250 eurós termék?
= 100000
! $250 \cdot 400 = 100\,000$ Ft.

? Kinek kedvez a forint gyengülése?
+ az euróban számlázó hazai szoftvercégeknek
- az importált laptopot vásárlóknak
- a külföldre nyaralni utazóknak
- az euróhitellel rendelkezőknek
! Ugyanannyi euróért több forintot kapnak.

? Egy hamburger itthon 2000 Ft, az euróövezetben 5 €. Mennyi a PPP szerinti árfolyam (Ft/€)?
= 400
! $2000 / 5 = 400$.
```
