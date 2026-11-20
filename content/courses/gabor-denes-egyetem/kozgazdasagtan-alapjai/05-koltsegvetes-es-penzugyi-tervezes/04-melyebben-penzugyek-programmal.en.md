---
title: Deeper – Finance with Programs
summary: A mortgage's monthly payment and total cost for 10, 20 and 30-year terms, the repayment schedule (why at first we pay almost only interest), the monthly saving needed for a goal, and the fiscal multiplier computed round by round.
minutes: 40
---

## What you will learn in this lesson

- how the bank computes the **monthly payment** (annuity),
- why the debt falls **slowly** at the start of a long loan,
- how much you need to **put aside** monthly for a goal, and how much interest helps,
- how government spending gets **multiplied** in the economy.

## 1. The monthly payment and the price of the term

A 20 million forint mortgage at 6.5% a year. The bank asks for **annuity** repayment: we pay the same every month, $A = H \cdot \frac{i}{1 - (1 + i)^{-n}}$, where $i$ is the monthly interest rate and $n$ the number of months:

```python run
# Annuity loan: a 20 million Ft mortgage at 6.5% a year – what is the monthly payment?
def payment(loan, annual_rate, years):
    i = annual_rate / 100 / 12                 # monthly interest rate
    n = years * 12                             # number of months
    return loan * i / (1 - (1 + i) ** -n)      # annuity formula

loan = 20_000_000
for years in [10, 20, 30]:
    monthly = payment(loan, 6.5, years)
    total = monthly * years * 12
    print(f"{years} years: monthly {monthly:>9,.0f} Ft | total {total:>12,.0f} Ft | of which interest {total - loan:>12,.0f} Ft")
```

A longer term means a smaller monthly burden, but it's **much more expensive**: over 30 years the interest is more than the amount borrowed! 30 years instead of 10: 100 thousand forints less per month, but 18 million more in total. The right decision depends on what you can afford monthly – a rule of thumb is that repayments shouldn't take more than a third to a half of net income (in Hungary this is also limited by law, the so-called JTM rule).

## 2. The repayment schedule: where does the money go?

```python run
# Repayment schedule: how much of the monthly instalment is interest and how much principal?
loan, i, n = 20_000_000, 0.065 / 12, 240
monthly = loan * i / (1 - (1 + i) ** -n)
debt = loan
for month in range(1, n + 1):
    interest = debt * i                        # interest is due on the outstanding debt
    principal = monthly - interest             # the rest reduces the debt
    debt -= principal
    if month in (1, 2, 60, 120, 180, 240):
        print(f"month {month:>3}: interest {interest:>8,.0f} | principal {principal:>8,.0f} | remaining debt {max(debt, 0):>12,.0f}")
```

In the first month, of the 149 thousand instalment **108 thousand is interest**, and only 41 thousand reduces the debt. Even after 5 years (60 instalments, about 9 million Ft paid) the debt is still 17 million! Interest is always due on the **outstanding** debt, so towards the end the situation turns around: the last instalment is almost entirely principal.

```plot
title: Remaining debt (million Ft) on a 20-year, 20 million loan
x: 0, 20
y: 0, 20
param: r = 6.5, 1, 12, 0.5
f: 20*((1 + r/1200)^240 - (1 + r/1200)^(12*x))/((1 + r/1200)^240 - 1) # debt
```

Move the interest rate: the higher it is, the more "bellied" the curve – the longer it takes for the debt to fall meaningfully. That's why prepaying is especially worth it at the **start** of the term: for every forint prepaid we save the interest for the whole remaining term.

## 3. A savings goal

You need 3 million forints in 3 years (e.g. a down payment, a car). With savings earning 4% a year:

```python run
# Savings goal: how much must we put aside monthly to have 3 million Ft in 3 years?
goal, annual_rate, years = 3_000_000, 4.0, 3
i, n = annual_rate / 100 / 12, years * 12
monthly = goal * i / ((1 + i) ** n - 1)        # from the future value of an annuity
print(f"with interest: {monthly:,.0f} Ft a month (without interest {goal / n:,.0f} Ft would be needed)")

# check month by month
balance = 0.0
for _ in range(n):
    balance = balance * (1 + i) + monthly      # interest accrues, then we deposit
print(f"balance after 36 months: {balance:,.0f} Ft, of which deposits {monthly * n:,.0f}, interest {balance - monthly * n:,.0f}")
```

Interest adds about 171 thousand to the 3 million – that much less has to be paid in. Over the longer term (e.g. 30 years, pension) the effect of compound interest is dramatic: there most of the final amount already comes from interest. The lesson: **the earlier** you start, the more the money works for you. What matters, however, is the **real interest rate**: if inflation is 4%, then a 4% interest rate only preserves the value of the money.

## 4. The multiplier round by round

The government spends 100 billion forints more (e.g. on road building). This is someone's income – who spends part of it, which again becomes someone else's income, and so on:

```python run
# The fiscal multiplier in rounds: the government spends 100 billion more
def multiplier_rounds(spending, c, rounds=30):
    total, rnd = 0.0, spending
    for k in range(rounds):
        total += rnd                           # this round appears as someone's income
        rnd *= c                               # they spend a share c of it – that's the next round
    return total

for c, name in [(0.8, "closed economy, no taxes"), (0.5, "with taxes and imports, i.e. leakage")]:
    print(f"c = {c} ({name}): total effect ≈ {multiplier_rounds(100, c):.0f} bn, by formula 1/(1 − c) · 100 = {100 / (1 - c):.0f}")
```

If everyone spends 80% of their income ($c = 0.8$), the total effect is $\frac{1}{1 - c} = 5$-fold: 500 billion. In reality, however, part of the money **leaks out**: it goes back to the government as taxes, is spent on foreign products (imports), or is saved. In a small, open economy like Hungary's the multiplier is therefore much smaller (here 2). The idea works in both directions: **austerity** also reduces demand several times over.

## Summary

- Annuity: $A = H \cdot \frac{i}{1 - (1 + i)^{-n}}$; a longer term → smaller instalment, but much more interest.
- At the start of repayment most of the instalment is interest; prepaying is worth the most at the start of the term.
- With saving, compound interest helps the more the earlier you start – but the real interest rate is what counts.
- Fiscal multiplier: $\frac{1}{1 - c}$; leakages (taxes, imports, saving) reduce it.

## Lesson exercise

```quiz required
? How does extending the term affect an annuity loan?
- the monthly instalment rises and the total interest rises
+ the monthly instalment falls, but the total interest rises
- the monthly instalment falls and the total interest falls
- nothing changes
! More interest is due on a debt that's outstanding for longer.

? A 12 million Ft loan has an interest rate of 6% a year. How much interest is due in the first month (Ft)?
= 60000
! $12\,000\,000 \cdot \frac{0.06}{12} = 60\,000$ Ft.

? What is the fiscal multiplier if the marginal propensity to consume is $c = 0.75$?
= 4
! $\frac{1}{1 - 0.75} = 4$.

? The deposit rate is 5%, inflation is 3%. Roughly what percentage is the real interest rate?
= 2
! Approximately $5 - 3 = 2\%$ (exactly $\frac{1.05}{1.03} - 1 \approx 1.94\%$).

? According to the rule of 72, in roughly how many years does money double at a 6% annual return?
= 12
! $72 / 6 = 12$ years.
```
