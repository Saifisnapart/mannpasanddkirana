import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';
import {
  SidebarProvider, SidebarTrigger, Sidebar, SidebarContent,
  SidebarGroup, SidebarGroupLabel, SidebarGroupContent,
  SidebarMenu, SidebarMenuItem, SidebarMenuButton, useSidebar,
} from '@/components/ui/sidebar';
import {
  ShieldX, ArrowLeft, LayoutDashboard, MapPin, Package, Tag,
  Coins, Languages, Truck, Users, ShoppingCart,
} from 'lucide-react';

import AdminOverview from '@/components/admin/AdminOverview';
import AdminLocations from '@/components/admin/AdminLocations';
import AdminProducts from '@/components/admin/AdminProducts';
import AdminCategories from '@/components/admin/AdminCategories';
import AdminCurrencies from '@/components/admin/AdminCurrencies';
import AdminLanguages from '@/components/admin/AdminLanguages';
import AdminDeliveryPartners from '@/components/admin/AdminDeliveryPartners';
import AdminUsers from '@/components/admin/AdminUsers';
import AdminOrders from '@/components/admin/AdminOrders';

const NAV_ITEMS = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'locations', label: 'Locations', icon: MapPin },
  { key: 'products', label: 'Products', icon: Package },
  { key: 'categories', label: 'Categories', icon: Tag },
  { key: 'currencies', label: 'Currencies', icon: Coins },
  { key: 'languages', label: 'Languages', icon: Languages },
  { key: 'delivery', label: 'Delivery Partners', icon: Truck },
  { key: 'users', label: 'Users', icon: Users },
  { key: 'orders', label: 'All Orders', icon: ShoppingCart },
] as const;

function AccessDenied() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="mb-4 p-4 rounded-full bg-destructive/10">
        <ShieldX className="h-12 w-12 text-destructive" />
      </div>
      <h1 className="font-display text-2xl font-bold text-foreground mb-2">Access Denied</h1>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm">You need an admin account to access this dashboard.</p>
      <Button variant="outline" onClick={() => navigate('/')} className="rounded-xl gap-1">
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Button>
    </div>
  );
}

function AdminSidebarContent({ active, onSelect }: { active: string; onSelect: (k: string) => void }) {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-accent-foreground uppercase tracking-wider">
            {!collapsed && 'Admin Panel'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map(item => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    onClick={() => onSelect(item.key)}
                    className={active === item.key ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted'}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {!collapsed && <span>{item.label}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

function AdminDashboardContent() {
  const [section, setSection] = useState('overview');

  const renderSection = () => {
    switch (section) {
      case 'overview': return <AdminOverview />;
      case 'locations': return <AdminLocations />;
      case 'products': return <AdminProducts />;
      case 'categories': return <AdminCategories />;
      case 'currencies': return <AdminCurrencies />;
      case 'languages': return <AdminLanguages />;
      case 'delivery': return <AdminDeliveryPartners />;
      case 'users': return <AdminUsers />;
      case 'orders': return <AdminOrders />;
      default: return <AdminOverview />;
    }
  };

  return (
    <div className="min-h-screen flex w-full">
      <AdminSidebarContent active={section} onSelect={setSection} />
      <div className="flex-1 flex flex-col">
        <header className="h-14 flex items-center border-b border-border px-4 bg-card">
          <SidebarTrigger className="mr-3" />
          <h1 className="font-display text-lg font-bold text-foreground">
            {NAV_ITEMS.find(n => n.key === section)?.label || 'Admin'}
          </h1>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-auto bg-background">
          {renderSection()}
        </main>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();

  const { data: isAdmin, isLoading: roleLoading } = useQuery({
    queryKey: ['admin-role', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from('user_roles').select('role').eq('user_id', user!.id).eq('role', 'admin');
      return (data && data.length > 0);
    },
  });

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-4 w-64">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) return <AccessDenied />;

  return (
    <SidebarProvider>
      <AdminDashboardContent />
    </SidebarProvider>
  );
}
