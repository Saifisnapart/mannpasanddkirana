import { Star, Clock, MapPin, Tag, TrendingUp } from 'lucide-react';
import { VendorListing } from '@/types';
import { getProduct, getVendor, formatPrice, formatQuantity, getDiscountPercent } from '@/data/sampleData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

interface VendorComparisonCardProps {
  listing: VendorListing;
  isLowestPrice?: boolean;
  isHigherQuantity?: boolean;
  isFastDelivery?: boolean;
  onChooseVendor: (listingId: string) => void;
}

export default function VendorComparisonCard({
  listing, isLowestPrice, isHigherQuantity, isFastDelivery, onChooseVendor
}: VendorComparisonCardProps) {
  const product = getProduct(listing.productId);
  const vendor = getVendor(listing.vendorId);
  const navigate = useNavigate();
  if (!product || !vendor) return null;

  const discount = getDiscountPercent(listing.price, listing.mrp);

  return (
    <Card className="p-4 hover:shadow-md transition-shadow animate-fade-in">
      <div className="flex gap-3">
        {/* Product emoji/image */}
        <div className="shrink-0 w-16 h-16 rounded-lg bg-secondary flex items-center justify-center text-3xl">
          {product.image}
        </div>

        <div className="flex-1 min-w-0">
          {/* Badges row */}
          <div className="flex flex-wrap gap-1 mb-1.5">
            {isLowestPrice && (
              <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] px-1.5 py-0">
                <Tag className="h-2.5 w-2.5 mr-0.5" /> Lowest Price
              </Badge>
            )}
            {isHigherQuantity && (
              <Badge className="bg-info/10 text-info border-info/20 text-[10px] px-1.5 py-0">
                <TrendingUp className="h-2.5 w-2.5 mr-0.5" /> Higher Quantity
              </Badge>
            )}
            {isFastDelivery && (
              <Badge className="bg-accent/10 text-accent-foreground border-accent/20 text-[10px] px-1.5 py-0">
                <Clock className="h-2.5 w-2.5 mr-0.5" /> Fast Delivery
              </Badge>
            )}
            {listing.stock === 'low_stock' && (
              <Badge variant="destructive" className="text-[10px] px-1.5 py-0">Low Stock</Badge>
            )}
          </div>

          {/* Product info */}
          <h3 className="font-semibold text-sm text-foreground leading-tight">
            {product.brand} {product.name}
          </h3>
          <p className="text-xs text-muted-foreground">
            {formatQuantity(listing.quantity, listing.unit)}
          </p>

          {/* Price */}
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-lg font-bold text-foreground">{formatPrice(listing.price)}</span>
            {listing.mrp && listing.mrp > listing.price && (
              <span className="text-xs text-muted-foreground line-through">{formatPrice(listing.mrp)}</span>
            )}
            {discount && (
              <span className="text-xs font-semibold text-primary">{discount}% off</span>
            )}
          </div>

          {/* Vendor info */}
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{vendor.name}</span>
            <span className="flex items-center gap-0.5">
              <Star className="h-3 w-3 fill-accent text-accent" />
              {vendor.rating}
            </span>
            <span className="flex items-center gap-0.5">
              <Clock className="h-3 w-3" />
              {vendor.deliveryEstimate}
            </span>
            <span className="flex items-center gap-0.5">
              <MapPin className="h-3 w-3" />
              {vendor.locality}
            </span>
          </div>

          {/* CTAs */}
          <div className="flex gap-2 mt-3">
            <Button
              size="sm"
              onClick={() => onChooseVendor(listing.id)}
              disabled={listing.stock === 'out_of_stock'}
              className="text-xs h-8 px-4 rounded-lg"
            >
              Choose Vendor
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate(`/vendors/${vendor.slug}`)}
              className="text-xs h-8 px-3 rounded-lg"
            >
              View Store
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
