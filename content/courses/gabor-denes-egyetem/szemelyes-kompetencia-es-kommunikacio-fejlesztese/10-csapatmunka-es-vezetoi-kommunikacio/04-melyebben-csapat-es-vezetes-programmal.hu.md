---
title: Mélyebben – csapat és vezetés programmal
summary: Belbin-szerepek lefedettsége egy négyfős hallgatói csapatban, helyzeti vezetés feladatonként (ugyanaz az ember, más stílus), mikor térül meg a delegálás (betanítási idő és megtakarítás), és SBI-visszajelzések ellenőrzése – kis programokkal és interaktív ábrával.
minutes: 40
---

## Amit ebben a leckében megtanulsz

- hogyan ellenőrizd, hogy egy csapatban **minden fontos szerep** le van-e fedve,
- miért **feladatonként** kell megválasztani a vezetési stílust, nem emberenként,
- hogyan számold ki, mikor **térül meg** a delegálás,
- hogyan ellenőrizd, hogy egy visszajelzés megfelel-e az **SBI-modellnek**.

## 1. Le van fedve minden szerep?

Az alapleckéből ismert Belbin-modell szerint egy jól működő csapatban a kilenc szerep mindegyikére szükség van – de egy embernek általában 2–3 erős szerepe van, így egy négyfős csapat is lefedheti mindet. Egy rövid önértékelő kérdőív után a csapat így néz ki:

```python run
# Belbin-szerepek lefedettsége: kinek mi az erős szerepe, és mi hiányzik?
szerepek = {
    "cselekvés": ["serkentő", "megvalósító", "befejező"],
    "ember": ["koordinátor", "csapatjátékos", "erőforrás-feltáró"],
    "gondolkodás": ["ötletgazda", "helyzetértékelő", "specialista"],
}
csapat = {
    "Ági": ["ötletgazda", "erőforrás-feltáró"],
    "Bálint": ["specialista", "helyzetértékelő"],
    "Dani": ["serkentő", "ötletgazda"],
    "Emese": ["csapatjátékos", "koordinátor", "megvalósító"],
}
lefedett = {}
for ember, erossegek in csapat.items():
    for sz in erossegek:
        lefedett.setdefault(sz, []).append(ember)

for csoport, lista in szerepek.items():
    print(f"{csoport}-orientált:")
    for sz in lista:
        kik = lefedett.get(sz)
        print(f"   {sz:<18} {', '.join(kik) if kik else '⚠ HIÁNYZIK'}")
dupla = [sz for sz, kik in lefedett.items() if len(kik) > 1]
print(f"\ntöbben is erősek benne: {dupla}")
```

Két tanulság:

- **Hiányzik a befejező**: senki sem az a típus, aki a végén minden apró hibát megkeres, és határidőre lezárja a munkát. Ez egy hallgatói projektben tipikus gond: a demó előtti éjjel derül ki, hogy a README hiányos, és a tesztek fele nem fut. Megoldás: valaki **tudatosan vállalja** ezt a szerepet (pl. Bálint, a helyzetértékelő), vagy a csapat **ellenőrzőlistát** használ a befejezéshez.
- **Két ötletgazda** (Ági és Dani): ez sok kreatív ötletet ad, de vitákat is – érdemes időkeretet szabni az ötletelésnek, és utána a helyzetértékelőre bízni a mérlegelést.

## 2. Helyzeti vezetés feladatonként

Az alapleckében láttuk Hersey és Blanchard modelljét: a stílus a munkatárs **felkészültségétől** és **elkötelezettségétől** függ **az adott feladatban**. Egy ember tehát egyszerre lehet K4-es (tapasztalt) az egyik és K1-es (kezdő) a másik feladatban:

