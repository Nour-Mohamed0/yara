'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Search, Languages, Layout, MessageSquare, Info, ShieldCheck, GraduationCap, Loader2 } from 'lucide-react';
import { useContent } from '@/components/content-provider';
import { translations } from '@/lib/translations';
import { cn } from '@/lib/utils';

// Categories for translation keys
const CONTENT_CATEGORIES = [
    { id: 'hero', label: 'Hero Section', icon: Layout, keys: ['heroBadge', 'heroExploreCourses', 'heroGetInTouch', 'heroStatStudents', 'heroStatCourses', 'heroStatLessons'] },
    { id: 'stats', label: 'Stats & Numbers', icon: GraduationCap, keys: ['heroStat1Number', 'heroStat1Label', 'heroStat2Number', 'heroStat2Label', 'heroStat3Number', 'heroStat3Label'] },
    { id: 'courses', label: 'Courses', icon: Layout, keys: ['coursesKicker', 'coursesTitleA', 'coursesTitleB', 'coursesDesc', 'coursesExploreAll', 'coursesLearnMore'] },
    { id: 'videos', label: 'Videos', icon: Layout, keys: ['videosKicker', 'videosTitleA', 'videosTitleB', 'videosDesc', 'videosViewAll'] },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquare, keys: ['testimonialsKicker', 'testimonialsTitleA', 'testimonialsTitleB', 'testimonialsQuote', 'testimonialsMission'] },
    {
        id: 'about',
        label: 'About Page',
        icon: Info,
        keys: [
            'aboutHeroTitle', 'aboutHeroSub',
            'aboutWelcomeTitle', 'aboutWelcomeP1', 'aboutWelcomeP2',
            'aboutExpertiseTitle', 'aboutExpGrammar', 'aboutExpConversation', 'aboutExpWriting', 'aboutExpPronunciation', 'aboutExpToefl', 'aboutExpBusiness',
            'aboutCredentialsTitle', 'aboutEduTitle', 'aboutEdu1', 'aboutEdu2',
            'aboutExpTitle', 'aboutExp1', 'aboutExp2',
            'aboutPhilosophyTitle', 'aboutPhilosophyIntro', 'aboutPhil1', 'aboutPhil2', 'aboutPhil3', 'aboutPhil4'
        ],
    },
    { id: 'cta', label: 'CTA Section', icon: Layout, keys: ['ctaTitleA', 'ctaTitleB', 'ctaDesc', 'ctaStart', 'ctaTrustStudents', 'ctaTrustSat', 'ctaTrustSupport'] },
    { id: 'footer', label: 'Footer & Meta', icon: Info, keys: ['navBrand', 'footerTagline', 'footerLearning', 'footerCompany', 'footerContact', 'footerRights', 'privacy'] },
];

export default function ContentEditorPage() {
    const { overrides, refreshContent } = useContent();
    const [localOverrides, setLocalOverrides] = useState<Record<string, { en: string; ar: string }>>({});
    const [loading, setLoading] = useState(false);
    const [saveStatus, setSaveStatus] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        setLocalOverrides(overrides);
    }, [overrides]);

    const handleChange = (key: string, lang: 'en' | 'ar', value: string) => {
        setLocalOverrides((prev) => ({
            ...prev,
            [key]: {
                ...prev[key],
                [lang]: value
            }
        }));
    };

    const handleSave = async (key: string) => {
        setLoading(true);
        setSaveStatus(`saving-${key}`);
        try {
            const response = await fetch('/api/cms?type=site_content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'site_content',
                    data: {
                        key,
                        en_value: localOverrides[key]?.en || '',
                        ar_value: localOverrides[key]?.ar || '',
                        group_name: CONTENT_CATEGORIES.find(c => c.keys.includes(key))?.id || 'general'
                    }
                }),
            });

            if (response.ok) {
                setSaveStatus(`saved-${key}`);
                await refreshContent();
                setTimeout(() => setSaveStatus(null), 2000);
            }
        } catch (error) {
            console.error('[v0] Error saving content:', error);
            setSaveStatus('error');
        } finally {
            setLoading(false);
        }
    };

    const filteredCategories = CONTENT_CATEGORIES.filter(cat =>
        cat.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.keys.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Content Manager</h1>
                    <p className="text-muted-foreground mt-1">Manage all website text and translations dynamically</p>
                </div>
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search keys or sections..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <Tabs defaultValue="hero" className="w-full">
                <TabsList className="mb-6 flex w-full flex-wrap justify-start gap-2 bg-transparent h-auto">
                    {filteredCategories.map((cat) => (
                        <TabsTrigger
                            key={cat.id}
                            value={cat.id}
                            className="glass-card flex items-center gap-2 rounded-lg px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                        >
                            <cat.icon className="h-4 w-4" />
                            {cat.label}
                        </TabsTrigger>
                    ))}
                </TabsList>

                <div className="relative">
                    {filteredCategories.map((cat) => (
                        <TabsContent key={cat.id} value={cat.id} className="mt-0">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="grid gap-6"
                            >
                                {cat.keys.map((key) => (
                                    <Card key={key} className="glass-card overflow-hidden">
                                        <CardHeader className="pb-3 border-b border-border/10 mb-4 bg-primary/5">
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="text-xs font-bold uppercase tracking-widest text-primary/70">{key}</CardTitle>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handleSave(key)}
                                                    disabled={loading || saveStatus === `saving-${key}`}
                                                    className="h-8 gap-2"
                                                >
                                                    {saveStatus === `saving-${key}` ? <Loader2 className="h-3 w-3 animate-spin" /> : saveStatus === `saved-${key}` ? <ShieldCheck className="h-3.5 w-3.5 text-green-500" /> : <Save className="h-3.5 w-3.5" />}
                                                    <span className="text-xs font-semibold">{saveStatus === `saved-${key}` ? 'Saved' : 'Save'}</span>
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="grid gap-6 sm:grid-cols-2">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                                    <Languages className="h-3 w-3" /> English Version
                                                </div>
                                                <Textarea
                                                    value={localOverrides[key]?.en || ''}
                                                    onChange={(e) => handleChange(key, 'en', e.target.value)}
                                                    placeholder={translations.en[key as keyof typeof translations.en] || "Static text fallback..."}
                                                    className="min-h-[100px] glass-card focus:ring-primary/20"
                                                />
                                            </div>
                                            <div className="space-y-2" dir="rtl">
                                                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-right">
                                                    <Languages className="h-3 w-3" /> النسخة العربية
                                                </div>
                                                <Textarea
                                                    value={localOverrides[key]?.ar || ''}
                                                    onChange={(e) => handleChange(key, 'ar', e.target.value)}
                                                    placeholder={translations.ar[key as keyof typeof translations.ar] || "تعديل النص العربي..."}
                                                    className="min-h-[100px] glass-card text-right focus:ring-primary/20"
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </motion.div>
                        </TabsContent>
                    ))}
                </div>
            </Tabs>
        </div>
    );
}
