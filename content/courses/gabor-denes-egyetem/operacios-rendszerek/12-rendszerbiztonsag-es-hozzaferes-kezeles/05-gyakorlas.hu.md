---
title: Gyakorlás – biztonság és jogosultságok
summary: Jogosultsági labor az Ubuntu VM-ben, ellenőrző kérdések és összefoglaló feladatlap chmod-számolással.
minutes: 55
kind: practice
---

## Jogosultsági labor (Ubuntu VM – előtte pillanatkép!)

```bash
sudo adduser --disabled-password --gecos "" teszt   # új felhasználó jelszó nélkül
sudo groupadd labor
sudo usermod -aG labor $USER                        # utána jelentkezz ki-be (vagy: newgrp labor)
mkdir ~/kozos && sudo chown $USER:labor ~/kozos
echo "titok" > ~/kozos/titok.txt
chmod 640 ~/kozos/titok.txt                          # rw-r-----
ls -l ~/kozos
sudo -u teszt cat ~/kozos/titok.txt                  # Permission denied – a teszt nem tag és nem tulajdonos
sudo usermod -aG labor teszt
sudo -u teszt cat ~/kozos/titok.txt                  # működik? (Tipp: a ~ mappádra is kell x jog!)
```

Ha a második próba is „Permission denied”, nézd meg: `ls -ld ~` – a saját mappád jogai (`drwxr-x---`) nem engedik be a `teszt` felhasználót. Ez is a védelem része!

## Ellenőrző kérdések

<details>
<summary>1. Miért rossz ötlet a napi munkát rootként végezni?</summary>

Mert minden program, amit futtatsz – egy fertőzött letöltés is – teljes jogokkal futna, és bármit átírhatna vagy törölhetne. Elírt parancs (pl. rossz `rm -rf`) is az egész rendszert tönkreteheti.

</details>

<details>
<summary>2. Miért nem véd a bejelentkezési jelszó, ha ellopják a laptopot?</summary>

Mert a jelszó csak a futó OS-be lépést védi. A lemezt kiszerelve egy másik gépen a fájlok olvashatók – hacsak nincs teljes lemeztitkosítás (BitLocker, LUKS).

</details>

<details>
<summary>3. Mi a közös a sudo és a Windows UAC működésében?</summary>

Mindkettő a legkisebb jogosultság elvét valósítja meg: a felhasználó alapból korlátozott jogokkal dolgozik, és csak a konkrét rendszergazdai művelethez kap emelt jogot, kifejezett megerősítés után.

</details>

<details>
<summary>4. Hogyan nehezíti meg az ASLR és a DEP együtt egy puffertúlcsordulásos támadást?</summary>

A DEP miatt a verembe írt kód nem futtatható, ezért a támadónak a program meglévő kódrészleteire kellene ugrania – az ASLR viszont ezek címét minden indításkor véletlenszerűen változtatja.

</details>

## Összefoglaló feladatlap

```quiz required
? Mi a `rwxr-xr--` jogok oktális kódja?
= 754
! (4+2+1)(4+1)(4) = 7 5 4.

? Melyik jogokat adja a `chmod 640`?
+ rw-r-----
- rwxr-----
- rw-rw----
- r--r-----
! 6 = rw-, 4 = r--, 0 = ---.

? Melyik paranccsal futtatsz egy parancsot egy másik felhasználó nevében (pl. teszt)?
= sudo -u teszt
! sudo -u teszt cat fajl

? Melyik fenyegetés hamis e-mailekkel csal ki jelszavakat?
+ adathalászat (phishing)
- féreg
- rootkit
- DoS
! Mindig ellenőrizd a feladót és a link valódi címét.

? Melyik Windows-eszköz titkosítja a teljes lemezt, a kulcsot a TPM-ben őrizve?
= BitLocker
! A helyreállítási kulcsot mentsd el biztonságos helyre!

? Melyik a CIA-hármas „I” betűje?
- hitelesítés
+ sértetlenség (integrity)
- azonosító
- internet
! Confidentiality, Integrity, Availability.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **rwx-ből oktális kód.** Írd meg az `oktalis(jogok)` függvényt, amely egy 9 karakteres jogsort (pl. `"rwxr-xr--"`) a `chmod` oktális kódjává alakít (pl. `"754"`)!

```python starter
def oktalis(jogok):
    return "000"
