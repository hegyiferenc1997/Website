---
title: Mélyebben – számlálók, LFSR és memóriák számokkal
summary: Az aszinkron számláló hamis átmeneti állapotai nanoszekundumról nanoszekundumra, a gyűrűs és a Johnson-számláló szimulálva, álvéletlen számok léptetőregiszterből (LFSR), valamint címvezetékek, kapacitás és a DRAM frissítése számokkal.
minutes: 40
---

## Amit ebben a leckében megtanulsz

- **időben** látni, milyen hamis állapotokon megy át egy aszinkron számláló, és miért veszélyes ez egy dekóder után,
- szimulátorral összevetni a **gyűrűs** és a **Johnson-számláló** állapotait,
- hogyan lesz egy léptetőregiszterből és egy XOR kapuból **álvéletlen** bitsorozat (LFSR), és hol használják,
- **kiszámolni** egy memória címvezetékeinek számát és a DRAM frissítési ütemét.

## 1. Az aszinkron számláló hamis állapotai

Az aszinkron (ripple) számlálóban minden flip-flopot az előző **kimenete** billent, így a késleltetések összeadódnak. Nézzük meg, mi történik a 7 → 8 (0111 → 1000) váltáskor, ha egy flip-flop 10 ns alatt billen:

```python run
# Aszinkron (ripple) számláló: 0111 → 1000 váltáskor a flip-flopok egymás után billennek
T_FF = 10                                            # ns, egy flip-flop késleltetése

def ripple_atmenet(regi, bitek=4):
    allapot, t = regi, 0
    print(f"  t = {t:>2} ns: {allapot:0{bitek}b}  (az órajel-él megérkezik)")
    for i in range(bitek):                           # Q0 billen, az ő lefutó éle billenti Q1-et...
        t += T_FF
        regi_bit = (allapot >> i) & 1
        allapot ^= 1 << i
        print(f"  t = {t:>2} ns: {allapot:0{bitek}b}")
        if regi_bit == 0:                            # 0 → 1 váltás: nincs lefutó él, a lánc megáll
            break

print("Ripple számláló, 7 → 8:")
ripple_atmenet(0b0111)
print(f"\nSzinkron számlálóban minden bit egyszerre vált: {T_FF} ns után 0111 → 1000, átmenet nélkül.")
```

A számláló 40 ns alatt **három hamis állapoton** (6, 4, 0) megy át, mire 8-ba ér! Ha a kimenetére egy dekóder van kötve (pl. „ha az érték 0, kapcsold be a riasztót”), a dekóder egy rövid tüskét ad a 0 állapotban – pedig a számláló „valójában” sosem volt 0-ban. Ez a ripple számláló két fő gyengéje:

- **lassú**: n bitnél a legrosszabb késleltetés n · t<sub>FF</sub>, ezért a maximális órajel is csökken;
- **hamis átmenetek**: a kimenetét csak akkor szabad felhasználni, ha már beállt.

A szinkron számlálóban minden flip-flop ugyanarra az órajel-élre billen, ezért **egyszerre** vált – hamis átmenet nélkül. Ezért a mai tervekben szinte mindig szinkron számlálót használnak, a ripple csak egyszerű frekvenciaosztóként marad meg.

## 2. Gyűrűs és Johnson-számláló szimulálva

```python run
# Gyűrűs és Johnson-számláló 4 flip-floppal
def gyurus(lepes, n=4):
    q = [1] + [0] * (n - 1)                          # egyetlen 1-es kering
    for _ in range(lepes):
        print("".join(map(str, q)), end=" ")
        q = [q[-1]] + q[:-1]                         # az utolsó visszamegy az elejére
    print()

def johnson(lepes, n=4):
    q = [0] * n
    for _ in range(lepes):
        print("".join(map(str, q)), end=" ")
        q = [1 - q[-1]] + q[:-1]                     # az utolsó NEGÁLTJA megy vissza
    print()

print("gyűrűs (4 állapot): ", end=""); gyurus(8)
print("Johnson (8 állapot):", end=" "); johnson(10)
```

