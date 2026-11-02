---
title: Tárolók (latch-ek) – SR, S̅R̅ és D tároló
summary: Az alapvető tárolóelem két visszacsatolt kapuból; NOR alapú SR és NAND alapú S̅R̅ tároló, tiltott állapot, SR és RS prioritás, kapuzott és D tároló, prell-mentesítés.
minutes: 30
---

## Amit ebben a leckében megtanulsz

- hogyan **emlékszik** két visszacsatolt kapu,
- a **NOR alapú SR** és a **NAND alapú S̅R̅** tároló működését és **tiltott állapotát**,
- az **állapottáblát** és a **karakterisztikus egyenletet**,
- a **set-prioritású (SR)** és **reset-prioritású (RS)** tároló különbségét,
- a **kapuzott** (engedélyezett) SR és **D tárolót**,
- egy klasszikus alkalmazást: a nyomógomb **prell-mentesítését**.

## Két kapu, amely emlékszik

Kössünk össze két NOR kaput **keresztbe**: mindkettő kimenete a másik egyik bemenetére megy. A szabad bemenetek: **S** (set, beírás) és **R** (reset, törlés), a kimenetek: **Q** és **Q̅**.

```text
Q  = NOR(R, Q̅)      ← az egyik kapu bemenete R és a másik kapu kimenete
Q̅  = NOR(S, Q)      ← a másik kapu bemenete S és az első kapu kimenete
```

- **S = 1, R = 0** → Q = 1 (beírás).
- **S = 0, R = 1** → Q = 0 (törlés).
- **S = 0, R = 0** → a visszacsatolás **megtartja** az előző állapotot – ez a **tárolás**.
- **S = 1, R = 1** → Q = Q̅ = 0, ami ellentmond a Q̅ jelölésnek; ha utána egyszerre mindkettő 0-ra vált, a végállapot **bizonytalan** (versenyhelyzet). Ez a **tiltott** állapot.

## Állapottábla és karakterisztikus egyenlet

Q a jelenlegi, Q<sup>+</sup> a következő állapot:

| S | R | Q<sup>+</sup> | művelet   |
| - | - | ------------- | --------- |
| 0 | 0 | Q             | tárol     |
| 0 | 1 | 0             | töröl     |
| 1 | 0 | 1             | beír      |
| 1 | 1 | –             | tiltott   |

A **karakterisztikus egyenlet** (a tiltott sort közömbösnek véve): **Q<sup>+</sup> = S + R̅·Q**, az **S·R = 0** feltétellel.

## NAND alapú S̅R̅ tároló

Két keresztbe kötött **NAND** kapuval a bemenetek **aktív alacsonyak**: S̅ = 0 beír, R̅ = 0 töröl, S̅ = R̅ = 1 tárol, és **S̅ = R̅ = 0 tiltott** (ekkor Q = Q̅ = 1). Ilyen tároló van például az **555 időzítő** IC belsejében.

## SR és RS prioritás

A tiltott állapotot úgy is kezelhetjük, hogy **egyik bemenetnek elsőbbséget adunk** (a PLC-programozásban így szokás):

- **SR tároló (set-prioritású):** S = R = 1 esetén **Q = 1**. Egyenlet: **Q<sup>+</sup> = S + R̅·Q**
- **RS tároló (reset-prioritású):** S = R = 1 esetén **Q = 0**. Egyenlet: **Q<sup>+</sup> = R̅·(S + Q)**

Vészleállító áramkörökben reset-prioritás a biztonságos: ha mindkét jel jelen van, a gép álljon le.

## Kapuzott SR tároló és D tároló

Egy **E** (enable) bemenettel kiegészítve az S és R csak akkor hat, ha E = 1; E = 0 esetén a tároló **tartja** az állapotát.

A **D tároló** (D latch) megszünteti a tiltott állapotot: egyetlen **D** (data) bemenete van, és S = D, R = D̅. Így:

| E | D | Q<sup>+</sup> |
| - | - | ------------- |
| 0 | X | Q (tart)      |
| 1 | 0 | 0             |
| 1 | 1 | 1             |

**Q<sup>+</sup> = E·D + E̅·Q** – amíg E = 1, a kimenet **átlátszóan követi** D-t; amikor E 0-ra vált, megjegyzi az utolsó értéket. (Ismert IC: **74373** – 8 bites D tároló, buszrendszerekben címtárolásra.)

## Előbeállítás és törlés

Sok tárolón van két **aszinkron** bemenet is, amely minden mást felülír: **PRE** (preset, Q = 1) és **CLR** (clear, Q = 0) – gyakran aktív alacsonyak. Ezekkel állítjuk be a rendszer **kezdőállapotát** bekapcsoláskor (reset).

## Alkalmazás: prell-mentesítés

Egy mechanikus kapcsoló érintkezője zárás közben néhány ms-ig **pattog** (prell, bounce): 0 és 1 között sokszor vált. Ha egy **váltókapcsoló** két állása az S̅R̅ tároló S̅ és R̅ bemenetére kerül, az első érintkezés már beállítja a tárolót, a további pattogás pedig csak „tárol” állapotot okoz – a kimenet **egyetlen tiszta** váltás. (Egyszerű nyomógombnál RC-szűrő + Schmitt-trigger vagy szoftveres késleltetés a megoldás.)

```python run
# SR tároló szimulációja egy bemeneti sorozatra (Q+ = S + R'Q)
q = 0
sorozat = [(1, 0), (0, 0), (0, 0), (0, 1), (0, 0), (1, 0)]
for s, r in sorozat:
    assert not (s and r), "tiltott állapot"
    q = s | ((1 - r) & q)
    print(f"S={s} R={r} → Q={q}")
```

## Összefoglalás

- Két keresztbe kötött NOR (vagy NAND) kapu tárolja az állapotot.
- NOR SR: S = R = 1 tiltott; NAND S̅R̅: S̅ = R̅ = 0 tiltott (aktív alacsony).
- Q<sup>+</sup> = S + R̅Q (SR, set-prioritás); Q<sup>+</sup> = R̅(S + Q) (RS, reset-prioritás).
- D tároló: Q<sup>+</sup> = ED + E̅Q, szintvezérelt, nincs tiltott állapota.

## A lecke feladata

```quiz required
? Egy NOR alapú SR tárolón S = 0, R = 1. Mi lesz Q értéke?
= 0
! R a törlés (reset).

? Töltsd ki a set-prioritású SR tároló állapottábláját (Q: jelenlegi, QN: következő állapot)!
table: S, R, Q -> QN = S + R'·Q
! S = 1 mindig beír; S = 0, R = 1 töröl; S = R = 0 tart.

? Írd fel a reset-prioritású (RS) tároló karakterisztikus egyenletét!
expr: S, R, Q -> R'·(S + Q)
! R = 1 esetén mindig 0; különben beír vagy tart.

? Milyen szinten aktívak a NAND kapukból épített tároló bemenetei, és mi a tiltott kombináció?
- Magas szinten aktívak; az S = R = 1 tiltott.
+ Alacsony szinten aktívak; az S̅ = R̅ = 0 tiltott.
- Alacsony szinten aktívak; az S̅ = R̅ = 1 tiltott.
- Nincs tiltott kombinációja.

? Írd fel a D tároló (latch) következő állapotát az E engedélyező és a D adatbemenet függvényében!
expr: E, D, Q -> E·D + E'·Q
! E = 1: követi D-t; E = 0: tart.

? Mire használható egy S̅R̅ tároló egy váltókapcsoló mellett?
- Frekvenciaosztásra.
+ A kapcsoló pattogásának (prell) kiszűrésére.
- Feszültségszint-illesztésre.
- Az órajel előállítására.
```
