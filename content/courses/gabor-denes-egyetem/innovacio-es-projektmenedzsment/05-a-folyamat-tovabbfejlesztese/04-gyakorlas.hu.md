---
title: Gyakorlás – folyamatfejlesztés
summary: Ellenőrző kérdések és összefoglaló feladatlap az ötödik témakörhöz.
minutes: 45
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Miben különbözik a Kaizen és a radikális folyamatinnováció?</summary>

A Kaizen folyamatos, apró, mindenki által végzett javítás, kis kockázattal. A radikális folyamatinnováció ritka, nagy ugrás (pl. teljesen új gyártástechnológia), nagyobb kockázattal és ráfordítással. A kettő kiegészíti egymást.

</details>

<details>
<summary>2. Egy csapatnál a hibajegyek átlagosan 5 napot várnak a tesztelésre. Melyik Lean veszteség ez, és mit tennél?</summary>

Várakozás (és félkész készlet). Megoldás: automatizált tesztek, a tesztelő bevonása a fejlesztőcsapatba, kisebb adagokban történő átadás, a folyamatban lévő munka korlátozása (WIP-limit, 11. témakör).

</details>

<details>
<summary>3. Mi a különbség a Lean és a Six Sigma fő célja között?</summary>

A Lean a veszteségek kiküszöbölésével a folyamat gyorsaságát és áramlását javítja. A Six Sigma a szórás és a hibák csökkentésével a folyamat pontosságát, megbízhatóságát javítja.

</details>

<details>
<summary>4. Végezz „5 miért” elemzést: „A felhasználók nem találják a regisztráció gombot.”</summary>

Miért? Mert a lap alján van. Miért? Mert a tervező így rajzolta. Miért? Mert nem volt felhasználói teszt. Miért? Mert a határidő miatt kihagyták. Miért? Mert a tervezési folyamatban nincs kötelező felhasználói teszt. → Gyökérok: a folyamatból hiányzik a kötelező felhasználói teszt.

</details>

## Összefoglaló feladatlap

