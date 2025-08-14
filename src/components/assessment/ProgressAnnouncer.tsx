/** A11y helper: polite live region for progress/precision updates without spammare lo screen reader */
export function ProgressAnnouncer({ text }: { text: string }) {
  return (
    <div className="sr-only" aria-live="polite">
      {text}
    </div>
  );
}
