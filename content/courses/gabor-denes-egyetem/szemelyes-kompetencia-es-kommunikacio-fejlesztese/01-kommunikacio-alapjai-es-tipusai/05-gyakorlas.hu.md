---
title: Gyakorlás – a kommunikáció alapjai
summary: Ellenőrző kérdések és összefoglaló feladatlap a kommunikációs modellről, a kommunikáció típusairól és Watzlawick axiómáiról.
minutes: 50
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Miért nem elég „pontosan megfogalmazni” egy üzenetet?</summary>

Mert a kommunikáció sikere a vevő megértésén múlik. A vevő a saját tudása, nyelvhasználata és pillanatnyi állapota alapján dekódol, és közben zaj is torzíthat. Visszacsatolás nélkül nem tudhatod, mi jutott el hozzá.

</details>

<details>
<summary>2. Hogyan csökkenthető a szemantikai zaj egy fejlesztőcsapatban?</summary>

Közös fogalomtárral (pl. „Definition of Done”), példákkal, visszakérdezéssel, és azzal, hogy a szakzsargont a hallgatósághoz igazítjuk. Megbeszélés után érdemes írásban összefoglalni a döntéseket.

</details>

<details>
<summary>3. Mikor jobb a szinkron, és mikor az aszinkron kommunikáció?</summary>

Szinkron: ha gyors oda-vissza kell (ötletelés, konfliktus, bonyolult döntés). Aszinkron: ha az üzenetet át kell gondolni, dokumentálni kell, vagy a felek más időzónában, más időbeosztással dolgoznak.

</details>

<details>
<summary>4. Mondj egy példát arra, amikor a tartalmi szint rendben van, de a kapcsolati szinten van a gond!</summary>

Egy kódátnézésben a megjegyzés szakmailag helyes („ez a ciklus O(n²)”), de a szerző lekezelőnek érzi a hangnemet („ezt egy kezdő is tudja…”). A vita ezután már nem a kódról, hanem a tiszteletről szól.

</details>

## Összefoglaló feladatlap

Olvasd el a helyzetet, és válaszolj a kérdésekre.

> Anna csapatvezető pénteken este ezt írja a csapat chatcsatornájába: „Hétfőre legyen kész a jelentés.” Bence, aki hétvégén nem nézi a chatet, hétfő reggel látja meg. Csilla elkészíti a jelentést, de nem tudja, hogy Anna a havi vagy a heti jelentésre gondolt. Dávid nem válaszol semmit.

```quiz required
? Milyen csatornán ment az üzenet?
- személyes beszélgetés
+ írásos, aszinkron csatorna (chat)
- telefonhívás
- videóhívás
! Pénteken este írta, hétfőn olvasták.

? Csilla nem tudja, melyik jelentésről van szó. Milyen zaj okozta ezt?
- fizikai
+ szemantikai
- fiziológiai
- egyik sem
! A „jelentés” szó többféleképpen érthető.

? Mi hiányzott leginkább a folyamatból, ami a félreértést megelőzhette volna?
- egy hosszabb üzenet
+ visszacsatolás (visszakérdezés vagy megerősítés)
- több emoji
- egy formálisabb megszólítás
! „Melyik jelentésre gondolsz?” – egy kérdés megoldotta volna.

? Dávid nem válaszol. Melyik axióma szerint ez is üzenet?
+ nem lehet nem kommunikálni
- szimmetrikus kapcsolat
- digitális kommunikáció
- központozás
! A hallgatás is jelent valamit.

? Milyen irányú Anna üzenete a szervezetben?
+ lefelé
- felfelé
- oldalirányú
- diagonális
! A vezetőtől a csapat felé halad.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Hibátlan üzenet.** Egy üzenet `k` független részletből áll, mindegyik `p` eséllyel megy félre. Írd meg a `hibatlan_esely(p, k)` függvényt, amely megadja, mekkora eséllyel érkezik meg minden részlet hibátlanul (3 tizedesre kerekítve)!

```python starter
def hibatlan_esely(p, k):
    return round(1 - p * k, 3)
```

<details>
<summary>Megoldás</summary>

```python solution
def hibatlan_esely(p, k):
    return round((1 - p) ** k, 3)          # minden részletnek külön-külön át kell jutnia
```

</details>

```python test
assert hibatlan_esely(0.2, 3) == 0.512
assert hibatlan_esely(0.1, 5) == 0.59
assert hibatlan_esely(0.5, 10) == 0.001
print("Minden ellenőrzés sikeres!")
```

**2.** **Visszakérdezés.** Egy visszakérdezési kör után egy részlet csak akkor marad hibás, ha először is félrement, és a visszakérdezésnél sem vették észre (mindkettő `p` eséllyel). Írd meg a `visszakerdezessel(p, k)` függvényt, amely megadja, mekkora eséllyel lesz mind a `k` részlet helyes (3 tizedesre)!

```python starter
def visszakerdezessel(p, k):
    return round((1 - p) ** k, 3)
```

<details>
<summary>Megoldás</summary>

```python solution
def visszakerdezessel(p, k):
    return round((1 - p * p) ** k, 3)      # egy részlet hibájának esélye p·p
```

</details>

```python test
assert visszakerdezessel(0.2, 3) == 0.885
assert visszakerdezessel(0.1, 5) == 0.951
assert visszakerdezessel(0.0, 7) == 1.0
print("Minden ellenőrzés sikeres!")
```

**3.** **Csatornaválasztó.** Írd meg a `csatorna(bonyolultsag, erzelmes)` függvényt (bonyolultság 1–5): ha a téma érzelmes vagy a bonyolultság legalább 4, `"személyes"`; ha 3, `"videóhívás"`; ha 2, `"e-mail"`; egyébként `"chat"`!

```python starter
def csatorna(bonyolultsag, erzelmes):
    return "e-mail"
```

<details>
<summary>Megoldás</summary>

```python solution
def csatorna(bonyolultsag, erzelmes):
    if erzelmes or bonyolultsag >= 4:      # bonyolult vagy érzelmes téma → gazdag csatorna
        return "személyes"
    if bonyolultsag == 3:
        return "videóhívás"
    if bonyolultsag == 2:
        return "e-mail"
    return "chat"
```

</details>

```python test
assert csatorna(1, False) == "chat"
assert csatorna(2, False) == "e-mail"
assert csatorna(3, False) == "videóhívás"
assert csatorna(5, False) == "személyes"
assert csatorna(1, True) == "személyes"
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Melyik a szemantikai zaj példája?
- akadozó videókapcsolat
+ a „kész” szó mást jelent a fejlesztőnek és a megrendelőnek
- hangos iroda
- fáradtság
! A szavak jelentése tér el a két félnél.

? Egy üzenet 4 független részletből áll, mindegyik 10% eséllyel megy félre. Mekkora eséllyel érkezik meg hibátlanul? (tizedes törtként, 4 tizedesre)
= 0,6561
= 0.6561
! $0{,}9^4 = 0{,}6561$.

? Melyik Watzlawick-axióma szól arról, hogy minden üzenetnek tartalmi és kapcsolati szintje van?
+ tartalmi és kapcsolati szint
- nem lehet nem kommunikálni
- az események tagolása
- digitális és analóg kommunikáció
! A kapcsolati szint megmondja, hogyan értsük a tartalmat.

? Mi a visszacsatolás szerepe a kommunikációs modellben?
- csökkenti a csatorna költségét
+ megmutatja az adónak, hogy a vevő azt értette-e, amit mondani akart
- helyettesíti a kódolást
- csak írásban létezik
! Visszacsatolás nélkül egyirányú az információátadás.
```
