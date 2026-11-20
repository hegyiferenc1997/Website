---
title: Mélyebben – a munkaerőpiac számokkal
summary: A minimálbér hatása egy egyszerű munkapiaci modellben csúszkával, az Okun-törvény forintban, egy diploma megtérülése nettó jelenértékkel, és a munkanélküliség „fürdőkád-modellje”, amelyből kiderül, miért a munkakeresés sebessége a kulcs.
minutes: 40
---

## Amit ebben a leckében megtanulsz

- mikor okoz munkanélküliséget a **minimálbér**, és mikor nem – és miért vitatott ez a kérdés,
- mennyibe **kerül** a gazdaságnak egy százalékpontnyi többlet-munkanélküliség,
- hogyan számold ki, **megéri-e** egy diploma (és mitől függ a válasz),
- miért alakul ki tartósan egy adott **munkanélküliségi szint**.

## 1. A minimálbér egy egyszerű modellben

Egy munkapiacon a cégek kereslete $L_D = 1000 - 2w$, a munkavállalók kínálata $L_S = 3w - 500$ (bér ezer Ft/hó, létszám ezer fő):

```python run
# Minimálbér egy egyszerű munkapiacon: L_D = 1000 − 2w, L_S = 3w − 500 (w: ezer Ft/hó, L: ezer fő)
def kereslet(w):
    return 1000 - 2 * w          # ennyi embert akarnak felvenni a cégek

def kinalat(w):
    return 3 * w - 500           # ennyien akarnak dolgozni ezen a béren

w_e = 1500 / 5                   # 1000 − 2w = 3w − 500
print(f"egyensúly: bér {w_e:.0f} e Ft, foglalkoztatás {kereslet(w_e):.0f} ezer fő")
for minimalber in [280, 320, 350]:
    w = max(minimalber, w_e)                     # az egyensúly alatti minimálbér nem köt: a piaci bér érvényes
    fogl = min(kereslet(w), kinalat(w))          # a rövidebb oldal dönt
    tobblet = kinalat(w) - fogl
    print(f"minimálbér {minimalber}: bér {w:.0f}, foglalkoztatás {fogl:.0f}, állást kereső, de nem találó {tobblet:.0f} ezer fő")
```

- Az egyensúlyi bér **alatti** minimálbér (280) nem köt: a piac úgyis többet fizet.
- Az egyensúly **feletti** minimálbér mellett többen akarnak dolgozni (a magasabb bér vonzza őket), a cégek viszont kevesebb embert vesznek fel – a különbség munkanélküliség.

```plot
title: Munkapiac minimálbérrel (bér: ezer Ft/hó, létszám: ezer fő)
x: 0, 800
y: 0, 500
param: m = 320, 200, 450, 10
f: 500 - x/2 # munkaerő-kereslet
f: (x + 500)/3 # munkaerő-kínálat
dash: m # minimálbér
point: 1000 - 2*m, m # foglalkoztatás
point: 3*m - 500, m # akik dolgoznának
```

**Miért vitatott mégis?** Az empirikus kutatások (pl. David Card és Alan Krueger vizsgálatai; Card ezért is kapott 2021-ben Nobel-díjat) azt találták, hogy mérsékelt minimálbér-emelés gyakran **alig** csökkenti a foglalkoztatást. Lehetséges okok: ha egy városban kevés a munkáltató (monopszónia), a bér az egyensúlyinál alacsonyabb lehet, és a minimálbér ezt korrigálja; a jobban fizetett dolgozók ritkábban mondanak fel; és a cégek az árakon vagy a profiton keresztül is alkalmazkodhatnak. A modell az irányt mutatja, a mértékét az adatok döntik el.

## 2. Az Okun-törvény forintban

Arthur Okun megfigyelése: ha a munkanélküliség 1 százalékponttal a természetes ráta fölé emelkedik, a kibocsátás kb. 2%-kal marad el a lehetségestől. Egy 80 000 milliárd forintos gazdaságban:

```python run
# Okun-törvény: a természetes ráta feletti minden 1 százalékpont munkanélküliség kb. 2% kibocsátás-kiesés
termeszetes, okun = 4.0, 2.0
potencialis_gdp = 80_000                         # milliárd Ft
for rata in [4.0, 5.0, 6.5, 8.0]:
    res = -okun * (rata - termeszetes) + 0.0           # kibocsátási rés, %
    kieses = max(0, -res) / 100 * potencialis_gdp
    print(f"munkanélküliség {rata}%: kibocsátási rés {res:+.1f}% → kb. {kieses:,.0f} mrd Ft elmaradt termelés")
```

A munkanélküliség tehát nemcsak az érintettek tragédiája, hanem **az egész gazdaság vesztesége**: ezermilliárdos nagyságrendű elmaradt termelés. Ezért tartják a recessziók elleni küzdelmet a gazdaságpolitika egyik fő feladatának.

## 3. Megéri-e a diploma?

A humántőke-befektetés olyan, mint bármely beruházás: ma áldozunk (4 év kieső kereset), később hozama van (magasabb fizetés). Hogy megéri-e, azt a **nettó jelenérték** mutatja meg: a jövőbeli többletkeresetet **diszkontáljuk** mára, mert a későbbi pénz ma kevesebbet ér:

```python run
# Megéri-e diplomát szerezni? Humántőke-befektetés nettó jelenértéke (NPV)
# Egyszerűsített pálya: érettségivel 18 évesen 350 e Ft/hó; diplomával 4 év tanulás után 600 e Ft/hó
# (havi bérek, 12 hónappal, mindkettő évi 2% reálnövekedéssel, 18-tól 65 éves korig)
def npv(diskont):
    ertek = 0.0
    for ev in range(47):                         # 18 … 64 éves kor
        erettsegi = 350_000 * 12 * 1.02 ** ev
        diploma = 0 if ev < 4 else 600_000 * 12 * 1.02 ** (ev - 4)
        ertek += (diploma - erettsegi) / (1 + diskont) ** ev   # a jövőbeli különbséget mára diszkontáljuk
    return ertek

for d in [0.03, 0.06, 0.10, 0.15]:
    print(f"diszkontráta {d:.0%}: a diploma nettó jelenértéke {npv(d) / 1e6:6.1f} millió Ft")
```

Normál diszkontrátánál a diploma bőven megtérül (tízmilliós nagyságrendben). Csak nagyon magas diszkontráta mellett (aki a jelent nagyon előnyben részesíti, vagy hitelből, drágán finanszírozza a tanulást) válik nullává. A számítás persze egyszerűsít: nem számol a tandíjjal, az ösztöndíjjal, a munka mellett tanulással, és azzal sem, hogy a diploma a munkanélküliség kockázatát is csökkenti – és a nem pénzbeli előnyöket (érdekesebb munka, egészség) sem méri.

## 4. A munkanélküliség fürdőkádja

Minden hónapban a dolgozók egy része ($s$) elveszíti az állását, és a munkanélküliek egy része ($f$) talál újat. Ha a kettő kiegyenlítődik, a munkanélküliség állandó: $u = \frac{s}{s + f}$.

```python run
# A munkanélküliség "fürdőkádja": havonta s arányban veszítik el, f arányban találnak állást
# Hosszú távon u = s / (s + f) – a be- és kiáramlás kiegyenlíti egymást
s = 0.01                                          # a dolgozók 1%-a veszíti el az állását havonta
for f in [0.10, 0.20, 0.30, 0.45]:
    u = 0.10                                      # induló munkanélküliség: 10%
    for _ in range(60):                           # 5 év havonta
        u = u + s * (1 - u) - f * u               # beáramlás − kiáramlás
    print(f"álláskeresési esély havonta {f:.0%}: tartós munkanélküliség {u:.1%} (képlettel {s / (s + f):.1%})")
```

Bárhonnan indulunk (itt 10%-ról), a ráta ehhez az egyensúlyi szinthez fut. A legerősebb hatása a **munkakeresés sebességének** van: ha a munkanélküliek havonta 10% helyett 30%-os eséllyel találnak állást, a ráta 9%-ról 3%-ra esik. Ezért segítenek a hatékony állásközvetítő oldalak, az átképzések és a jó munkaerő-piaci információ – ezek mind az $f$-et növelik. Az informatikai szektorban jellemzően magas az $f$, ezért alacsony a munkanélküliség.

## Összefoglalás

- Az egyensúly feletti minimálbér a modell szerint munkanélküliséget okoz; az empirikus hatás mérsékelt emelésnél gyakran kicsi.
- Okun-törvény: 1 százalékpont többlet-munkanélküliség ≈ 2% kibocsátás-kiesés.
- A diploma megtérülését nettó jelenértékkel mérjük; a válasz a diszkontrátától függ.
- Tartós munkanélküliség: $u = \frac{s}{s + f}$; a munkakeresés gyorsítása a leghatékonyabb eszköz.

## A lecke feladata

```quiz required
? A fenti modellben ($L_D = 1000 - 2w$, $L_S = 3w - 500$) a minimálbér 340. Hány ezer fő keres munkát, de nem talál?
= 200
! $L_S = 520$, $L_D = 320$, a különbség $200$.

? A természetes ráta 5%, a tényleges munkanélküliség 7%, az Okun-együttható 2. Hány százalék a kibocsátási rés?
= -4
= −4
! $-2 \cdot (7 - 5) = -4\%$.

? Havonta a dolgozók 2%-a veszíti el az állását, a munkanélküliek 18%-a talál újat. Hány százalék a tartós munkanélküliség?
= 10
! $\frac{0{,}02}{0{,}02 + 0{,}18} = 10\%$.

? Melyik a súrlódásos munkanélküliség példája?
+ egy programozó felmond, és két hónapig keresi a neki legjobban tetsző állást
- a nyomdai szedők munkáját kiváltja a számítógép
- recesszió miatt elbocsátanak egy gyár dolgozóit
- egy síoktató nyáron nem dolgozik
! A súrlódásos munkanélküliség az állások közötti keresés ideje.

? Hogyan változik egy diploma nettó jelenértéke, ha nő a diszkontráta?
- nő
+ csökken
- nem változik
- először nő, aztán csökken
! A későbbi többletkereset mai értéke kisebb lesz.
```
