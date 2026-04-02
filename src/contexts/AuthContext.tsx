import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, meta: { display_name: string; phone: string; buyer_type: string }) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, meta: { display_name: string; phone: string; buyer_type: string }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: meta.display_name },
        emailRedirectTo: window.location.origin,
      },
    });

    if (!error && data.user) {
      // The handle_new_user trigger creates a profile with default values.
      // We need to update with the actual buyer_type and phone.
      // First get currency and language IDs
      const [currRes, langRes] = await Promise.all([
        supabase.from('currencies').select('id').eq('currency_code', 'INR').single(),
        supabase.from('languages').select('id').eq('code', 'en').single(),
      ]);

      await supabase.from('profiles').update({
        display_name: meta.display_name,
        phone: meta.phone,
        buyer_type: meta.buyer_type as any,
        preferred_currency_id: currRes.data?.id || null,
        preferred_language_id: langRes.data?.id || null,
      }).eq('user_id', data.user.id);
    }

    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
