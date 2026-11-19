---
title: Mélyebben – a memória nyomában
summary: Címfordítás többszintű laptáblával (a 48 bites cím darabjai), a tényleges memória-hozzáférési idő TLB-vel és laphibákkal kiszámolva, az óra (második esély) algoritmus és a Bélády-anomália szimulációja, a lusta foglalás és az OOM killer, valamint memóriamérés a virtuális gépen.
minutes: 45
---

## Amit ebben a leckében megtanulsz

- hogyan bontja szét a processzor egy **64 bites** gép virtuális címét a többszintű laptábla bejárásához,
- hogyan számold ki a **tényleges memória-hozzáférési időt** TLB-vel és laphibákkal – és miért elég ritkán egy laphiba is,
- hogyan működik az **óra** (második esély) lapcsere-algoritmus, amelyet a valódi rendszerek az LRU helyett használnak,
- hogyan jön elő a **Bélády-anomália** egy programban,
- mi a **lusta foglalás**, a túlvállalás és az **OOM killer**,
- hogyan mérd a memóriahasználatot a laborgépen.

## 1. Négy szint, egy cím – a laptábla bejárása

Az előző leckében láttad: 32 bites címnél és 4 KB-os lapnál a laptábla 2²⁰ bejegyzés lenne, ezért **többszintű** táblát használnak. A mai x86-64 processzorok a 64 bitből 48-at használnak címzésre, és így bontják fel:

```text
 47        39 38        30 29        21 20        12 11            0
[ 1. szint  ][ 2. szint  ][ 3. szint  ][ 4. szint  ][   eltolás    ]
    9 bit        9 bit        9 bit        9 bit        12 bit
```

Minden szint egy 512 bejegyzéses (2⁹) tábla, amely a következő szint tábláját mutatja; a legalsó adja meg a keretet, ehhez jön hozzá a 12 bites eltolás. Egy **TLB-hiánynál** tehát a processzornak **négy** memóriaolvasással kell „lesétálnia” a fán, mielőtt az adatot egyáltalán olvashatná.

**Hasonlat:** egy könyvtári raktárban a jelzet „3. emelet / 12. sor / 7. polc / 41. doboz / 9. lap”. Minden szint egy kisebb terület felé terel; a többszintű laptábla előnye, hogy üres emeletekhez nem kell polcrendszert építeni.

A program szétszedi egy cím darabjait – írd át a címet, és figyeld, melyik rész változik!

```python run
# Egy 48 bites virtuális cím darabjai az x86-64 négyszintű laptáblájához.
cim = 0x7F3A_9C2B_1D48

eltolas = cim & 0xFFF                      # az alsó 12 bit
indexek = [(cim >> (12 + 9 * i)) & 0x1FF for i in range(4)]   # 4 × 9 bit, alulról
indexek.reverse()                          # 1. szint (felső bitek) elöl

print(f"cím: {cim:#x} = {cim:048b}")
for szint, idx in enumerate(indexek, start=1):
    print(f"  {szint}. szintű tábla indexe: {idx:3}  ({idx:09b})")
print(f"  eltolás a lapon belül: {eltolas}  ({eltolas:012b})")
print(f"elérhető címtér: 2^48 bájt = {2**48 // 2**40} TB")
```

## 2. Mennyi idő egy memória-hozzáférés? – számoljunk!

### TLB-vel

Legyen a TLB elérése 1 ns, egy memóriaolvasás 100 ns, és (egyszerűség kedvéért) **egyszintű** laptábla. Találatnál: 1 + 100 ns. Hiánynál: 1 + 100 (laptábla) + 100 (adat) ns. Ha a találati arány *h*:

```text
EAT = h · (1 + 100) + (1 − h) · (1 + 100 + 100)
```

98%-os találati aránynál: 0,98 · 101 + 0,02 · 201 = 98,98 + 4,02 = **103 ns**. Vagyis a címfordítás csak **3%** lassulást okoz – a TLB nélkül 100%-ot (minden hozzáférés kettő lenne).

### Laphibákkal

Egy laphiba (lap betöltése lemezről) nagyságrendileg **8 ms = 8 000 000 ns**. Ha a hozzáférések *p* hányada laphiba:

```text
EAT = (1 − p) · 100 + p · 8 000 000   [ns]
```

```python run
# Laphiba-arány és a tényleges memória-hozzáférési idő (EAT).
memoria_ns = 100
laphiba_ns = 8_000_000                 # 8 ms: a lap beolvasása lemezről

for p in [0, 1 / 1_000_000, 1 / 100_000, 1 / 10_000, 1 / 1_000]:
    eat = (1 - p) * memoria_ns + p * laphiba_ns
    print(f"minden {round(1 / p) if p else '∞':>9}. hozzáférés laphiba → EAT = {eat:9.1f} ns "
          f"({eat / memoria_ns:6.1f}× lassabb)")

# Mekkora lehet p legfeljebb, ha 10%-nál nagyobb lassulást nem tűrünk?
max_p = (1.1 * memoria_ns - memoria_ns) / (laphiba_ns - memoria_ns)
print(f"\n10% lassulás határa: legfeljebb minden {1 / max_p:,.0f}. hozzáférés lehet laphiba")
```

