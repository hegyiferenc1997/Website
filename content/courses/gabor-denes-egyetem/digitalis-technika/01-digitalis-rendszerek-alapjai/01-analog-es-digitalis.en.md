---
title: Analog and Digital Information
summary: What information is, how analog and digital signals differ, and why digital technology won.
minutes: 15
---

## What you will learn

- what **information**, a **signal** and **noise** mean,
- the difference between **analog**, **discrete-time**, **discrete-amplitude** and **digital** signals,
- why a digital signal is **noise-tolerant**, and why every computer is built on it.

## Information and signals

**Information** is any knowledge, fact or data that can be interpreted and processed. In digital electronics information is carried by **signals**: most often **voltage**, sometimes current, light (optical fibre) or radio waves.

We look at a signal along two axes:

- **time** – does it have a value at every instant, or only at certain instants?
- **amplitude** (value) – can it take any value, or only a few chosen levels?

## The four kinds of signal

| Signal                 | Time         | Amplitude    | Example                                        |
| ---------------------- | ------------ | ------------ | ---------------------------------------------- |
| analog (continuous)    | continuous   | continuous   | microphone voltage, thermometer                |
| discrete-time          | discrete     | continuous   | temperature read hourly (with decimals)        |
| discrete-amplitude     | continuous   | discrete     | stepped signal, e.g. positions of a switch     |
| **digital**            | **discrete** | **discrete** | a computer's bits, the samples of an audio file |

- **Analog** information: the value can vary continuously among infinitely many values (volume, temperature).
- **Digital** information: the signal can take only a **finite number of levels** – in the binary system just two: **0** and **1** (LOW and HIGH).

> An analog signal becomes digital in two steps: **sampling** (discrete in time) and **quantisation** (discrete in amplitude). We cover these in detail with A/D converters (topic 8).

## Noise

**Noise** is any unwanted electrical or electromagnetic signal that is added to the useful signal but carries no information. It can be

- **external**: lightning, interference from other devices, cosmic radiation,
- **internal**: random thermal motion of electrons in a conductor (thermal noise).

The key measure of signal quality is the **signal-to-noise ratio** (SNR): the ratio of useful signal power to noise power, given in decibels. **Higher SNR = better quality.**

## Why is a digital signal noise-tolerant?

In an analog system even the smallest noise changes the value **permanently** (the radio crackles, and this cannot be removed perfectly afterwards).

A digital receiver only has to decide whether the incoming voltage means **0 or 1**. As long as the noise does not cross the decision threshold, the information can be **restored 100%, without error**. If a bit error does happen, **error-detecting and error-correcting codes** (parity, Hamming code, CRC – see topic 2) help.

```text
 analog:  noisy signal → noisy result (the noise stays)
 digital: noisy signal → threshold → clean 0/1 (the noise disappears)
```

## Further advantages of digital technology

- **Lossless copying** – the thousandth copy of the bits is identical to the original.
- **Simple, cheap building blocks** – a switch (transistor) only has to distinguish two states reliably.
- **Programmability** – the same hardware does different jobs with different programs.
- **Storage and compression** – data are stored as numbers that can be encoded and encrypted.

The **drawback** is that the real world is analog: sensor signals must be digitised, and signals for speakers or motors must be converted back.

## Summary

- A signal can be continuous or discrete in **time** and in **amplitude**; a digital signal is discrete in both.
- A binary digital signal has two levels: 0 and 1.
- Digital signals are noise-tolerant: noise below the threshold does not change the information.
- Signal quality is described by the signal-to-noise ratio (SNR, dB).

## Lesson exercise

```quiz required
? Which signal is **discrete in both time and amplitude**?
- the output voltage of a microphone
- temperature read hourly with one decimal
+ the samples of an audio file stored as integers
- the voltage of a dimmer (potentiometer)
! Digital signal: it has a value only at certain instants, and only a finite number of values.

? How many different levels does a **binary** digital signal have?
= 2
= two
! "Binary" refers to base two: 0 and 1.

? What is the usual abbreviation of the signal-to-noise ratio?
= SNR
! Signal-to-Noise Ratio.

? Which statement is true?
- Noise on an analog signal can always be removed perfectly afterwards.
+ A digital signal can be restored without error if the noise stays below the decision threshold.
- A digital signal cannot be affected by noise.
- The lower the SNR, the better the signal quality.
! Noise is added to digital signals too, but as long as it does not cross the threshold, the 0/1 decision stays correct.
```
