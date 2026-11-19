---
title: Mélyebben – hálóterv programmal
summary: A kritikus út módszere (CPM) mint algoritmus – topologikus sorrend, előre- és visszafelé számítás, tartalékidők – Pythonban, szöveges Gantt-diagram a számított időpontokból, „mi lenne, ha” elemzés a csúszásokra, és a WBS 100%-os szabályának automatikus ellenőrzése.
minutes: 40
---

## Amit ebben a leckében megtanulsz

- hogyan számolja ki egy **program** (minden projektmenedzsment-szoftver) a kritikus utat,
- hogyan készül a számított időpontokból **Gantt-diagram**,
- hogyan vizsgáld meg, **melyik csúszás** veszélyezteti a határidőt,
- hogyan ellenőrizd géppel a **WBS** összegzését.

## 1. A kritikus út mint algoritmus

A hálótervezés leckéjének példáját most egy program számolja ki. Három lépés:

1. **topologikus sorrend**: olyan sorrend, amelyben minden tevékenység a megelőzői után jön,
2. **előre számítás**: $ES = \max(\text{megelőzők } EF)$, $EF = ES + \text{időtartam}$,
3. **visszafelé számítás**: $LF = \min(\text{rákövetkezők } LS)$, $LS = LF - \text{időtartam}$; a tartalékidő $LS - ES$.

```python run
# Kritikus út módszere (CPM): előre- és visszafelé számítás, tartalékidő
tev = {  # név: (időtartam napban, megelőzők)
    "A": (3, []), "B": (2, ["A"]), "C": (4, ["A"]), "D": (3, ["B"]), "E": (2, ["C", "D"]),
}

# 1) topologikus sorrend: mindig azt vesszük, aminek minden megelőzője már sorra került
sorrend = []
while len(sorrend) < len(tev):
    for nev, (_, elozok) in tev.items():
        if nev not in sorrend and all(e in sorrend for e in elozok):
            sorrend.append(nev)

# 2) előre számítás
ES, EF = {}, {}
for nev in sorrend:
    ido, elozok = tev[nev]
    ES[nev] = max((EF[e] for e in elozok), default=0)
    EF[nev] = ES[nev] + ido
hossz = max(EF.values())

# 3) visszafelé számítás (fordított sorrendben)
LS, LF = {}, {}
for nev in reversed(sorrend):
    utodok = [u for u, (_, el) in tev.items() if nev in el]
    LF[nev] = min((LS[u] for u in utodok), default=hossz)
    LS[nev] = LF[nev] - tev[nev][0]

print("tev. | ES | EF | LS | LF | tartalék")
for nev in sorrend:
    print(f"  {nev}  | {ES[nev]:>2} | {EF[nev]:>2} | {LS[nev]:>2} | {LF[nev]:>2} | {LS[nev] - ES[nev]:>3}")
kritikus = [n for n in sorrend if LS[n] == ES[n]]
print(f"\nprojekt hossza: {hossz} nap, kritikus út: {' → '.join(kritikus)}")
```

Ugyanaz jön ki, mint kézzel: a projekt 10 nap, a kritikus út A → B → D → E, a C tevékenységnek 1 nap tartaléka van. A program előnye, hogy **száz vagy ezer** tevékenységnél is azonnal számol – így működik az MS Project, a GanttProject és a többi ütemező. (A topologikus rendezés itt egyszerű, de lassú változat; nagy hálónál a Kahn-algoritmus a szokásos, és az is kiderül vele, ha a függőségekben **kör** van – az hibás terv.)

## 2. Gantt-diagram a számított időpontokból

A Gantt-diagram egyszerűen az ES–EF intervallumok rajza. Egy kicsit nagyobb példa, egy webshop-fejlesztés:

```python run
# Szöveges Gantt-diagram: a sávok a legkorábbi kezdéstől a befejezésig tartanak, a tartalék ponttal
tev = {  # név: (időtartam napban, megelőzők)
    "Követelmények": (4, []), "UI-terv": (3, ["Követelmények"]), "Adatbázis": (3, ["Követelmények"]),
    "Backend": (6, ["Adatbázis"]), "Frontend": (5, ["UI-terv"]), "Fizetés": (3, ["Backend"]),
    "Tesztelés": (4, ["Frontend", "Fizetés"]), "Élesítés": (1, ["Tesztelés"]),
}
ES, EF = {}, {}
for nev, (ido, elozok) in tev.items():                  # itt a felsorolás már helyes sorrendű
    ES[nev] = max((EF[e] for e in elozok), default=0)
    EF[nev] = ES[nev] + ido
hossz = max(EF.values())
LS = {}
for nev in reversed(list(tev)):
    utodok = [u for u, (_, el) in tev.items() if nev in el]
    LS[nev] = min((LS[u] for u in utodok), default=hossz) - tev[nev][0]

for nev in tev:
    tartalek = LS[nev] - ES[nev]
    sav = " " * ES[nev] + ("█" if tartalek == 0 else "▒") * tev[nev][0] + "·" * tartalek
    print(f"{nev:<14}|{sav:<{hossz}}| {'kritikus' if tartalek == 0 else f'{tartalek} nap tartalék'}")
print(f"{'':<14} 0{'':<{hossz - 3}}{hossz} nap")
```

A **█** sávok a kritikus út (Követelmények → Adatbázis → Backend → Fizetés → Tesztelés → Élesítés, 21 nap), a **▒** sávok mögötti pontok a tartalékot mutatják: a UI-terv és a Frontend együtt 4 napot csúszhat a határidő veszélyeztetése nélkül. Fontos: a tartalék a **láncon** osztozik – ha a UI-terv 3 napot csúszik, a Frontendnek már csak 1 nap marad.

