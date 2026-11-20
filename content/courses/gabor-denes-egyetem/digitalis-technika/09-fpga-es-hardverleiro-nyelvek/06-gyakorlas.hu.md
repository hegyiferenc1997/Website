---
title: Gyakorlás – FPGA és hardverleíró nyelvek
summary: Ellenőrző kérdések és összefoglaló feladatlap: PLD-típusok, LUT, FPGA-felépítés és tervezési folyamat, lábkiosztás, VHDL és Verilog.
minutes: 60
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Miben különbözik a HDL-kód a szoftveres programtól?</summary>

A HDL hardvert ír le: a párhuzamos értékadások (VHDL `<=` a process-en kívül, Verilog `assign`) egyszerre és folyamatosan érvényesek, mint a kapuk, és a sorrendjük mindegy. A kódból a szintézis áramkört készít, nem utasítássorozatot.

</details>

<details>
<summary>2. Miért mondjuk, hogy egy LUT „bármilyen” függvényt megvalósít?</summary>

Mert egy k bemenetű LUT egy 2<sup>k</sup> bites memória, amelybe az igazságtábla kerül; a bemenetek a címet adják. Bármely k változós függvénynek van igazságtáblája, tehát bármelyik betölthető – a függvény bonyolultsága nem számít.

</details>

<details>
<summary>3. Miért nincs a lábkiosztás a HDL-kódban?</summary>

Mert a HDL-kód a logikát írja le, és ugyanaz a modul többféle panelen, többféle FPGA-n is felhasználható. A fizikai lábak a panel kapcsolási rajzától függenek, ezért egy külön kényszerfájl (XDC, QSF) adja meg őket, az órajel-kényszerekkel együtt.

</details>

<details>
<summary>4. Miért kell órajeles blokkban nem blokkoló értékadást használni Verilogban?</summary>

Mert a valódi flip-flopok az órajel élén egyszerre veszik át a bemenetüket, a régi értékek alapján. A `<=` pontosan ezt modellezi; a blokkoló `=` a sorrendtől függő, a hardvertől eltérő viselkedést okozhat a szimulációban.

</details>

<details>
<summary>5. Mi a különbség a szintézis és az implementáció között?</summary>

A szintézis a HDL-leírást logikai elemek (LUT, flip-flop, BRAM, DSP) hálózatává alakítja; az implementáció ezeket elhelyezi az FPGA konkrét celláiban (place), és kiválasztja a köztük futó vezetékeket (route). Csak ezután ismert a pontos késleltetés, ezért az időzítési elemzés az implementáció után végleges.

</details>

## Összefoglaló feladatlap

```quiz required
? Hány bitet tárol egy 5 bemenetű LUT?
= 32

? Melyik eszközben programozható az ÉS- és a VAGY-mátrix is?
- PAL
+ PLA
- PROM
- GAL

? Milyen függvényt ír le a VHDL-sor? Y <= (A or B) and (not C); – írd fel kifejezésként!
expr: A, B, C -> (A + B)·C'

? Milyen függvényt ír le a Verilog-sor? assign Y = ~(A & B); – írd fel kifejezésként!
expr: A, B -> (A·B)'
! Ez a NAND kapu.

? Egy XDC-fájl: create_clock -period 10.000. Hány MHz az órajel?
= 100

? Melyik VHDL-szerkezetből lesz élvezérelt flip-flop?
- with SEL select … when others
- Y <= D1 when S = '1' else D0;
+ process (clk) … if rising_edge(clk) then
- signal cnt : unsigned(3 downto 0);

? A Verilog-modulban: a <= b; b <= a; (mindkettő órajeles blokkban). Mi történik egy órajelélnél?
+ A két regiszter értéke felcserélődik.
- Mindkettő a b értékét kapja.
- Mindkettő az a értékét kapja.
- Semmi sem változik.

? Melyik lépés után végleges az időzítési elemzés?
- a HDL-leírás után
- a szintézis után
+ az elhelyezés és huzalozás (implementáció) után
- a funkcionális szimuláció után
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **LUT-konfiguráció.** Írd meg a `lut(f, n)` függvényt, amely egy n bemenetű logikai függvényhez visszaadja egy n bemenetű LUT konfigurációs bitjeit **szövegként**, a 00…0 címtől az 11…1 címig!

```python starter
def lut(f, n):
    return "0" * 2 ** n
