---
title: Piaci egyensúly és állami beavatkozás
summary: Hol metszi egymást a kereslet és a kínálat? Az egyensúlyi ár és mennyiség kiszámítása, hiány és többlet, a görbék eltolódásának hatása, árplafon, árpadló és adó.
minutes: 30
---

## Amit ebben a leckében megtanulsz

- mi a **piaci egyensúly**, és hogyan számolod ki,
- mi a **hiány** és a **többlet**, és hogyan szűnik meg,
- hogyan változik az egyensúly, ha a görbék **eltolódnak**,
- mi történik **árplafon**, **árpadló** és **adó** esetén.

## Az egyensúly

A **piaci egyensúly** ott van, ahol a **keresett mennyiség = kínált mennyiség**. Az ehhez tartozó ár az **egyensúlyi ár** ($P^{\ast}$), a mennyiség az **egyensúlyi mennyiség** ($Q^{\ast}$).

Az ábrán a kereslet $P = a - 2Q$, a kínálat $P = c + Q$. Próbáld ki a csúszkákat!

```plot
title: Piaci egyensúly
x: 0, 60
y: 0, 150
param: a = 100, 60, 140, 5
param: c = 10, 0, 50, 5
f: a - 2x # kereslet
f: c + x # kínálat
point: (a - c)/3, c + (a - c)/3 # egyensúly
value: egyensúlyi mennyiség Q* = (a - c)/3
value: egyensúlyi ár P* = c + (a - c)/3
```

- Ha a **kereslet nő** (a ↑): az ár és a mennyiség is **nő**.
- Ha a **kínálat csökken** (c ↑): az ár **nő**, a mennyiség **csökken**.

## Az egyensúly kiszámítása

Gyakran mennyiségre rendezve adják meg a függvényeket:

- kereslet: $Q_D = 100 - 2P$
- kínálat: $Q_S = -20 + 4P$

Egyensúlyban $Q_D = Q_S$:

$$ 100 - 2P = -20 + 4P \;\Rightarrow\; 120 = 6P \;\Rightarrow\; P^{\ast} = 20 $$

Visszahelyettesítve: $Q^{\ast} = 100 - 2 \cdot 20 = 60$.

## Hiány és többlet

- Ha az ár **az egyensúlyi alatt** van: $Q_D > Q_S$ → **hiány** (túlkereslet). Sorban állnak, a vevők licitálnak → az ár **emelkedik**.
- Ha az ár **az egyensúlyi felett** van: $Q_S > Q_D$ → **többlet** (túlkínálat). Raktáron marad az áru → az eladók **árat csökkentenek**.

Szabad piacon ez a folyamat az egyensúly felé tolja az árat.

## Árplafon (maximált ár)

Az állam **felső határt** szab az árnak, az egyensúlyi ár **alatt**. Célja a vevők védelme (pl. lakbér, üzemanyag, alapélelmiszerek).

A fenti példában árplafon 15 Ft-on: $Q_D = 70$, $Q_S = 40$ → **30 egység hiány**.

Következmények: hiány, sorban állás, feketepiac, romló minőség, kevesebb beruházás. Magyarországon 2021 és 2022 vége között az üzemanyag-árstop idején, 2022 végén átmeneti benzinhiány alakult ki a kutakon.

## Árpadló (minimált ár)

Az állam **alsó határt** szab az árnak, az egyensúlyi ár **felett**. Célja az eladók védelme (pl. **minimálbér** a munkaerőpiacon – 8. témakör, mezőgazdasági garantált árak).

A példában árpadló 25 Ft-on: $Q_D = 50$, $Q_S = 80$ → **30 egység többlet**.

## Adó

Ha az állam termékenként adót vet ki (pl. jövedéki adó a cigarettára), a kínálati görbe **az adó összegével felfelé** tolódik. Az új egyensúlyban **magasabb a vevő által fizetett ár, kisebb a mennyiség**.

Az adó terhét a vevők és az eladók **megosztják**: a **rugalmatlanabb** oldal viseli a nagyobb részét. A cigaretta kereslete rugalmatlan, ezért az adó nagy részét a dohányosok fizetik meg.

## Összefoglalás

- Egyensúly: $Q_D = Q_S$; ezt az egyenletből számoljuk ki.
- Ár az egyensúly alatt → hiány; felett → többlet.
- Árplafon (egyensúly alatt) → hiány; árpadló (egyensúly felett) → többlet.
- Az adó felfelé tolja a kínálatot; terhét a rugalmatlanabb fél viseli jobban.

## A lecke feladata

```quiz required
? $Q_D = 120 - 3P$, $Q_S = 20 + 2P$. Mennyi az egyensúlyi ár?
= 20
! 120 − 3P = 20 + 2P → 100 = 5P.

? Mennyi az egyensúlyi mennyiség ugyanitt?
= 60
! 120 − 3 · 20 = 60.

? Az előző piacon 14 Ft-os árplafont vezetnek be. Mekkora lesz a hiány?
= 30
! Q_D = 120 − 3 · 14 = 78, Q_S = 20 + 2 · 14 = 48, a különbség 78 − 48.

? Ha a kereslet nő, a kínálat változatlan, mi történik az egyensúlyi árral és mennyiséggel?
+ mindkettő nő
- mindkettő csökken
- az ár nő, a mennyiség csökken
- az ár csökken, a mennyiség nő
! A keresleti görbe jobbra tolódik a kínálati görbe mentén.

? Hol kell lennie egy árpadlónak ahhoz, hogy hatása legyen?
- az egyensúlyi ár alatt
+ az egyensúlyi ár felett
- pontosan az egyensúlyi áron
! Alatta nem köt, a piac magasabb árat alakít ki.
```
