---
title: Jelszó, többfaktoros hitelesítés, titkosítás
summary: Erős jelszó és jelmondat, jelszókezelő, MFA és passkey, szimmetrikus és nyilvános kulcsú titkosítás, hash.
minutes: 18
---

## Amit ebben a leckében megtanulsz

- mitől **erős** egy jelszó, és miért kell **jelszókezelő**,
- mi a **többfaktoros hitelesítés** (MFA) és a **passkey**,
- mi a **titkosítás** (szimmetrikus és nyilvános kulcsú) és a **hash**.

## Erős jelszó

A támadók nem „kitalálják” a jelszót, hanem gépekkel próbálgatják: szótárszavakat, kiszivárgott jelszólistákat, majd minden kombinációt. A jelszó ereje főleg a **hosszán** múlik.

```python run
# Hány lehetséges jelszó van? (karakterkészlet mérete ** hossz)
print("8 kisbetű:   ", 26 ** 8)
print("8 vegyes:    ", 94 ** 8)       # kis- és nagybetű, szám, írásjel
print("16 kisbetű:  ", 26 ** 16)
# Másodpercenként 10 milliárd próbálkozással hány évig tart végigpróbálni?
for nev, db in [("8 vegyes", 94 ** 8), ("16 kisbetű", 26 ** 16)]:
    print(nev, round(db / 1e10 / 3600 / 24 / 365, 1), "év")
```

Tanácsok:

- legalább **12–16 karakter**; a **jelmondat** (`lila-bicikli-esik-hetfon`) hosszú és megjegyezhető,
- **minden oldalra más jelszó** – ha egy oldalról kiszivárog, a többi biztonságban marad,
- **jelszókezelő** (Bitwarden, 1Password, a böngésző vagy a telefon beépített kezelője): egy erős mesterjelszóval védi a többi, véletlenszerűen generált jelszót.

## Többfaktoros hitelesítés (MFA)

A hitelesítés tényezői:

1. amit **tudsz** – jelszó, PIN,
2. amid **van** – telefon, biztonsági kulcs,
3. ami **vagy** – ujjlenyomat, arc.

Az **MFA** legalább kettőt kér. Ha a jelszavad ki is szivárog, a támadó a telefonod nélkül nem lép be. A **hitelesítő alkalmazás** (Microsoft/Google Authenticator) jobb az SMS-kódnál.

A **passkey** jelszó nélküli belépés: a telefonod vagy géped egy titkos kulcsot tárol, amit ujjlenyomattal vagy arccal oldasz fel. Adathalász oldalon nem működik, mert a kulcs csak a valódi domainhez tartozik.

## Titkosítás

A **titkosítás** az olvasható adatot (nyílt szöveg) egy **kulccsal** olvashatatlanná (titkosított szöveg) alakítja; csak a megfelelő kulccsal fejthető vissza.

- **Szimmetrikus** (pl. AES): ugyanaz a kulcs titkosít és fejt vissza. Gyors; a gond az, hogyan juttatod el biztonságosan a kulcsot.
- **Nyilvános kulcsú** / aszimmetrikus (pl. RSA, elliptikus görbék): kulcspár. A **nyilvános** kulccsal bárki titkosíthat neked, de csak a te **titkos** kulcsoddal lehet visszafejteni. A HTTPS így egyezik meg egy közös szimmetrikus kulcsban.

```python run
# Játék-titkosítás: Caesar-eltolás (a valóságban NEM biztonságos!)
def caesar(szoveg, kulcs):
    ki = ""
    for c in szoveg:
        if "a" <= c <= "z":
            ki += chr((ord(c) - ord("a") + kulcs) % 26 + ord("a"))
        else:
            ki += c
    return ki

titkos = caesar("tamadas hajnalban", 3)
print(titkos)
print(caesar(titkos, -3))
```

## Hash

A **hash** (lenyomat) egyirányú függvény: bármilyen adatból fix hosszú „ujjlenyomatot” készít, de abból az eredeti nem állítható vissza. A szerverek a jelszavaknak csak a (sózott) hash-ét tárolják; letöltött fájlok sértetlenségét is így ellenőrzik.

```python run
import hashlib
print(hashlib.sha256(b"jelszo123").hexdigest())
print(hashlib.sha256(b"jelszo124").hexdigest())   # egy karakter → teljesen más
```

## Összefoglalás

- Hosszú, egyedi jelszó vagy jelmondat, jelszókezelővel.
- MFA: két tényező (tudás, birtok, tulajdonság); a passkey adathalászat-álló.
- Szimmetrikus: egy kulcs; nyilvános kulcsú: kulcspár; hash: egyirányú lenyomat.

## A lecke feladata

```quiz required
? Melyik a legerősebb jelszó a felsoroltak közül?
- Anna2007
- P@ssw0rd
+ lila-bicikli-esik-hetfon-reggel
- 12345678
! A hossz számít a legtöbbet.

? Melyik hitelesítési tényező a telefonodon futó hitelesítő alkalmazás?
- amit tudsz
+ amid van
- ami vagy
! A telefon birtoklása a második tényező.

? Mi lesz a `"abc"` szövegből 3-as kulcsú Caesar-eltolással?
= def
! a→d, b→e, c→f.

? Hogy hívják azt a titkosítást, ahol nyilvános és titkos kulcsból álló kulcspár van?
+ aszimmetrikus (nyilvános kulcsú)
- szimmetrikus
- Caesar
- hash
! Pl. RSA.
```