```python run
# Helyzeti vezetés: stílus a felkészültség és az elkötelezettség alapján, feladatonként (1–5 skála)
def stilus(felkeszultseg, elkotelezettseg):
    if felkeszultseg <= 2 and elkotelezettseg >= 4:
        return "S1 – irányító"            # lelkes kezdő
    if felkeszultseg <= 3 and elkotelezettseg <= 3:
        return "S2 – tanácsadó"           # tanul, de elbizonytalanodott
    if felkeszultseg >= 4 and elkotelezettseg <= 3:
        return "S3 – támogató"            # tudja, de bizonytalan vagy motiválatlan
    if felkeszultseg >= 4:
        return "S4 – delegáló"            # tapasztalt és magabiztos
    return "S2 – tanácsadó"

feladatok = [  # (ember, feladat, felkészültség, elkötelezettség)
    ("Bálint", "adatbázis-séma tervezése", 5, 5),
    ("Bálint", "előadás a megrendelőnek", 2, 2),
    ("Emese", "sprinttervezés levezetése", 4, 2),
    ("Dani", "első React-komponens", 1, 5),
]
for ember, feladat, f, e in feladatok:
    print(f"{ember:<7} {feladat:<28} → {stilus(f, e)}")
```

Bálintnak az adatbázis-tervezést nyugodtan **delegálhatod** – de az előadásnál, ahol kezdő és tart is tőle, **tanácsadó** stílus kell: magyarázd el, mire figyeljen, gyakoroljátok együtt, és bátorítsd. Emese tudja, hogyan kell sprinttervezést vezetni, de valamiért motiválatlan (talán úgy érzi, nem értékelik a munkáját) – neki **támogatás** kell, nem utasítás. A leggyakoribb vezetői hiba, hogy valakit egyszer „ügyesnek” vagy „kezdőnek” címkézünk, és minden feladatban ugyanúgy kezeljük.

## 3. Mikor térül meg a delegálás?

„Gyorsabb, ha megcsinálom magam” – ez egyszeri feladatnál igaz lehet, ismétlődőnél szinte soha. Tegyük fel, hogy egy heti feladat (pl. a heti kiadás összeállítása) neked **2 órába** kerül. A betanítás egyszeri **6 óra**, utána hetente fél óra ellenőrzés és kérdés marad nálad:

```plot
title: Ráfordított saját idő (óra) a hetek függvényében
x: 0, 12
y: 0, 24
param: t = 6, 0, 15, 0.5
f: 2*x # magam csinálom
f: t + 0.5*x # delegálom (betanítás + heti ellenőrzés)
```

A két egyenes ott metszi egymást, ahol $2x = t + 0{,}5x$, vagyis $x = t / 1{,}5$: 6 órás betanításnál **4 hét** után térül meg a delegálás, és utána hetente másfél órát nyersz. Húzd a csúszkát: még egy 12 órás betanítás is 8 hét alatt behozza magát – egy féléves projektben bőven.

```python run
# Delegálás megtérülése: mikor lesz kevesebb a saját ráfordításod?
def megterules(sajat_ido, betanitas, ellenorzes):
    # hány hét után térül meg (heti ismétlődő feladat)
    megtakaritas = sajat_ido - ellenorzes
    return betanitas / megtakaritas if megtakaritas > 0 else None

for feladat, sajat, betanit, ellenoriz in [
    ("heti kiadás összeállítása", 2, 6, 0.5),
    ("meetingjegyzet írása", 0.5, 1, 0.1),
    ("egyszeri szerverköltöztetés", 8, 10, 8),
]:
    het = megterules(sajat, betanit, ellenoriz)
    print(f"{feladat:<28} {'nem térül meg' if het is None else f'{het:.1f} hét után megtérül'}")
```

A harmadik sor is tanulságos: egy **egyszeri** feladatnál nincs heti megtakarítás – itt a delegálás oka nem az idő, hanem a **fejlesztés** lehet (a kolléga tanul belőle), és ez is érvényes szempont. A delegálás tehát egyszerre **időbefektetés** és **emberbe fektetés**.

## 4. SBI-visszajelzés ellenőrzése

Az SBI-modell (Situation – Behavior – Impact: helyzet, viselkedés, hatás) szerint a jó visszajelzés **konkrét helyzetet** nevez meg, **megfigyelhető viselkedést** ír le (nem személyiséget), és megmondja a **hatását**. Egy egyszerű ellenőrző:

```python run
# SBI-ellenőrzés: van-e konkrét helyzet, megfigyelhető viselkedés és hatás egy visszajelzésben?
import re

def sbi(szoveg):
    s = szoveg.lower()
    helyzet = bool(re.search(r"tegnap|\bma\b|hétfő|kedd|szerda|csütörtök|péntek|múlt hét|demó|meeting", s))
    minosites = bool(re.search(r"\b(lusta|hanyag|ügyetlen|zseni|mindig|soha)\b", s))
    hatas = bool(re.search(r"\b(emiatt|ezért|így|aminek köszönhetően|ami miatt)\b", s))
    gondok = [f"hiányzik: {nev}" for nev, ok in [("helyzet", helyzet), ("hatás", hatas)] if not ok]
    if minosites:
        gondok.append("viselkedés helyett minősítés")
    return gondok or ["teljes SBI"]

for v in [
    "Mindig késel, ez nagyon hanyag.",
    "Ügyes vagy!",
    "A tegnapi demón te kezelted a kérdéseket nyugodtan és pontosan, emiatt a megrendelő bizalma látványosan nőtt.",
    "A hétfői meetingen 15 percet késtél, ezért a sprinttervezést újra kellett kezdenünk.",
]:
    print(f"„{v}”\n   → {', '.join(sbi(v))}")
```

Figyeld meg, hogy a „Ügyes vagy!” dicséret is **gyenge** visszajelzés: jólesik, de nem derül ki belőle, mit érdemes megismételni. A konkrét dicséret („a tegnapi demón nyugodtan kezelted a kérdéseket, emiatt…”) **tanít**. A negatív visszajelzés is SBI-jal a legkönnyebben fogadható, mert a viselkedésről szól, nem a személyről.

## Összefoglalás

- A Belbin-szerepek lefedettsége egyszerű táblázattal ellenőrizhető; a hiányzó szerepet valaki tudatosan vállalhatja, vagy egy folyamat (pl. ellenőrzőlista) pótolhatja.
- A helyzeti vezetési stílust feladatonként kell megválasztani: ugyanaz az ember az egyik feladatban delegálható, a másikban irányítást vagy támogatást igényel.
- Heti ismétlődő feladatnál a delegálás megtérülési ideje: betanítás / (saját idő − ellenőrzés).
- A jó visszajelzés helyzetet, megfigyelhető viselkedést és hatást tartalmaz – a dicséret is.

## A lecke feladata

```quiz required
? Egy heti feladat neked 3 órába kerül. A betanítás 10 óra, utána hetente 1 óra ellenőrzés marad nálad. Hány hét után térül meg a delegálás?
= 5
! $10 / (3 - 1) = 5$ hét.

? A lecke csapatában melyik Belbin-szerep hiányzott?
- ötletgazda
- specialista
+ befejező
- koordinátor
! Senki sem volt erős abban, hogy a végén megkeresse a hibákat és határidőre lezárja a munkát.

? Egy kolléga tapasztalt egy feladatban, de most motiválatlan és bizonytalan. Melyik helyzeti vezetési stílus illik hozzá?
- irányító
- tanácsadó
+ támogató
- delegáló
! Magas felkészültség, alacsony elkötelezettség → támogató (S3).

? Melyik visszajelzés felel meg az SBI-modellnek?
- „Mindig késel, ez nagyon hanyag.”
- „Ügyes vagy!”
+ „A hétfői meetingen 15 percet késtél, ezért a sprinttervezést újra kellett kezdenünk.”
- „Jobban kellene figyelned.”
! Helyzet (hétfői meeting), viselkedés (15 perc késés), hatás (újra kellett kezdeni).

? Mi lehet az oka egy egyszeri feladat delegálásának, ha időt nem nyersz vele?
- semmi, ilyenkor soha nem szabad delegálni
+ a kolléga fejlődése: tanul a feladatból
- hogy kevesebb legyen a felelősséged
- hogy ne kelljen ellenőrizni
! A delegálás emberbe fektetés is.
```
