---
title: Mélyebben – agilis mutatók szimulációval
summary: Burndown-diagram napi adatokból programmal, kiadási előrejelzés a csapat sebességéből Monte-Carlo-szimulációval („mikor leszünk kész 85%-os biztonsággal?”), Little törvénye és a WIP-korlát hatása interaktív ábrán, valamint az inkrementális és a vízesés-szerű szállítás értékgörbéjének összevetése.
minutes: 40
---

## Amit ebben a leckében megtanulsz

- hogyan készül és mit mutat a **burndown-diagram**,
- hogyan adj **valószínűségi** előrejelzést a kiadás időpontjára a csapat sebességéből,
- miért csökkenti az átfutási időt a **WIP-korlát** (Little törvénye),
- miért ér többet ugyanaz a munka **inkrementálisan** szállítva.

## 1. Burndown-diagram

Egy 10 munkanapos sprintben a csapat 40 sztoripontot vállalt. Minden nap végén feljegyezzük, mennyi munka van még hátra; az **ideális vonal** egyenletes haladást mutat:

```python run
# Burndown-diagram: hátralévő sztoripontok naponként, az ideális vonalhoz képest
vallalas, napok = 40, 10
hatralevo = [40, 38, 38, 33, 30, 30, 24, 18, 13, 6, 0]     # a 0. nap (kezdés) és a 10 munkanap vége

for nap, h in enumerate(hatralevo):
    idealis = vallalas * (1 - nap / napok)
    sav = "█" * (h // 2)
    jel = "  ← lemaradás" if h - idealis >= 6 else ""
    print(f"{nap:>2}. nap | {h:>2} pont (ideális {idealis:4.0f}) {sav}{jel}")
```

A sprint első felében a csapat lemaradt (az 5. napon 30 pont maradt a 20 helyett) – tipikus jel, hogy a feladatok elején sok volt a tisztázatlanság, vagy egy nagy történet „egyben” készült, és csak a végén került „kész” állapotba. Ezért érdemes a történeteket **kicsire** vágni: a burndown akkor mutat valós képet, ha a munka egyenletesen, sok kis darabban fut be. A Daily Scrum-on ez a diagram a legegyszerűbb korai figyelmeztetés.

## 2. Mikor leszünk kész? Előrejelzés a sebességből

A backlogban 120 sztoripontnyi munka van. Az utolsó hat sprint sebessége: 18, 22, 15, 25, 20, 19 pont. Az átlaggal ($\approx 19{,}8$) számolva kb. 6,1 sprint – de a sebesség ingadozik! **Monte-Carlo-szimulációval** a múltbeli sebességekből véletlenszerűen húzva sok lehetséges jövőt játszunk le:

```python run
# Kiadási előrejelzés: hány sprint kell 120 ponthoz, ha a sebesség a múltbeli értékek közül véletlenszerű?
import random

random.seed(5)                                 # rögzített véletlen, hogy mindig ugyanaz jöjjön ki
multbeli = [18, 22, 15, 25, 20, 19]
backlog, futas = 120, 10_000
eredmeny = []
for _ in range(futas):
    hatra, sprintek = backlog, 0
    while hatra > 0:
        hatra -= random.choice(multbeli)       # egy sprint: egy véletlenül választott múltbeli sebesség
        sprintek += 1
    eredmeny.append(sprintek)

for n in sorted(set(eredmeny)):
    print(f"{n} sprint: {eredmeny.count(n) / futas:5.1%}   (legfeljebb ennyi: {sum(e <= n for e in eredmeny) / futas:5.1%})")
```

Az eredmény nem egyetlen szám, hanem egy eloszlás: az átlagból adódó 6 sprint alatt csak **kb. 46%** eséllyel végzünk, 7 sprint alatt viszont már kb. 99%-os biztonsággal. Ha a megrendelő határidőt kér, a 85%-os szintet érdemes vállalni (itt 7 sprint), nem az átlagot. Ez sokkal őszintébb, mint egy „pontos” dátum, és a sprintek előrehaladtával egyre pontosabb lesz.

## 3. Little törvénye és a WIP-korlát

**Little törvénye**: stabil folyamatban

$$
\text{átlagos átfutási idő} = \frac{\text{folyamatban lévő munka (WIP)}}{\text{áteresztőképesség}}.
$$

```python run
# Little törvénye: átfutási idő = WIP / áteresztőképesség (a csapat hetente 5 jegyet végez el)
atereszto = 5                                  # befejezett jegy / hét
for wip in [5, 10, 15, 20, 30]:
    print(f"WIP {wip:>2} jegy → átlagos átfutás {wip / atereszto:4.1f} hét")
```

