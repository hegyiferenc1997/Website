---
title: Mélyebben – csapat és szerepek számokkal
summary: Egy RACI-mátrix automatikus ellenőrzése (pontosan egy elszámoltatható, terhelés személyenként), a csapatméret hatása – kommunikációs csatornák, alcsapatokra bontás és a Ringelmann-hatás interaktív ábrán –, valamint Belbin-szerepek lefedése egy csapat összeállításakor programmal.
minutes: 35
---

## Amit ebben a leckében megtanulsz

- hogyan ellenőrizd géppel egy **RACI-mátrix** szabályait, és hogyan látszik belőle a túlterhelés,
- miért érdemes egy nagy csapatot **alcsapatokra** bontani, és mit mutat a **Ringelmann-hatás**,
- hogyan állíts össze csapatot úgy, hogy minden fontos **Belbin-szerep** le legyen fedve.

## 1. A RACI-mátrix ellenőrzése

A RACI-mátrix két alapszabálya: minden feladatnak **pontosan egy** elszámoltathatója (A) van, és legalább egy végrehajtója (R). Egy program ezt (és a terhelést) azonnal ellenőrzi:

```python run
# RACI-mátrix ellenőrzése: feladatonként pontosan egy A és legalább egy R; R-terhelés személyenként
raci = {
    "követelmények":   {"Anna": "A", "Bence": "R", "Csilla": "C", "Dávid": "I"},
    "UI-terv":         {"Anna": "I", "Bence": "C", "Csilla": "R", "Dávid": "A"},
    "backend":         {"Anna": "A", "Bence": "R", "Dávid": "A"},
    "tesztelés":       {"Anna": "I", "Bence": "R", "Csilla": "C"},
    "élesítés":        {"Anna": "A", "Bence": "R", "Dávid": "C"},
}
terheles = {}
for feladat, szerepek in raci.items():
    a = [n for n, s in szerepek.items() if s == "A"]
    r = [n for n, s in szerepek.items() if s == "R"]
    if len(a) != 1:
        print(f"HIBA – {feladat}: {len(a)} elszámoltatható ({', '.join(a) or 'senki'})")
    if not r:
        print(f"HIBA – {feladat}: nincs végrehajtó")
    for n in r:
        terheles[n] = terheles.get(n, 0) + 1

print("\nvégrehajtói (R) terhelés:", terheles)
```

A program két hibát talál: a backendnek **két** elszámoltathatója van (Anna és Dávid – ha baj van, mindketten a másikra mutatnak), a tesztelésnek pedig **egy sincs** (senki sem felel azért, hogy elkészüljön). A terhelés is figyelmeztet: Bence öt feladatból négyben végrehajtó – ő a projekt **szűk keresztmetszete**, és ha megbetegszik, minden megáll. A RACI tehát nemcsak a felelősségeket rögzíti, hanem a kockázatokat is megmutatja.

## 2. Csapatméret: csatornák és a Ringelmann-hatás

Egy 12 fős csapatban a kommunikációs csatornák száma $\frac{12 \cdot 11}{2} = 66$. Ha két 6 fős alcsapatra bontjuk, és a két csapatvezető tartja a kapcsolatot:

```python run
# Kommunikációs csatornák: egy nagy csapat vs. alcsapatok, amelyeket a vezetőik kötnek össze
def csatornak(n):
    return n * (n - 1) // 2

for meretek in [[12], [6, 6], [4, 4, 4], [3, 3, 3, 3]]:
    belso = sum(csatornak(m) for m in meretek)
    vezetok = csatornak(len(meretek))            # az alcsapatok vezetői egymással is beszélnek
    print(f"{' + '.join(map(str, meretek)):>13} fő: {belso:>2} belső + {vezetok} vezetői = {belso + vezetok:>2} csatorna")
```

A két alcsapat már csak 31 csatornát jelent a 66 helyett, három négyfős csapat 21-et. Ezért szervezik a nagy agilis projekteket **kis, önálló csapatokba** (a Scrum 10 fő alatti csapatot javasol, az Amazon „két pizzás csapatnak” hívja: akkora, amekkorát két pizza jóllakat).

A másik ok emberi. Maximilien Ringelmann francia mérnök a 19–20. század fordulóján kötélhúzókat mért meg: minél többen húztak együtt, annál kisebb volt az **egy főre jutó** erő. Ez a **Ringelmann-hatás** (társas lazsálás): nagy csoportban az egyén hozzájárulása kevésbé látszik, és részben az összehangolás is nehezebb.

```python run
# Ringelmann-hatás: az egy főre jutó teljesítmény csökken a csoport méretével (egyszerű modell)
csokkenes = 0.07                                 # minden további tag 7%-kal csökkenti az egyéni teljesítményt
for n in [1, 2, 3, 4, 6, 8]:
    egyeni = max(0.0, 1 - csokkenes * (n - 1))
    print(f"{n} fő: egyéni teljesítmény {egyeni:4.0%}, a csoport összesen {n * egyeni:4.1f} ember erejével húz")
```

