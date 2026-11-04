---
title: A függvények tulajdonságai
summary: Zérushely, tengelymetszetek, paritás, monotonitás, szélsőérték, korlátosság és periodicitás.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- a **zérushelyek** és a **tengelymetszetek** meghatározását,
- mikor **páros** vagy **páratlan** egy függvény,
- a **monotonitás**, a **szélsőérték** (minimum, maximum), a **korlátosság** és a **periodicitás** fogalmát,
- hogyan **jellemzünk** egy függvényt a grafikonja alapján.

## Zérushely és tengelymetszet

- **Zérushely:** az $x_0$, ahol $f(x_0) = 0$ – itt metszi (vagy érinti) a grafikon az $x$ tengelyt. Az $f(x) = 0$ egyenlet megoldásai.
- **$y$ tengelymetszet:** $f(0)$, ha $0 \in D_f$.

Példa: $f(x) = x^2 - 4x + 3 = (x - 1)(x - 3)$: zérushelyek $1$ és $3$, $y$ tengelymetszet $3$.

## Paritás

- **Páros:** $f(-x) = f(x)$ minden $x \in D_f$-re; a grafikon az $y$ tengelyre **szimmetrikus**. Pl. $x^2$, $\lvert x \rvert$, $\cos x$.
- **Páratlan:** $f(-x) = -f(x)$; a grafikon az **origóra** szimmetrikus. Pl. $x^3$, $\frac{1}{x}$, $\sin x$.
- A legtöbb függvény **egyik sem**, pl. $x^2 + x$. (Feltétel: $D_f$ szimmetrikus legyen a $0$-ra.)

## Monotonitás és szélsőérték

- $f$ **szigorúan monoton növekvő** az $I$ intervallumon, ha $x_1 < x_2 \Rightarrow f(x_1) < f(x_2)$ (csökkenő: $f(x_1) > f(x_2)$).
- **Abszolút (globális) maximum** az $x_0$ helyen: $f(x) \leq f(x_0)$ minden $x \in D_f$-re. **Helyi (lokális) maximum:** ez csak $x_0$ egy környezetében igaz. A minimum hasonló.

Az $x^2 - 4x + 3 = (x - 2)^2 - 1$ a $]-\infty; 2]$ intervallumon csökken, a $[2; \infty[$-en nő; minimuma az $x = 2$ helyen $-1$; maximuma nincs.

## Korlátosság és periodicitás

- **Korlátos**, ha van olyan $K$, hogy $\lvert f(x) \rvert \leq K$ minden $x$-re. Pl. $\sin x$ ($K = 1$), $\frac{1}{1 + x^2}$.
- **Periodikus** $p > 0$ periódussal, ha $f(x + p) = f(x)$ minden $x$-re. Pl. $\sin x$ ($2\pi$), $\tan x$ ($\pi$), a $x - \lfloor x \rfloor$ törtrész-függvény ($1$).

```plot
title: Egy függvény jellemzése
x: -2, 6
y: -3, 6
param: t = 1, -1.5, 5.5, 0.1
tangent: x^2 - 4x + 3 @ t # f(x) = x² − 4x + 3
point: 2, -1 # minimum
```

Az érintő meredeksége megmutatja a monotonitást: negatív, ahol a függvény csökken, pozitív, ahol nő, és $0$ a minimumhelyen. (Ezt a differenciálszámításnál pontosan is megindokoljuk.)

## Jellemzés ellenőrzőlista

1. $D_f$, 2. zérushelyek és $f(0)$, 3. paritás, periodicitás, 4. monotonitás intervallumai, 5. szélsőértékek, 6. $R_f$ és korlátosság, 7. viselkedés a $D_f$ szélein (határértékek, aszimptoták).

## Összefoglalás

- Zérushely: $f(x) = 0$; $y$ tengelymetszet: $f(0)$.
- Páros: $f(-x) = f(x)$ ($y$ tengelyre szimmetrikus); páratlan: $f(-x) = -f(x)$ (origóra szimmetrikus).
- Monotonitás intervallumonként; abszolút és helyi szélsőérték; korlátosság; periódus.

## A lecke feladata

```quiz required
? Melyik függvény **páratlan**?
- $x^4 - x^2$
+ $x^3 - 5x$
- $x^2 + x$
- $\cos x + 1$
! $f(-x) = -x^3 + 5x = -f(x)$

? Hol veszi fel a minimumát az $f(x) = x^2 - 6x + 2$ függvény? (Az $x$ értéket add meg.)
= 3
! $(x - 3)^2 - 7$

? Mennyi ennek a függvénynek a minimuma?
= -7

? Mennyi a $g(x) = \cos(2x)$ függvény legkisebb pozitív periódusa? (Kerekítsd két tizedesre!)
= 3.14

? Melyik függvény **korlátos**?
- $x^2$
- $e^x$
+ $\dfrac{1}{1 + x^2}$
- $\ln x$
! $0 < \frac{1}{1 + x^2} \leq 1$
```