Ha a csapat egyszerre 30 dolgon „dolgozik”, egy jegy átlagosan 6 hétig van folyamatban; ha a WIP-et 10-re korlátozza, ugyanazzal a kapacitással **2 hét** alatt végez egy-egy jeggyel. A munka nem lesz kevesebb, de a félkész dolgok sorban állása eltűnik – ráadásul a sok párhuzamos feladat közötti váltogatás valójában még csökkenti is az áteresztőképességet. Innen a Kanban jelszava: „**Hagyd abba az elkezdést, kezdd el a befejezést!**”

```plot
title: Átlagos átfutási idő (hét) a WIP függvényében
x: 1, 30
y: 0, 15
param: t = 5, 2, 10, 0.5
f: x/t # átfutás = WIP / áteresztőképesség
```

Növeld az áteresztőképességet ($t$): az egyenes laposabb lesz. De ugyanazt a hatást ingyen is elérheted: a WIP csökkentésével balra mozdulsz a görbén.

## 4. Inkrementális vs. vízesés: mikor jön az érték?

Egy 6 hónapos fejlesztés 6 nagyjából egyforma értékű funkciót tartalmaz. Vízesésnél mind a 6. hónap végén élesedik; inkrementálisan havonta egy-egy kerül ki. Ha egy élő funkció havi 1 egység hasznot hoz, mennyi haszon gyűlik össze az első évben?

```python run
# Az érték időzítése: vízesés (minden a 6. hónap végén) vs. inkrementális szállítás (havonta egy funkció)
funkciok, honapok = 6, 12

def elso_ev_haszna(kiadasi_honapok):
    # minden funkció a kiadása utáni hónaptól kezdve havi 1 egység hasznot hoz
    return sum(honapok - k for k in kiadasi_honapok)

vizeses = elso_ev_haszna([6] * funkciok)
inkrementalis = elso_ev_haszna(range(1, funkciok + 1))
print(f"vízesés: {vizeses} egység, inkrementális: {inkrementalis} egység ({inkrementalis / vizeses - 1:+.0%})")
```

Ugyanaz a munka, ugyanannyi idő – mégis az inkrementális szállítás az első évben **kb. 42%-kal** több hasznot hoz, mert az első funkciók hónapokkal korábban kezdenek dolgozni. Ráadásul a korai kiadásokból **visszajelzés** is jön: ha kiderül, hogy a 4. funkcióra senkinek sincs szüksége, el se kell készíteni. (A vízesésnek is megvan a helye: ha a termék csak egészben használható – pl. egy repülőgép vezérlőszoftvere –, a részleges szállítás nem hoz hasznot.)

## Összefoglalás

- A burndown a hátralévő munkát mutatja az ideális vonalhoz képest; kis történetekkel ad valós képet.
- A kiadás időpontjára Monte-Carlo-szimulációval valószínűségi előrejelzést adunk (pl. 85%-os szint), nem egyetlen dátumot.
- Little törvénye: átfutás = WIP / áteresztőképesség; a WIP-korlát ingyen rövidíti az átfutást.
- Az inkrementális szállítás korábban kezd értéket termelni, és visszajelzést ad.

## A lecke feladata

```quiz required
? Egy csapat hetente 4 jegyet fejez be, egyszerre átlagosan 12 jegy van folyamatban. Mennyi az átlagos átfutási idő (hét)?
= 3
! Little törvénye: $12 / 4 = 3$.

? A backlog 90 pont, a csapat átlagos sebessége 18 pont/sprint. Átlaggal számolva hány sprint kell?
= 5
! $90 / 18 = 5$.

? Mit érdemes vállalni határidőként a Monte-Carlo-előrejelzésből?
- a legjobb esetet
- az átlagot, mert az a legvalószínűbb
+ egy magas biztonsági szintet (pl. 85%), mert az átlagot csak kb. az esetek felében tartanánk
- a legrosszabb esetet, mert az a biztos
! Az átlagra tűzött határidő nagyjából pénzfeldobás.

? Egy 10 napos, 50 pontos sprintben mennyi az ideális hátralévő munka a 4. nap végén?
= 30
! $50 \cdot (1 - 4/10) = 30$.

? Miért csökkenti az átfutási időt a WIP-korlát, ha a csapat kapacitása nem változik?
- mert a csapat gyorsabban gépel
+ mert kevesebb félkész munka áll sorban, így egy-egy jegy hamarabb ér végig a folyamaton
- mert kevesebb jegy kerül a backlogba
- mert a jegyek kisebbek lesznek
! Átfutás = WIP / áteresztőképesség: kisebb WIP → rövidebb átfutás.
```
