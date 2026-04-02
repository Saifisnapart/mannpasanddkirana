import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/contexts/CartContext';
import { useLocation } from '@/contexts/LocationContext';
import { calculateDistance } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, MapPin, Clock, Minus, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import QuantityInput from '@/components/product/QuantityInput';

function getUnitType(baseUnit: string): 'g' | 'ml' | 'pcs' {
  if (['gm', 'kg'].includes(baseUnit)) return 'g';
  if (['ml', 'litre'].includes(baseUnit)) return 'ml';
  return 'pcs';
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, items, updateQty, updateCustomQty } = useCart();
  const { userLocation } = useLocation();

  const [qty, setQty] = useState(1);
  const [customQty, setCustomQty] = useState(500);
  const [sortBy, setSortBy] = useState<'price' | 'stock'>('price');

  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data } = await supabase.from('products').select('*').eq('id', id!).single();
      return data;
    },
    enabled: !!id,
  });

  const { data: storeProducts, isLoading: spLoading } = useQuery({
    queryKey: ['storeProductsForProduct', id],
    queryFn: async () => {
      const { data } = await supabase
        .from('store_products')
        .select('*, stores(id, name, latitude, longitude, is_active, address)')
        .eq('product_id', id!)
        .eq('is_enabled', true);
      return data || [];
    },
    enabled: !!id,
  });

  if (productLoading || spLoading) {
    return (
      <div className="px-4 py-4 space-y-4">
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-32" />
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="px-4 py-16 text-center">
        <p className="text-muted-foreground">Product not found</p>
        <Button variant="outline" onClick={() => navigate(-1)} className="mt-4">Go Back</Button>
      </div>
    );
  }

  const unitType = getUnitType(product.base_unit);
  const isCountable = unitType === 'pcs';

  const sortedStoreProducts = [...(storeProducts || [])].sort((a: any, b: any) => {
    if (sortBy === 'price') return a.vendor_price_inr - b.vendor_price_inr;
    return b.stock_quantity - a.stock_quantity;
  }).map((sp: any) => {
    const dist = userLocation
      ? calculateDistance(userLocation.lat, userLocation.lng, sp.stores.latitude, sp.stores.longitude)
      : null;
    return { ...sp, distance: dist };
  });

  const handleAdd = (sp: any) => {
    addItem({
      storeProductId: sp.id,
      storeId: sp.store_id,
      productId: sp.product_id,
      vendorPriceInr: sp.vendor_price_inr,
      productName: product.name,
      baseUnit: product.base_unit,
      qty: isCountable ? qty : 1,
      customQty: isCountable ? undefined : customQty,
    });
    toast.success('Added to cart!');
  };

  return (
    <div className="px-4 py-4 space-y-5">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="w-full aspect-square max-w-xs mx-auto rounded-2xl bg-secondary flex items-center justify-center text-7xl">
        {product.image_url || '📦'}
      </div>

      <div>
        <h1 className="font-display text-xl font-bold text-foreground">{product.name}</h1>
        <p className="text-sm text-muted-foreground">{product.base_unit}</p>
        <p className="mt-1 text-lg font-bold text-foreground">₹{product.base_price_inr}</p>
        {product.description && <p className="text-sm text-muted-foreground mt-3">{product.description}</p>}
      </div>

      {/* Quantity selector */}
      <Card className="p-4">
        <p className="text-xs font-medium text-muted-foreground mb-2">
          {isCountable ? 'Select Quantity' : `Choose quantity (min 50 ${unitType === 'g' ? 'gm' : 'ml'}, step 50)`}
        </p>
        <div className="flex items-center gap-4">
          {isCountable ? (
            <div className="flex items-center gap-2 bg-secondary rounded-xl px-2 py-1">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-primary/10">
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center font-bold">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-primary/10">
                <Plus className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <QuantityInput value={customQty} onChange={setCustomQty} unitType={unitType as 'g' | 'ml'} min={50} step={50} />
          )}
        </div>
      </Card>

      {/* Store comparison */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-base font-bold text-foreground">Available at {sortedStoreProducts.length} store{sortedStoreProducts.length !== 1 ? 's' : ''}</h2>
          <div className="flex gap-1">
            <Button size="sm" variant={sortBy === 'price' ? 'default' : 'outline'} onClick={() => setSortBy('price')} className="text-xs h-7 rounded-lg">Cheapest</Button>
            <Button size="sm" variant={sortBy === 'stock' ? 'default' : 'outline'} onClick={() => setSortBy('stock')} className="text-xs h-7 rounded-lg">Most Stock</Button>
          </div>
        </div>
        <div className="space-y-2">
          {sortedStoreProducts.map((sp: any, idx: number) => {
            const cartItem = items.find(i => i.storeProductId === sp.id);
            const displayPrice = isCountable ? sp.vendor_price_inr * qty : Math.round((sp.vendor_price_inr / 1000) * customQty);
            return (
              <Card key={sp.id} className={`p-3 ${idx === 0 ? 'border-primary/30 border-2' : ''}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">{sp.stores.name}</p>
                      {idx === 0 && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">Best Price</span>}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      {sp.distance !== null && <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" />{sp.distance} km</span>}
                      <span>Stock: {sp.stock_quantity}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground">₹{displayPrice}</p>
                    <p className="text-[10px] text-muted-foreground">₹{sp.vendor_price_inr}/{product.base_unit}</p>
                  </div>
                </div>
                <div className="mt-2">
                  {cartItem ? (
                    <div className="flex items-center gap-2">
                      {isCountable ? (
                        <div className="flex items-center gap-2 bg-primary/10 rounded-xl px-3 py-1">
                          <button onClick={() => updateQty(sp.id, cartItem.qty - 1)} className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-primary/20 text-primary">
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-6 text-center font-bold text-primary">{cartItem.qty}</span>
                          <button onClick={() => updateQty(sp.id, cartItem.qty + 1)} className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-primary/20 text-primary">
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <QuantityInput value={cartItem.customQty || 500} onChange={(v) => updateCustomQty(sp.id, v)} unitType={unitType as 'g' | 'ml'} min={50} step={50} />
                      )}
                      <Button onClick={() => navigate('/cart')} className="flex-1 rounded-xl h-9 text-sm">View Cart</Button>
                    </div>
                  ) : (
                    <Button onClick={() => handleAdd(sp)} disabled={sp.stock_quantity === 0} className="w-full rounded-xl h-9 text-sm font-semibold">
                      Add · ₹{displayPrice}
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
