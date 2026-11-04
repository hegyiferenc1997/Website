---
title: Gyakorlás – robotika alapjai
summary: Ellenőrző kérdések és összefoglaló feladatlap a robotok részeiről, a szabályozásról és az alkalmazásokról.
minutes: 18
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Egy robotporszívó leér a lépcső széléhez. Melyik érzékelő veszi ezt észre, és mit tesz a vezérlő?</summary>

A lefelé néző infravörös (zuhanás-) érzékelő: nem kap visszaverődő jelet, mert alatta nincs padló. A vezérlő megállítja a motorokat, hátratolat és elfordul.

</details>

<details>
<summary>2. Miért szabályozás és nem vezérlés a tempomat?</summary>

Mert folyamatosan méri a tényleges sebességet, összeveti a beállítottal, és emelkedőn több, lejtőn kevesebb gázt ad – visszacsatolással dolgozik.

</details>

<details>
<summary>3. Mi történik egy arányos szabályozóval, ha a Kp túl nagy?</summary>

Túllő: átmegy az alapjelen, majd visszafelé is túllő, és ingadozik; nagyon nagy Kp-nál az ingadozás egyre nő (instabil lesz).

</details>

```python run
# Próbáld ki különböző Kp értékekkel: 0.3, 1.0, 1.5, 2.2
cel, hely, Kp = 100.0, 0.0, 1.5
for lepes in range(1, 7):
    hely += Kp * (cel - hely)
    print(lepes, round(hely, 1))
```

## Összefoglaló feladatlap

```quiz required
? Melyik a robot „agya”?
- motor
- akkumulátor
+ vezérlő (pl. mikrovezérlő)
- kerék
! Ezen fut a program.

? Melyik érzékelő készít lézerrel 3D távolságtérképet a környezetről?
= LIDAR
! Önvezető autók és robotporszívók is használják.

? Mi a különbség neve az alapjel és a mért érték között?
= hibajel
= hiba
! A szabályozó ebből számolja a beavatkozást.

? Hol áll a robot a fenti, Kp = 1,5-ös szimulációban az **első** lépés után?
= 150
! 0 + 1,5 · 100 = 150 – túllőtt.

? Melyik nem robot?
- robotporszívó
- hegesztő robotkar
- önvezető szállító drón
+ egy rögzített programú konyhai időzítő
! Az időzítő nem érzékeli a környezetét és nem dönt.

? Melyik motor áll be pontosan egy megadott szögbe?
- egyenáramú motor
+ szervomotor
- ventilátor
- hangszóró
! A szervó belső visszacsatolással tartja a szöget.
```
