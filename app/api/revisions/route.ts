import { NextResponse } from 'next/server';
import { INITIAL_REVISION_COMMENTS } from '@/lib/mockData';
import { RevisionComment, CommentCategory, UserRole } from '@/types';

// In-memory runtime cache for demo API calls
let runtimeComments: RevisionComment[] = [...INITIAL_REVISION_COMMENTS];

function formatTimestamp(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId');

  if (!projectId) {
    return NextResponse.json({
      success: true,
      data: runtimeComments,
    });
  }

  const filtered = runtimeComments.filter((c) => c.project_id === projectId);
  return NextResponse.json({
    success: true,
    data: filtered,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      project_id,
      video_version,
      timestamp_seconds,
      time_seconds,
      comment,
      category,
      created_by_name,
      created_by_role,
    } = body;

    const seconds = Number(
      timestamp_seconds !== undefined ? timestamp_seconds : time_seconds || 0
    );

    if (!project_id || !comment) {
      return NextResponse.json(
        { success: false, error: 'Missing required feedback fields' },
        { status: 400 }
      );
    }

    const newComment: RevisionComment = {
      id: `rev-${Date.now()}`,
      project_id,
      video_version: video_version || 'Draft v1',
      timestamp_seconds: seconds,
      formatted_time: formatTimestamp(seconds),
      comment: String(comment),
      category: (category as CommentCategory) || 'GENERAL',
      status: 'PENDING',
      created_by_name: created_by_name || 'Marcus Sterling',
      created_by_role: (created_by_role as UserRole) || 'CREATOR',
      created_at: new Date().toISOString(),
    };

    runtimeComments.push(newComment);

    return NextResponse.json({
      success: true,
      message: 'Timestamp revision created',
      data: newComment,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create revision feedback' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    const index = runtimeComments.findIndex((c) => c.id === id);
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Revision comment not found' },
        { status: 404 }
      );
    }

    runtimeComments[index] = {
      ...runtimeComments[index],
      status,
      resolved_at: status === 'RESOLVED' ? new Date().toISOString() : undefined,
    };

    return NextResponse.json({
      success: true,
      message: 'Revision status updated',
      data: runtimeComments[index],
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update revision' },
      { status: 500 }
    );
  }
}
