import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import CartItemCard from '@/components/cart/CartItem';
import EmptyState from '@/components/common/EmptyState';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatPrice, getVendor } from '@/data/sampleData';
import { Store, Clock, Trash2, ArrowRight, Info } from 'lucide-react';

export default function Cart() {
  const navigate = useNavigate();
  const { vendorId, items, updateQty, removeItem, clearCart, subtotal, vendorName } = useCart();
  const vendor = vendorId ? getVendor(vendorId) : null;

  if (items.length === 0) {
    return <EmptyState type="cart" />;
  }

  const deliveryFee = subtotal >= (vendor?.minOrder || 0) ? 0 : 25;
  const total = subtotal + deliveryFee;

  return (
    <div className="px-4 py-4 space-y-4">
      <h1 className="font-display text-xl font-bold text-foreground">Your Cart</h1>

      {/* Vendor info */}
      {vendor && (
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2" onClick={() => navigate(`/vendors/${vendor.slug}`)} role="button">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm">🏪</div>
              <div>
                <p className="text-sm font-semibold text-foreground">{vendor.name}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> {vendor.deliveryEstimate}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={clearCart} className="text-destructive text-xs h-8 gap-1">
              <Trash2 className="h-3 w-3" /> Clear
            </Button>
          </div>
        </Card>
      )}

      {/* MVP notice */}
      <div className="flex items-start gap-2 bg-info/10 rounded-xl p-3">
        <Info className="h-4 w-4 text-info shrink-0 mt-0.5" />
        <p className="text-xs text-foreground">In this version, your cart can only have items from one vendor at a time.</p>
      </div>

      {/* Items */}
      <Card className="p-4">
        {items.map(item => (
          <CartItemCard key={item.listingId} item={item} onUpdateQty={updateQty} onRemove={removeItem} />
        ))}
      </Card>

      {/* Summary */}
      <Card className="p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium text-foreground">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Delivery</span>
          <span className="font-medium text-foreground">{deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee)}</span>
        </div>
        {deliveryFee > 0 && vendor && (
          <p className="text-[10px] text-muted-foreground">Add {formatPrice(vendor.minOrder - subtotal)} more for free delivery</p>
        )}
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
