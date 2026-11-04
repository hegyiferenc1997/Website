---
title: Gyakorlás – Taylor-polinom, Fourier-sorok
summary: Ellenőrző kérdések és összefoglaló feladatlap a Taylor-polinomhoz és a Fourier-sorokhoz.
minutes: 35
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Mi a különbség a Taylor-polinom és a Fourier-sor közelítése között?</summary>

A Taylor-polinom egy pont **környezetében** közelít (ott a függvényérték és a deriváltak egyeznek), távolabb a hiba gyorsan nőhet. A Fourier-sor egy **egész perióduson** át, átlagosan közelít, és ugrásos (nem deriválható) függvényekre is működik.

</details>

<details>
<summary>2. Miért elég $n = 9$ az $e$ értékéhez $10^{-6}$ pontossággal?</summary>

A Lagrange-maradéktag szerint a hiba legfeljebb $\frac{3}{(n + 1)!}$. Ez $n = 9$-re $\frac{3}{3\,628\,800} \approx 8{,}3 \cdot 10^{-7} < 10^{-6}$, $n = 8$-ra viszont $\frac{3}{362\,880} \approx 8{,}3 \cdot 10^{-6}$, ami még túl nagy.

</details>

<details>
<summary>3. Hogyan lehet gyorsan felírni $\sin(x^2)$ vagy $x e^x$ Taylor-polinomját?</summary>

Nem kell deriválni: az ismert sorba **helyettesítünk**, illetve **szorzunk**. $\sin(x^2) = x^2 - \frac{x^6}{6} + \dots$, és $x e^x = x + x^2 + \frac{x^3}{2} + \dots$

</details>

<details>
<summary>4. Miért csak szinuszok vannak a négyszögjel Fourier-sorában, és miért csak páratlan indexűek?</summary>

A négyszögjel páratlan függvény, ezért minden $a_k = 0$. A $b_k = \frac{2}{\pi}\cdot\frac{1 - \cos(k\pi)}{k}$ képletben páros $k$-ra $\cos(k\pi) = 1$, így $b_k = 0$. Szemléletesen: a jel „félhullám-szimmetrikus”, $f(x + \pi) = -f(x)$, és ezt a páros harmonikusok nem tudják.

</details>

## Összefoglaló feladatlap

```quiz required
? Add meg az $f(x) = e^x$ harmadfokú Taylor-polinomját az $a = 0$ pont körül!
fn: x -> 1 + x + x^2/2 + x^3/6
domain: -1, 1

? Add meg az $f(x) = \sqrt{1 + x}$ másodfokú Taylor-polinomját az $a = 0$ pont körül!
fn: x -> 1 + x/2 - x^2/8
domain: -0.5, 0.5
! $f'(0) = \frac{1}{2}$, $f''(0) = -\frac{1}{4}$, és $\frac{f''(0)}{2!} = -\frac{1}{8}$.

? Add meg az $f(x) = \ln x$ másodfokú Taylor-polinomját az $a = 1$ pont körül!
fn: x -> (x - 1) - (x - 1)^2/2
domain: 0.5, 1.5

? Az $x \mapsto \cos x$ Taylor-sorában mennyi az $x^4$-es tag együtthatója? (Törtként vagy tizedes törtként.)
= 1/24

? Melyik intervallumon konvergál a $1 + x + x^2 + \dots$ sor?
- minden valós $x$-re
- $0 \leq x < 1$
+ $-1 < x < 1$
- $-1 \leq x \leq 1$

? A $2\pi$ szerint periodikus $f(x) = x^2$ ($-\pi \leq x \leq \pi$) függvény páros. Mennyi a Fourier-sorában $b_5$?
= 0

? Az $f(x) = 5 - 3\cos(2x) + 4\sin(7x)$ függvény Fourier-sorában mennyi $a_0$?
= 10

? Ugyanebben a sorban mennyi $b_7$?
= 4

? Egy jel értéke $2$ a $(0; \pi)$ és $0$ a $(-\pi; 0)$ szakaszon. Mihez konvergál a Fourier-sora az $x = 0$ ugráshelyen?
= 1
! A két oldali határérték átlaga: $\frac{0 + 2}{2}$.

? Melyik jel Fourier-együtthatói csökkennek a leggyorsabban?
- a négyszögjel
- a fűrészjel
+ az $\lvert x \rvert$ periodikus folytatása (háromszögjel)
- mindháromé ugyanolyan gyorsan
! Ugrás nélküli, folytonos jel: $\frac{1}{k^2}$-es lecsengés.
```
