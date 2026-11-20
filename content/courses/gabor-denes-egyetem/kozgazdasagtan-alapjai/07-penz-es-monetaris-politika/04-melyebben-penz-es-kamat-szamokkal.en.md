---
title: Deeper – Money and Interest in Numbers
summary: Money creation round by round (and what reduces the multiplier), the quantity equation and why not every increase in money caused inflation, the effect of a rate hike on a variable-rate loan, and the Taylor rule as a rule of thumb for central bank decisions – with a slider chart.
minutes: 40
---

## What you will learn in this lesson

- how the banking system **multiplies** money, and what limits this,
- when growth in the money supply leads to **inflation**, and when it doesn't,
- how a **rate hike** affects a family's monthly spending,
- by what **rule of thumb** a central bank may think about the interest rate.

## 1. Money creation round by round

Someone deposits 1 million forints in a bank. The bank keeps part of it in reserve and lends out the rest; the loan is used to buy something, the seller deposits the money in a (different) bank, and the round starts again:

```python run
# Money creation: a new deposit of 1 million Ft, 10% reserve ratio – how much money does it become?
def money_creation(deposit, reserve, cash_share=0.0, rounds=200):
    total_deposits, rnd = 0.0, deposit
    for _ in range(rounds):
        total_deposits += rnd
        loan = rnd * (1 - reserve)                  # the bank lends out the part above the reserve
        rnd = loan * (1 - cash_share)               # this much of the loan comes back to a bank as a deposit
    return total_deposits

print(f"10% reserve, no cash: {money_creation(1e6, 0.10) / 1e6:5.2f} M Ft deposits (formula: 1/0.1 = 10×)")
print(f"10% reserve, 20% kept in cash: {money_creation(1e6, 0.10, 0.20) / 1e6:5.2f} M Ft deposits")
print(f"20% reserve, no cash: {money_creation(1e6, 0.20) / 1e6:5.2f} M Ft deposits")
```

