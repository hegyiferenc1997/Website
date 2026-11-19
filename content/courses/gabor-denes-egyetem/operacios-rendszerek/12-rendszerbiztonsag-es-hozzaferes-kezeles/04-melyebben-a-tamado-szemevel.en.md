---
title: Deeper – Through the Attacker's Eyes: Passwords, Permissions and Buffer Overflows
summary: How long it takes to crack a password (key space, entropy, fast and slow hashes), why salt and a slow hash are needed (a Python experiment), how the kernel decides on permissions (the owner–group–others order trap), calculating the umask and the SUID bit, and a simulated buffer overflow – and how the stack canary, NX and ASLR stop it.
minutes: 45
---

## What you will learn in this lesson

- to **calculate** how long it takes to crack a password by brute force,
- why the OS stores a **salted** and deliberately **slow** hash – and try it in Python,
- step by step, how the kernel decides whether you **may access** a file (and a surprising trap),
- to calculate the effect of the **umask**, and understand the **SUID** bit,
- to **simulate** a buffer overflow, and see how the **stack canary**, **NX** and **ASLR** defend against it.

Important: try what you learn here only on your **own** machine and virtual machine. Attacking someone else's system without permission is a crime. But to defend, you need to know how an attacker thinks.

## 1. How long does it take to crack a password?

If an attacker has obtained the hashes (e.g. from a leaked database), they start **guessing**: they compute a hash for every possible password and compare. The number of possibilities is the **key space**:

**key space = (character set size) ^ (length)**

On average **half** of the key space has to be tried. The speed depends on the kind of hash the system uses:

- **fast hash** (e.g. MD5, SHA-1): a graphics card can do about **10 billion** (10¹⁰) guesses per second,
- **slow password hash** (bcrypt, scrypt, yescrypt, Argon2): deliberately expensive, about **10,000** (10⁴) guesses per second.

```python run
# Average cracking time by brute force, with a fast and a slow hash
import math

def duration(sec):
    # seconds in readable form
    for unit, length in [("years", 365 * 24 * 3600), ("days", 24 * 3600), ("hours", 3600), ("min", 60)]:
        if sec >= length:
            return f"{sec / length:,.0f} {unit}"
    return f"{sec:.3f} s"

passwords = [
    ("6 lowercase",     26, 6),
    ("8 lowercase",     26, 8),
    ("8 mixed chars",   94, 8),     # lower and upper case, digits, punctuation
    ("12 mixed chars",  94, 12),
    ("4 random words", 7776, 4),    # Diceware: 7776-word list
]

print(f"{'password':<15} {'entropy':>9} {'fast hash (10^10/s)':>22} {'slow hash (10^4/s)':>22}")
for name, chars, length in passwords:
    space = chars ** length
    bits = math.log2(space)                    # entropy in bits
    print(f"{name:<15} {bits:>7.1f} b {duration(space / 2 / 1e10):>22} {duration(space / 2 / 1e4):>22}")
```

Three lessons:

1. **Length** matters most: every extra character multiplies the key space (by 94!).
2. A **slow hash** slows the attacker down a millionfold – that's why passwords aren't stored with MD5.
3. Four random words ("horse-battery-stove-clip") are about as strong as 8 mixed characters – but **much easier to remember**. (Only if you really pick the words at random, not from a song lyric!)

**Entropy** (in bits) tells you how many yes/no questions it would take to guess the password: log₂(key space). Below 40 bits is weak, above 60 strong, above 80 practically uncrackable today.

An important caveat: all this holds only for a **random** password. Attackers first try **dictionaries** and leaked password lists – `Password123!` is 12 characters, yet it falls in seconds.

## 2. Salt and slow hash – an experiment

Why is **salt** needed? Without salt, two identical passwords have the **same** hash – the attacker computes the hashes of common passwords once (a **rainbow table**) and then just looks them up. A random salt forces them to start over for every user.

```python run
# Without salt and with salt: same password, different hashes
import hashlib, os, time

password = b"kitty123"
print("no salt, Anna:  ", hashlib.sha256(password).hexdigest()[:24])
print("no salt, Bela:  ", hashlib.sha256(password).hexdigest()[:24], "← the same!")

for name in ["Anna", "Bela"]:
    salt = os.urandom(16)                                 # 16 random bytes
    h = hashlib.sha256(salt + password).hexdigest()
    print(f"salted, {name}:   {h[:24]}  (salt: {salt.hex()[:8]}…)")

# Slow hash: PBKDF2 hashes many times in a row (iterations)
hashlib.pbkdf2_hmac("sha256", password, b"warmup", 1)    # first call: warm-up
for iterations in [1, 10000, 100000]:
    start = time.perf_counter()
    hashlib.pbkdf2_hmac("sha256", password, b"saltSALT16bytes!", iterations)
    elapsed = time.perf_counter() - start
    print(f"PBKDF2 {iterations:>6} iterations: {elapsed * 1000:9.3f} ms / guess")
```

