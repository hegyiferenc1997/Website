import type { ReactNode } from "react";

// A 404 oldal tartalma. A link kívülről jön, mert a globális 404 nem használhatja a nyelvi Linket.
export function NotFoundContent({
  code,
  title,
  text,
  action,
}: {
  code: string;
  title: string;
  text: string;
  action: ReactNode;
}) {
  return (
    <div className="grid justify-items-start gap-4 py-10">
      <p className="font-mono text-sm text-highlight">{code}</p>
      <h1 className="text-3xl sm:text-4xl">{title}</h1>
      <p className="max-w-xl text-lg text-muted">{text}</p>
      {action}
    </div>
  );
}

export const backLinkClass =
  "inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 font-semibold text-accent-fg transition-opacity hover:opacity-90";
