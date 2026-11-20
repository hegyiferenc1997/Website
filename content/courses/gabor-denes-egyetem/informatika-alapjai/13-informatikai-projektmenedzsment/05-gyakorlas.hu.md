---
title: Gyakorlás – informatikai projektmenedzsment
summary: Ellenőrző kérdések és összefoglaló feladatlap a projektháromszögről, a tervezésről és az agilis módszerekről.
minutes: 45
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. A megrendelő két héttel a határidő előtt három új funkciót kér, de a határidő és a költségvetés marad. Mit javasolsz?</summary>

A projektháromszög szerint ez csak a minőség rovására menne. Javaslat: rangsoroljátok a funkciókat; ami most kell, az kerüljön be egy kevésbé fontos helyett, a többi egy következő kiadásba – vagy egyeztessetek több időről vagy erőforrásról.

</details>

<details>
<summary>2. Mi a különbség a sprint-áttekintés és a visszatekintés között?</summary>

Az áttekintés a **termékről** szól: bemutatják az elkészült inkrementumot, és visszajelzést kérnek. A visszatekintés a **csapat munkájáról**: mi ment jól, min változtassanak.

</details>

<details>
<summary>3. Egy feladat 3 hét, és nincs a kritikus úton, 2 hét tartalékideje van. Mi történik, ha 1 hetet késik?</summary>

Semmi a projekt végére nézve: a tartalékidőn belül marad. (De utána már csak 1 hét tartaléka van.)

</details>

```python run
# Kockázati mátrix rangsorolása
kockazatok = [
    ("kulcsfejlesztő kiesik", 2, 5),
    ("külső API változik", 3, 3),
    ("késő visszajelzés", 4, 2),
    ("szerverhiba az átadáskor", 1, 4),
]
for nev, val, hatas in sorted(kockazatok, key=lambda k: k[1] * k[2], reverse=True):
    print(f"{val * hatas:2d}  {nev}")
```

## Összefoglaló feladatlap

```quiz required
? Mi **nem** jellemzője egy projektnek?
- egyszeri
- meghatározott céllal
- kezdő- és végponttal
+ folyamatos, végtelen működés
! A folyamatos működés nem projekt.

? Hogy hívják azt a diagramot, amely idővonalon mutatja a feladatokat és sorrendjüket?
= Gantt
= Gantt-diagram
! Henry Gantt nevéből.

? Mekkora a fenti listában a legnagyobb kockázati pontszám?
= 10
! 2 × 5 a kulcsfejlesztő kiesésénél.

? Melyik Scrum-esemény célja a csapat munkamódszerének javítása?
- sprinttervezés
- napi scrum
- sprint-áttekintés
+ visszatekintés
! Retrospective.

? Melyik kockázati válasz az, ha biztosítást kötsz?
- elkerülés
- csökkentés
+ áthárítás
- elfogadás
! A kár egy részét más viseli.

? Mit korlátoz a WIP-limit a Kanbanban?
+ hány feladat lehet egyszerre egy oszlopban
- a sprint hosszát
- a csapat létszámát
- a költségvetést
! Work In Progress.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **PERT-becslés.** Írd meg a `pert(optimista, valoszinu, pesszimista)` függvényt, amely egy feladat várható időtartamát adja a PERT-képlettel: $(o + 4m + p) / 6$, egy tizedesre kerekítve!

```python starter
def pert(optimista, valoszinu, pesszimista):
    return (optimista + valoszinu + pesszimista) / 3
```

<details>
<summary>Megoldás</summary>

```python solution
def pert(optimista, valoszinu, pesszimista):
    return round((optimista + 4 * valoszinu + pesszimista) / 6, 1)   # a legvalószínűbb érték négyszeres súllyal
```

</details>

```python test
assert pert(2, 4, 12) == 5.0
assert pert(1, 2, 3) == 2.0
assert pert(3, 5, 10) == 5.5
print("Minden ellenőrzés sikeres!")
```

**2.** **Kritikus út egy láncon.** Írd meg a `projekt_hossz(feladatok)` függvényt, amely `{név: (időtartam, [előfeltételek])}` szótárból kiszámolja a projekt legkorábbi befejezését (napokban)! Egy feladat akkor kezdődhet, amikor az összes előfeltétele kész.

```python starter
def projekt_hossz(feladatok):
    return sum(ido for ido, _ in feladatok.values())
```

<details>
<summary>Megoldás</summary>

```python solution
def projekt_hossz(feladatok):
    vege = {}
    def befejezes(nev):
        if nev not in vege:                            # minden feladatot egyszer számolunk ki
            ido, elozok = feladatok[nev]
            vege[nev] = max((befejezes(e) for e in elozok), default=0) + ido
        return vege[nev]
    return max(befejezes(n) for n in feladatok)
```

</details>

```python test
f = {"terv": (3, []), "backend": (5, ["terv"]), "frontend": (4, ["terv"]), "teszt": (2, ["backend", "frontend"])}
assert projekt_hossz(f) == 10
assert projekt_hossz({"a": (2, []), "b": (3, [])}) == 3
print("Minden ellenőrzés sikeres!")
```

**3.** **Kommunikációs csatornák.** Írd meg a `csatornak(letszam)` függvényt, amely megadja, hány kétszemélyes kommunikációs csatorna van egy $n$ fős csapatban ($n(n-1)/2$)! Ez Brooks megfigyelésének egyik oka: a létszámmal a csatornák négyzetesen nőnek.

```python starter
def csatornak(letszam):
    return letszam
```

<details>
<summary>Megoldás</summary>

```python solution
def csatornak(letszam):
    return letszam * (letszam - 1) // 2   # minden pár egy csatorna
```

</details>

```python test
assert csatornak(1) == 0
assert csatornak(5) == 10
assert csatornak(10) == 45
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Egy feladat optimista becslése 2, legvalószínűbb 5, pesszimista 14 nap. Mennyi a PERT-becslés (napokban)?
= 6
! $(2 + 4 \cdot 5 + 14) / 6 = 36 / 6 = 6$.

? Mi a kritikus út?
- a legolcsóbb feladatok sora
+ a függő feladatok leghosszabb lánca, amely a projekt befejezését meghatározza
- a legkockázatosabb feladat
- a vezetőség jóváhagyási útja
! Ha a kritikus úton bármi csúszik, az egész projekt csúszik.

? Egy csapat az utolsó három sprintben 18, 22 és 20 pontot teljesített. A hátralévő munka 100 pont. Hány sprint kell még (átlagos sebességgel)?
= 5
! Átlag: $60 / 3 = 20$ pont/sprint, $100 / 20 = 5$.

? Mit mond Brooks törvénye?
- minél több ember, annál gyorsabb a projekt
+ egy késésben lévő szoftverprojekthez embert adni még jobban késlelteti azt
- a projekt mindig a felére becsült időbe kerül
- a csapat mérete nem számít
! Az új embereket be kell tanítani, és nő a kommunikációs csatornák száma.
```
