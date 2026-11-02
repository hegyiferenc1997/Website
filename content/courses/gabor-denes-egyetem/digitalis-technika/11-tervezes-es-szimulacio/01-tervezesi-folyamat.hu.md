---
title: A digitális tervezés folyamata és az időzítés
summary: Specifikációtól a működő hardverig – felülről lefelé tervezés, hierarchia, RTL; setup- és hold-idő, kritikus út, maximális órajel-frekvencia, időzítési tartalék; szinkron tervezési szabályok, metastabilitás és szinkronizáló.
minutes: 40
---

## Amit ebben a leckében megtanulsz

- milyen lépésekből áll egy digitális rendszer tervezése,
- mi a **felülről lefelé** (top-down) és a **hierarchikus** tervezés,
- mit jelent a **setup-** és a **hold-idő**,
- hogyan számolod ki a **kritikus utat** és a **maximális órajel-frekvenciát**,
- melyek a **szinkron tervezés** szabályai, és mi a **metastabilitás**.

## A tervezés lépései

Egy digitális rendszer (legyen az FPGA-s vagy egyedi chip) tervezése nagyjából mindig ugyanazokon a lépéseken megy végig:

1. **Specifikáció:** mit kell tudnia a rendszernek? Bemenetek, kimenetek, sebesség, fogyasztás, ár, interfészek.
2. **Architektúra:** milyen nagy egységekből áll (adatút, vezérlő, memória, interfészek), és hogyan kapcsolódnak?
3. **RTL-leírás** (register transfer level): az egységek leírása HDL-ben – regiszterek és a köztük lévő kombinációs logika.
4. **Funkcionális szimuláció:** működik-e logikailag? (következő lecke)
5. **Szintézis:** a HDL-ből kapuk, LUT-ok, flip-flopok hálózata lesz.
6. **Implementáció** (elhelyezés és huzalozás) és **időzítési elemzés:** elég gyors-e a valódi késleltetésekkel?
7. **Programozás / gyártás és tesztelés** a valódi hardveren (harmadik lecke).

Ha egy lépésnél hiba derül ki, vissza kell lépni – minél később derül ki, annál drágább. Ezért éri meg sokat szimulálni.

## Felülről lefelé és hierarchia

A **top-down** tervezésnél a feladatot egyre kisebb, áttekinthető részekre bontod, amíg egy-egy rész már könnyen megvalósítható (pl. egy számláló, egy multiplexer). A **bottom-up** irányban a kész, tesztelt alapelemekből építkezel felfelé. A gyakorlatban a kettő együtt megy.

```text
          digitális óra (top)
         /        |        \
   időalap     számlálók    kijelzővezérlő
  (osztó)    (mod-60, mod-24)  (BCD → 7 szegmens, multiplexelés)
```

Minden doboz egy külön HDL-modul (entity / module), amelyet **külön tesztelhetsz**, és többször is **felhasználhatsz** (pl. ugyanaz a mod-10 számláló több helyen).

## Időzítés: setup és hold

Egy flip-flop csak akkor veszi át megbízhatóan a D bemenetét, ha az az órajel éle körül **stabil**:

- **setup-idő (t<sub>su</sub>):** az adatnak ennyivel az órajelél **előtt** már stabilnak kell lennie;
- **hold-idő (t<sub>h</sub>):** az adatnak ennyivel az órajelél **után** még stabilnak kell maradnia;
- **órajel–kimenet késleltetés (t<sub>cq</sub>):** az él után ennyi idő múlva jelenik meg az új érték a Q kimeneten.

```text
órajel     ____/‾‾‾‾‾‾‾\_______
D       ==X====stabil====X=====
            |<-tsu->|<-th->|
```

## Kritikus út és maximális órajel

Két regiszter között az adat útja: az első flip-flop t<sub>cq</sub> késleltetése, majd a kombinációs logika késleltetése (t<sub>logika</sub>), végül a második flip-flop setup-ideje. Mindennek bele kell férnie egy órajelperiódusba:

**T ≥ t<sub>cq</sub> + t<sub>logika</sub> + t<sub>su</sub>**

A leglassabb ilyen út a **kritikus út**; ez szabja meg a **maximális órajel-frekvenciát**:

**f<sub>max</sub> = 1 / (t<sub>cq</sub> + t<sub>logika,max</sub> + t<sub>su</sub>)**

**Példa:** t<sub>cq</sub> = 1 ns, a leglassabb logika 6 ns, t<sub>su</sub> = 1 ns → T<sub>min</sub> = 8 ns → f<sub>max</sub> = **125 MHz**.

Az **időzítési tartalék** (slack) azt mutatja, mennyi idő marad: slack = T − (t<sub>cq</sub> + t<sub>logika</sub> + t<sub>su</sub>). 100 MHz-en (T = 10 ns) a fenti útnál a slack **2 ns**. **Negatív slack** = időzítési hiba: az áramkör ezen az órajelen nem fog megbízhatóan működni.

