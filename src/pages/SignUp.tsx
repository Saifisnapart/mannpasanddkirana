import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Store, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function SignUp() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [form, setForm] = useState({ display_name: '', email: '', password: '', phone: '', buyer_type: 'one_time' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const buyerTypes = [
    { value: 'one_time', label: 'One Time Buyer', desc: 'Occasional shopping' },
    { value: 'frequent', label: 'Frequent Buyer', desc: 'Regular customer' },
    { value: 'ratib', label: 'Ratib Buyer', desc: 'Daily essentials subscription' },
  ];

  const isVendor = form.buyer_type === 'vendor';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.buyer_type === 'ratib' && !form.display_name.toLowerCase().includes('rtb')) {
      setError('Ratib buyers must have "rtb" in their display name (e.g., ahmed_rtb)');
      return;
    }

    setLoading(true);
    const { error } = await signUp(form.email, form.password, {
      display_name: form.display_name,
      phone: form.phone,
      buyer_type: form.buyer_type,
    });
    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      // If vendor, also add vendor role (handle_new_user trigger adds 'customer' by default)
      if (isVendor) {
        // We need the user id - re-sign in to get it since email may not be confirmed
        // The trigger already created profile+customer role, so we insert vendor role
        const { data: signInData } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
        if (signInData?.user) {
          await supabase.from('user_roles').insert({ user_id: signInData.user.id, role: 'vendor' as any });
          await supabase.auth.signOut();
        }
      }
      toast.success('Account created! Please check your email to verify.');
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md p-6 space-y-5">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Store className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-primary font-serif">MannPasandd</span>
          </div>
          <h1 className="font-display text-xl font-bold text-foreground">Create Account</h1>
          <p className="text-sm text-muted-foreground">Join the kirana marketplace</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground">Display Name</Label>
            <Input value={form.display_name} onChange={e => setForm(p => ({ ...p, display_name: e.target.value }))} required className="h-10 rounded-lg" placeholder="e.g. Ravi Kumar" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Email</Label>
            <Input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required className="h-10 rounded-lg" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Password</Label>
            <Input type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required minLength={6} className="h-10 rounded-lg" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Phone</Label>
            <Input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="h-10 rounded-lg" placeholder="+91 98765 43210" />
          </div>

          <div>
            <Label className="text-xs text-muted-foreground mb-2 block">Buyer Type</Label>
            <div className="grid grid-cols-3 gap-2">
              {buyerTypes.map(bt => (
                <button
                  key={bt.value}
                  type="button"
                  onClick={() => setForm(p => ({ ...p, buyer_type: bt.value }))}
                  className={`p-3 rounded-xl border text-center transition-colors ${
                    form.buyer_type === bt.value
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <p className="text-xs font-semibold text-foreground">{bt.label}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{bt.desc}</p>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setForm(p => ({ ...p, buyer_type: 'vendor' }))}
              className={`w-full mt-2 p-3 rounded-xl border text-center transition-colors ${
                isVendor
                  ? 'border-accent bg-accent/10 ring-2 ring-accent/30'
                  : 'border-dashed border-accent/50 hover:border-accent'
              }`}
            >
              <p className="text-xs font-semibold text-accent-foreground">🏪 Vendor / Store Owner</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Sell on MannPasandd</p>
            </button>
          </div>

          {form.buyer_type === 'ratib' && (
            <div className="flex items-start gap-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-3">
              <AlertCircle className="h-4 w-4 text-yellow-600 shrink-0 mt-0.5" />
              <p className="text-xs text-yellow-800 dark:text-yellow-200">
                Your display name must contain <strong>"rtb"</strong> (e.g., ahmed_rtb)
              </p>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2 bg-destructive/10 rounded-xl p-3">
              <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
              <p className="text-xs text-destructive">{error}</p>
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full h-11 rounded-xl text-sm font-semibold">
            {loading ? 'Creating account...' : 'Sign Up'}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-medium hover:underline">Sign In</Link>
        </p>
      </Card>
    </div>
  );
}