Mindkettő egy körbekötött léptetőregiszter, a különbség egyetlen inverter:

| Számláló | Visszacsatolás     | Állapotok száma n flip-floppal | Előnye                                                          |
| -------- | ------------------ | ------------------------------ | --------------------------------------------------------------- |
| gyűrűs   | Q<sub>n</sub> → D₁ | **n**                          | dekóder nélkül is minden állapotnak saját kimenete van          |
| Johnson  | Q̅<sub>n</sub> → D₁ | **2n**                         | kétszer annyi állapot; lépésenként csak **egy** bit vált (Gray) |

A Johnson-számláló lépésenként egyetlen bitet változtat (mint a Gray-kód), ezért a dekódolása **hazárdmentes** – nincs hamis tüske, szemben a ripple számlálóval.

## 3. Álvéletlen számok léptetőregiszterből: az LFSR

Ha egy léptetőregiszter visszacsatolásába néhány kimenet **XOR**-ját kötjük, **lineárisan visszacsatolt léptetőregisztert** (_LFSR – linear feedback shift register_) kapunk. Jól megválasztott visszacsatolással a 4 bites LFSR mind a 2<sup>4</sup> − 1 = 15 nem nulla állapotot bejárja, mielőtt ismétlődne:

```python run
# LFSR: 4 bites léptetőregiszter XOR-visszacsatolással → álvéletlen bitsorozat
def lfsr4(kezdo=0b1001, lepes=18):
    allapot = kezdo
    latott = []
    for _ in range(lepes):
        latott.append(allapot)
        uj_bit = ((allapot >> 3) ^ (allapot >> 2)) & 1   # x^4 + x^3 + 1 visszacsatolás
        allapot = ((allapot << 1) | uj_bit) & 0b1111      # léptetés balra, új bit be
    return latott

sor = lfsr4()
print(" ".join(f"{s:04b}" for s in sor))
periodus = sor[1:].index(sor[0]) + 1
print(f"periódus: {periodus} lépés (a 16 állapotból csak a 0000 hiányzik)")
print("kimeneti bitsorozat:", "".join(str(s >> 3) for s in sor[:15]))
```

A kimeneti bitsorozat „véletlennek” látszik (kb. ugyanannyi 0 és 1, változatos sorozatok), pedig teljesen meghatározott – ezért **álvéletlen**. A 0000 állapotot el kell kerülni: abból az XOR mindig 0-t adna, és a regiszter „beragadna”.

Hol találkozol vele?

- **CRC-számítás**: a 2. témakör CRC-je pontosan egy LFSR-rel készül hardverben (a visszacsatolás a generátorpolinom),
- **adatkeverés** (_scrambling_): az USB, a PCIe és a SATA így keveri a bitfolyamot, hogy ne legyenek hosszú 0- vagy 1-sorozatok,
- **beépített önteszt**: a chip egy LFSR-rel generál tesztmintákat saját magának,
- egyszerű **játék-véletlenszám**: régi játékgépekben is így „dobták a kockát”. (Titkosításra viszont **nem** alkalmas: néhány kimeneti bitből visszafejthető.)

Egy n bites LFSR periódusa legfeljebb 2<sup>n</sup> − 1: 32 biten ez több mint 4 milliárd lépés – mindössze 32 flip-floppal és pár XOR kapuval.

## 4. Memóriák számokkal

Egy memória **2<sup>k</sup>** szót tud megcímezni **k** címvezetékkel. Fordítva: N szóhoz ⌈log₂ N⌉ címvezeték kell. A kapacitás = szavak száma × szószélesség.