```

<details>
<summary>Megoldás</summary>

```python solution
def oktalis(jogok):
    kod = ""
    for i in range(0, 9, 3):                 # tulajdonos, csoport, mások
        harmas = jogok[i:i + 3]
        ertek = (4 if harmas[0] == "r" else 0) + (2 if harmas[1] == "w" else 0) \
              + (1 if harmas[2] == "x" else 0)
        kod += str(ertek)
    return kod
```

</details>

```python test
assert oktalis("rwxr-xr--") == "754"
assert oktalis("rw-r--r--") == "644"
assert oktalis("rw-------") == "600"
assert oktalis("rwxrwxrwx") == "777"
assert oktalis("---------") == "000"
print("Minden ellenőrzés sikeres!")
```

**2.** **Az umask hatása.** Írd meg az `uj_jog(kert, umask)` függvényt: mindkettő oktális szöveg (pl. `"666"`, `"022"`); az eredmény a kért jog ÉS NEM umask, szintén háromjegyű oktális szövegként.

```python starter
def uj_jog(kert, umask):
    return kert
```

<details>
<summary>Megoldás</summary>

```python solution
def uj_jog(kert, umask):
    jog = int(kert, 8) & ~int(umask, 8)      # a 8-as számrendszerű szövegből szám
    return format(jog & 0o777, "03o")        # vissza háromjegyű oktális szöveggé
```

</details>

```python test
assert uj_jog("666", "022") == "644"
assert uj_jog("777", "022") == "755"
assert uj_jog("666", "027") == "640"
assert uj_jog("777", "077") == "700"
print("Minden ellenőrzés sikeres!")
```

**3.** **Jelszó entrópiája.** Írd meg az `entropia(jelszo)` függvényt: a jelkészlet mérete a használt jelosztályokból adódik (kisbetű 26, nagybetű 26, számjegy 10, minden más 32); az entrópia = hossz · log₂(jelkészlet), egy tizedesre kerekítve. (Ez csak véletlen jelszóra igaz becslés!)

```python starter
def entropia(jelszo):
    return 0
```

<details>
<summary>Megoldás</summary>

```python solution
import math

def entropia(jelszo):
    keszlet = 0
    if any(c.islower() for c in jelszo): keszlet += 26
    if any(c.isupper() for c in jelszo): keszlet += 26
    if any(c.isdigit() for c in jelszo): keszlet += 10
    if any(not c.isalnum() for c in jelszo): keszlet += 32
    if keszlet == 0:
        return 0
    return round(len(jelszo) * math.log2(keszlet), 1)
```

</details>

```python test
assert entropia("abcdef") == 28.2
assert entropia("Abcdef12") == 47.6
assert entropia("Ab1!Ab1!Ab1!") == 78.7
assert entropia("") == 0
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Mit jelent a legkisebb jogosultság elve?
+ minden felhasználó és program csak annyi jogot kapjon, amennyi a feladatához feltétlenül kell
- mindenki rendszergazdaként dolgozzon, hogy ne akadjon el
- a jelszó legyen minél rövidebb
! Így egy fertőzött program kára a jogaira korlátozódik.

? Mi az adathalászat (phishing)?
+ hamis e-mailekkel, weboldalakkal kicsalt jelszavak és adatok
- egy vírusfajta, amely a lemezt formázza
- a hálózati forgalom lassítása
! A leggyakoribb belépési pont ma az ember, nem a technika.

? Melyik a többfaktoros hitelesítés példája?
+ jelszó és a telefonon megjelenő egyszer használatos kód
- két különböző jelszó
- egy hosszú jelszó
! Két különböző faktor: amit tudsz és ami nálad van.

? Mit véd ki a teljes lemeztitkosítás (BitLocker, LUKS)?
+ hogy egy ellopott laptop lemezéről kiolvassák az adatokat
- a vírusokat
- az adathalászatot
! Bekapcsolt, feloldott gépen nem véd – ott már a fájlok olvashatók.

? Mit jelent a sticky bit a /tmp könyvtáron (drwxrwxrwt)?
+ mindenki létrehozhat benne fájlt, de csak a saját fájljait törölheti
- a könyvtár tartalma újraindításkor is megmarad
- csak a root írhat bele
! A „t” betű a jogsor végén jelzi.
```
