---
title: Mélyebben – érintettek és kommunikáció programmal
summary: Érintettnyilvántartás feldolgozása programmal – hatalom–érdek mátrix és stratégiák, kiemelkedési modell (hatalom, legitimitás, sürgősség), a bevonási mátrix hiányai rangsorolva –, valamint az üzenetek torzulása közvetítőkön át („csendes posta”) interaktív ábrán.
minutes: 35
---

## Amit ebben a leckében megtanulsz

- hogyan sorolja be egy program az érintetteket a **hatalom–érdek mátrixba**, és milyen stratégia jár hozzájuk,
- hogyan működik a **kiemelkedési modell** három tulajdonsággal,
- hogyan rangsorold a **bevonási teendőket** a jelenlegi és a kívánt állapot különbsége alapján,
- miért torzul az üzenet, ha sok **közvetítőn** megy át.

## 1. Hatalom–érdek mátrix programmal

Egy egyetemi tanulmányi rendszer cseréjének érintettjeit 1–10-es skálán pontoztuk hatalom (befolyás) és érdekeltség szerint. Az 5 fölötti érték „magas”:

```python run
# Hatalom–érdek mátrix: negyed és stratégia az érintettek pontszámai alapján
erintettek = {  # név: (hatalom, érdek) 1–10
    "rektor": (9, 4), "tanulmányi osztály": (7, 9), "hallgatói önkormányzat": (4, 9),
    "oktatók": (5, 7), "informatikai igazgatóság": (8, 8), "szoftverszállító": (6, 6),
    "végzett hallgatók": (2, 3), "minisztérium": (8, 2),
}
strategia = {(True, True): "szorosan együttműködni", (True, False): "elégedettnek tartani",
             (False, True): "folyamatosan tájékoztatni", (False, False): "figyelemmel kísérni"}

for nev, (h, e) in sorted(erintettek.items(), key=lambda t: -(t[1][0] + t[1][1])):
    print(f"{nev:<25} hatalom {h:>2}, érdek {e:>2} → {strategia[(h > 5, e > 5)]}")
```

A program a szokásos négy stratégiát rendeli az érintettekhez, és a hatalom + érdek összeg szerint rendez – így a lista elején vannak, akikkel a legtöbbet kell foglalkozni (informatikai igazgatóság, tanulmányi osztály). A rektor és a minisztérium nagy hatalmú, de most kevéssé érdekelt: őket **elégedettnek** kell tartani, rövid, ritka, de lényegre törő tájékoztatással – és figyelni, mert egy probléma hirtelen érdekeltté teheti őket. Fontos: a pontszámok **becslések**, és a projekt során változnak, ezért a nyilvántartást rendszeresen frissíteni kell.

## 2. A kiemelkedési modell

A kiemelkedési (_salience_) modell három igen/nem tulajdonságot néz: **hatalom** (tud-e hatni a projektre), **legitimitás** (jogos-e az igénye) és **sürgősség** (azonnali figyelmet követel-e). A kombinációkból hét érintetttípus lesz:

```python run
# Kiemelkedési modell: hatalom, legitimitás, sürgősség → érintetttípus
tipusok = {
    (1, 0, 0): "szunnyadó", (0, 1, 0): "mérlegelendő", (0, 0, 1): "követelőző",
    (1, 1, 0): "domináns", (1, 0, 1): "veszélyes", (0, 1, 1): "függő",
    (1, 1, 1): "döntő (definitív)", (0, 0, 0): "nem érintett",
}
erintettek = {
    "tanulmányi osztály": (1, 1, 1), "minisztérium": (1, 1, 0),
    "hallgatói önkormányzat": (0, 1, 1), "egy elégedetlen blogger": (0, 0, 1),
    "rektor": (1, 1, 0), "szoftverszállító": (1, 0, 0),
}
for nev, jellemzok in erintettek.items():
    db = sum(jellemzok)
    print(f"{nev:<24} {jellemzok} → {tipusok[jellemzok]:<18} (kiemelkedés: {db}/3)")
```

Minél több tulajdonsága van egy érintettnek, annál **kiemelkedőbb**, annál több figyelmet igényel. A tanulmányi osztálynak mindhárom megvan: ő a „döntő” érintett. A hallgatói önkormányzatnak nincs formális hatalma, de jogos és sürgős az igénye – ha nem foglalkozunk vele, szövetségest kereshet (pl. a sajtót), és ezzel hatalmat szerez. A modell előnye, hogy **dinamikus**: egy tulajdonság megjelenése vagy eltűnése azonnal átsorolja az érintettet.

## 3. A bevonási mátrix: hol a legnagyobb hiány?

A bevonás szintjei: nem tud róla (1) – ellenálló (2) – semleges (3) – támogató (4) – vezető szerepet vállal (5). Minden érintettnél rögzítjük a **jelenlegi** (J) és a **kívánt** (K) szintet. A teendőket a hiány és a hatalom szorzata szerint rangsoroljuk:

