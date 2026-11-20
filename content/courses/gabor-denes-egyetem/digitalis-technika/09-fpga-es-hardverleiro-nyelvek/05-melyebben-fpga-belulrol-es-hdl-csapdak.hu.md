---
title: Mélyebben – az FPGA belülről és a HDL csapdái
summary: Egy 4 bemenetű LUT kipróbálva (a konfiguráció maga az igazságtábla), hány LUT kell nagyobb függvényekhez, a blokkoló és a nem blokkoló értékadás különbsége szimulátorban egy léptetőregiszteren, és erőforrásbecslés egy LED-villogtató számlálóhoz.
minutes: 40
---

## Amit ebben a leckében megtanulsz

- **kipróbálni**, hogy egy LUT tényleg csak egy kis memória, amelynek a tartalma az igazságtábla,
- megbecsülni, **hány LUT** kell egy sokbemenetű függvényhez,
- szimulátorban **látni**, miért ad teljesen mást a blokkoló (`=`) és a nem blokkoló (`<=`) értékadás egy órajeles blokkban,
- **kiszámolni**, hány flip-flopot foglal egy egyszerű LED-villogtató az FPGA-ban.

## 1. A LUT kipróbálva

Az FPGA logikai cellájának szíve a **keresőtábla** (_LUT – look-up table_): egy 4 bemenetű LUT valójában egy **16 bites memória**, a 4 bemenet pedig a **cím**. Bármilyen 4 bemenetű függvényt meg tud valósítani – csak a megfelelő 16 bitet kell beleírni. Ez a 16 bit a függvény **igazságtáblája**, és a bitstream ezeket tölti be bekapcsoláskor.

```python run
# Egy 4 bemenetű LUT = 16 bites memória: a "konfiguráció" maga az igazságtábla
from itertools import product

def lut_konfig(f):
    # a 16 tárolt bit: a cím (a, b, c, d) sorrendben a kimenet
    return [f(a, b, c, d) for a, b, c, d in product([0, 1], repeat=4)]

def lut_olvas(konfig, a, b, c, d):
    return konfig[a * 8 + b * 4 + c * 2 + d]        # a bemenetek egyszerűen címet adnak

fuggvenyek = {
    "4 bemenetű ÉS":        lambda a, b, c, d: a & b & c & d,
    "paritás (XOR)":        lambda a, b, c, d: a ^ b ^ c ^ d,
    "többségi (≥ 3 db 1)":  lambda a, b, c, d: int(a + b + c + d >= 3),
    "2:1 MUX (d választ)":  lambda a, b, c, d: b if d else a,
}
for nev, f in fuggvenyek.items():
    k = lut_konfig(f)
    jo = all(lut_olvas(k, *x) == f(*x) for x in product([0, 1], repeat=4))
    print(f"{nev:<22} konfiguráció: {''.join(map(str, k))}  ellenőrizve: {jo}")
```

Négy teljesen különböző függvény, ugyanaz a hardver – csak a 16 konfigurációs bit más. Ezért mondjuk, hogy az FPGA-t nem **programozzuk** (mint egy processzort), hanem **konfiguráljuk**: nem utasítások futnak rajta, hanem a bekapcsoláskor betöltött bitek határozzák meg, milyen áramkör **legyen** belőle.

### Hány LUT kell egy nagyobb függvényhez?

Egy 5 bemenetű függvény szétbontható az egyik változó szerint (**Shannon-kifejtés**): F = E̅ · F<sub>0</sub> + E · F<sub>1</sub>, ahol F<sub>0</sub> és F<sub>1</sub> már csak 4 bemenetű. Tehát kell **két 4-LUT** és egy **2:1 multiplexer**, ami maga is belefér egy LUT-ba. Ugyanígy tovább bontva:

| Bemenetek | 4-LUT (Shannon-kifejtéssel, legfeljebb) | 6-LUT (mai FPGA-k) |
| --------- | --------------------------------------- | ------------------ |
| 4         | 1                                       | 1                  |
| 5         | 2 + 1 = 3                               | 1                  |
| 6         | 4 + 3 = 7                               | 1                  |
| 8         | 16 + 15 = 31                            | 4 + 1 = 5          |

(Az első szám a részfüggvények LUT-jai, a második a multiplexerfáé. 4-LUT-ba egy 2:1 MUX fér, 6-LUT-ba egy teljes 4:1 MUX.)

Minden plusz bemenet nagyjából **megduplázza** a szükséges LUT-ok számát. Ezért tértek át a modern FPGA-k 6 bemenetű LUT-ra (64 konfigurációs bit): kevesebb szint, rövidebb késleltetés. A szintézis szerencsére ritkán találkozik a legrosszabb esettel – a valódi függvények (összeadó, komparátor, MUX) jól bonthatók.

## 2. Blokkoló vagy nem blokkoló? – a leggyakoribb HDL-hiba

Egy háromfokozatú léptetőregisztert szeretnénk Verilogban: minden órajelre d → q1 → q2 → q3. A két írásmód csak egy karakterben tér el, de a viselkedésük teljesen más:

```python run
# Blokkoló (=) és nem blokkoló (<=) értékadás – egy háromfokozatú léptetőregiszter
# Verilogban:  always @(posedge clk) begin q1 <= d; q2 <= q1; q3 <= q2; end
def orajel_blokkolo(d, q):
    q1, q2, q3 = q
    q1 = d                 # q1 = d;   azonnal frissül...
    q2 = q1                # q2 = q1;  ...ezért q2 már az ÚJ q1-et kapja
    q3 = q2
    return (q1, q2, q3)

def orajel_nem_blokkolo(d, q):
    q1, q2, q3 = q
    # minden jobb oldal a régi értékekből számol, és egyszerre íródik be (mint a flip-flopok)
    return (d, q1, q2)

bemenet = [1, 0, 0, 1, 0]
for nev, lepes in [("nem blokkoló <=", orajel_nem_blokkolo), ("blokkoló =   ", orajel_blokkolo)]:
    q = (0, 0, 0)
    sor = []
    for d in bemenet:
        q = lepes(d, q)
        sor.append("".join(map(str, q)))
    print(f"{nev}: " + "  ".join(sor))
```

- A **nem blokkoló** (`<=`) változat helyesen léptet: az 1-es bit ütemenként egyet lép jobbra (100 → 010 → 001). Itt minden jobb oldal a **régi** értékekből számol, és az új értékek az él pillanatában **egyszerre** íródnak be – pontosan úgy, ahogy három valódi flip-flop működik.
- A **blokkoló** (`=`) változatban q1 azonnal frissül, ezért q2 már az **új** q1-et kapja, q3 pedig az új q2-t: a bemenet egyetlen ütem alatt **végigszalad** az egész láncon (111). A szintézis ebből nem léptetőregisztert, hanem gyakorlatilag egyetlen flip-flopot és vezetékeket csinál.

A szabály, amit érdemes betéve tudni: **órajeles (sorrendi) blokkban mindig `<=`, kombinációs blokkban `=`.** A VHDL-ben ugyanez a különbség a jel (`signal`, `<=`) és a változó (`variable`, `:=`) között.

**Hasonlat:** a nem blokkoló értékadás olyan, mint amikor egy osztályban mindenki egyszerre adja tovább a dolgozatát a mögötte ülőnek. A blokkoló olyan, mintha az első padban ülő továbbadná, a második azonnal továbbadná a frissen kapottat, és így tovább – a végén az első dolgozat a hátsó padban köt ki, a többi pedig elveszik.

## 3. Erőforrásbecslés: egy LED-villogtató

Az első FPGA-projekt szinte mindig egy villogó LED. De hány bites számláló kell hozzá? A LED félperiódusonként vált, tehát f<sub>órajel</sub> / (2 · f<sub>LED</sub>) ütemig kell számolni, ehhez ⌈log₂(...)⌉ bit kell:

```python run
# Erőforrásbecslés: hány bites számláló kell egy LED villogtatásához?
import math

for f_orajel in [12e6, 50e6, 100e6]:
    for f_led in [1, 10]:
        # a LED félperiódusonként vált: ennyi órajelet kell megszámolni
        szamol = f_orajel / (2 * f_led)
        bitek = math.ceil(math.log2(szamol))
        print(f"{f_orajel / 1e6:>5.0f} MHz → {f_led:>2} Hz villogás: {szamol:>12,.0f} ütemig számol, "
              f"{bitek} bites számláló ({bitek} flip-flop)")
```

Egy 100 MHz-es lapkán az 1 Hz-es villogáshoz **26 bites** számláló (26 flip-flop és nagyjából ugyanennyi LUT a növeléshez) kell. Egy közepes FPGA-ban több tízezer flip-flop van, tehát ez elenyésző – de jól mutatja, miért nem lehet egy 100 MHz-es jelet „csak úgy” egy LED-re kötni: a szemünk számára ez folyamatos fény lenne. Ugyanez az elv adja a soros port baudrátáját vagy a VGA-kijelző időzítését is: mindegyik egy **leosztó számláló**.

## Összefoglalás

- Egy k bemenetű LUT 2<sup>k</sup> bites memória, tartalma az igazságtábla; az FPGA-t **konfiguráljuk**, nem programozzuk.
- Shannon-kifejtés: k + 1 bemenetű függvény = két k bemenetű + egy MUX; minden plusz bemenet kb. **duplázza** a LUT-igényt.
- Órajeles blokkban **`<=`** (nem blokkoló), kombinációsban **`=`**; a blokkoló értékadás egy léptetőregiszter helyett „átszaladó” vezetéket ad.
- Egy leosztó számlálóhoz ⌈log₂(f<sub>órajel</sub> / (2 · f<sub>ki</sub>))⌉ flip-flop kell.

## A lecke feladata

```quiz required
? Hány konfigurációs bitet tárol egy 6 bemenetű LUT?
= 64
! 2^6 = 64 – a 6 bemenet 64 címet ad.

? Egy 4 bemenetű LUT konfigurációja 0000000000000001 (az ABCD = 0000 sortól az 1111-ig). Melyik függvény ez?
- 4 bemenetű VAGY
+ 4 bemenetű ÉS
- paritás
- 4 bemenetű NAND
! Csak az utolsó (1111) sorban 1.

? Töltsd ki egy 3 bemenetű LUT tartalmát, ha a többségi függvényt valósítja meg (legalább két bemenet 1)!
table: A, B, C -> Y = A·B + A·C + B·C
! Ez a teljes összeadó átvitele is.

? Egy órajeles Verilog-blokkban: q1 = d; q2 = q1; (blokkoló). Kezdetben q1 = q2 = 0, d = 1. Mennyi q2 az első órajel-él után?
= 1
! A blokkoló értékadás miatt q2 már az új q1-et kapja – ezért kell órajeles blokkban <=.

? Hány bites számláló kell egy 50 MHz-es lapkán az 1 Hz-es LED-villogtatáshoz (25 000 000 ütemig kell számolni)?
= 25
! 2^24 ≈ 16,8 millió < 25 millió ≤ 2^25 ≈ 33,6 millió.
```
