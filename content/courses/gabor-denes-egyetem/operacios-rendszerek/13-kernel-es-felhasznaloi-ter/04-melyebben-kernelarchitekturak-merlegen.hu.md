---
title: Mélyebben – kernelarchitektúrák mérlegen
summary: Egy apró CPU-szimulátor módbittel és privilegizált utasításokkal, a monolitikus és a mikrokernel ára számokkal (módváltások, üzenetek), megbízhatóság és a megbízható kódbázis mérete, a megszakítások felső és alsó fele, és miért nem bírná egy 10 Gbit/s-os hálókártya a csomagonkénti megszakítást.
minutes: 40
---

## Amit ebben a leckében megtanulsz

- egy **apró CPU-szimulátoron** megnézni, hogyan véd a módbit és a privilegizált utasítás,
- **számokkal** összevetni a monolitikus kernel és a mikrokernel költségét,
- kiszámolni, hogyan függ a rendszer **megbízhatósága** a kernel méretétől és az illesztőprogramoktól,
- megérteni a megszakításkezelés **felső és alsó felét**,
- kiszámolni, miért kell egy gyors hálókártyánál **megszakítás-összevonás**.

## 1. A módbit egy apró CPU-szimulátorban

Építsünk egy játék-CPU-t, amely utasításokat hajt végre. Van egy **módbitje** (kernel/felhasználó), és bizonyos utasítások **privilegizáltak**. Ha egy felhasználói program ilyet próbál, a CPU **kivételt** vált ki, és a vezérlés a kernelhez kerül – pontosan úgy, ahogy az alapleckében tanultad.

```python run
# Játék-CPU módbittel: a privilegizált utasítás felhasználói módban kivételt vált ki
PRIVILEGIZALT = {"CLI", "TIMER", "HALT", "OUT"}      # megszakítás tiltás, időzítő, leállás, I/O

class CPU:
    def __init__(self):
        self.mod = "kernel"                           # induláskor kernel mód
        self.naplo = []

    def vegrehajt(self, program, ki):
        for utasitas in program:
            if utasitas in PRIVILEGIZALT and self.mod == "felhasználó":
                self.kivetel(ki, utasitas)
                return
            if utasitas == "SYSCALL":
                self.naplo.append(f"{ki}: SYSCALL → kernel mód, a kernel ellenőrzötten elvégzi")
                self.mod = "kernel"
                self.naplo.append("kernel: kiírás a képernyőre (OUT), majd vissza felhasználói módba")
                self.mod = "felhasználó"
            else:
                self.naplo.append(f"{ki}: {utasitas} ({self.mod} mód)")

    def kivetel(self, ki, utasitas):
        self.mod = "kernel"
        self.naplo.append(f"!!! KIVÉTEL: {ki} privilegizált utasítást ({utasitas}) próbált "
                          f"→ kernel mód, a kernel leállítja a programot")

cpu = CPU()
cpu.vegrehajt(["TIMER"], "kernel")                     # a kernel beállítja az időzítőt
cpu.mod = "felhasználó"                                # átadja a vezérlést egy programnak
cpu.vegrehajt(["ADD", "SYSCALL", "ADD"], "jo_program")
cpu.mod = "felhasználó"
cpu.vegrehajt(["ADD", "CLI", "ADD"], "rossz_program")  # tiltani akarja a megszakításokat
print("\n".join(cpu.naplo))
```

Figyeld meg: a rossz program második `ADD`-je már **nem** fut le. Ha engedné a CPU a `CLI`-t (megszakítások tiltása), a program kikapcsolhatná az időzítőt, és sosem adná vissza a vezérlést – visszajutnánk a kooperatív multitasking „lefagyásaihoz”.

## 2. Mennyibe kerül a mikrokernel? – számoljunk!

