---
title: Practice – Trade and Exchange Rates
summary: Review questions and a summary worksheet on comparative advantage, tariffs, the effects of exchange rate changes and the balance of payments.
minutes: 60
kind: practice
---

## Review questions

<details>
<summary>1. "A developed country cannot gain from trade with a less developed country, since it is better at everything." Is this true?</summary>

No. The gains from trade come from **comparative** advantage, not absolute advantage. If the developed country specialises in what its advantage is greatest in and imports the rest, it can consume more with the same labour – and so can the less developed country.

</details>

<details>
<summary>2. Why do tariffs often hurt the very domestic firms they are meant to protect?</summary>

Because many firms use imported raw materials and components (e.g. chips, steel): the tariff makes these more expensive too, so the costs of domestic manufacturing rise. Partner countries' retaliatory tariffs then hit exporters.

</details>

<details>
<summary>3. Why can the forint weaken during an international financial crisis even if nothing has changed in the Hungarian economy?</summary>

Because in a crisis investors pull their money out of smaller markets seen as riskier and flee to safe currencies (dollar, Swiss franc). Demand for the forint falls, so it weakens.

</details>

<details>
<summary>4. Why is a persistently large current account deficit risky?</summary>

Because the deficit has to be financed from abroad (loans, investment). If investor confidence is shaken, inflows can stop suddenly, the currency weakens, interest rates rise – and the country may fall into crisis.

</details>

## Summary worksheet

Labour hours needed to produce one unit:

|               | Chip     | Clothing |
| ------------- | -------- | -------- |
| **Country A** | 8 hours  | 4 hours  |
| **Country B** | 12 hours | 3 hours  |

```quiz required
? Which country has an absolute advantage in chipmaking?
+ A
- B
! 8 < 12 hours.

? What is the opportunity cost of 1 chip in A, in units of clothing?
= 2
! 8 / 4.

? What is the opportunity cost of 1 chip in B, in units of clothing?
= 4
! 12 / 3.

? Which country has a comparative advantage in **clothing**?
- A
+ B
! In B 1 unit of clothing = 1/4 chip, in A 1/2 chip.

? EUR/HUF changes from 380 to 399. By what percentage did the euro become more expensive in forints?
= 5
= 5%
! 399 / 380 = 1.05.

? How many more forints is a Hungarian firm's 10,000-euro revenue worth at a rate of 399 than at 380?
= 190000
! 10,000 · (399 − 380).

? A foreign car maker builds a new factory in Hungary. Where does this appear in the balance of payments?
- in the trade balance, as an import
+ in the financial account, as foreign direct investment
- in the current account, as a transfer
! An investment – a capital inflow.
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Imports and a tariff.** Domestic demand is $Q_D = a - bp$, domestic supply is $Q_S = c + dp$, the world price is `world_price`. Write the function `imports_with_tariff(a, b, c, d, world_price, tariff)`, which returns the pair `(import quantity, tariff revenue)`! The domestic price is the world price + tariff, but at most the autarky (no-trade) price – if it reaches it, both imports and tariff revenue are 0 (prohibitive tariff). Round to 1 decimal.

```python starter
def imports_with_tariff(a, b, c, d, world_price, tariff):
    p = world_price + tariff
    q = (a - b * p) - (c + d * p)
    return (round(q, 1), round(tariff * q, 1))
```

<details>
<summary>Solution</summary>

With a tariff of 30 the starter code would compute negative imports (that is, exports) and negative tariff revenue – a tariff above the prohibitive level changes nothing more.

```python solution
def imports_with_tariff(a, b, c, d, world_price, tariff):
    autarky = (a - c) / (b + d)                  # price without trade
    p = min(world_price + tariff, autarky)       # above a prohibitive tariff it gets no dearer
    q = (a - b * p) - (c + d * p)                # the shortage is covered by imports
    return (round(q, 1) + 0.0, round(tariff * q, 1) + 0.0)
