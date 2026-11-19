---
title: Gyakorlás – pénz és monetáris politika
summary: Ellenőrző kérdések és összefoglaló feladatlap a pénz funkcióiról, a pénzteremtésről, a mennyiségi egyenletről és a jegybanki döntésekről.
minutes: 55
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Miért nem tud a jegybank korlátlanul pénzt nyomtatni a gazdaság fellendítésére?</summary>

A mennyiségi egyenlet szerint ($MV = PY$), ha a pénzmennyiség sokkal gyorsabban nő, mint a reál kibocsátás, az árszint emelkedik. A termelést hosszú távon a munka, a tőke és a technológia határozza meg, nem a pénz mennyisége – a túl sok pénz így inflációhoz, szélsőséges esetben hiperinflációhoz vezet.

</details>

<details>
<summary>2. Hogyan hat egy kamatemelés egy egyetemistára, aki lakáshitelt tervez, és egy nagymamára, akinek betétje van?</summary>

Az egyetemistának drágább lesz a hitel (változó kamatnál a meglévő is), kisebb összeget vehet fel ugyanakkora részletből. A nagymama betétje magasabb kamatot hozhat – a kamatemelés a megtakarítóknak kedvez, a hitelfelvevőknek nem.

</details>

<details>
<summary>3. Miért nő a bankroham veszélye a mobilbankok és a közösségi média korában?</summary>

Mert egy rossz hír percek alatt terjed, és a pénzt néhány kattintással ki lehet venni – nem kell sorban állni a fiókban. A Silicon Valley Bank 2023-as összeomlása megmutatta, hogy egy bankroham órák alatt végbemehet.

</details>

<details>
<summary>4. Miért reagál késéssel az infláció a kamatemelésre?</summary>

Mert a hitelszerződések, a bérmegállapodások és a vállalati árazás csak fokozatosan igazodnak, a beruházási döntések hónapokra előre születnek, a várakozások pedig lassan változnak. Ezért a jegybanknak előre kell tekintenie: a mai döntés 1–2 év múlva hat.

</details>

## Összefoglaló feladatlap

```quiz required
? A pénz melyik funkciója sérül leginkább hiperinfláció idején?
- csereeszköz
- értékmérő
+ értékmegőrző
! A pénz órák alatt elveszti vásárlóerejét – senki nem tart pénzt.

? M = 200, V = 4, P = 2. Mennyi a reál kibocsátás (Y)?
= 400
! 200 · 4 / 2.

? Ha a pénzmennyiség 10%-kal nő, V és Y változatlan, hány százalékkal nő az árszint?
= 10
= 10%
! MV = PY: P arányosan nő.

? A tartalékráta 5%. Mennyi az egyszerű pénzmultiplikátor?
= 20
! 1 / 0,05.

? 2 000 000 Ft új betét kerül a bankrendszerbe, a tartalékráta 10%. Mennyi lehet elméletben az összes betét a folyamat végén (Ft)?
= 20000000
! 2 000 000 · 10.

? Recesszió van, az infláció 1%, a cél 3%. Mit javasol a tankönyvi modell?
- kamatemelés
+ kamatcsökkentés
- a kötelező tartalék emelése
! Lazító monetáris politika.

? Melyik nem a jegybank feladata Magyarországon?
- a bankjegykibocsátás
- az alapkamat meghatározása
+ az SZJA mértékének meghatározása
- a pénzügyi rendszer felügyelete
! Az adókról a parlament dönt – ez fiskális politika.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Pénzteremtés készpénztartással.** Írd meg a `penzmultiplikator(tartalek, keszpenz=0)` függvényt, amely megadja, hányszorosára nő egy új betét a bankrendszerben, ha a bankok `tartalek` arányt tartanak vissza, és minden hitelből `keszpenz` arány nem kerül vissza a bankokba: $\frac{1}{1 - (1 - r)(1 - k)}$. Kerekíts 2 tizedesre!

```python starter
def penzmultiplikator(tartalek, keszpenz=0):
    return round(1 / tartalek, 2)
```

<details>
<summary>Megoldás</summary>

```python solution
def penzmultiplikator(tartalek, keszpenz=0):
    visszaterul = (1 - tartalek) * (1 - keszpenz)   # ennyi kerül vissza betétként minden körben
    return round(1 / (1 - visszaterul), 2)          # mértani sor összege
