'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, Plus, Trash2, ArrowUpDown, Globe, Layout, Info, Share2, Loader2, CheckCircle2, ChevronRight, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

const GROUPS = [
    { id: 'navbar', label: 'Main Navigation', icon: Layout, desc: 'Links in the top navigation bar' },
    { id: 'learning', label: 'Footer: Learning', icon: Info, desc: 'Educational resource links' },
    { id: 'company', label: 'Footer: Company', icon: Info, desc: 'Business and legal links' },
    { id: 'social', label: 'Social Links', icon: Share2, desc: 'Links to your social profiles' },
];

export default function LinkManagerPage() {
    const [links, setLinks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeGroup, setActiveGroup] = useState('navbar');
    const [isSaving, setIsSaving] = useState<string | null>(null);

    const fetchLinks = async () => {
        try {
            const response = await fetch('/api/cms?type=navigation_links');
            if (response.ok) {
                const data = await response.json();
                setLinks(data);
            }
        } catch (error) {
            console.error('Error fetching links:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLinks();
    }, []);

    const handleAddLink = () => {
        const newLink = {
            id: 'new-' + Date.now(),
            group_name: activeGroup,
            label_en: '',
            label_ar: '',
            href: '',
            order_index: links.filter(l => l.group_name === activeGroup).length,
            is_active: 1
        };
        setLinks([...links, newLink]);
    };

    const handleUpdateLink = (id: string, field: string, value: any) => {
        setLinks(links.map(l => l.id === id ? { ...l, [field]: value } : l));
    };

    const handleSaveLink = async (link: any) => {
        setIsSaving(link.id);
        try {
            const response = await fetch('/api/cms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'navigation_link', data: link }),
            });
            if (response.ok) {
                await fetchLinks();
            }
        } catch (error) {
            console.error('Error saving link:', error);
        } finally {
            setIsSaving(null);
        }
    };

    const currentLinks = links
        .filter(l => l.group_name === activeGroup)
        .sort((a, b) => (a.order_index || 0) - (b.order_index || 0));

    const activeGroupInfo = GROUPS.find(g => g.id === activeGroup);

    return (
        <div className="space-y-8 pb-32">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Link Manager</h1>
                    <p className="text-muted-foreground mt-1">Design and organize your site's navigation architecture</p>
                </div>
                <Button onClick={handleAddLink} className="shadow-lg shadow-primary/20 gap-2">
                    <Plus className="h-4 w-4" /> Add Link to {activeGroupInfo?.label}
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px,1fr]">
                <div className="space-y-3">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-4 py-2">Navigation Groups</div>
                    {GROUPS.map((group) => (
                        <button
                            key={group.id}
                            onClick={() => setActiveGroup(group.id)}
                            className={cn(
                                "flex w-full flex-col text-left rounded-xl border p-4 transition-all group",
                                activeGroup === group.id
                                    ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20"
                                    : "glass-card border-border/20 text-muted-foreground hover:border-primary/40 hover:bg-muted/30 hover:text-foreground"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <group.icon className={cn("h-4 w-4 transition-transform group-hover:scale-110", activeGroup === group.id ? "text-white" : "text-primary")} />
                                <span className="font-semibold text-sm">{group.label}</span>
                                <span className={cn("ml-auto text-[10px] px-1.5 py-0.5 rounded-full", activeGroup === group.id ? "bg-white/20 text-white" : "bg-primary/10 text-primary")}>
                                    {links.filter(l => l.group_name === group.id).length}
                                </span>
                            </div>
                            <span className={cn("mt-1 text-[10px] leading-tight opacity-70", activeGroup === group.id ? "text-white/80" : "text-muted-foreground")}>
                                {group.desc}
                            </span>
                        </button>
                    ))}
                </div>

                <div className="space-y-4">
                    <AnimatePresence mode="popLayout" initial={false}>
                        {currentLinks.length === 0 ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="glass-card flex flex-col items-center justify-center rounded-2xl py-32 text-center border-2 border-dashed border-border/20"
                            >
                                <div className="h-16 w-16 rounded-full bg-primary/5 flex items-center justify-center mb-6">
                                    <Globe className="h-8 w-8 text-primary/40" />
                                </div>
                                <h3 className="text-xl font-bold">No links in this group</h3>
                                <p className="text-muted-foreground max-w-xs mt-2">Start building your navigation by adding your first link here.</p>
                                <Button onClick={handleAddLink} variant="outline" className="mt-8 gap-2 px-8">
                                    <Plus className="h-4 w-4" /> Add First Link
                                </Button>
                            </motion.div>
                        ) : (
                            <div className="space-y-4">
                                {currentLinks.map((link, index) => (
                                    <motion.div
                                        key={link.id}
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.2, delay: index * 0.05 }}
                                    >
                                        <Card className="glass-card overflow-hidden group/card border border-border/40 hover:border-primary/30 transition-all shadow-sm hover:shadow-md">
                                            <CardContent className="p-0">
                                                <div className="flex bg-muted/10 items-center justify-between px-4 py-2 border-b border-border/10">
                                                    <div className="flex items-center gap-3">
                                                        <div className="bg-primary/10 text-primary p-1.5 rounded-lg">
                                                            <ExternalLink className="h-3.5 w-3.5" />
                                                        </div>
                                                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Link Configuration</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleSaveLink(link)}
                                                            disabled={isSaving === link.id}
                                                            className="h-8 gap-2 text-primary hover:bg-primary/5"
                                                        >
                                                            {isSaving === link.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                                                            <span className="text-xs font-bold uppercase tracking-wider">Save</span>
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-muted-foreground/40 hover:text-destructive hover:bg-destructive/5"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </div>
                                                </div>

                                                <div className="p-4 sm:p-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                                                    <div className="space-y-4">
                                                        <div className="space-y-2">
                                                            <div className="flex items-center justify-between">
                                                                <Label className="text-[10px] font-bold uppercase tracking-widest text-primary/70">English Label</Label>
                                                                <Languages className="h-3 w-3 text-muted-foreground/40" />
                                                            </div>
                                                            <Input
                                                                value={link.label_en}
                                                                onChange={(e) => handleUpdateLink(link.id, 'label_en', e.target.value)}
                                                                placeholder="e.g. Home, Courses..."
                                                                className="glass-card"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <div className="flex items-center justify-between">
                                                                <Label className="text-[10px] font-bold uppercase tracking-widest text-primary/70">URL Destination</Label>
                                                                <Globe className="h-3 w-3 text-muted-foreground/40" />
                                                            </div>
                                                            <Input
                                                                value={link.href}
                                                                onChange={(e) => handleUpdateLink(link.id, 'href', e.target.value)}
                                                                placeholder="/slug or https://..."
                                                                className="glass-card font-mono text-xs"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4" dir="rtl">
                                                        <div className="space-y-2">
                                                            <div className="flex items-center justify-between px-1">
                                                                <Label className="text-[10px] font-bold uppercase tracking-widest text-primary/70">العنوان بالعربي</Label>
                                                                <Languages className="h-3 w-3 text-muted-foreground/40" />
                                                            </div>
                                                            <Input
                                                                value={link.label_ar}
                                                                onChange={(e) => handleUpdateLink(link.id, 'label_ar', e.target.value)}
                                                                placeholder="مثلاً: الرئيسية، الدورات..."
                                                                className="glass-card text-right"
                                                            />
                                                        </div>
                                                        <div className="flex items-center gap-6 pt-2 h-full">
                                                            <div className="flex items-center gap-3">
                                                                <Label className="text-[10px] font-bold uppercase tracking-widest text-primary/70 mb-0">ترتيب الظهور</Label>
                                                                <div className="flex items-center gap-1 glass-card p-1 rounded-lg">
                                                                    <input
                                                                        type="number"
                                                                        value={link.order_index}
                                                                        onChange={(e) => handleUpdateLink(link.id, 'order_index', parseInt(e.target.value))}
                                                                        className="h-6 w-10 bg-transparent text-center text-xs font-bold focus:outline-none"
                                                                    />
                                                                    <ArrowUpDown className="h-3 w-3 text-muted-foreground/40" />
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <input
                                                                    type="checkbox"
                                                                    id={`active-${link.id}`}
                                                                    checked={link.is_active === 1}
                                                                    onChange={(e) => handleUpdateLink(link.id, 'is_active', e.target.checked ? 1 : 0)}
                                                                    className="h-4 w-4 rounded border-border bg-muted/20 text-primary focus:ring-primary/20 accent-primary"
                                                                />
                                                                <Label htmlFor={`active-${link.id}`} className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">نشط</Label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

function Languages({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className={className}><path d="m5 8 6 6" /><path d="m4 14 6-6 2-3" /><path d="M2 5h12" /><path d="M7 2h1" /><path d="m22 22-5-10-5 10" /><path d="M14 18h6" /></svg>
    );
}
