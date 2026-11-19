---
title: Mélyebben – virtualizáció számokkal: címfordítás, túlfoglalás, migráció, konténerek
summary: Miért drágább egy TLB-hiba virtuális gépben (kétdimenziós laptábla-bejárás, 24 memóriaolvasás), túlfoglalás és memória-megosztás (KSM) számolással, az élő migráció előmásolásos algoritmusa szimulátorral (mennyi a leállás?), a cgroups CPU- és memóriakorlátjai kiszámolva, valamint a VM és a konténer sűrűsége egy szerveren.
minutes: 45
---

## Amit ebben a leckében megtanulsz

- miért kerül egy **TLB-hiba** virtuális gépben akár hatszor annyi memóriaolvasásba,
- hogyan számolják a **túlfoglalást**, és mennyi memóriát spórol az azonos lapok **megosztása** (KSM),
- lépésről lépésre, **szimulátorral**, hogyan költözik egy futó VM másik gépre, és mitől függ a **leállás** hossza,
- hogyan **számolódnak** a konténerek cgroups-korlátai (`cpu.max`, `memory.max`),
- hány VM és hány konténer **fér el** egy szerveren.

## 1. A címfordítás ára virtuális gépben

A memóriakezelés témakörben láttad: egy virtuális cím lefordításához a CPU egy **4 szintű laptáblát** jár be – TLB-hiba esetén **4 memóriaolvasás**. Virtuális gépben viszont **két** címfordítás van egymásra rakva:

1. a **vendég** laptáblája: vendég virtuális cím → vendég „fizikai” cím,
2. a hipervizor **EPT/NPT** táblája: vendég fizikai cím → valódi (gazda) fizikai cím.

A csapda: a vendég laptáblájának minden szintje **maga is** egy vendég fizikai címen van – tehát minden egyes lépéshez előbb a gazda tábláját is be kell járni. Ez a **kétdimenziós laptábla-bejárás**.

```python run
# Memóriaolvasások egy TLB-hibánál: natív és virtualizált esetben
def nativ(szintek):
    return szintek                                # minden szinten egy olvasás

def ketdimenzios(vendeg_szintek, gazda_szintek):
    # a vendég minden szintjének címét (és a végső adatcímet) a gazda táblán át kell fordítani:
    # (vendég szintek + 1) gazda-bejárás, plusz maguk a vendég-táblaolvasások
    return (vendeg_szintek + 1) * gazda_szintek + vendeg_szintek

for n in [4, 5]:
    print(f"{n} szintű laptábla: natív {nativ(n):>2} olvasás, "
          f"VM-ben legfeljebb {ketdimenzios(n, n):>2} olvasás "
          f"({ketdimenzios(n, n) / nativ(n):.0f}×)")
```

Egy 4 szintű táblánál a legrosszabb esetben **24** memóriaolvasás kell a natív 4 helyett! Ezért a virtualizált rendszerekben még fontosabb a **TLB** és a **nagy lapok** (2 MB-os _huge pages_): egy nagy lappal kevesebb szint és sokkal kevesebb TLB-hiba. A gyakorlatban a processzorok külön gyorsítótárakkal (_page walk cache_) a lépések nagy részét megspórolják, így a valós lassulás jóval kisebb – de a különbség mérhető.

## 2. Túlfoglalás és memória-megosztás

**CPU-túlfoglalás**: a hipervizor időosztással osztja a fizikai magokat, ezért több vCPU osztható ki, mint ahány mag van. A **túlfoglalási arány** = kiosztott vCPU / fizikai mag. Mivel a legtöbb VM az idő nagy részében tétlen, 3:1–4:1 arány általános; ha viszont minden VM egyszerre dolgozik, mindegyik lelassul (a vCPU-k a kész sorban várnak – ezt a vendégben a `top` **st**, _steal time_ oszlopa mutatja).

**Memória**: ha 20 VM ugyanazt az Ubuntut futtatja, a memóriájukban rengeteg **azonos** lap van (kernelkód, könyvtárak). A Linux **KSM** (_Kernel Samepage Merging_) funkciója megkeresi az azonos tartalmú lapokat, és egyetlen példányt tart meg belőlük, **csak olvashatóan** megosztva. Ha valamelyik VM írni akar bele, **másolás íráskor** (_copy-on-write_) kap saját példányt – ugyanaz a trükk, amit a `fork()`-nál tanultál.

