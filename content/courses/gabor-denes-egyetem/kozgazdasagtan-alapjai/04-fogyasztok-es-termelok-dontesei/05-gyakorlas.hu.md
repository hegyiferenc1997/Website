---
title: Gyakorlás – fogyasztók és termelők
summary: Ellenőrző kérdések és összefoglaló feladatlap egy SaaS-cég költségeiről, profitmaximumáról és piaci helyzetéről.
minutes: 60
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Miért nem érdemes egy streamingszolgáltatónak minden filmet megvennie, ami csak elérhető?</summary>

A csökkenő határhaszon miatt a katalógus bővítése egy idő után egyre kevesebb új előfizetőt hoz, a licencdíj (határköltség) viszont nem csökken. Ott kell megállni, ahol a következő film határbevétele már nem fedezi a határköltségét.

</details>

<details>
<summary>2. Miért csökkenhet egy szoftvercég átlagköltsége szinte korlátlanul?</summary>

Mert a költségei nagy része fix (fejlesztés), a határköltsége pedig közel nulla. Több felhasználóra ugyanaz a fix költség oszlik el, így az egy felhasználóra jutó költség folyamatosan csökken.

</details>

<details>
<summary>3. Miért érdemes egy veszteséges cégnek rövid távon tovább működnie?</summary>

Mert a fix költséget (pl. a bérleti díjat) akkor is ki kell fizetnie, ha leáll. Ha az árbevétel legalább a változó költséget fedezi, a működés a fix költség egy részét is kitermeli, tehát kisebb a veszteség, mint leállva.

</details>

<details>
<summary>4. Hogyan magyarázza a fogolydilemma, hogy a kartellek gyakran felbomlanak?</summary>

Minden kartelltagnak egyénileg megéri titokban olcsóbban adni, és elvinni a piac nagyobb részét. Ha egy tag csal, a többiek is követik, és visszaáll a versenyhez közelebbi ár. A tiltás és a magas bírságok ezt még erősítik.

</details>

## Összefoglaló feladatlap

Egy SaaS-cég havi adatai (ezer Ft):

| Előfizetők (Q, ezer fő)    | 1   | 2   | 3   | 4   | 5   |
| -------------------------- | --- | --- | --- | --- | --- |
| Ár (ezer Ft / fő)          | 5   | 4,5 | 4   | 3,5 | 3   |
| Teljes költség (millió Ft) | 3   | 5   | 7   | 11  | 16  |

(Az árbevétel millió Ft-ban: Q · P, pl. 1 ezer fő · 5 ezer Ft = 5 millió Ft.)

```quiz required
? Mennyi az árbevétel 3 ezer előfizetőnél (millió Ft)?
= 12
! 3 · 4.

? Mennyi a profit 3 ezer előfizetőnél (millió Ft)?
= 5
! 12 − 7.

? Hány ezer előfizetőnél a legnagyobb a profit?
= 3
! Profitok: 2, 4, 5, 3, −1 millió Ft. Határelemzéssel: a 3. ezer fő MR-je 12 − 9 = 3 > MC = 7 − 5 = 2, a 4.-é 14 − 12 = 2 < MC = 4.

? Melyik piacszerkezetbe sorolnád a jegyzetelő alkalmazások piacát (sok cég, mindegyik kicsit más funkciókkal)?
- tökéletes verseny
+ monopolisztikus verseny
- oligopólium
- monopólium
! Differenciált termékek, könnyű belépés.

? Egy diák egy tankönyvért legfeljebb 9000 Ft-ot adna, 6500 Ft-ért veszi meg. Mennyi a fogyasztói többlete (Ft)?
= 2500
! 9000 − 6500.

? A cég fix költsége havi 2 millió Ft. Mennyi a változó költség 4 ezer előfizetőnél (millió Ft)?
= 9
! TC − FC = 11 − 2.

? Mennyi az átlagköltség 4 ezer előfizetőnél (ezer Ft / fő)?
= 2,75
= 2.75
! 11 millió / 4 ezer = 2,75 ezer Ft.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Átlag- és határköltség.** A `koltsegek` szótár megadja az összköltséget néhány termelési szinten (pl. `{0: 20000, 100: 35000, 200: 45000}`). Írd meg az `atlagkoltseg(koltsegek, q)` és a `hatarkoltseg(koltsegek, q1, q2)` függvényt: az első a `q` szinten az egy darabra jutó összköltséget, a második a `q1` és `q2` közötti darabonkénti többletköltséget adja meg, 1 tizedesre kerekítve!

```python starter
def atlagkoltseg(koltsegek, q):
    return round(koltsegek[q], 1)

