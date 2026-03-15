import React, { createContext, useContext, useState, useCallback } from 'react';
import { CartItem } from '@/types';
import { getListing, getVendor } from '@/data/sampleData';

interface CartContextType {
  items: CartItem[];
  addItem: (listingId: string) => void;
  removeItem: (listingId: string) => void;
  updateQty: (listingId: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  vendorIds: string[];
  vendorNames: string[];
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((listingId: string) => {
    const listing = getListing(listingId);
    if (!listing) return;

    setItems(prev => {
      const existing = prev.find(i => i.listingId === listingId);
      if (existing) {
        return prev.map(i => i.listingId === listingId ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { listingId, qty: 1 }];
    });
  }, []);

  const removeItem = useCallback((listingId: string) => {
    setItems(prev => prev.filter(i => i.listingId !== listingId));
  }, []);

  const updateQty = useCallback((listingId: string, qty: number) => {
    if (qty <= 0) {
      setItems(prev => prev.filter(i => i.listingId !== listingId));
      return;
    }
    setItems(prev => prev.map(i => i.listingId === listingId ? { ...i, qty } : i));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((sum, i) => sum + i.qty, 0);

  const subtotal = items.reduce((sum, i) => {
    const listing = getListing(i.listingId);
    return sum + (listing ? listing.price * i.qty : 0);
  }, 0);

  const vendorIds = [...new Set(items.map(i => {
    const listing = getListing(i.listingId);
    return listing?.vendorId || '';
  }).filter(Boolean))];

  const vendorNames = vendorIds.map(id => getVendor(id)?.name || '').filter(Boolean);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, totalItems, subtotal, vendorIds, vendorNames }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
