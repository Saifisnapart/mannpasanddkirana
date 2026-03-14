import React, { createContext, useContext, useState, useCallback } from 'react';
import { CartItem } from '@/types';
import { getListing, getVendor } from '@/data/sampleData';

interface CartContextType {
  vendorId: string | null;
  items: CartItem[];
  addItem: (listingId: string) => 'added' | 'conflict';
  removeItem: (listingId: string) => void;
  updateQty: (listingId: string, qty: number) => void;
  clearCart: () => void;
  switchVendorAndAdd: (listingId: string) => void;
  totalItems: number;
  subtotal: number;
  vendorName: string | null;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [vendorId, setVendorId] = useState<string | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((listingId: string): 'added' | 'conflict' => {
    const listing = getListing(listingId);
    if (!listing) return 'added';

    if (vendorId && vendorId !== listing.vendorId) {
      return 'conflict';
    }

    setVendorId(listing.vendorId);
    setItems(prev => {
      const existing = prev.find(i => i.listingId === listingId);
      if (existing) {
        return prev.map(i => i.listingId === listingId ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { listingId, qty: 1 }];
    });
    return 'added';
  }, [vendorId]);

  const removeItem = useCallback((listingId: string) => {
    setItems(prev => {
      const next = prev.filter(i => i.listingId !== listingId);
      if (next.length === 0) setVendorId(null);
      return next;
    });
  }, []);

  const updateQty = useCallback((listingId: string, qty: number) => {
    if (qty <= 0) {
      removeItem(listingId);
      return;
    }
    setItems(prev => prev.map(i => i.listingId === listingId ? { ...i, qty } : i));
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
    setVendorId(null);
  }, []);

  const switchVendorAndAdd = useCallback((listingId: string) => {
    const listing = getListing(listingId);
    if (!listing) return;
    setItems([{ listingId, qty: 1 }]);
    setVendorId(listing.vendorId);
  }, []);

  const totalItems = items.reduce((sum, i) => sum + i.qty, 0);

  const subtotal = items.reduce((sum, i) => {
    const listing = getListing(i.listingId);
    return sum + (listing ? listing.price * i.qty : 0);
  }, 0);

  const vendorName = vendorId ? getVendor(vendorId)?.name ?? null : null;

  return (
    <CartContext.Provider value={{ vendorId, items, addItem, removeItem, updateQty, clearCart, switchVendorAndAdd, totalItems, subtotal, vendorName }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
