import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { getListing, getProduct, getVendor, vendorListings, formatQuantity, formatPrice } from '@/data/sampleData';
import PriceDisplay from '@/components/product/PriceDisplay';
import { StockBadge } from '@/components/product/Badges';
import VendorComparisonCard from '@/components/product/VendorComparisonCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Star, MapPin, Clock, Minus, Plus } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const listing = getListing(id || '');
  const product = listing ? getProduct(listing.productId) : null;
  const vendor = listing ? getVendor(listing.vendorId) : null;
  const { addItem, items, updateQty } = useCart();
  const [qty, setQty] = useState(1);

  if (!listing || !product || !vendor) {
    return (
      <div className="px-4 py-16 text-center">
        <p className="text-muted-foreground">Product not found</p>
        <Button variant="outline" onClick={() => navigate(-1)} className="mt-4">Go Back</Button>
      </div>
    );
  }

  const cartItem = items.find(i => i.listingId === listing.id);
  const otherListings = vendorListings.filter(l => l.productId === listing.productId && l.id !== listing.id);

  const handleAdd = () => {
    addItem(listing.id);
    if (qty > 1) {
      updateQty(listing.id, qty);
    }
    toast.success('Added to cart!');
  };

  const handleChooseOtherVendor = (listingId: string) => {
    addItem(listingId);
    toast.success('Added to cart!');
  };

  return (
    <div className="px-4 py-4 space-y-5">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="w-full aspect-square max-w-xs mx-auto rounded-2xl bg-secondary flex items-center justify-center text-7xl">
        {product.image}
      </div>

      <div>
        <h1 className="font-display text-xl font-bold text-foreground">{product.brand} {product.name}</h1>
        <p className="text-sm text-muted-foreground">{formatQuantity(listing.quantity, listing.unit)}</p>
        <div className="mt-2"><PriceDisplay price={listing.price} mrp={listing.mrp} size="lg" /></div>
        <div className="mt-2"><StockBadge stock={listing.stock} /></div>
        {product.description && <p className="text-sm text-muted-foreground mt-3">{product.description}</p>}
      </div>

      <Card className="p-3">
        <p className="text-xs text-muted-foreground mb-1">Sold by</p>
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate(`/vendors/${vendor.slug}`)}>
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm">{vendor.image}</div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">{vendor.name}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-0.5"><Star className="h-3 w-3 fill-accent text-accent" />{vendor.rating}</span>
              <span className="flex items-center gap-0.5"><Clock className="h-3 w-3" />{vendor.deliveryEstimate}</span>
              <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" />{vendor.locality}</span>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex items-center gap-4">
        {!cartItem && (
          <div className="flex items-center gap-2 bg-secondary rounded-xl px-2 py-1">
            <button onClick={() => setQty(Math.max(1, qty - 1))} className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-primary/10">
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-8 text-center font-bold">{qty}</span>
            <button onClick={() => setQty(qty + 1)} className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-primary/10">
              <Plus className="h-4 w-4" />
            </button>
          </div>
        )}
        {cartItem ? (
          <div className="flex items-center gap-3 flex-1">
            <div className="flex items-center gap-2 bg-primary/10 rounded-xl px-3 py-1">
              <button onClick={() => updateQty(listing.id, cartItem.qty - 1)} className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-primary/20 text-primary">
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center font-bold text-primary">{cartItem.qty}</span>
              <button onClick={() => updateQty(listing.id, cartItem.qty + 1)} className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-primary/20 text-primary">
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <Button onClick={() => navigate('/cart')} className="flex-1 rounded-xl h-11">View Cart</Button>
          </div>
        ) : (
          <Button onClick={handleAdd} disabled={listing.stock === 'out_of_stock'} className="flex-1 rounded-xl h-11 text-base font-semibold">
            Add to Cart · {formatPrice(listing.price * qty)}
          </Button>
        )}
      </div>

      {otherListings.length > 0 && (
        <section>
          <h2 className="font-display text-base font-bold text-foreground mb-3">Compare from Other Vendors</h2>
          <div className="space-y-2">
            {otherListings.map(l => (
              <VendorComparisonCard
                key={l.id}
                listing={l}
                isLowestPrice={l.price <= Math.min(...otherListings.map(x => x.price), listing.price)}
                onChooseVendor={handleChooseOtherVendor}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
