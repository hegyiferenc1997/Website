---
title: Deeper – The Labour Market in Numbers
summary: The effect of a minimum wage in a simple labour market model with a slider, Okun's law in forints, the return on a degree with net present value, and the "bathtub model" of unemployment, which shows why the speed of job search is the key.
minutes: 40
---

## What you will learn in this lesson

- when a **minimum wage** causes unemployment and when it doesn't – and why the question is disputed,
- how much an extra percentage point of unemployment **costs** the economy,
- how to compute whether a degree is **worth it** (and what the answer depends on),
- why a given **level of unemployment** settles in permanently.

## 1. The minimum wage in a simple model

In a labour market firms' demand is $L_D = 1000 - 2w$, workers' supply is $L_S = 3w - 500$ (wage in thousand Ft/month, headcount in thousands):

```python run
# Minimum wage in a simple labour market: L_D = 1000 − 2w, L_S = 3w − 500 (w: thousand Ft/month, L: thousand people)
def demand(w):
    return 1000 - 2 * w          # this many people firms want to hire

def supply(w):
    return 3 * w - 500           # this many people want to work at this wage

w_e = 1500 / 5                   # 1000 − 2w = 3w − 500
print(f"equilibrium: wage {w_e:.0f} k Ft, employment {demand(w_e):.0f} thousand people")
for min_wage in [280, 320, 350]:
    w = max(min_wage, w_e)                       # a minimum wage below equilibrium doesn't bind: the market wage applies
    employed = min(demand(w), supply(w))         # the shorter side decides
    surplus = supply(w) - employed
    print(f"minimum wage {min_wage}: wage {w:.0f}, employment {employed:.0f}, seeking work but not finding it {surplus:.0f} thousand")
```

- A minimum wage **below** the equilibrium wage (280) doesn't bind: the market pays more anyway.
- With a minimum wage **above** equilibrium, more people want to work (the higher wage attracts them), but firms hire fewer people – the difference is unemployment.

```plot
title: Labour market with a minimum wage (wage: thousand Ft/month, headcount: thousand)
x: 0, 800
y: 0, 500
param: m = 320, 200, 450, 10
f: 500 - x/2 # labour demand
f: (x + 500)/3 # labour supply
dash: m # minimum wage
point: 1000 - 2*m, m # employment
point: 3*m - 500, m # those who would work
```

**Why is it still disputed?** Empirical research (e.g. the studies of David Card and Alan Krueger; this was part of why Card received the Nobel Prize in 2021) found that a moderate minimum wage increase often reduces employment **only slightly**. Possible reasons: if a town has few employers (monopsony), the wage can be below equilibrium, and the minimum wage corrects this; better-paid workers quit less often; and firms can also adjust through prices or profits. The model shows the direction, the data decide the magnitude.

## 2. Okun's law in forints

Arthur Okun's observation: if unemployment rises 1 percentage point above the natural rate, output falls about 2% short of its potential. In an 80,000 billion forint economy:

```python run
# Okun's law: every 1 percentage point of unemployment above the natural rate ≈ 2% lost output
natural, okun = 4.0, 2.0
potential_gdp = 80_000                           # billion Ft
for rate in [4.0, 5.0, 6.5, 8.0]:
    gap = -okun * (rate - natural) + 0.0         # output gap, %
    loss = max(0, -gap) / 100 * potential_gdp
    print(f"unemployment {rate}%: output gap {gap:+.1f}% → about {loss:,.0f} bn Ft of output lost")
```

So unemployment is not only a tragedy for those affected, but a **loss for the whole economy**: thousands of billions of output not produced. That's why fighting recessions is considered one of the main tasks of economic policy.

## 3. Is a degree worth it?

A human capital investment is like any investment: we make a sacrifice today (4 years of lost earnings), and it pays off later (higher salary). Whether it's worth it is shown by the **net present value**: we **discount** future extra earnings to today, because later money is worth less today:

```python run
# Is a degree worth it? Net present value (NPV) of a human capital investment
# Simplified career: with a school-leaving certificate 350 k Ft/month from 18; with a degree 600 k Ft/month after 4 years of study
# (monthly wages, 12 months, both with 2% real growth a year, from age 18 to 65)
def npv(discount):
    value = 0.0
    for year in range(47):                       # age 18 … 64
        school = 350_000 * 12 * 1.02 ** year
        degree = 0 if year < 4 else 600_000 * 12 * 1.02 ** (year - 4)
        value += (degree - school) / (1 + discount) ** year   # discount the future difference to today
    return value

for d in [0.03, 0.06, 0.10, 0.15]:
    print(f"discount rate {d:.0%}: net present value of the degree {npv(d) / 1e6:6.1f} million Ft")
```

At a normal discount rate the degree pays off handsomely (in the tens of millions). Only at a very high discount rate (for someone who strongly prefers the present, or who finances studying with expensive credit) does it fall to zero. The calculation of course simplifies: it ignores tuition, scholarships and studying while working, and that a degree also reduces the risk of unemployment – and it doesn't measure the non-monetary benefits (more interesting work, health) either.

## 4. The bathtub of unemployment

Every month a share of workers ($s$) lose their job, and a share of the unemployed ($f$) find a new one. If the two balance, unemployment is constant: $u = \frac{s}{s + f}$.

```python run
# The "bathtub" of unemployment: each month a share s lose their job, a share f find one
# In the long run u = s / (s + f) – inflows and outflows balance
s = 0.01                                          # 1% of workers lose their job each month
for f in [0.10, 0.20, 0.30, 0.45]:
    u = 0.10                                      # initial unemployment: 10%
    for _ in range(60):                           # 5 years, monthly
        u = u + s * (1 - u) - f * u               # inflow − outflow
    print(f"monthly job-finding chance {f:.0%}: lasting unemployment {u:.1%} (by formula {s / (s + f):.1%})")
```

Wherever we start (here from 10%), the rate converges to this equilibrium level. The **speed of job search** has the strongest effect: if the unemployed find a job with a 30% chance per month instead of 10%, the rate falls from 9% to 3%. That's why efficient job sites, retraining and good labour market information help – they all increase $f$. In the IT sector $f$ is typically high, which is why unemployment is low.

## Summary

- According to the model, a minimum wage above equilibrium causes unemployment; the empirical effect of a moderate increase is often small.
- Okun's law: 1 percentage point of extra unemployment ≈ 2% lost output.
- The return on a degree is measured with net present value; the answer depends on the discount rate.
- Lasting unemployment: $u = \frac{s}{s + f}$; speeding up job search is the most effective tool.

## Lesson exercise

```quiz required
? In the model above ($L_D = 1000 - 2w$, $L_S = 3w - 500$) the minimum wage is 340. How many thousand people are seeking work but not finding it?
= 200
! $L_S = 520$, $L_D = 320$, the difference is $200$.

? The natural rate is 5%, actual unemployment is 7%, the Okun coefficient is 2. What percentage is the output gap?
= -4
= −4
! $-2 \cdot (7 - 5) = -4\%$.

? Each month 2% of workers lose their job and 18% of the unemployed find a new one. What percentage is lasting unemployment?
= 10
! $\frac{0.02}{0.02 + 0.18} = 10\%$.

? Which is an example of frictional unemployment?
+ a programmer quits and spends two months looking for the job they like best
- typesetters' work is replaced by computers
- a factory's workers are laid off because of a recession
- a ski instructor doesn't work in summer
! Frictional unemployment is the time spent searching between jobs.

? How does the net present value of a degree change if the discount rate rises?
- it rises
+ it falls
- it doesn't change
- it first rises, then falls
! The present value of later extra earnings becomes smaller.
```
