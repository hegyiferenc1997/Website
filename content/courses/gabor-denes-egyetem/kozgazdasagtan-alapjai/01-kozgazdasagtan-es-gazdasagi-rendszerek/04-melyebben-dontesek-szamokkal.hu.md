---
title: Mélyebben – döntések számokkal
summary: A termelési lehetőségek határa egy fejlesztőcsapat példáján (miért nő az alternatív költség), a határelemzés egy tanulási döntésen, az elsüllyedt költség csapdája, és a specializáció előnye két szobatárs között – mind kis programokkal kiszámolva.
minutes: 35
---

## Amit ebben a leckében megtanulsz

- **miért görbül** a termelési lehetőségek határa, és honnan jön a növekvő alternatív költség,
- hogyan hozz **határelemzéssel** jó döntést („még egy óra?”),
- hogyan ismerd fel az **elsüllyedt költség** csapdáját,
- miért nyer a cserén az is, aki **mindenben** gyengébb.

## 1. Miért görbe a termelési lehetőségek határa?

Egy cégnél 10 fejlesztő dolgozik. Mindegyikük havonta vagy új **funkciókat**, vagy **hibajavításokat** készíthet – de nem egyformán jól. Ha a vezetőség több javítást akar, kit tegyen át először? Természetesen azt, aki a funkciókban a legkevésbé, a javításokban a leginkább jó – nála a legkisebb az **alternatív költség**:

```python run
# Termelési lehetőségek határa: egy csapat 10 fejlesztője új funkciókat vagy hibajavításokat készíthet
# A fejlesztők nem egyformák: van, aki a funkciókban, van, aki a javításokban erős.
fejlesztok = [(9, 1), (8, 2), (7, 3), (6, 4), (5, 5), (4, 6), (3, 7), (2, 8), (1, 9), (1, 10)]  # (funkció, javítás)/hó

# Ha valakit átteszünk a javításokra, a legolcsóbbal kezdünk: akinek a legkisebb a funkció/javítás aránya
sorrend = sorted(fejlesztok, key=lambda p: p[0] / p[1])
funkcio = sum(f for f, j in fejlesztok)
javitas = 0
print(f"{'javításon':>9} | {'funkció':>7} | {'javítás':>7} | +1 ember alternatív költsége")
print(f"{0:>9} | {funkcio:>7} | {javitas:>7} |")
for i, (f, j) in enumerate(sorrend, 1):
    funkcio -= f
    javitas += j
    print(f"{i:>9} | {funkcio:>7} | {javitas:>7} | {f} funkció ↔ {j} javítás → 1 javítás = {f / j:.2f} funkció")
```

Az első átvezényelt fejlesztő 1 funkció árán 10 javítást hoz (1 javítás = 0,1 funkció). Az utolsó viszont 9 funkciót „visz el” egyetlen javításért! Ahogy egyre több embert teszünk át, egyre kevésbé alkalmasakat kell áttennünk, így **nő az alternatív költség** – ezért homorú (kifelé domború) a határ.

**Három szemlélet ugyanarra:**

- **Mérnöki:** a határ a rendszer kapacitása; ami belül van, az pazarlás (pl. valaki rossz feladaton ül), ami kívül, az elérhetetlen – hacsak nincs új eszköz vagy betanítás (a határ kitolódása).
- **Vezetői:** a határon minden pont **hatékony** – hogy melyiket választjuk, az már prioritás kérdése (funkció vagy stabilitás), nem számolásé.
- **Közgazdasági:** az emberek és erőforrások **nem tökéletesen helyettesíthetők** egymással – ez a görbület oka.

## 2. Határelemzés: még egy óra?

A jó döntés nem az „összesen megéri-e”, hanem a „**még egy egység** megéri-e” kérdésen múlik. Egy témakör tanulásánál az első órák sokat hoznak, a későbbiek egyre kevesebbet (csökkenő határhaszon), miközben minden óra ugyanannyiba kerül (pihenés, munka, más tárgy):

```python run
# Határelemzés: hány órát érdemes tanulni egy témakörre? (határhaszon vs határköltség)
# A tanulás haszna csökkenő: az első órák sokat hoznak, a későbbiek egyre kevesebbet.
haszon = [0, 30, 55, 75, 90, 100, 106, 109, 110]   # összes "tudás pont" 0…8 óra után
ora_ara = 12                                      # egy óra alternatív költsége (pl. pihenés, munka) ugyanebben a mértékben

legjobb = 0
for ora in range(1, len(haszon)):
    hatarhaszon = haszon[ora] - haszon[ora - 1]   # mit hoz a plusz egy óra
    dontes = "megéri" if hatarhaszon > ora_ara else "nem éri meg"
    print(f"{ora}. óra: határhaszon {hatarhaszon:>2} vs határköltség {ora_ara} → {dontes}")
    if hatarhaszon > ora_ara:
        legjobb = ora
nettok = [h - ora_ara * o for o, h in enumerate(haszon)]
print(f"\noptimum: {legjobb} óra (nettó haszon {nettok[legjobb]}); 8 óránál csak {nettok[8]}")
```

