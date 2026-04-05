import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/common/EmptyState';
import { useNavigate } from 'react-router-dom';
import { MapPin, Eye } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const statusConfig: Record<string, { label: string; className: string }> = {
  placed: { label: 'Placed', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
  confirmed: { label: 'Confirmed', className: 'bg-primary/10 text-primary' },
  packed: { label: 'Packed', className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' },
  picked_up: { label: 'Picked Up', className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' },
  out_for_delivery: { label: 'Out for Delivery', className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' },
  delivered: { label: 'Delivered', className: 'bg-primary/10 text-primary' },
  cancelled: { label: 'Cancelled', className: 'bg-destructive/10 text-destructive' },
};

export default function Orders() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const { t } = useLanguage();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('orders')
        .select('*, stores(name), order_items(*)')
        .eq('customer_id', user!.id)
        .order('placed_at', { ascending: false });
      return data || [];
    },
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="px-4 py-4 space-y-4">
        <h1 className="font-display text-xl font-bold text-foreground">{t('orders')}</h1>
        {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)}
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="px-4 py-16 text-center">
        <p className="text-muted-foreground">{t('no_orders')}</p>
        <Button variant="outline" onClick={() => navigate('/home')} className="mt-4 rounded-xl">{t('home')}</Button>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 space-y-4">
      <h1 className="font-display text-xl font-bold text-foreground">{t('orders')}</h1>
      <div className="space-y-3">
        {orders.map((order: any) => {
          const sc = statusConfig[order.status] || statusConfig.placed;
          const isActive = ['placed', 'confirmed', 'packed', 'picked_up', 'out_for_delivery'].includes(order.status);
          const placedDate = order.placed_at ? new Date(order.placed_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

          return (
            <Card key={order.id} className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-semibold text-foreground">{order.stores?.name || 'Store'}</p>
                  <p className="text-xs text-muted-foreground">{placedDate}</p>
                  <p className="text-[10px] text-muted-foreground">#{order.id.slice(0, 8)}</p>
                </div>
                <Badge className={`${sc.className} text-[10px]`}>{sc.label}</Badge>
              </div>

              <div className="space-y-1 mb-3">
                {order.order_items?.slice(0, 3).map((item: any) => (
                  <div key={item.id} className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{item.product_name} × {item.quantity_in_base_unit}</span>
                    <span className="text-foreground">{formatPrice(Math.round(item.line_total_inr))}</span>
                  </div>
                ))}
                {order.order_items?.length > 3 && <p className="text-[10px] text-muted-foreground">+{order.order_items.length - 3} more</p>}
              </div>

              <div className="flex items-center justify-between border-t pt-2">
                <span className="text-sm font-bold text-foreground">{formatPrice(Math.round(order.total_inr))}</span>
                <div className="flex gap-2">
                  {isActive && (
                    <Button variant="outline" size="sm" className="text-xs h-7 rounded-lg gap-1" onClick={() => navigate(`/orders/${order.id}/track`)}>
                      <MapPin className="h-3 w-3" /> Track
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="text-xs h-7 rounded-lg gap-1" onClick={() => navigate(`/orders/${order.id}/track`)}>
                    <Eye className="h-3 w-3" /> Details
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
