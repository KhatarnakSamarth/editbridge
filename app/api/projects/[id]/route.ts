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
      const ms =
        dbProject.milestones && dbProject.milestones.length > 0
          ? dbProject.milestones.map((m) => ({
              id: m.id,
              name: m.title,
              description: m.percentage === 30 ? '30% Kickoff Escrow' : '70% Final Master Release',
              percentage: m.percentage,
              amount: m.amount,
              status: m.status as 'PENDING' | 'ESCROW_FUNDED' | 'RELEASED',
              released_at: m.releasedAt?.toISOString(),
            }))
          : [
              {
                id: `ms-${dbProject.id}-1`,
                name: 'Milestone 1: 30% Upfront Kickoff',
                description: 'Upfront deposit held in escrow',
                percentage: 30,
                amount: Math.round(dbProject.totalBudget * 0.3),
                status: 'ESCROW_FUNDED' as const,
              },
              {
                id: `ms-${dbProject.id}-2`,
                name: 'Milestone 2: 70% Final Delivery Master',
                description: 'Released after approval to unlock final delivery',
                percentage: 70,
                amount: Math.round(dbProject.totalBudget * 0.7),
                status: 'PENDING' as const,
              },
            ];

      const isShorts = dbProject.aspectRatio === '9:16';
      const fallbackDraft = isShorts
        ? '/videos/sample-short-reel.mp4'
        : '/videos/sample-draft-v1.mp4';

      const formatted = {
        id: dbProject.id,
        title: dbProject.title,
        brief: dbProject.briefDescription || 'No detailed brief provided yet. Content creators can add narrative guidelines and deliverables.',
        category: (isShorts ? 'Shorts / Reels' : 'YouTube Long-form') as any,
        creator_id: dbProject.creatorId || 'user-creator-1',
        creator_name: dbProject.creator?.fullName || 'Marcus Sterling',
        creator_avatar:
          dbProject.creator?.avatarUrl ||
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        creator_channel: 'Sterling Capital',
        editor_id: dbProject.editorId,
        editor_name: dbProject.editor?.fullName || 'Alex Rivera',
        editor_avatar:
          dbProject.editor?.avatarUrl ||
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        editor_headline: 'High-Retention Long-form Editor',
        budget: dbProject.totalBudget || 500,
        currency: 'USD',
        deadline: new Date(Date.now() + 6 * 86400000).toISOString().split('T')[0],
        revision_limit: dbProject.maxRounds || 2,
        revisions_used: dbProject.currentRound || 0,
        status: dbProject.status,
        deliverables: {
          aspect_ratio: (dbProject.aspectRatio as '16:9' | '9:16') || '16:9',
          target_duration_minutes: isShorts ? 1 : 14,
          resolution: (isShorts ? '1080p (1920x1080)' : '4K (3840x2160)') as any,
          captions_included: true,
          thumbnail_concept: true,
          sound_design: true,
          color_grading: true,
        },
        references: [
          'https://youtube.com/watch?v=sample-visual-pacing',
          'https://youtube.com/watch?v=sample-vox-explainer',
        ],
        raw_footage_links: [
          'https://storage.editbridge.network/raw/marcus-cam-a-4k.mp4',
        ],
        milestones: ms,
        escrow: {
          total_budget: dbProject.totalBudget || 500,
          upfront_percentage: 30,
          upfront_amount: Math.round((dbProject.totalBudget || 500) * 0.3),
          upfront_released: ms.some((m) => m.percentage === 30 && m.status === 'RELEASED'),
          final_percentage: 70,
          final_amount: Math.round((dbProject.totalBudget || 500) * 0.7),
          final_released: ms.some((m) => m.percentage === 70 && m.status === 'RELEASED'),
          platform_fee_percent: 5,
        },
        active_draft_url: dbProject.activeDraftUrl || fallbackDraft,
        current_draft_url: dbProject.activeDraftUrl || fallbackDraft,
        final_master_url: '/videos/sample-final-master.mp4',
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
    const {
      status,
      active_draft_url,
      watermark_active,
      brief,
      title,
      aspectRatio,
      targetDuration,
    } = body;

    try {
      const updated = await prisma.project.update({
        where: { id: params.id },
        data: {
          ...(status ? { status } : {}),
          ...(active_draft_url !== undefined ? { activeDraftUrl: active_draft_url } : {}),
          ...(watermark_active !== undefined ? { watermarkActive: watermark_active } : {}),
          ...(brief !== undefined ? { briefDescription: brief } : {}),
          ...(title !== undefined ? { title } : {}),
          ...(aspectRatio !== undefined ? { aspectRatio } : {}),
          ...(targetDuration !== undefined ? { targetDuration } : {}),
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
