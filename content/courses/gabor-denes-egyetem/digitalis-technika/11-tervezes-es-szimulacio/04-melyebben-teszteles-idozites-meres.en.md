---
title: Deeper – Testing, Timing and Measurement in Numbers
summary: A self-checking testbench that always finds a hidden bug with an exhaustive test, but only sometimes with a few random vectors; static timing analysis with slack and finding the critical path; the sampling rate and memory depth of a logic analyser in practice.
minutes: 40
---

## What you will learn in this lesson

- to run a **self-checking testbench** on a faulty circuit, and see **in numbers** what exhaustive and random testing are worth,
- to perform **static timing analysis**: calculate the slack for every path, and find the critical path,
- to **calculate** how long a logic analyser records, and whether it samples densely enough for the signal.

## 1. What is testing worth? – on the trail of a hidden bug

The essence of a testbench: we give the same input to the designed circuit (_DUT – device under test_) and to a simple, **certainly correct reference model**, and compare the outputs automatically. This time we deliberately hid a **rare** bug in a 4-bit adder: the carry is lost only for certain input pairs.

```python run
# Self-checking testbench: a 4-bit adder (DUT) with a hidden bug – exhaustive and random tests
import random

def dut_adder(a, b):
    # the "designed" hardware: a rare bug when both numbers are odd and their top bit is 1
    s = (a + b) & 0x1F
    if a & 0b1000 and b & 0b1000 and a & 1 and b & 1:
        s &= 0x0F                                    # the bug: the 5th bit is lost
    return s

def reference(a, b):
    return a + b                                     # the "certainly correct" model

# 1) exhaustive test: all 16 · 16 = 256 input combinations
bugs = [(a, b) for a in range(16) for b in range(16) if dut_adder(a, b) != reference(a, b)]
print(f"exhaustive test: {len(bugs)} of 256 cases wrong, the first: a={bugs[0][0]}, b={bugs[0][1]}")

# 2) random test: only a few random inputs – do we notice?
for n in [10, 100]:
    found = 0
    for seed in range(100):                          # 100 different random test runs
        r = random.Random(seed)
        found += any(dut_adder(a, b) != reference(a, b)
                     for a, b in ((r.randrange(16), r.randrange(16)) for _ in range(n)))
    print(f"random test with {n:>3} vectors: {found} of 100 runs found the bug")
```

Lessons:

- The **exhaustive** test (all 256 combinations) **always** finds the bug – the faulty cases appear in only 16 of 256.
- With **10 random** vectors we don't find the bug in even **half** of the runs – the test is "green", and the bug turns up in the finished product. With 100 vectors we find it almost certainly.
- An exhaustive test is cheap for a small circuit, but quickly becomes unmanageable: two 32-bit inputs are 2<sup>64</sup> ≈ 1.8 · 10<sup>19</sup> combinations – even at a billion tests per second that's **more than 500 years**. That's why real verification supplements random testing with **directed** tests (the edge cases: 0, maximum, carry, overflow) and **coverage measurement**: the simulator measures which line of the code and which state transition has already run.

The bug here sits near an edge case (both inputs are large, with their top bit 1) – a good directed test ("what if both numbers are big?") would very likely have caught it.

## 2. Static timing analysis: does every path fit?

After synthesis the design tool calculates **every** path from flip-flop to flip-flop: when the signal arrives (t<sub>CQ</sub> + the delays of the gates), and how much time is left until the next clock edge, minus the setup time. This is the **slack**:

**slack = T<sub>clock</sub> − t<sub>setup</sub> − (t<sub>CQ</sub> + t<sub>logic</sub>)**

```python run
# Static timing analysis: slack for every path, with a 100 MHz clock
T_CLK = 10.0                                         # ns
T_CQ, T_SETUP = 0.5, 0.3                             # ns, flip-flop data

paths = {                                            # path name → gate delays (ns)
    "counter → comparator": [1.2, 1.2, 0.8],
    "register → ALU → register": [1.5, 2.0, 2.0, 1.8, 1.2],
    "register → multiplier → reg.": [2.5, 2.5, 2.5, 2.0],
    "input → synchronizer": [0.4],
}
print(f"{'path':<32} {'arrival':>8} {'slack':>9}")
for name, delays in sorted(paths.items(), key=lambda p: -sum(p[1])):
    arrival = T_CQ + sum(delays)                     # when the data is stable at the target flip-flop
    slack = T_CLK - T_SETUP - arrival                # positive: it fits; negative: timing violation
    print(f"{name:<32} {arrival:>6.1f} ns {slack:>+7.1f} ns" + ("  ← VIOLATION" if slack < 0 else ""))

critical = max(T_CQ + sum(d) for d in paths.values())
print(f"\ncritical path: {critical:.1f} ns → f_max = {1000 / (critical + T_SETUP):.0f} MHz")
```

