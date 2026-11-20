---
title: Mélyebben – egy fájl útja a lemezig
summary: Hogyan találja meg az OS a /home/anna/jegyzet.txt fájlt, mekkora lehet egy fájl közvetett mutatókkal, mi történik áramszünetkor naplózással és anélkül (szimuláció), a kemény és szimbolikus linkek, a „törölt, de mégis helyet foglaló” fájl rejtélye, valamint saját fájlrendszer készítése egy fájlban a virtuális gépen.
minutes: 45
---

## Amit ebben a leckében megtanulsz

- lépésről lépésre, hogyan **keresi meg** az OS egy fájl adatait az útvonala alapján,
- hogyan számold ki, **mekkora lehet egy fájl** a klasszikus inode közvetett mutatóival,
- miért kell a **naplózás** – egy áramszünet-szimulációval,
- hogyan viselkednek a **kemény** és **szimbolikus linkek** a gyakorlatban,
- miért nem szabadul fel a hely, ha egy **megnyitott** fájlt törölsz, és mi a különbség a `df` és a `du` között,
- hogyan készíts **saját fájlrendszert** egy közönséges fájlban, és csatold fel.

## 1. Egy útvonal feloldása

Amikor egy program megnyitja a `/home/anna/jegyzet.txt` fájlt, az OS-nek a nevekből el kell jutnia az adatblokkokig. Ext4-en ez így néz ki:

1. A **gyökérkönyvtár** (`/`) inode-ja ismert helyen van (a 2-es inode).
2. Beolvassa a gyökérkönyvtár **adatblokkjait**: ez egy név → inode-szám táblázat. Megkeresi benne a `home` nevet → mondjuk 131073-as inode.
3. Beolvassa a 131073-as inode-ot, ellenőrzi, hogy **könyvtár**-e és van-e hozzá **jogod** (x jog), majd az adatblokkjaiban megkeresi az `anna` nevet → 262145.
4. Ugyanígy az `anna` könyvtárban a `jegyzet.txt` → 262200.
5. Beolvassa a 262200-as inode-ot: ebben vannak a fájl **jogai**, **mérete** és az **adatblokkjainak** helye.

Egy négytagú útvonal tehát akár 8 lemezolvasás is lehet, mielőtt egyetlen bájtot olvasnánk a fájlból! Ezért tartja a kernel a memóriában a legutóbb feloldott neveket (**dentry cache**) és inode-okat – a második megnyitás már szinte azonnali.

**Hasonlat:** egy irodaházban a portán megkérdezed, hol a „Pénzügy” (gyökérkönyvtár → `home`), ott megkérdezed, hol ül Anna (`anna`), Annától pedig elkéred a mappát (`jegyzet.txt`). Minden lépésnél egy újabb „útbaigazító tábla” kell.

Nézd meg a laborgépen:

```bash
ls -id / /home ~ ~/.bashrc          # az útvonal elemeinek inode-számai
stat ~/.bashrc                      # az inode tartalma: méret, blokkok, jogok, időbélyegek, linkszám
```

## 2. Mekkora lehet egy fájl? – közvetett mutatók

A klasszikus UNIX-inode 15 mutatót tartalmaz:

- **12 közvetlen** mutató: mindegyik egy adatblokkra mutat;
- **1 egyszeresen közvetett**: egy blokkra mutat, amely csupa adatblokk-mutatót tartalmaz;
- **1 kétszeresen közvetett**: mutatóblokkra mutató mutatóblokk;
- **1 háromszorosan közvetett**: még egy szint.

4 KB-os blokknál és 4 bájtos mutatónál egy mutatóblokkban 4096 / 4 = **1024** mutató fér el.

