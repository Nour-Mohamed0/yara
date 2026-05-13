import { Card } from '@/components/ui/card';

export const metadata = {
  title: 'Gallery | English Teacher Portfolio',
  description: 'View photos and resources from our English teaching community.',
};

const galleryImages = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  title: `Gallery Image ${i + 1}`,
  category: ['Classroom', 'Events', 'Resources', 'Community'][i % 4],
}));

export default function GalleryPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-card/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Gallery
          </h1>
          <p className="text-lg text-muted-foreground text-balance">
            Photos and moments from our teaching community
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20 md:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((image) => (
              <Card
                key={image.id}
                className="border-border/40 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
              >
                <div className="h-64 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center overflow-hidden relative">
                  <div className="text-muted-foreground text-center group-hover:scale-110 transition-transform duration-300">
                    <div className="text-6xl mb-2">🖼️</div>
                    <p className="text-sm">{image.title}</p>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm font-medium text-foreground">{image.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{image.category}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
