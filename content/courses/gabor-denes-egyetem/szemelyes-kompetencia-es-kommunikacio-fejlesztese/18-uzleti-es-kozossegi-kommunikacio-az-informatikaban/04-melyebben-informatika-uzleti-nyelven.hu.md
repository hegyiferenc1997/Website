---
title: Mélyebben – informatika üzleti nyelven
summary: A rendelkezésre állás „kilencesei” lefordítva percekre, egy lassú build és egy leállás költsége forintban, egy incidens állapotüzeneteinek idővonala, és egy nyílt forrású projekt egészsége (első válaszidő, „buszfaktor”) a karbantartó, a felhasználó és a cég szemszögéből – kis programokkal és interaktív ábrával.
minutes: 40
---

## Amit ebben a leckében megtanulsz

- hogyan fordítsd le a **rendelkezésre állást** („három kilences”) érthető percekre,
- hogyan fejezz ki egy műszaki problémát **forintban**, hogy egy döntéshozó is értse,
- milyen **ütemben és szerkezetben** kommunikálj egy incidens alatt,
- hogyan mérhető egy **nyílt forrású projekt** egészsége, és miért fontos ez a cégeknek.

## 1. A „kilencesek”: mennyi leállás fér bele?

A szolgáltatási szerződésekben (SLA) gyakran ilyesmi áll: „99,9%-os rendelkezésre állás”. Egy nem műszaki vezetőnek ez a szám semmit sem mond – 99,9% elég közel van a 100%-hoz, nem? Fordítsuk le **percekre**:

```python run
# Rendelkezésre állás ("kilencesek") lefordítva megengedett leállási időre
perc_ev = 365 * 24 * 60
for szazalek in [99.0, 99.5, 99.9, 99.95, 99.99]:
    leallas_ev = perc_ev * (1 - szazalek / 100)
    leallas_ho = leallas_ev / 12
    print(f"{szazalek:>6}%: évente {leallas_ev / 60:6.1f} óra, havonta {leallas_ho:6.1f} perc")
```

A „99,9%” havonta kb. **44 perc** leállást enged – ez egyetlen rosszul sikerült frissítés. A „99,99%” már csak 4 percet: ehhez automatikus átállás, több szerver és éjjel-nappali ügyelet kell, ami **sokszor annyiba kerül**. Ez az igazi üzleti kérdés: **mennyit ér meg nekünk a plusz kilences?** Egy egyetemi órarendtervezőnél a 99,5% bőven elég; egy banki fizetési rendszernél a 99,99% is kevés lehet.

```plot
title: Megengedett havi leállás (perc) a rendelkezésre állás függvényében
x: 99, 100
y: 0, 450
f: 30*24*60*(1 - x/100) # perc havonta
dash: 43.2 # 99,9% határa
```

## 2. Műszaki probléma forintban

„A build lassú, kéne rá két hét optimalizálás.” Egy vezető erre azt kérdezi: **megéri?** Számold ki helyette:

```python run
# Egy lassú build és egy leállás költsége forintban – a döntéshozó nyelvén
def szam(x):
    return f"{x:,.0f}".replace(",", " ")       # magyar ezres tagolás

# 1) lassú build
fejlesztok = 6
build_naponta = 10                               # fejlesztőnként
varakozas_perc = 12 - 3                          # most 12 perc, optimalizálva 3 perc lenne
oradij = 8000                                    # Ft, egy fejlesztőóra teljes költsége
munkanap_ho = 21
elveszett_ora = fejlesztok * build_naponta * varakozas_perc / 60 * munkanap_ho
koltseg_ho = elveszett_ora * oradij
optimalizalas = 2 * 5 * 8 * oradij               # 2 hét, 1 fejlesztő
print(f"havonta {elveszett_ora:.0f} óra várakozás = {szam(koltseg_ho)} Ft")
print(f"az optimalizálás ára {szam(optimalizalas)} Ft, megtérül {optimalizalas / koltseg_ho * munkanap_ho:.0f} munkanap alatt\n")

# 2) egy webshop leállása
bevetel_ora = 150_000                            # Ft átlagos óránkénti bevétel
leallas_ora = 3
elmaradt = bevetel_ora * leallas_ora
ugyfelszolgalat = 40 * 15 / 60 * 5000            # 40 panaszhívás, 15 perc, 5000 Ft/óra
print(f"3 órás leállás: {szam(elmaradt)} Ft elmaradt bevétel + {szam(ugyfelszolgalat)} Ft ügyfélszolgálat")
print("(+ nehezen mérhető: elveszett bizalom, visszatérő vásárlók)")
```

