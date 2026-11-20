---
title: Mélyebben – piacok szimulációval
summary: Hogyan találja meg a piac az egyensúlyt lépésről lépésre, az árrugalmasság és az árbevétel kapcsolata egy koncertjegy példáján, ki fizeti valójában az adót, mekkora a holtteher-veszteség, és miért a rugalmasság dönti el az adóteher megoszlását – csúszkás ábrával.
minutes: 40
---

## Amit ebben a leckében megtanulsz

- hogyan **jut el** a piac az egyensúlyba anélkül, hogy bárki kiszámolná,
- melyik áron **legnagyobb** az árbevétel, és mi köze ehhez a rugalmasságnak,
- hogy egy adót **nem az fizeti**, akire kivetik, hanem a rugalmasságok szerint oszlik meg,
- mi a **holtteher-veszteség**, és miért van minden adónak „rejtett” költsége.

## 1. A láthatatlan kéz lépésről lépésre

Senki sem ismeri a teljes keresleti és kínálati görbét – mégis kialakul az egyensúlyi ár. Egy egyszerű modell: ha túl sok az áru (többlet), az eladók lejjebb viszik az árat; ha kevés (hiány), feljebb. Az ár változása arányos a túlkereslettel:

```python run
# Hogyan "találja meg" a piac az egyensúlyt? Az ár a túlkereslettel arányosan mozdul (tâtonnement)
def kereslet(p):
    return 120 - 2 * p          # Q_D: ezer db

def kinalat(p):
    return 3 * p - 30           # Q_S: ezer db

p = 50.0                        # túl magas kezdőár
for kor in range(8):
    tulkereslet = kereslet(p) - kinalat(p)
    print(f"{kor}. kör: P = {p:6.2f} Ft | Q_D = {kereslet(p):6.1f} | Q_S = {kinalat(p):6.1f} | túlkereslet {tulkereslet:7.2f}")
    p += 0.1 * tulkereslet       # többlet → csökken az ár, hiány → nő
```

Az ár 50 Ft-ról indulva lépésről lépésre közelít a 30 Ft-os egyensúlyhoz (ahol $120 - 2P = 3P - 30$). Minden körben feleződik a távolság. Ez a **decentralizált** koordináció lényege: az ár **információt** hordoz (szűkös-e valami), és **ösztönöz** (többet termelni vagy kevesebbet venni).

**Mérnöki szemmel:** ez egy visszacsatolt szabályozókör, mint a termosztát. Ha a reakció túl erős (a 0,1-es szorzó helyett pl. 0,5), az ár túllő és oszcillál – ilyet a valóságban is látni a sertés- vagy a memóriachip-piacon (lásd „sertésciklus”).

## 2. Rugalmasság és árbevétel

Egy koncertszervező a jegyárat keresi. Ha drágább, kevesebb jegy fogy – de mi a jobb a bevételnek?

```python run
# Rugalmasság és árbevétel: egy koncert jegyára (Q = 1200 − 4P, ahol P száz Ft-ban, Q darab)
print(f"{'jegyár (Ft)':>11} | {'eladott jegy':>12} | {'bevétel (Ft)':>12} | árrugalmasság")
for p in [50, 100, 150, 200, 250]:
    q = 1200 - 4 * p
    rugalmassag = -4 * p / q                     # (dQ/dP) · P/Q
    jelleg = "rugalmas" if abs(rugalmassag) > 1 else "egységnyi" if abs(rugalmassag) == 1 else "rugalmatlan"
    print(f"{p * 100:>11,} | {q:>12} | {p * 100 * q:>12,} | {rugalmassag:6.2f} ({jelleg})")
```

- **Rugalmatlan** szakaszon ($|E| < 1$) az áremelés **növeli** a bevételt: a vevők alig reagálnak.
- **Rugalmas** szakaszon ($|E| > 1$) az áremelés **csökkenti** a bevételt: sokan lemorzsolódnak.
- A bevétel ott a **legnagyobb**, ahol a rugalmasság pontosan $-1$ (itt 15 000 Ft).

Ezért emelik szívesen az árat a rugalmatlan keresletű termékeknél (gyógyszer, üzemanyag, egyedi szoftverlicenc), és ezért versenyeznek árban ott, ahol sok a helyettesítő (streamingszolgáltatások, éttermek). Vigyázat: a bevétel maximuma nem a **profit** maximuma – ahhoz a költségeket is nézni kell (4. témakör).

## 3. Ki fizeti az adót?

Az állam darabonként 10 Ft adót vet ki az **eladókra**. Nézzük, hogyan változik az ár és a mennyiség:

```python run
# Ki fizeti az adót? Darabonkénti t Ft adó az eladókon (Q_D = 120 − 2P, Q_S = 3(P − t) − 30)
t = 10
p_vevo = (150 + 3 * t) / 5                 # 120 − 2P = 3P − 3t − 30 → P = (150 + 3t)/5
p_elado = p_vevo - t                       # az eladónál ennyi marad
q = 120 - 2 * p_vevo
print(f"adó előtt: P = 30, Q = 60")
print(f"adó után: a vevő {p_vevo:.0f} Ft-ot fizet (+{p_vevo - 30:.0f}), az eladónak {p_elado:.0f} Ft marad (−{30 - p_elado:.0f}), Q = {q:.0f}")
print(f"adóbevétel: {t * q:.0f} | holtteher-veszteség: {0.5 * t * (60 - q):.0f} (ezer Ft, ha Q ezer darab)")
```

Bár az adót az eladók fizetik be, a 10 Ft-ból **6 Ft-ot a vevők** viselnek (magasabb ár), és csak 4 Ft-ot az eladók (kevesebb marad nekik). Ha a vevőkre vetnék ki, az eredmény **ugyanez** lenne – a teher megoszlása nem a jogszabálytól függ, hanem a görbék meredekségétől.

A **holtteher-veszteség** az az érték, ami **senkinél** nem jelenik meg: 12 ezer darab üzlet egyszerűen elmarad, pedig a vevők többre értékelték volna, mint amennyibe az előállításuk került. Ez az adó „rejtett” társadalmi költsége az adóbevételen felül.

```plot
title: Az adó éket ver a vevő és az eladó ára közé
x: 0, 120
y: 0, 70
param: t = 10, 0, 30, 1
f: 60 - x/2 # kereslet
f: 10 + x/3 # kínálat
dash: 10 + x/3 + t # kínálat + adó
point: 60 - 1.2*t, 30 + 0.6*t # vevő ára
point: 60 - 1.2*t, 30 - 0.4*t # eladó ára
```

Húzd a csúszkát: minél nagyobb az adó, annál kisebb a forgalom, és a holtteher-veszteség (a két pont közötti „háromszög”) az adó **négyzetével** nő – kétszeres adó négyszeres veszteség.

## 4. A rugalmasság dönti el, ki viseli a terhet

```python run
# Az adóteher megoszlása a rugalmasságokon múlik: vevő része ≈ |kínálat meredeksége| / (összeg)
# lineáris görbék: Q_D = a − b·P, Q_S = c + d·P; t adó esetén a vevő ára d·t/(b + d)-vel nő
esetek = [("cigaretta (rugalmatlan kereslet)", 0.5, 3),
          ("átlagos termék", 2, 3),
          ("étterem (rugalmas kereslet)", 8, 3)]
for nev, b, d in esetek:
    vevo_resz = d / (b + d)
    print(f"{nev:<34}: a vevő viseli {vevo_resz:.0%}-át, az eladó {1 - vevo_resz:.0%}-át")
```

A teher nagyobb részét mindig az a fél viseli, amelyik **kevésbé tud kitérni** (rugalmatlanabb). A dohányosok nem tudnak könnyen leszokni, ezért a jövedéki adót nagyrészt ők fizetik; egy étterem vendégei viszont könnyen otthon esznek, így ott az eladó nyeli le az adó nagyobb részét. Ugyanez a logika érvényes a béreket terhelő adókra (munkáltató vagy munkavállaló?) és a platformok díjaira is (az alkalmazásbolt 30%-os jutaléka a fejlesztőt vagy a vevőt terheli?).

## Összefoglalás

- Az ár a túlkereslet hatására mozdul el, és visszacsatolásként vezeti a piacot az egyensúlyba.
- Rugalmatlan keresletnél az áremelés növeli, rugalmasnál csökkenti a bevételt; maximum $|E| = 1$-nél.
- Az adó terhe a rugalmasságok szerint oszlik meg, függetlenül attól, kire vetik ki; a rugalmatlanabb fél visel többet.
- Holtteher-veszteség: az adó miatt elmaradt, értékes ügyletek; nagyjából az adó négyzetével nő.

## A lecke feladata

```quiz required
? $Q_D = 100 - P$ és $Q_S = 2P - 20$. Mennyi az egyensúlyi ár?
= 40
! $100 - P = 2P - 20 \Rightarrow 3P = 120$.

? A kereslet $Q = 600 - 2P$. Melyik áron maximális az árbevétel?
= 150
! A bevétel $P(600 - 2P)$, ennek maximuma $P = 150$-nél van (itt $|E| = 1$).

? Egy termék árrugalmassága $-1{,}5$. Hány százalékkal változik a keresett mennyiség, ha az ár 10%-kal nő?
= -15
= −15
! $-1{,}5 \cdot 10\% = -15\%$.

? Egy termék kereslete nagyon rugalmatlan, a kínálata rugalmas. Ki viseli egy új adó nagyobb részét?
+ a vevők
- az eladók
- egyenlő arányban oszlik meg
- az állam
! A kevésbé rugalmas fél visel többet.

? Egy 4 Ft-os adó miatt a forgalom 50 ezer darabról 40 ezerre esik. Mekkora a holtteher-veszteség (ezer Ft)?
= 20
! $\frac12 \cdot 4 \cdot (50 - 40) = 20$.
```
