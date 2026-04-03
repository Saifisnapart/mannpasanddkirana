import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminLanguages() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ code: '', name: '', native_name: '', rtl: false });

  const { data: languages, isLoading } = useQuery({
    queryKey: ['admin-languages'],
    queryFn: async () => { const { data } = await supabase.from('languages').select('*').order('name'); return data || []; },
  });

  const add = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('languages').insert({ code: form.code, name: form.name, native_name: form.native_name, rtl: form.rtl });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-languages'] }); setOpen(false); toast.success('Added'); },
    onError: (e: any) => toast.error(e.message),
  });

  const toggle = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from('languages').update({ is_active }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-languages'] }),
  });

  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from('languages').delete().eq('id', id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-languages'] }); toast.success('Deleted'); },
    onError: (e: any) => toast.error(e.message),
  });

  if (isLoading) return <Skeleton className="h-64 rounded-xl" />;

  return (
    <div className="space-y-4">
      <div className="flex justify-end"><Button onClick={() => { setForm({ code: '', name: '', native_name: '', rtl: false }); setOpen(true); }} className="gap-1 rounded-xl"><Plus className="h-4 w-4" /> Add Language</Button></div>
      <div className="border rounded-xl overflow-hidden">
        <Table>
          <TableHeader><TableRow>
            <TableHead>Code</TableHead><TableHead>Name</TableHead><TableHead>Native</TableHead><TableHead>RTL</TableHead><TableHead>Active</TableHead><TableHead className="w-16"></TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {(languages || []).map(l => (
              <TableRow key={l.id}>
                <TableCell className="font-medium">{l.code}</TableCell>
                <TableCell>{l.name}</TableCell>
                <TableCell>{l.native_name}</TableCell>
                <TableCell>{l.rtl && <Badge className="bg-accent/10 text-accent-foreground">RTL</Badge>}</TableCell>
                <TableCell><Switch checked={l.is_active} onCheckedChange={v => toggle.mutate({ id: l.id, is_active: v })} /></TableCell>
                <TableCell>
                  <AlertDialog>
                    <AlertDialogTrigger asChild><Button size="icon" variant="ghost" className="text-destructive"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
                    <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete language?</AlertDialogTitle><AlertDialogDescription>This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                      <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => del.mutate(l.id)}>Delete</AlertDialogAction></AlertDialogFooter>
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
          <DialogHeader><DialogTitle>Add Language</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Code</Label><Input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} placeholder="hi" /></div>
            <div><Label>Name</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Hindi" /></div>
            <div><Label>Native Name</Label><Input value={form.native_name} onChange={e => setForm(f => ({ ...f, native_name: e.target.value }))} placeholder="हिन्दी" /></div>
            <div className="flex items-center gap-2">
              <Checkbox checked={form.rtl} onCheckedChange={v => setForm(f => ({ ...f, rtl: !!v }))} id="rtl" />
              <Label htmlFor="rtl">Right-to-Left</Label>
            </div>
          </div>
          <DialogFooter><Button onClick={() => add.mutate()} disabled={add.isPending} className="rounded-xl">{add.isPending ? 'Adding...' : 'Add'}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