```

</details>

```python test
assert penzmultiplikator(0.10) == 10.0
assert penzmultiplikator(0.05) == 20.0
assert penzmultiplikator(0.10, 0.20) == 3.57
assert penzmultiplikator(0.20, 0.10) == 3.57
print("Minden ellenőrzés sikeres!")
```

**2.** **Mennyiségi egyenlet.** Írd meg a `mennyisegi_inflacio(m, v, y)` függvényt, amely a pénzmennyiség (`m`), a forgási sebesség (`v`) és a reál GDP (`y`) százalékos növekedéséből kiszámolja az inflációt ($(1 + m)(1 + v) = (1 + \pi)(1 + y)$), 1 tizedesre!

```python starter
def mennyisegi_inflacio(m, v, y):
    return round(m - y, 1)
```

<details>
<summary>Megoldás</summary>

A kiinduló kód kihagyja a forgási sebességet – a második teszt épp azt mutatja, hogy nélküle teljesen rossz következtetésre jutnánk.

```python solution
def mennyisegi_inflacio(m, v, y):
    return round(100 * ((1 + m / 100) * (1 + v / 100) / (1 + y / 100) - 1), 1)
```

</details>

```python test
assert mennyisegi_inflacio(10, 0, 3) == 6.8
assert mennyisegi_inflacio(10, -10, 0) == -1.0
assert mennyisegi_inflacio(8, 0, 2) == 5.9
assert mennyisegi_inflacio(5, 2, 2) == 5.0
print("Minden ellenőrzés sikeres!")
```

**3.** **Taylor-szabály.** Írd meg a `taylor(inflacio, res, semleges=2.0, cel=3.0)` függvényt: $i = r^* + \pi + 0{,}5(\pi - \pi^*) + 0{,}5 \cdot \text{rés}$, de a kamat ne lehessen negatív (vágd 0-ra)! Kerekíts 2 tizedesre.

```python starter
def taylor(inflacio, res, semleges=2.0, cel=3.0):
    return round(semleges + inflacio, 2)
```

<details>
<summary>Megoldás</summary>

Az utolsó teszt a „zéró alsó korlát” helyzete: a szabály negatív kamatot kérne, de a jegybank ilyenkor nem hagyományos eszközökhöz (pl. eszközvásárlás) nyúl.

```python solution
def taylor(inflacio, res, semleges=2.0, cel=3.0):
    i = semleges + inflacio + 0.5 * (inflacio - cel) + 0.5 * res
    return round(max(i, 0.0), 2)           # a nominális kamat nem mehet nulla alá (alsó korlát)
```

</details>

```python test
assert taylor(3, 0) == 5.0
assert taylor(6, 2) == 10.5
assert taylor(5, 0) == 8.0
assert taylor(0, -6) == 0.0
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Mi NEM a pénz funkciója?
- értékmérő
- csereeszköz
- értékmegőrző
+ termelési tényező
! A pénz három klasszikus funkciója: értékmérő, csereeszköz, értékmegőrző.

? A jegybank alapkamata 6,5%, az infláció 4%. Kb. mennyi a reálkamat (%)?
= 2,5
= 2.5
! $6{,}5 - 4 = 2{,}5$.

? Mit tesz a jegybank, ha az infláció jóval a cél fölött van?
+ emeli az alapkamatot
- csökkenti az alapkamatot
- több pénzt nyomtat
- csökkenti a tartalékrátát
! Szigorít: drágítja a hitelt, visszafogja a keresletet.

? Mi a betétbiztosítás célja?
- a bankok nyereségének növelése
+ a bankpánik (tömeges betétkivonás) megelőzése
- az infláció csökkentése
- az állami hiány finanszírozása
! Ha a betétesek tudják, hogy a pénzük biztonságban van, nem rohannak a bankba.

? Egy 10 millió Ft-os változó kamatozású hitel kamata évi 4%-ról 7%-ra nő. Mennyivel nő a havi kamatteher az első hónapban (Ft)?
= 25000
! $10\,000\,000 \cdot \frac{0{,}03}{12} = 25\,000$ Ft.
```
