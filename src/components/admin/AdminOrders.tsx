import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

const PAGE_SIZE = 15;
const STATUSES = ['all', 'placed', 'confirmed', 'packed', 'picked_up', 'out_for_delivery', 'delivered', 'cancelled'] as const;
const STATUS_TS: Record<string, string> = {
  placed: 'placed_at', confirmed: 'confirmed_at', packed: 'packed_at',
  picked_up: 'picked_up_at', out_for_delivery: 'out_for_delivery_at',
  delivered: 'delivered_at', cancelled: 'cancelled_at',
};
const STATUS_COLORS: Record<string, string> = {
  placed: 'bg-info/10 text-info', confirmed: 'bg-primary/10 text-primary',
  packed: 'bg-accent/10 text-accent-foreground', picked_up: 'bg-warning/10 text-warning-foreground',
  out_for_delivery: 'bg-info/10 text-info', delivered: 'bg-primary/10 text-primary',
  cancelled: 'bg-destructive/10 text-destructive',
};

export default function AdminOrders() {
  const qc = useQueryClient();
  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState('all');
  const [storeFilter, setStoreFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [detail, setDetail] = useState<any>(null);

  const { data: stores } = useQuery({
    queryKey: ['admin-stores-list'],
    queryFn: async () => { const { data } = await supabase.from('stores').select('id, name').order('name'); return data || []; },
  });

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders', page, statusFilter, storeFilter, dateFrom, dateTo],
    queryFn: async () => {
      let q = supabase.from('orders').select('*, stores(name)', { count: 'exact' })
        .order('placed_at', { ascending: false });
      if (statusFilter !== 'all') q = q.eq('status', statusFilter);
      if (storeFilter !== 'all') q = q.eq('store_id', storeFilter);
      if (dateFrom) q = q.gte('placed_at', new Date(dateFrom).toISOString());
      if (dateTo) { const to = new Date(dateTo); to.setHours(23, 59, 59); q = q.lte('placed_at', to.toISOString()); }
      const from = page * PAGE_SIZE;
      q = q.range(from, from + PAGE_SIZE - 1);
      const { data, count } = await q;
      return { orders: data || [], total: count || 0 };
    },
  });

  const forceStatus = useMutation({
    mutationFn: async ({ orderId, newStatus }: { orderId: string; newStatus: string }) => {
      const tsCol = STATUS_TS[newStatus];
      const update: Record<string, any> = { status: newStatus };
      if (tsCol) update[tsCol] = new Date().toISOString();
      const { error } = await supabase.from('orders').update(update).eq('id', orderId);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-orders'] }); toast.success('Status updated'); setDetail(null); },
    onError: (e: any) => toast.error(e.message),
  });

  const openDetail = async (order: any) => {
    const { data: items } = await supabase.from('order_items').select('*').eq('order_id', order.id);
    // fetch customer name
    const { data: profile } = await supabase.from('profiles').select('display_name').eq('user_id', order.customer_id).single();
    setDetail({ ...order, items: items || [], customer_name: profile?.display_name || '—' });
  };

  const totalPages = Math.ceil((data?.total || 0) / PAGE_SIZE);

  if (isLoading) return <Skeleton className="h-64 rounded-xl" />;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-end">
        <div>
          <Label className="text-xs">Status</Label>
          <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setPage(0); }}>
            <SelectTrigger className="w-36 h-9"><SelectValue /></SelectTrigger>
            <SelectContent>{STATUSES.map(s => <SelectItem key={s} value={s}>{s === 'all' ? 'All' : s.replace(/_/g, ' ')}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">Store</Label>
          <Select value={storeFilter} onValueChange={v => { setStoreFilter(v); setPage(0); }}>
            <SelectTrigger className="w-44 h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stores</SelectItem>
              {(stores || []).map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">From</Label>
          <Input type="date" className="h-9 w-36" value={dateFrom} onChange={e => { setDateFrom(e.target.value); setPage(0); }} />
        </div>
        <div>
          <Label className="text-xs">To</Label>
          <Input type="date" className="h-9 w-36" value={dateTo} onChange={e => { setDateTo(e.target.value); setPage(0); }} />
        </div>
      </div>

      <div className="border rounded-xl overflow-hidden">
        <Table>
          <TableHeader><TableRow>
            <TableHead>Order ID</TableHead><TableHead>Store</TableHead><TableHead>Total</TableHead>
            <TableHead>Status</TableHead><TableHead>Payment</TableHead><TableHead>Placed</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {(data?.orders || []).map((o: any) => (
              <TableRow key={o.id} className="cursor-pointer" onClick={() => openDetail(o)}>
                <TableCell className="font-mono text-xs">{o.id.slice(0, 8)}</TableCell>
                <TableCell>{o.stores?.name || '—'}</TableCell>
                <TableCell>₹{o.total_inr}</TableCell>
                <TableCell><Badge variant="outline" className={`${STATUS_COLORS[o.status] || ''} rounded-lg`}>{o.status.replace(/_/g, ' ')}</Badge></TableCell>
                <TableCell>{o.payment_method}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{o.placed_at ? new Date(o.placed_at).toLocaleString() : '—'}</TableCell>
              </TableRow>
            ))}
            {!data?.orders?.length && <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No orders found</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <Button size="sm" variant="outline" disabled={page === 0} onClick={() => setPage(p => p - 1)}><ChevronLeft className="h-4 w-4" /></Button>
          <span className="text-sm text-muted-foreground">{page + 1} / {totalPages}</span>
          <Button size="sm" variant="outline" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}><ChevronRight className="h-4 w-4" /></Button>
        </div>
      )}

      <Dialog open={!!detail} onOpenChange={() => setDetail(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto max-w-lg">
          <DialogHeader><DialogTitle>Order {detail?.id?.slice(0, 8)}</DialogTitle></DialogHeader>
          {detail && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-muted-foreground">Customer:</span> {detail.customer_name}</div>
                <div><span className="text-muted-foreground">Store:</span> {detail.stores?.name}</div>
                <div><span className="text-muted-foreground">Status:</span> <Badge variant="outline" className={`${STATUS_COLORS[detail.status] || ''} rounded-lg`}>{detail.status.replace(/_/g, ' ')}</Badge></div>
                <div><span className="text-muted-foreground">Payment:</span> {detail.payment_method}</div>
                <div><span className="text-muted-foreground">Total:</span> ₹{detail.total_inr}</div>
              </div>

              <div>
                <h4 className="font-medium text-sm mb-2">Items</h4>
                <div className="space-y-1">
                  {(detail.items || []).map((item: any) => (
                    <div key={item.id} className="flex justify-between text-sm border-b border-border py-1">
                      <span>{item.product_name} × {item.quantity_in_base_unit}</span>
                      <span>₹{item.line_total_inr}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-xs">Force Update Status</Label>
                <Select onValueChange={v => forceStatus.mutate({ orderId: detail.id, newStatus: v })}>
                  <SelectTrigger className="h-9"><SelectValue placeholder="Select status" /></SelectTrigger>
                  <SelectContent>
                    {STATUSES.filter(s => s !== 'all' && s !== detail.status).map(s => (
                      <SelectItem key={s} value={s}>{s.replace(/_/g, ' ')}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
