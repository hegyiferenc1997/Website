---
title: Mélyebben – az operációs rendszer működése közelről
summary: Hogyan osztja el az OS a processzort (érkezési sorrend kontra körbeforgó ütemezés szimulációval), miért jobb több program egyszerre (CPU-kihasználtság), hogyan értelmezi az elérési utakat, és mit jelent a 755 és a 644 jogosultság – kis programokkal és interaktív ábrával.
minutes: 45
---

## Amit ebben a leckében megtanulsz

- hogyan **osztja el** az operációs rendszer a processzort több program között,
- miért **gyorsabb** a gép, ha több program fut egyszerre (és meddig),
- hogyan alakít az OS egy **relatív** elérési utat abszolúttá,
- hogyan olvasd és számold ki a Linux **jogosultságokat** (pl. `755`).

## 1. Ki kapja a processzort? Ütemezés

Egy processzormag egyszerre egy dolgot csinál, mégis egyszerre szól a zene, fut a böngésző és fordul a kódod. Az OS **ütemezője** (scheduler) dönti el, ki mikor kapja meg a processzort. Két egyszerű stratégia:

- **érkezési sorrend** (FCFS – first come, first served): aki előbb jött, az fut végig elsőként,
- **körbeforgó** (Round Robin): mindenki kap egy kis időszeletet (pl. 2 ms), aztán a sor végére kerül.

```python run
# Ütemezés szimulációja: érkezési sorrend vs. körbeforgó (mindenki a 0. pillanatban érkezik)
from collections import deque

feladatok = [("fordítás", 12), ("zene", 2), ("gépelés", 1), ("letöltés", 5)]   # (név, CPU-igény ms)

def fcfs(feladatok):
    ido, kesz = 0, {}
    for nev, igeny in feladatok:
        ido += igeny
        kesz[nev] = ido                            # mikor végzett
    return kesz

def korbeforgo(feladatok, szelet):
    sor = deque(feladatok)
    ido, kesz = 0, {}
    while sor:
        nev, maradek = sor.popleft()
        fut = min(szelet, maradek)
        ido += fut
        if maradek > fut:
            sor.append((nev, maradek - fut))       # nem végzett: a sor végére
        else:
            kesz[nev] = ido
    return kesz

for cim, kesz in [("érkezési sorrend", fcfs(feladatok)), ("körbeforgó, 2 ms", korbeforgo(feladatok, 2))]:
    atlag = sum(kesz.values()) / len(kesz)
    print(f"{cim:<18} befejezések: {kesz}  átlag: {atlag:.2f} ms")
```

Érkezési sorrendben a rövid „gépelés” feladatnak meg kell várnia a hosszú fordítást – a felhasználó úgy érzi, **akad a gép**. A körbeforgó ütemezésnél a rövid feladatok hamar végeznek, a gép **válaszkész** marad. Az ár: a hosszú fordítás egy kicsit később végez, és minden váltás (környezetváltás) is visz el egy kis időt. A valódi rendszerek (Windows, Linux) ennél okosabbak: **prioritásokat** is használnak, és előnyben részesítik azt, ami a felhasználóval kommunikál.

## 2. Miért jó, ha több program fut egyszerre?

Egy program idejének nagy részében **vár**: a lemezre, a hálózatra, a billentyűzetre. Ha egyetlen program futna, a processzor ilyenkor tétlen lenne. Ha egy program az ideje $p$ részében vár, $n$ program esetén annak esélye, hogy **mind** egyszerre várnak, $p^n$ – a processzor kihasználtsága tehát kb. $1 - p^n$:

```plot
title: CPU-kihasználtság (%) a párhuzamosan futó programok számának függvényében
x: 1, 10
y: 0, 100
param: p = 0.8, 0.1, 0.95, 0.05
f: 100*(1 - p^x) # kihasználtság, ha egy program az ideje p részében vár
```

Ha egy program az ideje 80%-ában vár ($p = 0{,}8$), egyetlen programmal a processzor csak 20%-ban dolgozik, öttel már kb. 67%-ban. De a görbe **ellaposodik**: tíz fölött alig nyersz – közben minden program memóriát foglal, és ha elfogy a RAM, az OS a lemezre kezd lapozni, ami mindent lelassít. Ezért nem segít végtelen sok böngészőfül.

## 3. Elérési utak: hogyan érti az OS a `..`-ot?

Az alapleckében láttuk az abszolút és a relatív elérési utat. Az OS a relatív utat mindig az **aktuális mappához** képest értelmezi: a `.` az aktuális mappa, a `..` a szülőmappa. Írjunk egy kis „feloldót”:

