---
title: Mélyebben – zárás és értékelés számokkal
summary: Átadás-átvételi döntés az elfogadási teszt eredményeiből (go / no-go szabály programmal), a sikerkritériumok terv–tény összevetése, a hasznok utólagos értékelése megtérüléssel és interaktív ábrával, valamint egy retrospektív szavazás kiértékelése.
minutes: 35
---

## Amit ebben a leckében megtanulsz

- hogyan hozz **átlátható** átadás-átvételi döntést az elfogadási teszt eredményeiből,
- hogyan értékeld számokkal a projekt **sikerkritériumait** (terv vs. tény),
- hogyan mérd a projekt **hasznát** a lezárás után (megtérülés, ROI),
- hogyan összegezd gyorsan egy **retrospektív** eredményét.

## 1. Átadás-átvétel: go vagy no-go?

Az elfogadási teszt után a megrendelővel előre rögzített **szabály** szerint döntünk. Például: legalább 95%-os sikerességi arány, nincs nyitott kritikus hiba, és legfeljebb 3 nyitott súlyos hiba.

```python run
# Átadás-átvételi döntés: elfogadási tesztek eredménye és nyitott hibák alapján
tesztek = {"sikeres": 188, "sikertelen": 7, "nem futott": 5}
nyitott_hibak = {"kritikus": 0, "súlyos": 2, "közepes": 6, "kozmetikai": 11}

def dontes(tesztek, hibak, min_arany=0.95, max_sulyos=3):
    arany = tesztek["sikeres"] / sum(tesztek.values())   # a nem futott teszt sem számít sikeresnek
    okok = []
    if arany < min_arany:
        okok.append(f"sikerességi arány {arany:.1%} < {min_arany:.0%}")
    if hibak["kritikus"] > 0:
        okok.append(f"{hibak['kritikus']} nyitott kritikus hiba")
    if hibak["súlyos"] > max_sulyos:
        okok.append(f"{hibak['súlyos']} nyitott súlyos hiba > {max_sulyos}")
    return ("GO" if not okok else "NO-GO"), arany, okok

eredmeny, arany, okok = dontes(tesztek, nyitott_hibak)
print(f"sikerességi arány: {arany:.1%} → {eredmeny}", *okok, sep="\n  ")

# Ha az 5 le nem futott tesztet is lefuttatják és mind sikeres:
tesztek.update({"sikeres": 193, "nem futott": 0})
print("\núj futás után:", dontes(tesztek, nyitott_hibak)[0])
```

Az első futás **NO-GO**: 94% a sikerességi arány, mert a le nem futott teszteket nem számolhatjuk sikeresnek. Ha lefuttatják őket, a döntés GO – a két súlyos és a többi kisebb hiba a garanciális időszakban javítható. A lényeg: a szabályt **előre**, a teszt előtt kell rögzíteni, különben az átadáskor parttalan vita lesz arról, mi „elég jó”.

## 2. Sikerkritériumok: terv és tény

A zárójelentés egyik központi táblázata a projekt háromszög (és a minőség) terv–tény összevetése:

```python run
# Sikerkritériumok kiértékelése: terv vs. tény, százalékos eltérés és súlyozott sikerpontszám
kriteriumok = [  # (név, terv, tény, súly, "kevesebb a jobb"?)
    ("határidő (hét)", 20, 23, 0.25, True),
    ("költség (millió Ft)", 50, 54, 0.25, True),
    ("megvalósított követelmény (db)", 40, 38, 0.30, False),
    ("felhasználói elégedettség (1–5)", 4.0, 4.3, 0.20, False),
]
osszpont = 0
for nev, terv, teny, suly, kevesebb in kriteriumok:
    elteres = (teny - terv) / terv
    teljesites = min(1.2, terv / teny if kevesebb else teny / terv)   # 1 = pont a terv, max 120%
    osszpont += suly * teljesites
    print(f"{nev:<33} terv {terv:>5}  tény {teny:>5}  eltérés {elteres:+6.1%}  teljesítés {teljesites:5.0%}")
print(f"\nsúlyozott sikerpontszám: {osszpont:.0%}")
```

A projekt 15%-ot csúszott és 8%-kal drágább lett, de a követelmények 95%-át megvalósította, és a felhasználók elégedettebbek a vártnál. A súlyozott pontszám (kb. 95%) összefoglalja ezt – de a zárójelentésben a **részletek** a fontosak: miért csúszott a projekt? Ezekből lesznek a tanulságok.

## 3. A hasznok utólagos értékelése

A projekt célja nem a szoftver, hanem a **haszon**, amit hoz – és ez gyakran csak hónapokkal a lezárás után mérhető. Egy belső ügyintézési rendszer 60 millió forintba került; a lezárás után havonta mérjük a megtakarítást (kevesebb papírmunka, gyorsabb ügyintézés), amely a bevezetés során fokozatosan nő:

