---
title: Practice – Digital Design and Simulation
summary: Review questions and a summary worksheet: design steps, setup and hold, critical path, synchronous design, testbenches, test vectors, debugging and measurement.
minutes: 60
kind: practice
---

## Review questions

<details>
<summary>1. Why does it pay to find bugs as early as possible, already in simulation?</summary>

Because every later step is more expensive: in simulation every internal signal is visible and a fix can be rerun in minutes. On the real board you can measure only at the pins, reprogramming takes minutes, and for a custom chip a bug discovered after manufacturing can mean a re-spin costing millions.

</details>

<details>
<summary>2. What can you do if a path does not fit into the clock period (negative slack)?</summary>

You can lower the clock frequency; simplify or restructure the combinational logic (e.g. a faster adder); or cut the long path into two shorter ones with a pipeline register – then a higher clock is possible, but the result comes one clock later.

</details>

<details>
<summary>3. Why must a signal from a button be both synchronised and debounced?</summary>

The button changes independently of the clock, so it can violate the flip-flop's setup/hold time and cause metastability – the two-flip-flop synchroniser protects against this. In addition the mechanical contact bounces for a few ms, so one press would look like several pulses – debouncing protects against that.

</details>

<details>
<summary>4. What is the difference between a logic analyser and an oscilloscope?</summary>

A logic analyser records only the logic level (0/1) on many channels, triggers on patterns and decodes protocols – it is for examining the logic of operation. An oscilloscope shows the real voltage waveform (levels, edges, noise, overshoot) on a few channels – for signal-integrity, analogue-like problems.

</details>

<details>
<summary>5. How do you test a 32-bit adder if an exhaustive test is impossible?</summary>

With random input vectors (many thousands or millions), complemented by the corner cases: 0, maximum value, overflow, a carry rippling through every bit (e.g. 0xFFFFFFFF + 1). The self-checking testbench compares the result with the value of a reference model (e.g. integer addition).

</details>

## Summary worksheet

```quiz required
? On a path t_cq = 0.5 ns, the logic is 3.5 ns, t_su = 1 ns. What is the maximum clock frequency in MHz?
= 200
! 1 / 5 ns.

? How many test vectors are needed to test a 6-input combinational circuit exhaustively?
= 64

? Based on the exhaustive test of the testbench, fill in the truth table of the module! assign Y = A ^ (B & C);
table: A, B, C -> Y = A ⊕ B·C

? In a Verilog testbench (timescale 1ns/1ps): always #10 clk = ~clk; What is the clock in MHz?
= 50
! The period is 20 ns.

? What is the bit time in μs of a 9600 bit/s UART signal? (Round to an integer!)
= 104

? A scope has 1 MSa of memory and a sample rate of 100 MSa/s. How many ms can it record?
= 10

? According to the measurement, a wire is always 0, whatever the circuit does. What is the most likely fault?
- floating input
+ stuck-at signal (e.g. a short to ground)
- metastability
- too high a sample rate

? What is the correct way to stop a register from being clocked?
- Gate its clock with an AND gate.
+ Use an enable input and leave the clock unchanged.
- Put an inverter into the clock.
- Tie its clock input to ground.
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Timing slack.** Write the `slack(t_clk, t_cq, t_logic, t_setup)` function (in ns, rounded to two decimals), and the `worst(t_clk, t_cq, t_setup, paths)` function, which returns the name and slack of the path with the smallest slack from a `{name: logic delay}` dictionary!

```python starter
def slack(t_clk, t_cq, t_logic, t_setup):
    return 0

def worst(t_clk, t_cq, t_setup, paths):
    return ("", 0)
```

<details>
<summary>Solution</summary>

```python solution
def slack(t_clk, t_cq, t_logic, t_setup):
    return round(t_clk - t_setup - (t_cq + t_logic), 2)

def worst(t_clk, t_cq, t_setup, paths):
    name = min(paths, key=lambda n: slack(t_clk, t_cq, paths[n], t_setup))   # the critical path
    return (name, slack(t_clk, t_cq, paths[name], t_setup))
```

</details>

```python test
assert slack(8, 1, 6, 0.5) == 0.5
assert slack(10, 0.5, 9.5, 0.3) == -0.3
paths = {"multiplier": 9.5, "ALU": 8.5, "counter": 3.2}
assert worst(10, 0.5, 0.3, paths) == ("multiplier", -0.3)
print("All checks passed!")
```

**2.** **Self-checking test.** Write the `test(dut, reference, n_bits)` function, which compares two functions with n-bit inputs for **every** input pair, and returns the list of faulty `(a, b)` pairs!

```python starter
def test(dut, reference, n_bits):
    return []
```

<details>
<summary>Solution</summary>

```python solution
def test(dut, reference, n_bits):
    bugs = []
    for a in range(2 ** n_bits):
        for b in range(2 ** n_bits):         # exhaustive test: every combination
            if dut(a, b) != reference(a, b):
                bugs.append((a, b))
    return bugs
```

</details>

```python test
good = lambda a, b: a + b
bad = lambda a, b: (a + b) & 0x0F             # forgotten carry
assert test(good, good, 4) == []
assert len(test(bad, good, 4)) == 120         # this many cases have a carry
assert test(bad, good, 4)[0] == (1, 15)
print("All checks passed!")
```

**3.** **Setting up a logic analyser.** Write the `analyser(samples_per_s, memory, signal_hz)` function, which returns the capture time in ms (rounded to one decimal), and whether there are at least 4 samples per period of the signal: `(time_ms, enough)`!

```python starter
def analyser(samples_per_s, memory, signal_hz):
    return (0, True)
```

<details>
<summary>Solution</summary>

```python solution
def analyser(samples_per_s, memory, signal_hz):
    time_ms = round(memory / samples_per_s * 1000, 1)   # when the memory fills up
    enough = samples_per_s / signal_hz >= 4              # rule of thumb: ≥ 4 samples / period
    return (time_ms, enough)
```

</details>

```python test
assert analyser(24e6, 1e6, 1e6) == (41.7, True)
assert analyser(24e6, 1e6, 10e6) == (41.7, False)
assert analyser(100e6, 10e6, 25e6) == (100.0, True)
print("All checks passed!")
```

### Quick check questions

```quiz
? What is the difference between functional and timing simulation?
+ functional looks at the logical behaviour without delays; timing uses the real delays
- functional is slower
- timing simulates only the clock
! That's why a negative slack doesn't show up in functional simulation.

? What is the DUT in a testbench?
- the module producing the stimulus signals
+ the circuit under test
- the reference model
! The testbench drives the DUT and checks its outputs.

? What does a hold time violation mean?
- the signal arrives too late before the clock edge
+ the signal changes too soon after the clock edge
- the clock is too slow
! A hold violation can't be fixed by slowing the clock.

? What is the trigger on a logic analyser for?
+ to start recording when a given event occurs
- to sample faster
- to use more memory
! The most important tool for catching rare faults.

? How many input combinations does an exhaustive test of a 4-bit adder need (two 4-bit inputs)?
= 256
! 2^4 · 2^4 = 256.
```
