---
title: Számelmélet és moduláris aritmetika
summary: Oszthatóság, prímek, legnagyobb közös osztó és az euklideszi algoritmus, kongruenciák, a kis Fermat-tétel és az RSA titkosítás alapötlete.
minutes: 35
---

## Amit ebben a leckében megtanulsz

- az **oszthatóság**, a **prímszámok** és a számelmélet alaptételét,
- a **legnagyobb közös osztót** és az **euklideszi algoritmust**,
- a **maradékos (moduláris) számolást** és a kis **Fermat-tételt**,
- hogyan működik az **RSA** nyilvános kulcsú titkosítás.

## Oszthatóság és prímek

$a \mid b$ („$a$ osztója $b$-nek”), ha van olyan $c$ egész, hogy $b = a \cdot c$. A $p > 1$ szám **prím**, ha csak $1$ és önmaga osztja.

**A számelmélet alaptétele:** minden $n > 1$ egész a sorrendtől eltekintve egyértelműen felírható prímek szorzataként. Például $360 = 2^3 \cdot 3^2 \cdot 5$.

Prímből **végtelen sok** van (Eukleidész): ha csak $p_1, \dots, p_k$ lenne, akkor $p_1 p_2 \cdots p_k + 1$ egyikkel sem osztható, ami ellentmondás.

## Legnagyobb közös osztó, euklideszi algoritmus

$\operatorname{lnko}(a, b)$ a legnagyobb szám, amely $a$-t és $b$-t is osztja; $\operatorname{lkkt}(a, b)$ a legkisebb közös többszörös, és $\operatorname{lnko}(a, b) \cdot \operatorname{lkkt}(a, b) = a \cdot b$.

Az **euklideszi algoritmus** azon alapul, hogy $\operatorname{lnko}(a, b) = \operatorname{lnko}(b, a \bmod b)$. Maradékos osztásokkal haladunk, amíg a maradék $0$ nem lesz:

$$
120 = 1 \cdot 84 + 36, \quad 84 = 2 \cdot 36 + 12, \quad 36 = 3 \cdot 12 + 0 \quad \Rightarrow \quad \operatorname{lnko}(120, 84) = 12.
$$

Ez az algoritmus nagyon gyors: a lépések száma a kisebbik szám számjegyeinek számával arányos.

## Kongruenciák

$a \equiv b \pmod m$, ha $a$ és $b$ ugyanazt a maradékot adja $m$-mel osztva (vagyis $m \mid a - b$). Például $17 \equiv 2 \pmod 5$. Az informatikában ez a `%` művelet: `17 % 5 == 2`.

A kongruenciák **összeadhatók, kivonhatók, szorozhatók**, és **hatványozhatók**: ha $a \equiv b$, akkor $a^k \equiv b^k \pmod m$. Ezért nagy hatványok maradéka könnyen számolható. Például $7^{100} \bmod 5$: $7 \equiv 2$, és $2^4 = 16 \equiv 1$, így $2^{100} = (2^4)^{25} \equiv 1 \pmod 5$.

```plot
title: Az aⁿ maradékai m-mel osztva periodikusan ismétlődnek
x: -1, 16
y: -1, 13
param: a = 2, 2, 9, 1
param: m = 7, 2, 13, 1
seq: mod(a^n, m) @ 0, 15 # aⁿ mod m
```

**Kis Fermat-tétel:** ha $p$ prím és $p \nmid a$, akkor $a^{p-1} \equiv 1 \pmod p$. (Próbáld ki: $m = 7$-nél minden $a$-ra a $6.$ hatvány maradéka $1$.)

**Moduláris inverz:** $a$-nak van inverze modulo $m$ (olyan $x$, hogy $a x \equiv 1$), pontosan ha $\operatorname{lnko}(a, m) = 1$. Például $3 \cdot 5 = 15 \equiv 1 \pmod 7$, tehát $3^{-1} \equiv 5$. Az inverzet a **bővített euklideszi algoritmus** adja meg.

## Az RSA ötlete

1. Válassz két nagy prímet, $p$-t és $q$-t; legyen $n = pq$ és $\varphi = (p - 1)(q - 1)$.
2. Válassz $e$-t, amelyre $\operatorname{lnko}(e, \varphi) = 1$, és számold ki $d = e^{-1} \bmod \varphi$-t.
3. **Nyilvános kulcs:** $(n, e)$, **titkos kulcs:** $d$.
4. Titkosítás: $c = m^e \bmod n$; visszafejtés: $m = c^d \bmod n$.

A biztonság azon múlik, hogy $n$-ből a $p$ és $q$ prímtényezőket (több száz jegyű számoknál) nem tudjuk belátható időn belül kiszámolni, ezért $\varphi$-t és $d$-t sem.

```python run
from math import gcd
# Mini-RSA kis számokkal (a valóságban p és q több száz jegyű)
p, q = 3, 11
n, phi = p * q, (p - 1) * (q - 1)
e = 3
assert gcd(e, phi) == 1
d = pow(e, -1, phi)          # moduláris inverz (Python 3.8+)
uzenet = 4
titkos = pow(uzenet, e, n)   # gyors moduláris hatványozás
vissza = pow(titkos, d, n)
print(f"n = {n}, phi = {phi}, e = {e}, d = {d}")
print(f"üzenet: {uzenet} -> titkosítva: {titkos} -> visszafejtve: {vissza}")
```

## Összefoglalás

- Minden $n > 1$ egyértelműen prímek szorzata; prímből végtelen sok van.
- Euklideszi algoritmus: $\operatorname{lnko}(a, b) = \operatorname{lnko}(b, a \bmod b)$.
- Kongruenciákkal úgy számolunk, mint egyenlőségekkel (osztás helyett inverzzel szorzunk).
- Kis Fermat: $a^{p-1} \equiv 1 \pmod p$; RSA: $c = m^e$, $m = c^d \pmod n$.

## A lecke feladata

```quiz required
? Mennyi $\operatorname{lnko}(84, 120)$?
= 12

? Mennyi $\operatorname{lkkt}(12, 18)$?
= 36

? Melyik szám a $3^{2026}$ utolsó számjegye?
= 9
! Az utolsó jegyek: $3, 9, 7, 1, 3, 9, \dots$ (4-es periódus), és $2026 \equiv 2 \pmod 4$.

? Mennyi $7^{100} \bmod 5$?
= 1

? Mi a $3$ inverze modulo $7$ (az a $0$ és $6$ közötti $x$, amelyre $3x \equiv 1$)?
= 5

? RSA-ban $p = 5$, $q = 11$, $e = 3$. Mi a titkos kulcs, $d$? (Olyan $d$ $1$ és $\varphi - 1$ között, amelyre $e \cdot d \equiv 1 \pmod \varphi$.)
= 27
! $\varphi = 4 \cdot 10 = 40$, és $3 \cdot 27 = 81 = 2 \cdot 40 + 1$.
```
