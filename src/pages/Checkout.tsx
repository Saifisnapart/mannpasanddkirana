import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useLocation } from '@/contexts/LocationContext';
import { sampleAddresses, formatPrice, getVendor, getListing, getProduct, getUnitType, calcCustomPrice, formatCustomQty } from '@/data/sampleData';
import { calculateDistance, calculateDeliveryFee } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MapPin, Truck, CreditCard, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart, vendorIds } = useCart();
  const { userLocation } = useLocation();
  const { userLocation } = useLocation();
  const [selectedAddress, setSelectedAddress] = useState(sampleAddresses[0].id);
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [orderPlaced, setOrderPlaced] = useState(false);

  if (items.length === 0 && !orderPlaced) {
    navigate('/cart');
    return null;
  }

  const isMultiVendor = vendorIds.length > 1;
  const deliveryFee = isMultiVendor ? 80 : 40;
  const taxAmount = Math.round(subtotal * 0.05);
  const total = subtotal + (deliveryType === 'delivery' ? deliveryFee : 0) + taxAmount;

  const handlePlaceOrder = () => {
    setOrderPlaced(true);
    clearCart();
    toast.success('Order placed successfully!');
  };

  if (orderPlaced) {
    return (
      <div className="px-4 py-16 text-center space-y-4">
        <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
          <CheckCircle2 className="h-8 w-8 text-primary" />
        </div>
        <h1 className="font-display text-2xl font-bold text-foreground">Order Placed!</h1>
        <p className="text-sm text-muted-foreground">Your order has been placed successfully. You can track it in the Orders page.</p>
        <div className="flex gap-2 justify-center">
          <Button onClick={() => navigate('/orders')} className="rounded-xl">View Orders</Button>
          <Button variant="outline" onClick={() => navigate('/home')} className="rounded-xl">Continue Shopping</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 space-y-4">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Cart
      </button>
      <h1 className="font-display text-xl font-bold text-foreground">Checkout</h1>

      {/* Address */}
      <Card className="p-4">
        <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-1"><MapPin className="h-4 w-4" /> Delivery Address</h2>
        <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress} className="space-y-2">
          {sampleAddresses.map(a => (
            <label key={a.id} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${selectedAddress === a.id ? 'border-primary bg-primary/5' : 'border-border'}`}>
              <RadioGroupItem value={a.id} className="mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">{a.label}</p>
                <p className="text-xs text-muted-foreground">{a.full}</p>
              </div>
            </label>
          ))}
        </RadioGroup>
        <Button variant="outline" size="sm" className="mt-3 text-xs rounded-lg">+ Add New Address</Button>
      </Card>

      {/* Delivery Type */}
      <Card className="p-4">
        <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-1"><Truck className="h-4 w-4" /> Delivery Option</h2>
        <RadioGroup value={deliveryType} onValueChange={v => setDeliveryType(v as 'delivery' | 'pickup')} className="flex gap-3">
          <label className={`flex-1 flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors ${deliveryType === 'delivery' ? 'border-primary bg-primary/5' : 'border-border'}`}>
            <RadioGroupItem value="delivery" />
            <div>
              <p className="text-sm font-medium text-foreground">Home Delivery</p>
              <p className="text-xs text-muted-foreground">20-45 min</p>
            </div>
          </label>
          <label className={`flex-1 flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-colors ${deliveryType === 'pickup' ? 'border-primary bg-primary/5' : 'border-border'}`}>
            <RadioGroupItem value="pickup" />
            <div>
              <p className="text-sm font-medium text-foreground">Store Pickup</p>
              <p className="text-xs text-muted-foreground">Ready in 15 min</p>
            </div>
          </label>
        </RadioGroup>
      </Card>

      {/* Payment */}
      <Card className="p-4">
        <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-1"><CreditCard className="h-4 w-4" /> Payment Method</h2>
        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-2">
          {[
            { value: 'cod', icon: '💵', label: 'Cash on Delivery', desc: 'Pay when you receive' },
            { value: 'upi', icon: '📱', label: 'UPI', desc: 'Google Pay, PhonePe, etc.' },
            { value: 'card', icon: '💳', label: 'Card', desc: 'Debit or Credit card' },
          ].map(m => (
            <label key={m.value} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${paymentMethod === m.value ? 'border-primary bg-primary/5' : 'border-border'}`}>
              <RadioGroupItem value={m.value} />
              <span className="text-xl">{m.icon}</span>
              <div>
                <p className="text-sm font-medium text-foreground">{m.label}</p>
                <p className="text-xs text-muted-foreground">{m.desc}</p>
              </div>
            </label>
          ))}
        </RadioGroup>
      </Card>

      {/* Order Summary */}
      <Card className="p-4 space-y-2">
        <h2 className="text-sm font-semibold text-foreground mb-2">Order Summary</h2>
        {items.slice(0, 5).map(item => {
          const listing = getListing(item.listingId);
          const product = listing ? getProduct(listing.productId) : null;
          if (!listing || !product) return null;
          return (
            <div key={item.listingId} className="flex justify-between text-xs">
              <span className="text-muted-foreground">{product.brand} {product.name} x {item.qty}</span>
              <span className="text-foreground">{formatPrice(listing.price * item.qty)}</span>
            </div>
          );
        })}
        {items.length > 5 && <p className="text-xs text-muted-foreground">+{items.length - 5} more items</p>}
        <div className="border-t pt-2 space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="text-foreground">{formatPrice(subtotal)}</span>
          </div>
          {deliveryType === 'delivery' && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Delivery {isMultiVendor ? '(split)' : ''}</span>
              <span className="text-foreground">{formatPrice(deliveryFee)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax (5%)</span>
            <span className="text-foreground">{formatPrice(taxAmount)}</span>
          </div>
          <div className="border-t pt-2 flex justify-between text-base font-bold">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </Card>

      <Button onClick={handlePlaceOrder} className="w-full h-12 rounded-xl text-base font-semibold">
        Place Order · {formatPrice(total)}
      </Button>
    </div>
  );
}
