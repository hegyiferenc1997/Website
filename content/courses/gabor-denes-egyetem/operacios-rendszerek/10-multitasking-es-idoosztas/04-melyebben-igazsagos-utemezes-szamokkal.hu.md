---
title: Mélyebben – igazságos ütemezés és többmagos gyorsulás számokkal
summary: Kooperatív és preemptív multitasking szimulátorral, a kvantum és a környezetváltás kompromisszuma táblázatban, a CFS virtuális futásideje és a nice súlyok kiszámolva, a prioritásinverzió (Mars Pathfinder), valamint az Amdahl-törvény – miért nem lesz 8 magon 8-szor gyorsabb a program.
minutes: 40
---

## Amit ebben a leckében megtanulsz

- **szimulátorral** megnézni, miért „fagyott le” a kooperatív multitaskingos rendszer egyetlen rossz program miatt,
- **táblázatban** látni a kvantum méretének kompromisszumát (rezsi kontra várakozás),
- kiszámolni, hogy a Linux ütemezője a **nice érték** alapján pontosan mekkora CPU-részt ad,
- megérteni a **prioritásinverziót**, amely egy Mars-szondát is újraindításra kényszerített,
- az **Amdahl-törvénnyel** megbecsülni, mennyit gyorsít a több mag.

## 1. Kooperatív kontra preemptív – szimulátorral

Kooperatív multitaskingnál a folyamat **maga adja vissza** a CPU-t (pl. Windows 3.1, régi Mac OS). Ha egy program sokáig számol és nem enged, mindenki más vár. Szimuláljunk három feladatot: egy hosszú számolást (100 ms), és két interaktív feladatot (zenelejátszó, egérkezelés), amelyek 1 ms-onként maguktól átadják a vezérlést.

```python run
# Kooperatív ütemezés: a feladat addig fut, amíg ő maga át nem adja a CPU-t
def kooperativ(feladatok):
    t, maradek, elso = 0, {}, {}
    sor = []
    for nev, loket, atad in feladatok:
        maradek[nev] = loket
        sor.append((nev, atad))
    while sor:
        nev, atad = sor.pop(0)
        elso.setdefault(nev, t)                    # mikor kapott először CPU-t
        fut = maradek[nev] if atad is None else min(atad, maradek[nev])
        t += fut
        maradek[nev] -= fut
        if maradek[nev] > 0:
            sor.append((nev, atad))
    return elso

# Preemptív: legfeljebb q ms-ig futhat bárki (Round Robin)
def preemptiv(feladatok, q):
    t, maradek, elso = 0, {}, {}
    sor = []
    for nev, loket, _ in feladatok:
        maradek[nev] = loket
        sor.append(nev)
    while sor:
        nev = sor.pop(0)
        elso.setdefault(nev, t)
        fut = min(q, maradek[nev])
        t += fut
        maradek[nev] -= fut
        if maradek[nev] > 0:
            sor.append(nev)
    return elso

feladatok = [("szamolas", 100, None), ("zene", 3, 1), ("eger", 2, 1)]   # None = sosem enged
print("Kooperatív – első futás ideje (ms):", kooperativ(feladatok))
print("Preemptív q=4 – első futás ideje (ms):", preemptiv(feladatok, 4))
```

Kooperatív módban a zene **100 ms** múlva szólal meg először – a felhasználó „lefagyott” gépet lát. Preemptív ütemezésnél az időzítő megszakítása **4 ms** után elveszi a CPU-t a számolástól, így a zene és az egér azonnal sorra kerül. Ezért preemptív minden mai asztali és szerver OS.

**Hasonlat:** a kooperatív rendszer olyan, mint egy megbeszélés, ahol mindenki addig beszél, amíg akar – egyetlen szószátyár megbéníthatja. A preemptív rendszerben van moderátor (az időzítő), aki 4 perc után elveszi a mikrofont.

## 2. A kvantum kompromisszuma táblázatban

