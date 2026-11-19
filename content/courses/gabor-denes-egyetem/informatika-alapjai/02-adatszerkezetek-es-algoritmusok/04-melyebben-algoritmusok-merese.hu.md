---
title: Mélyebben – algoritmusok mérése és összehasonlítása
summary: Lépésszámlálás lineáris és bináris keresésnél, buborékrendezés kontra összefésülő rendezés, a verem a zárójelek ellenőrzésében és a visszavonás gombban, a sor a nyomtatási sorban, és a hasítótábla ütközései – kis programokkal és interaktív ábrával.
minutes: 45
---

## Amit ebben a leckében megtanulsz

- hogyan **mérd** egy algoritmus lépésszámát, és hogyan olvasd le belőle az O-jelölést,
- miért nyer nagy adatnál a **gyorsabb rendezés**, még ha bonyolultabb is,
- hol használ a valóságban **vermet** és **sort** a szoftver,
- mi az **ütközés** egy hasítótáblában, és miért lesz tőle lassabb.

## 1. Lépésszámlálás: lineáris és bináris keresés

Az alapleckében azt mondtuk, hogy a lineáris keresés $O(n)$, a bináris $O(\log n)$. Ne higgyük el – **számoljuk meg** a lépéseket! A program minden összehasonlításnál növel egy számlálót:

```python run
# Lépésszám mérése: lineáris és bináris keresés a legrosszabb esetben
def linearis(lista, cel):
    lepes = 0
    for x in lista:
        lepes += 1
        if x == cel:
            break
    return lepes

def binaris(lista, cel):
    lepes, bal, jobb = 0, 0, len(lista) - 1
    while bal <= jobb:
        lepes += 1
        kozep = (bal + jobb) // 2
        if lista[kozep] == cel:
            break
        if lista[kozep] < cel:
            bal = kozep + 1
        else:
            jobb = kozep - 1
    return lepes

for n in [10, 100, 1000, 10_000, 1_000_000]:
    lista = list(range(n))
    cel = n - 1                                # a legrosszabb eset: az utolsó elem
    print(f"n = {n:>9}: lineáris {linearis(lista, cel):>9} lépés, bináris {binaris(lista, cel):>2} lépés")
```

Egymillió elemnél a lineáris keresés egymillió, a bináris csak **20** lépés. Ha a lista tízszer nagyobb, a lineáris tízszer annyit lép, a bináris csak kb. 3-mal többet. De ne feledd a **feltételt**: a bináris kereséshez a listának **rendezettnek** kell lennie – és a rendezésnek is ára van.

## 2. Rendezések versenye

A buborékrendezés egyszerű, de $O(n^2)$: kétszer akkora listához **négyszer** annyi összehasonlítás kell. Az **összefésülő rendezés** (merge sort) más ötletet használ: a listát kettévágja, a két felét (rekurzívan) rendezi, majd a két rendezett felet egyetlen menetben összefésüli. Ez $O(n \log n)$:

```python run
# Összehasonlítások száma: buborékrendezés vs. összefésülő rendezés
import random

def buborek(lista):
    a, db = lista[:], 0
    for i in range(len(a) - 1):
        for j in range(len(a) - 1 - i):
            db += 1
            if a[j] > a[j + 1]:
                a[j], a[j + 1] = a[j + 1], a[j]
    return a, db

def osszefesulo(lista):
    if len(lista) <= 1:
        return lista, 0
    k = len(lista) // 2
    bal, db1 = osszefesulo(lista[:k])
    jobb, db2 = osszefesulo(lista[k:])
    ki, i, j, db = [], 0, 0, db1 + db2
    while i < len(bal) and j < len(jobb):      # a két rendezett fél összefésülése
        db += 1
        if bal[i] <= jobb[j]:
            ki.append(bal[i]); i += 1
        else:
            ki.append(jobb[j]); j += 1
    return ki + bal[i:] + jobb[j:], db

random.seed(2)
for n in [10, 100, 1000]:
    lista = [random.randint(0, 9999) for _ in range(n)]
    b, db_b = buborek(lista)
    o, db_o = osszefesulo(lista)
    assert b == o == sorted(lista)             # mindkettő jól rendez
    print(f"n = {n:>5}: buborék {db_b:>7} összehasonlítás, összefésülő {db_o:>6}")
```

