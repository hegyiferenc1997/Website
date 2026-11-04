---
title: A modellezés lépései
summary: Hogyan lesz egy valós problémából matematikai modell: feltevések, változók, megoldás, értelmezés és ellenőrzés, mértékegységek és becslés.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- a **modellezési ciklus** lépéseit,
- hogyan válassz **változókat** és **feltevéseket**,
- hogyan ellenőrizd a modellt **mértékegységekkel** és **becsléssel**,
- egy egyszerű **lineáris modellt** a döntéshozatalhoz.

## A modellezési ciklus

Egy **matematikai modell** a valóság egyszerűsített leírása képletekkel. A tananyag minden témaköre ilyen eszköz volt: a függvények, a deriváltak, az integrálok és a differenciálegyenletek. A modellezés lépései:

1. **A probléma megértése:** mit akarunk tudni, és mire fogjuk használni?
2. **Feltevések és változók:** mi számít, és mi hanyagolható el (pl. „a légellenállás elhanyagolható”)? Mik a bemenetek, mi a kimenet, milyen mértékegységben?
3. **A matematikai modell felírása:** egyenlet, függvény, egyenlőtlenségrendszer, differenciálegyenlet…
4. **Megoldás:** papíron vagy programmal (numerikusan).
5. **Értelmezés:** mit jelent az eredmény a valóságban?
6. **Ellenőrzés (validálás):** egyezik-e a mérésekkel, értelmes-e a nagyságrend? Ha nem, vissza a 2. lépéshez, és finomítunk.

> „Minden modell téves, de némelyik hasznos.” (George E. P. Box)

## Ellenőrzés mértékegységgel és becsléssel

- **Dimenzióellenőrzés:** egy képlet két oldalának mértékegysége meg kell egyezzen, és csak azonos mértékegységű mennyiségeket adhatunk össze. Ha egy út képlete $s = v t^2$ lenne, a mértékegysége $\frac{\mathrm{m}}{\mathrm{s}} \cdot \mathrm{s}^2 = \mathrm{m \cdot s}$, ami nem hossz, tehát a képlet biztosan hibás.
- **A kitevőben, a $\sin$, $\ln$ argumentumában** csak mértékegység nélküli szám állhat: ezért $e^{-t/\tau}$ ($\tau$ idő) vagy $e^{-kt}$ ($k$ mértékegysége $\frac{1}{\mathrm{s}}$).
- **Nagyságrendi becslés (Fermi-becslés):** durva, de értelmes számokkal ellenőrizzük, hogy az eredmény nem képtelen-e. Például: „Mennyi adatot tölt fel egy nap alatt egy $10\,000$ fős egyetem?”

## Egy lineáris modell: melyik tarifa jobb?

Két taxitársaság díja $x$ km-re: **A**: $500 + 300x$ Ft, **B**: $1000 + 250x$ Ft. A két egyenes metszéspontja a **megtérülési pont**: $500 + 300x = 1000 + 250x$, vagyis $x = 10$ km. Ennél rövidebb útra A, hosszabbra B olcsóbb.

```plot
title: Két tarifa és a megtérülési pont (x km, y Ft)
x: 0, 20
y: 0, 7000
param: a = 300, 200, 400, 10
param: b = 250, 150, 350, 10
f: 500 + a x # A tarifa
f: 1000 + b x # B tarifa
value: megtérülési pont (km) = 500/(a - b)
```

A csúszkákkal a kilométerdíjakat változtathatod. Ha $a \leq b$, a két egyenes nem metszi egymást a pozitív tartományban (a megtérülési pont negatív vagy nem létezik): ilyenkor A mindig olcsóbb. A modell **feltevése**, hogy a díj a távolságtól lineárisan függ (nincs várakozási díj, dugó…).

## Összefoglalás

- Modellezés: probléma → feltevések, változók → modell → megoldás → értelmezés → ellenőrzés, és ismétlés.
- Mértékegység-ellenőrzés: a két oldal egyezzen; kitevőben és függvényargumentumban mértékegység nélküli szám áll.
- A lineáris modellek metszéspontja döntési határ (megtérülési pont).

## A lecke feladata

```quiz required
? Melyik a modellezési ciklus helyes sorrendje?
- megoldás → feltevések → ellenőrzés → értelmezés
+ feltevések és változók → modell → megoldás → értelmezés → ellenőrzés
- ellenőrzés → modell → feltevések → megoldás
- modell → megoldás → feltevések → ellenőrzés

? Az A tarifa $500 + 300x$, a B tarifa $1000 + 250x$ forint. Hány km-nél egyezik meg a két díj?
= 10

? Ugyanezekkel a tarifákkal mennyit fizetünk B-vel egy $16$ km-es útért (forintban)?
= 5000

? Melyik képlet lehet helyes, ha $s$ út (m), $v$ sebesség (m/s), $a$ gyorsulás (m/s²), $t$ idő (s)?
- $s = v t^2$
- $s = a t$
+ $s = v t + \frac{1}{2} a t^2$
- $s = v + a t$
! Minden tag mértékegysége m legyen.

? Az $N(t) = N_0 e^{-kt}$ modellben $t$ másodpercben van megadva. Mi a $k$ mértékegysége?
- s
+ 1/s
- m/s
- nincs mértékegysége, és $t$-nek sincs
! A kitevő mértékegység nélküli szám.
```
