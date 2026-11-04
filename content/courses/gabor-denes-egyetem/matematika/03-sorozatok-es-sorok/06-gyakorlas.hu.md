---
title: Gyakorlás – sorozatok és sorok
summary: Ellenőrző kérdések és összefoglaló feladatlap a sorozatokhoz, határértékekhez és sorokhoz.
minutes: 30
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Lehet-e egy sorozat korlátos, de divergens? És monoton, de divergens?</summary>

Igen, mindkettő: a $(-1)^n$ korlátos, de divergens (oszcillál); az $a_n = n$ monoton, de divergens ($+\infty$-hez tart). Csak a **monoton és korlátos** sorozat biztosan konvergens.

</details>

<details>
<summary>2. Miért nem elég, hogy a sor tagjai 0-hoz tartanak?</summary>

Mert a tagok lehetnek elég „lassan” kicsik ahhoz, hogy az összeg mégis végtelen legyen: a harmonikus sor $\sum \frac{1}{n}$ tagjai $0$-hoz tartanak, de a csoportosítással minden blokk összege legalább $\frac{1}{2}$.

</details>

<details>
<summary>3. Mi a teendő ∞/∞ alakú racionális törtnél?</summary>

Osztunk $n$ legmagasabb, a nevezőben szereplő hatványával. Azonos fokszámnál a határérték a főegyütthatók hányadosa, nagyobb nevezőfoknál $0$, nagyobb számlálófoknál $\pm\infty$.

</details>

<details>
<summary>4. Hol jelenik meg a mértani sor az informatikában?</summary>

Például az algoritmusok költségében: ha egy dinamikus tömb mindig kétszeresére nő, a másolások összköltsége $n + \frac{n}{2} + \frac{n}{4} + \dots \leq 2n$, vagyis egy beszúrás átlagosan állandó idejű.

</details>

## Összefoglaló feladatlap

```quiz required
? Egy számtani sorozatban $a_3 = 11$ és $a_8 = 31$. Mennyi $a_1$?
= 3
! $5d = 20$, tehát $d = 4$.

? Egy mértani sorozat első tagja $3$, első három tagjának összege $39$, a hányados pozitív. Mennyi a hányados?
= 3
! $3(1 + q + q^2) = 39 \Rightarrow q^2 + q - 12 = 0$

? Mennyi $\lim\limits_{n\to\infty} \dfrac{(2n + 1)^2}{3n^2 - n}$? (Törtként vagy tizedes törtként.)
= 4/3
! A főegyütthatók: $4$ és $3$.

? Mennyi $\lim\limits_{n\to\infty} \left(\sqrt{n^2 + n} - \sqrt{n^2 - n}\right)$?
= 1
! Bővíts az összeggel: $\frac{2n}{\sqrt{n^2 + n} + \sqrt{n^2 - n}}$.

? Mennyi $\lim\limits_{n\to\infty} \left(1 + \dfrac{3}{n}\right)^n$? (Kerekítsd két tizedesre!)
= 20.09

? Mennyi a $\sum\limits_{n=1}^{\infty} \dfrac{1}{3^n}$ sor összege? (Törtként vagy tizedes törtként.)
= 1/2
! Az első tag $\frac{1}{3}$, a hányados $\frac{1}{3}$.

? Melyik sor divergens?
- $\sum \frac{1}{2^n}$
- $\sum \frac{(-1)^n}{n}$
- $\sum \frac{1}{n^2 + 1}$
+ $\sum \frac{2n}{n + 5}$
! A tagok nem tartanak $0$-hoz.

? Melyik sorozat **szigorúan monoton csökkenő**?
+ $a_n = \frac{n + 3}{n}$
- $a_n = \frac{n}{n + 3}$
- $a_n = (-1)^n$
- $a_n = n^2 - 4n$
! $a_n = 1 + \frac{3}{n}$
```
