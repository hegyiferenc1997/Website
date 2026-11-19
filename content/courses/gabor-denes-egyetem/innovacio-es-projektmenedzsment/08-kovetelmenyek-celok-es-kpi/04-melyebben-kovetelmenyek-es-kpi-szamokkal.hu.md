---
title: Mélyebben – követelmények és KPI-k számokkal
summary: MoSCoW-priorizálás kapacitáskorláttal (miért nem mindig a legjobb az „érték/ráfordítás” sorrend – a hátizsák-probléma), egy SMART cél elérhetőségének ellenőrzése a szükséges növekedési ütemmel, KPI-kártya és RAG-státusz programmal, valamint OKR-értékelés – kis programokkal és interaktív ábrával.
minutes: 40
---

## Amit ebben a leckében megtanulsz

- hogyan válassz ki felhasználói történeteket egy kiadásba **korlátozott kapacitás** mellett,
- hogyan ellenőrizd számokkal, hogy egy SMART cél **elérhető-e** (A betű),
- hogyan számol a gép egy KPI-ból **zöld–sárga–piros** státuszt,
- hogyan értékelnek egy **OKR**-t, és miért jó a 0,7.

## 1. MoSCoW és a kapacitás: a hátizsák-probléma

A következő kiadásba 20 sztoripontnyi munka fér. A **Must** történetek mindenképpen bekerülnek, a maradék helyre **Should** és **Could** történeteket válogatunk úgy, hogy a lehető legnagyobb **üzleti értéket** kapjuk. Első ötlet: rendezzük őket érték/ráfordítás arány szerint, és vegyük sorra, ami még befér (mohó módszer).

```python run
# MoSCoW + kapacitás: melyik Should/Could történet férjen még be a kiadásba?
import itertools

tortenetek = [  # (név, MoSCoW, sztoripont, üzleti érték)
    ("bejelentkezés", "M", 5, 10), ("kurzuslista", "M", 5, 8),
    ("értesítések", "S", 6, 9), ("keresés", "S", 5, 7), ("naptár-szinkron", "C", 5, 7),
    ("profilkép", "C", 2, 1), ("chat", "W", 13, 9),
]
kapacitas = 20
must = [t for t in tortenetek if t[1] == "M"]
jeloltek = [t for t in tortenetek if t[1] in "SC"]            # a Won't ebben a kiadásban nem jöhet
szabad = kapacitas - sum(t[2] for t in must)
print(f"a Must történetek után szabad kapacitás: {szabad} pont")

# 1) mohó: érték/ráfordítás szerint csökkenő sorrend, ami befér
mohon, hely = [], szabad
for t in sorted(jeloltek, key=lambda t: -t[3] / t[2]):
    if t[2] <= hely:
        mohon.append(t)
        hely -= t[2]
print(f"mohó választás: {[t[0] for t in mohon]}, érték {sum(t[3] for t in mohon)}")

# 2) minden kombináció kipróbálása (kevés történetnél ez gyors)
legjobb = max((c for r in range(len(jeloltek) + 1) for c in itertools.combinations(jeloltek, r)
               if sum(t[2] for t in c) <= szabad), key=lambda c: sum(t[3] for t in c))
print(f"optimális választás: {[t[0] for t in legjobb]}, érték {sum(t[3] for t in legjobb)}")
```

A mohó módszer a legjobb arányú „értesítéseket” választja (6 pont), ami után csak a profilkép fér be: összesen 10 érték. A keresés és a naptár-szinkron együtt viszont pontosan kitölti a 10 pontot, és 14 értéket ad! Ez a híres **hátizsák-probléma**: az arány szerinti sorrend jó hüvelykujjszabály, de nem mindig optimális, mert a „maradék hely” elveszhet. Kevés tételnél a gép az összes kombinációt kipróbálhatja ($2^n$ eset); sok tételnél ügyesebb algoritmus (dinamikus programozás) kell. A gyakorlatban persze a szám csak segít: a végső döntés a terméktulajdonosé, aki a függőségeket és a felhasználókat is ismeri.

## 2. Elérhető-e a SMART cél?

„12 hónap alatt 2000-ről 10 000-re növeljük a havi aktív felhasználók számát.” Konkrét, mérhető, határidős – de **elérhető**? Számoljuk ki a szükséges havi növekedési ütemet:

```python run
# SMART cél elérhetősége: mekkora havi növekedés kell 2000 → 10 000 felhasználóhoz 12 hónap alatt?
kezdo, cel, honapok = 2000, 10_000, 12
g = (cel / kezdo) ** (1 / honapok) - 1                  # kamatos kamat képletének megfordítása
print(f"szükséges havi növekedés: {g:.1%}")

# Összevetés a múltbeli adatokkal: az elmúlt fél év havi növekedései
multbeli = [0.06, 0.08, 0.05, 0.07, 0.09, 0.06]
atlag = sum(multbeli) / len(multbeli)
print(f"múltbeli átlag: {atlag:.1%}, ezzel 12 hónap alatt: {kezdo * (1 + atlag) ** honapok:.0f} felhasználó")
```

A cél havi **14,4%**-os növekedést igényel, a múltbeli átlag viszont 6,8% – ezzel egy év alatt kb. 4400 felhasználó lesz, nem 10 000. A cél tehát a jelenlegi működéssel **nem elérhető**: vagy valami újat kell csinálni (pl. egyetemi partnerségek), vagy a célt kell reálisabbra venni. A SMART „A” betűje így számokkal ellenőrizhető.

