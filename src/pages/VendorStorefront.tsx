import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getVendorBySlug, getVendorListings, getProduct, categories } from '@/data/sampleData';
import ProductCard from '@/components/product/ProductCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Clock, Package, Search, ArrowLeft } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

export default function VendorStorefront() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const vendor = getVendorBySlug(slug || '');
  const { addItem } = useCart();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  if (!vendor) {
    return (
      <div className="px-4 py-16 text-center">
        <p className="text-muted-foreground">Vendor not found</p>
        <Button variant="outline" onClick={() => navigate('/home')} className="mt-4">Go Home</Button>
      </div>
    );
  }

  const listings = getVendorListings(vendor.id);
  const filteredListings = listings.filter(l => {
    const product = getProduct(l.productId);
    if (!product) return false;
    const matchSearch = !search || product.name.toLowerCase().includes(search.toLowerCase()) || product.brand.toLowerCase().includes(search.toLowerCase());
    const matchCategory = !activeCategory || product.category === activeCategory;
    return matchSearch && matchCategory;
  });

  const handleAdd = (listingId: string) => {
    addItem(listingId);
    toast.success('Added to cart!');
  };

  return (
    <div className="px-4 py-4 space-y-4">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 p-5">
        <div className="flex items-start gap-3">
          <div className="h-14 w-14 rounded-xl bg-card flex items-center justify-center text-2xl shrink-0 shadow-sm">{vendor.image}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="font-display text-lg font-bold text-foreground">{vendor.name}</h1>
              {vendor.isOpen ? (
                <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px]">Open</Badge>
              ) : (
                <Badge variant="destructive" className="text-[10px]">Closed</Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{vendor.description}</p>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-0.5"><Star className="h-3 w-3 fill-accent text-accent" />{vendor.rating} ({vendor.reviewCount})</span>
              <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" />{vendor.locality}</span>
              <span className="flex items-center gap-0.5"><Clock className="h-3 w-3" />{vendor.deliveryEstimate}</span>
              <span className="flex items-center gap-0.5"><Package className="h-3 w-3" />Min ₹{vendor.minOrder}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={`Search in ${vendor.name}...`}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-10 h-10 rounded-xl text-sm"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <button
          onClick={() => setActiveCategory(null)}
          className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            !activeCategory ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
          }`}
        >
          All
        </button>
        {vendor.categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              activeCategory === cat ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filteredListings.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {filteredListings.map(listing => (
            <ProductCard key={listing.id} listing={listing} onAddToCart={handleAdd} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground text-sm">No products found</div>
      )}
    </div>
  );
}
