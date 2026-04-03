import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

const PAGE_SIZE = 15;
const ROLES = ['customer', 'vendor', 'admin'] as const;
const BUYER_TYPES = ['one_time', 'frequent', 'ratib'] as const;

const ROLE_COLORS: Record<string, string> = {
  customer: 'bg-primary/10 text-primary',
  vendor: 'bg-accent/10 text-accent-foreground',
  admin: 'bg-destructive/10 text-destructive',
};

export default function AdminUsers() {
  const qc = useQueryClient();
  const [page, setPage] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', page],
    queryFn: async () => {
      const from = page * PAGE_SIZE;
      const { data: profiles, count } = await supabase.from('profiles')
        .select('*', { count: 'exact' }).order('created_at', { ascending: false })
        .range(from, from + PAGE_SIZE - 1);

      if (!profiles?.length) return { users: [], total: count || 0 };

      const userIds = profiles.map(p => p.user_id);
      const { data: roles } = await supabase.from('user_roles').select('user_id, role').in('user_id', userIds);

      const roleMap: Record<string, string> = {};
      (roles || []).forEach(r => { roleMap[r.user_id] = r.role; });

      return {
        users: profiles.map(p => ({ ...p, role: roleMap[p.user_id] || 'customer' })),
        total: count || 0,
      };
    },
  });

  const updateRole = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      const { data: existing } = await supabase.from('user_roles').select('id').eq('user_id', userId);
      if (existing && existing.length > 0) {
        const { error } = await supabase.from('user_roles').update({ role: role as any }).eq('user_id', userId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('user_roles').insert({ user_id: userId, role: role as any });
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-users'] }); toast.success('Role updated'); },
    onError: (e: any) => toast.error(e.message),
  });

  const updateBuyerType = useMutation({
    mutationFn: async ({ userId, buyer_type }: { userId: string; buyer_type: string }) => {
      const { error } = await supabase.from('profiles').update({ buyer_type: buyer_type as any }).eq('user_id', userId);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-users'] }); toast.success('Buyer type updated'); },
    onError: (e: any) => toast.error(e.message),
  });

  const totalPages = Math.ceil((data?.total || 0) / PAGE_SIZE);

  if (isLoading) return <Skeleton className="h-64 rounded-xl" />;

  return (
    <div className="space-y-4">
      <div className="border rounded-xl overflow-hidden">
        <Table>
          <TableHeader><TableRow>
            <TableHead>Name</TableHead><TableHead>Phone</TableHead><TableHead>Buyer Type</TableHead><TableHead>Role</TableHead><TableHead>Joined</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {(data?.users || []).map((u: any) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.display_name || '—'}</TableCell>
                <TableCell>{u.phone || '—'}</TableCell>
                <TableCell>
                  <Select value={u.buyer_type} onValueChange={v => updateBuyerType.mutate({ userId: u.user_id, buyer_type: v })}>
                    <SelectTrigger className="w-28 h-8"><SelectValue /></SelectTrigger>
                    <SelectContent>{BUYER_TYPES.map(bt => <SelectItem key={bt} value={bt}>{bt.replace(/_/g, ' ')}</SelectItem>)}</SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Select value={u.role} onValueChange={v => updateRole.mutate({ userId: u.user_id, role: v })}>
                    <SelectTrigger className="w-28 h-8"><SelectValue /></SelectTrigger>
                    <SelectContent>{ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</TableCell>
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
    </div>
  );
}
