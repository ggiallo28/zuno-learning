
export function InterleavingBadge({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <span
      className="inline-flex items-center rounded-full bg-amber-100 text-amber-900 px-2 py-0.5 text-[11px] border border-amber-200"
      title="Domanda inserita per interleaving"
    >
      Interleaving
    </span>
  );
}
