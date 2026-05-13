'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { Upload, X } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    bio: '',
  });
  const [heroPreview, setHeroPreview] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [imageCleared, setImageCleared] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    setLoadError(null);
    try {
      const res = await fetch('/api/admin/profile', { credentials: 'same-origin' });
      if (res.status === 401) {
        const j = await res.json().catch(() => ({}));
        const msg =
          (j as { message?: string }).message ||
          'Your session is out of date (for example after resetting the database). Please sign in again.';
        setLoadError(msg);
        router.replace(`/login?from=${encodeURIComponent('/admin/profile')}`);
        return;
      }
      if (!res.ok) {
        setLoadError('Could not load profile');
        return;
      }
      const data = await res.json();
      setFormData({
        fullName: data.full_name ?? '',
        bio: data.bio ?? '',
      });
      const hero = data.hero_image_url || data.avatar_url || null;
      setHeroPreview(hero);
      setPendingFile(null);
      setImageCleared(false);
    } catch {
      setLoadError('Could not load profile');
    }
  }, [router]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingFile(file);
    setImageCleared(false);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setHeroPreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setPendingFile(null);
    setHeroPreview(null);
    setImageCleared(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      let heroUrl: string | null | undefined = undefined;

      if (pendingFile) {
        const formDataToSend = new FormData();
        formDataToSend.append('file', pendingFile);
        const uploadResponse = await fetch('/api/admin/r2-upload', {
          method: 'POST',
          body: formDataToSend,
        });
        const uploadResult = await uploadResponse.json().catch(() => ({}));
        if (!uploadResponse.ok) {
          throw new Error((uploadResult as { error?: string }).error || 'Failed to upload image');
        }
        const url = (uploadResult as { url?: string }).url;
        if (!url) throw new Error('Upload response missing url');
        heroUrl = url;
      } else if (imageCleared) {
        heroUrl = null;
      }

      const patch: Record<string, unknown> = {
        fullName: formData.fullName,
        bio: formData.bio,
      };
      if (heroUrl !== undefined) {
        patch.heroImageUrl = heroUrl;
      }

      const saveRes = await fetch('/api/admin/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
        credentials: 'same-origin',
      });
      const saveJson = await saveRes.json().catch(() => ({}));
      if (saveRes.status === 401) {
        const msg =
          (saveJson as { message?: string }).message ||
          'Session expired. Please sign in again.';
        router.replace(`/login?from=${encodeURIComponent('/admin/profile')}`);
        throw new Error(msg);
      }
      if (!saveRes.ok) {
        const msg =
          (saveJson as { message?: string }).message ||
          (saveJson as { error?: string }).error ||
          'Failed to save profile';
        throw new Error(msg);
      }

      await loadProfile();
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert(error instanceof Error ? error.message : 'Error saving profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your public profile information and hero image (homepage uses site settings hero image).
        </p>
        {loadError && <p className="text-sm text-destructive mt-2">{loadError}</p>}
      </div>

      <Card className="glass-effect neon-glow-cyan">
        <CardHeader>
          <CardTitle>Hero Image</CardTitle>
          <CardDescription>Upload your profile image for the homepage hero section</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {heroPreview ? (
              <div className="relative w-full h-96 rounded-lg overflow-hidden">
                <Image
                  src={heroPreview}
                  alt="Hero preview"
                  fill
                  className="object-cover"
                  unoptimized={heroPreview.startsWith('data:')}
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-2 bg-destructive rounded-full text-destructive-foreground hover:bg-destructive/90"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-64 rounded-lg border-2 border-dashed border-border hover:border-primary cursor-pointer glass-effect transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-10 h-10 text-primary mb-2" />
                  <p className="mb-2 text-sm font-medium text-foreground">Click to upload hero image</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG, GIF or WebP (max 8MB)</p>
                </div>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="glass-effect">
        <CardHeader>
          <CardTitle>Teacher Profile</CardTitle>
          <CardDescription>Update your profile information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              name="fullName"
              placeholder="Your full name"
              value={formData.fullName}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              placeholder="Tell us about yourself and your teaching experience..."
              value={formData.bio}
              onChange={handleInputChange}
              rows={4}
            />
          </div>

          <Button onClick={handleSave} disabled={loading} className="w-full bg-primary hover:bg-primary/90">
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
