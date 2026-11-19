---
title: Mélyebben – határidők, akkumulátor és memória: a speciális rendszerek számolásai
summary: Valós idejű ütemezhetőség – kihasználtsági teszt, a Rate Monotonic korlát (69%), a Rate Monotonic és az EDF ütemezés szimulátorral; beágyazott rendszer akkumulátor-élettartama alvó üzemmóddal; és hogyan dönti el az Android, melyik háttéralkalmazást állítsa le, ha fogy a memória.
minutes: 40
---

## Amit ebben a leckében megtanulsz

- hogyan dönthető el **számolással**, hogy egy valós idejű rendszer minden határidőt tartani fog-e,
- miben különbözik a **Rate Monotonic** és az **EDF** ütemezés, és mikor hibázik az egyik, amikor a másik nem,
- hogyan számolják ki egy beágyazott eszköz **akkumulátor-élettartamát**, és miért alszik a processzor szinte mindig,
- hogyan választja ki a mobil OS, melyik **háttéralkalmazást** állítsa le, ha elfogy a memória.

Az asztali OS az **átlagos** felhasználói élményre optimalizál. A speciális rendszereknek más a „pénznemük”: a valós idejű rendszernek a **határidő**, a beágyazottnak az **energia**, a mobilnak a **memória** és az akkumulátor. Nézzük mindhármat számokkal!

## 1. Valós idő: tartjuk-e minden határidőt?

Egy valós idejű rendszerben a feladatok tipikusan **periodikusak**: például a motorvezérlő 5 ms-onként leolvassa a szenzort. Minden feladatot két szám jellemez:

- **C** – a legrosszabb futásidő (_worst-case execution time_),
- **T** – a periódus (és egyben a határidő: a következő indulásig végeznie kell).

A **kihasználtság**: U = Σ C / T. Ha U > 1 (100%), akkor biztosan **nem** fér bele – több munka van, mint idő.

### A Rate Monotonic ütemezés és a 69%-os korlát

A **Rate Monotonic** (RM) ütemezés egyszerű, **rögzített** prioritású szabály: a rövidebb periódusú feladat kap **nagyobb prioritást**. Liu és Layland 1973-ban bebizonyította: n feladat esetén RM-mel **biztosan** minden határidő teljesül, ha

**U ≤ n · (2^(1/n) − 1)**

```python run
# A Rate Monotonic biztonságos kihasználtsági korlátja n feladatra
import math

for n in [1, 2, 3, 4, 5, 10, 100]:
    korlat = n * (2 ** (1 / n) - 1)
    print(f"n = {n:>3}: U ≤ {korlat:.3f} ({korlat:.1%})")
print(f"n → ∞:   U ≤ ln 2 = {math.log(2):.3f}")
```

Sok feladatnál a korlát **ln 2 ≈ 69,3%**-hoz tart. Ha a kihasználtság ez alatt van, RM-mel nyugodtan alhatunk; fölötte még működhet, de **külön ellenőrizni** kell.

### Az EDF – mindig a legsürgősebb

Az **EDF** (_Earliest Deadline First_) **dinamikus** prioritású: mindig az a feladat fut, amelyiknek a **legközelebb** van a határideje. Ez egy magon **optimális**: minden határidő teljesül, amíg **U ≤ 1**.

Szimuláljunk két feladatot: A (C = 2, T = 5) és B (C = 4, T = 7). A kihasználtság 2/5 + 4/7 ≈ **97%** – ez a két feladatra vonatkozó RM-korlát (82,8%) fölött van, de 100% alatt.

```python run
# Rate Monotonic és EDF ütemezés szimulációja 1 ms-os lépésekben
def utemez(feladatok, szabaly, hossz):
    maradek = {n: 0 for n, _, _ in feladatok}
    hatarido = {n: 0 for n, _, _ in feladatok}
    idovonal, lekesett = "", []
    for t in range(hossz):
        for nev, C, T in feladatok:
            if t % T == 0:                            # új példány indul
                if maradek[nev] > 0:
                    lekesett.append(f"{nev} a {t}. ms-nál")   # az előző nem végzett!
                maradek[nev], hatarido[nev] = C, t + T
        kesz = [f for f in feladatok if maradek[f[0]] > 0]
        if not kesz:
            idovonal += "."                           # tétlen CPU
            continue
        if szabaly == "RM":
            fut = min(kesz, key=lambda f: f[2])       # rövidebb periódus = nagyobb prioritás
        else:
            fut = min(kesz, key=lambda f: (hatarido[f[0]], f[2]))   # legközelebbi határidő
        maradek[fut[0]] -= 1
        idovonal += fut[0]
    return idovonal, lekesett

feladatok = [("A", 2, 5), ("B", 4, 7)]
U = sum(C / T for _, C, T in feladatok)
print(f"kihasználtság: {U:.1%}\n")
for szabaly in ["RM", "EDF"]:
    vonal, hiba = utemez(feladatok, szabaly, 35)
    print(f"{szabaly:>3}: {vonal}")
    print(f"     lekésett határidő: {hiba if hiba else 'nincs'}")
```

