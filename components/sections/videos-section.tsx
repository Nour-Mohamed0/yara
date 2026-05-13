'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Play, Loader2, Video, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { HomeSliceSection } from '@/components/sections/home-slice-section';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';

interface Playlist {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  video_count: number;
  section_name: string;
}

export function VideosSection() {
  const t = useTranslation();
  const reduce = useReducedMotion();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await fetch('/api/public/youtube/playlists');
        const data = await response.json();
        const list = Array.isArray(data) ? data : [];
        setPlaylists(list);
        if (list.length > 0) setSelectedPlaylist(list[0].id);
      } catch (error) {
        console.error('Failed to fetch playlists:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaylists();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: reduce ? 0 : 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }
    },
  };

  if (loading) {
    return (
      <HomeSliceSection id="videos" variant="tl-br" tone="deep">
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center animate-spin">
              <Loader2 className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground animate-pulse">Loading Library...</p>
          </div>
        </div>
      </HomeSliceSection>
    );
  }

  if (playlists.length === 0) return null;

  return (
    <HomeSliceSection id="videos" variant="tl-br" tone="deep">
      {/* --- Header --- */}
      <div className="relative mb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="glass-card mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 border-white/5 ring-1 ring-secondary/20">
            <Video className="h-3.5 w-3.5 text-secondary" />
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-secondary">{t('videosKicker')}</span>
          </div>
          <h2 className="heading-shimmer mb-4 text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
            <span className="text-foreground">{t('videosTitleA')} </span>
            <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
              {t('videosTitleB')}
            </span>
          </h2>
          <p className="text-pretty text-base text-muted-foreground/80 max-w-2xl mx-auto">{t('videosDesc')}</p>
        </motion.div>
      </div>

      {/* --- Playlist Tabs --- */}
      <motion.div
        className="mx-auto flex flex-wrap justify-center gap-3 mb-12 max-w-5xl"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {playlists.map((playlist) => (
          <motion.button
            key={playlist.id}
            variants={itemVariants}
            onClick={() => setSelectedPlaylist(playlist.id)}
            className={cn(
              "px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 glass-card border-white/5",
              selectedPlaylist === playlist.id
                ? "bg-secondary text-secondary-foreground shadow-xl shadow-secondary/20 scale-105 border-secondary/50"
                : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
            )}
          >
            {playlist.section_name}
          </motion.button>
        ))}
      </motion.div>

      {/* --- Selected Content --- */}
      <motion.div
        layout
        className="mx-auto max-w-6xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {playlists.filter(p => p.id === selectedPlaylist).map(playlist => (
          <div key={playlist.id} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center h-full">

            {/* Main Feature */}
            <div className="lg:col-span-8 group relative perspective-deep h-full">
              <Link href={`/videos/${playlist.id}`} className="block relative h-full">
                <div className="absolute -inset-4 bg-secondary/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div
                  className="relative aspect-video w-full overflow-hidden rounded-[2.5rem] border-2 border-white/10 shadow-2xl animate-gpu bg-muted"
                >
                  {playlist.thumbnail_url && (
                    <Image
                      src={playlist.thumbnail_url}
                      alt={playlist.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 800px"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-20 w-20 rounded-full bg-secondary/90 flex items-center justify-center shadow-2xl scale-90 group-hover:scale-100 transition-all duration-500 ring-4 ring-white/20">
                      <Play className="h-8 w-8 text-white fill-current" />
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="absolute top-6 right-6">
                    <div className="glass-card px-3 py-1 rounded-full border-white/10 text-[10px] font-black uppercase text-white">
                      {playlist.video_count} Modules
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Info Panel */}
            <div className="lg:col-span-4 flex flex-col justify-center gap-6">
              <div className="space-y-4">
                <h3 className="text-2xl sm:text-3xl font-black text-foreground leading-tight tracking-tight">
                  {playlist.title}
                </h3>
                <p className="text-muted-foreground/80 text-sm sm:text-base leading-relaxed">
                  {playlist.description}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Button size="lg" className="h-14 rounded-2xl bg-secondary text-secondary-foreground font-bold shadow-xl shadow-secondary/20 hover:shadow-secondary/40 hover:scale-105 transition-all group" asChild>
                  <Link href={`/videos/${playlist.id}`}>
                    {t('videosViewAll')}
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <div className="flex items-center gap-2 p-4 glass-card rounded-2xl border-white/5 italic text-xs text-muted-foreground">
                  <Sparkles className="h-4 w-4 text-secondary shrink-0" />
                  Premium video content for accelerated learning.
                </div>
              </div>
            </div>

          </div>
        ))}
      </motion.div>

    </HomeSliceSection>
  );
}