Az eredmény megdöbbentő: ha **ezer** hozzáférésből egy laphiba, a gép **81-szer** lassabb! Ahhoz, hogy a lassulás 10% alatt maradjon, legfeljebb kb. **800 000** hozzáférésenként egy laphiba lehet. Ezért olyan drámai a **vergődés** (thrashing): ha túl kevés a memória, a laphibák aránya megnő, és a gép szinte megáll. Ezért segít egy SSD (~0,1 ms laphiba) is sokat – de memóriát pótolni az sem tud.

## 3. Az óra-algoritmus (második esély)

Az LRU jó, de drága: minden memória-hozzáférésnél frissíteni kellene, melyik lap mikor volt használva. A valódi rendszerek egy olcsó közelítést használnak. Minden laphoz tartozik egy **hivatkozási bit** (_referenced/accessed bit_), amelyet a **hardver** 1-re állít, amikor a lapot használják.

Az **óra-algoritmus** a kereteket egy körben képzeli el, egy „mutatóval”:

1. Ha cserélni kell, megnézi a mutatónál lévő lapot.
2. Ha a bitje **1** → kap egy **második esélyt**: a bitet 0-ra állítja, és továbblép.
3. Ha a bitje **0** → ezt cseréli ki.

**Hasonlat:** egy portás körbejár a szobákban. Akit ébren talál (bit = 1), annak szól: „legközelebb ellenőrzöm” (bit = 0), és megy tovább. Akit másodszorra is alva talál, azt kiteszi.

```python run
# FIFO, óra (második esély) és LRU összevetése ugyanazon a hivatkozási soron.
def fifo(sor, n):
    keretek, hiba = [], 0
    for lap in sor:
        if lap not in keretek:
            hiba += 1
            if len(keretek) == n:
                keretek.pop(0)
            keretek.append(lap)
    return hiba

def ora(sor, n):
    keretek, bit, mutato, hiba = [None] * n, [0] * n, 0, 0
    for lap in sor:
        if lap in keretek:
            bit[keretek.index(lap)] = 1          # a hardver jelzi: használták
            continue
        hiba += 1
        while bit[mutato] == 1:                  # második esély: bit törlése, tovább
            bit[mutato] = 0
            mutato = (mutato + 1) % n
        keretek[mutato], bit[mutato] = lap, 1    # csere; az új lap bitje 1
        mutato = (mutato + 1) % n
    return hiba

def lru(sor, n):
    keretek, hiba = [], 0
    for lap in sor:
        if lap in keretek:
            keretek.remove(lap)
        else:
            hiba += 1
            if len(keretek) == n:
                keretek.pop(0)
        keretek.append(lap)
    return hiba

sor = [1, 2, 3, 1, 4, 1, 5, 1, 2, 1, 3, 1, 4]   # az 1-es lap nagyon „népszerű”
for nev, f in [("FIFO", fifo), ("óra", ora), ("LRU", lru)]:
    print(f"{nev:5}: {f(sor, 3)} laphiba")
```

Ezen a soron, ahol az 1-es lapot újra és újra használják, a FIFO rendszeresen kidobja (10 laphiba), az óra többnyire megtartja, mert a hivatkozási bitje szinte mindig 1 (9 laphiba), az LRU pedig 8-cal a legjobb. Az óra **majdnem olyan jó**, mint az LRU, de csak egy bitbe kerül laponként.

## 4. A Bélády-anomália élőben

Józan ésszel: **több keret → kevesebb laphiba**. A FIFO-nál ez **nem mindig igaz**!

```python run
# Bélády-anomália: FIFO-nál több keret mellett is lehet TÖBB laphiba.
def fifo(sor, n):
    keretek, hiba = [], 0
    for lap in sor:
        if lap not in keretek:
            hiba += 1
            if len(keretek) == n:
                keretek.pop(0)
            keretek.append(lap)
    return hiba

sor = [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5]
for n in range(1, 6):
    print(f"{n} keret: {fifo(sor, n):2} laphiba")
```

3 kerettel **9**, 4 kerettel **10** laphiba! Az LRU-nál és az optimális algoritmusnál ilyen nem fordulhat elő (ezek úgynevezett **verem-algoritmusok**: n kerettel a memóriában lévő lapok mindig részhalmazai az n + 1 kerettel bent lévőknek).

## 5. Lusta foglalás, túlvállalás és az OOM killer

Ha egy program 1 GB memóriát kér (`malloc`), a Linux azonnal **igent mond** – de valójában **nem foglal le** semmit. Csak a virtuális címtérben jelöl ki helyet; fizikai keretet akkor kap egy lap, amikor a program **először ír** rá (egy laphiba ilyenkor új, nullázott keretet ad). Ez a **lusta foglalás** (_demand paging_ / _lazy allocation_). Ezért láttad a folyamatok témakörben, hogy a `VmSize` sokkal nagyobb lehet a `VmRSS`-nél.

