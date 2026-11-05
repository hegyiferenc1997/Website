---
title: Production and Costs
summary: Fixed and variable costs, average and marginal cost, short and long run, diminishing returns, economies of scale, accounting and economic profit – using a software company as an example.
minutes: 30
---

## What you will learn

- the difference between **fixed** and **variable** costs,
- what **average cost** and **marginal cost** are,
- what **diminishing returns** and **economies of scale** mean,
- why **accounting** and **economic profit** differ,
- why the cost structure of software is special.

## Short run and long run

- **Short run:** at least one factor (e.g. the office, the machines) **cannot be changed**.
- **Long run:** every factor can be changed – we can open a new office or buy new servers.

## Types of costs

| Concept       | Symbol | Meaning                                                       | Example (software company)                          |
| ------------- | ------ | ------------------------------------------------------------- | --------------------------------------------------- |
| fixed cost    | FC     | does not depend on the quantity produced                      | office rent, licences, the base cost of development |
| variable cost | VC     | rises with quantity                                           | cloud server usage, customer support, payment fees  |
| total cost    | TC     | $TC = FC + VC$                                                | –                                                   |
| average cost  | AC     | $AC = TC / Q$ – cost per unit                                 | –                                                   |
| marginal cost | MC     | $MC = \Delta TC / \Delta Q$ – the extra cost of the next unit | serving one more user                               |

**Example:** an app has a monthly fixed cost of 600,000 HUF, and server and support costs of 200 HUF per user. With 1,000 users:

- $TC = 600\,000 + 200 \cdot 1000 = 800\,000$ HUF,
- $AC = 800\,000 / 1000 = 800$ HUF,
- $MC = 200$ HUF.

With 10,000 users the average cost is only $(600\,000 + 2\,000\,000)/10\,000 = 260$ HUF – the fixed cost is "spread out".

## Diminishing returns and cost curves

**The law of diminishing returns:** if we increase one factor (e.g. labour) while keeping the others fixed, after a while each extra unit adds less and less output. An 11th developer hired into a 10-person team still adds a lot; the 40th on the same project tends to slow it down (more coordination – Brooks's law: "adding manpower to a late software project makes it later").

That is why marginal cost eventually **rises**, and the average cost curve is **U-shaped**.

```plot
title: Average and marginal cost
x: 0, 60
y: 0, 25
param: F = 100, 20, 300, 10
f: F/x + 2 + 0.1x # average cost (AC)
f: 2 + 0.2x # marginal cost (MC)
point: sqrt(10F), 2 + 0.2 sqrt(10F) # AC minimum
value: quantity with the lowest average cost = sqrt(10F)
```

Notice: the **marginal cost curve crosses the average cost curve at its minimum**. (If the next unit is cheaper than the average, it pulls the average down; if more expensive, it pulls it up.) The **F** slider changes the fixed cost.

## Economies of scale (long run)

- **Economies of scale**: at higher output average cost **falls** (bulk purchasing, specialisation, fixed costs spread out). This is why cloud providers grow so large.
- **Diseconomies of scale**: at too large a size average cost rises (bureaucracy, slow decisions).

## Accounting and economic profit

- **Accounting profit** = revenue − **explicit** (paid) costs.
- **Economic profit** = revenue − explicit costs − **implicit costs** (opportunity costs, e.g. the owner's forgone salary).

**Example:** your own start-up makes an accounting profit of 12 million HUF a year. If you could earn 15 million HUF a year as an employee, your economic profit is **−3 million HUF** – economically you would be better off as an employee (if money is the main concern).

## The special cost structure of software

Software has a **very high fixed cost** (development) and an **almost zero marginal cost** (one more download). Therefore:

- average cost falls almost without limit as the number of users grows,
- economies of scale are huge → "winner takes all" markets (topic 12),
- price is set not by marginal cost but by buyers' willingness to pay.

## Summary

- $TC = FC + VC$; $AC = TC/Q$; $MC$ = the extra cost of the next unit.
- Diminishing returns → rising MC, U-shaped AC; MC crosses AC at its minimum.
- Economies of scale: larger size, lower average cost.
- Economic profit = accounting profit − implicit (opportunity) costs.
- Software: high fixed cost, almost zero marginal cost.

## Your task

```quiz required
? Which is a **fixed** cost for an online shop?
+ the annual domain and hosting fee
- the shipping fee per order
- the card payment commission
- packaging material
! It does not depend on the quantity sold.

? FC = 400,000 HUF, the variable cost is 100 HUF per unit. What is the total cost at 2,000 units (HUF)?
= 600000
! 400,000 + 100 · 2,000.

? What is the average cost here (HUF)?
= 300
! 600,000 / 2,000.

? Where does the marginal cost curve cross the average cost curve?
- at the maximum of average cost
+ at the minimum of average cost
- nowhere
- on the horizontal axis
! If MC < AC, AC falls; if MC > AC, it rises.

? Your accounting profit is 8 million HUF, and as an employee you could earn 10 million HUF. What is your economic profit in million HUF? (With sign.)
= -2
= −2
! 8 − 10.
```
