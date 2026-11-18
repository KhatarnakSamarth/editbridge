import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { INITIAL_PROJECTS } from '@/lib/mockData';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const dbProject = await prisma.project.findUnique({
      where: { id: params.id },
      include: {
        creator: true,
        editor: true,
        milestones: true,
        revisions: {
          include: { author: true },
          orderBy: { timeSeconds: 'asc' },
        },
        files: true,
        messages: {
          include: { sender: true },
          orderBy: { createdAt: 'asc' },
        },
        payments: true,
        review: true,
      },
    });

    if (dbProject) {
      const formatted = {
        id: dbProject.id,
        title: dbProject.title,
        brief: dbProject.briefDescription,
        category: 'YouTube Long-form',
        creator_id: dbProject.creatorId,
        creator_name: dbProject.creator.fullName,
        creator_avatar: dbProject.creator.avatarUrl,
        creator_channel: 'Sterling Capital',
        editor_id: dbProject.editorId,
        editor_name: dbProject.editor?.fullName || 'Alex Rivera',
        editor_avatar: dbProject.editor?.avatarUrl,
        editor_headline: 'High-Retention Long-form Editor',
        budget: dbProject.totalBudget,
        currency: 'USD',
        deadline: new Date(Date.now() + 6 * 86400000).toISOString().split('T')[0],
        revision_limit: dbProject.maxRounds,
        revisions_used: dbProject.currentRound,
        status: dbProject.status,
        deliverables: {
          aspect_ratio: dbProject.aspectRatio,
          target_duration_minutes: 14,
          resolution: '4K',
          captions_included: true,
          thumbnail_concept: true,
          sound_design: true,
        },
        escrow: {
          total_budget: dbProject.totalBudget,
          upfront_percentage: 30,
          upfront_amount: dbProject.totalBudget * 0.3,
          upfront_released: dbProject.milestones.some((m) => m.percentage === 30 && m.status === 'RELEASED'),
          final_percentage: 70,
          final_amount: dbProject.totalBudget * 0.7,
          final_released: dbProject.milestones.some((m) => m.percentage === 70 && m.status === 'RELEASED'),
          platform_fee_percent: 5,
        },
        active_draft_url: dbProject.activeDraftUrl || '/videos/sample-draft-v1.mp4',
        current_draft_url: dbProject.activeDraftUrl || '/videos/sample-draft-v1.mp4',
        watermark_active: dbProject.watermarkActive,
        revisions: dbProject.revisions.map((r) => ({
          id: r.id,
          project_id: r.projectId,
          round_number: r.roundNumber,
          author_id: r.authorId,
          author_name: r.author.fullName,
          author_role: r.author.role,
          author_avatar: r.author.avatarUrl,
          time_seconds: r.timeSeconds,
          time_display: `${Math.floor(r.timeSeconds / 60).toString().padStart(2, '0')}:${Math.floor(r.timeSeconds % 60).toString().padStart(2, '0')}`,
          category: r.category,
          comment: r.comment,
          status: r.status,
          created_at: r.createdAt.toISOString(),
        })),
        files: dbProject.files.map((f) => ({
          id: f.id,
          project_id: f.projectId,
          name: f.name,
          file_type: f.fileType,
          size_bytes: f.sizeBytes,
          storage_url: f.storageUrl,
          is_master_delivery: f.isMasterDelivery,
          is_locked: f.isLocked,
          uploaded_by_id: f.uploadedBy,
          uploaded_by_name: 'Team Member',
          created_at: f.createdAt.toISOString(),
        })),
        messages: dbProject.messages.map((m) => ({
          id: m.id,
          project_id: m.projectId,
          sender_id: m.senderId,
          sender_name: m.sender.fullName,
          sender_avatar: m.sender.avatarUrl,
          sender_role: m.sender.role,
          message: m.text,
          created_at: m.createdAt.toISOString(),
        })),
        created_at: dbProject.createdAt.toISOString(),
        updated_at: dbProject.updatedAt.toISOString(),
      };

      return NextResponse.json({
        success: true,
        source: 'prisma-sqlite',
        data: formatted,
      });
    }

    // Fallback to mock data
    const mockProject = INITIAL_PROJECTS.find((p) => p.id === params.id);
    if (mockProject) {
      return NextResponse.json({
        success: true,
        source: 'mock-fallback',
        data: mockProject,
      });
    }

    return NextResponse.json(
      { success: false, error: 'Project not found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Project by ID GET error:', error);
    const mock = INITIAL_PROJECTS.find((p) => p.id === params.id);
    if (mock) {
      return NextResponse.json({ success: true, source: 'mock-on-error', data: mock });
    }
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve project' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status, active_draft_url, watermark_active } = body;

    try {
      const updated = await prisma.project.update({
        where: { id: params.id },
        data: {
          ...(status ? { status } : {}),
          ...(active_draft_url !== undefined ? { activeDraftUrl: active_draft_url } : {}),
          ...(watermark_active !== undefined ? { watermarkActive: watermark_active } : {}),
        },
      });

      return NextResponse.json({
        success: true,
        source: 'prisma-sqlite',
        message: 'Project updated successfully in SQLite',
        data: updated,
      });
    } catch {
      // If not found in DB, return success acknowledgement
      return NextResponse.json({
        success: true,
        source: 'mock-updated',
        data: { id: params.id, ...body },
      });
    }
  } catch (error) {
    console.error('Project PATCH error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update project' },
      { status: 500 }
    );
  }
}
