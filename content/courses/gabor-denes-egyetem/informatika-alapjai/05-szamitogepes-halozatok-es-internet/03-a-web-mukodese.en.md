---
title: How the Web Works
summary: URL, client and server, HTTP request and response, status codes, HTTPS and the browser's steps.
minutes: 16
---

## What you will learn

- what a **URL** consists of,
- what happens when you type an address into the browser,
- what an **HTTP** request, response and **status code** are, and what makes **HTTPS** secure.

## Internet and web

The **internet** is the network (cables, routers, protocols). The **web** (World Wide Web, Tim Berners-Lee, 1989) is a service on the internet: linked pages that the browser downloads over HTTP. E-mail, video calls and online games also run on the internet, but they are not “the web”.

## Parts of a URL

```text
https://www.example.com:443/courses/math?term=1#topic-2
└─┬─┘   └──────┬──────┘└┬┘└────┬─────┘└──┬───┘└──┬───┘
scheme      domain     port   path      query   fragment
```

## What happens after you type an address?

1. The browser asks **DNS** for the domain's IP address.
2. It opens a **TCP** connection to the server's port 443 and encrypts it with **TLS**.
3. It sends an **HTTP request**: `GET /courses/math`.
4. The server sends a **response**: status code + headers + content (HTML).
5. The browser parses the HTML, downloads the CSS, JavaScript and images, and **renders** the page.

## HTTP request and response

```text
GET /courses/math HTTP/1.1           ← method, path
Host: www.example.com
Accept-Language: en

HTTP/1.1 200 OK                      ← status code
Content-Type: text/html; charset=utf-8

<!doctype html><html>…</html>
```

Common **methods**: `GET` (fetch), `POST` (send data, e.g. a form), `PUT`/`PATCH` (modify), `DELETE` (delete).

| Status code | Meaning                   |
| ----------- | ------------------------- |
| 200         | OK, all fine              |
| 301 / 302   | redirect elsewhere        |
| 403         | forbidden (no permission) |
| 404         | not found                 |
| 500         | internal server error     |

Rule: **2xx** success, **3xx** redirect, **4xx** client error, **5xx** server error.

## HTTPS

**HTTPS** = HTTP + **TLS** encryption. It gives two things: nobody can read or modify the data on the way (e.g. on public Wi-Fi), and the server proves with a **certificate** that it really is `example.com`. Only enter passwords or card numbers on HTTPS pages – but the padlock alone doesn't mean the site is honest, only that the connection is encrypted.

## The three languages of the web

- **HTML**: content and structure (headings, paragraphs, images, links),
- **CSS**: appearance (colour, font, layout),
- **JavaScript**: behaviour (things that happen on click, dynamic content).

## Summary

- Internet = the network; web = linked pages on the internet reached over HTTP.
- URL: scheme, domain, port, path, query, fragment.
- HTTP request (GET, POST…) → response with a status code; HTTPS = HTTP + TLS.

## Exercise

```quiz required
? Which HTTP status code means the requested page was **not found**?
= 404
! 4xx: client error.

? Which HTTP method does a login form use to send data to the server?
- GET
+ POST
- DELETE
- HEAD
! POST sends data in the request body.

? In the URL `https://www.pelda.hu/targyak?felev=1`, what is the **domain**?
= www.pelda.hu
! The scheme is https, the path /targyak, the query felev=1.

? Which language is responsible for a web page's **appearance** (colour, font, layout)?
- HTML
+ CSS
- JavaScript
- HTTP
! HTML = structure, CSS = appearance, JS = behaviour.
```