```python run
# KSM: mennyit spórol az azonos lapok összevonása?
vm_db = 20
vm_mem_gb = 4.0
kozos_gb = 1.2              # VM-enként ennyi azonos tartalmú lap (OS, könyvtárak)
fizikai_gb = 64

nelkule = vm_db * vm_mem_gb
vele = vm_db * (vm_mem_gb - kozos_gb) + kozos_gb     # a közös rész csak egyszer kell
print(f"KSM nélkül: {nelkule:.1f} GB kell → {'elfér' if nelkule <= fizikai_gb else 'NEM fér el'} "
      f"a {fizikai_gb} GB-ban")
print(f"KSM-mel:    {vele:.1f} GB kell → {'elfér' if vele <= fizikai_gb else 'NEM fér el'} "
      f"(megtakarítás: {nelkule - vele:.1f} GB, {1 - vele / nelkule:.0%})")

# CPU-túlfoglalás
vcpu, mag = 20 * 2, 16
print(f"\nCPU-túlfoglalás: {vcpu} vCPU / {mag} mag = {vcpu / mag:.1f} : 1")
```

A KSM-nek ára is van: a lapok összehasonlítása CPU-időt visz, és egy biztonsági kockázat is felmerült – a támadó VM az írás **időzítéséből** kikövetkeztetheti, hogy egy lap meg volt-e osztva egy másik VM-mel (_side channel_). Ezért a felhőszolgáltatók különböző ügyfelek VM-jei között általában **kikapcsolják**.

A harmadik eszköz a **ballon-illesztőprogram** (_balloon driver_): a vendégben futó driver a hipervizor kérésére memóriát „fúj fel” (lefoglal a vendégben), és ezt a hipervizor visszaadhatja más VM-eknek. A vendég OS így maga dönti el, mit lapoz ki – okosabban, mint ha a hipervizor vakon tenné.

## 3. Élő migráció – szimulátorral

Az alapleckében láttad: élő migrációnál a VM futás közben költözik át. A legelterjedtebb módszer az **előmásolás** (_pre-copy_):

1. a VM fut tovább, a hipervizor átmásolja a **teljes** memóriát,
2. közben a VM bizonyos lapokat **módosít** (piszkos lapok) – ezeket újra kell küldeni,
3. ezt **ismétli**, amíg a maradék piszkos rész elég kicsi nem lesz,
4. ekkor a VM-et **egy pillanatra megállítja**, átküldi a maradékot és a CPU-állapotot, és a célgépen elindítja.

```python run
# Élő migráció előmásolással: hány kör, mennyi idő, mekkora a leállás?
def migracio(memoria_mb, savszel_mb_s, piszkolas_mb_s, kuszob_mb=50, max_kor=10):
    maradek = memoria_mb
    ossz_ido = 0.0
    for kor in range(1, max_kor + 1):
        ido = maradek / savszel_mb_s                  # ennyi ideig tart ezt a kört átküldeni
        ossz_ido += ido
        uj_piszkos = min(piszkolas_mb_s * ido, memoria_mb)   # közben ennyi lap módosul
        print(f"  {kor}. kör: {maradek:7.0f} MB küldése {ido:6.2f} mp, "
              f"közben {uj_piszkos:6.0f} MB lett piszkos")
        maradek = uj_piszkos
        if maradek <= kuszob_mb:
            break
    else:
        print(f"  (elérte a {max_kor} kör maximumot – a maradékot megállítva kell átküldeni)")
    leallas_ms = maradek / savszel_mb_s * 1000
    print(f"  → leállás: {leallas_ms:.0f} ms, teljes idő: {ossz_ido + leallas_ms / 1000:.1f} mp\n")

print("8 GB VM, 10 Gbit/s (1250 MB/s), 200 MB/s piszkolás:")
migracio(8192, 1250, 200)
print("ugyanez, de a VM nagyon sokat ír (1200 MB/s):")
migracio(8192, 1250, 1200)
```

