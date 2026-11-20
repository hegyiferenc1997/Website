---
title: Mélyebben – folyamatjavítás adatokkal
summary: Pareto-elemzés hibajegyekből programmal, az értékáram folyamathatékonysága (mennyi a várakozás az átfutási időben), a Six Sigma szigmaszintje és a hibák száma millió lehetőségre (DPMO), valamint a PDCA-ciklusok halmozódó hatása – kis programokkal és interaktív ábrával.
minutes: 40
---

## Amit ebben a leckében megtanulsz

- hogyan készíts **Pareto-elemzést** adatokból, és hogyan döntsd el, mivel kezdd a javítást,
- hogyan mérd egy folyamat **hatékonyságát** az értékáramban, és miért a várakozás a legnagyobb veszteség,
- mit jelent számokban a **Six Sigma** (3,4 hiba millió lehetőségre),
- miért éri meg a kis lépésekben, de **folyamatosan** javító PDCA.

## 1. Pareto-elemzés hibajegyekből

Egy webalkalmazás ügyfélszolgálatára egy hónap alatt beérkezett hibajegyeket kategóriák szerint összeszámoltuk. A **Pareto-elv** szerint a problémák nagy részét (kb. 80%) kevés ok (kb. 20%) okozza. Nézzük meg, igaz-e itt:

```python run
# Pareto-elemzés: hibajegyek kategóriánként, csökkenő sorrend és halmozott százalék
jegyek = {"bejelentkezés": 46, "fizetés": 31, "lassú oldal": 12, "e-mail értesítés": 9,
          "megjelenítés mobilon": 7, "fordítási hiba": 5, "exportálás": 3, "egyéb": 7}

osszes = sum(jegyek.values())
halmozott = 0
print(f"{'kategória':<22}{'db':>4}{'halmozott':>11}")
for nev, db in sorted(jegyek.items(), key=lambda t: -t[1]):
    halmozott += db
    jelzo = "  ← itt kezdd" if halmozott - db < 0.8 * osszes else ""
    print(f"{nev:<22}{db:>4}{halmozott / osszes:>10.0%}{jelzo}")
```

A 8 kategóriából az első kettő (bejelentkezés, fizetés) a jegyek **64%-a**, az első négy már 82%-a. Ha a csapat a bejelentkezési és fizetési hibákra koncentrál, a panaszok jó kétharmadát megszüntetheti – sokkal hatékonyabban, mintha egyenletesen osztaná el az erejét. (Figyelem: a darabszám nem minden; egy ritka, de súlyos hiba – pl. adatvesztés – előrébb kerülhet, ha **súllyal** szorozzuk.) A következő lépés az **5 miért** módszer a legnagyobb kategórián: miért nem tudnak belépni a felhasználók?

## 2. Értékáram: hol megy el az idő?

Egy új funkció útja a kéréstől az élesítésig. Minden lépésnél megmértük a **tényleges munkaidőt** és a **várakozást** (sorban állás, jóváhagyásra várás):

```python run
# Értékáram-térkép számokban: munkaidő és várakozás lépésenként (órában)
lepesek = [("igény pontosítása", 2, 30), ("fejlesztés", 16, 8), ("kódellenőrzés", 1, 20),
           ("tesztelés", 4, 40), ("jóváhagyás", 0.5, 60), ("élesítés", 0.5, 24)]

munka = sum(m for _, m, _ in lepesek)
varakozas = sum(v for _, _, v in lepesek)
atfutas = munka + varakozas
print(f"munkaidő: {munka} óra, várakozás: {varakozas} óra, átfutási idő: {atfutas} óra")
print(f"folyamathatékonyság (munka / átfutás): {munka / atfutas:.0%}")

# Javítás: a jóváhagyás és a tesztelés előtti sorban állás felére csökken
javitott = sum(v / 2 if nev in ("jóváhagyás", "tesztelés") else v for nev, _, v in lepesek)
print(f"javítás után: átfutás {munka + javitott} óra, hatékonyság {munka / (munka + javitott):.0%}")
```

A 206 órás átfutásból mindössze 24 óra a **valódi munka** – a folyamathatékonyság 12%. Ez tipikus: a legtöbb folyamatban az idő nagy része **várakozással** telik, nem munkával. A Lean ezért először a hét veszteség közül a várakozást keresi: ha a két leghosszabb sorban állást felére csökkentjük, az átfutás 156 órára esik, anélkül hogy bárki gyorsabban dolgozna. (Ezért terjedt el az automatikus tesztelés és élesítés – CI/CD –, amely épp a várakozást vágja ki.)

## 3. Six Sigma: mennyi az a 3,4?

A Six Sigma célja, hogy egy folyamat **millió lehetőségből legfeljebb 3,4 hibát** ejtsen (DPMO, _defects per million opportunities_). A szigmaszint azt mutatja, hány szórásnyira van a folyamat átlaga a tűréshatártól; a gyakorlatban 1,5 szigmás hosszú távú „elcsúszással” számolnak:

