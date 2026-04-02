import { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/contexts/CartContext';
import { useLocation } from '@/contexts/LocationContext';
import { calculateDistance } from '@/lib/utils';
import TopSearchBar from '@/components/layout/TopSearchBar';
import EmptyState from '@/components/common/EmptyState';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Tag, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { userLocation } = useLocation();
  const [sortBy, setSortBy] = useState<'price' | 'stock'>('price');

  // Search products by name or category name
  const { data: products, isLoading } = useQuery({
    queryKey: ['searchProducts', query],
    queryFn: async () => {
      if (!query) return [];

      // Search by product name
      const { data: byName } = await supabase
        .from('products')
        .select('*')
        .ilike('name', `%${query}%`);

      // Also search by category name
      const { data: cats } = await supabase
        .from('categories')
        .select('id')
        .ilike('name', `%${query}%`);

      let byCategory: any[] = [];
      if (cats && cats.length > 0) {
        const catIds = cats.map(c => c.id);
        const { data } = await supabase
          .from('products')
          .select('*')
          .in('category_id', catIds);
        byCategory = data || [];
      }

      // Merge and dedupe
      const all = [...(byName || []), ...byCategory];
      const unique = Array.from(new Map(all.map(p => [p.id, p])).values());
      return unique;
    },
    enabled: !!query,
  });

  // Get store_products for all found products
  const productIds = products?.map(p => p.id) || [];
  const { data: storeProducts } = useQuery({
    queryKey: ['searchStoreProducts', productIds],
    queryFn: async () => {
      if (productIds.length === 0) return [];
      const { data } = await supabase
        .from('store_products')
        .select('*, stores(id, name, latitude, longitude, is_active), products(name, base_unit, base_price_inr, image_url)')
        .in('product_id', productIds)
        .eq('is_enabled', true);
      return data || [];
    },
    enabled: productIds.length > 0,
  });

  const sortedResults = useMemo(() => {
    if (!storeProducts) return [];
    const withDistance = storeProducts.map((sp: any) => ({
      ...sp,
      distance: userLocation ? calculateDistance(userLocation.lat, userLocation.lng, sp.stores.latitude, sp.stores.longitude) : null,
    }));
    return withDistance.sort((a: any, b: any) => {
      if (sortBy === 'price') return a.vendor_price_inr - b.vendor_price_inr;
      return b.stock_quantity - a.stock_quantity;
    });
  }, [storeProducts, sortBy, userLocation]);

  const lowestPrice = sortedResults.length ? Math.min(...sortedResults.map((sp: any) => sp.vendor_price_inr)) : 0;

  const handleChooseVendor = (sp: any) => {
    addItem({
      storeProductId: sp.id,
      storeId: sp.store_id,
      productId: sp.product_id,
      vendorPriceInr: sp.vendor_price_inr,
      productName: sp.products.name,
      baseUnit: sp.products.base_unit,
    });
    toast.success('Added to cart!');
  };

  return (
    <div className="px-4 py-4 space-y-4">
      <TopSearchBar initialQuery={query} compact />

      <div className="flex items-center justify-between gap-2">
        <div className="text-sm text-muted-foreground">
          {sortedResults.length > 0 && (
            <span><strong className="text-foreground">{sortedResults.length}</strong> results for <strong className="text-foreground">{query}</strong></span>
          )}
        </div>
        <div className="flex gap-1">
          <Button size="sm" variant={sortBy === 'price' ? 'default' : 'outline'} onClick={() => setSortBy('price')} className="text-xs h-7 rounded-lg">Cheapest</Button>
          <Button size="sm" variant={sortBy === 'stock' ? 'default' : 'outline'} onClick={() => setSortBy('stock')} className="text-xs h-7 rounded-lg">Most Stock</Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)}
        </div>
      ) : sortedResults.length > 0 ? (
        <div className="space-y-3">
          {sortedResults.map((sp: any) => (
            <Card key={sp.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex gap-3">
                <div className="shrink-0 w-16 h-16 rounded-lg bg-secondary flex items-center justify-center text-3xl">
                  {sp.products.image_url || '📦'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap gap-1 mb-1">
                    {sp.vendor_price_inr === lowestPrice && (
                      <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] px-1.5 py-0">
                        <Tag className="h-2.5 w-2.5 mr-0.5" /> Lowest Price
                      </Badge>
                    )}
                    {sp.stock_quantity < 10 && sp.stock_quantity > 0 && (
                      <Badge variant="destructive" className="text-[10px] px-1.5 py-0">Low Stock</Badge>
                    )}
                  </div>
                  <h3 className="font-semibold text-sm text-foreground leading-tight">{sp.products.name}</h3>
                  <p className="text-xs text-muted-foreground">{sp.products.base_unit}</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-lg font-bold text-foreground">₹{sp.vendor_price_inr}</span>
                    {sp.products.base_price_inr > sp.vendor_price_inr && (
                      <span className="text-xs text-muted-foreground line-through">₹{sp.products.base_price_inr}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">{sp.stores.name}</span>
                    {sp.distance !== null && (
                      <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" />{sp.distance} km</span>
                    )}
                    <span>Stock: {sp.stock_quantity}</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" onClick={() => handleChooseVendor(sp)} disabled={sp.stock_quantity === 0} className="text-xs h-8 px-4 rounded-lg">
                      Choose Vendor
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => navigate(`/products/${sp.product_id}`)} className="text-xs h-8 px-3 rounded-lg">
                      Compare
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : query ? (
        <EmptyState type="search" query={query} />
      ) : null}
    </div>
  );
}
