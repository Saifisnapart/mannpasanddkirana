import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import CartItemCard from '@/components/cart/CartItem';
import EmptyState from '@/components/common/EmptyState';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatPrice, getVendor, getListing } from '@/data/sampleData';
import { Store, Clock, Trash2, ArrowRight, Info, Truck } from 'lucide-react';
import { useLocation } from '@/contexts/LocationContext';
import { calculateSplitOrder } from '@/lib/utils';

export default function Cart() {
  const navigate = useNavigate();
  const { items, updateQty, removeItem, clearCart, subtotal, vendorIds, vendorNames } = useCart();
  const { userLocation } = useLocation();

  if (items.length === 0) {
    return <EmptyState type="cart" />;
  }

  const splitOrder = userLocation
    ? calculateSplitOrder(items, userLocation.lat, userLocation.lng)
    : null;

  const isMultiVendor = vendorIds.length > 1;
  const deliveryFee = isMultiVendor ? 80 : 40;
  const total = subtotal + deliveryFee;

  // Group items by vendor
  const groupedItems = new Map<string, typeof items>();
  for (const item of items) {
    const listing = getListing(item.listingId);
    if (!listing) continue;
    const group = groupedItems.get(listing.vendorId) || [];
    group.push(item);
    groupedItems.set(listing.vendorId, group);
  }

  return (
    <div className="px-4 py-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl font-bold text-foreground">Your Cart</h1>
        <Button variant="ghost" size="sm" onClick={clearCart} className="text-destructive text-xs h-8 gap-1">
          <Trash2 className="h-3 w-3" /> Clear All
        </Button>
      </div>

      {isMultiVendor && (
        <div className="flex items-start gap-2 bg-info/10 rounded-xl p-3">
          <Truck className="h-4 w-4 text-info shrink-0 mt-0.5" />
          <p className="text-xs text-foreground">
            Your cart has items from <strong>{vendorNames.join(' & ')}</strong>. Split order delivery applies.
          </p>
        </div>
      )}

      {/* Grouped by vendor */}
      {Array.from(groupedItems.entries()).map(([vId, vItems], idx) => {
        const vendor = getVendor(vId);
        if (!vendor) return null;
        const vSubtotal = vItems.reduce((sum, item) => {
          const listing = getListing(item.listingId);
          return sum + (listing ? listing.price * item.qty : 0);
        }, 0);

        return (
          <Card key={vId} className={`p-4 ${idx === 0 ? 'border-primary/30 border-2' : ''}`}>
            <div className="flex items-center gap-2 mb-3 cursor-pointer" onClick={() => navigate(`/vendors/${vendor.slug}`)}>
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm">{vendor.image}</div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{vendor.name}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> {vendor.deliveryEstimate}</p>
              </div>
              {idx === 0 && isMultiVendor && (
                <span className="px-2 py-0.5 bg-primary text-primary-foreground text-[10px] rounded-full font-bold">PRIMARY</span>
              )}
              {idx > 0 && isMultiVendor && (
                <span className="px-2 py-0.5 bg-info/20 text-info text-[10px] rounded-full font-bold">SPLIT</span>
              )}
            </div>
            {vItems.map(item => (
              <CartItemCard key={item.listingId} item={item} onUpdateQty={updateQty} onRemove={removeItem} />
            ))}
            <div className="mt-2 pt-2 border-t border-border flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal from {vendor.name}</span>
              <span className="font-medium text-foreground">{formatPrice(vSubtotal)}</span>
            </div>
          </Card>
        );
      })}

      {/* Summary */}
      <Card className="p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium text-foreground">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Delivery Fee {isMultiVendor ? '(split order)' : ''}</span>
          <span className="font-medium text-foreground">{formatPrice(deliveryFee)}</span>
        </div>
        <div className="border-t pt-2 flex justify-between text-base">
          <span className="font-semibold text-foreground">Total</span>
          <span className="font-bold text-foreground">{formatPrice(total)}</span>
        </div>
      </Card>

      <Button onClick={() => navigate('/checkout')} className="w-full h-12 rounded-xl text-base font-semibold">
        Proceed to Checkout · {formatPrice(total)} <ArrowRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
}
