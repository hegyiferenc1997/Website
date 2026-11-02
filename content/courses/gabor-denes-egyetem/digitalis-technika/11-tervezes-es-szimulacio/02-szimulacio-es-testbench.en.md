---
title: Simulation and Testbenches
summary: Functional and timing simulation, the structure of a testbench (DUT, stimulus, clock, checking), exhaustive testing, self-checking testbenches in VHDL and Verilog, the waveform view and simulators.
minutes: 40
---

## What you will learn

- the difference between **functional** and **timing** simulation,
- how a **testbench** is built,
- how to generate a **clock** and **stimulus**,
- what a **self-checking** testbench and an **exhaustive** test are,
- which **simulators** you can work with.

## Why do we simulate?

Programming an FPGA and finding a bug on the real board is slow and hard: you can see inside only through the pins. A **simulator**, however, shows **every internal signal** of the whole circuit on a timeline, and a faulty design can be rerun in seconds. Hence the rule: **simulate first, then program**.

- **Functional (RTL) simulation:** simulates the HDL description without delays – it checks logical correctness.
- **Timing (post-route) simulation:** runs with the real delays of the placed and routed design – slower, used less often (static timing analysis mostly replaces it).

## The structure of a testbench

A **testbench** is an HDL module that **will not become hardware**: it runs only in the simulator and “surrounds” the circuit under test (**DUT** – device under test):

```text
 ┌──────────────────────── testbench (no ports) ──────────────────────────┐
 │  clock and      ──>  ┌───────┐  ──>  checking                          │
 │  stimulus            │  DUT  │       (compare with expected value,     │
 │  generator      ──>  └───────┘  ──>  error message)                    │
 └────────────────────────────────────────────────────────────────────────┘
```

1. It **has no ports** – it is the top level.
2. It **instantiates** the DUT and connects it with internal signals.
3. It applies **stimulus**: it sets the inputs one after another in time.
4. It generates a **clock** (for a sequential circuit).
5. It **checks**: it compares the output with the expected value and reports an error on a mismatch.

In a testbench you may use non-synthesisable constructs such as waiting (`wait for 10 ns;`, `#10`) or printing.

## A testbench in VHDL

A self-checking testbench for a full adder (`full_adder`, inputs: a, b, cin; outputs: s, cout) that tries **all 8 input combinations**:

```vhdl
library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

entity tb_full_adder is            -- the testbench has no ports
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
      expected := (i / 4) + ((i / 2) mod 2) + (i mod 2);       -- expected sum
      wait for 10 ns;                                          -- time for the output to settle
      assert to_integer(unsigned'(cout & s)) = expected
        report "Wrong result for i = " & integer'image(i) severity error;
    end loop;
    report "End of test";
    wait;                                                      -- the process stops here
  end process;
end architecture;
```

`assert … report … severity error` is the checking statement of VHDL: if the condition is false, it prints the message.

## A testbench in Verilog, with a clock

A testbench for a 4-bit counter (`counter4`: clk, rst, q):

```verilog
`timescale 1ns / 1ps              // time unit: 1 ns, precision: 1 ps

module tb_counter4;               // no ports
  reg clk = 0, rst = 1;
  wire [3:0] q;

  counter4 dut (.clk(clk), .rst(rst), .q(q));

  always #5 clk = ~clk;           // toggles every 5 ns → 10 ns period, 100 MHz

  initial begin
    $dumpfile("tb.vcd");          // save the waveform
    $dumpvars(0, tb_counter4);
    #12 rst = 0;                  // release reset
    repeat (20) @(posedge clk);   // 20 clocks
    #1;                           // wait a little for q to update
    if (q !== 4'd4) $display("ERROR: q = %d", q);   // 20 mod 16 = 4
    else            $display("OK");
    $finish;
  end
endmodule
```

- `always #5 clk = ~clk;` – an endless clock: it toggles every half period.
- `initial` – a block that runs once, the order of the stimulus.
- `$display`, `$finish`, `$dumpvars` – system tasks of the simulator.

## How many tests are enough?

- For a **combinational** circuit with few inputs you can try **every combination**: n inputs → **2<sup>n</sup>** test vectors. A 4-bit adder with carry-in has 9 inputs → 2<sup>9</sup> = 512 vectors, which runs in an instant. For a 32-bit adder (2<sup>65</sup>) this is impossible – there we test **random** vectors and the **corner cases** (0, maximum, overflow).
- For a **sequential** circuit the states and transitions must be covered: reset, every state, the rare branches (e.g. counter overflow), illegal input sequences.
- A **self-checking** testbench decides by itself whether the result is correct; so after every change it can be rerun at the press of a button (regression test).

## Waveforms and simulators

The simulator shows all signals on a **waveform** – on it you trace the bug backwards, from the wrong output to the faulty internal signal.

| tool                      | language      | note                                        |
| ------------------------- | ------------- | ------------------------------------------- |
| ModelSim / Questa         | VHDL, Verilog | industry standard, with a free FPGA edition |
| Vivado Simulator (XSim)   | VHDL, Verilog | part of AMD/Xilinx Vivado                   |
| GHDL                      | VHDL          | open source                                 |
| Icarus Verilog, Verilator | Verilog       | open source                                 |
| GTKWave                   | –             | open-source waveform viewer (VCD file)      |

```python run
# A "testbench" in Python: checking every input combination of the full adder
def full_adder(a, b, cin):                    # the "circuit" under test (DUT), from gates
    s = a ^ b ^ cin
    cout = (a & b) | (cin & (a ^ b))
    return s, cout

errors = 0
for i in range(8):                            # 2^3 = 8 test vectors
    a, b, cin = (i >> 2) & 1, (i >> 1) & 1, i & 1
    s, cout = full_adder(a, b, cin)
    expected = a + b + cin                    # reference: integer addition
    if 2 * cout + s != expected:
        errors += 1
        print("ERROR:", a, b, cin)
print("8 vectors run,", errors, "errors")
```

## Summary

- Functional simulation: logic, without delays; timing simulation: with real delays.
- Testbench: no ports, instantiates the DUT, applies stimulus and a clock, checks (assert, $display).
- Combinational circuit: n inputs → 2<sup>n</sup> vectors; for large ones, random and corner cases.
- Self-checking testbench → fast regression test; debugging on the waveform.

## Lesson exercise

```quiz required
? How many test vectors are needed to test a 4-bit adder (two 4-bit numbers + carry-in) exhaustively?
= 512
! 4 + 4 + 1 = 9 inputs.

? In a Verilog testbench (timescale 1ns/1ps): always #5 clk = ~clk; What is the clock in MHz?
= 100
! It toggles every 5 ns, so the period is 10 ns.

? Fill in the truth table of the simulated module! assign Y = (A & B) | C;
table: A, B, C -> Y = A·B + C

? Why does a testbench have no ports?
- Because the ports are given by the constraint file.
+ Because it is the top level that runs only in the simulator and connects the DUT with internal signals.
- Because a testbench may contain only combinational logic.
- Because ports would slow down the simulation.

? What is the difference between functional and timing simulation?
+ Functional simulation examines the HDL logic without delays, timing simulation runs with the real delays of the routed design.
- Functional can simulate only sequential, timing only combinational circuits.
- There is no difference, only the name of the simulator differs.
- Timing simulation runs on the real FPGA.

? What does it mean that a testbench is self-checking?
- It fixes the faulty HDL code by itself.
+ It compares the output with the expected value itself and reports an error on a mismatch.
- It runs only if there is no error.
- It prints the waveform automatically.
```
