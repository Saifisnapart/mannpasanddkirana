import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Store, Package, ShoppingCart, Navigation, ShieldX, ArrowLeft, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

// ─── ACCESS CHECK ───
function AccessDenied() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="mb-4 p-4 rounded-full bg-destructive/10">
        <ShieldX className="h-12 w-12 text-destructive" />
      </div>
      <h1 className="font-display text-2xl font-bold text-foreground mb-2">Access Denied</h1>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm">You need a vendor account to access this dashboard.</p>
      <Button variant="outline" onClick={() => navigate('/')} className="rounded-xl gap-1">
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Button>
    </div>
  );
}

// ─── STORE ONBOARDING ───
function StoreOnboarding({ userId, onCreated }: { userId: string; onCreated: () => void }) {
  const [form, setForm] = useState({
    name: '', location_id: '', address: '', latitude: 0, longitude: 0,
    service_radius_km: 5, credit_radius_km: 1,
  });
  const [saving, setSaving] = useState(false);

  const { data: locations } = useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const { data } = await supabase.from('locations').select('*');
      return data || [];
    },
  });

  const detectLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setForm(p => ({ ...p, latitude: pos.coords.latitude, longitude: pos.coords.longitude })),
      () => toast.error('Could not detect location'),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.latitude || !form.longitude) { toast.error('Fill required fields'); return; }
    setSaving(true);
    const { error } = await supabase.from('stores').insert({
      owner_id: userId, name: form.name, address: form.address,
      location_id: form.location_id || null,
      latitude: form.latitude, longitude: form.longitude,
      service_radius_km: form.service_radius_km,
      credit_radius_km: form.credit_radius_km,
    });
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success('Store created!');
    onCreated();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-lg p-6 space-y-5">
        <div className="text-center">
          <Store className="h-8 w-8 text-primary mx-auto mb-2" />
          <h1 className="font-display text-xl font-bold text-foreground">Set Up Your Store</h1>
          <p className="text-sm text-muted-foreground">Complete your store details to start selling</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground">Store Name *</Label>
            <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required className="h-10 rounded-lg" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Location</Label>
            <Select value={form.location_id} onValueChange={v => setForm(p => ({ ...p, location_id: v }))}>
              <SelectTrigger className="rounded-lg"><SelectValue placeholder="Select location" /></SelectTrigger>
              <SelectContent>
                {locations?.map(l => <SelectItem key={l.id} value={l.id}>{l.name} ({l.type})</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Address</Label>
            <Input value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} className="h-10 rounded-lg" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground">Latitude *</Label>
              <Input type="number" step="any" value={form.latitude || ''} onChange={e => setForm(p => ({ ...p, latitude: +e.target.value }))} required className="h-10 rounded-lg" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Longitude *</Label>
              <Input type="number" step="any" value={form.longitude || ''} onChange={e => setForm(p => ({ ...p, longitude: +e.target.value }))} required className="h-10 rounded-lg" />
            </div>
          </div>
          <Button type="button" variant="outline" onClick={detectLocation} className="w-full rounded-lg gap-1 text-xs">
            <Navigation className="h-3 w-3" /> Detect My Location
          </Button>
          <div>
            <Label className="text-xs text-muted-foreground">Service Radius: {form.service_radius_km} km</Label>
            <Slider min={1} max={20} step={1} value={[form.service_radius_km]} onValueChange={([v]) => setForm(p => ({ ...p, service_radius_km: v }))} className="mt-2" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Credit Radius (km)</Label>
            <Input type="number" min={0.5} max={10} step={0.5} value={form.credit_radius_km} onChange={e => setForm(p => ({ ...p, credit_radius_km: +e.target.value }))} className="h-10 rounded-lg" />
          </div>
          <Button type="submit" disabled={saving} className="w-full h-11 rounded-xl text-sm font-semibold">
            {saving ? 'Creating...' : 'Create Store'}
          </Button>
        </form>
      </Card>
    </div>
  );
}