- A positive slack means the path **fits** into the clock period.
- The multiplier's path with a **negative** slack (−0.3 ns) is a **timing violation**: at 100 MHz the multiplier's result doesn't arrive in time, and the target flip-flop may store a wrong value. Simulation won't necessarily show this (functional simulation calculates without delays!), which is why timing analysis is mandatory.
- Possible fixes: a slower clock (97 MHz still works), **cutting** the multiplier in two with an intermediate register (pipeline, topic 7), or using the FPGA's dedicated **DSP block**, which multiplies faster.

The first line of the design tool's timing report is always the **worst slack** (_WNS – worst negative slack_). If it's negative, the design isn't finished, however well it works in simulation.

## 3. Logic analyser: how much do we see, and how sharply?

Two numbers decide everything with a logic analyser: the **sampling rate** (how many samples per second it takes) and the **memory depth** (how many samples it can store). The rule of thumb: there should be **at least 4** (preferably 10) samples per period of the measured signal, otherwise the signal's edges become inaccurate or may even disappear.

```python run
# Logic analyser: sampling rate and memory depth → how much time do we see?
def capture(sample_rate, memory, signal_hz):
    time_s = memory / sample_rate                    # how long until the memory is full
    samples_per_period = sample_rate / signal_hz     # how many samples per period of the signal
    return time_s, samples_per_period

for sample_rate, memory, signal_hz, name in [(24e6, 1e6, 1e6, "cheap USB, SPI 1 MHz"),
                                             (24e6, 1e6, 10e6, "cheap USB, SPI 10 MHz"),
                                             (500e6, 64e6, 10e6, "benchtop, SPI 10 MHz")]:
    t, spp = capture(sample_rate, memory, signal_hz)
    verdict = "good" if spp >= 4 else "TOO FEW samples – the signal will be distorted"
    print(f"{name:<24} {sample_rate / 1e6:>4.0f} MS/s, {memory / 1e6:>3.0f} M samples → "
          f"{t * 1000:>7.1f} ms capture, {spp:>5.1f} samples/period: {verdict}")
```

- A cheap 24 MS/s USB analyser is plenty for a 1 MHz SPI bus (24 samples per period), but with a **10 MHz** SPI only 2.4 samples fall on a period – the protocol decoder will show wrong bytes, even though the bus is fine! In that case it's the instrument that's at fault, not the circuit.
- Capture time = memory depth / sampling rate. If you're looking for a rare fault, the solution isn't more memory but the **trigger**: the analyser should only start recording when the event you're looking for (e.g. a particular byte or an error signal) occurs.

## Summary

- Testbench: DUT + reference model + automatic comparison. An exhaustive test is certain, but only possible with few inputs; a few random tests can easily miss a rare bug. Directed tests (edge cases) + coverage are needed.
- Static timing analysis: slack = T − t<sub>setup</sub> − (t<sub>CQ</sub> + t<sub>logic</sub>); negative slack = timing violation, which functional simulation doesn't show.
- Logic analyser: at least 4–10 samples per period of the signal; capture time = memory / sampling rate; a trigger for rare events.

## Lesson exercise

```quiz required
? How many input combinations must an exhaustive test try for an adder with two 8-bit inputs?
= 65536
! 2^8 · 2^8 = 2^16 = 65,536.

? A path: tCQ = 1 ns, logic = 6 ns, tsetup = 0.5 ns, clock 125 MHz (T = 8 ns). What is the slack (ns, one decimal)?
= 0.5
= 0,5
! 8 − 0.5 − (1 + 6) = 0.5 ns.

? What does a negative slack on a path mean?
- the path is unnecessarily fast
+ the signal doesn't reach the target flip-flop in time: a timing violation
- the hold time is too long
- the simulation is wrong
! The design must be fixed: a slower clock, a pipeline or faster logic.

? A logic analyser samples at 100 MS/s and its memory is 10 million samples. How many ms can it record?
= 100
! 10,000,000 / 100,000,000 s = 0.1 s = 100 ms.

? Why does the exhaustive test always find the hidden bug, while the 10-vector random test finds it in only about half of the runs?
- because the random test doesn't check the output
+ because the bug appears in only 16 of the 256 cases, and 10 random vectors often hit none of them
- because the random number generator is faulty
- because the exhaustive test is faster
! The chance that none of 10 tries hits is (240/256)^10 ≈ 52%.
```
