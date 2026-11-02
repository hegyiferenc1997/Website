---
title: Univerzális kapuk – NAND és NOR
summary: Miért elég egyetlen kaputípus? NEM, ÉS, VAGY és XOR kizárólag NAND-ból vagy NOR-ból; kétszintű hálózatok NAND–NAND és NOR–NOR alakra hozása.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- mit jelent, hogy egy kapu **univerzális**,
- hogyan építed meg a NEM, ÉS, VAGY és XOR kaput **csak NAND-ból** és **csak NOR-ból**,
- hogyan alakítasz át egy ÉS–VAGY hálózatot **NAND–NAND**, egy VAGY–ÉS hálózatot **NOR–NOR** alakra (homogenizálás).

## Univerzális kapu

Egy kaputípus **univerzális** (funkcionálisan teljes), ha belőle **bármely logikai függvény** megépíthető. Mivel minden függvény felírható ÉS, VAGY, NEM műveletekkel, elég megmutatni, hogy ez a három előállítható.

**A NAND és a NOR is univerzális.** Ezért gyártják őket a legnagyobb számban, és ezért lehet egy chipen egyetlen, optimalizált cellatípusból felépíteni a logikát. (A CMOS technológiában ráadásul a NAND és a NOR a legegyszerűbb, leggyorsabb kapu: 4 tranzisztor, míg az ÉS és a VAGY 6.)

## Minden NAND-ból

| Kapu | NAND-os megvalósítás                                 | NAND-ok száma |
| ---- | ---------------------------------------------------- | ------------- |
| NEM  | A̅ = (A · A)̅ – a két bemenet összekötve               | 1             |
| ÉS   | A · B = ((A · B)̅)̅ – NAND, utána NAND-inverter        | 2             |
| VAGY | A + B = (A̅ · B̅)̅ – a bemeneteket negáljuk (De Morgan) | 3             |
| NOR  | VAGY + inverter                                      | 4             |
| XOR  | N = (AB)̅, Y = ((A·N)̅ · (B·N)̅)̅                        | 4             |

```text
 NEM NAND-ból:        VAGY NAND-ból:

 A ──┬─┤NAND├── A̅     A ─┤NAND├─ A̅ ─┐
     └─┤    │            A ─┤    │     ├─┤NAND├── A + B
                       B ─┤NAND├─ B̅ ─┘
                       B ─┤    │
```

## Minden NOR-ból

| Kapu | NOR-os megvalósítás         | NOR-ok száma |
| ---- | --------------------------- | ------------ |
| NEM  | A̅ = (A + A)̅                 | 1            |
| VAGY | A + B = ((A + B)̅)̅           | 2            |
| ÉS   | A · B = (A̅ + B̅)̅ (De Morgan) | 3            |
| NAND | ÉS + inverter               | 4            |
| XNOR | a NAND-os XOR duálisa       | 4            |

## Homogenizálás: ÉS–VAGY → NAND–NAND

Egy **kétszintű ÉS–VAGY** hálózat (szorzatok összege, SOP) **közvetlenül** NAND–NAND hálózattá alakítható: minden kaput NAND-ra cserélünk, a bekötés nem változik.

**Miért működik?** Kettős negálás és De Morgan:

F = A·B + C·D = ((A·B + C·D)̅)̅ = ((A·B)̅ · (C·D)̅)̅

```text
 ÉS–VAGY:                         NAND–NAND:
 A ─┤ ÉS ├─┐                      A ─┤NAND├─┐
 B ─┤    │  ├─┤VAGY├── F    ⇒     B ─┤    │  ├─┤NAND├── F
 C ─┤ ÉS ├─┘                      C ─┤NAND├─┘
 D ─┤    │                        D ─┤    │
```

Ha egy változó **egyedül** áll a VAGY bemenetén (pl. F = A·B + C), akkor azt **negálva** kell a második szintű NAND-ra vezetni: F = ((A·B)̅ · C̅)̅.

## Homogenizálás: VAGY–ÉS → NOR–NOR

Duálisan egy **kétszintű VAGY–ÉS** hálózat (összegek szorzata, POS) NOR–NOR hálózattá alakul:

F = (A + B)·(C + D) = ((A + B)̅ + (C + D)̅)̅

## Buborék-szemlélet

A kapcsolási rajzokon gyakran „buborékot tolunk”: egy negálás (kis kör) a vezeték egyik végéről a másikra tolható, ha közben a kapu típusa De Morgan szerint megfordul (ÉS ↔ VAGY). Két buborék ugyanazon a vezetéken **kioltja** egymást.

## Összefoglalás

- A NAND és a NOR univerzális: belőlük bármely függvény megépíthető.
- NAND-ból: NEM = 1, ÉS = 2, VAGY = 3, XOR = 4 kapu.
- ÉS–VAGY (SOP) → NAND–NAND; VAGY–ÉS (POS) → NOR–NOR, a bekötés változatlan.

## A lecke feladata

```quiz required
? Hány kétbemenetű NAND kapu kell egy VAGY kapu megépítéséhez?
= 3
! Két NAND-inverter a bemeneteken, egy NAND a végén (De Morgan).

? Hány kétbemenetű NAND kapu kell egy XOR kapuhoz (a legkevesebb)?
= 4
! N = (AB)̅, utána (AN)̅ és (BN)̅, végül ezek NAND-ja.

? Milyen függvényt valósít meg ez a NAND–NAND hálózat: Y = ((A·B)'·(C·D)')' ? Írd fel ÉS–VAGY alakban!
expr: A, B, C, D -> A·B + C·D
limit: 4
same: ((A·B)'·(C·D)')'
! Kettős negálás és De Morgan.

? Milyen függvényt valósít meg ez a kapcsolás: Y = ((A·(A·B)')'·(B·(A·B)')')' ?
expr: A, B -> A ⊕ B
same: ((A·(A·B)')'·(B·(A·B)')')'
! A négy NAND-os klasszikus kapcsolás – töltsd ki fejben az igazságtáblát!

? Melyik kapu nem univerzális?
- NAND
- NOR
+ ÉS
! Csak ÉS kapukból nem lehet negálni.

? Hány kétbemenetű NOR kapu kell egy ÉS kapu megépítéséhez?
= 3
! Két NOR-inverter a bemeneteken, egy NOR a végén.
```