A modellben 8 ember csak kb. 4 ember erejével húz – Ringelmann mérései is hasonlót mutattak. A gyakorlati ellenszer: **látható egyéni hozzájárulás** (saját felelősségi terület, nevesített feladatok a táblán), kis csapatok és közös, értelmes cél.

```plot
title: A csoport teljes teljesítménye a létszám függvényében (Ringelmann-modell)
x: 1, 12
y: 0, 12
param: c = 0.07, 0, 0.1, 0.005
f: x*(1 - c*(x - 1)) # a csoport teljesítménye (emberben)
f: x # ideális eset
```

Állítsd a csökkenést ($c$) nullára: a két vonal egybeesik. Már kis $c$ mellett is gyorsan nyílik az olló a létszámmal.

## 3. Belbin-szerepek lefedése

Belbin szerint egy jól működő csapatban minden fontos szerep jelen van (pl. ötletgazda, megvalósító, koordinátor, befejező, szakértő…). Hét jelölt közül négyet választhatunk; mindenkinél a két legerősebb szerepét ismerjük. Melyik négyes fedi le a legtöbb szerepet?

```python run
# Csapat-összeállítás: 7 jelöltből 4, hogy a legtöbb Belbin-szerep le legyen fedve
import itertools

jeloltek = {
    "Anna": {"koordinátor", "csapatjátékos"}, "Bence": {"megvalósító", "befejező"},
    "Csilla": {"ötletgazda", "szakértő"}, "Dávid": {"megvalósító", "szakértő"},
    "Emese": {"forrásfeltáró", "csapatjátékos"}, "Feri": {"helyzetértékelő", "befejező"},
    "Gréta": {"serkentő", "ötletgazda"},
}
minden_szerep = set().union(*jeloltek.values())

legjobb = max(itertools.combinations(jeloltek, 4),
              key=lambda csapat: len(set().union(*(jeloltek[n] for n in csapat))))
lefedett = set().union(*(jeloltek[n] for n in legjobb))
print(f"legjobb négyes: {', '.join(legjobb)} – {len(lefedett)} / {len(minden_szerep)} szerep")
print("hiányzó szerepek:", ", ".join(sorted(minden_szerep - lefedett)))
```

A program az összes $\binom{7}{4} = 35$ négyest kipróbálja, és azt választja, amelyik a legtöbb különböző szerepet hozza – a két „hasonló” ember (pl. Bence és Dávid, mindkettő megvalósító) helyett jobb egy kiegészítő. (Négy ember legfeljebb 8 szerepet hozhat, a 9 szerepből tehát egy biztosan hiányozni fog; ezt a csapatnak tudatosan pótolnia kell.) A Belbin-modell persze csak egy szempont: a szakmai tudás, a rendelkezésre állás és az emberi kémia ugyanúgy számít. De jól mutatja, hogy a **sokféleség** érték: ha mindenki ötletgazda, senki sem fejezi be a munkát.

## Összefoglalás

- A RACI-mátrix szabályai (pontosan egy A, legalább egy R) géppel ellenőrizhetők; az R-ek száma személyenként a túlterhelést és a szűk keresztmetszetet mutatja.
- A kommunikációs csatornák száma $\frac{n(n-1)}{2}$; alcsapatokra bontással drasztikusan csökken.
- A Ringelmann-hatás miatt nagy csoportban csökken az egyéni teljesítmény; ellenszer a látható egyéni hozzájárulás és a kis csapat.
- Csapat-összeállításnál a szerepek lefedése (sokféleség) fontosabb, mint hogy mindenki ugyanabban legyen erős.

## A lecke feladata

```quiz required
? Hány kommunikációs csatorna van összesen, ha egy 10 fős csapatot két 5 fős alcsapatra bontunk, és a két vezető tartja a kapcsolatot?
= 21
! $10 + 10 + 1 = 21$ (egy 5 fős csapatban $\frac{5 \cdot 4}{2} = 10$ csatorna van).

? Mi a hiba egy RACI-mátrixban, ha egy feladatnál két „A” szerepel?
- semmi, így biztosabb
+ nem egyértelmű, ki az elszámoltatható – mindketten a másikra hivatkozhatnak
- kevés a végrehajtó
- túl sok a tájékoztatandó
! Minden feladatnak pontosan egy elszámoltathatója kell legyen.

? A Ringelmann-modellben az egyéni teljesítmény 4 fős csoportban 85%. Hány ember erejével húz a csoport?
= 3,4
= 3.4
! $4 \cdot 0{,}85 = 3{,}4$.

? Mit jelent, ha egy csapattag a RACI-mátrixban szinte minden feladatnál „R”?
+ ő a szűk keresztmetszet, túlterhelt, és a kiesése nagy kockázat
- ő a legjobb vezető
- a mátrix így helyes
- neki kell lennie az „A”-nak is mindenhol
! A terhelést érdemes kiegyenlíteni és helyettest kijelölni.

? 7 jelöltből hányféleképpen választhatunk 4 fős csapatot?
= 35
! $\binom{7}{4} = \frac{7 \cdot 6 \cdot 5 \cdot 4}{4 \cdot 3 \cdot 2 \cdot 1} = 35$.
```
