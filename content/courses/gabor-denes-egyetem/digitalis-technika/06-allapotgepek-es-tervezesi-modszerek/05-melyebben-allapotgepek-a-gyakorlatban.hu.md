---
title: Mélyebben – állapotgépek a gyakorlatban
summary: Egy italautomata Moore-gépként, táblázatból futtatva; állapotminimalizálás programmal (partíciófinomítás) és az elérhetetlen állapotok; a bináris, a Gray és a one-hot kódolás összevetése flip-flopszám és bitváltások szerint; nyomógomb prellmentesítése állapotgéppel.
minutes: 40
---

## Amit ebben a leckében megtanulsz

- egy hétköznapi gépet (italautomata) **állapotgépként** felírni és táblázatból futtatni,
- hogyan **minimalizál** egy program állapotokat lépésenkénti csoportfinomítással, és mi az **elérhetetlen** állapot,
- **számokkal** összevetni a bináris, a Gray és a one-hot állapotkódolást,
- hogyan szűri ki egy kis állapotgép a nyomógomb **pattogását** (prell).

## 1. Egy italautomata Moore-gépként

Egy ital 150 Ft, az automata 50 és 100 Ft-os érmét fogad el. Az **állapot** az eddig bedobott összeg, a **kimenet** (ital, visszajáró) csak az állapottól függ – ez tehát **Moore-gép**. A teljes viselkedés egyetlen táblázat:

```python run
# Italautomata Moore-gépként: 150 Ft-os ital, 50 és 100 Ft-os érmék
# Állapot = eddig bedobott összeg; a kimenet csak az állapottól függ (Moore).
ATMENET = {                      # (állapot, érme) → következő állapot
    (0, 50): 50,     (0, 100): 100,
    (50, 50): 100,   (50, 100): 150,
    (100, 50): 150,  (100, 100): 200,
    (150, 50): 50,   (150, 100): 100,       # kiadás után az új érme új vásárlást kezd
    (200, 50): 50,   (200, 100): 100,
}
KIMENET = {0: "-", 50: "-", 100: "-", 150: "ITAL", 200: "ITAL + 50 Ft vissza"}

def futtat(ermek):
    allapot = 0
    for erme in ermek:
        allapot = ATMENET[(allapot, erme)]
        print(f"  bedob {erme:>3} Ft → állapot {allapot:>3}: {KIMENET[allapot]}")

print("1. vásárló: 50 + 50 + 50"); futtat([50, 50, 50])
print("2. vásárló: 100 + 100");    futtat([100, 100])
```

Figyeld meg a tervezés lépéseit, amelyek minden állapotgépnél ugyanazok:

1. **Állapotok**: mit kell „megjegyezni”? Itt az eddigi összeget: 0, 50, 100, 150, 200 → 5 állapot.
2. **Átmenetek**: minden állapotra és minden bemenetre meg kell mondani, hová lép – a táblázat **teljes** legyen, különben a gép „elakadhat”.
3. **Kimenetek**: Moore-gépnél állapotonként egy kimenet.

Ugyanez a táblázat hardverben egy állapotregiszter (3 flip-flop az 5 állapothoz) és egy kombinációs hálózat; szoftverben (mikrokontrolleren) pont így, szótárral vagy `switch` utasítással írják. **Az állapotgép a tervezés nyelve, nem csak a hardveré.**

## 2. Állapotminimalizálás programmal

Két állapot **ekvivalens**, ha ugyanazt adják ki, és minden bemenetre ekvivalens állapotba lépnek. Ezt a gép **lépésenként** dönti el:

1. először csak a **kimenet** szerint csoportosít,
2. aztán szétválasztja azokat, amelyek egy bemenetre **más csoportba** lépnek,
3. ezt ismétli, amíg a csoportok már nem finomodnak.