```python run
# A klasszikus inode legnagyobb fájlmérete közvetlen és közvetett mutatókkal.
blokk = 4096                    # bájt
mutato = 4                      # bájt
egy_blokkban = blokk // mutato  # ennyi mutató fér egy mutatóblokkba

reszek = [
    ("12 közvetlen", 12),
    ("egyszeresen közvetett", egy_blokkban),
    ("kétszeresen közvetett", egy_blokkban ** 2),
    ("háromszorosan közvetett", egy_blokkban ** 3),
]

def olvashato(b):
    for egyseg in ["B", "KB", "MB", "GB", "TB"]:
        if b < 1024:
            return f"{b:.2f} {egyseg}"
        b /= 1024
    return f"{b:g} PB"

osszes = 0
for nev, blokkok in reszek:
    osszes += blokkok * blokk
    print(f"{nev:25} +{olvashato(blokkok * blokk):>8}  → összesen {olvashato(osszes)}")
```

Az eredmény: 48 KB + 4 MB + 4 GB + 4 TB ≈ **4 TB**. Ugyanez **1 KB-os** blokkokkal csak ~16 GB lenne (próbáld ki a programban!). Ezért ilyen fontos a blokkméret: a nagyobb blokk nagyobb fájlokat enged, de a kis fájloknál több helyet pazarol (belső töredezettség).

Egy 1 GB-os fájl egy bájtjának beolvasásához a kétszeresen közvetett részben **három** blokkot kell olvasni (két mutatóblokk + az adat). Az ext4 **extentjei** („a 1000. blokktól 500 egymást követő blokk”) ezt is megspórolják: egy nagy, folytonos fájlt néhány bejegyzés ír le.

## 3. Áramszünet egy írás közepén – miért kell a napló?

Ha egy fájl végére hozzáírunk egy új blokkot, a fájlrendszernek **három** helyen kell módosítania a lemezt:

1. a **szabad blokkok térképén** (bitmap) foglaltnak jelölni az új blokkot,
2. az **adatot** beírni az új blokkba,
3. az **inode-ban** felvenni az új blokkot, és növelni a méretet.

Ezek külön lemezírások. Mi történik, ha **közben** megy el az áram? A szimuláció végignézi az összes lehetséges „összeomlási pontot”:

```python run
# Áramszünet egy hozzáfűzés közben: milyen állapotban marad a fájlrendszer?
LEPESEK = ["bitmap", "adat", "inode"]

def allapot(kesz):
    """Milyen következménye van, ha csak a 'kesz' lépések jutottak ki a lemezre?"""
    b, a, i = ("bitmap" in kesz), ("adat" in kesz), ("inode" in kesz)
    if b and a and i:
        return "minden rendben"
    if not b and not i:
        return "rendben (a hozzáírás elveszett, de nincs ellentmondás)"
    if b and not i:
        return "HIBA: elveszett blokk (foglaltnak jelölt, de senkié)"
    if i and not b:
        return "HIBA: az inode olyan blokkra mutat, ami szabadnak látszik → később felülírhatják!"
    if i and not a:
        return "HIBA: a fájl végén szemét (régi adat) van"
    return "?"

from itertools import permutations

print("Napló nélkül – minden lehetséges kiírási sorrend, áramszünet 1 vagy 2 lépés után:")
for sorrend in permutations(LEPESEK):
    print(" → ".join(sorrend))
    for n in (1, 2):
        print(f"    {n} lépés után: {allapot(sorrend[:n])}")

print("\nNaplóval: előbb a teljes műveletet a naplóba írjuk, majd egy 'véglegesítve' bejegyzést.")
print("  véglegesítés előtt áramszünet → a naplóbejegyzést eldobjuk: rendben (a hozzáírás elveszett)")
print("  véglegesítés után áramszünet  → induláskor a naplóból újra végrehajtjuk: minden rendben")
```

Figyeld meg: **nincs olyan kiírási sorrend**, amely minden összeomlási pontban biztonságos lenne. Napló nélkül több köztes állapot is **ellentmondásos**: elveszett blokk, vagy – ami a legrosszabb – egy blokk, amelyet egy fájl használ, de szabadnak látszik, így később egy másik fájl felülírja. Régen ezért kellett minden összeomlás után órákig futtatni az `fsck` ellenőrzőt, amely az egész lemezt átfésülte.

