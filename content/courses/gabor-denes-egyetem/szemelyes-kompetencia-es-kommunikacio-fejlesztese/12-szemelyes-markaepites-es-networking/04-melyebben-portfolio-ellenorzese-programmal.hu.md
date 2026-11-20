---
title: Mélyebben – a portfólió ellenőrzése programmal
summary: Egy portfólióprojekt átvilágítása kis programmal (README-szakaszok, kiszivárgott titkok, licenc), a GitHub-aktivitás rendszeressége, az önéletrajz kulcsszavainak egyezése egy álláshirdetéssel, és ugyanaz a profil három olvasó – a toborzó, a műszaki vezető és a gépi szűrő – szemével.
minutes: 40
---

## Amit ebben a leckében megtanulsz

- hogyan **világítsd át** egy portfólióprojektedet, mielőtt megmutatod,
- miért veszélyes egy **kiszivárgott jelszó vagy API-kulcs** a nyilvános tárolóban,
- miért számít a **rendszeresség** a GitHub-aktivitásban,
- hogyan **igazítsd** az önéletrajzodat egy álláshirdetéshez úgy, hogy őszinte maradjon.

## 1. Portfólió-átvilágítás

Az alapleckében láttuk, mitől jó egy portfólióprojekt: érthető leírás, telepítési lépések, képernyőkép vagy élő demó, licenc. Egy kis program megmondja, mi hiányzik – és közben a legsúlyosabb hibát is keresi: a nyilvános tárolóba **feltöltött titkokat**.

```python run
# Portfólióprojekt átvilágítása: README-szakaszok, licenc és kiszivárgott titkok keresése
import re

projekt = {  # fájlnév: tartalom (egy kitalált tároló)
    "README.md": """# Órarendtervező
Webes alkalmazás, amely ütközésmentes órarendet állít össze.
## Telepítés
pnpm install && pnpm dev
## Használat
Válaszd ki a tárgyakat, és kattints az Összeállítás gombra.
""",
    "src/config.py": 'DB_URL = "postgres://admin:Titok123@db.example.com/orarend"\nDEBUG = True\n',
    ".env": "API_KEY=sk-test-51Habc123\n",
    "src/app.py": "print('szia')\n",
}

readme = projekt.get("README.md", "").lower()
kotelezo = {"telepítés": "## telepítés", "használat": "## használat",
            "képernyőkép vagy demó": "![", "licenc": "## licenc"}
for nev, jel in kotelezo.items():
    print(f"{'✓' if jel in readme else '✗'} README: {nev}")
print(f"{'✓' if any(f.upper().startswith('LICENSE') for f in projekt) else '✗'} LICENSE fájl")

titok_mintak = [r"api_key\s*=", r"password\s*=", r"://[^:\s]+:[^@\s]+@", r"secret\s*="]
for fajl, tartalom in projekt.items():
    for minta in titok_mintak:
        if re.search(minta, tartalom.lower()):
            print(f"⚠ LEHETSÉGES TITOK: {fajl} (minta: {minta})")
if ".env" in projekt:
    print("⚠ a .env fájl fel van töltve – tedd a .gitignore-ba!")
```

A program két fontos dolgot talál:

- **Hiányzik a képernyőkép és a licenc.** Egy toborzó vagy egy műszaki vezető átlagosan csak néhány percet tölt egy projekttel; egy kép vagy egy élő link azonnal megmutatja, mit csinál a program. Licenc nélkül pedig jogilag senki sem használhatja a kódodat.
- **Titkok vannak a kódban.** Egy adatbázis-jelszó a `config.py`-ban és egy API-kulcs a `.env` fájlban – nyilvános tárolóban ezeket automatizált robotok **perceken belül** megtalálhatják és visszaélhetnek velük. És a törlés nem elég: a régi commitokban megmaradnak!

Mit tegyél, ha már feltöltöttél egy titkot?

