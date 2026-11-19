---
title: Practice – Future IT Trends
summary: Review questions and a summary worksheet on AI, IoT, Industry 4.0, blockchain and green IT.
minutes: 20
kind: practice
---

## Review questions

<details>
<summary>1. A colleague pastes a client's entire contract into a free, public AI chatbot to summarise it. What is the problem, and what would be better?</summary>

Confidential data went to an unvetted external provider (trade secrets, personal data, GDPR). Better: a company-approved AI tool under an enterprise contract that doesn't train on the data – and the summary must be checked too.

</details>

<details>
<summary>2. Why isn't it worth using a blockchain for a company's internal stock records?</summary>

Because one party (the company) runs it and participants trust it – a traditional database is faster, cheaper and simpler. Blockchain is useful where several parties who don't trust each other share one ledger.

</details>

<details>
<summary>3. How can predictive maintenance help a factory?</summary>

From the machines' vibration, heat and power data a model predicts failures, so parts are replaced at a planned time, the line doesn't stop unexpectedly, and healthy parts aren't replaced needlessly.

</details>

```python run
# Simple “predictive maintenance”: does the moving average of vibration cross the threshold?
vibration = [2.1, 2.0, 2.3, 2.2, 2.6, 3.1, 3.4, 3.9, 4.4]
threshold = 3.5
for i in range(2, len(vibration)):
    avg = sum(vibration[i - 2:i + 1]) / 3
    state = "ALERT – maintenance needed" if avg > threshold else "ok"
    print(f"reading {i}, moving average {avg:.2f}: {state}")
```

## Summary worksheet

```quiz required
? Which is an example of **generative AI**?
- a filter that separates spam
+ a model that creates a new image from a description
- a thermometer
- a spreadsheet's SUM function
! A generative model creates new content.

? Which lightweight messaging protocol is widespread among IoT devices?
= MQTT
! Message Queuing Telemetry Transport.

? At which reading does the simulation above first raise an alert?
= 8
! At reading 7 the moving average (3.1 + 3.4 + 3.9) / 3 ≈ 3.47 is still below the threshold; at reading 8, (3.4 + 3.9 + 4.4) / 3 = 3.9 is above it.

? What does a large enough quantum computer threaten most?
+ today's public-key encryption (e.g. RSA)
- Wi-Fi speed
- hard disk capacity
- monitor resolution
! That is why quantum-safe encryption is needed.

? What does the EU AI Act do with **high-risk** AI systems (e.g. recruitment)?
- leaves them completely free
+ sets strict requirements for them
- only allows them in the USA
- makes them mandatory
! Risk-based regulation.

? Which one helps **green IT**?
+ shutting down idle cloud machines
- replacing every device every year
- slowing the code down
- more copies of all data, everywhere
! Unused resources consume energy too.
```
