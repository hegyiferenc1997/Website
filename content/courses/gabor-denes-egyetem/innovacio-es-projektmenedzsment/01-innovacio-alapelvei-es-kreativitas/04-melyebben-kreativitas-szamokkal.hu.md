---
title: Mélyebben – kreativitás számokkal
summary: A morfológiai doboz kombinatorikája egy tanulós app példáján, miért kell sok ötlet (az „legalább egy jó ötlet” valószínűsége), és a konvergens szakasz súlyozott pontozással – kis programokkal és egy interaktív ábrával.
minutes: 35
---

## Amit ebben a leckében megtanulsz

- hogyan **sokszorozza meg** az ötleteket a morfológiai doboz, és miért kell utána szűrni,
- miért igaz számokkal is, hogy **a mennyiség minőséget szül** az ötletelésben,
- hogyan válassz az ötletek közül **átlátható pontozással**, és miért érdemes megnézni, mennyire érzékeny a döntés a súlyokra.

## 1. A morfológiai doboz: kombinációk robbanása

A **morfológiai doboz** (Zwicky-doboz) egy rendszerezett ötletelő technika: felbontod a terméket **jellemzőkre**, mindegyikhez felsorolsz néhány lehetőséget, majd összekombinálod őket. Legyen a feladat egy egyetemistáknak szóló tanulós alkalmazás:

```python run
# Morfológiai doboz: minden jellemzőhöz néhány lehetőség, az ötletek a kombinációk
import itertools, random

doboz = {
    "platform": ["mobilapp", "webes felület", "chatbot"],
    "fő funkció": ["kártyás ismétlés", "csoportos tanulás", "AI-magyarázó", "vizsganaptár"],
    "bevétel": ["előfizetés", "freemium", "egyetemi licenc"],
    "célcsoport": ["elsőévesek", "vizsgázók", "doktoranduszok"],
}

kombinaciok = list(itertools.product(*doboz.values()))   # minden lehetséges összeállítás
print(f"lehetséges ötletek száma: {len(kombinaciok)}  (= 3 · 4 · 3 · 3)")

random.seed(7)                                          # rögzített véletlen, hogy mindig ugyanaz jöjjön ki
print("\nnéhány véletlen ötlet a dobozból:")
for otlet in random.sample(kombinaciok, 4):
    print(" –", " + ".join(otlet))
```

Négy jellemző és néhány lehetőség már **108** ötletet ad – ennyit egy ötletroham ritkán hoz. A doboz ereje, hogy olyan párosításokat is elénk tesz, amelyekre magunktól nem gondolnánk (pl. „chatbot + vizsganaptár + egyetemi licenc + doktoranduszok”). Ugyanakkor a szám **szorzással** nő: egy ötödik, 5 lehetőségű jellemzővel már 540 ötlet lenne. Ezért kell a divergens szakasz után egy **konvergens** szakasz, amely szűr és rangsorol (lásd a 3. részt).

## 2. Miért kell sok ötlet?

Tegyük fel, hogy egy ötlet $p$ valószínűséggel „igazán jó”. Ha $n$ egymástól független ötletünk van, annak az esélye, hogy **legalább egy** jó van köztük:

$$
P(\text{legalább egy jó}) = 1 - (1 - p)^n.
$$

```python run
# Legalább egy jó ötlet valószínűsége n ötletből, ha egy ötlet p eséllyel jó
for p in [0.02, 0.05, 0.10]:
    sor = "  ".join(f"n={n:>3}: {1 - (1 - p) ** n:5.1%}" for n in [5, 20, 50, 100])
    print(f"p = {p:.0%} | {sor}")

# Hány ötlet kell ahhoz, hogy 90% eséllyel legyen köztük jó, ha p = 5%?
n = 1
while 1 - (1 - 0.05) ** n < 0.9:
    n += 1
print(f"\n90%-os biztonsághoz p = 5% mellett {n} ötlet kell")
```

Ha minden huszadik ötlet jó ($p = 5\%$), 5 ötletből csak kb. 23% eséllyel akad jó, 50-ből már 92%-kal; a 90%-os biztonsághoz 45 ötlet kell. Ezért mondják az ötletroham szabályai, hogy **a mennyiség a cél**, és ezért tilos a divergens szakaszban kritizálni: minden elfojtott ötlet csökkenti $n$-et. (A modell egyszerűsít: a valóságban az ötletek nem függetlenek – tíz hasonló ötlet kevesebbet ér, mint tíz különböző. Ezért hasznosak a „kizökkentő” technikák, mint a SCAMPER vagy a hat kalap.)

```plot
title: Legalább egy jó ötlet valószínűsége az ötletek számának függvényében
x: 0, 100
y: 0, 1
param: p = 0.05, 0.01, 0.3, 0.01
f: 1 - (1 - p)^x # P(legalább egy jó)
dash: 0.9 # 90%
```

