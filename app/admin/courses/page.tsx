'use client';

import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type Row = {
  id: string;
  slug: string;
  title: string;
  description: string;
  level: string | null;
  price: number | null;
  status: string | null;
};

export default function AdminCoursesPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState('Intermediate');
  const [price, setPrice] = useState('0');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/data?type=courses');
    const data = await res.json();
    setRows(Array.isArray(data) ? data : []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const add = async () => {
    if (!title.trim() || !description.trim()) {
      alert('Title and description are required.');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'course',
          data: {
            title: title.trim(),
            description: description.trim(),
            level,
            price,
          },
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error((j as { error?: string }).error || 'Save failed');
      }
      setTitle('');
      setDescription('');
      setLevel('Intermediate');
      setPrice('0');
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
        <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
        <p className="text-muted-foreground mt-2">Courses appear on the homepage and public courses API</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New course</CardTitle>
          <CardDescription>Slug is generated from the title</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 max-w-xl">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Level</Label>
              <Input value={level} onChange={(e) => setLevel(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Price</Label>
              <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
          </div>
          <Button onClick={add} disabled={saving}>
            {saving ? 'Saving…' : 'Create course'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your courses ({rows.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {rows.length === 0 ? (
            <p className="text-muted-foreground text-sm">No courses yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {rows.map((r) => (
                <li key={r.id} className="py-3 text-sm">
                  <span className="font-medium">{r.title}</span>
                  <span className="text-muted-foreground ml-2">/{r.slug}</span>
                  <p className="text-muted-foreground line-clamp-2 mt-1">{r.description}</p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
