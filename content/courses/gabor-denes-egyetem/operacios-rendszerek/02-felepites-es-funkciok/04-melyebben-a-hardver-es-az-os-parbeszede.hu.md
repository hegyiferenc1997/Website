---
title: Mélyebben – a hardver és az OS párbeszéde
summary: Az OS három szerepe (erőforrás-gazda, „kibővített gép”, játékvezető), a memóriahierarchia emberi léptékben, lekérdezés kontra megszakítás számokkal, a DMA, és egy rendszerindítás nyomozása a virtuális gépen.
minutes: 40
---

## Amit ebben a leckében megtanulsz

- az operációs rendszer **három szerepét**, egy-egy hétköznapi hasonlattal,
- miért olyan fontos, hogy az adat **melyik tárolószinten** van – emberi időléptékre átszámolva,
- mikor jobb a **lekérdezéses** (polling) és mikor a **megszakításos** eszközkezelés – számokkal,
- mire jó a **DMA**,
- hogyan **nyomozd végig** egy rendszerindítás lépéseit és egy eszköz megszakításait a laborgépen.

## 1. Az OS három szerepe

Ugyanarra a programra háromféleképpen is lehet nézni:

| Szerep                           | Mit csinál?                                                                | Hasonlat                                                                      |
| -------------------------------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| **erőforrás-gazda**              | elosztja a processzoridőt, a memóriát, a lemezt a programok között         | egy étterem főpincére: ki melyik asztalt kapja, mikor                         |
| **kibővített gép** (absztrakció) | a bonyolult hardvert egyszerű fogalmakká alakítja: fájl, folyamat, socket  | az autó kormánya és pedálja: nem kell tudnod, hogyan működik a befecskendezés |
| **játékvezető** (védelem)        | betartatja a szabályokat: egy program ne írhasson bele a másik memóriájába | a focibíró: aki szabálytalankodik, kiállítja                                  |

Nézzük meg az absztrakciót egy példán. Amikor egy program ezt írja:

```python
open("jegyzet.txt", "w").write("Helló")
```

az OS a háttérben: megkeresi a fájlrendszerben a könyvtárat, szabad blokkot foglal, eldönti, melyik **lemezszektorba** kerül az adat, utasítja a lemezvezérlőt, megvárja a megszakítást, frissíti a metaadatokat (méret, módosítás ideje), és ellenőrzi, hogy a programnak egyáltalán van-e joga írni oda. A program ebből **semmit sem lát** – csak egy fájlt.

## 2. A memóriahierarchia emberi léptékben

Az előző leckében láttad a táblázatot: regiszter < 1 ns, RAM ~100 ns, SSD ~0,1 ms, HDD ~10 ms. A nanoszekundum azonban felfoghatatlanul rövid, ezért számoljuk át: **mi lenne, ha 1 ns 1 másodpercig tartana?**

```python run
# A tárolószintek elérési ideje, átszámolva: 1 ns → 1 másodperc.
szintek = [
    ("L1 gyorsítótár", 1),
    ("L3 gyorsítótár", 10),
    ("RAM", 100),
    ("SSD olvasás", 100_000),
    ("HDD olvasás", 10_000_000),
    ("hálózat Budapest–New York (oda-vissza)", 100_000_000),
]

def emberi(mp):
    """Másodpercek olvasható formában."""
    for egyseg, hossz in [("év", 365 * 86400), ("nap", 86400), ("óra", 3600), ("perc", 60)]:
        if mp >= hossz:
            return f"{mp / hossz:.1f} {egyseg}"
    return f"{mp:.0f} másodperc"

for nev, ns in szintek:
    print(f"{nev:42} {ns:>12,} ns  →  {emberi(ns)}")
```

Ha a processzor egy L1-elérést egy másodpercnek érez, akkor a RAM-ra **közel két percet**, egy SSD-olvasásra **több mint egy napot**, egy merevlemezre **majdnem négy hónapot** „vár”. Ezért dolgozik az OS (és a processzor) olyan sokat azon, hogy a szükséges adat **előre** a gyorsabb szinten legyen: gyorsítótárak, lapgyorsítótár (_page cache_), előreolvasás (_read-ahead_).