A „lassú a build” így válik ilyen mondattá: „Havonta 189 fejlesztőóra megy el várakozással, ez kb. 1,5 millió Ft; a kéthetes optimalizálás 640 ezer Ft, és kb. 9 munkanap alatt megtérül.” Ezt egy vezető **perc alatt** jóvá tudja hagyni. Három szabály a pénzre fordításhoz:

- A feltevéseket **mondd ki** (óradíj, buildszám), hogy a döntéshozó ellenőrizhesse vagy kiigazíthassa őket.
- Kerekíts **becsületesen**, és jelezd a bizonytalanságot („kb.”, „legalább”).
- Ne felejtsd el a **nehezen mérhető** tételeket (bizalom, fejlesztői elégedettség) – de ne is számold túl őket.

## 3. Az incidens állapotüzenetei: ütem és szerkezet

Az alapleckében láttuk, mitől jó egy incidensüzenet. A gyakorlatban egy incidens **idővonal**: több üzenet egymás után, rendszeres ütemben. A legfontosabb szabály: **akkor is írj, ha nincs új hír** – a csend a felhasználóknak azt jelenti, hogy senki sem foglalkozik a problémával.

```python run
# Incidens-kommunikáció: állapotüzenetek idővonala sablonból, rendszeres frissítéssel
from datetime import datetime, timedelta

kezdet = datetime(2026, 11, 20, 14, 5)
esemenyek = [  # (perc a kezdettől, állapot, mit tudunk)
    (0, "Vizsgáljuk", "A foglalási oldal egyes felhasználóknak hibát jelez. A már leadott foglalások biztonságban vannak."),
    (20, "Azonosítottuk", "A hibát egy adatbázis-frissítés okozza. Visszaállítjuk az előző verziót."),
    (50, "Javítás alatt", "A visszaállítás folyamatban van; a foglalás néhány felhasználónál még lassú."),
    (75, "Megoldva", "A szolgáltatás helyreállt. Részletes elemzést 2 munkanapon belül közzéteszünk."),
]
frissites_perc = 30                              # legkésőbb ennyi idő múlva jön a következő frissítés
for perc, allapot, szoveg in esemenyek:
    ido = kezdet + timedelta(minutes=perc)
    kovetkezo = "" if allapot == "Megoldva" else f" Következő frissítés: legkésőbb {(ido + timedelta(minutes=frissites_perc)):%H:%M}."
    print(f"[{ido:%H:%M}] {allapot.upper()}: {szoveg}{kovetkezo}")
```

Figyeld meg a szerkezetet: minden üzenetben ott van az **állapot**, hogy **mit tudunk**, mi az, ami **nem** érinti a felhasználót (a foglalások biztonságban vannak), és **mikor jön a következő** hír. A végén pedig egy ígéret: a **hibáztatásmentes utólagos elemzés** közzététele. Ez a sorozat bizalmat épít – sokszor jobban, mint ha a hiba meg sem történt volna.

## 4. Egy nyílt forrású projekt egészsége

Amikor egy cég egy nyílt forrású könyvtárra épít, valójában egy **közösségre** épít. Két egyszerű mutató sokat elárul: mennyi idő alatt kap választ egy új issue (**első válaszidő**), és hány emberen múlik a projekt (**buszfaktor**: hány fő kiesése után állna le a fejlesztés).

