import { sampleOrders, getVendor, formatPrice } from '@/data/sampleData';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/common/EmptyState';
import { useNavigate } from 'react-router-dom';
import { RotateCcw, Eye, MapPin } from 'lucide-react';

const statusConfig: Record<string, { label: string; className: string }> = {
  placed: { label: 'Placed', className: 'bg-info/10 text-info border-info/20' },
  confirmed: { label: 'Confirmed', className: 'bg-primary/10 text-primary border-primary/20' },
  preparing: { label: 'Preparing', className: 'bg-accent/10 text-accent-foreground border-accent/20' },
  picked_up: { label: 'Picked Up', className: 'bg-accent/10 text-accent-foreground border-accent/20' },
  out_for_delivery: { label: 'Out for Delivery', className: 'bg-accent/10 text-accent-foreground border-accent/20' },
  delivered: { label: 'Delivered', className: 'bg-primary/10 text-primary border-primary/20' },
  cancelled: { label: 'Cancelled', className: 'bg-destructive/10 text-destructive border-destructive/20' },
};

export default function Orders() {
  const navigate = useNavigate();

  if (sampleOrders.length === 0) {
    return <EmptyState type="orders" />;
  }

  return (
    <div className="px-4 py-4 space-y-4">
      <h1 className="font-display text-xl font-bold text-foreground">Your Orders</h1>

      <div className="space-y-3">
        {sampleOrders.map(order => {
          const vendorNames = order.vendorIds.map(id => getVendor(id)?.name || 'Unknown');
          const sc = statusConfig[order.status];
          const isActive = ['placed', 'confirmed', 'preparing', 'picked_up', 'out_for_delivery'].includes(order.status);
          return (
            <Card key={order.id} className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-semibold text-foreground">{vendorNames.join(' + ')}</p>
                  <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
                <Badge className={`${sc.className} text-[10px]`}>{sc.label}</Badge>
              </div>

              <div className="space-y-1 mb-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{item.productName} x {item.qty}</span>
                    <span className="text-foreground">{formatPrice(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between border-t pt-2">
                <span className="text-sm font-bold text-foreground">{formatPrice(order.total)}</span>
                <div className="flex gap-2">
                  {isActive && (
                    <Button variant="outline" size="sm" className="text-xs h-7 rounded-lg gap-1" onClick={() => navigate(`/orders/${order.id}/track`)}>
                      <MapPin className="h-3 w-3" /> Track
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="text-xs h-7 rounded-lg gap-1">
                    <Eye className="h-3 w-3" /> Details
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs h-7 rounded-lg gap-1" onClick={() => navigate('/home')}>
                    <RotateCcw className="h-3 w-3" /> Reorder
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
