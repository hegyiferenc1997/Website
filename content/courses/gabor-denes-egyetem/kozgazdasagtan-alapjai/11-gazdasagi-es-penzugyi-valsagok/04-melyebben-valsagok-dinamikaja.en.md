---
title: Deeper – The Dynamics of Crises
summary: How the business cycle arises "by itself" (Samuelson's multiplier–accelerator model), why leverage makes banks and investors fragile, and how government debt develops depending on the interest rate, growth and the budget balance – with a slider chart.
minutes: 40
---

## What you will learn in this lesson

- how a single small push can cause **fluctuations** in the economy without external causes,
- why a 10% price fall can **bankrupt** highly leveraged players,
- what makes a country's debt-to-GDP ratio **grow** or **shrink**.

## 1. The cycle from inside: multiplier and accelerator

Paul Samuelson's 1939 model links two simple behaviours: consumption depends on last year's income (**multiplier**), and investment on the **growth** of demand – if sales grow, firms expand capacity; if they stagnate, they don't build anything new (**accelerator**). After a small demand shock (printed every two years):

```python run
# Samuelson's multiplier–accelerator model: how does the business cycle arise by itself?
# Y_t = C_t + I_t + G; C_t = c·Y_(t−1); I_t = v·(C_t − C_(t−1))  (investment reacts to the GROWTH of demand)
def simulate(c, v, G=100, years=24):
    Y = [500.0, 520.0]                            # after a small demand shock
    C_prev = c * Y[0]
    for t in range(2, years):
        C = c * Y[-1]
        I = v * (C - C_prev)                      # accelerator: if consumption grows, capacity must be expanded
        Y.append(C + I + G)
        C_prev = C
    return Y

for c, v, name in [(0.8, 0.5, "damped cycle"), (0.8, 1.25, "constant cycle"), (0.8, 1.5, "ever stronger swings")]:
    Y = simulate(c, v)
    print(f"c = {c}, v = {v} ({name}):")
    print("   " + " ".join(f"{y:4.0f}" for y in Y[:24:2]))
```

- With a weak accelerator ($v = 0.5$) the shock dies away, and the economy returns to equilibrium (500).
- With a stronger one a **regular fluctuation** remains – boom, downturn, boom again – without any external shock!
- With an even stronger reaction the swings grow larger and larger: excessive investment waves (e.g. the dotcom frenzy) make the economy unstable.

The lesson: the cycle isn't necessarily an "accident", it can also follow from players' **reasonable reactions**. That's why institutions that dampen the swings (automatic stabilisers, the central bank) are needed.

## 2. Leverage: the amplifier of crises

An investor (or bank) uses little own money and a lot of debt. What happens if its assets lose 10% of their value?

```python run
# Leverage: how much of your own capital is left if your assets lose 10% of their value?
fall = 0.10
for leverage in [1, 2, 5, 10, 30]:                # assets / equity
    assets, equity = 100.0, 100.0 / leverage     # 100 units of assets, of which this much is own money
    debt = assets - equity
    left = assets * (1 - fall) - debt            # the debt doesn't shrink!
    status = "BANKRUPT (equity wiped out)" if left <= 0 else f"equity {100 * (left / equity - 1):+.0f}%"
    print(f"leverage {leverage:>2}×: {status}")
```

Without debt a 10% fall is a 10% loss. With 10× leverage, however, **all the equity is wiped out**, and at 30× it can't even repay its debt. In 2007–2008 some investment banks operated with 30–40× leverage – a fall of a few percent in property prices was enough for them to collapse (Lehman Brothers). That's why regulators (Basel III) require a minimum **capital adequacy** for banks: part of the assets must be financed with equity.

What's more, the loss is **self-reinforcing**: players in trouble have to sell their assets, which pushes prices down further, which gets more players into trouble (a **fire-sale spiral**).

## 3. Government debt dynamics

The debt-to-GDP ratio is shaped by three things: **interest** increases it, **economic growth** "dilutes" it (the denominator grows), and the **primary balance** (the budget balance excluding interest spending) reduces or increases it:

```python run
# Government debt dynamics: d' = d·(1 + r)/(1 + g) − primary balance (as % of GDP)
def path(d, r, g, primary, years=20):
    for _ in range(years):
        d = d * (1 + r) / (1 + g) - primary       # interest increases it, growth "dilutes" it, a surplus reduces it
    return d

d0 = 75.0                                         # initial debt: 75% of GDP
cases = [("interest < growth, zero balance", 0.03, 0.05, 0),
         ("interest > growth, zero balance", 0.06, 0.03, 0),
         ("interest > growth, 2% primary surplus", 0.06, 0.03, 2),
         ("interest > growth, 2% primary deficit", 0.06, 0.03, -2)]
for name, r, g, p in cases:
    print(f"{name:<38}: in 20 years {path(d0, r, g, p):5.1f}%")
```

If the interest rate is **lower** than growth, the debt ratio falls by itself even with a balanced budget (the 2010s). If it's **higher**, the debt snowballs: a lasting **primary surplus** is needed just to keep it level. This is what happened to Greece around 2010: high interest rates, a shrinking economy and a deficit together – the debt ratio spiralled out of control.

```plot
title: The debt ratio (%) with a zero primary balance (3% growth)
x: 0, 30
y: 0, 200
param: r = 6, 0, 10, 0.5
f: 75*((1 + r/100)/1.03)^x # debt/GDP
dash: 60 # Maastricht limit
```

Set the interest rate on the slider: at 3% the debt ratio is flat, below it it falls, above it it grows exponentially.

## Summary

- Multiplier + accelerator: investment reacts to the change in demand, so even a small push can cause fluctuations.
- Leverage: with $L$-fold leverage, losing $\frac{1}{L}$ of asset value takes away all the equity.
- Debt dynamics: $d' = d \cdot \frac{1 + r}{1 + g} - \text{primary balance}$; if $r > g$, a surplus is needed for stabilisation.

## Lesson exercise

```quiz required
? A bank operates with 20× leverage. By how many percent does its equity fall if its assets lose 5% of their value?
= 100
! 100 assets, 5 equity, 95 debt; after the fall $95 - 95 = 0$ is left.

? The debt ratio is 60%, the interest rate equals growth, the primary surplus is 2% of GDP. What will the debt ratio be in a year (%)?
= 58
! $60 \cdot 1 - 2 = 58$.

? Why can a small push cause fluctuations in the Samuelson model?
- because the government spends randomly
+ because investment reacts to the change in demand, which amplifies and reverses the movement
- because consumption is independent of income
- because the money supply fluctuates
! The accelerator reacts even to a slowdown in growth with a fall in investment.

? Under what condition does the debt ratio fall by itself with a balanced primary budget?
+ if the interest rate is lower than economic growth
- if the interest rate is higher than economic growth
- if inflation is zero
- never
! $\frac{1 + r}{1 + g} < 1$ if $r < g$.

? In the multiplier–accelerator model $G = 100$ and $c = 0.8$. What is equilibrium output? ($Y^* = \frac{G}{1 - c}$)
= 500
! $\frac{100}{0.2} = 500$.
```
