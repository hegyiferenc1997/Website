---
title: Egyenletek és egyenlőtlenségek
summary: Első- és másodfokú, abszolút értékes és törtes egyenletek, egyenlőtlenségek, egyenletrendszerek és szöveges feladatok.
minutes: 30
---

## Amit ebben a leckében megtanulsz

- az **ekvivalens átalakításokat** és az **alaphalmaz / értelmezési tartomány** szerepét,
- a **másodfokú egyenlet** megoldóképletét és a **diszkriminánst**,
- az **abszolút értékes**, a **törtes** egyenleteket és az **egyenlőtlenségeket**,
- a kétismeretlenes **egyenletrendszereket** és a **szöveges feladatok** felírását.

## Ekvivalens átalakítások

Egy egyenlet két oldalán ugyanazt a műveletet végezhetjük el, ha az nem változtatja meg a megoldáshalmazt: ugyanazt adjuk hozzá, ugyanazzal a **nem nulla** számmal szorzunk. Ha **változót tartalmazó kifejezéssel** szorzunk vagy négyzetre emelünk, **hamis gyök** jöhet be – ilyenkor a végén **ellenőrizni** kell!

**Elsőfokú:** $3(x - 2) + 4 = x + 6 \Rightarrow 3x - 2 = x + 6 \Rightarrow 2x = 8 \Rightarrow x = 4$.

## Másodfokú egyenlet

$ax^2 + bx + c = 0$ ($a \neq 0$) megoldásai:

$$
x_{1,2} = \frac{-b \pm \sqrt{D}}{2a}, \qquad D = b^2 - 4ac.
$$

- $D > 0$: két különböző valós gyök; $D = 0$: egy (kétszeres) gyök; $D < 0$: nincs valós gyök.
- **Viète-formulák:** $x_1 + x_2 = -\dfrac{b}{a}$, $\ x_1 x_2 = \dfrac{c}{a}$.

Példa: $x^2 - 2x - 8 = 0$: $D = 4 + 32 = 36$, $x_{1,2} = \dfrac{2 \pm 6}{2}$, tehát $x_1 = 4$, $x_2 = -2$.

```plot
title: A másodfokú függvény és a gyökei
x: -6, 6
y: -10, 10
param: a = 1, -3, 3, 0.1
param: b = -2, -6, 6, 0.5
param: c = -8, -10, 10, 0.5
f: a x^2 + b x + c # ax² + bx + c
value: D = b^2 - 4a c
```

Figyeld meg: ha $D < 0$, a parabola nem metszi az $x$ tengelyt.

## Másodfokú egyenlőtlenség

$x^2 - 2x - 8 < 0$: a parabola felfelé nyíló, gyökei $-2$ és $4$, a tengely **alatt** a két gyök között van. Megoldás: $-2 < x < 4$, vagyis $x \in \left]-2; 4\right[$.

## Abszolút értékes egyenlet

$\lvert x - 3 \rvert = 5$ jelentése: $x$ távolsága a $3$-tól $5$. Tehát $x - 3 = 5$ vagy $x - 3 = -5$: $x = 8$ vagy $x = -2$.

**Egyenlőtlenség:** $\lvert x - 3 \rvert < 5 \iff -5 < x - 3 < 5 \iff -2 < x < 8$. (A $>$ esetén két külön intervallum lesz: $x < -2$ vagy $x > 8$.)

Bonyolultabb esetben **esetszétválasztás**: az abszolút érték belsejének előjele szerint külön-külön oldjuk meg, és megnézzük, a megoldás beleesik-e az adott esetbe.

## Törtes egyenlet és egyenlőtlenség

$\dfrac{x + 1}{x - 2} = 3$, kikötés: $x \neq 2$. Szorozva: $x + 1 = 3x - 6 \Rightarrow x = 3{,}5$, ami megfelel a kikötésnek.

Törtes **egyenlőtlenségnél** nem szorozhatunk egyszerűen a nevezővel (előjele ismeretlen)! Helyette $0$-ra rendezünk, és **előjeltáblázatot** készítünk:

$$
\frac{x + 1}{x - 2} \geq 0 \quad\Longrightarrow\quad x \leq -1 \ \text{ vagy } \ x > 2.
$$

## Egyenletrendszer

$$
\begin{cases} 2x + y = 7 \\ x - y = -1 \end{cases}
$$

**Behelyettesítés:** a másodikból $x = y - 1$, ezt az elsőbe: $2(y - 1) + y = 7 \Rightarrow y = 3$, $x = 2$. **Kiküszöbölés:** a két egyenletet összeadva $3x = 6$. Ellenőrzés mindig: $2 \cdot 2 + 3 = 7$ ✓.

## Szöveges feladatok

1. Jelöld az ismeretlent (mit kérdeznek?), 2. írd fel az összefüggéseket egyenletként, 3. oldd meg, 4. **ellenőrizd a szöveg alapján**, és válaszolj mondatban.

_Példa:_ Egy téglalap kerülete $34$ cm, területe $60$ cm². Oldalai $a$ és $b$: $a + b = 17$, $ab = 60$. Viète szerint $a, b$ a $t^2 - 17t + 60 = 0$ gyökei: $t = 12$ és $t = 5$. Az oldalak $12$ cm és $5$ cm.

## Összefoglalás

- Ekvivalens átalakítás; változós kifejezéssel szorzás/négyzetre emelés után ellenőrzés.
- $x_{1,2} = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$; a $D$ előjele dönti el a gyökök számát.
- $\lvert x - a \rvert = r \iff x = a \pm r$; törtes egyenlőtlenségnél előjeltáblázat.
- Egyenletrendszer: behelyettesítés vagy kiküszöbölés.

## A lecke feladata

```quiz required
? Oldd meg: $5x - 7 = 2x + 8$. Mennyi $x$?
= 5

? Az $x^2 + x - 12 = 0$ egyenletnek két gyöke van. Mennyi a **nagyobbik**?
= 3
! $D = 1 + 48 = 49$

? Hány valós gyöke van a $2x^2 - 4x + 5 = 0$ egyenletnek?
= 0
! $D = 16 - 40 < 0$

? Az $\lvert 2x - 1 \rvert = 7$ egyenlet gyökei közül mennyi a **kisebbik**?
= -3

? Melyik a $x^2 - 9 > 0$ egyenlőtlenség megoldása?
- $-3 < x < 3$
+ $x < -3$ vagy $x > 3$
- $x > 3$
- $x > 9$
! A felfelé nyíló parabola a gyökökön kívül pozitív.

? Oldd meg: $\begin{cases} x + 2y = 8 \\ 3x - y = 3 \end{cases}$. Mennyi $y$?
= 3
! $x = 2$, $y = 3$
```
