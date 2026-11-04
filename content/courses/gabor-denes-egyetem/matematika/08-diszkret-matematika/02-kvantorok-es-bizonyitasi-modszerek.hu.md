---
title: Kvantorok és bizonyítási módszerek
summary: A „minden” és a „létezik” kvantor, a tagadásuk, a direkt és az indirekt bizonyítás, és a teljes indukció.
minutes: 30
---

## Amit ebben a leckében megtanulsz

- mit jelent a **„minden”** ($\forall$) és a **„létezik”** ($\exists$) kvantor, és hogyan tagadjuk őket,
- a **direkt**, az **indirekt** bizonyítást és az **ellenpéldát**,
- a **teljes indukciót**, a programok helyességének egyik alapeszközét.

## Kvantorok

Egy **predikátum** változótól függő állítás, pl. $P(n)$: „$n$ páros”. Kvantorral állítássá tesszük:

- $\forall n\, P(n)$: **minden** $n$-re igaz,
- $\exists n\, P(n)$: **létezik** olyan $n$, amelyre igaz.

**Tagadás:** a kvantor megfordul, és a tagadás „bemegy”:

$$
\neg \forall x\, P(x) \equiv \exists x\, \neg P(x), \qquad \neg \exists x\, P(x) \equiv \forall x\, \neg P(x).
$$

Például a „Minden hallgató átment a ZH-n.” tagadása nem az, hogy „Senki sem ment át”, hanem: „**Van** olyan hallgató, aki **nem** ment át.”

A sorrend számít: $\forall x\, \exists y\, (y > x)$ igaz a valós számokon (mindenhez van nagyobb), de $\exists y\, \forall x\, (y > x)$ hamis (nincs mindennél nagyobb szám).

## Bizonyítási módszerek

- **Direkt bizonyítás:** a feltételből lépésenként jutunk el az állításig. Például: ha $n$ páratlan, $n = 2k + 1$, akkor $n^2 = 4k^2 + 4k + 1 = 2(2k^2 + 2k) + 1$ is páratlan.
- **Kontrapozíció:** $P \rightarrow Q$ helyett $\neg Q \rightarrow \neg P$-t látjuk be.
- **Indirekt bizonyítás (ellentmondással):** feltesszük, hogy az állítás hamis, és ellentmondásra jutunk. Klasszikus példa: $\sqrt 2$ irracionális. Ha $\sqrt 2 = \frac{p}{q}$ lenne (tovább nem egyszerűsíthető tört), akkor $p^2 = 2q^2$, így $p$ páros, $p = 2r$, ebből $q^2 = 2r^2$, tehát $q$ is páros, ami ellentmond annak, hogy a tört nem egyszerűsíthető.
- **Ellenpélda:** egy „minden”-es állítás cáfolatához **egy** ellenpélda elég. „Minden $n^2 + n + 41$ alakú szám prím” hamis, mert $n = 40$-re $40^2 + 40 + 41 = 41^2$.

## Teljes indukció

Ha be akarjuk látni, hogy $P(n)$ minden $n \geq 1$ egészre igaz, elég két dolgot igazolni:

1. **Kezdőlépés:** $P(1)$ igaz.
2. **Indukciós lépés:** ha $P(n)$ igaz (indukciós feltevés), akkor $P(n + 1)$ is igaz.

Olyan, mint a dominósor: az első eldől, és mindegyik eldönti a következőt.

**Példa.** $1 + 2 + \dots + n = \frac{n(n + 1)}{2}$.

- $n = 1$: $1 = \frac{1 \cdot 2}{2}$. ✓
- Ha $n$-re igaz, akkor $1 + \dots + n + (n + 1) = \frac{n(n + 1)}{2} + (n + 1) = \frac{(n + 1)(n + 2)}{2}$, ami épp az $n + 1$-re vonatkozó állítás. ✓

```plot
title: Az 1 + 2 + … + n összegek és az n(n + 1)/2 parabola
x: 0, 21
y: 0, 230
seq: sum(k, 1, n, k) @ 1, 20 # 1 + 2 + … + n
dash: x (x + 1)/2 # n(n + 1)/2
```

Az indukció a programozásban is megjelenik: egy ciklus **invariánsa** egy olyan állítás, amely a ciklus előtt igaz (kezdőlépés), és minden lépés megőrzi (indukciós lépés). A rekurzív függvények helyességét is indukcióval bizonyítjuk.

```python run
# Az indukcióval bizonyított képletek ellenőrzése az első néhány n-re (ez persze nem bizonyítás!)
for n in range(1, 8):
    s1 = sum(range(1, n + 1))
    s2 = sum(2 * k - 1 for k in range(1, n + 1))
    s3 = sum(k * k for k in range(1, n + 1))
    print(n, s1 == n * (n + 1) // 2, s2 == n * n, s3 == n * (n + 1) * (2 * n + 1) // 6)
```

## Összefoglalás

- $\neg\forall \equiv \exists\neg$, $\neg\exists \equiv \forall\neg$; a kvantorok sorrendje számít.
- Direkt, kontrapozíciós és indirekt bizonyítás; egy ellenpélda cáfol egy „minden”-es állítást.
- Teljes indukció: kezdőlépés + „$n$-ből következik $n + 1$”.

## A lecke feladata

```quiz required
? Mi a tagadása: „Minden prímszám páratlan.”?
- Minden prímszám páros.
- Nincs páratlan prímszám.
+ Van olyan prímszám, amely nem páratlan.
- Van olyan páratlan szám, amely nem prím.
! $\neg\forall x\, P(x) \equiv \exists x\, \neg P(x)$ (és valóban: a $2$).

? Melyik állítás **igaz** az egész számok halmazán?
+ $\forall x\, \exists y\, (x + y = 0)$
- $\exists y\, \forall x\, (x + y = 0)$
- $\forall x\, \forall y\, (x + y = 0)$
- $\exists x\, \forall y\, (x < y)$

? Mi a legkisebb $n \geq 1$, amelyre $n^2 + n + 41$ **nem** prím?
= 40

? Teljes indukcióval igazolható: $1 + 3 + 5 + \dots + (2n - 1) = \;?$ Írd be $n$ függvényeként!
fn: n -> n^2
domain: 1, 10

? Teljes indukcióval igazolható: $1^2 + 2^2 + \dots + n^2 = \;?$ Írd be $n$ függvényeként!
fn: n -> n (n + 1) (2n + 1)/6
domain: 1, 10
! $n = 1, 2, 3$-ra az összeg $1, 5, 14$.

? Melyik az indukciós bizonyítás két lépése?
- csak elég sok $n$-re kipróbáljuk
+ kezdőlépés: $P(1)$; indukciós lépés: $P(n) \Rightarrow P(n + 1)$
- feltesszük, hogy hamis, és ellentmondásra jutunk
- $P(n + 1) \Rightarrow P(n)$ minden $n$-re
```
