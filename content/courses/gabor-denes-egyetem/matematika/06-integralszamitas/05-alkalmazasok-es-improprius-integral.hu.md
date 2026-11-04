---
title: Alkalmazások és improprius integrál
summary: Átlagérték, megtett út, forgástest térfogata, és a végtelen intervallumon vagy szakadásnál vett integrál.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- a függvény **átlagértékét** egy intervallumon,
- hogyan számoljuk ki a sebességből a **megtett utat**, és a **forgástest térfogatát**,
- mi az **improprius integrál**, és mikor konvergens.

## Átlagérték

Az $f$ **átlagértéke** az $[a; b]$ intervallumon:

$$
\overline{f} = \frac{1}{b - a} \int_a^b f(x)\,dx.
$$

Ez annak a téglalapnak a magassága, amelynek területe ugyanannyi, mint a görbe alattié. Példa: a $\sin x$ átlaga a $[0; \pi]$-n $\frac{1}{\pi}\cdot 2 \approx 0{,}637$. (A váltóáram **effektív értéke** hasonló, a négyzet átlagából számolt mennyiség.)

## Megtett út, munka, mennyiség

Ha $v(t)$ a sebesség, a $[t_1; t_2]$ alatt megtett út $s = \int_{t_1}^{t_2} v(t)\,dt$. Általában: ha egy mennyiség **változási sebességét** ismerjük, az integrálja a **teljes változás**. Például ha egy szerver $r(t)$ kérést kap másodpercenként, egy óra alatt összesen $\int_0^{3600} r(t)\,dt$ kérés érkezik.

## Forgástest térfogata

Ha az $f \geq 0$ grafikonját az $x$ tengely körül megforgatjuk az $[a; b]$-n, a test térfogata (vékony korongokra bontva, mindegyik $\pi f(x)^2\,dx$):

$$
V = \pi \int_a^b f(x)^2\,dx.
$$

Példa: kúp. $f(x) = \frac{r}{h}x$ a $[0; h]$-n: $V = \pi \frac{r^2}{h^2} \cdot \frac{h^3}{3} = \frac{1}{3}\pi r^2 h$ – a jól ismert képlet.

## Improprius integrál

**Végtelen intervallum:**

$$
\int_a^{\infty} f(x)\,dx = \lim_{b \to \infty} \int_a^b f(x)\,dx,
$$

ha a határérték létezik és véges (**konvergens**). Példák:

- $\displaystyle\int_1^\infty \frac{1}{x^2}\,dx = \lim_{b\to\infty} \left[-\frac{1}{x}\right]_1^b = \lim_{b\to\infty} \left(1 - \frac{1}{b}\right) = 1$ – végtelen hosszú, mégis véges terület!
- $\displaystyle\int_1^\infty \frac{1}{x}\,dx = \lim_{b\to\infty} \ln b = \infty$ – divergens (vö. a harmonikus sorral).
- $\displaystyle\int_0^\infty e^{-x}\,dx = 1$.

**Nem korlátos függvény:** $\displaystyle\int_0^1 \frac{1}{\sqrt x}\,dx = \lim_{\varepsilon \to 0^+} \big[2\sqrt x\big]_\varepsilon^1 = 2$.

```plot
title: Az 1/x² alatti terület 1-től b-ig
x: 0, 12
y: -0.2, 1.5
param: b = 3, 1.5, 12, 0.5
area: 1/x^2 @ 1, b # 1/x²
dash: 1/x # 1/x
```

Akármeddig húzod $b$-t, az $\frac{1}{x^2}$ alatti terület sosem éri el az $1$-et; az $\frac{1}{x}$ alatti viszont minden határon túl nő.

## Összefoglalás

- Átlagérték: $\frac{1}{b - a}\int_a^b f$; teljes változás = a változási sebesség integrálja.
- Forgástest: $V = \pi\int_a^b f^2\,dx$.
- Improprius integrál: határérték; $\int_1^\infty \frac{1}{x^p}\,dx$ konvergens $\iff p > 1$.

## A lecke feladata

```quiz required
? Mennyi az $f(x) = x^2$ átlagértéke a $[0; 3]$ intervallumon?
= 3
! $\frac{1}{3} \cdot 9$

? Egy test sebessége $v(t) = 3t^2$ m/s. Hány métert tesz meg a $[0; 2]$ s időszakban?
= 8

? Mennyi a $y = \sqrt x$ grafikonjának $[0; 2]$ szakaszát az $x$ tengely körül megforgatva kapott test térfogata? (Két tizedesre kerekítve.)
= 6.28
! $\pi \int_0^2 x\,dx = 2\pi$

? Mennyi $\displaystyle\int_1^\infty \frac{1}{x^3}\,dx$? (Törtként vagy tizedes törtként.)
= 1/2

? Melyik improprius integrál **divergens**?
- $\int_1^\infty \frac{1}{x^2}\,dx$
- $\int_0^\infty e^{-2x}\,dx$
+ $\int_1^\infty \frac{1}{\sqrt x}\,dx$
- $\int_0^1 \frac{1}{\sqrt x}\,dx$
! $p = \frac{1}{2} \leq 1$
```