Az alapleckében két képletet láttál: a **rezsi** s / (q + s), és a legnagyobb várakozás két futás között. Ha a váltások idejét is beszámoljuk, n folyamatnál ez **(n − 1) · (q + s)**. Nézzük, hogyan alakul a kettő 10 folyamatnál, 0,1 ms-os környezetváltással (közvetlen + rejtett költség együtt):

```python run
# Rezsi és legnagyobb várakozás a kvantum függvényében
n = 10        # versengő folyamatok száma
s = 0.1       # egy környezetváltás ideje (ms)

print(f"{'q (ms)':>8} {'rezsi':>8} {'max várakozás (ms)':>20}")
for q in [0.1, 0.5, 1, 4, 10, 50, 200]:
    rezsi = s / (q + s) * 100
    varakozas = (n - 1) * (q + s)
    print(f"{q:>8} {rezsi:>7.1f}% {varakozas:>20.1f}")
```

Az eredmény kirajzolja a kompromisszumot:

- **q = 0,1 ms**: a CPU-idő **fele** váltogatásra megy el;
- **q = 200 ms**: a rezsi elhanyagolható, de egy folyamat akár **1,8 másodpercet** vár – egy gépelésre ez már elviselhetetlen (kb. 100 ms fölött a késést már érzékeljük);
- **q = 4–10 ms**: a rezsi 1–2%, a várakozás 40–90 ms – ezért van a valós rendszerek kvantuma ebben a tartományban.

## 3. A CFS és az EEVDF titka: a virtuális futásidő

A Linux ütemezője minden feladatnak **súlyt** ad a nice értéke alapján, és a valódi futásidőt elosztja ezzel a súllyal – ez a **virtuális futásidő** (_vruntime_). Mindig az kap CPU-t, akinek a legkisebb a vruntime-ja. Akinek nagyobb a súlya, annak lassabban „ketyeg” az órája, így többet futhat.

A kernel súlytáblájából néhány érték (`sched_prio_to_weight`):

| nice | súly |
| ---- | ---- |
| −5   | 3121 |
| 0    | 1024 |
| 1    | 820  |
| 5    | 335  |
| 10   | 110  |

Két szomszédos szint aránya mindig kb. **1,25**. Ezért igaz az alapleckében tanult „egy szint ≈ 10%” szabály: két versengő feladat közül a nice 0-s **1024 / (1024 + 820) ≈ 55,5%**-ot kap, a nice 1-es 44,5%-ot – a különbség kb. 10 százalékpont.

```python run
# A CFS egyszerűsített szimulációja: mindig a legkisebb vruntime-ú fut 1 ms-ig
SULY = {-5: 3121, 0: 1024, 1: 820, 5: 335, 10: 110}

def cfs(feladatok, osszes_ms):
    vruntime = {nev: 0.0 for nev in feladatok}
    futott = {nev: 0 for nev in feladatok}
    for _ in range(osszes_ms):
        nev = min(vruntime, key=lambda n: (vruntime[n], n))   # legkevesebbet "futott"
        futott[nev] += 1
        vruntime[nev] += 1 * 1024 / SULY[feladatok[nev]]    # nagy súly → lassú óra
    for nev, ms in futott.items():
        print(f"  {nev:<10} nice {feladatok[nev]:>3}: {ms:>4} ms ({ms / osszes_ms:.1%})")

print("nice 0 kontra nice 5:")
cfs({"bongeszo": 0, "mentes": 5}, 1000)
print("nice 0 kontra nice 10:")
cfs({"bongeszo": 0, "forditas": 10}, 1000)
print("három feladat:")
cfs({"jatek": -5, "bongeszo": 0, "mentes": 10}, 1000)
```

A szimuláció pontosan visszaadja a súlyarányokat: nice 0 kontra 5 → kb. **75% / 25%** (1024 / 1359), nice 0 kontra 10 → kb. **90% / 10%**. A súly tehát nem „ki fut előbb” kérdés, hanem **arány**: a nice 10-es mentés is halad, csak lassabban – nem éhezik ki.