With a 10% reserve ratio the 1 million eventually becomes 10 million in deposits (multiplier: $\frac{1}{r}$). But if part of the money stays in **cash** (doesn't return to the banking system), or the reserve ratio is higher, the multiplier is much smaller.

**Modern view:** in reality banks don't "wait" for deposits: when they grant a loan, the new deposit **is created** in the customer's account at the same moment. Money creation is therefore limited not by reserves but mainly by loan demand, the bank's capital and the central bank's interest rate. The multiplier model is a good illustration, but not an accurate description.

## 2. The quantity equation: more money = inflation?

The relationship $M \cdot V = P \cdot Y$ (money supply × velocity = price level × real output) in growth rates: $m + v \approx \pi + y$.

```python run
# Quantity equation: M·V = P·Y → in growth rates: m + v ≈ π + y
money_growth, velocity_growth, real_growth = 10.0, 0.0, 3.0      # %/year
inflation = (1 + money_growth / 100) * (1 + velocity_growth / 100) / (1 + real_growth / 100) - 1
print(f"money supply +{money_growth}%, real GDP +{real_growth}% → inflation ≈ {100 * inflation:.1f}%")

# If in a crisis velocity falls (people hold on to money), money growth doesn't cause inflation
for v in [0, -5, -10]:
    pi = (1.10) * (1 + v / 100) / 1.0 - 1
    print(f"money +10%, velocity {v:+}%, real GDP 0% → inflation {100 * pi:5.1f}%")
```

If velocity is constant, money growth exceeding real GDP growth causes inflation. After 2008 and in 2020, however, central banks issued huge amounts of money, yet there was no immediate inflation – because **velocity fell**: banks and firms held on to the money instead of spending it. When demand jumped in 2021–2022 (and energy prices too), inflation appeared as well. The lesson: the money supply is only **one** factor, behaviour matters at least as much.

## 3. A rate hike at the kitchen table

A family took out a 15 million forint, 20-year, **variable**-rate loan at 3%. What happens if the loan's interest rate rises because of a policy rate increase?

```python run
# A rate hike from a household's point of view: a variable-rate, 15 million Ft, 20-year loan
def payment(loan, annual_rate, years):
    i, n = annual_rate / 100 / 12, years * 12
    return loan * i / (1 - (1 + i) ** -n)

for rate in [3, 6, 9, 12]:
    print(f"{rate:>2}% interest: monthly payment {payment(15_000_000, rate, 20):>9,.0f} Ft")
```

With the rate rising from 3% to 9%, the monthly payment rises from 83 thousand to 135 thousand forints, **more than one and a half times**. This is one of the main channels of monetary policy: more expensive credit holds back consumption and investment, so demand and with it inflation fall – but meanwhile it puts many households in a difficult position. That's why Hungary introduced an **interest rate cap** in 2022, and why fixed-rate loans are recommended.

## 4. The Taylor rule

How does a central bank decide on the interest rate? In 1993 John Taylor described what the Fed actually did with a simple formula: the rate should be higher if inflation is above target and if the economy is overheating (positive output gap):

$$
i = r^* + \pi + 0.5(\pi - \pi^*) + 0.5 \cdot \text{gap}
$$

```python run
# The Taylor rule: what policy rate does a simple rule of thumb "recommend"?
# i = r* + π + 0.5·(π − π*) + 0.5·output gap; r* = 2% neutral real rate, π* = 3% inflation target
def taylor(infl, gap, r_neutral=2.0, target=3.0):
    return r_neutral + infl + 0.5 * (infl - target) + 0.5 * gap

cases = [("calm times", 3, 0), ("overheating economy", 6, 2), ("recession", 1, -4), ("inflation shock", 20, 1)]
for name, infl, gap in cases:
    print(f"{name:<20}: inflation {infl:>2}%, gap {gap:+}% → recommended rate {taylor(infl, gap):5.1f}%")
```

The essence of the rule is the **Taylor principle**: if inflation rises by 1 percentage point, the interest rate must rise by **more than** 1 percentage point (here by 1.5), otherwise the real interest rate would fall and fuel inflation further. In reality central banks don't follow the formula mechanically (in an inflation shock 31% would be unrealistically high), but it's a good reference point.

```plot
title: The interest rate according to the Taylor rule as a function of inflation
x: 0, 20
y: 0, 35
param: g = 0, -4, 4, 0.5
f: 2 + x + 0.5*(x - 3) + 0.5*g # recommended rate
dash: x # zero real rate (i = π)
```

Below the dashed line the real interest rate is negative: the central bank is still "easing", however high the rate may seem. With the slider you can set the output gap.

## Summary

- Money multiplier: $\frac{1}{r}$, but holding cash and higher reserves reduce it; in fact lending creates the deposit.
- $m + v \approx \pi + y$: money growth causes inflation if velocity doesn't fall.
- A rate hike directly holds back demand through the payments on variable-rate loans.
- Taylor rule: the interest rate should react more strongly than inflation; the real rate counts, not the nominal one.

## Lesson exercise

```quiz required
? What is the simple money multiplier with a 5% reserve ratio?
= 20
! $\frac{1}{0.05} = 20$.

? The money supply grows by 8% a year, real GDP by 2%, velocity is constant. Roughly what percentage is inflation? (rounded to a whole number)
= 6
! $\frac{1.08}{1.02} - 1 \approx 5.9\% \approx 6\%$.

? According to the Taylor rule ($r^* = 2\%$, $\pi^* = 3\%$), what interest rate is recommended if inflation is 5% and the output gap is 0?
= 8
! $2 + 5 + 0.5 \cdot 2 + 0 = 8\%$.

? What can we expect after a significant central bank rate hike?
+ loans get more expensive, demand slows, the domestic currency typically strengthens
- loans get cheaper
- investment and consumption grow
- the domestic currency weakens
! A higher rate attracts capital and holds back borrowing.

? According to the quantity equation, when does increasing the money supply not lead to inflation?
- if real GDP falls
+ if velocity falls by a similar amount
- if velocity rises
- never
! $m + v \approx \pi + y$: if $v$ falls by as much as $m$ rises, $\pi$ doesn't rise.
```
