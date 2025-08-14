// src/components/course/PromoRibbon.tsx

export function PromoRibbon({ text, cta, onCta }: { text: string; cta?: string; onCta?: () => void }) {
  return (
    <div className="bg-gradient-to-r from-sky-500 to-blue-600 text-white text-sm">
      <div className="mx-auto max-w-6xl px-4 py-2 flex items-center gap-3">
        <span className="font-medium">{text}</span>
        {cta && <button onClick={onCta} className="rounded-full bg-white/10 px-3 py-1 hover:bg-white/20">{cta}</button>}
      </div>
    </div>
  );
}