1. **Azonnal érvénytelenítsd** (új jelszó, új API-kulcs) – ez a legfontosabb lépés.
2. A titkokat **környezeti változóból** olvasd, a `.env` fájlt tedd a `.gitignore`-ba, és adj mellé egy `.env.example` mintát értékek nélkül.
3. Kapcsold be a tárhely **titokkeresőjét** (pl. a GitHub secret scanning funkcióját), ami a jövőben figyelmeztet.

> Egy biztonságtudatos portfólió **önmagában is ajánlólevél**: egy műszaki vezető számára a gondosan kezelt konfiguráció jobb jel, mint még egy funkció.

## 2. Rendszeresség a GitHub-aktivitásban

Sok hallgató a félév végén egy hét alatt tölt fel mindent. A műszaki vezetők viszont szívesebben látják a **rendszeres, kis lépéseket**: ez arra utal, hogy a fejlesztő kis, átgondolt változtatásokban dolgozik. Elemezzünk két commit-történetet (a félév hetei szerint):

```python run
# Commitok heti eloszlása: rendszeresség vs. hajrá a félév végén
from statistics import mean, pstdev

tortenet = {
    "A hallgató": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 25, 31],
    "B hallgató": [3, 4, 2, 5, 3, 4, 3, 2, 4, 5, 3, 4, 6, 5],
}
for nev, hetek in tortenet.items():
    aktiv = sum(1 for h in hetek if h > 0)
    print(f"{nev}: összesen {sum(hetek)} commit, aktív hetek: {aktiv}/{len(hetek)}, "
          f"heti átlag {mean(hetek):.1f}, szórás {pstdev(hetek):.1f}")
    print("   " + "".join("█" if h >= 10 else "▆" if h >= 4 else "▂" if h > 0 else "·" for h in hetek))
```

A két hallgató nagyjából ugyanannyi commitot készített, de **B** 14 hétből 14-ben dolgozott, kis szórással; **A** egyetlen hajrában. Egy interjún B története sokkal meggyőzőbb: „hétről hétre haladtam, és minden lépést külön commitban rögzítettem”. Fontos: ez nem azt jelenti, hogy „zöld négyzeteket” kell gyűjteni értelmetlen commitokkal – a cél a **valódi, rendszeres munka**, amit a történet visszatükröz.

## 3. Önéletrajz és álláshirdetés: kulcsszavak

Sok cég **gépi szűrőt** (ATS, applicant tracking system) használ, amely az önéletrajzot a hirdetés kulcsszavaihoz hasonlítja. Nézzük meg, mennyire egyezik egy önéletrajz egy gyakornoki hirdetéssel:

```python run
# Kulcsszó-egyezés az önéletrajz és az álláshirdetés között
hirdetes = {"python", "sql", "git", "rest api", "docker", "linux", "csapatmunka", "angol"}
oneletrajz = """Python és SQL alapú órarendtervező alkalmazást fejlesztettem csapatban (4 fő),
verziókezelés Gittel, REST API a backendben. Angol nyelvtudás: B2."""

szoveg = oneletrajz.lower()
megvan = {k for k in hirdetes if k in szoveg or (k == "csapatmunka" and "csapatban" in szoveg)}
print(f"egyezés: {len(megvan)}/{len(hirdetes)} = {len(megvan) / len(hirdetes):.0%}")
print(f"megvan: {sorted(megvan)}")
print(f"hiányzik: {sorted(hirdetes - megvan)}")
```

Két kulcsszó hiányzik: **Docker** és **Linux**. Mit tegyél?

- Ha **tényleg** használtad őket (pl. a projektet Docker-konténerben futtattad, Linuxon fejlesztettél), **írd bele** – konkrétan, a projekt leírásában.
- Ha **nem**, ne írd bele! Az interjún úgyis kiderül, és az őszinteség hiánya rosszabb, mint egy hiányzó kulcsszó. Inkább tanuld meg: egy hétvégi mini-projekt Dockerrel már valódi tapasztalat.
- Használd a hirdetés **szóhasználatát**: ha „csapatmunkát” kér, a „4 fős csapatban dolgoztam” mondat jobb, mint a „jó csapatjátékos vagyok” – mert tényt mond.

## 4. Egy profil, három olvasó

