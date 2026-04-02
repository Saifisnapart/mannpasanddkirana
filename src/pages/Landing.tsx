import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import TopSearchBar from '@/components/layout/TopSearchBar';
import { MapPin, Clock, ArrowRight, ShoppingBag, Store, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocation, PUNE_AREAS } from '@/contexts/LocationContext';

export default function Landing() {
  const navigate = useNavigate();
  const { userLocation, setUserLocation, setAreaName } = useLocation();

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await supabase.from('categories').select('*').is('parent_id', null).order('name');
      return data || [];
    },
  });

  const emojis: Record<string, string> = {
    'Groceries': '🌾', 'Dairy': '🥛', 'Oils': '🫒', 'Snacks': '🍪', 'Beverages': '☕',
    'Cleaning': '🧹', 'Personal Care': '🧴', 'Fruits': '🍎', 'Vegetables': '🥬', 'Meat': '🍗',
    'Ready to Eat': '🍲', 'Staples': '🌾',
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container max-w-4xl mx-auto px-4 pt-12 pb-16 md:pt-20 md:pb-24">
          <div className="flex items-center gap-2 mb-6">
            <Store className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary font-serif">MannPasandd</span>
          </div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="font-display text-3xl md:text-5xl font-extrabold text-foreground leading-tight mb-4">
            Fresh Groceries & Meat<br /><span className="text-primary">Delivered to Your Door</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-muted-foreground text-base md:text-lg mb-8 max-w-md">
            Shop from nearby stores. Compare prices, get the best deals, enjoy fast delivery.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <TopSearchBar showChips />
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="flex gap-6 mt-8 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><ShoppingBag className="h-4 w-4 text-primary" /> Products</span>
            <span className="flex items-center gap-1"><Store className="h-4 w-4 text-primary" /> Nearby Stores</span>
            <span className="flex items-center gap-1"><Clock className="h-4 w-4 text-primary" /> Fast Delivery</span>
          </motion.div>
        </div>
      </section>

      {!userLocation && (
        <section className="container max-w-4xl mx-auto px-4 py-8">
          <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Navigation className="h-5 w-5 text-primary" /> Select Your Area
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {PUNE_AREAS.map(area => (
              <button key={area.name} onClick={() => {
                setUserLocation({ lat: area.lat, lng: area.lng });
                setAreaName(area.name);
                navigate('/login');
              }}
                className="flex items-center gap-2 p-4 rounded-xl bg-card border border-border hover:border-primary hover:shadow-md transition-all">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">{area.name}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="container max-w-4xl mx-auto px-4 py-10">
        <h2 className="font-display text-xl font-bold text-foreground mb-4">Shop by Category</h2>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
          {categories?.map(cat => (
            <button key={cat.id} onClick={() => navigate(`/search?q=${encodeURIComponent(cat.name)}`)}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border hover:border-primary hover:shadow-md transition-all">
              <span className="text-2xl">{emojis[cat.name] || '📦'}</span>
              <span className="text-xs font-medium text-foreground">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="container max-w-4xl mx-auto px-4 pb-16 text-center">
        <Button size="lg" onClick={() => navigate('/login')} className="rounded-xl px-8 h-12 text-base font-semibold">
          Start Shopping <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </section>
    </div>
  );
}
