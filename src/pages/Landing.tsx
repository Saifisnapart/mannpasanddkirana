import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import TopSearchBar from '@/components/layout/TopSearchBar';
import { vendors, categories, quickSearches, popularItems, getProduct } from '@/data/sampleData';
import { Star, MapPin, Clock, ArrowRight, ShoppingBag, Store, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocation, PUNE_AREAS } from '@/contexts/LocationContext';

export default function Landing() {
  const navigate = useNavigate();
  const { userLocation, setUserLocation, setAreaName } = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container max-w-4xl mx-auto px-4 pt-12 pb-16 md:pt-20 md:pb-24">
          <div className="flex items-center gap-2 mb-6">
            <Store className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary font-serif">MannPasandd</span>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-3xl md:text-5xl font-extrabold text-foreground leading-tight mb-4"
          >
            Fresh Groceries & Meat<br />
            <span className="text-primary">Delivered to Your Door</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-base md:text-lg mb-8 max-w-md"
          >
            Shop from nearby stores within 1-2 km. Compare prices, get the best deals, enjoy fast delivery.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <TopSearchBar showChips />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex gap-6 mt-8 text-xs text-muted-foreground"
          >
            <span className="flex items-center gap-1"><ShoppingBag className="h-4 w-4 text-primary" /> 50+ Products</span>
            <span className="flex items-center gap-1"><Store className="h-4 w-4 text-primary" /> 7 Vendors</span>
            <span className="flex items-center gap-1"><Clock className="h-4 w-4 text-primary" /> 22 min Delivery</span>
          </motion.div>
        </div>
      </section>

      {/* Quick Location Select */}
      {!userLocation && (
        <section className="container max-w-4xl mx-auto px-4 py-8">
          <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Navigation className="h-5 w-5 text-primary" /> Select Your Area
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {PUNE_AREAS.map(area => (
              <button
                key={area.name}
                onClick={() => {
                  setUserLocation({ lat: area.lat, lng: area.lng });
                  setAreaName(area.name);
                  navigate('/shops');
                }}
                className="flex items-center gap-2 p-4 rounded-xl bg-card border border-border hover:border-primary hover:shadow-md transition-all"
              >
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">{area.name}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="container max-w-4xl mx-auto px-4 py-10">
        <h2 className="font-display text-xl font-bold text-foreground mb-4">Shop by Category</h2>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
          {categories.map((cat) => {
            const emojis: Record<string, string> = {
              Dairy: '🥛', Staples: '🌾', Oils: '🫒', Snacks: '🍪', Beverages: '☕',
              Cleaning: '🧹', 'Personal Care': '🧴', Fruits: '🍎', Vegetables: '🥬', Meat: '🍗'
            };
            return (
              <button
                key={cat}
                onClick={() => navigate(`/search?q=${encodeURIComponent(cat)}`)}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border hover:border-primary hover:shadow-md transition-all"
              >
                <span className="text-2xl">{emojis[cat] || '📦'}</span>
                <span className="text-xs font-medium text-foreground">{cat}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Featured Vendors */}
      <section className="container max-w-4xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-bold text-foreground">Featured Vendors</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate('/home')} className="text-xs text-primary">
            View All <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {vendors.slice(0, 6).map(v =>
            <Card key={v.id} className="p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/vendors/${v.slug}`)}>
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-xl shrink-0">{v.image}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-foreground">{v.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    <span className="flex items-center gap-0.5"><Star className="h-3 w-3 fill-accent text-accent" />{v.rating}</span>
                    <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" />{v.locality}</span>
                    <span className="flex items-center gap-0.5"><Clock className="h-3 w-3" />{v.deliveryEstimate}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{v.description}</p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </section>

      {/* Popular Items */}
      <section className="container max-w-4xl mx-auto px-4 py-10 pb-16">
        <h2 className="font-display text-xl font-bold text-foreground mb-4">Popular Items</h2>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {quickSearches.map(item =>
            <button key={item} onClick={() => navigate(`/search?q=${encodeURIComponent(item)}`)}
              className="shrink-0 px-5 py-3 rounded-xl bg-card border border-border hover:border-primary hover:shadow-md transition-all text-sm font-medium text-foreground">
              {item}
            </button>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="container max-w-4xl mx-auto px-4 pb-16 text-center">
        <Button size="lg" onClick={() => navigate('/home')} className="rounded-xl px-8 h-12 text-base font-semibold">
          Start Shopping <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </section>
    </div>
  );
}