A **naplózás** az adatbázisok tranzakcióinak ötletét használja: a módosításokat először egy külön területre, a **naplóba** írja, a végén egy „véglegesítve” jelzéssel. Induláskor csak a naplót kell átnézni: ami véglegesítve van, azt újrajátssza, ami nem, azt eldobja. A művelet így **atomi**: vagy teljesen megtörténik, vagy egyáltalán nem.

Az ext4 alapértelmezésben (`data=ordered` módban) csak a **metaadatokat** naplózza, de az adatblokkot mindig a metaadat előtt írja ki – így a fenti „szemét a fájl végén” hiba sem fordulhat elő, mégsem kell minden adatot kétszer írni.

## 4. Linkek a gyakorlatban

Az Ubuntu VM-ben:

```bash
cd ~/labor
echo "eredeti tartalom" > eredeti.txt
ln eredeti.txt kemeny.txt            # kemény link: második név ugyanarra az inode-ra
ln -s eredeti.txt szimbolikus.txt    # szimbolikus link: egy kis fájl, benne az útvonal
ls -li                               # 1. oszlop: inode-szám, 3. oszlop: linkszám
```

Mit látsz? Az `eredeti.txt` és a `kemeny.txt` inode-száma **azonos**, és mindkettőnél **2** a linkszám. A `szimbolikus.txt` saját inode-ot kapott, és a lista `-> eredeti.txt`-t mutat.

```bash
rm eredeti.txt
cat kemeny.txt          # működik: az adat megvan, csak egy név tűnt el (linkszám: 1)
cat szimbolikus.txt     # hiba: a link egy már nem létező névre mutat („lógó” link)
```

| Tulajdonság                    | Kemény link  | Szimbolikus link |
| ------------------------------ | ------------ | ---------------- |
| saját inode?                   | nem, ugyanaz | igen             |
| eredeti törlése után           | működik      | „lóg”            |
| mutathat könyvtárra?           | nem          | igen             |
| mutathat másik fájlrendszerre? | nem          | igen             |

## 5. A törölt, de helyet foglaló fájl – df kontra du

Egy klasszikus rendszergazdai rejtély: a lemez megtelt, letörölsz egy 5 GB-os naplófájlt, de a `df` szerint **semmi sem szabadult fel**. Mi történt?

Egy fájl adatai csak akkor szabadulnak fel, ha **a linkszám 0** és **egy folyamat sem tartja nyitva**. A `rm` csak a nevet törli; ha egy program (pl. a naplót író szolgáltatás) még írja a fájlt, az inode és a blokkok megmaradnak, amíg be nem zárja.

Próbáld ki:

```bash
dd if=/dev/zero of=nagy.bin bs=1M count=200    # 200 MB-os fájl
df -h ~                                        # jegyezd meg a foglalt helyet
tail -f nagy.bin > /dev/null &                 # egy folyamat nyitva tartja
rm nagy.bin
df -h ~                                        # a hely NEM szabadult fel!
du -sh ~                                       # a du viszont már nem számolja
ls -l /proc/$!/fd | grep deleted               # itt van: (deleted)
kill $!                                        # a folyamat bezárja → a hely felszabadul
df -h ~
```

A különbség oka: a **`df`** a fájlrendszer saját nyilvántartását nézi (mennyi blokk foglalt), a **`du`** viszont bejárja a könyvtárakat, és a **nevekhez** tartozó fájlok méretét adja össze. A névtelen, de nyitott fájlt a `du` nem látja. Megoldás a gyakorlatban: a szolgáltatás újraindítása, vagy a fájl kiürítése törlés helyett (`truncate -s 0 naplo.log`).

Hasznos parancsok, ha fogy a hely:

```bash
du -sh ~/* | sort -h           # mi foglal a legtöbbet a saját mappádban
sudo du -xh / --max-depth=1 2>/dev/null | sort -h | tail   # a legnagyobb mappák a gyökérben
```