```plot
title: Felhasználók száma havi g növekedés mellett (kezdés: 2000, cél: 10 000)
x: 0, 12
y: 0, 14000
param: g = 0.068, 0.02, 0.2, 0.002
f: 2000*(1 + g)^x # felhasználók
dash: 10000 # cél
```

Állítsd a csúszkát 0,144-re: a görbe pontosan a 12. hónapban éri el a célvonalat.

## 3. KPI-kártya és RAG-státusz

Egy KPI-hoz nem elég a szám: kell egy **cél**, egy **irány** (több a jobb, vagy kevesebb?) és **tűréshatár**. Ebből a gép automatikusan színt rendel:

```python run
# KPI-kártya: tényleges érték a célhoz képest, irány és tűréshatár alapján zöld / sárga / piros
kpik = [  # (név, tényleges, cél, "fel" = több a jobb / "le" = kevesebb a jobb)
    ("havi aktív felhasználó", 4200, 4000, "fel"),
    ("oldalbetöltés (ms)", 1150, 1000, "le"),
    ("nyitott kritikus hibák", 9, 3, "le"),
    ("regisztrációs konverzió (%)", 3.6, 4.0, "fel"),
]

def statusz(tenyleges, cel, irany, tures=0.10):
    teljesites = tenyleges / cel if irany == "fel" else cel / tenyleges   # 1 felett = jobb a célnál
    if teljesites >= 1:
        return teljesites, "ZÖLD"
    return teljesites, "SÁRGA" if teljesites >= 1 - tures else "PIROS"

for nev, tenyleges, cel, irany in kpik:
    t, szin = statusz(tenyleges, cel, irany)
    print(f"{nev:<29} {tenyleges:>6} (cél {cel:>5}) → {t:5.0%}  {szin}")
```

A „kevesebb a jobb” mutatóknál (betöltési idő, hibák) fordítva kell osztani – ez gyakori hiba a kézzel vezetett táblázatokban. A RAG-státusz arra jó, hogy a vezetői jelentésben **azonnal** látsszon, hová kell figyelni: itt a kritikus hibák száma piros, ezzel kell kezdeni.

## 4. OKR-értékelés

Az **OKR**-nél (_Objectives and Key Results_) minden kulcseredményt 0 és 1 között értékelünk, a cél pontszáma az átlag. A Google-nál elterjedt szemlélet szerint a **0,6–0,7** a „jó” eredmény: ha mindig 1,0 jön ki, a célok túl kényelmesek voltak.

```python run
# OKR: a kulcseredmények teljesülése 0–1 között, a cél pontszáma az átlag
cel = "A tanulós app legyen a hallgatók kedvence"
kulcseredmenyek = [  # (leírás, kiinduló, elért, célérték)
    ("havi aktív felhasználó", 2000, 4200, 5000),
    ("alkalmazásbolti értékelés", 3.9, 4.4, 4.6),
    ("heti visszatérő arány (%)", 20, 31, 40),
]
pontok = []
for leiras, kiindulo, elert, celertek in kulcseredmenyek:
    p = min(1.0, max(0.0, (elert - kiindulo) / (celertek - kiindulo)))   # a megtett út aránya
    pontok.append(p)
    print(f"{leiras:<27}: {p:.2f}")
print(f"\n„{cel}” pontszáma: {sum(pontok) / len(pontok):.2f}")
```

A pontszám a **megtett utat** méri a kiindulástól a célig, nem a célértékhez viszonyított arányt: a 4,4-es értékelés a 4,6-os célnak 96%-a lenne, de a 3,9-ről indulva csak a 71%-át tettük meg az útnak. Ez igazságosabb kép a haladásról.

## Összefoglalás

- Kapacitáskorlátnál a történetek kiválasztása hátizsák-probléma: az érték/ráfordítás sorrend jó közelítés, de nem mindig optimális.
- Egy növekedési cél elérhetősége a szükséges ütemmel ellenőrizhető: $g = (\text{cél} / \text{kezdő})^{1/n} - 1$, összevetve a múltbeli adatokkal.
- A KPI státuszához cél, irány és tűréshatár kell; „kevesebb a jobb” mutatónál fordítva osztunk.
- OKR-pontszám = a megtett út aránya kulcseredményenként, átlagolva; a 0,6–0,7 jó eredmény.

## A lecke feladata

```quiz required
? Szabad kapacitás: 8 pont. Történetek (pont, érték): X (5, 8), Y (4, 5), Z (4, 5). Mekkora a legnagyobb elérhető összérték?
= 10
! Y + Z = 8 pont, 10 érték; a jobb arányú X után már semmi sem férne be (8 érték).

? Egy célhoz 2 év alatt a felhasználók számát meg kell négyszerezni. Hány százalékos éves növekedés kell?
= 100
! $\sqrt{4} - 1 = 1 = 100\%$ évente (2 · 2 = 4).

? Az oldalbetöltési idő célja 800 ms, a tényleges 1000 ms. Hány százalékos a teljesítés (kevesebb a jobb)?
= 80
! $800 / 1000 = 0{,}8 = 80\%$.

? Egy OKR kulcseredménye: kiindulás 20, cél 60, elért 50. Mennyi a pontszáma?
= 0,75
= 0.75
! $(50 - 20) / (60 - 20) = 30 / 40 = 0{,}75$.

? Miért gyanús, ha egy csapat OKR-pontszáma minden negyedévben 1,0?
- mert a pontszám nem lehet 1,0
+ mert valószínűleg túl kényelmes, nem elég ambiciózus célokat tűztek ki
- mert az OKR csak egyéni célokra jó
- mert a kulcseredményeket nem lehet mérni
! Az OKR-nél a 0,6–0,7 számít jó eredménynek.
```
