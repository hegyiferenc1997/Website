---
title: Gyakorlás – online kommunikáció és közösségi média
summary: Ellenőrző kérdések és összefoglaló feladatlap a csatornaválasztásról, a videóhívás és a chat illemtanáról, valamint a biztonságos online jelenlétről.
minutes: 50
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Melyik csatornát választanád: (a) rossz hír egy csapattagnak, (b) egy link megosztása, (c) egy hiba jelzése?</summary>

(a) Személyesen vagy videóhívásban – érzelmes, gazdag csatorna kell. (b) Chat – egyszerű, egyértelmű üzenet. (c) Hibakövető (ticket) – nyomon követhető, felelőssel és állapottal.

</details>

<details>
<summary>2. Mit ellenőriznél egy állásinterjú előtt egy videóhívásnál?</summary>

Működik-e az alkalmazás, a kamera és a mikrofon; jó-e a fény (előttem van); szemmagasságban van-e a kamera; rendezett-e a háttér; ki vannak-e kapcsolva az értesítések; stabil-e az internet; van-e kéznél az önéletrajzom és a jegyzeteim.

</details>

<details>
<summary>3. Hogyan ismersz fel egy adathalász e-mailt?</summary>

Sürget vagy fenyeget, a feladó címe furcsa vagy hasonlít a hivatalosra, a link máshová visz, mint amit mutat, váratlan csatolmány van benne, jelszót vagy kódot kér, gyakran helyesírási hibákkal.

</details>

<details>
<summary>4. Miért érdemes megérteni az ajánlóalgoritmusok működését egy mérnökinformatikusnak?</summary>

Mert felhasználóként így tudatosabban fogyasztja a tartalmakat (véleménybuborék, manipuláció), fejlesztőként pedig lehet, hogy egyszer ő tervez ilyen rendszert, és felelőssége van abban, hogy mit optimalizál (figyelem vs. a felhasználó jólléte).

</details>

## Összefoglaló feladatlap

```quiz required
? Hétfő reggel chatüzenetet kapsz a „vezetődtől” egy ismeretlen fiókról: „Sürgősen utalj át 300 000 Ft-ot ennek a partnernek, később elmagyarázom.” Mi a teendő?
- azonnal utalsz, hiszen sürgős
+ nem utalsz, és a vezetődet egy ismert csatornán (pl. telefonon) megkérdezed
- továbbítod a csapatnak, hátha valaki utal
- válaszolsz, hogy megtetted
! Social engineering: tekintély + sürgetés.

? Egy cikk címe: „DÖBBENETES! Ez a programozási nyelv 2027-ben megszűnik!” Csak egy ismeretlen oldal írja. Mit teszel?
- azonnal megosztod
+ megnézed, mit írnak megbízható források, és ha nincs megerősítés, nem osztod meg
- elhiszed, mert nagybetűvel írták
- kommentben felháborodsz
! Kattintásvadász cím, egyetlen forrás.

? Naponta 8 megbeszélésed van egymás után, mindegyik egy 30 perces idősávban. Ha mindegyiket 25 percesre rövidítitek, összesen hány perc szünet jut naponta?
= 40
! 8 · 5 perc = 40 perc.

? A csapat egy bonyolult architektúrán vitatkozik a chatben már két napja, 200 üzenetben. Mi a legjobb javaslat?
+ egy rövid videóhívás, utána a döntés rögzítése a wikiben
- még több chatüzenet
- a téma lezárása döntés nélkül
- mindenki írjon e-mailt mindenkinek
! Összetett téma → gazdag csatorna, majd írásos rögzítés.

? Melyik **nem** jó chat-gyakorlat?
- válasz szálban
- állapot beállítása szabadság idejére
+ minden üzenetben `@mindenki` említés
- kód küldése kódblokkban
! A tömeges említés mindenkit megzavar.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **A megszakítások ára.** Írd meg az `elveszett_perc(megszakitasok, visszaallas, nap_perc=480)` függvényt, amely megadja, hány perc vész el egy napon a megszakítások után szükséges visszaállás miatt – de legfeljebb a teljes nap!

```python starter
def elveszett_perc(megszakitasok, visszaallas, nap_perc=480):
    return megszakitasok * visszaallas
```

<details>
<summary>Megoldás</summary>

```python solution
def elveszett_perc(megszakitasok, visszaallas, nap_perc=480):
    return min(nap_perc, megszakitasok * visszaallas)   # a napnál több nem veszhet el
```

</details>

```python test
assert elveszett_perc(6, 15) == 90
assert elveszett_perc(32, 12) == 384
assert elveszett_perc(50, 15) == 480
assert elveszett_perc(10, 10, nap_perc=60) == 60
print("Minden ellenőrzés sikeres!")
```

**2.** **Jelszóentrópia.** Írd meg az `entropia(n, hossz)` függvényt, amely megadja egy véletlenszerűen, `n` féle elemből (karakterből vagy szóból) választott, `hossz` elemű jelszó entrópiáját bitekben (1 tizedesre)!

```python starter
def entropia(n, hossz):
    return round(n * hossz / 8, 1)
```

<details>
<summary>Megoldás</summary>

```python solution
from math import log2

def entropia(n, hossz):
    return round(hossz * log2(n), 1)       # n^hossz lehetőség → hossz · log2(n) bit
```

</details>

```python test
assert entropia(26, 8) == 37.6
assert entropia(2048, 4) == 44.0
assert entropia(7776, 6) == 77.5
print("Minden ellenőrzés sikeres!")
```

**3.** **Valódi domain.** Írd meg a `valodi_domain(url)` függvényt, amely egy `http://` vagy `https://` kezdetű címből visszaadja a domain utolsó két tagját (pl. `login-check.com`), kisbetűsítve! A port (`:8080`) és az útvonal ne számítson.

```python starter
def valodi_domain(url):
    return url.split("/")[2].split(".")[0]
```

<details>
<summary>Megoldás</summary>

```python solution
def valodi_domain(url):
    host = url.split("/")[2].split(":")[0].lower()   # a "//" utáni rész, port nélkül
    return ".".join(host.split(".")[-2:])            # jobbról olvasva az utolsó két tag
```

</details>

```python test
assert valodi_domain("http://neptun-uni-hu.login-check.com/belepes") == "login-check.com"
assert valodi_domain("https://github.com/settings") == "github.com"
assert valodi_domain("https://WWW.Example.org:8080/a/b") == "example.org"
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Mi a kétlépcsős azonosítás (2FA)?
+ a jelszó mellett egy második bizonyíték (pl. kód a telefonon) is kell a belépéshez
- két különböző jelszó
- kétszer kell beírni a jelszót
- két felhasználónév
! Ha a jelszó ki is szivárog, a második tényező nélkül nem lehet belépni.

? Hány bit egy 10 karakteres, csak számjegyekből (10 féle) véletlenszerűen álló PIN entrópiája? (1 tizedesre)
= 33,2
= 33.2
! $10 \cdot \log_2 10 \approx 33{,}2$ bit.

? Melyik a videóhívás jó gyakorlata?
- végig bekapcsolt mikrofon zajos helyen
+ némítás, amikor nem beszélsz; előre kipróbált kamera és hang; a meghívóban napirend
- késés nélkül, de napirend nélkül indulni
- közben e-maileket írni
! A felkészülés mindenki idejét kíméli.

? Mi a véleménybuborék?
- egy chatalkalmazás
+ amikor az algoritmusok főleg a már meglévő véleményünket megerősítő tartalmat mutatják
- egy reklámforma
- a közösségi média adatvédelmi beállítása
! Tudatosan érdemes eltérő nézőpontú forrásokat is olvasni.
```
