---
title: A szekvenciális (sorrendi) hálózatok alapjai
summary: Állapot és memória, szinkron és aszinkron hálózat, órajel, szint- és élvezérlés, setup- és hold-idő, maximális órajel-frekvencia, metastabilitás.
minutes: 30
---

## Amit ebben a leckében megtanulsz

- mitől **szekvenciális** (sorrendi) egy hálózat, és mi az **állapot**,
- mi a különbség a **szinkron** és az **aszinkron** hálózat között,
- az **órajel** jellemzőit, a **szintvezérlés** és az **élvezérlés** különbségét (latch ↔ flip-flop),
- a **setup-**, **hold-** és **késleltetési** időket, és hogyan számolod a **maximális órajel-frekvenciát**,
- mi a **metastabilitás** és hogyan védekezünk ellene.

## Kombinációs logika memóriával

A **szekvenciális** hálózat kimenete nemcsak a bemenetek pillanatnyi értékétől függ, hanem a **korábbi bemenetektől is** – vagyis van **emlékezete**. Ezt a múltat az **állapot** foglalja össze, amelyet **tárolóelemek** őriznek.

```text
          ┌──────────────────┐
bemenet ─►│ kombinációs      ├─► kimenet
      ┌──►│ hálózat          ├──┐
      │   └──────────────────┘  │ következő állapot
      │   ┌──────────────────┐  │
      └───┤ tárolók (állapot)│◄─┘
          └──────────────────┘
```

A tárolók kimenete **visszacsatolódik** a kombinációs részre. Szinte minden digitális eszköz – számítógép, memória, vezérlő – kombinációs és szekvenciális logika keveréke.

## Szinkron és aszinkron hálózat

|                        | **aszinkron**                                   | **szinkron**                                       |
| ---------------------- | ----------------------------------------------- | -------------------------------------------------- |
| mikor változik állapot | bármikor, amikor egy bemenet változik           | **csak az órajel** (aktív éle) hatására            |
| sebesség               | csak a kapuk késleltetése korlátozza – gyors    | az órajel frekvenciája határozza meg               |
| tervezés               | nehéz: **versenyhelyzet** (race), hazárdok, instabil állapotok | egyszerűbb, jól automatizálható           |
| használat              | néhány kritikus részletben                      | **szinte minden** mai digitális rendszer           |

**Versenyhelyzet** akkor lép fel, ha egy állapotváltáskor több állapotváltozónak kellene egyszerre változnia, de a különböző késleltetések miatt eltérő sorrendben változnak – a hálózat így rossz állapotba kerülhet. Szinkron hálózatban az órajel periódusát úgy választjuk meg, hogy minden jel beálljon a következő él előtt.

## Az órajel

Az **órajel** (clock, CLK) periodikus négyszögjel, amely a szinkron hálózat „ütemét” adja.

- **Periódusidő** T, **frekvencia** f = 1 / T (pl. 50 MHz → T = 20 ns).
- **Kitöltési tényező** (duty cycle): a magas szint aránya a periódusban, tipikusan 50 %.
- **Felfutó él** (0 → 1) és **lefutó él** (1 → 0).

## Szintvezérlés és élvezérlés

- **Tároló (latch, retesz) – szintvezérelt:** amíg az engedélyező jel (E) aktív szintű, a kimenet **követi** a bemenetet („átlátszó”); amikor inaktívvá válik, megtartja az utolsó értéket.
- **Flip-flop (billenőkör) – élvezérelt:** a bemenetet **csak az órajel élének pillanatában** mintavételezi; a két él között a bemenet változása hatástalan.

Az irodalom (és a köznyelv) a két szót gyakran keveri – ebben a tananyagban a fenti megkülönböztetést használjuk.

**Jelölések:** CLK – órajel, E (EN) – engedélyezés, **CLR** – törlés (Q = 0), **PRE** – előbeállítás (Q = 1). A kimenet szokásos jele **Q** – a német **Quelle** (forrás) szóból, mellette a negált kimenet Q̅.

## Időzítési paraméterek

Egy élvezérelt flip-flop csak akkor működik megbízhatóan, ha a bemenete az él **körül egy ideig stabil**:

