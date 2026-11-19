---
title: Gyakorlás – diszkrét matematika
summary: Ellenőrző kérdések és összefoglaló feladatlap a logikához, a kombinatorikához, a számelmélethez és a gráfokhoz.
minutes: 60
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

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Binomiális együttható.** Írd meg a `binom(n, k)` függvényt `math.comb` és faktoriális nélkül! Tipp: $\binom{n}{k} = \frac{n}{1} \cdot \frac{n - 1}{2} \cdot \ldots \cdot \frac{n - k + 1}{k}$, és ha mindig előbb szorzol, aztán egész osztással osztasz, végig egész számok maradnak.

```python starter
def binom(n, k):
    return n * k
```

<details>
<summary>Megoldás</summary>

Az ötöslottón tehát $\frac{1}{43\,949\,268}$ az esély a telitalálatra.

```python solution
def binom(n, k):
    if k < 0 or k > n:
        return 0
    k = min(k, n - k)                     # szimmetria: kevesebb lépés
    eredmeny = 1
    for i in range(1, k + 1):
        eredmeny = eredmeny * (n - k + i) // i   # mindig osztható, egész marad
    return eredmeny
```

</details>

```python test
assert binom(5, 2) == 10
assert binom(10, 0) == 1
assert binom(90, 5) == 43949268          # ötöslottó
assert binom(52, 5) == 2598960           # pókerkezek
assert binom(3, 5) == 0
print("Minden ellenőrzés sikeres!")
```

**2.** **Euklideszi algoritmus.** Írd meg az `lnko(a, b)` függvényt `math.gcd` nélkül, az euklideszi algoritmussal: $\text{lnko}(a, b) = \text{lnko}(b, a \bmod b)$, és $\text{lnko}(a, 0) = a$!

```python starter
def lnko(a, b):
    return min(a, b)
```

<details>
<summary>Megoldás</summary>

```python solution
def lnko(a, b):
    while b != 0:
        a, b = b, a % b                   # a maradékkal folytatjuk
    return a
```

</details>

```python test
assert lnko(48, 18) == 6
assert lnko(17, 5) == 1
assert lnko(1071, 462) == 21
assert lnko(12, 0) == 12
print("Minden ellenőrzés sikeres!")
```

**3.** **Van-e Euler-út?** Egy összefüggő gráfban akkor van minden élen pontosan egyszer végigmenő út, ha a páratlan fokú csúcsok száma $0$ vagy $2$. Írd meg az `euler_ut(elek)` függvényt, amely az élek listájából (pl. `[("A", "B"), ...]`) eldönti ezt (`True`/`False`)! Feltételezheted, hogy a gráf összefüggő.

```python starter
def euler_ut(elek):
    return True
```

<details>
<summary>Megoldás</summary>

Az utolsó teszt a königsbergi hidak gráfja: mind a négy csúcs páratlan fokú, ezért Euler bebizonyította, hogy nincs ilyen séta.

```python solution
def euler_ut(elek):
    fok = {}
    for u, v in elek:                     # minden él két csúcs fokát növeli
        fok[u] = fok.get(u, 0) + 1
        fok[v] = fok.get(v, 0) + 1
    paratlan = sum(1 for d in fok.values() if d % 2 == 1)
    return paratlan in (0, 2)
```

</details>

```python test
assert euler_ut([("A", "B"), ("B", "C"), ("C", "A")]) is True                       # háromszög
assert euler_ut([("A", "B"), ("B", "C"), ("C", "D")]) is True                       # út
assert euler_ut([("A", "B"), ("A", "C"), ("A", "D")]) is False                      # csillag: 4 páratlan
assert euler_ut([("A", "B"), ("A", "B"), ("A", "C"), ("A", "C"), ("A", "D"), ("B", "D"), ("C", "D")]) is False  # Königsberg
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Hányféleképpen lehet sorba állítani 5 embert?
= 120
! $5! = 120$.

? Hányféle 3 fős bizottság választható 8 emberből?
= 56
! $\binom{8}{3} = 56$.

? Mennyi $7^{100} \bmod 6$?
= 1
! $7 \equiv 1 \pmod 6$, így $7^{100} \equiv 1$.

? Egy gráfban a csúcsok fokszámainak összege 24. Hány éle van?
= 12
! Kézfogási tétel: a fokszámok összege az élek számának kétszerese.

? Melyik formula tautológia?
- $A \to \lnot A$
+ $A \lor \lnot A$
- $A \land \lnot A$
- $A \to B$
! A harmadik kizárásának elve: egy állítás vagy igaz, vagy hamis.
```
