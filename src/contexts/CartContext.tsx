import React, { createContext, useContext, useState, useCallback } from 'react';

export interface CartItem {
  storeProductId: string;
  storeId: string;
  productId: string;
  qty: number;
  customQty?: number; // in base unit (g or ml)
  unitType?: 'g' | 'ml' | 'pcs';
  vendorPriceInr: number;
  productName: string;
  baseUnit: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'qty'> & { qty?: number }) => void;
  removeItem: (storeProductId: string) => void;
  updateQty: (storeProductId: string, qty: number) => void;
  updateCustomQty: (storeProductId: string, customQty: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  storeIds: string[];
  currentStoreId: string | null;
}

const CartContext = createContext<CartContextType | null>(null);

function getUnitType(baseUnit: string): 'g' | 'ml' | 'pcs' {
  if (['gm', 'kg'].includes(baseUnit)) return 'g';
  if (['ml', 'litre'].includes(baseUnit)) return 'ml';
  return 'pcs';
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((item: Omit<CartItem, 'qty'> & { qty?: number }) => {
    setItems(prev => {
      const existing = prev.find(i => i.storeProductId === item.storeProductId);
      if (existing) {
        const ut = getUnitType(item.baseUnit);
        if (ut === 'pcs') {
          return prev.map(i => i.storeProductId === item.storeProductId ? { ...i, qty: i.qty + 1 } : i);
        }
        return prev;
      }
      const ut = getUnitType(item.baseUnit);
      return [...prev, {
        ...item,
        qty: item.qty || 1,
        unitType: ut,
        customQty: ut !== 'pcs' ? (item.customQty || 500) : undefined,
      }];
    });
  }, []);

  const removeItem = useCallback((storeProductId: string) => {
    setItems(prev => prev.filter(i => i.storeProductId !== storeProductId));
  }, []);

  const updateQty = useCallback((storeProductId: string, qty: number) => {
    if (qty <= 0) {
      setItems(prev => prev.filter(i => i.storeProductId !== storeProductId));
      return;
    }
    setItems(prev => prev.map(i => i.storeProductId === storeProductId ? { ...i, qty } : i));
  }, []);

  const updateCustomQty = useCallback((storeProductId: string, customQty: number) => {
    setItems(prev => prev.map(i => i.storeProductId === storeProductId ? { ...i, customQty } : i));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, i) => sum + i.qty, 0);

  const subtotal = items.reduce((sum, i) => {
    if (i.unitType === 'pcs' || !i.customQty) {
      return sum + i.vendorPriceInr * i.qty;
    }
    // Weight/volume: price is per base_unit quantity (per kg or per litre typically)
    // vendor_price_inr is the price for the product's standard quantity
    // For simplicity: price per gram = vendorPriceInr / 1000, customQty is in grams
    const pricePerGram = i.vendorPriceInr / 1000;
    return sum + Math.round(pricePerGram * i.customQty * 100) / 100;
  }, 0);

  const storeIds = [...new Set(items.map(i => i.storeId))];
  const currentStoreId = storeIds.length > 0 ? storeIds[0] : null;

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, updateCustomQty, clearCart, totalItems, subtotal, storeIds, currentStoreId }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
