---
title: Verilog Basics
summary: module, input/output, wire and reg, assign, bitwise operators, the conditional operator, always blocks, blocking and non-blocking assignment, a counter and a sequence detector in Verilog.
minutes: 40
---

## What you will learn

- the structure of a Verilog **module** (ports, **wire** and **reg**),
- describing **combinational** logic with **assign** and **always @(*)**,
- **sequential** logic with **always @(posedge clk)**,
- the difference between **blocking** (`=`) and **non-blocking** (`<=`) assignment,
- the Verilog code of a **counter** and a **state machine**.

## The nature of Verilog

Besides VHDL, **Verilog** is the other widespread hardware description language. Its syntax resembles **C**, it is more concise and less strict about types; it is case-sensitive; comments are `//` or `/* … */`. Its successor is **SystemVerilog**, which also offers many tools for verification.

## Module, ports, wire and reg

```verilog
// An AND gate
module and_gate (
  input  wire A,
  input  wire B,
  output wire Y
);
  assign Y = A & B;
endmodule
```

- **module … endmodule**: the circuit (like a VHDL entity + architecture together).
- Ports: **input**, **output**, **inout**; a bus: `input [7:0] data` (8 bits, bit 7 the most significant).
- **wire**: a wire – continuously driven by something (assign, the output of another module).
- **reg**: a variable that receives its value **in an always block**. (The name is misleading: it does not always become a register – only if it is written on a clock edge.)
- Numbers: `4'b1010` (4-bit binary, value 10), `8'hFF` (8-bit hexadecimal), `8'd200` (decimal).

## Combinational logic

**Bitwise operators:** `&` (AND), `|` (OR), `^` (XOR), `~` (NOT), `~^` (XNOR). Precedence: `~` > `&` > `^` > `|` – as in Boolean algebra (topic 3).

```verilog
assign Y = (A & ~B) | C;      // Y = A·B̅ + C
assign S = A ^ B ^ Cin;       // sum bit of a full adder
assign M = S ? D1 : D0;       // 2:1 multiplexer with the conditional operator
```

**always @(*)** – a combinational block in which `if` and `case` can be used. The `*` means: it runs whenever any signal it reads changes.

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

Important: in a combinational block the output must receive a value **on every branch** (hence the `default`), otherwise synthesis creates an unwanted **latch**.

## Sequential logic: always @(posedge clk)

```verilog
// D flip-flop with synchronous reset
always @(posedge clk) begin
  if (rst)
    q <= 1'b0;
  else
    q <= d;
end
```

Because of `posedge clk` (rising edge) – or `negedge clk` (falling edge) – it becomes a flip-flop.

### Blocking and non-blocking assignment

- **`=` (blocking):** takes effect immediately, the next line already sees the new value – for **combinational** blocks.
- **`<=` (non-blocking):** all assignments happen **simultaneously** at the edge, computed from the old values – for **sequential** blocks.

Example: `a <= b; b <= a;` **swaps** the two registers on one edge (two cross-connected flip-flops). With blocking (`a = b; b = a;`) both would get the value of b. Rule: **always `<=` in a clocked block**.

## Example: 4-bit counter

```verilog
module counter (
  input  wire       clk,
  input  wire       rst,
  output reg  [3:0] q
);
  always @(posedge clk) begin
    if (rst)
      q <= 4'd0;
    else
      q <= q + 4'd1;     // after 1111 comes 0000
  end
endmodule
```

## Example: the “101” sequence detector (Moore)

The Moore machine of topic 6 in Verilog:

```verilog
module detector (
  input  wire clk, rst, x,
  output wire y
);
  localparam A = 2'd0, B = 2'd1, C = 2'd2, D = 2'd3;
  reg [1:0] state;

  // State register + next-state logic
  always @(posedge clk) begin
    if (rst) state <= A;
    else case (state)
      A: state <= x ? B : A;
      B: state <= x ? B : C;
      C: state <= x ? D : A;
      D: state <= x ? B : C;
    endcase
  end

  // Moore output: depends only on the state
  assign y = (state == D);
endmodule
```

## VHDL and Verilog side by side

| concept            | VHDL                              | Verilog                          |
| ------------------ | --------------------------------- | -------------------------------- |
| unit               | entity + architecture             | module                           |
| ports              | `in`, `out`, `inout`              | `input`, `output`, `inout`       |
| bus                | `std_logic_vector(7 downto 0)`    | `[7:0]`                          |
| combinational      | `Y <= A and B;`                   | `assign Y = A & B;`              |
| clock edge         | `if rising_edge(clk) then`        | `always @(posedge clk)`          |
| comment            | `--`                              | `//`                             |

## Summary

- module, input/output, wire (continuously driven) and reg (assigned in always).
- Combinational: `assign`, `always @(*)` – assign a value on every branch (otherwise a latch).
- Sequential: `always @(posedge clk)` and **non-blocking** `<=`.
- Operators: `~` > `&` > `^` > `|`; conditional operator: `S ? D1 : D0`.

## Lesson exercise

```quiz required
? Which function does this Verilog line implement? assign Y = (A & ~B) | C; – write it as an expression!
expr: A, B, C -> A·B' + C

? Which function does it implement? assign Y = A ^ B ^ C; – write it as an expression!
expr: A, B, C -> A ⊕ B ⊕ C
! The sum bit of a full adder.

? Which assignment do we use in a clocked (always @(posedge clk)) block?
- blocking (=)
+ non-blocking (<=)
- assign
- either, it does not matter

? What is the value of the Verilog number 4'b1010 in decimal?
= 10

? How many bits wide is the following port? input [7:0] data
= 8

? What happens if the output does not receive a value on every branch of an always @(*) block?
- A compile error, the code does not run.
+ Synthesis creates an unwanted storage element (latch).
- The output automatically becomes 0.
- Nothing, the output simply does not change, and that is always fine.
```