```python run
# Memóriák: címvezetékek, kapacitás és a DRAM frissítése
import math

def meret(bajt):
    # olvasható mértékegység (bináris előtagokkal)
    for egyseg in ["B", "KiB", "MiB", "GiB"]:
        if bajt < 1024:
            return f"{bajt:.0f} {egyseg}"
        bajt /= 1024
    return f"{bajt:.0f} TiB"

for nev, szavak, szelesseg in [("EEPROM 24C02", 256, 8),
                               ("SRAM 62256", 32 * 1024, 8),
                               ("mikrokontroller flash", 1024 * 1024, 8),
                               ("16 bites szavak, 1 Mi szó", 1024 * 1024, 16),
                               ("32 bites cím, bájtos", 2 ** 32, 8)]:
    cim = math.ceil(math.log2(szavak))
    print(f"{nev:<26} {szavak:>11} szó × {szelesseg:>2} bit → {cim:>2} címvezeték, {meret(szavak * szelesseg / 8)}")

# DRAM: minden sort 64 ms-onként frissíteni kell
SOROK = 8192
IDO_MS = 64
print(f"\nDRAM: {SOROK} sor / {IDO_MS} ms → {IDO_MS * 1000 / SOROK:.2f} µs-onként egy sorfrissítés")
```

Két gyakorlati tanulság:

- **Minden plusz címvezeték megduplázza** a megcímezhető területet. A 32 bites processzorok ezért „csak” 4 GiB memóriát láttak közvetlenül – ez volt a 64 bitre váltás egyik fő oka.
- A **DRAM** cellái kis kondenzátorok, amelyek lassan kisülnek, ezért minden sort rendszeresen (jellemzően 64 ms-onként) újra kell írni. 8192 sornál ez **kb. 7,8 µs-onként** egy frissítési művelet, folyamatosan, a háttérben – ezt a memóriavezérlő végzi. Az SRAM-nak (flip-flopokból áll) erre nincs szüksége, ezért gyorsabb, de cellánként 6 tranzisztor, szemben a DRAM 1 tranzisztor + 1 kondenzátorával: drágább és kisebb kapacitású. Ezért SRAM a processzor gyorsítótára, és DRAM a fő memória.

## Összefoglalás

- Az aszinkron számláló átmenetkor **hamis állapotokon** megy át (pl. 7 → 6 → 4 → 0 → 8), és lassú; a szinkron számláló egyszerre vált.
- Gyűrűs számláló: n flip-flop → n állapot; Johnson: → **2n** állapot, lépésenként egy bitváltással.
- LFSR: léptetőregiszter + XOR visszacsatolás → álvéletlen sorozat, periódusa legfeljebb **2<sup>n</sup> − 1**; CRC, adatkeverés, önteszt.
- k címvezeték → 2<sup>k</sup> szó; a DRAM-ot folyamatosan frissíteni kell, az SRAM-ot nem.

## A lecke feladata

```quiz required
? Egy 4 bites aszinkron számláló 0111-ből 1000-ba lép. Melyik hamis állapoton megy át közben?
- 1111
+ 0000
- 1001
- egyiken sem, egyszerre vált
! A bitek egymás után billennek: 0111 → 0110 → 0100 → 0000 → 1000.

? Hány állapotú egy Johnson-számláló 5 flip-floppal?
= 10
! Johnson: 2n állapot.

? Legfeljebb mekkora egy 5 bites LFSR periódusa?
= 31
! 2^5 − 1 = 31 (a csupa nulla állapot kimarad).

? Hány címvezeték kell egy 64 KiB-os, bájtos szervezésű memóriához?
= 16
! 64 Ki = 65 536 = 2^16.

? Miért kell a DRAM-ot rendszeresen frissíteni, az SRAM-ot pedig nem?
- mert a DRAM flip-flopjai idővel elfelejtik az állapotukat
+ mert a DRAM cellája egy kondenzátor, amely lassan kisül
- mert az SRAM-ot a processzor folyamatosan olvassa
- mert a DRAM-ban nincs címdekóder
! Az SRAM flip-flopokból áll, amíg van tápfeszültség, megtartja az állapotát.
```
