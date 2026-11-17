import { NextResponse } from 'next/server';
import { INITIAL_PROJECTS } from '@/lib/mockData';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: INITIAL_PROJECTS,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newProject = {
      ...body,
      id: `proj-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return NextResponse.json({
      success: true,
      data: newProject,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 400 }
    );
  }
}
