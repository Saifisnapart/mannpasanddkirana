import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import TopSearchBar from '@/components/layout/TopSearchBar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, ArrowRight, Store as StoreIcon } from 'lucide-react';
import { useLocation } from '@/contexts/LocationContext';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

export default function CustomerHome() {
  const navigate = useNavigate();
  const { userLocation, areaName } = useLocation();
  const { user } = useAuth();

  const { data: categories, isLoading: catLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await supabase.from('categories').select('*').is('parent_id', null).order('name');
      return data || [];
    },
  });

  // Get user's default address for location
  const { data: defaultAddress } = useQuery({
    queryKey: ['defaultAddress', user?.id],
    queryFn: async () => {
      const { data } = await supabase.from('addresses').select('*').eq('user_id', user!.id).eq('is_default', true).maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  const lat = userLocation?.lat || defaultAddress?.latitude || 18.5204;
  const lng = userLocation?.lng || defaultAddress?.longitude || 73.8567;

  const { data: nearbyStores, isLoading: storesLoading } = useQuery({
    queryKey: ['nearbyStores', lat, lng],
    queryFn: async () => {
      const { data } = await supabase.rpc('get_nearby_stores', { user_lat: lat, user_lng: lng, radius_km: 10 });
      return data || [];
    },
  });

  const emojis: Record<string, string> = {
    'Groceries': '🌾', 'Dairy': '🥛', 'Oils': '🫒', 'Snacks': '🍪', 'Beverages': '☕',
    'Cleaning': '🧹', 'Personal Care': '🧴', 'Fruits': '🍎', 'Vegetables': '🥬', 'Meat': '🍗',
    'Staples': '🌾', 'Ready to Eat': '🍲',
  };

  return (
    <div className="px-4 py-4 space-y-6">
      <div className="flex items-center justify-between md:hidden">
        <div>
          <h1 className="font-display text-lg font-bold text-foreground">MannPasandd</h1>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {areaName || defaultAddress?.city || 'Pune'}
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={() => navigate('/shops')} className="text-xs h-7 rounded-lg gap-1">
          <StoreIcon className="h-3 w-3" /> Nearby Shops
        </Button>
      </div>

      <TopSearchBar showChips />

      {/* Categories */}
      <section>
        <h2 className="font-display text-base font-bold text-foreground mb-3">Popular Categories</h2>
        {catLoading ? (
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-4 md:grid-cols-5 gap-2">
            {categories?.map(cat => (
              <button key={cat.id} onClick={() => navigate(`/search?q=${encodeURIComponent(cat.name)}`)}
                className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-secondary transition-colors">
                <span className="text-xl">{emojis[cat.name] || '📦'}</span>
                <span className="text-[10px] font-medium text-foreground text-center leading-tight">{cat.name}</span>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* No default address prompt */}
      {!defaultAddress && !userLocation && (
        <Card className="p-4 border-primary/30 bg-primary/5">
          <p className="text-sm text-foreground font-medium mb-2">Set your location to see nearby stores</p>
          <Button size="sm" onClick={() => navigate('/profile')} className="rounded-lg text-xs">
            Add Address
          </Button>
        </Card>
      )}

      {/* Nearby Stores */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-base font-bold text-foreground">Nearby Stores</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate('/shops')} className="text-xs text-primary h-7">
            Browse by Location <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
        {storesLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
          </div>
        ) : nearbyStores && nearbyStores.length > 0 ? (
          <div className="space-y-2">
            {nearbyStores.map((s: any) => (
              <Card key={s.store_id} className="p-3 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/vendors/${s.store_id}`)}>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-lg shrink-0">🏪</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-foreground truncate">{s.store_name}</h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" />{s.distance_km.toFixed(1)} km</span>
                      <span className="flex items-center gap-0.5"><Clock className="h-3 w-3" />~{Math.round(s.distance_km * 8 + 15)} min</span>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">No stores found nearby. Try a different location.</p>
        )}
      </section>
    </div>
  );
}
