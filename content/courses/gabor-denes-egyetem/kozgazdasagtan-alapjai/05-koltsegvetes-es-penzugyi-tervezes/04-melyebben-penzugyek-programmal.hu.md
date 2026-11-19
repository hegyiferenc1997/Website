---
title: Mélyebben – pénzügyek programmal
summary: Egy lakáshitel havi törlesztője és teljes költsége 10, 20 és 30 éves futamidőre, a törlesztési terv (miért fizetünk eleinte szinte csak kamatot), havi megtakarítás egy célhoz, és a fiskális multiplikátor körről körre kiszámolva.
minutes: 40
---

## Amit ebben a leckében megtanulsz

- hogyan számolja ki a bank a **havi törlesztőt** (annuitás),
- miért csökken **lassan** a tartozás egy hosszú hitel elején,
- mennyit kell havonta **félretenni** egy célhoz, és mennyit segít a kamat,
- hogyan **sokszorozódik** meg az állami költés a gazdaságban.

## 1. A havi törlesztő és a futamidő ára

Egy 20 millió forintos lakáshitel évi 6,5%-os kamattal. A bank **annuitásos** törlesztést kér: minden hónapban ugyanannyit fizetünk, $A = H \cdot \frac{i}{1 - (1 + i)^{-n}}$, ahol $i$ a havi kamatláb, $n$ a hónapok száma:

```python run
# Annuitásos hitel: 20 millió Ft lakáshitel évi 6,5%-os kamattal – mennyi a havi törlesztő?
def torleszto(hitel, eves_kamat, ev):
    i = eves_kamat / 100 / 12                  # havi kamatláb
    n = ev * 12                                # hónapok száma
    return hitel * i / (1 - (1 + i) ** -n)     # annuitásképlet

hitel = 20_000_000
for ev in [10, 20, 30]:
    havi = torleszto(hitel, 6.5, ev)
    osszes = havi * ev * 12
    print(f"{ev} év: havi {havi:>9,.0f} Ft | összesen {osszes:>12,.0f} Ft | ebből kamat {osszes - hitel:>12,.0f} Ft")
```

A hosszabb futamidő kisebb havi terhet jelent, de **sokkal drágább**: 30 év alatt a kamat több, mint a felvett összeg! 10 helyett 30 év: havonta 100 ezer forinttal kevesebb, összesen viszont 18 millióval több. A jó döntés a havi terhelhetőségtől függ – ökölszabály, hogy a törlesztők ne vigyék el a nettó jövedelem harmadánál-felénél többet (Magyarországon ezt jogszabály is korlátozza, ez a JTM-szabály).

## 2. A törlesztési terv: hová megy a pénz?

```python run
# Törlesztési terv: a havi részlet mekkora része kamat és mekkora tőke?
hitel, i, n = 20_000_000, 0.065 / 12, 240
havi = hitel * i / (1 - (1 + i) ** -n)
tartozas = hitel
for honap in range(1, n + 1):
    kamat = tartozas * i                       # a még fennálló tartozás után jár kamat
    toke = havi - kamat                        # a többi csökkenti a tartozást
    tartozas -= toke
    if honap in (1, 2, 60, 120, 180, 240):
        print(f"{honap:>3}. hónap: kamat {kamat:>8,.0f} | tőke {toke:>8,.0f} | hátralévő tartozás {max(tartozas, 0):>12,.0f}")
```

Az első hónapban a 149 ezres részletből **108 ezer kamat**, és csak 41 ezer csökkenti a tartozást. 5 év (60 részlet, kb. 9 millió Ft befizetés) után is még 17 millió a tartozás! A kamat mindig a **fennálló** tartozás után jár, ezért a vége felé fordul a helyzet: az utolsó részlet szinte teljesen tőke.

```plot
title: Hátralévő tartozás (millió Ft) egy 20 éves, 20 milliós hitelnél
x: 0, 20
y: 0, 20
param: r = 6.5, 1, 12, 0.5
f: 20*((1 + r/1200)^240 - (1 + r/1200)^(12*x))/((1 + r/1200)^240 - 1) # tartozás
```

Húzd a kamatlábat: minél magasabb, annál „hasasabb” a görbe – annál tovább tart, míg érdemben csökken a tartozás. Ezért éri meg különösen a futamidő **elején** előtörleszteni: minden előtörlesztett forint után a teljes hátralévő futamidőre megspóroljuk a kamatot.

## 3. Megtakarítási cél

3 év múlva 3 millió forintra van szükséged (pl. önerő, autó). Évi 4%-os kamatozású megtakarítással:

```python run
# Megtakarítási cél: mennyit kell havonta félretenni, hogy 3 év múlva 3 millió Ft-unk legyen?
cel, eves_kamat, ev = 3_000_000, 4.0, 3
i, n = eves_kamat / 100 / 12, ev * 12
havi = cel * i / ((1 + i) ** n - 1)           # a gyűjtőjáradék képletéből
print(f"kamattal: havi {havi:,.0f} Ft (kamat nélkül {cel / n:,.0f} Ft kellene)")

# ellenőrzés hónapról hónapra
egyenleg = 0.0
for _ in range(n):
    egyenleg = egyenleg * (1 + i) + havi      # kamatozik, aztán befizetünk
print(f"egyenleg 36 hónap után: {egyenleg:,.0f} Ft, ebből befizetés {havi * n:,.0f}, kamat {egyenleg - havi * n:,.0f}")
```

A kamat a 3 millióból kb. 171 ezret ad hozzá – ennyivel kevesebbet kell befizetni. Hosszabb távon (pl. 30 év, nyugdíj) a kamatos kamat hatása drámai: ott a végösszeg nagyobb része már a kamatból jön. A tanulság: **minél korábban** kezdesz, annál többet dolgozik helyetted a pénz. Fontos viszont a **reálkamat**: ha az infláció 4%, akkor a 4%-os kamat csak megőrzi a pénz értékét.

## 4. A multiplikátor körről körre

Az állam 100 milliárd forinttal többet költ (pl. útépítésre). Ez valakinek jövedelem – aki ennek egy részét elkölti, és ez megint valaki más jövedelme lesz, és így tovább:

```python run
# Fiskális multiplikátor körökben: az állam 100 milliárddal többet költ
def multiplikator_korok(kiadas, c, korok=30):
    osszes, kor = 0.0, kiadas
    for k in range(korok):
        osszes += kor                          # ez a kör jövedelemként megjelenik valakinél
        kor *= c                               # ebből c részt elköltenek – ez a következő kör
    return osszes

for c, nev in [(0.8, "zárt gazdaság, adó nélkül"), (0.5, "adóval és importtal, szivárgással")]:
    print(f"c = {c} ({nev}): össz hatás ≈ {multiplikator_korok(100, c):.0f} mrd, képlettel 1/(1 − c) · 100 = {100 / (1 - c):.0f}")
```

Ha mindenki a jövedelme 80%-át költi el ($c = 0{,}8$), a teljes hatás $\frac{1}{1 - c} = 5$-szörös: 500 milliárd. A valóságban azonban a pénz egy része **kiszivárog**: adóként visszamegy az államhoz, külföldi termékekre (import) költik, vagy megtakarítják. Egy kis, nyitott gazdaságban, mint a magyar, ezért a multiplikátor jóval kisebb (itt 2). Ez a gondolat két irányban is működik: egy **megszorítás** is többszörösen csökkenti a keresletet.

## Összefoglalás

- Annuitás: $A = H \cdot \frac{i}{1 - (1 + i)^{-n}}$; hosszabb futamidő → kisebb részlet, de sokkal több kamat.
- A törlesztés elején a részlet nagy része kamat; az előtörlesztés a futamidő elején ér a legtöbbet.
- Megtakarításnál a kamatos kamat annál jobban segít, minél korábban kezded – de a reálkamat számít.
- Fiskális multiplikátor: $\frac{1}{1 - c}$; a szivárgások (adó, import, megtakarítás) csökkentik.

## A lecke feladata

```quiz required
? Hogyan hat a futamidő meghosszabbítása egy annuitásos hitelnél?
- nő a havi részlet és nő a teljes kamat
+ csökken a havi részlet, de nő a teljes kamat
- csökken a havi részlet és csökken a teljes kamat
- semmi nem változik
! A hosszabb ideig fennálló tartozás után több kamat jár.

? Egy 12 millió Ft-os hitel kamata évi 6%. Mennyi kamatot kell fizetni az első hónapban (Ft)?
= 60000
! $12\,000\,000 \cdot \frac{0{,}06}{12} = 60\,000$ Ft.

? Mennyi a fiskális multiplikátor, ha a fogyasztási határhajlandóság $c = 0{,}75$?
= 4
! $\frac{1}{1 - 0{,}75} = 4$.

? A betéti kamat 5%, az infláció 3%. Kb. hány százalék a reálkamat?
= 2
! Közelítőleg $5 - 3 = 2\%$ (pontosan $\frac{1{,}05}{1{,}03} - 1 \approx 1{,}94\%$).

? A 72-es szabály szerint évi 6%-os hozammal kb. hány év alatt duplázódik meg a pénz?
= 12
! $72 / 6 = 12$ év.
```
