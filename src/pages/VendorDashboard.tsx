import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Store, ArrowLeft } from 'lucide-react';

export default function VendorDashboard() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="mb-4 p-4 rounded-full bg-primary/10">
        <Store className="h-12 w-12 text-primary" />
      </div>
      <h1 className="font-display text-2xl font-bold text-foreground mb-2">Vendor Dashboard</h1>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm">
        This is a placeholder for the vendor dashboard. Vendors will be able to manage products, orders, and store settings here.
      </p>
      <Button variant="outline" onClick={() => navigate('/')} className="rounded-xl gap-1">
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Button>
    </div>
  );
}