Olvassunk be egy fájlrészletet. **Monolitikus** kernelben ez egy rendszerhívás: 2 módváltás (be és ki), a fájlrendszer és a lemez-driver közönséges függvényhívással éri el egymást. **Mikrokernelben** az alkalmazás üzenetet küld a fájlrendszer-szervernek, az a lemez-driver szervernek, és a válaszok visszafelé is üzenetek – minden üzenet egy út a kernelen át.

```python run
# Egy fájlolvasás költsége monolitikus és mikrokernel esetén (egyszerűsített modell)
MODVALTAS_US = 0.1      # egy be- vagy kilépés a kernelbe (µs)
FUGGVENYHIVAS_US = 0.005
KONTEXTUS_US = 0.5      # váltás egy másik folyamatra (szerverre), cache-hatással együtt
MUNKA_US = 2.0          # a tényleges fájlrendszer- és driver-munka

# Monolitikus: 1 rendszerhívás (2 módváltás) + 2 függvényhívás + munka
mono = 2 * MODVALTAS_US + 2 * FUGGVENYHIVAS_US + MUNKA_US

# Mikrokernel: app → FS → driver → FS → app = 4 üzenet,
# mindegyik: 2 módváltás + 1 kontextusváltás a címzett szerverre
uzenetek = 4
mikro = uzenetek * (2 * MODVALTAS_US + KONTEXTUS_US) + MUNKA_US

print(f"monolitikus: {mono:.2f} µs / olvasás")
print(f"mikrokernel: {mikro:.2f} µs / olvasás ({mikro / mono:.1f}×)")
for olvasas in [1_000, 1_000_000]:
    print(f"{olvasas:>9} olvasás: monolitikus {olvasas * mono / 1000:8.1f} ms, "
          f"mikrokernel {olvasas * mikro / 1000:8.1f} ms")
```

Ebben a modellben a mikrokernel kb. **2,2-szer** lassabb egy apró olvasásnál. A valóság árnyaltabb: az L4 család kutatói megmutatták, hogy ügyes tervezéssel az üzenetküldés néhány száz nanoszekundumra szorítható, és ha a tényleges munka nagy (pl. nagy blokkok olvasása), a rezsi aránya elenyésző. Ezért mondjuk, hogy a mikrokernel **lassabb lehet**, nem pedig, hogy szükségszerűen lassú.

## 3. Megbízhatóság: a megbízható kódbázis mérete

A **megbízható kódbázis** (_TCB_, _trusted computing base_) az a kód, amelynek egyetlen hibája is az **egész rendszer** biztonságát vagy működését veszélyezteti. Monolitikus kernelben ez a **teljes** kernel – az összes illesztőprogrammal együtt. A kutatások szerint a kernelhibák jelentős része éppen az **illesztőprogramokban** van: ezeket sokan írják, sokféle hardverhez, és kevesebben tesztelik őket.

Becsüljünk! Tegyük fel, hogy 1000 sor kódra átlagosan **0,5 rejtett hiba** jut (gondosan tesztelt kódnál ez reális nagyságrend):

```python run
# Rejtett hibák becslése a kernel módban futó kód mérete alapján
HIBA_PER_EZER_SOR = 0.5

rendszerek = [
    ("seL4 mikrokernel",                10_000),         # formálisan bizonyított
    ("MINIX 3 kernel",                  15_000),
    ("Linux: csak a mag (driverek nélkül)", 3_000_000),
    ("Linux: teljes (minden driverrel)", 40_000_000),
]
for nev, sorok in rendszerek:
    print(f"{nev:<38} {sorok:>12,} sor → ~{sorok / 1000 * HIBA_PER_EZER_SOR:>9,.0f} rejtett hiba"
          .replace(",", " "))

# 20 betöltött driver, mindegyik 1% eséllyel omlik össze egy hónapban
p_ok = 0.99 ** 20
print(f"\nmonolitikus: {p_ok:.1%} eséllyel nincs kernelösszeomlás egy hónapban")
print("mikrokernel: a driver összeomlik, de újraindul – a rendszer fut tovább")
```

