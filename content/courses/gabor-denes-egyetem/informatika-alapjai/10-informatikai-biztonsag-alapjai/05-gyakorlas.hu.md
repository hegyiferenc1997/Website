---
title: Gyakorlás – informatikai biztonság
summary: Ellenőrző kérdések és összefoglaló feladatlap a fenyegetésekről, a hitelesítésről, a titkosításról és a mentésről.
minutes: 45
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Ezt a levelet kapod: „Kedves Felhasználó! Neptun-fiókját 2 órán belül töröljük. Erősítse meg itt: neptun-gde.account-check.top”. Mi árulkodik?</summary>

A sürgetés és fenyegetés, az általános megszólítás, és főleg a domain: az `account-check.top` nem az egyetem címe (a `neptun-gde` csak az elején álló aldomain-rész). Ne kattints, jelentsd az egyetem informatikusainak.

</details>

<details>
<summary>2. Miért nem elég egy nagyon erős jelszó, ha minden oldalon ugyanazt használod?</summary>

Mert ha egyetlen oldal adatbázisa kiszivárog, a támadók ugyanazzal az e-mail–jelszó párral minden más oldalon is megpróbálnak belépni (credential stuffing).

</details>

<details>
<summary>3. A cég minden reggel teljes mentést készít ugyanarra a mindig csatlakoztatott hálózati meghajtóra. Mi a gond?</summary>

Nincs offline vagy máshol lévő példány: egy zsarolóvírus a csatlakoztatott meghajtót is titkosítja, és egy tűz mindent elvisz. Kell egy lecsatlakoztatott vagy verziókat őrző, máshol lévő mentés is.

</details>

```python run
# Egyszerű jelszóellenőrző: hossz és karakterfajták
def ertekel(jelszo):
    pont = 0
    if len(jelszo) >= 12: pont += 2
    if len(jelszo) >= 16: pont += 1
    if any(c.isupper() for c in jelszo): pont += 1
    if any(c.isdigit() for c in jelszo): pont += 1
    if any(not c.isalnum() for c in jelszo): pont += 1
    return pont

for j in ["Anna2007", "lila-bicikli-esik-hetfon", "Lila-Bicikli-7-Hetfon"]:
    print(j, ertekel(j), "/ 6")
```

## Összefoglaló feladatlap

```quiz required
? Mit jelent a CIA-hármasban a C?
+ bizalmasság (Confidentiality)
- ellenőrzés (Control)
- titkosítás (Cipher)
- felhő (Cloud)
! Confidentiality, Integrity, Availability.

? Melyik kártevő álcázza magát hasznos programnak?
- féreg
+ trójai
- botnet
- zsarolóvírus
! A trójai faló mintájára.

? Hány pontot ad a fenti jelszóellenőrző az `Anna2007` jelszóra?
= 2
! 8 karakter (0 pont), van nagybetű (1) és szám (1), nincs írásjel.

? Melyik belépési mód áll ellen a legjobban az adathalász oldalaknak?
- SMS-kód
- jelszó
+ passkey
- biztonsági kérdés
! A passkey csak a valódi domainen működik.

? Melyik egyirányú, vagyis nem fejthető vissza?
- AES
- RSA
+ SHA-256 hash
- Caesar-eltolás
! A hash lenyomat, nem titkosítás.

? Mit jelent a legkisebb jogosultság elve?
+ mindenki csak annyi jogot kap, amennyi a feladatához kell
- mindenki rendszergazda
- senkinek nincs jelszava
- a legkevesebb felhasználó használhatja a gépet
! A mindennapi munkát ne rendszergazdaként végezd.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Entrópia bitekben.** Írd meg a `bitek(n, hossz)` függvényt, amely egy `n` féle jelből véletlenszerűen választott, `hossz` hosszú jelszó entrópiáját adja bitekben (1 tizedesre)!

```python starter
def bitek(n, hossz):
    return round(n * hossz, 1)
```

<details>
<summary>Megoldás</summary>

```python solution
from math import log2

def bitek(n, hossz):
    return round(hossz * log2(n), 1)       # minden jel log2(n) bitet ad
```

</details>

```python test
assert bitek(64, 10) == 60.0
assert bitek(26, 8) == 37.6
assert bitek(7776, 6) == 77.5
assert bitek(10, 4) == 13.3
print("Minden ellenőrzés sikeres!")
```

**2.** **Caesar-kód.** Írd meg a `caesar(szoveg, eltolas)` függvényt, amely az angol ábécé kisbetűit `eltolas`-sal eltolja (körbefordulva, negatív eltolással is), a többi karaktert változatlanul hagyja!

```python starter
def caesar(szoveg, eltolas):
    return "".join(chr(ord(c) + eltolas) for c in szoveg)
```

<details>
<summary>Megoldás</summary>

```python solution
ABC = "abcdefghijklmnopqrstuvwxyz"

def caesar(szoveg, eltolas):
    ki = ""
    for c in szoveg:
        if c in ABC:
            ki += ABC[(ABC.index(c) + eltolas) % 26]   # a % 26 fordít körbe
        else:
            ki += c
    return ki
```

</details>

```python test
assert caesar("abc xyz", 3) == "def abc"
assert caesar("def abc", -3) == "abc xyz"
assert caesar("hello, world!", 13) == "uryyb, jbeyq!"
print("Minden ellenőrzés sikeres!")
```

**3.** **Kockázati rangsor.** Írd meg a `rangsor(kockazatok)` függvényt, amely egy `{név: (valószínűség, hatás)}` szótárból a kockázatok neveit adja vissza a pontszám (valószínűség × hatás) szerint csökkenő sorrendben! Egyenlő pontszámnál a nagyobb hatású legyen előbb.

```python starter
def rangsor(kockazatok):
    return sorted(kockazatok)
```

<details>
<summary>Megoldás</summary>

```python solution
def rangsor(kockazatok):
    return sorted(kockazatok, key=lambda n: (-kockazatok[n][0] * kockazatok[n][1], -kockazatok[n][1]))
```

</details>

```python test
k = {"adathalászat": (5, 3), "zsarolóvírus": (2, 5), "laptop": (3, 4), "meteor": (1, 5), "áram": (5, 2)}
assert rangsor(k) == ["adathalászat", "laptop", "zsarolóvírus", "áram", "meteor"]
assert rangsor({}) == []
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Mit jelent a CIA-hármasban az „A” (availability)?
- hitelesség
+ rendelkezésre állás: az adat és a szolgáltatás elérhető, amikor kell
- titkosság
- sértetlenség
! C: bizalmasság, I: sértetlenség, A: rendelkezésre állás.

? Hány másolatot ír elő a 3-2-1 mentési szabály?
= 3
! 3 másolat, 2 féle adathordozón, 1 másik helyen.

? Melyik a legerősebb második faktor?
- SMS-ben kapott kód
- e-mailben kapott kód
+ passkey vagy hardveres biztonsági kulcs
- egy biztonsági kérdés (pl. „anyja neve”)
! Ezek adathalászattal sem csalhatók ki.

? Mi a teendő, ha gyanús, sürgető e-mailt kapsz a „bankodtól” egy belépési linkkel?
- rákattintasz, és megadod az adataidat
+ nem kattintasz; a bank hivatalos oldalát vagy számát magad keresed meg
- továbbítod mindenkinek
- válaszolsz a jelszavaddal
! A sürgetés az adathalászat tipikus jele.
```