Ezer elemnél a buborék kb. félmillió, az összefésülő kb. kilencezer összehasonlítást végez. Az ábrán jól látszik, miért: a $n^2/2$ görbe elszáll, az $n \log_2 n$ szinte egyenes marad. A csúszkával a buborék elé tehetsz egy szorzót – akár azt is feltételezheted, hogy a buborék minden lépése tízszer gyorsabb:

```plot
title: Lépésszám a lista hosszának függvényében
x: 1, 200
y: 0, 5000
param: c = 1, 0.1, 1, 0.05
f: c*x^2/2 # buborékrendezés (c-szeres gyorsítással)
f: x*log2(x) # összefésülő rendezés
```

Még ha a buborék lépései tízszer gyorsabbak is ($c = 0{,}1$), egy bizonyos méret fölött az $n \log n$ **mindig** nyer. Ez az O-jelölés lényege: nagy adatnál a növekedés **jellege** dönt, nem a konstans szorzó. (Kis listáknál viszont az egyszerű algoritmus is lehet gyorsabb – a Python beépített `sorted()` függvénye is egyszerű beszúrásos rendezést használ a rövid darabokra.)

## 3. Verem és sor a gyakorlatban

A **verem** (LIFO: utoljára be, először ki) ott hasznos, ahol a legutóbbi dologra kell visszatérni. Két példa: a szövegszerkesztő **visszavonás** gombja, és a **zárójelek ellenőrzése** – a fordítóprogram és a kódszerkesztő is így jelzi, ha egy zárójel nincs bezárva:

```python run
# Verem: zárójelek ellenőrzése és visszavonás
PAROK = {")": "(", "]": "[", "}": "{"}

def zarojelek_rendben(szoveg):
    verem = []
    for c in szoveg:
        if c in "([{":
            verem.append(c)                        # nyitó: a verem tetejére
        elif c in PAROK:
            if not verem or verem.pop() != PAROK[c]:
                return False                       # nincs párja, vagy rossz a párja
    return not verem                               # minden nyitó bezárult?

for kod in ["print(lista[0])", "f(x[1)]", "{'a': [1, 2]}", "if (a > b:"]:
    print(f"{kod:<18} → {'rendben' if zarojelek_rendben(kod) else 'HIBA'}")

# visszavonás: minden művelet a verembe kerül
szoveg, tortenet = "", []
for muvelet in ["Hello", " világ", "!!!"]:
    tortenet.append(szoveg)
    szoveg += muvelet
print("\nszöveg:", szoveg)
szoveg = tortenet.pop()
print("visszavonás után:", szoveg)
```

A **sor** (FIFO: elsőként be, elsőként ki) a „méltányos” sorrend: a nyomtatási sor, egy webszerver beérkező kérései, vagy egy ügyfélszolgálati rendszer jegyei. Pythonban erre a `collections.deque` való, mert a lista elejéről való törlés lassú ($O(n)$), a `deque.popleft()` viszont $O(1)$.

```python run
# Sor: nyomtatási sor deque-vel
from collections import deque

sor = deque()
for dokumentum in ["szakdolgozat.pdf", "jegyzet.docx", "menetrend.png"]:
    sor.append(dokumentum)                       # a sor végére
    print(f"beérkezett: {dokumentum} (várakozik: {len(sor)})")
while sor:
    print("nyomtatás:", sor.popleft())          # mindig a legrégebbi jön
```

## 4. Hasítótábla és az ütközések

A hasítótábla (Pythonban a `dict` és a `set`) azért gyors, mert a kulcsból egy **hasítófüggvény** kiszámolja, melyik „rekeszbe” kerül – nem kell végignézni az összeset. De mi van, ha két kulcs ugyanabba a rekeszbe esik? Ez az **ütközés**: ilyenkor az adott rekeszben egy kis listát kell végignézni. Egy szándékosan rossz hasítófüggvénnyel jól látszik a különbség:

```python run
# Hasítótábla: jó és rossz hasítófüggvény, ütközések
def rossz_hash(szo, rekesz):
    return len(szo) % rekesz                     # csak a hosszt nézi: sok ütközés

def jo_hash(szo, rekesz):
    h = 0
    for c in szo:
        h = (h * 31 + ord(c)) % rekesz           # minden betű számít, a sorrend is
    return h

szavak = ["alma", "körte", "szilva", "barack", "dinnye", "meggy", "eper", "kiwi", "mangó", "citrom", "füge", "datolya"]
for nev, f in [("rossz", rossz_hash), ("jó", jo_hash)]:
    rekeszek = [[] for _ in range(8)]
    for sz in szavak:
        rekeszek[f(sz, 8)].append(sz)
    leghosszabb = max(len(r) for r in rekeszek)
    print(f"{nev:>5} hash: rekeszméretek {[len(r) for r in rekeszek]}, leghosszabb lánc: {leghosszabb}")
```

A rossz hasítófüggvénynél a szavak néhány rekeszbe zsúfolódnak, és a keresés a leghosszabb láncon már szinte lineáris. Ezért kell egy jó hasítófüggvénynek **egyenletesen szórnia**. (Egy biztonsági nézőpont is van: ha egy támadó tudja, hogyan számol a hasítófüggvény, szándékosan ütköző kulcsokat küldhet, és lelassíthatja a szervert – ezért a Python a szövegek hasítását minden indításkor véletlenszerűsíti.)

| Adatszerkezet   | Keresés     | Beszúrás a végére / elejére | Mikor válaszd?                                 |
| --------------- | ----------- | --------------------------- | ---------------------------------------------- |
| lista (tömb)    | $O(n)$      | $O(1)$ / $O(n)$             | sorrend számít, index szerinti elérés          |
| rendezett lista | $O(\log n)$ | $O(n)$                      | sokat keresel, ritkán szúrsz be                |
| `deque` (sor)   | $O(n)$      | $O(1)$ / $O(1)$             | mindkét végén gyakori ki-be                    |
| `dict` / `set`  | $O(1)$ átl. | $O(1)$ átl.                 | gyors keresés kulcs szerint, a sorrend mindegy |

## Összefoglalás

- Lépésszámlálással ellenőrizheted az O-jelölést: a lineáris keresés $n$, a bináris kb. $\log_2 n$ lépés – de csak rendezett listán működik.
- Az $O(n \log n)$ rendezés (pl. összefésülő) nagy adatnál akkor is legyőzi az $O(n^2)$-et, ha annak lépései gyorsabbak.
- A verem (LIFO) a visszavonásra és a zárójelek ellenőrzésére, a sor (FIFO) a méltányos kiszolgálásra való.
- A hasítótábla átlagosan $O(1)$, de ütközéseknél lassul; a jó hasítófüggvény egyenletesen szór.

## A lecke feladata

```quiz required
? Legfeljebb hány lépés kell a bináris kereséshez egy 1024 elemű rendezett listában?
= 11
! Minden lépés felezi a tartományt: $1024 \to 512 \to \ldots \to 1$ az 10 felezés, plusz az utolsó összehasonlítás, összesen 11.

? A buborékrendezés $n$ elemre kb. $n^2/2$ összehasonlítást végez. Hányszorosára nő ez, ha a lista hossza háromszorosára nő?
= 9
! $(3n)^2 / 2 = 9 \cdot n^2/2$.

? Melyik adatszerkezet illik a „Visszavonás” (Ctrl+Z) gombhoz?
+ verem
- sor
- hasítótábla
- rendezett lista
! Mindig a legutóbbi műveletet vonjuk vissza (LIFO).

? Melyik zárójelsorozat helyes?
- `( [ ) ]`
+ `{ ( [ ] ) }`
- `( ( )`
- `] [`
! Minden záró zárójel a legutóbbi nyitott párját zárja.

? Mi történik egy hasítótáblában, ha sok kulcs ugyanabba a rekeszbe esik?
- semmi, ugyanolyan gyors marad
+ a keresés lelassul, mert a rekeszben lévő elemeket egyenként kell végignézni
- a tábla törli a régi kulcsokat
- hibaüzenetet kapunk
! Ezért kell egyenletesen szóró hasítófüggvény.
```
