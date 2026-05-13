'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save, Globe, Info, Loader2, CheckCircle2, Layout, Upload, ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function SEOPage() {
  const [settings, setSettings] = useState({
    site_title: '',
    site_description: '',
    contact_email: '',
    hero_title: '',
    hero_subtitle: '',
    favicon_url: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/cms?type=settings');
        if (res.ok) {
          const data = await res.json();
          setSettings({
            site_title: data.site_title || '',
            site_description: data.site_description || '',
            contact_email: data.contact_email || '',
            hero_title: data.hero_title || '',
            hero_subtitle: data.hero_subtitle || '',
            favicon_url: data.favicon_url || ''
          });
        }
      } catch (e) {
        console.error('Failed to load settings', e);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const freshFile = e.target.files?.[0];
    if (!freshFile) return;

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', freshFile);
      const res = await fetch('/api/admin/r2-upload', { method: 'POST', body: fd });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      setSettings(prev => ({ ...prev, favicon_url: data.url }));
    } catch (err) {
      console.error(err);
      alert('Error uploading icon');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch('/api/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'settings',
          data: settings
        })
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (e) {
      console.error('Save failed', e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-32">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">SEO & Global Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your site's identity and metadata for search engines</p>
        </div>
        <Button onClick={handleSave} disabled={saving || uploading} className="gap-2 shadow-lg shadow-primary/20 h-12 px-8 rounded-xl font-bold">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <CheckCircle2 className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {saving ? 'Synchronizing...' : saved ? 'Deployed!' : 'Save All Settings'}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr,380px]">
        <div className="space-y-8">
          <Card className="glass-card overflow-hidden">
            <CardHeader className="border-b border-border/10 bg-primary/5">
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Metadata (SEO)
              </CardTitle>
              <CardDescription>These values appear in browser tabs and search results</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-primary/70">Site Title</Label>
                <Input
                  value={settings.site_title}
                  onChange={(e) => setSettings({ ...settings, site_title: e.target.value })}
                  placeholder="e.g. Yara Mohamed | Professional English Teacher"
                  className="h-12 glass-card"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-primary/70">Site Description</Label>
                <Textarea
                  value={settings.site_description}
                  onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
                  placeholder="A short summary of what you do..."
                  rows={4}
                  className="glass-card resize-none"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-l-4 border-l-primary/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                Contact & Core Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-primary/70">Primary Contact Email</Label>
                <Input
                  value={settings.contact_email}
                  onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                  placeholder="contact@yaramohamed.com"
                  className="h-12 glass-card font-mono text-sm"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="glass-card border-none shadow-xl">
            <CardHeader className="bg-muted/5 border-b border-border/10">
              <CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary/70">
                <Layout className="h-4 w-4" />
                Site Icon (Favicon)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex flex-col items-center gap-6">
                <div className="relative h-24 w-24 rounded-2xl border-2 border-dashed border-border/40 bg-muted/10 flex items-center justify-center overflow-hidden hover:border-primary/40 transition-colors">
                  {uploading ? (
                    <Loader2 className="h-8 w-8 animate-spin text-primary opacity-40" />
                  ) : settings.favicon_url ? (
                    <div className="relative w-full h-full p-2">
                      <img
                        src={settings.favicon_url}
                        alt="Favicon"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <ImageIcon className="h-10 w-10 text-muted-foreground/30" />
                  )}
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept="image/x-icon,image/png,image/svg+xml"
                    onChange={handleFileUpload}
                  />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-xs font-bold text-foreground">Click to upload brand icon</p>
                  <p className="text-[10px] text-muted-foreground">Supported: ICO, PNG, SVG</p>
                </div>
              </div>

              <div className="pt-4 border-t border-border/10">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-primary/70 mb-3 block">Browser Tab Mockup</Label>
                <div className="bg-muted/30 border border-border/20 rounded-xl p-3 flex items-center gap-3">
                  <div className="h-6 w-6 rounded-md bg-white border border-border/20 flex items-center justify-center p-1">
                    {settings.favicon_url ? <img src={settings.favicon_url} className="w-full h-full object-contain" /> : <div className="w-full h-full bg-primary/20 rounded-sm" />}
                  </div>
                  <div className="text-[11px] font-medium truncate max-w-[150px]">{settings.site_title || 'New Tab'}</div>
                  <div className="ml-auto text-[10px] opacity-40">✕</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card shadow-lg">
            <CardHeader>
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-primary/70">Google Search Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-xl bg-white p-4 border border-border/20 shadow-sm">
                <div className="flex items-center gap-2 overflow-hidden mb-1">
                  <span className="text-[10px] text-zinc-500 truncate whitespace-nowrap">yaramohamed.com</span>
                  <span className="text-zinc-400 rotate-[30deg] text-[8px]">›</span>
                </div>
                <p className="text-[#1a0dab] text-lg font-medium leading-tight mb-1 hover:underline cursor-pointer line-clamp-1">{settings.site_title || 'Site Title'}</p>
                <p className="text-[#4d5156] text-[13px] leading-relaxed line-clamp-2">
                  {settings.site_description || 'Your meta description will appear here in search engine results...'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
