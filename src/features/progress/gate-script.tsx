import { InlineScript } from "@/components/InlineScript";

// A zárolt leckék jelölése még az oldal kirajzolása előtt (a ProgressScript mintájára), hogy frissítéskor
// ne villanjon fel a zárolt lecke tartalma, és a zárolt linkek se látsszanak egy pillanatig nyitottnak.
// A tárgy leckéinek sorrendjét az oldal adja át; a szkript a localStorage-ban lévő haladásból kiszámolja,
// melyik az első el nem végzett lecke, és az utána következőkre ideiglenes CSS szabályokat ír.
// A React a haladás betöltése után ugyanezt a data-locked attribútummal rajzolja, és törli a stílust.

export const GATE_STYLE_ID = "em-gate-style";

// A zárolt elemek kinézete; az S helyére kerülnek a zárolt leckék kiválasztói.
// (Ugyanez a data-locked attribútumra a globals.css-ben, „Zárolt leckék” résznél.)
const RULES =
  "S .gate-lock{display:inline-flex!important}" +
  "S.gate-link{color:var(--muted)!important;opacity:.6;cursor:not-allowed!important}" +
  "S .gate-content{display:none!important}" +
  "S .gate-notice{display:grid!important}";

/** A tárgy azonosítója (egyetem/tárgy) és az összes lecke sorrendben ("témakör/lecke"). */
export function GateScript({ courseKey, lessons }: { courseKey: string; lessons: string[] }) {
  const code = `(function(){try{
var p=JSON.parse(localStorage.getItem("em:progress")||"{}"),k=${JSON.stringify(courseKey)},l=${JSON.stringify(lessons)};
var d=(p.doneLessons||{})[k]||[],f=0;while(f<l.length&&d.indexOf(l[f])>=0)f++;
var s=[];for(var i=f+1;i<l.length;i++)s.push("[data-gate="+JSON.stringify(k+"#"+i)+"]");
if(s.length){var e=document.getElementById("${GATE_STYLE_ID}")||document.createElement("style");e.id="${GATE_STYLE_ID}";
e.textContent=${JSON.stringify(RULES)}.replace(/S/g,":is("+s.join(",")+")");document.head.appendChild(e)}
}catch(e){}})()`;
  return <InlineScript code={code} />;
}
