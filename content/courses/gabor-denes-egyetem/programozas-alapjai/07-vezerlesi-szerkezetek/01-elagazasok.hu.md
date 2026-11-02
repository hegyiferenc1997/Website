---
title: Elágazások (if, elif, else)
summary: Feltételtől függő végrehajtás: egy-, két- és többirányú elágazás, beágyazás és a gyakori hibák.
minutes: 15
---

## Amit ebben a leckében megtanulsz

- az **egyirányú**, **kétirányú** és **többirányú** elágazást,
- hogyan **ágyazol egymásba** elágazásokat,
- mire figyelj a feltételek **sorrendjénél**.

## Egyirányú elágazás: if

Ha a feltétel igaz, lefut a behúzott blokk; ha hamis, a program átugorja.

```python run
homerseklet = 31
if homerseklet > 30:
    print("Hőségriasztás!")
print("Időjárás-jelentés vége.")
```

## Kétirányú elágazás: if – else

```python run
szam = 7
if szam % 2 == 0:
    print("páros")
else:
    print("páratlan")
```

## Többirányú elágazás: if – elif – else

Az `elif` („else if”) ágakat **sorban, felülről** vizsgálja a Python, és **csak az első igaz ág** fut le.

```python run
pont = 78

if pont >= 89:
    jegy = 5
elif pont >= 76:
    jegy = 4
elif pont >= 63:
    jegy = 3
elif pont >= 50:
    jegy = 2
else:
    jegy = 1

print("Jegy:", jegy)   # 4
```

> **Figyelj a sorrendre!** Ha a `pont >= 50` feltétel állna elöl, a 78 pont is 2-es lenne, mert az az első igaz ág. A szigorúbb feltétel mindig kerüljön előre.

A fenti ponthatárok egyébként épp a tárgy értékelési skálája (50–62 elégséges, 63–75 közepes, 76–88 jó, 89–100 jeles).

## Beágyazott elágazás

Egy ágon belül újabb elágazás is állhat:

```python run
kor = 20
van_jegy = True

if kor >= 18:
    if van_jegy:
        print("Beléphetsz.")
    else:
        print("Előbb vegyél jegyet.")
else:
    print("Csak 18 éven felülieknek.")
```

Ugyanez gyakran egyszerűsíthető logikai operátorral – a túl mély beágyazás nehezen olvasható:

```python run
kor = 20
van_jegy = True

if kor < 18:
    print("Csak 18 éven felülieknek.")
elif not van_jegy:
    print("Előbb vegyél jegyet.")
else:
    print("Beléphetsz.")
```

## Folyamatábra és pszeudokód

```text
Ha feltétel akkor
    utasítások1
különben
    utasítások2
Elágazás vége
```

## Gyakori hibák

```python
# 1. Hiányzó kettőspont → SyntaxError
if x > 5
    print(x)

# 2. = az == helyett → SyntaxError
if x = 5:
    print(x)

# 3. Rossz behúzás → IndentationError vagy logikai hiba
if x > 5:
print(x)
```

```python run
# 4. Független if-ek elif helyett: több ág is lefuthat!
pont = 95
if pont >= 89:
    print("jeles")
if pont >= 76:          # ez is igaz → ez is kiíródik
    print("jó")
```

## Összefoglalás

- `if` – egyirányú, `if-else` – kétirányú, `if-elif-else` – többirányú elágazás.
- Az `elif` ágak közül csak az **első igaz** fut le; a szigorúbb feltételt írd előre.
- A mély beágyazást logikai operátorokkal vagy átrendezéssel egyszerűsítsd.
