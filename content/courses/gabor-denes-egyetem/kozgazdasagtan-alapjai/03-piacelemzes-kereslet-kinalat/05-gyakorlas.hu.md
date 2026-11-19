---
title: Gyakorlás – kereslet, kínálat, egyensúly
summary: Ellenőrző kérdések és összefoglaló feladatlap egy gépi tanulási GPU-bérlési piac egyensúlyáról, eltolódásairól és az árplafonról.
minutes: 60
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Miért nem mondhatjuk, hogy „a drágulás miatt csökkent a kereslet”?</summary>

Mert a saját ár változása a **keresett mennyiséget** változtatja meg (mozgás a görbén), nem a **keresletet** (a görbe helyzetét). A kereslet csak akkor változik, ha egy másik tényező (jövedelem, helyettesítő ára, ízlés…) változik.

</details>

<details>
<summary>2. Egyszerre nő a kereslet és a kínálat. Mit tudunk biztosan mondani az egyensúlyi árról és mennyiségről?</summary>

A mennyiség biztosan **nő** (mindkét hatás növeli). Az ár iránya **bizonytalan**: a kereslet növekedése emeli, a kínálat növekedése csökkenti; az erősebb hatás dönt.

</details>

<details>
<summary>3. Miért szokott hiány kialakulni egy hatósági árplafon mellett?</summary>

Mert az egyensúlyi ár alatt a vevők többet szeretnének venni, az eladók viszont kevesebbet akarnak (vagy tudnak) eladni. Az ár nem tud felmenni, hogy kiegyenlítse a kettőt, ezért a különbség hiányként, sorban állásként jelenik meg.

</details>

<details>
<summary>4. Miért emeli az állam szívesen a rugalmatlan keresletű termékek (dohány, alkohol, üzemanyag) adóját?</summary>

Mert a fogyasztás alig csökken, így az adóbevétel megbízhatóan nő. Az egészségügyi termékeknél (dohány, alkohol) emellett a fogyasztás – kis mértékű – visszafogása is cél.

</details>

## Összefoglaló feladatlap

Egy felhős GPU-bérlési piacon (P: Ft/óra, Q: ezer óra/nap):

- kereslet: $Q_D = 200 - 4P$
- kínálat: $Q_S = -40 + 2P$

```quiz required
? Mennyi az egyensúlyi ár (Ft/óra)?
= 40
! 200 − 4P = −40 + 2P → 240 = 6P.

? Mennyi az egyensúlyi mennyiség (ezer óra)?
= 40
! 200 − 4 · 40.

? 30 Ft/órás árplafont vezetnek be. Mekkora a hiány (ezer óra)?
= 60
! Q_D = 80, Q_S = 20.

? Egy AI-láz miatt a kereslet $Q_D = 260 - 4P$-re nő. Mennyi az új egyensúlyi ár?
= 50
! 260 − 4P = −40 + 2P → 300 = 6P.

? Mennyi az új egyensúlyi mennyiség?
= 60
! 260 − 4 · 50.

? Mi történt a kereslettel?
+ a keresleti görbe jobbra tolódott
- mozgás a keresleti görbén
- a kínálati görbe balra tolódott
! Egy külső tényező (divat, várakozás) változott.

? Egy másik szolgáltatásban az ár 10%-kal nő, a keresett mennyiség 4%-kal csökken. Rugalmas vagy rugalmatlan a kereslet?
- rugalmas
+ rugalmatlan
! |E| = 0,4 < 1.

? Hogyan változik ott az árbevétel az áremelés után?
+ nő
- csökken
- nem változik
! Rugalmatlan keresletnél az áremelés növeli az árbevételt (1,1 · 0,96 = 1,056).
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Piaci egyensúly.** A kereslet $Q_D = a - bP$, a kínálat $Q_S = c + dP$. Írd meg az `egyensuly(a, b, c, d)` függvényt, amely az egyensúlyi `(ár, mennyiség)` párt adja vissza 2 tizedesre kerekítve!

```python starter
def egyensuly(a, b, c, d):
    return (round(a / b, 2), 0)
```

<details>
<summary>Megoldás</summary>

```python solution
def egyensuly(a, b, c, d):
    p = (a - c) / (b + d)                 # a − bP = c + dP
    return (round(p, 2), round(a - b * p, 2))
