---
title: Mélyebben – a rendszerhívások ára, a pufferelés és a fájlleírók
summary: Mennyibe kerül egy rendszerhívás, és hogyan spórol a pufferelés (számolás és dd-kísérlet), sorpufferelés a terminálon és teljes pufferelés csőben, a fájlleírók és az átirányítás titkai (2>&1 sorrendje), hibakódok (errno), és a vDSO, amellyel egyes hívások kernelbe lépés nélkül futnak.
minutes: 40
---

## Amit ebben a leckében megtanulsz

- **számszerűen**, mennyit spórol a pufferelés a rendszerhívásokon,
- miért viselkedik **másképp** egy program a terminálban és egy csőben (sorpufferelés kontra teljes pufferelés),
- hogyan működik a háttérben az **átirányítás**, és miért számít a `2>&1` helye,
- hogyan jelzi a kernel a **hibákat** (errno), és hogyan olvasd ki őket,
- mi a **vDSO**, amellyel az idő lekérdezése kernelbe lépés nélkül megy.

## 1. Mennyit spórol a pufferelés? – számoljunk!

Az alapleckében láttad: egy rendszerhívás nagyságrendileg **100-szor–1000-szer** drágább egy függvényhívásnál, mert a processzornak kernel módba kell váltania, a kernelnek ellenőriznie kell a paramétereket, majd vissza kell térnie. Ezért nem mindegy, **hány darabban** viszünk át egy adatmennyiséget.

Egyszerű költségmodell: minden `write()` hívás **1 µs** fix költség, plusz bájtonként **0,1 ns** másolás. Mennyi idő kiírni **1 MB**-ot különböző pufferméretekkel?

```python run
# 1 MB kiírása különböző pufferméretekkel: hány rendszerhívás, mennyi idő?
ADAT = 1024 * 1024              # 1 MB
HIVAS_US = 1.0                  # egy rendszerhívás fix költsége (µs)
BAJT_NS = 0.1                   # bájtonkénti másolás (ns)

for puffer in [1, 16, 512, 4096, 65536, 1024 * 1024]:
    hivasok = -(-ADAT // puffer)                     # felfelé kerekített osztás
    ido_ms = (hivasok * HIVAS_US * 1000 + ADAT * BAJT_NS) / 1_000_000
    print(f"puffer {puffer:>8} B: {hivasok:>8} write() hívás, ≈ {ido_ms:8.2f} ms")
```

Bájtonkénti írásnál több mint egymillió rendszerhívás kell (**~1 másodperc**), 4 KB-os pufferrel csak **256** (kb. 0,4 ms) – **ezerszeres** különbség, pedig ugyanannyi adatot írtunk ki! 64 KB fölött már alig nyerünk: ott a másolás költsége dominál. Ezért választanak a könyvtárak tipikusan 4–64 KB-os puffert.

Próbáld ki élőben az Ubuntu VM-ben – ugyanaz a 2 MB, egyszer bájtonként, egyszer 4 KB-os darabokban:

```bash
time dd if=/dev/zero of=/dev/null bs=1 count=2000000       # 2 millió read + 2 millió write
time dd if=/dev/zero of=/dev/null bs=4096 count=489        # ugyanannyi adat, ~500 + 500 hívás
strace -c dd if=/dev/zero of=/dev/null bs=1 count=100000 2>&1 | tail -15   # a hívások összesítése
```

A `/dev/zero` végtelen nullát ad, a `/dev/null` mindent elnyel – így csak a rendszerhívások költségét mérjük, lemez nélkül.

## 2. Sorpufferelés és teljes pufferelés

A C könyvtár (és a Python is) **háromféle** pufferelést használ a szabványos kimenetre:

| Mód                  | Mikor írja ki?                      | Mikor használják?                          |
| -------------------- | ----------------------------------- | ------------------------------------------ |
| **puffereletlen**    | azonnal                             | hibakimenet (`stderr`) – a hiba ne vesszen el |
| **sorpufferelt**     | minden sorvégnél (`\n`)             | ha a kimenet **terminál** – lásd azonnal   |
| **teljesen pufferelt** | ha megtelik a puffer (pl. 4–8 KB) | ha a kimenet **fájl vagy cső** – gyorsabb  |