```python run
# Relatív elérési út feloldása abszolúttá (Linux-stílusú utakkal)
def felold(aktualis, relativ):
    if relativ.startswith("/"):
        reszek = []                                # abszolút út: a gyökérből indulunk
    else:
        reszek = [r for r in aktualis.split("/") if r]
    for r in relativ.split("/"):
        if r in ("", "."):
            continue                               # "." = maradunk
        if r == "..":
            if reszek:
                reszek.pop()                       # ".." = egy szinttel feljebb
        else:
            reszek.append(r)
    return "/" + "/".join(reszek)

hol = "/home/anna/egyetem/infoalap"
for ut in ["jegyzet.txt", "../matek/feladatsor.pdf", "./kepek/../abra.png", "../../../../../etc", "/tmp/x"]:
    print(f"{ut:<22} → {felold(hol, ut)}")

# a Python beépített megoldása
import posixpath
print(posixpath.normpath(posixpath.join(hol, "../matek/feladatsor.pdf")))
```

A `../../../../../etc` sor egy **biztonsági** nézőpontot is mutat: a gyökérből nem lehet „kilépni”, de egy rosszul megírt webszerver, amely a felhasználótól kapott fájlnevet ellenőrzés nélkül fűzi egy mappához, `../`-okkal kiadhatja a szerver bármelyik fájlját (ez a **path traversal** támadás). Ezért mindig a feloldott, abszolút utat kell ellenőrizni.

## 4. Jogosultságok: mit jelent a 755?

Linuxon minden fájlnak három jogosultsághármasa van: a **tulajdonosé**, a **csoporté** és **mindenki másé**. Mindegyikben `r` (olvasás, 4), `w` (írás, 2), `x` (futtatás, 1). A három szám összege adja egy számjegyet, így lesz az `rwxr-xr-x`-ből `755`:

```python run
# Jogosultságok: rwx-szöveg ↔ oktális szám
def oktalis(jogok):
    ertek = {"r": 4, "w": 2, "x": 1, "-": 0}
    return "".join(str(sum(ertek[c] for c in jogok[i:i + 3])) for i in (0, 3, 6))

def szoveg(okt):
    return "".join(("r" if int(d) & 4 else "-") + ("w" if int(d) & 2 else "-") + ("x" if int(d) & 1 else "-") for d in okt)

for j in ["rwxr-xr-x", "rw-r--r--", "rw-------", "rwxrwxrwx"]:
    print(f"{j} → {oktalis(j)}")
print("640 →", szoveg("640"))
```

| Jogosultság | Jelentés                                     | Tipikus használat                                    |
| ----------- | -------------------------------------------- | ---------------------------------------------------- |
| `755`       | tulajdonos mindent, mások olvasás + futtatás | programok, szkriptek, mappák                         |
| `644`       | tulajdonos ír-olvas, mások csak olvasnak     | weboldal fájljai, dokumentumok                       |
| `600`       | csak a tulajdonos olvashatja és írhatja      | SSH-kulcs, jelszavakat tartalmazó konfigurációs fájl |
| `777`       | mindenki mindent                             | **kerülendő**: bárki módosíthatja vagy lecserélheti  |

A „legkisebb jogosultság elve” szerint mindenki csak annyi jogot kapjon, amennyi a feladatához kell. Egy biztonsági és egy kényelmi nézőpont ütközik itt: a `777` „megoldja” a jogosultsági hibát, de egyben kaput nyit minden más felhasználónak és folyamatnak is.

## Összefoglalás

- Az ütemező osztja el a processzort; a körbeforgó ütemezés a rövid, interaktív feladatoknak kedvez, az érkezési sorrend egyszerűbb, de akadozást okozhat.
- Több program egyszerre jobban kihasználja a processzort ($\approx 1 - p^n$), de a nyereség ellaposodik, és a memória korlátot szab.
- A relatív utat az OS az aktuális mappához képest oldja fel; a felhasználótól kapott útvonalat mindig feloldva ellenőrizd.
- A jogosultság r = 4, w = 2, x = 1 összegeiből áll (pl. 755, 644, 600); a 777 kerülendő.

## A lecke feladata

```quiz required
? Három feladat érkezik egyszerre, CPU-igényük 6, 2 és 1 ms, ebben a sorrendben. Érkezési sorrendben mikor végez a 2 ms-os feladat (ms)?
= 8
! Előbb a 6 ms-os fut, utána a 2 ms-os: $6 + 2 = 8$.

? Egy program az ideje 50%-ában vár. Hány százalék a CPU-kihasználtság 3 párhuzamos ilyen programnál? (tizedes törtként)
= 87,5
= 87.5
! $1 - 0{,}5^3 = 0{,}875$.

? Az aktuális mappa `/home/anna/egyetem`. Hová mutat a `../letoltesek/a.zip` relatív út?
+ `/home/anna/letoltesek/a.zip`
- `/home/anna/egyetem/letoltesek/a.zip`
- `/letoltesek/a.zip`
- `/home/letoltesek/a.zip`
! A `..` egy szinttel feljebb lép: `/home/anna`.

? Mi az `rw-r-----` jogosultság oktális alakja?
= 640
! $4+2 = 6$, $4$, $0$.

? Melyik jogosultság való egy SSH privát kulcshoz?
- `777`
- `755`
- `644`
+ `600`
! Csak a tulajdonos olvashatja és írhatja.
```
