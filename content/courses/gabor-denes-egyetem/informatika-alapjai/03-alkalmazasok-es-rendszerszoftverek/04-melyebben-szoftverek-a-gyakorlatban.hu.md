---
title: Mélyebben – szoftverek a gyakorlatban
summary: Szemantikus verziók összehasonlítása programmal, függőségek és frissítési kockázat, licencek összeférhetősége egy projektben, letöltött telepítő ellenőrzése ellenőrzőösszeggel, és a teljes bekerülési költség (egyszeri, előfizetéses, nyílt forrású) – kis programokkal és interaktív ábrával.
minutes: 45
---

## Amit ebben a leckében megtanulsz

- hogyan olvasd és **hasonlítsd össze** a verziószámokat, és mit árul el egy frissítésről,
- miért jelent kockázatot minden **függőség**, és hogyan számolható ez,
- hogyan döntsd el, **összeférnek-e** a projektedben használt licencek,
- hogyan **ellenőrizd** egy letöltött telepítőt, és hogyan hasonlíts össze szoftvereket **költség** alapján.

## 1. Szemantikus verziózás: mit árul el a verziószám?

Az alapleckében láttuk a `fő.al.javítás` (pl. `3.14.1`) formát. A **szemantikus verziózás** (SemVer) szabálya szerint:

- a **javítás** szám nő, ha csak hibát javítottak (nyugodtan frissíthetsz),
- az **al** szám nő, ha új funkció jött, de a régi használat működik tovább,
- a **fő** szám nő, ha **visszafelé nem kompatibilis** változás történt – frissítés előtt olvasd el a változásnaplót!

Egy gyakori csapda: a verziószámokat **nem lehet szövegként** összehasonlítani. Szövegként a `"3.9"` nagyobb, mint a `"3.14"`, mert a `9` karakter nagyobb az `1`-nél:

```python run
# Verziószámok összehasonlítása: szövegként rossz, számként jó
def verzio(v):
    return tuple(int(x) for x in v.split("."))   # "3.14.1" → (3, 14, 1)

print("szövegként:", "3.9" < "3.14")             # hamis – pedig a 3.14 az újabb
print("számként:  ", verzio("3.9") < verzio("3.14"))

def frissites_tipusa(regi, uj):
    r, u = verzio(regi), verzio(uj)
    if u[0] > r[0]:
        return "FŐ – nem kompatibilis lehet, olvasd el a változásnaplót!"
    if u[1] > r[1]:
        return "al – új funkció, kompatibilis"
    return "javítás – hibajavítás, frissíts nyugodtan"

for regi, uj in [("2.4.1", "2.4.2"), ("2.4.2", "2.5.0"), ("2.5.0", "3.0.0")]:
    print(f"{regi} → {uj}: {frissites_tipusa(regi, uj)}")

print(sorted(["1.10.0", "1.2.0", "1.9.3"], key=verzio))   # helyes sorrend
```

## 2. Függőségek: minden csomag egy kis kockázat

Egy mai webes projekt gyakran **több száz** csomagra épül, mert a közvetlen függőségeidnek is vannak függőségei. Ha egyenként kicsi is az esélye, hogy egy csomagban egy éven belül biztonsági hibát találnak, sok csomagnál ez szinte biztos:

```python run
# Függőségi kockázat: annak esélye, hogy legalább egy csomag érintett
for csomagok in [1, 10, 50, 200, 800]:
    p = 0.01                                     # feltevés: csomagonként évi 1% esély
    legalabb_egy = 1 - (1 - p) ** csomagok
    print(f"{csomagok:>4} csomag: {legalabb_egy:7.2%} esély, hogy idén legalább egyben hibát találnak")
```

Ezért kell a frissítés **rendszeres** feladat, nem egyszeri. A gyakorlatban ebben segít:

- a **zárolt verziók** (lock fájl, pl. `pnpm-lock.yaml`): mindenki pontosan ugyanazt a verziót telepíti,
- az **automatikus figyelmeztetés** (pl. GitHub Dependabot) ismert sebezhetőségekről,
- és a **minimalizmus**: ne telepíts egy csomagot egy háromsoros függvény miatt.

## 3. Licencek összeférhetősége

Az alapleckében megismerted a **megengedő** (MIT, BSD, Apache) és a **copyleft** (GPL) licenceket. A gyakorlati kérdés: ha a saját, zárt forrású termékedbe beépítesz egy csomagot, szabad-e? Egyszerűsített szabály (nem jogi tanács!): a megengedő licencű kódot beépítheted, ha megtartod a szerzői jogi megjegyzést; a GPL-es kódot **terjesztett** zárt termékbe nem építheted be, mert akkor a teljes terméket GPL alatt kellene kiadnod.

```python run
# Licencellenőrzés egy (egyszerűsített) szabálytáblával – nem jogi tanács!
SZABALY = {
    "MIT": "rendben (a szerzői jogi megjegyzést meg kell tartani)",
    "BSD-3-Clause": "rendben (a megjegyzést meg kell tartani)",
    "Apache-2.0": "rendben (megjegyzés + szabadalmi feltételek)",
    "LGPL-3.0": "óvatosan: külön, cserélhető könyvtárként használható",
    "GPL-3.0": "PROBLÉMA: zárt, terjesztett termékbe nem építhető be",
}

fuggosegek = {"requests": "Apache-2.0", "flask": "BSD-3-Clause", "pyqt-minta": "GPL-3.0", "dateutil": "Apache-2.0", "tqdm": "MIT"}
for csomag, licenc in fuggosegek.items():
    print(f"{csomag:<12} {licenc:<13} → {SZABALY.get(licenc, 'ismeretlen licenc: kézzel ellenőrizd!')}")
```

