---
title: Átváltás a számrendszerek között
summary: Tízesből kettesbe maradékos osztással, törtek szorzással, kettes ↔ nyolcas ↔ tizenhatos csoportosítással.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- tízesből kettesbe (és bármely alapra) **maradékos osztással**,
- a **törtrész** átváltását **ismételt szorzással**,
- a gyors **kettes ↔ nyolcas ↔ tizenhatos** átváltást bitcsoportokkal.

## Egész rész: ismételt osztás az alappal

Osszuk a számot az új alappal, írjuk fel a **maradékot**, és a hányadossal folytassuk, amíg 0 nem lesz. Az eredményt a maradékok **alulról felfelé** olvasva kapjuk.

**Példa:** 45<sub>10</sub> = ?<sub>2</sub>

```text
 45 : 2 = 22  maradék 1   ← legkisebb helyiérték (LSB)
 22 : 2 = 11  maradék 0
 11 : 2 =  5  maradék 1
  5 : 2 =  2  maradék 1
  2 : 2 =  1  maradék 0
  1 : 2 =  0  maradék 1   ← legnagyobb helyiérték (MSB)
```

Alulról felfelé: **45<sub>10</sub> = 101101<sub>2</sub>**. Ellenőrzés: 32 + 8 + 4 + 1 = 45 ✓

Ugyanez működik bármely alapra: 156<sub>10</sub> = 9C<sub>16</sub> (156 : 16 = 9, maradék 12 = C).

**Másik módszer (kivonásos):** keressük a legnagyobb, még beleférő kettőhatványt, vonjuk ki, és ismételjük. 45 = 32 + 8 + 4 + 1 → a 32, 8, 4, 1 helyén 1-es áll: 101101.

## Törtrész: ismételt szorzás az alappal

Szorozzuk a törtrészt 2-vel; az **egészrész** (0 vagy 1) a következő bit, a törtrésszel folytatjuk. Az eredményt **felülről lefelé** olvassuk.

**Példa:** 0,625<sub>10</sub> = ?<sub>2</sub>

```text
 0,625 · 2 = 1,25  → 1
 0,25  · 2 = 0,5   → 0
 0,5   · 2 = 1,0   → 1   (a törtrész 0 lett, kész)
```

**0,625<sub>10</sub> = 0,101<sub>2</sub>**

> Vigyázat: sok tizedes tört kettesben **végtelen**! Például 0,1<sub>10</sub> = 0,000110011…<sub>2</sub>. Ezért ad a Python `0.1 + 0.2` összegre `0.30000000000000004`-et.

## Kettes ↔ tizenhatos és nyolcas: csoportosítás

Mivel 16 = 2<sup>4</sup> és 8 = 2<sup>3</sup>, egy hexadecimális jegy pontosan **4 bitnek**, egy oktális jegy pontosan **3 bitnek** felel meg. A biteket **jobbról** (a kettedes vesszőtől) csoportosítjuk, és szükség esetén balról nullákkal egészítjük ki.

| hexa | bin  | hexa | bin  | hexa | bin  | hexa | bin  |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| 0    | 0000 | 4    | 0100 | 8    | 1000 | C    | 1100 |
| 1    | 0001 | 5    | 0101 | 9    | 1001 | D    | 1101 |
| 2    | 0010 | 6    | 0110 | A    | 1010 | E    | 1110 |
| 3    | 0011 | 7    | 0111 | B    | 1011 | F    | 1111 |

**Példák**

- 11010111<sub>2</sub> = 1101 0111 = **D7<sub>16</sub>**
- 3B<sub>16</sub> = 0011 1011 = **111011<sub>2</sub>**
- 101110<sub>2</sub> = 101 110 = **56<sub>8</sub>**
- Oktális ↔ hexa: kettesen keresztül! 56<sub>8</sub> = 101110<sub>2</sub> = 0010 1110 = **2E<sub>16</sub>**

```python run
# Átváltás tízesből: beépített függvények és a maradékos osztás
print(bin(45), oct(45), hex(45))
print(format(45, "08b"))          # 8 biten, vezető nullákkal

def atvalt(szam, alap):
    jegyek = "0123456789ABCDEF"
    if szam == 0:
        return "0"
    eredmeny = ""
    while szam > 0:
        szam, maradek = divmod(szam, alap)
        eredmeny = jegyek[maradek] + eredmeny   # a maradékok alulról felfelé
    return eredmeny

print(atvalt(45, 2), atvalt(156, 16), atvalt(46, 8))
```

## Összefoglalás

- Egész rész: maradékos osztás, a maradékokat alulról felfelé olvasva.
- Törtrész: ismételt szorzás, az egészrészeket felülről lefelé olvasva.
- 1 hexa jegy = 4 bit, 1 oktális jegy = 3 bit – csoportosítás a vesszőtől kifelé.

## A lecke feladata

```quiz required
? Mennyi 200<sub>10</sub> kettes számrendszerben?
= 11001000
! Maradékos osztás 2-vel, vagy: 200 = 128 + 64 + 8.

? Mennyi 0,6875<sub>10</sub> kettes számrendszerben? (Formátum: 0,…)
= 0,1011
= 0.1011
! Szorozz 2-vel többször: 1,375 → 1; 0,75 → 0; …

? Mennyi 11010111<sub>2</sub> hexadecimálisan?
= D7
= 0xD7
! Csoportosíts négyesével jobbról: 1101 0111.

? Mennyi 3B<sub>16</sub> kettes számrendszerben (vezető nullák nélkül)?
= 111011
! 3 = 0011, B = 1011.

? Mennyi 101110<sub>2</sub> oktálisan?
= 56
! Csoportosíts hármasával jobbról: 101 110.

? Mennyi 156<sub>10</sub> hexadecimálisan?
= 9C
= 0x9C
! 156 : 16 = 9, maradék 12.
```
