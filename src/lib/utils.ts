import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Vendor, CartItem, ShopRanking, SplitOrder } from '@/types';
import { vendors, vendorListings, getListing, getVendor } from '@/data/sampleData';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 10) / 10;
}

export function getVendorsWithinRadius(userLat: number, userLng: number, radiusKm: number) {
  return vendors
    .map(vendor => ({ vendor, distance: calculateDistance(userLat, userLng, vendor.lat, vendor.lng) }))
    .filter(item => item.distance <= radiusKm)
    .sort((a, b) => a.distance - b.distance);
}

export function rankVendors(cartItems: CartItem[], userLat: number, userLng: number, radiusKm: number): ShopRanking[] {
  const rankings: ShopRanking[] = [];
  for (const vendor of vendors) {
    const distance = calculateDistance(userLat, userLng, vendor.lat, vendor.lng);
    if (distance > radiusKm) continue;
    let availableItems = 0, cartTotal = 0, stockStrength = 0;
    for (const cartItem of cartItems) {
      const listing = getListing(cartItem.listingId);
      if (!listing) continue;
      const vl = vendorListings.find(l => l.vendorId === vendor.id && l.productId === listing.productId && l.stock !== 'out_of_stock');
      if (vl && vl.stockQty >= cartItem.qty) { availableItems++; cartTotal += vl.price * cartItem.qty; stockStrength += vl.stockQty; }
    }
    rankings.push({ vendor, distance, availableItems, totalItems: cartItems.length, cartTotal, stockStrength, isBestMatch: false });
  }
  rankings.sort((a, b) => b.availableItems - a.availableItems || a.cartTotal - b.cartTotal || a.distance - b.distance);
  if (rankings.length > 0 && rankings[0].availableItems > 0) rankings[0].isBestMatch = true;
  return rankings;
}

export function calculateSplitOrder(cartItems: CartItem[], userLat: number, userLng: number): SplitOrder | null {
  if (!cartItems.length) return null;
  const groups = new Map<string, CartItem[]>();
  for (const item of cartItems) {
    const l = getListing(item.listingId);
    if (!l) continue;
    const g = groups.get(l.vendorId) || [];
    g.push(item);
    groups.set(l.vendorId, g);
  }
  const vIds = Array.from(groups.keys());
  const mkShop = (vId: string, items: CartItem[], best: boolean): ShopRanking => {
    const v = getVendor(vId)!;
    return { vendor: v, distance: calculateDistance(userLat, userLng, v.lat, v.lng), availableItems: items.length, totalItems: cartItems.length, cartTotal: items.reduce((s, i) => { const l = getListing(i.listingId); return s + (l ? l.price * i.qty : 0); }, 0), stockStrength: 0, isBestMatch: best };
  };
  if (vIds.length <= 1) {
    return { primaryShop: mkShop(vIds[0], groups.get(vIds[0])!, true), primaryItems: groups.get(vIds[0])!, secondaryItems: [] };
  }
  const sorted = vIds.map(id => ({ id, items: groups.get(id)!, count: groups.get(id)!.length })).sort((a, b) => b.count - a.count);
  const secItems = sorted.slice(1).flatMap(s => s.items);
  const secVendorId = sorted[1]?.id;
  return {
    primaryShop: mkShop(sorted[0].id, sorted[0].items, true),
    secondaryShop: secVendorId ? mkShop(secVendorId, secItems, false) : undefined,
    primaryItems: sorted[0].items,
    secondaryItems: secItems,
  };
}

export function formatCurrency(amount: number): string { return `₹${amount.toFixed(0)}`; }

/** Distance-based delivery fee: 0-1km = ₹10, >1km = ₹10 + ₹10 per additional km (rounded up) */
export function calculateDeliveryFee(distanceKm: number): number {
  if (distanceKm <= 1) return 10;
  return 10 + Math.ceil(distanceKm - 1) * 10;
}

export function getMockTrackingCoordinates(shopLat: number, shopLng: number, custLat: number, custLng: number, progress: number) {
  return { lat: shopLat + (custLat - shopLat) * progress, lng: shopLng + (custLng - shopLng) * progress };
}
