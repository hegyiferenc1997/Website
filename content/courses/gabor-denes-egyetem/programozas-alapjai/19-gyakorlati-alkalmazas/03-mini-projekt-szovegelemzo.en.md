---
title: Mini Project 2 – Text Analyser
summary: Text processing with functions, regular expressions, Counter, CSV export and error handling.
minutes: 40
kind: practice
---

## The goal of the project

Write a program that produces statistics about a text (or a text file). This project practises **string handling** (topic 4), **functions** (8), **data structures** (10: list, set, dictionary), **functional tools** (`map`, `sorted` + `key`), **file handling** (13) and **error handling** (12). Unlike the first, class-based project, here we build from **plain functions**.

## Requirements

1. `words(text)`: the words of the text **in lower case**, without punctuation.
2. `sentence_count(text)`: the number of non-empty sentences ended by `.`, `!` or `?`.
3. `most_common(text, n=3)`: the _n_ most frequent **meaningful** words (without stopwords – _a, the, and, is…_), as `(word, count)` pairs, alphabetical for equal counts.
4. `statistics(text)`: a dictionary with the number of words, the number of unique words, the number of sentences, the average word length (0.0 for empty text) and the most common words.
5. `export_csv(text, file)`: the full word frequency to CSV (with a `word;count` header, in descending order).
6. `analyse_file(path)`: analyse a text file; a clear `FileNotFoundError` for a missing file.

## Tips

- The simplest way to split into words is a regular expression: `re.findall(r"\w+", text.lower())` – `\w` also recognises accented letters.
- For counting, `collections.Counter` is the most convenient.
- Sorting by several criteria: `sorted(pairs, key=lambda p: (-p[1], p[0]))` – thanks to the minus sign the count is descending and the word ascending.
- Watch out for empty text when averaging (division by zero!).

```python starter
"""Text analyser."""
import csv
import re
from collections import Counter
from pathlib import Path

STOPWORDS = {"a", "an", "the", "and", "is", "are", "to", "of", "it", "for"}

def words(text: str) -> list[str]: ...
def sentence_count(text: str) -> int: ...
def most_common(text: str, n: int = 3) -> list[tuple[str, int]]: ...
def statistics(text: str) -> dict: ...
def export_csv(text: str, file: Path) -> None: ...
def analyse_file(path: Path) -> dict: ...
```

<details>
<summary>Solution</summary>

```python solution
"""Text analyser: word and sentence statistics, most frequent words, CSV export."""
import csv
import re
from collections import Counter
from pathlib import Path

# Common, low-information words left out of the frequency list.
STOPWORDS = {"a", "an", "the", "and", "is", "are", "to", "of", "it", "for"}


def words(text: str) -> list[str]:
    """The words of the text in lower case, without punctuation (numbers count as words)."""
    return re.findall(r"\w+", text.lower())


def sentence_count(text: str) -> int:
    """Number of sentences: non-empty parts ended by . ! ?"""
    return len([s for s in re.split(r"[.!?]+", text) if s.strip()])


def most_common(text: str, n: int = 3) -> list[tuple[str, int]]:
    """The n most frequent meaningful words; equal counts in alphabetical order."""
    counter = Counter(w for w in words(text) if w not in STOPWORDS)
    return sorted(counter.items(), key=lambda pair: (-pair[1], pair[0]))[:n]


def statistics(text: str) -> dict:
    """All metrics in one dictionary."""
    items = words(text)
    return {
        "words": len(items),
        "unique": len(set(items)),
        "sentences": sentence_count(text),
        "average_length": round(sum(map(len, items)) / len(items), 2) if items else 0.0,
        "most_common": most_common(text),
    }


def export_csv(text: str, file: Path) -> None:
    """Save the full word frequency to CSV (word;count), in descending order."""
    counter = Counter(words(text))
    with file.open("w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f, delimiter=";")
        writer.writerow(["word", "count"])
        for word, count in sorted(counter.items(), key=lambda pair: (-pair[1], pair[0])):
            writer.writerow([word, count])


def analyse_file(path: Path) -> dict:
    """Analyse a text file; a clear error message for a missing file."""
    try:
        return statistics(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        raise FileNotFoundError(f"File not found: {path}") from None


if __name__ == "__main__":
    sample = ("Python is a popular language. Python is easy to read! "
              "Is Python a good language for beginners and pros? Yes.")
    for key, value in statistics(sample).items():
        print(f"{key:>14}: {value}")

    Path("sample.txt").write_text(sample, encoding="utf-8")
    print("From file:", analyse_file(Path("sample.txt"))["words"], "words")
    export_csv(sample, Path("frequency.csv"))
    print(Path("frequency.csv").read_text(encoding="utf-8").splitlines()[:3])
```

</details>

```python test
import tempfile

assert words("Hello, World! Hello.") == ["hello", "world", "hello"]
assert sentence_count("One. Two! Three? ") == 3
assert sentence_count("") == 0
assert most_common("apple pear apple plum pear apple", 2) == [("apple", 3), ("pear", 2)]
assert most_common("the the the a and dog", 1) == [("dog", 1)]   # without stopwords
s = statistics("This is a test. This test works!")
assert s["words"] == 7 and s["unique"] == 5 and s["sentences"] == 2
assert statistics("")["average_length"] == 0.0
with tempfile.TemporaryDirectory() as folder:
    file = Path(folder) / "out.csv"
    export_csv("b a b", file)
    assert file.read_text(encoding="utf-8").splitlines() == ["word;count", "b;2", "a;1"]
    try:
        analyse_file(Path(folder) / "missing.txt")
        assert False, "Expected FileNotFoundError"
    except FileNotFoundError as error:
        assert "missing.txt" in str(error)
print("All checks passed!")
```

## Extension ideas

- **Command-line use** with `argparse`: `python analyser.py text.txt --top 10 --csv out.csv`.
- The **longest word**, the **longest sentence**, the **length distribution** of words (how many 1-, 2-, 3-letter words there are).
- Simple **stemming**: cutting off common suffixes (-s, -ing, -ed) so that "language" and "languages" count as one word.
- **Comparing** two texts: common words with a set operation (`&`).
