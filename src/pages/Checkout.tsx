import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from '@/contexts/LocationContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { calculateDistance, calculateDeliveryFee } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MapPin, Truck, CreditCard, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart, storeIds } = useCart();
  const { user } = useAuth();
  const { userLocation } = useLocation();
  const { formatPrice } = useCurrency();
  const { t } = useLanguage();
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placing, setPlacing] = useState(false);

  const { data: addresses, isLoading: addrLoading } = useQuery({
    queryKey: ['addresses', user?.id],
    queryFn: async () => {
      const { data } = await supabase.from('addresses').select('*').eq('user_id', user!.id).order('is_default', { ascending: false });
      if (data && data.length > 0 && !selectedAddress) setSelectedAddress(data[0].id);
      return data || [];
    },
    enabled: !!user,
  });

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const { data } = await supabase.from('profiles').select('*').eq('user_id', user!.id).single();
      return data;
    },
    enabled: !!user,
  });

  const { data: stores } = useQuery({
    queryKey: ['checkoutStores', storeIds],
    queryFn: async () => {
      if (storeIds.length === 0) return [];
      const { data } = await supabase.from('stores').select('*, locations(*)').in('id', storeIds);
      return data || [];
    },
    enabled: storeIds.length > 0,
  });

  const { data: deliveryPartners } = useQuery({
    queryKey: ['deliveryPartners'],
    queryFn: async () => {
      const { data } = await supabase.from('delivery_partners').select('*');
      return data || [];
    },
  });

  const selectedAddr = addresses?.find((a: any) => a.id === selectedAddress);
  const deliveryLat = selectedAddr?.latitude || userLocation?.lat || 18.5204;
  const deliveryLng = selectedAddr?.longitude || userLocation?.lng || 73.8567;

  const isRatib = profile?.buyer_type === 'ratib';
  const { data: creditEligible } = useQuery({
    queryKey: ['creditEligibility', deliveryLat, deliveryLng],
    queryFn: async () => {
      const { data } = await supabase.rpc('check_credit_eligibility', { user_lat: deliveryLat, user_lng: deliveryLng });
      return data;
    },
    enabled: isRatib && !!selectedAddr,
  });

  const getDeliveryPartner = (store: any) => {
    const isStrait = store?.locations?.type === 'strait';
    return deliveryPartners?.find((dp: any) => dp.is_default_for_strait === isStrait) || deliveryPartners?.[0];
  };

  const storeDeliveryInfo = storeIds.map(sId => {
    const store = stores?.find((s: any) => s.id === sId);
    if (!store) return { storeId: sId, distance: 0, fee: 10, name: '', partner: null };
    const dist = calculateDistance(deliveryLat, deliveryLng, store.latitude, store.longitude);
    const partner = getDeliveryPartner(store);
    return { storeId: sId, distance: dist, fee: calculateDeliveryFee(dist), name: store.name, partner };
  });

  const totalDeliveryFee = storeDeliveryInfo.reduce((sum, v) => sum + v.fee, 0);
  const total = subtotal + totalDeliveryFee;

  if (items.length === 0 && !orderPlaced) { navigate('/cart'); return null; }

  const handlePlaceOrder = async () => {
    if (!user || !selectedAddress) { toast.error(t('select_address')); return; }
    setPlacing(true);
    try {
      for (const storeId of storeIds) {
        const storeItems = items.filter(i => i.storeId === storeId);
        const info = storeDeliveryInfo.find(d => d.storeId === storeId);
        const orderTotal = storeItems.reduce((sum, i) => {
          if (i.unitType === 'pcs' || !i.customQty) return sum + i.vendorPriceInr * i.qty;
          return sum + Math.round((i.vendorPriceInr / 1000) * i.customQty);
        }, 0) + (info?.fee || 0);

        const { data: order, error: orderError } = await supabase.from('orders').insert({
          customer_id: user.id, store_id: storeId, address_id: selectedAddress,
          status: 'placed', payment_method: paymentMethod as any,
          delivery_partner_id: info?.partner?.id || null, total_inr: orderTotal,
          total_display: formatPrice(Math.round(orderTotal)), placed_at: new Date().toISOString(),
        }).select().single();
        if (orderError) throw orderError;

        const orderItems = storeItems.map(i => ({
          order_id: order.id, store_product_id: i.storeProductId, product_name: i.productName,
          quantity_in_base_unit: i.unitType === 'pcs' ? i.qty : (i.customQty || 500),
          unit_price_inr: i.vendorPriceInr,
          line_total_inr: i.unitType === 'pcs' || !i.customQty ? i.vendorPriceInr * i.qty : Math.round((i.vendorPriceInr / 1000) * i.customQty),
        }));
        const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
        if (itemsError) throw itemsError;
      }
      clearCart();
      setOrderPlaced(true);
      toast.success(t('order_placed'));
    } catch (err: any) {
      toast.error(err.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="px-4 py-16 text-center space-y-4">
        <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
          <CheckCircle2 className="h-8 w-8 text-primary" />
        </div>
        <h1 className="font-display text-2xl font-bold text-foreground">{t('order_placed')}</h1>
        <p className="text-sm text-muted-foreground">Your order has been placed. Track it in Orders.</p>
        <div className="flex gap-2 justify-center">
          <Button onClick={() => navigate('/orders')} className="rounded-xl">{t('orders')}</Button>
          <Button variant="outline" onClick={() => navigate('/home')} className="rounded-xl">{t('home')}</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 space-y-4">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> {t('back')}
      </button>
      <h1 className="font-display text-xl font-bold text-foreground">{t('checkout')}</h1>

      {/* Address */}
      <Card className="p-4">
        <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-1"><MapPin className="h-4 w-4" /> {t('select_address')}</h2>
        {addrLoading ? (
          <div className="space-y-2"><Skeleton className="h-14 rounded-xl" /><Skeleton className="h-14 rounded-xl" /></div>
        ) : addresses && addresses.length > 0 ? (
          <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress} className="space-y-2">
            {addresses.map((a: any) => (
              <label key={a.id} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${selectedAddress === a.id ? 'border-primary bg-primary/5' : 'border-border'}`}>
                <RadioGroupItem value={a.id} className="mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">{a.label} {a.is_default && <span className="text-primary text-xs">(Default)</span>}</p>
                  <p className="text-xs text-muted-foreground">{a.full_address}</p>
                  {a.city && <p className="text-xs text-muted-foreground">{a.city} {a.pincode}</p>}
                </div>
              </label>
            ))}
          </RadioGroup>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-2">{t('no_addresses')}</p>
            <Button size="sm" onClick={() => navigate('/profile')} className="rounded-lg text-xs">Add Address</Button>
          </div>
        )}
      </Card>

      {/* Delivery Partner */}
      {storeDeliveryInfo.some(d => d.partner) && (
        <Card className="p-4">
          <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-1"><Truck className="h-4 w-4" /> {t('delivery_fee')}</h2>
          {storeDeliveryInfo.map(d => d.partner && (
            <div key={d.storeId} className="flex items-center gap-2 p-2 rounded-lg bg-secondary mb-1">
              <span className="text-lg">🚚</span>
              <div>
                <p className="text-xs font-medium text-foreground">{t('delivered_by')} {d.partner.name}</p>
                {d.partner.tagline && <p className="text-[10px] text-muted-foreground">{d.partner.tagline}</p>}
              </div>
            </div>
          ))}
        </Card>
      )}

      {/* Payment */}
      <Card className="p-4">
        <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-1"><CreditCard className="h-4 w-4" /> {t('payment_method')}</h2>
        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-2">
          <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${paymentMethod === 'online' ? 'border-primary bg-primary/5' : 'border-border'}`}>
            <RadioGroupItem value="online" />
            <span className="text-xl">📱</span>
            <div>
              <p className="text-sm font-medium text-foreground">{t('online_payment')}</p>
              <p className="text-xs text-muted-foreground">UPI, Cards, Net Banking</p>
            </div>
          </label>
          <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-border'}`}>
            <RadioGroupItem value="cod" />
            <span className="text-xl">💵</span>
            <div>
              <p className="text-sm font-medium text-foreground">{t('cod')}</p>
              <p className="text-xs text-muted-foreground">Pay when you receive</p>
            </div>
          </label>
          {isRatib && (
            <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
              creditEligible
                ? paymentMethod === 'credit' ? 'border-primary bg-primary/5' : 'border-border'
                : 'border-border opacity-60 cursor-not-allowed'
            }`}>
              <RadioGroupItem value="credit" disabled={!creditEligible} />
              <span className="text-xl">🏦</span>
              <div>
                <p className={`text-sm font-medium ${creditEligible ? 'text-primary' : 'text-muted-foreground'}`}>{t('pay_credit')}</p>
                <p className="text-xs text-muted-foreground">
                  {creditEligible ? 'You are eligible for credit' : t('credit_unavailable')}
                </p>
              </div>
            </label>
          )}
        </RadioGroup>
      </Card>

      {/* Summary */}
      <Card className="p-4 space-y-2">
        <h2 className="text-sm font-semibold text-foreground mb-2">{t('checkout')}</h2>
        {items.slice(0, 5).map(item => {
          const price = item.unitType === 'pcs' || !item.customQty ? item.vendorPriceInr * item.qty : Math.round((item.vendorPriceInr / 1000) * item.customQty);
          return (
            <div key={item.storeProductId} className="flex justify-between text-xs">
              <span className="text-muted-foreground">{item.productName} · {item.unitType === 'pcs' ? `x${item.qty}` : `${item.customQty}${item.unitType}`}</span>
              <span className="text-foreground">{formatPrice(Math.round(price))}</span>
            </div>
          );
        })}
        {items.length > 5 && <p className="text-xs text-muted-foreground">+{items.length - 5} more items</p>}
        <div className="border-t pt-2 space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t('subtotal')}</span>
            <span className="text-foreground">{formatPrice(Math.round(subtotal))}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t('delivery_fee')}</span>
            <span className="text-foreground">{formatPrice(totalDeliveryFee)}</span>
          </div>
          <div className="border-t pt-2 flex justify-between text-base font-bold">
            <span>{t('total')}</span>
            <span>{formatPrice(Math.round(total))}</span>
          </div>
        </div>
      </Card>

      <Button onClick={handlePlaceOrder} disabled={placing || !selectedAddress} className="w-full h-12 rounded-xl text-base font-semibold">
        {placing ? 'Placing...' : `${t('place_order')} · ${formatPrice(Math.round(total))}`}
      </Button>
    </div>
  );
}