## 3. Lekérdezés vagy megszakítás? – számoljunk!

Honnan tudja meg az OS, hogy egy eszköznek (billentyűzet, hálózati kártya) van mondanivalója? Két módszer van:

- **Lekérdezés** (_polling_): a processzor rendszeresen megkérdezi az eszközt: „van valami?” Hasonlat: 5 percenként kimész a postaládához megnézni, jött-e levél.
- **Megszakítás** (_interrupt_): az eszköz szól, amikor van valami. Hasonlat: a postás becsönget.

Első ránézésre a megszakítás mindig jobb – de nem! Minden megszakításnak **ára** van: a processzornak el kell mentenie az állapotát, lefuttatnia a kezelőt, majd visszaállnia (néhány mikroszekundum). Számoljuk ki, a processzor hány százalékát viszi el a két módszer különböző eseménysűrűségnél!

```python run
# Lekérdezés kontra megszakítás: a processzoridő hány százaléka megy el az eszközkezelésre?
lekerdezes_koltsege_us = 1        # egy „van valami?” kérdés ideje (µs)
lekerdezes_periodus_us = 100      # milyen gyakran kérdezünk (µs)
megszakitas_koltsege_us = 5       # egy megszakítás kezelésének ideje (µs)

# A lekérdezés költsége nem függ attól, hány esemény jön: mindig kérdezgetünk.
lekerdezes_cpu = 100 * lekerdezes_koltsege_us / lekerdezes_periodus_us

for nev, esemeny_per_mp in [("billentyűzet", 10), ("egér", 200), ("lassú hálózat", 10_000),
                            ("10 Gbit/s hálózat", 800_000)]:
    megszakitas_cpu = 100 * esemeny_per_mp * megszakitas_koltsege_us / 1_000_000
    jobb = "megszakítás" if megszakitas_cpu < lekerdezes_cpu else "lekérdezés"
    print(f"{nev:18} {esemeny_per_mp:>8} esemény/s | megszakítás: {megszakitas_cpu:7.3f}% | "
          f"lekérdezés: {lekerdezes_cpu:.1f}% | jobb: {jobb}")
```

A tanulság:

- **Ritka események** (billentyűzet, egér): a megszakítás elhanyagolható terhelés, a lekérdezés viszont folyamatosan pazarol.
- **Nagyon sűrű események** (gyors hálózat): másodpercenként 800 000 megszakítás a processzor **400%-át** vinné el – vagyis a gép csak megszakításokat kezelne, érdemi munkára nem jutna ideje. Ezt hívják **megszakítási viharnak** (_interrupt livelock_).

Ezért a Linux hálózati alrendszere (**NAPI**) **vegyes** módszert használ: kis forgalomnál megszakítással dolgozik, nagy forgalomnál viszont kikapcsolja a kártya megszakításait, és **lekérdezéssel** egyszerre sok csomagot dolgoz fel. A jó mérnöki megoldás gyakran nem „vagy-vagy”, hanem a helyzethez igazodik.

## 4. DMA – hogy a processzornak ne kelljen hordania

Ha egy 1 GB-os fájlt kell a lemezről a memóriába olvasni, a processzor bájtonként is átmásolhatná – de akkor másra nem jutna ideje. Helyette a **DMA-vezérlő** (_Direct Memory Access_, közvetlen memória-hozzáférés) végzi a másolást:

1. A processzor beállítja: „innen, ennyit, ide” – és visszatér a munkájához.
2. A DMA-vezérlő a buszon keresztül közvetlenül a memóriába másolja az adatot.
3. A végén **egyetlen megszakítással** jelzi: kész.

**Hasonlat:** a főnök (processzor) nem maga cipeli fel a dobozokat a raktárból, hanem megbíz egy rakodót (DMA), és csak akkor néz oda, amikor a rakodó szól, hogy végzett.

