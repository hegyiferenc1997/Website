---
title: A határérték fogalma
summary: Konvergens és divergens sorozatok, az ε-küszöbindex definíció, és a monoton korlátos sorozatok tétele.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- mit jelent, hogy egy sorozat **tart** egy számhoz (**konvergens**),
- a határérték **pontos definícióját** ($\varepsilon$ és küszöbindex),
- mikor **divergens** egy sorozat, és mit jelent a $+\infty$-hez tartás,
- a **monoton és korlátos** sorozatok tételét.

## Szemléletesen

Az $a_n = \dfrac{1}{n}$ tagjai egyre közelebb kerülnek a $0$-hoz: $1;\ 0{,}5;\ 0{,}33;\ \dots;\ 0{,}01;\ \dots$ Akármilyen kicsi távolságot választunk, egy idő után **minden** tag ennél közelebb lesz a $0$-hoz. Ezt fogalmazza meg a definíció.

## A definíció

Az $(a_n)$ sorozat **határértéke** az $A$ szám, ha minden $\varepsilon > 0$-hoz van olyan $N$ **küszöbindex**, hogy

$$
\lvert a_n - A \rvert < \varepsilon \quad \text{minden } n > N \text{ esetén.}
$$

Jelölés: $\lim\limits_{n \to \infty} a_n = A$ vagy $a_n \to A$. Ekkor a sorozat **konvergens**; ha nincs ilyen $A$, **divergens**.

Szemléletesen: az $A$ körüli $\varepsilon$ sugarú „csíkon” kívül csak **véges sok** tag lehet.

```plot
title: A sorozat és az ε-csík
x: 0, 40
y: 0.5, 1.6
param: e = 0.1, 0.02, 0.3, 0.01
seq: (n + 2)/n @ 1, 40 # aₙ = (n + 2)/n
dash: 1 + e # A + ε
dash: 1 - e # A − ε
value: küszöbindex N = ceil(2/e)
```

**Példa.** $a_n = \dfrac{n + 2}{n} = 1 + \dfrac{2}{n} \to 1$. Adott $\varepsilon$-hoz: $\lvert a_n - 1 \rvert = \dfrac{2}{n} < \varepsilon \iff n > \dfrac{2}{\varepsilon}$. Tehát $N = \dfrac{2}{\varepsilon}$ jó küszöbindex; $\varepsilon = 0{,}1$-nél $N = 20$. A csúszkával ellenőrizheted: a küszöbindex után minden pont a csíkon belül van.

## Divergencia

- **$+\infty$-hez tart** ($a_n \to +\infty$), ha minden $K$-hoz van $N$, hogy $a_n > K$, ha $n > N$. Pl. $n^2$, $2^n$, $\sqrt n$. (Ez is divergens sorozat, csak „szép” módon.)
- **Oszcillál**, ha nem tart semmihez: pl. $(-1)^n$ a $-1$ és $1$ között ugrál.

## Fontos tételek

1. A határérték **egyértelmű**: egy sorozatnak legfeljebb egy határértéke van.
2. Minden konvergens sorozat **korlátos**. (Fordítva nem igaz: $(-1)^n$ korlátos, de divergens.)
3. **Monoton és korlátos ⇒ konvergens.** A növekvő, felülről korlátos sorozat a szuprémumához tart. Így bizonyítható például, hogy $\left(1 + \frac{1}{n}\right)^n$ konvergens (a határértéke az $e$ szám, lásd a következő leckét).

## Összefoglalás

- $a_n \to A$: minden $\varepsilon > 0$-hoz van $N$, hogy $n > N$ esetén $\lvert a_n - A \rvert < \varepsilon$.
- Divergens: nincs véges határérték (tarthat $\pm\infty$-hez vagy oszcillálhat).
- Konvergens ⇒ korlátos; monoton + korlátos ⇒ konvergens.

## A lecke feladata

```quiz required
? Mennyi az $a_n = \dfrac{n + 2}{n}$ sorozat határértéke?
= 1

? Az $a_n = 1 + \dfrac{2}{n}$ sorozatnál $\varepsilon = 0{,}05$ esetén mennyi a legkisebb egész küszöbindex $N$, amelyre minden $n > N$-re $\lvert a_n - 1 \rvert < \varepsilon$?
= 40
! $\frac{2}{n} < 0{,}05 \iff n > 40$

? Melyik sorozat **divergens**?
- $\frac{1}{n^2}$
- $\frac{n}{2n + 1}$
+ $(-1)^n \cdot \frac{n}{n + 1}$
- $\frac{(-1)^n}{n}$
! A páros indexű tagok $1$-hez, a páratlanok $-1$-hez tartanak.

? Mennyi az $a_n = \dfrac{5n - 3}{2n}$ sorozat határértéke? (Tizedes törtként vagy törtként.)
= 2.5
= 5/2
! $\frac{5n - 3}{2n} = \frac{5}{2} - \frac{3}{2n}$

? Melyik állítás **igaz**?
- Minden korlátos sorozat konvergens.
+ Minden konvergens sorozat korlátos.
- Minden monoton sorozat konvergens.
- A konvergens sorozatnak több határértéke is lehet.
```
