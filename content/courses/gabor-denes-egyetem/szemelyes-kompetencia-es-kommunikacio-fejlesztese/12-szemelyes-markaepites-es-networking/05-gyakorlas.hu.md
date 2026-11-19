---
title: Gyakorlás – személyes márkaépítés
summary: Ellenőrző kérdések és összefoglaló feladatlap a személyes márkáról, a portfólióról és a LinkedInről; saját értékajánlat és profil-ellenőrzés.
minutes: 55
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Fogalmazd meg a saját értékajánlatodat!</summary>

Használd a sablont: „Segítek [kinek] [mit elérni] azáltal, hogy [hogyan / miben vagyok erős].” Hallgatóként írhatod úgy is: „[Szak] hallgató vagyok, [terület] érdekel; jelenleg [projekt]-en dolgozom.” Legyen konkrét, hiteles, és frissítsd, ahogy fejlődsz.

</details>

<details>
<summary>2. Készíts ellenőrzőlistát a GitHub-profilodhoz!</summary>

Profilkép és név, rövid bio, profil-README, 4–6 kitűzött repó, minden repóban README (mit csinál, hogyan indul, képernyőkép), licenc, értelmes commit-üzenetek, `.gitignore`, sehol semmi titok (jelszó, kulcs, `.env`).

</details>

<details>
<summary>3. Keress rá a nevedre egy privát böngészőablakban. Mit látsz, és mit változtatnál?</summary>

Nézd meg, mi jelenik meg az első oldalon: szakmai profilok vagy régi, privát tartalmak? Állítsd be a régi profilok adatvédelmét, frissítsd a szakmai profilokat, és gondold át, mit szeretnél, hogy egy toborzó elsőként lásson.

</details>

<details>
<summary>4. Miért jobb egy befejezett kisebb projekt, mint egy félbehagyott nagy?</summary>

Mert megmutatja, hogy végig tudsz vinni valamit: tervezés, megvalósítás, tesztelés, dokumentálás, kiadás. Egy félbehagyott projektből nem derül ki, hogy működik-e, és azt sugallhatja, hogy nem fejezed be, amit elkezdesz.

</details>

## Összefoglaló feladatlap

> Kiss Bence elsőéves hallgató gyakornoki helyet keres. Ezt találod róla online.

```quiz required
? Bence LinkedIn-címsora: „Hallgató”. Mit javasolnál?
- maradjon így, elég
+ írja bele a szakot, az érdeklődési területét és hogy gyakornoki helyet keres
- írja azt, hogy „senior fejlesztő”
- törölje a profilt
! Beszédes, hiteles címsor.

? A GitHubján 12 repó van, mindegyik README nélkül, a legtöbb félkész. Mi a legjobb első lépés?
- mindet törli
+ kiválasztja a 2–3 legjobbat, befejezi és README-t ír hozzájuk, és kitűzi őket
- még 10 új repót hoz létre
- privátra állítja az egész profilt, és az önéletrajzba sem írja
! Kevés, de kész és bemutatható.

? Bence egy csapatprojektben a felhasználói felületet készítette. Mit írjon a portfóliójába?
- hogy ő készítette az egész alkalmazást
+ hogy egy négyfős csapatban ő felelt a felhasználói felületért, és mit ért el vele
- semmit, mert csapatmunka volt
- a többiek nevét és hibáit
! Pontosan a saját része.

? Egy 4 éve írt, nyilvános, sértő hozzászólása a Google első oldalán megjelenik. Mit tegyen?
- semmit
+ törölje vagy rejtse el, ha tudja, és a jövőben posztoljon tudatosan
- írjon még több hasonlót
- változtassa meg a nevét
! A digitális lábnyom kezelhető, de megelőzni a legjobb.

? Bence a 8 legfontosabb készségét szeretné a LinkedIn-profilján kiemelni, és mindegyikhez 2 ajánlást (endorsement) szeretne kérni. Hány ajánlást kér összesen?
= 16
! 8 · 2 = 16.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Kulcsszó-egyezés.** Írd meg az `egyezes(kulcsszavak, oneletrajz)` függvényt, amely megadja, a kulcsszavak hány százaléka szerepel (kisbetűsítve, részszövegként) az önéletrajzban, egészre kerekítve!

```python starter
def egyezes(kulcsszavak, oneletrajz):
    return round(100 * sum(1 for k in kulcsszavak if k in oneletrajz) / len(kulcsszavak))
