import { Button } from "@/components/ui/button";

export function RandomBonusTrigger({
  onRoll,
  disabled,
  label = "Lucky Bonus",
}: { onRoll: () => void; disabled?: boolean; label?: string }) {
  return (
    <Button variant="secondary" disabled={disabled} onClick={onRoll}>
      🎲 {label}
    </Button>
  );
}
