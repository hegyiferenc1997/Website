"use client";

import { useEffect, useRef } from "react";

/*
 * Mátrix-szerű, halványan hulló karakterek a főoldal hátterében.
 * - Egyetlen <canvas>, a tartalom mögött; nem kattintható, a képernyőolvasó nem látja.
 * - A szín mindig a téma kiemelőszíne (--accent), témaváltáskor azonnal követi.
 * - Kímélő: ~20 képkocka/mp, a kirajzolás csak az oldal betöltése után indul,
 *   rejtett fülön megáll, "kevesebb mozgás" beállításnál egy álló kép marad.
 * - Nincs villanás: az üres vászon átlátszó, és lassan úszik be.
 */

const CHARS =
  "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワン" +
  "0123456789ABCDEF{}[]<>()/=+*;:#&|";
const FONT_SIZE = 16; // px, egy oszlop szélessége is ennyi
const FRAME_MS = 50; // ~20 képkocka/mp
const TRAIL_FADE = 0.09; // milyen gyorsan halványul a csík (nagyobb = rövidebb csík)

// A komponens csak egy <canvas>-t ad vissza; minden rajzolás a useEffect-ben, a böngészőben történik.
export function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const root = document.documentElement;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let color = "";
    let font = "";
    let width = 0;
    let height = 0;
    let drops: number[] = []; // oszloponként a "fej" sora
    let speeds: number[] = []; // oszloponként sor / képkocka
    let raf = 0;
    let last = 0;
    let started = false;

    const randomChar = () => CHARS[(Math.random() * CHARS.length) | 0];

    // A téma kiemelőszínének és betűtípusának kiolvasása a CSS változókból.
    const readTheme = () => {
      const style = getComputedStyle(root);
      color = style.getPropertyValue("--accent").trim() || "#3cc4a8";
      const family = style.getPropertyValue("--font-jetbrains-mono").trim();
      font = `${FONT_SIZE}px ${family ? `${family}, ` : ""}ui-monospace, monospace`;
    };

    // A vászon méretének igazítása az ablakhoz (éles kijelzőn nagyobb felbontással).
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const columns = Math.ceil(width / FONT_SIZE);
      const rows = height / FONT_SIZE;
      // A meglévő oszlopok maradnak, csak az újak kapnak véletlen helyet (rögtön teli kép, nem üres sáv).
      for (let i = drops.length; i < columns; i++) {
        drops[i] = Math.random() * rows * 1.5 - rows * 0.5;
        speeds[i] = 0.35 + Math.random() * 0.45;
      }
      drops = drops.slice(0, columns);
      speeds = speeds.slice(0, columns);
    };

    // Egy animációs lépés: a régi karakterek halványítása, majd új karakterek az oszlopokba.
    const step = () => {
      // A régi karakterek halványítása átlátszóság felé (a háttérszíntől független, így témaváltásnál sincs folt).
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = `rgba(0,0,0,${TRAIL_FADE})`;
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = "source-over";

      ctx.fillStyle = color;
      ctx.font = font;
      const rows = height / FONT_SIZE;
      for (let i = 0; i < drops.length; i++) {
        const prev = Math.floor(drops[i]);
        drops[i] += speeds[i];
        const row = Math.floor(drops[i]);
        // Csak akkor írunk új karaktert, ha a fej új sorba lépett, így egyenletes a csík.
        if (row !== prev && row >= 0) ctx.fillText(randomChar(), i * FONT_SIZE, row * FONT_SIZE);
        if (row > rows && Math.random() > 0.975) {
          drops[i] = -Math.random() * rows * 0.3;
          speeds[i] = 0.35 + Math.random() * 0.45;
        }
      }
    };

    // Képkocka-ciklus, ~20 képkocka/mp-re fékezve.
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (now - last < FRAME_MS) return;
      last = now;
      step();
    };

    // Az animáció leállítása, illetve indítása.
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const play = () => {
      if (raf || document.hidden) return;
      if (reducedMotion.matches) {
        // Álló kép: néhány lépés előre kiszámolva, utána nincs mozgás.
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < 40; i++) step();
        return;
      }
      last = 0;
      raf = requestAnimationFrame(loop);
    };

    // Eseménykezelők: fül elrejtése, ablak átméretezése, mozgás-beállítás és téma változása.
    const onVisibility = () => (document.hidden ? stop() : play());
    const onResize = () => {
      resize();
      if (reducedMotion.matches) play();
    };
    const onMotionChange = () => {
      stop();
      play();
    };
    const themeObserver = new MutationObserver(readTheme);

    // Indítás: beállítások, első kép, majd az eseményfigyelők felrakása.
    const start = () => {
      started = true;
      readTheme();
      resize();
      // Előre "lefuttatunk" pár lépést, hogy ne egy üres vászon induljon.
      for (let i = 0; i < 30; i++) step();
      canvas.dataset.ready = "";
      play();
      document.addEventListener("visibilitychange", onVisibility);
      window.addEventListener("resize", onResize);
      reducedMotion.addEventListener("change", onMotionChange);
      themeObserver.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    };

    // Csak akkor indul, amikor a böngészőnek már van szabad ideje (nem lassítja a betöltést).
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(start, { timeout: 600 })
      : window.setTimeout(start, 200);

    // Takarítás, amikor a komponens eltűnik az oldalról (pl. másik oldalra lépéskor).
    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      stop();
      if (!started) return;
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
      reducedMotion.removeEventListener("change", onMotionChange);
      themeObserver.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="matrix-rain" />;
}
