import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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

export function formatCurrency(amount: number): string { return `₹${amount.toFixed(0)}`; }

/** Distance-based delivery fee: 0-1km = ₹10, >1km = ₹10 + ₹10 per additional km (rounded up) */
export function calculateDeliveryFee(distanceKm: number): number {
  if (distanceKm <= 1) return 10;
  return 10 + Math.ceil(distanceKm - 1) * 10;
}

export function getMockTrackingCoordinates(shopLat: number, shopLng: number, custLat: number, custLng: number, progress: number) {
  return { lat: shopLat + (custLat - shopLat) * progress, lng: shopLng + (custLng - shopLng) * progress };
}
