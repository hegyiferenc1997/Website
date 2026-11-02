---
title: Szimuláció és testbench
summary: Funkcionális és időzítési szimuláció, a testbench felépítése (DUT, gerjesztés, órajel, ellenőrzés), teljes körű tesztelés, önellenőrző testbench VHDL-ben és Verilogban, hullámforma-nézet és szimulátorok.
minutes: 40
---

## Amit ebben a leckében megtanulsz

- mi a különbség a **funkcionális** és az **időzítési** szimuláció között,
- hogyan épül fel egy **testbench**,
- hogyan generálsz **órajelet** és **gerjesztést** (stimulus),
- mi az **önellenőrző** testbench és a **teljes körű** (kimerítő) teszt,
- milyen **szimulátorokkal** dolgozhatsz.

## Miért szimulálunk?

Egy FPGA felprogramozása és a hiba megkeresése a valódi panelen lassú és nehéz: csak a lábakon látsz bele. A **szimulátor** viszont a teljes áramkör **minden belső jelét** megmutatja, idővonalon, és egy hibás terv másodpercek alatt újrafuttatható. Ezért a szabály: **előbb szimulálj, aztán programozz**.

- **Funkcionális (RTL) szimuláció:** a HDL-leírást szimulálja, késleltetések nélkül – a logikai helyességet ellenőrzi.
- **Időzítési (post-route) szimuláció:** az elhelyezett és huzalozott terv valódi késleltetéseivel fut – lassabb, ritkábban használjuk (a statikus időzítési elemzés többnyire kiváltja).

## A testbench felépítése

A **testbench** (tesztkörnyezet) egy olyan HDL-modul, amely **nem lesz hardver**: csak a szimulátorban fut, és a tesztelt áramkört (**DUT** – device under test) „körbeveszi”:

```text
 ┌───────────────────── testbench (nincsenek portjai) ───────────────────┐
 │  órajel- és     ──>  ┌───────┐  ──>  ellenőrzés                       │
 │  gerjesztés-         │  DUT  │       (várt érték összevetése,         │
 │  generátor      ──>  └───────┘  ──>  hibaüzenet)                      │
 └───────────────────────────────────────────────────────────────────────┘
```

1. **Nincsenek portjai** – ő a legfelső szint.
2. **Példányosítja** a DUT-ot, és belső jelekkel köti be.
3. **Gerjesztést** ad: időben egymás után beállítja a bemeneteket.
4. **Órajelet** generál (sorrendi áramkörnél).
5. **Ellenőriz:** összeveti a kimenetet a várt értékkel, és eltérés esetén hibát jelez.

A testbenchben szabad olyan, nem szintetizálható szerkezeteket használni, mint a várakozás (`wait for 10 ns;`, `#10`) vagy a kiírás.

## Testbench VHDL-ben

Egy teljes összeadó (`full_adder`, bemenetek: a, b, cin; kimenetek: s, cout) önellenőrző testbenchje, amely **mind a 8 bemeneti kombinációt** végigpróbálja:

```vhdl
library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

entity tb_full_adder is            -- a testbenchnek nincs portja
end entity;

architecture sim of tb_full_adder is
  signal a, b, cin, s, cout : std_logic;
begin
  dut : entity work.full_adder port map (a => a, b => b, cin => cin, s => s, cout => cout);

  stim : process
    variable v        : unsigned(2 downto 0);
    variable expected : integer;
  begin
    for i in 0 to 7 loop
      v := to_unsigned(i, 3);
      a <= v(2); b <= v(1); cin <= v(0);
      expected := (i / 4) + ((i / 2) mod 2) + (i mod 2);       -- várt összeg
      wait for 10 ns;                                          -- idő a kimenet beállására
      assert to_integer(unsigned'(cout & s)) = expected
        report "Hibás eredmény az i = " & integer'image(i) severity error;
    end loop;
    report "Teszt vége";
    wait;                                                      -- a process itt megáll
  end process;
end architecture;
```

Az `assert … report … severity error` a VHDL ellenőrző utasítása: ha a feltétel hamis, kiírja az üzenetet.

## Testbench Verilogban, órajellel

Egy 4 bites számláló (`counter4`: clk, rst, q) testbenchje:

```verilog
`timescale 1ns / 1ps              // időegység: 1 ns, pontosság: 1 ps

