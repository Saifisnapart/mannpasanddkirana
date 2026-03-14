import { useNavigate } from 'react-router-dom';
import TopSearchBar from '@/components/layout/TopSearchBar';
import { Card } from '@/components/ui/card';
import { vendors, categories, quickSearches, products } from '@/data/sampleData';
import { Star, MapPin, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CustomerHome() {
  const navigate = useNavigate();

  const emojis: Record<string, string> = {
    Dairy: '🥛', Staples: '🌾', Oils: '🫒', Snacks: '🍪', Beverages: '☕',
    Cleaning: '🧹', 'Personal Care': '🧴', Fruits: '🍎', Vegetables: '🥬', Gourmet: '🧀'
  };

  return (
    <div className="px-4 py-4 space-y-6">
      {/* Logo + Location */}
      <div className="flex items-center justify-between md:hidden">
        <div>
          <h1 className="font-display text-lg font-bold text-foreground">VendorChoice</h1>
          <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" /> Pimpri-Chinchwad, Pune</p>
        </div>
      </div>

      {/* Search */}
      <TopSearchBar showChips />

      {/* Popular Categories */}
      <section>
        <h2 className="font-display text-base font-bold text-foreground mb-3">Popular Categories</h2>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => navigate(`/search?q=${encodeURIComponent(cat)}`)}
              className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-secondary transition-colors"
            >
              <span className="text-xl">{emojis[cat] || '📦'}</span>
              <span className="text-[10px] font-medium text-foreground text-center leading-tight">{cat}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Nearby Vendors */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-base font-bold text-foreground">Nearby Vendors</h2>
        </div>
        <div className="space-y-2">
          {vendors.map(v => (
            <Card
              key={v.id}
              className="p-3 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(`/vendors/${v.slug}`)}
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-lg shrink-0">🏪</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm text-foreground truncate">{v.name}</h3>
                    {v.isOpen ? (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">Open</span>
                    ) : (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-destructive/10 text-destructive font-medium">Closed</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    <span className="flex items-center gap-0.5"><Star className="h-3 w-3 fill-accent text-accent" />{v.rating}</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5"><Clock className="h-3 w-3" />{v.deliveryEstimate}</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" />{v.locality}</span>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Frequently Bought */}
      <section>
        <h2 className="font-display text-base font-bold text-foreground mb-3">Frequently Bought</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {quickSearches.slice(0, 8).map(item => (
            <button
              key={item}
              onClick={() => navigate(`/search?q=${encodeURIComponent(item)}`)}
              className="shrink-0 flex flex-col items-center gap-1.5 w-16"
            >
              <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center text-2xl">
                {emojis[products.find(p => p.name.toLowerCase() === item.toLowerCase())?.category ?? ''] || '📦'}
              </div>
              <span className="text-[10px] font-medium text-foreground">{item}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Suggested Reorders */}
      <section className="pb-4">
        <h2 className="font-display text-base font-bold text-foreground mb-3">Suggested Reorders</h2>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {['Amul Curd', 'Aashirvaad Atta', 'Amul Milk'].map(item => (
            <Card key={item} className="shrink-0 p-3 w-36 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/search?q=${encodeURIComponent(item.split(' ').pop() || '')}`)}>
              <div className="w-full h-16 rounded-lg bg-secondary flex items-center justify-center text-2xl mb-2">🛒</div>
              <p className="text-xs font-medium text-foreground truncate">{item}</p>
              <p className="text-[10px] text-muted-foreground">Order again</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
