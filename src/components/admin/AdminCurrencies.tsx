import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminCurrencies() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ currency_code: '', name: '', exchange_rate_to_inr: '1', is_base: false });
  const [editingRate, setEditingRate] = useState<{ id: string; value: string } | null>(null);

  const { data: currencies, isLoading } = useQuery({
    queryKey: ['admin-currencies'],
    queryFn: async () => { const { data } = await supabase.from('currencies').select('*').order('currency_code'); return data || []; },
  });

  const add = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('currencies').insert({
        currency_code: form.currency_code, name: form.name,
        exchange_rate_to_inr: parseFloat(form.exchange_rate_to_inr), is_base: form.is_base,
      });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-currencies'] }); setOpen(false); toast.success('Added'); },
    onError: (e: any) => toast.error(e.message),
  });

  const toggle = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from('currencies').update({ is_active }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-currencies'] }),
  });

  const updateRate = async (id: string, rate: string) => {
    const { error } = await supabase.from('currencies').update({ exchange_rate_to_inr: parseFloat(rate) }).eq('id', id);
    if (error) toast.error(error.message); else { qc.invalidateQueries({ queryKey: ['admin-currencies'] }); toast.success('Updated'); }
    setEditingRate(null);
  };

  if (isLoading) return <Skeleton className="h-64 rounded-xl" />;

  return (
    <div className="space-y-4">
      <div className="flex justify-end"><Button onClick={() => { setForm({ currency_code: '', name: '', exchange_rate_to_inr: '1', is_base: false }); setOpen(true); }} className="gap-1 rounded-xl"><Plus className="h-4 w-4" /> Add Currency</Button></div>
      <div className="border rounded-xl overflow-hidden">
        <Table>
          <TableHeader><TableRow>
            <TableHead>Code</TableHead><TableHead>Name</TableHead><TableHead>Rate to INR</TableHead><TableHead>Base</TableHead><TableHead>Active</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {(currencies || []).map(c => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.currency_code}</TableCell>
                <TableCell>{c.name}</TableCell>
                <TableCell>
                  {editingRate?.id === c.id ? (
                    <Input className="w-24 h-8" type="number" step="any" value={editingRate.value}
                      onChange={e => setEditingRate({ id: c.id, value: e.target.value })}
                      onBlur={() => updateRate(c.id, editingRate.value)}
                      onKeyDown={e => e.key === 'Enter' && updateRate(c.id, editingRate.value)}
                      autoFocus />
                  ) : (
                    <span className="cursor-pointer hover:underline" onClick={() => setEditingRate({ id: c.id, value: String(c.exchange_rate_to_inr) })}>
                      {c.exchange_rate_to_inr}
                    </span>
                  )}
                </TableCell>
                <TableCell>{c.is_base && <Badge className="bg-primary/10 text-primary">Base</Badge>}</TableCell>
                <TableCell><Switch checked={c.is_active} onCheckedChange={v => toggle.mutate({ id: c.id, is_active: v })} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Currency</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Code</Label><Input value={form.currency_code} onChange={e => setForm(f => ({ ...f, currency_code: e.target.value }))} placeholder="USD" /></div>
            <div><Label>Name</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="US Dollar" /></div>
            <div><Label>Exchange Rate to INR</Label><Input type="number" step="any" value={form.exchange_rate_to_inr} onChange={e => setForm(f => ({ ...f, exchange_rate_to_inr: e.target.value }))} /></div>
          </div>
          <DialogFooter><Button onClick={() => add.mutate()} disabled={add.isPending} className="rounded-xl">{add.isPending ? 'Adding...' : 'Add'}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
