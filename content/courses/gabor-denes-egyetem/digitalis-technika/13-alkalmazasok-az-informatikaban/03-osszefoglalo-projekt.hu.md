---
title: Összefoglaló projekt – digitális stopper FPGA-n
summary: A tárgy egészét összefogó tervezési feladat lépésről lépésre – specifikáció, blokkvázlat, órajel-engedélyező jel, gombok szinkronizálása és pergésmentesítése, állapotgép, BCD-számlálólánc, multiplexelt hétszegmenses kijelző, Verilog-kód, testbench, lábkiosztás és élesztés.
minutes: 50
---

## Amit ebben a leckében megtanulsz

- hogyan tervezel meg egy teljes digitális rendszert **a specifikációtól a működő hardverig**,
- hogyan illeszkednek egymáshoz a tárgy témakörei egy valódi feladatban,
- hogyan néz ki egy kisebb **Verilog**-projekt felépítése.

## A specifikáció

Egy FPGA-s fejlesztőpanelen (100 MHz-es órajel, 2 nyomógomb, 4 számjegyes hétszegmenses kijelző) **stoppert** építünk:

- a kijelző **másodperc.század** formában mutatja az időt: **00.00 … 59.99**, utána újra 00.00-tól számol;
- a **START/STOP** gomb indítja és megállítja;
- a **NULLÁZ** gomb megállítja és nullázza.

## A blokkvázlat (top-down bontás)

```text
 100 MHz ──> [ időalap ] ──> tick (100 Hz): a gombkezelőkhöz és a számlálólánchoz

 START/STOP ──> [ gombkezelő ] ──┐
                                 ├──> [ állapotgép: STOP / RUN ]
 NULLÁZ ──────> [ gombkezelő ] ──┘                │ fut, nulláz
                                                  v
                  [ BCD-lánc: század → tized → mp egyes → mp tízes ]
                                                  │ d0 … d3
                                                  v
                  [ kijelzővezérlő: MUX, dekóder, 7 szegmens ] ──> kijelző
```

A **gombkezelő** = szinkronizáló + pergésmentesítő + élérzékelő (2. lépés).

Minden doboz egy külön Verilog-modul, amelyet külön tesztelhetsz (11. témakör).

## 1. Időalap: órajel-engedélyező jel

A 100 Hz-es ütemet **nem** úgy állítjuk elő, hogy leosztott órajellel hajtjuk a számlálókat – az a szinkron tervezés szabályát sértené (11. témakör). Ehelyett minden a 100 MHz-es órajelről jár, és egy **engedélyező impulzus** (tick) jelzi, mikor kell lépni: 100 MHz / 100 Hz = **1 000 000** órajelenként egy órajel hosszú impulzus. A számláló 0-tól 999 999-ig számol, ehhez **20 bit** kell (2<sup>20</sup> = 1 048 576).

```verilog
// Időalap: 1 000 000 órajelenként egy órajelnyi tick impulzus (100 MHz → 100 Hz)
reg  [19:0] oszto = 0;
wire        tick  = (oszto == 20'd999_999);
always @(posedge clk)
  oszto <= tick ? 20'd0 : oszto + 1'b1;
```

## 2. Gombok: szinkronizálás és pergésmentesítés

A gomb aszinkron jel, és pattog is. Először **kétflipflopos szinkronizálóval** az órajelhez igazítjuk (11. témakör), majd a pergés ellen csak **10 ms-onként** (a 100 Hz-es ticknél) mintavételezzük – a pattogás ennél rövidebb. Ha az előző minta 0 volt, a mostani 1, akkor egyetlen órajel hosszú „megnyomták” impulzust adunk (élérzékelés).

```verilog
// Gomb: szinkronizálás, 10 ms-os mintavétel, felfutó él → egy órajeles impulzus
module gomb (input clk, input tick, input btn, output nyomas);
  reg [1:0] szinkr = 0;            // kétflipflopos szinkronizáló
  reg       elozo = 0, most = 0;   // két egymást követő 10 ms-os minta
  always @(posedge clk) begin
    szinkr <= {szinkr[0], btn};
    if (tick) begin
      elozo <= most;
      most  <= szinkr[1];
    end
  end
  assign nyomas = tick && most && !elozo;   // 0 → 1 váltás: egyszer jelez
endmodule
```

## 3. Állapotgép

Két állapot elég: **STOP** és **RUN** (6. témakör, Moore-gép: a fut kimenet csak az állapottól függ). A START/STOP impulzus vált a kettő között, a NULLÁZ mindig STOP-ba visz.

