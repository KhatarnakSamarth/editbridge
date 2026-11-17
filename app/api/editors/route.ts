import { NextResponse } from 'next/server';
import { INITIAL_EDITORS } from '@/lib/mockData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const niche = searchParams.get('niche');

  let list = INITIAL_EDITORS;
  if (niche && niche !== 'ALL') {
    list = list.filter((e) => e.niches.includes(niche));
  }

  return NextResponse.json({
    success: true,
    data: list,
  });
}
