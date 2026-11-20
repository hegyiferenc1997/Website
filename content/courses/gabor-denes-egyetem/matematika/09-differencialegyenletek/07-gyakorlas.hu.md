---
title: Gyakorlás – differenciálegyenletek
summary: Ellenőrző kérdések és összefoglaló feladatlap a differenciálegyenletekhez.
minutes: 60
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Hogyan döntöd el, melyik módszer kell egy elsőrendű egyenlethez?</summary>

Először nézd meg, **szétválasztható-e** ($y' = f(x)g(y)$ alakra hozható-e). Ha nem, nézd meg, **lineáris-e** ($y' + p(x)y = q(x)$, vagyis $y$ és $y'$ csak első fokon, szorzat nélkül szerepel). Ha egyik sem, általában numerikus módszer kell.

</details>

<details>
<summary>2. Miért elég a megoldást ellenőrizni behelyettesítéssel?</summary>

Mert a megoldás definíció szerint olyan függvény, amely behelyettesítve azonosságot ad, és teljesíti a kezdeti feltételeket. A kezdetiérték-probléma megoldása (elég szép $f$ esetén) egyértelmű, ezért ha egy jelölt átmegy az ellenőrzésen, akkor **az** a megoldás, bárhonnan is jött.

</details>

<details>
<summary>3. Mi a fizikai jelentése a karakterisztikus egyenlet komplex gyökeinek?</summary>

A $\lambda = \alpha \pm \beta i$ gyökpárhoz $e^{\alpha x}(C_1\cos\beta x + C_2\sin\beta x)$ tartozik: $\beta$ a rezgés **körfrekvenciája**, $\alpha$ pedig a **csillapítás** ($\alpha < 0$: lecseng, $\alpha = 0$: állandó amplitúdó, $\alpha > 0$: felerősödik).

</details>

<details>
<summary>4. Miért nem mindig jó ötlet nagyon kicsi lépésközt választani az Euler-módszerben?</summary>

Mert a lépések száma (és így a futási idő) $\frac{1}{h}$-val arányos, és rengeteg lépésnél a kerekítési hibák is összeadódnak. Jobb egy magasabb rendű módszer (Runge–Kutta), amely nagyobb lépésközzel is pontos.

</details>

## Összefoglaló feladatlap

```quiz required
? Oldd meg: $y' = 4y$, $y(0) = 0{,}5$.
fn: x -> 0.5 e^(4x)
domain: -1, 0.5

? Oldd meg: $y' = 1 + y^2$, $y(0) = 0$ (a $-\frac{\pi}{2} < x < \frac{\pi}{2}$ tartományon).
fn: x -> tan(x)
domain: -1, 1
! $\int \frac{dy}{1 + y^2} = \operatorname{arctg} y$.

? Oldd meg: $y' + 2y = 4$, $y(0) = 0$.
fn: x -> 2 - 2 e^(-2x)

? Oldd meg: $y'' + 9y = 0$, $y(0) = 0$, $y'(0) = 3$.
fn: x -> sin(3x)

? Oldd meg: $y'' - y = 0$, $y(0) = 1$, $y'(0) = 1$.
fn: x -> e^x
domain: -2, 2

? Mi az $y'' + 6y' + 9y = 0$ általános megoldása?
- $C_1 e^{3x} + C_2 e^{-3x}$
+ $(C_1 + C_2 x)e^{-3x}$
- $C_1 \cos(3x) + C_2 \sin(3x)$
- $C_1 e^{-3x}$
! $\lambda^2 + 6\lambda + 9 = (\lambda + 3)^2$: kettős gyök.

? Egy izotóp felezési ideje $8$ nap. Hány nap alatt csökken a mennyisége a negyedére?
= 16

? Az $y' = 2x$, $y(0) = 0$ feladatra két Euler-lépést teszünk $h = 0{,}5$-tel. Mennyi $y_2$? (Tizedes törtként.)
= 0.5
! A pontos érték $y(1) = 1$; az Euler-módszer itt alulbecsül.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Euler-módszer.** Írd meg az `euler(f, y0, h, lepesek)` függvényt, amely az $y' = f(t, y)$, $y(0) = y_0$ kezdetiérték-problémát `lepesek` darab `h` hosszú lépéssel közelíti, és $y$ végső értékét 4 tizedesre kerekítve adja vissza!

```python starter
def euler(f, y0, h, lepesek):
    return round(y0 + f(0, y0) * h * lepesek, 4)
```

<details>
<summary>Megoldás</summary>

A kiinduló kód végig az induló meredekséggel lép – ez csak akkor helyes, ha a meredekség állandó.

```python solution
def euler(f, y0, h, lepesek):
    t, y = 0.0, y0
    for _ in range(lepesek):
        y += h * f(t, y)                  # lépés az aktuális meredekséggel
        t += h
    return round(y, 4)
```

</details>

```python test
assert euler(lambda t, y: y, 1, 0.5, 2) == 2.25
assert euler(lambda t, y: y, 1, 0.001, 1000) == 2.7169
assert euler(lambda t, y: 2 * t, 0, 0.1, 10) == 0.9
assert euler(lambda t, y: -0.5 * y, 10, 1, 3) == 1.25
print("Minden ellenőrzés sikeres!")
```

**2.** **Felezési idő.** Az $N' = -kN$ bomlás megoldása $N(t) = N_0 e^{-kt}$. Írd meg a `felezesi_ido(k)` és a `maradek(n0, k, t)` függvényt: az első a felezési időt adja vissza 2 tizedesre, a második a $t$ idő múlva megmaradt mennyiséget 2 tizedesre kerekítve!

```python starter
def felezesi_ido(k):
    return round(1 / k, 2)

def maradek(n0, k, t):
    return round(n0 - k * t, 2)
```

<details>
<summary>Megoldás</summary>

```python solution
import math

def felezesi_ido(k):
    return round(math.log(2) / k, 2)      # e^(−kT) = 1/2  →  T = ln 2 / k

def maradek(n0, k, t):
    return round(n0 * math.exp(-k * t), 2)
```

</details>

```python test
assert felezesi_ido(0.1) == 6.93
assert felezesi_ido(0.000121) == 5728.49   # szén-14, években
assert maradek(100, 0.1, 6.931) == 50.0
assert maradek(80, 0.5, 2) == 29.43
print("Minden ellenőrzés sikeres!")
```

**3.** **Newton-féle hűlés.** A $T' = -k(T - T_k)$ egyenlet megoldása $T(t) = T_k + (T_0 - T_k)e^{-kt}$. Írd meg a `mikor_hul_le(T0, Tk, k, cel)` függvényt, amely megadja, hány perc alatt hűl le a tárgy a `cel` hőmérsékletre (1 tizedesre kerekítve)!

```python starter
def mikor_hul_le(T0, Tk, k, cel):
    return round((T0 - cel) / k, 1)
```

<details>
<summary>Megoldás</summary>

A forró kávé (90 °C) 20 °C-os szobában kb. 14 perc alatt éri el az iható 55 °C-ot, de a 30 °C-hoz már majdnem háromszor annyi idő kell – minél közelebb van a környezethez, annál lassabban hűl.

```python solution
import math

def mikor_hul_le(T0, Tk, k, cel):
    # cel = Tk + (T0 − Tk)·e^(−kt)  →  t = ln((T0 − Tk) / (cel − Tk)) / k
    return round(math.log((T0 - Tk) / (cel - Tk)) / k, 1)
```

</details>

```python test
assert mikor_hul_le(90, 20, 0.05, 55) == 13.9
assert mikor_hul_le(90, 20, 0.05, 30) == 38.9
assert mikor_hul_le(200, 25, 0.1, 60) == 16.1
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Hányadrendű az $y'' + 3y' - y = \sin x$ differenciálegyenlet?
= 2
! A legmagasabb előforduló derivált a második.

? Add meg az $y' = -3y$, $y(0) = 5$ kezdetiérték-probléma megoldását!
fn: x -> 5*e^(-3*x)
domain: 0, 1
! $y = Ce^{-3x}$, $C = 5$.

? Egy anyag felezési ideje 10 nap. A kezdeti mennyiség hányad része marad meg 30 nap múlva? (tört vagy tizedes tört)
= 1/8
= 0,125
= 0.125
! Három felezés: $\left(\frac12\right)^3 = \frac18$.

? Az $y'' + 4y = 0$ egyenlet karakterisztikus gyökei $\pm 2i$. Milyen mozgást ír le?
- exponenciálisan csillapodó mozgást, rezgés nélkül
+ csillapítatlan harmonikus rezgést
- exponenciálisan növekvő mozgást
- egyenletes mozgást
! $y = C_1 \cos 2x + C_2 \sin 2x$.

? Egy RC-kör időállandója $\tau = RC$. Mennyi $\tau$ (s), ha $R = 10\,\text{k}\Omega$ és $C = 100\,\mu\text{F}$?
= 1
! $10^4 \cdot 10^{-4} = 1$ s.
```
