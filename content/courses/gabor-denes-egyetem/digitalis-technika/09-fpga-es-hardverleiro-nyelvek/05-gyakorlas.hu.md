---
title: Gyakorlás – FPGA és hardverleíró nyelvek
summary: Ellenőrző kérdések és összefoglaló feladatlap: PLD-típusok, LUT, FPGA-felépítés és tervezési folyamat, lábkiosztás, VHDL és Verilog.
minutes: 35
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
