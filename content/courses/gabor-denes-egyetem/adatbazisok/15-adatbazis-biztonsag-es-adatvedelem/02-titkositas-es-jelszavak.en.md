---
title: Encryption and Storing Passwords
summary: Encryption in transit (TLS) and at rest, symmetric and asymmetric keys, key management; why passwords must not be encrypted or stored with a plain hash, what a salt and a slow password hash (bcrypt, Argon2) are – with the behaviour of hashes tried out in your browser.
minutes: 25
---

## What you will learn

- the difference between **encryption in transit** and **at rest**,
- what **encryption** and a **hash** are, and why they aren't the same,
- how to store **passwords**: **salt** + **slow hash** (bcrypt, Argon2).

## Encryption in transit

Between the application and the database (and between the browser and the server), data travels over the network. If it isn't encrypted, anyone "listening in" on the network (e.g. on public Wi-Fi) can see everything: queries, passwords, personal data.

The solution is **TLS** (in the browser, the padlock and `https://`). For databases the connection must be protected with TLS too – in PostgreSQL, for example, in the connection settings: `sslmode=verify-full`. This not only encrypts, it also **verifies** that you're really connecting to the genuine server.

## Encryption at rest

What if someone steals the server's disk, or a backup file? If the data is **encrypted at rest** too, the stolen file is useless without the key.

| Level                               | What does it protect against?                      | Example                                    |
| ----------------------------------- | -------------------------------------------------- | ------------------------------------------ |
| **Full disk**                       | a stolen disk, a discarded server                  | LUKS, BitLocker, cloud disk encryption     |
| **Database files** (TDE)            | a stolen data file or backup                       | SQL Server, Oracle TDE                     |
| **Column level / application side** | even the database administrator can't see the data | card numbers, health data stored encrypted |

**Backups** must always be stored encrypted too – an unencrypted backup in object storage (topic 13) is as big a risk as the database itself.

## Keys: symmetric and asymmetric

- **Symmetric** encryption (e.g. AES): the same key encrypts and decrypts. Fast – needed for large amounts of data.
- **Asymmetric** encryption (e.g. RSA, elliptic curves): there's a **public** key (anyone can encrypt with it) and a **private** key (only its owner can decrypt). TLS uses this at the start of a connection to agree on the symmetric key.

Encryption is only worth as much as the safety of the **key**. The key should **never** be in the source code, in the git repository, or next to the database on the same disk. That's what key management services are for (_KMS_, e.g. AWS KMS, Azure Key Vault, HashiCorp Vault).

## Encryption or hash?

| Encryption                                           | Hash (digest)                                                    |
| ---------------------------------------------------- | ---------------------------------------------------------------- |
| **reversible** (with the key)                        | **one-way**: the original can't be computed back from the digest |
| the output's length depends on the data              | always the same size (e.g. SHA-256: 256 bits)                    |
| needed when you have to **read the data back** later | needed when you only have to **check** whether it matches        |

A hash always gives the same result for the same input, but a completely different one for the slightest change:

<details>
<summary>Creating the sample database (SQL)</summary>

<!-- sql-setup: egyetem -->

</details>

```sql run
SELECT 'password123' AS input, encode(sha256('password123'::bytea), 'hex') AS sha256
UNION ALL
SELECT 'password124', encode(sha256('password124'::bytea), 'hex')
UNION ALL
SELECT 'password123', encode(sha256('password123'::bytea), 'hex');
```

## How should passwords be stored?

**Never** store a password:

- **as plain text** – in a data leak everyone's password is known immediately (and many people use the same one elsewhere too!),
- **encrypted** – whoever has the key (or steals it) decrypts them all.

We only store the password's **hash**. At login we hash the typed password too, and compare the two digests. But a plain, fast hash (e.g. SHA-256) isn't enough either, for two reasons:

**1. Identical passwords have identical hashes.** Look:

```sql run
CREATE TABLE users (name TEXT, password_hash TEXT);
INSERT INTO users VALUES
  ('anna', encode(sha256('Spring2026'::bytea), 'hex')),
  ('bela', encode(sha256('123456'::bytea), 'hex')),
  ('cili', encode(sha256('123456'::bytea), 'hex'));
SELECT name, LEFT(password_hash, 16) || '…' AS password_hash FROM users;
```

Bela's and Cili's hashes are identical – whoever guesses one knows the other too. On top of that, attackers keep the hashes of common passwords in precomputed tables (_rainbow tables_).

**Solution: a salt.** Every user gets a **unique, random** value that we put in front of the password before hashing, and store next to the hash (it isn't secret!):

```sql run
CREATE TABLE users (name TEXT, salt TEXT, password_hash TEXT);
INSERT INTO users (name, salt) VALUES ('bela', 'k3J9xQ'), ('cili', 'Vb72pL');
UPDATE users SET password_hash = encode(sha256(convert_to(salt || '123456', 'UTF8')), 'hex');
SELECT name, salt, LEFT(password_hash, 16) || '…' AS password_hash FROM users;
```

Same password, yet a completely different hash – precomputed tables are useless.

**2. A fast hash is too fast.** A modern graphics card computes **billions** of SHA-256 hashes per second, so on a stolen hash list short passwords can be tried exhaustively. That's why passwords need a **deliberately slow** function with an adjustable cost:

| Function               | Note                                                                                    |
| ---------------------- | --------------------------------------------------------------------------------------- |
| **Argon2id**           | today's recommendation: slow **and** memory-hungry (hard to speed up on graphics cards) |
| **bcrypt**             | long-established, widely available                                                      |
| **scrypt**, **PBKDF2** | acceptable if the above aren't available                                                |

These functions handle the salt themselves, and their cost parameter can be raised year by year as machines get faster. In practice password hashing is done by the **application** (a proven library), not written by hand.

> Rule: never write your own encryption or password-hashing algorithm. Use a proven, maintained library!

## Summary

- In transit: TLS (and verifying the server); at rest: disk, file or column-level encryption, encrypted backups.
- Keys belong in a key management service, not in the code.
- Encryption = reversible; hash = one-way.
- Passwords: salt + slow hash (Argon2id, bcrypt); never plain text, encryption or a fast hash.

## The lesson's exercise

```quiz required
? What protects against someone on public Wi-Fi eavesdropping on the traffic between the application and the database?
+ TLS encryption on the connection
- full-disk encryption
- salting the passwords
- a B-tree index
! Encryption in transit.

? Why must passwords not be stored with reversible encryption?
- because encryption is too slow
+ because whoever gets the key can decrypt every password
- because an encrypted password is too long
- because TLS doesn't allow it
! A password never needs to be read back, only checked.

? Two users choose the same password. What ensures that their stored hashes differ?
- TLS
+ a unique, random salt per user
- a faster hash function
- column-level privileges
! Because of the salt, the hashed input differs.

? Which is today's recommendation for hashing passwords?
- SHA-256 without a salt
- MD5
+ Argon2id
- AES encryption
! Slow and memory-hungry, with an adjustable cost.

? Where do we keep the key used to encrypt data?
- in the source code, in a constant
- in the git repository, in a configuration file
+ in a key management service (KMS), separate from the data
- in the database, next to the encrypted data
! A key only protects if it doesn't fall into the attacker's hands together with the data.
```
