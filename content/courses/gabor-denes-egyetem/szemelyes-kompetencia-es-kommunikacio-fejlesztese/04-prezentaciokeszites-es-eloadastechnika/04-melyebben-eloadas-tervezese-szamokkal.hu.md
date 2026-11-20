---
title: Mélyebben – az előadás tervezése számokkal
summary: Időterv és szókeret szakaszonként, a diák „zsúfoltságának” ellenőrzése programmal, a figyelem alakulása egy előadás alatt (elsőbbségi és frissességi hatás, interaktív szünet) és ugyanannak a projektnek a bemutatása három különböző közönségnek – kis programokkal és interaktív ábrával.
minutes: 35
---

## Amit ebben a leckében megtanulsz

- hogyan készíts **időtervet** és szókeretet egy előadás szakaszaihoz,
- hogyan ellenőrizd programmal, hogy egy dia **túl zsúfolt-e**,
- hogyan alakul a **figyelem** egy előadás alatt, és hová tedd a legfontosabb üzenetet,
- hogyan **igazítsd** ugyanazt a tartalmat különböző közönségekhez.

## 1. Időterv és szókeret

Az alapleckékben láttuk a háromrészes felépítést (bevezetés, tárgyalás, zárás). Tegyük számszerűvé! Egy **15 perces** projektbemutatóhoz 2 perc tartalékot hagyunk a kérdésekre és a csúszásra, a maradékot elosztjuk:

```python run
# Időterv és szókeret: hány perc és hány szó jut az egyes szakaszokra?
teljes_perc = 15
tartalek = 2                          # kérdésekre, csúszásra
tempo = 130                           # szó/perc, nyugodt tempó
szakaszok = [  # (név, arány a nettó időből, diák száma)
    ("nyitás: a probléma", 0.15, 1),
    ("a megoldásunk", 0.25, 2),
    ("élő demó", 0.30, 1),
    ("eredmények és tanulságok", 0.20, 2),
    ("zárás: felhívás", 0.10, 1),
]
netto = teljes_perc - tartalek
print(f"nettó idő: {netto} perc, szókeret összesen: {netto * tempo} szó\n")
for nev, arany, diak in szakaszok:
    perc = netto * arany
    print(f"{nev:<26} {perc:4.1f} perc  ~{perc * tempo:4.0f} szó  {diak} dia ({perc / diak:.1f} perc/dia)")
print(f"\ndiák összesen: {sum(d for _, _, d in szakaszok)}")
```

Néhány tanulság a számokból:

- 13 perc alatt kb. **1700 szót** mondhatsz el – ez körülbelül 3–4 sűrűn gépelt oldal. Ha a jegyzeted ennél hosszabb, húzni kell, nem gyorsabban beszélni.
- A **demó** kapja a legtöbb időt, mert egy szoftverprojektnél ez győz meg a legjobban – de pont ezért kell a legjobban felkészülni rá (tartalék videó, előre betöltött adatok).
- Egy diára átlagosan **1–2 perc** jut. Ennél sokkal gyorsabb diaváltásnál a közönség nem tudja követni, sokkal lassabbnál unalmassá válik.

## 2. Túl zsúfolt a dia?

A dia a beszéded **segítője**: ha sok rajta a szöveg, a hallgató olvasni kezd, és közben nem figyel rád (az agy nehezen olvas és hallgat egyszerre). Egy egyszerű ellenőrző program jelzi a gyanús diákat:

```python run
# Diák zsúfoltságának ellenőrzése: szavak és pontok száma diánként
diak = {
    "1. A probléma": ["Dupla foglalások", "Papíron vezetett változások"],
    "2. Architektúra": ["Frontend: React", "Backend: Python (FastAPI)", "Adatbázis: PostgreSQL",
                        "Hitelesítés: e-mail + jelszó, jelszó-visszaállítás e-mailben",
                        "Értesítések: e-mail és push, időzített feladatokkal",
                        "Naplózás és hibakövetés", "CI/CD: GitHub Actions, automatikus tesztekkel",
                        "Telepítés: Docker konténerekben, felhős szerveren"],
    "3. Eredmények": ["0 dupla foglalás a 3 hetes próbaidőszakban", "−40% telefonhívás"],
}
for cim, pontok in diak.items():
    szavak = sum(len(p.split()) for p in pontok)
    gond = []
    if len(pontok) > 6:
        gond.append(f"{len(pontok)} pont (max. ~6)")
    if szavak > 30:
        gond.append(f"{szavak} szó (max. ~30)")
    print(f"{cim:<18} {'⚠ ' + ', '.join(gond) if gond else '✓ rendben'}")
```

Az architektúra-dia a klasszikus hiba: minden ott van, amit tudunk, ezért a közönség semmit sem jegyez meg. Jobb megoldás egy **egyszerű ábra** (három doboz: React → FastAPI → PostgreSQL), a részleteket pedig mondd el szóban, vagy tedd egy **függelék** diára a kérdésekhez.

> A „max. 6 pont, max. 30 szó” nem természettörvény, hanem ökölszabály. Egy oktatási anyagban, amit később olvasni fognak, több szöveg is elfér; egy élő előadáson viszont szinte mindig kevesebb a jobb.

