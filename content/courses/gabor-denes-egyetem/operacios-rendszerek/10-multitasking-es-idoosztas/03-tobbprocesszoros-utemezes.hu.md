---
title: Többprocesszoros ütemezés a gyakorlatban
summary: Többmagos ütemezés, terheléselosztás és affinitás, a Linux CFS/EEVDF ütemezője és a nice érték, a Windows prioritásai.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- milyen gondok jönnek elő **több mag** ütemezésénél (terheléselosztás, **affinitás**),
- hogyan ütemez a **Linux** (CFS, EEVDF), és mire való a **nice** érték,
- hogyan működnek a **Windows** prioritásai, és mi a **valós idejű** prioritás.

## Több mag, több gond

- **Szimmetrikus multiprocesszálás** (SMP): minden mag egyenrangú, mindegyik saját magának ütemez. Ma ez az általános.
- **Magonkénti futási sor**: minden magnak saját kész sora van – így nem kell egy közös soron osztozni (zárolás nélkül gyorsabb).
- **Terheléselosztás** (_load balancing_): ha az egyik mag sora tele, a másiké üres, a kernel **átköltöztet** feladatokat (_push_ / _pull migration_).
- **Processzor-affinitás**: egy szál lehetőleg **ugyanazon a magon** maradjon, mert ott „meleg” a gyorsítótára. A terheléselosztás és az affinitás tehát egymás ellen dolgozik – az ütemező egyensúlyoz.
- **Hibrid processzorok**: a mai Intel és ARM chipekben vannak **teljesítmény** (P) és **takarékos** (E) magok; az ütemező a háttérfeladatokat az E-magokra teszi.

```bash
nproc                    # hány logikai processzor van
taskset -cp $$           # a shelled affinitása: mely magokon futhat
htop                     # magonkénti terhelés (sudo apt install htop)
```

## A Linux ütemezője

A Linux 2007 és 2023 között a **CFS**-t (_Completely Fair Scheduler_) használta: minden feladat **virtuális futásidejét** (_vruntime_) számolja, és mindig a **legkevesebbet futott** kapja a CPU-t. Így hosszú távon mindenki igazságos részt kap. A 6.6-os kerneltől az utódja, az **EEVDF** (_Earliest Eligible Virtual Deadline First_) ütemez, amely ugyanezt az igazságosságot tartja meg, de a rövid, interaktív feladatoknak jobb késleltetést ad.

### A nice érték

A **nice** érték −20 (legmagasabb prioritás) és +19 (legalacsonyabb) között mozog, alapból **0**. A név onnan jön, hogy egy „kedves” (nice) folyamat engedi előre a többit.

```bash
nice -n 10 tar czf mentes.tgz ~/labor   # alacsonyabb prioritással indítjuk
ps -o pid,ni,cmd                         # NI oszlop: a nice érték
renice -n 5 -p <PID>                     # futó folyamat nice értékének módosítása
sudo renice -n -5 -p <PID>               # prioritás NÖVELÉSE csak rootnak megy
```

Egy nice-szintnyi különbség nagyjából **10%**-kal több vagy kevesebb CPU-időt jelent egy versengő folyamathoz képest.

## A Windows ütemezője

A Windows **prioritásos, preemptív** ütemezést használ **32 szinttel** (0–31):

- **1–15**: változó (dinamikus) prioritások a közönséges programoknak; a Windows ideiglenesen **megemeli** az előtérben lévő ablak vagy egy I/O-ra várakozásból éppen visszatérő szál prioritását, hogy a gép jól reagáljon;
- **16–31**: **valós idejű** prioritások – ezek mindig megelőzik a közönségeseket;
- **0**: a memórialapokat nullázó rendszerszál.

A Feladatkezelő **Részletek** fülén a jobb gombos **Prioritás beállítása** menü osztályokat kínál: _Alacsony_, _Normál alatti_, _Normál_, _Normál feletti_, _Magas_, _Valós idejű_. A _Valós idejű_ veszélyes: egy elszabadult program elveheti a CPU-t a rendszertől is.

```powershell
Get-Process | Select-Object -First 5 Name, PriorityClass
# Rendszergazdaként: (Get-Process notepad).PriorityClass = "BelowNormal"
```

## Valós idejű ütemezés röviden

**Valós idejű** rendszerben nem az átlag számít, hanem hogy egy feladat **határidőre** lefusson (pl. légzsák, ipari robot). Linuxon a `SCHED_FIFO` és `SCHED_RR` valós idejű ütemezési osztályok mindig megelőzik a normál feladatokat. Az operációs rendszerek típusairól szóló témakörben még visszatérünk rá.

## Összefoglalás

- Többmagos ütemezés: magonkénti sorok, terheléselosztás, affinitás; hibrid P/E magok.
- Linux: CFS, majd EEVDF – a legkevesebbet futott kap CPU-t; nice −20…+19, alapból 0.
- Windows: 32 prioritásszint, 16–31 valós idejű, az előtér dinamikus emelést kap.

## A lecke feladata

```quiz required
? Mi a nice érték alapértelmezése Linuxon?
= 0
! Tartomány: −20 (legmagasabb) … +19 (legalacsonyabb prioritás).

? Melyik nice érték jelenti a legalacsonyabb prioritást?
- −20
- 0
- 10
+ 19
! Minél „kedvesebb” a folyamat, annál inkább előre engedi a többit.

? Mit jelent a processzor-affinitás?
+ Egy szál lehetőleg ugyanazon a magon fusson, mert ott meleg a gyorsítótára.
- A legerősebb mag mindig a rendszeré.
- Minden szál minden magon egyszerre fut.
- A magok felváltva alszanak.
! A terheléselosztás ezzel szemben néha átköltöztet.

? Hány prioritásszintet használ a Windows ütemezője?
= 32
! 0–31; a 16–31 a valós idejű tartomány.

? Hogy hívják a Linux 6.6-os kernelétől használt ütemezőt, a CFS utódját? (rövidítés)
= EEVDF
! Earliest Eligible Virtual Deadline First.
```