- **Setup-idő** (t<sub>su</sub>): az adatnak ennyivel **az él előtt** már stabilnak kell lennie.
- **Hold-idő** (t<sub>h</sub>): az adatnak ennyi ideig **az él után** is stabilnak kell maradnia.
- **Clock-to-Q** (t<sub>cq</sub>): az éltől ennyi idő múlva jelenik meg az új érték a kimeneten.

### Maximális órajel-frekvencia

Két flip-flop között egy kombinációs hálózat áll (késleltetése t<sub>logika</sub>). Az órajel periódusa legalább:

**T<sub>min</sub> = t<sub>cq</sub> + t<sub>logika</sub> + t<sub>su</sub>**, és **f<sub>max</sub> = 1 / T<sub>min</sub>**

**Példa:** t<sub>cq</sub> = 2 ns, t<sub>logika</sub> = 13 ns, t<sub>su</sub> = 5 ns → T<sub>min</sub> = 20 ns → **f<sub>max</sub> = 50 MHz**.

A leghosszabb ilyen utat **kritikus útnak** nevezzük; az FPGA-tervezőprogramok **időzítési elemzése** (static timing analysis) pontosan ezt számolja.

## Metastabilitás

Ha a setup- vagy hold-idő sérül (pl. egy **aszinkron** külső jel, nyomógomb éppen az órajel élén vált), a flip-flop kimenete egy ideig **egyik logikai szinten sincs** – lebeg, majd véletlenszerűen 0-ba vagy 1-be dől. Ez a **metastabilitás**.

**Védekezés:** az aszinkron bemenetet **két egymás utáni flip-flopon** (szinkronizáló lánc) vezetjük át; az első esetleges metastabil állapota a második mintavételéig szinte biztosan lecseng.

```python run
# Maximális órajel-frekvencia számítása
t_cq, t_logika, t_su = 2e-9, 13e-9, 5e-9      # másodpercben
t_min = t_cq + t_logika + t_su
print(f"T_min = {t_min * 1e9:.0f} ns, f_max = {1 / t_min / 1e6:.0f} MHz")
```

## Összefoglalás

- Szekvenciális hálózat = kombinációs hálózat + tárolók (állapot) visszacsatolással.
- Szinkron: csak az órajel élén vált állapotot; aszinkron: bármikor, versenyhelyzet veszélyével.
- Latch: szintvezérelt; flip-flop: élvezérelt.
- T<sub>min</sub> = t<sub>cq</sub> + t<sub>logika</sub> + t<sub>su</sub>; aszinkron bemenetet két flip-flopos szinkronizálóval veszünk át.

## A lecke feladata

```quiz required
? Mitől függ egy szekvenciális hálózat kimenete?
- Csak a bemenetek pillanatnyi értékétől.
+ A bemenetek pillanatnyi értékétől és a hálózat állapotától (a korábbi bemenetektől).
- Csak az órajel frekvenciájától.
- Csak a tápfeszültségtől.

? Mi a különbség a latch és a flip-flop között?
+ A latch szintvezérelt, a flip-flop élvezérelt.
- A latch élvezérelt, a flip-flop szintvezérelt.
- A latch kombinációs hálózat, a flip-flop nem.
- Nincs különbség, a kettő ugyanaz.

? Mennyi az 50 MHz-es órajel periódusideje nanoszekundumban?
= 20
= 20ns
! T = 1 / f.

? Egy flip-flop t_cq = 3 ns, a kombinációs logika késleltetése 17 ns, a setup-idő 5 ns. Mekkora a maximális órajel-frekvencia MHz-ben?
= 40
= 40MHz
! T_min = t_cq + t_logika + t_su = 25 ns.

? Mit jelent a setup-idő?
- Ennyi ideig tart, amíg a kimenet az él után megváltozik.
+ Az adatnak ennyivel az órajel éle előtt már stabilnak kell lennie.
- Az adatnak ennyi ideig az él után is stabilnak kell maradnia.
- A bekapcsolás után ennyi idő kell az első órajelig.

? Hogyan védekezünk a metastabilitás ellen egy aszinkron bemenetnél?
- Megduplázzuk az órajel frekvenciáját.
- Kihagyjuk az órajelet, és latch-et használunk.
+ Két egymás utáni flip-flopon (szinkronizáló láncon) vezetjük át a jelet.
- Egy inverterrel negáljuk a jelet.
```
