import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLocation, PUNE_AREAS } from '@/contexts/LocationContext';
import { useCart } from '@/contexts/CartContext';
import { calculateDistance } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MapPin, Search, Clock, Navigation, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

export default function ShopsPage() {
  const navigate = useNavigate();
  const { userLocation, setUserLocation, areaName, setAreaName } = useLocation();
  const [radius, setRadius] = useState<number>(5);
  const [showLocationModal, setShowLocationModal] = useState(!userLocation);
  const [searchQuery, setSearchQuery] = useState('');
  const [gpsLoading, setGpsLoading] = useState(false);

  const lat = userLocation?.lat || 18.5204;
  const lng = userLocation?.lng || 73.8567;

  const { data: nearbyStores, isLoading } = useQuery({
    queryKey: ['nearbyStores', lat, lng, radius],
    queryFn: async () => {
      const { data } = await supabase.rpc('get_nearby_stores', { user_lat: lat, user_lng: lng, radius_km: radius });
      return data || [];
    },
    enabled: !!userLocation,
  });

  const filteredStores = useMemo(() => {
    if (!nearbyStores) return [];
    if (!searchQuery) return nearbyStores;
    const q = searchQuery.toLowerCase();
    return nearbyStores.filter((s: any) => s.store_name.toLowerCase().includes(q));
  }, [nearbyStores, searchQuery]);

  const handleUseGPS = () => {
    setGpsLoading(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
          setAreaName('Current Location');
          setGpsLoading(false);
          setShowLocationModal(false);
        },
        () => { toast.error('Unable to get location.'); setGpsLoading(false); }
      );
    } else { toast.error('Geolocation not supported.'); setGpsLoading(false); }
  };

  const handleSelectArea = (area: typeof PUNE_AREAS[0]) => {
    setUserLocation({ lat: area.lat, lng: area.lng });
    setAreaName(area.name);
    setShowLocationModal(false);
  };

  if (!userLocation) {
    return (
      <div className="px-4 py-4">
        <h1 className="font-display text-xl font-bold text-foreground mb-4">Choose Location</h1>
        <Card className="p-6 space-y-4">
          <Button onClick={handleUseGPS} disabled={gpsLoading} className="w-full h-12 rounded-xl gap-2">
            <Navigation className="h-4 w-4" />
            {gpsLoading ? 'Getting location...' : 'Use Current Location'}
          </Button>
          <p className="text-xs text-center text-muted-foreground">Or select your area</p>
          <div className="space-y-2">
            {PUNE_AREAS.map(area => (
              <button key={area.name} onClick={() => handleSelectArea(area)}
                className="w-full text-left px-4 py-3 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-colors">
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">{area.name}</span>
                </div>
              </button>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 space-y-4">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <Card className="p-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Shopping near</p>
              <p className="text-sm font-medium text-foreground">{areaName || `${lat.toFixed(4)}, ${lng.toFixed(4)}`}</p>
            </div>
            <button onClick={() => setShowLocationModal(true)} className="ml-2 text-primary text-xs hover:underline">Change</button>
          </div>
          <div className="flex gap-1">
            <Button size="sm" variant={radius === 2 ? 'default' : 'outline'} onClick={() => setRadius(2)} className="text-xs h-7 rounded-lg">2 km</Button>
            <Button size="sm" variant={radius === 5 ? 'default' : 'outline'} onClick={() => setRadius(5)} className="text-xs h-7 rounded-lg">5 km</Button>
            <Button size="sm" variant={radius === 10 ? 'default' : 'outline'} onClick={() => setRadius(10)} className="text-xs h-7 rounded-lg">10 km</Button>
          </div>
        </div>
      </Card>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search stores..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 h-10 rounded-xl text-sm" />
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
        </div>
      ) : filteredStores.length > 0 ? (
        <div className="space-y-2">
          {filteredStores.map((s: any) => (
            <Card key={s.store_id} className="p-3 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/vendors/${s.store_id}`)}>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-lg">🏪</div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-foreground truncate">{s.store_name}</h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" />{s.distance_km.toFixed(1)} km</span>
                    <span className="flex items-center gap-0.5"><Clock className="h-3 w-3" />~{Math.round(s.distance_km * 8 + 15)} min</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center py-8 text-sm text-muted-foreground">No stores found within {radius} km.</p>
      )}

      <Dialog open={showLocationModal} onOpenChange={setShowLocationModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Choose Location</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <Button onClick={handleUseGPS} disabled={gpsLoading} className="w-full h-11 rounded-xl gap-2">
              <Navigation className="h-4 w-4" />
              {gpsLoading ? 'Getting location...' : 'Use Current Location'}
            </Button>
            <p className="text-xs text-center text-muted-foreground">Or select area</p>
            <div className="space-y-2">
              {PUNE_AREAS.map(area => (
                <button key={area.name} onClick={() => handleSelectArea(area)}
                  className="w-full text-left px-4 py-2.5 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-colors">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">{area.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
