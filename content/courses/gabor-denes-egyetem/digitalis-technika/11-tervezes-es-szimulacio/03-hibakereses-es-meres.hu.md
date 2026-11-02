---
title: Hibakeresés és mérés
summary: A rendszeres hibakeresés lépései, tipikus hibák; logikai szonda és impulzusadó, logikai analizátor (triggerelés, protokoll-dekódolás), oszcilloszkóp; bitsebesség, jelfrekvencia, mintavételi sebesség, memóriahossz, bitmélység és a szemábra.
minutes: 40
---

## Amit ebben a leckében megtanulsz

- hogyan keress hibát **módszeresen** egy digitális áramkörben,
- melyek a **tipikus hibák**,
- mire való a **logikai szonda**, az **impulzusadó**, a **logikai analizátor** és az **oszcilloszkóp**,
- hogyan függ össze a **bitsebesség**, a **jelfrekvencia**, a **mintavételi sebesség** és a **memóriahossz**,
- mit mutat a **szemábra** (eye diagram).

## Módszeres hibakeresés

Ha a szimulációban működő terv a valóságban nem működik, ne találgass – haladj sorban:

1. **Táp:** megvan-e a tápfeszültség minden IC-n (multiméterrel), jó-e a föld?
2. **Órajel:** jár-e, jó-e a frekvenciája és a jelszintje?
3. **Reset:** elengedődik-e, a megfelelő szinten van-e?
4. **Bemenetek:** azok érkeznek-e, amiket vársz? (Lebegő bemenet? Rossz lábkiosztás?)
5. **Felezés:** a jelúton haladva, mindig a hibás rész közepén mérve gyorsan behatárolod a hibás fokozatot.

**Tipikus hibák:**

- **beragadt (stuck-at) jel:** egy vezeték mindig 0 vagy mindig 1 (rövidzár a földre/tápra, hibás kimenet);
- **szakadás** vagy rossz forrasztás, hiányzó vezeték;
- **lebegő bemenet:** bekötetlen CMOS-bemenet, amely véletlenszerűen billeg (felhúzó/lehúzó ellenállás kell);
- **buszütközés:** két kimenet egyszerre hajt egy vezetéket (háromállapotú vezérlés hibája);
- **szintillesztési hiba:** 5 V-os jel 3,3 V-os bemeneten, rossz logikai szintek;
- **időzítési hiba:** setup/hold megsértése, pergő gomb, szinkronizálatlan jel, hazárd.

## Logikai szonda és impulzusadó

A **logikai szonda** (logic probe) toll formájú kézi műszer: egy pontra érintve **LED-ekkel** jelzi, hogy ott logikai **magas**, **alacsony**, **köztes** (érvénytelen, pl. lebegő) vagy **változó** (impulzusos) szint van. Gyors, olcsó, de egyszerre csak egy pontot lát, és nem rögzít.

A **logikai impulzusadó** (pulser) a párja: egy csomópontra rövid impulzusokat ad (akár áramkörön belül, a meghajtó kimenetet rövid időre felülbírálva), így megnézheted a szondával, hogy az impulzus végigmegy-e a láncon. (Pl. a GPG-2A típusú impulzusadó TTL és CMOS áramkörökhöz, 5–15 V tápról.)

## Logikai analizátor

A **logikai analizátor** egyszerre **sok digitális vonalat** (8, 16, 32 vagy több) figyel, **rögzíti** a változásokat, és **idődiagramon** mutatja meg őket.

- **Triggerelés:** megadhatsz egy mintázatot vagy eseményt, amelyre a rögzítés indul, pl. „amikor a D0–D3 vonalak értéke 1010”. Így a ritka hiba pillanatát is elkapod.
- **Időzítési hibák:** láthatóvá válnak a versenyhelyzetek, setup/hold hibák, rossz órajelezés.
- **Protokoll-dekódolás:** a rögzített biteket a szoftver **I²C**-, **SPI**-, **UART**-, **CAN**- vagy (egyszerűbb szinten) **USB**-üzenetekké alakítja – pl. kiírja, melyik címre milyen bájt ment.
- Típusai: önálló hardveres (pl. Tektronix), **USB-s** (PC-hez csatlakozik, pl. Saleae Logic), vagy **oszcilloszkópba építve** (MSO – vegyes jelű oszcilloszkóp).

