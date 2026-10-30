import type { ReactNode } from "react";

// Kis, újrahasznosítható építőelemek az oldalakhoz.

/** Oldal tetején álló cím, opcionális felirattal fölötte és leírással alatta. */
export function PageHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="grid gap-3">
      {eyebrow && <div className="text-sm text-muted">{eyebrow}</div>}
      <h1 className="text-3xl leading-tight sm:text-4xl">{title}</h1>
      {children && <div className="max-w-2xl text-lg text-muted">{children}</div>}
    </div>
  );
}

/** Szakaszcím: kis, monospace, „// cím” formában. */
export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-mono text-sm font-medium tracking-normal text-muted">
      <span className="text-accent">{"// "}</span>
      {children}
    </h2>
  );
}

/** Keretes doboz tartalomnak. */
export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={"rounded-lg border border-line bg-surface p-5 " + className}>{children}</div>
  );
}

/** Adat-címke, pl. „Kredit 5”. */
export function Chip({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-line bg-surface px-2.5 py-1 font-mono text-xs text-muted">
      {label} <span className="text-fg">{children}</span>
    </span>
  );
}

/** Üres állapot üzenet. */
export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-lg border border-dashed border-line px-5 py-6 text-muted">{children}</p>
  );
}

/** Kattintható kártya-tartalom: cím, alatta kisebb szöveg, jobbra nyíl. A linket a hívó adja köré. */
export function LinkCardBody({ title, meta }: { title: ReactNode; meta?: ReactNode }) {
  return (
    <span className="flex h-full items-start justify-between gap-4 rounded-lg border border-line bg-surface p-5 transition-colors group-hover:border-accent group-hover:bg-surface-hover">
      <span className="grid gap-1.5">
        <span className="font-mono text-base font-bold text-fg">{title}</span>
        {meta && <span className="text-sm text-muted">{meta}</span>}
      </span>
      <span
        aria-hidden="true"
        className="font-mono text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-accent"
      >
        →
      </span>
    </span>
  );
}
