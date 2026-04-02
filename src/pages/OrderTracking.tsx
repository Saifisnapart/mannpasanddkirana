import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Phone } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function OrderTracking() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const { data } = await supabase
        .from('orders')
        .select('*, stores(name, latitude, longitude), order_items(*), delivery_partners(name, tagline)')
        .eq('id', orderId!)
        .eq('customer_id', user!.id)
        .single();
      return data;
    },
    enabled: !!orderId && !!user,
  });

  if (isLoading) {
    return (
      <div className="px-4 py-4 space-y-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="px-4 py-16 text-center">
        <p className="text-muted-foreground">Order not found</p>
        <Button variant="outline" onClick={() => navigate('/orders')} className="mt-4">View Orders</Button>
      </div>
    );
  }

  const statusSteps = [
    { id: 'placed', label: 'Order Placed', icon: '✓', timestamp: order.placed_at },
    { id: 'confirmed', label: 'Confirmed', icon: '📋', timestamp: order.confirmed_at },
    { id: 'packed', label: 'Packed', icon: '📦', timestamp: order.packed_at },
    { id: 'picked_up', label: 'Picked Up', icon: '🏍️', timestamp: order.picked_up_at },
    { id: 'out_for_delivery', label: 'Out for Delivery', icon: '🚚', timestamp: order.out_for_delivery_at },
    { id: 'delivered', label: 'Delivered', icon: '🎉', timestamp: order.delivered_at },
  ];

  const currentStepIndex = statusSteps.findIndex(s => s.id === order.status);

  const formatTime = (ts: string | null) => {
    if (!ts) return 'Pending';
    return new Date(ts).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  return (
    <div className="px-4 py-4 space-y-4">
      <button onClick={() => navigate('/orders')} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Orders
      </button>

      <div>
        <h1 className="font-display text-xl font-bold text-foreground">Track Order</h1>
        <p className="text-xs text-muted-foreground">Order #{order.id.slice(0, 8)}</p>
      </div>

      {order.status === 'cancelled' && (
        <Card className="p-4 border-destructive/30 bg-destructive/5">
          <p className="text-sm font-medium text-destructive">This order was cancelled</p>
          {order.cancelled_at && <p className="text-xs text-muted-foreground mt-1">at {formatTime(order.cancelled_at)}</p>}
        </Card>
      )}

      <Card className="p-4">
        <h3 className="font-semibold text-sm text-foreground mb-3">Order Status</h3>
        <div className="space-y-3">
          {statusSteps.map((step, idx) => {
            const isCompleted = idx <= currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            return (
              <div key={step.id} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    isCompleted ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
                  } ${isCurrent ? 'ring-3 ring-primary/30' : ''}`}>
                    {step.icon}
                  </div>
                  {idx < statusSteps.length - 1 && (
                    <div className={`w-0.5 h-6 transition-colors ${isCompleted ? 'bg-primary' : 'bg-border'}`} />
                  )}
                </div>
                <div className="pt-1">
                  <p className={`text-sm font-medium ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>{step.label}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {step.timestamp ? `${formatTime(step.timestamp)} – ${step.label}` : 'Pending'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Delivery Partner */}
      {order.delivery_partners && (
        <Card className="p-4">
          <h3 className="font-semibold text-sm text-foreground mb-3">Delivery Partner</h3>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-xl">🚚</div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{order.delivery_partners.name}</p>
              {order.delivery_partners.tagline && <p className="text-xs text-muted-foreground">{order.delivery_partners.tagline}</p>}
            </div>
            {order.driver_phone && (
              <Button size="sm" className="rounded-lg gap-1 h-8 text-xs">
                <Phone className="h-3 w-3" /> Call
              </Button>
            )}
          </div>
          {order.driver_name && <p className="text-xs text-muted-foreground mt-2">Driver: {order.driver_name}</p>}
        </Card>
      )}

      {/* Store */}
      <Card className="p-4">
        <h3 className="font-semibold text-sm text-foreground mb-2">Fulfilled by</h3>
        <p className="text-sm font-medium text-foreground">{order.stores?.name}</p>
      </Card>

      {/* Invoice */}
      <Card className="p-4 space-y-1">
        <h3 className="font-semibold text-sm text-foreground mb-2">Invoice</h3>
        {order.order_items?.map((item: any) => (
          <div key={item.id} className="flex justify-between text-xs">
            <span className="text-muted-foreground">{item.product_name} × {item.quantity_in_base_unit}</span>
            <span className="text-foreground">₹{Math.round(item.line_total_inr)}</span>
          </div>
        ))}
        <div className="flex justify-between text-sm font-bold text-foreground border-t pt-2 mt-2">
          <span>Total</span>
          <span className="text-primary">{order.total_display || `₹${Math.round(order.total_inr)}`}</span>
        </div>
        <p className="text-[10px] text-muted-foreground">Payment: {order.payment_method}</p>
      </Card>
    </div>
  );
}
