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
      // Map to frontend project shape
      const formatted = dbProjects.map((p) => ({
        id: p.id,
        title: p.title,
        brief: p.briefDescription,
        category: 'YouTube Long-form',
        creator_id: p.creatorId,
        creator_name: p.creator.fullName,
        creator_avatar: p.creator.avatarUrl,
        creator_channel: 'Sterling Capital',
        editor_id: p.editorId,
        editor_name: p.editor ? p.editor.fullName : 'Unassigned',
        editor_avatar: p.editor?.avatarUrl,
        editor_headline: 'Pro Video Editor',
        budget: p.totalBudget,
        currency: 'USD',
        deadline: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
        revision_limit: p.maxRounds,
        revisions_used: p.currentRound,
        status: p.status,
        deliverables: {
          aspect_ratio: p.aspectRatio,
          target_duration_minutes: 14,
          resolution: '4K',
          captions_included: true,
          thumbnail_concept: true,
          sound_design: true,
        },
        escrow: {
          total_budget: p.totalBudget,
          upfront_percentage: 30,
          upfront_amount: p.totalBudget * 0.3,
          upfront_released: p.milestones.some((m) => m.percentage === 30 && m.status === 'RELEASED'),
          final_percentage: 70,
          final_amount: p.totalBudget * 0.7,
          final_released: p.milestones.some((m) => m.percentage === 70 && m.status === 'RELEASED'),
          platform_fee_percent: 5,
        },
        active_draft_url: p.activeDraftUrl || '/videos/sample-draft-v1.mp4',
        current_draft_url: p.activeDraftUrl || '/videos/sample-draft-v1.mp4',
        watermark_active: p.watermarkActive,
        created_at: p.createdAt.toISOString(),
        updated_at: p.updatedAt.toISOString(),
      }));

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
