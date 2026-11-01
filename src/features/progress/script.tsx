"use client";

// Még az oldal kirajzolása előtt alkalmazza a mentett haladást (lenyitott félévek, „itt tartasz”),
// így frissítéskor nem villan be az alapállapot. Ideiglenes CSS szabályokat ír a <head>-be,
// amelyeket a React töröl, miután átvette az irányítást (lásd useHandOverFromScript).
// A ThemeScript mintáját követi: a szerver futtatható szkriptként küldi, a böngésző React-je szövegként látja.

export const PROGRESS_STYLE_ID = "em-progress-style";

const script = `(function(){try{
var p=JSON.parse(localStorage.getItem("em:progress")||"{}"),r=[],q=function(s){return JSON.stringify(s)};
var o=p.openSemesters||{};for(var u in o)(o[u]||[]).forEach(function(n){var k=q(u+":"+n);
r.push("[data-semester-panel="+k+"]{display:grid!important}[data-semester-chevron="+k+"]{rotate:90deg}")});
var l=p.lastCourse||{};for(var v in l)r.push("[data-last-course="+q(v+":"+l[v])+"]{display:inline-block!important}");
if(r.length){var s=document.createElement("style");s.id="${PROGRESS_STYLE_ID}";s.textContent=r.join("");document.head.appendChild(s)}
}catch(e){}})()`;

export function ProgressScript() {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: script }}
    />
  );
}
