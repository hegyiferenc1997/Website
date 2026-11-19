---
title: Gyakorlás – kereskedelem és árfolyamok
summary: Ellenőrző kérdések és összefoglaló feladatlap a komparatív előnyről, a vámokról, az árfolyamváltozások hatásáról és a fizetési mérlegről.
minutes: 60
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. „Egy fejlett ország nem nyerhet a kereskedelemből egy kevésbé fejlett országgal, hiszen mindenben jobb.” Igaz-e?</summary>

Nem. A kereskedelem előnyét a **komparatív** előny adja, nem az abszolút. Ha a fejlett ország arra szakosodik, amiben a legnagyobb az előnye, és a többit importálja, ugyanannyi munkával többet fogyaszthat – és a kevésbé fejlett ország is.

</details>

<details>
<summary>2. Miért ártanak a vámok gyakran éppen azoknak a hazai cégeknek, amelyeket védeni akarnak?</summary>

Mert sok cég importált alapanyagot, alkatrészt használ (pl. chipeket, acélt): a vám ezeket is drágítja, így a hazai feldolgozóipar költségei nőnek. A partnerországok visszavágó vámjai pedig az exportőröket sújtják.

</details>

<details>
<summary>3. Miért gyengülhet a forint egy nemzetközi pénzügyi válság idején, akkor is, ha a magyar gazdaságban semmi sem változott?</summary>

Mert a befektetők válságban kivonják a pénzüket a kockázatosabbnak tartott, kisebb piacokról, és biztonságos devizákba (dollár, svájci frank) menekülnek. A forint iránti kereslet csökken, ezért gyengül.

</details>

<details>
<summary>4. Miért kockázatos a folyó fizetési mérleg tartósan nagy hiánya?</summary>

Mert a hiányt külföldi forrásból (hitel, befektetés) kell finanszírozni. Ha a befektetők bizalma megrendül, a beáramlás hirtelen leállhat, a valuta gyengül, a kamatok emelkednek – az ország válságba kerülhet.

</details>

## Összefoglaló feladatlap

Munkaórák egy egység előállításához:

|              | Chip   | Ruha  |
| ------------ | ------ | ----- |
| **A ország** | 8 óra  | 4 óra |
| **B ország** | 12 óra | 3 óra |

```quiz required
? Melyik országnak van abszolút előnye a chipgyártásban?
+ A
- B
! 8 < 12 óra.

? Hány ruha 1 chip alternatív költsége A-ban?
= 2
! 8 / 4.

? Hány ruha 1 chip alternatív költsége B-ben?
= 4
! 12 / 3.

? Melyik országnak van komparatív előnye a **ruhában**?
- A
+ B
! B-ben 1 ruha = 1/4 chip, A-ban 1/2 chip.

? Az EUR/HUF 380-ról 399-re változik. Hány százalékkal drágult az euró forintban?
= 5
= 5%
! 399 / 380 = 1,05.

? Egy magyar cég 10 000 eurós bevétele hány forinttal ér többet 399-es, mint 380-as árfolyamon?
= 190000
! 10 000 · (399 − 380).

? Egy külföldi autógyár Magyarországon új gyárat épít. Hol jelenik meg ez a fizetési mérlegben?
- a kereskedelmi mérlegben, importként
+ a pénzügyi mérlegben, közvetlen tőkebefektetésként
- a folyó mérlegben, transzferként
! Befektetés – tőkebeáramlás.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Import és vám.** A hazai kereslet $Q_D = a - bp$, a hazai kínálat $Q_S = c + dp$, a világpiaci ár `vilagar`. Írd meg az `import_vammal(a, b, c, d, vilagar, vam)` függvényt, amely az `(import mennyisége, vámbevétel)` párt adja vissza! A hazai ár a világár + vám, de legfeljebb az autark (kereskedelem nélküli) ár – ha eléri, az import és a vámbevétel is 0 (tiltó vám). 1 tizedesre kerekíts.

```python starter
def import_vammal(a, b, c, d, vilagar, vam):
    p = vilagar + vam
    q = (a - b * p) - (c + d * p)
    return (round(q, 1), round(vam * q, 1))
```

<details>
<summary>Megoldás</summary>

A kiinduló kód 30-as vámnál negatív importot (azaz exportot) és negatív vámbevételt számolna – a tiltó vámnál nagyobb vám már semmit sem változtat.

```python solution
def import_vammal(a, b, c, d, vilagar, vam):
    autark = (a - c) / (b + d)                   # ár kereskedelem nélkül
    p = min(vilagar + vam, autark)               # tiltó vám fölött nem drágul tovább
    q = (a - b * p) - (c + d * p)                # a hiányt importból fedezzük
    return (round(q, 1) + 0.0, round(vam * q, 1) + 0.0)