```python run
# Állapotminimalizálás partíciófinomítással: azonos kimenet + azonos csoportba lépés = ekvivalens
# Egy Moore-gép: állapot → (kimenet, {bemenet: következő állapot})
gep = {
    "A": (0, {0: "B", 1: "C"}),
    "B": (0, {0: "D", 1: "E"}),
    "C": (0, {0: "D", 1: "E"}),     # B és C ugyanúgy viselkedik...
    "D": (1, {0: "A", 1: "A"}),
    "E": (1, {0: "A", 1: "A"}),     # ...és D meg E is
    "F": (0, {0: "D", 1: "A"}),
}

def minimalizal(gep):
    # 0. lépés: csoportosítás csak a kimenet szerint
    csoport = {s: gep[s][0] for s in gep}
    while True:
        # az állapot "aláírása": a saját csoportja + a következő állapotok csoportja
        alairas = {s: (csoport[s],) + tuple(csoport[gep[s][1][b]] for b in (0, 1)) for s in gep}
        sorszam = {a: i for i, a in enumerate(sorted(set(alairas.values())))}
        uj = {s: sorszam[alairas[s]] for s in gep}
        if len(set(uj.values())) == len(set(csoport.values())):
            return uj                                # nem finomodott tovább: kész
        csoport = uj

eredmeny = minimalizal(gep)
osztalyok = {}
for s, c in sorted(eredmeny.items()):
    osztalyok.setdefault(c, []).append(s)
print("ekvivalens csoportok:", [ "".join(v) for v in osztalyok.values()])
print(f"{len(gep)} állapotból {len(osztalyok)} maradt")
```

B és C ugyanúgy viselkedik (mindkettő 0-t ad, 0-ra D-be, 1-re E-be lép), és D meg E is – így 6 állapotból **4** marad. Ez egy flip-floppal kevesebb lehet (6 állapothoz 3 flip-flop kell, de 4-hez már 2 is elég)!

Van még egy csapda: az **F** állapotba **sehonnan nem lehet eljutni** az A kezdőállapotból (nézd meg: senki nem lép F-be). Az ilyen **elérhetetlen** állapot egyszerűen törölhető – így végül **3** állapot marad. A szöveges feladatból felírt gráfoknál mindkét hiba (ekvivalens és elérhetetlen állapot) gyakori, ezért a tervezés egyik lépése mindig a gráf „kitakarítása”.

## 3. Bináris, Gray vagy one-hot?

Egy 8 állapotú, körbejáró gépen (pl. egy léptetőmotor lépéssorrendje) számoljuk meg, hány flip-flop kell, és egy teljes kör alatt hány bit vált – minden bitváltás egy kapacitás feltöltése vagy kisütése, vagyis **fogyasztás**:

```python run
# Állapotkódolások összevetése egy 8 állapotú, körbejáró gépen (pl. egy lépéssorrend)
N = 8
kodolasok = {
    "bináris": [format(i, "03b") for i in range(N)],
    "Gray":    [format(i ^ (i >> 1), "03b") for i in range(N)],
    "one-hot": [format(1 << i, f"0{N}b") for i in range(N)],
}
for nev, kodok in kodolasok.items():
    # egy teljes kör alatt hány bit vált összesen (ez arányos a dinamikus fogyasztással)
    valtas = sum(bin(int(kodok[i], 2) ^ int(kodok[(i + 1) % N], 2)).count("1") for i in range(N))
    print(f"{nev:<8} {len(kodok[0])} flip-flop, egy körben {valtas:>2} bitváltás  | "
          + " ".join(kodok[:4]) + " …")
```

| Kódolás | Flip-flop | Bitváltás / kör | Mikor jó?                                                                      |
| ------- | --------- | --------------- | ------------------------------------------------------------------------------ |
| bináris | 3         | 14              | kevés flip-flop kell (ASIC, kis terület)                                       |
| Gray    | 3         | 8               | körbejáró sorrendnél a legkevesebb váltás, kevés tüske                         |
| one-hot | 8         | 16              | **FPGA**: sok a flip-flop, és a következőállapot-logika nagyon egyszerű, gyors |

