import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { translations } from '@/lib/translations';

interface Language {
  id: string;
  code: string;
  name: string;
  native_name: string;
  rtl: boolean;
  is_active: boolean;
}

interface LanguageContextType {
  languages: Language[];
  currentLanguage: Language;
  setLanguage: (id: string) => void;
  t: (key: string) => string;
}

const defaultLang: Language = {
  id: '', code: 'en', name: 'English', native_name: 'English', rtl: false, is_active: true,
};

const LanguageContext = createContext<LanguageContextType>({
  languages: [], currentLanguage: defaultLang,
  setLanguage: () => {}, t: (k) => k,
});

function detectBrowserLang(): string {
  const nav = navigator.language?.substring(0, 2) || 'en';
  return ['hi', 'mr', 'ar', 'ur'].includes(nav) ? nav : 'en';
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [languages, setLanguages] = useState<Language[]>([]);
  const [currentLanguage, setCurrent] = useState<Language>(defaultLang);

  useEffect(() => {
    supabase.from('languages').select('*').eq('is_active', true).then(({ data }) => {
      if (data && data.length > 0) setLanguages(data);
    });
  }, []);

  useEffect(() => {
    if (languages.length === 0) return;
    if (!user) {
      const code = detectBrowserLang();
      const found = languages.find(l => l.code === code) || languages.find(l => l.code === 'en') || languages[0];
      setCurrent(found);
      return;
    }
    supabase.from('profiles').select('preferred_language_id').eq('user_id', user.id).single()
      .then(({ data }) => {
        if (data?.preferred_language_id) {
          const found = languages.find(l => l.id === data.preferred_language_id);
          if (found) { setCurrent(found); return; }
        }
        const code = detectBrowserLang();
        const fallback = languages.find(l => l.code === code) || languages.find(l => l.code === 'en') || languages[0];
        setCurrent(fallback);
      });
  }, [user, languages]);

  // RTL effect
  useEffect(() => {
    document.documentElement.setAttribute('dir', currentLanguage.rtl ? 'rtl' : 'ltr');
  }, [currentLanguage]);

  const setLanguage = useCallback((id: string) => {
    const found = languages.find(l => l.id === id);
    if (!found) return;
    setCurrent(found);
    if (user) {
      supabase.from('profiles').update({ preferred_language_id: id }).eq('user_id', user.id);
    }
  }, [languages, user]);

  const t = useCallback((key: string): string => {
    return translations[currentLanguage.code]?.[key] ?? translations['en']?.[key] ?? key;
  }, [currentLanguage]);

  return (
    <LanguageContext.Provider value={{ languages, currentLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
