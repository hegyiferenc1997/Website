---
title: Mélyebben – a gazdaság számokban
summary: A körforgás egyenlege egy kis gazdaság számain, százalék és százalékpont, bázis- és láncindex, nominális és reálbér a 2022–2023-as infláció idején, és miért mutathat két független idősor is erős korrelációt.
minutes: 35
---

## Amit ebben a leckében megtanulsz

- hogyan **egyezik ki** a körforgás: a kiadások, a jövedelmek, a ki- és beáramlások,
- hogy ne keverd a **százalékot** és a **százalékpontot**, és hogyan olvass **indexet**,
- hogyan számolj **reálbért**, és miért csökkenhet a vásárlóerő emelkedő fizetés mellett,
- miért **nem bizonyíték** egy erős korreláció.

## 1. A körforgás kiegyenlít

Egy kis nyitott gazdaság egy évének adatai (milliárd Ft). A GDP-t a kiadási oldalról számoljuk, és megnézzük, hová kerül a jövedelem:

```python run
# Körforgás számokban: egy kis nyitott gazdaság egy éve (milliárd Ft)
C, I, G, X, M = 600, 200, 250, 450, 400        # fogyasztás, beruházás, állami vásárlás, export, import
T, S = 230, 270                                # nettó adó, háztartási megtakarítás

Y = C + I + G + (X - M)                        # a kiadási oldal: a GDP
print(f"GDP = C + I + G + (X − M) = {C} + {I} + {G} + ({X} − {M}) = {Y}")
print(f"a jövedelem felhasználása: C + S + T = {C + S + T}")

kiaramlas = S + T + M                          # ami kifolyik a körforgásból
beaaramlas = I + G + X                         # ami befolyik
print(f"kiáramlások (S + T + M) = {kiaramlas}, beáramlások (I + G + X) = {beaaramlas}")
print(f"állami egyenleg T − G = {T - G}, külkereskedelmi egyenleg X − M = {X - M}")
```

Két dolog mindig teljesül: a megtermelt érték (1100) egyenlő a megszerzett jövedelemmel, amelyet a háztartások elfogyasztanak, megtakarítanak vagy adóként befizetnek. És ami **kifolyik** a körforgásból (megtakarítás, adó, import), annyi **folyik be** (beruházás, állami vásárlás, export). Ebből egy fontos összefüggés jön: $(S - I) = (G - T) + (X - M)$ – ha az állam hiányt termel ($T - G < 0$), azt a magánszféra többletmegtakarítása vagy a külföld finanszírozza.

**Hasonlat:** a körforgás olyan, mint egy kád: a víz szintje akkor állandó, ha ugyanannyi folyik be a csapból, mint amennyi el a lefolyón.

## 2. Százalék, százalékpont, index

A hírekben gyakori hiba ezek összekeverése:

```python run
# Százalék vagy százalékpont? És az index
kamat_regi, kamat_uj = 4.0, 6.5
print(f"a kamat {kamat_regi}% → {kamat_uj}%: {kamat_uj - kamat_regi:.1f} százalékpontos emelés,")
print(f"   de {100 * (kamat_uj - kamat_regi) / kamat_regi:.1f} százalékos növekedés")

# bázisindex és láncindex: egy laptop ára öt éven át (ezer Ft)
arak = {2022: 400, 2023: 440, 2024: 462, 2025: 450, 2026: 486}
evek = list(arak)
for i, ev in enumerate(evek):
    bazis = 100 * arak[ev] / arak[evek[0]]                         # mindig 2022-höz képest
    lanc = 100 * arak[ev] / arak[evek[i - 1]] if i else 100.0      # az előző évhez képest
    print(f"{ev}: {arak[ev]} e Ft | bázisindex {bazis:6.1f} | láncindex {lanc:6.1f}")

szorzat = 1.0
for i in range(1, len(evek)):
    szorzat *= arak[evek[i]] / arak[evek[i - 1]]
print(f"a láncindexek szorzata = {100 * szorzat:.1f} = az utolsó bázisindex")
```

- A kamat 4%-ról 6,5%-ra emelése **2,5 százalékpont**, de **62,5 százalékos** növekedés – a kettő nagyon mást jelent.
- A **bázisindex** egy rögzített évhez (itt 2022) hasonlít, a **láncindex** mindig az előző évhez. A láncindexek szorzata kiadja a bázisindexet.
- Figyeld meg 2025-öt: a láncindex 97,4 (olcsóbb lett, mint előző évben), a bázisindex mégis 112,5 (drágább, mint 2022-ben). Mindkettő igaz – csak más kérdésre válaszol.

## 3. Nominális és reálbér

2022–2023-ban Magyarországon két év alatt az árszint mintegy harmadával nőtt. Nézzük egy (kitalált, de jellemző) fizetés alakulását a közelítő éves inflációs adatokkal:

```python run
# Nominális és reálbér: többet keresünk – de többet is ér?
berek = {2021: 400_000, 2022: 450_000, 2023: 520_000, 2024: 570_000, 2025: 610_000}  # bruttó havi, Ft
inflacio = {2022: 14.5, 2023: 17.6, 2024: 3.7, 2025: 4.4}                               # éves CPI, %

arszint = 100.0                                 # 2021 = 100
for ev, ber in berek.items():
    if ev in inflacio:
        arszint *= 1 + inflacio[ev] / 100       # az árszint évről évre nő
    realber = ber / (arszint / 100)             # 2021-es forintban kifejezve
    print(f"{ev}: nominális {ber:>8,} Ft | árszint {arszint:6.1f} | reálbér (2021-es Ft) {realber:>8,.0f}")
```

A fizetés 2023-ra 30%-kal nőtt, a **reálbér** mégis kb. 3,5%-kal **csökkent**: ugyanabból a pénzből kevesebbet lehetett venni. Csak 2024-ben, amikor az infláció lassult, indult újra a vásárlóerő növekedése. Közelítő szabály kis számokra: reálbér-változás ≈ nominális bérváltozás − infláció; pontosan: $\frac{1 + \text{bérnövekedés}}{1 + \text{infláció}} - 1$.

## 4. Korreláció ≠ ok-okozat

Két teljesen független, véletlenszerűen alakuló, de egyaránt növekvő trendű idősort generálunk ezerszer, és megnézzük, milyen gyakran korrelálnak erősen:

```python run
# Korreláció ≠ ok-okozat: két egymástól FÜGGETLEN, véletlenül bolyongó idősor
import random

def korrelacio(a, b):
    n = len(a)
    ma, mb = sum(a) / n, sum(b) / n
    kov = sum((x - ma) * (y - mb) for x, y in zip(a, b))
    return kov / (sum((x - ma) ** 2 for x in a) * sum((y - mb) ** 2 for y in b)) ** 0.5

r = random.Random(5)
magas = 0
for kiserlet in range(1000):
    a, b = [0.0], [0.0]
    for _ in range(50):                          # 50 "év"; mindkettő a saját útját járja
        a.append(a[-1] + r.gauss(0.3, 1))        # pl. fagylalteladás (enyhén növekvő trend)
        b.append(b[-1] + r.gauss(0.3, 1))        # pl. okostelefonok száma (szintén trend)
    if abs(korrelacio(a, b)) > 0.7:
        magas += 1
print(f"1000 független idősor-párból {magas} esetben |r| > 0,7 – mégsem függnek egymástól!")
```

Az esetek több mint kétharmadában „erős összefüggést” mérünk – pedig a két sor egymásról semmit sem tud! Ennek oka a közös **trend**: ami az időben együtt nő, az korrelál. Ezért a gazdasági adatoknál mindig gyanakodni kell:

- **Rejtett harmadik tényező:** a fagylalt- és a napszemüveg-eladás együtt mozog – mindkettőt a nyár okozza.
- **Fordított ok-okozat:** a több rendőr nem okoz több bűnt – a több bűn miatt küldenek több rendőrt.
- **Véletlen egybeesés:** sok adatsorból mindig akad néhány, ami „szépen” együtt mozog.

Az ok-okozat igazolásához kísérlet (pl. A/B teszt egy weboldalon) vagy gondos statisztikai módszer kell – ezzel a statisztika és az ökonometria foglalkozik.

## Összefoglalás

- Körforgás: $Y = C + I + G + (X - M)$; kiáramlások = beáramlások.
- Százalékpont: két százalék különbsége; százalék: relatív változás. Bázisindex rögzített évhez, láncindex az előző évhez viszonyít.
- Reálbér = nominális bér / árszint; erős infláció mellett emelkedő fizetés is jelenthet kisebb vásárlóerőt.
- A korreláció nem bizonyít ok-okozatot – közös trend, rejtett tényező vagy fordított irány is lehet mögötte.

## A lecke feladata

```quiz required
? A munkanélküliségi ráta 5%-ról 6%-ra nő. Hány százalékkal nőtt a ráta?
= 20
! $\frac{6 - 5}{5} = 20\%$ – közben csak 1 százalékpont az emelkedés.

? $C = 500$, $I = 150$, $G = 200$, $X = 300$, $M = 250$ (milliárd Ft). Mennyi a GDP?
= 900
! $500 + 150 + 200 + (300 - 250) = 900$.

? A fizetésed 10%-kal nő, az infláció 4%. Hány százalékkal nő a reálbéred? (egy tizedesre)
= 5,8
= 5.8
! $\frac{1{,}10}{1{,}04} - 1 \approx 5{,}8\%$ (a közelítő szabály 6%-ot adna).

? Melyik normatív állítás?
- A minimálbér emelése után nőtt a munkanélküliség.
- 2023-ban az infláció 17,6% volt.
+ Az államnak többet kellene költenie oktatásra.
- A kamatemelés drágítja a hiteleket.
! A normatív állítás értékítéletet tartalmaz („kellene”), nem ellenőrizhető tényt.

? Két idősor 0,9-es korrelációt mutat. Mit mondhatunk biztosan?
- az egyik okozza a másikat
- egy harmadik tényező okozza mindkettőt
+ együtt mozognak, de az ok-okozatról ebből önmagában nem tudunk semmit
- véletlen egybeesésről van szó
! Lehet ok-okozat, közös ok vagy véletlen is – ehhez további vizsgálat kell.
```
