---
title: Practice – Security and Permissions
summary: A permissions lab in the Ubuntu VM, review questions and a summary worksheet with chmod calculations.
minutes: 30
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
