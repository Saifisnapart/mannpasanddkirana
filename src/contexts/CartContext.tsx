import React, { createContext, useContext, useState, useCallback } from 'react';
import { CartItem } from '@/types';
import { getListing, getVendor, getUnitType, toBaseUnit } from '@/data/sampleData';

interface CartContextType {
  items: CartItem[];
  addItem: (listingId: string, customQty?: number) => void;
  removeItem: (listingId: string) => void;
  updateQty: (listingId: string, qty: number) => void;
  updateCustomQty: (listingId: string, customQty: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  vendorIds: string[];
  vendorNames: string[];
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((listingId: string, customQty?: number) => {
    const listing = getListing(listingId);
    if (!listing) return;

    const unitType = getUnitType(listing.unit);
    const baseQty = toBaseUnit(listing.quantity, listing.unit);
    const defaultCustomQty = unitType === 'pcs' ? undefined : baseQty;

    setItems(prev => {
      const existing = prev.find(i => i.listingId === listingId);
      if (existing) {
        if (unitType === 'pcs') {
          return prev.map(i => i.listingId === listingId ? { ...i, qty: i.qty + 1 } : i);
        }
        return prev;
      }
      return [...prev, {
        listingId,
        qty: 1,
        customQty: customQty ?? defaultCustomQty,
        unitType,
      }];
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

  const updateCustomQty = useCallback((listingId: string, customQty: number) => {
    setItems(prev => prev.map(i =>
      i.listingId === listingId ? { ...i, customQty } : i
    ));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((sum, i) => sum + i.qty, 0);

  const subtotal = items.reduce((sum, i) => {
    const listing = getListing(i.listingId);
    if (!listing) return sum;
    if (i.unitType === 'pcs' || !i.customQty) {
      return sum + listing.price * i.qty;
    }
    const baseQty = toBaseUnit(listing.quantity, listing.unit);
    const pricePerUnit = listing.price / baseQty;
    return sum + Math.round(pricePerUnit * i.customQty * 100) / 100;
  }, 0);

  const vendorIds = [...new Set(items.map(i => {
    const listing = getListing(i.listingId);
    return listing?.vendorId || '';
  }).filter(Boolean))];

  const vendorNames = vendorIds.map(id => getVendor(id)?.name || '').filter(Boolean);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, updateCustomQty, clearCart, totalItems, subtotal, vendorIds, vendorNames }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