| jellemző            | logikai szonda | logikai analizátor    |
| ------------------- | -------------- | --------------------- |
| bemenetek száma     | 1              | sok (8–100+)          |
| kijelzés            | LED (H/L)      | idődiagram, dekódolás |
| rögzítés            | nincs          | van                   |
| protokoll-dekódolás | nincs          | van (szoftverrel)     |

**FPGA-n belül** beépített logikai analizátort is használhatsz (Vivado ILA, Quartus SignalTap): a belső jeleket az FPGA saját memóriájába rögzíti, és JTAG-en át a PC-n jeleníti meg – így nem kell kivezetni őket a lábakra.

Az **oszcilloszkóp** ezzel szemben kevés csatornán, de a **valódi feszültségalakot** mutatja: jelszinteket, felfutási időt, túllövést, zajt, zavarokat – ezért analóg jellegű problémákhoz (szintek, jelintegritás) ez kell.

## Bitsebesség, jelfrekvencia, mintavétel

Nagy sebességű jelek mérésénél ezek a mennyiségek szorosan összefüggnek:

**Bitsebesség és bitidő:** a bitidő a bitsebesség reciproka.

- 500 Mb/s → 1 bit = **2 ns**; 1 Gb/s → 1 bit = **1 ns**; 9600 bit/s (UART) → 1 bit ≈ **104 μs**.

**Jelfrekvencia:** egy 1 Gb/s-os digitális jel nem 1 GHz-es szinusz. A leggyorsabb változás az 1010… mintázat, amelynek egy periódusa két bit, ezért a domináns frekvencia kb. **a bitsebesség fele**: 1 Gb/s → ≈ 500 MHz, 500 Mb/s → ≈ 250 MHz. (Az éles élek ennél jóval magasabb felharmonikusokat is tartalmaznak.)

**Mintavételi sebesség** (Sa/s – minta/másodperc): elméletben legalább a legmagasabb frekvencia **kétszerese** (mintavételi tétel, 8. témakör), a gyakorlatban **4–10-szerese**, hogy az élek és a jelalak jól látsszanak. Logikai analizátornál a szabály: bitenként legalább 4 minta.

**Memóriahossz** (rögzítési mélység): a műszer memóriájában tárolható minták száma. A rögzíthető idő:

**rögzítési idő = memóriahossz / mintavételi sebesség**

Pl. 10 MSa memória és 1 GSa/s mintavétel → **10 μs**. Ha hosszabb időt akarsz látni, vagy több csatornát használsz, több memória kell (vagy kisebb mintavételi sebesség).

**Bitmélység:** logikai analizátornál egy minta annyi bit, ahány csatorna van (8 csatorna = 8 bit/minta); oszcilloszkópnál az ADC felbontása (pl. 8, 12 bit; 12 bit = 4096 szint).

**Két példa:**

- **UART, 9600 bit/s**, 10 MSa/s mintavétel: bitenként ≈ 1040 minta – bőven elég; 10 M mintás memóriával **1 s** rögzíthető, ami sok bájtot jelent.
- **100 Mb/s-os Ethernet**, 100 MSa/s mintavétel: bitidő 10 ns, tehát **bitenként csak 1 minta** – az élek nem látszanak, a jelalak értelmezhetetlen. Legalább 400 MSa/s kellene.

## A szemábra (eye diagram)

A valódi jel mindig torzul. A **szemábrán** sok egymást követő bitet rajzolunk **egymásra**, egy bitidő szélességben; a kirajzolódó „szem” nyílása mutatja, mennyire stabil a jel:

- **szemmagasság** (függőleges nyílás): a logikai 1 és 0 szintek különbsége – kisebb szem zajra, interferenciára utal;
- **szemszélesség** (vízszintes nyílás): mennyi ideig érvényes a bit – szélesebb szem nagyobb időzítési tartalék;
- **jitter:** az átmenetek vízszintes szórása; túl nagy jitter esetén a 0 és az 1 összemosódik;
- **zajhatár:** mennyi zajt bír még el a jel hiba nélkül;
- **felfutási és lefutási idő:** az átmenetek meredeksége – a gyorsabb élek tisztább szemet adnak.

A jó szemábrához gyors mintavétel, elég analóg sávszélesség és nagy memória kell (hogy a ritka hibák is látszódjanak).

```python run
# Mérési alapszámítások: bitidő, jelfrekvencia, minta/bit, rögzítési idő
def meres(bitsebesseg, mintaveteli_seb, memoria):
    bitido = 1 / bitsebesseg
    return {
        "bitidő (ns)": round(bitido * 1e9, 1),
        "jelfrekvencia (MHz)": bitsebesseg / 2 / 1e6,
        "minta/bit": round(mintaveteli_seb * bitido, 1),
        "rögzítési idő (s)": memoria / mintaveteli_seb,
    }

print("UART 9600 bit/s, 10 MSa/s, 10 MSa:", meres(9600, 10e6, 10e6))
print("Ethernet 100 Mb/s, 100 MSa/s:     ", meres(100e6, 100e6, 10e6))
print("1 Gb/s, 1 GSa/s, 10 MSa:          ", meres(1e9, 1e9, 10e6))
```

## Összefoglalás

- Hibakeresés sorrendje: táp → órajel → reset → bemenetek → felezés; tipikus hibák: beragadt jel, szakadás, lebegő bemenet, buszütközés, szint- és időzítési hiba.
- Logikai szonda: egy pont, LED-ek; impulzusadó: impulzust ad; logikai analizátor: sok csatorna, rögzítés, trigger, protokoll-dekódolás; oszcilloszkóp: valódi feszültségalak.
- Bitidő = 1/bitsebesség; jelfrekvencia ≈ bitsebesség/2; mintavétel a gyakorlatban 4–10×; rögzítési idő = memóriahossz / mintavételi sebesség.
- Szemábra: szemmagasság, szemszélesség, jitter, zajhatár, élmeredekség.

## A lecke feladata

```quiz required
? Mekkora a bitidő ns-ban egy 500 Mb/s-os jelnél?
= 2

? Kb. hány MHz a domináns jelfrekvenciája egy 1 Gb/s-os digitális jelnek?
= 500
! A leggyorsabb 1010… mintázatban egy periódus két bit.

? Egy logikai analizátor memóriája 10 MSa, a mintavételi sebessége 1 GSa/s. Hány μs-ot tud rögzíteni?
= 10
! 10 000 000 minta / 1 000 000 000 minta/s.

? Egy 100 Mb/s-os jelet 100 MSa/s-mal mintavételezünk. Hány minta jut egy bitre?
= 1
! Ez kevés: az élek nem látszanak, legalább 4 minta/bit kellene.

? Egy I²C-buszon a szenzor nem válaszol. Melyik műszerrel látod a legkönnyebben, milyen címet küld a mikrokontroller?
- logikai szonda
+ logikai analizátor protokoll-dekódolással
- multiméter
- logikai impulzusadó

? Mit jelez a szemábrán a kicsi szemmagasság?
- Hogy a jel nagyon tiszta.
+ Hogy kicsi a különbség a logikai 1 és 0 szintje között, a jelet zaj vagy interferencia terheli.
- Hogy túl nagy a mintavételi sebesség.
- Hogy a bitsebesség túl kicsi.

? Egy CMOS-kapu bekötetlen bemenete véletlenszerűen billeg. Mi ez a hiba, és mi a megoldás?
- Buszütközés – háromállapotú meghajtó kell.
+ Lebegő bemenet – felhúzó vagy lehúzó ellenállással rögzíteni kell a szintjét.
- Metastabilitás – nagyobb órajel kell.
- Szakadás – a kaput ki kell cserélni.
```
