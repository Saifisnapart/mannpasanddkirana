import { Vendor, Product, VendorListing, Order, Address } from '@/types';

export const vendors: Vendor[] = [
  {
    id: 'v1', slug: 'freshmart-pimpri', name: 'FreshMart Pimpri',
    rating: 4.4, reviewCount: 312, locality: 'Pimpri', pincode: '411018',
    deliveryEstimate: '35 min', deliveryMinutes: 35, isOpen: true,
    minOrder: 99, description: 'Your neighborhood fresh grocery store with daily deliveries.',
    categories: ['Dairy', 'Staples', 'Snacks', 'Beverages', 'Cleaning'],
  },
  {
    id: 'v2', slug: 'mannan-provisions', name: 'Mannan Provisions',
    rating: 4.2, reviewCount: 189, locality: 'Chinchwad', pincode: '411019',
    deliveryEstimate: '40 min', deliveryMinutes: 40, isOpen: true,
    minOrder: 149, description: 'Trusted provisions store serving Chinchwad for 15+ years.',
    categories: ['Dairy', 'Staples', 'Oils', 'Cleaning', 'Personal Care'],
  },
  {
    id: 'v3', slug: 'dailyneeds-store', name: 'DailyNeeds Store',
    rating: 4.6, reviewCount: 478, locality: 'Wakad', pincode: '411057',
    deliveryEstimate: '30 min', deliveryMinutes: 30, isOpen: true,
    minOrder: 199, description: 'Premium quality groceries delivered fast to your doorstep.',
    categories: ['Dairy', 'Staples', 'Fruits', 'Vegetables', 'Snacks', 'Beverages'],
  },
  {
    id: 'v4', slug: 'budget-basket', name: 'Budget Basket',
    rating: 4.0, reviewCount: 95, locality: 'Nigdi', pincode: '411044',
    deliveryEstimate: '45 min', deliveryMinutes: 45, isOpen: true,
    minOrder: 49, description: 'Best prices on daily essentials. Save more every day!',
    categories: ['Dairy', 'Staples', 'Cleaning', 'Snacks'],
  },
  {
    id: 'v5', slug: 'quality-foods', name: 'Quality Foods',
    rating: 4.3, reviewCount: 234, locality: 'Aundh', pincode: '411007',
    deliveryEstimate: '25 min', deliveryMinutes: 25, isOpen: true,
    minOrder: 149, description: 'Curated selection of premium groceries and gourmet items.',
    categories: ['Dairy', 'Staples', 'Gourmet', 'Beverages', 'Snacks', 'Oils'],
  },
];

