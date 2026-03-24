import { getListing, getProduct, formatPrice, formatQuantity, getUnitType, toBaseUnit, formatCustomQty, calcCustomPrice } from '@/data/sampleData';
import { CartItem as CartItemType } from '@/types';
import { Minus, Plus, Trash2 } from 'lucide-react';
import QuantityInput from '@/components/product/QuantityInput';

interface CartItemProps {
  item: CartItemType;
  onUpdateQty: (listingId: string, qty: number) => void;
  onUpdateCustomQty: (listingId: string, customQty: number) => void;
  onRemove: (listingId: string) => void;
}

export default function CartItemCard({ item, onUpdateQty, onUpdateCustomQty, onRemove }: CartItemProps) {
  const listing = getListing(item.listingId);
  const product = listing ? getProduct(listing.productId) : null;
  if (!listing || !product) return null;

  const unitType = getUnitType(listing.unit);
  const isCountable = unitType === 'pcs';

  const itemPrice = isCountable || !item.customQty
    ? listing.price * item.qty
    : calcCustomPrice(listing.price, listing.quantity, listing.unit, item.customQty);

  return (
    <div className="flex items-center gap-3 py-3 border-b border-border last:border-0">
      <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center text-2xl shrink-0">
        {product.image}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{product.brand} {product.name}</p>
        <p className="text-xs text-muted-foreground">
          {isCountable
            ? `${item.qty} × ${formatQuantity(listing.quantity, listing.unit)}`
            : item.customQty
              ? formatCustomQty(item.customQty, unitType)
              : formatQuantity(listing.quantity, listing.unit)
          }
        </p>
        <p className="text-sm font-bold text-foreground mt-0.5">{formatPrice(Math.round(itemPrice))}</p>
      </div>
      <div className="flex items-center gap-1">
        {isCountable ? (
          <>
            <button onClick={() => onUpdateQty(item.listingId, item.qty - 1)} className="h-7 w-7 flex items-center justify-center rounded-md bg-secondary text-foreground hover:bg-primary/10">
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-6 text-center text-sm font-bold">{item.qty}</span>
            <button onClick={() => onUpdateQty(item.listingId, item.qty + 1)} className="h-7 w-7 flex items-center justify-center rounded-md bg-secondary text-foreground hover:bg-primary/10">
              <Plus className="h-3 w-3" />
            </button>
          </>
        ) : (
          <QuantityInput
            value={item.customQty || toBaseUnit(listing.quantity, listing.unit)}
            onChange={(v) => onUpdateCustomQty(item.listingId, v)}
            unitType={unitType as 'g' | 'ml'}
          />
        )}
        <button onClick={() => onRemove(item.listingId)} className="h-7 w-7 flex items-center justify-center rounded-md text-destructive hover:bg-destructive/10 ml-1">
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
