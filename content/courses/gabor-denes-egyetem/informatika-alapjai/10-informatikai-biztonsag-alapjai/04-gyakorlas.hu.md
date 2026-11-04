---
title: Gyakorlás – informatikai biztonság
summary: Ellenőrző kérdések és összefoglaló feladatlap a fenyegetésekről, a hitelesítésről, a titkosításról és a mentésről.
minutes: 20
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
