import { Metadata } from 'next';

export interface SEOData {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  canonicalUrl?: string;
  author?: string;
  publishedDate?: string;
  updatedDate?: string;
}

export function generateMetadata(data: SEOData): Metadata {
  return {
    title: data.title,
    description: data.description,
    keywords: data.keywords?.join(', '),
    authors: data.author ? [{ name: data.author }] : undefined,
    openGraph: {
      title: data.ogTitle || data.title,
      description: data.ogDescription || data.description,
      images: data.ogImage ? [{ url: data.ogImage }] : undefined,
      type: 'website',
      url: data.canonicalUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title: data.title,
      description: data.description,
      images: data.ogImage ? [data.ogImage] : undefined,
    },
    alternates: data.canonicalUrl ? { canonical: data.canonicalUrl } : undefined,
  };
}

export function generateStructuredData(
  type: 'Article' | 'Course' | 'Organization',
  data: Record<string, any>
) {
  const baseData = {
    '@context': 'https://schema.org',
    '@type': type,
  };

  return {
    __html: JSON.stringify({ ...baseData, ...data }),
  };
}
