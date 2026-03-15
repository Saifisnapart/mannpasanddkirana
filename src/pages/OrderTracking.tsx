import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { sampleOrders, getVendor, formatPrice } from '@/data/sampleData';
import { useLocation } from '@/contexts/LocationContext';
import { getMockTrackingCoordinates } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Phone } from 'lucide-react';
import type { Order } from '@/types';

export default function OrderTracking() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { userLocation } = useLocation();
  const order = sampleOrders.find(o => o.id === orderId);

  const [trackingProgress, setTrackingProgress] = useState(0);
  const [currentStatus, setCurrentStatus] = useState<Order['status']>('placed');

  const primaryVendor = order ? getVendor(order.vendorIds[0]) : null;
  const secondaryVendor = order && order.vendorIds.length > 1 ? getVendor(order.vendorIds[1]) : null;

  useEffect(() => {
    if (!order) return;
    setCurrentStatus(order.status);

    const statusTimeline: { status: Order['status']; time: number }[] = [
      { status: 'placed', time: 0 },
      { status: 'preparing', time: 5000 },
      { status: 'picked_up', time: 10000 },
      { status: 'out_for_delivery', time: 15000 },
      { status: 'delivered', time: 25000 },
    ];

    const timers: NodeJS.Timeout[] = [];
    statusTimeline.forEach(({ status, time }) => {
      const timer = setTimeout(() => {
        setCurrentStatus(status);
        const index = statusTimeline.findIndex(s => s.status === status);
        setTrackingProgress((index + 1) / statusTimeline.length);
      }, time);
      timers.push(timer);
    });

    return () => timers.forEach(clearTimeout);
  }, [order]);

  if (!order || !primaryVendor) {
    return (
      <div className="px-4 py-16 text-center">
        <p className="text-muted-foreground">Order not found</p>
        <Button variant="outline" onClick={() => navigate('/orders')} className="mt-4">View Orders</Button>
      </div>
    );
  }

  const deliveryLocation = userLocation && primaryVendor
    ? getMockTrackingCoordinates(primaryVendor.lat, primaryVendor.lng, userLocation.lat, userLocation.lng, trackingProgress)
    : null;

  const statusSteps = [
    { id: 'placed', label: 'Order Placed', icon: '✓', time: '2 min ago' },
    { id: 'preparing', label: 'Shop Preparing', icon: '📦', time: currentStatus === 'placed' ? 'Pending' : '5 min ago' },
    { id: 'picked_up', label: 'Picked Up', icon: '🏍️', time: ['placed', 'preparing'].includes(currentStatus) ? 'Pending' : '10 min ago' },
    { id: 'out_for_delivery', label: 'On the Way', icon: '🚚', time: currentStatus === 'delivered' ? '15 min ago' : currentStatus === 'out_for_delivery' ? 'Now' : 'Pending' },
    { id: 'delivered', label: 'Delivered', icon: '🎉', time: currentStatus === 'delivered' ? 'Just now' : 'Pending' },
  ];

  const currentStepIndex = statusSteps.findIndex(s => s.id === currentStatus);
  const etaMinutes = currentStatus === 'delivered' ? 0 : Math.max(25 - Math.floor(trackingProgress * 25), 5);

  return (
    <div className="px-4 py-4 space-y-4">
      <button onClick={() => navigate('/orders')} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Orders
      </button>

      <div>
        <h1 className="font-display text-xl font-bold text-foreground">Track Order</h1>
        <p className="text-xs text-muted-foreground">Order ID: {order.id}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Mock Map */}
        <Card className="p-4">
          <h3 className="font-semibold text-sm text-foreground mb-3">Live Tracking</h3>
          <div className="relative bg-gradient-to-br from-primary/5 to-info/5 rounded-xl overflow-hidden" style={{ height: '300px' }}>
            <div className="absolute inset-0" style={{
              backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 40px, hsl(var(--border)) 40px, hsl(var(--border)) 41px),
                               repeating-linear-gradient(90deg, transparent, transparent 40px, hsl(var(--border)) 40px, hsl(var(--border)) 41px)`
            }} />

            {/* Shop */}
            <div className="absolute" style={{ top: '15%', left: '25%' }}>
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-lg shadow-lg border-4 border-card">
                {primaryVendor.image}
              </div>
              <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-card px-2 py-0.5 rounded shadow-md whitespace-nowrap text-[10px] font-medium text-foreground">
                {primaryVendor.name}
              </div>
            </div>

            {/* Delivery agent */}
            {deliveryLocation && !['placed', 'preparing'].includes(currentStatus) && (
              <div
                className="absolute transition-all duration-1000"
                style={{ top: `${15 + trackingProgress * 60}%`, left: `${25 + trackingProgress * 45}%` }}
              >
                <div className="relative animate-bounce">
                  <div className="w-12 h-12 bg-info rounded-full flex items-center justify-center text-2xl shadow-lg border-4 border-card">
                    🏍️
                  </div>
                  {currentStatus === 'out_for_delivery' && (
                    <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-info text-info-foreground px-2 py-0.5 rounded shadow-md whitespace-nowrap text-[10px] font-bold">
                      {etaMinutes} min away
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Customer */}
            <div className="absolute" style={{ top: '75%', left: '70%' }}>
              <div className="w-10 h-10 bg-destructive rounded-full flex items-center justify-center text-lg shadow-lg border-4 border-card">
                📍
              </div>
              <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-card px-2 py-0.5 rounded shadow-md whitespace-nowrap text-[10px] font-medium text-foreground">
                You
              </div>
            </div>

            {!['placed', 'preparing'].includes(currentStatus) && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <line x1="30%" y1="20%" x2="73%" y2="80%" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="8,4" opacity="0.4" />
              </svg>
            )}
          </div>

          <div className="mt-3 bg-primary/5 rounded-lg p-3 border border-primary/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Estimated Delivery</p>
                <p className="font-bold text-base text-primary">
                  {currentStatus === 'delivered' ? 'Delivered! 🎉' : `${etaMinutes} minutes`}
                </p>
              </div>
              <span className="text-3xl">{currentStatus === 'delivered' ? '🎉' : '⏱️'}</span>
            </div>
          </div>
        </Card>

        {/* Status + Details */}
        <div className="space-y-4">
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
                      <p className="text-[10px] text-muted-foreground">{step.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Delivery Partner */}
          {!['placed', 'preparing'].includes(currentStatus) && (
            <Card className="p-4">
              <h3 className="font-semibold text-sm text-foreground mb-3">Delivery Partner</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-xl">👤</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Rajesh Kumar</p>
                  <p className="text-xs text-muted-foreground">Delivery Partner</p>
                </div>
                <Button size="sm" className="rounded-lg gap-1 h-8 text-xs">
                  <Phone className="h-3 w-3" /> Call
                </Button>
              </div>
            </Card>
          )}

          {/* Fulfillment */}
          <Card className="p-4">
            <h3 className="font-semibold text-sm text-foreground mb-3">Fulfillment</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{primaryVendor.image}</span>
                <div>
                  <p className="text-sm font-medium text-foreground">{primaryVendor.name}</p>
                  <p className="text-[10px] text-muted-foreground">Primary shop • {order.items.filter(i => i.vendorId === primaryVendor.id).length} items</p>
                </div>
              </div>
              {secondaryVendor && (
                <div className="flex items-center gap-2">
                  <span className="text-lg">{secondaryVendor.image}</span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{secondaryVendor.name}</p>
                    <p className="text-[10px] text-muted-foreground">Split order • {order.items.filter(i => i.vendorId === secondaryVendor.id).length} items</p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Order Total */}
          <Card className="p-4 space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Subtotal</span><span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Delivery</span><span>{formatPrice(order.deliveryFee)}</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Tax</span><span>{formatPrice(order.taxAmount)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-foreground border-t pt-1">
              <span>Total</span><span className="text-primary">{formatPrice(order.total)}</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
