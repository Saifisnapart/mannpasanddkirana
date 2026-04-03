import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminDeliveryPartners() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', tagline: '', fuel_type: '' });

  const { data: partners, isLoading } = useQuery({
    queryKey: ['admin-delivery-partners'],
    queryFn: async () => { const { data } = await supabase.from('delivery_partners').select('*').order('name'); return data || []; },
  });

  const save = useMutation({
    mutationFn: async () => {
      const payload = { name: form.name, tagline: form.tagline || null, fuel_type: form.fuel_type || null };
      if (editId) {
        const { error } = await supabase.from('delivery_partners').update(payload).eq('id', editId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('delivery_partners').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-delivery-partners'] }); setOpen(false); toast.success('Saved'); },
    onError: (e: any) => toast.error(e.message),
  });

  const toggleDefault = useMutation({
    mutationFn: async ({ id, val }: { id: string; val: boolean }) => {
      if (val) {
        // Unset all others first
        const { error: e1 } = await supabase.from('delivery_partners').update({ is_default_for_strait: false }).neq('id', id);
        if (e1) throw e1;
      }
      const { error } = await supabase.from('delivery_partners').update({ is_default_for_strait: val }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-delivery-partners'] }); toast.success('Updated'); },
    onError: (e: any) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from('delivery_partners').delete().eq('id', id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-delivery-partners'] }); toast.success('Deleted'); },
    onError: (e: any) => toast.error(e.message),
  });

  const openAdd = () => { setEditId(null); setForm({ name: '', tagline: '', fuel_type: '' }); setOpen(true); };
  const openEdit = (p: any) => { setEditId(p.id); setForm({ name: p.name, tagline: p.tagline || '', fuel_type: p.fuel_type || '' }); setOpen(true); };

  if (isLoading) return <Skeleton className="h-64 rounded-xl" />;

  return (
    <div className="space-y-4">
      <div className="flex justify-end"><Button onClick={openAdd} className="gap-1 rounded-xl"><Plus className="h-4 w-4" /> Add Partner</Button></div>
      <div className="border rounded-xl overflow-hidden">
        <Table>
          <TableHeader><TableRow>
            <TableHead>Name</TableHead><TableHead>Tagline</TableHead><TableHead>Fuel</TableHead><TableHead>Default for Strait</TableHead><TableHead className="w-24">Actions</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {(partners || []).map(p => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell>{p.tagline || '—'}</TableCell>
                <TableCell>{p.fuel_type || '—'}</TableCell>
                <TableCell><Switch checked={p.is_default_for_strait} onCheckedChange={v => toggleDefault.mutate({ id: p.id, val: v })} /></TableCell>
                <TableCell className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild><Button size="icon" variant="ghost" className="text-destructive"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
                    <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete partner?</AlertDialogTitle><AlertDialogDescription>This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                      <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => del.mutate(p.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editId ? 'Edit' : 'Add'} Delivery Partner</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Name</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div><Label>Tagline</Label><Input value={form.tagline} onChange={e => setForm(f => ({ ...f, tagline: e.target.value }))} /></div>
            <div><Label>Fuel Type</Label><Input value={form.fuel_type} onChange={e => setForm(f => ({ ...f, fuel_type: e.target.value }))} placeholder="Electric, CNG, etc." /></div>
          </div>
          <DialogFooter><Button onClick={() => save.mutate()} disabled={save.isPending} className="rounded-xl">{save.isPending ? 'Saving...' : 'Save'}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
