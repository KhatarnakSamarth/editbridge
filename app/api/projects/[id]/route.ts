import { NextResponse } from 'next/server';
import { INITIAL_PROJECTS } from '@/lib/mockData';
import { ProjectStatus } from '@/types';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const project = INITIAL_PROJECTS.find((p) => p.id === params.id);
  if (!project) {
    return NextResponse.json(
      { success: false, error: 'Project not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: project,
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status, active_draft_url, watermark_active } = body;

    // Validate project state machine transitions from Blueprint Section 9
    const validStatuses: ProjectStatus[] = [
      'DRAFT',
      'PAYMENT_PENDING',
      'PAID',
      'EDITOR_ASSIGNED',
      'EDITING',
      'REVIEW_REQUESTED',
      'CHANGES_REQUESTED',
      'FINAL_RENDER',
      'FINAL_UPLOADED',
      'FINAL_PAYMENT_PENDING',
      'COMPLETED',
      'DISPUTED',
    ];

    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: `Invalid project status: ${status}` },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Project updated successfully',
      updated: {
        id: params.id,
        status,
        active_draft_url,
        watermark_active,
        updated_at: new Date().toISOString(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update project' },
      { status: 500 }
    );
  }
}
