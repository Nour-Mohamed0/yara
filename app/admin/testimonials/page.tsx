'use client';

import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type Row = {
  id: string;
  author_name: string;
  author_role: string | null;
  content: string;
  rating: number | null;
};

export default function AdminTestimonialsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [authorName, setAuthorName] = useState('');
  const [authorRole, setAuthorRole] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState('5');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/data?type=testimonials');
    const data = await res.json();
    setRows(Array.isArray(data) ? data : []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const add = async () => {
    if (!authorName.trim() || !content.trim()) {
      alert('Name and testimonial text are required.');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'testimonial',
          data: {
            author_name: authorName.trim(),
            author_role: authorRole.trim() || null,
            content: content.trim(),
            rating: Number(rating) || 5,
          },
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error((j as { error?: string }).error || 'Save failed');
      }
      setAuthorName('');
      setAuthorRole('');
      setContent('');
      setRating('5');
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
        <h1 className="text-3xl font-bold tracking-tight">Testimonials</h1>
        <p className="text-muted-foreground mt-2">Add testimonials shown on the homepage</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add testimonial</CardTitle>
          <CardDescription>Creates a new row in the database</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 max-w-xl">
          <div className="space-y-2">
            <Label>Author name</Label>
            <Input value={authorName} onChange={(e) => setAuthorName(e.target.value)} placeholder="Student name" />
          </div>
          <div className="space-y-2">
            <Label>Role (optional)</Label>
            <Input value={authorRole} onChange={(e) => setAuthorRole(e.target.value)} placeholder="e.g. IELTS candidate" />
          </div>
          <div className="space-y-2">
            <Label>Rating (1–5)</Label>
            <Input type="number" min={1} max={5} value={rating} onChange={(e) => setRating(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Quote</Label>
            <Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={4} placeholder="Testimonial text" />
          </div>
          <Button onClick={add} disabled={saving}>
            {saving ? 'Saving…' : 'Add testimonial'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing ({rows.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {rows.length === 0 ? (
            <p className="text-muted-foreground text-sm">No testimonials yet.</p>
          ) : (
            <ul className="space-y-3">
              {rows.map((r) => (
                <li key={r.id} className="border border-border rounded-lg p-4 text-sm">
                  <p className="font-medium">{r.author_name}</p>
                  {r.author_role && <p className="text-muted-foreground">{r.author_role}</p>}
                  <p className="text-muted-foreground mt-2 line-clamp-3">{r.content}</p>
                  <p className="text-xs text-primary mt-1">Rating: {r.rating ?? 5}</p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