Olvasd le az idővonalat (minden karakter 1 ms): RM-nél az 5. ms-ban újra induló A **megszakítja** B-t, mert A periódusa rövidebb – és B a 7. ms-ra nem végez. EDF-nél az 5. ms-ban B határideje (7) közelebb van, mint A új határideje (10), ezért B fut tovább, és minden határidő teljesül.

Miért használják mégis gyakran az RM-et? Mert **egyszerű** és **kiszámítható**: túlterhelésnél is mindig a legalacsonyabb prioritású feladat késik (ezt előre tudjuk), míg EDF-nél túlterhelésnél bármelyik feladat lekésheti a határidejét, akár láncreakcióban is.

**Hasonlat:** RM az a diák, aki mindig a leggyakoribb tárgy (heti 3 óra) házijával kezd. EDF az, aki mindig a holnapra esedékessel. Ha jut elég idő, az EDF-es diák több mindent megold; ha nem, nála nehezebb megjósolni, mi marad el.

## 2. Beágyazott rendszer: meddig bírja az elem?

Egy vezeték nélküli hőmérő gombelemről működik (CR2032, kb. **220 mAh**). A mikrokontroller másodpercenként egyszer felébred, mér, elküldi az adatot, majd **mélyalvásba** megy. Az átlagos áramfelvétel az időarányokkal súlyozott átlag:

**I_átlag = (aktív idő arány) · I_aktív + (alvó idő arány) · I_alvó**

```python run
# Akkumulátor-élettartam: mennyit számít az alvás?
KAPACITAS_MAH = 220          # CR2032 gombelem

def elettartam(aktiv_ms_mp, i_aktiv_ma, i_alvo_ma):
    arany = aktiv_ms_mp / 1000                       # aktív idő aránya
    atlag = arany * i_aktiv_ma + (1 - arany) * i_alvo_ma
    orak = KAPACITAS_MAH / atlag
    return atlag, orak

esetek = [
    ("mindig ébren",                 1000, 5.0, 0.0),
    ("10 ms/mp aktív, könnyű alvás",   10, 5.0, 0.5),
    ("10 ms/mp aktív, mélyalvás",      10, 5.0, 0.002),
    ("2 ms/mp aktív, mélyalvás",        2, 5.0, 0.002),
]
for nev, aktiv, ia, ial in esetek:
    atlag, orak = elettartam(aktiv, ia, ial)
    print(f"{nev:<30} átlag {atlag * 1000:8.1f} µA → {orak:8.0f} óra ≈ {orak / 24:6.0f} nap")
```

Mindig ébren a gombelem **2 nap** alatt lemerül; jól megírt alvással **fél évnél** is tovább tart. Ezért a beágyazott OS-ek (FreeRTOS, Zephyr) egyik legfontosabb képessége a **tickless** mód: ha nincs dolog, nem ébresztik fel a processzort az időzítő minden ütemére, csak akkor, amikor a következő feladat esedékes. Ugyanez az elv dolgozik a laptopodban és a telefonodban is.

## 3. Mobil OS: kit állítsunk le, ha fogy a memória?

A telefonon nincs swap a megszokott módon (a flash-memória kopna, és lassú lenne), ezért ha fogy a RAM, az Android **leállít** háttéralkalmazásokat. A döntés alapja egy **fontossági pontszám** (Linuxon `oom_score_adj`, −1000 és +1000 között): minél nagyobb, annál előbb áldozzák fel.

| Kategória                     | Példa                          | Pontszám (kb.) |
| ----------------------------- | ------------------------------ | -------------- |
| előtérben lévő alkalmazás     | amit éppen használsz           | 0              |
| látható / érzékelhető         | zenelejátszó a háttérben       | 100–200        |
| szolgáltatás                  | szinkronizálás                 | 500 körül      |
| korábban használt (gyorsítótár) | a tegnap megnyitott játék    | 900–999        |

