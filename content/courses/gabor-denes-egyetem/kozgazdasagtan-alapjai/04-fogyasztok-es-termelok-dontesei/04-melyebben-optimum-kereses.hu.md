---
title: Mélyebben – optimumkeresés a fogyasztótól a duopóliumig
summary: A fogyasztói optimum kiszámolása az összes kosár végigpróbálásával, egy pékség költségtáblája (miért metszi a határköltség az átlagköltséget a minimumában), a monopólium és a verseny összevetése csúszkás ábrával, és egy duopólium, ahol a két cég reakciói egyensúlyba futnak.
minutes: 40
---

## Amit ebben a leckében megtanulsz

- hogyan találja meg a **legjobb kosarat** egy fogyasztó (és egy program),
- hogyan olvass ki egy **költségtáblából** minimumot, határköltséget, üzemszüneti pontot,
- mennyit **veszít** a társadalom egy monopóliumon,
- hogyan jut **egyensúlyba** két, egymásra reagáló cég.

## 1. A fogyasztói optimum géppel

Havi 12 000 Ft-od van szórakozásra: egy mozijegy 3000 Ft, egy hónap streaming 2000 Ft. Mindkettőből minden újabb egység kevesebb örömet ad. A program az **összes** megengedett kosarat végigpróbálja:

```python run
# Fogyasztói optimum: havi 12 000 Ft szórakozásra – mozijegy (3000 Ft) vagy streaming-hónap (2000 Ft)?
# Csökkenő határhaszon: minden újabb egység kevesebb örömöt hoz (hasznossági pontokban)
mozi = [0, 60, 100, 125, 135, 140]       # összes haszon 0…5 mozi után
stream = [0, 50, 85, 105, 115, 120, 122]  # összes haszon 0…6 streaming-hónap után (pl. különböző szolgáltatók)
keret, p_mozi, p_stream = 12000, 3000, 2000

legjobb = max(((mozi[m] + stream[s], m, s)
               for m in range(len(mozi)) for s in range(len(stream))
               if m * p_mozi + s * p_stream <= keret))
print(f"legjobb kosár: {legjobb[1]} mozi + {legjobb[2]} streaming, összes haszon {legjobb[0]}")

m, s = legjobb[1], legjobb[2]
print(f"utolsó mozi határhaszna / ára: {(mozi[m] - mozi[m - 1]) / p_mozi * 1000:.1f} pont / 1000 Ft")
print(f"utolsó streaming határhaszna / ára: {(stream[s] - stream[s - 1]) / p_stream * 1000:.1f} pont / 1000 Ft")
```

A legjobb választás 2 mozi és 3 hónap streaming. Az elmélet szerint az optimumban az **egy forintra jutó határhaszon** egyenlő: $\frac{MU_1}{P_1} = \frac{MU_2}{P_2}$ – ha az egyik nagyobb lenne, érdemes lenne átcsoportosítani. Itt a két arány nem pontosan egyezik (13,3 és 10), mert csak egész darabokat vehetünk: egy harmadik moziért másfél hónap streamingről kellene lemondani. A valóságban is így döntünk: nagyjából kiegyenlítjük, „mire éri meg” költeni a következő ezresünket.

## 2. A költségtábla titkai

Egy pékség fix költsége napi 20 000 Ft (bérleti díj, gépek), a változó költség a kenyerek számával nő:

```python run
# Költséggörbék: egy kis pékség napi költségei (Ft), a fix költség 20 000 Ft
fix = 20_000
valtozo = {100: 15_000, 200: 25_000, 300: 33_000, 400: 44_000, 500: 60_000, 600: 84_000}  # kenyér/nap

elozo = fix                                       # Q = 0-nál csak a fix költség van
print(f"{'Q':>4} | {'TC':>7} | {'ATC':>6} | {'AVC':>6} | {'MC (Ft/db)':>10}")
for q, vc in valtozo.items():
    tc = fix + vc
    mc = (tc - elozo) / 100                       # határköltség: a plusz 100 db költsége darabonként
    print(f"{q:>4} | {tc:>7,} | {tc / q:6.1f} | {vc / q:6.1f} | {mc:10.1f}")
    elozo = tc
```

Mit láthatunk benne?

- A **határköltség (MC)** előbb csökken (a munkamegosztás miatt egyre hatékonyabbak), aztán nő (a sütő és a hely korlátos: **csökkenő hozadék**).
- Az MC **alulról metszi** az átlagos változó költséget (AVC) és az átlagköltséget (ATC) is – mindkettőt a **minimumában**. Logikus: ha a következő kenyér olcsóbb az átlagnál, lehúzza az átlagot; ha drágább, felhúzza. Az ATC minimuma itt 400–500 kenyér körül van (160 Ft/db), ahol $MC = ATC$.
- **Üzemszüneti pont:** rövid távon akkor is megéri sütni, ha az ár az ATC alatt, de az AVC (min. 110 Ft) fölött van – a fix költséget úgyis ki kell fizetni, és így legalább egy részét fedezzük. 110 Ft alatt viszont jobb bezárni.

## 3. Monopólium kontra verseny

Kereslet: $P = 100 - Q$, határköltség: $MC = 20$. A versenypiacon az ár a határköltségig esik; a monopolista viszont ott termel, ahol a **határbevétel** egyenlő a határköltséggel ($MR = 100 - 2Q = 20$):