**Hasonlat:** egy étteremben mindenki a „legkevesebbet evett” vendégnek visz a pincér falatot. A nagyobb súlyú vendégnél minden falat „kevesebbnek számít”, ezért ő többször kap.

## 4. Prioritásinverzió – amikor a fontos feladat vár a kevésbé fontosra

1997-ben a NASA **Mars Pathfinder** szondája a Marson újra meg újra **újraindult**. Az ok egy klasszikus ütemezési csapda volt:

1. Egy **alacsony** prioritású feladat (L) lefoglalt egy zárat (egy közös adatbuszt).
2. Egy **magas** prioritású feladat (H) is kérte ugyanazt a zárat – várnia kellett L-re.
3. Közben egy **közepes** prioritású, hosszú feladat (M) futásra kész lett. Mivel M fontosabb L-nél, **megelőzte** L-t.
4. L nem futhatott, így nem engedte el a zárat; H tehát **M-re** várt – pedig H a legfontosabb! Egy őrzőidőzítő (_watchdog_) észlelte, hogy H nem fut, és újraindította a rendszert.

A megoldás a **prioritásöröklés** (_priority inheritance_): amíg L egy H által kért zárat tart, ideiglenesen **H prioritását örökli**, így M nem előzheti meg. A NASA mérnökei a Földről, egy konfigurációs kapcsoló átállításával javították a hibát. A Linux `PTHREAD_PRIO_INHERIT` zárai és a Windows prioritásemelései ugyanezt a gondot kezelik.

```python run
# Prioritásinverzió: mikor fut végre H öröklés nélkül és örökléssel?
# L: 0 ms-tól fut, 1 ms-nál megszerzi a zárat, még 3 ms kell neki a zárral
# H: 2 ms-nál érkezik, a zár kell neki; M: 3 ms-nál érkezik, 20 ms-ig számol (zár nélkül)
def szimulal(oroklessel):
    l_maradek_zarral = 3 - 1        # 2 ms-ig L már futott (1 ms a zárral)
    t = 2                           # H most érkezett és blokkolódott
    m_maradek = 20
    while l_maradek_zarral > 0:
        if t >= 3 and m_maradek > 0 and not oroklessel:
            m_maradek -= 1          # M megelőzi L-t (M > L)
        else:
            l_maradek_zarral -= 1   # L fut (örökléssel H prioritásán)
        t += 1
    return t                        # L elengedi a zárat, H azonnal fut

print("H öröklés nélkül ennyi ms-nál indul:", szimulal(False))
print("H örökléssel ennyi ms-nál indul:   ", szimulal(True))
```

Öröklés nélkül a legfontosabb feladat **24 ms**-nál indul (megvárja M teljes 20 ms-át), örökléssel már **4 ms**-nál.

## 5. Amdahl törvénye – miért nem lesz 8 magon 8-szor gyorsabb?

A több mag csak azt a részt gyorsítja, amelyik **párhuzamosítható**. Ha a program futásidejének **p** része párhuzamosítható, és **n** magunk van, a gyorsulás:

**S(n) = 1 / ((1 − p) + p / n)**

```python run
# Amdahl-törvény: gyorsulás a magok számának függvényében
def gyorsulas(p, n):
    return 1 / ((1 - p) + p / n)

for p in [0.5, 0.9, 0.99]:
    sor = ", ".join(f"{n} mag: {gyorsulas(p, n):5.2f}×" for n in [2, 4, 8, 16])
    print(f"p = {p:.0%}  →  {sor}  | korlát: {1 / (1 - p):.0f}×")
```

Ha a program **90%**-a párhuzamosítható, 8 magon csak kb. **4,7-szeres** a gyorsulás, és végtelen sok magon sem több **10-szeresnél** – a maradék 10% soros rész lesz a szűk keresztmetszet. Ezért mondják, hogy a soros rész „uralkodik”.