module tb_counter4;               // nincs port
  reg clk = 0, rst = 1;
  wire [3:0] q;

  counter4 dut (.clk(clk), .rst(rst), .q(q));

  always #5 clk = ~clk;           // 5 ns-onként vált → 10 ns periódus, 100 MHz

  initial begin
    $dumpfile("tb.vcd");          // hullámforma mentése
    $dumpvars(0, tb_counter4);
    #12 rst = 0;                  // reset elengedése
    repeat (20) @(posedge clk);   // 20 órajel
    #1;                           // kicsit várunk, hogy q frissüljön
    if (q !== 4'd4) $display("HIBA: q = %d", q);   // 20 mod 16 = 4
    else            $display("OK");
    $finish;
  end
endmodule
```

- `always #5 clk = ~clk;` – végtelen órajel: fél periódusonként vált.
- `initial` – egyszer lefutó blokk, a gerjesztés sorrendje.
- `$display`, `$finish`, `$dumpvars` – a szimulátor rendszerfeladatai.

## Mennyi teszt elég?

- **Kombinációs** áramkörnél kis bemenetszámnál **minden kombinációt** kipróbálhatsz: n bemenet → **2<sup>n</sup>** tesztvektor. Egy 4 bites összeadó bejövő átvitellel 9 bemenetű → 2<sup>9</sup> = 512 vektor, ez pillanatok alatt lefut. 32 bites összeadónál (2<sup>65</sup>) ez már lehetetlen – ott **véletlen** vektorokat és a **határeseteket** (0, maximum, túlcsordulás) teszteljük.
- **Sorrendi** áramkörnél az állapotokat és az átmeneteket kell bejárni: reset, minden állapot, a ritka ágak (pl. számláló túlcsordulása), illegális bemeneti sorozatok.
- Az **önellenőrző** testbench maga dönti el, hogy jó-e az eredmény; így minden módosítás után egy gombnyomással újra lefuttatható (regressziós teszt).

## Hullámforma és szimulátorok

A szimulátor az összes jelet **hullámformán** (waveform) mutatja – ezen követed a hibát visszafelé, a rossz kimenettől a hibás belső jelig.

| eszköz                    | nyelv         | megjegyzés                                  |
| ------------------------- | ------------- | ------------------------------------------- |
| ModelSim / Questa         | VHDL, Verilog | ipari szabvány, ingyenes FPGA-s változattal |
| Vivado Simulator (XSim)   | VHDL, Verilog | az AMD/Xilinx Vivado része                  |
| GHDL                      | VHDL          | nyílt forrású                               |
| Icarus Verilog, Verilator | Verilog       | nyílt forrású                               |
| GTKWave                   | –             | nyílt forrású hullámforma-néző (VCD fájl)   |

```python run
# Egy "testbench" Pythonban: a teljes összeadó minden bemeneti kombinációjának ellenőrzése
def teljes_osszeado(a, b, cin):               # a tesztelt "áramkör" (DUT), kapukból
    s = a ^ b ^ cin
    cout = (a & b) | (cin & (a ^ b))
    return s, cout

hibak = 0
for i in range(8):                            # 2^3 = 8 tesztvektor
    a, b, cin = (i >> 2) & 1, (i >> 1) & 1, i & 1
    s, cout = teljes_osszeado(a, b, cin)
    vart = a + b + cin                        # referencia: egész számos összeadás
    if 2 * cout + s != vart:
        hibak += 1
        print("HIBA:", a, b, cin)
print("8 vektor lefutott,", hibak, "hiba")
```

## Összefoglalás

- Funkcionális szimuláció: logika, késleltetés nélkül; időzítési: valódi késleltetésekkel.
- Testbench: nincs portja, példányosítja a DUT-ot, gerjesztést és órajelet ad, ellenőriz (assert, $display).
- Kombinációs áramkör: n bemenet → 2<sup>n</sup> vektor; nagyoknál véletlen és határesetek.
- Önellenőrző testbench → gyors regressziós teszt; hibakeresés a hullámformán.

## A lecke feladata

```quiz required
? Hány tesztvektor kell egy 4 bites összeadó (két 4 bites szám + bejövő átvitel) teljes körű teszteléséhez?
= 512
! 4 + 4 + 1 = 9 bemenet.

? Egy Verilog-testbenchben (timescale 1ns/1ps): always #5 clk = ~clk; Hány MHz az órajel?
= 100
! 5 ns-onként vált, tehát a periódus 10 ns.

? Töltsd ki a szimulált modul igazságtábláját! assign Y = (A & B) | C;
table: A, B, C -> Y = A·B + C

? Miért nincsenek portjai egy testbenchnek?
- Mert a portokat a kényszerfájl adja meg.
+ Mert ő a legfelső szint, amely csak a szimulátorban fut, és a DUT-ot belső jelekkel köti be.
- Mert a testbench csak kombinációs logikát tartalmazhat.
- Mert a portok lassítanák a szimulációt.

? Mi a különbség a funkcionális és az időzítési szimuláció között?
+ A funkcionális a HDL logikáját késleltetések nélkül vizsgálja, az időzítési a huzalozott terv valódi késleltetéseivel fut.
- A funkcionális csak sorrendi, az időzítési csak kombinációs áramkört tud szimulálni.
- Nincs különbség, csak a szimulátor neve más.
- Az időzítési szimuláció a valódi FPGA-n fut.

? Mit jelent, hogy egy testbench önellenőrző?
- Magától kijavítja a hibás HDL-kódot.
+ Maga hasonlítja össze a kimenetet a várt értékkel, és hibát jelez, ha eltérés van.
- Csak akkor fut le, ha nincs hiba.
- A hullámformát automatikusan kinyomtatja.
```
