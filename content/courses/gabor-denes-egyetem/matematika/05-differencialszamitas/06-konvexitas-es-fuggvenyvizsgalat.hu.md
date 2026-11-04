---
title: Konvexitás és teljes függvényvizsgálat
summary: A második derivált, konvex és konkáv szakaszok, inflexiós pont, és a függvényvizsgálat lépései egy példán.
minutes: 30
---

## Amit ebben a leckében megtanulsz

- mit mond a **második derivált** a görbületről,
- mi a **konvex**, a **konkáv** szakasz és az **inflexiós pont**,
- a **teljes függvényvizsgálat** lépéseit egy kidolgozott példán.

## Második derivált és görbület

A második derivált $f'' = (f')'$ a meredekség változási sebessége.

- $f''(x) > 0$ egy intervallumon → $f$ ott **konvex** („felfelé görbül”, mint $x^2$; a húrok a görbe felett vannak),
- $f''(x) < 0$ → **konkáv** („lefelé görbül”, mint $-x^2$).
- **Inflexiós pont:** ahol a konvexitás megváltozik; szükséges feltétel $f''(x_0) = 0$, elégséges, ha $f''$ itt előjelet vált.

Példa: $x^3$: $f''(x) = 6x$; $x < 0$-ra konkáv, $x > 0$-ra konvex, a $0$ inflexiós pont.

Fizikában: ha $s(t)$ az út, akkor $s'(t)$ a sebesség, $s''(t)$ a **gyorsulás**.

## A teljes függvényvizsgálat lépései

1. Értelmezési tartomány, paritás, periodicitás.
2. Zérushelyek, $y$ tengelymetszet.
3. Határértékek a $D_f$ szélein, aszimptoták.
4. $f'$: monotonitás, szélsőértékek (előjeltáblázat).
5. $f''$: konvexitás, inflexiós pontok.
6. Értékkészlet, grafikon vázlata.

## Kidolgozott példa: $f(x) = x e^{-x}$

1. $D_f = \mathbb{R}$; nem páros, nem páratlan.
2. Zérushely: $x = 0$ (mert $e^{-x} > 0$); $f(0) = 0$.
3. $\lim\limits_{x \to \infty} \dfrac{x}{e^x} = 0$ (L'Hospital), tehát $y = 0$ vízszintes aszimptota jobbra; $\lim\limits_{x \to -\infty} x e^{-x} = -\infty$.
4. $f'(x) = e^{-x} - x e^{-x} = (1 - x)e^{-x}$: $x < 1$-re pozitív, $x > 1$-re negatív → **maximum** az $x = 1$-ben: $f(1) = \frac{1}{e} \approx 0{,}368$.
5. $f''(x) = -e^{-x} - (1 - x)e^{-x} = (x - 2)e^{-x}$: $x < 2$-re konkáv, $x > 2$-re konvex → **inflexiós pont** $x = 2$-ben, $f(2) = \frac{2}{e^2} \approx 0{,}271$.
6. $R_f = \left]-\infty; \frac{1}{e}\right]$.

```plot
title: f(x) = x·e⁻ˣ, f′ és f″
x: -1, 7
y: -1.2, 1.2
f: x e^(-x) # f
dash: (1 - x) e^(-x) # f′
dash: (x - 2) e^(-x) # f″
point: 1, 1/e # max
point: 2, 2/e^2 # inflexió
```

A grafikonon látszik: ahol $f'$ (szaggatott) metszi az $x$ tengelyt, ott van a maximum; ahol $f''$, ott az inflexió.

## Összefoglalás

- $f'' > 0$: konvex, $f'' < 0$: konkáv; inflexiós pont: $f''$ előjelet vált.
- Függvényvizsgálat: $D_f$ → zérushelyek → határértékek → $f'$ (monotonitás, szélsőérték) → $f''$ (konvexitás) → $R_f$, grafikon.

## A lecke feladata

```quiz required
? Add meg az $f(x) = x^4 - 6x^2$ második deriváltját!
fn: x -> 12x^2 - 12

? Hány inflexiós pontja van az $f(x) = x^4 - 6x^2$ függvénynek?
= 2
! $12x^2 - 12 = 0 \iff x = \pm 1$, és itt előjelet vált.

? Az $f(x) = x e^{-x}$ maximumának értéke $\frac{1}{e}$. Mennyi ez két tizedesre kerekítve?
= 0.37

? Melyik intervallumon **konvex** az $f(x) = x^3 - 3x^2$?
- $]-\infty; 1[$
+ $]1; \infty[$
- $]0; 2[$
- $]-\infty; 0[$
! $f''(x) = 6x - 6$

? Az $f(x) = \ln(x^2 + 1)$ függvénynek hol van minimuma? (Az $x$ értéket add meg.)
= 0
! $f'(x) = \frac{2x}{x^2 + 1}$
```
