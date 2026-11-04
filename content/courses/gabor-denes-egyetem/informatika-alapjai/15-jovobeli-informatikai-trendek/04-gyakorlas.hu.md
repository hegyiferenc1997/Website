---
title: Gyakorlás – jövőbeli informatikai trendek
summary: Ellenőrző kérdések és összefoglaló feladatlap az MI-ről, az IoT-ről, az Ipar 4.0-ról, a blokkláncról és a zöld informatikáról.
minutes: 20
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Egy kolléga bemásolja egy ügyfél teljes szerződését egy ingyenes, nyilvános MI-csevegőbe, hogy foglalja össze. Mi a gond, és mi lenne a jobb megoldás?</summary>

Bizalmas adat került egy ellenőrizetlen külső szolgáltatóhoz (üzleti titok, személyes adatok, GDPR). Jobb: a cég által jóváhagyott, vállalati szerződésű MI-eszköz, amely nem tanul az adatokból, és az összefoglalót is ellenőrizni kell.

</details>

<details>
<summary>2. Miért nem érdemes blokkláncot használni egy cég belső raktárnyilvántartásához?</summary>

Mert egy szereplő (a cég) kezeli, a résztvevők megbíznak benne – egy hagyományos adatbázis gyorsabb, olcsóbb és egyszerűbb. A blokklánc ott hasznos, ahol több, egymásban nem bízó fél osztozik egy nyilvántartáson.

</details>

<details>
<summary>3. Hogyan segíthet egy gyárnak a prediktív karbantartás?</summary>

A gépek rezgés-, hő- és áramfelvételi adataiból egy modell előre jelzi a meghibásodást, így a cserét tervezett időpontban végzik, nem áll le váratlanul a gyártósor, és nem cserélnek feleslegesen ép alkatrészt.

</details>

```python run
# Egyszerű „prediktív karbantartás”: a rezgés mozgóátlaga átlépi-e a küszöböt?
rezges = [2.1, 2.0, 2.3, 2.2, 2.6, 3.1, 3.4, 3.9, 4.4]
kuszob = 3.5
for i in range(2, len(rezges)):
    atlag = sum(rezges[i - 2:i + 1]) / 3
    allapot = "RIASZTÁS – karbantartás kell" if atlag > kuszob else "rendben"
    print(f"{i}. mérés, mozgóátlag {atlag:.2f}: {allapot}")
```

## Összefoglaló feladatlap

```quiz required
? Melyik a **generatív MI** példája?
- egy szűrő, amely a spamet elkülöníti
+ egy modell, amely leírás alapján új képet készít
- egy hőmérő
- egy táblázatkezelő SUM függvénye
! A generatív modell új tartalmat hoz létre.

? Melyik könnyű üzenetküldő protokoll terjedt el az IoT-eszközöknél?
= MQTT
! Message Queuing Telemetry Transport.

? Hányadik mérésnél jelez először riasztást a fenti szimuláció?
= 8
! A 7. mérésnél a mozgóátlag (3,1 + 3,4 + 3,9) / 3 ≈ 3,47 még a küszöb alatt van, a 8.-nál (3,4 + 3,9 + 4,4) / 3 = 3,9 már fölötte.

? Mit fenyeget leginkább egy elég nagy kvantumszámítógép?
+ a mai nyilvános kulcsú titkosítást (pl. RSA)
- a Wi-Fi sebességét
- a merevlemezek kapacitását
- a monitorok felbontását
! Ezért kell kvantumbiztos titkosítás.

? Mit tesz az EU MI-rendelete a **nagy kockázatú** MI-rendszerekkel (pl. toborzás)?
- teljesen szabadon engedi őket
+ szigorú követelményeket ír elő rájuk
- csak az USA-ban engedi
- kötelezővé teszi őket
! Kockázatalapú szabályozás.

? Melyik segít a **zöld informatikában**?
+ a felesleges felhős gépek leállítása
- minden eszköz évente cseréje
- a kód lassítása
- több másolat minden adatról, mindenhol
! A ki nem használt erőforrás is fogyaszt.
```
