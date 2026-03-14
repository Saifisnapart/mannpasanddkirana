import { Badge } from '@/components/ui/badge';

export function StockBadge({ stock }: { stock: 'in_stock' | 'low_stock' | 'out_of_stock' }) {
  if (stock === 'in_stock') return <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px]">In Stock</Badge>;
  if (stock === 'low_stock') return <Badge variant="destructive" className="text-[10px]">Low Stock</Badge>;
  return <Badge variant="secondary" className="text-[10px]">Out of Stock</Badge>;
}

export function DeliveryBadge({ estimate }: { estimate: string }) {
  return <Badge variant="secondary" className="text-[10px] gap-1">🕐 {estimate}</Badge>;
}

export function StoreBadge({ name, rating }: { name: string; rating: number }) {
  return (
    <Badge variant="outline" className="text-[10px] gap-1">
      🏪 {name} · ⭐ {rating}
    </Badge>
  );
}