(A Linux ennél jobb, mint amilyennek a nyers szám tűnik: egy gépen csak a hardverhez szükséges néhány száz modul töltődik be, nem mind a 40 millió sor.)

A **seL4** különlegessége, hogy kb. 10 000 sorának helyességét **matematikailag bizonyították**: a kód pontosan azt teszi, amit a specifikáció előír, nincs benne puffertúlcsordulás vagy nullmutató-hiba. 40 millió sorra ez ma elképzelhetetlen. A **MINIX 3** pedig egy „újjáélesztő szerverrel” (_reincarnation server_) figyeli a drivereket, és egy összeomlott drivert pár ezredmásodperc alatt újraindít.

**Hasonlat:** a monolitikus kernel egy nagy nyitott iroda: gyors a kommunikáció (csak odaszólsz), de ha valaki tüzet okoz, az egész emelet leég. A mikrokernel külön irodák tűzálló falakkal: üzenetet kell küldeni (lassabb), de egy tűz csak egy szobát érint.

## 4. Megszakítások: felső és alsó fél

Amikor egy eszköz megszakítást kér, a kernel azonnal félbeszakítja, amit csinált. A megszakításkezelő alatt gyakran **más megszakítások tiltva vannak** – ezért nagyon rövidnek kell lennie. A kernel ezért két részre bontja a munkát:

| Rész                         | Mikor fut?                         | Mit csinál?                                                        |
| ---------------------------- | ---------------------------------- | ------------------------------------------------------------------ |
| **felső fél** (_top half_)   | azonnal, a megszakításkor          | nyugtázza az eszközt, elmenti az adatot, beütemezi a többit – µs   |
| **alsó fél** (_bottom half_) | kicsit később, megszakítható módon | a tényleges feldolgozás (pl. a hálózati csomag a TCP/IP vermen át) |

Linuxon az alsó fél neve **softirq**, **tasklet** vagy **workqueue**; Windowson **DPC** (_Deferred Procedure Call_).

**Hasonlat:** a recepciós (felső fél) felveszi a telefont, felírja, ki keresett és miért, majd leteszi – nem intézi el ott helyben az ügyet, mert addig a többi hívás vár. Az ügyintézést (alsó fél) később a háttérben végzik.

```bash
cat /proc/interrupts | head -15   # megszakítások száma magonként és eszközönként
cat /proc/softirqs                # az alsó felek: NET_RX, TIMER, BLOCK …
watch -n1 'grep -E "NET_RX|TIMER" /proc/softirqs'   # élőben (kilépés: Ctrl+C)
```

## 5. Miért nem bírná a hálókártya a csomagonkénti megszakítást?

Egy **10 Gbit/s**-os hálókártya teljes terhelésnél másodpercenként sok százezer csomagot fogad. Ha minden csomag külön megszakítást váltana ki:

```python run
# Csomagonkénti megszakítás egy 10 Gbit/s-os kártyán
SAVSZEL = 10e9                 # bit/s
KERET = 1538                   # bájt a vezetéken (1500 MTU + fejlécek + szünet)
MEGSZAKITAS_US = 2.0           # egy megszakítás kezelésének költsége (µs)

csomag_mp = SAVSZEL / 8 / KERET
print(f"csomag másodpercenként: {csomag_mp:,.0f}".replace(",", " "))
print(f"csomagonkénti megszakítással: {csomag_mp * MEGSZAKITAS_US / 1e6:.2f} mp CPU-idő "
      f"kellene MÁSODPERCENKÉNT → lehetetlen")

for osszevonas in [16, 64, 256]:
    megsz = csomag_mp / osszevonas
    cpu = megsz * MEGSZAKITAS_US / 1e6
    print(f"{osszevonas:>4} csomag / megszakítás: {megsz:>9,.0f} megszakítás/mp – "
          f"{cpu:.1%} CPU".replace(",", " "))
```

