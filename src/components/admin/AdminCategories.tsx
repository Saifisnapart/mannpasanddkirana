import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminCategories() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', parent_id: '', icon_url: '' });

  const { data: categories, isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => { const { data } = await supabase.from('categories').select('*').order('name'); return data || []; },
  });

  const { data: productCounts } = useQuery({
    queryKey: ['admin-category-product-counts'],
    queryFn: async () => {
      const { data } = await supabase.from('products').select('category_id');
      const counts: Record<string, number> = {};
      (data || []).forEach(p => { if (p.category_id) counts[p.category_id] = (counts[p.category_id] || 0) + 1; });
      return counts;
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      const payload = { name: form.name, parent_id: form.parent_id || null, icon_url: form.icon_url || null };
      if (editId) {
        const { error } = await supabase.from('categories').update(payload).eq('id', editId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('categories').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-categories'] }); setOpen(false); toast.success('Saved'); },
    onError: (e: any) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from('categories').delete().eq('id', id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-categories'] }); toast.success('Deleted'); },
    onError: (e: any) => toast.error(e.message),
  });

  const openAdd = () => { setEditId(null); setForm({ name: '', parent_id: '', icon_url: '' }); setOpen(true); };
  const openEdit = (c: any) => { setEditId(c.id); setForm({ name: c.name, parent_id: c.parent_id || '', icon_url: c.icon_url || '' }); setOpen(true); };

  if (isLoading) return <Skeleton className="h-64 rounded-xl" />;

  const parents = (categories || []).filter(c => !c.parent_id);
  const children = (categories || []).filter(c => c.parent_id);

  return (
    <div className="space-y-4">
      <div className="flex justify-end"><Button onClick={openAdd} className="gap-1 rounded-xl"><Plus className="h-4 w-4" /> Add Category</Button></div>
      <div className="space-y-1">
        {parents.map(p => (
          <div key={p.id}>
            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-card border">
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">{p.name}</span>
                {(productCounts?.[p.id] || 0) > 0 && <span className="text-xs text-muted-foreground">({productCounts![p.id]} products)</span>}
              </div>
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild><Button size="icon" variant="ghost" className="text-destructive"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
                  <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete "{p.name}"?</AlertDialogTitle>
                    <AlertDialogDescription>{(productCounts?.[p.id] || 0) > 0 ? `⚠️ ${productCounts![p.id]} products use this category.` : 'This cannot be undone.'}</AlertDialogDescription>
                  </AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => del.mutate(p.id)}>Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            {children.filter(ch => ch.parent_id === p.id).map(ch => (
              <div key={ch.id} className="flex items-center justify-between ml-6 px-3 py-1.5 rounded-lg border-l-2 border-primary/20">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-foreground">{ch.name}</span>
                  {(productCounts?.[ch.id] || 0) > 0 && <span className="text-xs text-muted-foreground">({productCounts![ch.id]})</span>}
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(ch)}><Pencil className="h-3 w-3" /></Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild><Button size="icon" variant="ghost" className="text-destructive"><Trash2 className="h-3 w-3" /></Button></AlertDialogTrigger>
                    <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete "{ch.name}"?</AlertDialogTitle>
                      <AlertDialogDescription>{(productCounts?.[ch.id] || 0) > 0 ? `⚠️ ${productCounts![ch.id]} products use this.` : 'This cannot be undone.'}</AlertDialogDescription>
                    </AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => del.mutate(ch.id)}>Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        ))}
        {/* Uncategorized children */}
        {children.filter(ch => !parents.find(p => p.id === ch.parent_id)).map(ch => (
          <div key={ch.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-card border">
            <span className="text-foreground">{ch.name}</span>
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" onClick={() => openEdit(ch)}><Pencil className="h-4 w-4" /></Button>
            </div>
          </div>
        ))}
        {!categories?.length && <p className="text-center text-muted-foreground py-8">No categories</p>}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editId ? 'Edit' : 'Add'} Category</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Name</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div><Label>Parent Category (optional)</Label>
              <Select value={form.parent_id} onValueChange={v => setForm(f => ({ ...f, parent_id: v === '_none' ? '' : v }))}>
                <SelectTrigger><SelectValue placeholder="None (top-level)" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="_none">None</SelectItem>
                  {(categories || []).filter(c => !c.parent_id && c.id !== editId).map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div><Label>Icon URL</Label><Input value={form.icon_url} onChange={e => setForm(f => ({ ...f, icon_url: e.target.value }))} /></div>
          </div>
          <DialogFooter><Button onClick={() => save.mutate()} disabled={save.isPending} className="rounded-xl">{save.isPending ? 'Saving...' : 'Save'}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