```

<details>
<summary>Megoldás</summary>

```python solution
from itertools import product

def lut(f, n):
    # a LUT tartalma maga az igazságtábla, címsorrendben
    return "".join(str(f(*cim)) for cim in product([0, 1], repeat=n))
```

</details>

```python test
assert lut(lambda a, b: a ^ b, 2) == "0110"
assert lut(lambda a, b, c: int(a + b + c >= 2), 3) == "00010111"
assert lut(lambda a, b, c, d: a & b & c & d, 4) == "0000000000000001"
assert len(lut(lambda *x: 0, 6)) == 64
print("Minden ellenőrzés sikeres!")
```

**2.** **Leosztó számláló.** Írd meg a `leoszto_bitek(f_orajel, f_ki)` függvényt, amely megadja, hány bites számláló kell ahhoz, hogy egy kimenet f_ki frekvenciával villogjon (a kimenet félperiódusonként vált, tehát f_orajel / (2 · f_ki) ütemig kell számolni)!

```python starter
def leoszto_bitek(f_orajel, f_ki):
    return 0
```

<details>
<summary>Megoldás</summary>

```python solution
def leoszto_bitek(f_orajel, f_ki):
    kell = f_orajel // (2 * f_ki)      # ennyi ütemet kell megszámolni félperiódusonként
    bitek = 0
    while 2 ** bitek < kell:
        bitek += 1
    return bitek
```

</details>

```python test
assert leoszto_bitek(100_000_000, 1) == 26
assert leoszto_bitek(50_000_000, 1) == 25
assert leoszto_bitek(12_000_000, 10) == 20
print("Minden ellenőrzés sikeres!")
```

**3.** **Blokkoló kontra nem blokkoló.** Írd meg a `leptetoregiszter(bemenetek, n, nem_blokkolo=True)` függvényt, amely egy n fokozatú léptetőregiszter állapotait (szövegként, pl. `"100"`) adja vissza minden órajel után! Nem blokkoló módban minden fokozat az előző fokozat **régi** értékét kapja; blokkoló módban sorban, az **új** értéket.

```python starter
def leptetoregiszter(bemenetek, n, nem_blokkolo=True):
    return []
```

<details>
<summary>Megoldás</summary>

```python solution
def leptetoregiszter(bemenetek, n, nem_blokkolo=True):
    q, sor = [0] * n, []
    for d in bemenetek:
        if nem_blokkolo:
            q = [d] + q[:-1]               # mindenki a régi értékekből: valódi léptetés
        else:
            q[0] = d
            for i in range(1, n):
                q[i] = q[i - 1]            # már az új értéket látja: "átszalad"
        sor.append("".join(map(str, q)))
    return sor
```

</details>

```python test
assert leptetoregiszter([1, 0, 0], 3) == ["100", "010", "001"]
assert leptetoregiszter([1, 0, 0], 3, nem_blokkolo=False) == ["111", "000", "000"]
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Mi tárolja egy SRAM-alapú FPGA konfigurációját kikapcsolt állapotban?
- maguk a LUT-ok
+ egy külső (vagy beépített) Flash memória, ahonnan bekapcsoláskor betöltődik
- a JTAG kábel
! Az SRAM felejtő, ezért minden bekapcsoláskor újra kell tölteni a bitstreamet.

? Melyik a helyes Verilog egy élvezérelt D flip-flophoz?
+ always @(posedge clk) q <= d;
- always @(*) q = d;
- assign q = d;
! Az assign és az always @(*) kombinációs logikát ír le.

? VHDL-ben melyik feltétel jelenti a felfutó órajel-élet?
= rising_edge(clk)
= rising_edge (clk)
! A process érzékenységi listájában a clk szerepel.

? Mi az a blokk-RAM egy FPGA-ban?
- a LUT-ok összessége
+ dedikált, nagyobb memóriablokk a chipen belül
- a külső DDR memória
! Néhány kilobites blokkok, sokkal hatékonyabbak, mint LUT-okból memóriát építeni.

? Hány bemenetű a LUT a legtöbb mai FPGA-ban?
= 6
! 6 bemenet → 64 konfigurációs bit.
```