```text
           START/STOP
   STOP ─────────────────> RUN
        <─────────────────
           START/STOP

   NULLÁZ: bármelyikből → STOP (és a számlálók nullázódnak)
```

```verilog
// Állapotgép: STOP (0) és RUN (1)
reg fut = 1'b0;
always @(posedge clk)
  if (nullaz_ny)      fut <= 1'b0;   // nullázáskor megáll
  else if (start_ny)  fut <= ~fut;   // START/STOP: vált
```

## 4. BCD-számlálólánc

Négy BCD-számjegy: **század** (mod-10), **tized** (mod-10), **másodperc egyes** (mod-10), **másodperc tízes** (mod-6) – szinkron számlálók (5. témakör), amelyek ugyanarról az órajelről járnak, és az **engedélyező** bemenetükkel láncoljuk őket: a következő számjegy akkor lép, ha az előző a maximumán van **és** éppen lépne (átvitel).

```verilog
// Egy BCD-számjegy: 0 … MAX, engedélyezéssel; carry, ha MAX-ról lépne tovább
module bcd_szamjegy #(parameter MAX = 9) (
  input clk, input rst, input en,
  output reg [3:0] q = 0, output carry
);
  assign carry = en && (q == MAX);
  always @(posedge clk)
    if (rst)     q <= 4'd0;
    else if (en) q <= (q == MAX) ? 4'd0 : q + 1'b1;
endmodule

// A lánc: a század a tick-re lép (ha fut), a többi az előző átvitelére
wire [3:0] d0, d1, d2, d3;           // a négy számjegy értéke
wire       c0, c1, c2;               // átvitelek
bcd_szamjegy #(9) szazad (.clk(clk), .rst(nullaz_ny), .en(tick && fut), .q(d0), .carry(c0));
bcd_szamjegy #(9) tized  (.clk(clk), .rst(nullaz_ny), .en(c0),          .q(d1), .carry(c1));
bcd_szamjegy #(9) mp1    (.clk(clk), .rst(nullaz_ny), .en(c1),          .q(d2), .carry(c2));
bcd_szamjegy #(5) mp10   (.clk(clk), .rst(nullaz_ny), .en(c2),          .q(d3), .carry());
```

A „9-es állapot” felismerése kapukkal: BCD-ben a 10–15 kódok nem fordulnak elő (közömbösek), így a 9 = 1001 felismeréséhez elég **Q3·Q0** (4. témakör, Karnaugh-tábla közömbös cellákkal).

## 5. Multiplexelt kijelző

A négy számjegy szegmenseit közös vezetékek hajtják; egyszerre mindig **csak egy számjegy** világít, de olyan gyorsan váltunk, hogy a szem mind a négyet folyamatosnak látja. Egy 17 bites számláló felső két bitje választja ki a számjegyet (4. témakör: **multiplexer** a BCD-értékhez, **dekóder** az anódokhoz, **kódátalakító** a hét szegmenshez). 100 MHz / 2<sup>17</sup> ≈ 760 Hz-cel frissül minden számjegy.

```verilog
// Kijelző: számjegyválasztás, MUX, BCD → 7 szegmens (a szegmensek és anódok aktív alacsonyak)
reg  [16:0] frissit = 0;
always @(posedge clk) frissit <= frissit + 1'b1;
wire [1:0]  sel = frissit[16:15];

reg [3:0] bcd;
reg [3:0] anod;                       // anódok (aktív alacsony)
reg [6:0] seg;                        // szegmensek (aktív alacsony)
always @* begin
  case (sel)                          // multiplexer
    2'd0: bcd = d0;  2'd1: bcd = d1;
    2'd2: bcd = d2;  default: bcd = d3;
  endcase
  anod = ~(4'b0001 << sel);           // dekóder: egy anód aktív (0)
  case (bcd)                          // kódátalakító: gfedcba, 0 = világít
    4'd0: seg = 7'b1000000;  4'd1: seg = 7'b1111001;
    4'd2: seg = 7'b0100100;  4'd3: seg = 7'b0110000;
    4'd4: seg = 7'b0011001;  4'd5: seg = 7'b0010010;
    4'd6: seg = 7'b0000010;  4'd7: seg = 7'b1111000;
    4'd8: seg = 7'b0000000;  4'd9: seg = 7'b0010000;
    default: seg = 7'b1111111;
  endcase
end
assign dp = ~(sel == 2'd2);           // tizedespont a másodperc egyesek után
```

