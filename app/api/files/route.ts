import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ProjectFile } from '@/types';
import { verifySessionToken } from '@/lib/auth';
import { deleteFromSupabaseStorage } from '@/lib/supabase';

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

    const cleanDbFiles = dbFiles.filter(
      (f) =>
        f.storageUrl &&
        !f.storageUrl.startsWith('/videos/sample-') &&
        !f.storageUrl.startsWith('blob:') &&
        !f.storageUrl.includes('sample-')
    );

    const mapped: ProjectFile[] = cleanDbFiles.map((f) => ({
      id: f.id,
      project_id: f.projectId,
      uploader_id: f.uploadedBy,
      uploader_name: 'Project Member',
      file_name: f.name,
      storage_key: `uploads/${f.name}`,
      file_type: f.fileType as ProjectFile['file_type'],
      size_bytes: f.sizeBytes,
      formatted_size: formatBytes(f.sizeBytes),
      version: f.isMasterDelivery ? 'Master Delivery' : 'Draft Cut',
      url: f.storageUrl,
      is_locked: f.isLocked,
      is_master_delivery: f.isMasterDelivery,
      lock_reason: f.isLocked
        ? 'Locked until Milestone 2 (70%) is released by client.'
        : undefined,
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
      uploader_id = 'user-creator-1',
      uploader_name = 'Creator',
      file_name,
      storage_key,
      file_type = 'DRAFT_VIDEO',
      size_bytes = 0,
      formatted_size,
      version = 'Draft v1',
      url,
      is_locked = false,
      is_master_delivery = false,
      lock_reason,
    } = body;

    if (!project_id || !file_name || !url) {
      return NextResponse.json(
        { success: false, error: 'project_id, file_name, and persistent url are required' },
        { status: 400 }
      );
    }

    // Guard: Disallow ephemeral blob URLs in PostgreSQL
    if (typeof url === 'string' && url.startsWith('blob:')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Ephemeral blob: URLs cannot be saved to the database. Upload video to Supabase Storage first.',
        },
        { status: 400 }
      );
    }

    // Verify project exists
    const existingProject = await prisma.project.findUnique({
      where: { id: project_id },
    });

    if (!existingProject) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    // Persist file record in PostgreSQL
    const dbFile = await prisma.projectFile.create({
      data: {
        id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        projectId: project_id,
        name: file_name,
        fileType: file_type,
        sizeBytes: Number(size_bytes) || 0,
        storageUrl: url,
        isMasterDelivery: Boolean(is_master_delivery || file_type === 'FINAL_MASTER'),
        isLocked: Boolean(is_locked),
        uploadedBy: uploader_id,
      },
    });

    // Always update project's activeDraftUrl on ANY video upload
    const ext = file_name.split('.').pop()?.toLowerCase() || '';
    const isVideo =
      file_type === 'DRAFT_VIDEO' ||
      file_type === 'FINAL_MASTER' ||
      file_type === 'RAW_FOOTAGE' ||
      ['mp4', 'mov', 'webm', 'mkv', 'm4v', 'avi'].includes(ext);

    let updatedDraftUrl = existingProject.activeDraftUrl;
    if (isVideo) {
      const updatedProject = await prisma.project.update({
        where: { id: project_id },
        data: {
          activeDraftUrl: url,
          status:
            existingProject.status === 'CHANGES_REQUESTED'
              ? 'REVIEW_REQUESTED'
              : existingProject.status === 'DRAFT'
              ? 'EDITING'
              : existingProject.status,
        },
      });
      updatedDraftUrl = updatedProject.activeDraftUrl || url;
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
      url: dbFile.storageUrl,
      is_locked: dbFile.isLocked,
      is_master_delivery: dbFile.isMasterDelivery,
      lock_reason: dbFile.isLocked
        ? lock_reason || 'Locked until Milestone 2 is approved.'
        : undefined,
      created_at: dbFile.createdAt.toISOString(),
    };

    return NextResponse.json({
      success: true,
      source: 'prisma-postgresql',
      data: formattedResponse,
      file: formattedResponse,
      activeDraftUrl: updatedDraftUrl,
      message: 'File record successfully saved to database and synced with timeline',
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
      return NextResponse.json(
        { success: false, error: 'file id is required' },
        { status: 400 }
      );
    }

    // 1. Session verification & RBAC check
    const cookieHeader = request.headers.get('cookie') || '';
    const sessionMatch = cookieHeader.match(/editbridge_session=([^;]+)/);
    const sessionToken = sessionMatch ? sessionMatch[1] : null;

    let authenticatedUserId: string | null = request.headers.get('x-user-id');
    let authenticatedUserRole: string | null = request.headers.get('x-user-role');

    if (!authenticatedUserId && sessionToken) {
      const payload = await verifySessionToken(sessionToken);
      if (payload) {
        authenticatedUserId = payload.userId;
        authenticatedUserRole = payload.role;
      }
    }

    // 2. Fetch File & Project
    const file = await prisma.projectFile.findUnique({
      where: { id },
      include: { project: true },
    });

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'File not found' },
        { status: 404 }
      );
    }

    // RBAC: Verify authenticated user is CREATOR of this project or ADMIN
    if (authenticatedUserRole && authenticatedUserRole !== 'ADMIN') {
      if (authenticatedUserRole !== 'CREATOR') {
        return NextResponse.json(
          { success: false, error: 'Forbidden: Only the Creator can delete project files' },
          { status: 403 }
        );
      }
      if (authenticatedUserId && file.project.creatorId !== authenticatedUserId) {
        return NextResponse.json(
          { success: false, error: 'Forbidden: You do not own this project' },
          { status: 403 }
        );
      }
    }

    // 3. Delete from Supabase Storage if it's hosted there
    if (file.storageUrl && file.storageUrl.includes('/storage/v1/object/public/')) {
      try {
        const parts = file.storageUrl.split('/project-videos/');
        if (parts.length > 1) {
          const storagePath = decodeURIComponent(parts[1]);
          await deleteFromSupabaseStorage(storagePath);
        }
      } catch (storageErr) {
        console.warn('Storage deletion warning:', storageErr);
      }
    }

    // 4. Delete ProjectFile record from PostgreSQL
    await prisma.projectFile.delete({
      where: { id },
    });

    // 5. If deleted video was project's activeDraftUrl, update to next available video or null
    let nextActiveDraftUrl: string | null = null;
    if (file.project.activeDraftUrl === file.storageUrl) {
      const nextVideo = await prisma.projectFile.findFirst({
        where: {
          projectId: file.projectId,
          fileType: { in: ['DRAFT_VIDEO', 'FINAL_MASTER'] },
          NOT: { id: file.id },
        },
        orderBy: { createdAt: 'desc' },
      });

      nextActiveDraftUrl = nextVideo ? nextVideo.storageUrl : null;

      await prisma.project.update({
        where: { id: file.projectId },
        data: { activeDraftUrl: nextActiveDraftUrl },
      });
    } else {
      nextActiveDraftUrl = file.project.activeDraftUrl;
    }

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully',
      deletedFileId: id,
      activeDraftUrl: nextActiveDraftUrl,
    });
  } catch (error) {
    console.error('Files DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete file from database' },
      { status: 500 }
    );
  }
}
