---
title: Elágazás és ciklus
summary: if–elif–else, összehasonlítás és logikai műveletek, for és while ciklus, range.
minutes: 18
---

## Amit ebben a leckében megtanulsz

- hogyan dönt a program: `if`, `elif`, `else`,
- az **összehasonlító** és **logikai** műveleteket,
- hogyan ismételsz: `for` és `while` ciklus, `range`.

## Elágazás

A Pythonban a **behúzás** (4 szóköz) jelzi, mely sorok tartoznak egy blokkhoz.

```python run
homerseklet = 24
if homerseklet >= 30:
    print("kánikula")
elif homerseklet >= 20:
    print("kellemes")
elif homerseklet >= 10:
    print("hűvös")
else:
    print("hideg")
```

| Összehasonlítás   | Jelentés                  |
| ----------------- | ------------------------- |
| `==` `!=`         | egyenlő, nem egyenlő      |
| `<` `<=` `>` `>=` | kisebb, kisebb-egyenlő, … |

Logikai műveletek: `and` (és), `or` (vagy), `not` (nem).

```python run
ev = 2028
szokoev = (ev % 4 == 0 and ev % 100 != 0) or ev % 400 == 0
print(ev, "szökőév" if szokoev else "nem szökőév")
```

## for ciklus

A `for` egy sorozat elemein megy végig. A `range(a, b)` az `a`, `a+1`, …, `b-1` számokat adja.

```python run
for i in range(1, 6):
    print(i, i * i)

for betu in "Győr":
    print(betu)
```

## while ciklus

A `while` addig ismétel, amíg a feltétel igaz. Vigyázz, hogy egyszer hamis legyen, különben **végtelen ciklus** lesz!

```python run
# Hányszor kell felezni 1000-et, hogy 1 alá menjen?
x = 1000
lepes = 0
while x >= 1:
    x = x / 2
    lepes += 1
print(lepes)
```

A `break` azonnal kilép a ciklusból, a `continue` a következő körre ugrik.

## Összefoglalás

- `if / elif / else`; a blokkot a behúzás jelzi.
- Összehasonlítás: `== != < <= > >=`; logika: `and`, `or`, `not`.
- `for x in sorozat`, `range(a, b)`; `while feltétel`; `break`, `continue`.

## A lecke feladata: FizzBuzz

Írd meg a `fizzbuzz(n)` függvényt, amely visszaad egy szöveget: ha `n` osztható 3-mal **és** 5-tel, `"FizzBuzz"`; ha csak 3-mal, `"Fizz"`; ha csak 5-tel, `"Buzz"`; egyébként magát a számot szövegként (`str(n)`).

```python starter required
def fizzbuzz(n):
    # Előbb a 15-tel oszthatóságot nézd!
    return str(n)


for i in range(1, 16):
    print(fizzbuzz(i))
```

<details>
<summary>Megoldás</summary>

```python solution
def fizzbuzz(n):
    if n % 15 == 0:
        return "FizzBuzz"
    elif n % 3 == 0:
        return "Fizz"
    elif n % 5 == 0:
        return "Buzz"
    return str(n)


for i in range(1, 16):
    print(fizzbuzz(i))
```

</details>

```python test
assert fizzbuzz(3) == "Fizz", "3 → Fizz"
assert fizzbuzz(10) == "Buzz", "10 → Buzz"
assert fizzbuzz(30) == "FizzBuzz", "30 → FizzBuzz"
assert fizzbuzz(7) == "7", "7 → \"7\""
```
