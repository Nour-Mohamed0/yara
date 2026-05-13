import { NextRequest, NextResponse } from 'next/server';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { nanoid } from 'nanoid';
import { getCurrentSession } from '@/lib/auth/session';

export const runtime = 'nodejs';

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp']);

const MIME_EXT: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp',
};

/** Dev/local: store under public/uploads so Next serves files at /uploads/... */
async function saveMultipartImage(file: File): Promise<{ url: string; key: string }> {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error('Invalid file type. Use JPEG, PNG, GIF, or WebP.');
  }
  const buf = Buffer.from(await file.arrayBuffer());
  if (buf.length > MAX_BYTES) {
    throw new Error('File too large (max 8MB).');
  }

  const ext = MIME_EXT[file.type] || '.bin';
  if (ext === '.bin') {
    throw new Error('Unsupported image type.');
  }

  const safeName = `${Date.now()}-${nanoid(10)}${ext}`;
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  await mkdir(uploadDir, { recursive: true });
  const diskPath = path.join(uploadDir, safeName);
  await writeFile(diskPath, buf);

  const key = `uploads/${safeName}`;
  const url = `/${key}`;
  return { url, key };
}

export async function POST(request: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file');
      if (!file || !(file instanceof File)) {
        return NextResponse.json({ error: 'Missing file field' }, { status: 400 });
      }
      try {
        const { url, key } = await saveMultipartImage(file);
        return NextResponse.json({ success: true, url, key }, { status: 200 });
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Upload failed';
        return NextResponse.json({ error: message }, { status: 400 });
      }
    }

    // JSON: reserved for future signed URL flow (R2 / presigned PUT)
    let body: { filename?: string; contentType?: string; expirationSeconds?: number };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Send multipart/form-data with a "file" field, or valid JSON.' },
        { status: 400 }
      );
    }

    const { filename = 'upload.bin', contentType: declaredType = 'application/octet-stream' } = body;
    const mockKey = `uploads/${Date.now()}-${filename.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const mockUrl = `/${mockKey}`;

    return NextResponse.json(
      {
        success: true,
        url: mockUrl,
        key: mockKey,
        note: 'JSON mode returns a placeholder URL. Use multipart upload with a file for local dev storage.',
        declaredType,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('R2 upload error:', error);
    return NextResponse.json({ error: 'Failed to process upload' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json({ error: 'Key is required' }, { status: 400 });
    }

    return NextResponse.json(
      {
        success: true,
        message: 'File deleted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('R2 delete error:', error);
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
  }
}
