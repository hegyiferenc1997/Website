---
title: Racionális kifejezések
summary: Algebrai törtek egyszerűsítése, közös nevezőre hozása, szorzása és osztása – kikötésekkel.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- mi a **racionális kifejezés** (algebrai tört), és miért kell **kikötést** tenni,
- hogyan **egyszerűsítünk** szorzattá alakítással,
- hogyan **adunk össze**, **szorzunk** és **osztunk** algebrai törteket.

## Racionális kifejezés és kikötés

A **racionális kifejezés** két polinom hányadosa, pl. $\dfrac{x^2 - 1}{x^2 + 3x + 2}$. Nullával nem oszthatunk, ezért mindig **kikötést** teszünk: a nevező nem lehet $0$. Itt $x^2 + 3x + 2 = (x + 1)(x + 2) \neq 0$, tehát $x \neq -1$ és $x \neq -2$.

## Egyszerűsítés

Csak **szorzótényezőt** lehet egyszerűsíteni, összeadandót nem! Ezért előbb szorzattá alakítunk:

$$
\frac{x^2 - 1}{x^2 + 3x + 2} = \frac{(x - 1)(x + 1)}{(x + 1)(x + 2)} = \frac{x - 1}{x + 2}, \qquad x \neq -1,\ x \neq -2.
$$

A kikötés az egyszerűsítés után is megmarad: az eredeti kifejezés $x = -1$-nél nem értelmezett, még ha az egyszerűsített alakba be is lehetne helyettesíteni.

Tipikus hiba: $\dfrac{x + 3}{x} \neq 3$, mert az $x$ itt nem szorzótényező a számlálóban.

## Összeadás, kivonás: közös nevező

A közös nevező a nevezők **legkisebb közös többszöröse**:

$$
\frac{2}{x - 1} - \frac{1}{x + 1} = \frac{2(x + 1) - (x - 1)}{(x - 1)(x + 1)} = \frac{x + 3}{x^2 - 1}, \qquad x \neq \pm 1.
$$

## Szorzás és osztás

Szorzáskor számlálót a számlálóval, nevezőt a nevezővel szorzunk (előtte érdemes egyszerűsíteni); osztáskor a **reciprokkal** szorzunk:

$$
\frac{x^2 - 4}{3x} : \frac{x + 2}{6x^2} = \frac{(x - 2)(x + 2)}{3x} \cdot \frac{6x^2}{x + 2} = 2x(x - 2), \qquad x \neq 0,\ x \neq -2.
$$

## Emeletes tört

$$
\frac{1 + \frac{1}{x}}{1 - \frac{1}{x^2}} = \frac{\frac{x + 1}{x}}{\frac{(x - 1)(x + 1)}{x^2}} = \frac{x + 1}{x} \cdot \frac{x^2}{(x - 1)(x + 1)} = \frac{x}{x - 1}, \qquad x \neq 0,\ \pm 1.
$$

```plot
title: Ahol a nevező nulla
x: -5, 5
y: -6, 6
f: (x - 1)/(x + 2) # (x − 1)/(x + 2)
```

A grafikon $x = -2$-nél „szétszakad”: ott a nevező $0$, a függvény nincs értelmezve (függőleges aszimptota).

## Összefoglalás

- Racionális kifejezés = polinom / polinom; mindig kikötés: nevező $\neq 0$.
- Egyszerűsíteni csak szorzótényezőt lehet → előbb szorzattá alakítás.
- Összeadás: közös nevező (lkkt); osztás: szorzás a reciprokkal.

## A lecke feladata

```quiz required
? Egyszerűsítsd: $\dfrac{x^2 - 9}{x^2 + 3x}$ (a változó $x$, kikötés: $x \neq 0, -3$).
fn: x -> (x - 3)/x
domain: 0.5, 4
! $x^2 - 9 = (x - 3)(x + 3)$ és $x^2 + 3x = x(x + 3)$.

? Melyik értéket kell kizárni a $\dfrac{5}{x^2 - 4x}$ kifejezésnél a $0$ mellett?
= 4
! $x^2 - 4x = x(x - 4)$

? Hozd közös nevezőre és egyszerűsítsd: $\dfrac{1}{x} + \dfrac{1}{x + 1}$.
fn: x -> (2x + 1)/(x^2 + x)
domain: 0.5, 4

? Mennyi a $\dfrac{x^2 - 4}{3x} : \dfrac{x + 2}{6x^2}$ értéke $x = 5$ esetén?
= 30
! Az egyszerűsített alak $2x(x - 2)$.

? Melyik egyszerűsítés **helyes**?
- $\dfrac{x + 3}{x} = 3$
- $\dfrac{x^2 + 1}{x + 1} = x + 1$
+ $\dfrac{2x + 4}{x + 2} = 2$
- $\dfrac{a + b}{a} = b$
! Csak szorzótényezőt lehet egyszerűsíteni: $2x + 4 = 2(x + 2)$.
```
