import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

const UNITS = ['gm', 'kg', 'piece', 'litre', 'ml'] as const;
const PAGE_SIZE = 15;

type ProductForm = {
  name: string; category_id: string; base_unit: string; base_price_inr: string;
  description: string; image_url: string; min_order_qty: string; max_order_qty: string;
  season_tag: string; religion_tag: string; tags: string;
};
const emptyForm: ProductForm = {
  name: '', category_id: '', base_unit: 'piece', base_price_inr: '0',
  description: '', image_url: '', min_order_qty: '1', max_order_qty: '100',
  season_tag: '', religion_tag: '', tags: '',
};

export default function AdminProducts() {
  const qc = useQueryClient();
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);

  const { data: categories } = useQuery({
    queryKey: ['admin-categories-list'],
    queryFn: async () => { const { data } = await supabase.from('categories').select('id, name').order('name'); return data || []; },
  });

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products', page],
    queryFn: async () => {
      const from = page * PAGE_SIZE;
      const { data, count } = await supabase.from('products').select('*, categories(name)', { count: 'exact' })
        .order('name').range(from, from + PAGE_SIZE - 1);
      return { products: data || [], total: count || 0 };
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        name: form.name, category_id: form.category_id || null,
        base_unit: form.base_unit as any, base_price_inr: parseFloat(form.base_price_inr),
        description: form.description || null, image_url: form.image_url || null,
        min_order_qty: parseInt(form.min_order_qty), max_order_qty: parseInt(form.max_order_qty),
        season_tag: form.season_tag || null, religion_tag: form.religion_tag || null,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()) : null,
      };
      if (editId) {
        const { error } = await supabase.from('products').update(payload).eq('id', editId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('products').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-products'] }); setOpen(false); toast.success('Saved'); },
    onError: (e: any) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from('products').delete().eq('id', id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-products'] }); toast.success('Deleted'); },
    onError: (e: any) => toast.error(e.message),
  });

  const openAdd = () => { setEditId(null); setForm(emptyForm); setOpen(true); };
  const openEdit = (p: any) => {
    setEditId(p.id);
    setForm({
      name: p.name, category_id: p.category_id || '', base_unit: p.base_unit, base_price_inr: String(p.base_price_inr),
      description: p.description || '', image_url: p.image_url || '',
      min_order_qty: String(p.min_order_qty), max_order_qty: String(p.max_order_qty),
      season_tag: p.season_tag || '', religion_tag: p.religion_tag || '', tags: (p.tags || []).join(', '),
    });
    setOpen(true);
  };

  const totalPages = Math.ceil((data?.total || 0) / PAGE_SIZE);

  if (isLoading) return <Skeleton className="h-64 rounded-xl" />;

  return (
    <div className="space-y-4">
      <div className="flex justify-end"><Button onClick={openAdd} className="gap-1 rounded-xl"><Plus className="h-4 w-4" /> Add Product</Button></div>
      <div className="border rounded-xl overflow-hidden">
        <Table>
          <TableHeader><TableRow>
            <TableHead>Name</TableHead><TableHead>Category</TableHead><TableHead>Unit</TableHead>
            <TableHead>Base Price</TableHead><TableHead>Season</TableHead><TableHead className="w-24">Actions</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {(data?.products || []).map((p: any) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell>{p.categories?.name || '—'}</TableCell>
                <TableCell>{p.base_unit}</TableCell>
                <TableCell>₹{p.base_price_inr}</TableCell>
                <TableCell>{p.season_tag || '—'}</TableCell>
                <TableCell className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild><Button size="icon" variant="ghost" className="text-destructive"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
                    <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete product?</AlertDialogTitle><AlertDialogDescription>This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                      <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => del.mutate(p.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editId ? 'Edit' : 'Add'} Product</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Name</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div><Label>Category</Label>
              <Select value={form.category_id} onValueChange={v => setForm(f => ({ ...f, category_id: v }))}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>{(categories || []).map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div><Label>Base Unit</Label>
                <Select value={form.base_unit} onValueChange={v => setForm(f => ({ ...f, base_unit: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{UNITS.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Base Price (₹)</Label><Input type="number" value={form.base_price_inr} onChange={e => setForm(f => ({ ...f, base_price_inr: e.target.value }))} /></div>
            </div>
            <div><Label>Description</Label><Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} /></div>
            <div><Label>Image URL</Label><Input value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} /></div>
            <div className="grid grid-cols-2 gap-2">
              <div><Label>Min Qty</Label><Input type="number" value={form.min_order_qty} onChange={e => setForm(f => ({ ...f, min_order_qty: e.target.value }))} /></div>
              <div><Label>Max Qty</Label><Input type="number" value={form.max_order_qty} onChange={e => setForm(f => ({ ...f, max_order_qty: e.target.value }))} /></div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div><Label>Season Tag</Label><Input value={form.season_tag} onChange={e => setForm(f => ({ ...f, season_tag: e.target.value }))} /></div>
              <div><Label>Religion Tag</Label><Input value={form.religion_tag} onChange={e => setForm(f => ({ ...f, religion_tag: e.target.value }))} /></div>
            </div>
            <div><Label>Tags (comma-separated)</Label><Input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} /></div>
          </div>
          <DialogFooter><Button onClick={() => save.mutate()} disabled={save.isPending} className="rounded-xl">{save.isPending ? 'Saving...' : 'Save'}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
