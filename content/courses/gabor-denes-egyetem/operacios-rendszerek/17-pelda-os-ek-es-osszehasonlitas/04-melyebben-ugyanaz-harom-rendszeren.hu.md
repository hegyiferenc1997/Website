---
title: Mélyebben – ugyanaz a feladat három rendszeren
summary: Párhuzamos rendszerindítás és a kritikus út (systemd szimulátor), a fork() és a CreateProcess ára, útvonalak és kis-nagybetűk Pythonnal (ütközések Windowsra másoláskor, tiltott fájlnevek), a sorvégek (CRLF kontra LF) és a git, valamint a memória „ígérete” – a Linux túlfoglalása és a Windows commit-korlátja számolással.
minutes: 45
---

## Amit ebben a leckében megtanulsz

- hogyan gyorsítja a **párhuzamos** indítás a bootolást, és mi a **kritikus út**,
- miért olcsó a `fork()` egy nagy folyamatnál is, és miben más a Windows `CreateProcess`-e,
- milyen csapdák várnak, ha fájlokat viszel **Linux, Windows és macOS** között (kis-nagybetű, tiltott nevek, útvonalak),
- miért „romlik el” egy szkript, ha Windowson mentetted (**CRLF** kontra **LF**), és hogyan kezeli ezt a git,
- hogyan **ígér** memóriát a Linux és a Windows – és mi történik, ha az ígéret nem teljesíthető.

Ez a lecke a tárgy összefoglalója is: minden pontja egy korábbi témakör fogalmát (folyamatok, fájlrendszerek, memória) mutatja meg a három rendszer **különbségein** keresztül.

## 1. Párhuzamos indítás és a kritikus út

A régi Linux-init (SysV) a szolgáltatásokat **egymás után** indította. A `systemd` (és a macOS `launchd`-je) **párhuzamosan** indít mindent, aminek a függőségei már készen vannak. Ilyenkor a boot ideje nem az összeg, hanem a **kritikus út**: a függőségi gráf leghosszabb láncának hossza.

```python run
# Szolgáltatások indítása egymás után és párhuzamosan (függőségekkel)
szolgaltatasok = {
    # név: (indítási idő mp-ben, függőségek)
    "lemezek":      (1.0, []),
    "naplozas":     (0.5, ["lemezek"]),
    "halozat":      (2.0, ["lemezek"]),
    "ido_szinkron": (0.5, ["halozat"]),
    "ssh":          (0.3, ["halozat"]),
    "adatbazis":    (3.0, ["lemezek", "naplozas"]),
    "webszerver":   (1.0, ["halozat", "adatbazis"]),
    "grafikus_fel": (2.5, ["lemezek"]),
}

kesz = {}                                         # név → mikor lett kész
def kesz_ido(nev):
    if nev not in kesz:
        ido, fuggosegek = szolgaltatasok[nev]
        kezdes = max((kesz_ido(f) for f in fuggosegek), default=0)   # ha minden függőség kész
        kesz[nev] = kezdes + ido
    return kesz[nev]

sorban = sum(ido for ido, _ in szolgaltatasok.values())
parhuzamosan = max(kesz_ido(n) for n in szolgaltatasok)
print(f"egymás után (SysV):     {sorban:.1f} mp")
print(f"párhuzamosan (systemd): {parhuzamosan:.1f} mp")

# A kritikus út visszakövetése az utolsóként elkészülőtől
nev = max(kesz, key=kesz.get)
ut = [nev]
while szolgaltatasok[nev][1]:
    nev = max(szolgaltatasok[nev][1], key=lambda f: kesz[f])        # a legkésőbbi függőség
    ut.append(nev)
print("kritikus út:", " → ".join(reversed(ut)))
```

Ha gyorsítani akarod a bootot, csak a **kritikus úton** lévő szolgáltatás gyorsítása segít – a `grafikus_fel` 2,5 mp-e nem számít, mert párhuzamosan fut a hosszabb lánccal. Ugyanez a gondolat, mint a projektmenedzsment kritikus út módszere. A valódi rendszeren:

```bash
systemd-analyze                      # mennyi ideig tartott a boot (kernel + felhasználói tér)
systemd-analyze blame | head -10     # a leglassabb egységek
systemd-analyze critical-chain       # a kritikus út!
```

Windowson a Feladatkezelő **Indítás** fülén látod az egyes programok „indítási hatását”, macOS-en a `launchctl list` mutatja a `launchd` által kezelt szolgáltatásokat.

## 2. fork() kontra CreateProcess – mennyibe kerül egy új folyamat?

