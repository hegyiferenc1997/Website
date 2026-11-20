---
title: Gyakorlás – operációsrendszer-típusok
summary: Ellenőrző kérdések, egy besorolós feladat és összefoglaló feladatlap.
minutes: 45
kind: practice
---

## Besorolós feladat

Sorold be az alábbi rendszereket (asztali / szerver / mobil / beágyazott / valós idejű; nyílt / zárt):

1. a telefonod OS-e,
2. az egyetemi Neptun szerverei,
3. az otthoni Wi-Fi router,
4. egy autó blokkolásgátlója (ABS),
5. a laborgéped Ubuntu-ja,
6. egy okosóra.

<details>
<summary>Megoldási javaslat</summary>

1. mobil – Android (nyílt alap, Linux kernel) vagy iOS (zárt);
2. szerver – jellemzően Linux vagy Windows Server;
3. beágyazott – gyakran beágyazott Linux (pl. OpenWrt alapú);
4. beágyazott, kemény valós idejű RTOS;
5. asztali, nyílt forráskódú, többfelhasználós;
6. beágyazott/mobil – Wear OS (Linux alapú) vagy watchOS (XNU), az egyszerűbbek RTOS-t futtatnak.

</details>

## Ellenőrző kérdések

<details>
<summary>1. Miért fut a felhő és a szuperszámítógépek túlnyomó többsége Linuxon?</summary>

Mert ingyenes (nincs gépenkénti licencdíj több ezer gépen), nyílt forráskódú (a hardverhez és a feladathoz igazítható), stabil, jól automatizálható, és nagyon sok architektúrán fut.

</details>

<details>
<summary>2. Miért nem elég egy gyors, de kiszámíthatatlan OS egy légzsákhoz?</summary>

Mert kemény valós idejű feladatnál nem az átlagos, hanem a legrosszabb esetbeli válaszidő számít. Ha egyszer is késik a jel (pl. egy háttérfeladat miatt), az katasztrófához vezet.

</details>

<details>
<summary>3. Mi a különbség a hálózati és az elosztott rendszer között a felhasználó szemszögéből?</summary>

Hálózati rendszernél a felhasználó tudja és megadja, melyik gép erőforrását használja (pl. egy megosztott mappa címét). Elosztottnál a rendszer elrejti a gépek határait, egyetlen egységként látszik.

</details>

## Összefoglaló feladatlap

```quiz required
? Melyik Linux-disztribúció tartozik a Red Hat családba?
- Ubuntu
- Linux Mint
+ Fedora
- Manjaro
! Csomagkezelője: dnf (.rpm).

? Melyik kernelt használja az iOS?
= XNU
! Ugyanaz, mint a macOS-é.

? Melyik évben jelent meg a Windows NT első változata?
= 1993
! Windows NT 3.1.

? Melyik licenc engedi meg, hogy a kódot zárt termékbe építsd, forráskód kiadása nélkül?
- GPL
+ MIT
- egyik sem
- AGPL
! Az MIT és a BSD megengedő licenc.

? Mit jelent a „free” a „free software” kifejezésben?
+ szabadságot (futtatás, tanulmányozás, módosítás, terjesztés)
- kötelezően ingyenességet
- hirdetésekkel támogatott terjesztést
- korlátozott próbaverziót
! „Free as in freedom, not as in free beer.”

? Melyik operációs rendszer fut a TOP500 szuperszámítógép-lista összes gépén?
= Linux
! 2017 óta mind az 500 gépen.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Ütemezhető Rate Monotonic-kal?** A feladatok `(C, T)` párok. Írd meg az `rm_garantalt(feladatok)` függvényt: igaz, ha a kihasználtság (Σ C/T) legfeljebb n · (2^(1/n) − 1), vagyis a Liu–Layland-korlát szerint minden határidő biztosan teljesül!

```python starter
def rm_garantalt(feladatok):
    return True
```

<details>
<summary>Megoldás</summary>

```python solution
def rm_garantalt(feladatok):
    n = len(feladatok)
    U = sum(C / T for C, T in feladatok)
    return U <= n * (2 ** (1 / n) - 1)