Az első esetben **3 kör** után a leállás kb. **27 ms** – a felhasználó észre sem veszi. A második esetben a VM majdnem olyan gyorsan piszkítja a memóriát, ahogy a hálózat átviszi, így a maradék körönként alig csökken: 10 kör után is gigabájtok maradnak, és a végső leállás **másodpercekig** tart. A **konvergencia feltétele**: a piszkolási sebesség legyen jóval kisebb a sávszélességnél. Ha nem az, a hipervizor **lassítja** a VM-et (kevesebb CPU-időt ad neki, hogy kevesebbet írjon), vagy **utómásolásra** (_post-copy_) vált: azonnal átköltözteti a VM-et, és a hiányzó lapokat a célgép laphibakor kéri le a forrástól.

**Hasonlat:** költözés úgy, hogy közben otthon laksz. Először minden dobozt átviszel, de közben használsz dolgokat, amelyeket újra el kell vinni. Ha keveset rendetlenkedsz, pár kör után már csak egy táska marad – azzal az utolsó pillanatban átsétálsz.

## 4. cgroups: hogyan számolódnak a konténer korlátai?

A `docker run --cpus 0.5 --memory 256m` a háttérben a **cgroups v2** fájljait írja (`/sys/fs/cgroup/…`):

- **`cpu.max`**: két szám, **kvóta** és **periódus** mikroszekundumban. A `50000 100000` azt jelenti: 100 ms-onként legfeljebb 50 ms CPU-idő, azaz **0,5 mag**. A `200000 100000` = 2 mag (több szálon).
- **`memory.max`**: a memóriakorlát bájtban; túllépéskor a kernel OOM killere leállít egy folyamatot a cgroupban.
- **`pids.max`**: a folyamatok maximális száma – véd a „fork-bomba” ellen.

```python run
# A cgroups cpu.max hatása: mennyi ideig fut egy CPU-igényes feladat?
def futasido(munka_mp, kvota_us, periodus_us, szalak=1):
    magok = kvota_us / periodus_us                  # ennyi "magnyi" CPU jár
    hasznalhato = min(magok, szalak)                # egy szál legfeljebb egy magot használ
    return munka_mp / hasznalhato, magok

for kvota, szal in [(50000, 1), (100000, 1), (200000, 1), (200000, 4)]:
    ido, magok = futasido(10, kvota, 100000, szal)
    print(f"cpu.max = '{kvota} 100000' ({magok:.1f} mag), {szal} szál: "
          f"10 mp CPU-munka → {ido:.1f} mp")
```

Figyeld meg: a 2 magos korlát **egyszálú** programon nem segít (10 mp marad) – egy szál egyszerre csak egy magon futhat. Ugyanaz a tanulság, mint az Amdahl-törvénynél.

```bash
# Ubuntu VM: nézd meg a saját shelled cgroupját és korlátait
cat /proc/self/cgroup                          # pl. 0::/user.slice/user-1000.slice/…
cat /sys/fs/cgroup/user.slice/cpu.max 2>/dev/null   # "max 100000" = nincs korlát
systemd-cgls --no-pager | head -20             # a cgroup-fa
# PID névtér kipróbálása konténer nélkül:
sudo unshare --pid --fork --mount-proc bash -c 'ps aux'   # csak 2 folyamat, a bash az 1-es!
```

## 5. Hány VM vagy konténer fér el egy szerveren?

```python run
# Sűrűség: VM-ek és konténerek egy 64 GB-os szerveren
SZERVER_GB = 64
GAZDA_GB = 4                     # a gazda OS-nek és a hipervizornak fenntartva
APP_GB = 0.5                     # maga az alkalmazás (pl. egy kis webszolgáltatás)

vm_rezsi_gb = 1.0                # minden VM-ben egy teljes vendég OS fut
kontener_rezsi_gb = 0.02         # a konténer csak a folyamatot és a könyvtárait hozza

elerheto = SZERVER_GB - GAZDA_GB
print(f"VM-ek:       {int(elerheto // (APP_GB + vm_rezsi_gb)):>4} db "
      f"(egy VM {APP_GB + vm_rezsi_gb:.2f} GB, indulás ~30 mp)")
print(f"konténerek:  {int(elerheto // (APP_GB + kontener_rezsi_gb)):>4} db "
      f"(egy konténer {APP_GB + kontener_rezsi_gb:.2f} GB, indulás ~1 mp)")
```

