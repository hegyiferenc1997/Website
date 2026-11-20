---
title: Gyakorlás – robotika alapjai
summary: Ellenőrző kérdések és összefoglaló feladatlap a robotok részeiről, a szabályozásról és az alkalmazásokról.
minutes: 43
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

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Mozgó medián.** Írd meg a `mozgo_median(adatok, k)` függvényt, amely minden pozícióra az utolsó (legfeljebb) `k` mérés mediánját adja vissza listaként!

```python starter
def mozgo_median(adatok, k):
    return [sum(adatok[max(0, i - k + 1):i + 1]) / k for i in range(len(adatok))]
```

<details>
<summary>Megoldás</summary>

```python solution
from statistics import median

def mozgo_median(adatok, k):
    return [median(adatok[max(0, i - k + 1):i + 1]) for i in range(len(adatok))]   # az elején rövidebb ablak
```

</details>

```python test
assert mozgo_median([50, 51, 300, 49, 52], 3) == [50, 50.5, 51, 51, 52]
assert mozgo_median([1, 2, 3], 1) == [1, 2, 3]
assert mozgo_median([], 3) == []
print("Minden ellenőrzés sikeres!")
```

**2.** **Kétállású szabályozó.** Írd meg a `termosztat(homersekletek, cel, hiszterezis)` függvényt, amely minden mért hőmérsékletre megmondja, be van-e kapcsolva a fűtés (`True`/`False`)! A fűtés kezdetben ki van kapcsolva; bekapcsol, ha a hőmérséklet `cel - hiszterezis` alá esik, és kikapcsol, ha `cel + hiszterezis` fölé megy; a kettő között az előző állapot marad.

```python starter
def termosztat(homersekletek, cel, hiszterezis):
    return [t < cel for t in homersekletek]
```

<details>
<summary>Megoldás</summary>

```python solution
def termosztat(homersekletek, cel, hiszterezis):
    be, allapotok = False, []
    for t in homersekletek:
        if t < cel - hiszterezis:
            be = True
        elif t > cel + hiszterezis:
            be = False                        # a sávon belül nem váltunk: nincs „kattogás”
        allapotok.append(be)
    return allapotok
```

</details>

```python test
assert termosztat([20, 21.4, 22.6, 21.8, 21.4], 22, 0.5) == [True, True, False, False, True]
assert termosztat([22, 22, 22], 22, 0.5) == [False, False, False]
print("Minden ellenőrzés sikeres!")
```

**3.** **Odometria.** Írd meg az `egyenes_ut(bal, jobb)` függvényt, amely egy kétkerekű robot kerekeinek útjából (méterben) visszaadja a `(középpont útja, irányváltozás fokban)` párt, ha a kerekek távolsága 0,2 m! Mindkét értéket 2 tizedesre kerekítsd. (Irányváltozás radiánban: (jobb − bal) / 0,2.)

```python starter
def egyenes_ut(bal, jobb):
    return (round(bal + jobb, 2), 0.0)
```

<details>
<summary>Megoldás</summary>

```python solution
from math import degrees

def egyenes_ut(bal, jobb):
    ut = (bal + jobb) / 2                    # a középpont a két kerék átlagát teszi meg
    fordulas = degrees((jobb - bal) / 0.2)
    return (round(ut, 2), round(fordulas, 2))
```

</details>

```python test
assert egyenes_ut(1, 1) == (1.0, 0.0)
assert egyenes_ut(0.9, 1.1) == (1.0, 57.3)
assert egyenes_ut(-0.157, 0.157) == (0.0, 89.95)
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Mi a robot három alapfunkciója?
+ érzékelés, döntés, cselekvés
- tervezés, gyártás, eladás
- olvasás, írás, törlés
- bemenet, kimenet, tárolás
! Az érzékel–dönt–cselekszik ciklus.

? Egy P-szabályozó erősítése 2, a hiba 3 °C. Mekkora a beavatkozás (tetszőleges egységben)?
= 6
! $2 \cdot 3 = 6$.

? Melyik a zárt hurkú szabályozás példája?
- egy időzítős kenyérpirító
+ egy termosztát, amely méri a hőmérsékletet és aszerint kapcsolja a fűtést
- egy villanykapcsoló
- egy mosógép fix programmal
! A visszacsatolás a lényege.

? Hány szabadságfoka van egy tipikus ipari robotkarnak?
= 6
! Hat csukló: helyzet (3) és orientáció (3).
```
