---
title: Mélyebben – robotok szimulációval
summary: Zajos érzékelők szűrése (átlag és medián), merre jár egy kétkerekű robot a kerékfordulatokból, miért marad hiba a P-szabályozónál és hogyan tünteti el az I-tag, valamint egy vonalkövető robot állapotgépe – kis programokkal és interaktív ábrával.
minutes: 45
---

## Amit ebben a leckében megtanulsz

- hogyan **szűrd** egy zajos érzékelő jelét, és melyik szűrő mire jó,
- hogyan számolja ki egy robot a **helyzetét** a kerekei elfordulásából, és miért csúszik el idővel,
- miért marad **maradó hiba** egy arányos szabályozónál, és mit tesz hozzá az **integráló tag**,
- hogyan írd le egy robot viselkedését **állapotgéppel**.

## 1. Zajos érzékelők: átlag vagy medián?

Egy ultrahangos távolságérzékelő soha nem ad tökéletes értéket: a mérések **zajosak**, és néha egy-egy teljesen hibás érték („tüske”) is becsúszik, pl. ha a hang egy ferde felületről rossz irányba verődik vissza. Két egyszerű szűrő:

- **mozgóátlag**: az utolsó $k$ mérés átlaga – simít, de a tüskét is „elkeni”,
- **mozgó medián**: az utolsó $k$ mérés középső értéke – a ritka tüskéket teljesen kiszűri.

```python run
# Zajos távolságmérés szűrése mozgóátlaggal és mozgó mediánnal
import random
from statistics import mean, median

random.seed(4)
valodi = 50.0                                         # a fal valójában 50 cm-re van
meresek = [valodi + random.gauss(0, 2) for _ in range(12)]
meresek[5] = 300.0                                    # egy hibás visszaverődés: tüske

def mozgo(adatok, k, fv):
    return [fv(adatok[max(0, i - k + 1):i + 1]) for i in range(len(adatok))]

atlag = mozgo(meresek, 3, mean)
med = mozgo(meresek, 3, median)
print(" mérés   átlag  medián")
for m, a, d in zip(meresek, atlag, med):
    print(f"{m:6.1f} {a:7.1f} {d:7.1f}")
```

A tüske a mozgóátlagot három lépésen át **kb. 134 cm**-re húzza – egy robot ilyenkor azt hinné, hogy szabad az út. A medián észre sem veszi. A **nézőpontok** itt a feladattól függnek: az átlag a kis, egyenletes zajra jó (és gyorsan számolható egy kis mikrovezérlőn), a medián a ritka, nagy hibákra. Mindkettő ára a **késés**: a szűrt érték csak néhány mérés után követi a valódi változást.

## 2. Hol vagyok? Helymeghatározás a kerekekből

Egy kétkerekű robot (mint egy robotporszívó) a kerekei elfordulását méri (**odometria**). Ha a két kerék ugyanannyit fordul, egyenesen megy; ha a jobb többet, balra kanyarodik; ha ellentétesen fordulnak, helyben forog. A kerekek útjából kiszámolható az új helyzet és irány:

```python run
# Odometria: kétkerekű robot helyzete a kerekek által megtett útból
from math import cos, sin, pi, degrees

TENGELY = 0.20                                  # a két kerék távolsága (m)

def lepes(x, y, irany, bal, jobb):
    ut = (bal + jobb) / 2                       # a robot közepének útja
    fordulas = (jobb - bal) / TENGELY            # irányváltozás radiánban
    irany += fordulas / 2
    x, y = x + ut * cos(irany), y + ut * sin(irany)
    return x, y, irany + fordulas / 2

x = y = irany = 0.0
FORDUL = TENGELY * pi / 4                     # helyben 90°: a kerekek ellentétesen fordulnak
for bal, jobb in [(1.0, 1.0), (-FORDUL, FORDUL), (1.0, 1.0)]:   # előre 1 m, balra 90°, előre 1 m
    x, y, irany = lepes(x, y, irany, bal, jobb)
    print(f"bal {bal:6.3f} m, jobb {jobb:6.3f} m → x = {x:5.2f}, y = {y:5.2f}, irány {degrees(irany):5.1f}°")

# a valóságban a kerék kicsit csúszik: forduláskor a jobb kerék 2%-kal többet tesz meg, mint amit a robot hisz
x = y = irany = 0.0
for _ in range(4):                             # négyzet: 4 × (előre 1 m, balra 90°)
    x, y, irany = lepes(x, y, irany, 1.0, 1.0)
    x, y, irany = lepes(x, y, irany, -FORDUL, FORDUL * 1.02)
print(f"egy négyzet után a robot valójában ({x:.2f}, {y:.2f})-ban van, pedig azt hiszi, visszaért a (0, 0)-ba")
```

A kis, 2%-os kerékcsúszás is felhalmozódik: egy négyzet után a robot már néhány centivel máshol van, mint hiszi, és minél tovább megy, annál nagyobb a tévedés. Ezért a valódi robotok az odometriát **más érzékelőkkel** kombinálják (giroszkóp, kamera, lézeres távolságmérő, GPS) – ezt hívják **szenzorfúziónak**.

## 3. A szabályozó: miért marad hiba, és mit tesz az I-tag?

Az alapleckében láttuk az arányos (P) szabályozót: a beavatkozás arányos a hibával. Egy robotkar vagy egy fűtés esetén azonban gyakran van egy **állandó zavaró hatás** (a gravitáció húzza a kart, a hő elszökik az ablakon). Ilyenkor a P-szabályozó soha nem ér el pontosan a célig: kell egy kis maradó hiba ahhoz, hogy legyen beavatkozás, ami a zavarást kiegyenlíti. Az **integráló (I) tag** a múltbeli hibákat **összegzi**, és addig növeli a beavatkozást, amíg a hiba el nem tűnik:

```python run
# P és PI szabályozó: hőmérséklet-szabályozás állandó hőveszteséggel
def szimulacio(kp, ki, lepesek=100):
    T, cel, integral = 15.0, 22.0, 0.0
    for _ in range(lepesek):
        hiba = cel - T
        integral += hiba
        futes = max(0.0, kp * hiba + ki * integral)   # a fűtés nem lehet negatív
        T += 0.1 * futes - 0.05 * (T - 10)           # fűtés − hőveszteség a 10 °C-os külvilág felé
    return T

for kp, ki in [(1.0, 0.0), (3.0, 0.0), (1.0, 0.1)]:
    T = szimulacio(kp, ki)
    print(f"Kp = {kp}, Ki = {ki}: 100 lépés után {T:.2f} °C (cél 22 °C, maradó hiba {22 - T:.2f})")
```

A P-szabályozó erősítésének növelése csökkenti a maradó hibát, de el nem tünteti (és túl nagy erősítésnél a rendszer lengeni kezd). A PI-szabályozó viszont pontosan eléri a célt. A **D (differenciáló) tag** a hiba változási sebességére reagál, és a túllendülést fékezi – így áll össze a PID.

A hiba csökkenése egy egyszerű, P-szabályozott rendszerben közelítőleg exponenciális; a csúszkával a szabályozó erősségét állíthatod:

```plot
title: A hiba (%) csökkenése az idő (s) függvényében P-szabályozónál
x: 0, 10
y: 0, 100
param: k = 0.5, 0.1, 3, 0.1
f: 100*exp(-k*x) # hiba erősebb szabályozással gyorsabban csökken
dash: 5 # 5%-os sáv
```

## 4. Állapotgép: egy vonalkövető robot „agya”

Egy robot viselkedését gyakran **állapotokkal** írjuk le: mindig egy állapotban van, és az érzékelők jelei alapján vált át egy másikba. Egy vonalkövető robotnak két fényérzékelője van (bal, jobb), amelyek megmondják, látják-e a fekete vonalat:

```python run
# Állapotgép: vonalkövető robot két fényérzékelővel
def kovetkezo(allapot, bal_latja, jobb_latja, akadaly):
    if akadaly:
        return "MEGÁLL"                       # a biztonság mindent felülír
    if bal_latja and jobb_latja:
        return "EGYENES"
    if bal_latja:
        return "BALRA"                        # a vonal balra tolódott
    if jobb_latja:
        return "JOBBRA"
    return "KERES" if allapot != "MEGÁLL" else "MEGÁLL"   # elvesztette a vonalat

allapot = "EGYENES"
erzekelok = [(1, 1, 0), (1, 0, 0), (1, 1, 0), (0, 1, 0), (0, 0, 0), (1, 1, 0), (1, 1, 1)]
for bal, jobb, akadaly in erzekelok:
    allapot = kovetkezo(allapot, bal, jobb, akadaly)
    print(f"bal {bal}, jobb {jobb}, akadály {akadaly} → {allapot}")
```

Az állapotgép előnye, hogy **minden helyzetre** végig kell gondolni, mit tegyen a robot – így nem marad ki például az az eset, amikor elveszti a vonalat. Az akadály-ellenőrzés kerül az első helyre: ez a **biztonsági nézőpont**, amely egy ipari robotnál vagy egy önvezető autónál minden más szempontot megelőz.

| Nézőpont               | Mire figyel egy robotnál?                                  |
| ---------------------- | ---------------------------------------------------------- |
| **mechanika**          | motorok, kerekek, csúszás, súly, energiafogyasztás         |
| **elektronika**        | érzékelők zaja, mikrovezérlő sebessége, tápellátás         |
| **szoftver**           | szűrés, szabályozás, állapotgép, a ritka esetek kezelése   |
| **biztonság és etika** | vészleállítás, emberek közelsége, ki felel egy baleseteért |

## Összefoglalás

- A mozgóátlag a kis, egyenletes zajt simítja, a mozgó medián a ritka tüskéket szűri ki; mindkettő késleltet.
- Az odometria a kerekek útjából számolja a helyzetet, de a hibák felhalmozódnak – ezért kell szenzorfúzió.
- A P-szabályozónál állandó zavarás mellett maradó hiba marad; az I-tag a hibák összegzésével eltünteti, a D-tag a túllendülést fékezi.
- Az állapotgép minden helyzetre előírja a robot viselkedését; a biztonsági feltétel kerül előre.

## A lecke feladata

```quiz required
? Mennyi a 48, 51, 300 mérések mediánja?
= 51
! Rendezve: 48, 51, 300 – a középső 51.

? Mennyi a 48, 51, 300 mérések átlaga?
= 133
! $(48 + 51 + 300) / 3 = 133$.

? Egy robot két kereke 1-1 métert fordul. Mekkora utat tett meg a robot közepe (m)?
= 1
! $(1 + 1) / 2 = 1$ m, egyenesen.

? Miért marad hiba egy P-szabályozónál, ha állandó zavaró hatás (pl. hőveszteség) van?
- mert a szabályozó elromlott
+ mert beavatkozás csak hiba esetén van, így kell egy kis maradó hiba a zavarás kiegyenlítéséhez
- mert a P-szabályozó mindig túllendül
- nem marad hiba
! Az integráló tag a hibák összegzésével tünteti el a maradó hibát.

? Egy vonalkövető robot állapotgépében melyik feltételt érdemes elsőként vizsgálni?
- látja-e a bal érzékelő a vonalat
- látja-e a jobb érzékelő a vonalat
+ van-e akadály (megállás)
- mennyi az akkumulátor töltöttsége
! A biztonság minden más szempontot megelőz.
```
