---
title: Mélyebben – az I/O teljesítmény számokkal
summary: Egy merevlemez-hozzáférés idejének kiszámítása, IOPS és áteresztőképesség (miért 500-szor lassabb a véletlen olvasás), egy lemezütemező-szimulátor C-SCAN-nel és C-LOOK-kal, a visszaírásos gyorsítótár és a sync, valamint I/O-mérés a virtuális gépen.
minutes: 40
---

## Amit ebben a leckében megtanulsz

- hogyan számold ki egy **merevlemez-hozzáférés** idejét a keresési idő, a forgási késleltetés és az átvitel összegéből,
- mi az **IOPS** és az **áteresztőképesség**, és miért **sokszorosan lassabb** a véletlen elérés a sorosnál,
- hogyan hasonlítja össze egy **szimulátor** az összes lemezütemezőt (a C-SCAN-t és a C-LOOK-ot is),
- mi a **visszaírásos gyorsítótár**, és mire jó a `sync`,
- hogyan **mérd** az I/O-t a laborgépen.

## 1. Egy merevlemez-hozzáférés anatómiája

Egy tipikus asztali merevlemez adatai: **7200 fordulat/perc**, átlagos keresési idő **9 ms**, soros átviteli sebesség **150 MB/s**. Mennyi ideig tart beolvasni **egy 4 KB-os blokkot** egy véletlenszerű helyről?

1. **Keresési idő:** 9 ms (átlagosan).
2. **Forgási késleltetés:** egy fordulat 60 000 ms / 7200 = 8,33 ms. Átlagosan **fél** fordulatot kell várni: **4,17 ms**.
3. **Átvitel:** 4 KB / 150 MB/s ≈ 4 / 150 000 s ≈ **0,027 ms**.

Összesen: 9 + 4,17 + 0,03 ≈ **13,2 ms**. Az idő **99,8%-a** mozgással és várakozással telik, és csak 0,2%-a tényleges adatolvasással!

## 2. IOPS és áteresztőképesség

Két mérőszámmal jellemezzük a háttértárakat:

- **IOPS** (_I/O operations per second_): hány különálló műveletet tud másodpercenként – a **véletlen** elérésnél számít (adatbázis, sok kis fájl, operációs rendszer indítása);
- **áteresztőképesség** (MB/s): mennyi adatot tud folyamatosan átvinni – a **soros** elérésnél számít (videó másolása, mentés).

```python run
# Merevlemez és SSD: véletlen 4 KB-os olvasás kontra soros olvasás.
def hdd_veletlen(rpm=7200, kereses_ms=9.0, atvitel_mb_s=150, blokk_kb=4):
    forgas_ms = 60_000 / rpm / 2                 # átlagosan fél fordulat
    atvitel_ms = blokk_kb / 1024 / atvitel_mb_s * 1000
    return kereses_ms + forgas_ms + atvitel_ms

ido = hdd_veletlen()
iops = 1000 / ido
print(f"HDD egy véletlen 4 KB-os olvasás: {ido:.2f} ms → {iops:.0f} IOPS")
print(f"HDD véletlen olvasás:  {iops * 4 / 1024:.2f} MB/s")
print(f"HDD soros olvasás:     150 MB/s  (≈ {150 / (iops * 4 / 1024):.0f}× gyorsabb)")

ssd_ms = 0.1                                     # egy SSD véletlen olvasás ~0,1 ms
print(f"\nSATA SSD véletlen 4 KB: {1000 / ssd_ms:,.0f} IOPS (egy kérés egyszerre)")
print("NVMe SSD sok párhuzamos kéréssel: több százezer IOPS")

for rpm in (5400, 7200, 10_000, 15_000):
    print(f"{rpm:>6} fordulat/perc: {hdd_veletlen(rpm=rpm):5.2f} ms / véletlen olvasás")
```

A merevlemez véletlen olvasásnál kb. **75 IOPS**-ra képes, ami 4 KB-os blokkokkal csupán **0,3 MB/s** – a soros 150 MB/s-hoz képest **ötszázszor** lassabb! Ezért fut olyan lassan egy rendszer indítása merevlemezről (sok kis, szétszórt fájl), és ezért hozott hatalmas ugrást az SSD: nem a soros sebesség miatt, hanem mert a véletlen elérés **százszor–ezerszer** gyorsabb.

