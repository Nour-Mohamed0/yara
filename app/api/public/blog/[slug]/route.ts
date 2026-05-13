import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db/client';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const db = getDB();
    const post = await db
      .prepare(`SELECT * FROM blog_posts WHERE slug = ? AND status = 'published'`)
      .bind(slug)
      .first<Record<string, unknown>>();

    if (!post) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    console.error('Blog detail API error:', error);
    return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 });
  }
}
