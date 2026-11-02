---
title: A Verilog alapjai
summary: module, input/output, wire és reg, assign, bitenkénti operátorok, feltételes operátor, always blokkok, blokkoló és nem blokkoló értékadás, számláló és sorozatfelismerő Verilogban.
minutes: 40
---

## Amit ebben a leckében megtanulsz

- egy Verilog-**modul** felépítését (portok, **wire** és **reg**),
- a **kombinációs** logika leírását **assign**-nal és **always @(\*)**-gal,
- a **sorrendi** logikát **always @(posedge clk)**-kal,
- a **blokkoló** (`=`) és **nem blokkoló** (`<=`) értékadás különbségét,
- egy **számláló** és egy **állapotgép** Verilog-kódját.

## A Verilog jellege

A **Verilog** a VHDL mellett a másik elterjedt hardverleíró nyelv. Szintaxisa a **C nyelvre** emlékeztet, tömörebb és kevésbé szigorú a típusokban; megkülönbözteti a kis- és nagybetűt; a megjegyzés `//` vagy `/* … */`. Továbbfejlesztése a **SystemVerilog**, amely az ellenőrzéshez (verifikációhoz) is sok eszközt ad.

## Modul, portok, wire és reg

```verilog
// Egy ÉS kapu
module and_kapu (
  input  wire A,
  input  wire B,
  output wire Y
);
  assign Y = A & B;
endmodule
```

- **module … endmodule**: az áramkör (mint a VHDL entity + architecture együtt).
- Portok: **input**, **output**, **inout**; busz: `input [7:0] data` (8 bit, a 7. a legnagyobb helyiértékű).
- **wire**: vezeték – folyamatosan hajtja valami (assign, egy másik modul kimenete).
- **reg**: olyan változó, amely **always blokkban** kap értéket. (A neve megtévesztő: nem mindig lesz belőle regiszter – csak akkor, ha órajel élére íródik.)
- Számok: `4'b1010` (4 bites bináris, értéke 10), `8'hFF` (8 bites hexadecimális), `8'd200` (decimális).

## Kombinációs logika

**Bitenkénti operátorok:** `&` (ÉS), `|` (VAGY), `^` (XOR), `~` (NEM), `~^` (XNOR). A precedencia: `~` > `&` > `^` > `|` – mint a Boole-algebrában (3. témakör).

```verilog
assign Y = (A & ~B) | C;      // Y = A·B̅ + C
assign S = A ^ B ^ Cin;       // teljes összeadó összegbitje
assign M = S ? D1 : D0;       // 2:1 multiplexer feltételes operátorral
```

**always @(\*)** – kombinációs blokk, amelyben `if` és `case` is használható. A `*` azt jelenti: minden olvasott jel változására lefut.

```verilog
// 4:1 multiplexer
always @(*) begin
  case (sel)
    2'b00:   y = d0;
    2'b01:   y = d1;
    2'b10:   y = d2;
    default: y = d3;
  endcase
end
```

Fontos: kombinációs blokkban **minden ágon** kapjon értéket a kimenet (ezért a `default`), különben a szintézis nem kívánt **latch-et** (tárolót) készít.

## Sorrendi logika: always @(posedge clk)

```verilog
// D flip-flop szinkron resettel
always @(posedge clk) begin
  if (rst)
    q <= 1'b0;
  else
    q <= d;
end
```

A `posedge clk` (felfutó él) – vagy `negedge clk` (lefutó él) – miatt flip-flop lesz belőle.

### Blokkoló és nem blokkoló értékadás

- **`=` (blokkoló):** azonnal érvényes, a következő sor már az új értéket látja – **kombinációs** blokkokba.
- **`<=` (nem blokkoló):** az összes értékadás az él pillanatában **egyszerre** történik meg, a régi értékekből számolva – **sorrendi** blokkokba.

Példa: `a <= b; b <= a;` egy élen **megcseréli** a két regisztert (két flip-flop keresztbe kötve). Blokkolóval (`a = b; b = a;`) mindkettő b értékét kapná. Szabály: **órajeles blokkban mindig `<=`**.

## Példa: 4 bites számláló

```verilog
module szamlalo (
  input  wire       clk,
  input  wire       rst,
  output reg  [3:0] q
);
  always @(posedge clk) begin
    if (rst)
      q <= 4'd0;
    else
      q <= q + 4'd1;     // 1111 után 0000
  end
endmodule
```

## Példa: a „101” sorozatfelismerő (Moore)

A 6. témakör Moore-gépe Verilogban:

```verilog
module felismero (
  input  wire clk, rst, x,
  output wire y
);
  localparam A = 2'd0, B = 2'd1, C = 2'd2, D = 2'd3;
  reg [1:0] allapot;

  // Állapotregiszter + következőállapot-logika
  always @(posedge clk) begin
    if (rst) allapot <= A;
    else case (allapot)
      A: allapot <= x ? B : A;
      B: allapot <= x ? B : C;
      C: allapot <= x ? D : A;
      D: allapot <= x ? B : C;
    endcase
  end

  // Moore-kimenet: csak az állapottól függ
  assign y = (allapot == D);
endmodule
```

## VHDL és Verilog egymás mellett

| fogalom     | VHDL                           | Verilog                    |
| ----------- | ------------------------------ | -------------------------- |
| egység      | entity + architecture          | module                     |
| portok      | `in`, `out`, `inout`           | `input`, `output`, `inout` |
| busz        | `std_logic_vector(7 downto 0)` | `[7:0]`                    |
| kombinációs | `Y <= A and B;`                | `assign Y = A & B;`        |
| órajel éle  | `if rising_edge(clk) then`     | `always @(posedge clk)`    |
| megjegyzés  | `--`                           | `//`                       |

## Összefoglalás

- module, input/output, wire (folyamatos hajtás) és reg (always-ben kap értéket).
- Kombinációs: `assign`, `always @(*)` – minden ágon adj értéket (különben latch).
- Sorrendi: `always @(posedge clk)` és **nem blokkoló** `<=`.
- Operátorok: `~` > `&` > `^` > `|`; feltételes operátor: `S ? D1 : D0`.

## A lecke feladata

```quiz required
? Milyen függvényt valósít meg a Verilog-sor? assign Y = (A & ~B) | C; – írd fel kifejezésként!
expr: A, B, C -> A·B' + C

? Milyen függvényt valósít meg? assign Y = A ^ B ^ C; – írd fel kifejezésként!
expr: A, B, C -> A ⊕ B ⊕ C
! A teljes összeadó összegbitje.

? Milyen értékadást használunk órajeles (always @(posedge clk)) blokkban?
- blokkolót (=)
+ nem blokkolót (<=)
- assign-t
- bármelyiket, mindegy

? Mennyi a 4'b1010 Verilog-szám értéke tízes számrendszerben?
= 10

? Hány bites a következő port? input [7:0] data
= 8

? Mi történik, ha egy always @(*) blokkban nem minden ágon kap értéket a kimenet?
- Fordítási hiba, a kód nem fut le.
+ A szintézis nem kívánt tárolót (latch-et) készít.
- A kimenet automatikusan 0 lesz.
- Semmi, a kimenet egyszerűen nem változik, és ez mindig jó.
```