def hatarkoltseg(koltsegek, q1, q2):
    return round(koltsegek[q2] / q2, 1)
```

<details>
<summary>Megoldás</summary>

```python solution
def atlagkoltseg(koltsegek, q):
    return round(koltsegek[q] / q, 1)                              # TC / Q

def hatarkoltseg(koltsegek, q1, q2):
    return round((koltsegek[q2] - koltsegek[q1]) / (q2 - q1), 1)   # ΔTC / ΔQ
```

</details>

```python test
k = {0: 20000, 100: 35000, 200: 45000, 300: 53000, 400: 64000}
assert atlagkoltseg(k, 200) == 225.0
assert atlagkoltseg(k, 300) == 176.7
assert hatarkoltseg(k, 100, 200) == 100.0
assert hatarkoltseg(k, 300, 400) == 110.0
assert hatarkoltseg(k, 0, 100) == 150.0
print("Minden ellenőrzés sikeres!")
```

**2.** **Monopolista optimum.** A kereslet $P = a - bQ$, a határköltség állandó `mc`. A határbevétel $MR = a - 2bQ$. Írd meg a `monopolium(a, b, mc)` függvényt, amely a profitmaximalizáló `(mennyiség, ár, profit)` hármast adja vissza (fix költség nélkül), 2 tizedesre kerekítve!

```python starter
def monopolium(a, b, mc):
    q = (a - mc) / b                       # ez a versenyzői mennyiség
    p = a - b * q
    return (round(q, 2), round(p, 2), round((p - mc) * q, 2))
```

<details>
<summary>Megoldás</summary>

A kiinduló kód a versenypiaci megoldást adja ($P = MC$, nulla profit) – a monopolista kevesebbet termel, drágábban.

```python solution
def monopolium(a, b, mc):
    q = (a - mc) / (2 * b)                 # MR = MC
    p = a - b * q                          # az árat a keresleti görbéről olvassuk le
    return (round(q, 2), round(p, 2), round((p - mc) * q, 2))
```

</details>

```python test
assert monopolium(100, 1, 20) == (40.0, 60.0, 1600.0)
assert monopolium(120, 1, 20) == (50.0, 70.0, 2500.0)
assert monopolium(200, 2, 40) == (40.0, 120.0, 3200.0)
print("Minden ellenőrzés sikeres!")
```

**3.** **Termeljen vagy zárjon be?** Írd meg a `dontes(ar, atc_min, avc_min)` függvényt, amely rövid távon megmondja, mit tegyen egy versenypiaci cég: `"nyereséges"`, ha az ár az átlagköltség minimuma fölött van; `"termel veszteséggel"`, ha az átlagköltség és az átlagos változó költség minimuma között; `"bezár"`, ha az AVC minimuma alatt (vagy egyenlő vele)!

```python starter
def dontes(ar, atc_min, avc_min):
    return "nyereséges" if ar > atc_min else "bezár"
```

<details>
<summary>Megoldás</summary>

```python solution
def dontes(ar, atc_min, avc_min):
    if ar > atc_min:
        return "nyereséges"
    if ar > avc_min:
        return "termel veszteséggel"       # a fix költség egy részét így is fedezi
    return "bezár"
```

</details>

```python test
assert dontes(170, 160, 110) == "nyereséges"
assert dontes(130, 160, 110) == "termel veszteséggel"
assert dontes(100, 160, 110) == "bezár"
assert dontes(110, 160, 110) == "bezár"
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Egy fogyasztó 6000 Ft-ból vesz kávét (500 Ft) és süteményt (1000 Ft). Legfeljebb hány süteményt vehet, ha 4 kávét is vesz?
= 4
! $6000 - 4 \cdot 500 = 4000$, ebből 4 sütemény.

? Melyik fix költség egy pékségnél (rövid távon)?
- a liszt
+ a bérleti díj
- a sütés energiaköltsége
- a csomagolóanyag
! A termelés mennyiségétől függetlenül fizetni kell.

? Melyik piacszerkezetben van sok kis szereplő, akik egyforma terméket árulnak?
+ tökéletes verseny
- monopólium
- oligopólium
- monopolisztikus verseny
! Egyik szereplő sem tudja befolyásolni az árat.

? A termelés 10-ről 11 darabra nő, az összköltség 500-ról 540-re. Mennyi a határköltség?
= 40
! $540 - 500 = 40$.

? Egy cég számviteli profitja 5 millió Ft, a tulajdonos máshol 6 millió Ft-ot keresne. Mennyi a gazdasági profit (millió Ft)?
= -1
= −1
! A gazdasági profit az alternatív költséget is levonja: $5 - 6 = -1$.
```
