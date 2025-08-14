// React import removed - not needed with new JSX transform
import { ConfidenceLevel } from '@/types/assessment';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface ConfidenceSliderProps {
  value: ConfidenceLevel;
  onChange: (value: ConfidenceLevel) => void;
  disabled?: boolean;
}

const confidenceMap: Record<number, ConfidenceLevel> = {
  0: 'low',
  1: 'medium', 
  2: 'high'
};

const confidenceLabels = {
  low: 'Bassa certezza',
  medium: 'Media certezza',
  high: 'Alta certezza'
};

export function ConfidenceSlider({ value, onChange, disabled }: ConfidenceSliderProps) {
  const numericValue = Object.entries(confidenceMap).find(([_, conf]) => conf === value)?.[0] || '1';
  
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">
        Quanto sei sicuro della tua risposta?
      </Label>
      <div className="px-2">
        <Slider
          value={[parseInt(numericValue)]}
          onValueChange={([val]) => onChange(confidenceMap[val])}
          max={2}
          min={0}
          step={1}
          disabled={disabled}
          className="w-full"
        />
        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
          <span>Bassa</span>
          <span>Media</span>
          <span>Alta</span>
        </div>
      </div>
      <p className="text-sm text-center text-muted-foreground">
        {confidenceLabels[value]}
      </p>
    </div>
  );
}