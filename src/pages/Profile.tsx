import { sampleAddresses, vendors } from '@/data/sampleData';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, MapPin, Store, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const navigate = useNavigate();

  return (
    <div className="px-4 py-4 space-y-5">
      <h1 className="font-display text-xl font-bold text-foreground">Profile</h1>

      {/* Personal Details */}
      <Card className="p-4 space-y-3">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-1"><User className="h-4 w-4" /> Personal Details</h2>
        <div className="space-y-2">
          <div>
            <Label className="text-xs text-muted-foreground">Name</Label>
            <Input defaultValue="Ravi Kumar" className="h-9 text-sm rounded-lg" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Phone</Label>
            <Input defaultValue="+91 98765 43210" className="h-9 text-sm rounded-lg" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Email</Label>
            <Input defaultValue="ravi@example.com" className="h-9 text-sm rounded-lg" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Preferred Pincode</Label>
            <Input defaultValue="411018" className="h-9 text-sm rounded-lg" />
          </div>
        </div>
        <Button size="sm" className="rounded-lg text-xs">Save Changes</Button>
      </Card>

      {/* Saved Addresses */}
      <Card className="p-4 space-y-3">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-1"><MapPin className="h-4 w-4" /> Saved Addresses</h2>
        {sampleAddresses.map(a => (
          <div key={a.id} className="flex items-start gap-2 p-2 rounded-lg bg-secondary">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-medium text-foreground">{a.label} {a.isDefault && <span className="text-primary">(Default)</span>}</p>
              <p className="text-[11px] text-muted-foreground">{a.full}</p>
            </div>
          </div>
        ))}
        <Button variant="outline" size="sm" className="text-xs rounded-lg">+ Add Address</Button>
      </Card>

      {/* Recent Vendors */}
      <Card className="p-4 space-y-3">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-1"><Store className="h-4 w-4" /> Recent Vendors</h2>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {vendors.slice(0, 3).map(v => (
            <button
              key={v.id}
              onClick={() => navigate(`/vendors/${v.slug}`)}
              className="shrink-0 flex flex-col items-center gap-1 p-2 rounded-xl bg-secondary w-20"
            >
              <span className="text-lg">🏪</span>
              <span className="text-[10px] font-medium text-foreground text-center leading-tight">{v.name}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* Actions */}
      <div className="space-y-2">
        <Button variant="outline" className="w-full justify-start gap-2 rounded-lg text-sm h-10">
          <Settings className="h-4 w-4" /> Settings
        </Button>
        <Button variant="outline" className="w-full justify-start gap-2 rounded-lg text-sm h-10 text-destructive border-destructive/20 hover:bg-destructive/10">
          <LogOut className="h-4 w-4" /> Log Out
        </Button>
      </div>
    </div>
  );
}
