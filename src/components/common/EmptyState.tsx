import { SearchX, ShoppingCart, PackageOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface EmptyStateProps {
  type: 'search' | 'cart' | 'orders';
  query?: string;
}

export default function EmptyState({ type, query }: EmptyStateProps) {
  const navigate = useNavigate();

  const config = {
    search: {
      icon: <SearchX className="h-12 w-12 text-muted-foreground" />,
      title: query ? `No results for "${query}"` : 'Search for products',
      description: query ? 'Try a different search term or check spelling.' : 'Enter a product name to find vendors near you.',
      cta: query ? 'Browse Categories' : undefined,
      ctaAction: () => navigate('/home'),
    },
    cart: {
      icon: <ShoppingCart className="h-12 w-12 text-muted-foreground" />,
      title: 'Your cart is empty',
      description: 'Search for products and add them from your preferred vendor.',
      cta: 'Start Shopping',
      ctaAction: () => navigate('/home'),
    },
    orders: {
      icon: <PackageOpen className="h-12 w-12 text-muted-foreground" />,
      title: 'No orders yet',
      description: 'Once you place an order, it will appear here.',
      cta: 'Start Shopping',
      ctaAction: () => navigate('/home'),
    },
  };

  const c = config[type];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="mb-4 p-4 rounded-full bg-secondary">{c.icon}</div>
      <h3 className="font-display text-lg font-semibold text-foreground mb-1">{c.title}</h3>
      <p className="text-sm text-muted-foreground mb-4 max-w-xs">{c.description}</p>
      {c.cta && <Button onClick={c.ctaAction} className="rounded-xl">{c.cta}</Button>}
    </div>
  );
}
