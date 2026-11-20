---
title: Mélyebben – egy CPU belülről, számokkal
summary: Egy apró akkumulátoros processzor szimulátora, amely utasításról utasításra futtat egy ciklust (fetch–decode–execute, PC, ugrások); a pipeline gyorsulása ideális esetben és várakozásokkal; mikrokontroller-időzítő előosztóval és a soros port baudráta-hibája.
minutes: 45
---

## Amit ebben a leckében megtanulsz

- **végigkövetni** egy processzor működését utasításról utasításra egy működő szimulátorban,
- látni, hogyan valósul meg egy **ciklus** gépi szinten (feltételes ugrás, számláló),
- **kiszámolni**, mennyit gyorsít a pipeline, és mennyit visz el belőle az ugrás és az adatfüggés,
- beállítani egy mikrokontroller **időzítőjét**, és megérteni, miért nem működik minden **baudráta** minden kristállyal.

## 1. Egy apró CPU szimulátora

Építsünk egy **akkumulátoros** processzort: egyetlen munkaregisztere van (ACC), egy utasításszámlálója (PC), és hét utasítása. A program és az adat **ugyanabban a memóriában** van (Neumann-elv). A program az 5 + 4 + 3 + 2 + 1 összeget számolja ki egy ciklussal:

```python run
# Egy apró akkumulátoros CPU szimulátora: fetch – decode – execute
# Program: 5 + 4 + 3 + 2 + 1 összeadása; az eredmény a 21-es memóriacímre kerül.
mem = [0] * 32
program = [
    ("LOAD", 20),     # 0: ACC ← mem[20]           (a számláló)
    ("JZ", 8),        # 1: ha ACC = 0, ugrás a 8-ra (vége)
    ("ADD", 21),      # 2: ACC ← ACC + mem[21]     (hozzáadjuk az eddigi összeget)
    ("STORE", 21),    # 3: mem[21] ← ACC
    ("LOAD", 20),     # 4: ACC ← számláló
    ("SUB", 22),      # 5: ACC ← ACC − mem[22]     (mem[22] = 1)
    ("STORE", 20),    # 6: számláló ← ACC
    ("JMP", 0),       # 7: vissza az elejére
    ("HALT", 0),      # 8: megállás
]
mem[:len(program)] = program          # Neumann-elv: a program is a memóriában van
mem[20], mem[21], mem[22] = 5, 0, 1   # az adatok ugyanabban a memóriában

pc, acc, db = 0, 0, 0
while True:
    op, cim = mem[pc]                 # FETCH: utasítás beolvasása a PC címéről
    if db < 9:
        print(f"PC={pc}  {op:<5} {cim:>2}   ACC előtte = {acc}")
    pc += 1                           # a PC már a következő utasításra mutat
    db += 1
    if op == "LOAD":    acc = mem[cim]                 # DECODE + EXECUTE
    elif op == "ADD":   acc = acc + mem[cim]
    elif op == "SUB":   acc = acc - mem[cim]
    elif op == "STORE": mem[cim] = acc
    elif op == "JMP":   pc = cim
    elif op == "JZ":    pc = cim if acc == 0 else pc
    elif op == "HALT":  break

print(f"…\neredmény: mem[21] = {mem[21]}, összesen {db} utasítás futott le")
```

Kövesd a kiírást:

- A **FETCH** lépésben a CPU a PC által mutatott címről beolvassa az utasítást, és a PC-t **azonnal** a következő címre lépteti.
- A **JMP 0** egyszerűen felülírja a PC-t – így lesz a programból **ciklus**. A **JZ 8** csak akkor ugrik, ha ACC = 0 (_jump if zero_) – így lesz belőle **feltétel**. Minden `while`, `for` és `if` gépi szinten ilyen feltételes és feltétel nélküli ugrásokká fordul.
- A ciklusmag 8 utasítás, 5-ször fut le, plusz a végén a LOAD, JZ, HALT: 5 · 8 + 3 = **43** utasítás.