export const products: Product[] = [
  { id: 'p1', name: 'Curd', brand: 'Amul', category: 'Dairy', image: '🥛', searchTerms: ['curd', 'dahi', 'yogurt'], description: 'Fresh and creamy curd' },
  { id: 'p2', name: 'Curd', brand: 'Chitale', category: 'Dairy', image: '🥛', searchTerms: ['curd', 'dahi', 'yogurt'], description: 'Traditional Chitale curd' },
  { id: 'p3', name: 'Curd', brand: 'Nestle', category: 'Dairy', image: '🥛', searchTerms: ['curd', 'dahi', 'yogurt'], description: 'Nestle fresh curd' },
  { id: 'p4', name: 'Milk', brand: 'Amul', category: 'Dairy', image: '🥛', searchTerms: ['milk', 'dudh'], description: 'Amul Gold full cream milk' },
  { id: 'p5', name: 'Milk', brand: 'Chitale', category: 'Dairy', image: '🥛', searchTerms: ['milk', 'dudh'], description: 'Chitale full cream milk' },
  { id: 'p6', name: 'Basmati Rice', brand: 'India Gate', category: 'Staples', image: '🍚', searchTerms: ['rice', 'chawal', 'basmati'], description: 'Premium aged basmati rice' },
  { id: 'p7', name: 'Wheat Atta', brand: 'Aashirvaad', category: 'Staples', image: '🌾', searchTerms: ['atta', 'flour', 'wheat'], description: 'Whole wheat atta for soft rotis' },
  { id: 'p8', name: 'Sunflower Oil', brand: 'Fortune', category: 'Oils', image: '🫒', searchTerms: ['oil', 'sunflower', 'cooking oil'], description: 'Heart-healthy sunflower cooking oil' },
  { id: 'p9', name: 'Sugar', brand: 'Madhur', category: 'Staples', image: '🍬', searchTerms: ['sugar', 'cheeni'], description: 'Refined white sugar' },
  { id: 'p10', name: 'Detergent Powder', brand: 'Surf Excel', category: 'Cleaning', image: '🧹', searchTerms: ['detergent', 'washing', 'surf'], description: 'Easy wash detergent powder' },
  { id: 'p11', name: 'Bread', brand: 'Britannia', category: 'Snacks', image: '🍞', searchTerms: ['bread', 'roti'], description: 'Fresh white bread' },
  { id: 'p12', name: 'Eggs', brand: 'Farm Fresh', category: 'Dairy', image: '🥚', searchTerms: ['eggs', 'anda'], description: 'Fresh farm eggs' },
  { id: 'p13', name: 'Butter', brand: 'Amul', category: 'Dairy', image: '🧈', searchTerms: ['butter', 'makhan'], description: 'Amul pasteurized butter' },
  { id: 'p14', name: 'Paneer', brand: 'Amul', category: 'Dairy', image: '🧀', searchTerms: ['paneer', 'cottage cheese'], description: 'Fresh and soft paneer' },
  { id: 'p15', name: 'Toor Dal', brand: 'Tata Sampann', category: 'Staples', image: '🫘', searchTerms: ['dal', 'toor', 'arhar'], description: 'Unpolished toor dal' },
];

