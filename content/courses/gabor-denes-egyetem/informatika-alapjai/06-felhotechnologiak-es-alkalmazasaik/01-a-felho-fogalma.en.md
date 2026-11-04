---
title: The Cloud and Its Models
summary: What the cloud is, IaaS, PaaS, SaaS, public, private and hybrid cloud, benefits and risks.
minutes: 16
---

## What you will learn

- what **cloud computing** means,
- the difference between **IaaS**, **PaaS** and **SaaS**,
- what **public**, **private** and **hybrid** clouds are, and their benefits and risks.

## What is the cloud?

**The cloud** means that you **don't run** computing capacity, storage or software **on your own machine**, but in a provider's data centre, and use it **over the internet**, **on demand**, **paying for what you use**. It's like electricity: you don't build a power plant, you plug in and pay for consumption.

The largest providers: **Amazon Web Services (AWS)**, **Microsoft Azure**, **Google Cloud**.

## Service models

The higher we go, the more the provider handles and the less we have to manage.

```text
                 own machine IaaS        PaaS        SaaS
 application        YOU       YOU         YOU       provider
 data               YOU       YOU         YOU       provider*
 runtime            YOU       YOU       provider    provider
 operating system   YOU       YOU       provider    provider
 virtualisation     YOU     provider    provider    provider
 hardware, network  YOU     provider    provider    provider
```

\* the data is yours, but the provider stores it.

| Model    | What you get                              | Example                             |
| -------- | ----------------------------------------- | ----------------------------------- |
| **IaaS** | virtual machines, storage, networking     | AWS EC2, Azure Virtual Machines     |
| **PaaS** | a ready runtime: you only upload the code | Heroku, Vercel, Google App Engine   |
| **SaaS** | ready software used from the browser      | Gmail, Microsoft 365, Canva, Trello |

## Deployment models

- **Public cloud**: the provider's infrastructure is shared by many customers (AWS, Azure).
- **Private cloud**: belongs to one organisation only, in its own data centre or isolated.
- **Hybrid cloud**: a combination; e.g. sensitive data on premises, the web part in a public cloud.

## Benefits and risks

| Benefit                                  | Risk                                              |
| ---------------------------------------- | ------------------------------------------------- |
| no large upfront investment              | the monthly fee can add up in the long run        |
| **scalable**: more machines in minutes   | dependence on the provider (**vendor lock-in**)   |
| reachable from anywhere                  | doesn't work without internet                     |
| the provider handles backups and updates | data protection: where is the data stored (GDPR)? |

## Summary

- Cloud = IT resources over the internet, on demand, pay as you go.
- IaaS: virtual machines; PaaS: runtime; SaaS: ready software.
- Public, private, hybrid cloud; the main risks are lock-in and data protection.

## Exercise

```quiz required
? Which service model does Gmail belong to?
- IaaS
- PaaS
+ SaaS
! Ready software used from the browser.

? In which model do you rent a **virtual machine** and install the operating system yourself?
+ IaaS
- PaaS
- SaaS
! Infrastructure as a Service.

? What is a cloud called that combines public and private parts?
= hybrid
= hybrid cloud
! E.g. sensitive data on premises, the website in the public cloud.

? What does **vendor lock-in** mean?
- the provider locks your account
+ moving to another provider is hard and expensive
- the cloud is only available in one country
- the software can't be updated
! A system built on one provider's own services is hard to move elsewhere.
```