The salt is **not secret** – it's stored next to the hash (in the `$y$…$` part of an `/etc/shadow` line). Its only job is to make every hash unique. 100,000 iterations slow the attacker down 100,000-fold too. The user doesn't even notice a few tenths of a second at login, but for an attacker making billions of guesses it means years.

## 3. How does the kernel decide on access?

When you open a file, the kernel runs this algorithm (simplified):

1. If the process is **root** (UID 0) → almost everything is allowed.
2. If the process UID = the file's **owner** → the **owner** (u) permissions decide, **and that's it**.
3. Otherwise, if one of the process's groups = the file's **group** → the **group** (g) permissions decide, and that's it.
4. Otherwise the **others** (o) permissions decide.

"And that's it" is the key: the kernel stops at **the first matching** category; it doesn't look for the most favourable one!

```python run
# The kernel's permission check, simplified
def allowed(user, groups, file, wanted):
    owner, group, perms = file                        # perms e.g. "rw-r--r--"
    if user == "root":
        return True
    if user == owner:
        part = perms[0:3]                             # first match: owner
    elif group in groups:
        part = perms[3:6]
    else:
        part = perms[6:9]
    return {"r": part[0] == "r", "w": part[1] == "w", "x": part[2] == "x"}[wanted]

file = ("anna", "students", "---r--rw-")              # odd, but possible permissions
for who, groups in [("anna", ["students"]), ("bela", ["students"]),
                    ("cili", ["guests"]), ("root", [])]:
    print(f"{who:<5} may read? {allowed(who, groups, file, 'r')}")
```

A surprising result: Anna, the **owner**, can't read her own file, while Cili (others) can! Because the owner's `---` applies to Anna, and the kernel stops there. (Of course, as the owner Anna can give herself the right back any time with `chmod`.)

On directories, permissions mean something different:

| Perm | On a file         | On a directory                                         |
| ---- | ----------------- | ------------------------------------------------------ |
| r    | read the contents | **list** the directory (`ls`)                          |
| w    | write the contents| **create, delete, rename** files in it                 |
| x    | execute           | **enter** it (`cd`), and access the files in it        |