```python run
# Hasznok utólagos értékelése: halmozott megtakarítás vs. beruházás, megtérülési hónap és 3 éves ROI
beruhazas = 60.0                                   # millió Ft
megtakaritas = [0.5, 1.0, 1.5, 2.0, 2.5] + [3.0] * 31   # millió Ft/hó: fokozatos felfutás, majd stabil
halmozott, megterult = 0.0, None
for honap, m in enumerate(megtakaritas, 1):
    halmozott += m
    if megterult is None and halmozott >= beruhazas:
        megterult = honap
print(f"megtérülés: a(z) {megterult}. hónapban")
roi = (halmozott - beruhazas) / beruhazas
print(f"3 év alatt: halmozott megtakarítás {halmozott:.1f} M Ft, ROI {roi:.0%}")
```

A rendszer a 23. hónapban térül meg, és 3 év alatt kb. 68%-os hozamot hoz. Ha a megtakarítás csak 2 millió lenne havonta, a megtérülés két és fél évnél is tovább tartana – ezért kell a **haszonértékelést** (_benefits realisation_) a projekt után is folytatni, és összevetni az üzleti esetben ígért számokkal.

```plot
title: Halmozott nettó eredmény (millió Ft) a hónapok függvényében, 60 millió Ft beruházás
x: 0, 36
y: -60, 60
param: b = 3, 1, 5, 0.1
f: -60 + b*x # halmozott megtakarítás − beruházás
dash: 0 # megtérülés
```

Az egyszerűsített (felfutás nélküli) modellben a megtérülési pont $60 / b$ hónap. Állítsd a havi megtakarítást ($b$) 2-re és 4-re, és figyeld, hogyan mozdul a megtérülési pont!

## 4. Retrospektív: a szavazatok kiértékelése

A retrospektíven a csapat cetliket ír („mi ment jól”, „mi nem”), majd mindenki 3 pöttyel szavaz a legfontosabbakra. A kiértékelés egyszerű számlálás:

```python run
# Retrospektív pöttyös szavazás: melyik témákkal foglalkozzunk a következő projektben?
from collections import Counter

szavazatok = ["késői követelményváltozás", "jó csapathangulat", "lassú tesztkörnyezet",
              "késői követelményváltozás", "lassú tesztkörnyezet", "késői követelményváltozás",
              "túl sok megbeszélés", "jó csapathangulat", "lassú tesztkörnyezet",
              "késői követelményváltozás", "túl sok megbeszélés", "jó kódellenőrzés"]
for tema, db in Counter(szavazatok).most_common(3):
    print(f"{db} pötty – {tema}")
```

A két legtöbb szavazatot kapott probléma (késői követelményváltozás, lassú tesztkörnyezet) lesz a tanulság, amelyhez **konkrét intézkedés** és felelős tartozik (pl. „a változáskérés-folyamatot a következő projekt elején rögzítjük”). A tanulságok csak akkor érnek valamit, ha bekerülnek a szervezet tudásbázisába, és a következő projekt indításakor valaki elő is veszi őket.

## Összefoglalás

- Az átadás-átvételi döntés előre rögzített, mérhető szabály szerint történjen (sikerességi arány, nyitott hibák súlyosság szerint).
- A sikerkritériumokat terv–tény összevetéssel értékeljük; „kevesebb a jobb” mutatónál a terv/tény arány a teljesítés.
- A hasznok gyakran csak a lezárás után realizálódnak: megtérülési hónap, ROI; ezeket az üzleti esettel kell összevetni.
- A retrospektív szavazás egyszerű számlálás; a tanulságokhoz intézkedés és felelős kell.

## A lecke feladata

```quiz required
? 200 elfogadási tesztből 186 sikeres, 10 sikertelen, 4 nem futott. Mennyi a sikerességi arány (%)?
= 93
! $186 / 200 = 0{,}93$ – a le nem futott teszt nem számít sikeresnek.

? A tervezett költség 40 millió Ft, a tényleges 46 millió Ft. Hány százalék a túllépés?
= 15
! $(46 - 40) / 40 = 0{,}15$.

? Egy 30 millió forintos rendszer havi 2,5 millió Ft megtakarítást hoz (felfutás nélkül). Hányadik hónapban térül meg?
= 12
! $30 / 2{,}5 = 12$.

? Egy projekt 50 millióba került, és 3 év alatt 80 millió Ft hasznot hozott. Mennyi a ROI (%)?
= 60
! $(80 - 50) / 50 = 0{,}6$.

? Miért kell az átadás-átvétel feltételeit a teszt előtt rögzíteni?
- mert a teszt után már nem lehet hibát javítani
+ mert így elkerülhető az utólagos vita arról, mi számít „elég jónak”
- mert a megrendelő csak a teszt előtt dönthet
- mert a szabály a teszt eredményétől függ
! A mérhető, előre rögzített elfogadási szabály objektív döntést tesz lehetővé.
```
