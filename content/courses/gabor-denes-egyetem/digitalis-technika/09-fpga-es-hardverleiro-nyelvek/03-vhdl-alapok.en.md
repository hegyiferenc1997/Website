---
title: VHDL Basics
summary: Entity and architecture, std_logic and std_logic_vector, concurrent assignment, when–else and with–select, process and rising_edge, D flip-flop, counter and state machine in VHDL.
minutes: 40
---

## What you will learn

- the two parts of a VHDL design: **entity** (interface) and **architecture** (behaviour),
- the most important **types** (std_logic, std_logic_vector, unsigned),
- describing **combinational** logic (concurrent assignment, when–else, with–select),
- describing **sequential** logic with a **process** and **rising_edge**,
- the VHDL code of a **counter** and a **state machine**.

## We describe hardware, not a program

VHDL (VHSIC Hardware Description Language) is a **hardware description language**: what we describe **becomes a circuit**, not a sequence of instructions. So the key difference from software thinking: concurrent assignments are valid **simultaneously and continuously** (like gates), and their order does not matter. VHDL is strongly typed, its syntax resembles Ada and Pascal; it is case-insensitive; comments start with `--`.

## Entity and architecture

```vhdl
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

-- The interface: what ports the circuit has
entity and_gate is
  port (
    A : in  std_logic;
    B : in  std_logic;
    Y : out std_logic
  );
end and_gate;

-- The description of the behaviour
architecture rtl of and_gate is
begin
  Y <= A and B;
end rtl;
```

- **entity**: the “pins of the package” – the ports' names, directions (**in**, **out**, **inout**) and types.
- **architecture**: the internal behaviour. An entity can have several architectures.
- `<=` is **signal assignment**.

## Types

- **std_logic**: one bit, but it can have 9 values; the important ones: `'0'`, `'1'`, `'Z'` (high impedance, three-state), `'X'` (unknown), `'-'` (don't care).
- **std_logic_vector(7 downto 0)**: an 8-bit bus, bit 7 is the most significant. Its value is e.g. `"10100101"` (vector: double quotes, bit: single quotes).
- **unsigned / signed** (`IEEE.NUMERIC_STD` package): a vector that can be handled as a number – it can be added.
- **signal**: an internal “wire” inside the architecture.

## Combinational logic

**Logic operators:** `and`, `or`, `not`, `nand`, `nor`, `xor`, `xnor`. Note: in VHDL `and` and `or` have **equal precedence**, so in a mixed expression **brackets are mandatory**: `Y <= (A and B) or (not C);`

**Conditional assignment (when–else)** – a 2:1 multiplexer:

```vhdl
Y <= D1 when S = '1' else D0;
```

**Selected assignment (with–select)** – a 4:1 multiplexer:

```vhdl
with SEL select
  Y <= D(0) when "00",
       D(1) when "01",
       D(2) when "10",
       D(3) when others;
```

These are all **concurrent** statements: continuously valid, like a gate.

## Sequential logic: process

Inside a **process** the statements are interpreted **in order** (like in a program), but the process itself reacts to events listed in its **sensitivity list**.

**D flip-flop with synchronous reset:**

```vhdl
process (clk)
begin
  if rising_edge(clk) then      -- only at the rising edge
    if rst = '1' then
      Q <= '0';
    else
      Q <= D;
    end if;
  end if;
end process;
```

Because of `rising_edge(clk)` the synthesis tool makes an **edge-triggered flip-flop** of it. (`falling_edge` is for the falling edge.)

## Example: 4-bit counter

```vhdl
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;
use IEEE.NUMERIC_STD.ALL;

entity counter is
  port (
    clk, rst : in  std_logic;
    q        : out std_logic_vector(3 downto 0)
  );
end counter;

architecture rtl of counter is
  signal cnt : unsigned(3 downto 0) := (others => '0');
begin
  process (clk)
  begin
    if rising_edge(clk) then
      if rst = '1' then
        cnt <= (others => '0');
      else
        cnt <= cnt + 1;            -- after 1111 comes 0000 by itself
      end if;
    end if;
  end process;
  q <= std_logic_vector(cnt);      -- type conversion for the output
end rtl;
```

From this, synthesis makes 4 D flip-flops and a 4-bit adder (incrementer) – exactly the synchronous counter of topic 5.

## Example: the lamp-control state machine

The Moore machine of topic 6 in VHDL, with an **enumerated type** (the synthesis tool chooses the state encoding):

```vhdl
architecture rtl of lamp is
  type state_t is (RED, GREEN);
  signal state : state_t := RED;
begin
  -- State register and next-state logic
  process (clk)
  begin
    if rising_edge(clk) then
      case state is
        when RED   => if Z = '1' and P = '0' then state <= GREEN; end if;
        when GREEN => if P = '1' and Z = '0' then state <= RED;   end if;
      end case;
    end if;
  end process;

  -- Moore outputs: depend only on the state
  red_lamp   <= '1' when state = RED   else '0';
  green_lamp <= '1' when state = GREEN else '0';
end rtl;
```

## Summary

- entity = interface (in, out, inout), architecture = behaviour; `<=` signal assignment.
- std_logic (`'0'`, `'1'`, `'Z'` …), std_logic_vector, unsigned (NUMERIC_STD).
- Combinational: logic operators (with brackets!), when–else, with–select – concurrently valid.
- Sequential: `process (clk)` + `if rising_edge(clk)` → flip-flop; a state machine with an enumerated type and case.

## Lesson exercise

```quiz required
? Which VHDL part describes the circuit's ports (inputs and outputs)?
+ entity
- architecture
- process
- signal

? Which function does this VHDL line implement? Y <= (A and B) or (not C); – write it as an expression!
expr: A, B, C -> A·B + C'

? Which function does the following line describe? Y <= D1 when S = '1' else D0; – write it as an expression!
expr: S, D0, D1 -> S·D1 + S'·D0
! This is a 2:1 multiplexer.

? What makes a process an edge-triggered flip-flop?
- The `when others` branch.
+ The condition `if rising_edge(clk) then`.
- The `signal` keyword.
- The process having no sensitivity list.

? What is the correct VHDL type for an 8-bit bus?
- std_logic(7 downto 0)
+ std_logic_vector(7 downto 0)
- bit8
- integer(8)

? What does the value 'Z' mean on a std_logic signal?
- zero
- unknown
+ a high-impedance (three-state, floating) output
- don't care
```