```python run
# Six Sigma: szigmaszint ↔ hibák millió lehetőségre (1,5 szigmás eltolással)
from statistics import NormalDist

norm = NormalDist()                       # standard normális eloszlás
for szint in [2, 3, 4, 5, 6]:
    dpmo = (1 - norm.cdf(szint - 1.5)) * 1_000_000
    print(f"{szint} szigma: {dpmo:>10.1f} hiba / millió lehetőség, kihozatal {1 - dpmo / 1e6:.4%}")

# Egy valós folyamat: 50 000 rendelés, mindegyikben 4 hibalehetőség, 120 hiba
dpmo = 120 / (50_000 * 4) * 1_000_000
print(f"\nrendelési folyamat: DPMO = {dpmo:.0f}, szigmaszint ≈ {norm.inv_cdf(1 - dpmo / 1e6) + 1.5:.2f}")
```

A 3 szigmás folyamat kb. 66 800 hibát ejt millióból (93,3% jó), a 6 szigmás csak 3,4-et. Egy szoftveres rendelési folyamat 600-as DPMO-val kb. 4,7 szigmán áll. A szigmaszint egy **közös nyelv**: különböző folyamatok (gyártás, ügyfélszolgálat, informatika) minősége összehasonlíthatóvá válik.

```plot
title: Egy folyamat eloszlása és a ±3-as tűréshatár
x: -6, 6
y: 0, 0.8
param: s = 1, 0.5, 2, 0.05
f: e^(-(x^2)/(2*s^2))/(s*sqrt(2*pi)) # a folyamat eloszlása
point: -3, 0 # alsó tűréshatár
point: 3, 0 # felső tűréshatár
```

Csökkentsd a szórást ($s$): a görbe összehúzódik, és egyre kevesebb esik a tűréshatárokon kívülre. A Six Sigma lényege pontosan ez: a **szórás csökkentése**.

## 4. PDCA: a kis javítások összeadódnak

A PDCA-ciklus (tervezd – csináld – ellenőrizd – avatkozz be) kis, ellenőrzött javításokat hoz. Ha minden ciklus csak 15%-kal csökkenti a hibák arányát, mi történik egy év alatt?

```python run
# PDCA: minden havi ciklus 15%-kal csökkenti a hibaarányt (szorzódó hatás)
hibaarany = 0.08                      # kezdetben a rendelések 8%-a hibás
for honap in range(1, 13):
    hibaarany *= 1 - 0.15             # egy ciklus hatása
    if honap % 3 == 0:
        print(f"{honap:>2}. hónap után: {hibaarany:.2%}")
print(f"egy év alatt a hibák {1 - hibaarany / 0.08:.0%}-kal csökkentek")
```

Tizenkét kis lépés együtt **86%-os** csökkenést hoz – a javítások szorzódnak. Ez a Kaizen szemlélete: nem egy nagy, kockázatos átalakítás, hanem folyamatos, mérhető apró javítások.

## Összefoglalás

- Pareto-elemzés: rendezd csökkenő sorrendbe, számold a halmozott százalékot, és a 80%-ot adó kevés okkal kezdd.
- Folyamathatékonyság = munkaidő / átfutási idő; a legnagyobb tartalék általában a várakozás csökkentése.
- Six Sigma: 6 szigma = 3,4 DPMO; a minőség javítása a szórás csökkentése.
- A PDCA kis javításai szorzódnak: 12 × 15% csökkenés ≈ 86% kevesebb hiba.

## A lecke feladata

```quiz required
? Egy folyamatban a munkaidő 6 óra, a várakozás 54 óra. Mennyi a folyamathatékonyság (%)?
= 10
! $6 / (6 + 54) = 0{,}1 = 10\%$.

? 10 000 egységben, egységenként 5 hibalehetőséggel 25 hibát találtak. Mennyi a DPMO?
= 500
! $\frac{25}{10\,000 \cdot 5} \cdot 1\,000\,000 = 500$.

? Mi a Pareto-elemzés gyakorlati haszna?
- minden hibát egyszerre kijavítunk
+ megmutatja azt a kevés okot, amely a problémák nagy részéért felel, így ott kezdjük a javítást
- a hibák számát nullára csökkenti
- a legritkább hibákat keresi meg
! Kb. 20% ok felel kb. 80% problémáért.

? Ha két PDCA-ciklus mindegyike 50%-kal csökkenti a hibák számát, összesen hány százalékkal csökken?
= 75
! $0{,}5 \cdot 0{,}5 = 0{,}25$ marad, tehát 75%-os a csökkenés.

? Mit jelent a Six Sigma a folyamat eloszlására nézve?
- a folyamat átlaga nő
+ a szórás csökkentését, hogy szinte semmi ne essen a tűréshatárokon kívülre
- a tűréshatárok szűkítését
- a mérések számának csökkentését
! Kisebb szórás → kevesebb hiba.
```
