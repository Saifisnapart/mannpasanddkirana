export interface Vendor {
  id: string;
  slug: string;
  name: string;
  rating: number;
  reviewCount: number;
  locality: string;
  pincode: string;
  deliveryEstimate: string;
  deliveryMinutes: number;
  isOpen: boolean;
  minOrder: number;
  banner?: string;
  description?: string;
  categories: string[];
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  image: string;
  description?: string;
  searchTerms: string[];
}

export interface VendorListing {
  id: string;
  productId: string;
  vendorId: string;
  price: number;
  mrp?: number;
  quantity: number;
  unit: string;
  stock: 'in_stock' | 'low_stock' | 'out_of_stock';
}

export interface CartItem {
  listingId: string;
  qty: number;
}

export interface CartState {
  vendorId: string | null;
  items: CartItem[];
}

export interface Order {
  id: string;
  vendorId: string;
  items: (CartItem & { price: number; productName: string })[];
  total: number;
  status: 'placed' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  createdAt: string;
  deliveryAddress: string;
}

export interface Address {
  id: string;
  label: string;
  full: string;
  pincode: string;
  isDefault: boolean;
}

export type SortOption = 'price_asc' | 'price_desc' | 'quantity_desc' | 'rating' | 'delivery';

export interface FilterState {
  brands: string[];
  priceRange: [number, number] | null;
  quantityRange: [number, number] | null;
  localities: string[];
  inStockOnly: boolean;
  openOnly: boolean;
}
