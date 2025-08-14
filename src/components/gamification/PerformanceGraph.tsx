
// Keep it DOM-only (no charts lib). Provide sparkline as a simple SVG path.
export function PerformanceGraph({ values }: { values: number[] }) {
  const w = 160, h = 40;
  const max = Math.max(1, ...values);
  const pts = values.map((v,i)=>{
    const x = (i/(Math.max(1,values.length-1)))*w;
    const y = h - (v/max)*h;
    return `${x},${y}`;
  }).join(" ");
  return (
    <div className="rounded-lg border bg-white p-3">
      <div className="text-sm font-medium mb-1">Andamento accuratezza</div>
      <svg width={w} height={h} className="overflow-visible">
        <polyline points={pts} fill="none" stroke="currentColor" strokeWidth={2}/>
      </svg>
    </div>
  );
}
