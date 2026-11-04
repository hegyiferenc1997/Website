---
title: Number Theory and Modular Arithmetic
summary: Divisibility, primes, the greatest common divisor and the Euclidean algorithm, congruences, Fermat's little theorem and the idea of RSA encryption.
minutes: 35
---

## What you will learn

- **divisibility**, **primes** and the fundamental theorem of arithmetic,
- the **greatest common divisor** and the **Euclidean algorithm**,
- **modular arithmetic** (computing with remainders) and **Fermat's little theorem**,
- how **RSA** public-key encryption works.

## Divisibility and primes

$a \mid b$ ("$a$ divides $b$") if there is an integer $c$ with $b = a \cdot c$. A number $p > 1$ is **prime** if it is divisible only by $1$ and itself.

**Fundamental theorem of arithmetic:** every integer $n > 1$ can be written as a product of primes, uniquely up to order. For example, $360 = 2^3 \cdot 3^2 \cdot 5$.

There are **infinitely many** primes (Euclid): if $p_1, \dots, p_k$ were all of them, then $p_1 p_2 \cdots p_k + 1$ would be divisible by none of them, a contradiction.

## Greatest common divisor, Euclidean algorithm

$\gcd(a, b)$ is the largest number dividing both $a$ and $b$; $\operatorname{lcm}(a, b)$ is the least common multiple, and $\gcd(a, b) \cdot \operatorname{lcm}(a, b) = a \cdot b$.

The **Euclidean algorithm** is based on $\gcd(a, b) = \gcd(b, a \bmod b)$. We keep dividing with remainder until the remainder is $0$:

$$
120 = 1 \cdot 84 + 36, \quad 84 = 2 \cdot 36 + 12, \quad 36 = 3 \cdot 12 + 0 \quad \Rightarrow \quad \gcd(120, 84) = 12.
$$

This algorithm is very fast: the number of steps is proportional to the number of digits of the smaller number.

## Congruences

$a \equiv b \pmod m$ if $a$ and $b$ leave the same remainder when divided by $m$ (that is, $m \mid a - b$). For example, $17 \equiv 2 \pmod 5$. In programming this is the `%` operator: `17 % 5 == 2`.

Congruences can be **added, subtracted, multiplied** and **raised to powers**: if $a \equiv b$, then $a^k \equiv b^k \pmod m$. That is why remainders of huge powers are easy to compute. For example, $7^{100} \bmod 5$: $7 \equiv 2$, and $2^4 = 16 \equiv 1$, so $2^{100} = (2^4)^{25} \equiv 1 \pmod 5$.

```plot
title: The remainders of aⁿ modulo m repeat periodically
x: -1, 16
y: -1, 13
param: a = 2, 2, 9, 1
param: m = 7, 2, 13, 1
seq: mod(a^n, m) @ 0, 15 # aⁿ mod m
```

**Fermat's little theorem:** if $p$ is prime and $p \nmid a$, then $a^{p-1} \equiv 1 \pmod p$. (Try it: with $m = 7$, the remainder of the $6$th power is $1$ for every $a$.)

**Modular inverse:** $a$ has an inverse modulo $m$ (an $x$ with $a x \equiv 1$) exactly when $\gcd(a, m) = 1$. For example, $3 \cdot 5 = 15 \equiv 1 \pmod 7$, so $3^{-1} \equiv 5$. The inverse is found with the **extended Euclidean algorithm**.

## The idea of RSA

1. Choose two large primes $p$ and $q$; let $n = pq$ and $\varphi = (p - 1)(q - 1)$.
2. Choose $e$ with $\gcd(e, \varphi) = 1$, and compute $d = e^{-1} \bmod \varphi$.
3. **Public key:** $(n, e)$, **private key:** $d$.
4. Encryption: $c = m^e \bmod n$; decryption: $m = c^d \bmod n$.

Its security rests on the fact that the prime factors $p$ and $q$ of $n$ (for numbers with hundreds of digits) cannot be computed in reasonable time, so neither can $\varphi$ and $d$.

```python run
from math import gcd
# Mini RSA with small numbers (in reality p and q have hundreds of digits)
p, q = 3, 11
n, phi = p * q, (p - 1) * (q - 1)
e = 3
assert gcd(e, phi) == 1
d = pow(e, -1, phi)          # modular inverse (Python 3.8+)
message = 4
secret = pow(message, e, n)  # fast modular exponentiation
back = pow(secret, d, n)
print(f"n = {n}, phi = {phi}, e = {e}, d = {d}")
print(f"message: {message} -> encrypted: {secret} -> decrypted: {back}")
```

## Summary

- Every $n > 1$ is uniquely a product of primes; there are infinitely many primes.
- Euclidean algorithm: $\gcd(a, b) = \gcd(b, a \bmod b)$.
- We compute with congruences like with equations (instead of dividing, we multiply by an inverse).
- Fermat's little theorem: $a^{p-1} \equiv 1 \pmod p$; RSA: $c = m^e$, $m = c^d \pmod n$.

## Lesson exercise

```quiz required
? What is $\gcd(84, 120)$?
= 12

? What is $\operatorname{lcm}(12, 18)$?
= 36

? What is the last digit of $3^{2026}$?
= 9
! The last digits are $3, 9, 7, 1, 3, 9, \dots$ (period 4), and $2026 \equiv 2 \pmod 4$.

? What is $7^{100} \bmod 5$?
= 1

? What is the inverse of $3$ modulo $7$ (the $x$ between $0$ and $6$ with $3x \equiv 1$)?
= 5

? In RSA, $p = 5$, $q = 11$, $e = 3$. What is the private key $d$? (A $d$ between $1$ and $\varphi - 1$ with $e \cdot d \equiv 1 \pmod \varphi$.)
= 27
! $\varphi = 4 \cdot 10 = 40$, and $3 \cdot 27 = 81 = 2 \cdot 40 + 1$.
```
