---
title: Mélyebben – teljesítményelemzés módszerrel
summary: A USE-módszer (kihasználtság, telítettség, hibák) ellenőrzőlistaként, hogyan számolja a kernel a terhelési átlagot (szimulátor), miért robban a várakozási idő 80–90% kihasználtság fölött (sorbanállás-elmélet), az átlag kontra a 99. percentilis, Little törvénye, korrekt mérés (bemelegítés, medián), és a hibás változtatás megkeresése felezéssel (git bisect).
minutes: 45
---

## Amit ebben a leckében megtanulsz

- egy bevált **módszert** (USE), hogy egy lassú rendszernél ne találgass, hanem végigmenj egy listán,
- hogyan **számolja** a kernel a terhelési átlagot, és miért „lassú” a 15 perces érték,
- miért lesz egy 90%-ig kihasznált lemez vagy szerver **tízszer** lassabb válaszidejű, mint egy üres,
- miért hazudik az **átlag**, és mit mutat a **99. percentilis**,
- **Little törvényét**, amellyel kiszámolhatod, hány kérés van egyszerre a rendszerben,
- hogyan mérj **korrektül**, és hogyan találod meg **felezéssel** azt a változtatást, amelyik elrontott valamit.

## 1. A USE-módszer: ellenőrzőlista a lassúság ellen

Brendan Gregg teljesítménymérnök módszere: **minden erőforrásra** (CPU, memória, lemez, hálózat) nézz meg **három** dolgot:

| Betű  | Jelentés                          | Kérdés                                 |
| ----- | --------------------------------- | -------------------------------------- |
| **U** | **kihasználtság** (_Utilization_) | Az idő hány százalékában dolgozott?    |
| **S** | **telítettség** (_Saturation_)    | Van-e sor, várakozik-e valaki rá?      |
| **E** | **hibák** (_Errors_)              | Vannak-e hibák (újraküldés, I/O-hiba)? |

| Erőforrás | Kihasználtság          | Telítettség                        | Hibák                         |
| --------- | ---------------------- | ---------------------------------- | ----------------------------- |
| CPU       | `top`: %us + %sy       | `vmstat`: **r** > magok száma      | ritka (`dmesg`: MCE-hibák)    |
| memória   | `free`: used / total   | `vmstat`: **si/so** (lapozás) > 0  | `dmesg`: OOM killer           |
| lemez     | `iostat -x`: **%util** | `iostat -x`: **aqu-sz** (sorhossz) | `dmesg`: I/O error            |
| hálózat   | `sar -n DEV`: kbit/s   | `ss -ti`: újraküldések, eldobások  | `ip -s link`: errors, dropped |

A lényeg: a **telítettség** gyakran fontosabb a kihasználtságnál. Egy 100%-on dolgozó CPU még lehet rendben (ha senki sem vár rá), de ha 20 folyamat áll a sorban, a felhasználók lassúságot éreznek.

**Hasonlat:** az orvos sem találgat, hanem rendszerezetten végigmegy: láz, vérnyomás, pulzus. A USE-módszer a rendszer „vitális jeleinek” listája.

## 2. Hogyan számolja a kernel a terhelési átlagot?

A terhelési átlag nem egyszerű számtani átlag, hanem **exponenciálisan csillapított mozgóátlag**: a kernel **5 másodpercenként** frissíti, és a régi értékek súlya fokozatosan halványul:

**új = régi · e^(−5/P) + n · (1 − e^(−5/P))**,

ahol n a futó vagy futásra kész folyamatok száma, P pedig 60, 300 vagy 900 másodperc (1, 5, 15 perc).

```python run
# A terhelési átlag szimulációja: 5 percig 4 folyamat dolgozik, utána csend
import math

atlag = {60: 0.0, 300: 0.0, 900: 0.0}             # 1, 5, 15 perces átlag
pillanatok = {60, 300, 360, 600, 900, 1800}       # ezekben a másodpercekben kiírjuk

for mp in range(0, 1800, 5):
    n = 4 if mp < 300 else 0                      # az első 5 percben 4 folyamat fut
    for P in atlag:
        e = math.exp(-5 / P)
        atlag[P] = atlag[P] * e + n * (1 - e)
    if mp + 5 in pillanatok:
        print(f"{(mp + 5) // 60:>2}. perc: load average: "
              f"{atlag[60]:.2f}, {atlag[300]:.2f}, {atlag[900]:.2f}")
```

Figyeld meg:

- 1 perc terhelés után az 1 perces érték csak **2,53** – nem 4! A csillapítás miatt idő kell, mire „utoléri” a valóságot.
- A terhelés megszűnése után 5 perccel az 1 perces érték már 0, de a 15 perces még **0,81**.

Tanulság a hibakereséshez: ha az `uptime` kimenete **1 perc > 5 perc > 15 perc** (pl. 3,9; 2,5; 1,1), a terhelés **most nő**; ha fordítva (0,0; 0,9; 0,8), akkor **elmúlt** – lehet, hogy későn kezdtél nyomozni.

