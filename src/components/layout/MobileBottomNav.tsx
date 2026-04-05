import { Link, useLocation as useRouterLocation } from 'react-router-dom';
import { Home, Search, ShoppingCart, ClipboardList, User, Store } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

export default function MobileBottomNav() {
  const location = useRouterLocation();
  const { totalItems } = useCart();
  const { t } = useLanguage();

  const navItems = [
    { path: '/home', label: t('home'), icon: Home },
    { path: '/search', label: t('search'), icon: Search },
    { path: '/shops', label: t('shops'), icon: Store },
    { path: '/cart', label: t('cart'), icon: ShoppingCart },
    { path: '/orders', label: t('orders'), icon: ClipboardList },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card shadow-[0_-2px_10px_hsl(var(--border)/0.5)] md:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1 text-xs transition-colors relative",
                isActive ? "text-primary font-semibold" : "text-muted-foreground"
              )}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {path === '/cart' && totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-2 h-4 min-w-[16px] rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center px-1">
                    {totalItems}
                  </span>
                )}
              </div>
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
