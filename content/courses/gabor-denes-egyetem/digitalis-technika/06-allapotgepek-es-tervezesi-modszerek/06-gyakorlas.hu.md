---
title: Gyakorlás – állapotgépek
summary: Ellenőrző kérdések és összefoglaló feladatlap: Moore- és Mealy-gép, állapottábla, sorozatfelismerő, állapotkódolás és minimalizálás.
minutes: 60
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Miből áll egy szinkron állapotgép, és melyik része kombinációs?</summary>

Következőállapot-logikából (kombinációs), állapotregiszterből (flip-flopok, sorrendi) és kimeneti logikából (kombinációs). Az állapotregiszter minden órajel élén átveszi a következőállapot-logika által kiszámolt kódot.

</details>

<details>
<summary>2. Honnan ismered fel az egyenletekből, hogy Moore- vagy Mealy-gépről van szó?</summary>

Ha a kimenet függvényében csak állapotváltozók (flip-flop kimenetek) szerepelnek, Moore-gép; ha valamelyik bemenet is szerepel benne, Mealy-gép.

</details>

<details>
<summary>3. Miért kell a „101” Moore-felismerőnek eggyel több állapot, mint a Mealy-változatnak?</summary>

Mert a Moore-gép kimenete csak az állapottól függhet, így a „megtaláltam” helyzetet egy külön, 1-es kimenetű állapotnak kell jelölnie. A Mealy-gép ezt az átmenetre (C állapot + 1 bemenet) írhatja, ezért nem kell hozzá új állapot.

</details>

<details>
<summary>4. Mi történhet, ha az állapotgráfban egy állapotból nem minden bemenetre rajzolunk nyilat?</summary>

A specifikáció hiányos lesz: nem tudni, mit tegyen a gép abban az esetben, és a megvalósítás „véletlenszerűen” fog viselkedni (amit éppen az egyszerűsítés kiad). Minden állapotból minden bemeneti kombinációra meg kell adni a következő állapotot – akkor is, ha az a helyben maradás.

</details>

<details>
<summary>5. Mikor érdemes Gray-kódolást választani?</summary>

Ha az állapotgép jellemzően egymás utáni állapotokon halad végig (számlálószerűen): ekkor lépésenként csak egy flip-flop vált, ami kisebb fogyasztást és kevesebb hazárdot jelent az állapotkódból dekódolt jeleken.

</details>

## Összefoglaló feladatlap

```quiz required
? Egy állapotgép kimenete y = Q1 · x, ahol Q1 állapotváltozó, x bemenet. Milyen gép ez?
- Moore-gép
+ Mealy-gép
- kombinációs hálózat
- aszinkron számláló

? Legalább hány flip-flop kell egy 10 állapotú géphez bináris kódolással?
= 4

? Egy egyetlen D flip-flopos gép állapota minden órajelnél megfordul, ha x = 1, és változatlan marad, ha x = 0. Töltsd ki az állapottáblát (DN a következő állapot)!
table: D, X -> DN = D ⊕ X

? A „101” Moore-felismerő (A, B, C, D állapotok) A-ból indul, és sorban 1, 1, 0, 1 érkezik. Melyik állapotban lesz?
= D
! A → B → B → C → D.

? A „101” Mealy-felismerő bemenetére sorban 1, 0, 1, 1, 0, 1 érkezik. Mi a kimeneti sorozat? (Írd egybe!)
= 001001

? A „101” Moore-felismerő kódolása: A = 00, B = 01, C = 10, D = 11 (Q1 Q0). Add meg az y kimenet függvényét!
expr: Q1, Q0 -> Q1·Q0
! Csak a D állapot kimenete 1.

? Mi a szabály az állapotgráf felrajzolásakor?
- Minden állapotból pontosan egy nyíl indulhat.
+ Minden állapotból minden bemeneti kombinációra meg kell adni a következő állapotot.
- A kezdőállapotba nem vezethet nyíl.
- Csak Moore-gépnek lehet állapotgráfja.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Állapotgép futtatása táblázatból.** Írd meg a `futtat(atmenet, kezdo, bemenetek)` függvényt, ahol `atmenet` egy szótár: `(állapot, bemenet) → következő állapot`. Add vissza a bejárt állapotok listáját (a kezdőállapottal együtt)!

```python starter
def futtat(atmenet, kezdo, bemenetek):
    return [kezdo]