```

</details>

```python test
assert egyensuly(120, 2, -30, 3) == (30.0, 60.0)
assert egyensuly(200, 4, -40, 2) == (40.0, 40.0)
assert egyensuly(100, 1, -20, 2) == (40.0, 60.0)
assert egyensuly(50, 1, 0, 2) == (16.67, 33.33)
print("Minden ellenőrzés sikeres!")
```

**2.** **Árrugalmasság felezőpont-módszerrel.** Írd meg az `arrugalmassag(p1, q1, p2, q2)` függvényt, amely két pontból kiszámolja a kereslet árrugalmasságát: $E = \frac{(q_2 - q_1) / \bar q}{(p_2 - p_1) / \bar p}$, ahol $\bar q$ és $\bar p$ a két érték átlaga. Kerekíts 2 tizedesre!

```python starter
def arrugalmassag(p1, q1, p2, q2):
    return round((q2 - q1) / (p2 - p1), 2)
```

<details>
<summary>Megoldás</summary>

A felezőpont-módszer előnye, hogy ugyanazt az értéket adja, akár drágulásnak, akár olcsóbbodásnak nézzük a változást.

```python solution
def arrugalmassag(p1, q1, p2, q2):
    dq = (q2 - q1) / ((q1 + q2) / 2)      # a mennyiség relatív változása
    dp = (p2 - p1) / ((p1 + p2) / 2)      # az ár relatív változása
    return round(dq / dp, 2)
```

</details>

```python test
assert arrugalmassag(100, 800, 150, 600) == -0.71
assert arrugalmassag(200, 400, 250, 200) == -3.0
assert arrugalmassag(10, 100, 12, 90) == -0.58
print("Minden ellenőrzés sikeres!")
```

**3.** **Ki fizeti az adót?** Lineáris görbéknél ($Q_D = a - bP$, $Q_S = c + dP$) egy darabonkénti $t$ adóból a vevő $\frac{d}{b + d} \cdot t$-t, az eladó a többit viseli. Írd meg az `adoteher(b, d, t)` függvényt, amely a `(vevő része, eladó része)` párt adja vissza 2 tizedesre!

```python starter
def adoteher(b, d, t):
    return (round(t / 2, 2), round(t / 2, 2))
```

<details>
<summary>Megoldás</summary>

```python solution
def adoteher(b, d, t):
    vevo = d / (b + d) * t                # a rugalmatlanabb fél visel többet
    return (round(vevo, 2), round(t - vevo, 2))
```

</details>

```python test
assert adoteher(2, 3, 10) == (6.0, 4.0)
assert adoteher(0.5, 3, 7) == (6.0, 1.0)
assert adoteher(8, 2, 5) == (1.0, 4.0)
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Mi történik az egyensúlyi árral és mennyiséggel, ha nő a kereslet (a kínálat változatlan)?
+ mindkettő nő
- az ár nő, a mennyiség csökken
- mindkettő csökken
- az ár csökken, a mennyiség nő
! A keresleti görbe jobbra tolódik a kínálati görbe mentén.

? Az egyensúlyi ár 40, a hatósági árplafon 30. Ilyenkor mi alakul ki?
- többlet
+ hiány
- semmi nem változik
- új egyensúly 30-as áron
! Az egyensúlyi ár alatti plafon mellett a keresett mennyiség nagyobb a kínáltnál.

? Egy termék ára 10%-kal nő, a keresett mennyiség 5%-kal csökken. Mennyi az árrugalmasság?
= -0,5
= -0.5
= −0,5
= −0.5
! $\frac{-5\%}{10\%} = -0{,}5$ – rugalmatlan kereslet.

? Rugalmatlan keresletnél hogyan hat az áremelés az árbevételre?
+ nő
- csökken
- nem változik
- nullára esik
! A mennyiség kisebb arányban csökken, mint amennyivel az ár nő.

? Melyik tolja el a kávé keresleti görbéjét?
- a kávé árának emelkedése
+ a tea (helyettesítő termék) árának emelkedése
- a kávé árának csökkenése
- a kávé termelési költségének növekedése
! A saját ár csak mozgást okoz a görbén; a helyettesítő ára eltolja a görbét.
```
