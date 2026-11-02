---
title: Aszinkron (ripple) számlálók
summary: Billenő flip-flopokból felépített aszinkron számláló, felfelé és lefelé számlálás, modulo-N számláló törléssel, frekvenciaosztás, a késleltetések halmozódása.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- hogyan számol egy **aszinkron** (ripple, hullámzó) számláló,
- hogyan lesz belőle **felfelé** vagy **lefelé** számláló,
- hogyan készítesz **modulo-N** számlálót (pl. tízes számlálót) aszinkron törléssel,
- miért halmozódnak a **késleltetések**, és milyen **átmeneti állapotok** jelennek meg.

## A számláló

A **számláló** olyan szekvenciális hálózat, amely az órajel-impulzusok (események) számát tárolja, és állapotai egy előre meghatározott **sorrendben** követik egymást. Ha az állapotok száma N, **modulo-N** (N-es) számlálóról beszélünk; n flip-flop legfeljebb 2<sup>n</sup> állapotot tud.

## Az aszinkron bináris számláló

Kössünk sorba **lefutó élre billenő** T flip-flopokat (JK, J = K = 1):

- az **első** flip-flop (Q0) órajele a bemeneti impulzus,
- minden további flip-flop órajele az **előző flip-flop Q kimenete**.

Q0 minden lefutó élnél billen; Q1 akkor, amikor Q0 1 → 0-ra vált; Q2, amikor Q1 1 → 0-ra … Az eredmény a bináris számsor: 0000, 0001, 0010, …, 1111, majd újra 0000.

```text
CLK  _|‾|_|‾|_|‾|_|‾|_|‾|_|‾|_|‾|_|‾|_
Q0   ___|‾‾‾|___|‾‾‾|___|‾‾‾|___|‾‾‾|_
Q1   _______|‾‾‾‾‾‾‾|_______|‾‾‾‾‾‾‾|_
Q2   _______________|‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾|_
```

Minden fokozat **felezi** a frekvenciát: Q0 = f/2, Q1 = f/4, Q2 = f/8, Q3 = f/16 – a számláló egyben **frekvenciaosztó**.

## Felfelé és lefelé

- **Felfelé** számlál: lefutó élre billenő flip-flopok, a következő fokozat órajele **Q**.
- **Lefelé** számlál: a következő fokozat órajele **Q̅** (vagy felfutó élre billenő flip-flopok Q-val): 1111, 1110, 1101, …
- **Fel/le számláló:** egy vezérlőjel minden fokozat előtt egy multiplexerrel választ Q és Q̅ között.

## Modulo-N számláló aszinkron törléssel

Ha N nem 2 hatványa, a számlálót az **N állapot elérésekor töröljük**. Egy kapu figyeli, mikor jelenik meg N kódja, és a flip-flopok **aszinkron CLR** bemenetére ad jelet.

**Tízes (decimális) számláló:** 0000 … 1001, majd 0000. A tiltott első állapot az **1010** (10): ebben Q3 = Q1 = 1, ami 0–9 között sosem fordul elő együtt. Ezért elég egy **NAND(Q3, Q1)** kapu az aktív alacsony CLR̅ bemenetekre.

Hátránya: az 1010 állapot **rövid ideig megjelenik** (amíg a törlés lefut) – ez egy tüske a kimeneteken. Ilyen számláló a **7490** (decimális) és a **7493** (4 bites bináris) IC.

**Hány flip-flop kell?** A legkisebb n, amelyre 2<sup>n</sup> ≥ N. Pl. N = 60 → 2<sup>6</sup> = 64 ≥ 60 → **6** flip-flop.

## A késleltetések halmozódása

Mivel minden fokozat az előző kimenetére vár, a késleltetések **összeadódnak**: n fokozatnál a legrosszabb eset (pl. 0111 → 1000) **n · t<sub>pd</sub>**. Közben a kimeneten **átmeneti, hamis állapotok** látszanak – 0111 → 0110 → 0100 → 0000 → 1000.

Ezek miatt az aszinkron számláló:

- **egyszerű** és kevés alkatrészből áll (nincs külön logika),
- de **lassú** nagy bitszámnál, és a kimeneteinek **dekódolása tüskéket** okozhat.

Frekvenciaosztásra (pl. órakvarc 32 768 Hz → 1 Hz, a **4060** IC) kiváló; ahol a számláló állapotát pontosan kell olvasni, ott **szinkron** számlálót használunk (következő lecke).

```python run
# 4 bites aszinkron számláló: az átmeneti állapotok kiírása a 0111 → 1000 váltásnál
allapot = [1, 1, 1, 0]                 # Q0, Q1, Q2, Q3 (0111)
print("kezdet:", "".join(map(str, reversed(allapot))))
i = 0
while True:                            # Q0 billen, és amíg 1 → 0 vált, viszi a következő fokozatot
    regi = allapot[i]
    allapot[i] = 1 - regi
    print("átmeneti:" if regi == 1 and i < 3 else "végső:  ", "".join(map(str, reversed(allapot))))
    if regi == 0 or i == 3:
        break
    i += 1
```

## Összefoglalás

- Aszinkron számláló: billenő flip-flopok láncban, mindegyik órajele az előző kimenete.
- Minden fokozat felezi a frekvenciát (Q<sub>i</sub> = f / 2<sup>i+1</sup>).
- Modulo-N: az N állapot dekódolása és aszinkron törlés (tízes számláló: NAND(Q3, Q1)).
- Hátrány: halmozódó késleltetés (n · t<sub>pd</sub>) és átmeneti állapotok.

## A lecke feladata

```quiz required
? Mekkora a legnagyobb szám, ameddig egy 4 bites aszinkron bináris számláló eljut?
= 15
! 2^4 − 1.

? Egy 4 bites aszinkron számláló 1 MHz-es órajelet kap. Hány kHz a Q3 kimenet frekvenciája?
= 62,5
= 62.5
! Minden fokozat felez: 1000 kHz / 16.

? Aszinkron tízes számlálót építünk aktív alacsony CLR̅ bemenetű flip-flopokból. Milyen kapu kell a törléshez?
- NAND(Q2, Q0)
+ NAND(Q3, Q1)
- NOR(Q3, Q1)
- AND(Q3, Q2, Q1, Q0)
! A törlést a 10 = 1010 állapot váltja ki.

? Legalább hány flip-flop kell egy modulo-60 számlálóhoz?
= 6
! A legkisebb n, amelyre 2^n ≥ 60.

? Egy 4 fokozatú aszinkron számláló minden flip-flopjának késleltetése 10 ns. Legrosszabb esetben hány ns után áll be a végleges állapot?
= 40
= 40ns
! A késleltetések összeadódnak.

? Mi az aszinkron számláló fő hátránya?
- Sok kiegészítő kapu kell hozzá.
+ A késleltetések halmozódnak, és átmeneti hamis állapotok jelennek meg.
- Nem használható frekvenciaosztásra.
- Csak lefelé tud számolni.
```