Ebből egy gyakori meglepetés adódik: egy program, amely a terminálban soronként írja ki a haladását, **csőbe** kötve csak a végén, egyszerre ír ki mindent. Nézd meg a rendszerhívásokban:

```bash
strace -e trace=write python3 -c "for i in range(3): print(i)"            # terminál: 3 write
strace -e trace=write python3 -c "for i in range(3): print(i)" | cat      # cső: 1 write!
strace -e trace=write python3 -u -c "for i in range(3): print(i)" | cat   # -u: puffereletlen → 3 write
```

(A `strace` a saját kimenetét a hibakimenetre írja, ezért látod a terminálban akkor is, ha a program kimenete a csőbe megy.) Ha egy naplózó program „nem ír semmit” egy csőben, gyakran csak pufferel; Pythonban a `print(..., flush=True)` vagy a `-u` kapcsoló segít.

## 3. Fájlleírók és az átirányítás titkai

Minden folyamatnak van egy **fájlleíró-táblája**: kis egész számok, amelyek megnyitott fájlokra, csövekre, terminálra mutatnak. Az első három mindig ugyanaz:

| Szám | Név      | Alapértelmezés |
| ---- | -------- | -------------- |
| 0    | `stdin`  | billentyűzet   |
| 1    | `stdout` | terminál       |
| 2    | `stderr` | terminál       |

Az átirányítás valójában ennek a táblának az **átírása**, mielőtt a shell elindítja a programot (a `dup2()` rendszerhívással):

- `> ki.txt` – az **1**-es leíró a `ki.txt` fájlra mutasson,
- `2> hiba.txt` – a **2**-es leíró a `hiba.txt`-re,
- `2>&1` – a **2**-es leíró oda mutasson, **ahová most az 1-es** mutat.

Az utolsó miatt **számít a sorrend**, mert a shell balról jobbra hajtja végre:

```bash
ls /etc /nincs > ki.txt 2>&1     # 1 → ki.txt, majd 2 → ahová az 1 (ki.txt): MINDEN a fájlba megy
ls /etc /nincs 2>&1 > ki.txt     # 2 → ahová az 1 (terminál!), majd 1 → ki.txt: a hiba a TERMINÁLON marad
```

**Hasonlat:** két postafiók (1 és 2) kap egy-egy átirányítási cédulát. A `2>&1` azt mondja: „a 2-es posta oda menjen, ahová az 1-es megy **most**” – ha az 1-est csak utána irányítod át, a 2-es a régi címen marad.

A leírókat élőben is láthatod:

```bash
ls -l /proc/self/fd                        # az ls saját leírói: 0, 1, 2 → /dev/pts/0 (a terminál)
ls -l /proc/self/fd > leirok.txt; cat leirok.txt   # az 1-es most a leirok.txt-re mutat
ls -l /proc/self/fd | cat                  # az 1-es egy csőre mutat: pipe:[…]
```

## 4. Hibakódok: errno

Ha egy rendszerhívás nem sikerül, a kernel **negatív számot** ad vissza, a C könyvtár pedig ezt az **`errno`** változóba teszi. A leggyakoribbak:

| Kód      | Szám | Jelentés                              | Tipikus ok                              |
| -------- | ---- | ------------------------------------- | --------------------------------------- |
| `ENOENT` | 2    | nincs ilyen fájl vagy könyvtár        | elgépelt útvonal                        |
| `EACCES` | 13   | hozzáférés megtagadva                 | nincs jogod olvasni/írni                |
| `EEXIST` | 17   | a fájl már létezik                    | `mkdir` egy létező névvel               |
| `ENOSPC` | 28   | nincs hely az eszközön                | megtelt a lemez (vagy elfogyott az inode) |
| `EMFILE` | 24   | túl sok megnyitott fájl               | a program nem zárja be a fájljait       |

A `strace` kiírja őket:

```bash
strace -e trace=openat cat /nincs/ilyen 2>&1 | tail -3     # ... = -1 ENOENT (No such file or directory)
strace -e trace=openat cat /etc/shadow 2>&1 | tail -3      # ... = -1 EACCES (Permission denied)
```

Pythonban a rendszerhívás hibája `OSError` kivételként érkezik, benne az `errno`-val:

```python run
# A rendszerhívások hibakódjai Pythonból: az OSError errno mezője.
import errno
import os

for utvonal in ["/nincs/ilyen.txt", "/"]:
    try:
        fd = os.open(utvonal, os.O_WRONLY)       # írásra megnyitás
        os.close(fd)
    except OSError as hiba:
        print(f"{utvonal}: errno {hiba.errno} = {errno.errorcode[hiba.errno]} ({hiba.strerror})")
```

(Az első egy nem létező fájl; a második egy könyvtár, amelyet nem lehet írásra megnyitni – `EISDIR`.) A hibakód **neve** (pl. `ENOENT`) ugyanaz minden UNIX-szerű rendszeren, ezért érdemes megtanulni a leggyakoribbakat: egy hibaüzenetből azonnal tudni fogod, hol keresd a bajt.

## 5. A vDSO – rendszerhívás kernelbe lépés nélkül

Vannak hívások, amelyeket a programok **nagyon gyakran** használnak, de csak olvasnak a kernelből: a legjellemzőbb az **idő lekérdezése** (`clock_gettime`, `gettimeofday`). Egy webkiszolgáló vagy játék másodpercenként akár milliószor is megkérdezi.

A Linux ezért minden folyamat címterébe betölt egy apró, a kernel által készített könyvtárat: a **vDSO**-t (_virtual dynamic shared object_). A kernel egy közös, csak olvasható memórialapon folyamatosan frissíti benne az aktuális időt, a vDSO függvénye pedig egyszerűen **kiolvassa** – módváltás nélkül, néhány nanoszekundum alatt.

```bash
cat /proc/self/maps | grep vdso      # minden folyamatban ott van: [vdso]
strace -e trace=clock_gettime date   # a date időlekérdezése NEM jelenik meg rendszerhívásként!
```

Ez jó példa arra, hogy a kernel és a felhasználói tér közötti határ átlépése annyira drága, hogy megéri trükközni a kikerülésével.

## Összefoglalás

- A rendszerhívás fix költsége miatt a **pufferelés** ezerszeres különbséget is jelenthet: 1 MB bájtonként ~1 millió hívás, 4 KB-os pufferrel 256.
- A szabványos kimenet terminálon **sorpufferelt**, fájlba vagy csőbe **teljesen pufferelt**, a hibakimenet puffereletlen.
- Az átirányítás a **fájlleíró-tábla** átírása; a `2>&1` a 2-est oda köti, ahová az 1-es **abban a pillanatban** mutat – ezért számít a sorrend.
- A hibákat az **errno** kódok jelzik (`ENOENT`, `EACCES`, `ENOSPC`…); a `strace` és a Python `OSError` is megmutatja őket.
- A **vDSO** a gyakori, csak olvasó hívásokat (idő) kernelbe lépés nélkül szolgálja ki.

## A lecke feladata

```quiz required
? Hány write() rendszerhívás kell 1 MB (1 048 576 bájt) kiírásához 4096 bájtos pufferrel?
= 256
! 1 048 576 / 4096 = 256.

? Egy Python-program a terminálban soronként írja ki a haladását, de csőbe kötve csak a végén ír ki mindent. Mi az oka?
- a cső lassabb a terminálnál
+ a kimenet csőnél teljesen pufferelt, terminálnál sorpufferelt
- a cső csak a program végén nyílik meg
! flush=True vagy python -u segít.

? Melyik parancs írja a normál kimenetet és a hibakimenetet is a ki.txt fájlba?
+ ls /etc /nincs > ki.txt 2>&1
- ls /etc /nincs 2>&1 > ki.txt
! A 2>&1 oda köti a 2-est, ahová az 1-es abban a pillanatban mutat.

? Melyik fájlleíró a szabványos hibakimenet (stderr)?
= 2
! 0 = stdin, 1 = stdout, 2 = stderr.

? A strace kimenetében ezt látod: openat(..., "/etc/shadow", ...) = -1 EACCES. Mi a hiba oka?
- nincs ilyen fájl
+ nincs jogod megnyitni a fájlt
- megtelt a lemez
! EACCES = Permission denied.

? Miért nem látszik rendszerhívásként a strace kimenetében a date parancs időlekérdezése?
- mert a date nem kérdezi le az időt
+ mert a vDSO kernelbe lépés nélkül, egy közös memórialapról olvassa ki
- mert a strace az időt nem tudja követni
! A vDSO-t a kernel tölti be minden folyamat címterébe.
```