export const vendorListings: VendorListing[] = [
  // Curd listings (as specified in prompt)
  { id: 'vl1', productId: 'p1', vendorId: 'v1', price: 32, mrp: 35, quantity: 400, unit: 'g', stock: 'in_stock' },
  { id: 'vl2', productId: 'p1', vendorId: 'v2', price: 30, mrp: 35, quantity: 400, unit: 'g', stock: 'in_stock' },
  { id: 'vl3', productId: 'p2', vendorId: 'v3', price: 38, mrp: 40, quantity: 500, unit: 'g', stock: 'in_stock' },
  { id: 'vl4', productId: 'p1', vendorId: 'v4', price: 18, mrp: 20, quantity: 200, unit: 'g', stock: 'in_stock' },
  { id: 'vl5', productId: 'p3', vendorId: 'v5', price: 34, mrp: 38, quantity: 400, unit: 'g', stock: 'low_stock' },

  // Milk
  { id: 'vl6', productId: 'p4', vendorId: 'v1', price: 30, mrp: 32, quantity: 500, unit: 'ml', stock: 'in_stock' },
  { id: 'vl7', productId: 'p4', vendorId: 'v2', price: 28, mrp: 32, quantity: 500, unit: 'ml', stock: 'in_stock' },
  { id: 'vl8', productId: 'p5', vendorId: 'v3', price: 34, mrp: 36, quantity: 500, unit: 'ml', stock: 'in_stock' },
  { id: 'vl9', productId: 'p4', vendorId: 'v4', price: 60, mrp: 65, quantity: 1000, unit: 'ml', stock: 'in_stock' },
  { id: 'vl10', productId: 'p5', vendorId: 'v5', price: 32, mrp: 36, quantity: 500, unit: 'ml', stock: 'in_stock' },

  // Rice
  { id: 'vl11', productId: 'p6', vendorId: 'v1', price: 185, mrp: 210, quantity: 1, unit: 'kg', stock: 'in_stock' },
  { id: 'vl12', productId: 'p6', vendorId: 'v2', price: 190, mrp: 210, quantity: 1, unit: 'kg', stock: 'in_stock' },
  { id: 'vl13', productId: 'p6', vendorId: 'v3', price: 360, mrp: 399, quantity: 2, unit: 'kg', stock: 'in_stock' },
  { id: 'vl14', productId: 'p6', vendorId: 'v5', price: 175, mrp: 210, quantity: 1, unit: 'kg', stock: 'low_stock' },

  // Atta
  { id: 'vl15', productId: 'p7', vendorId: 'v1', price: 245, mrp: 280, quantity: 5, unit: 'kg', stock: 'in_stock' },
  { id: 'vl16', productId: 'p7', vendorId: 'v2', price: 240, mrp: 280, quantity: 5, unit: 'kg', stock: 'in_stock' },
  { id: 'vl17', productId: 'p7', vendorId: 'v4', price: 130, mrp: 150, quantity: 2, unit: 'kg', stock: 'in_stock' },

  // Oil
  { id: 'vl18', productId: 'p8', vendorId: 'v1', price: 140, mrp: 160, quantity: 1, unit: 'L', stock: 'in_stock' },
  { id: 'vl19', productId: 'p8', vendorId: 'v3', price: 135, mrp: 160, quantity: 1, unit: 'L', stock: 'in_stock' },
  { id: 'vl20', productId: 'p8', vendorId: 'v5', price: 265, mrp: 310, quantity: 2, unit: 'L', stock: 'in_stock' },

  // Sugar
  { id: 'vl21', productId: 'p9', vendorId: 'v1', price: 42, mrp: 48, quantity: 1, unit: 'kg', stock: 'in_stock' },
  { id: 'vl22', productId: 'p9', vendorId: 'v2', price: 40, mrp: 48, quantity: 1, unit: 'kg', stock: 'in_stock' },
  { id: 'vl23', productId: 'p9', vendorId: 'v4', price: 38, mrp: 48, quantity: 1, unit: 'kg', stock: 'in_stock' },

  // Detergent
  { id: 'vl24', productId: 'p10', vendorId: 'v1', price: 120, mrp: 145, quantity: 1, unit: 'kg', stock: 'in_stock' },
  { id: 'vl25', productId: 'p10', vendorId: 'v2', price: 115, mrp: 145, quantity: 1, unit: 'kg', stock: 'in_stock' },
  { id: 'vl26', productId: 'p10', vendorId: 'v3', price: 230, mrp: 275, quantity: 2, unit: 'kg', stock: 'in_stock' },

  // Bread
  { id: 'vl27', productId: 'p11', vendorId: 'v1', price: 40, mrp: 45, quantity: 400, unit: 'g', stock: 'in_stock' },
  { id: 'vl28', productId: 'p11', vendorId: 'v3', price: 42, mrp: 45, quantity: 400, unit: 'g', stock: 'in_stock' },
  { id: 'vl29', productId: 'p11', vendorId: 'v4', price: 38, mrp: 45, quantity: 400, unit: 'g', stock: 'in_stock' },

  // Eggs
  { id: 'vl30', productId: 'p12', vendorId: 'v1', price: 72, mrp: 80, quantity: 12, unit: 'pcs', stock: 'in_stock' },
  { id: 'vl31', productId: 'p12', vendorId: 'v3', price: 75, mrp: 80, quantity: 12, unit: 'pcs', stock: 'in_stock' },
  { id: 'vl32', productId: 'p12', vendorId: 'v5', price: 38, mrp: 42, quantity: 6, unit: 'pcs', stock: 'in_stock' },

  // Butter
  { id: 'vl33', productId: 'p13', vendorId: 'v1', price: 56, mrp: 60, quantity: 100, unit: 'g', stock: 'in_stock' },
  { id: 'vl34', productId: 'p13', vendorId: 'v2', price: 54, mrp: 60, quantity: 100, unit: 'g', stock: 'in_stock' },
  { id: 'vl35', productId: 'p13', vendorId: 'v5', price: 108, mrp: 115, quantity: 200, unit: 'g', stock: 'in_stock' },

  // Paneer
  { id: 'vl36', productId: 'p14', vendorId: 'v1', price: 85, mrp: 95, quantity: 200, unit: 'g', stock: 'in_stock' },
  { id: 'vl37', productId: 'p14', vendorId: 'v3', price: 80, mrp: 95, quantity: 200, unit: 'g', stock: 'in_stock' },
  { id: 'vl38', productId: 'p14', vendorId: 'v5', price: 160, mrp: 180, quantity: 400, unit: 'g', stock: 'low_stock' },

  // Dal
  { id: 'vl39', productId: 'p15', vendorId: 'v1', price: 135, mrp: 155, quantity: 1, unit: 'kg', stock: 'in_stock' },
  { id: 'vl40', productId: 'p15', vendorId: 'v2', price: 130, mrp: 155, quantity: 1, unit: 'kg', stock: 'in_stock' },
  { id: 'vl41', productId: 'p15', vendorId: 'v3', price: 128, mrp: 155, quantity: 1, unit: 'kg', stock: 'in_stock' },
];

