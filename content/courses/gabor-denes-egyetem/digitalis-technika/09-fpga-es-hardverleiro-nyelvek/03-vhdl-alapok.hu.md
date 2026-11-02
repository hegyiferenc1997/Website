---
title: A VHDL alapjai
summary: Entity és architecture, std_logic és std_logic_vector, párhuzamos értékadás, when–else és with–select, process és rising_edge, D flip-flop, számláló és állapotgép VHDL-ben.
minutes: 40
---

## Amit ebben a leckében megtanulsz

- egy VHDL-terv két részét: **entity** (interfész) és **architecture** (működés),
- a legfontosabb **típusokat** (std_logic, std_logic_vector, unsigned),
- a **kombinációs** logika leírását (párhuzamos értékadás, when–else, with–select),
- a **sorrendi** logika leírását **process**-szel és **rising_edge**-dzsel,
- egy **számláló** és egy **állapotgép** VHDL-kódját.

## Hardvert írunk le, nem programot

A VHDL (VHSIC Hardware Description Language) **hardverleíró nyelv**: amit leírunk, az **áramkör lesz**, nem utasítások sorozata. Ezért a legfontosabb különbség a szoftveres gondolkodáshoz képest: a párhuzamos értékadások **egyszerre, folyamatosan** érvényesek (mint a kapuk), a sorrendjük mindegy. A VHDL szigorúan típusos, szintaxisa az Ada és a Pascal nyelvre emlékeztet; a kis- és nagybetűt nem különbözteti meg; a megjegyzés `--` jellel kezdődik.

## Entity és architecture

```vhdl
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

-- Az interfész: milyen portjai vannak az áramkörnek
entity and_kapu is
  port (
    A : in  std_logic;
    B : in  std_logic;
    Y : out std_logic
  );
end and_kapu;

-- A működés leírása
architecture rtl of and_kapu is
begin
  Y <= A and B;
end rtl;
```

- **entity**: a „tok lábai” – a portok neve, iránya (**in**, **out**, **inout**) és típusa.
- **architecture**: a belső működés. Egy entityhez több architecture is tartozhat.
- A `<=` a **jelértékadás** (signal assignment).

## Típusok

- **std_logic**: egy bit, de 9 értéke lehet; a fontosak: `'0'`, `'1'`, `'Z'` (nagyimpedanciás, háromállapotú), `'X'` (ismeretlen), `'-'` (közömbös).
- **std_logic_vector(7 downto 0)**: 8 bites busz, a 7. bit a legnagyobb helyiértékű. Értéke pl. `"10100101"` (vektor: idézőjel, bit: aposztróf).
- **unsigned / signed** (`IEEE.NUMERIC_STD` csomag): számként kezelhető vektor – ezzel lehet összeadni.
- **signal**: belső „vezeték” az architecture-ön belül.

## Kombinációs logika

**Logikai operátorok:** `and`, `or`, `not`, `nand`, `nor`, `xor`, `xnor`. Figyelem: a VHDL-ben az `and` és az `or` **egyenrangú**, ezért vegyes kifejezésben **kötelező a zárójel**: `Y <= (A and B) or (not C);`

**Feltételes értékadás (when–else)** – egy 2:1 multiplexer:

```vhdl
Y <= D1 when S = '1' else D0;
```

**Kiválasztó értékadás (with–select)** – egy 4:1 multiplexer:

```vhdl
with SEL select
  Y <= D(0) when "00",
       D(1) when "01",
       D(2) when "10",
       D(3) when others;
```

Ezek mind **párhuzamos** utasítások: folyamatosan érvényesek, mint egy kapu.

## Sorrendi logika: process

A **process** belsejében az utasítások **sorrendben** értelmeződnek (mint egy programban), de a process maga az eseményekre reagál, amelyeket az **érzékenységi listája** sorol fel.

**D flip-flop szinkron resettel:**

```vhdl
process (clk)
begin
  if rising_edge(clk) then      -- csak a felfutó élnél
    if rst = '1' then
      Q <= '0';
    else
      Q <= D;
    end if;
  end if;
end process;
```

A `rising_edge(clk)` miatt a szintézisprogram **élvezérelt flip-flopot** készít belőle. (A `falling_edge` a lefutó élre.)

## Példa: 4 bites számláló

```vhdl
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;
use IEEE.NUMERIC_STD.ALL;

entity szamlalo is
  port (
    clk, rst : in  std_logic;
    q        : out std_logic_vector(3 downto 0)
  );
end szamlalo;

architecture rtl of szamlalo is
  signal cnt : unsigned(3 downto 0) := (others => '0');
begin
  process (clk)
  begin
    if rising_edge(clk) then
      if rst = '1' then
        cnt <= (others => '0');
      else
        cnt <= cnt + 1;            -- 1111 után magától 0000 jön
      end if;
    end if;
  end process;
  q <= std_logic_vector(cnt);      -- típuskonverzió a kimenethez
end rtl;
```

Ebből a szintézis 4 D flip-flopot és egy 4 bites összeadót (növelőt) készít – pontosan a 5. témakör szinkron számlálóját.

## Példa: a lámpavezérlő állapotgép

A 6. témakör Moore-gépe VHDL-ben, **felsorolt típussal** (az állapotkódolást a szintézisprogram választja):

```vhdl
architecture rtl of lampa is
  type allapot_t is (PIROS, ZOLD);
  signal allapot : allapot_t := PIROS;
begin
  -- Állapotregiszter és következőállapot-logika
  process (clk)
  begin
    if rising_edge(clk) then
      case allapot is
        when PIROS => if Z = '1' and P = '0' then allapot <= ZOLD;  end if;
        when ZOLD  => if P = '1' and Z = '0' then allapot <= PIROS; end if;
      end case;
    end if;
  end process;

  -- Moore-kimenetek: csak az állapottól függenek
  piros_lampa <= '1' when allapot = PIROS else '0';
  zold_lampa  <= '1' when allapot = ZOLD  else '0';
end rtl;
```

## Összefoglalás

- entity = interfész (in, out, inout), architecture = működés; `<=` jelértékadás.
- std_logic (`'0'`, `'1'`, `'Z'` …), std_logic_vector, unsigned (NUMERIC_STD).
- Kombinációs: logikai operátorok (zárójelezve!), when–else, with–select – párhuzamosan érvényesek.
- Sorrendi: `process (clk)` + `if rising_edge(clk)` → flip-flop; állapotgép felsorolt típussal és case-szel.

## A lecke feladata

```quiz required
? Melyik VHDL-rész írja le az áramkör portjait (bemeneteit és kimeneteit)?
+ entity
- architecture
- process
- signal

? Milyen függvényt valósít meg a VHDL-sor? Y <= (A and B) or (not C); – írd fel kifejezésként!
expr: A, B, C -> A·B + C'

? Milyen függvényt ír le a következő sor? Y <= D1 when S = '1' else D0; – írd fel kifejezésként!
expr: S, D0, D1 -> S·D1 + S'·D0
! Ez egy 2:1 multiplexer.

? Mitől lesz egy process-ből élvezérelt flip-flop?
- A `when others` ágtól.
+ Az `if rising_edge(clk) then` feltételtől.
- A `signal` kulcsszótól.
- Attól, hogy a process-nek nincs érzékenységi listája.

? Melyik a 8 bites busz helyes VHDL-típusa?
- std_logic(7 downto 0)
+ std_logic_vector(7 downto 0)
- bit8
- integer(8)

? Mit jelent a 'Z' érték egy std_logic jelen?
- nulla
- ismeretlen
+ nagyimpedanciás (háromállapotú, lebegő) kimenet
- közömbös
```