```python run
# Az Android "kevés memória" gyilkosának (lmkd) leegyszerűsített döntése
alkalmazasok = [
    # (név, memória MB, oom_score_adj)
    ("Térkép (előtérben)",     450,   0),
    ("Zenelejátszó",           120, 200),
    ("Felhőszinkron",           80, 500),
    ("Böngésző (10 perce)",    600, 900),
    ("Játék (tegnap)",         900, 950),
    ("Fotószerkesztő (múlt hét)", 300, 999),
]
szabad_mb = 200
kell_mb = 1000                       # a kamera alkalmazás ennyit kér

print(f"szabad: {szabad_mb} MB, kell: {kell_mb} MB")
for nev, mem, pont in sorted(alkalmazasok, key=lambda a: (-a[2], -a[1])):
    if szabad_mb >= kell_mb:
        break
    szabad_mb += mem
    print(f"  leállítva: {nev:<28} (pontszám {pont:>3}) +{mem} MB → szabad: {szabad_mb} MB")
print("a kamera elindulhat" if szabad_mb >= kell_mb else "nincs elég memória!")
```

A legrégebben használt alkalmazásokat áldozza fel először, az előtérben lévőhöz pedig a végsőkig nem nyúl. Ezért fontos, hogy egy mobilalkalmazás **mentse az állapotát**, amikor a háttérbe kerül: ha a rendszer leállítja, és később visszaváltasz rá, úgy kell folytatódnia, mintha mi sem történt volna. Linuxon ugyanezt csinálja a kernel **OOM killer**-e, ha elfogy a memória:

```bash
cat /proc/$$/oom_score_adj     # a shelled pontszám-módosítója (általában 0)
cat /proc/$$/oom_score         # a tényleges pontszám (memóriahasználattal együtt)
```

## Összefoglalás

- Valós idejű feladat: C (legrosszabb futásidő) és T (periódus); a kihasználtság U = Σ C/T, U > 1 esetén biztosan nem fér bele.
- **Rate Monotonic**: rövidebb periódus = nagyobb prioritás; biztosan működik, ha U ≤ n(2^(1/n) − 1), ami sok feladatnál **~69%**.
- **EDF**: mindig a legközelebbi határidejű fut; egy magon U ≤ 100%-ig minden határidőt tart, de túlterhelésnél kevésbé kiszámítható.
- Beágyazott rendszerben az átlagos áram dönti el az élettartamot: a **mélyalvás** és a **tickless** mód napokból hónapokat csinál.
- A mobil OS memóriahiánykor a **legkevésbé fontos** (legrégebben használt) alkalmazásokat állítja le – ezért kell az alkalmazásnak mentenie az állapotát.

## A lecke feladata

```quiz required
? Három periodikus feladat: (C=1, T=4), (C=2, T=8), (C=1, T=10). Hány százalék a kihasználtság?
= 60
= 60%
! 1/4 + 2/8 + 1/10 = 0,25 + 0,25 + 0,1 = 0,6.

? Két feladat kihasználtsága összesen 90%. A két feladatra érvényes Rate Monotonic korlát 82,8%. Mit mondhatunk?
- RM-mel biztosan minden határidő teljesül
+ RM-mel nem garantált, külön ellenőrizni kell – EDF-fel viszont egy magon biztosan működik
- semmilyen ütemezővel nem működhet
! EDF egy magon U ≤ 100%-ig optimális.

? Melyik ütemezés futtatja mindig azt a feladatot, amelyiknek a legközelebb van a határideje?
- Rate Monotonic
+ EDF
- Round Robin
- FCFS
! Earliest Deadline First.

? Egy szenzor 1%-ban aktív (4 mA), 99%-ban alszik (0,01 mA). Mekkora az átlagos áramfelvétel mA-ben? (négy tizedesre)
= 0.0499
= 0,0499
! 0,01 · 4 + 0,99 · 0,01 = 0,04 + 0,0099 = 0,0499 mA.

? Fogy a memória egy Androidos telefonon. Melyik alkalmazást állítja le a rendszer legelőször?
- az előtérben lévő térképet
- a háttérben szóló zenelejátszót
+ a múlt héten megnyitott, azóta nem használt fotószerkesztőt
! A legnagyobb oom_score_adj értékű (legkevésbé fontos) megy először.
```
