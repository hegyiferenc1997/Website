---
title: Gyakorlás – meggyőzés és érvelés
summary: Ellenőrző kérdések és összefoglaló feladatlap az érv felépítéséről, a meggyőzés eszközeiről és az érvelési hibákról.
minutes: 50
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Építs fel egy Toulmin-érvet amellett, hogy a csapat vezessen be kódátnézést!</summary>

- **Állítás**: vezessünk be kötelező kódátnézést.
- **Adat**: az elmúlt hónapban 6 éles hibából 4-et egy második szem kiszúrt volna.
- **Indoklás**: a másik fejlesztő más szemszögből nézi a kódot, ezért észreveszi a szerző vakfoltjait.
- **Alátámasztás**: iparági tapasztalatok szerint a kódátnézés a hibák jelentős részét az élesítés előtt kiszűri.
- **Minősítő**: valószínűleg jelentősen csökkenti a hibák számát.
- **Kivétel**: a sürgős, egysoros javításoknál utólagos átnézés is elég lehet.

</details>

<details>
<summary>2. Miért nem elég egy mérnöki közönségnél a pathos?</summary>

Mert a mérnöki döntéseket adatok és logikai összefüggések alapján hozzák meg; érzelmi érvek mögött bizonyíték nélkül manipulációt sejtenek. A pathos felkeltheti a figyelmet, de a döntést a logos és a beszélő hitelessége (ethos) viszi.

</details>

<details>
<summary>3. Mi a sötét minta (dark pattern)? Mondj két példát!</summary>

A felhasználói felület olyan kialakítása, amely a felhasználó érdeke ellenére befolyásolja a döntését. Példák: nehezen megtalálható lemondás gomb, előre bejelölt hírlevél-feliratkozás, hamis „már csak 2 darab” felirat, bűntudatkeltő elutasító gomb („Nem, nem akarok spórolni”).

</details>

<details>
<summary>4. Hogyan döntheted el, hogy egy új funkció tényleg növelte-e a regisztrációt?</summary>

Kontrollált kísérlettel (A/B teszt): a felhasználók véletlenszerűen kapnak régi vagy új változatot, és a két csoport eredményét hasonlítod össze. Így kiszűrheted a szezonalitást és más közös okokat.

</details>

## Összefoglaló feladatlap

> Egy csapatmegbeszélésen arról vitatkoztok, áttérjetek-e egy új keretrendszerre.

```quiz required
? Gábor: „Mindenki erre tér át, a Google is ezt használja.” Melyik hiba (vagy hibák) jellemzik?
- szalmabáb
+ többségre és tekintélyre hivatkozás
- körkörös érvelés
- csúszós lejtő
! A népszerűség és egy nagy cég még nem bizonyítja, hogy nektek jó.

? Dóra: „Ha most nem térünk át, két év múlva senki nem akar majd nálunk dolgozni, és bezárhatunk.” Melyik hiba?
- post hoc
- személyeskedés
+ csúszós lejtő
- vörös hering
! Egy lépésből katasztrófát jósol.

? Ádám: „A próbaprojektünkben a lapbetöltés 1,2 mp-ről 0,7 mp-re csökkent.” Melyik meggyőzési mód?
- ethos
- pathos
+ logos
- szűkösség
! Mérési adat.

? Hány százalékkal csökkent a betöltési idő Ádám adatai szerint (egészre kerekítve)?
= 42
! (1,2 − 0,7) / 1,2 ≈ 0,4167 → 42%.

? Eszter: „Szerinted tehát dobjuk ki az egész régi kódot?” – pedig Ádám csak egy modul átírását javasolta. Melyik hiba?
+ szalmabáb
- hamis dilemma
- tekintélyre hivatkozás
- elhamarkodott általánosítás
! Eltorzítja a másik álláspontját.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Meggyőződés frissítése.** Írd meg a `frissit(p, esely_hanyados)` függvényt, amely a Bayes-tétel esély alakjával kiszámolja az új meggyőződést (3 tizedesre): esély $= p/(1-p)$, új esély = régi esély × esélyhányados, új $p$ = esély / (1 + esély)!

```python starter
def frissit(p, esely_hanyados):
    return round(p * esely_hanyados, 3)
