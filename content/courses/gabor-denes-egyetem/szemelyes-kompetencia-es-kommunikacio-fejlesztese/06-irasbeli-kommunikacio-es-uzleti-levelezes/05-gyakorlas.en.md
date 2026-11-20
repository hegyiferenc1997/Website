---
title: Practice – Written Communication
summary: Review questions and a summary worksheet on business email, business documents and technical documentation.
minutes: 50
kind: practice
---

## Review questions

<details>
<summary>1. Fix this email: subject: "question", text: "hello, I'd like to ask about the assignment because I don't get it, thx"</summary>

Subject: "Question: submission format of the database module assignment"

"Dear Ms Toth,

I'd like to ask about the database module assignment: should the queries be submitted in a separate .sql file or as part of the documentation?

Thank you for your help!

Best regards,
Ben Kiss (Computer Engineering BSc, 1st year)"

</details>

<details>
<summary>2. What is the difference between Cc and Bcc?</summary>

Addresses in the Cc field are visible to every recipient, and it is used for information. Bcc recipients are hidden from the others – with many external recipients this protects their addresses.

</details>

<details>
<summary>3. Why send meeting notes within 24 hours?</summary>

Because everyone still remembers, and if someone understood a decision differently they can say so immediately. Later, different memories set in and it becomes harder to clarify.

</details>

<details>
<summary>4. Rewrite using the pyramid principle: "We examined three hosting providers: A is expensive, B is slow, C is reasonably priced and fast. So we recommend C."</summary>

"We recommend provider C, because of the three examined it has the best price-performance ratio. A was more expensive (monthly fee), B was slower (measured response time)."

</details>

## Summary worksheet

```quiz required
? You want to ask three different people about three different topics. What is best?
- one long email to all three, in one paragraph
+ a separate email per topic to the right recipient
- one chat message in the team channel
- one email to everyone in Bcc
! One email – one topic.

? Which email closing is appropriate in a formal letter to a company you don't know?
- "Cheers mate!"
- "Waiting for it!"
+ "Best regards," + full name and contact details
- no closing
! Polite, with a full signature.

? In a weekly status report the project is slipping and a management decision is needed. What colour does it get on the "traffic light"?
- green
- amber
+ red
- blue
! Red: slipping, intervention needed.

? Which element does **not** belong in a good bug report?
- environment (browser, version)
- reproducible steps
- expected and actual result
+ blaming the developer who caused the bug
! A bug report records facts, it doesn't look for a culprit.

? How many pages are recommended for a graduate CV?
= 1
! One well-structured page.
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **LIX readability index.** Write the function `lix(text)` (to 1 decimal): words/sentences + 100 · long words/words, where a long word has at least 7 letters! Split words with `re.findall(r"\w+", ...)` and sentences along `.`, `!`, `?` (skip empty pieces).

```python starter
import re

def lix(text):
    words = re.findall(r"\w+", text)
    long = [w for w in words if len(w) > 7]
    return round(len(words) + 100 * len(long) / len(words), 1)
```

<details>
<summary>Solution</summary>

```python solution
import re

def lix(text):
    words = re.findall(r"\w+", text)
    sentences = [s for s in re.split(r"[.!?]+", text) if s.strip()]   # without empty pieces
    long = [w for w in words if len(w) >= 7]
    return round(len(words) / len(sentences) + 100 * len(long) / len(words), 1)
```

</details>

```python test
assert lix("Maintenance happens on Saturday. Everything works again by noon.") == 48.9
assert lix("This is a small test. Here is one more.") == 4.5
assert lix("Short sentence!") == 52.0
print("All checks passed!")
```

**2.** **Good subject line?** Write the function `good_subject(subject)`: `True` if the subject line has at least 3 words, contains no exclamation mark, and isn't all capitals!

```python starter
def good_subject(subject):
    return len(subject.split()) >= 3
```

<details>
<summary>Solution</summary>

```python solution
def good_subject(subject):
    long_enough = len(subject.split()) >= 3
    not_shouting = "!" not in subject and not subject.isupper()   # no exclamation mark, not all caps
    return long_enough and not_shouting
```

</details>

```python test
assert good_subject("Approval needed: API docs v2, by Thursday") is True
assert good_subject("Question") is False
assert good_subject("Important, very urgent request!!!") is False
assert good_subject("VERY IMPORTANT THING NOW") is False
print("All checks passed!")
```

**3.** **Commit message.** Write the function `conventional(message)`, which returns `True` if the message has the form `type(scope): description` or `type: description`, where the type is `feat`, `fix`, `docs`, `refactor`, `test` or `chore`, the scope consists of lowercase letters, digits and hyphens, and the description is 3–72 characters!

```python starter
def conventional(message):
    return ":" in message
```

<details>
<summary>Solution</summary>

```python solution
import re

PATTERN = re.compile(r"^(feat|fix|docs|refactor|test|chore)(\([a-z0-9-]+\))?: .{3,72}$")

def conventional(message):
    return bool(PATTERN.match(message))
```

</details>

```python test
assert conventional("fix(login): no 500 error for an empty email") is True
assert conventional("docs: update README") is True
assert conventional("Fix: something") is False
assert conventional("fixes") is False
assert conventional("feat(Booking): new feature") is False
print("All checks passed!")
```

### Quick check questions

```quiz
? What is the essence of the pyramid principle in business writing?
+ the main point (conclusion, request) first, then the support
- chronological order, with the conclusion at the end
- the longest possible introduction
- the request in the P.S.
! The recipient knows from the first sentences what they need to do.

? A text has 60 words and 5 sentences, 18 of them long words. What is its LIX value?
= 42
! $60/5 + 100 \cdot 18/60 = 12 + 30 = 42$.

? When should you use "Blind carbon copy" (Bcc)?
- when you want to involve someone without your boss knowing
+ when you write to many recipients who don't know each other, and their email addresses need protecting
- in every email
- never
! That way recipients can't see each other's addresses.

? What belongs in a good bug report?
- just "it doesn't work"
+ the steps to reproduce the bug, the expected and actual behaviour, the environment
- the name of the colleague at fault
- the full source code
! That way the bug can be reproduced and fixed.
```