A konténer **kétszer-háromszor** sűrűbben pakolható, és másodpercek alatt indul, mert nem kell OS-t bootolni. Az ár: minden konténer **ugyanazt a kernelt** használja, így egy kernelhiba mindegyiket veszélyezteti, és Linux-konténer csak Linux-kernelen fut (Windowson és macOS-en a Docker Desktop a háttérben egy kis Linux VM-et indít). Ezért a felhőben gyakori a kettő **kombinációja**: minden ügyfél saját VM-et kap (erős elszigetelés), azon belül pedig konténerekben futnak a szolgáltatások (sűrűség, gyors indulás). Az AWS Firecracker „mikro-VM”-jei ezt a határt mossák el: egy VM, amely ~125 ms alatt indul.

## Összefoglalás

- VM-ben a címfordítás **kétdimenziós**: egy 4 szintű táblánál TLB-hibakor legfeljebb **24** memóriaolvasás (natívan 4) – ezért fontos a TLB és a nagy lapok.
- Túlfoglalás: vCPU / mag (3:1–4:1 tipikus; a túlterhelést a **steal time** mutatja); a **KSM** az azonos lapokat egyszer tárolja, copy-on-write-tal.
- Élő migráció **előmásolással**: körönként csak a piszkos lapokat küldi újra; ha a piszkolás jóval lassabb a hálózatnál, a leállás néhány tíz ms.
- cgroups: `cpu.max` = kvóta / periódus (pl. 50000/100000 = 0,5 mag), `memory.max`, `pids.max`; több mag csak többszálú programon segít.
- A konténer sűrűbb és gyorsabban indul, a VM erősebben elszigetel – a felhő gyakran kombinálja őket.

## A lecke feladata

```quiz required
? Egy konténer cgroup-beállítása: cpu.max = "25000 100000". Hány magnyi CPU-időt használhat?
= 0.25
= 0,25
! 25 000 / 100 000 = 0,25 mag – 100 ms-onként 25 ms.

? Egy gazdagépen 12 fizikai mag van, és 6 VM fut, mindegyik 6 vCPU-val. Mekkora a CPU-túlfoglalási arány? (pl. 2 : 1 esetén írd: 2)
= 3
! 6 · 6 = 36 vCPU / 12 mag = 3 : 1.

? Élő migrációnál a hálózat 1000 MB/s-ot visz át, a VM 100 MB/s-mal piszkítja a memóriát. Az első körben 4000 MB-ot kell átküldeni. Hány MB lesz közben piszkos?
= 400
! 4000 / 1000 = 4 mp alatt 4 · 100 = 400 MB.

? Miért drágább egy TLB-hiba virtuális gépben, mint natívan?
- mert a VM-nek nincs TLB-je
+ mert a vendég laptáblájának minden szintjét a hipervizor EPT/NPT tábláján át is le kell fordítani
- mert a hipervizor minden memóriaolvasást a lemezről szolgál ki
! Kétdimenziós bejárás: 4 szint esetén legfeljebb 24 olvasás.

? Mit csinál a KSM (Kernel Samepage Merging)?
+ megkeresi az azonos tartalmú memórialapokat, és egyetlen, írásvédett példányt tart meg belőlük
- tömöríti a VM-ek memóriáját a lemezen
- a nem használt lapokat a swapra írja
! Íráskor copy-on-write-tal kap saját példányt az író.

? Egy egyszálú program fut egy konténerben, amelynek cpu.max értéke "200000 100000" (2 mag). Gyorsabb lesz-e, mint 1 magos korláttal?
- igen, kétszer gyorsabb
+ nem, egy szál egyszerre csak egy magon futhat
- igen, de csak a felével
! A többletmag csak többszálú programon segít.
```