```python run
# Monopólium vagy verseny? Kereslet: P = 100 − Q, határköltség állandó: MC = 20
def profit_monopolium():
    legjobb = max(range(0, 101), key=lambda q: (100 - q) * q - 20 * q)   # profit = TR − TC
    return legjobb, 100 - legjobb

q_m, p_m = profit_monopolium()
q_v, p_v = 80, 20                                  # versenyben P = MC → Q = 80
print(f"monopólium: Q = {q_m}, P = {p_m}, profit = {(p_m - 20) * q_m}")
print(f"verseny:    Q = {q_v}, P = {p_v}, profit = 0")
fogy_tobblet_m = 0.5 * q_m * (100 - p_m)
fogy_tobblet_v = 0.5 * q_v * (100 - p_v)
print(f"fogyasztói többlet: monopólium {fogy_tobblet_m:.0f}, verseny {fogy_tobblet_v:.0f}")
print(f"holtteher-veszteség a monopólium miatt: {0.5 * (q_v - q_m) * (p_m - 20):.0f}")
```

A monopolista **feleannyit** ad el, háromszoros áron, és 1600 profitot ér el. A fogyasztói többlet 3200-ról 800-ra esik: ebből 1600 átvándorol a monopolistához, 800 viszont **senkinek** sem jut (holtteher-veszteség) – ezek azok a vevők, akik a költségnél többet fizetnének, de a monopolár mellett már nem vásárolnak.

```plot
title: A monopolista ott termel, ahol MR = MC
x: 0, 100
y: 0, 100
param: c = 20, 0, 80, 5
f: 100 - x # kereslet
f: 100 - 2*x # határbevétel (MR)
dash: c # határköltség (MC)
point: (100 - c)/2, (100 + c)/2 # monopólium
point: 100 - c, c # verseny
```

A csúszkával a határköltséget változtathatod: a monopolár mindig a kereslet és az MC „félútján” van ($\frac{100 + c}{2}$), így a költségcsökkenésnek csak a **felét** adja tovább a vevőknek.

## 4. Duopólium: amikor két cég figyeli egymást

Két cég ugyanazon a piacon ($P = 100 - Q_1 - Q_2$, $MC = 20$). Mindegyik a **másik mennyiségéhez** igazítja a sajátját (legjobb válasz: $q = \frac{80 - q_{\text{másik}}}{2}$), és felváltva reagálnak:

```python run
# Duopólium (Cournot): két cég felváltva a másik mennyiségére adja meg a legjobb válaszát
# Kereslet: P = 100 − (q1 + q2), MC = 20 mindkettőnél. Legjobb válasz: q = (80 − másik) / 2
q1, q2 = 80.0, 0.0                       # kezdetben az 1. cég monopolista
for kor in range(1, 9):
    q2 = (80 - q1) / 2                   # a 2. cég reagál
    q1 = (80 - q2) / 2                   # az 1. cég reagál
    if kor in (1, 2, 3, 8):
        p = 100 - q1 - q2
        print(f"{kor}. kör: q1 = {q1:5.2f}, q2 = {q2:5.2f}, piaci ár = {p:5.2f}")
print("egyensúly: q1 = q2 = 80/3 ≈ 26,67, ár ≈ 46,67 (monopólium: 60, verseny: 20)")
```

A reakciók **egyensúlyba futnak** (Cournot–Nash-egyensúly): fejenként 26,67 egység, az ár 46,67 – a monopólium (60) és a verseny (20) között. Minél több cég van, annál közelebb kerül az ár a határköltséghez. Ebből jön a versenyhatóságok (Magyarországon a GVH, az EU-ban az Európai Bizottság) egyik alapelve: a cégek összeolvadása, amely a szereplők számát csökkenti, áremeléshez vezethet, ezért engedélyköteles.

**Hasonlat:** olyan, mint két étterem ugyanabban az utcában – mindegyik azt figyeli, mennyi vendéget visz el a másik, és ahhoz igazítja a kínálatát.

## Összefoglalás

- Fogyasztói optimum: az egy forintra jutó határhasznok kiegyenlítése a költségvetési korláton belül.
- Az MC az ATC-t és az AVC-t a minimumukban metszi; rövid távon az AVC minimuma az üzemszüneti pont.
- Monopólium: $MR = MC$, kisebb mennyiség, magasabb ár, holtteher-veszteség.
- Duopólium: a kölcsönös legjobb válaszok egyensúlya; az ár a monopólium és a verseny között van.

## A lecke feladata

```quiz required
? Egy fogyasztónál a kávé határhaszna 1000 Ft-onként 8 pont, a süteményé 1000 Ft-onként 12 pont. Mit érdemes tennie?
- több kávét és kevesebb süteményt venni
+ több süteményt és kevesebb kávét venni
- semmin sem változtatni
- mindkettőből kevesebbet venni
! Az egy forintra jutó határhaszon a süteménynél nagyobb, ezért arra érdemes átcsoportosítani.

? Egy cég összköltsége 250 darabnál 50 000 Ft. Mennyi az átlagköltség (Ft/db)?
= 200
! $50\,000 / 250 = 200$.

? Monopólium: a kereslet $P = 120 - Q$, a határköltség 20. Mennyit termel a monopolista? ($MR = 120 - 2Q$)
= 50
! $120 - 2Q = 20 \Rightarrow Q = 50$ (az ár $70$).

? Rövid távon mikor érdemes egy cégnek veszteség mellett is tovább termelnie?
- soha
+ ha az ár az átlagos változó költség fölött van
- ha az ár az átlagos fix költség fölött van
- ha a határköltség nulla
! Így a változó költségen felül a fix költség egy részét is fedezi.

? Két cég Cournot-duopóliumban: $P = 100 - Q$, $MC = 10$ mindkettőnél; egyensúlyban mindkettő 30 egységet termel. Mennyi a piaci ár?
= 40
! $100 - 30 - 30 = 40$.
```