```quiz required
? Melyik a PDCA-ciklus helyes sorrendje?
+ Plan → Do → Check → Act
- Do → Plan → Act → Check
- Plan → Check → Do → Act
- Check → Plan → Do → Act
! Tervezz, csináld, ellenőrizd, avatkozz be.

? Melyik Rothwell-generáció épít **partnerek hálózatára** és digitális eszközökre?
- 2. (piaci húzás)
- 3. (kapcsolt)
- 4. (integrált)
+ 5. (hálózati)
! Az ötödik generáció a rendszerintegrált, hálózati modell.

? Melyik Lean veszteség a gyakori **váltogatás sok eszköz és feladat** között?
- túltermelés
+ mozgás
- készlet
- hibák
! Motion: felesleges „mozdulatok”, kontextusváltás.

? Melyik 5S lépés a „közös kódolási szabályok” bevezetése?
- szortírozás
- tisztítás
+ szabványosítás
- fenntartás
! Seiketsu = szabványosítás.

? Egy hibajegy 4 óra munkát igényel, de átlagosan 40 óra telik el a bejelentéstől a javításig. Hány százalék a folyamathatékonyság?
= 10
= 10%
! 4 / 40 · 100.

? 1000 bejelentésből 800 a funkciók egy kis részéhez kapcsolódik. Melyik eszköz mutatja ezt jól?
- Gantt-diagram
+ Pareto-diagram
- SWOT
- üzleti modell vászon
! A Pareto-diagram csökkenő sorrendben ábrázolja az okokat.

? A DMAIC melyik lépésében tartjuk fenn az elért eredményt?
- Define
- Analyze
- Improve
+ Control
! Control = mérés, szabványosítás, fenntartás.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Pareto-elemzés.** Írd meg a `pareto(jegyek, hatar=0.8)` függvényt, amely csökkenő sorrendben visszaadja azoknak a kategóriáknak a nevét, amelyek együtt elérik a jegyek `hatar` részét! Egy kategória akkor kerül be, ha az előtte lévők halmozott aránya még kisebb a határnál.

```python starter
def pareto(jegyek, hatar=0.8):
    rendezett = sorted(jegyek, key=lambda k: -jegyek[k])
    return rendezett[:max(1, len(rendezett) // 5)]
```

<details>
<summary>Megoldás</summary>

```python solution
def pareto(jegyek, hatar=0.8):
    osszes = sum(jegyek.values())
    eredmeny, halmozott = [], 0
    for nev in sorted(jegyek, key=lambda k: -jegyek[k]):   # csökkenő darabszám szerint
        if halmozott / osszes >= hatar:
            break
        eredmeny.append(nev)
        halmozott += jegyek[nev]
    return eredmeny
```

</details>

```python test
jegyek = {"bejelentkezés": 46, "fizetés": 31, "lassú oldal": 12, "e-mail": 9,
          "mobil": 7, "fordítás": 5, "exportálás": 3, "egyéb": 7}
assert pareto(jegyek) == ["bejelentkezés", "fizetés", "lassú oldal", "e-mail"]
assert pareto({"a": 50, "b": 30, "c": 20}) == ["a", "b"]
assert pareto({"a": 50, "b": 30, "c": 20}, 0.5) == ["a"]
print("Minden ellenőrzés sikeres!")
```

**2.** **Folyamathatékonyság.** Írd meg a `hatekonysag(lepesek)` függvényt, amely `(név, munkaidő, várakozás)` hármasok listájából megadja a folyamathatékonyságot: munkaidő / átfutási idő, %-ban, 1 tizedesre!

```python starter
def hatekonysag(lepesek):
    munka = sum(m for _, m, _ in lepesek)
    varakozas = sum(v for _, _, v in lepesek)
    return round(100 * munka / varakozas, 1)
```

<details>
<summary>Megoldás</summary>

Az utolsó teszten a kiinduló kód nullával osztana: várakozás nélkül a hatékonyság 100%.

```python solution
def hatekonysag(lepesek):
    munka = sum(m for _, m, _ in lepesek)
    atfutas = munka + sum(v for _, _, v in lepesek)   # átfutás = munka + várakozás
    return round(100 * munka / atfutas, 1)
```

</details>

```python test
assert hatekonysag([("a", 6, 54)]) == 10.0
assert hatekonysag([("igény", 2, 30), ("fejlesztés", 16, 8), ("ellenőrzés", 1, 20),
                    ("teszt", 4, 40), ("jóváhagyás", 0.5, 60), ("élesítés", 0.5, 24)]) == 11.7
assert hatekonysag([("a", 3, 0), ("b", 1, 0)]) == 100.0
print("Minden ellenőrzés sikeres!")
```

**3.** **Six Sigma.** Írd meg a `dpmo(hibak, egysegek, lehetoseg)` függvényt (hibák millió lehetőségre, egészre kerekítve) és a `szigma(dpmo)` függvényt, amely 1,5 szigmás eltolással megadja a szigmaszintet (2 tizedesre)! Segítség: `NormalDist().inv_cdf(1 - dpmo / 1e6) + 1.5`.

```python starter
from statistics import NormalDist

def dpmo(hibak, egysegek, lehetoseg):
    return round(hibak / egysegek * 1_000_000)

def szigma(dpmo):
    return round(NormalDist().inv_cdf(1 - dpmo / 1e6), 2)
```

<details>
<summary>Megoldás</summary>

```python solution
from statistics import NormalDist

def dpmo(hibak, egysegek, lehetoseg):
    return round(hibak / (egysegek * lehetoseg) * 1_000_000)   # minden egységben több hibalehetőség

def szigma(dpmo):
    return round(NormalDist().inv_cdf(1 - dpmo / 1e6) + 1.5, 2)
```

</details>

```python test
assert dpmo(120, 50_000, 4) == 600
assert dpmo(25, 10_000, 5) == 500
assert szigma(3.4) == 6.0
assert szigma(600) == 4.74
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Mi az 5S első lépése (Seiri)?
+ szortírozás: a felesleges dolgok eltávolítása
- rendszeres takarítás
- szabványosítás
- fegyelem
! Az 5S: szortírozás, rendszerezés, tisztítás, szabványosítás, fegyelem.

? Melyik NEM tartozik a Lean hét vesztesége közé?
- várakozás
- túltermelés
- felesleges mozgatás
+ dokumentált követelmény
! A hét veszteség: szállítás, készlet, mozgás, várakozás, túltermelés, túlzott megmunkálás, hibák.

? Egy folyamatban a munka 4 óra, a várakozás 36 óra. Mennyi a folyamathatékonyság (%)?
= 10
! $4 / 40 = 0{,}1$.

? Mi a DMAIC lépései közül a „C” (Control)?
- a probléma meghatározása
- az okok elemzése
+ a javított állapot fenntartása, ellenőrzése
- a megoldás bevezetése
! Define, Measure, Analyze, Improve, Control.
```
