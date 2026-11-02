---
title: Summary Project – a Digital Stopwatch on an FPGA
summary: A design task tying the whole course together, step by step – specification, block diagram, clock-enable signal, synchronising and debouncing the buttons, state machine, BCD counter chain, multiplexed seven-segment display, Verilog code, testbench, pin assignment and bring-up.
minutes: 50
---

## What you will learn

- how to design a complete digital system **from specification to working hardware**,
- how the topics of the course fit together in a real task,
- what the structure of a small **Verilog** project looks like.

## The specification

On an FPGA development board (100 MHz clock, 2 push buttons, 4-digit seven-segment display) we build a **stopwatch**:

- the display shows the time as **seconds.hundredths**: **00.00 … 59.99**, then it counts again from 00.00;
- the **START/STOP** button starts and stops it;
- the **RESET** button stops it and clears it.

## The block diagram (top-down decomposition)

```text
 100 MHz ──> [ time base ] ──> tick (100 Hz): to the button handlers and the counter chain

 START/STOP ──> [ button handler ] ──┐
                                     ├──> [ state machine: STOP / RUN ]
 RESET ───────> [ button handler ] ──┘                │ run, reset
                                                      v
                    [ BCD chain: hundredths → tenths → seconds → tens of s ]
                                                      │ d0 … d3
                                                      v
                    [ display driver: MUX, decoder, 7-segment ] ──> display
```

**Button handler** = synchroniser + debouncer + edge detector (step 2).

Every box is a separate Verilog module that you can test separately (topic 11).

## 1. Time base: a clock-enable signal

We do **not** produce the 100 Hz rate by driving the counters with a divided clock – that would break the rule of synchronous design (topic 11). Instead everything runs from the 100 MHz clock, and an **enable pulse** (tick) indicates when to step: a pulse one clock long every 100 MHz / 100 Hz = **1,000,000** clocks. The counter counts from 0 to 999,999, which needs **20 bits** (2<sup>20</sup> = 1,048,576).

```verilog
// Time base: a tick pulse one clock long every 1,000,000 clocks (100 MHz → 100 Hz)
reg  [19:0] divider = 0;
wire        tick    = (divider == 20'd999_999);
always @(posedge clk)
  divider <= tick ? 20'd0 : divider + 1'b1;
```

## 2. Buttons: synchronising and debouncing

A button is an asynchronous signal, and it bounces too. First we align it to the clock with a **two-flip-flop synchroniser** (topic 11), then against bouncing we sample it only **every 10 ms** (at the 100 Hz tick) – the bouncing is shorter than that. If the previous sample was 0 and the current one is 1, we give a single “pressed” pulse one clock long (edge detection).

```verilog
// Button: synchronisation, 10 ms sampling, rising edge → a one-clock pulse
module button (input clk, input tick, input btn, output press);
  reg [1:0] sync = 0;              // two-flip-flop synchroniser
  reg       prev = 0, curr = 0;    // two consecutive 10 ms samples
  always @(posedge clk) begin
    sync <= {sync[0], btn};
    if (tick) begin
      prev <= curr;
      curr <= sync[1];
    end
  end
  assign press = tick && curr && !prev;    // 0 → 1 change: signals once
endmodule
```

## 3. State machine

Two states are enough: **STOP** and **RUN** (topic 6, a Moore machine: the run output depends only on the state). The START/STOP pulse toggles between them, RESET always goes to STOP.

```text
           START/STOP
   STOP ─────────────────> RUN
        <─────────────────
           START/STOP

   RESET: from either state → STOP (and the counters are cleared)
```

```verilog
// State machine: STOP (0) and RUN (1)
reg run = 1'b0;
always @(posedge clk)
  if (reset_pr)       run <= 1'b0;   // stops on reset
  else if (start_pr)  run <= ~run;   // START/STOP: toggles
```

## 4. BCD counter chain

Four BCD digits: **hundredths** (mod-10), **tenths** (mod-10), **seconds units** (mod-10), **seconds tens** (mod-6) – synchronous counters (topic 5) running from the same clock, chained through their **enable** input: the next digit steps when the previous one is at its maximum **and** is about to step (carry).

```verilog
// One BCD digit: 0 … MAX, with enable; carry when it would step past MAX
module bcd_digit #(parameter MAX = 9) (
  input clk, input rst, input en,
  output reg [3:0] q = 0, output carry
);
  assign carry = en && (q == MAX);
  always @(posedge clk)
    if (rst)     q <= 4'd0;
    else if (en) q <= (q == MAX) ? 4'd0 : q + 1'b1;
endmodule

// The chain: the hundredths step on the tick (if running), the others on the previous carry
wire [3:0] d0, d1, d2, d3;           // the values of the four digits
wire       c0, c1, c2;               // carries
bcd_digit #(9) hundredths (.clk(clk), .rst(reset_pr), .en(tick && run), .q(d0), .carry(c0));
bcd_digit #(9) tenths     (.clk(clk), .rst(reset_pr), .en(c0),          .q(d1), .carry(c1));
bcd_digit #(9) sec1       (.clk(clk), .rst(reset_pr), .en(c1),          .q(d2), .carry(c2));
bcd_digit #(5) sec10      (.clk(clk), .rst(reset_pr), .en(c2),          .q(d3), .carry());
```

