---
title: The Sources of Growth
summary: Why are some countries richer? The production function, capital accumulation and diminishing returns, the lesson of the Solow model, technology and total factor productivity, human capital, innovation and the role of institutions.
minutes: 25
---

## What you will learn

- what the **production function** shows,
- why **capital accumulation** is not enough for sustained growth (**diminishing returns**),
- the main lesson of the **Solow model**,
- what **total factor productivity** (TFP) is and what raises it,
- why **institutions** are decisive.

## The production function

An economy's output ($Y$) depends on the factors of production and technology:

$$ Y = A \cdot F(K, L, H, N) $$

- $K$: physical capital (machines, buildings, servers, infrastructure),
- $L$: labour (workers, working hours),
- $H$: human capital (knowledge, skills – topic 8),
- $N$: natural resources,
- $A$: **technology** and efficiency (the "recipe" for combining the factors).

Living standards are determined by **labour productivity** (output per worker or per working hour).

## Capital accumulation and diminishing returns

If a country saves and invests more, its capital stock grows and so does output. But because of **diminishing returns** each additional unit of capital adds less and less.

```plot
title: Output per worker and capital
x: 0, 100
y: 0, 30
param: A = 2, 1, 3, 0.1
f: A sqrt(x) # output / worker
dash: 2 sqrt(x) # original technology
value: output with 100 units of capital = 10A
```

- The curve gets **flatter and flatter**: the same extra capital adds less and less extra output.
- The **A** slider shows technology: better technology **shifts the whole curve up** – more output from the same capital.

## The lesson of the Solow model

The main message of Robert Solow's model (Nobel Prize, 1987):

1. Capital accumulation speeds up growth **temporarily**, but because of diminishing returns the economy moves towards a **steady state**.
2. **Sustained** growth in output per person can only come from **technological progress**.
3. Capital-poor countries can grow **faster** (catch-up – lesson 1).

## Total factor productivity (TFP)

The part of growth not explained by growth in the quantity of capital and labour is growth in **total factor productivity** (TFP) – "more from the same". In developed countries this is a large share of growth. What raises it?

- **Research and development (R&D)** and innovation: new products and processes. The EU aims for R&D spending of 3% of GDP; in Hungary it is around 1.5%.
- **Technology adoption**, foreign direct investment (FDI) – multinational companies bring technology and know-how.
- **Digitalisation**, automation, artificial intelligence (topic 12).
- **Better organisation**, competition, the expansion of more efficient firms.

## Human capital

Education and health raise productivity and help **adopt** and **create** new technologies. Most successful catch-up countries (South Korea, Finland) invested heavily in education.

## Institutions

Why doesn't everyone invest and adopt technology? According to Daron Acemoglu, Simon Johnson and James Robinson (Nobel Prize, 2024), the decisive factor is the quality of **institutions**:

- **inclusive institutions:** secure property rights, rule of law, predictable rules, competition, broad participation → investing and innovating pays off;
- **extractive institutions:** a narrow elite appropriates incomes, legal security is weak, corruption is high → there is no incentive to invest.

The classic example: **North and South Korea** – the same people, the same culture and geography, but a huge difference in living standards because of different institutions.

## Other factors

- **Geography and natural resources:** resource wealth is no guarantee – because of the "resource curse" some oil-rich countries perform poorly.
- **Openness:** trade (topic 9) brings a larger market, competition and technology.
- **Macroeconomic stability:** low inflation, sustainable public finances.

## Summary

- $Y = A \cdot F(K, L, H, N)$; living standards are determined by productivity.
- Because of diminishing returns, capital accumulation only speeds growth temporarily.
- Solow: sustained growth only from technological progress.
- TFP: R&D, technology adoption, digitalisation, competition.
- Institutions (property rights, rule of law) are the deepest cause.

## Your task

```quiz required
? What does $A$ stand for in the production function?
- the number of workers
- physical capital
+ technology and efficiency
- natural resources
! The "recipe" for combining the factors.

? What is one main lesson of the Solow model?
- capital accumulation speeds up growth without limit
+ sustained growth in output per person comes from technological progress
- population growth is the source of wealth
- printing money increases output
! The return on capital is diminishing.

? In the chart, A rises from 2 to 2.5. What is output with 100 units of capital?
= 25
! 2.5 · √100 = 25.

? Which is a feature of **inclusive** institutions?
- incomes are appropriated by a narrow elite
+ secure property rights and rule of law
- weak legal security
- restricted competition
! Investing and innovating pays off.

? What is total factor productivity (TFP)?
+ the part of growth not explained by growth in the quantity of capital and labour
- the number of workers
- the value of the capital stock
- the inflation rate
! "More from the same."
```
