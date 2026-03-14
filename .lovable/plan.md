

# VendorChoice Provisions — Build Plan

## Overview

A mobile-first Indian multi-vendor grocery marketplace where customers search products, compare vendors offering that product, and order from one vendor at a time.

## Architecture

```text
src/
├── components/
│   ├── layout/
│   │   ├── MobileBottomNav.tsx
│   │   ├── TopSearchBar.tsx
│   │   └── CustomerLayout.tsx
│   ├── product/
│   │   ├── VendorComparisonCard.tsx
│   │   ├── ProductCard.tsx
│   │   ├── PriceDisplay.tsx
│   │   ├── StockBadge.tsx
│   │   ├── DeliveryBadge.tsx
│   │   └── StoreBadge.tsx
│   ├── cart/
│   │   ├── CartItem.tsx
│   │   └── CartConflictModal.tsx
│   ├── filters/
│   │   ├── SortDropdown.tsx
│   │   ├── FilterDrawer.tsx
│   │   └── FilterChips.tsx
│   └── common/
│       ├── EmptyState.tsx
│       └── SkeletonLoaders.tsx
├── contexts/
│   └── CartContext.tsx        (single-vendor cart state)
├── data/
│   └── sampleData.ts          (mock vendors, products, listings)
├── pages/
│   ├── Landing.tsx
│   ├── CustomerHome.tsx
│   ├── SearchResults.tsx
│   ├── VendorStorefront.tsx
│   ├── ProductDetail.tsx
│   ├── Cart.tsx
│   ├── Checkout.tsx
│   ├── Orders.tsx
│   ├── Profile.tsx
│   ├── VendorDashboard.tsx    (placeholder)
│   └── AdminDashboard.tsx     (placeholder)
```

## Routes

| Path | Page |
|---|---|
| `/` | Landing |
| `/home` | CustomerHome |
| `/search?q=` | SearchResults |
| `/vendors/:slug` | VendorStorefront |
| `/products/:id` | ProductDetail |
| `/cart` | Cart |
| `/checkout` | Checkout |
| `/orders` | Orders |
| `/profile` | Profile |
| `/vendor/dashboard` | Placeholder |
| `/admin/dashboard` | Placeholder |

## Key Data Structures

```typescript
interface Vendor {
  id: string; slug: string; name: string;
  rating: number; locality: string;
  deliveryEstimate: string; isOpen: boolean;
  minOrder: number; banner?: string;
}

interface Product {
  id: string; name: string; brand: string;
  category: string; image: string;
}

interface VendorListing {
  id: string; productId: string; vendorId: string;
  price: number; mrp?: number; quantity: string;
  unit: string; stock: 'in_stock' | 'low_stock' | 'out_of_stock';
}

// Cart locked to single vendor
interface CartState {
  vendorId: string | null;
  items: { listingId: string; qty: number }[];
}
```

## Core Behaviors

1. **Search + Compare**: Searching "curd" returns all VendorListings matching that product, displayed as comparison cards sorted by price (asc), then quantity (desc) for ties.

2. **Single-vendor cart**: CartContext tracks `vendorId`. Adding from a different vendor triggers CartConflictModal ("Clear cart and switch vendor?").

3. **Sorting**: Default price low→high. Options: price high→low, quantity high→low, vendor rating, delivery time.

4. **Filtering**: FilterDrawer on mobile with brand, price range, quantity range, locality, in-stock only, open vendors only.

5. **Badges**: "Lowest Price" on cheapest listing, "Higher Quantity" on largest pack at same price, "Fast Delivery" on quickest.

## Design Tokens

- White/light background, green accent (`#16a34a` / `green-600`)
- Rounded cards with subtle shadows
- Mobile-first: sticky bottom nav (Home, Search, Cart, Orders, Profile)
- INR currency formatting throughout
- Readable typography, generous spacing

## Sample Data

Five vendors with curd listings as specified in the prompt, plus additional products (milk, rice, atta, oil, sugar, detergent, bread, eggs) across vendors to populate home page and vendor storefronts.

## Implementation Order

1. Sample data + types + CartContext
2. Layout components (CustomerLayout, MobileBottomNav, TopSearchBar)
3. Reusable components (comparison cards, badges, price display, filters, modals, empty/skeleton states)
4. Pages in flow order: Landing → Home → SearchResults → VendorStorefront → ProductDetail → Cart → Checkout → Orders → Profile
5. Placeholder pages for vendor/admin dashboards
6. Wire up routes in App.tsx

