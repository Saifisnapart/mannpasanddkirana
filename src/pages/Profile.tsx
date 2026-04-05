import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { User, MapPin, LogOut, Navigation, Plus, Pencil, Trash2, Globe, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from '@/contexts/LocationContext';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

interface AddressForm {
  label: string;
  full_address: string;
  city: string;
  pincode: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  is_default: boolean;
}

const emptyForm: AddressForm = { label: '', full_address: '', city: '', pincode: '', country: 'India', latitude: null, longitude: null, is_default: false };

export default function Profile() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { areaName } = useLocation();
  const { languages, currentLanguage, setLanguage, t } = useLanguage();
  const queryClient = useQueryClient();

  const [addrDialogOpen, setAddrDialogOpen] = useState(false);
  const [editingAddrId, setEditingAddrId] = useState<string | null>(null);
  const [addrForm, setAddrForm] = useState<AddressForm>(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [detectingLocation, setDetectingLocation] = useState(false);

  // Editable profile fields
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const { data } = await supabase.from('profiles').select('*').eq('user_id', user!.id).single();
      return data;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (profile) {
      setEditName(profile.display_name || '');
      setEditPhone(profile.phone || '');
    }
  }, [profile]);

  const { data: addresses, isLoading: addrLoading } = useQuery({
    queryKey: ['addresses', user?.id],
    queryFn: async () => {
      const { data } = await supabase.from('addresses').select('*').eq('user_id', user!.id).order('is_default', { ascending: false });
      return data || [];
    },
    enabled: !!user,
  });

  const saveProfile = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('profiles').update({ display_name: editName, phone: editPhone }).eq('user_id', user!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
      toast.success('Profile updated');
    },
    onError: (err: any) => toast.error(err.message),
  });

  const saveAddress = useMutation({
    mutationFn: async (form: AddressForm & { id?: string }) => {
      if (form.is_default && user) {
        await supabase.from('addresses').update({ is_default: false }).eq('user_id', user.id);
      }
      if (form.id) {
        const { error } = await supabase.from('addresses').update({
          label: form.label, full_address: form.full_address, city: form.city, pincode: form.pincode,
          country: form.country, latitude: form.latitude, longitude: form.longitude, is_default: form.is_default,
        }).eq('id', form.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('addresses').insert({
          user_id: user!.id, label: form.label, full_address: form.full_address, city: form.city,
          pincode: form.pincode, country: form.country, latitude: form.latitude, longitude: form.longitude, is_default: form.is_default,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      setAddrDialogOpen(false);
      setEditingAddrId(null);
      setAddrForm(emptyForm);
      toast.success('Address saved!');
    },
    onError: (err: any) => toast.error(err.message),
  });

  const deleteAddress = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('addresses').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      setDeleteConfirm(null);
      toast.success('Address deleted');
    },
  });

  const handleDetectLocation = () => {
    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setAddrForm(p => ({ ...p, latitude: pos.coords.latitude, longitude: pos.coords.longitude }));
        setDetectingLocation(false);
        toast.success('Location detected!');
      },
      () => { setDetectingLocation(false); toast.error('Unable to detect location'); }
    );
  };

  const handleLogout = async () => { await signOut(); navigate('/'); };

  const openEditAddr = (addr: any) => {
    setEditingAddrId(addr.id);
    setAddrForm({ label: addr.label, full_address: addr.full_address, city: addr.city || '', pincode: addr.pincode || '', country: addr.country, latitude: addr.latitude, longitude: addr.longitude, is_default: addr.is_default });
    setAddrDialogOpen(true);
  };

  return (
    <div className="px-4 py-4 space-y-5">
      <h1 className="font-display text-xl font-bold text-foreground">{t('profile')}</h1>

      {/* Personal Details */}
      <Card className="p-4 space-y-3">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-1"><User className="h-4 w-4" /> Personal Details</h2>
        {profileLoading ? (
          <div className="space-y-2"><Skeleton className="h-9 w-full" /><Skeleton className="h-9 w-full" /></div>
        ) : (
          <div className="space-y-2">
            <div>
              <Label className="text-xs text-muted-foreground">Name</Label>
              <Input value={editName} onChange={e => setEditName(e.target.value)} className="h-9 text-sm rounded-lg" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Email</Label>
              <Input defaultValue={user?.email || ''} className="h-9 text-sm rounded-lg" readOnly />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Phone</Label>
              <Input value={editPhone} onChange={e => setEditPhone(e.target.value)} className="h-9 text-sm rounded-lg" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Buyer Type</Label>
              <Input defaultValue={profile?.buyer_type || 'one_time'} className="h-9 text-sm rounded-lg capitalize" readOnly />
            </div>
            <Button size="sm" onClick={() => saveProfile.mutate()} disabled={saveProfile.isPending} className="rounded-lg text-xs">
              {saveProfile.isPending ? 'Saving...' : t('save')}
            </Button>
          </div>
        )}
      </Card>

      {/* Language */}
      <Card className="p-4 space-y-3">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-1"><Globe className="h-4 w-4" /> Language / भाषा</h2>
        <div className="space-y-1">
          {languages.map(lang => (
            <button key={lang.id} onClick={() => setLanguage(lang.id)}
              className={`w-full flex items-center justify-between p-2.5 rounded-lg text-sm transition-colors ${lang.id === currentLanguage.id ? 'border-2 border-primary bg-primary/5' : 'border border-border hover:bg-secondary'}`}>
              <div>
                <span className="font-medium text-foreground">{lang.native_name}</span>
                <span className="text-muted-foreground ml-2 text-xs">{lang.name}</span>
              </div>
              {lang.id === currentLanguage.id && <Check className="h-4 w-4 text-primary" />}
            </button>
          ))}
        </div>
      </Card>

      {/* Addresses */}
      <Card className="p-4 space-y-3">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-1"><MapPin className="h-4 w-4" /> Saved Addresses</h2>
        {addrLoading ? (
          <div className="space-y-2"><Skeleton className="h-16 rounded-lg" /><Skeleton className="h-16 rounded-lg" /></div>
        ) : addresses && addresses.length > 0 ? (
          addresses.map((a: any) => (
            <div key={a.id} className="flex items-start gap-2 p-2 rounded-lg bg-secondary">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-xs font-medium text-foreground">{a.label} {a.is_default && <span className="text-primary">(Default)</span>}</p>
                <p className="text-[11px] text-muted-foreground">{a.full_address}</p>
                {a.city && <p className="text-[11px] text-muted-foreground">{a.city} {a.pincode}</p>}
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEditAddr(a)} className="h-6 w-6 flex items-center justify-center rounded text-muted-foreground hover:text-foreground">
                  <Pencil className="h-3 w-3" />
                </button>
                <button onClick={() => setDeleteConfirm(a.id)} className="h-6 w-6 flex items-center justify-center rounded text-destructive hover:bg-destructive/10">
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-xs text-muted-foreground">{t('no_addresses')}</p>
        )}
        <Button variant="outline" size="sm" className="text-xs rounded-lg" onClick={() => { setEditingAddrId(null); setAddrForm(emptyForm); setAddrDialogOpen(true); }}>
          <Plus className="h-3 w-3 mr-1" /> Add Address
        </Button>
      </Card>

      {/* Actions */}
      <div className="space-y-2">
        <Button variant="outline" className="w-full justify-start gap-2 rounded-lg text-sm h-10" onClick={() => navigate('/shops')}>
          <Navigation className="h-4 w-4" /> {t('shops')}
        </Button>
        <Button variant="outline" className="w-full justify-start gap-2 rounded-lg text-sm h-10 text-destructive border-destructive/20 hover:bg-destructive/10" onClick={handleLogout}>
          <LogOut className="h-4 w-4" /> {t('logout')}
        </Button>
      </div>

      {/* Address Dialog */}
      <Dialog open={addrDialogOpen} onOpenChange={setAddrDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{editingAddrId ? t('edit') : 'Add'} Address</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Label</Label>
              <Input value={addrForm.label} onChange={e => setAddrForm(p => ({ ...p, label: e.target.value }))} placeholder="Home, Work..." className="h-9 text-sm rounded-lg" />
            </div>
            <div>
              <Label className="text-xs">Full Address</Label>
              <Input value={addrForm.full_address} onChange={e => setAddrForm(p => ({ ...p, full_address: e.target.value }))} className="h-9 text-sm rounded-lg" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">City</Label>
                <Input value={addrForm.city} onChange={e => setAddrForm(p => ({ ...p, city: e.target.value }))} className="h-9 text-sm rounded-lg" />
              </div>
              <div>
                <Label className="text-xs">Pincode</Label>
                <Input value={addrForm.pincode} onChange={e => setAddrForm(p => ({ ...p, pincode: e.target.value }))} className="h-9 text-sm rounded-lg" />
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleDetectLocation} disabled={detectingLocation} className="w-full text-xs rounded-lg gap-1">
              <Navigation className="h-3 w-3" /> {detectingLocation ? 'Detecting...' : 'Detect My Location'}
            </Button>
            {addrForm.latitude && (
              <p className="text-[10px] text-muted-foreground">📍 {addrForm.latitude.toFixed(4)}, {addrForm.longitude?.toFixed(4)}</p>
            )}
            <div className="flex items-center gap-2">
              <Switch checked={addrForm.is_default} onCheckedChange={v => setAddrForm(p => ({ ...p, is_default: v }))} />
              <Label className="text-xs">Set as default</Label>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => saveAddress.mutate({ ...addrForm, id: editingAddrId || undefined })} disabled={!addrForm.label || !addrForm.full_address || saveAddress.isPending} className="w-full rounded-lg">
              {saveAddress.isPending ? 'Saving...' : t('save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle>{t('delete')} Address?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)} className="flex-1">{t('cancel')}</Button>
            <Button variant="destructive" onClick={() => deleteConfirm && deleteAddress.mutate(deleteConfirm)} className="flex-1">{t('delete')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