## 3. Miért robban a várakozás 90% fölött? – sorbanállás

Képzeld el a menzát egyetlen pénztárral. Ha a pénztáros az idő 50%-ában dolgozik, ritkán kell várni. 90%-nál már szinte mindig áll előtted valaki. A legegyszerűbb sorbanállási modell (M/M/1) szerint az átlagos **válaszidő**:

**R = S / (1 − U)**,

ahol S a kiszolgálási idő (pl. egy lemezművelet 1 ms), U a kihasználtság.

```python run
# Válaszidő a kihasználtság függvényében (M/M/1 sorbanállási modell)
S_MS = 1.0                                         # egy kérés kiszolgálási ideje (ms)

print(f"{'kihasználtság':>14} {'válaszidő':>10} {'ebből várakozás':>16}")
for U in [0.10, 0.50, 0.70, 0.80, 0.90, 0.95, 0.99]:
    R = S_MS / (1 - U)
    print(f"{U:>13.0%} {R:>8.1f} ms {R - S_MS:>14.1f} ms {'#' * min(int(R), 50)}")
```

A görbe nem egyenes, hanem **hokiütő**: 50%-nál a válaszidő kétszeres, 90%-nál **tízszeres**, 99%-nál **százszoros**. Ezért nem akarnak a rendszergazdák 100%-ig kihasznált szervert: tartósan 70–80% fölött a felhasználók már érzik a lassulást, pedig „még van tartalék”. Ugyanez a jelenség az autópályán: 90%-os telítettségnél egyetlen fékezés is dugót okoz.

## 4. Az átlag hazudik – percentilisek

Egy webszerver 1000 kérésének válaszideje: 950 kérés gyors (10–30 ms), 50 nagyon lassú (200–500 ms, pl. mert épp lemezre kellett várni).

```python run
# Átlag, medián és magas percentilisek ugyanarra az adatsorra
gyors = [10 + (i * 7) % 21 for i in range(950)]          # 10–30 ms
lassu = [200 + (i * 37) % 301 for i in range(50)]        # 200–500 ms
ido = sorted(gyors + lassu)

def percentilis(rendezett, p):
    # a legkisebb érték, amely alatt (vagy egyenlő) a kérések p százaléka van
    index = max(0, int(len(rendezett) * p / 100 + 0.5) - 1)
    return rendezett[index]

print(f"átlag:  {sum(ido) / len(ido):6.1f} ms")
for p in [50, 90, 95, 99, 100]:
    print(f"p{p:<3}:   {percentilis(ido, p):6} ms")
```

Az **átlag** (kb. 34 ms) egyik csoportot sem írja le: a gyors kérések 10–30 ms-osak, a lassúak 200 ms fölöttiek. A **medián** (p50) a tipikus felhasználó élménye, a **p99** viszont azt mutatja, mit él át minden **századik** kérés – itt majdnem fél másodpercet. Egy weboldal betöltése sok kérésből áll: ha egy oldal 100 kérést indít, szinte biztos, hogy legalább egy a leglassabb 1%-ba esik. Ezért a komoly rendszereknél a **p99** (vagy p99,9) a mérőszám, nem az átlag.

## 5. Little törvénye

Egy egyszerű, de meglepően általános összefüggés bármilyen sorbanállási rendszerre:

**L = λ · W**

- **L** – átlagosan hány kérés van **egyszerre** a rendszerben,
- **λ** – másodpercenként hány kérés **érkezik**,
- **W** – egy kérés átlagosan mennyi ideig van bent.

Példa: egy szerverre másodpercenként **200** kérés érkezik, mindegyik átlagosan **50 ms**-ig tart → L = 200 · 0,05 = **10** kérés van egyszerre folyamatban. Ha a szerver legfeljebb 8 szálon tud dolgozni, a kérések **sorba állnak**, és a válaszidő megugrik. A törvény a menzára is igaz: ha percenként 6 diák érkezik, és mindenki 5 percet tölt bent a sorban és a pénztárnál, átlagosan 30-an állnak bent.

## 6. Korrekt mérés: bemelegítés, ismétlés, medián

Az első futás szinte mindig **lassabb**: a program és az adat még nincs a gyorsítótárban, a laptábla és a TLB hideg, és a CPU frekvenciája is épp emelkedik. Ezért:

1. végezz **bemelegítő** futást, amelyet nem számolsz bele,
2. **ismételj** sokszor,
3. a **mediánt** (vagy a minimumot) használd, ne egyetlen mérést – egy háttérfolyamat bármikor belerondíthat egy futásba.

```python run
# Korrekt mikrobenchmark: bemelegítés, ismétlés, medián – két megoldás összevetése
import timeit, statistics

def osszefuz_plusz(n=2000):
    s = ""
    for i in range(n):
        s += str(i)
    return s

def osszefuz_join(n=2000):
    return "".join(str(i) for i in range(n))

for fv in [osszefuz_plusz, osszefuz_join]:
    fv()                                           # bemelegítés
    meresek = timeit.repeat(fv, number=50, repeat=7)
    ms = [m / 50 * 1000 for m in meresek]          # egy hívás ideje ms-ban
    print(f"{fv.__name__:<15} medián {statistics.median(ms):.3f} ms "
          f"(min {min(ms):.3f}, max {max(ms):.3f})")
```

