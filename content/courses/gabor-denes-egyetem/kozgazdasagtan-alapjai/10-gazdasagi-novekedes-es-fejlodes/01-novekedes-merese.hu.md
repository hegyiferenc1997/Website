---
title: A gazdasági növekedés mérése
summary: Mit jelent, hogy egy gazdaság 3%-kal nő? A növekedési ráta, az egy főre jutó növekedés, a kamatos kamathoz hasonló „kamatos növekedés”, a 70-es szabály és a felzárkózás.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- hogyan számolod ki a **növekedési rátát**,
- miért fontos az **egy főre jutó** növekedés,
- miért számít óriásit hosszú távon a növekedési ütem kis különbsége,
- a **70-es szabályt**,
- mit jelent a **felzárkózás** (konvergencia).

## A növekedési ráta

A **gazdasági növekedés** a **reál GDP** (6. témakör) tartós bővülése. A növekedési ráta:

$$ g = \frac{Y_t - Y_{t-1}}{Y_{t-1}} \cdot 100 $$

Ha a reál GDP 100 egységről 103-ra nő, a növekedés **3%**.

### Egy főre jutó növekedés

Az életszínvonal szempontjából az **egy főre jutó** reál GDP növekedése számít:

$$ g_{\text{egy főre}} \approx g_{\text{GDP}} - g_{\text{népesség}} $$

Ha a GDP 2%-kal, a népesség 1%-kal nő, az egy főre jutó GDP csak kb. **1%-kal**. Magyarországon a népesség lassan csökken, így ott az egy főre jutó növekedés kicsit **nagyobb** a GDP növekedésénél.

## Kamatos növekedés

A növekedés **halmozódik**, mint a kamatos kamat (5. témakör): $Y_n = Y_0 \cdot (1 + g)^n$.

```plot
title: Egy főre jutó GDP alakulása 50 év alatt (kiinduló érték = 100)
x: 0, 50
y: 0, 1200
param: g = 2, 0, 5, 0.5
f: 100 (1 + g/100)^x # g%-os növekedés
dash: 100 (1.01)^x # 1%-os növekedés
value: érték 50 év után = 100 (1 + g/100)^50
```

50 év alatt 1%-os növekedéssel kb. 1,6-szoros, 2%-kal kb. 2,7-szeres, 4%-kal több mint 7-szeres lesz az életszínvonal. A gazdaságtörténet egyik nagy tanulsága, hogy a **tartós** növekedés kis különbségei teszik egyes országokat gazdaggá, másokat szegénnyé.

## A 70-es szabály

A duplázódási idő közelítőleg:

$$ \text{duplázódási idő (év)} \approx \frac{70}{g\ (\%)} $$

(Ugyanaz az ötlet, mint a 72-es szabály a kamatnál; a 70 a kis rátáknál pontosabb.)

- 2%-os növekedés → kb. **35 év** alatt duplázódik,
- 7%-os növekedés → kb. **10 év** alatt (Kína évtizedekig ennél is gyorsabban nőtt).

## Felzárkózás

A **konvergencia** (felzárkózás) azt jelenti, hogy a szegényebb országok **gyorsabban** nőnek, mint a gazdagok, így közelednek hozzájuk.

- **Miért lehetséges?** Átvehetik a már kifejlesztett technológiákat, és kevés tőke mellett egy újabb gép vagy út többet hoz (csökkenő hozadék – 2. lecke).
- **Példák:** Dél-Korea, Tajvan, Írország, a 2004-ben csatlakozott közép-kelet-európai országok (Lengyelország, Csehország, a balti államok, Magyarország) – az uniós átlaghoz közeledtek.
- **De nem automatikus:** sok ország évtizedekig nem zárkózik fel – a növekedés forrásain (2. lecke) és az intézményeken múlik.

**Példa:** ha egy ország egy főre jutó GDP-je a fejlett átlag 75%-a, és évente 2 százalékponttal gyorsabban nő, a különbség nagyjából 15 év alatt tűnik el.

## Összefoglalás

- Növekedési ráta: a reál GDP százalékos változása.
- Egy főre jutó növekedés ≈ GDP-növekedés − népességnövekedés.
- A növekedés halmozódik: $(1+g)^n$.
- 70-es szabály: duplázódási idő ≈ 70 / g.
- Felzárkózás: a szegényebbek gyorsabban nőhetnek, de ez nem automatikus.

## A lecke feladata

```quiz required
? A reál GDP 250-ről 260-ra nő. Hány százalékos a növekedés?
= 4
= 4%
! 10 / 250.

? A GDP 3%-kal, a népesség 0,5%-kal nő. Kb. hány százalékkal nő az egy főre jutó GDP?
= 2,5
= 2.5
! 3 − 0,5.

? A 70-es szabály szerint hány év alatt duplázódik egy évi 3,5%-kal növő gazdaság?
= 20
! 70 / 3,5.

? Miért nőhetnek gyorsabban a szegényebb országok?
+ mert átvehetik a meglévő technológiákat, és kevés tőke mellett nagyobb a beruházás hozama
- mert több pénzt nyomtatnak
- mert magasabb náluk az infláció
- mert kevesebb az emberük
! Felzárkózás (konvergencia).

? Két ország ugyanonnan indul, az egyik évi 1%-kal, a másik 3%-kal nő. Mi igaz 35 év múlva?
- egyformán gazdagok
+ a gyorsabb nagyjából 2-szer olyan gazdag lesz, mint a lassabb
- a lassabb lesz gazdagabb
! 1,03³⁵ ≈ 2,8 és 1,01³⁵ ≈ 1,4.
```
