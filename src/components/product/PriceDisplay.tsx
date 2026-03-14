import { formatPrice, getDiscountPercent } from '@/data/sampleData';

interface PriceDisplayProps {
  price: number;
  mrp?: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function PriceDisplay({ price, mrp, size = 'md' }: PriceDisplayProps) {
  const discount = getDiscountPercent(price, mrp);
  const sizeClasses = {
    sm: { price: 'text-sm', mrp: 'text-[10px]', discount: 'text-[10px]' },
    md: { price: 'text-lg', mrp: 'text-xs', discount: 'text-xs' },
    lg: { price: 'text-2xl', mrp: 'text-sm', discount: 'text-sm' },
  };
  const s = sizeClasses[size];

  return (
    <div className="flex items-baseline gap-2">
      <span className={`${s.price} font-bold text-foreground`}>{formatPrice(price)}</span>
      {mrp && mrp > price && (
        <span className={`${s.mrp} text-muted-foreground line-through`}>{formatPrice(mrp)}</span>
      )}
      {discount && (
        <span className={`${s.discount} font-semibold text-primary`}>{discount}% off</span>
      )}
    </div>
  );
}
