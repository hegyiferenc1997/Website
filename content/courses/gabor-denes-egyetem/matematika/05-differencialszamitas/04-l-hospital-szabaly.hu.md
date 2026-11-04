---
title: A L'Hospital-szabály
summary: Határozatlan alakok (0/0, ∞/∞, 0·∞, ∞ − ∞, 1^∞) határértéke deriválással, és a függvények növekedési sorrendje.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- a **L'Hospital-szabályt** a $\frac{0}{0}$ és $\frac{\infty}{\infty}$ alakokra,
- hogyan alakítjuk át erre a $0 \cdot \infty$, $\infty - \infty$ és $1^\infty$ alakokat,
- a függvények **növekedési sorrendjét** ($\ln x \ll x^k \ll e^x$).

## A szabály

Ha $\lim\limits_{x \to a} f(x) = \lim\limits_{x \to a} g(x) = 0$ (vagy mindkettő $\pm\infty$), és létezik a $\lim\limits_{x \to a} \dfrac{f'(x)}{g'(x)}$ határérték, akkor

$$
\lim_{x \to a} \frac{f(x)}{g(x)} = \lim_{x \to a} \frac{f'(x)}{g'(x)}.
$$

Az $a$ lehet $\pm\infty$ is. Figyelem: a számlálót és a nevezőt **külön-külön** deriváljuk, nem a hányadost!

**Példák:**

- $\lim\limits_{x \to 0} \dfrac{\sin x}{x} \overset{\frac{0}{0}}{=} \lim\limits_{x \to 0} \dfrac{\cos x}{1} = 1$.
- $\lim\limits_{x \to 0} \dfrac{e^x - 1 - x}{x^2} \overset{\frac{0}{0}}{=} \lim\limits_{x \to 0} \dfrac{e^x - 1}{2x} \overset{\frac{0}{0}}{=} \lim\limits_{x \to 0} \dfrac{e^x}{2} = \dfrac{1}{2}$ (kétszer alkalmaztuk).
- $\lim\limits_{x \to \infty} \dfrac{\ln x}{x} \overset{\frac{\infty}{\infty}}{=} \lim\limits_{x \to \infty} \dfrac{1/x}{1} = 0$.

Mielőtt alkalmazod, **ellenőrizd az alakot**: $\lim\limits_{x \to 0} \frac{x + 1}{x + 2} = \frac{1}{2}$ – itt nincs határozatlan alak, a szabály rossz eredményt adna ($1$).

## Más határozatlan alakok

- **$0 \cdot \infty$** → tört: $\lim\limits_{x \to 0^+} x \ln x = \lim\limits_{x \to 0^+} \dfrac{\ln x}{1/x} = \lim\limits_{x \to 0^+} \dfrac{1/x}{-1/x^2} = \lim\limits_{x \to 0^+} (-x) = 0$.
- **$\infty - \infty$** → közös nevező: $\dfrac{1}{x} - \dfrac{1}{\sin x} = \dfrac{\sin x - x}{x \sin x}$.
- **$1^\infty$, $0^0$, $\infty^0$** → $e$ alapra írás: $f^g = e^{g \ln f}$, és a kitevő határértékét számoljuk. Például $\lim\limits_{x \to 0^+} x^x = e^{\lim x \ln x} = e^0 = 1$.

## Növekedési sorrend

$x \to \infty$ esetén bármely $k > 0$ és $a > 1$ mellett

$$
\ln x \ \ll\ x^k \ \ll\ a^x \ \ll\ x!\ ,
$$

vagyis a hányadosuk $0$-hoz tart (pl. $\frac{x^{100}}{e^x} \to 0$, $100$-szori L'Hospital után). Az informatikában ez az **algoritmusok bonyolultságának** rangsora: $O(\log n) \ll O(n) \ll O(n^2) \ll O(2^n)$.

```plot
title: ln x, √x, x és eˣ⁄10 növekedése
x: 0, 12
y: 0, 12
f: ln(x) # ln x
f: sqrt(x) # √x
f: x # x
f: e^x/10 # eˣ/10
```

## Összefoglalás

- $\frac{0}{0}$ vagy $\frac{\infty}{\infty}$: $\lim \frac{f}{g} = \lim \frac{f'}{g'}$ (külön deriválva); többször is alkalmazható.
- Előtte mindig ellenőrizni kell, hogy tényleg határozatlan alak-e.
- $0 \cdot \infty$ → tört; $\infty - \infty$ → közös nevező; $1^\infty$ → $e^{g \ln f}$.
- $\ln x \ll x^k \ll a^x$.

## A lecke feladata

```quiz required
? Mennyi $\lim\limits_{x \to 0} \dfrac{e^{2x} - 1}{x}$?
= 2

? Mennyi $\lim\limits_{x \to 0} \dfrac{1 - \cos x}{x^2}$? (Törtként vagy tizedes törtként.)
= 1/2
! Kétszer kell alkalmazni a szabályt.

? Mennyi $\lim\limits_{x \to \infty} \dfrac{x^2}{e^x}$?
= 0

? Mennyi $\lim\limits_{x \to 1} \dfrac{\ln x}{x - 1}$?
= 1

? Mennyi $\lim\limits_{x \to \infty} \left(1 + \dfrac{2}{x}\right)^x$? (Kerekítsd két tizedesre!)
= 7.39
! $e^{\lim x \ln(1 + 2/x)} = e^2$

? Melyik esetben **nem** alkalmazható a L'Hospital-szabály?
- $\lim\limits_{x \to 0} \frac{\sin 3x}{x}$
- $\lim\limits_{x \to \infty} \frac{\ln x}{\sqrt x}$
+ $\lim\limits_{x \to 0} \frac{\cos x}{x + 1}$
- $\lim\limits_{x \to 0} \frac{e^x - 1}{\sin x}$
! Itt $\frac{1}{1}$ alak van, nem határozatlan.
```
