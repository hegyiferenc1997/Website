---
title: Függvény határértéke és folytonossága
summary: Határérték egy pontban és a végtelenben, egyoldali határérték, aszimptoták, folytonosság és szakadási helyek.
minutes: 30
---

## Amit ebben a leckében megtanulsz

- mit jelent a függvény **határértéke** egy pontban és a **végtelenben**,
- mi az **egyoldali** határérték, és mi a **függőleges** és **vízszintes aszimptota**,
- a $\frac{0}{0}$ alak kezelését és a nevezetes $\lim\limits_{x\to 0} \frac{\sin x}{x} = 1$ határértéket,
- mikor **folytonos** egy függvény, és milyen **szakadási** helyek vannak.

## Határérték egy pontban

$\lim\limits_{x \to x_0} f(x) = A$, ha az $x$ értékeket $x_0$-hoz közelítve (de $x \neq x_0$) az $f(x)$ értékek $A$-hoz közelítenek. Pontosabban: minden $x_n \to x_0$ ($x_n \neq x_0$) sorozatra $f(x_n) \to A$. **Nem számít**, mennyi $f(x_0)$, sőt az sem, hogy értelmezve van-e.

**$\frac{0}{0}$ alak – egyszerűsítés:**

$$
\lim_{x \to 2} \frac{x^2 - 4}{x - 2} = \lim_{x \to 2} \frac{(x - 2)(x + 2)}{x - 2} = \lim_{x \to 2} (x + 2) = 4.
$$

**Nevezetes határérték:** $\lim\limits_{x \to 0} \dfrac{\sin x}{x} = 1$ (a $0$ közelében $\sin x \approx x$).

## Egyoldali határérték, függőleges aszimptota

$\lim\limits_{x \to x_0^-} f(x)$ (balról) és $\lim\limits_{x \to x_0^+} f(x)$ (jobbról). A határérték akkor létezik, ha a kettő létezik és egyenlő.

$f(x) = \dfrac{1}{x}$: $\lim\limits_{x \to 0^+} \frac{1}{x} = +\infty$, $\lim\limits_{x \to 0^-} \frac{1}{x} = -\infty$. Az $x = 0$ **függőleges aszimptota**.

## Határérték a végtelenben, vízszintes aszimptota

$\lim\limits_{x \to \infty} \dfrac{2x^2 + 1}{x^2 - 3} = 2$ (ugyanúgy, mint a sorozatoknál: osztás a legmagasabb hatvánnyal). Az $y = 2$ **vízszintes aszimptota**.

```plot
title: Aszimptoták
x: -6, 6
y: -6, 8
f: (2x^2 + 1)/(x^2 - 3) # (2x² + 1)/(x² − 3)
dash: 2 # y = 2
```

## Folytonosság

$f$ **folytonos** az $x_0$ pontban, ha

$$
\lim_{x \to x_0} f(x) = f(x_0),
$$

vagyis (1) $f$ értelmezve van $x_0$-ban, (2) a határérték létezik, (3) a kettő egyenlő. Szemléletesen: a grafikon „ceruzafelemelés nélkül” rajzolható.

Az elemi függvények (polinomok, $e^x$, $\ln x$, $\sin x$, …) és a belőlük műveletekkel, kompozícióval kapott függvények **értelmezési tartományuk minden pontjában folytonosak**.

**Szakadási helyek:**

- **megszüntethető:** a határérték létezik, de $\neq f(x_0)$, vagy $f(x_0)$ nincs értelmezve (pl. $\frac{x^2 - 4}{x - 2}$ a $2$-ben);
- **ugrás:** a két egyoldali határérték véges, de különböző (pl. az előjelfüggvény a $0$-ban);
- **lényeges / végtelen:** legalább az egyik egyoldali határérték nem létezik vagy végtelen (pl. $\frac{1}{x}$ a $0$-ban).

```plot
title: Ugrás és megszüntethető szakadás
x: -4, 4
y: -2, 6
param: c = 1, -1, 3, 0.1
f: (x^2 - 4)/(x - 2) # (x² − 4)/(x − 2)
f: sgn(x) + c # sgn x + c
point: 2, 4 # „lyuk”
```

## Bolzano-tétel

Ha $f$ folytonos $[a; b]$-n, és $f(a)$, $f(b)$ ellentétes előjelű, akkor van $c \in \left]a; b\right[$, amelyre $f(c) = 0$. Erre épül a **felezéses (bisection) módszer**: mindig azt a fél intervallumot tartjuk meg, ahol előjelváltás van.

```python run
def felezes(f, a, b, lepesek=40):
    """Zérushely keresése felezéssel: f(a) és f(b) ellentétes előjelű."""
    for _ in range(lepesek):
        c = (a + b) / 2
        if f(a) * f(c) <= 0:
            b = c
        else:
            a = c
    return (a + b) / 2

# Az x³ − x − 2 zérushelye 1 és 2 között.
print(round(felezes(lambda x: x**3 - x - 2, 1, 2), 6))
```

## Összefoglalás

- $\lim_{x\to x_0} f(x)$: az $x_0$ közeli értékek viselkedése, $f(x_0)$-tól független; $\frac{0}{0}$-nál egyszerűsítés; $\frac{\sin x}{x} \to 1$.
- Egyoldali határértékek; függőleges ($\pm\infty$ egy pontban) és vízszintes (határérték a végtelenben) aszimptota.
- Folytonos: $\lim_{x\to x_0} f(x) = f(x_0)$; szakadás: megszüntethető, ugrás, lényeges.
- Bolzano: folytonos függvény előjelváltáskor felveszi a $0$-t → felezéses módszer.

## A lecke feladata

```quiz required
? Mennyi $\lim\limits_{x \to 3} \dfrac{x^2 - 9}{x - 3}$?
= 6

? Mennyi $\lim\limits_{x \to \infty} \dfrac{6x^2 - x}{3x^2 + 5}$?
= 2

? Mennyi $\lim\limits_{x \to 0} \dfrac{\sin(5x)}{x}$?
= 5
! $\frac{\sin 5x}{x} = 5 \cdot \frac{\sin 5x}{5x}$

? Milyen szakadása van az $f(x) = \dfrac{1}{x - 1}$ függvénynek az $x = 1$ helyen?
- megszüntethető szakadás
- ugrás
+ lényeges (végtelen) szakadás, függőleges aszimptota
- nincs szakadása
! Az egyoldali határértékek $\pm\infty$.

? Az $f(x) = \begin{cases} x + a, & x < 1 \\ 3x, & x \geq 1 \end{cases}$ függvény mely $a$ értékre folytonos?
= 2
! A bal oldali határérték $1 + a$, a függvényérték $3$.
```