Linuxon és macOS-en egy új program indítása két lépés: **`fork()`** (a folyamat lemásolja magát), majd **`exec()`** (a másolat lecseréli magát az új programra). Első hallásra pazarlónak tűnik: miért másolnánk le egy 1 GB-os folyamatot, ha utána úgyis eldobjuk? A válasz a **másolás íráskor** (_copy-on-write_): a `fork()` valójában csak a **laptáblát** másolja, a lapokat a két folyamat közösen, írásvédetten használja.

```python run
# Mit kell ténylegesen másolni egy fork()-nál?
LAP = 4096                        # lapméret (bájt)
BEJEGYZES = 8                     # egy laptábla-bejegyzés mérete (bájt)

for meret_gb in [0.1, 1, 8]:
    lapok = int(meret_gb * 1024**3 / LAP)
    laptabla_mb = lapok * BEJEGYZES / 1024**2
    print(f"{meret_gb:>4} GB-os folyamat: {lapok:>9,} lap → csak ~{laptabla_mb:6.1f} MB "
          f"laptábla másolódik ({laptabla_mb / (meret_gb * 1024):.2%})".replace(",", " "))
```

Egy 1 GB-os folyamatnál a `fork()` kb. **2 MB** laptáblát másol – a memória 0,2%-át. Ráadásul ha a gyermek azonnal `exec()`-et hív, a közös lapokat soha senki nem írja, így semmi sem másolódik.

A **Windows** másképp gondolkodik: a `CreateProcess` egyetlen hívással **üres** folyamatot hoz létre, és rögtön az új programot tölti bele – nincs „lemásolom magam” lépés. Ez tisztább, de a Windows ezért nem tudja olcsón utánozni a `fork()`-ot: a Cygwin (Unix-réteg Windowsra) `fork()`-ja ezért lassú, és ezért fut a **WSL 2** egy valódi Linux-kernellel egy könnyű VM-ben. A modern Unix-programok egyre gyakrabban a **`posix_spawn()`**-t használják, amely a Windows-féle „egy lépésben” szemléletet követi.

| Szempont               | `fork()` + `exec()`                                | `CreateProcess`                          |
| ---------------------- | -------------------------------------------------- | ---------------------------------------- |
| lépések                | 2: másolat, majd csere                             | 1: új, üres folyamat az új programmal    |
| a gyermek mit örököl?  | szinte mindent (nyitott fájlok, környezet)         | amit a paraméterekben megadsz            |
| átirányítás a shellben | a `fork` és az `exec` között átállítja a leírókat  | a hívás paramétereiben (STARTUPINFO)     |
| olcsó?                 | igen, copy-on-write-tal                            | igen, de nincs olcsó „másolat” művelet   |

## 3. Fájlnevek: kis-nagybetű, tiltott nevek, útvonalak

A három rendszer másképp kezeli a fájlneveket. A **Linux** (ext4) megkülönbözteti a kis- és nagybetűt, a **Windows** (NTFS) és a **macOS** (APFS) alapból **nem** (de megőrzi, ahogy írtad). Ha egy Linuxos projektben van `Readme.txt` és `README.txt` is, Windowsra vagy Macre másolva az egyik **felülírja** a másikat!

```python run
# Fájlnév-ellenőrző: mi okozna gondot Windowson vagy macOS-en?
TILTOTT_JELEK = set('<>:"/\\|?*')
FOGLALT = {"CON", "PRN", "AUX", "NUL"} | {f"COM{i}" for i in range(1, 10)} | {f"LPT{i}" for i in range(1, 10)}

def windows_gondok(nev):
    gondok = []
    if TILTOTT_JELEK & set(nev):
        gondok.append("tiltott jel: " + "".join(sorted(TILTOTT_JELEK & set(nev))))
    if nev.split(".")[0].upper() in FOGLALT:
        gondok.append("foglalt eszköznév")
    if nev.endswith((" ", ".")):
        gondok.append("szóközre vagy pontra végződik")
    return gondok

fajlok = ["Readme.txt", "README.txt", "jegyzet:vazlat.md", "con.txt",
          "adat.csv ", "kép.png", "Kép.png", "rendben.py"]

for f in fajlok:
    g = windows_gondok(f)
    print(f"{f!r:<22} {'; '.join(g) if g else 'rendben'}")

# Kis-nagybetű ütközések keresése (Windows, macOS alapbeállítás)
latott = {}
for f in fajlok:
    kulcs = f.casefold()
    if kulcs in latott:
        print(f"ÜTKÖZÉS: {latott[kulcs]!r} és {f!r} ugyanaz lenne Windowson és macOS-en")
    latott[kulcs] = f
```

