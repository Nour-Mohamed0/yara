'use client';

import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import type { TranslationKey } from '@/lib/translations';

type ContentOverrides = Record<string, { en: string; ar: string }>;

interface ContentContextType {
    overrides: ContentOverrides;
    isLoading: boolean;
    refreshContent: () => Promise<void>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: React.ReactNode }) {
    const [overrides, setOverrides] = useState<ContentOverrides>({});
    const [isLoading, setIsLoading] = useState(true);

    const fetchOverrides = async () => {
        try {
            const response = await fetch('/api/cms?type=site_content');
            if (response.ok) {
                const data = await response.json();
                const formatted: ContentOverrides = {};
                data.forEach((row: any) => {
                    formatted[row.key] = {
                        en: row.en_value,
                        ar: row.ar_value,
                    };
                });
                setOverrides(formatted);
            }
        } catch (error) {
            console.error('[v0] Error fetching content overrides:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOverrides();
    }, []);

    const value = useMemo(() => ({
        overrides,
        isLoading,
        refreshContent: fetchOverrides
    }), [overrides, isLoading]);

    return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
    const context = useContext(ContentContext);
    if (context === undefined) {
        throw new Error('useContent must be used within a ContentProvider');
    }
    return context;
}

export function useDynamicTranslation(language: 'en' | 'ar', staticT: (key: TranslationKey) => string) {
    const { overrides } = useContent();

    return (key: TranslationKey) => {
        const override = overrides[key];
        if (override && override[language]) {
            return override[language];
        }
        return staticT(key);
    };
}