Csomagonkénti megszakítással **1,6 másodperc** CPU-idő kellene másodpercenként – a gép a megszakítások kezelésébe fulladna (_interrupt storm_, „élő holtpont”). A megoldások:

- **megszakítás-összevonás** (_interrupt coalescing_): a kártya csak minden N. csomag után vagy egy rövid idő elteltével jelez;
- **NAPI** (Linux): nagy forgalomnál a kernel kikapcsolja a megszakításokat, és **lekérdezéssel** (_polling_) húzza be a csomagokat; ha a forgalom csökken, visszakapcsolja őket;
- **több fogadósor** (RSS): a kártya a csomagokat szétosztja a magok között.

Ez szép példája annak, hogy az I/O témakörben tanult **megszakítás kontra lekérdezés** döntés nem fekete-fehér: kis terhelésnél a megszakítás, nagy terhelésnél a lekérdezés a hatékonyabb.

## Összefoglalás

- A **módbit** és a **privilegizált utasítások** miatt egy felhasználói program nem tilthatja le a megszakításokat, nem állíthatja át az időzítőt – próbálkozásra a CPU kivételt vált ki.
- A mikrokernelben egy kérés több **üzenetet** (és módváltást, kontextusváltást) igényel, ezért **lassabb lehet**, de egy driverhiba nem rántja le a rendszert.
- A **megbízható kódbázis** minél kisebb, annál kevesebb benne a rejtett hiba; az seL4 10 000 sora matematikailag bizonyított.
- A megszakításkezelés **felső fele** gyors és rövid, a feldolgozás az **alsó félben** (softirq, DPC) történik.
- Nagy forgalomnál a csomagonkénti megszakítás megfojtaná a CPU-t: **összevonás**, **NAPI** (lekérdezés) és több sor segít.

## A lecke feladata

```quiz required
? Egy rendszerhívás 2 módváltással jár. Hány módváltás kell egy mikrokernelben, ha egy kérés 4 üzenetből áll, és minden üzenet 2 módváltást igényel?
= 8
! 4 · 2 = 8 – a monolitikus kernel 2-jéhez képest négyszer annyi.

? Mi történik, ha egy felhasználói módban futó program a megszakítások letiltására szolgáló privilegizált utasítást próbálja végrehajtani?
- a CPU végrehajtja, de csak az adott programra
+ a CPU kivételt vált ki, a vezérlés a kernelhez kerül, amely általában leállítja a programot
- a CPU figyelmen kívül hagyja, és a program fut tovább
! Ezért nem lehet egy programnak „ellopnia” a CPU-t.

? 20 illesztőprogram fut kernel módban, mindegyik egymástól függetlenül 1% eséllyel omlik össze egy hónapban. Hány százalék eséllyel nem lesz egy hónap alatt egyetlen driverösszeomlás sem? (egész számra kerekítve)
= 82
= 82%
! 0,99²⁰ ≈ 0,818.

? Mi a feladata a megszakításkezelő felső felének (top half)?
+ gyorsan nyugtázni az eszközt, elmenteni az adatot, és beütemezni a további feldolgozást
- a teljes feldolgozás elvégzése, akármilyen hosszú is
- a felhasználói programok ütemezése
! A feldolgozás az alsó félben (softirq, DPC) történik.

? Miért használ a Linux nagy hálózati forgalomnál lekérdezést (NAPI) megszakítások helyett?
- mert a lekérdezés kevesebb áramot fogyaszt kis forgalomnál
+ mert csomagonkénti megszakításnál a CPU a megszakítások kezelésébe fulladna
- mert a hálókártyák nem tudnak megszakítást kérni
! 10 Gbit/s-nál ~800 000 csomag/mp.

? Melyik kernel helyességét bizonyították matematikailag?
- Linux
- Windows NT
+ seL4
- XNU
! Kb. 10 000 sor – formális verifikáció.
```