```

<details>
<summary>Megoldás</summary>

```python solution
def futtat(atmenet, kezdo, bemenetek):
    allapot, ut = kezdo, [kezdo]
    for b in bemenetek:
        allapot = atmenet[(allapot, b)]     # a táblázat mondja meg, hová lépünk
        ut.append(allapot)
    return ut
```

</details>

```python test
# közlekedési lámpa: a "t" (idő letelt) bemenetre lép tovább, "-"-ra marad
lampa = {("piros", "t"): "piros-sárga", ("piros-sárga", "t"): "zöld",
         ("zöld", "t"): "sárga", ("sárga", "t"): "piros"}
for a in ["piros", "piros-sárga", "zöld", "sárga"]:
    lampa[(a, "-")] = a
assert futtat(lampa, "piros", ["t", "-", "t", "t", "t"]) == \
    ["piros", "piros-sárga", "piros-sárga", "zöld", "sárga", "piros"]
print("Minden ellenőrzés sikeres!")
```

**2.** **Átlapolódó sorozatfelismerő.** Írd meg a `szamol_101(bitek)` függvényt, amely egy állapotgéppel (nem szövegkereséssel!) megszámolja, hányszor fordul elő a „101” minta a bitsorozatban, **átlapolódással** (az „10101”-ben kétszer)!

```python starter
def szamol_101(bitek):
    return bitek.count("101")
```

<details>
<summary>Megoldás</summary>

A Python `count` függvénye nem számol átlapolódást, ezért kapsz vele „10101”-re 1-et. Az állapotgép a minta végén nem az elejére, hanem az „1” állapotba ugrik vissza – ez az átlapolódás titka.

```python solution
def szamol_101(bitek):
    # állapot = a minta eddig megtalált eleje: "", "1", "10"
    allapot, db = "", 0
    for b in bitek:
        if allapot == "":
            allapot = "1" if b == "1" else ""
        elif allapot == "1":
            allapot = "10" if b == "0" else "1"
        else:                                   # "10"
            if b == "1":
                db += 1
                allapot = "1"                   # átlapolódás: a záró 1-es új minta eleje
            else:
                allapot = ""
    return db
```

</details>

```python test
assert szamol_101("10101") == 2
assert szamol_101("1101011010") == 3
assert szamol_101("1001") == 0
assert szamol_101("101101") == 2
print("Minden ellenőrzés sikeres!")
```

**3.** **Hány flip-flop kell?** Írd meg az `ff_szam(allapotok, kodolas)` függvényt, amely megadja, hány flip-flop kell adott számú állapothoz `"binaris"`, `"gray"` vagy `"onehot"` kódolással!

```python starter
def ff_szam(allapotok, kodolas):
    return allapotok
```

<details>
<summary>Megoldás</summary>

```python solution
def ff_szam(allapotok, kodolas):
    if kodolas == "onehot":
        return allapotok                       # állapotonként egy flip-flop
    n = 0
    while 2 ** n < allapotok:                  # bináris és Gray: ⌈log2 N⌉
        n += 1
    return max(n, 1)
```

</details>

```python test
assert ff_szam(5, "binaris") == 3
assert ff_szam(5, "gray") == 3
assert ff_szam(5, "onehot") == 5
assert ff_szam(16, "binaris") == 4
assert ff_szam(17, "binaris") == 5
assert ff_szam(2, "binaris") == 1
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Mitől függ a kimenet egy Moore-gépben?
+ csak az aktuális állapottól
- az állapottól és a bemenettől
- csak a bemenettől
! A Mealy-gép kimenete függ a bemenettől is.

? Melyik modell reagál egy órajellel hamarabb a bemenetre?
- Moore
+ Mealy
- egyforma
! A Mealy-gép kimenete azonnal változhat a bemenettel, a Moore-é csak az állapotváltás után.

? Hány állapot kell egy átlapolódó „101” felismerő Moore-géphez?
= 4
! Kezdő, „1”, „10” és „101” (ez utóbbi adja az 1-es kimenetet).

? Mi a one-hot kódolás jellemzője?
+ mindig pontosan egy flip-flop értéke 1
- a legkevesebb flip-flopot igényli
- szomszédos állapotok között egy bit vált
! Sok flip-flop, de nagyon egyszerű következőállapot-logika.

? Mi a teendő a nem használt bináris kódokkal (pl. 5 állapotnál a 101, 110, 111)?
- semmi, sosem fordulhatnak elő
+ biztosítani kell, hogy belőlük a gép egy érvényes állapotba jusson (önindulás)
- törölni kell őket a flip-flopokból
! Zavar vagy bekapcsolás után a gép tiltott állapotba kerülhet.
```
