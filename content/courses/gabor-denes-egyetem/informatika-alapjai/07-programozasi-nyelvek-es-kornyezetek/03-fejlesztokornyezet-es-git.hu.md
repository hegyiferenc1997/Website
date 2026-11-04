---
title: Fejlesztőkörnyezet és verziókezelés
summary: Szövegszerkesztő, IDE, hibakereső, terminál; a git alapjai: commit, ág, GitHub.
minutes: 18
---

## Amit ebben a leckében megtanulsz

- mi a különbség a **kódszerkesztő** és az **IDE** között,
- mire jó a **hibakereső** (debugger),
- mi a **verziókezelés**, és hogyan használod a **git** alapparancsait.

## Kódszerkesztő és IDE

- **Kódszerkesztő** (VS Code, Sublime Text, Vim): könnyű, gyors; szintaxisszínezés, kiegészítés, bővítmények.
- **IDE** (Integrated Development Environment – integrált fejlesztőkörnyezet: PyCharm, IntelliJ IDEA, Visual Studio, Android Studio): mindent egyben ad – szerkesztő, fordító/futtató, **hibakereső**, tesztfuttató, refaktorálás, projektkezelés.

A **VS Code** bővítményekkel szinte IDE-vé alakítható, ezért ma a legnépszerűbb.

Egy fejlesztőkörnyezet tipikus részei:

| Rész            | Mire jó?                                             |
| --------------- | ---------------------------------------------------- |
| szerkesztő      | kód írása, színezés, automatikus kiegészítés         |
| terminál        | parancsok futtatása (pl. `python program.py`)        |
| **hibakereső**  | töréspont, lépésenkénti futtatás, változók figyelése |
| linter, formázó | hibák és stílus jelzése (pl. Ruff, ESLint, Prettier) |
| MI-asszisztens  | kódjavaslat, magyarázat (pl. Copilot, Claude)        |

## Hibakereső (debugger)

A **töréspontnál** (breakpoint) a program megáll, és megnézheted a változók értékét, majd **soronként** léphetsz tovább. Sokkal hatékonyabb, mint mindenhova `print`-et írni.

## Verziókezelés: git

A **verziókezelő** a projekt minden mentett állapotát megőrzi: bármikor visszanézheted, ki mit és miért változtatott, és visszaállhatsz egy régebbi változatra. A legelterjedtebb a **git**; a tárolók (repository) online otthona pl. a **GitHub** vagy a **GitLab**.

Fogalmak:

- **repository (tároló)**: a projekt mappája a teljes előzménnyel,
- **commit**: egy mentett állapot rövid üzenettel („Bejelentkezés gomb javítása”),
- **branch (ág)**: párhuzamos fejlesztési vonal; az új funkció külön ágon készül,
- **merge**: egy ág beolvasztása a főágba (`main`),
- **push / pull**: feltöltés a távoli tárolóba / letöltés onnan,
- **pull request**: kérés, hogy a csapat nézze át és olvassza be az ágadat.

```bash
git init                         # új tároló a mappában
git add program.py               # a fájl előkészítése mentésre
git commit -m "Első változat"    # mentés üzenettel
git log --oneline                # az előzmények
git switch -c uj-funkcio         # új ág létrehozása és átváltás rá
git push -u origin uj-funkcio    # feltöltés a GitHubra
```

## Összefoglalás

- Kódszerkesztő: könnyű (VS Code); IDE: mindent egyben (PyCharm, Visual Studio).
- Hibakereső: töréspont, soronkénti futtatás, változók figyelése.
- Git: commit = mentett állapot, branch = párhuzamos vonal, merge = beolvasztás, push/pull = szinkron a GitHubbal.

## A lecke feladata

```quiz required
? Mit jelent az IDE rövidítés?
= Integrated Development Environment
= integrált fejlesztőkörnyezet
! Szerkesztő, futtató, hibakereső egyben.

? Hogy hívják azt a pontot, ahol a hibakereső megállítja a program futását?
= töréspont
= breakpoint
! Itt megnézheted a változók értékét.

? Melyik git-parancs ment el egy új állapotot üzenettel?
- git init
- git log
+ git commit -m "üzenet"
- git switch
! A commit egy mentett állapot az előzményekben.

? Hogy hívják a git párhuzamos fejlesztési vonalát?
- commit
+ branch (ág)
- repository
- merge
! Az új funkció külön ágon készül, majd beolvasztják (merge).
```