This leads to a common surprise: you can **delete** a file if you have write permission on its **directory** – even if you have none on the file itself! (That's why `/tmp` has the **sticky bit**, `drwxrwxrwt`: there you can only delete your own files.)

## 4. The umask and SUID

### Calculating the umask

The program requests the permissions of a new file (usually **666** for a file, **777** for a directory), and the **umask** **takes away** bits from it: perms = requested AND NOT umask.

```python run
# Effect of the umask on the permissions of new files and directories
def perms_text(number):
    chars = ""
    for i in range(8, -1, -1):                    # 9 bits from left to right
        chars += "rwx"[(8 - i) % 3] if number >> i & 1 else "-"
    return chars

for umask in [0o022, 0o002, 0o027, 0o077]:
    f = 0o666 & ~umask
    d = 0o777 & ~umask
    print(f"umask {umask:03o}: file {f:03o} ({perms_text(f)}), "
          f"directory {d:03o} ({perms_text(d)})")
```

The `077` umask is the strictest: only you can see your new files – worth using on a shared server, for example.

### The SUID bit – borrowed privileges

Passwords are stored in `/etc/shadow`, which only root can write. So how can an ordinary user change their **own** password with the `passwd` command?

```bash
ls -l /usr/bin/passwd        # -rwsr-xr-x root root … ← the "s" is the SUID bit
ls -l /etc/shadow            # -rw-r----- root shadow …
```

A program marked with the **SUID** (_set user ID_) bit runs with the permissions of its **owner** (here root), whoever starts it. That's why `passwd` can write `/etc/shadow` – but the program itself checks that you can only change **your own** password.

That's why SUID programs are attackers' favourite targets: if a SUID-root program has a bug, it can be used to gain **root** (_privilege escalation_). As an administrator it's worth reviewing them occasionally:

```bash
find / -perm -4000 -type f 2>/dev/null     # every SUID file on the system
```

## 5. Buffer overflow – simulated

The classic attack: a C program copies input into a fixed-size array (a **buffer**) **without a length check**. On the stack, right after the buffer lies the function's **return address** – if the input is longer, it overwrites it, and the function "returns" to an address chosen by the attacker.

Let's simulate the stack with a byte array (in reality the stack grows downwards, but the principle is the same):

```python run
# Buffer overflow simulated: 8-byte buffer, then the return address
def function_call(data, canary_protection=False):
    stack = bytearray(16)
    BUFFER, CANARY, RETURN = slice(0, 8), slice(8, 12), slice(12, 16)
    stack[RETURN] = b"\x10\x20\x30\x40"             # the correct return address
    canary = b"\xde\xad\xbe\xef"                    # random value (fixed here)
    stack[CANARY] = canary

    # The faulty copy: no length check (like C's strcpy)
    for i, byte in enumerate(data):
        if i < len(stack):
            stack[i] = byte

    if canary_protection and stack[CANARY] != canary:
        return "DETECTED: the canary was damaged → the program aborts (stack smashing detected)"
    addr = bytes(stack[RETURN]).hex()
    return "fine, returns to: " + addr if addr == "10203040" else "HIJACKED, jumping to: " + addr

print("short input:     ", function_call(b"Anna"))
attack = b"A" * 12 + b"\x66\x66\x66\x66"            # 12 bytes of padding + fake address
print("long input:      ", function_call(attack))
print("with canary:     ", function_call(attack, canary_protection=True))
```

The three lines of defence that make this hard today:

| Defence          | What does it do?                                                          | Against what?                          |
| ---------------- | ------------------------------------------------------------------------- | -------------------------------------- |
| **stack canary** | a random value between the buffer and the return address; abort if damaged | overwriting the return address        |
| **NX / DEP**     | the stack isn't executable                                                | malicious code written into the buffer |
| **ASLR**         | the stack, libraries and program address differ on every start            | guessing "where should I jump?"        |

The **canary** is named after the miners' canary: the bird reacted to poisonous gas sooner than people – it raised the alarm before things got bad.

We can calculate ASLR's strength too: with a **28-bit** random offset, an attacker needs on average 2²⁷ ≈ **134 million** attempts – and every wrong guess crashes the program, which gets noticed. The best defence, of course, is not to have the bug in the first place: that's why **memory-safe** languages (Rust, Go, Java, Python) that don't allow writing past an array's bounds are spreading. The Linux kernel contains more and more Rust code too.

```bash
# Ubuntu VM: ASLR live – different addresses twice in a row
grep -m1 stack /proc/self/maps
grep -m1 stack /proc/self/maps
```

## Summary

- Key space = character set^length; entropy is log₂(key space). **Length** matters most, and a **slow hash** slows guessing down a millionfold.
- Thanks to **salt**, identical passwords give different hashes, so rainbow tables are useless.
- For permissions, the kernel stops at the **first matching** category (owner → group → others).
- On a directory `w` means deletion, `x` means entry; the sticky bit on `/tmp` protects others' files.
- perms = requested AND NOT umask (666 and 022 → 644). A **SUID** program runs with its owner's permissions – that's why it's sensitive.
- Against buffer overflows: **stack canary**, **NX/DEP**, **ASLR** – and memory-safe languages.

## Lesson exercise

```quiz required
? How many possible passwords are there if the password consists of exactly 4 digits (e.g. a PIN)?
= 10000
= 10 000
! 10⁴ = 10,000 – instantly crackable by brute force, which is why phones limit the number of attempts.

? What are the new file's permissions in octal if the program requests 666 and the umask is 027?
= 640
! 666 AND NOT 027 = 640: owner rw, group r, others nothing.

? report.txt has permissions ----rw-r-- , owner anna, group students. Anna is a member of the students group. Can Anna write the file (without chmod)?
- yes, because the group has write permission
+ no, because the owner permissions apply to her, and the kernel stops there
- yes, because the owner can always write everything
! The first matching category decides.

? Why does the operating system use a salt for the password hash?
- so that the password can be recovered
+ so that identical passwords give different hashes, and precomputed tables don't work
- so that the hash is shorter
! The salt isn't secret; it's stored next to the hash.

? Which defence detects that a buffer overflow has overwritten the area in front of the stack's return address?
- ASLR
- NX bit
+ stack canary
- firewall
! The function checks the canary value before returning.

? Why can an ordinary user change their own password with passwd, if only root can write /etc/shadow?
+ because passwd is a SUID-root program, so it runs with its owner's, root's, permissions
- because the kernel temporarily disables permissions for password changes
- because everyone can write /etc/shadow
! ls -l /usr/bin/passwd → -rwsr-xr-x.
```
