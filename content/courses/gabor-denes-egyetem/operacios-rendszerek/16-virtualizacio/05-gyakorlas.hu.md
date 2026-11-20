---
title: Gyakorlás – virtualizáció
summary: Élő migráció szimulációja Pythonban, kipróbálós feladat a VirtualBoxban és Dockerrel, ellenőrző kérdések és összefoglaló feladatlap.
minutes: 50
kind: practice
---

## Élő migráció számokkal

Az előző lecke élő migrációja körökben halad: először az egész memória megy át, majd mindig csak az, ami közben módosult. Futtasd, majd próbáld ki más értékekkel (pl. `piszkolas = 900`)!

```python run
# Élő migráció szimulációja: minden körben átküldjük a piszkos lapokat, közben újak keletkeznek.
memoria = 4096        # a VM memóriája (MB)
savszel = 1000        # hálózati sebesség (MB/s)
piszkolas = 200       # ennyi MB memória módosul másodpercenként futás közben

kuldendo = memoria    # első kör: az egész memória
kor = 1
while kuldendo > 50:  # 50 MB alatt már megállíthatjuk a VM-et
    ido = kuldendo / savszel                 # ennyi ideig tart a kör
    print(f"{kor}. kör: {kuldendo:7.1f} MB, {ido:.3f} s")
    kuldendo = piszkolas * ido               # közben ennyi lap lett újra piszkos
    kor += 1
print(f"megállás: {kuldendo:.1f} MB maradék, kb. {kuldendo / savszel * 1000:.0f} ms szünet")
```

Ha a VM gyorsabban „piszkítja” a memóriát, mint ahogy a hálózat átviszi (`piszkolas >= savszel`), a migráció sosem érne véget – ilyenkor a hipervizor lelassítja a VM-et, vagy hamarabb megállítja.

## Kipróbálós feladat

1. A VirtualBoxban nézd meg az Ubuntu VM beállításait: **Rendszer → Gyorsítás** – melyik paravirtualizációs felület (_KVM_, _Hyper-V_) van kiválasztva?
2. Az Ubuntu VM-ben futtasd: `lscpu | grep -i hypervisor` és `systemd-detect-virt`. Mit írnak ki?
3. Telepítsd a Dockert (előző lecke), indíts egy konténert (`docker run -it --rm ubuntu bash`), és futtasd benne a `ps aux` és a `hostname` parancsot. Hasonlítsd össze a VM-ben kapott eredménnyel.

<details>
<summary>Mit kell látnod?</summary>

1. Linux vendégnél alapból **KVM**, Windowsnál **Hyper-V** felület: a vendég OS ezen keresztül tudja, hogy VM-ben fut, és gyorsabb órát és megszakításokat kap.
2. `Hypervisor vendor: KVM` és `oracle` (VirtualBox) – a vendég tudja, hogy virtualizált.
3. A konténerben csak a `bash` és a `ps` látszik, a gépnév egy véletlen azonosító: ez a PID és UTS névtér hatása. A kernel (`uname -r`) viszont ugyanaz, mint a VM-é.

</details>

## Ellenőrző kérdések

<details>
<summary>1. Miért gyorsabb a konténer indulása, mint a virtuális gépé?</summary>

Mert nem kell kernelt betölteni és egy teljes operációs rendszert elindítani: a konténer csak egy új folyamat a már futó gazda kernelen, saját névterekkel és cgroups-korlátokkal.

</details>

<details>
<summary>2. Futtatható-e Windows egy Linux-konténerben? És Linux virtuális gépen?</summary>

Linux-konténerben nem, mert a konténer a gazda Linux kernelét használja. Virtuális gépben igen, mert a VM saját kernelt futtat a virtuális hardveren.

</details>

<details>
<summary>3. Miért nem fut a VirtualBox 64 bites vendéggel, ha a BIOS-ban ki van kapcsolva a VT-x?</summary>

Mert a modern VirtualBox a hardveresen támogatott virtualizációra épül: a vendég kernel a CPU külön vendég módjában fut. Szoftveres bináris fordítást 64 bites vendéghez már nem kínál.

</details>

## Összefoglaló feladatlap

```quiz required
? Egy 2048 MB memóriájú VM-et migrálsz 1000 MB/s-os hálózaton, a VM másodpercenként 250 MB-ot piszkít. Hány MB megy át a 2. körben?
= 512
! 1. kör: 2048 MB, 2,048 s; közben 250 × 2,048 = 512 MB lett piszkos.

? Ugyanennél a migrációnál hány kör után marad 50 MB alatt a küldendő adat (amikor megállítható a VM)?
= 3
! 2048 → 512 → 128 → 32 MB: a 3. kör után 32 MB marad.

? Melyik 1. típusú hipervizor épül be a Linux kernelbe?
+ KVM
- VirtualBox
- VMware Workstation
- Parallels Desktop
! Kernel-based Virtual Machine.

? Mit jelent az, hogy a Linux-konténerek osztoznak a gazda kernelén?
+ minden konténer ugyanazt a kernelt használja, csak a névterek és a cgroups választják el őket
- minden konténer saját kernelt indít
- a konténerek nem használnak rendszerhívásokat
- a konténerek csak Windowson futnak
! Ezért gyorsak, de gyengébb az elszigetelésük.

? Melyik modellben kapsz kész, böngészőből használható alkalmazást?
- IaaS
- PaaS
+ SaaS
- egyik sem
! Software as a Service, pl. Gmail.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Futásidő cgroups-korláttal.** Írd meg a `futasido(munka_mp, kvota_us, periodus_us, szalak=1)` függvényt: a `cpu.max` értékből adódó magszám kvóta / periódus, de egy szál legfeljebb egy magot használhat. Mennyi ideig tart `munka_mp` másodpercnyi CPU-munka (egy tizedesre)?

```python starter
def futasido(munka_mp, kvota_us, periodus_us, szalak=1):
    return munka_mp
