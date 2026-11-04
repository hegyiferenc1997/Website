---
title: Gyakorlás – diszkrét matematika
summary: Ellenőrző kérdések és összefoglaló feladatlap a logikához, a kombinatorikához, a számelmélethez és a gráfokhoz.
minutes: 35
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Miért igaz egy implikáció, ha az előtagja hamis?</summary>

Az implikáció egy ígéret: „ha $P$, akkor $Q$”. Csak akkor szegjük meg, ha $P$ teljesül, de $Q$ nem. Ha $P$ nem teljesül, az ígéretet nem szegtük meg, ezért az implikáció igaz. Formálisan: $P \rightarrow Q \equiv \neg P \lor Q$, ami hamis $P$-nél igaz.

</details>

<details>
<summary>2. Honnan tudod, hogy variáció vagy kombináció kell?</summary>

Kérdezd meg: ha két kiválasztás csak a sorrendben különbözik, az két különböző eset-e? Ha igen (dobogó, jelszó, sorrend), variáció; ha nem (csapat, lottó, kézben lévő lapok), kombináció. Utána: ismétlődhet-e egy elem?

</details>

<details>
<summary>3. Miért gyors az euklideszi algoritmus?</summary>

Mert két lépés alatt a nagyobbik szám legalább a felére csökken (ha $b \leq a/2$, akkor $a \bmod b < b \leq a/2$; ha $b > a/2$, akkor $a \bmod b = a - b < a/2$). Így a lépésszám a számjegyek számával arányos, ami az RSA-nál használt több száz jegyű számokra is gyors.

</details>

<details>
<summary>4. Miért van minden $n$ csúcsú fának $n - 1$ éle?</summary>

Teljes indukcióval: $1$ csúcsú fának $0$ éle van. Egy legalább $2$ csúcsú fában mindig van **levél** (elsőfokú csúcs: egy leghosszabb út végpontja). Ezt az éllel együtt elhagyva egy $n - 1$ csúcsú fát kapunk, amelynek az indukciós feltevés szerint $n - 2$ éle van, így az eredetinek $n - 1$.

</details>

## Összefoglaló feladatlap

```quiz required
? Töltsd ki az igazságtáblát: $Y = \neg(P \land Q)$ (NAND) és $Z = \neg P \lor \neg Q$.
table: P, Q -> Y = (P·Q)'; Z = P' + Q'
! A két oszlop azonos: ez a De Morgan-azonosság.

? Melyik a tagadása: „Van olyan hallgató, aki minden órán ott volt.”?
- Van olyan hallgató, aki egyik órán sem volt ott.
+ Minden hallgató hiányzott legalább egy óráról.
- Minden hallgató minden órán hiányzott.
- Egyetlen hallgató sem volt ott egyetlen órán sem.
! $\neg\exists h\,\forall o\, P(h, o) \equiv \forall h\,\exists o\,\neg P(h, o)$.

? Teljes indukcióval igazolható: $1 + 2 + 4 + \dots + 2^{n} = \;?$ Írd be $n$ függvényeként!
fn: n -> 2^(n + 1) - 1
domain: 0, 10

? Egy $32$ lapos kártyacsomagból hányféleképpen húzhatunk $4$ lapot (a sorrend nem számít)?
= 35960

? $5$ fiú és $4$ lány közül hányféleképpen választhatunk $2$ fiút és $2$ lányt?
= 60

? Mi az $x^4$ együtthatója a $(3x + 2)^{10}$ kifejtésében? (Csak a végeredményt írd be.)
= 1088640
! $\binom{10}{4} \cdot 3^4 \cdot 2^6$

? Mennyi $2^{50} \bmod 7$?
= 4
! $2^3 = 8 \equiv 1 \pmod 7$, és $50 = 3 \cdot 16 + 2$.

? Egy $10$ csúcsú gráfban minden csúcs foka $3$. Hány éle van?
= 15

? Melyik gráfban van zárt Euler-út (Euler-kör)?
- a $K_4$ teljes gráfban
+ a $K_5$ teljes gráfban
- egy $5$ csúcsú úton ($P_5$)
- bármely fában
! $K_n$-ben minden fok $n - 1$; ez $n = 5$-re páros.
```