Mozgasd a csúszkát: minél ritkább a jó ötlet (kis $p$), annál több ötlet kell ugyanahhoz a biztonsághoz.

## 3. A konvergens szakasz: súlyozott pontozás

Az ötleteket **szempontok** szerint pontozzuk (1–5), a szempontokat **súlyozzuk**, és a súlyozott összeg szerint rangsorolunk:

```python run
# Konvergens szakasz: ötletek pontozása súlyozott szempontok szerint (1–5 pont)
otletek = {
    "AI-magyarázó mobilapp": {"érték": 5, "megvalósíthatóság": 2, "újdonság": 5},
    "csoportos tanulás webes": {"érték": 4, "megvalósíthatóság": 4, "újdonság": 3},
    "kártyás ismétlés chatbot": {"érték": 3, "megvalósíthatóság": 5, "újdonság": 2},
}

def rangsor(sulyok):
    pont = {nev: sum(sulyok[sz] * p for sz, p in szempontok.items()) for nev, szempontok in otletek.items()}
    return sorted(pont.items(), key=lambda t: -t[1])      # csökkenő sorrend

for cimke, sulyok in [("kiegyensúlyozott", {"érték": 0.4, "megvalósíthatóság": 0.3, "újdonság": 0.3}),
                      ("gyors indulás", {"érték": 0.3, "megvalósíthatóság": 0.6, "újdonság": 0.1}),
                      ("biztos haszon", {"érték": 0.5, "megvalósíthatóság": 0.4, "újdonság": 0.1})]:
    elso, pont = rangsor(sulyok)[0]
    print(f"{cimke:<16} → győztes: {elso} ({pont:.2f} pont)")
```

Ugyanazokból a pontokból a **súlyoktól függően** mindhárom ötlet lehet győztes. Ez nem a módszer hibája, hanem a lényege: a súlyok a **stratégiát** fejezik ki (gyorsan akarunk piacra lépni, vagy áttörést keresünk?). Jó gyakorlat:

- a súlyokat **a pontozás előtt** rögzítsd, különben könnyű „visszafelé” igazolni a kedvenc ötletet,
- nézd meg, **mennyire érzékeny** a győztes a súlyokra – ha egy kis változás is átrendezi a sorrendet, az ötletek valójában fej fej mellett vannak, és érdemes mindkettőt kipróbálni (pl. egy gyors prototípussal).

## Összefoglalás

- A morfológiai doboz szorzással termel ötleteket: $3 \cdot 4 \cdot 3 \cdot 3 = 108$; a sok ötletet utána szűrni kell.
- Ha egy ötlet $p$ eséllyel jó, $n$ ötletből legalább egy jó: $1 - (1 - p)^n$ – ezért fontos a mennyiség és a kritika tilalma a divergens szakaszban.
- A súlyozott pontozás átlátható döntést ad, de a súlyok a stratégiát tükrözik; érdemes érzékenységet vizsgálni.

## A lecke feladata

```quiz required
? Egy morfológiai dobozban 3 jellemző van: 4, 5 és 2 lehetőséggel. Hány ötlet (kombináció) képezhető?
= 40
! $4 \cdot 5 \cdot 2 = 40$.

? Egy ötlet 10% eséllyel jó. Mennyi annak az esélye, hogy 2 független ötletből legalább egy jó? (tizedes törtként)
= 0,19
= 0.19
! $1 - 0{,}9^2 = 1 - 0{,}81 = 0{,}19$.

? Miért tilos a kritika a divergens szakaszban?
- mert a kritika mindig téves
+ mert minden elfojtott ötlet csökkenti az esélyét, hogy legyen köztük igazán jó
- mert a konvergens szakaszban sem szabad kritizálni
- mert a jó ötletek mindig az elsők között vannak
! A jó ötlet ritka, ezért sok ötlet kell; az azonnali kritika csökkenti a számukat.

? Egy ötlet pontjai: érték 4, megvalósíthatóság 3, újdonság 5; a súlyok 0,5, 0,3 és 0,2. Mennyi a súlyozott pontszám?
= 3,9
= 3.9
! $0{,}5 \cdot 4 + 0{,}3 \cdot 3 + 0{,}2 \cdot 5 = 2 + 0{,}9 + 1 = 3{,}9$.

? Mit érdemes tenni, ha a súlyok kis módosítása is megváltoztatja a győztes ötletet?
- a súlyokat addig állítani, amíg a kedvenc ötlet nyer
+ a két ötletet fej fej mellett lévőnek tekinteni, és gyors prototípussal kipróbálni mindkettőt
- mindig a legolcsóbbat választani
- elvetni mindkét ötletet
! Ilyenkor a pontozás nem dönti el egyértelműen; a kísérlet több információt ad.
```
