---
title: Design Principles and Accessibility
summary: Nielsen's ten heuristics in brief, visual hierarchy, contrast and colour, consistency, WCAG basics.
minutes: 18
---

## What you will learn

- the most important **principles** of a good interface (Nielsen's heuristics),
- **visual hierarchy**, **contrast** and **consistency**,
- what **accessibility** is and what **WCAG** asks for.

## Nielsen's ten heuristics (in brief)

1. **Visibility of system status** – progress indicators, a “Saved” label.
2. **Match with the real world** – the user's words, not the programmer's (“Cart”, not “Order entity”).
3. **User control and freedom** – provide “Back” and “Undo”.
4. **Consistency and standards** – the same thing looks and works the same everywhere.
5. **Error prevention** – e.g. the date picker doesn't allow 30 February.
6. **Recognition rather than recall** – show the options; don't make users remember.
7. **Flexibility** – shortcuts for advanced users.
8. **Aesthetic, minimalist** – only what is needed; every extra element distracts.
9. **Help recognise and recover from errors** – understandable messages with a solution.
10. **Help and documentation** – searchable, short, tied to the task.

## Visual hierarchy

The eye sees **large**, **high-contrast**, **highlighted** elements first. A page should have **one main action** (e.g. “Sign up”), and that should be the most prominent button; secondary actions are fainter. Group content by **proximity**: what belongs together should be close together; and leave enough **white space**.

## Colour and contrast

- Text and background need enough **contrast**: per WCAG at least **4.5 : 1** for normal text, 3 : 1 for large text.
- **Don't rely on colour alone**: mark a wrong field with a red border **and** a text message (about 8% of men have some colour vision deficiency).
- Few, consistent colours: one main (brand) colour, one accent, neutral greys, and separate colours for success and error.

## Accessibility

**Accessibility** (a11y) means **everyone** can use the product: blind and low-vision users (with screen readers), people with motor impairments (keyboard only), deaf users (with captions), older people, and anyone in bad conditions (in sunlight, one-handed). In the EU, under the **European Accessibility Act**, many digital services (e.g. web shops, banking apps) must be accessible from June 2025.

The four principles of **WCAG** (Web Content Accessibility Guidelines) – **POUR**:

| Principle          | Example                                                       |
| ------------------ | ------------------------------------------------------------- |
| **perceivable**    | images have a text description (`alt`), videos have captions  |
| **operable**       | everything works with the keyboard too, focus is visible      |
| **understandable** | plain language, predictable behaviour, helpful error messages |
| **robust**         | standard HTML, so screen readers can interpret it             |

```html
<!-- Bad: the screen reader only says “image” -->
<img src="chart.png" />
<!-- Good: describes what the image shows -->
<img src="chart.png" alt="Visitors doubled from January to June" />
<!-- Good: a real button with a label; works with the keyboard too -->
<button type="submit">Sign up</button>
```

## Summary

- Nielsen's heuristics: visible status, real-world language, undo, consistency, error prevention…
- Visual hierarchy: one main action, grouping, white space; contrast at least 4.5 : 1; don't rely on colour alone.
- Accessibility: WCAG POUR principles – perceivable, operable, understandable, robust.

## Exercise

```quiz required
? Which of Nielsen's heuristics does a progress bar illustrate?
+ visibility of system status
- aesthetic, minimalist
- help and documentation
- flexibility
! The user sees that something is happening.

? What is the minimum contrast ratio WCAG asks for normal-size text? (Write it like: 4.5)
= 4.5
= 4.5:1
! 4.5 : 1.

? Why is it a mistake if a form marks the wrong field only with red colour?
- Because red is ugly.
+ Because colour-blind users can't see the difference – a text message is needed too.
- Because red slows the page down.
- It isn't a mistake.
! Don't rely on colour alone.

? Which HTML attribute gives an image's text description for screen readers?
= alt
! <img alt="…">
```