A gyorsabb forgás (15 000 fordulat/perc szervermeghajtók) is csak mérsékelten segít, mert a keresési idő megmarad. Ezért próbálja az OS a kéréseket **sorba rendezni** (lemezütemezés) és **összevonni** (egymás melletti blokkokat egyetlen kéréssé).

## 3. Lemezütemező-szimulátor

Az alapleckében kézzel számoltuk ki az FCFS, SSTF, SCAN és LOOK eredményét. A szimulátor mindegyiket kiszámolja – a **C-SCAN**-t és a **C-LOOK**-ot is, amelyek csak egy irányban szolgálnak ki, a végén pedig visszaugranak (a visszaugrást is elmozdulásnak számoljuk).

```python run
# Lemezütemezők összevetése: a fej teljes elmozdulása cilinderekben.
KERESEK = [98, 183, 37, 122, 14, 124, 65, 67]
START, MAX_CIL = 53, 199

def elmozdulas(ut):
    return sum(abs(b - a) for a, b in zip(ut, ut[1:]))

def fcfs():
    return [START] + KERESEK

def sstf():
    ut, hatra = [START], list(KERESEK)
    while hatra:
        kov = min(hatra, key=lambda c: abs(c - ut[-1]))
        hatra.remove(kov)
        ut.append(kov)
    return ut

fel = sorted(c for c in KERESEK if c >= START)       # a fej felett lévő kérések
le = sorted((c for c in KERESEK if c < START), reverse=True)

def scan():   return [START] + fel + [MAX_CIL] + le               # a szélig megy, megfordul
def look():   return [START] + fel + le                           # csak az utolsó kérésig
def c_scan(): return [START] + fel + [MAX_CIL, 0] + sorted(le)    # szél → vissza a 0-ra → fel
def c_look(): return [START] + fel + sorted(le)                   # utolsó → a legkisebb kérésre

for nev, f in [("FCFS", fcfs), ("SSTF", sstf), ("SCAN", scan), ("LOOK", look),
               ("C-SCAN", c_scan), ("C-LOOK", c_look)]:
    ut = f()
    print(f"{nev:7} {elmozdulas(ut):4} cilinder   {' → '.join(map(str, ut))}")
```

Eredmények: FCFS 640, SSTF 236, SCAN 331, LOOK 299, C-SCAN 382, C-LOOK 322. A C-változatok **több** mozgással járnak – miért használják mégis? Mert **egyenletesebb a várakozás**: a SCAN-nél a lemez közepén lévő kéréseket a fej oda-vissza útján kétszer is „útba ejti”, a széleken lévők viszont akár két teljes útnyit várnak. A C-SCAN mindenkit ugyanúgy kezel – mint egy körjárat, amely mindig ugyanabban az irányban megy.

**Tanulság:** a legkisebb összmozgás (SSTF) nem jelenti a legjobb felhasználói élményt – ugyanaz a kompromisszum, mint a processzorütemezésnél: átlag kontra igazságosság.

## 4. Visszaírásos gyorsítótár és a sync

Amikor egy program fájlba ír, a `write()` hívás általában **azonnal visszatér** – pedig az adat még nincs a lemezen! Az OS csak a memóriában lévő **lapgyorsítótárba** (_page cache_) teszi, „piszkosnak” (_dirty_) jelöli, és később, kötegelve írja ki (**visszaírásos**, _write-back_ gyorsítótár). Előnye: sok kis írás egyetlen nagy, rendezett írássá áll össze, és a program nem vár a lassú lemezre.

Hátránya: ha áramszünet van, a még ki nem írt adat **elveszik**. Ezért:

- a `sync` parancs (és a programokban az `fsync()` hívás) **kikényszeríti** a kiírást – az adatbázisok minden véglegesített tranzakció után hívják;
- ezért kell az USB-meghajtót **biztonságosan eltávolítani**: a rendszer ilyenkor kiírja a piszkos lapokat.

Nézd meg a laborgépen:

```bash
dd if=/dev/zero of=proba.bin bs=1M count=300           # gyors: csak a gyorsítótárba ír
grep -E 'Dirty|Writeback' /proc/meminfo                # piszkos, még ki nem írt adat (kB)
sync                                                   # kiírás kikényszerítése
grep -E 'Dirty|Writeback' /proc/meminfo                # most már közel 0
dd if=/dev/zero of=proba.bin bs=1M count=300 conv=fdatasync   # a végén meg is várja a kiírást: lassabb!
rm proba.bin
```

A két `dd` által kiírt sebesség közti különbség megmutatja, mennyit „hazudik” a gyorsítótár – és mennyit gyorsít.

## 5. I/O-mérés a laborgépen

```bash
lsblk -o NAME,SIZE,ROTA,SCHED,TYPE,MOUNTPOINTS   # ROTA=1: forgó lemez, 0: SSD; SCHED: I/O-ütemező
cat /sys/block/sda/queue/scheduler               # az elérhető és az aktív ütemező
sudo apt install sysstat iotop                   # a mérőeszközök telepítése
iostat -x 1 5                                    # eszközönként: r/s, w/s (IOPS), rkB/s, %util
sudo iotop -o                                    # mely folyamatok írnak/olvasnak éppen (kilépés: q)
```

Az `iostat` kimenetében a `%util` azt mutatja, az idő hány százalékában volt foglalt az eszköz; ha tartósan 100% közelében van, az a szűk keresztmetszet. (Virtuális gépen a számok a gazdagép lemezét is tükrözik.)

Windowson: **Erőforrás-figyelő → Lemez** lap: folyamatonként az olvasás és írás (B/s), lent pedig a lemezek _Válaszideje_ és _Aktív idő (%)_ értéke. A Feladatkezelő **Teljesítmény** lapján a lemez grafikonja szintén az aktív időt mutatja.

## Összefoglalás

- Egy véletlen HDD-olvasás ≈ keresés (9 ms) + fél fordulat (7200 f/p: 4,17 ms) + átvitel (~0,03 ms) ≈ 13 ms.
- HDD-n ez ~75 IOPS, 4 KB-os blokkokkal 0,3 MB/s – a soros olvasás ~500-szor gyorsabb. Az SSD előnye főleg a véletlen elérésben van.
- A szimulátor szerint: FCFS 640, SSTF 236, SCAN 331, LOOK 299, C-SCAN 382, C-LOOK 322; a C-változatok egyenletesebb várakozást adnak.
- A **visszaírásos gyorsítótár** gyorsít, de áramszünetkor adatot veszíthetünk; a `sync`/`fsync()` kikényszeríti a kiírást.
- `lsblk`, `iostat -x`, `iotop`, Windowson az Erőforrás-figyelő mutatja az I/O terhelést.

## A lecke feladata

```quiz required
? Egy 7200 fordulat/perces merevlemeznél mennyi az átlagos forgási késleltetés (ms, két tizedesre)?
= 4.17
= 4,17
! Egy fordulat 60 000 / 7200 = 8,33 ms, ennek a fele.

? Egy véletlen olvasás 12,5 ms-ig tart. Hány IOPS-ra képes a lemez?
= 80
! 1000 ms / 12,5 ms = 80.

? Miért gyorsult fel olyan látványosan az operációs rendszer indítása az SSD-k megjelenésével?
- mert az SSD soros sebessége ezerszer nagyobb
+ mert a véletlen elérés (sok kis, szétszórt fájl) százszor–ezerszer gyorsabb
- mert az SSD-n nincs fájlrendszer
! A merevlemez a fej mozgatásával és a forgással tölti az idő nagy részét.

? A lecke példáján melyik algoritmus adta a legkisebb összes fejelmozdulást?
+ SSTF
- SCAN
- C-SCAN
- FCFS
! 236 cilinder – de a távoli kérések kiéhezhetnek.

? Miért használnak C-SCAN-t, ha több fejmozgással jár, mint a SCAN?
- mert egyszerűbb a hardvere
+ mert egyenletesebb a kérések várakozási ideje
- mert SSD-n gyorsabb
! Minden kérést ugyanabban az irányban, körjáratszerűen szolgál ki.

? Melyik parancs kényszeríti ki Linuxon, hogy a gyorsítótárban lévő „piszkos” adatok kiíródjanak a lemezre?
= sync
! A programokban ugyanerre az fsync() hívás való.
```
