---
title: Mélyebben – önismeret adatokkal
summary: Önértékelés és mások értékelése összevetve (360 fokos visszajelzés és a Johari-ablak programmal), mennyire pontosan becsülöd meg a saját teljesítményedet (kalibráció), miért kell óvatosan bánni a Dunning–Kruger-hatással, és egy elrontott demó feldolgozása Gibbs ciklusával – kis programokkal és interaktív ábrával.
minutes: 40
---

## Amit ebben a leckében megtanulsz

- hogyan vesd össze **számszerűen** a saját és mások rólad alkotott képét,
- hogyan mérd, mennyire **pontosan** becsülöd meg a saját teljesítményedet,
- miért vitatott a népszerű **Dunning–Kruger-hatás** értelmezése,
- hogyan dolgozz fel egy kudarcot **lépésről lépésre**.

## 1. 360 fokos visszajelzés és a Johari-ablak

Az alapleckében láttuk a Johari-ablakot: vannak tulajdonságaink, amelyeket mi is és mások is ismernek (**nyílt terület**), és vannak, amelyeket mások látnak, mi nem (**vak folt**). Egy csapatprojekt végén kérj **360 fokos visszajelzést**: értékeld magad néhány kompetenciában 1–5-ig, és kérd meg a csapattársaidat is (névtelenül). A különbségek sokat elárulnak:

```python run
# 360 fokos visszajelzés: önértékelés vs. a csapattársak átlaga, eltérések és értelmezésük
from statistics import mean

kompetenciak = {  # kompetencia: (önértékelés, [csapattársak értékelései])
    "műszaki tudás": (4, [4, 5, 4]),
    "határidők betartása": (4, [2, 3, 2]),
    "segítőkészség": (3, [5, 4, 5]),
    "kommunikáció a megrendelővel": (2, [2, 3, 2]),
    "visszajelzés elfogadása": (4, [3, 2, 3]),
}
for nev, (onert, masok) in kompetenciak.items():
    atlag = mean(masok)
    elteres = onert - atlag
    if elteres >= 1:
        ertelmezes = "vak folt: többre tartod magad, mint mások"
    elif elteres <= -1:
        ertelmezes = "rejtett erősség: mások többre tartanak, mint te"
    else:
        ertelmezes = "egyezik (nyílt terület)"
    print(f"{nev:<30} saját {onert}, mások {atlag:.1f}, eltérés {elteres:+.1f} → {ertelmezes}")
```

Három különböző helyzet:

- **Vak folt** (határidők, visszajelzés elfogadása): úgy hiszed, ebben jó vagy, a csapat szerint nem. Ez a legértékesebb információ, mert magadtól nem vennéd észre. Ne vitatkozz vele – kérdezz rá: „Tudnál mondani egy konkrét helyzetet, amikor ezt láttad?”
- **Rejtett erősség** (segítőkészség): mások értékesebbnek látják, mint te. Ez az önbizalomhoz és a személyes márkádhoz is fontos (és az imposztor-szindróma egyik jele lehet).
- **Egyezés** (műszaki tudás, kommunikáció a megrendelővel): itt pontos a képed – a gyenge pontot (kommunikáció) mindenki látja, így könnyű közös fejlődési célt kitűzni.

> Három értékelő kevés ahhoz, hogy egy-egy eltérést biztosnak vegyél – a minta kicsi, és egy rossz nap is torzíthat. Tendenciát keress, ne ítéletet.

## 2. Mennyire jól ismered a saját teljesítményedet? A kalibráció

Egy hasznos önismereti gyakorlat: minden gyakorló feladatsor vagy próbavizsga **előtt** írd le, hány százalékra számítasz, és utána vesd össze a valós eredménnyel. Ez a **kalibráció**:

```python run
# Kalibráció: előzetes becslés vs. valós eredmény, átlagos torzítás és átlagos hiba
from statistics import mean

eredmenyek = [  # (feladatsor, becsült %, valós %)
    ("Programozás – 1. gyakorló", 80, 62),
    ("Matematika – 1. gyakorló", 60, 55),
    ("Programozás – 2. gyakorló", 85, 70),
    ("Matematika – 2. gyakorló", 50, 58),
    ("Adatbázisok – 1. gyakorló", 75, 64),
]
elteresek = [becsles - valos for _, becsles, valos in eredmenyek]
torzitas = mean(elteresek)                           # pozitív: túlbecslés
atlagos_hiba = mean(abs(e) for e in elteresek)        # mekkora a tipikus tévedés
print(f"átlagos torzítás: {torzitas:+.1f} százalékpont ({'túlbecslés' if torzitas > 0 else 'alulbecslés'})")
print(f"átlagos hiba: {atlagos_hiba:.1f} százalékpont")
for nev, b, v in eredmenyek:
    print(f"   {nev:<28} becslés {b}%, valós {v}%  ({b - v:+d})")
```

A minta szerint **programozásból rendszeresen túlbecslöd** magad (15–18 ponttal), matematikából viszont nagyjából pontos vagy, sőt egyszer alá is becsülted. Ez konkrét tanulság: programozásból az „értem, amikor olvasom” érzés **félrevezet** – a tudást csak a saját kezűleg megírt kód méri. A cél nem az, hogy pesszimista legyél, hanem hogy a becslésed közelítsen a valósághoz – így tudod jól beosztani a tanulási idődet.

## 3. A Dunning–Kruger-hatás – óvatosan!

A népszerű változat szerint „a kevésbé tudók túlbecsülik magukat, a tudók alábecsülik”. Dunning és Kruger 1999-es vizsgálatában valóban az látszott, hogy a leggyengébben teljesítők jóval többre becsülték magukat, mint az eredményük. Az ábra egy **szemléltető** változatot mutat:

```plot
title: Önbecslés a valós eredmény függvényében (szemléltető modell)
x: 0, 100
y: 0, 100
param: m = 0.4, 0, 1, 0.05
f: x # tökéletes önismeret
f: 60 + m*(x - 50) # tipikus önbecslés: „mindenki kicsit átlag fölöttinek érzi magát”
```

Ha $m < 1$, a görbe laposabb az átlónál: a gyengébbek túl-, az erősebbek alulbecsülik magukat. De **miért** lapos? Itt jön a másik nézőpont:

- **Pszichológiai magyarázat** (Dunning–Kruger): aki kevésbé ért egy területhez, annak a hibái felismeréséhez szükséges tudása is hiányzik.
- **Statisztikai magyarázat**: ha az önbecslés és a teszteredmény is **zajos** mérés, a szélső csoportok értékei a „visszatérés az átlaghoz” miatt akkor is így néznének ki, ha senkinek sem lenne különös torzítása. Későbbi elemzések szerint a hatás egy része ebből adódik.
- **Gyakorlati tanulság**, ami mindkét nézőpontból igaz: egy új területen **ne bízz a magabiztosság érzésében**, és mérd a tudásodat külső visszajelzéssel (gyakorló feladat, kódellenőrzés, mentor).

Ez a rész azt is megmutatja, hogyan érdemes egy népszerű „pszichológiai tényt” kezelni: megnézni az eredeti vizsgálatot, keresni az alternatív magyarázatokat, és a gyakorlati következtetést arra építeni, ami minden magyarázatból következik.

## 4. Egy elrontott demó feldolgozása Gibbs ciklusával

A csapatod bemutatóján leállt az alkalmazás, és a megrendelő láthatóan csalódott volt. Gibbs reflektív ciklusa hat lépésben segít tanulni belőle – a hibáztatás és az önostorozás helyett:

| Lépés                  | Kérdés                                    | Példa                                                                                                                        |
| ---------------------- | ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **1. Leírás**          | Mi történt? (tények)                      | A demó 5. percében a foglalási oldal 500-as hibát adott; 4 percig próbáltuk újraindítani, aztán képernyőképekkel folytattuk. |
| **2. Érzések**         | Mit éreztem, gondoltam?                   | Pánik, szégyen; „biztos azt hiszik, hogy nem értünk hozzá”.                                                                  |
| **3. Értékelés**       | Mi ment jól, mi rosszul?                  | Jó: a képernyőképekkel be tudtuk fejezni. Rossz: nem volt tartalékterv, és élő adatbázison demóztunk.                        |
| **4. Elemzés**         | Miért alakult így?                        | Az utolsó este még beolvasztottunk egy változtatást teszt nélkül; a demókörnyezet nem volt elkülönítve.                      |
| **5. Következtetés**   | Mit tanultam? Mit tehettem volna másképp? | Demó előtt 24 órával „kódstop”; külön demókörnyezet; előre felvett videó tartaléknak.                                        |
| **6. Cselekvési terv** | Mit csinálok legközelebb?                 | A következő demó előtt ellenőrzőlistát használunk, és Bálint felel a tartalékvideóért.                                       |

Figyeld meg a **2. lépést**: az érzések kimondása nem „puhaság”, hanem a feldolgozás része – ha kimarad, a szégyen a következő demón is ott lesz. És a **6. lépés** nélkül a reflexió csak emlékezés: a változás a konkrét, felelőshöz és időponthoz kötött teendőkkel kezdődik.

## Összefoglalás

- A 360 fokos visszajelzésben az önértékelés és mások átlagának eltérése mutatja a vak foltokat és a rejtett erősségeket; kis mintánál tendenciát keress.
- A kalibráció (előzetes becslés vs. valós eredmény) megmutatja, melyik területen becsülöd túl vagy alá magad.
- A Dunning–Kruger-hatás részben statisztikai jelenség is lehet; a közös tanulság: új területen ne a magabiztosság érzésére, hanem külső visszajelzésre hagyatkozz.
- Gibbs ciklusa (leírás, érzések, értékelés, elemzés, következtetés, cselekvési terv) a kudarcból konkrét teendőket csinál.

## A lecke feladata

```quiz required
? Egy kompetenciában 4-esre értékeled magad, a csapattársaid 2, 3 és 2,5 pontot adnak. Mekkora az eltérés (saját − mások átlaga)? (tizedes törtként)
= 1,5
= 1.5
! A mások átlaga $(2 + 3 + 2{,}5) / 3 = 2{,}5$, az eltérés $4 - 2{,}5 = 1{,}5$.

? Három feladatsor előtt 80, 70 és 60 százalékra számítottál, az eredmények 70, 60 és 50 százalék lettek. Mekkora az átlagos torzítás százalékpontban?
= 10
! Minden esetben 10 pontot becsültél túl, az átlag 10.

? A Johari-ablak melyik területe az, amit mások látnak rólad, de te nem?
- nyílt terület
+ vak folt
- rejtett terület
- ismeretlen terület
! A 360 fokos visszajelzés pont ezt hozza felszínre.

? Gibbs ciklusában melyik lépés következik az elemzés után?
- leírás
- érzések
+ következtetés
- értékelés
! Leírás → érzések → értékelés → elemzés → következtetés → cselekvési terv.

? Mi a Dunning–Kruger-hatással kapcsolatos legjobb gyakorlati tanulság?
- hogy a kezdők mindig ostobák
- hogy a szakértők sosem tévednek
+ hogy egy új területen ne a magabiztosság érzésére, hanem külső visszajelzésre (gyakorló feladat, kódellenőrzés, mentor) hagyatkozz
- hogy önértékelésre soha nincs szükség
! Ez a pszichológiai és a statisztikai magyarázatból is következik.
```
