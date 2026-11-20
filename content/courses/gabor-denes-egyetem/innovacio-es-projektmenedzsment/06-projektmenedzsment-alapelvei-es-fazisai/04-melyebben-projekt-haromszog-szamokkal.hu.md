---
title: Mélyebben – a projekt háromszög számokkal
summary: Idő és költség átváltása a csapatlétszámmal (miért nem gyorsít a végtelenségig több ember – a kommunikációs többletteher), a változtatás költsége fázisonként egy hibás követelmény példáján, és a halmozott költség S-görbéje a befolyásolhatóság csökkenésével szemben – kis programokkal és interaktív ábrával.
minutes: 35
---

## Amit ebben a leckében megtanulsz

- hogyan **váltható át** az idő és a költség a projekt háromszögben, és hol a határa (Brooks törvénye),
- miért **sokszorosára** drágul egy hiba, ha későn vesszük észre,
- miért a projekt **elején** a legnagyobb a befolyásunk, miközben a pénz nagy része később fogy el.

## 1. Több ember = gyorsabb projekt?

A projekt háromszög szerint a terjedelem, az idő és a költség összefügg: ha rövidebb határidőt akarunk, általában **több erőforrás** (pénz, ember) kell. De nem korlátlanul. Egy 120 emberhetes feladatnál minden új csapattag növeli a **kommunikációs többletterhet**: tegyük fel, hogy minden további ember mindenki hatékonyságát 3%-kal csökkenti (megbeszélések, egyeztetés, összehangolás).

```python run
# Csapatlétszám, időtartam és költség: 120 emberhét munka, emberenként 3% kommunikációs veszteség
munka, veszteseg = 120, 0.03

print(f"{'létszám':>7} | {'hatékony kapacitás':>18} | {'időtartam (hét)':>15} | {'költség (emberhét)':>18}")
for n in [1, 2, 4, 6, 8, 10, 15, 20]:
    kapacitas = n * (1 - veszteseg * (n - 1))        # a valódi heti teljesítmény emberhétben
    ido = munka / kapacitas
    print(f"{n:>7} | {kapacitas:>18.2f} | {ido:>15.1f} | {n * ido:>18.1f}")
```

1 emberrel 120 hét, 4-gyel 33 hét – eddig szinte arányos a gyorsulás. 10 emberrel viszont már csak 16,4 hét, és a költség 120 helyett 164 emberhét; 15 fölött pedig az időtartam már nem rövidül (20 embernél 14,0 hét, több, mint 15-nél), a költség viszont meredeken nő. Ez a háromszög átváltása számokban: **az idő rövidítéséért költséggel fizetünk, egyre drágábban.**

**Brooks törvénye** (Fred Brooks, _A mitikus ember-hónap_) még tovább megy: „Egy késésben lévő szoftverprojekthez embert adni csak tovább késlelteti.” Az új embereket be kell tanítani (ez a régiek idejét viszi), és a kommunikációs csatornák száma $\frac{n(n - 1)}{2}$ szerint nő.

```plot
title: A projekt időtartama a csapatlétszám függvényében (120 emberhét)
x: 1, 20
y: 0, 130
param: o = 0.03, 0, 0.05, 0.005
f: 120/(x*(1 - o*(x - 1))) # időtartam (hét)
```

Állítsd a kommunikációs veszteséget ($o$) nullára: ekkor a görbe az ideális $120 / n$. Növeld 5%-ra: a görbe hamar „ellaposodik”, sőt a végén újra emelkedik – ott már a több ember **lassít**.

## 2. A változtatás költsége

Egy követelményhiba (pl. félreértett üzleti szabály) javításának költsége annál nagyobb, minél később vesszük észre. Az iparági tapasztalat nagyjából ilyen szorzókat mutat:

```python run
# A változtatás (hibajavítás) költsége fázisonként – szorzók a követelményfázishoz képest
szorzok = {"követelmények": 1, "tervezés": 5, "fejlesztés": 10, "tesztelés": 20, "élesítés után": 100}
alap = 50_000                                     # Ft, ha a követelményfázisban vesszük észre
szam = lambda x: f"{x:,.0f}".replace(",", " ")    # ezres tagolás szóközzel

for fazis, sz in szorzok.items():
    print(f"{fazis:<15}: {szam(alap * sz):>9} Ft")

# 40 követelményhiba: átvizsgálás nélkül vs. egy 600 000 Ft-os követelmény-átvizsgálással,
# amely a hibák 60%-át már az elején kiszűri (a többit a tesztelésben találjuk meg)
hibak = 40
nelkule = hibak * alap * szorzok["tesztelés"]
vele = 600_000 + hibak * 0.6 * alap * szorzok["követelmények"] + hibak * 0.4 * alap * szorzok["tesztelés"]
print(f"\nátvizsgálás nélkül: {szam(nelkule)} Ft, átvizsgálással: {szam(vele)} Ft")
```

Egy 50 000 forintos javításból élesítés után 5 millió lesz: újra kell tervezni, fejleszteni, tesztelni, kiadni, és közben a felhasználók is szenvednek. Ezért térül meg sokszorosan a gondos **tervezési szakasz**, a követelmények átvizsgálása és a korai prototípus: a példában egy 600 000 forintos átvizsgálás 40 milliós javítási költségből 17,8 milliót csinál.

## 3. Halmozott költség és befolyásolhatóság

A projekt költsége nem egyenletesen fogy: az elején (kezdeményezés, tervezés) kevés ember dolgozik, a végrehajtásban a legtöbb, a lezáráskor megint kevés. A **halmozott költség** ezért S alakú görbét ír le:

```python run
# A projekt heti költsége fázisonként (millió Ft) és a halmozott költség S-görbéje
fazisok = [("kezdeményezés", 2, 0.5), ("tervezés", 4, 1.5), ("végrehajtás", 10, 6), ("lezárás", 2, 1)]
osszes = sum(het * koltseg for _, het, koltseg in fazisok)

halmozott, het_szam = 0, 0
for nev, het, koltseg in fazisok:
    halmozott += het * koltseg
    het_szam += het
    print(f"{nev:<14} vége ({het_szam:>2}. hét): halmozott {halmozott:5.1f} M Ft = {halmozott / osszes:4.0%}")
```

A tervezés végére a pénznek még csak kb. 10%-át költöttük el – de ekkorra már **eldőlt** a megoldás szerkezete, a terjedelem és az ütemterv. Az érintettek befolyása a projekt elején a legnagyobb, és ahogy haladunk, egyre drágább bármit megváltoztatni (lásd a 2. részt). Ez a két görbe – a növekvő költség és a csökkenő befolyásolhatóság – a projektmenedzsment egyik legfontosabb ábrája: **a jó döntéseket korán, olcsón kell meghozni.**

## Összefoglalás

- A projekt háromszögben az idő pénzzel (emberekkel) rövidíthető, de a kommunikációs többletteher miatt egyre drágábban; egy ponton túl a több ember már lassít (Brooks törvénye).
- Egy hiba javítása fázisonként nagyságrendekkel drágul (1 → 5 → 10 → 20 → 100); a korai átvizsgálás sokszorosan megtérül.
- A halmozott költség S alakú; a befolyásolhatóság a projekt elején a legnagyobb.

## A lecke feladata

```quiz required
? Hány kommunikációs csatorna van egy 6 fős csapatban?
= 15
! $\frac{6 \cdot 5}{2} = 15$.

? Egy 60 emberhetes feladatot 3 ember végez, és a kommunikációs veszteség miatt mindenki 90%-os hatékonysággal dolgozik. Hány hét alatt végeznek?
= 22,2
= 22.2
! $60 / (3 \cdot 0{,}9) = 60 / 2{,}7 \approx 22{,}2$.

? Mit mond Brooks törvénye?
- minél több ember, annál gyorsabb a projekt
+ egy késésben lévő szoftverprojekthez embert adni csak tovább késlelteti
- a projektek mindig késnek
- a költség a létszámmal fordítottan arányos
! A betanítás és a kommunikációs csatornák szaporodása lassít.

? Egy hiba javítása a követelményfázisban 20 000 Ft. Mennyibe kerül élesítés után, ha a szorzó 100?
= 2000000
= 2 000 000
! $20\,000 \cdot 100 = 2\,000\,000$ Ft.

? A projekt melyik szakaszában a legnagyobb az érintettek befolyása a végeredményre?
+ az elején (kezdeményezés, tervezés)
- a végrehajtás közepén
- a lezáráskor
- mindig ugyanakkora
! Később minden változtatás egyre drágább.
```