Mit tehetsz, ha nem fér bele? Csökkented az órajelet; egyszerűsíted a logikát; vagy **pipeline**-t építesz: a hosszú kombinációs utat egy közbülső regiszterrel két rövidebbre vágod (nagyobb órajel, de egy órajellel később jön az eredmény).

## A szinkron tervezés szabályai

A megbízható tervek szinte mindig **szinkronok**:

- **egy órajel** (vagy kevés, jól kezelt órajel) hajt minden flip-flopot, ugyanazon az élen;
- az órajelet **nem kapuzzuk** logikával (ÉS-kapuval „kikapcsolt” órajel hazárdos tüskéket okozhat) – helyette **engedélyező** (enable) bemenetet használunk;
- a kombinációs logikát nem kötjük vissza önmagába regiszter nélkül (**nincs kombinációs hurok**);
- az aszinkron bemeneteket (gombok, más órajelről érkező jelek) **szinkronizáljuk**.

## Metastabilitás és a szinkronizáló

Ha egy jel a saját órajelünktől független időpontban változik (pl. gombnyomás, másik órajeltartomány), előbb-utóbb megsérti a setup- vagy hold-időt. Ilyenkor a flip-flop **metastabil** állapotba kerülhet: a kimenete egy ideig se nem 0, se nem 1, és csak véletlenszerű idő múlva dől el.

A megoldás a **kétflipflopos szinkronizáló**: a jelet két egymás után kötött flip-flopon vezetjük át. Az első esetleg metastabil lesz, de egy teljes órajelperiódusa van megnyugodni, mielőtt a második átveszi – így a hiba valószínűsége elhanyagolhatóvá válik.

```text
aszinkron bemenet ──> [FF1] ──> [FF2] ──> szinkronizált jel
                        ^         ^
órajel ─────────────────┴─────────┘
```

A gombokat ezen felül **pergésmentesíteni** (debounce) is kell (5. témakör), mert egy gombnyomás több ms-ig „pattog”.

```python run
# A kritikus út és a maximális órajel-frekvencia kiszámítása
t_cq, t_su = 1.0, 1.0                          # ns
utak = {"összeadó": 6.0, "komparátor": 3.5, "multiplexer": 1.2}   # logikai késleltetések, ns

kritikus = max(utak, key=utak.get)
t_min = t_cq + utak[kritikus] + t_su
print("kritikus út:", kritikus, "- T_min =", t_min, "ns")
print("f_max =", round(1000 / t_min, 1), "MHz")

T = 10.0                                       # 100 MHz-es órajel
for nev, t in utak.items():
    print(f"{nev:12} slack = {T - (t_cq + t + t_su):5.1f} ns")
```

## Összefoglalás

- Lépések: specifikáció → architektúra → RTL → szimuláció → szintézis → implementáció + időzítés → tesztelés.
- Top-down bontás, hierarchikus modulok, amelyek külön tesztelhetők és újrahasznosíthatók.
- T ≥ t<sub>cq</sub> + t<sub>logika</sub> + t<sub>su</sub>; a leglassabb út a kritikus út, f<sub>max</sub> = 1/T<sub>min</sub>; negatív slack = hiba.
- Szinkron tervezés: egy órajel, nincs kapuzott órajel és kombinációs hurok; aszinkron jelekhez kétflipflopos szinkronizáló.

## A lecke feladata

```quiz required
? Egy úton t_cq = 1 ns, a kombinációs logika 6 ns, t_su = 1 ns. Hány MHz a maximális órajel-frekvencia?
= 125
! 1 / (1 + 6 + 1) ns.

? Ugyanez az út 100 MHz-es órajellel (T = 10 ns) működik. Hány ns az időzítési tartalék (slack)?
= 2

? Mi a setup-idő?
+ Ennyivel az órajelél előtt már stabilnak kell lennie az adatnak.
- Ennyivel az órajelél után jelenik meg az új érték a kimeneten.
- Ennyi ideig tart az áramkör bekapcsolása.
- Az órajel periódusideje.

? Mi a helyes sorrend a tervezési folyamatban?
- szintézis → specifikáció → szimuláció → RTL
+ specifikáció → RTL-leírás → funkcionális szimuláció → szintézis → implementáció
- RTL-leírás → implementáció → szintézis → specifikáció
- szimuláció → specifikáció → implementáció → RTL-leírás

? Mire szolgál a két egymás után kötött flip-flopból álló szinkronizáló?
- Megduplázza az órajel frekvenciáját.
+ Csökkenti a metastabilitás veszélyét, amikor egy aszinkron jel belép az órajeltartományba.
- Pergésmentesíti a gombot.
- Két bitet tárol egy helyett.

? Miért nem szabad az órajelet ÉS-kapuval kapuzni?
- Mert az ÉS-kapu túl lassú.
+ Mert a kapuzott órajelen hazárdos tüskék keletkezhetnek, és elcsúszik az élek időzítése; helyette engedélyező bemenet kell.
- Mert az FPGA-ban nincs ÉS-kapu.
- Mert így a flip-flop nem kap tápfeszültséget.
```