## 5. Nyomozás a laborgépen

### Egy rendszerindítás nyomai

Indítsd el az Ubuntu virtuális gépet, és nézd meg, mi történt indításkor:

```bash
systemd-analyze critical-chain     # mely szolgáltatások voltak a „kritikus úton” (egymásra vártak)
cat /proc/cmdline                  # milyen paraméterekkel indította a rendszerbetöltő a kernelt
ls /boot                           # a kernel (vmlinuz-…) és az initrd fájlok
journalctl -b -p warning           # az aktuális indítás figyelmeztetései és hibái
sudo dmesg | head -30              # a kernel első üzenetei: felismert hardver
lsblk                              # lemezek és partíciók (köztük az EFI rendszerpartíció)
```

Windows 11-en: **Win + R → `msinfo32`**: itt látod a _BIOS mód: UEFI_ és a _Biztonságos rendszerindítás állapota: Be_ sorokat. A Feladatkezelő **Indítási alkalmazások** lapján (jobb felső sarok) pedig a _Legutóbbi BIOS-idő_, vagyis hogy mennyi ideig tartott a firmware szakasz.

### Megszakítások élőben

A Linux számolja, melyik eszköz hány megszakítást váltott ki. Futtasd:

```bash
watch -n 1 "grep -E 'i8042|timer|eth|enp' /proc/interrupts"
```

Közben mozgasd az egeret és gépelj a VM ablakában: az `i8042` (billentyűzet- és egérvezérlő) sor számai nőni fognak. Ha közben egy nagy fájlt töltesz le (`wget`), a hálózati kártya sora ugrik meg. Kilépés: **Ctrl + C**.

## Összefoglalás

- Az OS egyszerre **erőforrás-gazda**, **absztrakciót nyújtó „kibővített gép”** és **szabályokat betartató játékvezető**.
- Ha 1 ns 1 másodperc lenne, a RAM ~2 perc, az SSD ~1 nap, a HDD ~4 hónap lenne – ezért kell a gyakori adatot a gyors szinteken tartani.
- **Megszakítás** ritka eseményekhez, **lekérdezés** nagyon sűrű eseményekhez jobb; a Linux NAPI a kettőt kombinálja.
- A **DMA** a processzor helyett másolja az adatot, a végén egy megszakítással jelez.
- A `systemd-analyze`, `journalctl -b`, `dmesg` és a `/proc/interrupts` megmutatja, mi történik a gép belsejében.

## A lecke feladata

```quiz required
? Melyik szerepében „állítja ki” az OS azt a programot, amely egy másik program memóriájába próbál írni?
- erőforrás-gazda
- kibővített gép
+ játékvezető (védelem)
! A védelem betartatja a szabályokat a programok között.

? Ha 1 ns 1 másodpercnek felelne meg, hány másodpercig tartana egy 100 ns-os RAM-elérés?
= 100
! 100 ns → 100 s, kicsivel több mint másfél perc.

? Egy eszközt 10 µs-onként kérdezünk le, egy lekérdezés 1 µs-ig tart. A processzoridő hány százaléka megy el erre?
= 10
! 1 / 10 = 0,1 → 10%.

? Egy megszakítás kezelése 5 µs, és másodpercenként 1000 megszakítás jön. A processzoridő hány százalékát viszi el?
= 0.5
= 0,5
! 1000 × 5 µs = 5 ms másodpercenként = 0,5%.

? Mit csinál a Linux hálózati alrendszere (NAPI) nagyon nagy forgalomnál?
- még több megszakítást kér
+ kikapcsolja a kártya megszakításait, és lekérdezéssel dolgozza fel a csomagokat
- eldobja az összes csomagot
! Így elkerüli a megszakítási vihart.

? Melyik fájlból olvasható ki Linuxon, hogy melyik eszköz hány megszakítást váltott ki?
= /proc/interrupts
! A watch paranccsal másodpercenként frissítve is nézheted.
```
