import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import TopSearchBar from '@/components/layout/TopSearchBar';
import VendorComparisonCard from '@/components/product/VendorComparisonCard';
import SortDropdown from '@/components/filters/SortDropdown';
import FilterChips from '@/components/filters/FilterChips';
import FilterDrawer from '@/components/filters/FilterDrawer';
import EmptyState from '@/components/common/EmptyState';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal } from 'lucide-react';
import { SortOption, FilterState } from '@/types';
import { searchListings, getVendor, getProduct } from '@/data/sampleData';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [sort, setSort] = useState<SortOption>('price_asc');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    brands: [], priceRange: null, quantityRange: null, localities: [], inStockOnly: false, openOnly: false,
  });
  const { addItem } = useCart();

  const rawResults = useMemo(() => searchListings(query), [query]);

  const filteredResults = useMemo(() => {
    return rawResults.filter(l => {
      const product = getProduct(l.productId);
      const vendor = getVendor(l.vendorId);
      if (!product || !vendor) return false;
      if (filters.brands.length && !filters.brands.includes(product.brand)) return false;
      if (filters.localities.length && !filters.localities.includes(vendor.locality)) return false;
      if (filters.inStockOnly && l.stock === 'out_of_stock') return false;
      if (filters.openOnly && !vendor.isOpen) return false;
      return true;
    });
  }, [rawResults, filters]);

  const sortedResults = useMemo(() => {
    const arr = [...filteredResults];
    arr.sort((a, b) => {
      const va = getVendor(a.vendorId);
      const vb = getVendor(b.vendorId);
      switch (sort) {
        case 'price_asc':
          return a.price - b.price || b.quantity - a.quantity;
        case 'price_desc':
          return b.price - a.price;
        case 'quantity_desc':
          return b.quantity - a.quantity;
        case 'rating':
          return (vb?.rating ?? 0) - (va?.rating ?? 0);
        case 'delivery':
          return (va?.deliveryMinutes ?? 99) - (vb?.deliveryMinutes ?? 99);
        default:
          return 0;
      }
    });
    return arr;
  }, [filteredResults, sort]);

  const lowestPrice = sortedResults.length ? Math.min(...sortedResults.map(l => l.price)) : 0;
  const highestQuantity = sortedResults.length ? Math.max(...sortedResults.map(l => l.quantity)) : 0;
  const fastestDelivery = sortedResults.length
    ? Math.min(...sortedResults.map(l => getVendor(l.vendorId)?.deliveryMinutes ?? 99))
    : 99;

  const handleChooseVendor = (listingId: string) => {
    addItem(listingId);
    toast.success('Added to cart!');
  };

  return (
    <div className="px-4 py-4 space-y-4">
      <TopSearchBar initialQuery={query} compact />
      <FilterChips activeQuery={query} />

      <div className="flex items-center justify-between gap-2">
        <div className="text-sm text-muted-foreground">
          {sortedResults.length > 0 ? (
            <span><strong className="text-foreground">{sortedResults.length}</strong> vendors offering <strong className="text-foreground">{query}</strong></span>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setFilterOpen(true)} className="h-8 text-xs rounded-lg gap-1">
            <SlidersHorizontal className="h-3 w-3" /> Filters
          </Button>
          <SortDropdown value={sort} onChange={setSort} />
        </div>
      </div>

      {sortedResults.length > 0 ? (
        <div className="space-y-3">
          {sortedResults.map(listing => {
            const vendor = getVendor(listing.vendorId);
            return (
              <VendorComparisonCard
                key={listing.id}
                listing={listing}
                isLowestPrice={listing.price === lowestPrice}
                isHigherQuantity={listing.quantity === highestQuantity && sortedResults.filter(l => l.price === listing.price).length > 1}
                isFastDelivery={vendor?.deliveryMinutes === fastestDelivery}
                onChooseVendor={handleChooseVendor}
              />
            );
          })}
        </div>
      ) : (
        <EmptyState type="search" query={query} />
      )}

      <FilterDrawer
        open={filterOpen}
        onOpenChange={setFilterOpen}
        filters={filters}
        onFiltersChange={setFilters}
        searchQuery={query}
      />
    </div>
  );
}
