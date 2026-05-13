'use client';

import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type Row = {
  id: string;
  playlist_id: string;
  title: string;
  section_name: string;
  video_count: number | null;
};

export default function AdminYoutubePage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [playlistId, setPlaylistId] = useState('');
  const [title, setTitle] = useState('');
  const [sectionName, setSectionName] = useState('Videos');
  const [description, setDescription] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [videoCount, setVideoCount] = useState('0');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/data?type=youtube');
    const data = await res.json();
    setRows(Array.isArray(data) ? data : []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const add = async () => {
    if (!playlistId.trim() || !title.trim()) {
      alert('YouTube playlist ID and title are required.');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'youtube_playlist',
          data: {
            playlist_id: playlistId.trim(),
            title: title.trim(),
            section_name: sectionName.trim() || 'Videos',
            description: description.trim() || null,
            thumbnail_url: thumbnailUrl.trim() || null,
            video_count: Number(videoCount) || 0,
          },
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error((j as { error?: string }).error || 'Save failed');
      }
      setPlaylistId('');
      setTitle('');
      setSectionName('Videos');
      setDescription('');
      setThumbnailUrl('');
      setVideoCount('0');
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
        <h1 className="text-3xl font-bold tracking-tight">YouTube playlists</h1>
        <p className="text-muted-foreground mt-2">Playlists appear in the homepage video section</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add playlist</CardTitle>
          <CardDescription>Use the YouTube playlist ID (from the URL)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 max-w-xl">
          <div className="space-y-2">
            <Label>Playlist ID</Label>
            <Input value={playlistId} onChange={(e) => setPlaylistId(e.target.value)} placeholder="PLxxxxxxxx" />
          </div>
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Tab label (section)</Label>
            <Input value={sectionName} onChange={(e) => setSectionName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Thumbnail URL (optional)</Label>
            <Input value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} placeholder="https://..." />
          </div>
          <div className="space-y-2">
            <Label>Description (optional)</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
          </div>
          <div className="space-y-2">
            <Label>Video count</Label>
            <Input type="number" min={0} value={videoCount} onChange={(e) => setVideoCount(e.target.value)} />
          </div>
          <Button onClick={add} disabled={saving}>
            {saving ? 'Saving…' : 'Add playlist'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Playlists ({rows.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {rows.length === 0 ? (
            <p className="text-muted-foreground text-sm">No playlists yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {rows.map((r) => (
                <li key={r.id} className="py-3 text-sm">
                  <span className="font-medium">{r.title}</span>
                  <p className="text-xs text-muted-foreground">ID: {r.playlist_id}</p>
                  <p className="text-xs text-primary">{r.section_name}</p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
