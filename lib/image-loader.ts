/**
 * Custom Next.js Image Loader for Cloudflare R2
 * This allows using the Next.js Image component with R2 stored images
 */

interface LoaderProps {
  src: string;
  width: number;
  quality?: number;
}

export default function r2ImageLoader({ src, width, quality = 75 }: LoaderProps): string {
  // If the src is already a full URL, return it as-is
  if (src.startsWith('http')) {
    return src;
  }

  // For R2 URLs, we can add optimization parameters if needed
  // R2 supports image optimization through URL parameters
  const params = new URLSearchParams();

  if (width) {
    params.set('width', width.toString());
  }

  if (quality) {
    params.set('quality', quality.toString());
  }

  const separator = src.includes('?') ? '&' : '?';
  const optimizedUrl = `${src}${params.toString() ? separator + params.toString() : ''}`;

  return optimizedUrl;
}
