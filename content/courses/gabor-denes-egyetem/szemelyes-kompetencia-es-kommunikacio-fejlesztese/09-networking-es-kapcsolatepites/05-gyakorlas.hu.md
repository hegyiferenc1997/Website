---
title: Gyakorlás – networking és kapcsolatépítés
summary: Ellenőrző kérdések és összefoglaló feladatlap a kapcsolati háló értékéről, a kapcsolatfelvételről és a kapcsolatok ápolásáról; saját liftbeszéd megírása.
minutes: 50
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Miért értékesebb néha egy ismerős, mint egy közeli barát, ha állást keresel?</summary>

Mert a közeli barátaid nagyjából ugyanazt tudják, mint te, az ismerőseid viszont más körökben mozognak, így olyan lehetőségekről hallanak, amelyekről te nem (Granovetter: a gyenge kötések ereje).

</details>

<details>
<summary>2. Írd meg a saját liftbeszédedet!</summary>

Négy rész: ki vagy (név, szak, évfolyam), mit csinálsz most (egy konkrét projekt vagy tanulmány), mi érdekel (terület, amiért jöttél), és egy kérdés a másikhoz. Mondd el hangosan, és mérd le: kb. 30 másodperc legyen.

</details>

<details>
<summary>3. Hogyan lépsz ki elegánsan egy beszélgetésből egy rendezvényen?</summary>

Megköszönöd a beszélgetést, jelzed, hogy szívesen tartanád a kapcsolatot (pl. LinkedInen), és megmondod, hova mész tovább, vagy bemutatod a másikat egy harmadik embernek.

</details>

<details>
<summary>4. Mit adhatsz egy szakmai kapcsolatnak elsőéves hallgatóként?</summary>

Egy hasznos cikket, eszközt; visszajelzést egy projektre; bemutatást valakinek; gratulációt; segítséget egy nyílt forráskódú projektben; egy új technológia megmutatását (fordított mentorálás).

</details>

## Összefoglaló feladatlap

> Egy Python-meetupon vagy. Az egyik előadó, Tóth Anna egy cég adatcsapatát vezeti.

```quiz required
? Az előadás után odamész hozzá. Melyik a legjobb nyitás?
- „Felvennél gyakornoknak?”
+ „Nagyon tetszett, amit a típusannotációkról mondtál. Nálatok mióta használjátok őket?”
- „Mennyit keresnek nálatok az adatmérnökök?”
- szó nélkül átadod az önéletrajzodat
! Az előadásra épít, nyitott kérdéssel.

? A beszélgetés jól megy. Mi legyen a következő lépés?
- egész este mellette maradsz
+ megköszönöd, és megkérdezed, kereshetnéd-e LinkedInen
- elkéred a telefonszámát
- azonnal állásinterjút kérsz
! Udvarias zárás + kapcsolattartás.

? Mikor és hogyan küldj neki LinkedIn-meghívót?
- egy hét múlva, üzenet nélkül
+ 48 órán belül, személyes üzenettel, amely utal a meetupra
- azonnal, még az előadás közben
- soha
! Utánkövetés, amíg mindketten emlékeztek.

? Anna később megemlíti, hogy egy jó adatvizualizációs könyvtárat keresnek. Te ismersz egyet. Mi a teendő?
+ elküldöd neki a linket egy rövid üzenetben
- nem szólsz, nem a te dolgod
- csak akkor mondod el, ha cserébe állást kapsz
- írsz róla egy nyilvános bejegyzést, és megjelölöd
! Adok-kapok: adj is.

? Legfeljebb hány emberrel tudsz beszélgetni a meetupon, ha 3 órát töltesz ott, és átlagosan 20 percet beszélgetsz mindenkivel, szünet nélkül?
= 9
! 180 perc / 20 perc = 9.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Bemutatási lánc.** A `graf` szótár minden emberhez az ismerőseinek listáját rendeli. Írd meg a `lanc(graf, kezdo, cel)` függvényt, amely szélességi kereséssel megadja a legrövidebb utat (emberek listájaként), vagy `None`-t, ha nincs út!

```python starter
def lanc(graf, kezdo, cel):
    return [kezdo, cel]
```

<details>
<summary>Megoldás</summary>

```python solution
from collections import deque

