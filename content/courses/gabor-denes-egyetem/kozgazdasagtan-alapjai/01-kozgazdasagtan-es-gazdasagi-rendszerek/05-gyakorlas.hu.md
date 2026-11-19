---
title: Gyakorlás – szűkösség és gazdasági rendszerek
summary: Ellenőrző kérdések és összefoglaló feladatlap a termelési lehetőségek határáról, az alternatív költségről és a gazdasági rendszerekről.
minutes: 55
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Miért mondjuk, hogy „nincs ingyen ebéd”?</summary>

Mert minden választásnak van alternatív költsége. Még ha pénzt nem is fizetsz valamiért, az idődet, a figyelmedet vagy egy másik lehetőséget feláldozod érte. Egy „ingyenes” alkalmazásnál például az adataiddal és a figyelmeddel fizetsz.

</details>

<details>
<summary>2. Miért homorú (kifelé hajló) általában a termelési lehetőségek határa?</summary>

Mert az erőforrások nem egyformán alkalmasak minden feladatra. Ahogy egyre többet termelünk az egyik termékből, egyre kevésbé alkalmas erőforrásokat kell átcsoportosítanunk, így a másik termékből egyre többről kell lemondanunk (növekvő alternatív költség).

</details>

<details>
<summary>3. Mi a tervgazdaság két legnagyobb gyengesége?</summary>

Az **információs probléma** (a központi tervező nem ismerheti milliók igényeit és a helyi körülményeket) és az **ösztönzés hiánya** (a többletmunka, az innováció nem éri meg). A következmény hiány, sorban állás, alacsony minőség és lassú fejlődés.

</details>

<details>
<summary>4. Miért kínálja alul a piac a közjavakat?</summary>

Mert senkit nem lehet kizárni a használatukból, ezért mindenki potyautas lehet: használja, de nem fizet érte. Egy magánvállalat így nem tudná beszedni a költségeit, ezért jellemzően az állam biztosítja őket adókból.

</details>

<details>
<summary>5. Egy startup 18 hónapja fejleszt egy terméket, amelyre a tesztek szerint nincs igény. Mit tanácsolnál a határelemzés alapján?</summary>

Az eddig elköltött pénz és idő elsüllyedt költség, a döntésnél nem számít. Azt kell összevetni, hogy a **további** fejlesztés költségeiért cserébe mekkora haszon várható – ha kevés, érdemes leállni vagy irányt váltani (_pivot_).

</details>

## Összefoglaló feladatlap

Egy kis ország egy évben **laptopot** és **búzát** termelhet. A termelési lehetőségei (a többi pont között egyenes vonal fut):

| Kombináció       | A   | B   | C   | D   | E   |
| ---------------- | --- | --- | --- | --- | --- |
| Laptop (ezer db) | 0   | 10  | 20  | 30  | 40  |
| Búza (ezer t)    | 100 | 95  | 80  | 55  | 0   |

```quiz required
? Hány ezer tonna búza az alternatív költsége annak, ha B-ről C-re lépünk (10 ezerrel több laptop)?
= 15
! 95 − 80 = 15.

? Hány ezer tonna búza az alternatív költsége annak, ha D-ről E-re lépünk?
= 55
! 55 − 0 = 55.

? Mit mutat, hogy a két előző válasz eltér?
- a TLH egyenes
+ a növekvő alternatív költséget
- hogy a laptop olcsóbb lett
- hibás a táblázat
! Minél több laptopot gyártunk, annál drágább (búzában mérve) a következő.

? Az ország 20 ezer laptopot és 60 ezer tonna búzát termel. Milyen ez a pont?
- hatékony
+ nem hatékony
- elérhetetlen
! C-ben 20 ezer laptop mellett 80 ezer t búza is lehetne.

? Elérhető-e jelenleg 30 ezer laptop és 70 ezer tonna búza?
- igen
+ nem
! D-ben 30 ezer laptop mellett legfeljebb 55 ezer t búza jut.

? Melyik esemény tolná kifelé az ország TLH-ját?
- a munkanélküliség növekedése
+ egy hatékonyabb chipgyártási technológia
- a búza árának emelkedése
- egy gyár bezárása
! Jobb technológia = gazdasági növekedés.

? Egy diák 4 órát tölt tanulással ahelyett, hogy óránként 2800 Ft-ért dolgozna. Hány forint az alternatív költség?
= 11200
! 4 · 2800.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Alternatív költség.** Egy dolgozó egy nap alatt `a_db` darab A terméket vagy `b_db` darab B terméket tud elkészíteni. Írd meg az `alt_koltseg(a_db, b_db)` függvényt, amely megadja, hány B termékről mond le minden egyes A termékért (2 tizedesre kerekítve)!

```python starter
def alt_koltseg(a_db, b_db):
    return round(a_db / b_db, 2)
