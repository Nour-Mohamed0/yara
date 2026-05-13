'use client';

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import type { Language } from '@/lib/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function applyDocumentLanguage(lang: Language) {
  if (typeof document === 'undefined') return;
  const html = document.documentElement;
  html.dir = lang === 'ar' ? 'rtl' : 'ltr';
  html.lang = lang === 'ar' ? 'ar' : 'en';
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('language') as Language | null;
      if (saved === 'en' || saved === 'ar') {
        setLanguageState(saved);
        applyDocumentLanguage(saved);
      } else {
        applyDocumentLanguage('en');
      }
    } catch {
      applyDocumentLanguage('en');
    }
  }, []);

  useEffect(() => {
    applyDocumentLanguage(language);
  }, [language]);

  const setLanguage = useCallback((newLanguage: Language) => {
    setLanguageState(newLanguage);
    try {
      localStorage.setItem('language', newLanguage);
    } catch {
      /* ignore */
    }
    applyDocumentLanguage(newLanguage);
  }, []);

  const value = useMemo(() => ({ language, setLanguage }), [language, setLanguage]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
