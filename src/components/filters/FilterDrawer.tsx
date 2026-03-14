import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { FilterState } from '@/types';
import { vendors, products, vendorListings } from '@/data/sampleData';
import { useMemo } from 'react';

interface FilterDrawerProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  filters: FilterState;
  onFiltersChange: (f: FilterState) => void;
  searchQuery: string;
}

export default function FilterDrawer({ open, onOpenChange, filters, onFiltersChange, searchQuery }: FilterDrawerProps) {
  const availableBrands = useMemo(() => {
    const q = searchQuery.toLowerCase();
    const matchingProducts = products.filter(p =>
      p.searchTerms.some(t => t.includes(q)) || p.name.toLowerCase().includes(q)
    );
    return [...new Set(matchingProducts.map(p => p.brand))];
  }, [searchQuery]);

  const availableLocalities = [...new Set(vendors.map(v => v.locality))];

  const toggleBrand = (brand: string) => {
    const brands = filters.brands.includes(brand)
      ? filters.brands.filter(b => b !== brand)
      : [...filters.brands, brand];
    onFiltersChange({ ...filters, brands });
  };

  const toggleLocality = (loc: string) => {
    const localities = filters.localities.includes(loc)
      ? filters.localities.filter(l => l !== loc)
      : [...filters.localities, loc];
    onFiltersChange({ ...filters, localities });
  };

  const resetFilters = () => {
    onFiltersChange({ brands: [], priceRange: null, quantityRange: null, localities: [], inStockOnly: false, openOnly: false });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[300px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>Narrow down your search results</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Brand */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2">Brand</h4>
            <div className="flex flex-wrap gap-2">
              {availableBrands.map(b => (
                <button
                  key={b}
                  onClick={() => toggleBrand(b)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    filters.brands.includes(b) ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Locality */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2">Locality</h4>
            <div className="flex flex-wrap gap-2">
              {availableLocalities.map(l => (
                <button
                  key={l}
                  onClick={() => toggleLocality(l)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    filters.localities.includes(l) ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="instock" className="text-sm">In stock only</Label>
              <Switch id="instock" checked={filters.inStockOnly} onCheckedChange={v => onFiltersChange({ ...filters, inStockOnly: v })} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="openonly" className="text-sm">Open vendors only</Label>
              <Switch id="openonly" checked={filters.openOnly} onCheckedChange={v => onFiltersChange({ ...filters, openOnly: v })} />
            </div>
          </div>

          <Button variant="outline" onClick={resetFilters} className="w-full">Reset Filters</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
