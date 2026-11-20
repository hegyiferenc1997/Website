---
title: Mélyebben – kutatás számokkal
summary: Mekkora minta kell egy kérdőívhez (a hibahatár és a mintanagyság), valódi-e egy A/B teszt különbsége (szignifikancia z-próbával és szimulációval), hogyan téveszt meg egy rejtett harmadik változó (korreláció kontra ok-okozat), és egy forrás értékelése több szempontból – kis programokkal és interaktív ábrával.
minutes: 45
---

## Amit ebben a leckében megtanulsz

- hogyan számold ki egy kérdőíves felmérés **hibahatárát**, és mekkora **minta** kell,
- hogyan döntsd el, hogy egy **A/B teszt** különbsége valódi-e, vagy csak a véletlen műve,
- hogyan hoz létre egy **rejtett változó** látszólagos összefüggést,
- hogyan értékelj egy **forrást** több szempont szerint.

## 1. Mekkora minta kell? A hibahatár

Egy felmérésben 100 hallgatóból 60 mondja, hogy használna egy új órarendtervező alkalmazást. Ez 60% – de ha egy másik 100 hallgatót kérdeztünk volna, talán 55% vagy 66% jön ki. A **hibahatár** (margin of error) azt mutatja, mekkora ez a bizonytalanság. Egy arány 95%-os hibahatára jó közelítéssel:

$$\text{hibahatár} \approx 1{,}96 \cdot \sqrt{\frac{p(1 - p)}{n}}$$

ahol $p$ a mért arány, $n$ a minta nagysága. A legrosszabb eset $p = 0{,}5$:

```plot
title: Hibahatár (százalékpont) a minta nagyságának függvényében, p = 0,5
x: 10, 1000
y: 0, 35
f: 100*1.96*sqrt(0.25/x) # hibahatár (95%)
dash: 5 # ±5 százalékpont
```

```python run
# Hibahatár és szükséges mintanagyság egy arányhoz (95%-os megbízhatóság)
from math import sqrt, ceil

def hibahatar(p, n):
    return 1.96 * sqrt(p * (1 - p) / n)

for n in [30, 100, 400, 1000]:
    print(f"n = {n:>4}: 60% ± {hibahatar(0.6, n):.1%}")

def szukseges_n(hiba, p=0.5):
    return ceil((1.96 / hiba) ** 2 * p * (1 - p))

for hiba in [0.10, 0.05, 0.03]:
    print(f"±{hiba:.0%} hibahatárhoz legalább {szukseges_n(hiba)} válaszadó kell")
```

Két tanulság:

- A hibahatár a minta **négyzetgyökével** csökken: a pontosság megduplázásához **négyszer** akkora minta kell. Ezért ad ±3%-ot egy 1000 fős közvélemény-kutatás, és ezért nem ér sokat egy 20 fős „felmérés” a csoporttársak között.
- A képlet csak **véletlen mintára** érvényes! Ha a kérdőívet a saját Discord-szervereden osztod meg, a válaszadók nem képviselik az összes hallgatót (az alapleckében tanult **mintavételi torzítás**) – és ezen a nagyobb létszám sem segít.

## 2. Valódi-e a különbség? Egy A/B teszt

Az alkalmazás regisztrációs oldalának két változatát teszteled: az **A** (régi) változatot 400 látogató látta, közülük 30 regisztrált (7,5%); a **B** (új) változatot másik 400, közülük 48 regisztrált (12%). Jobb-e a B, vagy ez csak véletlen ingadozás?

A **nullhipotézis**: a két változat egyformán jó, a különbség véletlen. Két úton is megvizsgáljuk: egy klasszikus **z-próbával** és egy **szimulációval** (permutációs próba), amely lemásolja, mi történne, ha a nullhipotézis igaz lenne:

```python run
# A/B teszt: z-próba két arányra és permutációs szimuláció
from math import sqrt, erf
import random

a_lat, a_reg = 400, 30
b_lat, b_reg = 400, 48
pa, pb = a_reg / a_lat, b_reg / b_lat
p = (a_reg + b_reg) / (a_lat + b_lat)                  # közös arány a nullhipotézis szerint
z = (pb - pa) / sqrt(p * (1 - p) * (1 / a_lat + 1 / b_lat))
p_ertek = 2 * (1 - 0.5 * (1 + erf(abs(z) / sqrt(2))))
print(f"A: {pa:.1%}, B: {pb:.1%}, z = {z:.2f}, p-érték ≈ {p_ertek:.3f}")

# permutációs próba: ha a változat nem számít, a regisztrációk véletlenszerűen oszlanának meg
random.seed(1)
kimenetek = [1] * (a_reg + b_reg) + [0] * (a_lat + b_lat - a_reg - b_reg)
megfigyelt = pb - pa
legalabb_ekkora = 0
probak = 5000
for _ in range(probak):
    random.shuffle(kimenetek)
    kul = sum(kimenetek[:b_lat]) / b_lat - sum(kimenetek[b_lat:]) / a_lat
    if abs(kul) >= abs(megfigyelt):
        legalabb_ekkora += 1
print(f"szimuláció: a véletlen az esetek {legalabb_ekkora / probak:.1%}-ában ad legalább ekkora különbséget")
```

Mindkét módszer szerint a véletlen az esetek csak kb. **3–4%-ában** okozna ekkora különbséget. A szokásos határ 5%: ez alatt azt mondjuk, a különbség **statisztikailag szignifikáns** – vagyis valószínűleg valódi.

Három fontos figyelmeztetés:

- A szignifikancia **nem a különbség mérete**: egy hatalmas mintán egy apró, gyakorlatilag jelentéktelen különbség is szignifikáns lehet. Mindig nézd meg a **hatás nagyságát** is (itt 4,5 százalékpont – ez egy regisztrációnál jelentős).
- Ha 20 különböző változatot tesztelsz, átlagosan **egy** véletlenül is „szignifikáns” lesz 5%-os határnál. Ne keresgélj addig, amíg valami ki nem jön (ezt hívják p-hackingnek).
- A tesztet **előre** tervezd meg: mennyi ideig fut, mit mérsz – ne akkor állítsd le, amikor épp jól áll.

## 3. Korreláció és ok-okozat: a rejtett változó

Egy kis felmérés szerint akik több kávét isznak, azok kódjában **több hibát** találnak a kódellenőrzésen. Okozza a kávé a hibákat? Szimuláljunk egy világot, ahol a kávé **semmilyen** hatással nincs a hibákra – csak mindkettőt egy harmadik változó befolyásolja: hány órát dolgozik valaki **éjszaka**.

```python run
# Rejtett harmadik változó: az éjszakai munka növeli a kávéfogyasztást ÉS a hibák számát
import random
from statistics import correlation

random.seed(3)
ejszaka, kave, hiba = [], [], []
for _ in range(200):
    e = random.uniform(0, 10)                       # éjszakai munkaórák hetente
    ejszaka.append(e)
    kave.append(1 + 0.4 * e + random.gauss(0, 1))   # a kávé az éjszakázástól függ
    hiba.append(2 + 0.6 * e + random.gauss(0, 1.5)) # a hibák is – a kávétól NEM

print(f"korreláció kávé–hiba: {correlation(kave, hiba):.2f}")

# rögzítsük az éjszakai munkát: nézzük csak azokat, akik 4–6 órát éjszakáznak
csoport = [(k, h) for e, k, h in zip(ejszaka, kave, hiba) if 4 <= e <= 6]
print(f"korreláció kávé–hiba a 4–6 órát éjszakázók között: {correlation(*zip(*csoport)):.2f} ({len(csoport)} fő)")
```

A teljes mintában erős **pozitív korreláció** van a kávé és a hibák között – pedig a modellben a kávénak semmi köze a hibákhoz! Ha viszont csak azokat nézzük, akik nagyjából ugyanannyit éjszakáznak (vagyis „rögzítjük” a rejtett változót), az összefüggés **sokkal gyengébb** lesz (kb. 0,5 helyett 0,2 – ez egy 39 fős csoportban már a véletlen ingadozás határán van). Ez a **zavaró változó** (confounder) hatása.

Hogyan lehet mégis ok-okozatot igazolni? A legerősebb módszer a **kísérlet véletlen besorolással** – pont, mint az A/B tesztben: a látogatókat véletlenszerűen osztjuk két csoportba, így minden rejtett változó (életkor, eszköz, napszak) átlagosan egyformán oszlik meg, és a különbséget csak a változat okozhatja.