```

<details>
<summary>Megoldás</summary>

Ha egy nap alatt 6 A vagy 3 B készül, akkor 6 A „ugyanannyit ér”, mint 3 B, tehát 1 A ára 0,5 B.

```python solution
def alt_koltseg(a_db, b_db):
    return round(b_db / a_db, 2)          # 1 A elkészítése 1/a_db nap, ennyi idő alatt b_db/a_db darab B készülne
```

</details>

```python test
assert alt_koltseg(6, 3) == 0.5
assert alt_koltseg(4, 12) == 3.0
assert alt_koltseg(5, 5) == 1.0
assert alt_koltseg(3, 10) == 3.33
print("Minden ellenőrzés sikeres!")
```

**2.** **Határelemzés.** A `haszon` lista az összes hasznot adja meg 0, 1, 2, … egység után (az első elem mindig 0). Minden egység ugyanannyiba, `koltseg`-be kerül. Írd meg az `optimum(haszon, koltseg)` függvényt, amely megadja, hány egységet érdemes választani: addig növeljük, amíg a következő egység határhaszna **nagyobb** a határköltségnél!

```python starter
def optimum(haszon, koltseg):
    return len(haszon) - 1
```

<details>
<summary>Megoldás</summary>

A kiinduló kód mindig a legtöbbet választaná – a határelemzés lényege viszont az, hogy a csökkenő határhaszon miatt egy ponton túl már nem éri meg.

```python solution
def optimum(haszon, koltseg):
    db = 0
    while db + 1 < len(haszon) and haszon[db + 1] - haszon[db] > koltseg:
        db += 1                            # a következő egység még megéri
    return db
```

</details>

```python test
assert optimum([0, 30, 55, 75, 90, 100, 106], 12) == 4
assert optimum([0, 10, 18, 24], 5) == 3
assert optimum([0, 4, 7], 5) == 0
assert optimum([0, 50, 90, 120, 140], 25) == 3
print("Minden ellenőrzés sikeres!")
```

**3.** **Komparatív előny.** Két ember (`"Anna"` és `"Bence"`) két feladatot végez; a `percek` szótár megadja, hány perc nekik egy-egy egység (pl. `{"Anna": (30, 60), "Bence": (60, 90)}`, a párokban (főzés, takarítás)). Írd meg a `ki_takaritson(percek)` függvényt, amely visszaadja annak a nevét, akinek **komparatív előnye** van a takarításban (kisebb a takarítás alternatív költsége főzésben mérve)!

```python starter
def ki_takaritson(percek):
    return min(percek, key=lambda nev: percek[nev][1])
```

<details>
<summary>Megoldás</summary>

A kiinduló kód az abszolút előnyt nézi (ki takarít gyorsabban) – a csere szempontjából viszont a relatív, azaz a komparatív előny számít.

```python solution
def ki_takaritson(percek):
    # 1 takarítás alternatív költsége = takarítás ideje / főzés ideje (ennyi főzésről mond le)
    return min(percek, key=lambda nev: percek[nev][1] / percek[nev][0])
```

</details>

```python test
assert ki_takaritson({"Anna": (30, 60), "Bence": (60, 90)}) == "Bence"
assert ki_takaritson({"Anna": (20, 30), "Bence": (40, 100)}) == "Anna"
assert ki_takaritson({"Anna": (10, 50), "Bence": (30, 60)}) == "Bence"
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Egy hallgató a szombat délutánt tanulással vagy egy 12 000 Ft-os munkával töltheti; a tanulást választja. Mennyi a döntés alternatív költsége (Ft)?
= 12000
! A legjobb kihagyott lehetőség értéke.

? Melyik elsüllyedt költség?
- a jövő havi albérleti díj
+ a tavaly megvett, de nem használt szoftverlicenc ára
- egy új projekt várható költsége
- a következő félév tandíja
! Már kifizettük, és semmilyen döntéssel nem kapjuk vissza.

? Egy ország 100 egység gabonát vagy 50 egység acélt tud előállítani. Hány egység gabona 1 egység acél alternatív költsége?
= 2
! $100 / 50 = 2$.

? Melyik gazdasági rendszerben dönt elsősorban az ár arról, mit és mennyit termelnek?
+ piacgazdaság
- tervgazdaság
- hagyományos gazdaság
- egyik sem
! A piacgazdaságban a kereslet és a kínálat határozza meg az árakat.

? A termelési lehetőségek határán belüli pont mit jelent?
- elérhetetlen termelést
+ kihasználatlan erőforrásokat (pazarlást)
- hatékony termelést
- technológiai fejlődést
! Ugyanazokkal az erőforrásokkal mindkét termékből többet lehetne előállítani.
```
