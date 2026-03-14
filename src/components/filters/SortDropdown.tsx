import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SortOption } from '@/types';

interface SortDropdownProps {
  value: SortOption;
  onChange: (v: SortOption) => void;
}

const options: { value: SortOption; label: string }[] = [
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'quantity_desc', label: 'Quantity: High to Low' },
  { value: 'rating', label: 'Vendor Rating' },
  { value: 'delivery', label: 'Fastest Delivery' },
];

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <Select value={value} onValueChange={v => onChange(v as SortOption)}>
      <SelectTrigger className="w-[180px] h-9 text-xs rounded-lg">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        {options.map(o => (
          <SelectItem key={o.value} value={o.value} className="text-xs">{o.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
