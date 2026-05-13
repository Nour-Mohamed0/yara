'use client';

import { useCallback } from 'react';
import { useLanguage } from '@/components/language-provider';
import { getTranslation, type TranslationKey } from '@/lib/translations';
import { useDynamicTranslation } from '@/components/content-provider';

export function useTranslation() {
  const { language } = useLanguage();
  const staticT = useCallback((key: TranslationKey) => getTranslation(language, key), [language]);
  return useDynamicTranslation(language, staticT);
}