```

<details>
<summary>Megoldás</summary>

```python solution
def futasido(munka_mp, kvota_us, periodus_us, szalak=1):
    magok = kvota_us / periodus_us
    hasznalhato = min(magok, szalak)          # egy szál = legfeljebb egy mag
    return round(munka_mp / hasznalhato, 1)
```

</details>

```python test
assert futasido(10, 50000, 100000) == 20.0
assert futasido(10, 200000, 100000) == 10.0
assert futasido(10, 200000, 100000, szalak=4) == 5.0
assert futasido(6, 25000, 100000, szalak=2) == 24.0
print("Minden ellenőrzés sikeres!")
```

**2.** **Élő migráció körei.** Írd meg a `migracio(memoria_mb, savszel, piszkolas, kuszob=50, max_kor=30)` függvényt: körönként a maradékot átküldjük (idő = maradék / sávszél), közben piszkolás · idő MB válik piszkossá (legfeljebb a teljes memória) – ez lesz az új maradék. Ha a maradék ≤ küszöb vagy elértük a max. kört, megállunk. Add vissza a `(körök száma, leállás ms-ban egészre kerekítve)` párt; a leállás = maradék / sávszél.

```python starter
def migracio(memoria_mb, savszel, piszkolas, kuszob=50, max_kor=30):
    return (1, 0)
```

<details>
<summary>Megoldás</summary>

A harmadik esetben a piszkolás gyorsabb a hálózatnál: a maradék sosem csökken, minden kör után a teljes memória piszkos – ilyenkor a VM-et lassítani kell, vagy utómásolásra (post-copy) váltani.

```python solution
def migracio(memoria_mb, savszel, piszkolas, kuszob=50, max_kor=30):
    maradek, kor = memoria_mb, 0
    while kor < max_kor:
        kor += 1
        ido = maradek / savszel
        maradek = min(piszkolas * ido, memoria_mb)   # közben piszkos lett
        if maradek <= kuszob:
            break
    return (kor, round(maradek / savszel * 1000))
```

</details>

```python test
assert migracio(8192, 1250, 200) == (3, 27)
assert migracio(4000, 1000, 100) == (2, 40)
assert migracio(8192, 1250, 1300, max_kor=5) == (5, 6554)
print("Minden ellenőrzés sikeres!")
```

**3.** **KSM megtakarítás.** Írd meg a `memoria_igeny(vm_db, vm_gb, kozos_gb)` függvényt, amely egy párt ad vissza: a szükséges memória KSM nélkül, és KSM-mel, ha VM-enként `kozos_gb` azonos tartalmú lapot csak egyszer kell tárolni (egy tizedesre)!

```python starter
def memoria_igeny(vm_db, vm_gb, kozos_gb):
    return (vm_db * vm_gb, vm_db * vm_gb)
```

<details>
<summary>Megoldás</summary>

```python solution
def memoria_igeny(vm_db, vm_gb, kozos_gb):
    nelkule = vm_db * vm_gb
    vele = vm_db * (vm_gb - kozos_gb) + kozos_gb     # a közös rész egyszer
    return (round(nelkule, 1), round(vele, 1))
```

</details>

```python test
assert memoria_igeny(20, 4, 1.2) == (80, 57.2)
assert memoria_igeny(1, 4, 1) == (4, 4)
assert memoria_igeny(10, 2, 0) == (20, 20)
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Mi a különbség az 1-es és a 2-es típusú hipervizor között?
+ az 1-es közvetlenül a hardveren fut (pl. Hyper-V, ESXi, KVM), a 2-es egy gazda OS-en futó program (pl. VirtualBox)
- az 1-es csak Linuxot futtat
- a 2-es gyorsabb
! A szervereken az 1-es típus az általános.

? Melyik két Linux-kernelfunkcióra épülnek a konténerek?
+ névterek (namespaces) és cgroups
- TLB és MMU
- swap és cache
! A névterek azt szabályozzák, mit lát a folyamat, a cgroups azt, mennyit használhat.

? Mi az IaaS, PaaS és SaaS közül az, amikor a szolgáltató csak a virtuális gépet adja, minden más (OS, alkalmazás) a te dolgod?
+ IaaS
- PaaS
- SaaS
! A SaaS kész alkalmazás (pl. webes levelező).

? Miért indul el egy konténer sokkal gyorsabban, mint egy virtuális gép?
+ mert a gazda kernelét használja, nem kell operációs rendszert bootolni
- mert kevesebb fájlja van
- mert a konténer nem használ CPU-t
! Az ára: minden konténer ugyanazt a kernelt használja.

? Mit mutat a vendég rendszerben a top „st” (steal time) oszlopa?
+ mennyi időt várt a VM, mert a hipervizor a fizikai CPU-t más VM-eknek adta
- mennyi memóriát loptak el
- a lemez várakozási idejét
! Magas érték túlfoglalt gazdagépre utal.
```
