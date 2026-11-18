import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { INITIAL_REVISION_COMMENTS } from '@/lib/mockData';
import { RevisionComment, CommentCategory, UserRole } from '@/types';

let runtimeComments: RevisionComment[] = [...INITIAL_REVISION_COMMENTS];

function formatTimestamp(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    const dbRevisions = await prisma.revision.findMany({
      where: projectId ? { projectId } : undefined,
      include: { author: true },
      orderBy: { timeSeconds: 'asc' },
    });

    if (dbRevisions && dbRevisions.length > 0) {
      const mapped = dbRevisions.map((r) => ({
        id: r.id,
        project_id: r.projectId,
        video_version: `Round ${r.roundNumber}`,
        timestamp_seconds: r.timeSeconds,
        formatted_time: formatTimestamp(r.timeSeconds),
        comment: r.comment,
        category: (r.category as CommentCategory) || 'GENERAL',
        status: (r.status as 'PENDING' | 'IN_PROGRESS' | 'RESOLVED') || 'PENDING',
        created_by_name: r.author.fullName,
        created_by_role: (r.author.role as UserRole) || 'CREATOR',
        created_at: r.createdAt.toISOString(),
        resolved_at: r.resolvedAt?.toISOString(),
      }));

      return NextResponse.json({
        success: true,
        source: 'prisma-sqlite',
        data: mapped,
      });
    }

    const filtered = projectId
      ? runtimeComments.filter((c) => c.project_id === projectId)
      : runtimeComments;

    return NextResponse.json({
      success: true,
      source: 'runtime-fallback',
      data: filtered,
    });
  } catch (error) {
    console.error('Revisions GET error:', error);
    return NextResponse.json({
      success: true,
      source: 'memory-fallback',
      data: runtimeComments,
    });
  }
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
      author_id = 'user-creator-1',
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

    try {
      const createdInDb = await prisma.revision.create({
        data: {
          id: `rev-${Date.now()}`,
          projectId: project_id,
          roundNumber: 1,
          authorId: author_id,
          timeSeconds: seconds,
          category: category || 'GENERAL',
          comment: String(comment),
          status: 'PENDING',
        },
        include: { author: true },
      });

      const formatted = {
        id: createdInDb.id,
        project_id: createdInDb.projectId,
        video_version: video_version || 'Draft v1',
        timestamp_seconds: createdInDb.timeSeconds,
        formatted_time: formatTimestamp(createdInDb.timeSeconds),
        comment: createdInDb.comment,
        category: (createdInDb.category as CommentCategory) || 'GENERAL',
        status: createdInDb.status as 'PENDING' | 'IN_PROGRESS' | 'RESOLVED',
        created_by_name: createdInDb.author.fullName,
        created_by_role: createdInDb.author.role as UserRole,
        created_at: createdInDb.createdAt.toISOString(),
      };

      return NextResponse.json({
        success: true,
        source: 'prisma-sqlite',
        data: formatted,
      });
    } catch {
      // In-memory fallback if authorId/projectId not matched in DB
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
        source: 'memory-fallback',
        data: newComment,
      });
    }
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

    try {
      const updated = await prisma.revision.update({
        where: { id },
        data: {
          status,
          resolvedAt: status === 'RESOLVED' ? new Date() : null,
        },
      });

      return NextResponse.json({
        success: true,
        source: 'prisma-sqlite',
        data: updated,
      });
    } catch {
      const index = runtimeComments.findIndex((c) => c.id === id);
      if (index !== -1) {
        runtimeComments[index] = {
          ...runtimeComments[index],
          status,
          resolved_at: status === 'RESOLVED' ? new Date().toISOString() : undefined,
        };
        return NextResponse.json({
          success: true,
          source: 'memory-fallback',
          data: runtimeComments[index],
        });
      }

      return NextResponse.json(
        { success: false, error: 'Revision not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update revision' },
      { status: 500 }
    );
  }
}
