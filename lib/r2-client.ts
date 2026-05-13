/**
 * R2 Storage Client
 * Handles file uploads and management with Cloudflare R2
 */

export interface R2Object {
  key: string;
  version: string;
  size: number;
  etag: string;
  httpEtag: string;
  uploaded: Date;
  httpMetadata?: {
    contentType?: string;
    cacheControl?: string;
    expires?: string;
    cacheExpiration?: Date;
    contentDisposition?: string;
    contentEncoding?: string;
  };
  customMetadata?: Record<string, string>;
  range?: { offset: number; length: number };
}

export interface R2Bucket {
  get(key: string): Promise<R2Object | null>;
  put(
    key: string,
    value: ReadableStream | ArrayBuffer | string,
    options?: { httpMetadata?: Record<string, string> }
  ): Promise<R2Object>;
  delete(key: string): Promise<void>;
  list(options?: { prefix?: string; limit?: number }): Promise<{ objects: R2Object[] }>;
  createMultipartUpload(
    key: string,
    options?: { httpMetadata?: Record<string, string> }
  ): Promise<MultipartUpload>;
}

export interface MultipartUpload {
  key: string;
  uploadId: string;
  parts(): Promise<Part[]>;
  abort(): Promise<void>;
  complete(uploadedParts: UploadedPart[]): Promise<R2Object>;
}

export interface Part {
  partNumber: number;
  size: number;
  etag: string;
}

export interface UploadedPart {
  partNumber: number;
  etag: string;
}

/**
 * Get R2 bucket instance
 */
export function getR2Bucket(): R2Bucket {
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
    return createMockR2Bucket();
  }

  if (typeof global !== 'undefined' && (global as any).R2_BUCKET) {
    return (global as any).R2_BUCKET;
  }

  throw new Error('R2 bucket not available');
}

/**
 * Mock R2 bucket for development
 */
function createMockR2Bucket(): R2Bucket {
  const storage = new Map<string, R2Object>();

  return {
    get: async (key: string) => storage.get(key) || null,
    put: async (key: string) => {
      const obj: R2Object = {
        key,
        version: '1',
        size: 0,
        etag: 'mock-etag',
        httpEtag: 'mock-http-etag',
        uploaded: new Date(),
      };
      storage.set(key, obj);
      return obj;
    },
    delete: async (key: string) => {
      storage.delete(key);
    },
    list: async () => ({
      objects: Array.from(storage.values()),
    }),
    createMultipartUpload: async (key: string) => ({
      key,
      uploadId: 'mock-upload-id',
      parts: async () => [],
      abort: async () => {},
      complete: async () => ({
        key,
        version: '1',
        size: 0,
        etag: 'mock-etag',
        httpEtag: 'mock-http-etag',
        uploaded: new Date(),
      }),
    }),
  };
}

/**
 * Generate a signed URL for direct browser uploads to R2
 */
export async function generateSignedUploadUrl(
  filename: string,
  contentType: string,
  expirationSeconds: number = 3600
): Promise<{ url: string; key: string }> {
  // In development, return mock URL
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
    return {
      url: `/api/mock-upload?filename=${filename}`,
      key: filename,
    };
  }

  // In production, generate signed URL via API
  const response = await fetch('/api/admin/r2-upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      filename,
      contentType,
      expirationSeconds,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate signed upload URL');
  }

  return response.json();
}

/**
 * Delete a file from R2
 */
export async function deleteFileFromR2(key: string): Promise<void> {
  const response = await fetch(`/api/admin/r2-upload?key=${encodeURIComponent(key)}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete file from R2');
  }
}
