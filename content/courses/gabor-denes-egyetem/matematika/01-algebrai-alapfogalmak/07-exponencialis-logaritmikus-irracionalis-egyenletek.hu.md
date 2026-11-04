---
title: Exponenciális, logaritmikus és irracionális egyenletek
summary: Azonos alapra hozás, logaritmálás, új ismeretlen bevezetése, és a gyökös egyenletek hamis gyökei.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- hogyan oldunk meg **exponenciális** egyenletet (azonos alap, logaritmálás, új ismeretlen),
- hogyan oldunk meg **logaritmikus** egyenletet (kikötés, azonosságok),
- hogyan oldunk meg **irracionális** (gyökös) egyenletet, és miért kell **ellenőrizni**,
- mit kezdjünk az ilyen **egyenlőtlenségekkel**.

## Exponenciális egyenletek

**1. Azonos alapra hozás.** Mivel az $a^x$ függvény ($a > 0$, $a \neq 1$) kölcsönösen egyértelmű, $a^u = a^v \iff u = v$.

$$
4^{x+1} = 8^x \ \Rightarrow\ 2^{2x + 2} = 2^{3x} \ \Rightarrow\ 2x + 2 = 3x \ \Rightarrow\ x = 2.
$$

**2. Logaritmálás**, ha nem hozható azonos alapra: $3^x = 20 \Rightarrow x = \log_3 20 = \dfrac{\ln 20}{\ln 3} \approx 2{,}727$.

**3. Új ismeretlen.** $4^x - 6 \cdot 2^x + 8 = 0$. Legyen $y = 2^x > 0$: $y^2 - 6y + 8 = 0$, $y = 2$ vagy $y = 4$, tehát $x = 1$ vagy $x = 2$.

## Logaritmikus egyenletek

Először **kikötés**: a logaritmus argumentuma pozitív. Utána az azonosságokkal egyetlen logaritmusra hozunk, és „elhagyjuk” a logaritmust.

$$
\log_2 x + \log_2 (x - 2) = 3, \quad x > 2.
$$

$\log_2 \big(x(x - 2)\big) = 3 \Rightarrow x^2 - 2x = 8 \Rightarrow x = 4$ vagy $x = -2$. A kikötés miatt csak $x = 4$ jó.

## Irracionális (gyökös) egyenletek

Kikötés: a gyök alatti kifejezés $\geq 0$, és mivel a négyzetgyök értéke nemnegatív, a másik oldal is $\geq 0$. Négyzetre emelés után **mindig ellenőrzünk**, mert a négyzetre emelés nem ekvivalens átalakítás.

$$
\sqrt{x + 7} = x - 5.
$$

Négyzetre emelve: $x + 7 = x^2 - 10x + 25 \Rightarrow x^2 - 11x + 18 = 0 \Rightarrow x = 9$ vagy $x = 2$.

Ellenőrzés: $x = 9$: $\sqrt{16} = 4 = 9 - 5$ ✓. $\ x = 2$: $\sqrt 9 = 3$, de $2 - 5 = -3$ ✗ (**hamis gyök**). A megoldás: $x = 9$.

```plot
title: A két oldal grafikonja
x: -8, 14
y: -6, 8
f: sqrt(x + 7) # √(x + 7)
f: x - 5 # x − 5
point: 9, 4 # megoldás
```

A két grafikon csak egy pontban metszi egymást; a $x = 2$ a $-\sqrt{x+7} = x - 5$ egyenlet megoldása lenne.

## Egyenlőtlenségek

- **Exponenciális:** ha $a > 1$, az $a^x$ **nő**, így $a^u < a^v \iff u < v$; ha $0 < a < 1$, az irány **megfordul**. Például $\left(\frac{1}{2}\right)^x > 8 \iff x < -3$.
- **Logaritmikus:** ugyanez a $\log_a$-ra, de a kikötést is figyelembe vesszük: $\log_3 (x - 1) < 2 \iff 0 < x - 1 < 9 \iff 1 < x < 10$.

## Összefoglalás

- Exponenciális: azonos alap → kitevők egyenlők; különben logaritmálás; $a^{2x}$ alaknál új ismeretlen.
- Logaritmikus: kikötés (argumentum $> 0$), azonosságok, majd ellenőrzés a kikötéssel.
- Gyökös: kikötés, négyzetre emelés, **ellenőrzés** (hamis gyök!).
- Egyenlőtlenségnél $0 < a < 1$ alapnál megfordul a reláció.

## A lecke feladata

```quiz required
? Oldd meg: $9^x = 27$. Mennyi $x$?
= 1.5
= 3/2
! $3^{2x} = 3^3$

? Oldd meg: $\log_3 (2x + 1) = 2$. Mennyi $x$?
= 4

? Oldd meg: $9^x - 4 \cdot 3^x + 3 = 0$. Mennyi a **nagyobbik** gyök?
= 1
! Legyen $y = 3^x$: $y^2 - 4y + 3 = 0$, így $y = 1$ vagy $y = 3$.

? Oldd meg: $\sqrt{2x + 3} = x$. Mennyi $x$?
= 3
! A négyzetre emelés után kapott $x = -1$ hamis gyök.

? Melyik a $\left(\frac{1}{3}\right)^x < 9$ egyenlőtlenség megoldása?
- $x < -2$
+ $x > -2$
- $x < 2$
- $x > 2$
! $0 < a < 1$ alapnál a reláció megfordul: $3^{-x} < 3^2$.
```
