"use client";

// Még az oldal kirajzolása előtt visszaállítja a mentett témát, így nincs villanás.
// A szerver futtatható szkriptként küldi, a böngészőben a React már csak szövegként látja
// (type="text/plain"), így nem jelez hibát, hogy szkriptet renderel. Lásd a Next.js
// "Preventing flash before hydration" útmutatóját.
const script = `(function(){try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}})()`;

export function ThemeScript() {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: script }}
    />
  );
}
