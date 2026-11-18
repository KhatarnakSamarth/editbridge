import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { INITIAL_PROJECTS } from '@/lib/mockData';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const userId = searchParams.get('userId');

    // Query live SQLite database
    const dbProjects = await prisma.project.findMany({
      where: {
        ...(role === 'CREATOR' && userId ? { creatorId: userId } : {}),
        ...(role === 'EDITOR' && userId ? { editorId: userId } : {}),
      },
      include: {
        creator: true,
        editor: true,
        milestones: true,
        revisions: true,
        files: true,
        payments: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    if (dbProjects && dbProjects.length > 0) {
      // Map to frontend project shape with full safeguards
      const formatted = dbProjects.map((p) => {
        const ms =
          p.milestones && p.milestones.length > 0
            ? p.milestones.map((m) => ({
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
                  id: `ms-${p.id}-1`,
                  name: 'Milestone 1: 30% Upfront Kickoff',
                  description: 'Upfront deposit held in escrow',
                  percentage: 30,
                  amount: Math.round(p.totalBudget * 0.3),
                  status: 'ESCROW_FUNDED' as const,
                },
                {
                  id: `ms-${p.id}-2`,
                  name: 'Milestone 2: 70% Final Delivery Master',
                  description: 'Released after approval to unlock final delivery',
                  percentage: 70,
                  amount: Math.round(p.totalBudget * 0.7),
                  status: 'PENDING' as const,
                },
              ];

        const isShorts = p.aspectRatio === '9:16';
        const fallbackDraft = isShorts
          ? '/videos/sample-short-reel.mp4'
          : '/videos/sample-draft-v1.mp4';

        return {
          id: p.id,
          title: p.title,
          brief: p.briefDescription || 'No detailed brief provided yet. Content creators can add narrative guidelines and deliverables.',
          category: (isShorts ? 'Shorts / Reels' : 'YouTube Long-form') as any,
          creator_id: p.creatorId || 'user-creator-1',
          creator_name: p.creator?.fullName || 'Marcus Sterling',
          creator_avatar:
            p.creator?.avatarUrl ||
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          creator_channel: 'Sterling Capital',
          editor_id: p.editorId,
          editor_name: p.editor ? p.editor.fullName : 'Alex Rivera',
          editor_avatar:
            p.editor?.avatarUrl ||
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          editor_headline: 'Pro Video Editor',
          budget: p.totalBudget || 500,
          currency: 'USD',
          deadline: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
          revision_limit: p.maxRounds || 2,
          revisions_used: p.currentRound || 0,
          status: p.status,
          deliverables: {
            aspect_ratio: (p.aspectRatio as '16:9' | '9:16') || '16:9',
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
            total_budget: p.totalBudget || 500,
            upfront_percentage: 30,
            upfront_amount: Math.round((p.totalBudget || 500) * 0.3),
            upfront_released: ms.some((m) => m.percentage === 30 && m.status === 'RELEASED'),
            final_percentage: 70,
            final_amount: Math.round((p.totalBudget || 500) * 0.7),
            final_released: ms.some((m) => m.percentage === 70 && m.status === 'RELEASED'),
            platform_fee_percent: 5,
          },
          active_draft_url: p.activeDraftUrl || fallbackDraft,
          current_draft_url: p.activeDraftUrl || fallbackDraft,
          final_master_url: '/videos/sample-final-master.mp4',
          watermark_active: p.watermarkActive,
          created_at: p.createdAt.toISOString(),
          updated_at: p.updatedAt.toISOString(),
        };
      });

      return NextResponse.json({
        success: true,
        source: 'prisma-sqlite',
        data: formatted,
      });
    }

    // Fallback if DB empty
    return NextResponse.json({
      success: true,
      source: 'mock-fallback',
      data: INITIAL_PROJECTS,
    });
  } catch (error) {
    console.error('Projects GET error:', error);
    return NextResponse.json({
      success: true,
      source: 'mock-fallback-on-error',
      data: INITIAL_PROJECTS,
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      brief,
      category,
      budget,
      aspect_ratio = '16:9',
      target_duration = '10-15 min',
      creator_id = 'user-creator-1',
      editor_id = 'user-editor-1',
    } = body;

    const newProject = await prisma.project.create({
      data: {
        title: title || 'Untitled Project',
        briefDescription: brief || 'No brief provided',
        aspectRatio: aspect_ratio,
        targetDuration: target_duration,
        totalBudget: Number(budget) || 500,
        creatorId: creator_id,
        editorId: editor_id,
        status: 'PAID',
        watermarkActive: true,
        milestones: {
          create: [
            {
              title: 'Milestone 1: 30% Upfront Brief & Rough Cut',
              percentage: 30,
              amount: (Number(budget) || 500) * 0.3,
              status: 'RELEASED',
              releasedAt: new Date(),
            },
            {
              title: 'Milestone 2: 70% Final Master & Delivery',
              percentage: 70,
              amount: (Number(budget) || 500) * 0.7,
              status: 'FUNDED',
            },
          ],
        },
      },
      include: {
        creator: true,
        editor: true,
        milestones: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: newProject,
    });
  } catch (error) {
    console.error('Failed to create project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create project in database' },
      { status: 500 }
    );
  }
}
