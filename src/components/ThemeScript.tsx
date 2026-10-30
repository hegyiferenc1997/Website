// Még az oldal kirajzolása előtt visszaállítja a mentett témát, így nincs villanás.
// Kliens oldali navigációnál nem fut újra, de akkor a <html> már a helyes témán van.
const script = `(function(){try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}})()`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
