---
title: Numerikus integrálás
summary: Ha nincs képlet a primitív függvényre: téglalap-, trapéz- és Simpson-szabály, hibájuk és Python-megvalósításuk.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- miért van szükség **numerikus** integrálásra,
- a **téglalap-**, a **trapéz-** és a **Simpson-szabályt**,
- hogyan csökken a **hiba** a lépésköz függvényében, és hogyan programozzuk le ezeket.

## Miért kell?

Sok függvénynek **nincs elemi primitív függvénye**, pl. $e^{-x^2}$ (a normális eloszlás sűrűségfüggvénye), $\frac{\sin x}{x}$, $\sqrt{1 + x^4}$. Mérési adatoknál pedig nincs is képletünk, csak értékeink. Ilyenkor közelítő formulával számolunk – így számolnak a programkönyvtárak (pl. a `scipy.integrate`) is.

## A három alapszabály

Osszuk az $[a; b]$-t $n$ részre, $h = \frac{b - a}{n}$, $x_i = a + ih$.

**Téglalap (felezőpont):**

$$
\int_a^b f \approx h \sum_{i=0}^{n-1} f\!\left(x_i + \tfrac{h}{2}\right).
$$

**Trapéz:** a görbét szakaszonként egyenessel közelítjük:

$$
\int_a^b f \approx h \left( \frac{f(x_0)}{2} + f(x_1) + \dots + f(x_{n-1}) + \frac{f(x_n)}{2} \right).
$$

**Simpson** ($n$ páros): a görbét szakaszpáronként **parabolával** közelítjük:

$$
\int_a^b f \approx \frac{h}{3} \big( f(x_0) + 4f(x_1) + 2f(x_2) + 4f(x_3) + \dots + 4f(x_{n-1}) + f(x_n) \big).
$$

## A hiba

| Módszer       | Hiba nagyságrendje | $n$ megduplázása után a hiba |
| ------------- | ------------------ | ---------------------------- |
| téglalap      | $h^2$              | kb. negyedére csökken        |
| trapéz        | $h^2$              | kb. negyedére csökken        |
| Simpson       | $h^4$              | kb. tizenhatodára csökken    |

A Simpson-szabály polinomokra harmadfokig **pontos**.

```python run
import math

def teglalap(f, a, b, n):
    h = (b - a) / n
    return h * sum(f(a + (i + 0.5) * h) for i in range(n))

def trapez(f, a, b, n):
    h = (b - a) / n
    return h * (f(a) / 2 + sum(f(a + i * h) for i in range(1, n)) + f(b) / 2)

def simpson(f, a, b, n):
    h = (b - a) / n
    s = f(a) + f(b)
    for i in range(1, n):
        s += (4 if i % 2 else 2) * f(a + i * h)
    return s * h / 3

# Pontos érték: ∫_0^π sin x dx = 2.
for n in [4, 8, 16]:
    print(f"n = {n:>2}: téglalap {teglalap(math.sin, 0, math.pi, n):.8f}  "
          f"trapéz {trapez(math.sin, 0, math.pi, n):.8f}  "
          f"Simpson {simpson(math.sin, 0, math.pi, n):.8f}")

# Elemi primitív függvény nélkül: ∫_0^1 e^(-x²) dx ≈ 0,746824
print("e^(-x²):", round(simpson(lambda x: math.exp(-x * x), 0, 1, 100), 6))
```

```plot
title: Téglalapszabály egy elemien nem integrálható függvényre
x: -0.2, 2.2
y: -0.1, 1.2
param: k = 4, 1, 30, 1
riemann: e^(-x^2) @ 0, 2, k # e^(−x²)
```

## Összefoglalás

- Numerikus integrálás kell, ha nincs elemi primitív függvény, vagy csak mért adataink vannak.
- Téglalap és trapéz: hiba $\sim h^2$; Simpson: hiba $\sim h^4$ (sokkal pontosabb).
- A Simpson-szabály súlyai: $1, 4, 2, 4, \dots, 4, 1$, szorozva $\frac{h}{3}$-dal.

## A lecke feladata

```quiz required
? Trapézszabállyal, $n = 2$ részre osztva mennyi $\displaystyle\int_0^2 x^2\,dx$ közelítése?
= 3
! $h = 1$: $1 \cdot \left(\frac{0}{2} + 1 + \frac{4}{2}\right)$

? Simpson-szabállyal, $n = 2$ részre osztva mennyi $\displaystyle\int_0^2 x^2\,dx$ közelítése? (Törtként vagy két tizedesre.)
= 8/3
= 2.67
! $\frac{1}{3}(0 + 4 \cdot 1 + 4)$ – pontos, mert a Simpson parabolákkal közelít.

? Ha a trapézszabálynál $n$-et megduplázzuk, kb. hányad részére csökken a hiba?
= 4
= 1/4
! A hiba $h^2$-tel arányos.

? Melyik függvénynek **nincs** elemi primitív függvénye?
- $x e^{x^2}$
+ $e^{-x^2}$
- $\frac{1}{1 + x^2}$
- $\cos^2 x$
! A normális eloszlás integrálját ezért táblázatból vagy numerikusan számoljuk.

? Hány függvényérték kell a Simpson-szabályhoz $n = 10$ részre osztásnál?
= 11
```