## 6. Szimuláció, lábkiosztás, élesztés

- **Testbench** (11. témakör): a szimulációban 1 000 000 órajel kivárása lassú, ezért az időalap **paraméterrel** gyorsítható (pl. tesztben 10 órajelenként jön tick). Ellenőrizd: a 9 → 0 átmenetet és az átvitelt, az 59.99 → 00.00 túlcsordulást, a START/STOP váltást és a nullázást.
- **Kényszerfájl** (9. témakör): az órajel lába és a `create_clock -period 10.000` (100 MHz), a gombok, a 7 szegmens, a tizedespont és a 4 anód lábai a panel kapcsolási rajza szerint.
- **Időzítés:** az implementáció után ellenőrizd, hogy nincs negatív slack.
- **Élesztés** (11. témakör): ha valami nem működik – jár-e az órajel, jó-e a lábkiosztás, nem fordított-e a szegmensek vagy az anódok aktív szintje (aktív alacsony vagy magas?). A belső jeleket a beépített logikai analizátorral (ILA) nézheted meg.

**Továbbfejlesztési ötletek:** részidő (köridő) mérés, perc kijelzése, visszaszámláló üzemmód, hangjelzés PWM-mel, az eredmény kiküldése UART-on a PC-re (10. témakör).

```python run
# A stopper viselkedési modellje: 100 Hz-es tick, BCD-lánc, 59.99 után túlcsordulás
def lepes(d):                      # d = [század, tized, mp egyes, mp tízes]
    maxok = [9, 9, 9, 5]
    for i in range(4):
        if d[i] == maxok[i]:
            d[i] = 0               # átvitel a következő számjegybe
        else:
            d[i] += 1
            break
    return d

def kijelzo(d):
    return f"{d[3]}{d[2]}.{d[1]}{d[0]}"

d = [0, 0, 0, 0]
for t in range(1, 6001):
    d = lepes(d)
    if t in (1, 10, 100, 1234, 5999, 6000):
        print(f"{t:5} tick -> {kijelzo(d)}")
print("különböző kijelzett értékek:", 60 * 100)
```

## Összefoglalás

- Top-down bontás: időalap, gombkezelés, állapotgép, BCD-számlálólánc, kijelzővezérlő – külön modulok, külön tesztelve.
- Egy órajel, engedélyező (tick) impulzusok; aszinkron gombokhoz szinkronizáló + pergésmentesítés + élérzékelés.
- A projekt szinte minden témakört használ: kódok (BCD, 7 szegmens), kombinációs hálózatok (MUX, dekóder), szinkron számlálók, állapotgép, HDL, időzítés, szimuláció, hibakeresés.

## A lecke feladata

```quiz required
? A panel órajele 100 MHz, a stopper 100 Hz-es ütemben lép. Hány órajelenként kell egy tick impulzus?
= 1000000
= 1 000 000

? Legalább hány bites számláló kell, hogy 0-tól 999 999-ig számolhasson?
= 20
! 2^19 = 524 288 kevés, 2^20 = 1 048 576 elég.

? A BCD-számjegy (Q3 Q2 Q1 Q0) 9-es állapotát kell felismerni; a 10–15 kódok nem fordulnak elő. Add meg a legegyszerűbb kifejezést!
expr: Q3, Q2, Q1, Q0 -> Q3·Q0
limit: 2
dc: 10, 11, 12, 13, 14, 15
! A közömbös cellákat is bevonhatod a csoportosításba.

? Hány különböző értéket mutathat a stopper (00.00 … 59.99)?
= 6000

? A 4 számjegyes multiplexelt kijelzőn minden számjegyet másodpercenként 250-szer kell frissíteni. Hány Hz-cel kell váltani a számjegyek között?
= 1000

? Miért engedélyező (tick) impulzussal léptetjük a számlálókat, és nem leosztott órajellel?
- Mert az FPGA-ban nem lehet órajelet osztani.
+ Mert így minden flip-flop ugyanarról az órajelről jár (szinkron terv), és elkerüljük a származtatott órajelek időzítési problémáit.
- Mert a tick impulzus gyorsabb, mint az órajel.
- Mert így kevesebb flip-flop kell.

? Miért csak 10 ms-onként mintavételezzük a szinkronizált gombjelet?
- Hogy kevesebbet fogyasszon.
+ Mert a gomb pergése ennél rövidebb, így egy nyomás egyetlen impulzust ad.
- Mert a kijelző csak 100 Hz-es.
- Mert a szinkronizáló lassú.
```