```

<details>
<summary>Megoldás</summary>

```python solution
def egyezes(kulcsszavak, oneletrajz):
    szoveg = oneletrajz.lower()                          # kis- és nagybetű ne számítson
    talalat = sum(1 for k in kulcsszavak if k.lower() in szoveg)
    return round(100 * talalat / len(kulcsszavak))
```

</details>

```python test
k = ["python", "sql", "git", "docker"]
assert egyezes(k, "Python és SQL projekt, verziókezelés Gittel.") == 75
assert egyezes(["Linux"], "linuxon fejlesztettem") == 100
assert egyezes(k, "Java") == 0
print("Minden ellenőrzés sikeres!")
```

**2.** **Titokkereső.** Írd meg a `titkok(fajlok)` függvényt, amely egy `{fájlnév: tartalom}` szótárból ábécérendben visszaadja azoknak a fájloknak a nevét, amelyek tartalmában (kisbetűsítve) szerepel az `api_key=`, `password=` vagy `secret=` minta (az egyenlőségjel előtt szóköz is lehet), **vagy** amelyek neve pontosan `.env`!

```python starter
def titkok(fajlok):
    return sorted(f for f, t in fajlok.items() if "password=" in t)
```

<details>
<summary>Megoldás</summary>

```python solution
import re

MINTA = re.compile(r"(api_key|password|secret)\s*=")

def titkok(fajlok):
    talalt = [f for f, t in fajlok.items() if f == ".env" or MINTA.search(t.lower())]
    return sorted(talalt)
```

</details>

```python test
f = {"README.md": "# Projekt", ".env": "DEBUG=1", "config.py": "API_KEY = 'abc'", "app.py": "print(1)", "db.py": "Password='x'"}
assert titkok(f) == [".env", "config.py", "db.py"]
assert titkok({"main.py": "x = 1"}) == []
print("Minden ellenőrzés sikeres!")
```

**3.** **Rendszeresség.** Írd meg az `aktivitas(hetek)` függvényt, amely heti commitszámok listájából visszaadja az `(aktív hetek száma, leghosszabb egymást követő aktív sorozat)` párt (aktív a hét, ha legalább 1 commit volt)!

```python starter
def aktivitas(hetek):
    aktiv = sum(1 for h in hetek if h > 0)
    return (aktiv, aktiv)
```

<details>
<summary>Megoldás</summary>

```python solution
def aktivitas(hetek):
    aktiv = sum(1 for h in hetek if h > 0)
    leghosszabb = most = 0
    for h in hetek:
        most = most + 1 if h > 0 else 0        # a sorozat nő, vagy újraindul
        leghosszabb = max(leghosszabb, most)
    return (aktiv, leghosszabb)
```

</details>

```python test
assert aktivitas([0, 0, 2, 25, 31]) == (3, 3)
assert aktivitas([3, 0, 2, 5, 0, 1]) == (4, 2)
assert aktivitas([0, 0]) == (0, 0)
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Mi a személyes márka értékajánlata?
+ egy rövid mondat arról, kinek, miben és mivel tudsz értéket adni
- a LinkedIn-kapcsolatok száma
- a profilkép
- a legtöbb technológia felsorolása
! Pl. „Junior backend fejlesztő vagyok, Pythonnal és adatbázisokkal oldok meg valódi problémákat.”

? Egy hirdetés 10 kulcsszavából 7 szerepel az önéletrajzodban. Hány százalék az egyezés?
= 70
! $7/10 = 70\%$.

? Mit tegyél, ha egy jelszót véletlenül feltöltöttél egy nyilvános tárolóba?
- töröld egy új commitban, és kész
+ azonnal változtasd meg (érvénytelenítsd), és a titkokat ezután környezeti változóból olvasd
- tedd priváttá a tárolót egy hónap múlva
- semmit
! A régi commitokban a jelszó megmarad.

? Mi a „mutasd, ne mondd” elv a portfólióban?
- minél több jelzőt írni magadról
+ állítások helyett működő projektekkel, kóddal és eredményekkel bizonyítani
- csak a végzettséget feltüntetni
- hosszú motivációs levelet írni
! Egy működő demó többet mond a „kreatív vagyok” mondatnál.
```