```

<details>
<summary>Megoldás</summary>

```python solution
def frissit(p, esely_hanyados):
    esely = p / (1 - p) * esely_hanyados   # valószínűségből esély, majd szorzás
    return round(esely / (1 + esely), 3)   # vissza valószínűségre
```

</details>

```python test
assert frissit(0.5, 3) == 0.75
assert frissit(0.2, 2) == 0.333
assert frissit(0.8, 0.25) == 0.5
print("Minden ellenőrzés sikeres!")
```

**2.** **Túlélési torzítás.** A `tabla` szótár kulcsai `(csoport, sikeres)` párok, értékei darabszámok. Írd meg a `sikerarany(tabla, csoport)` függvényt, amely megadja a csoport sikerarányát (3 tizedesre) – a csoport **összes** tagjához viszonyítva, nem csak a sikeresekhez!

```python starter
def sikerarany(tabla, csoport):
    sikeresek = sum(db for (cs, s), db in tabla.items() if s)
    return round(tabla[(csoport, True)] / sikeresek, 3)
```

<details>
<summary>Megoldás</summary>

```python solution
def sikerarany(tabla, csoport):
    osszes = tabla[(csoport, True)] + tabla[(csoport, False)]   # a csoport minden tagja
    return round(tabla[(csoport, True)] / osszes, 3)
```

</details>

```python test
t = {("agilis", True): 80, ("agilis", False): 720, ("nem", True): 20, ("nem", False): 180}
assert sikerarany(t, "agilis") == 0.1
assert sikerarany(t, "nem") == 0.1
assert sikerarany({("A", True): 30, ("A", False): 70, ("B", True): 10, ("B", False): 10}, "B") == 0.5
print("Minden ellenőrzés sikeres!")
```

**3.** **Toulmin-ellenőrzés.** Egy érvet szótárként tárolunk. Írd meg a `hianyzo_alapelemek(erv)` függvényt, amely ábécérendben visszaadja, hogy az „adat”, „állítás”, „garancia” alapelemek közül melyik hiányzik (vagy üres szöveg)!

```python starter
def hianyzo_alapelemek(erv):
    return [e for e in ["adat", "állítás", "garancia"] if e not in erv]
```

<details>
<summary>Megoldás</summary>

```python solution
def hianyzo_alapelemek(erv):
    alap = ["adat", "állítás", "garancia"]
    return sorted(e for e in alap if not erv.get(e, "").strip())   # hiányzik vagy üres
```

</details>

```python test
assert hianyzo_alapelemek({"állítás": "Írjuk át Rustban.", "adat": "A Rust gyors."}) == ["garancia"]
assert hianyzo_alapelemek({"állítás": "X", "adat": "Y", "garancia": "Z"}) == []
assert hianyzo_alapelemek({"állítás": "X", "adat": "  "}) == ["adat", "garancia"]
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Melyik érvelési hiba: „Ezt a keretrendszert mindenki használja, tehát ez a legjobb.”
- szalmabáb
+ a többségre hivatkozás (bandwagon)
- személyeskedés
- hamis dilemma
! Attól, hogy sokan használják, még nem biztos, hogy nekünk a legjobb.

? Kezdetben 25%-ra becsülsz egy állítást (esély 1:3). Egy bizonyíték esélyhányadosa 3. Mekkora az új meggyőződés? (tizedes törtként)
= 0,5
= 0.5
! Új esély $\frac13 \cdot 3 = 1$, így $p = 1/2$.

? Melyik Arisztotelész-féle meggyőzési eszköz a beszélő hitelessége?
+ ethos
- pathos
- logos
- kairos
! Ethos: a beszélő hitele, szakértelme.

? Mi a különbség az etikus meggyőzés és a manipuláció között?
- nincs különbség
+ az etikus meggyőzés igaz információval, a másik érdekeit tiszteletben tartva dolgozik; a manipuláció elhallgat, torzít vagy nyomást gyakorol
- a manipuláció mindig hatásosabb
- az etikus meggyőzés nem használ érzelmeket
! A különbség az őszinteségben és a másik fél döntési szabadságának tiszteletében van.
```
