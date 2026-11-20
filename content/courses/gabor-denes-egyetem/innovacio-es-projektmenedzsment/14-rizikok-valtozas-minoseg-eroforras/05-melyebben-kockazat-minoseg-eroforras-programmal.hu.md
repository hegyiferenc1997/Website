---
title: Mélyebben – kockázat, minőség és erőforrás programmal
summary: Kockázatnyilvántartás rangsorolása és tartalékképzés várható értékkel, döntési fa EMV-vel (fejlesszük vagy vegyük meg?), szabályozó kártya a válaszidők minőségellenőrzésére, valamint erőforrás-hisztogram és -kiegyenlítés egy kis csapat napi terhelésén – kis programokkal.
minutes: 45
---

## Amit ebben a leckében megtanulsz

- hogyan **rangsorold** a kockázatokat, és mekkora **tartalékot** képezz rájuk,
- hogyan dönts **döntési fával** két bizonytalan változat között,
- hogyan ismerd fel egy **szabályozó kártyán**, hogy egy folyamat „elszabadult”,
- hogyan vedd észre és oldd fel az **erőforrás-túlterhelést**.

## 1. Kockázatnyilvántartás és tartalék

Minden kockázatnál becsüljük a **valószínűséget** és a **hatást** (itt millió Ft-ban). A szorzat a **várható érték** (EMV); ennek összege jó kiindulás a kockázati (tartalék-) kerethez:

```python run
# Kockázatnyilvántartás: valószínűség × hatás = várható érték (EMV), rangsor és tartalék
kockazatok = [  # (azonosító, leírás, valószínűség, hatás millió Ft-ban)
    ("K1", "kulcsfejlesztő kilép", 0.2, 8.0),
    ("K2", "a külső API ára megemelkedik", 0.4, 3.0),
    ("K3", "adatmigráció hibás adatokat talál", 0.6, 4.0),
    ("K4", "biztonsági audit súlyos hibát talál", 0.3, 6.0),
    ("K5", "a felhő ára csökken (lehetőség!)", 0.5, -2.0),
]
for kid, leiras, p, hatas in sorted(kockazatok, key=lambda k: -abs(k[2] * k[3])):
    print(f"{kid} {leiras:<38} {p:>4.0%} × {hatas:>5.1f} = {p * hatas:>5.2f} M Ft")

tartalek = sum(p * hatas for _, _, p, hatas in kockazatok)
print(f"\nkockázati tartalék (az EMV-k összege): {tartalek:.2f} M Ft")
```

A legnagyobb várható értékű kockázat itt a hibás adatmigráció (2,4 M Ft) – nem a legnagyobb hatású (a kilépő fejlesztő), hanem a **legvalószínűbb**. A negatív hatás egy **lehetőség** (pozitív kockázat): csökkenti a szükséges tartalékot. A várható értékek összege (6 M Ft) azért jó tartalék, mert a kockázatok egy része bekövetkezik, más része nem; a sok kis „szerencse” és „pech” átlagosan kiegyenlítődik. (Ha egyetlen hatalmas kockázat van, ez nem működik – azt inkább **áthárítani** érdemes, pl. biztosítással vagy szerződéssel.)

## 2. Döntési fa: fejlesszük vagy vegyük meg?

Egy hallgatói nyilvántartó modult saját fejlesztéssel vagy kész termék megvásárlásával szerezhetünk be. Mindkettőben van bizonytalanság:

```python run
# Döntési fa: minden ág várható költsége = Σ valószínűség × kimenet; a kisebbet választjuk (millió Ft)
dontesek = {
    "saját fejlesztés": [(0.6, 20), (0.3, 28), (0.1, 45)],   # jól megy / csúszik / nagyon elcsúszik
    "kész termék":      [(0.8, 25), (0.2, 33)],              # testreszabás elég / extra integráció kell
}
for nev, agak in dontesek.items():
    emv = sum(p * koltseg for p, koltseg in agak)
    legrosszabb = max(koltseg for _, koltseg in agak)
    print(f"{nev:<17}: várható költség {emv:5.1f} M Ft, legrosszabb eset {legrosszabb} M Ft")
```

A saját fejlesztés várható költsége (24,9 M Ft) kicsit kisebb, mint a kész terméké (26,6 M Ft) – a várható érték szerint tehát fejleszteni érdemes. De a legrosszabb eset 45 millió, szemben a 33-mal! Egy kockázatkerülő szervezet (vagy egy kis cég, amelyet egy 45 milliós projekt tönkretehet) ésszerűen választhatja a drágább, de **kiszámíthatóbb** kész terméket. A döntési fa nem dönt helyettünk, de világossá teszi, mit „vásárolunk” a többletpénzért: biztonságot.

## 3. Szabályozó kártya: minőségellenőrzés

Egy webszolgáltatás átlagos válaszidejét naponta mérjük. A **szabályozó kártya** (Shewhart-kártya) az átlag ± 3 szórás határokat húzza meg egy stabil időszak adataiból; ami ezen kívül esik, az **különleges ok** jele, ki kell vizsgálni:

```python run
# Szabályozó kártya: határok egy stabil időszakból (átlag ± 3 szórás), új mérések ellenőrzése
from statistics import mean, stdev

stabil = [212, 205, 198, 220, 210, 207, 215, 202, 209, 213, 204, 211]   # ms, a referencia-időszak
kp = mean(stabil)
s = stdev(stabil)
also, felso = kp - 3 * s, kp + 3 * s
print(f"középvonal {kp:.1f} ms, szabályozási határok: {also:.1f} – {felso:.1f} ms\n")

uj = [208, 214, 203, 236, 211, 219, 221, 223, 225]
for nap, ertek in enumerate(uj, 1):
    jel = "  ← határon kívül: vizsgáld ki!" if not also <= ertek <= felso else ""
    print(f"{nap}. nap: {ertek} ms {'█' * ((ertek - 190) // 2)}{jel}")
```

A 4. nap kiugrása (236 ms) határon kívül van – például egy rossz telepítés vagy egy túlterhelt adatbázis okozhatta. Figyeld meg a 6–9. napot is: egyik sem lépi át a határt, de **négy egymást követő** érték egyre nő, és mind az átlag fölött van. A gyakorlatban ilyen **trendekre** is vannak szabályok (pl. hét egymást követő pont a középvonal egyik oldalán), mert egy lassan romló folyamat ugyanúgy beavatkozást igényel. A szabályozó kártya a **QC** (minőségellenőrzés) eszköze; a **QA** (minőségbiztosítás) azon dolgozik, hogy a folyamat eleve így maradjon.

## 4. Erőforrás-hisztogram és kiegyenlítés

Három fejlesztő napi terhelése (órában) a feladatok ütemezése alapján. A napi 8 óra fölött túlterhelés van:

```python run
# Erőforrás-hisztogram: napi terhelés személyenként; túlterhelés feloldása egy feladat eltolásával
feladatok = [  # (név, ki, kezdő nap, napok száma, óra/nap, tartaléknapok)
    ("backend API", "Bence", 1, 4, 6, 0), ("adatbázis-migráció", "Bence", 2, 2, 4, 3),
    ("UI-komponensek", "Csilla", 1, 5, 7, 0), ("dokumentáció", "Dávid", 1, 3, 4, 2),
    ("tesztek írása", "Dávid", 3, 3, 5, 0),
]

def hisztogram(feladatok, napok=7):
    terheles = {}
    for _, ki, kezd, hossz, ora, _ in feladatok:
        for nap in range(kezd, kezd + hossz):
            terheles.setdefault(ki, [0] * (napok + 1))[nap] += ora
    for ki, orak in terheles.items():
        sor = " ".join(f"{o:>2}{'!' if o > 8 else ' '}" for o in orak[1:])
        print(f"{ki:<7}| {sor}")

print("eredeti ütemezés (óra/nap, ! = túlterhelés):")
hisztogram(feladatok)

# Kiegyenlítés: a migrációt (3 nap tartalék) eltoljuk a backend utánra, az 5. napra
feladatok[1] = ("adatbázis-migráció", "Bence", 5, 2, 4, 0)
print("\nkiegyenlítés után:")
hisztogram(feladatok)
```

Bence a 2–3. napon 10 órát dolgozna. Mivel a migrációnak 3 nap tartaléka van, a kezdését a backend utánra toljuk: a túlterhelés eltűnik, és a projekt határideje sem csúszik (**erőforrás-simítás**). Dávidnál a 3. nap 9 órája marad – a teszteknek nincs tartaléka, a dokumentáció 1 vagy 2 napos eltolása pedig csak áthelyezi az ütközést a következő napokra; itt döntenünk kell: túlóra, a feladat megosztása, vagy egy nap csúszás (**erőforrás-kiegyenlítés**, amely a határidőt is módosíthatja). Ezt a mérlegelést a PM-szoftverek „automatikus kiegyenlítése” is csak javaslatként adja.

## Összefoglalás

- Kockázat várható értéke = valószínűség × hatás; az összeg jó kiindulás a kockázati tartalékhoz, a lehetőségek csökkentik.
- A döntési fa a várható költséget és a legrosszabb esetet is megmutatja; a kockázattűrés dönti el, melyik számít többet.
- A szabályozó kártya (átlag ± 3 szórás) jelzi a különleges okokat; a trendekre is figyelni kell.
- Az erőforrás-hisztogram mutatja a túlterhelést; először a tartalékon belüli eltolással (simítás) próbáljuk feloldani.

## A lecke feladata

```quiz required
? Egy kockázat valószínűsége 25%, a hatása 12 millió Ft. Mennyi a várható értéke (millió Ft)?
= 3
! $0{,}25 \cdot 12 = 3$.

? Döntési fa egy ága: 70% eséllyel 10, 30% eséllyel 20 millió Ft költség. Mennyi a várható költség?
= 13
! $0{,}7 \cdot 10 + 0{,}3 \cdot 20 = 7 + 6 = 13$.

? Egy folyamat átlaga 50, szórása 4. Hol van a felső szabályozási határ (átlag + 3 szórás)?
= 62
! $50 + 3 \cdot 4 = 62$.

? Mit jelent, ha egy pont a szabályozó kártyán a határokon kívül esik?
- a mérés biztosan hibás
+ valószínűleg különleges ok hatott a folyamatra, ki kell vizsgálni
- a határokat tágítani kell
- a folyamat minősége javult
! A határon belüli ingadozás a normál, véletlen szórás; a kiugrás különleges ok jele.

? Mi a különbség az erőforrás-simítás és -kiegyenlítés között?
+ a simítás csak a tartalékon belül tol el feladatokat (a határidő marad), a kiegyenlítés a határidőt is módosíthatja
- a simítás új embereket vesz fel
- a kiegyenlítés csak hétvégén történik
- nincs különbség
! A simítás a kritikus utat nem érinti.
```
