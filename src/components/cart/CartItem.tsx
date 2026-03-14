import { VendorListing } from '@/types';
import { getListing, getProduct, formatPrice, formatQuantity } from '@/data/sampleData';
import { CartItem as CartItemType } from '@/types';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2 } from 'lucide-react';

interface CartItemProps {
  item: CartItemType;
  onUpdateQty: (listingId: string, qty: number) => void;
  onRemove: (listingId: string) => void;
}

export default function CartItemCard({ item, onUpdateQty, onRemove }: CartItemProps) {
  const listing = getListing(item.listingId);
  const product = listing ? getProduct(listing.productId) : null;
  if (!listing || !product) return null;

  return (
    <div className="flex items-center gap-3 py-3 border-b border-border last:border-0">
      <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center text-2xl shrink-0">
        {product.image}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{product.brand} {product.name}</p>
        <p className="text-xs text-muted-foreground">{formatQuantity(listing.quantity, listing.unit)}</p>
        <p className="text-sm font-bold text-foreground mt-0.5">{formatPrice(listing.price * item.qty)}</p>
      </div>
      <div className="flex items-center gap-1">
        <button onClick={() => onUpdateQty(item.listingId, item.qty - 1)} className="h-7 w-7 flex items-center justify-center rounded-md bg-secondary text-foreground hover:bg-primary/10">
          <Minus className="h-3 w-3" />
        </button>
        <span className="w-6 text-center text-sm font-bold">{item.qty}</span>
        <button onClick={() => onUpdateQty(item.listingId, item.qty + 1)} className="h-7 w-7 flex items-center justify-center rounded-md bg-secondary text-foreground hover:bg-primary/10">
          <Plus className="h-3 w-3" />
        </button>
        <button onClick={() => onRemove(item.listingId)} className="h-7 w-7 flex items-center justify-center rounded-md text-destructive hover:bg-destructive/10 ml-1">
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
