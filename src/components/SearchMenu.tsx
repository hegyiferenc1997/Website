"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { search, type SearchItem } from "@/features/search/match";

// Egy találat linkje: tárgy oldalra vagy egyetem oldalra.
const hrefOf = (item: SearchItem) =>
  item.kind === "course"
    ? {
        pathname: "/universities/[university]/courses/[course]" as const,
        params: { university: item.university, course: item.course! },
      }
    : { pathname: "/universities/[university]" as const, params: { university: item.university } };

// Kereső a fejlécben: egyetemekre és tárgyakra, beírás közben azonnal szűr.
// Minden találatot megmutat (ha egy tárgy több egyetemen is van, mindegyiket külön sorban).
// Megnyitás: kattintás vagy Ctrl+K; nyilakkal lehet lépkedni, Enterrel megnyitni.
export function SearchMenu({ items }: { items: SearchItem[] }) {
  const t = useTranslations("Search");
  const router = useRouter();
  // Állapot: nyitva van-e, a beírt szöveg, és hányadik találat van kijelölve.
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const id = useId();

  // A találatok, előbb az egyetemek, aztán a tárgyak.
  const results = useMemo(() => search(items, query), [items, query]);
  const universities = results.filter((r) => r.kind === "university");
  const courses = results.filter((r) => r.kind === "course");
  // Billentyűs lépkedéshez ugyanabban a sorrendben, ahogy a listában látszanak.
  const ordered = [...universities, ...courses];

  // Bezárás és alaphelyzet.
  function close() {
    setOpen(false);
    setQuery("");
    setActive(0);
  }

  // Ctrl+K (Macen Cmd+K) bárhonnan megnyitja.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Bezárás Esc-re vagy a panelen kívüli kattintásra.
  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    function onClick(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) close();
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  // A kijelölt sor mindig látszódjon görgetéskor.
  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  // Billentyűk a keresőmezőben: ↑ / ↓ lépked, Enter megnyitja a kijelöltet.
  function onInputKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (ordered.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % ordered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i - 1 + ordered.length) % ordered.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = ordered[Math.min(active, ordered.length - 1)];
      close();
      router.push(hrefOf(item));
    }
  }

  // Egy találati csoport a listában, pl. „// Egyetemek (1)”.
  const group = (title: string, list: SearchItem[], offset: number) =>
    list.length > 0 && (
      <li role="group" aria-label={title}>
        <p aria-hidden="true" className="px-3 pt-3 pb-1 font-mono text-xs text-muted">
          <span className="text-accent">{"// "}</span>
          {title} ({list.length})
        </p>
        <ul role="presentation">
          {list.map((item, i) => {
            const index = offset + i;
            const selected = index === active;
            return (
              <li key={item.key} role="presentation">
                <Link
                  href={hrefOf(item)}
                  id={`${id}-opt-${index}`}
                  data-index={index}
                  role="option"
                  aria-selected={selected}
                  onClick={close}
                  onMouseMove={() => setActive(index)}
                  className={
                    "block rounded-md px-3 py-2 " +
                    (selected ? "bg-surface-hover text-fg" : "text-fg")
                  }
                >
                  <span className={"block font-semibold " + (selected ? "text-accent" : "")}>
                    {item.title}
                  </span>
                  <span className="block text-sm text-muted">{item.meta}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </li>
    );

  return (
    <div ref={rootRef} className="sm:relative">
      <button
        type="button"
        onClick={() => (open ? close() : setOpen(true))}
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        className={
          "inline-flex h-9 w-9 items-center justify-center gap-2 rounded-md border text-sm transition-colors md:w-auto md:px-2.5 " +
          (open
            ? "border-accent bg-accent-soft text-accent"
            : "border-line text-muted hover:bg-surface-hover hover:text-fg")
        }
      >
        <SearchIcon />
        <span className="sr-only md:not-sr-only">{t("open")}</span>
        <kbd className="hidden rounded border border-line px-1.5 font-mono text-[11px] lg:inline">
          Ctrl+K
        </kbd>
      </button>

      {open && (
        <div
          id={`${id}-panel`}
          role="dialog"
          aria-label={t("open")}
          className="absolute inset-x-4 top-full z-30 mt-2 overflow-hidden rounded-lg border border-line bg-surface shadow-2xl shadow-black/40 sm:inset-x-auto sm:right-0 sm:w-[28rem]"
        >
          <div className="flex items-center gap-2 border-b border-line px-3 text-muted">
            <SearchIcon />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
              onKeyDown={onInputKey}
              placeholder={t("placeholder")}
              aria-label={t("placeholder")}
              role="combobox"
              aria-expanded={ordered.length > 0}
              aria-controls={`${id}-list`}
              aria-activedescendant={ordered.length > 0 ? `${id}-opt-${active}` : undefined}
              autoComplete="off"
              spellCheck={false}
              className="w-full bg-transparent py-3 text-fg outline-none placeholder:text-muted"
            />
          </div>

          {query.trim() === "" ? (
            <p className="px-4 py-4 text-sm text-muted">{t("hint")}</p>
          ) : ordered.length === 0 ? (
            <p className="px-4 py-4 text-sm text-muted">
              {t("noResults", { query: query.trim() })}
            </p>
          ) : (
            <ul
              ref={listRef}
              id={`${id}-list`}
              role="listbox"
              className="max-h-[min(60vh,28rem)] overflow-y-auto px-1 pb-2"
            >
              {group(t("universities"), universities, 0)}
              {group(t("courses"), courses, universities.length)}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

// Nagyító ikon (SVG).
function SearchIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
      className="shrink-0"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}
