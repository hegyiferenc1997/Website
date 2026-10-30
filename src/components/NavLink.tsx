"use client";

import type { ComponentProps } from "react";
import { Link, usePathname } from "@/i18n/navigation";

type Props = ComponentProps<typeof Link> & { href: "/" | "/universities" };

// Menüpont, ami kiemelve látszik, ha azon az oldalon (vagy alatta) vagyunk.
export function NavLink({ href, children, ...rest }: Props) {
  const pathname = usePathname();
  const active = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={
        "rounded-md px-3 py-1.5 text-[15px] transition-colors " +
        (active
          ? "bg-accent-soft font-semibold text-accent"
          : "text-muted hover:bg-surface-hover hover:text-fg")
      }
      {...rest}
    >
      {children}
    </Link>
  );
}