Recognising “state 9” with gates: in BCD the codes 10–15 never occur (don't-cares), so to recognise 9 = 1001 **Q3·Q0** is enough (topic 4, Karnaugh map with don't-care cells).

## 5. Multiplexed display

The segments of the four digits are driven by shared wires; only **one digit** is lit at a time, but we switch so fast that the eye sees all four continuously. The top two bits of a 17-bit counter select the digit (topic 4: a **multiplexer** for the BCD value, a **decoder** for the anodes, a **code converter** for the seven segments). Every digit is refreshed at 100 MHz / 2<sup>17</sup> ≈ 760 Hz.

```verilog
// Display: digit selection, MUX, BCD → 7 segments (segments and anodes are active low)
reg  [16:0] refresh = 0;
always @(posedge clk) refresh <= refresh + 1'b1;
wire [1:0]  sel = refresh[16:15];

reg [3:0] bcd;
reg [3:0] anode;                      // anodes (active low)
reg [6:0] seg;                        // segments (active low)
always @* begin
  case (sel)                          // multiplexer
    2'd0: bcd = d0;  2'd1: bcd = d1;
    2'd2: bcd = d2;  default: bcd = d3;
  endcase
  anode = ~(4'b0001 << sel);          // decoder: one anode active (0)
  case (bcd)                          // code converter: gfedcba, 0 = lit
    4'd0: seg = 7'b1000000;  4'd1: seg = 7'b1111001;
    4'd2: seg = 7'b0100100;  4'd3: seg = 7'b0110000;
    4'd4: seg = 7'b0011001;  4'd5: seg = 7'b0010010;
    4'd6: seg = 7'b0000010;  4'd7: seg = 7'b1111000;
    4'd8: seg = 7'b0000000;  4'd9: seg = 7'b0010000;
    default: seg = 7'b1111111;
  endcase
end
assign dp = ~(sel == 2'd2);           // decimal point after the seconds units
```

## 6. Simulation, pin assignment, bring-up

- **Testbench** (topic 11): waiting 1,000,000 clocks in simulation is slow, so the time base can be sped up with a **parameter** (e.g. a tick every 10 clocks in the test). Check: the 9 → 0 transition and the carry, the 59.99 → 00.00 overflow, the START/STOP toggle and the reset.
- **Constraint file** (topic 9): the clock pin and `create_clock -period 10.000` (100 MHz), the pins of the buttons, the 7 segments, the decimal point and the 4 anodes according to the board's schematic.
- **Timing:** after implementation, check that there is no negative slack.
- **Bring-up** (topic 11): if something does not work – is the clock running, is the pin assignment right, is the active level of the segments or the anodes not inverted (active low or high?). You can look at internal signals with the built-in logic analyser (ILA).

**Ideas for extension:** split (lap) time measurement, showing minutes, a countdown mode, a beep with PWM, sending the result to the PC over UART (topic 10).

```python run
# Behavioural model of the stopwatch: 100 Hz tick, BCD chain, overflow after 59.99
def step(d):                       # d = [hundredths, tenths, seconds units, seconds tens]
    maxima = [9, 9, 9, 5]
    for i in range(4):
        if d[i] == maxima[i]:
            d[i] = 0               # carry into the next digit
        else:
            d[i] += 1
            break
    return d

def display(d):
    return f"{d[3]}{d[2]}.{d[1]}{d[0]}"

d = [0, 0, 0, 0]
for t in range(1, 6001):
    d = step(d)
    if t in (1, 10, 100, 1234, 5999, 6000):
        print(f"{t:5} ticks -> {display(d)}")
print("different displayed values:", 60 * 100)
```

## Summary

- Top-down decomposition: time base, button handling, state machine, BCD counter chain, display driver – separate modules, tested separately.
- One clock, enable (tick) pulses; for asynchronous buttons a synchroniser + debouncing + edge detection.
- The project uses almost every topic: codes (BCD, 7-segment), combinational networks (MUX, decoder), synchronous counters, state machine, HDL, timing, simulation, debugging.

## Lesson exercise

```quiz required
? The board clock is 100 MHz, the stopwatch steps at a 100 Hz rate. Every how many clocks is a tick pulse needed?
= 1000000
= 1 000 000

? At least how many bits does a counter need to count from 0 to 999,999?
= 20
! 2^19 = 524,288 is too few, 2^20 = 1,048,576 is enough.

? State 9 of a BCD digit (Q3 Q2 Q1 Q0) must be recognised; the codes 10–15 never occur. Give the simplest expression!
expr: Q3, Q2, Q1, Q0 -> Q3·Q0
limit: 2
dc: 10, 11, 12, 13, 14, 15
! You may include the don't-care cells in the grouping.

? How many different values can the stopwatch show (00.00 … 59.99)?
= 6000

? On the 4-digit multiplexed display every digit must be refreshed 250 times per second. At how many Hz must we switch between the digits?
= 1000

? Why do we step the counters with an enable (tick) pulse rather than a divided clock?
- Because a clock cannot be divided in an FPGA.
+ Because then every flip-flop runs from the same clock (synchronous design), and we avoid the timing problems of derived clocks.
- Because the tick pulse is faster than the clock.
- Because then fewer flip-flops are needed.

? Why do we sample the synchronised button signal only every 10 ms?
- To consume less power.
+ Because the button bounce is shorter than that, so one press gives a single pulse.
- Because the display is only 100 Hz.
- Because the synchroniser is slow.
```