Figyeld meg azt is, hogy a változók (számláló, összeg) a **memóriában** vannak, és minden lépésben LOAD/STORE-ral kell mozgatni őket – az akkumulátoros gép lassú, mert sokat jár a memóriához. A modern (RISC) processzorokban ezért sok (16–32) regiszter van: a változók ott maradhatnak.

## 2. Mennyit gyorsít a pipeline?

Ha egy utasítás 5 fokozaton megy át (IF – beolvasás, ID – dekódolás, EX – végrehajtás, MEM – memória, WB – visszaírás), pipeline nélkül N utasítás N · 5 ütemig tart. Pipeline-nal az első utasítás 5 ütem alatt ér végig, utána **ütemenként egy** utasítás készül el: 5 + (N − 1) ütem. A valóságban azonban vannak **buborékok** (várakozások):

- **ugrásnál** a CPU nem tudja, honnan hozza a következő utasítást, amíg ki nem értékelte a feltételt (vezérlési hazárd),
- **adatfüggésnél** egy utasítás az előző eredményére vár (adathazárd).

```python run
# Pipeline: 5 fokozat (IF, ID, EX, MEM, WB), ideális eset és várakozásokkal
def futasido(utasitas, fokozat, varakozas=0, pipeline=True):
    if not pipeline:
        return utasitas * fokozat                    # minden utasítás végigmegy, egyedül
    return fokozat + (utasitas - 1) + varakozas      # feltöltés, aztán ütemenként egy kész

N, K = 1000, 5
alap = futasido(N, K, pipeline=False)
print(f"pipeline nélkül:            {alap:>5} ütem")
for nev, buborek in [("ideális pipeline", 0),
                     ("10% ugrás, 2 ütem büntetés", int(0.10 * N * 2)),
                     ("+ 20% adatfüggés, 1 ütem", int(0.10 * N * 2 + 0.20 * N * 1))]:
    t = futasido(N, K, buborek)
    print(f"{nev:<27} {t:>5} ütem → gyorsulás {alap / t:.2f}×")
```

Az ideális gyorsulás majdnem **5×** (a fokozatok száma), de ha minden tizedik utasítás ugrás 2 ütem büntetéssel, és minden ötödik vár 1 ütemet, már csak **3,56×**. Ezért van a modern processzorokban **elágazásbecslő** (_branch predictor_, ami 95% feletti pontossággal megjósolja az ugrásokat) és **továbbítás** (_forwarding_, az eredmény a regiszterfájl megkerülésével azonnal továbbmegy). A programozó is segíthet: a kiszámítható ciklus gyorsabb, mint a kiszámíthatatlan `if`-ek sorozata.

**Hasonlat:** a pipeline olyan, mint egy autómosó-sor: egyszerre öt autó van benne, mindegyik más fázisban. Ha valaki a sor közepén megáll gondolkodni, mindenki mögötte vár.

## 3. Mikrokontroller: időzítő és soros port számokkal

Egy mikrokontrolleres programban szinte mindig kell egy pontos **időalap** (pl. 1 ms-os megszakítás) és egy **soros port** (UART). Mindkettő a rendszerórajel **egész számú leosztásával** készül – és ebből érdekes következmények adódnak:

```python run
# Mikrokontroller: időzítő előosztóval és a soros port (UART) baud-hibája
F_CPU = 16_000_000                                   # Hz, egy tipikus 8 bites mikrokontroller

# 1) Időzítő: 1 ms-os megszakítás. TOP = F_CPU / (előosztó · f) − 1, és el kell férnie 8 biten
print("1 kHz-es időzítő-megszakítás, 8 bites számlálóval (TOP ≤ 255):")
for eloszto in [1, 8, 64, 256]:
    top = F_CPU / (eloszto * 1000) - 1
    ok = "jó" if top <= 255 and top == int(top) else "nem fér el" if top > 255 else "nem egész"
    print(f"  előosztó {eloszto:>3}: TOP = {top:>8.2f}  → {ok}")

# 2) UART: az osztó egész szám, ezért a baudráta csak közelítő; ±2% felett hibás lesz az átvitel
print("\nUART baudráta-hiba (UBRR = F_CPU / (16 · baud) − 1, egészre kerekítve):")
for baud in [9600, 57600, 115200]:
    ubrr = round(F_CPU / (16 * baud) - 1)
    valodi = F_CPU / (16 * (ubrr + 1))
    hiba = (valodi - baud) / baud * 100
    print(f"  {baud:>6} baud: UBRR = {ubrr:>3}, valódi {valodi:>9.1f} baud, hiba {hiba:+.1f}%"
          + ("  ← kockázatos!" if abs(hiba) > 2 else ""))
```

**Időzítő:** a 8 bites számláló legfeljebb 255-ig számol, ezért előosztóval kell lelassítani az órajelet. A 64-es előosztóval a 16 MHz-ből 250 kHz lesz, és 250 ütem (0…249) pontosan 1 ms – **egész szám**, tehát pontos. A 256-os előosztónál 62,5 ütem kellene, ami nem állítható be, így az időzítés pontatlan lenne.

**UART:** a baudráta-osztó is csak egész lehet, ezért a valódi baudráta eltér a kívánttól. A két oldal órájának eltérése kb. **±2%** felett már bithibákat okozhat. 16 MHz-en a 115 200 baud **−3,5%** hibával jön ki – ezért „nem megy” néha a gyors soros kapcsolat egy 16 MHz-es lapkával. Megoldások: kétszeres sebességű mód (8-as osztó a 16-os helyett), alacsonyabb baudráta, vagy speciális „baudráta-kristály” (pl. 18,432 MHz), amellyel minden szabványos sebesség pontosan, hiba nélkül osztható.

## Összefoglalás

- A CPU ciklusa: **fetch** (utasítás a PC címéről, PC léptetése), **decode**, **execute**; az ugrás a PC felülírása.
- A ciklusok és elágazások gépi szinten **feltételes és feltétel nélküli ugrások**.
- Pipeline: ideálisan k fokozat → közel k-szoros gyorsulás; az ugrások és adatfüggések **buborékai** ezt csökkentik.
- Időzítő: TOP = f<sub>CPU</sub> / (előosztó · f) − 1, egésznek kell lennie és el kell férnie; UART: az egész osztó miatt baudráta-hiba lép fel, ±2% felett kockázatos.

## A lecke feladata

```quiz required
? A szimulátor programjában mi történik a PC-vel a FETCH lépés után, ha az utasítás nem ugrás?
- nullázódik
+ eggyel nő, a következő utasításra mutat
- az ACC értékét veszi fel
- nem változik
! Ugrásnál a végrehajtás írja felül a PC-t; egyébként a következő címre lép.

? Hány utasítás fut le a szimulátorban, ha a számláló kezdőértéke 3 (5 helyett)?
= 27
! 3 · 8 + 3 = 27 (a ciklusmag 8 utasítás, a végén LOAD, JZ, HALT).

? Egy 5 fokozatú ideális pipeline-on hány ütem alatt fut le 100 utasítás?
= 104
! 5 + (100 − 1) = 104.

? 16 MHz-es órajel, 64-es előosztó: hány ütemet kell számolnia az időzítőnek 1 ms-hoz?
= 250
! 16 000 000 / 64 = 250 000 Hz → 1 ms alatt 250 ütem (TOP = 249).

? Miért lehet gond a 115 200 baudos soros átvitellel egy 16 MHz-es mikrokontrolleren?
- mert a 16 MHz túl lassú hozzá
+ mert az egész számú osztó miatt a valódi baudráta kb. 3,5%-kal eltér
- mert a 115 200 nem kettő hatványa
- mert az UART csak 9600 baudot ismer
! ±2% felett a vevő rossz pillanatban mintavételezhet.
```
