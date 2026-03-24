import { Minus, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface QuantityInputProps {
  value: number;
  onChange: (value: number) => void;
  unitType: 'g' | 'ml';
  min?: number;
  step?: number;
  className?: string;
}

export default function QuantityInput({
  value,
  onChange,
  unitType,
  min = 100,
  step = 10,
  className = '',
}: QuantityInputProps) {
  const unitLabel = unitType === 'g' ? 'gm' : 'ml';

  const handleDecrement = () => {
    const next = Math.max(min, value - step);
    onChange(next);
  };

  const handleIncrement = () => {
    onChange(value + step);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = parseInt(e.target.value, 10);
    if (isNaN(raw)) return;
    const snapped = Math.max(min, Math.round(raw / step) * step);
    onChange(snapped);
  };

  const displayValue = value >= 1000
    ? `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)} ${unitType === 'g' ? 'kg' : 'L'}`
    : `${value} ${unitLabel}`;

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <button
        onClick={handleDecrement}
        disabled={value <= min}
        className="h-7 w-7 flex items-center justify-center rounded-md bg-secondary text-foreground hover:bg-primary/10 disabled:opacity-40"
      >
        <Minus className="h-3 w-3" />
      </button>
      <div className="relative">
        <Input
          type="number"
          value={value}
          onChange={handleInputChange}
          min={min}
          step={step}
          className="w-20 h-7 text-center text-xs font-bold px-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[9px] text-muted-foreground pointer-events-none">
          {unitLabel}
        </span>
      </div>
      <button
        onClick={handleIncrement}
        className="h-7 w-7 flex items-center justify-center rounded-md bg-secondary text-foreground hover:bg-primary/10"
      >
        <Plus className="h-3 w-3" />
      </button>
    </div>
  );
}
