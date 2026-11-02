---
title: Utasítások és programfuttatás
summary: Az utasításciklus (fetch–decode–execute), utasításformátum és címzési módok, utasításfajták, verem és szubrutin, megszakítás, CISC és RISC, pipeline.
minutes: 35
---

## Amit ebben a leckében megtanulsz

- hogyan hajt végre a processzor egy utasítást (**utasításciklus**),
- az **utasításformátumot** és a **címzési módokat**,
- az utasítások **fajtáit**, a **verem** és a **szubrutinhívás** működését,
- mi a **megszakítás** (interrupt),
- a **CISC** és a **RISC** filozófiát és a **pipeline**-t.

## Az utasításciklus

A processzor egyetlen dolgot ismétel a bekapcsolástól a kikapcsolásig:

1. **Lehívás (fetch):** a PC által mutatott címről beolvassa az utasítást az IR-be, és a PC-t a következő utasításra lépteti.
2. **Dekódolás (decode):** a vezérlőegység értelmezi a műveleti kódot, és kiolvassa az operandusokat.
3. **Végrehajtás (execute):** az ALU elvégzi a műveletet, az eredmény regiszterbe vagy memóriába kerül (write back).

Egy ugróutasítás egyszerűen **felülírja a PC-t** – így a következő lehívás máshonnan történik.

## Utasításformátum és nyelvi szintek

Egy gépi utasítás egy **műveleti kódból** (opcode – *mit* csináljon) és **operandus(ok)ból** (*mivel*) áll. A processzor csak a bináris **gépi kódot** érti; ennek ember által olvasható alakja az **assembly** (pl. `ADD R1, R2`), a magas szintű nyelveket (C, Python) fordító- vagy értelmezőprogram alakítja gépi kóddá.

## Címzési módok

Hol van az operandus?

| címzési mód      | példa (szimbolikus) | jelentés                                         |
| ---------------- | ------------------- | ------------------------------------------------ |
| **közvetlen adat** (immediate) | `LOAD #5`  | az operandus **maga az utasításban** van: 5     |
| **direkt** (abszolút) | `LOAD 200`     | a **200-as memóriacímen** lévő érték             |
| **regiszteres**  | `ADD R1, R2`        | az operandus egy regiszterben van                |
| **indirekt**     | `LOAD (R1)`         | R1 tartalma a **cím**, onnan olvas (mutató)      |
| **indexelt**     | `LOAD 100(R2)`      | cím = 100 + R2 (tömbök bejárása)                 |
| **relatív**      | `JMP +8`            | cím = PC + 8 (ugrások)                           |

## Az utasítások fajtái

- **Adatmozgató:** LOAD, STORE, MOV, PUSH, POP.
- **Aritmetikai:** ADD, SUB, INC, DEC, MUL, CMP (összehasonlítás = kivonás, csak a flag-ek változnak).
- **Logikai és léptető:** AND, OR, XOR, NOT, SHL, SHR.
- **Vezérlésátadó:** JMP (feltétel nélküli), feltételes ugrások (pl. JZ – ugorj, ha Z = 1), CALL és RET.
- **Egyéb:** megszakítás tiltása/engedélyezése, NOP, HALT/SLEEP.

## Verem és szubrutin

A **verem** (stack) a memória egy területe, amely **LIFO** (last in, first out – utoljára be, elsőként ki) elven működik; a tetejét az **SP** mutatja.

- **CALL** szubrutin: a **visszatérési címet** (a PC aktuális értékét) a verembe menti (PUSH), majd a szubrutin címére ugrik.
- **RET**: kiveszi a visszatérési címet a veremből (POP) a PC-be.

Mivel verem, a szubrutinok **egymásba ágyazhatók** (sőt rekurzívak is lehetnek).

## Megszakítás (interrupt)

Egy periféria (időzítő, gombnyomás, beérkezett soros adat) **megszakításkéréssel** jelezheti, hogy kiszolgálást kér. A processzor:

1. befejezi az aktuális utasítást,
2. elmenti a PC-t és az állapotregisztert (a verembe),
3. a **megszakításvektor** alapján a kiszolgáló rutinra (**ISR**) ugrik,
4. a rutin végén (RETI) visszaállítja a mentett állapotot, és ott folytatja, ahol abbahagyta.

Így nem kell a processzornak folyamatosan „kérdezgetnie” a perifériát (**polling**) – energiát és időt takarít meg. Több egyidejű kérés között **prioritás** dönt (prioritáskóder, 4. témakör).

## CISC és RISC

