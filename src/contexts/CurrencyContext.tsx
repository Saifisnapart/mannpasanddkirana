import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Currency {
  id: string;
  currency_code: string;
  name: string;
  exchange_rate_to_inr: number;
  is_base: boolean;
  is_active: boolean;
}

interface CurrencyContextType {
  currencies: Currency[];
  activeCurrency: Currency;
  setActiveCurrency: (id: string) => void;
  formatPrice: (amount_inr: number) => string;
}

const defaultCurrency: Currency = {
  id: '', currency_code: 'INR', name: 'Indian Rupee',
  exchange_rate_to_inr: 1, is_base: true, is_active: true,
};

const CurrencyContext = createContext<CurrencyContextType>({
  currencies: [], activeCurrency: defaultCurrency,
  setActiveCurrency: () => {}, formatPrice: (a) => `₹${a}`,
});

const prefixMap: Record<string, string> = { INR: '₹', AED: 'AED ', USD: '$' };

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [activeCurrency, setActive] = useState<Currency>(defaultCurrency);

  useEffect(() => {
    supabase.from('currencies').select('*').eq('is_active', true).then(({ data }) => {
      if (data && data.length > 0) setCurrencies(data);
    });
  }, []);

  useEffect(() => {
    if (!user || currencies.length === 0) return;
    supabase.from('profiles').select('preferred_currency_id').eq('user_id', user.id).single()
      .then(({ data }) => {
        if (data?.preferred_currency_id) {
          const found = currencies.find(c => c.id === data.preferred_currency_id);
          if (found) setActive(found);
        } else {
          const inr = currencies.find(c => c.currency_code === 'INR');
          if (inr) setActive(inr);
        }
      });
  }, [user, currencies]);

  const setActiveCurrency = useCallback((id: string) => {
    const found = currencies.find(c => c.id === id);
    if (!found) return;
    setActive(found);
    if (user) {
      supabase.from('profiles').update({ preferred_currency_id: id }).eq('user_id', user.id);
    }
  }, [currencies, user]);

  const formatPrice = useCallback((amount_inr: number): string => {
    const rate = activeCurrency.exchange_rate_to_inr || 1;
    const result = Math.round((amount_inr / rate) * 100) / 100;
    const prefix = prefixMap[activeCurrency.currency_code] || `${activeCurrency.currency_code} `;
    return prefix + result.toLocaleString();
  }, [activeCurrency]);

  return (
    <CurrencyContext.Provider value={{ currencies, activeCurrency, setActiveCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