## 4. Egy forrás értékelése több szempontból

A szakdolgozatodhoz forrást keresel arról, hogy mennyire elterjedt egy programozási nyelv. Három forrást találsz – és egyik sem tökéletes:

| Forrás                                                          | Hitelesség                                   | Frissesség | Elfogultság                                       | Mire jó?                                             |
| --------------------------------------------------------------- | -------------------------------------------- | ---------- | ------------------------------------------------- | ---------------------------------------------------- |
| lektorált konferenciacikk (IEEE), 2019                          | magas: szakmai bírálat, módszertan leírva    | elavulhat  | alacsony                                          | módszer, definíciók, hosszabb távú trendek           |
| egy nagy fejlesztői felmérés (pl. éves Stack Overflow-felmérés) | közepes: nagy minta, de önkéntes jelentkezés | friss      | mintavételi torzítás: az aktív fórumozók túlsúlya | friss népszerűségi adatok, a korlátok megemlítésével |
| egy nyelvet fejlesztő cég blogbejegyzése                        | alacsony–közepes                             | friss      | magas: érdekelt fél                               | a cég álláspontja, termékinformáció – nem bizonyíték |

A jó gyakorlat nem az, hogy csak a „tökéletes” forrást használod, hanem hogy **tudod, mire jó**, és a korlátait is megnevezed: „A Stack Overflow 2025-ös felmérése szerint… (megjegyzendő, hogy a válaszadók önkéntesen jelentkeztek, ezért a minta nem reprezentatív).” Ha több, egymástól független forrás ugyanazt mutatja, az állítás sokkal erősebb.

## Összefoglalás

- Egy arány 95%-os hibahatára $\approx 1{,}96\sqrt{p(1-p)/n}$; a pontosság megduplázásához négyszeres minta kell, és a képlet csak véletlen mintára érvényes.
- Egy A/B teszt különbségét z-próbával vagy szimulációval ellenőrizheted; a szignifikancia nem a hatás nagysága, és a teszt előre tervezendő.
- Egy rejtett harmadik változó erős, de hamis korrelációt okozhat; az ok-okozatot a véletlen besorolású kísérlet igazolja a legjobban.
- A forrásokat hitelesség, frissesség és elfogultság szerint értékeld, és nevezd meg a korlátaikat.

## A lecke feladata

```quiz required
? Egy felmérésben $n = 100$ és $p = 0{,}5$. Mekkora a 95%-os hibahatár százalékpontban? ($1{,}96 \cdot \sqrt{0{,}25 / 100}$, egy tizedesre)
= 9,8
= 9.8
! $1{,}96 \cdot 0{,}05 = 0{,}098 = 9{,}8$ százalékpont.

? Hányszor nagyobb minta kell ahhoz, hogy a hibahatár a felére csökkenjen?
= 4
! A hibahatár $1/\sqrt{n}$ szerint csökken: a feléhez négyszeres minta kell.

? Egy A/B tesztben a p-érték 0,03. Mit jelent ez (5%-os határnál)?
- a B változat 3%-kal jobb
+ ha a két változat egyforma lenne, ekkora vagy nagyobb különbség csak az esetek kb. 3%-ában jönne ki véletlenül, ezért a különbség szignifikáns
- 3% az esélye, hogy a B jobb
- a teszt hibás
! A p-érték a nullhipotézis mellett számolt valószínűség, nem a hatás mérete.

? A kávéfogyasztás és a kódhibák között erős korrelációt találsz. Mi a helyes következtetés?
- a kávé okozza a hibákat
- a hibák okozzák a kávéfogyasztást
+ önmagában a korreláció nem bizonyít ok-okozatot; lehet egy rejtett harmadik változó (pl. éjszakai munka)
- a korreláció biztosan véletlen
! Ok-okozatot véletlen besorolású kísérlet igazol a legjobban.

? Mire érdemes egy programozási nyelvet fejlesztő cég blogbejegyzését használni egy szakdolgozatban?
- független bizonyítékként a nyelv fölényére
+ a cég álláspontjának és a termékinformációknak a bemutatására, az érdekeltség megemlítésével
- a legfontosabb forrásként
- sehogy, tilos idézni
! Érdekelt fél: a forrás hasznos lehet, de nem független bizonyíték.
```
