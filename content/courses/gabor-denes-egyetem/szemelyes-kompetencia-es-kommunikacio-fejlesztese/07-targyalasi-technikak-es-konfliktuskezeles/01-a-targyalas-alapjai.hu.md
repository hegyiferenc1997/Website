---
title: A tárgyalás alapjai
summary: Mikor tárgyalunk, mi a BATNA, a fenntartási ár és a ZOPA, mit jelent a horgonyzás – egy gyakornoki fizetés és egy szabadúszó projekt példáján.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- mi a **tárgyalás**, és mikor van rá szükség,
- a **BATNA**, a **fenntartási ár** és a **ZOPA** fogalmát,
- mit jelent a **horgonyzás**,
- hogyan **készülj fel** egy tárgyalásra.

## Mi a tárgyalás?

**Tárgyalás**: két vagy több fél kommunikációja, amelynek célja egy olyan **megállapodás**, amely jobb mindegyiküknek, mint a megállapodás hiánya. Nem csak üzleti ügyekben tárgyalunk: a fizetésről, a határidőről, a csapatban a feladatok elosztásáról, sőt a lakótárssal a takarításról is.

## Három kulcsfogalom

### BATNA – a legjobb alternatíva

A **BATNA** (_Best Alternative To a Negotiated Agreement_) az, amit akkor teszel, ha **nem jön létre** a megállapodás. Minél jobb a BATNA-d, annál erősebb a tárgyalási pozíciód.

> Ha két gyakornoki ajánlatod is van, az egyik a másik tárgyalásánál a BATNA-d.

### Fenntartási ár (reservation point)

Az a legrosszabb feltétel, amit még **éppen elfogadsz** – ennél rosszabbnál inkább a BATNA-dat választod.

### ZOPA – a lehetséges megállapodás zónája

A **ZOPA** (_Zone Of Possible Agreement_) az a tartomány, ahol mindkét fél fenntartási ára teljesül.

```text
Szabadúszó webfejlesztés – projektár (ezer Ft)

0        300        600 ═════════ ZOPA ═════════ 900        1200
                     ▲                            ▲
        a fejlesztő legalább ennyit kér    a megrendelő legfeljebb ennyit fizet
```

Ha a fejlesztő legalább 600 ezret kér, a megrendelő legfeljebb 900 ezret fizetne, akkor a ZOPA **600–900 ezer Ft**, a szélessége 300 ezer Ft. Ha a megrendelő csak 500 ezret fizetne, **nincs ZOPA** – nem jön létre üzlet.

```python run
# A lehetséges megállapodás zónája (ZOPA) két fenntartási árból.
elado_minimum = 600   # ezer Ft – ennél kevesebbért nem vállalja
vevo_maximum = 900    # ezer Ft – ennél többet nem fizet

if vevo_maximum >= elado_minimum:
    print(f"ZOPA: {elado_minimum}–{vevo_maximum} ezer Ft")
    print(f"Szélessége: {vevo_maximum - elado_minimum} ezer Ft")
else:
    print("Nincs ZOPA, nem jön létre megállapodás.")
```

Próbáld ki: írd át a `vevo_maximum` értékét 500-ra!

## Horgonyzás

Az **első számnak**, amely elhangzik, erős hatása van a végeredményre – ez a **horgony**. Ha a megrendelő 400 ezerrel nyit, a tárgyalás e körül mozog; ha a fejlesztő 1 millióval, akkor amaz körül.

- Ha jól ismered a piacot, érdemes **elsőként, ambiciózusan, de indokoltan** nyitni.
- Ha a másik nyit egy irreális horgonnyal, ne fogadd el kiindulópontnak: „Ez nagyon messze van a piaci ártól, nézzük, mit tartalmaz pontosan a munka.”

## Felkészülés

1. Mi a **célod**, és mi a **fenntartási árad**?
2. Mi a **BATNA-d** – és hogyan tudnád javítani?
3. Mit gondolsz a **másik fél** BATNA-járól és érdekeiről?
4. Milyen **objektív adatok** támasztják alá az álláspontodat (piaci fizetési felmérések, hasonló projektek ára)?
5. Miben tudsz **engedni**, ami neked olcsó, a másiknak értékes (pl. határidő, home office, referencia)?

## Összefoglalás

- Tárgyalás: közös megállapodás keresése, amely jobb, mint a megállapodás hiánya.
- BATNA: a legjobb alternatíva; fenntartási ár: a még elfogadható határ.
- ZOPA: ahol a felek fenntartási árai átfednek.
- Az első szám horgonyként hat.
- Készülj fel adatokkal, és ismerd a saját és a másik fél alternatíváit.

## A lecke feladata

```quiz required
? Mit jelent a **BATNA**?
- a tárgyalás legjobb lehetséges eredménye
+ a legjobb alternatíva, ha nem jön létre megállapodás
- a másik fél első ajánlata
- a közös megállapodás zónája
! Best Alternative To a Negotiated Agreement.

? Egy gyakornok legalább bruttó 400 ezer Ft-ot kér, a cég legfeljebb 480 ezret fizetne. Hány ezer Ft széles a ZOPA?
= 80
! 480 − 400 = 80.

? A fejlesztő legalább 700 ezret kér, a megrendelő legfeljebb 600 ezret fizetne. Mi a helyzet?
- a ZOPA 600–700 ezer
+ nincs ZOPA, nem jön létre megállapodás
- a ZOPA 100 ezer széles
- a megrendelő BATNA-ja 700 ezer
! A vevő maximuma kisebb, mint az eladó minimuma.

? Mi a **horgonyzás**?
+ az elsőként elhangzó szám erős hatása a tárgyalás végeredményére
- a tárgyalás megszakítása
- a fenntartási ár titokban tartása
- a megállapodás írásba foglalása
! Az első ajánlat kijelöli a kiindulópontot.
```
