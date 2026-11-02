import type { ReactNode } from "react";

// Keretes üzenet a zárolt (meg nem vásárolt) tananyag helyén: lakat, cím, magyarázat és a vásárlás gomb.

/** A zárolás üzenete; a children helyére kerül a vásárlás gomb (és esetleg egy link). */
export function LockedNotice({
  title,
  text,
  children,
}: {
  title: string;
  text: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-4 rounded-lg border border-dashed border-accent/50 bg-surface p-6">
      <div className="grid gap-1.5">
        <p className="font-mono text-lg text-highlight">🔒 {title}</p>
        <p className="max-w-2xl text-muted">{text}</p>
      </div>
      <div className="flex flex-wrap items-center gap-4">{children}</div>
    </div>
  );
}