// ─── INVENTORY TAB ───
function InventoryTab({ storeId }: { storeId: string }) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 20;

  const { data: categories } = useQuery({
    queryKey: ['vendor-categories'],
    queryFn: async () => { const { data } = await supabase.from('categories').select('*').is('parent_id', null); return data || []; },
  });

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['vendor-products', search, catFilter, page],
    queryFn: async () => {
      let q = supabase.from('products').select('*, categories(name)', { count: 'exact' });
      if (search) q = q.ilike('name', `%${search}%`);
      if (catFilter !== 'all') q = q.eq('category_id', catFilter);
      q = q.range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1).order('name');
      const { data, count } = await q;
      return { products: data || [], total: count || 0 };
    },
  });

  const { data: storeProducts } = useQuery({
    queryKey: ['store-products', storeId],
    queryFn: async () => {
      const { data } = await supabase.from('store_products').select('*').eq('store_id', storeId);
      return data || [];
    },
  });

  const spMap = new Map((storeProducts || []).map(sp => [sp.product_id, sp]));

  const toggleProduct = async (productId: string, basePrice: number) => {
    const existing = spMap.get(productId);
    if (existing) {
      await supabase.from('store_products').update({ is_enabled: !existing.is_enabled }).eq('id', existing.id);
    } else {
      await supabase.from('store_products').insert({
        store_id: storeId, product_id: productId,
        vendor_price_inr: basePrice, stock_quantity: 0, is_enabled: true,
      });
    }
    queryClient.invalidateQueries({ queryKey: ['store-products'] });
  };

  const updateField = async (spId: string, field: string, value: number) => {
    await supabase.from('store_products').update({ [field]: value }).eq('id', spId);
    queryClient.invalidateQueries({ queryKey: ['store-products'] });
  };

  const totalPages = Math.ceil((productsData?.total || 0) / PAGE_SIZE);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={e => { setSearch(e.target.value); setPage(0); }} placeholder="Search products..." className="pl-9 h-9 rounded-lg" />
        </div>
        <Select value={catFilter} onValueChange={v => { setCatFilter(v); setPage(0); }}>
          <SelectTrigger className="w-40 rounded-lg h-9"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}</div>
      ) : (
        <div className="space-y-2">
          {productsData?.products.map(p => {
            const sp = spMap.get(p.id);
            const enabled = sp?.is_enabled ?? false;
            return (
              <Card key={p.id} className="p-3 rounded-xl">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{(p as any).categories?.name || 'Uncategorized'} · {p.base_unit} · ₹{p.base_price_inr}</p>
                  </div>
                  <Switch checked={enabled} onCheckedChange={() => toggleProduct(p.id, p.base_price_inr)} />
                </div>
                {enabled && sp && (
                  <div className="flex gap-3 mt-2 pt-2 border-t border-border">
                    <div className="flex-1">
                      <Label className="text-[10px] text-muted-foreground">Price (₹)</Label>
                      <Input type="number" defaultValue={sp.vendor_price_inr} onBlur={e => updateField(sp.id, 'vendor_price_inr', +e.target.value)} className="h-8 rounded-lg text-xs" />
                    </div>
                    <div className="flex-1">
                      <Label className="text-[10px] text-muted-foreground">Stock</Label>
                      <Input type="number" defaultValue={sp.stock_quantity} onBlur={e => updateField(sp.id, 'stock_quantity', +e.target.value)} className="h-8 rounded-lg text-xs" />
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}><ChevronLeft className="h-4 w-4" /></Button>
          <span className="text-xs text-muted-foreground">{page + 1} / {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}><ChevronRight className="h-4 w-4" /></Button>
        </div>
      )}
    </div>
  );
}

// ─── ORDERS TAB ───
const STATUS_FLOW: Record<string, { next: string; label: string; needsDriver?: boolean }> = {
  placed: { next: 'confirmed', label: 'Confirm' },
  confirmed: { next: 'packed', label: 'Mark Packed' },
  packed: { next: 'picked_up', label: 'Assign & Pick Up', needsDriver: true },
  picked_up: { next: 'out_for_delivery', label: 'Out for Delivery' },
  out_for_delivery: { next: 'delivered', label: 'Mark Delivered' },
};

const STATUS_TIMESTAMP: Record<string, string> = {
  confirmed: 'confirmed_at', packed: 'packed_at', picked_up: 'picked_up_at',
  out_for_delivery: 'out_for_delivery_at', delivered: 'delivered_at', cancelled: 'cancelled_at',
};

function OrdersTab({ storeId }: { storeId: string }) {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [driverName, setDriverName] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [deliveryPartnerId, setDeliveryPartnerId] = useState('');

  const { data: orders, isLoading } = useQuery({
    queryKey: ['vendor-orders', storeId, tab],
    queryFn: async () => {
      let q = supabase.from('orders').select('*, order_items(*)').eq('store_id', storeId).order('placed_at', { ascending: false });
      if (tab !== 'all') q = q.eq('status', tab as any);
      const { data } = await q;
      return data || [];
    },
  });

  const { data: deliveryPartners } = useQuery({
    queryKey: ['delivery-partners'],
    queryFn: async () => { const { data } = await supabase.from('delivery_partners').select('*'); return data || []; },
  });

  const updateStatus = async (orderId: string, newStatus: string, extra: Record<string, any> = {}) => {
    const tsCol = STATUS_TIMESTAMP[newStatus];
    const update: Record<string, any> = { status: newStatus, ...extra };
    if (tsCol) update[tsCol] = new Date().toISOString();
    const { error } = await supabase.from('orders').update(update).eq('id', orderId);
    if (error) { toast.error(error.message); return; }
    toast.success(`Order ${newStatus}`);
    queryClient.invalidateQueries({ queryKey: ['vendor-orders'] });
    setSelectedOrder(null);
  };

  const statusTabs = ['all', 'placed', 'confirmed', 'packed', 'picked_up', 'out_for_delivery', 'delivered', 'cancelled'];

  const statusColor = (s: string) => {
    const map: Record<string, string> = {
      placed: 'bg-blue-100 text-blue-800', confirmed: 'bg-yellow-100 text-yellow-800',
      packed: 'bg-orange-100 text-orange-800', picked_up: 'bg-purple-100 text-purple-800',
      out_for_delivery: 'bg-indigo-100 text-indigo-800', delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return map[s] || 'bg-muted text-muted-foreground';
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto -mx-4 px-4">
        <div className="flex gap-1.5 min-w-max">
          {statusTabs.map(s => (
            <button key={s} onClick={() => setTab(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${tab === s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
              {s === 'all' ? 'All' : s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}</div>
      ) : orders?.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingCart className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No orders found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {orders?.map(o => (
            <Card key={o.id} className="p-3 rounded-xl cursor-pointer hover:ring-1 hover:ring-primary/20 transition-all" onClick={() => setSelectedOrder(o)}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">#{o.id.slice(0, 8)}</p>
                  <p className="text-xs text-muted-foreground">₹{o.total_inr} · {o.payment_method}</p>
                </div>
                <div className="text-right">
                  <Badge className={`text-[10px] ${statusColor(o.status)}`}>{o.status.replace(/_/g, ' ')}</Badge>
                  <p className="text-[10px] text-muted-foreground mt-1">{new Date(o.placed_at || o.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="text-base">Order #{selectedOrder.id.slice(0, 8)}</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Items</p>
                  {selectedOrder.order_items?.map((item: any) => (
                    <div key={item.id} className="flex justify-between text-sm py-1 border-b border-border last:border-0">
                      <span className="text-foreground">{item.product_name} × {item.quantity_in_base_unit}</span>
                      <span className="font-medium text-foreground">₹{item.line_total_inr}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-sm font-semibold text-foreground pt-1">
                  <span>Total</span><span>₹{selectedOrder.total_inr}</span>
                </div>
                <Badge className={`${statusColor(selectedOrder.status)}`}>{selectedOrder.status.replace(/_/g, ' ')}</Badge>
                <Badge variant="outline" className="ml-2">{selectedOrder.payment_method}</Badge>

                {/* Status action */}
                {STATUS_FLOW[selectedOrder.status] && (
                  <div className="pt-2 space-y-2">
                    {STATUS_FLOW[selectedOrder.status].needsDriver && (
                      <>
                        <Input placeholder="Driver name" value={driverName} onChange={e => setDriverName(e.target.value)} className="h-9 rounded-lg text-sm" />
                        <Input placeholder="Driver phone" value={driverPhone} onChange={e => setDriverPhone(e.target.value)} className="h-9 rounded-lg text-sm" />
                        <Select value={deliveryPartnerId} onValueChange={setDeliveryPartnerId}>
                          <SelectTrigger className="rounded-lg h-9"><SelectValue placeholder="Delivery partner" /></SelectTrigger>
                          <SelectContent>
                            {deliveryPartners?.map(dp => <SelectItem key={dp.id} value={dp.id}>{dp.name}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </>
                    )}
                    <Button className="w-full rounded-xl" onClick={() => {
                      const flow = STATUS_FLOW[selectedOrder.status];
                      const extra: Record<string, any> = {};
                      if (flow.needsDriver) {
                        if (!driverName) { toast.error('Enter driver name'); return; }
                        extra.driver_name = driverName;
                        extra.driver_phone = driverPhone;
                        extra.delivery_partner_id = deliveryPartnerId || null;
                      }
                      updateStatus(selectedOrder.id, flow.next, extra);
                    }}>
                      {STATUS_FLOW[selectedOrder.status].label}
                    </Button>
                  </div>
                )}

                {selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'delivered' && (
                  <Button variant="destructive" className="w-full rounded-xl" onClick={() => updateStatus(selectedOrder.id, 'cancelled')}>
                    Cancel Order
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── MAIN DASHBOARD ───
export default function VendorDashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: isVendor, isLoading: roleLoading } = useQuery({
    queryKey: ['vendor-role', user?.id],
    queryFn: async () => {
      if (!user) return false;
      const { data } = await supabase.from('user_roles').select('id').eq('user_id', user.id).eq('role', 'vendor' as any);
      return (data?.length ?? 0) > 0;
    },
    enabled: !!user,
  });

  const { data: store, isLoading: storeLoading, refetch: refetchStore } = useQuery({
    queryKey: ['vendor-store', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase.from('stores').select('*').eq('owner_id', user.id).limit(1).single();
      return data;
    },
    enabled: !!user && isVendor === true,
  });

  if (roleLoading || storeLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-4 w-64">
          <Skeleton className="h-8 w-full" /><Skeleton className="h-4 w-3/4" /><Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    );
  }

  if (!isVendor) return <AccessDenied />;
  if (!store) return <StoreOnboarding userId={user!.id} onCreated={() => refetchStore()} />;

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-30 bg-card border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Store className="h-5 w-5 text-primary" />
          <div>
            <h1 className="text-sm font-bold text-foreground">{store.name}</h1>
            <p className="text-[10px] text-muted-foreground">{store.address || 'Vendor Dashboard'}</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-4">
        <Tabs defaultValue="inventory">
          <TabsList className="w-full rounded-xl mb-4">
            <TabsTrigger value="inventory" className="flex-1 gap-1 rounded-lg"><Package className="h-3.5 w-3.5" /> Inventory</TabsTrigger>
            <TabsTrigger value="orders" className="flex-1 gap-1 rounded-lg"><ShoppingCart className="h-3.5 w-3.5" /> Orders</TabsTrigger>
          </TabsList>
          <TabsContent value="inventory"><InventoryTab storeId={store.id} /></TabsContent>
          <TabsContent value="orders"><OrdersTab storeId={store.id} /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