A min és a max közötti szórás mutatja, mennyire „zajos” a mérés. Ha két megoldás eredménye a zajon belül van, nem mondhatod, hogy az egyik gyorsabb.

## 7. Melyik változtatás rontotta el? – felezés

A kernelfejlesztésben gyakori helyzet: a 6.11-es kernel még gyors volt, a 6.12-es lassú, és közöttük **10 000** változtatás (_commit_) van. Melyik a hibás? Végigpróbálni mindet reménytelen – de **felezéssel** (bináris kereséssel) kevés lépés elég: kipróbálod a középsőt; ha az már lassú, a hiba az első felében van, ha még gyors, a második felében.

```python run
# Bináris keresés a hibás commit után: hány próbafordítás kell?
import math

def bisect(commitok_szama, hibas):
    jo, rossz = 0, commitok_szama                  # a 0. még jó, az utolsó már rossz
    lepesek = 0
    while rossz - jo > 1:
        kozep = (jo + rossz) // 2
        lepesek += 1
        if kozep >= hibas:                         # teszt: a közép már lassú?
            rossz = kozep
        else:
            jo = kozep
    return rossz, lepesek

talalt, lepes = bisect(10_000, hibas=6_789)
print(f"a hibás commit: {talalt}, {lepes} próba kellett")
print(f"elméletben: log2(10000) ≈ {math.log2(10_000):.1f} → legfeljebb {math.ceil(math.log2(10_000))} próba")
```

10 000 változtatásból **legfeljebb 14 próbával** megvan a hibás (itt 13 is elég volt)! A `git bisect` parancs pontosan ezt automatizálja: megjelölöd a jó és a rossz verziót, és a git mindig a középsőt veszi elő tesztelésre. A Linux kernelfejlesztők a teljesítmény-visszaeséseket (_regression_) rendszeresen így találják meg.

```bash
git bisect start
git bisect bad                 # a mostani verzió rossz
git bisect good v6.11          # ez még jó volt
# … minden lépésben: fordítás, mérés, majd "git bisect good" vagy "git bisect bad"
git bisect reset               # a végén vissza az eredeti állapotba
```

## Összefoglalás

- **USE-módszer**: minden erőforrásra kihasználtság, telítettség, hibák – a telítettség (sorhossz) gyakran fontosabb a kihasználtságnál.
- A terhelési átlag **exponenciálisan csillapított** mozgóátlag; az 1/5/15 perces értékek sorrendje megmutatja, nő vagy csökken a terhelés.
- Sorbanállás: **R = S / (1 − U)** – 90% kihasználtságnál a válaszidő tízszeres.
- Az átlag elrejti a ritka, nagyon lassú kéréseket; a **p99** mutatja a legrosszabb 1%-ot.
- **Little törvénye**: L = λ · W (egyszerre bent lévő kérések = érkezési ráta × bent töltött idő).
- Korrekt mérés: bemelegítés, ismétlés, medián; a hibás változtatás **felezéssel** (git bisect) log₂(n) lépésben megtalálható.

## A lecke feladata

```quiz required
? Egy lemez kiszolgálási ideje 2 ms, a kihasználtsága 80%. Mennyi az átlagos válaszidő ms-ban az M/M/1 modell szerint?
= 10
= 10 ms
! R = S / (1 − U) = 2 / 0,2 = 10 ms.

? Egy szerverre másodpercenként 100 kérés érkezik, mindegyik átlagosan 0,3 másodpercig tart. Átlagosan hány kérés van egyszerre folyamatban?
= 30
! Little törvénye: L = λ · W = 100 · 0,3 = 30.

? Az uptime kimenete: load average: 0.10, 1.80, 2.40. Mit mutat ez?
- a terhelés most nő
+ a terhelés nemrég elmúlt, most már alig van
- a gép most teljesen túlterhelt
! Az 1 perces érték a legkisebb – a csúcs már a múlté.

? Melyik mérőszám mutatja meg, hogy a kérések legrosszabb 1%-a mennyi ideig tart?
- az átlag
- a medián
+ a 99. percentilis (p99)
- a minimum
! A medián (p50) a tipikus, a p99 a ritka, lassú eseteket mutatja.

? 1000 commit között keresed a hibásat a git bisecttel. Legfeljebb hány próba kell?
= 10
! log₂(1000) ≈ 9,97 → 10 próba.

? A USE-módszerben mit jelent a telítettség (Saturation)?
- hány százalékban dolgozik az erőforrás
+ van-e sor, várakozik-e valaki az erőforrásra
- hány hiba történt
! Pl. vmstat r oszlopa nagyobb a magok számánál.
```
