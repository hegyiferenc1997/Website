---
title: Practice – User Experience and Design
summary: Review questions, a mini design task and a summary worksheet on UX, accessibility and the design process.
minutes: 22
kind: practice
---

## Review questions

<details>
<summary>1. In a web shop the “Add to cart” button is grey and small, next to the “Wishlist” button, which is the same size and bright orange. What is the problem?</summary>

The visual hierarchy is wrong: the main action (Add to cart) should be the most prominent. The secondary action (Wishlist) should be fainter.

</details>

<details>
<summary>2. How do you make a custom “button” that is really a `<div>` usable with the keyboard?</summary>

Best is to use a real `<button>` element: it is focusable by default, works with Enter and Space, and screen readers announce it as a button.

</details>

<details>
<summary>3. Why isn't it enough for the development team to test the interface's usability themselves?</summary>

Because they already know the system and the jargon; they don't see what is confusing for a new user. Real target users are needed.

</details>

**Mini design task:** draw a paper wireframe of a university “My classes today” mobile screen! It should have one clear main piece of information (the next class), a list of the day's classes, and a button for the weekly view. Then ask a classmate to “think aloud” while finding the room of your Thursday lab on it.

## Summary worksheet

```quiz required
? Which is part of UX and not UI?
- the font
- the icon style
+ whether the user finds the pay button the first time
- the background colour
! UX is the whole experience.

? What does the O stand for in WCAG's POUR principles?
+ Operable – e.g. with the keyboard too
- Optimised
- Online
- Optional
! Perceivable, Operable, Understandable, Robust.

? What is the invented but research-based typical user called in design?
= persona
! E.g. “Kata, 19, first-year student”.

? In which test does half the users see one version and the other half another, in production?
- usability test
+ A/B test
- unit test
- stress test
! Then they measure which gives better results.

? Which of Nielsen's heuristics does a date picker violate that lets you choose 30 February?
- help and documentation
+ error prevention
- flexibility
- aesthetic, minimalist
! A good interface doesn't even allow the error.

? Which popular browser-based tool is used to make wireframes and prototypes?
= Figma
! With co-editing, a favourite of design teams.
```
