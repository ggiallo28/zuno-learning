import * as React from "react";

/** Show an AI answer/snippet and let users mark error spans or pick error categories. */
export function ErrorSpotter({
  text,
  onSubmit
}: {
  text: string;
  onSubmit: (payload: { selections: Array<{ start: number; end: number }>; category?: string }) => void;
}) {
  const [sel, setSel] = React.useState<Array<{ start: number; end: number }>>([]);
  const [category, setCategory] = React.useState<string>("");

  function capture() {
    const s = window.getSelection();
    if (!s || s.isCollapsed) return;
    const start = s.anchorOffset, end = s.focusOffset;
    setSel((x) => [...x, { start: Math.min(start, end), end: Math.max(start, end) }]);
    s.removeAllRanges();
  }

  return (
    <div className="space-y-2">
      <div className="text-xs text-muted-foreground">Evidenzia le parti sbagliate (seleziona col mouse):</div>
      <p className="border rounded p-3 text-sm whitespace-pre-wrap" onMouseUp={capture} role="textbox" aria-multiline="true">
        {text}
      </p>
      <select className="border rounded p-2 text-sm" value={category} onChange={(e)=>setCategory(e.target.value)} aria-label="Categoria errore">
        <option value="">Categoria (facoltativa)</option>
        <option value="fact">Fatto errato</option>
        <option value="logic">Logica fallace</option>
        <option value="code">Bug di codice</option>
        <option value="hallucination">Allucinazione</option>
      </select>
      <button className="border rounded px-3 py-1.5 text-sm" onClick={()=>onSubmit({ selections: sel, category })}>Invia</button>
    </div>
  );
}
