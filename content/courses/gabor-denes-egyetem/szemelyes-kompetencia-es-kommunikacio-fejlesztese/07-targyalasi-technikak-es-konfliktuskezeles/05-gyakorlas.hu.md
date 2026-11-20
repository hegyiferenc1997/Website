---
title: Gyakorlás – tárgyalás és konfliktuskezelés
summary: Ellenőrző kérdések és összefoglaló feladatlap a BATNA-ról, a ZOPA-ról, a harvardi módszerről és a konfliktuskezelési stílusokról.
minutes: 50
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Hogyan javíthatod a BATNA-dat egy gyakornoki fizetési tárgyalás előtt?</summary>

Több helyre jelentkezel, így lesz alternatív ajánlatod; erősíted a portfóliódat; megnézed a piaci fizetési adatokat. Minél jobb az alternatívád, annál magabiztosabban tárgyalsz, és annál könnyebb nemet mondani egy rossz ajánlatra.

</details>

<details>
<summary>2. Miért veszélyes a fenntartási árad elárulása?</summary>

Mert a másik fél azonnal oda „húzza” a megállapodást: ha tudja, hogy 400 ezret még elfogadsz, nem fog 450-et ajánlani. A célodat és az indokaidat mondd el, a minimumodat ne.

</details>

<details>
<summary>3. Mi a különbség a kompromisszum és az együttműködés között?</summary>

Kompromisszumnál mindkét fél lemond valamiről, „félúton” találkoznak (a narancsot kettévágják). Együttműködésnél az érdekek feltárásával olyan megoldást keresnek, amely mindkettőjük érdekét teljesen kielégíti (az egyik a levet, a másik a héjat kapja).

</details>

<details>
<summary>4. Mikor jó az elkerülő stílus?</summary>

Apró, nem fontos ügyekben; ha a feleknek előbb le kell nyugodniuk; ha még nincs elég információ; vagy ha a konfliktust valaki más jobban tudja kezelni. Hosszú távon, fontos ügyekben káros, mert a probléma közben nő.

</details>

## Összefoglaló feladatlap

> Egy kis cég weboldalt rendel tőled. Te legalább 450 ezer Ft-ért vállalod (ennyiért egy másik megbízást is elvállalhatnál), a cég legfeljebb 600 ezret szánt rá. A cég képviselője 300 ezerrel nyit.

```quiz required
? Mi a te BATNA-d ebben a helyzetben?
- a cég 300 ezres ajánlata
+ a másik megbízás elvállalása
- a 600 ezres keret
- a ZOPA közepe
! Ezt teszed, ha nem jön létre megállapodás.

? Hány ezer Ft széles a ZOPA?
= 150
! 600 − 450 = 150.

? A cég 300 ezres nyitóajánlata milyen jelenség?
- BATNA
+ horgonyzás
- objektív kritérium
- elkerülés
! Az első szám kijelöli a kiindulópontot.

? Melyik válasz követi leginkább a harvardi módszert?
- „300 ezer? Akkor 900 ezret kérek.”
- „Rendben, legyen 300.”
+ „Nézzük meg, mire van szükségetek pontosan, és hasonló projektek piaci árát – a 300 ezer ettől messze van.”
- nem válaszolsz, és elmész
! Érdekek + objektív kritérium.

? Végül 520 ezer Ft-ban állapodtok meg, de a határidőt két héttel kitolják, amit te kértél. Melyik Thomas–Kilmann-stílushoz áll ez a legközelebb?
- versengő
- elkerülő
+ együttműködő (mindkét fél fontos érdeke teljesül)
- alkalmazkodó
! A cég a keretén belül marad, te jobb árat és több időt kapsz.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Csomag pontszáma.** A `tabla` szótár témánként sorolja fel a lehetőségeket `{téma: {lehetőség: (megrendelő pont, fejlesztő pont)}}` alakban. Írd meg a `csomag_pont(valasztas, tabla)` függvényt, amely egy `{téma: lehetőség}` választáshoz visszaadja a `(megrendelő összpont, fejlesztő összpont)` párt!

```python starter
def csomag_pont(valasztas, tabla):
    return (0, 0)
```

<details>
<summary>Megoldás</summary>

```python solution
def csomag_pont(valasztas, tabla):
    m = sum(tabla[tema][lehetoseg][0] for tema, lehetoseg in valasztas.items())
    f = sum(tabla[tema][lehetoseg][1] for tema, lehetoseg in valasztas.items())
    return (m, f)