```

</details>

```python test
assert import_vammal(200, 2, 20, 1, 40, 0) == (60.0, 0.0)
assert import_vammal(200, 2, 20, 1, 40, 10) == (30.0, 300.0)
assert import_vammal(200, 2, 20, 1, 40, 20) == (0.0, 0.0)
assert import_vammal(200, 2, 20, 1, 40, 30) == (0.0, 0.0)
print("Minden ellenőrzés sikeres!")
```

**2.** **Keresztárfolyam és átváltás.** Írd meg a `keresztarfolyam(eur_huf, usd_huf)` függvényt, amely megadja, hány dollárt ér 1 euró (4 tizedesre), és az `atvalt(forint, arfolyam, jutalek)` függvényt, amely megadja, mennyi devizát kapsz `forint` összegért, ha a váltó `jutalek` %-ot levon a forintból (2 tizedesre)!

```python starter
def keresztarfolyam(eur_huf, usd_huf):
    return round(usd_huf / eur_huf, 4)

def atvalt(forint, arfolyam, jutalek):
    return round(forint / arfolyam, 2)
```

<details>
<summary>Megoldás</summary>

```python solution
def keresztarfolyam(eur_huf, usd_huf):
    return round(eur_huf / usd_huf, 4)           # 1 € = eur_huf Ft = eur_huf / usd_huf dollár

def atvalt(forint, arfolyam, jutalek):
    marad = forint * (1 - jutalek / 100)         # előbb levonják a jutalékot
    return round(marad / arfolyam, 2)
```

</details>

```python test
assert keresztarfolyam(400, 360) == 1.1111
assert keresztarfolyam(390, 390) == 1.0
assert atvalt(100_000, 400, 0) == 250.0
assert atvalt(100_000, 400, 2) == 245.0
print("Minden ellenőrzés sikeres!")
```

**3.** **Vásárlóerő-paritás.** Egy hamburger itthon `ar_hazai` forint, az USA-ban `ar_kulfoldi` dollár. Írd meg a `ppp_arfolyam(ar_hazai, ar_kulfoldi)` függvényt (2 tizedesre), és az `elteres(piaci, ar_hazai, ar_kulfoldi)` függvényt, amely megadja, hány %-kal tér el a piaci árfolyam a PPP-árfolyamtól (1 tizedesre; pozitív = a forint a PPP szerint alulértékelt)!

```python starter
def ppp_arfolyam(ar_hazai, ar_kulfoldi):
    return round(ar_kulfoldi / ar_hazai, 2)

def elteres(piaci, ar_hazai, ar_kulfoldi):
    return round(piaci - ar_hazai / ar_kulfoldi, 1)
```

<details>
<summary>Megoldás</summary>

Pozitív eltérésnél egy dollárért több forintot kell adni, mint amennyit a kosárárak indokolnak: a forint "olcsó", a hazai termékek külföldről nézve olcsók.

```python solution
def ppp_arfolyam(ar_hazai, ar_kulfoldi):
    return round(ar_hazai / ar_kulfoldi, 2)      # ennyi forint ér 1 dollárt "kosár szerint"

def elteres(piaci, ar_hazai, ar_kulfoldi):
    ppp = ar_hazai / ar_kulfoldi
    return round(100 * (piaci - ppp) / ppp, 1)   # százalékos eltérés
```

</details>

```python test
assert ppp_arfolyam(1900, 5.5) == 345.45
assert elteres(380, 1900, 5.5) == 10.0
assert elteres(300, 1900, 5.5) == -13.2
assert elteres(400, 2000, 5) == 0.0
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Magyarország 1 óra alatt 10 chipet vagy 20 szoftvermodult, Ausztria 1 óra alatt 8 chipet vagy 8 szoftvermodult tud előállítani. Miben van Magyarországnak komparatív előnye?
- chipben
+ szoftvermodulban
- mindkettőben
- egyikben sem
! A szoftver alternatív költsége Magyarországon 0,5 chip, Ausztriában 1 chip.

? Ha a forint gyengül az euróhoz képest, mi történik a magyar exporttal (ceteris paribus)?
+ versenyképesebb lesz, mert külföldön olcsóbb
- csökken, mert drágább lesz
- nem változik
- megszűnik
! Ugyanannyi euró több forintot ér, így a magyar termék euróban olcsóbb.

? Ki fizeti egy importvám terhének nagy részét egy kis ország esetén?
+ a hazai fogyasztók, a magasabb ár miatt
- a külföldi termelők
- az állam
- senki
! Kis ország nem befolyásolja a világárat, így a vám a hazai árat emeli.

? Ha 1 € = 400 Ft és 1 $ = 320 Ft, hány dollárt ér 1 euró?
= 1,25
= 1.25
! $400 / 320 = 1{,}25$.

? Mit jelent a fizetési mérleg folyó fizetési mérleg-hiánya?
- az állam többet költ, mint amennyi adót szed
+ az ország többet importál (és fizet ki külföldre), mint amennyit exportál
- a jegybank tartalékai nőnek
- a bankok több hitelt adnak
! A folyó fizetési mérleg a külkereskedelmi és jövedelemáramlásokat méri.
```
