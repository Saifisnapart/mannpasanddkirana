import { VendorListing } from '@/types';
import { getProduct, formatPrice, formatQuantity, getDiscountPercent, getUnitType, toBaseUnit, formatCustomQty, calcCustomPrice } from '@/data/sampleData';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import QuantityInput from './QuantityInput';

interface ProductCardProps {
  listing: VendorListing;
  onAddToCart: (listingId: string) => void;
}

export default function ProductCard({ listing, onAddToCart }: ProductCardProps) {
  const product = getProduct(listing.productId);
  const { items, updateQty, updateCustomQty, removeItem } = useCart();
  if (!product) return null;

  const discount = getDiscountPercent(listing.price, listing.mrp);
  const cartItem = items.find(i => i.listingId === listing.id);
  const unitType = getUnitType(listing.unit);
  const isCountable = unitType === 'pcs';

  const cartPrice = cartItem && !isCountable && cartItem.customQty
    ? calcCustomPrice(listing.price, listing.quantity, listing.unit, cartItem.customQty)
    : listing.price * (cartItem?.qty || 1);

  return (
    <Card className="p-3 hover:shadow-md transition-shadow animate-fade-in">
      <div className="w-full aspect-square rounded-lg bg-secondary flex items-center justify-center text-4xl mb-2">
        {product.image}
      </div>
      <h4 className="font-semibold text-xs text-foreground leading-tight truncate">{product.brand} {product.name}</h4>
      <p className="text-[11px] text-muted-foreground">{formatQuantity(listing.quantity, listing.unit)}</p>
      <div className="flex items-baseline gap-1.5 mt-1">
        <span className="text-sm font-bold text-foreground">{formatPrice(listing.price)}</span>
        {listing.mrp && listing.mrp > listing.price && (
          <span className="text-[10px] text-muted-foreground line-through">{formatPrice(listing.mrp)}</span>
        )}
        {discount && <Badge className="bg-primary/10 text-primary border-primary/20 text-[9px] px-1 py-0">{discount}% off</Badge>}
      </div>
      {listing.stock === 'low_stock' && (
        <p className="text-[10px] text-destructive mt-0.5 font-medium">Low stock</p>
      )}
      <div className="mt-2">
        {cartItem ? (
          <div className="space-y-1.5">
            {isCountable ? (
              <div className="flex items-center justify-between bg-primary/10 rounded-lg h-8 px-1">
                <button onClick={() => updateQty(listing.id, cartItem.qty - 1)} className="h-6 w-6 flex items-center justify-center rounded-md hover:bg-primary/20 text-primary">
                  <Minus className="h-3 w-3" />
                </button>
                <span className="text-sm font-bold text-primary">{cartItem.qty}</span>
                <button onClick={() => updateQty(listing.id, cartItem.qty + 1)} className="h-6 w-6 flex items-center justify-center rounded-md hover:bg-primary/20 text-primary">
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <QuantityInput
                  value={cartItem.customQty || toBaseUnit(listing.quantity, listing.unit)}
                  onChange={(v) => updateCustomQty(listing.id, v)}
                  unitType={unitType as 'g' | 'ml'}
                  className="flex-1"
                />
                <button onClick={() => removeItem(listing.id)} className="h-7 w-7 flex items-center justify-center rounded-md text-destructive hover:bg-destructive/10">
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            )}
            <p className="text-[10px] text-center text-muted-foreground font-medium">
              {formatPrice(Math.round(cartPrice))}
              {!isCountable && cartItem.customQty && ` for ${formatCustomQty(cartItem.customQty, unitType)}`}
            </p>
          </div>
        ) : (
          <Button
            size="sm"
            variant="outline"
            className="w-full text-xs h-8 rounded-lg border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            onClick={() => onAddToCart(listing.id)}
            disabled={listing.stock === 'out_of_stock'}
          >
            <Plus className="h-3 w-3 mr-1" /> Add
          </Button>
        )}
      </div>
    </Card>
  );
}