export const sampleOrders: Order[] = [
  {
    id: 'ord1', vendorId: 'v1',
    items: [
      { listingId: 'vl1', qty: 2, price: 32, productName: 'Amul Curd 400g' },
      { listingId: 'vl6', qty: 1, price: 30, productName: 'Amul Milk 500ml' },
    ],
    total: 94, status: 'delivered', createdAt: '2026-03-12T10:30:00Z',
    deliveryAddress: 'Flat 204, Green Valley Apt, Pimpri, Pune 411018',
  },
  {
    id: 'ord2', vendorId: 'v3',
    items: [
      { listingId: 'vl3', qty: 1, price: 38, productName: 'Chitale Curd 500g' },
      { listingId: 'vl13', qty: 1, price: 360, productName: 'India Gate Basmati Rice 2kg' },
    ],
    total: 398, status: 'out_for_delivery', createdAt: '2026-03-14T08:15:00Z',
    deliveryAddress: 'B-12, Sunrise Towers, Wakad, Pune 411057',
  },
];

export const sampleAddresses: Address[] = [
  { id: 'a1', label: 'Home', full: 'Flat 204, Green Valley Apt, Pimpri, Pune 411018', pincode: '411018', isDefault: true },
  { id: 'a2', label: 'Office', full: 'Unit 5, TechPark, Hinjewadi Phase 1, Pune 411057', pincode: '411057', isDefault: false },
];

export const categories = ['Dairy', 'Staples', 'Oils', 'Snacks', 'Beverages', 'Cleaning', 'Personal Care', 'Fruits', 'Vegetables'];

export const quickSearches = ['Curd', 'Milk', 'Bread', 'Eggs', 'Rice', 'Atta', 'Oil', 'Sugar', 'Dal', 'Paneer'];

// Helper functions
export function getVendor(id: string) { return vendors.find(v => v.id === id); }
export function getVendorBySlug(slug: string) { return vendors.find(v => v.slug === slug); }
export function getProduct(id: string) { return products.find(p => p.id === id); }
export function getListing(id: string) { return vendorListings.find(l => l.id === id); }

export function searchListings(query: string): VendorListing[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  const matchingProductIds = products
    .filter(p => p.searchTerms.some(t => t.includes(q)) || p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q))
    .map(p => p.id);
  return vendorListings.filter(l => matchingProductIds.includes(l.productId));
}

export function getVendorListings(vendorId: string): VendorListing[] {
  return vendorListings.filter(l => l.vendorId === vendorId);
}

export function formatPrice(price: number): string {
  return `₹${price}`;
}

export function formatQuantity(qty: number, unit: string): string {
  return `${qty} ${unit}`;
}

export function getDiscountPercent(price: number, mrp?: number): number | null {
  if (!mrp || mrp <= price) return null;
  return Math.round(((mrp - price) / mrp) * 100);
}
