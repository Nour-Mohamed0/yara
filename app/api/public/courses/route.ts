import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db/client';

export async function GET(_request: NextRequest) {
  try {
    const db = getDB();
    const result = await db
      .prepare(
        `SELECT * FROM courses WHERE status = 'active' ORDER BY COALESCE(order_index, 999999), created_at DESC`
      )
      .all();
    const rows = result.results || [];
    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error('Courses API error:', error);
    return NextResponse.json({ success: true, data: [] });
  }
}
