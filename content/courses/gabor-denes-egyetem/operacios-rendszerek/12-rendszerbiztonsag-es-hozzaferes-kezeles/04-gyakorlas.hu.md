---
title: Gyakorlás – biztonság és jogosultságok
summary: Jogosultsági labor az Ubuntu VM-ben, ellenőrző kérdések és összefoglaló feladatlap chmod-számolással.
minutes: 30
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