Ugyanazt a profilt (önéletrajz + GitHub + LinkedIn) három nagyon különböző „olvasó” nézi:

| Olvasó               | Mennyi időt szán rá?                            | Mit keres?                                                        | Mire figyelj?                                                          |
| -------------------- | ----------------------------------------------- | ----------------------------------------------------------------- | ---------------------------------------------------------------------- |
| **gépi szűrő (ATS)** | másodpercek töredéke                            | kulcsszavak, egyszerű, géppel olvasható szerkezet                 | szöveges PDF, szabványos fejezetcímek, ne képként szerepeljen a szöveg |
| **toborzó (HR)**     | gyakran csak néhány másodperc az első átfutásra | illeszkedés a pozícióhoz, érthető eredmények, rendezettség        | az első harmadban a lényeg; konkrét számok („40%-kal kevesebb hívás”)  |
| **műszaki vezető**   | percek, ha felkeltette az érdeklődését          | a kód minősége, a README, a commit-történet, a döntések indoklása | 2–3 kiemelt, jól dokumentált projekt; tiszta, biztonságos kód          |

A tanulság: a profilnak **mindhárom szinten** működnie kell. Ami a gépnek kulcsszó, az a toborzónak eredmény, a műszaki vezetőnek pedig egy kattintásra elérhető, működő kód. A következetesség (ugyanaz a név, cím, link mindenhol) mindhárom olvasónak segít.

## Összefoglalás

- Mielőtt megmutatod a portfóliódat, világítsd át: README-szakaszok, képernyőkép vagy demó, licenc – és soha ne legyen benne jelszó vagy API-kulcs.
- Egy kiszivárgott titkot azonnal érvényteleníts; a törlés nem elég, mert a régi commitokban megmarad.
- A rendszeres, kis lépésekben végzett munka meggyőzőbb, mint egy félév végi hajrá.
- Az önéletrajzot igazítsd a hirdetés kulcsszavaihoz – de csak valódi tapasztalattal; a profilnak a gépi szűrőnek, a toborzónak és a műszaki vezetőnek is működnie kell.

## A lecke feladata

```quiz required
? Egy álláshirdetés 8 kulcsszavából 6 szerepel az önéletrajzodban. Hány százalékos az egyezés? (csak a számot írd)
= 75
! $6 / 8 = 75\%$.

? Véletlenül feltöltöttél egy API-kulcsot egy nyilvános tárolóba. Mi a legelső teendő?
- törölni a fájlt egy új commitban
+ azonnal érvényteleníteni a kulcsot, és újat generálni
- priváttá tenni a tárolót egy hét múlva
- semmi, úgysem veszi észre senki
! A régi commitokban a kulcs megmarad, és robotok percek alatt megtalálhatják – csak az érvénytelenítés véd.

? Hová kerüljenek a titkok (jelszavak, kulcsok) egy projektben?
- a README-be, hogy mindenki lássa, hogyan kell beállítani
- a forráskódba, konstansként
+ környezeti változóba; a .env fájl a .gitignore-ba, mellé egy értékek nélküli .env.example
- egy nyilvános Gist-be
! A tárolóba csak a minta kerül, az igazi érték soha.

? Két hallgató commit-története közül melyik a meggyőzőbb egy műszaki vezetőnek?
- aki az utolsó két hétben töltött fel mindent
+ aki hétről hétre, kis, jól leírt lépésekben dolgozott
- akinek a legtöbb commitja van, akármilyen üzenettel
- akinek egyetlen, nagy commitja van
! A rendszeres, kis lépések a jó munkamódszert mutatják.

? A hirdetés Dockert kér, de soha nem használtad. Mi a helyes lépés?
- beleírni az önéletrajzba, mert a gépi szűrő úgysem ellenőrzi
+ nem beleírni, hanem megtanulni (pl. egy kis projekttel), és utána valódi tapasztalatként szerepeltetni
- a hirdetésre nem jelentkezni soha
- fehér betűvel elrejteni a szót az önéletrajzban
! Az őszinteség hiánya az interjún kiderül, és rosszabb egy hiányzó kulcsszónál.
```
