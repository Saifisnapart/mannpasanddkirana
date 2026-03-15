import { Outlet, Link } from 'react-router-dom';
import MobileBottomNav from './MobileBottomNav';
import { useCart } from '@/contexts/CartContext';
import { useLocation } from '@/contexts/LocationContext';
import { ShoppingCart, Store, MapPin } from 'lucide-react';

export default function CustomerLayout() {
  const { totalItems } = useCart();
  const { areaName } = useLocation();

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Desktop top nav */}
      <header className="hidden md:block sticky top-0 z-40 bg-card border-b shadow-sm">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <Store className="h-6 w-6 text-primary" />
              <span className="font-display text-xl font-bold text-foreground">MannPasandd</span>
            </Link>
            {areaName && (
              <Link to="/shops" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                <MapPin className="h-3 w-3" /> {areaName}
              </Link>
            )}
          </div>
          <nav className="flex items-center gap-6">
            <Link to="/home" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Home</Link>
            <Link to="/search" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Search</Link>
            <Link to="/shops" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Shops</Link>
            <Link to="/orders" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Orders</Link>
            <Link to="/profile" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Profile</Link>
            <Link to="/cart" className="relative">
              <ShoppingCart className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 h-5 min-w-[20px] rounded-full bg-primary text-primary-foreground text-[11px] font-bold flex items-center justify-center px-1">
                  {totalItems}
                </span>
              )}
            </Link>
          </nav>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto">
        <Outlet />
      </main>

      <MobileBottomNav />
    </div>
  );
}
