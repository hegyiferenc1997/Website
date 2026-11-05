---
title: Interest, Saving and Borrowing
summary: Simple and compound interest, the rule of 72, nominal and real interest rates, the time value of money and present value, loans (APR, annuity instalments), and the link between risk and return.
minutes: 30
---

## What you will learn

- the difference between **simple** and **compound interest**,
- how to estimate doubling time with the **rule of 72**,
- what the **real interest rate** is,
- what the **time value of money** and **present value** mean,
- how to read loan offers (**APR**, instalments),
- why higher returns come with higher **risk**.

## Simple and compound interest

- **Simple interest:** interest is always paid only on the original principal: $FV = PV \cdot (1 + r \cdot n)$.
- **Compound interest:** interest also earns interest: $FV = PV \cdot (1 + r)^n$.

Here $PV$ is today's amount (present value), $FV$ the future amount (future value), $r$ the annual interest rate and $n$ the number of years.

**Example:** 100,000 HUF for 10 years at 5% a year:

- with simple interest: $100\,000 \cdot 1.5 = 150\,000$ HUF,
- with compound interest: $100\,000 \cdot 1.05^{10} \approx 162\,889$ HUF.

```plot
title: 100 units with compound (solid) and simple (dashed) interest
x: 0, 40
y: 0, 800
param: r = 5, 1, 10, 0.5
f: 100 (1 + r/100)^x # compound interest
dash: 100 (1 + r/100 x) # simple interest
value: doubling time (years) = ln(2) / ln(1 + r/100)
```

In the long run the difference is huge – that is why it pays to start saving **early**.

## The rule of 72

Quick mental arithmetic: doubling time ≈ $72 / (\text{interest rate in percent})$. At 6% a year money doubles in about **12 years**, at 8% in about 9 years. It works for inflation too: with 6% inflation the purchasing power of money **halves** in 12 years.

You can also calculate this in Python:

```python run
# Compound interest year by year
principal = 100_000
rate = 0.05
for year in range(1, 11):
    principal = principal * (1 + rate)
    print("year", year, ":", round(principal), "HUF")
```

## Nominal and real interest rates

The **nominal interest rate** is the rate promised by the bank, the **real interest rate** is the actual growth in purchasing power after inflation:

$$ \text{real rate} \approx \text{nominal rate} - \text{inflation} $$

If your deposit pays 6% and inflation is 4%, the real rate is about **2%**. If inflation is 10%, your real rate is **−4%**: you will have more forints but can buy less with them. During the high inflation of 2022–2023 the real rate on many deposits was strongly negative.

## The time value of money and present value

1 forint today is **worth more** than 1 forint received in a year (it can be invested, and inflation also reduces its value). The **present value** of a future amount:

$$ PV = \frac{FV}{(1 + r)^n} $$

**Example:** you will receive 121,000 HUF in 2 years, the interest rate is 10%. Its present value is $121\,000 / 1.1^2 = 100\,000$ HUF. This tool lets us compare money due at different times – e.g. the return on an investment or a software project (net present value, NPV).

## Loans

With a loan **you pay** interest. The most important figure is the **APR** (annual percentage rate; in Hungary THM): besides interest it includes all fees (handling fee, insurance, disbursement fee) as an annual percentage. **Always** compare two loan offers by **APR**, not by the advertised interest rate or the monthly instalment. (For deposits the equivalent is the annual equivalent rate, in Hungary EBKM.)

**Annuity (equal instalment) repayment:**

$$ A = PV \cdot \frac{r}{1 - (1 + r)^{-n}} $$

where $r$ is the **monthly** interest rate and $n$ the number of months. 1,000,000 HUF, 1% a month, 12 months → about **88,849 HUF** a month; in total you repay about 1,066,000 HUF.

Watch out for **long terms**: the monthly instalment is smaller, but total interest is much higher. The most expensive loans are usually credit card debt, store credit and "payday loans".

## Risk and return

- **Risk and return go together:** a higher expected return requires taking more risk (volatility, possibility of loss). Government bonds: low risk; shares: higher return, more volatility; crypto assets: very high risk.
- **Diversification:** don't put all your eggs in one basket – spreading money over many different assets reduces risk (e.g. index funds).
- If someone promises a **high return without risk**, it is almost certainly a fraud (Ponzi scheme).

## Summary

- Compound interest: $FV = PV (1+r)^n$; in the long run much more than simple interest.
- Rule of 72: doubling time ≈ 72 / interest rate.
- Real rate ≈ nominal rate − inflation.
- Present value: $PV = FV / (1+r)^n$.
- Compare loans by APR; higher returns come with higher risk.

## Your task

```quiz required
? You deposit 200,000 HUF for 3 years at 6% compound interest a year. How much will you have at the end (rounded to whole HUF)?
= 238203
! 200,000 · 1.06³ = 238,203.2.

? By the rule of 72, in how many years does money double at a 9% annual return?
= 8
! 72 / 9.

? Your deposit pays 5%, inflation is 7%. What is the approximate real interest rate in percent? (With sign.)
= -2
= −2
! 5 − 7.

? Which figure should you use to compare two loan offers?
- the monthly instalment
- the advertised interest rate
+ the APR
- the term
! The APR includes all fees.

? What is true about the relationship between risk and return?
- higher return comes with lower risk
+ a higher expected return usually requires taking more risk
- there is no relationship
- government bonds are the riskiest
! There is no high return without risk.
```