Két fontos nézőpont: egy **belső** (nem terjesztett) eszköznél a GPL általában nem okoz gondot, egy **eladott** alkalmazásnál viszont igen. Ha bizonytalan vagy, kérdezz meg valakit, aki ért hozzá – egy cégnél a jogi osztályt.

## 4. Letöltött telepítő ellenőrzése

Honnan tudod, hogy a letöltött telepítőt útközben nem cserélték ki, vagy nem sérült meg? A komoly projektek közzéteszik a fájl **ellenőrzőösszegét** (pl. SHA-256 hash). Ez egy „ujjlenyomat”: ha a fájlban akár egyetlen bit megváltozik, teljesen más lesz:

```python run
# Ellenőrzőösszeg (SHA-256): egyetlen bájt eltérés is teljesen más ujjlenyomatot ad
import hashlib

eredeti = b"telepito tartalma, 1.0 verzio"
modositott = b"telepito tartalma, 1.0 verzi0"     # egyetlen karakter más
print(hashlib.sha256(eredeti).hexdigest())
print(hashlib.sha256(modositott).hexdigest())

kozzetett = hashlib.sha256(eredeti).hexdigest()    # ezt a fejlesztő oldalán látod
letoltott = eredeti                               # ezt töltötted le
print("egyezik:", hashlib.sha256(letoltott).hexdigest() == kozzetett)
```

Windowson a `Get-FileHash fájl.exe` (PowerShell), Linuxon a `sha256sum fájl` paranccsal számolhatod ki. Az ellenőrzőösszeg csak akkor ér valamit, ha **hivatalos, biztonságos (HTTPS) helyről** származik – ezért telepíts lehetőleg csomagkezelővel vagy a gyártó oldaláról, ne „ingyenes letöltőoldalakról”.

## 5. Mennyibe kerül valójában? A teljes bekerülési költség

Egy szoftver árát nem csak a vételár adja: számít a **betanítás**, a **karbantartás** és az **éves díjak**. Egy kis iroda (10 gép) három lehetőséget mérlegel:

```plot
title: Összes költség (ezer Ft) az évek függvényében, 10 gépre
x: 0, 8
y: 0, 2500
param: s = 30, 10, 60, 5
f: 1500 + 100*x # egyszeri licenc + éves támogatás
f: s*10*x # előfizetés: s ezer Ft/gép/év
f: 600 + 50*x # nyílt forrású: betanítás + üzemeltetés
```

Az ábrán az előfizetés (alapból 30 ezer Ft/gép/év) eleinte a legolcsóbb, de az évek során utoléri az egyszeri licencet; a csúszkával kipróbálhatod, hogyan változik ez az árazással. A **nyílt forrású** megoldás sem ingyenes: a betanítás és az üzemeltetés pénzbe (és időbe) kerül – viszont nincs licencdíj, és nem függsz egy gyártótól.

| Nézőpont            | Mi számít neki?                                     | Jellemző döntés                                  |
| ------------------- | --------------------------------------------------- | ------------------------------------------------ |
| **felhasználó**     | egyszerű használat, megszokott felület, ár          | ingyenes vagy előfizetéses, ismert alkalmazás    |
| **fejlesztő**       | licenc, függőségek száma, frissítések, dokumentáció | nyílt forrású, megengedő licencű könyvtárak      |
| **cég / IT-vezető** | teljes költség, támogatás, biztonság, gyártófüggés  | szerződéses támogatás, központi frissítéskezelés |

## Összefoglalás

- A szemantikus verzióban a fő szám növekedése nem kompatibilis változást jelez; a verziókat számként (tuple-ként) hasonlítsd össze, ne szövegként.
- Sok függőségnél szinte biztos, hogy valamelyikben hibát találnak – ezért a frissítés rendszeres feladat (lock fájl, automatikus figyelmeztetés).
- Megengedő licencű kód beépíthető zárt termékbe, GPL-es kód terjesztett zárt termékbe nem.
- A letöltött telepítőt ellenőrzőösszeggel ellenőrizheted; a döntésnél a teljes bekerülési költséget nézd, ne csak a vételárat.

## A lecke feladata

```quiz required
? Egy könyvtár 4.2.7-ről 5.0.0-ra frissül. Mit jelent ez a szemantikus verziózás szerint?
- csak hibajavítás történt
- új, kompatibilis funkció jött
+ visszafelé nem kompatibilis változás lehet, frissítés előtt olvasd el a változásnaplót
- a verziószámnak nincs jelentése
! A fő szám növekedése nem kompatibilis változást jelez.

? Melyik verzió a legújabb: 1.9.3, 1.10.0 vagy 1.2.0?
= 1.10.0
! Számként: $(1, 10, 0) > (1, 9, 3) > (1, 2, 0)$.

? Egy projekt 100 csomagra épül, mindegyikben évi 1% eséllyel találnak hibát. Kb. hány százalék az esélye, hogy idén legalább egyben találnak? (egészre)
= 63
! $1 - 0{,}99^{100} \approx 0{,}634$.

? Egy eladott, zárt forrású asztali alkalmazásba melyik licencű könyvtárat NEM építheted be szabadon?
- MIT
- BSD
- Apache-2.0
+ GPL-3.0
! A GPL copyleft: a teljes terméket GPL alatt kellene kiadni.

? Mire való egy telepítő SHA-256 ellenőrzőösszege?
- gyorsabbá teszi a telepítést
+ ellenőrizheted vele, hogy a letöltött fájl bitre pontosan megegyezik a kiadottal
- titkosítja a fájlt
- a licenckulcsot tartalmazza
! Egyetlen bit eltérés is teljesen más ujjlenyomatot ad.
```
