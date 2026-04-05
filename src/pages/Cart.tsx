import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLocation } from '@/contexts/LocationContext';
import { calculateDistance, calculateDeliveryFee } from '@/lib/utils';
import EmptyState from '@/components/common/EmptyState';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Minus, Plus, Trash2, ArrowRight, Truck, MapPin } from 'lucide-react';
import QuantityInput from '@/components/product/QuantityInput';

export default function Cart() {
  const navigate = useNavigate();
  const { items, updateQty, updateCustomQty, removeItem, clearCart, subtotal, storeIds } = useCart();
  const { userLocation } = useLocation();
  const { formatPrice } = useCurrency();
  const { t } = useLanguage();

  const { data: stores } = useQuery({
    queryKey: ['cartStores', storeIds],
    queryFn: async () => {
      if (storeIds.length === 0) return [];
      const { data } = await supabase.from('stores').select('*').in('id', storeIds);
      return data || [];
    },
    enabled: storeIds.length > 0,
  });

  if (items.length === 0) {
    return <EmptyState type="cart" />;
  }

  const groupedItems = new Map<string, typeof items>();
  for (const item of items) {
    const group = groupedItems.get(item.storeId) || [];
    group.push(item);
    groupedItems.set(item.storeId, group);
  }

  const storeDeliveryInfo = storeIds.map(sId => {
    const store = stores?.find((s: any) => s.id === sId);
    if (!store || !userLocation) return { storeId: sId, distance: 0, fee: 10, name: store?.name || '' };
    const dist = calculateDistance(userLocation.lat, userLocation.lng, store.latitude, store.longitude);
    return { storeId: sId, distance: dist, fee: calculateDeliveryFee(dist), name: store.name };
  });

  const totalDeliveryFee = storeDeliveryInfo.reduce((sum, v) => sum + v.fee, 0);
  const total = subtotal + totalDeliveryFee;
  const isMultiStore = storeIds.length > 1;

  const getItemPrice = (item: typeof items[0]) => {
    if (item.unitType === 'pcs' || !item.customQty) {
      return item.vendorPriceInr * item.qty;
    }
    return Math.round((item.vendorPriceInr / 1000) * item.customQty);
  };

  return (
    <div className="px-4 py-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl font-bold text-foreground">{t('cart')}</h1>
        <Button variant="ghost" size="sm" onClick={clearCart} className="text-destructive text-xs h-8 gap-1">
          <Trash2 className="h-3 w-3" /> {t('cancel')}
        </Button>
      </div>

      {isMultiStore && (
        <div className="flex items-start gap-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3">
          <Truck className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
          <p className="text-xs text-foreground">Your cart has items from multiple stores. Split order delivery applies.</p>
        </div>
      )}

      {Array.from(groupedItems.entries()).map(([sId, sItems], idx) => {
        const store = stores?.find((s: any) => s.id === sId);
        const sSubtotal = sItems.reduce((sum, item) => sum + getItemPrice(item), 0);
        const sDelivery = storeDeliveryInfo.find(d => d.storeId === sId);

        return (
          <Card key={sId} className={`p-4 ${idx === 0 && isMultiStore ? 'border-primary/30 border-2' : ''}`}>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm">🏪</div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{store?.name || 'Store'}</p>
              </div>
            </div>
            {sItems.map(item => (
              <div key={item.storeProductId} className="flex items-center gap-3 py-3 border-b border-border last:border-0">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{item.productName}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.unitType === 'pcs'
                      ? `${item.qty} × ${formatPrice(item.vendorPriceInr)}`
                      : item.customQty
                        ? `${item.customQty >= 1000 ? `${(item.customQty / 1000).toFixed(1)} ${item.unitType === 'g' ? 'kg' : 'L'}` : `${item.customQty} ${item.unitType === 'g' ? 'gm' : 'ml'}`}`
                        : formatPrice(item.vendorPriceInr)
                    }
                  </p>
                  <p className="text-sm font-bold text-foreground mt-0.5">{formatPrice(Math.round(getItemPrice(item)))}</p>
                </div>
                <div className="flex items-center gap-1">
                  {item.unitType === 'pcs' ? (
                    <>
                      <button onClick={() => updateQty(item.storeProductId, item.qty - 1)} className="h-7 w-7 flex items-center justify-center rounded-md bg-secondary text-foreground hover:bg-primary/10">
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-6 text-center text-sm font-bold">{item.qty}</span>
                      <button onClick={() => updateQty(item.storeProductId, item.qty + 1)} className="h-7 w-7 flex items-center justify-center rounded-md bg-secondary text-foreground hover:bg-primary/10">
                        <Plus className="h-3 w-3" />
                      </button>
                    </>
                  ) : (
                    <QuantityInput value={item.customQty || 500} onChange={(v) => updateCustomQty(item.storeProductId, v)} unitType={(item.unitType || 'g') as 'g' | 'ml'} min={50} step={50} />
                  )}
                  <button onClick={() => removeItem(item.storeProductId)} className="h-7 w-7 flex items-center justify-center rounded-md text-destructive hover:bg-destructive/10 ml-1">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
            <div className="mt-2 pt-2 border-t border-border space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t('subtotal')}</span>
                <span className="font-medium text-foreground">{formatPrice(Math.round(sSubtotal))}</span>
              </div>
              {sDelivery && (
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {sDelivery.distance} km · {t('delivery_fee')}
                  </span>
                  <span className="font-medium text-foreground">{formatPrice(sDelivery.fee)}</span>
                </div>
              )}
            </div>
          </Card>
        );
      })}

      <Card className="p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{t('subtotal')}</span>
          <span className="font-medium text-foreground">{formatPrice(Math.round(subtotal))}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{t('delivery_fee')}</span>
          <span className="font-medium text-foreground">{formatPrice(totalDeliveryFee)}</span>
        </div>
        <div className="border-t pt-2 flex justify-between text-base">
          <span className="font-semibold text-foreground">{t('total')}</span>
          <span className="font-bold text-foreground">{formatPrice(Math.round(total))}</span>
        </div>
      </Card>

      <Button onClick={() => navigate('/checkout')} className="w-full h-12 rounded-xl text-base font-semibold">
        {t('proceed_checkout')} · {formatPrice(Math.round(total))} <ArrowRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
}
