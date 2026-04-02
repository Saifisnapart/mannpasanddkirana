import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Clock, Package, Search, ArrowLeft } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

export default function VendorStorefront() {
  const { slug } = useParams(); // slug is actually store_id now
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const { data: store, isLoading: storeLoading } = useQuery({
    queryKey: ['store', slug],
    queryFn: async () => {
      const { data } = await supabase.from('stores').select('*').eq('id', slug!).single();
      return data;
    },
    enabled: !!slug,
  });

  const { data: storeProducts, isLoading: productsLoading } = useQuery({
    queryKey: ['storeProducts', slug],
    queryFn: async () => {
      const { data } = await supabase
        .from('store_products')
        .select('*, products(*)')
        .eq('store_id', slug!)
        .eq('is_enabled', true);
      return data || [];
    },
    enabled: !!slug,
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await supabase.from('categories').select('*').is('parent_id', null).order('name');
      return data || [];
    },
  });

  if (storeLoading) {
    return (
      <div className="px-4 py-4 space-y-4">
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-10 rounded-xl" />
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-48 rounded-lg" />)}
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="px-4 py-16 text-center">
        <p className="text-muted-foreground">Store not found</p>
        <Button variant="outline" onClick={() => navigate('/home')} className="mt-4">Go Home</Button>
      </div>
    );
  }

  const filteredProducts = (storeProducts || []).filter((sp: any) => {
    const product = sp.products;
    if (!product) return false;
    const matchSearch = !search || product.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = !activeCategory || product.category_id === activeCategory;
    return matchSearch && matchCategory;
  });

  const handleAdd = (sp: any) => {
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
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 p-5">
        <div className="flex items-start gap-3">
          <div className="h-14 w-14 rounded-xl bg-card flex items-center justify-center text-2xl shrink-0 shadow-sm">🏪</div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="font-display text-lg font-bold text-foreground">{store.name}</h1>
              {store.is_active ? (
                <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px]">Open</Badge>
              ) : (
                <Badge variant="destructive" className="text-[10px]">Closed</Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{store.address}</p>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" />{store.service_radius_km} km radius</span>
              <span className="flex items-center gap-0.5"><Package className="h-3 w-3" />{storeProducts?.length || 0} products</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder={`Search in ${store.name}...`} value={search} onChange={e => setSearch(e.target.value)} className="pl-10 h-10 rounded-xl text-sm" />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <button onClick={() => setActiveCategory(null)}
          className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${!activeCategory ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
          All
        </button>
        {categories?.map(cat => (
          <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${activeCategory === cat.id ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
            {cat.name}
          </button>
        ))}
      </div>

      {productsLoading ? (
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-48 rounded-lg" />)}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {filteredProducts.map((sp: any) => {
            const product = sp.products;
            return (
              <Card key={sp.id} className="p-3 hover:shadow-md transition-shadow">
                <div className="w-full aspect-square rounded-lg bg-secondary flex items-center justify-center text-4xl mb-2">
                  {product.image_url || '📦'}
                </div>
                <h4 className="font-semibold text-xs text-foreground leading-tight truncate">{product.name}</h4>
                <p className="text-[11px] text-muted-foreground">{product.base_unit}</p>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-sm font-bold text-foreground">₹{sp.vendor_price_inr}</span>
                  {product.base_price_inr > sp.vendor_price_inr && (
                    <span className="text-[10px] text-muted-foreground line-through">₹{product.base_price_inr}</span>
                  )}
                </div>
                {sp.stock_quantity < 10 && sp.stock_quantity > 0 && (
                  <p className="text-[10px] text-destructive mt-0.5 font-medium">Low stock ({sp.stock_quantity})</p>
                )}
                {sp.stock_quantity === 0 && (
                  <p className="text-[10px] text-destructive mt-0.5 font-medium">Out of stock</p>
                )}
                <Button size="sm" variant="outline"
                  className="w-full text-xs h-8 rounded-lg border-primary text-primary hover:bg-primary hover:text-primary-foreground mt-2"
                  onClick={() => handleAdd(sp)} disabled={sp.stock_quantity === 0}>
                  Add
                </Button>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground text-sm">No products found</div>
      )}
    </div>
  );
}