```

</details>

```python test
tabla = {"határidő": {"4 hét": (40, 0), "6 hét": (20, 15), "8 hét": (0, 30)},
         "ár": {"2,0": (30, 0), "2,5": (15, 25), "3,0": (0, 50)},
         "támogatás": {"3": (0, 20), "6": (10, 10), "12": (30, 0)}}
assert csomag_pont({"határidő": "6 hét", "ár": "2,5", "támogatás": "6"}, tabla) == (45, 50)
assert csomag_pont({"határidő": "4 hét", "ár": "3,0", "támogatás": "12"}, tabla) == (70, 50)
print("Minden ellenőrzés sikeres!")
```

**2.** **Pareto-hatékony csomagok.** A `csomagok` lista `(név, a pont, b pont)` hármasokból áll. Írd meg a `pareto(csomagok)` függvényt, amely ábécérendben visszaadja azoknak a csomagoknak a nevét, amelyeket **nem dominál** másik (vagyis nincs olyan, amely mindkét félnek legalább ugyanannyi, és valamelyiknek több pontot ad)!

```python starter
def pareto(csomagok):
    legjobb = max(csomagok, key=lambda c: c[1] + c[2])
    return [legjobb[0]]
```

<details>
<summary>Megoldás</summary>

```python solution
def pareto(csomagok):
    def dominalt(c):
        return any(d[1] >= c[1] and d[2] >= c[2] and (d[1], d[2]) != (c[1], c[2]) for d in csomagok)
    return sorted(c[0] for c in csomagok if not dominalt(c))
```

</details>

```python test
cs = [("K", 45, 50), ("X", 70, 50), ("Y", 50, 65), ("Z", 40, 40), ("W", 100, 0)]
assert pareto(cs) == ["W", "X", "Y"]
assert pareto([("A", 1, 1), ("B", 1, 1)]) == ["A", "B"]
print("Minden ellenőrzés sikeres!")
```

**3.** **Fogolydilemma.** Írd meg a `jatszma(a_lepesek, b_lepesek)` függvényt, amely két, azonos hosszú lépéssorozatból (`"E"` = együttműködik, `"Ö"` = önző) kiszámolja a két játékos összpontszámát! Pontok: E–E: 3, 3; E–Ö: 0, 5; Ö–E: 5, 0; Ö–Ö: 1, 1.

```python starter
def jatszma(a_lepesek, b_lepesek):
    return (3 * len(a_lepesek), 3 * len(b_lepesek))
```

<details>
<summary>Megoldás</summary>

```python solution
PONT = {("E", "E"): (3, 3), ("E", "Ö"): (0, 5), ("Ö", "E"): (5, 0), ("Ö", "Ö"): (1, 1)}

def jatszma(a_lepesek, b_lepesek):
    pa = pb = 0
    for a, b in zip(a_lepesek, b_lepesek):    # körönként összeadjuk a pontokat
        x, y = PONT[(a, b)]
        pa, pb = pa + x, pb + y
    return (pa, pb)
```

</details>

```python test
assert jatszma("EEE", "EEE") == (9, 9)
assert jatszma("EÖÖ", "ÖÖE") == (6, 6)
assert jatszma("ÖÖÖÖ", "EEEE") == (20, 0)
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Mi a BATNA?
+ a tárgyalt megállapodás legjobb alternatívája – amit akkor teszel, ha nem jön létre megállapodás
- a legmagasabb ár, amit kérhetsz
- a tárgyalás menetrendje
- a másik fél első ajánlata
! Minél jobb a BATNA-d, annál erősebb a tárgyalási pozíciód.

? Az eladó minimuma 600, a vevő maximuma 900 ezer Ft. Milyen széles a ZOPA (ezer Ft)?
= 300
! $900 - 600 = 300$.

? Mit jelent a Harvard-módszerben „az érdekekre koncentrálj, ne a pozíciókra”?
- ragaszkodj az első ajánlatodhoz
+ azt keresd, miért akar valamit a másik fél, mert az érdekek mentén több megoldás is lehet
- soha ne engedj
- a másik fél pozícióját hagyd figyelmen kívül
! A pozíció a „mit”, az érdek a „miért”.

? Melyik konfliktuskezelési stílus a legjobb, ha az ügy és a kapcsolat is nagyon fontos?
- elkerülő
- versengő
+ problémamegoldó (együttműködő)
- alkalmazkodó
! Mindkét fél céljait figyelembe veszi.
```
