---
title: Practice – Security and Permissions
summary: A permissions lab in the Ubuntu VM, review questions and a summary worksheet with chmod calculations.
minutes: 55
kind: practice
---

## Permissions lab (Ubuntu VM – take a snapshot first!)

```bash
sudo adduser --disabled-password --gecos "" test    # new user without a password
sudo groupadd lab
sudo usermod -aG lab $USER                          # then log out and in (or: newgrp lab)
mkdir ~/shared && sudo chown $USER:lab ~/shared
echo "secret" > ~/shared/secret.txt
chmod 640 ~/shared/secret.txt                       # rw-r-----
ls -l ~/shared
sudo -u test cat ~/shared/secret.txt                # Permission denied – test is neither member nor owner
sudo usermod -aG lab test
sudo -u test cat ~/shared/secret.txt                # does it work? (Hint: your ~ folder needs x permission too!)
```

If the second try is also "Permission denied", check `ls -ld ~` – your home folder's permissions (`drwxr-x---`) do not let the `test` user in. That is part of the protection too!

## Review questions

<details>
<summary>1. Why is it a bad idea to do daily work as root?</summary>

Because every program you run – even an infected download – would run with full rights and could overwrite or delete anything. A mistyped command (e.g. a wrong `rm -rf`) could also ruin the whole system.

</details>

<details>
<summary>2. Why does the login password not protect you if the laptop is stolen?</summary>

Because the password only protects entry into the running OS. With the disk removed, the files can be read on another machine – unless there is full disk encryption (BitLocker, LUKS).

</details>

<details>
<summary>3. What do sudo and Windows UAC have in common?</summary>

Both implement the principle of least privilege: the user works with restricted rights by default and gets elevated rights only for the specific administrator action, after explicit confirmation.

</details>

<details>
<summary>4. How do ASLR and DEP together make a buffer overflow attack harder?</summary>

Because of DEP, code written into the stack cannot run, so the attacker would have to jump to existing code fragments of the program – but ASLR randomises their addresses on every start.

</details>

## Summary worksheet

```quiz required
? What is the octal code of the permissions `rwxr-xr--`?
= 754
! (4+2+1)(4+1)(4) = 7 5 4.

? Which permissions does `chmod 640` give?
+ rw-r-----
- rwxr-----
- rw-rw----
- r--r-----
! 6 = rw-, 4 = r--, 0 = ---.

? Which command runs a command as another user (e.g. test)?
= sudo -u test
! sudo -u test cat file

? Which threat tricks users out of passwords with fake e-mails?
+ phishing
- worm
- rootkit
- DoS
! Always check the sender and the real address of the link.

? Which Windows tool encrypts the whole disk, keeping the key in the TPM?
= BitLocker
! Save the recovery key in a safe place!

? What is the "I" of the CIA triad?
- identification
+ integrity
- identifier
- internet
! Confidentiality, Integrity, Availability.
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Octal code from rwx.** Write the `octal(perms)` function, which turns a 9-character permission string (e.g. `"rwxr-xr--"`) into the `chmod` octal code (e.g. `"754"`)!

```python starter
def octal(perms):
    return "000"
```

<details>
<summary>Solution</summary>

```python solution
def octal(perms):
    code = ""
    for i in range(0, 9, 3):                 # owner, group, others
        triple = perms[i:i + 3]
        value = (4 if triple[0] == "r" else 0) + (2 if triple[1] == "w" else 0) \
              + (1 if triple[2] == "x" else 0)
        code += str(value)
    return code
```

</details>

```python test
assert octal("rwxr-xr--") == "754"
assert octal("rw-r--r--") == "644"
assert octal("rw-------") == "600"
assert octal("rwxrwxrwx") == "777"
assert octal("---------") == "000"
print("All checks passed!")
```

**2.** **The effect of the umask.** Write the `new_perms(requested, umask)` function: both are octal strings (e.g. `"666"`, `"022"`); the result is requested AND NOT umask, also as a three-digit octal string.

```python starter
def new_perms(requested, umask):
    return requested
```

<details>
<summary>Solution</summary>

```python solution
def new_perms(requested, umask):
    perms = int(requested, 8) & ~int(umask, 8)   # number from a base-8 string
    return format(perms & 0o777, "03o")          # back to a three-digit octal string
```

</details>

```python test
assert new_perms("666", "022") == "644"
assert new_perms("777", "022") == "755"
assert new_perms("666", "027") == "640"
assert new_perms("777", "077") == "700"
print("All checks passed!")
```

**3.** **Password entropy.** Write the `entropy(password)` function: the character set size comes from the character classes used (lower case 26, upper case 26, digit 10, everything else 32); entropy = length · log₂(set size), rounded to one decimal. (This is only a valid estimate for a random password!)

```python starter
def entropy(password):
    return 0
```

<details>
<summary>Solution</summary>

```python solution
import math

def entropy(password):
    size = 0
    if any(c.islower() for c in password): size += 26
    if any(c.isupper() for c in password): size += 26
    if any(c.isdigit() for c in password): size += 10
    if any(not c.isalnum() for c in password): size += 32
    if size == 0:
        return 0
    return round(len(password) * math.log2(size), 1)
```

</details>

```python test
assert entropy("abcdef") == 28.2
assert entropy("Abcdef12") == 47.6
assert entropy("Ab1!Ab1!Ab1!") == 78.7
assert entropy("") == 0
print("All checks passed!")
```

### Quick check questions

```quiz
? What does the principle of least privilege mean?
+ every user and program should get only the permissions strictly needed for its task
- everyone should work as administrator so they don't get stuck
- the password should be as short as possible
! This way an infected program's damage is limited to its permissions.

? What is phishing?
+ passwords and data obtained through fake e-mails and websites
- a kind of virus that formats the disk
- slowing down network traffic
! Today's most common entry point is people, not technology.

? Which is an example of multi-factor authentication?
+ a password and a one-time code appearing on your phone
- two different passwords
- one long password
! Two different factors: something you know and something you have.

? What does full disk encryption (BitLocker, LUKS) protect against?
+ reading the data from a stolen laptop's disk
- viruses
- phishing
! It doesn't protect a running, unlocked machine – there the files are already readable.

? What does the sticky bit on the /tmp directory (drwxrwxrwt) mean?
+ anyone can create files in it, but can only delete their own files
- the directory's contents survive a reboot
- only root can write to it
! The "t" at the end of the permission string shows it.
```