```python run
# Nyílt forrású projekt egészsége: első válaszidő és buszfaktor
from statistics import median

elso_valasz_ora = [2, 5, 1, 30, 4, 72, 3, 8, 6, 120, 2, 10]   # az utolsó 12 issue
print(f"első válaszidő mediánja: {median(elso_valasz_ora)} óra, leglassabb: {max(elso_valasz_ora)} óra")

commitok = {"maria": 410, "tom": 95, "lee": 60, "ana": 25, "dev42": 10}   # az elmúlt év commitjai
osszes = sum(commitok.values())
fedezet, buszfaktor = 0, 0
for nev, db in sorted(commitok.items(), key=lambda t: -t[1]):
    fedezet += db
    buszfaktor += 1
    if fedezet / osszes >= 0.5:                 # ennyi ember adja a munka felét
        break
print(f"buszfaktor: {buszfaktor} (a commitok {fedezet / osszes:.0%}-át {buszfaktor} ember adja)")
```

Az első válaszidő mediánja jó (néhány óra), de a buszfaktor **1**: a munka több mint felét egyetlen ember végzi. Három nézőpont:

| Nézőpont        | Mit lát?                                                                                                    | Mit tehet?                                                                                    |
| --------------- | ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| **karbantartó** | Kiégés veszélye: minden kérdés, kódátnézés és kiadás rajta múlik, gyakran ingyen.                           | Feladatok delegálása, „good first issue” címkék új közreműködőknek, határok kijelölése.       |
| **felhasználó** | A könyvtár remekül működik – amíg a karbantartó el nem fogy. Akkor a biztonsági javítások is elmaradhatnak. | Jó minőségű hibajelentés, dokumentáció javítása, kisebb pull requestek – a teher csökkentése. |
| **cég**         | Üzleti kockázat: a termékük egy egyemberes projekten áll.                                                   | Szponzorálás, fejlesztői idő felajánlása a projektnek, vagy alternatíva felmérése.            |

A tanulság a 18. témakör egészére igaz: a műszaki valóságot (rendelkezésre állás, buildidő, commitok) **le kell fordítani** annak a nyelvére, aki dönt, és minden érintett nézőpontját érdemes megérteni.

## Összefoglalás

- A rendelkezésre állást fordítsd percekre: 99,9% ≈ 44 perc leállás havonta, 99,99% ≈ 4 perc – és mérlegeld, megéri-e a plusz kilences ára.
- Egy műszaki problémát forintban fejezz ki, kimondott feltevésekkel és becsületes kerekítéssel.
- Incidens alatt rendszeres ütemben kommunikálj (akkor is, ha nincs új hír): állapot, amit tudunk, ami nem érintett, a következő frissítés ideje.
- Egy nyílt forrású projekt egészségét az első válaszidő és a buszfaktor jól jelzi; a karbantartó, a felhasználó és a cég mind tehet érte.

## A lecke feladata

```quiz required
? Egy szolgáltatás 99,9%-os rendelkezésre állást vállal. Hány óra leállás fér bele egy (365 napos) évbe? (két tizedesre)
= 8,76
= 8.76
! $365 \cdot 24 \cdot 0{,}001 = 8{,}76$ óra.

? Egy webshop óránként átlagosan 200 ezer Ft bevételt hoz. Mennyi az elmaradt bevétel egy 2 órás leállás alatt (ezer Ft-ban)?
= 400
! $200 \cdot 2 = 400$ ezer Ft.

? Egy projekt commitjainak 60%-át egyetlen ember adja. Mennyi a buszfaktor (hány ember adja a munka legalább felét)?
= 1
! Egyetlen ember már a munka több mint felét végzi.

? Egy incidens alatt 40 perce nincs új információ. Mi a teendő?
- várni, amíg lesz valami új
+ rövid frissítést küldeni: még vizsgáljuk, mi nem érintett, és mikor jön a következő hír
- törölni a korábbi üzeneteket
- csak a megoldás után írni
! A csend azt sugallja, hogy senki sem foglalkozik a problémával.

? Hogyan érdemes egy lassú build problémáját egy nem műszaki vezetőnek előadni?
- „A CI pipeline cache-elése nem optimális.”
+ havi elveszett fejlesztőórákban és forintban, a megoldás árával és megtérülési idejével, a feltevéseket kimondva
- sehogy, ez műszaki ügy
- a buildnapló bemásolásával
! A döntéshozó nyelvén: költség, haszon, megtérülés.
```
