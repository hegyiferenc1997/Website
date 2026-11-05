---
title: Negotiation Basics
summary: When we negotiate, what BATNA, reservation point and ZOPA are, and what anchoring means – illustrated with an intern salary and a freelance project.
minutes: 20
---

## What you will learn

- what **negotiation** is and when it is needed,
- the concepts of **BATNA**, **reservation point** and **ZOPA**,
- what **anchoring** means,
- how to **prepare** for a negotiation.

## What is negotiation?

**Negotiation**: communication between two or more parties aimed at an **agreement** that is better for each of them than no agreement. We don't only negotiate in business: about salary, deadlines, dividing tasks in a team, even about cleaning with a flatmate.

## Three key concepts

### BATNA – the best alternative

Your **BATNA** (_Best Alternative To a Negotiated Agreement_) is what you will do if **no agreement** is reached. The better your BATNA, the stronger your negotiating position.

> If you have two internship offers, one is your BATNA when negotiating the other.

### Reservation point

The worst terms you would **still just accept** – anything worse and you'd rather choose your BATNA.

### ZOPA – the zone of possible agreement

The **ZOPA** (_Zone Of Possible Agreement_) is the range where both parties' reservation points are satisfied.

```text
Freelance web development – project price (thousand HUF)

0        300        600 ═════════ ZOPA ═════════ 900        1200
                     ▲                            ▲
         the developer asks at least this   the client pays at most this
```

If the developer asks at least 600 thousand and the client would pay at most 900 thousand, the ZOPA is **600–900 thousand HUF**, 300 thousand wide. If the client would only pay 500 thousand, there is **no ZOPA** – no deal happens.

```python run
# The zone of possible agreement (ZOPA) from two reservation points.
seller_minimum = 600  # thousand HUF – won't do it for less
buyer_maximum = 900   # thousand HUF – won't pay more

if buyer_maximum >= seller_minimum:
    print(f"ZOPA: {seller_minimum}–{buyer_maximum} thousand HUF")
    print(f"Width: {buyer_maximum - seller_minimum} thousand HUF")
else:
    print("No ZOPA, no agreement is reached.")
```

Try it: change `buyer_maximum` to 500!

## Anchoring

The **first number** mentioned strongly affects the final outcome – this is the **anchor**. If the client opens with 400 thousand, the negotiation moves around that; if the developer opens with 1 million, around that.

- If you know the market well, it's worth opening **first, ambitiously but justifiably**.
- If the other side opens with an unrealistic anchor, don't accept it as a starting point: "That's very far from the market price, let's look at exactly what the work includes."

## Preparation

1. What is your **goal**, and what is your **reservation point**?
2. What is your **BATNA** – and how could you improve it?
3. What do you think the **other party's** BATNA and interests are?
4. What **objective data** supports your position (market salary surveys, prices of similar projects)?
5. What can you **concede** that is cheap for you but valuable for them (e.g. deadline, remote work, a reference)?

## Summary

- Negotiation: seeking a joint agreement better than no agreement.
- BATNA: the best alternative; reservation point: the limit still acceptable.
- ZOPA: where the parties' reservation points overlap.
- The first number acts as an anchor.
- Prepare with data, and know your own and the other party's alternatives.

## Exercise

```quiz required
? What does **BATNA** mean?
- the best possible outcome of the negotiation
+ the best alternative if no agreement is reached
- the other party's first offer
- the zone of joint agreement
! Best Alternative To a Negotiated Agreement.

? An intern asks for at least 400 thousand HUF gross, the company would pay at most 480 thousand. How many thousand HUF wide is the ZOPA?
= 80
! 480 − 400 = 80.

? The developer asks for at least 700 thousand, the client would pay at most 600 thousand. What is the situation?
- the ZOPA is 600–700 thousand
+ there is no ZOPA, no agreement is reached
- the ZOPA is 100 thousand wide
- the client's BATNA is 700 thousand
! The buyer's maximum is below the seller's minimum.

? What is **anchoring**?
+ the strong effect of the first number mentioned on the final outcome
- breaking off the negotiation
- keeping the reservation point secret
- putting the agreement in writing
! The first offer sets the starting point.
```