Addig érdemes folytatni, amíg a **határhaszon nagyobb a határköltségnél**. Itt ez 4 óra; 8 óra tanulás összesen még „megéri” (a nettó haszon pozitív), de sokkal rosszabb döntés, mint 4 óra. A határelemzés ezért nem azt kérdezi, megéri-e valami, hanem hogy **mennyit** érdemes belőle csinálni.

## 3. Az elsüllyedt költség csapdája

Egy projektbe már 8 millió forintot és fél évet fektettetek. Most kiderül, hogy a befejezéshez még 5 millió kell, és a kész termék várhatóan 4 millió bevételt hoz. Folytassátok?

- A csábító érvelés: „Ha most abbahagyjuk, a 8 millió kárba vész!”
- A helyes érvelés: a 8 millió **mindenképp elveszett** (elsüllyedt), bármit döntünk. A döntés csak a **jövőről** szól: 5 millió további költség kontra 4 millió bevétel → **nem** éri meg folytatni (−1 millió).

Ugyanez a csapda a hétköznapokban: végignézni egy rossz filmet, mert „már kifizettük a jegyet”, vagy egy elavult technológiánál maradni, mert „annyit tanultunk már bele”. A szoftverfejlesztésben ezt néha **„concorde-hatásnak”** is hívják, a veszteséges, mégis befejezett szuperszonikus repülőgép után.

## 4. A csere előnye: komparatív előny otthon

Anna mindkét házimunkában gyorsabb Bencénél (abszolút előny). Megéri-e mégis megosztani a munkát?

```python run
# A csere előnye: két szobatárs, két feladat (főzés és takarítás)
# percek egy egységre: Anna 30 perc egy főzés, 60 perc egy takarítás; Bence 60 és 90 perc
ido = {"Anna": {"főzés": 30, "takarítás": 60}, "Bence": {"főzés": 60, "takarítás": 90}}

for nev, t in ido.items():
    print(f"{nev}: 1 takarítás alternatív költsége {t['takarítás'] / t['főzés']:.1f} főzés")

# Mindketten maguk csinálnak mindent: 7 főzés + 3 takarítás kell fejenként
kulon = sum(7 * t["főzés"] + 3 * t["takarítás"] for t in ido.values())
# Specializáció: Bence takarít mindkettőjüknek (6 db), Anna főz mindkettőjüknek (14 db)
egyutt = 14 * ido["Anna"]["főzés"] + 6 * ido["Bence"]["takarítás"]
print(f"\nkülön: {kulon} perc, specializálva: {egyutt} perc → {kulon - egyutt} perc megtakarítás hetente")
```

Igen! Annának 1 takarítás 2 főzésbe „kerül”, Bencének csak 1,5-be – tehát Bencének **komparatív előnye** van a takarításban, Annának a főzésben. Ha mindenki azt csinálja, amiben relatíve jobb, együtt heti **2 órát** nyernek. Ugyanez az elv magyarázza a munkamegosztást egy csapaton belül (nem a legjobb programozónak kell minden feladatot megcsinálnia), és a nemzetközi kereskedelmet is (9. témakör).

## Összefoglalás

- A termelési lehetőségek határa azért görbe, mert az erőforrások nem egyformán alkalmasak mindenre: az alternatív költség nő.
- Határelemzés: addig folytasd, amíg a határhaszon nagyobb a határköltségnél.
- Az elsüllyedt költség nem számít a döntésben – csak a jövőbeli költségek és hasznok.
- Komparatív előny: a kisebb alternatív költség dönt, nem az abszolút gyorsaság; a specializáció mindkét félnek előnyös.

## A lecke feladata

```quiz required
? Egy fejlesztő havonta 6 funkciót vagy 3 javítást készíthet. Hány funkció egy javítás alternatív költsége nála?
= 2
! $6 / 3 = 2$ funkcióról mond le minden javításért.

? Egy kávézó a 30. vendég kiszolgálásával 900 Ft bevételt és 650 Ft többletköltséget ér el. Mennyi a 30. vendég nettó határhaszna (Ft)?
= 250
! $900 - 650 = 250$ Ft – megéri kiszolgálni.

? Egy projektbe eddig 10 millió Ft ment el. A befejezés még 3 millió, a várható bevétel 4 millió. Mit érdemes tenni?
+ befejezni, mert a további 3 millió költség 4 millió bevételt hoz
- abbahagyni, mert összesen 13 millió költség áll szemben 4 millió bevétellel
- abbahagyni, mert a 10 millió már elveszett
- nem lehet eldönteni
! Az elsüllyedt 10 millió nem számít; $4 - 3 = +1$ millió.

? Csökkenő határhaszon mellett hogyan változik egy újabb egység haszna?
- nő
+ csökken
- állandó
- először csökken, aztán nő
! Minden újabb óra (szelet pizza, fejlesztő) kevesebb pluszt hoz.

? Ha Anna egy óra alatt 4 oldalt fordít vagy 2 ábrát rajzol, Bence pedig 2 oldalt vagy 2 ábrát, kinek van komparatív előnye az ábrarajzolásban?
- Annának
+ Bencének
- mindkettőjüknek
- egyiküknek sem
! Annának 1 ábra 2 oldalba kerül, Bencének csak 1 oldalba.
```
