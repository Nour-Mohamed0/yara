import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db/client';

export async function GET(request: NextRequest) {
  try {
    const db = getDB();
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;

    const countRow = await db
      .prepare(`SELECT COUNT(*) as c FROM blog_posts WHERE status = 'published'`)
      .first<{ c: number }>();
    const total = Number(countRow?.c ?? 0);

    const result = await db
      .prepare(
        `SELECT * FROM blog_posts WHERE status = 'published' ORDER BY COALESCE(published_at, created_at) DESC LIMIT ? OFFSET ?`
      )
      .bind(limit, skip)
      .all();
    const posts = result.results || [];

    return NextResponse.json({
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.max(1, Math.ceil(total / limit)),
      },
    });
  } catch (error) {
    console.error('Blog API error:', error);
    return NextResponse.json({
      success: true,
      data: [],
      pagination: { page: 1, limit: 10, total: 0, pages: 1 },
    });
  }
}
