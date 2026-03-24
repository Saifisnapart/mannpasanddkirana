// Core Types for MannPasandd App

export interface Location {
  lat: number;
  lng: number;
}

export interface Vendor {
  id: string;
  slug: string;
  name: string;
  type: 'grocery' | 'meat';
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
  lat: number;
  lng: number;
  image: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  image: string;
  description?: string;
  searchTerms: string[];
  unit: string;
  isActive: boolean;
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
  stockQty: number;
}

export interface CartItem {
  listingId: string;
  qty: number;
  customQty?: number;   // quantity in base unit (g or ml)
  unitType?: 'g' | 'ml' | 'pcs';  // derived from listing unit
}

export interface CartState {
  items: CartItem[];
}

export interface Order {
  id: string;
  vendorIds: string[];
  items: (CartItem & { price: number; productName: string; vendorId: string })[];
  subtotal: number;
  deliveryFee: number;
  taxAmount: number;
  total: number;
  status: 'placed' | 'confirmed' | 'preparing' | 'picked_up' | 'out_for_delivery' | 'delivered' | 'cancelled';
  createdAt: string;
  deliveryAddress: string;
  paymentMethod: 'cod' | 'upi' | 'card';
}

export interface Address {
  id: string;
  label: string;
  full: string;
  pincode: string;
  area: string;
  isDefault: boolean;
  lat: number;
  lng: number;
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

export interface ShopRanking {
  vendor: Vendor;
  distance: number;
  availableItems: number;
  totalItems: number;
  cartTotal: number;
  stockStrength: number;
  isBestMatch: boolean;
}

export interface SplitOrder {
  primaryShop: ShopRanking;
  secondaryShop?: ShopRanking;
  primaryItems: CartItem[];
  secondaryItems: CartItem[];
}
