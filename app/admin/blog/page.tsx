'use client';

import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type Row = { id: string; slug: string; title: string; status: string | null; excerpt: string | null };

export default function AdminBlogPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/data?type=blog');
    const data = await res.json();
    setRows(Array.isArray(data) ? data : []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const add = async () => {
    if (!title.trim() || !content.trim()) {
      alert('Title and content are required.');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'blog',
          data: {
            title: title.trim(),
            content: content.trim(),
            excerpt: excerpt.trim() || content.trim().slice(0, 200),
            status,
          },
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error((j as { error?: string }).error || 'Save failed');
      }
      setTitle('');
      setContent('');
      setExcerpt('');
      setStatus('published');
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
        <p className="text-muted-foreground mt-2">Published posts appear on /blog and the public API</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New post</CardTitle>
          <CardDescription>Slug is generated from the title</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 max-w-2xl">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Excerpt (optional)</Label>
            <Textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} />
          </div>
          <div className="space-y-2">
            <Label>Content</Label>
            <Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={8} />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <select
              className="flex h-10 w-full max-w-xs rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={status}
              onChange={(e) => setStatus(e.target.value as 'published' | 'draft')}
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          <Button onClick={add} disabled={saving}>
            {saving ? 'Saving…' : 'Create post'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Posts ({rows.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {rows.length === 0 ? (
            <p className="text-muted-foreground text-sm">No posts yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {rows.map((r) => (
                <li key={r.id} className="py-3 text-sm">
                  <span className="font-medium">{r.title}</span>
                  <span className="text-muted-foreground ml-2">{r.status}</span>
                  <p className="text-xs text-muted-foreground">/{r.slug}</p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