Ebből következik a **túlvállalás** (_overcommit_): a kernel összesen több memóriát „ígérhet”, mint amennyi van, abban bízva, hogy nem mindenki használja ki. Ha mégis elfogy a memória és a cserehely is, a kernel utolsó eszköze az **OOM killer** (_Out Of Memory_): kiválaszt egy folyamatot (jellemzően a legtöbb memóriát használót), és leállítja, hogy a rendszer túléljen. Ennek nyomát a naplóban látod: `journalctl -k | grep -i "out of memory"`.

**Hasonlat:** a légitársaságok is több jegyet adnak el, mint ahány ülés van (túlfoglalás), mert néhány utas nem jön el. Ha mégis mindenki megjelenik, valakit le kell szállítani a gépről.

## 6. Mérés a laborgépen

```bash
getconf PAGESIZE                      # a lapméret bájtban (általában 4096)
free -h                               # összes, használt, szabad, gyorsítótár (buff/cache), csere (Swap)
swapon --show                         # a cserehely (swap) fájl vagy partíció
grep -E 'MemTotal|MemAvailable|Cached|SwapTotal' /proc/meminfo
vmstat 1 5                            # 5 másodpercig: si/so oszlop = be- és kilapozás a cserehelyre
```

Figyeld meg a **lusta foglalást**! Nyiss két terminált. Az elsőben:

```bash
python3 -c "x = bytearray(0); input('Enter = 500 MB foglalása '); x = bytearray(500 * 1024 * 1024); input('Enter = kilépés ')"
```

A másodikban kövesd a memóriát (`watch -n 1 free -m`), és nyomj Entert az elsőben: a `used` érték kb. 500 MB-tal nő (a `bytearray` nullákkal tölti ki, vagyis ír a lapokra). Kilépés után visszaesik.

A `free` kimenetében a **buff/cache** oszlop a lapgyorsítótár: az OS a szabad memóriát a lemezről olvasott fájlok gyorsítótárazására használja, de azonnal visszaadja, ha egy programnak kell. Ezért nem baj, ha Linuxon „kevés a szabad memória” – az **available** (elérhető) oszlop számít.

Windowson: **Erőforrás-figyelő** (`resmon`) → **Memória** lap. A *Kemény laphibák/mp* oszlop mutatja, melyik program okoz lemezről betöltést igénylő laphibát; az alsó sáv pedig a *Hardvernek fenntartott / Használatban / Módosított / Készenléti / Szabad* részeket.

## Összefoglalás

- x86-64-en a 48 bites cím 4 × 9 bit laptábla-indexre és 12 bit eltolásra bomlik; TLB-hiánynál négy memóriaolvasás kell a fordításhoz.
- **EAT** TLB-vel: 98%-os találatnál 103 ns (3% lassulás). Laphibával: ezerből egy laphiba is ~81-szeres lassulás – a laphibáknak rendkívül ritkának kell lenniük.
- Az **óra-algoritmus** egy hivatkozási bittel közelíti az LRU-t; a FIFO-nál előfordulhat a **Bélády-anomália** (3 keret: 9, 4 keret: 10 laphiba).
- A Linux **lustán foglal** és **túlvállal**; ha minden elfogy, az **OOM killer** leállít egy folyamatot.
- `free`, `vmstat`, `/proc/meminfo`, Windowson az Erőforrás-figyelő mutatja a memória állapotát; Linuxon az **available** oszlop a mérvadó.

## A lecke feladata

```quiz required
? x86-64-en egy 48 bites virtuális címből hány bit az eltolás a 4 KB-os lapon belül?
= 12
! 2^12 = 4096 bájt.

? TLB-elérés 1 ns, memóriaolvasás 100 ns, egyszintű laptábla, 98% TLB-találat. Mennyi a tényleges memória-hozzáférési idő (ns)?
= 103
! 0,98 · 101 + 0,02 · 201 = 103.

? Egy laphiba 8 ms, egy memóriaolvasás 100 ns. Kb. hányszor lassabb a gép, ha ezer hozzáférésből egy laphiba?
- kb. 2-szer
- kb. 10-szer
+ kb. 80-szor
- kb. 1000-szer
! 0,999 · 100 + 0,001 · 8 000 000 ≈ 8100 ns.

? Mit csinál az óra-algoritmus, ha a mutatónál lévő lap hivatkozási bitje 1?
- azonnal kicseréli a lapot
+ a bitet 0-ra állítja, és a következő lapra lép (második esély)
- a lapot a lemezre írja, de bent hagyja
! Csak a 0 bitű lapot cseréli.

? FIFO lapcsere az 1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5 soron: 3 kerettel 9 laphiba van. Hány laphiba lesz 4 kerettel?
= 10
! Ez a Bélády-anomália.

? Linuxon a free kimenetének melyik oszlopa mutatja, mennyi memóriát kaphat még meg egy új program?
- free
+ available
- buff/cache
! A gyorsítótárat az OS szükség esetén azonnal felszabadítja.
```