A **`con.txt`** különösen alattomos: a Windows a `CON` nevet (konzol) a DOS-korszak óta eszköznévként foglalja, ezért hagyományosan kiterjesztéssel együtt sem hozhatsz létre ilyen fájlt (a Windows 11 ezen részben lazított, de sok program és eszköz ma is hibát ad rá). Ezért ha a projekted **több rendszeren** fut, használj kisbetűs, ékezet és szóköz nélküli fájlneveket – ez a legbiztonságosabb.

Az útvonalakat se rakd össze kézzel `"/"` vagy `"\\"` jelekkel: a Python `pathlib` modulja tudja, melyik rendszeren mi a szabály.

```python run
# Útvonalak a két világban – pathlib "tiszta" (csak szöveges) útvonalakkal
from pathlib import PurePosixPath, PureWindowsPath

linux = PurePosixPath("/home/anna/projekt") / "adat" / "meres.csv"
windows = PureWindowsPath("C:/Users/Anna/projekt") / "adat" / "meres.csv"
print("Linux:  ", linux, "  részei:", linux.parts)
print("Windows:", windows, "  részei:", windows.parts)

# Kis-nagybetű: a Windows-útvonalak összehasonlítása nem érzékeny rá
print(PureWindowsPath(r"C:\Users\Anna\DOC.txt") == PureWindowsPath(r"c:\users\anna\doc.txt"))
print(PurePosixPath("/home/anna/DOC.txt") == PurePosixPath("/home/anna/doc.txt"))
```

## 4. Sorvégek: CRLF kontra LF

Egy szövegfájlban a sor végét egy (vagy két) **láthatatlan** vezérlőkarakter jelzi:

- **Linux, macOS**: `\n` (LF, _line feed_, 10-es bájt),
- **Windows**: `\r\n` (CR LF, _carriage return + line feed_, 13-as és 10-es bájt) – az írógép korából: kocsi vissza, majd soremelés.

```python run
# Ugyanaz a két sor, kétféle sorvéggel – bájtonként
szoveg = "echo szia\necho vege\n"
linux_bajtok = szoveg.encode()
windows_bajtok = szoveg.replace("\n", "\r\n").encode()
print("LF   :", linux_bajtok, len(linux_bajtok), "bájt")
print("CRLF :", windows_bajtok, len(windows_bajtok), "bájt")

# Mit lát a bash egy Windowson mentett szkriptből? A parancs nevében ott a \r!
elso_sor = windows_bajtok.split(b"\n")[0].decode()
print("a bash ezt kapja első sorként:", repr(elso_sor))
print("ha a shebang is CRLF-es:      ", repr("#!/bin/bash\r"), "→ '/bin/bash\\r' nem létezik!")
```

A klasszikus hiba: Windowson szerkesztett shell-szkript Linuxon `bad interpreter: /bin/bash^M` üzenettel áll le – a `^M` a látható formája a `\r`-nek. A megoldás:

```bash
file szkript.sh               # "with CRLF line terminators" → ez a gond
sed -i 's/\r$//' szkript.sh   # a sorvégi \r eltávolítása (vagy: dos2unix szkript.sh)
```

A **git** ezt automatikusan kezelheti: Windowson a `core.autocrlf true` beállítással a repóba LF kerül, a munkakönyvtárba CRLF. A legtisztább megoldás egy **`.gitattributes`** fájl a projektben, mert az mindenkire érvényes, aki klónozza:

```text
* text=auto
*.sh text eol=lf
*.bat text eol=crlf
```

A VS Code jobb alsó sarkában is látod és át is állíthatod (`CRLF` / `LF`).

## 5. A memória „ígérete”: túlfoglalás és commit-korlát

Amikor egy program memóriát kér (`malloc`, `VirtualAlloc`), az OS még nem ad fizikai lapot – csak **megígéri**. A lap ténylegesen az első íráskor (laphiba) kerül kiosztásra. A kérdés: mennyit szabad megígérni?

- **Windows**: szigorú könyvelés. A **commit-korlát** = fizikai RAM + lapozófájl (`pagefile.sys`) mérete. Ha az összes ígéret elérné, az újabb foglalás **azonnal hibával** tér vissza – a program kezelheti a hibát.
- **Linux**: alapból **túlfoglal** (_overcommit_): többet ígér, mint amennyi van, mert a programok ritkán használják ki, amit kértek. Ha mégis elfogy, az **OOM killer** leállít egy folyamatot – akár egy olyat is, amelyik épp nem hibás.