```

</details>

```python test
assert imports_with_tariff(200, 2, 20, 1, 40, 0) == (60.0, 0.0)
assert imports_with_tariff(200, 2, 20, 1, 40, 10) == (30.0, 300.0)
assert imports_with_tariff(200, 2, 20, 1, 40, 20) == (0.0, 0.0)
assert imports_with_tariff(200, 2, 20, 1, 40, 30) == (0.0, 0.0)
print("All checks passed!")
```

**2.** **Cross rate and conversion.** Write the function `cross_rate(eur_huf, usd_huf)`, which tells how many dollars 1 euro is worth (to 4 decimals), and the function `convert(forint, rate, commission)`, which tells how much foreign currency you get for `forint`, if the exchange office deducts `commission` % from the forints (to 2 decimals)!

```python starter
def cross_rate(eur_huf, usd_huf):
    return round(usd_huf / eur_huf, 4)

def convert(forint, rate, commission):
    return round(forint / rate, 2)
```

<details>
<summary>Solution</summary>

```python solution
def cross_rate(eur_huf, usd_huf):
    return round(eur_huf / usd_huf, 4)           # 1 € = eur_huf Ft = eur_huf / usd_huf dollars

def convert(forint, rate, commission):
    left = forint * (1 - commission / 100)       # the commission is deducted first
    return round(left / rate, 2)
```

</details>

```python test
assert cross_rate(400, 360) == 1.1111
assert cross_rate(390, 390) == 1.0
assert convert(100_000, 400, 0) == 250.0
assert convert(100_000, 400, 2) == 245.0
print("All checks passed!")
```

**3.** **Purchasing power parity.** A hamburger costs `price_home` forints at home and `price_abroad` dollars in the USA. Write the function `ppp_rate(price_home, price_abroad)` (to 2 decimals), and the function `deviation(market, price_home, price_abroad)`, which tells by how many % the market exchange rate deviates from the PPP rate (to 1 decimal; positive = the forint is undervalued according to PPP)!

```python starter
def ppp_rate(price_home, price_abroad):
    return round(price_abroad / price_home, 2)

def deviation(market, price_home, price_abroad):
    return round(market - price_home / price_abroad, 1)
```

<details>
<summary>Solution</summary>

With a positive deviation you have to give more forints for a dollar than the basket prices justify: the forint is "cheap", and domestic products look cheap from abroad.

```python solution
def ppp_rate(price_home, price_abroad):
    return round(price_home / price_abroad, 2)   # this many forints are worth 1 dollar "by the basket"

def deviation(market, price_home, price_abroad):
    ppp = price_home / price_abroad
    return round(100 * (market - ppp) / ppp, 1)  # percentage deviation
```

</details>

```python test
assert ppp_rate(1900, 5.5) == 345.45
assert deviation(380, 1900, 5.5) == 10.0
assert deviation(300, 1900, 5.5) == -13.2
assert deviation(400, 2000, 5) == 0.0
print("All checks passed!")
```

### Quick check questions

```quiz
? In 1 hour Hungary can produce 10 chips or 20 software modules, Austria 8 chips or 8 software modules. In what does Hungary have a comparative advantage?
- chips
+ software modules
- both
- neither
! The opportunity cost of software is 0.5 chips in Hungary and 1 chip in Austria.

? If the forint weakens against the euro, what happens to Hungarian exports (ceteris paribus)?
+ they become more competitive, because they're cheaper abroad
- they fall, because they become more expensive
- they don't change
- they stop
! The same amount of euros is worth more forints, so the Hungarian product is cheaper in euros.

? Who bears most of the burden of an import tariff in a small country?
+ domestic consumers, because of the higher price
- foreign producers
- the state
- nobody
! A small country doesn't affect the world price, so the tariff raises the domestic price.

? If 1 € = 400 Ft and 1 $ = 320 Ft, how many dollars is 1 euro worth?
= 1,25
= 1.25
! $400 / 320 = 1.25$.

? What does a current account deficit in the balance of payments mean?
- the state spends more than it collects in taxes
+ the country imports (and pays abroad) more than it exports
- the central bank's reserves grow
- banks lend more
! The current account measures the flows of foreign trade and income.
```
