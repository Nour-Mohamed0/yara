import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play } from 'lucide-react';

export const metadata = {
  title: 'Videos | English Teacher Portfolio',
  description: 'Watch video lessons and tutorials on YouTube.',
};

const videos = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  title: `English Lesson ${i + 1}`,
  description: 'Watch this video lesson for English learning.',
  duration: '12:34',
}));

export default function VideosPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-card/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Video Lessons
          </h1>
          <p className="text-lg text-muted-foreground text-balance">
            Learn English through video tutorials
          </p>
        </div>
      </section>

      {/* Videos Grid */}
      <section className="py-20 md:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <Card key={video.id} className="border-border/40 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group cursor-pointer">
                  <Play className="h-16 w-16 text-primary group-hover:scale-110 transition-transform" />
                  <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </span>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{video.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{video.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