## 3. Mi lenne, ha…? – csúszások hatása

A projektmenedzser egyik legfontosabb kérdése: ha egy tevékenység csúszik, csúszik-e a projekt? Számoljuk újra a hálót minden tevékenység 2 napos késésével:

```python run
# Érzékenységvizsgálat: ha egy tevékenység 2 napot csúszik, mennyivel csúszik a projekt?
alap = {"A": (3, []), "B": (2, ["A"]), "C": (4, ["A"]), "D": (3, ["B"]), "E": (2, ["C", "D"])}

def projekt_hossz(tev):
    EF = {}
    for nev, (ido, elozok) in tev.items():               # helyes sorrendű felsorolás
        EF[nev] = max((EF[e] for e in elozok), default=0) + ido
    return max(EF.values())

h0 = projekt_hossz(alap)
for nev in alap:
    modositott = dict(alap)
    ido, elozok = alap[nev]
    modositott[nev] = (ido + 2, elozok)                  # ez a tevékenység 2 nappal tovább tart
    print(f"{nev} +2 nap → projekt {projekt_hossz(modositott)} nap (csúszás: {projekt_hossz(modositott) - h0})")
```

A kritikus tevékenységek (A, B, D, E) minden napnyi csúszása a projektet is csúsztatja. A C 2 napos csúszása viszont csak **1 napot** késleltet: az első napot elnyeli a tartalék, de a második már a határidőt tolja – sőt ekkor **új kritikus út** keletkezik (A → C → E). Ezért kell a tartalékot is figyelni, nem csak a kritikus utat.

## 4. A WBS 100%-os szabálya géppel

A 100%-os szabály: egy WBS-elem alá tartozó elemek együtt **pontosan** a szülő munkáját fedik le – se többet, se kevesebbet. Ha minden munkacsomaghoz becsült költséget rendelünk, a gép rekurzívan összegezhet és ellenőrizhet:

```python run
# WBS összegzés rekurzívan, és a 100%-os szabály ellenőrzése a jóváhagyott keretekkel (ezer Ft)
wbs = {"Webshop": {"Tervezés": {"Követelmények": 400, "UI-terv": 300},
                   "Fejlesztés": {"Backend": 1200, "Frontend": 900, "Fizetés": 500},
                   "Bevezetés": {"Tesztelés": 600, "Élesítés": 100}}}
keret = {"Webshop": 3800, "Tervezés": 700, "Fejlesztés": 2400, "Bevezetés": 700}

def osszeg(elem, nev, szint=0):
    if isinstance(elem, (int, float)):                   # munkacsomag: a becslés maga
        return elem
    s = sum(osszeg(gyerek, gy_nev, szint + 1) for gy_nev, gyerek in elem.items())
    jel = "rendben" if s == keret[nev] else f"ELTÉRÉS: keret {keret[nev]}"
    print(f"{'  ' * szint}{nev}: {s} – {jel}")
    return s

osszeg(wbs["Webshop"], "Webshop")
```

A gép rögtön megtalálja, hogy a Fejlesztés munkacsomagjai 2600 ezer forintot adnak ki, a jóváhagyott keret 2400 – és emiatt a teljes projekt is 200 ezerrel túllépi a 3800-as keretet. Vagy hiányzik valami a keretből, vagy a WBS-ben van olyan munka, ami nem kellene. A rekurzió (a függvény önmagát hívja a gyerekekre) pontosan a WBS fa szerkezetét követi.

## Összefoglalás

- A CPM egy algoritmus: topologikus sorrend, előre számítás (max), visszafelé számítás (min), tartalék = LS − ES.
- A Gantt-diagram az ES–EF intervallumok rajza; a tartalék a láncon közös.
- „Mi lenne, ha” elemzéssel látszik, melyik csúszás veszélyezteti a határidőt, és mikor születik új kritikus út.
- A WBS rekurzívan összegezhető, a 100%-os szabály géppel ellenőrizhető.

## A lecke feladata

```quiz required
? Egy tevékenység megelőzőinek legkorábbi befejezései 5, 8 és 6. Mi a tevékenység legkorábbi kezdése (ES)?
= 8
! Az ES a megelőzők EF-jeinek maximuma.

? Egy tevékenység rákövetkezőinek legkésőbbi kezdései 12 és 10, időtartama 3. Mi a legkésőbbi kezdése (LS)?
= 7
! $LF = \min(12, 10) = 10$, $LS = 10 - 3 = 7$.

? A lecke példájában (A3, B2, C4, D3, E2) a C tevékenység 3 napot csúszik. Hány napos lesz a projekt?
= 12
! C-nek 1 nap tartaléka van, így a projekt 2 napot csúszik: 10 + 2 = 12.

? Mit jelez, ha a topologikus rendezés nem tud minden tevékenységet sorba rakni?
- hogy túl sok a tevékenység
+ hogy a függőségekben kör van, ami hibás terv
- hogy nincs kritikus út
- hogy minden tevékenység kritikus
! Körkörös függőségnél egyik tevékenység sem kezdhető el elsőként.

? Egy WBS-elem gyerekeinek becslései 300, 450 és 250, a jóváhagyott keret 1100. Mit mutat a 100%-os szabály szerinti ellenőrzés?
- rendben van
+ eltérést: a munkacsomagok 1000-et adnak ki, a keret 1100
- a WBS-t el kell dobni
- a keretet csökkenteni kell 300-ra
! $300 + 450 + 250 = 1000 \ne 1100$ – valami hiányzik a WBS-ből, vagy a keret túlbecsült.
```
