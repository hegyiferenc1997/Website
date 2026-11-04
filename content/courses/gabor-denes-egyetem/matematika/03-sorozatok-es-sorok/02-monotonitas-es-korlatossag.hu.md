---
title: Monotonitás és korlátosság
summary: Növekvő és csökkenő sorozatok, alsó és felső korlát, és hogyan bizonyítjuk ezeket.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- mikor **monoton növekvő** vagy **csökkenő** egy sorozat, és hogyan vizsgáljuk (különbség, hányados),
- mi az **alsó** és a **felső korlát**, és mikor **korlátos** egy sorozat,
- mi a **pontos felső korlát** (szuprémum).

## Monotonitás

Az $(a_n)$ sorozat

- **monoton növekvő**, ha minden $n$-re $a_{n+1} \geq a_n$ (**szigorúan**, ha $>$),
- **monoton csökkenő**, ha minden $n$-re $a_{n+1} \leq a_n$ (**szigorúan**, ha $<$).

**Vizsgálat különbséggel:** nézzük $a_{n+1} - a_n$ előjelét.

Példa: $a_n = \dfrac{n}{n + 1}$.

$$
a_{n+1} - a_n = \frac{n + 1}{n + 2} - \frac{n}{n + 1} = \frac{(n+1)^2 - n(n+2)}{(n+1)(n+2)} = \frac{1}{(n+1)(n+2)} > 0,
$$

tehát a sorozat szigorúan monoton növekvő.

**Vizsgálat hányadossal** (pozitív tagú sorozatnál): ha $\dfrac{a_{n+1}}{a_n} > 1$, növekvő. Példa: $a_n = \dfrac{2^n}{n!}$: $\dfrac{a_{n+1}}{a_n} = \dfrac{2}{n + 1} < 1$, ha $n \geq 2$, tehát $n \geq 2$-től csökkenő.

A $(-1)^n$ sorozat **nem monoton**: felváltva nő és csökken.

## Korlátosság

- $K$ **felső korlát**, ha minden $n$-re $a_n \leq K$; $k$ **alsó korlát**, ha $a_n \geq k$.
- A sorozat **korlátos**, ha alulról és felülről is korlátos, vagyis van olyan $M$, hogy $\lvert a_n \rvert \leq M$ minden $n$-re.

Példák:

- $a_n = \dfrac{n}{n+1}$: alsó korlát $\frac{1}{2}$ (az első tag, mert növekvő), felső korlát $1$. **Korlátos.**
- $a_n = n^2$: alulról korlátos ($1$), felülről nem. **Nem korlátos.**
- $a_n = (-1)^n$: $-1 \leq a_n \leq 1$. Korlátos, de nem monoton.

A legkisebb felső korlát a **szuprémum** ($\sup$), a legnagyobb alsó korlát az **infimum** ($\inf$). Az $\frac{n}{n+1}$ sorozatnál $\sup = 1$, pedig az $1$-et egyik tag sem éri el.

```plot
title: Az aₙ = n/(n + 1) sorozat a korlátaival
x: 0, 25
y: 0, 1.3
seq: n/(n + 1) @ 1, 25 # aₙ = n/(n+1)
dash: 1 # felső korlát: 1
dash: 0.5 # alsó korlát: 1/2
```

## Hogyan bizonyítsunk korlátot?

Felső korlátnál becslést írunk fel: $\dfrac{n}{n+1} < \dfrac{n + 1}{n + 1} = 1$. Alsó korlátnál, ha a sorozat növekvő, az első tag jó alsó korlát.

## Összefoglalás

- Monotonitás: $a_{n+1} - a_n$ előjele, vagy (pozitív tagoknál) $a_{n+1}/a_n$ és $1$ viszonya.
- Korlátos: van $k \leq a_n \leq K$; a növekvő sorozat alsó korlátja az első tag.
- $\sup$ = legkisebb felső korlát; nem feltétlenül tagja a sorozatnak.

## A lecke feladata

```quiz required
? Milyen az $a_n = 5 - \dfrac{1}{n}$ sorozat?
+ szigorúan monoton növekvő
- szigorúan monoton csökkenő
- nem monoton
! $a_{n+1} - a_n = \frac{1}{n} - \frac{1}{n + 1} > 0$

? Mennyi az $a_n = 5 - \dfrac{1}{n}$ sorozat legkisebb felső korlátja (szuprémuma)?
= 5

? Mennyi az $a_n = \dfrac{3n + 1}{n}$ sorozat legnagyobb tagja?
= 4
! $a_n = 3 + \frac{1}{n}$, és ez csökkenő.

? Melyik sorozat **korlátos, de nem monoton**?
- $a_n = n$
- $a_n = \frac{1}{n}$
+ $a_n = \frac{(-1)^n}{n}$
- $a_n = 2^n$
! Az előjel váltakozik, az abszolút érték legfeljebb $1$.

? Az $a_n = \dfrac{2^n}{n!}$ sorozat hányadik tagtól csökkenő? (Add meg a legkisebb $n$-et, amelyre $a_{n+1} < a_n$.)
= 2
! $\frac{a_{n+1}}{a_n} = \frac{2}{n+1}$; $n = 1$-nél ez $1$, vagyis $a_2 = a_1$.
```
