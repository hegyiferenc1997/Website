---
title: Vezérlés és szabályozás
summary: Nyílt és zárt hurok, visszacsatolás, a kétállású és az arányos szabályozó, a PID ötlete – szimulációval.
minutes: 18
---

## Amit ebben a leckében megtanulsz

- mi a különbség a **vezérlés** (nyílt hurok) és a **szabályozás** (zárt hurok) között,
- mi a **visszacsatolás** és a **hibajel**,
- hogyan működik a **kétállású** és az **arányos (P)** szabályozó, és mi a **PID** ötlete.

## Vezérlés: nyílt hurok

A **vezérlésnél** a robot nem ellenőrzi az eredményt. Példa: „forgasd a motort 2 másodpercig” – ha a padló csúszós vagy az akku gyengébb, a robot máshol áll meg, és ezt nem is veszi észre.

## Szabályozás: zárt hurok

A **szabályozásnál** a robot folyamatosan **méri** a tényleges értéket, összeveti a kívánttal (**alapjel**), és a különbség (**hibajel**) alapján módosít. Ez a **visszacsatolás**.

```text
 alapjel ──►(−)──► hiba ──► szabályozó ──► beavatkozó ──► folyamat ──┬──► kimenet
             ▲                                                       │
             └──────────────────── érzékelő ◄────────────────────────┘
```

Példák: a termosztát, a tempomat, a drón lebegése, a vonalkövető robot.

## Kétállású szabályozó

A legegyszerűbb: ha a hőmérséklet az alapjel alatt van, **be**kapcsol a fűtés, ha felette, **ki**. Olcsó, de az érték mindig ingadozik az alapjel körül.

## Arányos (P) szabályozó

Az **arányos** szabályozó a beavatkozást a hibával **arányosan** állítja: `beavatkozás = Kp · hiba`. Nagy hibánál erősen, kis hibánál finoman avatkozik be.

```python run
# Egy robot 100 cm-re akar eljutni; minden lépésben a hiba Kp-szorosát teszi meg
cel = 100.0
hely = 0.0
Kp = 0.5
for lepes in range(1, 9):
    hiba = cel - hely
    hely += Kp * hiba
    print(f"{lepes}. lépés: hely = {hely:6.2f} cm, hiba = {cel - hely:6.2f} cm")
```

Kis `Kp` → lassan ér oda; túl nagy `Kp` (pl. 1,5) → **túllő** és ingadozik; 2 fölött akár el is szabadul. Próbáld ki a fenti kódban!

## A PID ötlete

A gyakorlatban a **PID** szabályozó a legelterjedtebb. Három tagból áll:

| Tag                   | Mit néz?                       | Mire jó?                 |
| --------------------- | ------------------------------ | ------------------------ |
| **P** (arányos)       | a mostani hibát                | gyors reakció            |
| **I** (integráló)     | az eddigi hibák összegét       | eltünteti a maradó hibát |
| **D** (differenciáló) | a hiba változásának sebességét | csillapítja a túllövést  |

Drónok, robotkarok, 3D-nyomtatók fűtése, önvezető autók – mind PID-et (vagy fejlettebb változatát) használnak.

## Összefoglalás

- Vezérlés = nyílt hurok, nincs visszajelzés; szabályozás = zárt hurok, visszacsatolással.
- Hibajel = alapjel − mért érték.
- Kétállású: be/ki; arányos: `Kp · hiba`; PID: arányos + integráló + differenciáló.

## A lecke feladata

```quiz required
? Mi jellemző a **szabályozásra** a vezérléssel szemben?
- Nincs benne érzékelő.
+ Méri az eredményt, és a hiba alapján módosít (visszacsatolás).
- Csak egyszer fut le.
- Mindig gyorsabb.
! Zárt hurok.

? Mennyi a hibajel, ha az alapjel 22 °C, a mért érték 19 °C?
= 3
! hiba = alapjel − mért = 22 − 19.

? A lecke szimulációjában (cél 100, Kp = 0,5, indulás 0-ról) hol áll a robot az **első** lépés után (cm)?
= 50
! 0 + 0,5 · 100 = 50.

? Melyik PID-tag csillapítja a túllövést, mert a hiba változásának sebességét figyeli?
- P
- I
+ D
! Differenciáló tag.
```