Meglepő, hogy a one-hot váltja a legtöbb bitet? Lépésenként mindig pontosan **kettő** vált (egy 1 → 0, egy 0 → 1), viszont a következőállapot-logikája szinte csak egy-egy vezeték, ezért nagyon **gyors**. A tervezés itt is alku: kevés flip-flop, kevés fogyasztás vagy nagy sebesség.

## 4. Prellmentesítés állapotgéppel

Egy mechanikus nyomógomb érintkezője lenyomáskor és felengedéskor néhány ezredmásodpercig **pattog** (prell): gyorsan váltogat 0 és 1 között. Ha egy számláló közvetlenül ezt számolná, egy lenyomásra többet is számolna. A megoldás egy kis állapotgép: csak akkor fogadja el az új értéket, ha az **3 egymást követő mintavételen** át ugyanaz.

```python run
# Nyomógomb prellmentesítése állapotgéppel: csak 3 egymást követő azonos mintát fogad el
# A minta 1 ms-onként érkezik; a gomb érintkezője lenyomáskor és felengedéskor is "pattog".
minta = "0001011011111111110100100000000"

def prellmentes(minta, kell=3):
    stabil, jelolt, db = "0", "0", 0
    kimenet = ""
    for m in minta:
        if m == jelolt:
            db += 1                                  # ugyanaz jön, mint az előbb: számolunk
        else:
            jelolt, db = m, 1                        # változott: újrakezdjük a számolást
        if db >= kell:
            stabil = jelolt                          # elég régóta stabil: elfogadjuk
        kimenet += stabil
    return kimenet

ki = prellmentes(minta)
print("nyers gomb:   ", minta)
print("prellmentes:  ", ki)
print(f"lenyomások száma: nyersen {minta.count('01')}, prellmentesen {ki.count('01')}")
```

A nyers jelben **5** „lenyomás” (0 → 1 váltás) van, a prellmentesítettben **egy** – ahogy a felhasználó valóban megnyomta. Az ár egy kis **késés** (itt 2–3 ms), ami emberi léptékben észrevehetetlen. Minden billentyűzetben, egérgombban és mikrokontrolleres gombkezelésben ilyen logika fut (hardverben vagy szoftverben).

## Összefoglalás

- Egy állapotgép = **állapotok** + **teljes** átmenettábla + **kimenetek**; ugyanaz a modell hardverben és szoftverben is.
- Állapotminimalizálás: csoportosítás kimenet szerint, majd finomítás, amíg kell; az **elérhetetlen** állapotok törölhetők.
- Bináris kódolás: legkevesebb flip-flop; Gray: legkevesebb bitváltás körbejáró sorrendnél; one-hot: legtöbb flip-flop, de leggyorsabb logika (FPGA-n kedvelt).
- A prellmentesítő állapotgép csak a több mintán át stabil értéket fogadja el.

## A lecke feladata

```quiz required
? Az italautomata 100 Ft-os állapotban van, és bedobnak egy újabb 100 Ft-ost. Mi a következő állapot?
= 200
! 100 + 100 = 200 Ft: ital és 50 Ft visszajáró.

? Mikor ekvivalens két állapot egy Moore-gépben?
- ha ugyanabból az állapotból lehet beléjük jutni
+ ha ugyanazt a kimenetet adják, és minden bemenetre ekvivalens állapotba lépnek
- ha a kódjuk csak egy bitben tér el
- ha mindkettőből el lehet jutni a kezdőállapotba
! A kimenet és a jövőbeli viselkedés számít, nem a múlt.

? Hány flip-flop kell egy 10 állapotú géphez one-hot kódolással?
= 10
! One-hot: állapotonként egy flip-flop.

? Hány flip-flop kell ugyanehhez a 10 állapotú géphez bináris kódolással?
= 4
! 2^3 = 8 < 10 ≤ 16 = 2^4.

? Mit ad ki a prellmentesítő (3 egyező minta kell, a kezdeti kimenet 0) erre a nyers mintasorra: 0110111? Írd be a 7 kimeneti bitet!
= 0000001
! A 11-es szakasz csak két minta hosszú, ezért nem fogadja el; az utolsó 111 harmadik mintájánál vált 1-re.
```