**Hasonlat:** egy ebéd elkészítésénél 4 szakács egyszerre vághat zöldséget (párhuzamos rész), de a leves akkor is 30 percig fő, akárhányan állnak a fazék mellett (soros rész).

Ráadásul a valóságban a magok **osztoznak** a memória-sávszélességen és a közös gyorsítótáron, a zárak miatt várnak egymásra, és a feladatok átköltöztetése hideg gyorsítótárral jár – így a gyakorlati gyorsulás gyakran még az Amdahl-becslésnél is kisebb.

## 6. Nézd meg a saját gépeden

```bash
# Ubuntu VM: két CPU-zabáló versenyez egy magon, eltérő nice értékkel
taskset -c 0 nice -n 0 sh -c 'while :; do :; done' &
taskset -c 0 nice -n 5 sh -c 'while :; do :; done' &
top -b -n 2 -d 2 | grep -E 'PID| sh$'     # %CPU: kb. 75% és 25%
kill %1 %2                                  # takaríts el magad után!
```

A `taskset -c 0` mindkettőt ugyanarra a magra kényszeríti – különben külön magon futnának, és nem versenyeznének. Ugyanígy kipróbálhatod a nice 10-et is: kb. 90% / 10% lesz.

## Összefoglalás

- Kooperatív multitaskingnál egy nem engedő program mindenkit megakaszt; a preemptív ütemezésnél az **időzítő** veszi el a CPU-t.
- A kvantum kompromisszum: kicsi kvantum → nagy rezsi, nagy kvantum → lassú reagálás; a tipikus 4–10 ms mindkettőt elfogadhatóan tartja.
- A Linux a nice értékből **súlyt** képez (nice 0 = 1024, szintenként ~1,25-szörös), és mindig a legkisebb **virtuális futásidejű** feladatot futtatja – így a CPU-idő a súlyok arányában oszlik meg.
- **Prioritásinverzió:** a magas prioritású feladat egy zár miatt közvetve a közepesre vár; a megoldás a **prioritásöröklés**.
- **Amdahl-törvény:** S(n) = 1 / ((1 − p) + p / n); a soros rész korlátozza a gyorsulást (p = 90% → legfeljebb 10×).

## A lecke feladata

```quiz required
? Két feladat versenyez egy magon a Linux ütemezőjével: a nice 0-s súlya 1024, a nice 5-ösé 335. Hány százalék CPU-t kap kerekítve a nice 0-s?
= 75
= 75%
! 1024 / (1024 + 335) ≈ 0,753.

? A program 90%-a párhuzamosítható. Legfeljebb hányszoros gyorsulást érhetünk el akárhány maggal?
= 10
= 10×
! 1 / (1 − 0,9) = 10.

? A program 50%-a párhuzamosítható. Hányszoros a gyorsulás 2 magon? (két tizedesre)
= 1.33
= 1,33
! 1 / (0,5 + 0,5 / 2) = 1 / 0,75 ≈ 1,33.

? Miért „fagyott le” a teljes rendszer kooperatív multitaskingnál, ha egy program végtelen ciklusba került?
- mert a végtelen ciklus kitörli a memóriát
+ mert a program sosem adta vissza a vezérlést, és nem volt időzítő, amely elvette volna
- mert a kooperatív rendszerek nem ismernek folyamatokat
! A preemptív ütemezésnél az időzítő megszakítása veszi el a CPU-t.

? Egy alacsony prioritású feladat zárat tart, amelyre egy magas prioritású vár, közben egy közepes prioritású feladat megelőzi az alacsonyat. Mi a jelenség neve és a szokásos megoldása?
- holtpont, a bankár algoritmussal
+ prioritásinverzió, prioritásörökléssel
- éhezés, öregítéssel
! Így járt a Mars Pathfinder 1997-ben.

? 10 folyamat váltakozik, q = 4 ms, egy váltás 0,1 ms. Hány ms telik el legfeljebb egy folyamat két futása között? (egy tizedesre)
= 36.9
= 36,9
! (n − 1) · (q + s) = 9 · 4,1 = 36,9 ms.
```