```python run
# Ígéret kontra valóság: Windows-féle szigorú könyvelés és Linux-féle túlfoglalás
RAM_GB, SWAP_GB = 16, 4
commit_korlat = RAM_GB + SWAP_GB                   # Windows: RAM + lapozófájl

kerelmek = [("böngésző", 6, 3), ("IDE", 4, 2), ("adatbázis", 8, 6), ("játék", 6, 5)]
# (név, kért GB, ténylegesen használt GB)

igert = hasznalt = 0
for nev, kert, valos in kerelmek:
    igert += kert
    hasznalt += valos
    win = "OK" if igert <= commit_korlat else "HIBA: elérte a commit-korlátot"
    lin = "OK" if hasznalt <= commit_korlat else "OOM killer lép közbe!"
    print(f"{nev:<10} kér {kert} GB (használ {valos}) → ígéret össz. {igert:>2} GB, "
          f"valós {hasznalt:>2} GB | Windows: {win:<31} | Linux: {lin}")
```

A játék indulásakor a Windows **megtagadja** a foglalást (az ígéretek összege 24 GB > 20 GB), a Linux viszont **engedi**, mert a ténylegesen használt 16 GB még belefér – és ha a programok később tényleg elkezdenék használni, amit kértek, akkor jönne az OOM killer. Melyik a jobb? Kompromisszum: a Windows kiszámíthatóbb, a Linux jobban kihasználja a memóriát. Linuxon a viselkedés állítható:

```bash
cat /proc/sys/vm/overcommit_memory   # 0 = heurisztika (alap), 1 = mindig enged, 2 = szigorú
grep -i commit /proc/meminfo         # CommitLimit és Committed_AS: a korlát és az ígéretek
```

## Összefoglalás

- Párhuzamos boot esetén az idő a függőségi gráf **kritikus útja**; csak az azon lévő szolgáltatás gyorsítása számít (`systemd-analyze critical-chain`).
- A `fork()` a **copy-on-write** miatt csak a laptáblát másolja (1 GB-nál ~2 MB); a Windows `CreateProcess`-e egy lépésben indít új programot, a `posix_spawn()` ezt követi Unixon.
- Linuxon a fájlnevek kis-nagybetű-érzékenyek, Windowson és macOS-en alapból nem → **ütközések**; Windowson tiltott jelek és foglalt nevek (`CON`, `NUL`) is vannak; az útvonalakat `pathlib`-bal kezeld.
- Sorvég: Linux/macOS **LF**, Windows **CRLF**; a `^M` hibát a `.gitattributes` és a `dos2unix` előzi meg.
- A Windows a **commit-korláttal** (RAM + lapozófájl) szigorúan könyvel, a Linux **túlfoglal**, és szükség esetén az **OOM killer**hez nyúl.

## A lecke feladata

```quiz required
? Három szolgáltatás: A (2 mp, nincs függősége), B (3 mp, A-tól függ), C (4 mp, A-tól függ). Hány másodperc alatt indul el mind párhuzamos indításnál?
= 6
! A kész 2 mp-nél, B és C párhuzamosan indul: B 5, C 6 mp-nél kész – a kritikus út A → C.

? Egy 2 GB-os folyamat fork()-ot hív. A lapméret 4 KB, egy laptábla-bejegyzés 8 bájt. Hány MB laptábla másolódik (kb.)?
= 4
! 2 GB / 4 KB = 524 288 lap · 8 bájt = 4 MB.

? Egy Linuxos projektben van Kep.png és kep.png is. Mi történik, ha alapbeállítású Windowsra másolod?
- mindkettő megmarad, mert más a nevük
+ ütköznek: a Windows ugyanannak tekinti őket, az egyik felülírja a másikat (vagy a másolás hibát jelez)
- a Windows automatikusan átnevezi őket kep1.png-re és kep2.png-re
! Az NTFS alapból nem különbözteti meg a kis- és nagybetűt.

? Egy Windowson mentett szkript Linuxon ezzel áll le: bad interpreter: /bin/bash^M. Mi az oka?
+ a sorvégek CRLF-esek, és a \r a parancs nevének része lett
- a bash nincs telepítve
- a szkriptnek nincs futtatási joga
! sed -i 's/\r$//' szkript.sh vagy dos2unix.

? Melyik rendszer utasítja el azonnal a memóriafoglalást, ha az összes ígéret túllépné a RAM + lapozófájl méretét?
- Linux alapbeállítással
+ Windows
- mindkettő
! A Linux alapból túlfoglal, és szükség esetén az OOM killer lép közbe.
```