def lanc(graf, kezdo, cel):
    elozo = {kezdo: None}
    sor = deque([kezdo])
    while sor:
        most = sor.popleft()
        if most == cel:                      # visszafejtjük az utat
            ut = []
            while most is not None:
                ut.append(most)
                most = elozo[most]
            return ut[::-1]
        for sz in graf[most]:
            if sz not in elozo:
                elozo[sz] = most
                sor.append(sz)
    return None
```

</details>

```python test
g = {"Te": ["Ádám", "Bori"], "Ádám": ["Te", "Dóra"], "Bori": ["Te"], "Dóra": ["Ádám", "Eszter"], "Eszter": ["Dóra"], "Zoli": []}
assert lanc(g, "Te", "Eszter") == ["Te", "Ádám", "Dóra", "Eszter"]
assert lanc(g, "Te", "Bori") == ["Te", "Bori"]
assert lanc(g, "Te", "Zoli") is None
print("Minden ellenőrzés sikeres!")
```

**2.** **Másodfokú kapcsolatok.** Írd meg a `masodfoku(graf, ki)` függvényt, amely ábécérendben visszaadja azokat, akiket `ki` egy közös ismerősön keresztül ér el, de nem közvetlen ismerősei (és nem ő maga)!

```python starter
def masodfoku(graf, ki):
    return sorted(b for a in graf[ki] for b in graf[a])
```

<details>
<summary>Megoldás</summary>

```python solution
def masodfoku(graf, ki):
    kozvetlen = set(graf[ki])
    ketlepes = {b for a in kozvetlen for b in graf[a]}    # az ismerősök ismerősei
    return sorted(ketlepes - kozvetlen - {ki})
```

</details>

```python test
g = {"Te": ["Ádám", "Bori"], "Ádám": ["Te", "Dóra", "Bori"], "Bori": ["Te", "Ádám", "Gergő"], "Dóra": ["Ádám"], "Gergő": ["Bori"]}
assert masodfoku(g, "Te") == ["Dóra", "Gergő"]
assert masodfoku(g, "Dóra") == ["Bori", "Te"]
print("Minden ellenőrzés sikeres!")
```

**3.** **Kapcsolatápolás időkerete.** Írd meg a `havi_perc(retegek)` függvényt, amely `(emberek száma, kontaktus havonta, perc kontaktusonként)` hármasok listájából kiszámolja a havi összes időt percben (egészre kerekítve)!

```python starter
def havi_perc(retegek):
    return round(sum(db * perc for db, _, perc in retegek))
```

<details>
<summary>Megoldás</summary>

```python solution
def havi_perc(retegek):
    return round(sum(db * gyak * perc for db, gyak, perc in retegek))   # ember × gyakoriság × idő
```

</details>

```python test
assert havi_perc([(5, 4, 60), (10, 1, 30)]) == 1500
assert havi_perc([(100, 1 / 12, 5)]) == 42
assert havi_perc([]) == 0
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Mi a gyenge kötések ereje (Granovetter)?
+ a távolabbi ismerősök gyakran új információt (pl. álláslehetőséget) hoznak, mert más körökben mozognak
- a gyenge kapcsolatokat jobb megszakítani
- csak a közeli barátok segítenek
- a kapcsolatok száma nem számít
! A közeli barátaink nagyrészt ugyanazt tudják, amit mi.

? Hány fős a Dunbar-szám szerinti tartós, értelmes kapcsolatok köre nagyjából?
= 150
! Dunbar rétegei: kb. 5, 15, 50, 150.

? Mi a liftbeszéd (elevator pitch)?
- egy hosszú szakmai előadás
+ egy 30–60 másodperces, tömör bemutatkozás: ki vagy, mivel foglalkozol, mit keresel
- a lift használatának szabályai
- egy írásos önéletrajz
! Rövid, emlékezetes, és a beszélgetés folytatására hív.

? Mi az „adok-kapok” elv a kapcsolatépítésben?
- csak akkor keress meg valakit, ha kell valami
+ adj értéket (segítség, bemutatás, hasznos információ), mielőtt kérsz
- minden szívességet azonnal vissza kell fizetni
- csak a magasabb pozíciójúakkal érdemes kapcsolatot tartani
! A kölcsönösség hosszú távon építi a bizalmat.
```
