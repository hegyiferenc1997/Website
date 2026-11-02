---
title: Hibajelző és hibajavító kódok
summary: Paritásbit, Hamming-távolság, Hamming(7,4) kód szindrómával, és a CRC ciklikus redundanciaellenőrzés modulo-2 osztással.
minutes: 30
---

## Amit ebben a leckében megtanulsz

- hogyan jelez hibát a **paritásbit**,
- mi a **Hamming-távolság**, és mit árul el egy kód képességeiről,
- hogyan **javít** egy bithibát a **Hamming(7,4)** kód,
- hogyan számolunk **CRC**-t modulo-2 osztással.

## Miért kell?

Adatátvitelnél és tárolásnál a zaj, a sugárzás vagy egy hibás cella **bitet billenthet** (0 ↔ 1). Ezért az adat mellé **redundáns** (fölösleges, de ellenőrzésre jó) biteket teszünk:

- **hibajelző** kód: észreveszi a hibát (újraküldést kérünk),
- **hibajavító** kód: meg is mondja, melyik bit romlott el, és kijavítja.

## Paritásbit

Az adatbitekhez egy **paritásbitet** fűzünk úgy, hogy az egyesek száma

- **páros paritásnál** párossá,
- **páratlan paritásnál** páratlanná váljon.

**Példa (páros paritás):** 1011001 → négy egyes van → paritásbit **0** → 1011001**0**.
A paritásbit valójában az adatbitek **XOR**-ja: 1 ⊕ 0 ⊕ 1 ⊕ 1 ⊕ 0 ⊕ 0 ⊕ 1 = 0.

A vevő újraszámolja: ha nem stimmel, hiba történt. Korlát: **egy** (és bármely páratlan számú) bithibát észlel, de két bithibát nem, és **nem tudja, melyik** bit hibás.

## Hamming-távolság

**Richard Wesley Hamming** (1915–1998) amerikai matematikus a Bell Labs-nál dolgozott ki egy egész hibajavítókód-családot, és ezzel új kutatási területet nyitott; 1968-ban **Turing-díjat** kapott.

Két azonos hosszú kódszó **Hamming-távolsága** azon pozíciók száma, ahol különböznek (= az XOR-juk egyeseinek száma).

```text
 1011101
 1001001
   ↑ ↑        → a Hamming-távolság 2
```

Egy kód **minimális Hamming-távolsága** (d<sub>min</sub>) a kódszavai közti legkisebb távolság. Ebből:

| d<sub>min</sub> | Hibajelzés  | Hibajavítás         | Példa                         |
| --------------- | ----------- | ------------------- | ----------------------------- |
| 1               | –           | –                   | minden bitkombináció érvényes |
| 2               | 1 bit       | –                   | paritásbit                    |
| 3               | 2 bit       | 1 bit               | Hamming(7,4)                  |
| _d_             | _d_ − 1 bit | ⌊(_d_ − 1) / 2⌋ bit | –                             |

## A Hamming(7,4) kód

4 adatbithez (d<sub>1</sub>…d<sub>4</sub>) 3 paritásbitet (p<sub>1</sub>, p<sub>2</sub>, p<sub>4</sub>) teszünk; a paritásbitek a **2 hatványainak** megfelelő helyekre kerülnek:

| pozíció | 1             | 2             | 3             | 4             | 5             | 6             | 7             |
| ------- | ------------- | ------------- | ------------- | ------------- | ------------- | ------------- | ------------- |
| bit     | p<sub>1</sub> | p<sub>2</sub> | d<sub>1</sub> | p<sub>4</sub> | d<sub>2</sub> | d<sub>3</sub> | d<sub>4</sub> |

Minden paritásbit azokat a pozíciókat ellenőrzi (páros paritással), amelyek sorszámában az ő bitje 1:

- p<sub>1</sub> = d<sub>1</sub> ⊕ d<sub>2</sub> ⊕ d<sub>4</sub> (pozíciók 1, 3, 5, 7)
- p<sub>2</sub> = d<sub>1</sub> ⊕ d<sub>3</sub> ⊕ d<sub>4</sub> (pozíciók 2, 3, 6, 7)
- p<sub>4</sub> = d<sub>2</sub> ⊕ d<sub>3</sub> ⊕ d<sub>4</sub> (pozíciók 4, 5, 6, 7)

**Kódolás – példa:** adat = 1011 (d<sub>1</sub>=1, d<sub>2</sub>=0, d<sub>3</sub>=1, d<sub>4</sub>=1)
p<sub>1</sub> = 1⊕0⊕1 = 0, p<sub>2</sub> = 1⊕1⊕1 = 1, p<sub>4</sub> = 0⊕1⊕1 = 0 → kódszó: **0110011**.

**Javítás – szindróma:** a vevő újraszámolja a három ellenőrzést (s<sub>1</sub>, s<sub>2</sub>, s<sub>4</sub>). Ha mind 0, nincs hiba. Különben az **s<sub>4</sub>s<sub>2</sub>s<sub>1</sub> bináris szám a hibás bit sorszáma**!