|                      | **CISC** (complex instruction set)                  | **RISC** (reduced instruction set)                   |
| -------------------- | --------------------------------------------------- | ---------------------------------------------------- |
| utasítások           | sok, összetett, változó hosszúságú                  | kevés, egyszerű, **fix hosszúságú**                  |
| memória-hozzáférés   | sok utasítás közvetlenül memóriával dolgozik        | csak LOAD és STORE éri el a memóriát (load/store)    |
| végrehajtás          | több órajel / utasítás                              | jellemzően **1 utasítás / órajel** (pipeline)        |
| példa                | x86 (Intel, AMD)                                    | ARM, RISC-V, AVR                                     |

## Pipeline (futószalag)

A végrehajtás szakaszokra bontható (pl. lehívás – dekódolás – végrehajtás – memória – visszaírás). Mint egy futószalagon, **minden szakasz egyszerre egy másik utasításon dolgozik**. Egy 5 fokozatú pipeline-on egy utasítás továbbra is 5 órajel alatt halad át, de **órajelenként egy utasítás fejeződik be**.

n utasítás k fokozatú pipeline-on: **k + (n − 1)** órajel (pipeline nélkül k · n). Pl. 10 utasítás, 5 fokozat: 5 + 9 = **14** órajel (50 helyett).

Veszélyek (hazárdok) itt is vannak: **adatfüggés** (egy utasítás az előző eredményére vár), **vezérlési** hazárd (ugrásnál a már lehívott utasítások feleslegesek – ezt az **elágazásbecslés** enyhíti).

```python run
# Egy egyszerű akkumulátoros gép programjának futtatása
program = [
    ("LOAD", 5),     # A = 5
    ("ADD", 3),      # A = A + 3
    ("SHL", None),   # A = A * 2 (balra léptetés)
    ("SUB", 4),      # A = A - 4
    ("HALT", None),
]

a, pc = 0, 0                                # akkumulátor és utasításszámláló
while True:
    muvelet, operandus = program[pc]        # lehívás
    pc += 1
    if muvelet == "LOAD":                   # dekódolás és végrehajtás
        a = operandus
    elif muvelet == "ADD":
        a += operandus
    elif muvelet == "SUB":
        a -= operandus
    elif muvelet == "SHL":
        a <<= 1
    elif muvelet == "HALT":
        break
    print(f"{muvelet:5} → A = {a}")
```

## Összefoglalás

- Utasításciklus: lehívás → dekódolás → végrehajtás; az ugrás a PC-t írja felül.
- Címzési módok: közvetlen adat, direkt, regiszteres, indirekt, indexelt, relatív.
- Verem (LIFO, SP): CALL elmenti, RET visszaállítja a visszatérési címet.
- Megszakítás: mentés → ISR → visszatérés; polling helyett.
- RISC: egyszerű, fix hosszú utasítások, load/store; pipeline: k + (n − 1) órajel.

## A lecke feladata

```quiz required
? Milyen sorrendben követik egymást az utasításciklus lépései?
- dekódolás → lehívás → végrehajtás
+ lehívás → dekódolás → végrehajtás
- végrehajtás → lehívás → dekódolás
- lehívás → végrehajtás → dekódolás

? A `LOAD #5` utasításban milyen címzési mód szerepel?
+ közvetlen adat (immediate) – az 5 maga az operandus
- direkt – az 5-ös memóriacím tartalma
- indirekt – az 5-ös regiszter által mutatott cím
- relatív – PC + 5

? A leckebeli akkumulátoros gép a következő programot futtatja: LOAD 6, ADD 2, SHL, SUB 5, HALT. Mennyi az akkumulátor értéke a végén?
= 11
! (6 + 2) · 2 − 5.

? Hány órajel alatt fut le 10 utasítás egy 5 fokozatú pipeline-on (ideális esetben)?
= 14
! k + (n − 1).

? Milyen elven működik a verem?
- FIFO – elsőként be, elsőként ki
+ LIFO – utoljára be, elsőként ki
- véletlen elérésű
- csak olvasható

? Mi jellemző a RISC processzorokra?
- Sok összetett, változó hosszúságú utasítás.
+ Kevés, egyszerű, fix hosszúságú utasítás; csak a LOAD és STORE éri el a memóriát.
- Nincsenek regisztereik.
- Nem használnak pipeline-t.

? Mit csinál a processzor egy megszakításkérésnél?
- Azonnal, az utasítás közepén leáll, és újraindul.
+ Befejezi az utasítást, elmenti az állapotot, a kiszolgáló rutinra ugrik, majd visszatér.
- Figyelmen kívül hagyja, amíg a program véget nem ér.
- Törli a memóriát.
```