## 6. Saját fájlrendszer egy fájlban

A fájlrendszert nem csak egy partícióra lehet létrehozni, hanem egy közönséges fájlba is (**loop eszköz**). Így kockázat nélkül kísérletezhetsz:

```bash
truncate -s 100M lemez.img            # 100 MB-os „üres lemez” (ritka fájl: valójában alig foglal helyet)
mkfs.ext4 lemez.img                   # ext4 fájlrendszer készítése a fájlban
sudo mkdir -p /mnt/proba
sudo mount -o loop lemez.img /mnt/proba    # felcsatolás
df -h /mnt/proba                      # mekkora a hasznos hely?
df -i /mnt/proba                      # hány inode van?
sudo touch /mnt/proba/f{1..1000}      # 1000 üres fájl
df -i /mnt/proba                      # 1000-rel kevesebb szabad inode
sudo umount /mnt/proba                # lecsatolás
```

Megfigyelések: a 100 MB-ból nem 100 MB a hasznos hely (a napló, az inode-táblák és a fenntartott terület is helyet foglal), és **inode-ból is ki lehet fogyni** – sok apró fájlnál előbb fogy el az inode, mint a hely. Ilyenkor „No space left on device” hibát kapsz, pedig a `df -h` szerint van hely.

## Összefoglalás

- Az útvonal feloldása könyvtáranként egy inode- és egy könyvtárblokk-olvasás; a **dentry cache** gyorsítja.
- A klasszikus inode-dal 4 KB-os blokkokkal a legnagyobb fájl ≈ 48 KB + 4 MB + 4 GB + 4 TB; az ext4 extentekkel még hatékonyabb.
- Napló nélkül egy félbeszakadt írás ellentmondásos állapotot hagyhat (elveszett vagy kétszer használt blokk); a **napló** atomivá teszi a műveletet.
- A **kemény link** ugyanarra az inode-ra mutat, a **szimbolikus link** egy útvonalat tárol.
- Egy fájl helye csak akkor szabadul fel, ha nincs neve és senki sem tartja nyitva; a **`df`** és a **`du`** ezért mutathat eltérő értéket.
- `mkfs` + `mount -o loop` – saját fájlrendszer egy fájlban; az inode is el tud fogyni.

## A lecke feladata

```quiz required
? 4 KB-os blokkok, 4 bájtos mutatók. Hány mutató fér el egy mutatóblokkban?
= 1024
! 4096 / 4 = 1024.

? A klasszikus inode 12 közvetlen mutatójával 4 KB-os blokkoknál legfeljebb hány KB-os fájl írható le közvetett mutató nélkül?
= 48
! 12 · 4 KB = 48 KB.

? Napló nélküli fájlrendszeren az inode már az új blokkra mutat, de a szabad blokkok térképén a blokk még szabadnak látszik, amikor elmegy az áram. Mi ennek a veszélye?
- semmi, a következő indításkor minden rendben lesz
+ a blokkot később egy másik fájl is megkaphatja, és felülírja az adatot
- a lemez fizikailag megsérül
! Ezért kell napló vagy teljes fsck-ellenőrzés.

? Létrehozol egy kemény linket egy fájlra, majd törlöd az eredeti nevet. Mi történik?
+ a fájl a másik néven továbbra is elérhető
- a kemény link „lógni” fog
- a fájl tartalma azonnal törlődik
! A kemény link ugyanarra az inode-ra mutat; az adat csak 0 linkszámnál szabadul fel.

? Törölsz egy nagy naplófájlt, de a df szerint nem szabadult fel hely. Mi a legvalószínűbb ok?
- a df hibás
+ egy folyamat még nyitva tartja a fájlt
- a fájl a lomtárba került
! Amíg nyitva van, az inode és a blokkok megmaradnak; a du már nem számolja.

? A df -h szerint van szabad hely, mégis „No space left on device” hibát kapsz sok apró fájl létrehozásakor. Mi fogyott el?
= inode
= inodes
= az inode-ok
! df -i mutatja.
```
