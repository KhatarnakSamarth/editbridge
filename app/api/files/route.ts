import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ProjectFile } from '@/types';

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(1)} MB`;
  const gb = mb / 1024;
  return `${gb.toFixed(2)} GB`;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    const dbFiles = await prisma.projectFile.findMany({
      where: projectId ? { projectId } : undefined,
      orderBy: { createdAt: 'desc' },
    });

    const mapped = dbFiles.map((f) => ({
      id: f.id,
      project_id: f.projectId,
      uploader_id: f.uploadedBy,
      uploader_name: 'Authorized Member',
      file_name: f.name,
      storage_key: `uploads/${f.name}`,
      file_type: f.fileType as ProjectFile['file_type'],
      size_bytes: f.sizeBytes,
      formatted_size: formatBytes(f.sizeBytes),
      version: f.isMasterDelivery ? 'Master Delivery' : 'Draft Cut',
      url: f.storageUrl,
      is_locked: f.isLocked,
      is_master_delivery: f.isMasterDelivery,
      lock_reason: f.isLocked ? 'Locked until Milestone 2 (70%) is released by client.' : undefined,
      created_at: f.createdAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      source: 'prisma-postgresql',
      data: mapped,
    });
  } catch (error) {
    console.error('Files GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve project files from database' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      project_id,
      uploader_id = 'user-editor-1',
      uploader_name = 'Editor',
      file_name,
      storage_key,
      file_type = 'DRAFT_VIDEO',
      size_bytes = 0,
      formatted_size,
      version = 'Draft v2',
      url = '/videos/sample-draft-v1.mp4',
      is_locked = false,
      is_master_delivery = false,
      lock_reason,
    } = body;

    if (!project_id || !file_name) {
      return NextResponse.json(
        { success: false, error: 'project_id and file_name are required' },
        { status: 400 }
      );
    }

    // 1. Verify project exists in DB; if not, upsert a minimal stub to preserve foreign key
    const existingProject = await prisma.project.findUnique({
      where: { id: project_id },
    });

    if (!existingProject) {
      await prisma.project.create({
        data: {
          id: project_id,
          title: 'Active Project',
          briefDescription: 'Creator Project Workspace',
          aspectRatio: '16:9',
          targetDuration: '10 min',
          totalBudget: 500,
          status: 'EDITING',
          creatorId: 'user-creator-1',
          activeDraftUrl: file_type === 'DRAFT_VIDEO' ? url : '/videos/sample-draft-v1.mp4',
        },
      });
    }

    // Sanitize storageUrl for PostgreSQL:
    // Browser-generated `blob:` URLs are ephemeral and only valid within that tab's memory.
    // In guest/demo testing, persist a valid sample path in PostgreSQL so other sessions don't break,
    // while returning the client's blob URL in the JSON response for immediate local playback.
    const isBlobUrl = typeof url === 'string' && url.startsWith('blob:');
    const isVerticalProject = existingProject?.aspectRatio === '9:16';
    const fallbackDbUrl = isVerticalProject
      ? '/videos/sample-short-reel.mp4'
      : '/videos/sample-draft-v1.mp4';
    const persistentDbUrl = isBlobUrl ? fallbackDbUrl : (url || fallbackDbUrl);

    // 2. Persist File in PostgreSQL Database
    const dbFile = await prisma.projectFile.create({
      data: {
        id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        projectId: project_id,
        name: file_name,
        fileType: file_type,
        sizeBytes: Number(size_bytes) || 500000000,
        storageUrl: persistentDbUrl,
        isMasterDelivery: Boolean(is_master_delivery || file_type === 'FINAL_MASTER'),
        isLocked: Boolean(is_locked),
        uploadedBy: uploader_id,
      },
    });

    // 3. If file is DRAFT_VIDEO, automatically update Project's activeDraftUrl in database
    let updatedDraftUrl = undefined;
    if (file_type === 'DRAFT_VIDEO') {
      const updatedProject = await prisma.project.update({
        where: { id: project_id },
        data: {
          activeDraftUrl: persistentDbUrl,
          status: existingProject?.status === 'CHANGES_REQUESTED' ? 'REVIEW_REQUESTED' : undefined,
        },
      });
      // Return client URL (e.g. blob) for immediate local playback in current tab
      updatedDraftUrl = url || updatedProject.activeDraftUrl;
    }

    const formattedResponse: ProjectFile = {
      id: dbFile.id,
      project_id: dbFile.projectId,
      uploader_id: dbFile.uploadedBy,
      uploader_name: uploader_name,
      file_name: dbFile.name,
      storage_key: storage_key || `uploads/${dbFile.name}`,
      file_type: dbFile.fileType as ProjectFile['file_type'],
      size_bytes: dbFile.sizeBytes,
      formatted_size: formatted_size || formatBytes(dbFile.sizeBytes),
      version: version,
      url: url || dbFile.storageUrl, // Retain blob URL locally if available
      is_locked: dbFile.isLocked,
      is_master_delivery: dbFile.isMasterDelivery,
      lock_reason: dbFile.isLocked ? lock_reason || 'Locked until Milestone 2 is approved.' : undefined,
      created_at: dbFile.createdAt.toISOString(),
    };

    return NextResponse.json({
      success: true,
      source: 'prisma-postgresql',
      data: formattedResponse,
      activeDraftUrl: updatedDraftUrl,
      message: 'File stored in database and linked to timeline',
    });
  } catch (error) {
    console.error('Files POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save file to database' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'id required' }, { status: 400 });
    }

    await prisma.projectFile.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'File record deleted from database',
    });
  } catch (error) {
    console.error('Files DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete file from database' },
      { status: 500 }
    );
  }
}
