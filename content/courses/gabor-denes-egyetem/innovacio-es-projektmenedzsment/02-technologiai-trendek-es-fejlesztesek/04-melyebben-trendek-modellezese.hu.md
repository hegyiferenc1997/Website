---
title: Mélyebben – trendek modellezése
summary: Moore törvénye mint exponenciális növekedés (és hol a határa), a technológiai S-görbe évenkénti javulása, valamint a Bass-féle diffúziós modell, amely megmutatja, hogyan terjed el egy új termék az újítók és az utánzók révén – kis szimulációkkal és interaktív ábrával.
minutes: 40
---

## Amit ebben a leckében megtanulsz

- hogyan számolj **exponenciális** trenddel (Moore törvénye), és miért veszélyes vakon előre vetíteni,
- hogyan olvasd le az **S-görbéről**, mikor érdemes új technológiára váltani,
- hogyan modellezi a **Bass-modell** egy új termék elterjedését, és hol van a legtöbb új felhasználó.

## 1. Moore törvénye: duplázódás kétévente

Gordon Moore 1965-ös megfigyelése (1975-ös pontosítással): egy chipen lévő tranzisztorok száma **kb. kétévente megduplázódik**. Az első mikroprocesszor, az Intel 4004 (1971) kb. 2300 tranzisztort tartalmazott. Vetítsük előre:

```python run
# Moore törvénye: a tranzisztorszám kétévente duplázódik, kiindulás: Intel 4004 (1971), 2300 tranzisztor
alap_ev, alap_db = 1971, 2300

def moore(ev, duplazasi_ido=2):
    return alap_db * 2 ** ((ev - alap_ev) / duplazasi_ido)   # exponenciális növekedés

def szam(x):
    return f"{x:,.0f}".replace(",", " ")                     # ezres tagolás szóközzel

for ev in [1971, 1981, 1991, 2001, 2011, 2021]:
    print(f"{ev}: kb. {szam(moore(ev)):>14} tranzisztor")

# Ha 2 helyett 3 év lenne a duplázási idő, mennyi lenne 2021-ben?
print(f"\n3 éves duplázással 2021-ben: {szam(moore(2021, 3))}")
```

A modell 2021-re kb. 77 milliárdot jósol – a valóságban az akkori csúcskategóriás chipek néhány tízmilliárd tranzisztort tartalmaztak, tehát **ötven év után is nagyságrendileg** stimmel. Ez az exponenciális trendek ereje. Két tanulság:

- a duplázási idő apró eltérése óriási különbséget okoz (3 évvel több mint háromszázszor kevesebb jönne ki),
- a fizikai határok (atomi méretek, hőtermelés) miatt a duplázás lassul; az iparág ma már inkább **több mag, speciális gyorsítók (GPU, NPU) és 3D-tokozás** révén növeli a teljesítményt. Egy trendet sosem szabad a végtelenségig meghosszabbítani.

## 2. A technológiai S-görbe

Egy technológia teljesítménye az idő (vagy a befektetett fejlesztési erőfeszítés) függvényében gyakran **S alakú**: eleinte lassan javul, aztán gyorsan, végül elér egy természetes határt. A **logisztikus függvény** jól leírja:

```python run
# Technológiai S-görbe: teljesítmény = határ / (1 + e^(−k (t − t0))), és az évenkénti javulás
import math

hatar, k, t0 = 100, 0.6, 10          # természetes határ, meredekség, az inflexiós pont éve

def teljesitmeny(t):
    return hatar / (1 + math.exp(-k * (t - t0)))

elozo = teljesitmeny(0)
for t in range(2, 21, 2):
    most = teljesitmeny(t)
    print(f"{t:>2}. év: teljesítmény {most:5.1f}   javulás az elmúlt 2 évben: {most - elozo:5.1f}")
    elozo = most
```

A javulás az inflexiós pont körül (itt a 10. év) a **legnagyobb**, utána csökken: ugyanannyi fejlesztési pénz egyre kevesebb előrelépést hoz. Ez a jel, hogy érdemes figyelni a **következő S-görbét** – egy új technológiát, amely ma még gyengébb, de nagyobb a határa (pl. HDD → SSD, 4G → 5G). Aki túl sokáig ragaszkodik a régi görbéhez, azt az új technológia lehagyja.

## 3. A Bass-modell: hogyan terjed el egy új termék?

Frank Bass modellje szerint egy új termék vásárlói kétféle okból döntenek:

- **újítók** (innovátorok): a reklám, a saját kíváncsiságuk hatására – arányuk $p$ (tipikusan 0,01–0,03),
- **utánzók**: mert látják, hogy mások már használják – ez arányos a már meglévő felhasználók arányával, $q$ (tipikusan 0,3–0,5).

Egy időszakban az új vásárlók száma: $\left(p + q \cdot \frac{N}{M}\right)(M - N)$, ahol $N$ az eddigi vásárlók, $M$ a piac teljes mérete.

```python run
# Bass-féle diffúziós modell: új vásárlók = (p + q · N/M) · (M − N)
M, p, q = 1_000_000, 0.03, 0.38       # piac mérete, újító és utánzó együttható
N = 0                                 # eddigi vásárlók
legtobb = (0, 0)
szam = lambda x: f"{x:,.0f}".replace(",", " ")   # ezres tagolás szóközzel
for ev in range(1, 16):
    ujitok = p * (M - N)
    utanzok = q * N / M * (M - N)
    uj = ujitok + utanzok
    N += uj
    legtobb = max(legtobb, (uj, ev))
    if ev <= 10 or ev == 15:
        print(f"{ev:>2}. év: új {szam(uj):>7} (újító {szam(ujitok):>6}, utánzó {szam(utanzok):>6}), összesen {N / M:6.1%}")
print(f"\na legtöbb új vásárló a(z) {legtobb[1]}. évben jött: {szam(legtobb[0])}")
```

Az első években az újítók dominálnak, de kevesen vannak; aztán a **szájhagyomány** (az utánzók) beindítja a gyors növekedést, végül a piac telítődik. Az összesített görbe megint **S alakú** – ez Rogers diffúziós görbéjének matematikai változata. A gyakorlati tanulság: egy új termék sikerét nem a reklám ($p$), hanem leginkább a felhasználók közötti terjedés ($q$) dönti el – ezért fontos az ajánlási program, a közösség és a jó első élmény.

```plot
title: A Bass-modell: a piac hányada, amely már vásárolt (p = 0,03)
x: 0, 20
y: 0, 1
param: q = 0.38, 0.05, 0.8, 0.01
f: (1 - e^(-(0.03 + q)*x))/(1 + (q/0.03)*e^(-(0.03 + q)*x)) # összesített elterjedtség
dash: 0.5 # a piac fele
```

Mozgasd a $q$ csúszkát: erős szájhagyománynál (nagy $q$) a termék gyorsan meredeken terjed el, gyengénél lassan „csordogál”.

## Összefoglalás

- Moore törvénye exponenciális trend: $N(t) = N_0 \cdot 2^{(t - t_0)/2}$; a duplázási idő kis változása óriási eltérést okoz, és minden trendnek van határa.
- A technológiai S-görbén a javulás az inflexiós pontnál a legnagyobb; utána érdemes a következő görbét keresni.
- A Bass-modellben az új vásárlók $= (p + q \cdot N/M)(M - N)$; az elterjedést főleg az utánzás ($q$) hajtja.

## A lecke feladata

```quiz required
? Ha egy chip tranzisztorszáma kétévente duplázódik, hányszorosára nő 10 év alatt?
= 32
! $2^{10/2} = 2^5 = 32$.

? Az S-görbe melyik szakaszában hoz egységnyi fejlesztés a legnagyobb javulást?
- a legelején
+ az inflexiós pont környékén, a görbe közepén
- a végén, a határ közelében
- mindenhol ugyanannyit
! A logisztikus görbe ott a legmeredekebb.

? A Bass-modellben $M = 1000$, $N = 200$, $p = 0{,}02$, $q = 0{,}4$. Hány új vásárló jön a következő időszakban?
= 80
! $(0{,}02 + 0{,}4 \cdot 0{,}2) \cdot 800 = 0{,}1 \cdot 800 = 80$.

? Mit jelent a Bass-modellben a $q$ együttható?
- a reklám hatását
+ az utánzás, a szájhagyomány erősségét
- a piac méretét
- a termék árát
! Az utánzók azért vásárolnak, mert mások már használják.

? Miért veszélyes egy exponenciális trendet (pl. Moore törvényét) korlátlanul előre vetíteni?
- mert az exponenciális függvény csökkenő
+ mert a valóságban fizikai, gazdasági határok lassítják a növekedést
- mert a múltbeli adatok mindig hibásak
- mert az exponenciális trendek csak 1 évig érvényesek
! Minden növekedés előbb-utóbb korlátba ütközik (S-görbe).
```