## 3. Hogyan alakul a figyelem?

A memóriakutatásból ismert az **elsőbbségi** (primacy) és a **frissességi** (recency) hatás: amit az elején és a végén hallunk, azt jegyezzük meg legjobban, a közepe elmosódik. Egy előadásnál ehhez jön a fáradás is. Az alábbi ábra egy **szemléltető modell** (nem mért adat) egy 20 perces előadásra; a csúszkával egy interaktív elem (kérdés a közönséghez, demó, rövid szavazás) helyét állíthatod:

```plot
title: A közönség figyelme egy 20 perces előadás alatt (szemléltető modell)
x: 0, 20
y: 0, 1.2
param: b = 10, 2, 18, 0.5
f: 0.45 + 0.55*((x - 10)/10)^2 # interaktív elem nélkül
f: 0.45 + 0.55*((x - 10)/10)^2 + 0.35*exp(-((x - b)/1.5)^2) # interaktív elemmel a b. percben
```

Mit tanulunk ebből?

- A **legfontosabb üzenet** az elejére (nyitás) és a végére (zárás) kerüljön – a zárásban érdemes meg is ismételni.
- A középső „völgyet” egy **interaktív elem** emeli meg: ha a csúszkát 9–11 percre állítod, ott a legnagyobb a nyereség. Ezért jó a demó az előadás közepén.
- A figyelem kb. 10 percenként „újraindítást” igényel: hosszabb előadásnál tervezz több ilyen pontot.

## 4. Egy projekt, három közönség

Ugyanazt az órarendtervező alkalmazást háromféle közönségnek mutatod be. A tartalom ugyanaz, a **hangsúly** és a **nyelv** más:

| Közönség                          | Mit akar tudni?                                     | Mit emelj ki?                                                | Mit hagyj el?                           |
| --------------------------------- | --------------------------------------------------- | ------------------------------------------------------------ | --------------------------------------- |
| **szakmai zsűri** (fejlesztők)    | Hogyan működik? Jók-e a műszaki döntések?           | architektúra, az ütközésvizsgálat algoritmusa, tesztelés     | marketingszöveg, általánosságok         |
| **befektető / üzleti döntéshozó** | Megéri-e? Kinek oldja meg a problémáját, mennyiért? | a probléma mérete, a felhasználók száma, költség, megtérülés | technológiai részletek (React, FastAPI) |
| **hallgatótársak** (felhasználók) | Mit nyerek vele? Könnyű-e használni?                | élő demó, időmegtakarítás, „így rakod össze 2 perc alatt”    | architektúra, üzleti modell             |

A leggyakoribb hiba, hogy a fejlesztő **mindenkinek a szakmai zsűri-változatot** adja elő, mert az a saját nézőpontja. Az előadás előtt tedd fel a kérdést: „Mi az az **egy mondat**, amit ez a közönség hazavisz?” – és ehhez válogass a tartalomból.

## Összefoglalás

- Számold ki a szókeretet: nettó idő × tempó (pl. 13 perc × 130 szó/perc ≈ 1700 szó); hagyj tartalékot.
- Egy diára átlagosan 1–2 perc jut; a zsúfolt diát (sok pont, sok szó) bontsd ábrára és szóbeli magyarázatra.
- A figyelem az elején és a végén a legnagyobb; a fő üzenet ide kerüljön, a középső részt interaktív elemmel élénkítsd.
- Ugyanazt a projektet közönségenként más hangsúllyal mutasd be: mi az az egy mondat, amit hazavisznek?

## A lecke feladata

```quiz required
? Egy 15 perces előadást 130 szó/perc tempóban tartasz, tartalék nélkül. Hány szó fér bele?
= 1950
! $15 \cdot 130 = 1950$ szó.

? Egy 20 perces előadáshoz diánként átlagosan 1,5 percet tervezel. Hány dia legyen (egészre lefelé kerekítve)?
= 13
! $20 / 1{,}5 \approx 13{,}3$, tehát 13 dia.

? Egy dián 8 pont és összesen 60 szó van. Mi a legjobb javítás?
- kisebb betűméret, hogy minden elférjen
+ egy egyszerű ábra a lényegről, a részletek szóban vagy függelék dián
- gyorsabban beszélni, hogy legyen idő elolvasni
- felolvasni a dia teljes szövegét
! A hallgató vagy olvas, vagy rád figyel – a zsúfolt diát bontsd.

? Hová érdemes tenni az előadás legfontosabb üzenetét?
- csak a közepére, mert addigra mindenki figyel
+ az elejére és a végére (a zárásban megismételve)
- egy függelék diára
- sehová, mert úgyis kiderül
! Elsőbbségi és frissességi hatás: az elejét és a végét jegyezzük meg legjobban.

? Egy befektetőknek szóló bemutatón mit érdemes kiemelni?
- a frontend keretrendszer verzióját
+ a probléma méretét, a felhasználókat, a költséget és a várható megtérülést
- az adatbázis-táblák szerkezetét
- a kódolási konvenciókat
! A befektető azt akarja tudni, megéri-e.
```