Ha a 0110011 helyett **0110111** érkezik (az 5. bit elromlott):
s<sub>1</sub> = b<sub>1</sub>⊕b<sub>3</sub>⊕b<sub>5</sub>⊕b<sub>7</sub> = 0⊕1⊕1⊕1 = 1, s<sub>2</sub> = b<sub>2</sub>⊕b<sub>3</sub>⊕b<sub>6</sub>⊕b<sub>7</sub> = 1⊕1⊕1⊕1 = 0, s<sub>4</sub> = b<sub>4</sub>⊕b<sub>5</sub>⊕b<sub>6</sub>⊕b<sub>7</sub> = 0⊕1⊕1⊕1 = 1
→ szindróma 101<sub>2</sub> = **5** → az 5. bitet visszabillentjük ✓

A Hamming-kód kiterjesztett változata (SECDED) védi a szerverek **ECC memóriáit**.

## CRC – ciklikus redundanciaellenőrzés

A **CRC** hibadetektáló kód: az adatból egy **generátorpolinommal** végzett **modulo-2 osztás** maradékát számoljuk ki, és ezt az adat végére fűzzük. A vevő ugyanazzal a polinommal osztja a teljes üzenetet: **ha a maradék 0, az adat hibátlan**.

A modulo-2 aritmetikában nincs átvitel: az összeadás és a kivonás is **XOR**.

**Lépések** (generátor _k_+1 bites → _k_ bites CRC):

1. Az adat végére _k_ darab 0-t írunk.
2. Modulo-2 osztást végzünk: ahol a maradék eleje 1, a generátort alá írjuk és XOR-olunk.
3. Az utolsó _k_ bit a CRC.

**Példa:** adat = 1101011011, generátor = 10011 (x<sup>4</sup> + x + 1) → 4 nullát fűzünk hozzá.

```text
 11010110110000      ← adat + 4 nulla
 10011               ← XOR (az első 1-es alá)
 ──────────────
 01001110110000
  10011              ← XOR
 ──────────────
 00000010110000
       10011         ← XOR
 ──────────────
 00000000101000
         10011       ← XOR
 ──────────────
 00000000001110      → maradék (CRC) = 1110
```

Az elküldött üzenet: 1101011011 **1110**. A fogadó ezt elosztva 10011-gyel 0 maradékot kap.

| CRC típus | Bithossz | Gyakori alkalmazás                         |
| --------- | -------- | ------------------------------------------ |
| CRC-8     | 8 bit    | egyszerű protokollok (pl. SMBus)           |
| CRC-16    | 16 bit   | ipari soros kommunikáció (pl. Modbus, USB) |
| CRC-32    | 32 bit   | Ethernet, ZIP, PNG fájlok                  |
| CRC-64    | 64 bit   | nagy adatbiztonságot igénylő rendszerek    |

```python run
# CRC számolása modulo-2 osztással (XOR)
def crc(adat, generator):
    k = len(generator) - 1
    bitek = [int(b) for b in adat + "0" * k]      # k darab nulla a végére
    gen = [int(b) for b in generator]
    for i in range(len(adat)):
        if bitek[i] == 1:                           # ahol 1 áll, ott XOR a generátorral
            for j in range(len(gen)):
                bitek[i + j] ^= gen[j]
    return "".join(str(b) for b in bitek[-k:])

maradek = crc("1101011011", "10011")
print("CRC:", maradek)
```

> A CRC hardverben egyszerű: egy **léptetőregiszter** és néhány **XOR kapu** (5. témakör) bitenként, órajelenként számolja.

## Összefoglalás

- Paritás: 1 bithibát jelez, nem javít.
- Hamming-távolság: eltérő bitek száma; d<sub>min</sub> = 3 → 1 bit javítható.
- Hamming(7,4): a szindróma megadja a hibás bit sorszámát.
- CRC: modulo-2 osztás maradéka; 0 maradék = hibátlan.

## A lecke feladata

```quiz required
? Mi a **páros** paritásbit az 1101001 adathoz?
= 0
! Számold meg az egyeseket: ha páros, a paritásbit 0.

? Mi a **páratlan** paritásbit ugyanehhez az adathoz (1101001)?
= 1
! Páratlan paritásnál az egyesek száma a paritásbittel együtt páratlan.

? Mennyi az 1011101 és az 1001001 kódszavak Hamming-távolsága?
= 2
! Számold meg, hány pozícióban tér el a kettő.

? Hány bithibát tud **javítani** egy d<sub>min</sub> = 5 távolságú kód?
= 2
! ⌊(d − 1) / 2⌋.

? Mi az 1001 adat Hamming(7,4) kódszava (p<sub>1</sub> p<sub>2</sub> d<sub>1</sub> p<sub>4</sub> d<sub>2</sub> d<sub>3</sub> d<sub>4</sub> sorrendben)?
= 0011001
! p<sub>1</sub> = d<sub>1</sub>⊕d<sub>2</sub>⊕d<sub>4</sub>, p<sub>2</sub> = d<sub>1</sub>⊕d<sub>3</sub>⊕d<sub>4</sub>, p<sub>4</sub> = d<sub>2</sub>⊕d<sub>3</sub>⊕d<sub>4</sub>.

? Egy Hamming(7,4) kódszónál a szindróma s<sub>4</sub>s<sub>2</sub>s<sub>1</sub> = 110. Hányadik bit hibás?
= 6
! A szindróma bináris értéke a hibás bit sorszáma.

? Mi a CRC az 11010110 adathoz az 1011 generátorral (3 bit)?
= 111
! Fűzz 3 nullát az adathoz, és végezz modulo-2 (XOR) osztást.
```
