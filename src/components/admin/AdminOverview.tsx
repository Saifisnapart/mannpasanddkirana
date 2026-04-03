import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Store, ShoppingCart, IndianRupee } from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
  placed: 'bg-info/10 text-info',
  confirmed: 'bg-primary/10 text-primary',
  packed: 'bg-accent/10 text-accent-foreground',
  picked_up: 'bg-warning/10 text-warning-foreground',
  out_for_delivery: 'bg-info/10 text-info',
  delivered: 'bg-primary/10 text-primary',
  cancelled: 'bg-destructive/10 text-destructive',
};

export default function AdminOverview() {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayISO = todayStart.toISOString();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-overview'],
    queryFn: async () => {
      const [usersRes, storesRes, ordersTodayRes, revenueRes, statusRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('stores').select('id', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('orders').select('id', { count: 'exact', head: true }).gte('placed_at', todayISO),
        supabase.from('orders').select('total_inr').eq('status', 'delivered').gte('delivered_at', todayISO),
        supabase.from('orders').select('status'),
      ]);

      const revenue = (revenueRes.data || []).reduce((s, o) => s + (o.total_inr || 0), 0);

      const statusCounts: Record<string, number> = {};
      (statusRes.data || []).forEach(o => {
        statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
      });

      return {
        totalUsers: usersRes.count || 0,
        totalStores: storesRes.count || 0,
        ordersToday: ordersTodayRes.count || 0,
        revenueToday: revenue,
        statusCounts,
      };
    },
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-28 rounded-xl" />)}
      </div>
    );
  }

  const cards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'text-primary' },
    { label: 'Active Stores', value: stats?.totalStores || 0, icon: Store, color: 'text-accent-foreground' },
    { label: 'Orders Today', value: stats?.ordersToday || 0, icon: ShoppingCart, color: 'text-info' },
    { label: 'Revenue Today', value: `₹${(stats?.revenueToday || 0).toLocaleString('en-IN')}`, icon: IndianRupee, color: 'text-primary' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(c => (
          <Card key={c.label} className="rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{c.label}</CardTitle>
              <c.icon className={`h-5 w-5 ${c.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{c.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="text-base">Orders by Status</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {Object.entries(stats?.statusCounts || {}).map(([status, count]) => (
            <Badge key={status} variant="outline" className={`${STATUS_COLORS[status] || ''} rounded-lg px-3 py-1`}>
              {status.replace(/_/g, ' ')}: {count}
            </Badge>
          ))}
          {Object.keys(stats?.statusCounts || {}).length === 0 && (
            <p className="text-sm text-muted-foreground">No orders yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
