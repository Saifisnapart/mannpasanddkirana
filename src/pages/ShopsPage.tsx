import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation, PUNE_AREAS } from '@/contexts/LocationContext';
import { useCart } from '@/contexts/CartContext';
import { getVendorsWithinRadius, rankVendors, formatCurrency, cn } from '@/lib/utils';
import { products, vendorListings, getProduct, formatPrice } from '@/data/sampleData';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MapPin, Search, Star, Clock, Navigation, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function ShopsPage() {
  const navigate = useNavigate();
  const { userLocation, setUserLocation, areaName, setAreaName } = useLocation();
  const { items, addItem } = useCart();
  const [radius, setRadius] = useState<1 | 2>(1);
  const [showLocationModal, setShowLocationModal] = useState(!userLocation);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [gpsLoading, setGpsLoading] = useState(false);

  const nearbyVendors = useMemo(() => {
    if (!userLocation) return [];
    return getVendorsWithinRadius(userLocation.lat, userLocation.lng, radius);
  }, [userLocation, radius]);

  const shopRankings = useMemo(() => {
    if (!userLocation || items.length === 0) return [];
    return rankVendors(items, userLocation.lat, userLocation.lng, radius);
  }, [items, userLocation, radius]);

  const categoryList = ['all', 'dairy', 'staples', 'oils', 'snacks', 'beverages', 'cleaning', 'personal_care', 'fruits', 'vegetables', 'meat'];

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(p => p.isActive);
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category.toLowerCase() === selectedCategory);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.searchTerms.some(t => t.includes(q))
      );
    }
    return filtered;
  }, [selectedCategory, searchQuery]);

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
        () => {
          toast.error('Unable to get location. Please select area manually.');
          setGpsLoading(false);
        }
      );
    } else {
      toast.error('Geolocation not supported.');
      setGpsLoading(false);
    }
  };

  const handleSelectArea = (area: typeof PUNE_AREAS[0]) => {
    setUserLocation({ lat: area.lat, lng: area.lng });
    setAreaName(area.name);
    setShowLocationModal(false);
  };

  const handleAddToCart = (productId: string, vendorId: string) => {
    const listing = vendorListings.find(l => l.vendorId === vendorId && l.productId === productId && l.stock !== 'out_of_stock');
    if (listing) {
      addItem(listing.id);
      toast.success('Added to cart!');
    }
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
              <button
                key={area.name}
                onClick={() => handleSelectArea(area)}
                className="w-full text-left px-4 py-3 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-colors"
              >
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

      {/* Location + Radius */}
      <Card className="p-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Shopping near</p>
              <p className="text-sm font-medium text-foreground">{areaName || `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`}</p>
            </div>
            <button onClick={() => setShowLocationModal(true)} className="ml-2 text-primary text-xs hover:underline">Change</button>
          </div>
          <div className="flex gap-1">
            <Button size="sm" variant={radius === 1 ? 'default' : 'outline'} onClick={() => setRadius(1)} className="text-xs h-7 rounded-lg">1 km</Button>
            <Button size="sm" variant={radius === 2 ? 'default' : 'outline'} onClick={() => setRadius(2)} className="text-xs h-7 rounded-lg">2 km</Button>
          </div>
        </div>
        {nearbyVendors.length === 0 && (
          <div className="mt-3 p-2 bg-accent/10 rounded-lg">
            <p className="text-xs text-accent-foreground">
              No shops found within {radius} km.
              {radius === 1 && <button onClick={() => setRadius(2)} className="ml-1 underline font-medium">Try 2 km</button>}
            </p>
          </div>
        )}
      </Card>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="pl-10 h-10 rounded-xl text-sm"
        />
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {categoryList.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              'shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
              selectedCategory === cat ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
            )}
          >
            {cat === 'all' ? 'All' : cat.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </button>
        ))}
      </div>

      {/* Shop Rankings */}
      {shopRankings.length > 0 && (
        <Card className="p-3">
          <h3 className="text-sm font-bold text-foreground mb-2">🏆 Best Shops for Your Cart</h3>
          <div className="space-y-2">
            {shopRankings.slice(0, 3).map(ranking => (
              <div key={ranking.vendor.id} className={cn(
                'p-2 rounded-lg border',
                ranking.isBestMatch ? 'border-primary bg-primary/5' : 'border-border'
              )}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{ranking.vendor.image}</span>
                    <div>
                      <div className="flex items-center gap-1">
                        <p className="text-sm font-medium text-foreground">{ranking.vendor.name}</p>
                        {ranking.isBestMatch && <Badge className="bg-primary text-primary-foreground text-[9px] px-1 py-0">BEST</Badge>}
                      </div>
                      <p className="text-[10px] text-muted-foreground">{ranking.availableItems}/{ranking.totalItems} items • {ranking.distance} km</p>
                    </div>
                  </div>
                  {ranking.availableItems > 0 && (
                    <div className="text-right">
                      <p className="text-sm font-bold text-primary">{formatCurrency(ranking.cartTotal)}</p>
                      <p className="text-[10px] text-muted-foreground">cart total</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {filteredProducts.map(product => {
          const availableShops = nearbyVendors
            .map(({ vendor, distance }) => {
              const listing = vendorListings.find(l => l.vendorId === vendor.id && l.productId === product.id && l.stock !== 'out_of_stock' && l.stockQty > 0);
              if (!listing) return null;
              return { vendor, listing, distance };
            })
            .filter(Boolean) as { vendor: typeof nearbyVendors[0]['vendor']; listing: typeof vendorListings[0]; distance: number }[];

          availableShops.sort((a, b) => a.listing.price - b.listing.price);
          if (availableShops.length === 0) return null;

          const cheapest = availableShops[0];

          return (
            <Card key={product.id} className="p-3 hover:shadow-md transition-shadow">
              <div className="text-5xl mb-2 text-center">{product.image}</div>
              <h4 className="text-xs font-medium text-foreground truncate">{product.name}</h4>
              <p className="text-[10px] text-muted-foreground">{product.unit}</p>
              <div className="flex items-center justify-between mt-1 mb-2">
                <div>
                  <p className="text-sm font-bold text-primary">{formatPrice(cheapest.listing.price)}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{cheapest.vendor.name}</p>
                </div>
                <span className="text-[10px] text-muted-foreground">{cheapest.distance} km</span>
              </div>
              {availableShops.length > 1 && (
                <p className="text-[10px] text-info mb-1">+{availableShops.length - 1} more shop{availableShops.length > 2 ? 's' : ''}</p>
              )}
              <Button
                size="sm"
                variant="outline"
                className="w-full text-xs h-7 rounded-lg border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                onClick={() => handleAddToCart(product.id, cheapest.vendor.id)}
              >
                Add to Cart
              </Button>
            </Card>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12 text-muted-foreground text-sm">No products found</div>
      )}

      {/* Location Modal */}
      <Dialog open={showLocationModal} onOpenChange={setShowLocationModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Choose Location</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Button onClick={handleUseGPS} disabled={gpsLoading} className="w-full h-11 rounded-xl gap-2">
              <Navigation className="h-4 w-4" />
              {gpsLoading ? 'Getting location...' : 'Use Current Location'}
            </Button>
            <p className="text-xs text-center text-muted-foreground">Or select area</p>
            <div className="space-y-2">
              {PUNE_AREAS.map(area => (
                <button
                  key={area.name}
                  onClick={() => handleSelectArea(area)}
                  className="w-full text-left px-4 py-2.5 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-colors"
                >
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
