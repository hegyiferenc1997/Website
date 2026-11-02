"use client";

import { useMemo, type KeyboardEvent } from "react";
import { highlightPython } from "./highlight";

// Könnyű kódszerkesztő: egy átlátszó szövegdoboz (textarea) a színezett kód fölött.
// Nem kell hozzá külső könyvtár, ezért azonnal betölt. Tudja: Tab = behúzás (több sorra is),
// Shift+Tab = behúzás csökkentése, Enter = a behúzás megtartása (kettőspont után eggyel beljebb),
// Ctrl+Enter = futtatás, Esc = kilépés a szerkesztőből (utána a Tab már a következő gombra visz).

const INDENT = "    ";

/** A szerkesztő. A magassága mindig akkora, mint a kód (nincs belső görgetősáv függőlegesen). */
export function CodeEditor({
  value,
  onChange,
  onRun,
  onFocus,
  label,
  readOnly = false,
}: {
  value: string;
  onChange: (value: string) => void;
  /** Ctrl+Enter (Macen Cmd+Enter) lenyomásakor. */
  onRun?: () => void;
  onFocus?: () => void;
  /** Akadálymentes név (képernyőolvasóknak). */
  label: string;
  readOnly?: boolean;
}) {
  const html = useMemo(() => highlightPython(value), [value]);
  const lineCount = value.split("\n").length;

  // A szövegdoboz tartalmának cseréje úgy, hogy a visszavonás (Ctrl+Z) is működjön, ahol lehet.
  function replace(el: HTMLTextAreaElement, start: number, end: number, text: string) {
    el.setSelectionRange(start, end);
    // Az execCommand régi, de ez az egyetlen mód, hogy a böngésző visszavonási listájába kerüljön.
    if (!document.execCommand?.("insertText", false, text)) {
      el.setRangeText(text, start, end, "end");
      onChange(el.value);
    }
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    const el = e.currentTarget;
    const { selectionStart: start, selectionEnd: end, value: text } = el;

    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      onRun?.();
      return;
    }
    if (e.key === "Escape") {
      el.blur();
      return;
    }
    if (readOnly) return;

    if (e.key === "Tab") {
      e.preventDefault();
      const lineStart = text.lastIndexOf("\n", start - 1) + 1;
      // Egy soron belül, kijelölés nélkül: négy szóköz beszúrása.
      if (!e.shiftKey && start === end) {
        replace(el, start, end, INDENT);
        return;
      }
      // Több sor (vagy Shift+Tab): a kijelölt sorok behúzása / kihúzása.
      const block = text.slice(lineStart, end);
      const lines = block.split("\n");
      const changed = lines.map((line) =>
        e.shiftKey ? line.replace(/^ {1,4}/, "") : INDENT + line,
      );
      const firstDelta = changed[0].length - lines[0].length;
      replace(el, lineStart, end, changed.join("\n"));
      const totalDelta = changed.join("\n").length - block.length;
      el.setSelectionRange(Math.max(lineStart, start + firstDelta), end + totalDelta);
      return;
    }

    if (e.key === "Enter" && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      const lineStart = text.lastIndexOf("\n", start - 1) + 1;
      const line = text.slice(lineStart, start);
      let indent = /^ */.exec(line)![0];
      // Kettőspont után (if, for, def, …) eggyel beljebb kezdjük a következő sort.
      if (/:\s*(#.*)?$/.test(line)) indent += INDENT;
      replace(el, start, end, "\n" + indent);
      return;
    }

    // Backspace a behúzásban: egyszerre egy teljes behúzási szintet töröl.
    if (e.key === "Backspace" && start === end && start > 0) {
      const lineStart = text.lastIndexOf("\n", start - 1) + 1;
      const before = text.slice(lineStart, start);
      if (before.length > 0 && /^ +$/.test(before)) {
        e.preventDefault();
        const remove = before.length % 4 || 4;
        replace(el, start - remove, start, "");
      }
    }
  }

  return (
    <div className="code-editor">
      {/* Sorszámok */}
      <div className="code-editor-gutter" aria-hidden="true">
        {Array.from({ length: lineCount }, (_, i) => (
          <span key={i}>{i + 1}</span>
        ))}
      </div>
      <div className="code-editor-scroll">
        <div className="code-editor-stack">
          <pre aria-hidden="true" dangerouslySetInnerHTML={{ __html: html }} />
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            onFocus={onFocus}
            readOnly={readOnly}
            aria-label={label}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            wrap="off"
            rows={lineCount}
          />
        </div>
      </div>
    </div>
  );
}
