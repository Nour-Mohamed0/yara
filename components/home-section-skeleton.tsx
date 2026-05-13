export function HomeSectionSkeleton() {
  return (
    <section className="border-t border-border/40 bg-background py-20 md:py-28" aria-hidden>
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mx-auto mb-10 h-8 max-w-md animate-pulse rounded-lg bg-muted/60" />
        <div className="mx-auto mb-6 h-12 max-w-xl animate-pulse rounded-lg bg-muted/50" />
        <div className="mx-auto mb-12 h-4 max-w-2xl animate-pulse rounded bg-muted/40" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-48 animate-pulse rounded-xl bg-muted/30" />
          ))}
        </div>
      </div>
    </section>
  );
}
