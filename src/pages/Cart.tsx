import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import CartItemCard from '@/components/cart/CartItem';
import EmptyState from '@/components/common/EmptyState';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatPrice, getVendor, getListing, getUnitType, toBaseUnit, calcCustomPrice } from '@/data/sampleData';
import { Clock, Trash2, ArrowRight, Truck, MapPin } from 'lucide-react';
import { useLocation } from '@/contexts/LocationContext';
import { calculateSplitOrder, calculateDistance, calculateDeliveryFee } from '@/lib/utils';

export default function Cart() {
  const navigate = useNavigate();
  const { items, updateQty, updateCustomQty, removeItem, clearCart, subtotal, vendorIds, vendorNames } = useCart();
  const { userLocation } = useLocation();

  if (items.length === 0) {
    return <EmptyState type="cart" />;
  }

  const splitOrder = userLocation
    ? calculateSplitOrder(items, userLocation.lat, userLocation.lng)
    : null;

  const isMultiVendor = vendorIds.length > 1;

  // Calculate per-vendor delivery fees based on distance
  const vendorDeliveryInfo = vendorIds.map(vId => {
    const vendor = getVendor(vId);
    if (!vendor || !userLocation) return { vendorId: vId, distance: 0, fee: 40, name: '' };
    const dist = calculateDistance(userLocation.lat, userLocation.lng, vendor.lat, vendor.lng);
    return { vendorId: vId, distance: dist, fee: calculateDeliveryFee(dist), name: vendor.name };
  });

  const totalDeliveryFee = vendorDeliveryInfo.reduce((sum, v) => sum + v.fee, 0);
  const total = subtotal + totalDeliveryFee;

  // Group items by vendor
  const groupedItems = new Map<string, typeof items>();
  for (const item of items) {
    const listing = getListing(item.listingId);
    if (!listing) continue;
    const group = groupedItems.get(listing.vendorId) || [];
    group.push(item);
    groupedItems.set(listing.vendorId, group);
  }

  const getItemTotal = (item: typeof items[0]) => {
    const listing = getListing(item.listingId);
    if (!listing) return 0;
    const unitType = getUnitType(listing.unit);
    if (unitType === 'pcs' || !item.customQty) {
      return listing.price * item.qty;
    }
    return calcCustomPrice(listing.price, listing.quantity, listing.unit, item.customQty);
  };

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

      {Array.from(groupedItems.entries()).map(([vId, vItems], idx) => {
        const vendor = getVendor(vId);
        if (!vendor) return null;
        const vSubtotal = vItems.reduce((sum, item) => sum + getItemTotal(item), 0);
        const vDelivery = vendorDeliveryInfo.find(d => d.vendorId === vId);

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
              <CartItemCard key={item.listingId} item={item} onUpdateQty={updateQty} onUpdateCustomQty={updateCustomQty} onRemove={removeItem} />
            ))}
            <div className="mt-2 pt-2 border-t border-border space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal from {vendor.name}</span>
                <span className="font-medium text-foreground">{formatPrice(Math.round(vSubtotal))}</span>
              </div>
              {vDelivery && (
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {vDelivery.distance} km away · Delivery
                  </span>
                  <span className="font-medium text-foreground">{formatPrice(vDelivery.fee)}</span>
                </div>
              )}
            </div>
          </Card>
        );
      })}

      <Card className="p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium text-foreground">{formatPrice(Math.round(subtotal))}</span>
        </div>
        <div className="space-y-1">
          {vendorDeliveryInfo.map(d => (
            <div key={d.vendorId} className="flex justify-between text-xs">
              <span className="text-muted-foreground">
                Delivery{isMultiVendor && d.name ? ` (${d.name})` : ''} · {d.distance} km
              </span>
              <span className="font-medium text-foreground">{formatPrice(d.fee)}</span>
            </div>
          ))}
          {isMultiVendor && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Delivery</span>
              <span className="font-medium text-foreground">{formatPrice(totalDeliveryFee)}</span>
            </div>
          )}
        </div>
        <div className="border-t pt-2 flex justify-between text-base">
          <span className="font-semibold text-foreground">Total</span>
          <span className="font-bold text-foreground">{formatPrice(Math.round(total))}</span>
        </div>
      </Card>

      <Button onClick={() => navigate('/checkout')} className="w-full h-12 rounded-xl text-base font-semibold">
        Proceed to Checkout · {formatPrice(Math.round(total))} <ArrowRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
}