```

</details>

```python test
assert rm_garantalt([(1, 4), (2, 8), (1, 10)]) is True       # U = 60%
assert rm_garantalt([(2, 5), (4, 7)]) is False               # U ≈ 97%
assert rm_garantalt([(1, 2)]) is True                        # egy feladat: 100%-ig jó
assert rm_garantalt([(1, 3), (1, 3), (1, 3)]) is False       # U = 100%
print("Minden ellenőrzés sikeres!")
```

**2.** **Meddig bírja az elem?** Írd meg az `elettartam_nap(kapacitas_mah, aktiv_arany, i_aktiv_ma, i_alvo_ma)` függvényt: az átlagos áram az időarányokkal súlyozott átlag; az élettartam órában kapacitás / átlagos áram. Add vissza napokban, egészre kerekítve!

```python starter
def elettartam_nap(kapacitas_mah, aktiv_arany, i_aktiv_ma, i_alvo_ma):
    return 0
```

<details>
<summary>Megoldás</summary>

```python solution
def elettartam_nap(kapacitas_mah, aktiv_arany, i_aktiv_ma, i_alvo_ma):
    atlag = aktiv_arany * i_aktiv_ma + (1 - aktiv_arany) * i_alvo_ma
    return round(kapacitas_mah / atlag / 24)
```

</details>

```python test
assert elettartam_nap(220, 1.0, 5.0, 0.0) == 2
assert elettartam_nap(220, 0.01, 5.0, 0.002) == 176
assert elettartam_nap(3000, 0.05, 200, 1) == 11
print("Minden ellenőrzés sikeres!")
```

**3.** **Kit állít le az Android?** Az alkalmazások `(név, MB, pontszám)` hármasok. Írd meg a `leallit(alkalmazasok, szabad, kell)` függvényt: amíg nincs elég szabad memória, mindig a **legnagyobb pontszámú** (legkevésbé fontos) alkalmazást állítja le. Add vissza a leállított alkalmazások nevét sorrendben! A 0 pontszámú (előtérben lévő) alkalmazás sosem állítható le.

```python starter
def leallit(alkalmazasok, szabad, kell):
    return []
```

<details>
<summary>Megoldás</summary>

```python solution
def leallit(alkalmazasok, szabad, kell):
    leallitott = []
    for nev, mb, pont in sorted(alkalmazasok, key=lambda a: -a[2]):
        if szabad >= kell or pont == 0:
            break
        szabad += mb
        leallitott.append(nev)
    return leallitott
```

</details>

```python test
appok = [("Térkép", 450, 0), ("Zene", 120, 200), ("Böngésző", 600, 900), ("Játék", 900, 950)]
assert leallit(appok, 200, 1000) == ["Játék"]
assert leallit(appok, 200, 1700) == ["Játék", "Böngésző"]
assert leallit(appok, 1000, 500) == []
assert leallit(appok, 0, 5000) == ["Játék", "Böngésző", "Zene"]
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Melyik a kemény valós idejű rendszer példája?
+ egy autó légzsákvezérlője
- egy videólejátszó
- egy online játék
! Ha lekési a határidőt, az katasztrófa – nem csak minőségromlás.

? Melyik mobil operációs rendszer épül Linux kernelre?
+ Android
- iOS
- Windows 11
! Az iOS a macOS-szel közös XNU kernelre épül.

? Mi egy beágyazott rendszer?
+ egy nagyobb eszközbe épített, egyetlen feladatra szánt számítógép (pl. mosógép, router, okosóra vezérlője)
- egy virtuális gép
- egy szerverpark
! Gyakran RTOS-t (pl. FreeRTOS, Zephyr) vagy kis Linuxot futtat.

? Mi a különbség a nyílt és a zárt forráskódú OS között?
+ a nyílt forráskódúnál bárki megnézheti, módosíthatja és (a licenc szerint) terjesztheti a forráskódot
- a zárt forráskódú mindig ingyenes
- a nyílt forráskódú nem futhat cégeknél
! Linux: GPLv2; Windows: zárt.

? Melyik ütemezés optimális egy magon, ha a kihasználtság legfeljebb 100%?
- Rate Monotonic
+ EDF
- FCFS
! Earliest Deadline First.
```
