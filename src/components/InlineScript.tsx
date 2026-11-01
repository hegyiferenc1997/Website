"use client";

// Kirajzolás előtt futó, kis beágyazott szkript (a ThemeScript mintájára): a szerver
// futtatható szkriptként küldi, a böngésző React-je már csak szövegként látja.
export function InlineScript({ code }: { code: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: code }}
    />
  );
}