```python run
# Bevonási mátrix: jelenlegi és kívánt szint, a teendők rangsora (hiány × hatalom)
szintek = {1: "nem tud róla", 2: "ellenálló", 3: "semleges", 4: "támogató", 5: "vezető"}
erintettek = [  # (név, hatalom 1–10, jelenlegi, kívánt)
    ("oktatók", 5, 2, 4), ("tanulmányi osztály", 7, 3, 5), ("rektor", 9, 3, 4),
    ("hallgatói önkormányzat", 4, 1, 4), ("informatikai igazgatóság", 8, 4, 5),
]
rangsor = sorted(erintettek, key=lambda t: -(t[3] - t[2]) * t[1])
for nev, hatalom, j, k in rangsor:
    if k > j:
        print(f"{nev:<25} {szintek[j]:>12} → {szintek[k]:<9} prioritás: {(k - j) * hatalom}")
```

A lista élén a tanulmányi osztály áll (két szintet kell lépnie, és nagy a hatalma), utána a hallgatói önkormányzat (három szint hiány – őket még tájékoztatni sem tájékoztattuk!) és az ellenálló oktatók. Az ellenállást érdemes **megérteni**: mitől tartanak az oktatók? Ha attól, hogy az új rendszerben bonyolultabb lesz a jegybeírás, egy rövid bemutató és egy kísérleti csoport többet ér bármilyen körlevélnél.

## 4. Csendes posta: az üzenet torzulása

A kommunikáció modelljében minden közvetítés **zajjal** jár. Tegyük fel, hogy minden továbbadásnál az üzenet egy részlete $p$ valószínűséggel torzul vagy elvész. $k$ közvetítő után a részlet változatlanul csak $(1 - p)^k$ valószínűséggel érkezik meg:

```python run
# Az üzenet torzulása közvetítőkön át: egy részlet változatlanul (1 − p)^k eséllyel ér célba
reszletek = 10                                    # ennyi fontos részletből áll az üzenet
for p in [0.05, 0.10, 0.20]:
    sor = "  ".join(f"k={k}: {reszletek * (1 - p) ** k:4.1f}" for k in [1, 2, 4, 6])
    print(f"p = {p:.0%} | ép részletek a 10-ből: {sor}")
```

Ha minden továbbadásnál 10% a torzulás, négy közvetítő után a 10 részletből csak kb. 6,6 marad ép. Ezért fontos, hogy a kulcsüzenetek **közvetlenül** (vagy írásban, egyetlen hiteles forrásból) jussanak el az érintettekhez, és hogy a fontos döntések után legyen **visszaigazolás** („Jól értem, hogy…?”). A push kommunikáció (e-mail) önmagában nem garantálja, hogy az üzenet meg is érkezett.

```plot
title: Ép részletek aránya a közvetítők számának függvényében
x: 0, 10
y: 0, 1
param: p = 0.1, 0.01, 0.4, 0.01
f: (1 - p)^x # változatlanul megérkező részlet esélye
dash: 0.5 # a fele
```

## Összefoglalás

- A hatalom–érdek mátrix négy stratégiát ad (együttműködni, elégedettnek tartani, tájékoztatni, figyelni); a pontszámok becslések, rendszeresen frissíteni kell őket.
- A kiemelkedési modellben a hatalom, a legitimitás és a sürgősség száma mutatja, mennyi figyelem kell; a „döntő” érintettnek mindhárom megvan.
- A bevonási teendők rangsorolhatók a (kívánt − jelenlegi) × hatalom szorzattal.
- Minden közvetítés zajt visz be: $k$ közvetítő után $(1 - p)^k$ az esélye, hogy egy részlet ép marad.

## A lecke feladata

```quiz required
? Egy érintett hatalma 8, érdekeltsége 3 (az 5 fölötti érték magas). Melyik stratégia illik hozzá?
- szorosan együttműködni
+ elégedettnek tartani
- folyamatosan tájékoztatni
- figyelemmel kísérni
! Magas hatalom, alacsony érdek → elégedettnek tartani.

? A kiemelkedési modellben melyik érintettnek van hatalma és legitimitása, de nincs sürgős igénye?
- veszélyes
- függő
+ domináns
- követelőző
! Hatalom + legitimitás = domináns.

? Egy érintett jelenleg „ellenálló” (2), a kívánt szint „támogató” (4), a hatalma 6. Mennyi a prioritása (hiány × hatalom)?
= 12
! $(4 - 2) \cdot 6 = 12$.

? Egy üzenet minden továbbadásnál 20% eséllyel torzul. Mekkora eséllyel érkezik meg épen két közvetítő után? (tizedes törtként)
= 0,64
= 0.64
! $0{,}8^2 = 0{,}64$.

? Mi a legjobb módja annak, hogy egy fontos döntés pontosan eljusson az érintettekhez?
- továbbadatni a csapatvezetőkkel szóban
+ közvetlenül, egyetlen hiteles írásos forrásból közölni, és visszaigazolást kérni
- minél több csatornán, minél többféle változatban elküldeni
- megvárni, amíg az érintettek maguk kérdeznek rá
! Kevesebb közvetítő → kevesebb torzulás; a visszaigazolás ellenőrzi a megértést.
```
