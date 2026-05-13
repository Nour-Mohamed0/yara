'use client';

import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Image as ImageIcon, Upload, Loader2, CheckCircle2, Maximize2, Tag, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

type Row = { id: string; title: string; r2_url: string; category: string | null; description?: string; created_at?: string };

export default function AdminGalleryPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [previewOpen, setPreviewOpen] = useState<Row | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/cms?type=gallery');
      if (res.ok) {
        const data = await res.json();
        setRows(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error('Failed to load gallery', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const add = async () => {
    if (!title.trim()) {
      alert('Title is required.');
      return;
    }
    setSaving(true);
    try {
      let r2_url = '';
      let r2_key = '';
      if (file) {
        const fd = new FormData();
        fd.append('file', file);
        const up = await fetch('/api/admin/r2-upload', { method: 'POST', body: fd });
        const upJson = await up.json().catch(() => ({}));
        if (!up.ok) throw new Error((upJson as { error?: string }).error || 'Upload failed');
        r2_url = (upJson as { url: string }).url;
        r2_key = (upJson as { key: string }).key;
      } else {
        alert('Choose an image file to upload.');
        setSaving(false);
        return;
      }

      const res = await fetch('/api/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'gallery_image',
          data: {
            title: title.trim(),
            description: description.trim() || null,
            r2_url,
            r2_key,
            category: category.trim() || null,
          },
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error((j as { error?: string }).error || 'Save failed');
      }
      setTitle('');
      setDescription('');
      setCategory('');
      setFile(null);
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this image?')) return;
    try {
      const res = await fetch('/api/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'delete_gallery_image',
          data: { id }
        }),
      });
      if (res.ok) await load();
    } catch (e) {
      console.error('Delete failed', e);
    }
  };

  return (
    <div className="space-y-8 pb-32">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gallery Manager</h1>
          <p className="text-muted-foreground mt-1">Curate and manage the visual story of your platform</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1fr,380px]">
        <div className="space-y-6">
          <Card className="glass-card overflow-hidden border-border/10">
            <CardHeader className="bg-muted/5 border-b border-border/10 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold">Image Library</CardTitle>
                  <CardDescription className="text-xs">Manage your professional catalog</CardDescription>
                </div>
                <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  {rows.length} Images
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {loading ? (
                <div className="flex h-60 items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-10 w-10 animate-spin text-primary opacity-50" />
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Indexing Library...</p>
                  </div>
                </div>
              ) : rows.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 text-center rounded-2xl border-2 border-dashed border-border/10">
                  <div className="h-20 w-20 rounded-full bg-primary/5 flex items-center justify-center mb-6">
                    <ImageIcon className="h-10 w-10 text-primary/40" />
                  </div>
                  <h3 className="font-bold text-xl">Empty Library</h3>
                  <p className="text-muted-foreground text-sm max-w-[240px] mt-2">Start by uploading high-quality photos of your lessons or events.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  <AnimatePresence initial={false}>
                    {rows.map((r, idx) => (
                      <motion.div
                        key={r.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2, delay: idx * 0.05 }}
                        className="group relative h-full overflow-hidden rounded-2xl border border-border/40 bg-card shadow-sm transition-all hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 cursor-pointer"
                        onClick={() => setPreviewOpen(r)}
                      >
                        <div className="relative aspect-square w-full overflow-hidden bg-muted/20">
                          <Image
                            src={r.r2_url}
                            alt={r.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-all duration-300 group-hover:opacity-100 flex flex-col justify-end p-4">
                            <div className="flex justify-between items-center gap-2 translate-y-4 transition-transform duration-300 group-hover:translate-y-0">
                              <Button
                                variant="secondary"
                                size="icon"
                                className="h-9 w-9 bg-white/20 backdrop-blur-md text-white border-white/30 hover:bg-white/40"
                              >
                                <Maximize2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={(e) => handleDelete(r.id, e)}
                                className="h-9 w-9 shadow-lg"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div className="p-4 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-bold text-sm line-clamp-1 flex-1">{r.title}</h4>
                            {r.category && (
                              <span className="shrink-0 bg-primary/5 text-primary text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
                                {r.category}
                              </span>
                            )}
                          </div>
                          {r.description && <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">{r.description}</p>}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="glass-card border-l-4 border-l-primary shadow-2xl sticky top-8">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl font-bold">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Upload className="h-5 w-5 text-primary" />
                </div>
                Upload Media
              </CardTitle>
              <CardDescription>Add new visuals to your portfolio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-primary/70 mb-1">
                  <ImageIcon className="h-3.5 w-3.5" />
                  <Label className="text-[10px] font-bold uppercase tracking-[0.2em]">Image Title</Label>
                </div>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Student Achievement..." className="glass-card h-11" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-primary/70 mb-1">
                  <Tag className="h-3.5 w-3.5" />
                  <Label className="text-[10px] font-bold uppercase tracking-[0.2em]">Category</Label>
                </div>
                <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Classroom, Events..." className="glass-card h-11" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-primary/70 mb-1">
                  <ImageIcon className="h-3.5 w-3.5" />
                  <Label className="text-[10px] font-bold uppercase tracking-[0.2em]">Media Description</Label>
                </div>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Briefly describe this photo..." className="glass-card resize-none" />
              </div>

              <div className="space-y-2 pt-2">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/70 block mb-2">Source File</Label>
                <div className={cn(
                  "relative group border-2 border-dashed border-border/40 rounded-2xl p-8 text-center transition-all cursor-pointer overflow-hidden",
                  file ? "border-green-500/40 bg-green-500/5" : "hover:border-primary/40 hover:bg-primary/5 shadow-inner"
                )}>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  {file ? (
                    <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="flex flex-col items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                      </div>
                      <p className="text-xs font-bold truncate max-w-[200px]">{file.name}</p>
                      <button className="text-[9px] uppercase font-bold tracking-widest text-muted-foreground hover:text-primary relative z-20">Click to Change</button>
                    </motion.div>
                  ) : (
                    <div className="flex flex-col items-center gap-3 text-muted-foreground">
                      <div className="h-12 w-12 rounded-full bg-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Upload className="h-6 w-6 text-primary/40" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold">Select Image</p>
                        <p className="text-[10px] opacity-60">High resolution JPEG or PNG</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Button onClick={add} disabled={saving} className="w-full mt-6 h-14 text-sm font-bold uppercase tracking-widest shadow-xl shadow-primary/20 rounded-xl">
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Synchronizing...
                  </>
                ) : (
                  'Deploy to Gallery'
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Lightbox / Preview */}
      <AnimatePresence>
        {previewOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 sm:p-20"
            onClick={() => setPreviewOpen(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center gap-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative w-full flex-1 rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={previewOpen.r2_url}
                  alt={previewOpen.title}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 w-full max-w-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <h3 className="text-xl font-bold text-white">{previewOpen.title}</h3>
                  <p className="text-white/60 text-sm mt-1">{previewOpen.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="secondary" onClick={() => setPreviewOpen(null)}>Close View</Button>
                  <Button variant="destructive" size="icon" onClick={(e) => { handleDelete(previewOpen.id, e); setPreviewOpen(null); }}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
